'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Mail } from 'lucide-react';
import catalogData from '@/data/products.json';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tecnica  { id: string; nombre: string; desc: string; }
interface Categoria { id: string; nombre: string; }
interface Producto  { id: string; nombre: string; modelo: string; desc: string; categoria: string; tecnicas: string[]; }

// ─── Constants ────────────────────────────────────────────────────────────────

const WA = '525588060340';

const TECNICA_COLORS: Record<string, string> = {
  serigrafia:   'bg-blue-950   text-blue-300   border-blue-700/50',
  tampografia:  'bg-purple-950 text-purple-300 border-purple-700/50',
  laser:        'bg-orange-950 text-orange-300 border-orange-700/50',
  sublimacion:  'bg-cyan-950   text-cyan-300   border-cyan-700/50',
  'dtf-uv':     'bg-yellow-950 text-yellow-300 border-yellow-700/50',
  'dtf-textil': 'bg-green-950  text-green-300  border-green-700/50',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWAUrl(p: Producto, nombre: string, empresa: string): string {
  const msg = nombre
    ? `Hola SOZO! Soy ${nombre}${empresa ? ` de ${empresa}` : ''}. Me interesa cotizar: ${p.nombre} (${p.modelo})`
    : `Hola SOZO! Me interesa cotizar: ${p.nombre} (${p.modelo})`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

function buildGeneralWAUrl(nombre: string, empresa: string): string {
  const msg = nombre
    ? `Hola SOZO! Soy ${nombre}${empresa ? ` de ${empresa}` : ''}. Quiero cotizar un kit corporativo.`
    : `Hola SOZO! Quiero cotizar un kit corporativo.`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

// ─── Animated counter ────────────────────────────────────────────────────────

function StatCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const duration = 1200;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * to));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({
  p, nombre, empresa, tecnicasMap, index,
}: {
  p: Producto; nombre: string; empresa: string; tecnicasMap: Map<string, string>; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: (index % 3) * 0.06 }}
      className="bg-zinc-900 border border-zinc-800 flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="font-mono text-[9px] font-bold text-[#FF007F] uppercase tracking-widest border border-[#FF007F]/30 px-2 py-0.5 flex-shrink-0">
            {p.categoria}
          </span>
          <span className="font-mono text-[10px] text-zinc-600 flex-shrink-0">{p.modelo}</span>
        </div>

        {/* Name & desc */}
        <h3 className="text-base font-black text-white mb-1.5 leading-tight">{p.nombre}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4 flex-1">{p.desc}</p>

        {/* Technique badges */}
        <div className="flex flex-wrap gap-1.5">
          {p.tecnicas.map((t) => (
            <span
              key={t}
              className={`font-mono text-[9px] px-2 py-0.5 border ${TECNICA_COLORS[t] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
            >
              {tecnicasMap.get(t) ?? t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={buildWAUrl(p, nombre, empresa)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs uppercase tracking-wider transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
        Cotizar por WhatsApp
      </a>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CatalogoContent() {
  const params = useSearchParams();
  const nombre  = params.get('nombre')  ?? '';
  const empresa = params.get('empresa') ?? '';
  const expo    = params.get('expo')    ?? '';

  const [activeCategory, setActiveCategory] = useState('todos');

  const tecnicas  = catalogData.tecnicas  as Tecnica[];
  const categorias = catalogData.categorias as Categoria[];
  const productos  = catalogData.productos  as Producto[];

  const tecnicasMap = new Map(tecnicas.map((t) => [t.id, t.nombre]));

  const filtered = activeCategory === 'todos'
    ? productos
    : productos.filter((p) => p.categoria === activeCategory);

  const expoTag = expo
    ? `[${expo.toUpperCase().replace(/\s+/g, '_')}]`
    : '[CATÁLOGO_2026]';

  return (
    <div className="min-h-screen bg-zinc-950 text-white antialiased font-sans">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden">

        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FF007F]/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl mx-auto text-center"
        >
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image
              src="/sozo-logo.png"
              alt="SOZO"
              width={140}
              height={46}
              className="h-11 w-auto brightness-0 invert"
              priority
            />
          </div>

          {/* Tag */}
          <span className="inline-block font-mono text-[10px] font-bold text-[#FF007F] tracking-widest uppercase mb-5 border border-[#FF007F]/30 px-4 py-1.5">
            {expoTag}
          </span>

          {/* Personalized or generic headline */}
          {nombre ? (
            <>
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-3">
                Hola, <span className="text-white">{nombre}</span>
                {empresa && <span className="text-zinc-600"> · {empresa}</span>}
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6">
                ESTO ES<br />
                <span className="text-[#FF007F]">SOZO.</span>
              </h1>
              <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                Preparamos este catálogo para ti. Explora nuestros productos y cotiza directo por WhatsApp.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6">
                CATÁLOGO<br />
                <span className="text-[#FF007F]">CORPORATIVO.</span>
              </h1>
              <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                Más de 111 productos personalizables para tu marca.
                Producción, almacenaje y envío desde CDMX.
              </p>
            </>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-12 max-w-sm mx-auto">
            {[
              { to: 111, suffix: '+', label: 'Productos' },
              { to: 6,   suffix: '',  label: 'Técnicas'  },
              { to: 10,  suffix: '',  label: 'Categorías'},
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  <StatCounter to={s.to} suffix={s.suffix} />
                </p>
                <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-0.5 h-6 bg-zinc-800"
          />
        </motion.div>
      </section>

      {/* ── TÉCNICAS ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-widest">
              [TÉCNICAS_DE_PERSONALIZACIÓN]
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 tracking-tight leading-tight">
              6 TÉCNICAS.<br />
              <span className="text-zinc-600">RESULTADOS ÚNICOS.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tecnicas.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative p-6 bg-zinc-950 border border-zinc-800 group"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#FF007F] flex items-center justify-center font-black text-white text-xs border-2 border-zinc-900">
                  0{i + 1}
                </div>
                <h3 className="text-sm font-black text-white mb-2 group-hover:text-[#FF007F] transition-colors">
                  {t.nombre}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-widest">
              [CATÁLOGO_COMPLETO]
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 tracking-tight leading-tight">
              NUESTROS<br />
              <span className="text-[#FF007F]">PRODUCTOS.</span>
            </h2>
          </motion.div>

          {/* Category filter — scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
            {[{ id: 'todos', nombre: 'Todos' }, ...categorias].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex-shrink-0 px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                  activeCategory === c.id
                    ? 'bg-[#FF007F] border-[#FF007F] text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mb-6">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                nombre={nombre}
                empresa={empresa}
                tecnicasMap={tecnicasMap}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-zinc-900">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-widest">
              [COTIZAR_AHORA]
            </span>
            <h2 className="text-4xl sm:text-5xl font-black mt-3 mb-3 tracking-tight leading-tight">
              ¿LISTO PARA<br />
              <span className="text-[#FF007F]">TU KIT?</span>
            </h2>
            <p className="text-zinc-500 text-base mb-8 leading-relaxed">
              Cuéntanos tu proyecto. Respuesta en menos de 24 hrs.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={buildGeneralWAUrl(nombre, empresa)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF007F] hover:bg-[#e0006f] text-white font-black text-sm uppercase tracking-wider border-4 border-[#FF007F] shadow-[4px_4px_0px_0px_rgba(255,0,127,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,0,127,0.3)] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Iniciar cotización por WhatsApp
              </a>
              <a
                href="mailto:ventas@sozo.com.mx"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white font-black text-sm uppercase tracking-wider border-4 border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <Mail className="w-4 h-4" />
                ventas@sozo.com.mx
              </a>
            </div>
            <p className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mt-8">
              Ciudad de México · Envíos nacionales
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FLOATING WhatsApp ─────────────────────────────────────────────── */}
      <motion.a
        href={buildGeneralWAUrl(nombre, empresa)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', bounce: 0.4 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] transition-colors"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.a>

    </div>
  );
}
