import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8686';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathStr = path.join('/');
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}/${pathStr}${url.search}`;

    console.log('[Proxy] →', request.method, backendUrl);

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

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

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: forwardedHeaders,
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? await request.arrayBuffer()
          : undefined,
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
        .replace(BACKEND_URL, '')           // bỏ backend URL nếu có
        || '/';

      const response = NextResponse.redirect(
        new URL(redirectTarget, request.url)
      );

      // Rewrite Set-Cookie từ :8686 → :3000
      const setCookies = backendResponse.headers.getSetCookie?.() ?? [];
      setCookies.forEach((cookie) => {
        const sanitized = cookie
          .replace(/Domain=[^;]+;?\s*/gi, '')
          .replace(/SameSite=None/gi, 'SameSite=Lax');
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
      const sanitized = cookie
        .replace(/Domain=[^;]+;?\s*/gi, '')
        .replace(/SameSite=None/gi, 'SameSite=Lax');
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