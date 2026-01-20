'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface ProductCard {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

const productsColumnLeft: ProductCard[] = [
  {
    id: 'hoodie-black',
    name: 'Founder Hoodie',
    category: 'Textil',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'tumbler',
    name: 'Stealth Tumbler',
    category: 'Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'tee-white',
    name: 'Classic Tee',
    category: 'Textil',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'notebook',
    name: 'Field Notes',
    category: 'Print',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'cap',
    name: 'Dad Cap',
    category: 'Textil',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
  },
];

const productsColumnRight: ProductCard[] = [
  {
    id: 'mug',
    name: 'Ceramic Mug',
    category: 'Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'stand',
    name: 'Monolith Stand',
    category: '3D Print',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'tote',
    name: 'Canvas Tote',
    category: 'Textil',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nfc-card',
    name: 'NFC Card',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'bottle',
    name: 'Sport Bottle',
    category: 'Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
  },
];

interface ElevatorColumnProps {
  products: ProductCard[];
  direction: 'up' | 'down';
  duration?: number;
}

function ElevatorColumn({ products, direction, duration = 25 }: ElevatorColumnProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate products for seamless loop
  const duplicatedProducts = [...products, ...products];

  return (
    <div
      className="relative h-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === 'up'
            ? ['0%', '-50%']
            : ['-50%', '0%'],
        }}
        transition={{
          y: {
            duration: duration,
            ease: 'linear',
            repeat: Infinity,
          },
        }}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {duplicatedProducts.map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`}
            className="relative bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden group cursor-pointer flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Product Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="200px"
              />

              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-colors duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-4 bg-white">
              <span className="text-[10px] font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                {product.category}
              </span>
              <h4 className="font-bold text-sm text-zinc-900 mt-1 truncate">
                {product.name}
              </h4>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function VerticalSupplyChain() {
  return (
    <div
      className="relative h-[600px] lg:h-[700px] w-full"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Column 1 - Moving Up */}
        <ElevatorColumn products={productsColumnLeft} direction="up" duration={30} />

        {/* Column 2 - Moving Down */}
        <ElevatorColumn products={productsColumnRight} direction="down" duration={28} />
      </div>
    </div>
  );
}

export default function HeroVerticalChain() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-50">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 min-h-screen flex items-center py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* Left Column - Typography */}
          <motion.div
            className="order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
          >
            {/* Badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
              }}
              className="mb-6"
            >
              <span className="font-mono text-xs font-bold bg-white text-zinc-900 px-4 py-2 border-2 border-zinc-900 shadow-md inline-block">
                CDMX // MANUFACTURA HÍBRIDA
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
              }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tighter text-zinc-900 mb-6"
            >
              TU CULTURA
              <br />
              <span className="text-[#FF007F]">EN UNA CAJA.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="text-lg lg:text-xl text-zinc-500 mb-8 max-w-lg leading-relaxed"
            >
              Diseñamos, producimos y almacenamos los kits de tu equipo.{' '}
              <span className="text-zinc-900 font-semibold">
                Gestiona todo sin tocar una sola caja.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <MagneticButton className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF007F] text-white font-black text-base uppercase border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all">
                Armar mi Kit
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
              <button className="px-8 py-4 bg-white text-zinc-900 font-bold text-base border-2 border-zinc-200 hover:border-zinc-900 transition-all">
                Ver cómo funciona
              </button>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
              }}
              className="flex flex-wrap items-center gap-6 lg:gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🚀</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">Same-Day</p>
                  <p className="text-xs text-zinc-500">Envíos en CDMX</p>
                </div>
              </div>

              <div className="w-px h-10 bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">+500</p>
                  <p className="text-xs text-zinc-500">Empresas activas</p>
                </div>
              </div>

              <div className="w-px h-10 bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">Sin Mínimos</p>
                  <p className="text-xs text-zinc-500">Desde 1 pieza</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Vertical Supply Chain Gallery */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <VerticalSupplyChain />
          </motion.div>
        </div>
      </div>

      {/* Bottom Tech Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 py-3 overflow-hidden z-20">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12">
              {['SERIGRAFÍA', 'IMPRESIÓN 3D', 'GRABADO LÁSER', 'IMPRESIÓN UV', 'BORDADO', 'SUBLIMACIÓN'].map((tech, idx) => (
                <span key={idx} className="font-mono text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-4">
                  {tech}
                  <span className="w-1.5 h-1.5 bg-[#FF007F] rounded-full" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
