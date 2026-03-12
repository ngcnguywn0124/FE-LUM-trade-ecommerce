import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware để bảo vệ các trang yêu cầu đăng nhập
 * Note: accessToken là httpOnly cookie được backend đặt
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Danh sách các đường dẫn cần bảo vệ (private routes)
  const privateRoutes = [
    '/quan-ly-tin-dang',
    '/dang-tin',
    '/chinh-sua-tin',
    '/tai-khoan',
    '/tin-nhan',
    '/thong-bao',
    '/tin-da-luu',
    '/doi-mat-khau',
    '/admin',
  ];

  // Kiểm tra xem pathname có bắt đầu bằng một trong các privateRoutes không
  const isPrivateRoute = privateRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivateRoute) {
    // Kiểm tra cookie accessToken (tên cookie tùy thuộc vào backend đặt, thông thường là accessToken)
    // Nếu không có cookie, chuyển hướng về trang chủ và mở modal đăng nhập qua query param
    const accessToken = request.cookies.get('accessToken');

    if (!accessToken) {
      // Chuyển hướng về trang chủ với query param để kích hoạt login modal hoặc thông báo
      const url = new URL('/', request.url);
      url.searchParams.set('require_login', 'true');
      url.searchParams.set('redirect_to', pathname);
      
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Cấu hình các path mà middleware sẽ chạy qua
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
