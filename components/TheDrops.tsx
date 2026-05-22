'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import TiltCard from './TiltCard';

interface Product {
  id: string;
  title: string;
  description: string;
  techTag: string;
  imageUrl: string;
  href: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: 'kit-ejecutivo',
    title: 'Kit Ejecutivo',
    description: 'Libreta de piel, bolígrafo roller y termo de doble pared. La combinación favorita para bienvenidas y regalos corporativos.',
    techTag: 'Grabado Láser · Serigrafía',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778017030936x247009838287304700/ST-058_02.jpg',
    href: '/catalogo?cat=kits',
    featured: true,
  },
  {
    id: 'termo-premium',
    title: 'Termo de Doble Pared',
    description: 'Acero inoxidable. Logo grabado con láser que no se borra. El clásico que nunca falla.',
    techTag: 'Grabado Láser',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775603640543x759288295926205400/TE-267_02.jpg',
    href: '/catalogo?cat=bebidas',
  },
  {
    id: 'mochila-urban',
    title: 'Mochila Urban',
    description: 'Poliéster técnico plegable. Logotipo bordado o serigrafía. Caben laptop y accesorios.',
    techTag: 'Serigrafía · Bordado',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778081018710x500232710744867400/TX-409_02.jpg',
    href: '/catalogo?cat=mochilas',
  },
  {
    id: 'bocina-bt',
    title: 'Bocina Bluetooth',
    description: 'Sonido premium, batería de larga duración. Impresión DTF UV directa sobre la carcasa.',
    techTag: 'DTF UV',
    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773073056788x656601407991168600/TH-272_02.jpg',
    href: '/catalogo?cat=tecnologia',
  },
];

export default function TheDrops() {
  return (
    <section className="py-32 px-6 bg-zinc-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [SELECCIÓN_CURADA]
          </span>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-zinc-900 tracking-tight">
            LOS ESENCIALES
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            Los productos más solicitados por nuestros clientes.{' '}
            <span className="text-zinc-900 font-bold">Todos personalizables</span> con tu marca.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="space-y-6">
          {/* Featured Product - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <TiltCard className="w-full">
              <Link href={products[0].href}>
                <div className="group relative h-[500px] rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-[#FF007F]/50 transition-all duration-500 shadow-xl shadow-zinc-200/50 cursor-pointer">
                  <div className="absolute inset-0 bg-[#F4F4F5]" />
                  <Image
                    src={products[0].imageUrl}
                    alt={products[0].title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500" />

                  <div className="absolute top-6 right-6 z-20">
                    <div className="px-4 py-2 bg-white border-2 border-[#FF007F] rounded-full shadow-md">
                      <span className="text-xs font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                        {products[0].techTag}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-6 left-6 z-20">
                    <div className="px-4 py-2 bg-[#FF007F] border-2 border-white rounded-full shadow-lg">
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Más solicitado
                      </span>
                    </div>
                  </div>

                  <div className="absolute left-0 top-0 bottom-0 z-10 p-8 md:p-12 flex items-center">
                    <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-lg shadow-lg">
                      <h3 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900">
                        {products[0].title}
                      </h3>
                      <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-6">
                        {products[0].description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#FF007F] font-bold text-sm uppercase">
                        <span>Ver en catálogo</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </motion.div>

          {/* Other Products - 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(1).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              >
                <TiltCard className="h-full">
                  <Link href={product.href}>
                    <div className="group relative h-[450px] rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-[#FF007F]/50 transition-all duration-500 shadow-xl shadow-zinc-200/50 cursor-pointer">
                      <div className="absolute inset-0 bg-[#F4F4F5]" />
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500" />

                      <div className="absolute top-4 right-4 z-20">
                        <div className="px-4 py-2 bg-white border-2 border-[#FF007F] rounded-full shadow-md">
                          <span className="text-xs font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                            {product.techTag}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                          <h3 className="text-2xl md:text-3xl font-black mb-2 text-zinc-900">
                            {product.title}
                          </h3>
                          <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                            {product.description}
                          </p>
                          <span className="inline-flex items-center gap-2 text-[#FF007F] font-bold text-sm uppercase">
                            <span>Ver en catálogo</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-500 font-mono text-sm mb-4">
            +6,700 productos disponibles para personalizar
          </p>
          <Link
            href="/catalogo"
            className="inline-block px-8 py-4 bg-white border-2 border-zinc-200 hover:border-[#FF007F] rounded-2xl font-bold text-zinc-900 hover:text-[#FF007F] transition-all shadow-md"
          >
            Explorar Catálogo Completo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
