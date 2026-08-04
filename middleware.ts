import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'sozo_admin_session';
const LOGIN_PATH  = '/admin/login';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo protege /admin/* (no /admin/login)
  if (!pathname.startsWith('/admin') || pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token  = req.cookies.get(COOKIE_NAME)?.value;
  const secret = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback-dev-secret'
  );

  if (token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      // token inválido o expirado — redirige al login
    }
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
