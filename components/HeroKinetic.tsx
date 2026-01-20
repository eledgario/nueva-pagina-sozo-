'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface GalleryPanel {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  accentColor: string;
}

const galleryPanels: GalleryPanel[] = [
  {
    id: 'textil',
    title: 'TEXTIL',
    subtitle: 'Hoodies & Tees',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#FF007F',
  },
  {
    id: 'hardware',
    title: 'HARDWARE',
    subtitle: 'Tumblers & Mugs',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#06b6d4',
  },
  {
    id: 'tech',
    title: 'TECH',
    subtitle: '3D & Gadgets',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#8b5cf6',
  },
  {
    id: 'packaging',
    title: 'PACKAGING',
    subtitle: 'Cajas & Kits',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop',
    accentColor: '#f59e0b',
  },
];

function KineticGallery() {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  return (
    <div className="flex h-[500px] lg:h-[600px] gap-3 w-full">
      {galleryPanels.map((panel) => {
        const isHovered = hoveredPanel === panel.id;
        const isAnyHovered = hoveredPanel !== null;

        return (
          <motion.div
            key={panel.id}
            className="relative rounded-3xl overflow-hidden cursor-pointer"
            layout
            style={{
              flex: isHovered ? 3 : isAnyHovered ? 0.7 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
            }}
            onMouseEnter={() => setHoveredPanel(panel.id)}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={panel.imageUrl}
                alt={panel.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Dark Overlay - fades on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"
              animate={{
                opacity: isHovered ? 0.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Accent Color Border on Hover */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                boxShadow: isHovered
                  ? `inset 0 0 0 3px ${panel.accentColor}, 0 25px 50px -12px rgba(0,0,0,0.5)`
                  : 'none',
              }}
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Expanded Content - shows on hover */}
              <motion.div
                className="mb-auto mt-6"
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : -20,
                }}
                transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
              >
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: panel.accentColor }}
                >
                  Explorar
                </span>
              </motion.div>

              {/* Title & Subtitle */}
              <div>
                <motion.h3
                  className="font-black text-white uppercase tracking-tight"
                  animate={{
                    fontSize: isHovered ? '2.5rem' : '1.25rem',
                    marginBottom: isHovered ? '0.5rem' : '0.25rem',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  {panel.title}
                </motion.h3>

                <motion.p
                  className="text-white/70 font-medium"
                  animate={{
                    opacity: isHovered ? 1 : 0.7,
                    fontSize: isHovered ? '1rem' : '0.75rem',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {panel.subtitle}
                </motion.p>

                {/* View More - shows on hover */}
                <motion.div
                  className="flex items-center gap-2 mt-4"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -10,
                  }}
                  transition={{ duration: 0.3, delay: isHovered ? 0.15 : 0 }}
                >
                  <span className="text-white font-bold text-sm uppercase tracking-wider">
                    Ver Productos
                  </span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Vertical Label (when collapsed) */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              animate={{
                opacity: isHovered || !isAnyHovered ? 0 : 0.5,
                rotate: -90,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-black text-lg uppercase tracking-[0.3em] whitespace-nowrap">
                {panel.title}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HeroKinetic() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-50">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 min-h-screen flex items-center py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column - Typography */}
          <motion.div
            className="lg:col-span-5 order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.2 },
              },
            }}
          >
            {/* Small Label */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              className="mb-6"
            >
              <span className="font-mono text-xs font-bold bg-white text-zinc-900 px-4 py-2 border-2 border-zinc-900 shadow-md inline-block">
                CDMX // MANUFACTURA HÍBRIDA
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter text-zinc-900 mb-6"
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
              className="text-lg md:text-xl text-zinc-500 mb-8 max-w-[500px] leading-relaxed"
            >
              Diseñamos, producimos y almacenamos los kits de bienvenida de tu equipo.{' '}
              <span className="text-zinc-900 font-semibold">Sin tocar una sola caja.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF007F] text-white font-black text-base uppercase border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all">
                Armar mi Kit
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
              <button className="px-8 py-4 bg-white text-zinc-900 font-bold text-base border-2 border-zinc-300 hover:border-zinc-900 transition-all">
                Ver cómo funciona
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.6, delay: 0.3 } },
              }}
              className="mt-10 flex items-center gap-6 text-sm text-zinc-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Envío Same-Day CDMX</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-zinc-300" />
              <span className="hidden sm:block">+500 empresas confían en nosotros</span>
            </motion.div>
          </motion.div>

          {/* Right Column - Kinetic Gallery */}
          <motion.div
            className="lg:col-span-7 order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <KineticGallery />
          </motion.div>
        </div>
      </div>

      {/* Bottom Tech Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 py-3 overflow-hidden">
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
