'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import TiltCard from './TiltCard';

interface Product {
  id: string;
  title: string;
  description: string;
  techTag: string;
  imageUrl: string;
  featured?: boolean;
}

const products: Product[] = [
  {
    id: 'starter-kit',
    title: 'The Starter Kit',
    description: 'La experiencia completa de unboxing. Incluye Hoodie, Termo y Accesorio Tech.',
    techTag: 'Hybrid Production',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'founder-hoodie',
    title: 'The Founder Hoodie',
    description: 'Algodón 240g. Corte Boxy. Durabilidad industrial con estilo streetwear.',
    techTag: 'Screen Printed',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'stealth-tumbler',
    title: 'Stealth Tumbler',
    description: 'Acero inoxidable negro mate. Grabado permanente que no se borra.',
    techTag: 'Precision Laser',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2087&auto=format&fit=crop',
  },
  {
    id: 'monolith-stand',
    title: 'Monolith Stand',
    description: 'Diseño paramétrico para tu setup. Soporte de celular con branding en relieve.',
    techTag: '3D Printed',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
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
            [CATÁLOGO_CURADO]
          </span>
          <h2 className="text-6xl md:text-7xl font-black mb-4 text-zinc-900 tracking-tight">
            LOS ESENCIALES
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            Hardware y textiles curados. <span className="text-zinc-900 font-bold">Nada de relleno</span>, solo lo que tu equipo sí va a usar.
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
              <div className="group relative h-[500px] rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-[#FF007F]/50 transition-all duration-500 shadow-xl shadow-zinc-200/50 cursor-pointer">
                {/* Background Image - Full Card */}
                <div className="absolute inset-0">
                  {/* Light Grey Background */}
                  <div className="absolute inset-0 bg-[#F4F4F5]" />

                  <Image
                    src={products[0].imageUrl}
                    alt={products[0].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Pink Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500" />
                </div>

                {/* Tech Tag (Top Right) */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="absolute top-6 right-6 z-20 group/tag"
                >
                  <div className="relative">
                    {/* Tag */}
                    <div className="relative px-4 py-2 bg-white border-2 border-[#FF007F] rounded-full shadow-md">
                      <span className="text-xs font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                        {products[0].techTag}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Featured Badge */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="px-4 py-2 bg-[#FF007F] border-2 border-white rounded-full shadow-lg">
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content Area (Left Side) */}
                <div className="absolute left-0 top-0 bottom-0 z-10 p-8 md:p-12 flex items-center">
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-lg shadow-lg">
                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-black mb-4 text-zinc-900">
                      {products[0].title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-6">
                      {products[0].description}
                    </p>

                    {/* Action Link */}
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-[#FF007F] font-bold text-sm uppercase group/btn"
                    >
                      <span>Ver Detalles</span>
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
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
                  <div className="group relative h-[450px] rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-[#FF007F]/50 transition-all duration-500 shadow-xl shadow-zinc-200/50 cursor-pointer">
                    {/* Background Image - Full Card */}
                    <div className="absolute inset-0">
                      {/* Light Grey Background */}
                      <div className="absolute inset-0 bg-[#F4F4F5]" />

                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Pink Overlay on Hover */}
                      <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500" />
                    </div>

                    {/* Tech Tag (Top Right) */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="absolute top-4 right-4 z-20 group/tag"
                    >
                      <div className="relative">
                        {/* Tag */}
                        <div className="relative px-4 py-2 bg-white border-2 border-[#FF007F] rounded-full shadow-md">
                          <span className="text-xs font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                            {product.techTag}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Content Area (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-black mb-2 text-zinc-900">
                          {product.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                          {product.description}
                        </p>

                        {/* Action Link */}
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-2 text-[#FF007F] font-bold text-sm uppercase group/btn"
                        >
                          <span>Ver Detalles</span>
                          <svg
                            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
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
            ¿No encuentras lo que buscas?
          </p>
          <button className="px-8 py-4 bg-white border-2 border-zinc-200 hover:border-[#FF007F] rounded-2xl font-bold text-zinc-900 transition-all group shadow-md">
            <span className="group-hover:text-[#FF007F] transition-colors">
              Explorar Catálogo Completo
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
