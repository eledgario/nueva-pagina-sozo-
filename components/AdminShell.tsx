'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Tag, Calculator, Package } from 'lucide-react';

const NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/precios',   label: 'Precios',     icon: Tag },
  { href: '/admin/cotizador', label: 'Cotizador',   icon: Calculator },
  { href: '/admin/inventory', label: 'Inventario',  icon: Package },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  // La página de login no necesita shell
  if (pathname === '/admin/login') return <>{children}</>;

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Top nav bar */}
      <nav className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="flex items-center gap-1 px-4 h-12">

          {/* Brand */}
          <Link href="/admin" className="font-black text-sm tracking-tight text-white mr-4 flex-shrink-0">
            SOZO <span className="text-[#FF007F]">ADMIN</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap
                    ${active
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 transition-colors flex-shrink-0 ml-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Salir
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
