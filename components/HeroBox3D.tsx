'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

// ─── Constants ────────────────────────────────────────────────
const BOX = 180; // box size in px
const HALF = BOX / 2;

const PRODUCTS = [
  {
    id: 'hoodie',
    name: 'Founder Hoodie',
    category: 'TEXTIL',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop',
    x: -150,
    y: -95,
  },
  {
    id: 'tumbler',
    name: 'Stealth Tumbler',
    category: 'HARDWARE',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop',
    x: 130,
    y: -110,
  },
  {
    id: 'tee',
    name: 'Classic Tee',
    category: 'TEXTIL',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop',
    x: 160,
    y: 20,
  },
  {
    id: 'cap',
    name: 'Dad Cap',
    category: 'TEXTIL',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=400&auto=format&fit=crop',
    x: -140,
    y: 100,
  },
  {
    id: 'notebook',
    name: 'Field Notes',
    category: 'PRINT',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop',
    x: 110,
    y: 115,
  },
];

const TECHNIQUES = [
  'SERIGRAF\u00cdA',
  'IMPRESI\u00d3N 3D',
  'GRABADO L\u00c1SER',
  'IMPRESI\u00d3N UV',
  'BORDADO',
  'SUBLIMACI\u00d3N',
];

// ─── Box Face ─────────────────────────────────────────────────
function BoxFace({
  children,
  className = '',
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute border-2 border-zinc-900 ${className}`}
      style={{
        width: BOX,
        height: BOX,
        backfaceVisibility: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── 3D Box ───────────────────────────────────────────────────
function Box3D({ lidOpen }: { lidOpen: boolean }) {
  return (
    <div
      className="relative"
      style={{
        width: BOX,
        height: BOX,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front */}
      <BoxFace
        className="bg-white"
        style={{ transform: `translateZ(${HALF}px)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF007F]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="font-mono font-black text-xl text-zinc-900 tracking-widest">
            SOZO
          </span>
          <span className="font-mono text-[8px] text-zinc-400 tracking-[0.3em] uppercase">
            MFG LAB
          </span>
        </div>
      </BoxFace>

      {/* Back */}
      <BoxFace
        className="bg-zinc-50"
        style={{ transform: `rotateY(180deg) translateZ(${HALF}px)` }}
      />

      {/* Left */}
      <BoxFace
        className="bg-zinc-100"
        style={{ transform: `rotateY(-90deg) translateZ(${HALF}px)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase"
            style={{ writingMode: 'vertical-rl' }}
          >
            CDMX // MANUFACTURA
          </span>
        </div>
      </BoxFace>

      {/* Right */}
      <BoxFace
        className="bg-zinc-100"
        style={{ transform: `rotateY(90deg) translateZ(${HALF}px)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-[9px] text-zinc-400 tracking-widest uppercase"
            style={{ writingMode: 'vertical-rl' }}
          >
            H\u00cdBRIDA // 2025
          </span>
        </div>
      </BoxFace>

      {/* Bottom */}
      <BoxFace
        className="bg-zinc-200"
        style={{ transform: `rotateX(-90deg) translateZ(${HALF}px)` }}
      />

      {/* Top (Lid) — outer div positions it; inner motion.div animates the hinge */}
      <div
        className="absolute"
        style={{
          width: BOX,
          height: BOX,
          transform: `rotateX(90deg) translateZ(${HALF}px)`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'top center',
        }}
      >
        <motion.div
          className="absolute inset-0 bg-zinc-100 border-2 border-zinc-900"
          style={{ backfaceVisibility: 'hidden', transformOrigin: 'top center' }}
          animate={{ rotateX: lidOpen ? -120 : 0 }}
          transition={{
            duration: 0.9,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] text-zinc-400 tracking-[0.4em]">
              SOZO
            </span>
          </div>
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF007F]" />
          <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#FF007F]" />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Floating Product Chip ────────────────────────────────────
function ProductChip({
  product,
  delay,
  show,
}: {
  product: (typeof PRODUCTS)[0];
  delay: number;
  show: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: product.x - 40,
        marginTop: product.y - 50,
        zIndex: hovered ? 10 : 1,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, scale: 0.3, y: 30 }}
      animate={
        show
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.3, y: 30 }
      }
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
      whileHover={{ scale: 1.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="bg-white border-2 border-zinc-200 hover:border-zinc-900 shadow-md transition-colors cursor-pointer overflow-hidden"
        style={{ width: 80 }}
      >
        <div className="relative" style={{ height: 72 }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="px-1.5 py-1 bg-white">
          <span className="font-mono text-[7px] text-[#FF007F] font-bold block tracking-wider">
            {product.category}
          </span>
          <span className="font-mono text-[8px] text-zinc-700 font-bold block truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: -8 }}
            exit={{ opacity: 0, y: -2 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-900 text-white font-mono text-[9px] px-2 py-1 whitespace-nowrap z-20"
          >
            {product.name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── 3D Box Scene (right column) ─────────────────────────────
function Box3DScene() {
  const [phase, setPhase] = useState<'hidden' | 'assembled' | 'open'>('hidden');
  const [productsVisible, setProductsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const rotX = useTransform(my, [-0.5, 0.5], [6, -6]);
  const rotYSpring = useSpring(rotY, { damping: 30, stiffness: 120 });
  const rotXSpring = useSpring(rotX, { damping: 30, stiffness: 120 });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
      setIsIdle(false);
      clearTimeout(idleTimer.current);
    },
    [mx, my],
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    idleTimer.current = setTimeout(() => setIsIdle(true), 3000);
  }, [mx, my]);

  // Animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('assembled'), 300);
    const t2 = setTimeout(() => setPhase('open'), 1100);
    const t3 = setTimeout(() => setProductsVisible(true), 1400);
    const t4 = setTimeout(() => setIsIdle(true), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: 500 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Perspective container */}
      <div style={{ perspective: 800, perspectiveOrigin: '50% 40%' }}>
        {/* Parallax + idle rotation wrapper */}
        <motion.div
          style={{
            rotateX: rotXSpring,
            rotateY: rotYSpring,
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: BOX,
            height: BOX,
            willChange: 'transform',
          }}
          animate={
            isIdle && phase === 'open'
              ? { rotateY: [0, 3, 0, -3, 0] }
              : {}
          }
          transition={
            isIdle ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : {}
          }
        >
          {/* Box entrance */}
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={
              phase !== 'hidden'
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.7, y: 40 }
            }
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <Box3D lidOpen={phase === 'open'} />
          </motion.div>

          {/* Ground shadow */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bg-black/10 blur-xl rounded-full"
            style={{ width: 160, height: 18, bottom: -32 }}
            animate={{
              opacity: phase !== 'hidden' ? 1 : 0,
              scaleX: phase === 'open' ? 1.2 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Floating products (outside preserve-3d to avoid z-fighting) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {PRODUCTS.map((p, i) => (
            <ProductChip
              key={p.id}
              product={p}
              delay={i * 0.12}
              show={productsVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Hero Component ──────────────────────────────────────
export default function HeroBox3D() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-50">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
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
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5 },
                },
              }}
              className="mb-6"
            >
              <span className="font-mono text-xs font-bold bg-white text-zinc-900 px-4 py-2 border-2 border-zinc-900 shadow-md inline-block">
                CDMX // MANUFACTURA H\u00cdBRIDA
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: 'easeOut' },
                },
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
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
              className="text-lg lg:text-xl text-zinc-500 mb-8 max-w-lg leading-relaxed"
            >
              Dise\u00f1amos, producimos y almacenamos los kits de tu equipo.{' '}
              <span className="text-zinc-900 font-semibold">
                Gestiona todo sin tocar una sola caja.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <MagneticButton className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF007F] text-white font-black text-base uppercase border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all">
                Armar mi Kit
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
              <button className="px-8 py-4 bg-white text-zinc-900 font-bold text-base border-2 border-zinc-200 hover:border-zinc-900 transition-all">
                Ver c\u00f3mo funciona
              </button>
            </motion.div>

            {/* Trust Stats */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
              className="flex flex-wrap items-center gap-6 lg:gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">&#x1F680;</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">Same-Day</p>
                  <p className="text-xs text-zinc-500">Env\u00edos en CDMX</p>
                </div>
              </div>

              <div className="w-px h-10 bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">&#x1F4E6;</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">+500</p>
                  <p className="text-xs text-zinc-500">Empresas activas</p>
                </div>
              </div>

              <div className="w-px h-10 bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">&#x26A1;</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">Sin M\u00ednimos</p>
                  <p className="text-xs text-zinc-500">Desde 1 pieza</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Box Scene */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Box3DScene />
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
              {TECHNIQUES.map((tech, idx) => (
                <span
                  key={idx}
                  className="font-mono text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-4"
                >
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
