import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function resolveBackendOrigin() {
  const configuredUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:8686';

  return configuredUrl
    .replace(/\/api\/v1\/?$/i, '')
    .replace(/\/+$/g, '');
}

const BACKEND_ORIGIN = resolveBackendOrigin();

function sanitizeSetCookie(raw: string, isFrontendHttps: boolean) {
  let sanitized = raw
    .replace(/Domain=[^;]+;?\s*/gi, '')
    .replace(/SameSite=None/gi, 'SameSite=Lax');

  // Rewrite cookie path để browser gửi cookie đúng qua proxy route.
  // Backend set Path=/api/v1/auth → browser gửi request tới /api/proxy/api/v1/auth
  // Nếu không rewrite, browser sẽ KHÔNG gửi cookie (path mismatch) → 401.
  sanitized = sanitized.replace(
    /Path=\/api\/v1/gi,
    'Path=/api/proxy/api/v1'
  );

  // Nếu frontend đang chạy HTTP (ví dụ localhost), cookie có `Secure`
  // sẽ không được browser lưu. Ta bỏ `Secure` ở phía proxy để dev hoạt động.
  if (!isFrontendHttps) {
    sanitized = sanitized.replace(/;\s*Secure/gi, '');
  }

  return sanitized;
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathStr = path.join('/');
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_ORIGIN}/${pathStr}${url.search}`;

    console.log('[Proxy] →', request.method, backendUrl);

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const isFrontendHttps = request.nextUrl.protocol === 'https:';

    const forwardedHeaders = new Headers();
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'host' || lowerKey === 'content-length' || lowerKey === 'connection') {
        return;
      }
      forwardedHeaders.set(key, value);
    });

    if (!forwardedHeaders.has('Content-Type') && request.headers.get('content-type')) {
      forwardedHeaders.set('Content-Type', request.headers.get('content-type') as string);
    }

    if (cookieHeader) {
      forwardedHeaders.set('Cookie', cookieHeader);
    }

    // Ngrok có thể trả "browser warning page" nếu thiếu header này
    if (!forwardedHeaders.has('ngrok-skip-browser-warning')) {
      forwardedHeaders.set('ngrok-skip-browser-warning', 'true');
    }

    // Prepare body for non-GET/HEAD methods
    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.clone().arrayBuffer();
      } catch (e) {
        console.error('[Proxy] Body read error:', e);
      }
    }

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: forwardedHeaders,
      body,
      redirect: 'manual', // ← QUAN TRỌNG: bắt redirect thay vì follow
      cache: 'no-store',
    });

    console.log('[Proxy] ← status:', backendResponse.status);

    // ── Xử lý redirect từ backend (Google OAuth callback) ──────────────────
    // Backend redirect về frontendUrl+"/" kèm Set-Cookie
    // Status 301/302/303/307/308 đều xử lý ở đây
    if (backendResponse.status >= 300 && backendResponse.status < 400) {
      const location = backendResponse.headers.get('location') || '/';

      // Đổi domain backend → domain frontend trong redirect URL
      const redirectTarget = location
        .replace(BACKEND_ORIGIN, '')        // bỏ backend URL nếu có
        || '/';

      const response = NextResponse.redirect(
        new URL(redirectTarget, request.url)
      );

      // Rewrite Set-Cookie từ :8686 → :3000
      const setCookies = backendResponse.headers.getSetCookie?.() ?? [];
      setCookies.forEach((cookie) => {
        const sanitized = sanitizeSetCookie(cookie, isFrontendHttps);
        response.headers.append('Set-Cookie', sanitized);
      });

      return response;
    }

    // ── Response thường ────────────────────────────────────────────────────
    const status = backendResponse.status;
    const isNoBodyStatus = status === 204 || status === 205 || status === 304;

    const responseBody = isNoBodyStatus ? null : await backendResponse.arrayBuffer();

    const responseHeaders: Record<string, string> = {};
    const contentType = backendResponse.headers.get('content-type');
    if (contentType && !isNoBodyStatus) {
      responseHeaders['Content-Type'] = contentType;
    }

    const response = new NextResponse(responseBody, {
      status,
      headers: responseHeaders,
    });

    const setCookies = backendResponse.headers.getSetCookie?.() ?? [];
    setCookies.forEach((cookie) => {
      const sanitized = sanitizeSetCookie(cookie, isFrontendHttps);
      response.headers.append('Set-Cookie', sanitized);
    });

    return response;
  } catch (err) {
    console.error('[Proxy] ERROR:', err);
    return NextResponse.json(
      { error: 'Proxy error', detail: String(err) },
      { status: 500 }
    );
  }
}

export const GET    = handler;
export const POST   = handler;
export const PUT    = handler;
export const PATCH  = handler;
export const DELETE = handler;
