'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { preload } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

interface ProductCard {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
}

const CAT_COLORS: Record<string, string> = {
  Bebidas:    '#00C2FF',
  Tecnología: '#22C55E',
  Mochilas:   '#A855F7',
  Kits:       '#FF007F',
  Hogar:      '#14B8A6',
};

// 4 columnas × 5 productos = 20 únicos, 40 nodos con loop
const COLUMNS: ProductCard[][] = [
  [
    { id: 'te268', name: 'Botella Vratsa',    category: 'Bebidas',    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778178486007x846429567557916200/TE-268_03.jpg' },
    { id: 'tx409', name: 'Bolsa Kameno',      category: 'Mochilas',   imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778081026380x857332771472513200/TX-409_03.jpg' },
    { id: 'hm201', name: 'Carrito Zory',      category: 'Hogar',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778265457990x116007611445585460/HM-201_03.jpg' },
    { id: 'st062', name: 'Kit Brezovo',       category: 'Kits',       imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775602785867x800431204476082000/ST-062_03.jpg' },
    { id: 'te267', name: 'Bote Yambol',       category: 'Bebidas',    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775603648800x402210224759407700/TE-267_03.jpg' },
  ],
  [
    { id: 'th267', name: 'Power Bank',        category: 'Tecnología', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773158291430x997972286257774000/TH-267_03.jpg' },
    { id: 'st063', name: 'Set Belitsa',       category: 'Kits',       imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778189428436x306091467674795900/ST-063_03.jpg' },
    { id: 'tx395', name: 'Mochila Legnica',   category: 'Mochilas',   imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773076104817x727691283906510900/TX-395_03.jpg' },
    { id: 'hm188', name: 'Contenedor Orsha',  category: 'Hogar',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778002231866x386246455992432700/HM-188_03.jpg' },
    { id: 'th272', name: 'Bocina Opole',      category: 'Tecnología', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773073063671x475966177635139140/TH-272_03.jpg' },
  ],
  [
    { id: 'tx394', name: 'Mochila Engomi',    category: 'Mochilas',   imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778020414980x910345116534144100/TX-394_03.jpg' },
    { id: 'st058', name: 'Kit Devin',         category: 'Kits',       imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778017068142x153560512386406800/ST-058_05.jpg' },
    { id: 'th274', name: 'Ventilador Cuello', category: 'Tecnología', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773074418104x557221645871434940/TH-274_04.jpg' },
    { id: 'hm187', name: 'Set Botellas',      category: 'Hogar',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778104309310x229142488005112930/HM-187_03.jpg' },
    { id: 'te273', name: 'Botella Vidin',     category: 'Bebidas',    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1775604115034x205244985773222820/TE-273_03.jpg' },
  ],
  [
    { id: 'te266', name: 'Bote Zaba',         category: 'Bebidas',    imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1772642339765x732040792323316100/TE-266_03.jpg' },
    { id: 'th268', name: 'Audífonos Bytom',   category: 'Tecnología', imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1772839023810x773513228424736400/TH-268_06.jpg' },
    { id: 'tx389', name: 'Tote doble Vista',  category: 'Mochilas',   imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1773075214536x144880349637577200/TX-389_03.jpg' },
    { id: 'st059', name: 'Kit Danubio',       category: 'Kits',       imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1772640755541x753120099035541100/ST-059_03.jpg' },
    { id: 'hm194', name: 'Contenedor Karavas',category: 'Hogar',      imageUrl: 'https://96a45939c451fa39780aa8f6c40c1b77.cdn.bubble.io/d362/f1778012091341x155692819090222460/HM-194_03.jpg' },
  ],
];

const COL_CONFIG = [
  { direction: 'Up',   duration: 24 },
  { direction: 'Down', duration: 32 },
  { direction: 'Up',   duration: 28 },
  { direction: 'Down', duration: 20 },
] as const;

interface ColumnProps {
  products: ProductCard[];
  direction: 'Up' | 'Down';
  duration: number;
  colIndex: number;
}

function DiagColumn({ products, direction, duration, colIndex }: ColumnProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...products, ...products];

  const pause  = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'; };
  const resume = () => { if (trackRef.current) trackRef.current.style.animationPlayState = 'running'; };

  return (
    <div className="overflow-hidden" style={{ height: '100%' }} onMouseEnter={pause} onMouseLeave={resume}>
      <div
        ref={trackRef}
        className="flex flex-col gap-3"
        style={{
          animation: `elevator${direction} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((p, i) => {
          const accent = CAT_COLORS[p.category] ?? '#FF007F';
          // Preload primera imagen de cada columna central; resto eager (no lazy)
          const isPriority = i === 0 && (colIndex === 1 || colIndex === 2);
          // Solo renderizar la primera copia para no duplicar imágenes en DOM
          // (el loop visual lo crea el keyframe, no necesitamos el nodo duplicado)
          return (
            <div
              key={`${p.id}-${i}`}
              className="relative rounded-xl overflow-hidden flex-shrink-0"
              style={{ aspectRatio: '3/4' }}
            >
              <Image
                src={p.imageUrl}
                alt={p.name}
                fill
                quality={70}
                priority={isPriority}
                loading="eager"
                sizes="14vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <div className="absolute top-2 left-2">
                <span
                  className="text-[8px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-white leading-none"
                  style={{ backgroundColor: accent }}
                >
                  {p.category}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white font-bold text-[10px] leading-tight drop-shadow">
                  {p.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiagonalElevator() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fade edges */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, #f4f4f5 0%, transparent 12%, transparent 88%, #f4f4f5 100%),
            linear-gradient(to right,  #f4f4f5 0%, transparent 8%, transparent 100%)
          `,
        }}
      />
      {/* Grid rotado — sin h-full para que top/bottom determinen la altura */}
      <div
        className="absolute grid gap-3"
        style={{
          top: '-25%',
          left: '-8%',
          right: '-8%',
          bottom: '-25%',
          transform: 'rotate(-10deg)',
          gridTemplateColumns: `repeat(${COLUMNS.length}, 1fr)`,
        }}
      >
        {COLUMNS.map((col, i) => (
          <DiagColumn
            key={i}
            products={col}
            direction={COL_CONFIG[i].direction}
            duration={COL_CONFIG[i].duration}
            colIndex={i}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroVerticalChain() {
  // Preload primera imagen de cada columna para que estén listas antes del primer frame
  COLUMNS.forEach(col => {
    preload(col[0].imageUrl, { as: 'image', fetchPriority: 'high' });
  });

  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-50 flex flex-col lg:flex-row">

      {/* Grid bg solo en la mitad izquierda */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* LEFT — copy */}
      <div className="relative z-10 flex items-center lg:w-1/2 px-6 lg:px-16 xl:px-24 py-24 lg:py-0 order-2 lg:order-1">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          className="w-full max-w-xl"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
            className="mb-6"
          >
            <span className="font-mono text-xs font-bold bg-white text-zinc-900 px-4 py-2 border-2 border-zinc-900 shadow-md inline-block">
              CDMX // MANUFACTURA HÍBRIDA
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
            className="text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black leading-[0.93] tracking-tighter text-zinc-900 mb-6"
          >
            MERCH QUE
            <br />
            <span className="text-[#FF007F]">IMPACTA.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="text-lg lg:text-xl text-zinc-500 mb-8 leading-relaxed"
          >
            Producimos, almacenamos y enviamos tus kits corporativos.{' '}
            <span className="text-zinc-900 font-semibold">Sin mínimos absurdos. Sin fricción.</span>
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
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

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } } }}
            className="flex flex-wrap items-center gap-6 lg:gap-8"
          >
            {[
              { emoji: '🚀', title: 'Same-Day',    sub: 'Envíos en CDMX' },
              { emoji: '📦', title: '+500',        sub: 'Empresas activas' },
              { emoji: '⚡', title: 'Sin Mínimos', sub: 'Desde 1 pieza' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-10 bg-zinc-200 hidden sm:block" />}
                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{s.emoji}</span>
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{s.title}</p>
                  <p className="text-xs text-zinc-500">{s.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT — elevador diagonal, mitad completa */}
      <div className="relative order-1 lg:order-2 lg:w-1/2 h-[55vw] lg:h-auto min-h-[400px]">
        <DiagonalElevator />
      </div>

      {/* Bottom Tech Marquee — CSS puro */}
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 py-3 overflow-hidden z-20">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: 'marqueeLeft 25s linear infinite', willChange: 'transform' }}
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
        </div>
      </div>
    </section>
  );
}
