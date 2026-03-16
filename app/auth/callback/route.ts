// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const oauthError = request.nextUrl.searchParams.get('error');

  if (oauthError) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(oauthError)}`, request.url));
  }

  return NextResponse.redirect(new URL('/', request.url));
}
