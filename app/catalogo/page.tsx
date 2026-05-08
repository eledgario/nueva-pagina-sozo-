import type { Metadata } from 'next';
import { Suspense } from 'react';
import CatalogoContent from './CatalogoContent';

export const metadata: Metadata = {
  title: 'SOZO | Catálogo de Productos Corporativos',
  description: 'Catálogo digital de productos corporativos y kits de merch. Más de 111 productos personalizables con serigrafía, grabado láser, sublimación y más.',
  robots: { index: false, follow: false },
};

export default function CatalogoPage() {
  return (
    <Suspense>
      <CatalogoContent />
    </Suspense>
  );
}
