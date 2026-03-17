// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isSlugLike = (value: string) => /^[a-z0-9-]+$/i.test(value);

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ─── Legacy search URL redirect ──────────────────────────────────────────
  if (pathname === '/tim-kiem') {
    const category    = searchParams.get('category')    ?? undefined;
    const subcategory = searchParams.get('subcategory') ?? undefined;
    const school      = searchParams.get('school')      ?? undefined;
    const campus      = searchParams.get('campus')      ?? undefined;

    if (category || subcategory || school || campus) {
      const itemSlug = subcategory || category;
      const parts = [itemSlug, school, campus].filter(Boolean) as string[];

      if (parts.length > 0 && parts.every(isSlugLike)) {
        const redirectUrl = new URL(request.url);
        redirectUrl.pathname = `/tim-kiem/${parts.join('-')}`;
        redirectUrl.searchParams.delete('category');
        redirectUrl.searchParams.delete('subcategory');
        redirectUrl.searchParams.delete('school');
        redirectUrl.searchParams.delete('campus');
        return NextResponse.redirect(redirectUrl, 308);
      }
    }
  }

  // ─── Private route protection ─────────────────────────────────────────────
  const privateRoutes = [
    '/quan-ly-tin-dang', '/dang-tin', '/chinh-sua-tin',
    '/tai-khoan', '/tin-nhan', '/thong-bao',
    '/tin-da-luu', '/doi-mat-khau', '/admin',
  ];

  const isPrivateRoute = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivateRoute) {
    const accessToken = request.cookies.get('accessToken');
    // Cookie giờ đã được set đúng domain (:3000) thông qua proxy
    // nên middleware đọc được bình thường

    if (!accessToken) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('require_login', 'true');
      loginUrl.searchParams.set('redirect_to', encodeURIComponent(pathname));
      return NextResponse.redirect(loginUrl, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
};