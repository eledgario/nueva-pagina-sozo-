'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingChat from '@/components/FloatingChat';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname?.startsWith('/admin') || pathname?.startsWith('/catalogo');

  return (
    <>
      {!isStandalone && <Navbar />}
      {children}
      {!isStandalone && <FloatingChat />}
    </>
  );
}
