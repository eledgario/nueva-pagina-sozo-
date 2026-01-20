'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingChat from '@/components/FloatingChat';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <FloatingChat />}
    </>
  );
}
