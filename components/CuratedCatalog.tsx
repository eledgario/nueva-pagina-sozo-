'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShirtIcon, Coffee, Box, ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Product Type Definition
interface Product {
  id: string;
  name: string;
  description: string;
  tech: string;
  tags: string[];
  icon: React.ReactNode;
  imageUrl: string;
}

// Category Type
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  products: Product[];
}

// Mock Data
const categories: Category[] = [
  {
    id: 'textil',
    name: 'Studio Textil',
    icon: <ShirtIcon className="w-5 h-5" />,
    products: [
      {
        id: 'founder-tee',
        name: 'The Founder Tee',
        description: '240g Heavyweight Cotton. Boxy Fit. Ideal para Startups.',
        tech: 'Screen Print + Puff Ink',
        tags: ['Heavyweight', '100% Algodón'],
        icon: <ShirtIcon className="w-12 h-12" />,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
      },
      {
        id: 'dev-hoodie',
        name: 'Dev Hoodie',
        description: 'Sin felpa barata. Corte Oversized. Bordado 3D.',
        tech: 'Premium Embroidery',
        tags: ['Oversized', 'Bordado 3D'],
        icon: <ShirtIcon className="w-12 h-12" />,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'drinkware',
    name: 'Drinkware Lab',
    icon: <Coffee className="w-5 h-5" />,
    products: [
      {
        id: 'stealth-tumbler',
        name: 'Stealth Tumbler',
        description: 'Acero Inoxidable Doble Pared. Grabado Láser Permanente.',
        tech: 'Fiber Laser Engraving',
        tags: ['Doble Pared', 'Laser Engraved'],
        icon: <Coffee className="w-12 h-12" />,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2087&auto=format&fit=crop',
      },
      {
        id: 'ceramic-mug',
        name: 'Ceramic Mate Mug',
        description: 'Acabado Rubber. Impresión UV con textura.',
        tech: 'UV Direct Print',
        tags: ['Rubber Finish', 'UV Print'],
        icon: <Coffee className="w-12 h-12" />,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  {
    id: '3d-tech',
    name: '3D & Tech',
    icon: <Box className="w-5 h-5" />,
    products: [
      {
        id: 'monolith-stand',
        name: 'Monolith Stand',
        description: 'Soporte de celular impreso en 3D. Diseño Paramétrico.',
        tech: '3D FDM Print',
        tags: ['3D Printed', 'Paramétrico'],
        icon: <Box className="w-12 h-12" />,
        imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: 'nfc-card',
        name: 'NFC Connect Card',
        description: 'Acrílico Negro Mate + Chip NFC. Tu última tarjeta de presentación.',
        tech: 'Laser Cut + NFC Chip',
        tags: ['NFC Ready', 'Acrílico'],
        icon: <Box className="w-12 h-12" />,
        imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2074&auto=format&fit=crop',
      },
    ],
  },
];

export default function CuratedCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>('textil');

  const currentCategory = categories.find((cat) => cat.id === activeCategory);

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [CATÁLOGO_COMPLETO]
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-4 text-zinc-900 tracking-tight">
            EL CATÁLOGO
          </h2>
          <p className="text-xl text-zinc-500">
            Productos curados para destacar. Arma tu kit ideal.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 shadow-md">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  relative px-6 py-3 font-bold text-sm transition-all duration-300
                  flex items-center gap-2 uppercase
                  ${
                    activeCategory === category.id
                      ? 'text-white'
                      : 'text-zinc-500 hover:text-zinc-700'
                  }
                `}
              >
                {/* Active Background */}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#FF007F]"
                    transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
                  />
                )}

                {/* Icon & Text */}
                <span className="relative z-10 flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {currentCategory?.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:border-[#FF007F]/50 transition-all shadow-xl shadow-zinc-200/50"
              >
                {/* Image Area (60% height) */}
                <div className="relative h-80 overflow-hidden">
                  {/* Light Grey Background */}
                  <div className="absolute inset-0 bg-[#F4F4F5]" />

                  {/* Product Image */}
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Pink Glow on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all duration-500"
                    initial={false}
                  />

                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-bold bg-white border border-zinc-200 text-zinc-700 shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Area (40% height) */}
                <div className="p-6">
                  {/* Tech Badge */}
                  <span className="inline-block px-3 py-1 text-xs font-mono font-semibold bg-[#FF007F]/10 text-[#FF007F] rounded-full mb-3">
                    {product.tech}
                  </span>

                  {/* Product Name */}
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-500 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Action Button */}
                  <button className="group/btn w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F] hover:text-white font-bold uppercase transition-all">
                    Cotizar
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
