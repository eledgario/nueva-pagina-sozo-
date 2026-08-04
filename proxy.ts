import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { updateSession } from '@/lib/supabase/middleware';

const COOKIE_NAME = 'sozo_admin_session';
const ADMIN_LOGIN = '/admin/login';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas /admin/* — protegidas con JWT propio
  if (pathname.startsWith('/admin')) {
    if (pathname === ADMIN_LOGIN) return NextResponse.next();

    const token  = request.cookies.get(COOKIE_NAME)?.value;
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback-dev-secret'
    );

    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.next();
      } catch {
        // token expirado o inválido
      }
    }

    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN;
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Resto — Supabase maneja sesión de clientes
  return updateSession(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
