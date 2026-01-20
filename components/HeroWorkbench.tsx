'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Package } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface FloatingCard {
  id: string;
  type: 'image' | 'swatch' | 'label';
  content: string;
  imageUrl?: string;
  color?: string;
  initialPosition: { x: number; y: number };
  rotation: number;
  size: { width: number; height: number };
  delay: number;
}

const floatingCards: FloatingCard[] = [
  {
    id: 'hoodie',
    type: 'image',
    content: 'The Founder Hoodie',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    initialPosition: { x: 60, y: 5 },
    rotation: -6,
    size: { width: 280, height: 320 },
    delay: 0,
  },
  {
    id: 'tumbler',
    type: 'image',
    content: 'Stealth Tumbler',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
    initialPosition: { x: 75, y: 45 },
    rotation: 8,
    size: { width: 200, height: 260 },
    delay: 0.1,
  },
  {
    id: 'swatch',
    type: 'swatch',
    content: 'SOZO PINK',
    color: '#FF007F',
    initialPosition: { x: 55, y: 60 },
    rotation: -12,
    size: { width: 160, height: 200 },
    delay: 0.2,
  },
  {
    id: 'prototype',
    type: 'image',
    content: '3D Prototype',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop',
    initialPosition: { x: 85, y: 20 },
    rotation: 15,
    size: { width: 180, height: 220 },
    delay: 0.15,
  },
  {
    id: 'label',
    type: 'label',
    content: 'SOZO MFG',
    initialPosition: { x: 70, y: 75 },
    rotation: 5,
    size: { width: 200, height: 120 },
    delay: 0.25,
  },
];

// Pantone-style swatch card
function SwatchCard({ color, content }: { color: string; content: string }) {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-200">
      <div className="h-3/4 w-full" style={{ backgroundColor: color }} />
      <div className="h-1/4 p-3 bg-white">
        <p className="font-mono text-xs font-bold text-zinc-900 uppercase tracking-wider">{content}</p>
        <p className="font-mono text-[10px] text-zinc-400 mt-1">FF-00-7F</p>
      </div>
    </div>
  );
}

// Shipping label card
function ShippingLabel({ content }: { content: string }) {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-dashed border-zinc-300 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-[#FF007F]" />
          <span className="font-black text-sm text-zinc-900">{content}</span>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-zinc-200 rounded w-full" />
          <div className="h-2 bg-zinc-200 rounded w-3/4" />
          <div className="h-2 bg-zinc-200 rounded w-1/2" />
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="font-mono text-[8px] text-zinc-400">CDMX, MX</div>
        <div className="w-12 h-12 bg-zinc-900 rounded-sm flex items-center justify-center">
          <span className="text-white font-black text-[8px]">QR</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroWorkbench() {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={constraintsRef}
      className="relative min-h-screen overflow-hidden bg-zinc-50"
    >
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #06b6d4 1px, transparent 1px),
            linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Subtle radial gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.8) 0%, transparent 70%)',
        }}
      />

      {/* Content Container */}
      <div className="relative z-0 min-h-screen flex items-center">
        {/* Left Side - Typography (z-0, underneath floating objects) */}
        <motion.div
          className="relative z-0 w-full lg:w-1/2 px-8 md:px-16 lg:px-20 py-20"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.3 },
            },
          }}
        >
          {/* Small Label */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="mb-8"
          >
            <span className="font-mono text-xs font-bold bg-white text-zinc-900 px-4 py-2 border-2 border-zinc-900 shadow-md inline-block">
              CDMX // HYBRID MFG LAB
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1] tracking-tighter text-zinc-900 mb-8"
          >
            TU CULTURA
            <br />
            <span className="text-[#FF007F]">EN UNA CAJA.</span>
            <br />
            <span className="relative inline-block">
              LOGÍSTICA EN LA NUBE.
              <svg className="absolute -bottom-1 left-0 w-full h-2 text-[#FF007F]" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0,8 Q25,0 50,8 T100,8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="text-lg md:text-xl text-zinc-500 mb-10 max-w-[600px] leading-relaxed"
          >
            Diseñamos, producimos y almacenamos los kits de bienvenida de tu equipo.{' '}
            <span className="text-zinc-900 font-semibold">Gestiona todo tu inventario sin tocar una sola caja.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#FF007F] text-white font-black text-lg uppercase border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              Armar mi Kit
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
            <button className="px-8 py-5 bg-white text-zinc-900 font-bold text-lg border-2 border-zinc-300 hover:border-zinc-900 transition-all rounded-none">
              Ver cómo funciona
            </button>
          </motion.div>

          {/* Drag hint */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6, delay: 0.5 } },
            }}
            className="mt-12 text-xs font-mono text-zinc-400 uppercase tracking-widest hidden lg:block"
          >
            ← Arrastra los productos →
          </motion.p>
        </motion.div>

        {/* Right Side - Floating Draggable Cards (z-10, above text) */}
        <div className="absolute inset-0 z-10 pointer-events-none lg:pointer-events-auto">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="absolute cursor-grab active:cursor-grabbing pointer-events-auto"
              style={{
                left: `${card.initialPosition.x}%`,
                top: `${card.initialPosition.y}%`,
                width: card.size.width,
                height: card.size.height,
                transform: `translate(-50%, -50%)`,
              }}
              initial={{ opacity: 0, scale: 0.8, rotate: card.rotation }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: card.rotation,
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: card.delay + 0.5 },
                scale: { duration: 0.5, delay: card.delay + 0.5 },
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: card.delay,
                },
              }}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              whileHover={{
                scale: 1.08,
                rotate: card.rotation + 5,
                zIndex: 50,
                transition: { duration: 0.2 },
              }}
              whileDrag={{
                scale: 1.1,
                zIndex: 100,
                cursor: 'grabbing',
              }}
            >
              {/* Card Shadow */}
              <div
                className="absolute inset-0 bg-black/20 rounded-2xl blur-xl -z-10 translate-y-4"
                style={{ transform: 'translateY(16px) scale(0.95)' }}
              />

              {/* Card Content */}
              <div className="relative w-full h-full">
                {card.type === 'image' && card.imageUrl && (
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-2xl">
                    <div className="relative w-full h-[85%]">
                      <Image
                        src={card.imageUrl}
                        alt={card.content}
                        fill
                        className="object-cover"
                        sizes="300px"
                        draggable={false}
                      />
                    </div>
                    <div className="h-[15%] px-4 flex items-center bg-white border-t border-zinc-100">
                      <span className="font-mono text-xs font-bold text-zinc-700 uppercase tracking-wider truncate">
                        {card.content}
                      </span>
                    </div>
                  </div>
                )}

                {card.type === 'swatch' && card.color && (
                  <SwatchCard color={card.color} content={card.content} />
                )}

                {card.type === 'label' && (
                  <ShippingLabel content={card.content} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Marquee Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 py-3 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12">
              {['SERIGRAFÍA', 'IMPRESIÓN 3D', 'GRABADO LÁSER', 'IMPRESIÓN UV', 'BORDADO', 'SUBLIMACIÓN'].map((tech, idx) => (
                <span key={idx} className="font-mono text-sm font-bold text-white/60 uppercase tracking-widest flex items-center gap-4">
                  {tech}
                  <span className="w-2 h-2 bg-[#FF007F] rounded-full" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
