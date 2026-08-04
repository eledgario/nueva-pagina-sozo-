import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { updateSession } from '@/lib/supabase/middleware';

const COOKIE_NAME = 'sozo_admin_session';
const ADMIN_LOGIN = '/admin/login';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Rutas /admin/* — protegidas con JWT propio ──────────────────────────────
  if (pathname.startsWith('/admin')) {
    // La página de login de admin siempre pasa
    if (pathname === ADMIN_LOGIN) return NextResponse.next();

    const token  = req.cookies.get(COOKIE_NAME)?.value;
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? 'fallback-dev-secret'
    );

    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.next(); // autenticado, deja pasar
      } catch {
        // token expirado o inválido
      }
    }

    // Sin sesión válida → redirige al login de admin (NO al de clientes)
    const url = req.nextUrl.clone();
    url.pathname = ADMIN_LOGIN;
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // ── Resto de rutas — Supabase maneja sesión de clientes ─────────────────────
  return updateSession(req);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
