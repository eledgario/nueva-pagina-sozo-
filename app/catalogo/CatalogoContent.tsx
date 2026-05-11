'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  MessageCircle, Mail, Search, ChevronLeft, ChevronRight, X,
  ZoomIn, Plus, Minus, ShoppingBag, Trash2, Package,
  Clock, Truck, Layers, Users,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Tecnica   { id: string; nombre: string; desc: string; }
interface Categoria { id: string; nombre: string; }
interface Producto  {
  id: string; nombre: string; modelo: string; desc: string;
  categoria: string; tecnicas: string[];
  imagenes?: string[]; dimensiones?: string; colores?: string;
}
interface KitItem   { producto: Producto; cantidad: number; }

// ─── Constants ────────────────────────────────────────────────────────────────

const WA = '525588060340';
const PAGE_SIZE = 18;

const TECNICA_LABEL: Record<string, string> = {
  serigrafia:   'Serigrafía',
  tampografia:  'Tampografía',
  laser:        'Grabado Láser',
  sublimacion:  'Sublimación',
  'dtf-uv':     'DTF UV',
  'dtf-textil': 'DTF Textil',
};

const TECNICA_DESC: Record<string, string> = {
  serigrafia:   'Ideal para logos sólidos en grandes volúmenes',
  tampografia:  'Perfecta para superficies curvas e irregulares',
  laser:        'Acabado premium permanente en metales y madera',
  sublimacion:  'Full color fotográfico, para poliéster y cerámica',
  'dtf-uv':     'Impresión directa en acrílico, vidrio y metal',
  'dtf-textil': 'Diseños full color en cualquier tela',
};

const CAT_LABEL: Record<string, string> = {
  bebidas: 'Bebidas', belleza: 'Belleza', escritura: 'Escritura',
  ejecutiva: 'Ejecutiva', hogar: 'Hogar', hieleras: 'Hieleras',
  mochilas: 'Mochilas & Bolsas', tecnologia: 'Tecnología',
  textiles: 'Textiles', varios: 'Varios', kits: 'Kits & Sets',
};

// Tiempos de producción estimados por técnica (días hábiles)
const TECNICA_TIEMPO: Record<string, string> = {
  serigrafia:   '7–10 días',
  tampografia:  '7–10 días',
  laser:        '5–8 días',
  sublimacion:  '8–12 días',
  'dtf-uv':     '5–8 días',
  'dtf-textil': '8–12 días',
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
    : 'Hola SOZO! Quiero cotizar un kit corporativo.';
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

function buildKitWAUrl(items: KitItem[], cantidadKits: number, nombre: string, empresa: string): string {
  const intro = nombre
    ? `Hola SOZO! Soy ${nombre}${empresa ? ` de ${empresa}` : ''}. Quiero cotizar ${cantidadKits} kit${cantidadKits !== 1 ? 's' : ''} personalizados con:`
    : `Hola SOZO! Quiero cotizar ${cantidadKits} kit${cantidadKits !== 1 ? 's' : ''} personalizados con:`;
  const lines = items.map(({ producto: p, cantidad }) =>
    `• ${p.nombre} (${p.modelo})${cantidad > 1 ? ` ×${cantidad}` : ''} por kit`
  );
  const articulos = items.reduce((s, { cantidad }) => s + cantidad, 0);
  const msg = [
    intro,
    ...lines,
    `\nTotal: ${cantidadKits} kits × ${articulos} artículo${articulos !== 1 ? 's' : ''} cada uno`,
  ].join('\n');
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

// ─── Animated counter ────────────────────────────────────────────────────────

function StatCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = Date.now(), dur = 1200;
    const timer = setInterval(() => {
      const t = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.floor((1 - Math.pow(1 - t, 3)) * to));
      if (t >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Process strip ────────────────────────────────────────────────────────────

function ProcessStrip() {
  const steps = [
    { icon: Search,         label: 'Explora el catálogo',     desc: 'Más de 1,300 productos' },
    { icon: Package,        label: 'Arma tu kit o elige',     desc: 'Individual o en conjunto' },
    { icon: MessageCircle,  label: 'Cotiza por WhatsApp',      desc: 'Respuesta en < 2 horas' },
    { icon: Layers,         label: 'Aprueba el arte',          desc: 'Mockup digital gratis' },
    { icon: Truck,          label: 'Producción y entrega',     desc: '7–15 días hábiles' },
  ];
  return (
    <section className="bg-white border-b border-zinc-100 py-8 px-6 overflow-x-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-0 min-w-max mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center text-center w-36">
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 mb-2 flex-shrink-0">
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <p className="font-black text-[11px] text-zinc-900 uppercase tracking-wide leading-tight">{s.label}</p>
                <p className="font-mono text-[9px] text-zinc-400 mt-0.5">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center mx-1 mb-5 flex-shrink-0">
                  <div className="w-6 h-px bg-zinc-200" />
                  <ChevronRight className="w-3 h-3 text-zinc-300 -mx-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Info row (entrega + MOQ) ─────────────────────────────────────────────────

function InfoRow() {
  return (
    <div className="bg-zinc-50 border-b border-zinc-100 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-x-8 gap-y-1 items-center">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span><span className="font-bold text-zinc-700">Producción:</span> 7–15 días hábiles según técnica</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Users className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span><span className="font-bold text-zinc-700">Mínimo:</span> 50 piezas en productos sueltos · Sin mínimo en kits prearmados</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Layers className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
          <span><span className="font-bold text-zinc-700">Mockup digital gratis</span> con tu logo antes de producir</span>
        </div>
      </div>
    </div>
  );
}

// ─── Kit Panel ────────────────────────────────────────────────────────────────

function KitPanel({
  items, cantidadKits, nombre, empresa, onClose, onRemove, onChangeQty, onChangeCantidadKits,
}: {
  items: KitItem[];
  cantidadKits: number;
  nombre: string;
  empresa: string;
  onClose: () => void;
  onRemove: (modelo: string) => void;
  onChangeQty: (modelo: string, delta: number) => void;
  onChangeCantidadKits: (n: number) => void;
}) {
  const totalArticulos = items.reduce((s, { cantidad }) => s + cantidad, 0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-50 bg-white flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-[#FF007F]" />
            <div>
              <h2 className="font-black text-zinc-900 text-sm uppercase tracking-wider">Mi Kit Personalizado</h2>
              <p className="font-mono text-[10px] text-zinc-400">{totalArticulos} tipo{totalArticulos !== 1 ? 's' : ''} de artículo</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cantidad de kits — lo más importante */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-zinc-950 text-white">
            <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-3">
              ¿Cuántos kits necesitas?
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onChangeCantidadKits(Math.max(1, cantidadKits - 10))}
                className="w-9 h-9 flex items-center justify-center border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-colors font-mono text-xs"
              >
                -10
              </button>
              <button
                onClick={() => onChangeCantidadKits(Math.max(1, cantidadKits - 1))}
                className="w-9 h-9 flex items-center justify-center border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  min={1}
                  value={cantidadKits}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1) onChangeCantidadKits(v);
                  }}
                  className="w-full text-center font-black text-3xl bg-transparent text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">kits</p>
              </div>
              <button
                onClick={() => onChangeCantidadKits(cantidadKits + 1)}
                className="w-9 h-9 flex items-center justify-center border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeCantidadKits(cantidadKits + 10)}
                className="w-9 h-9 flex items-center justify-center border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-colors font-mono text-xs"
              >
                +10
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              {[50, 100, 200, 500].map(n => (
                <button
                  key={n}
                  onClick={() => onChangeCantidadKits(n)}
                  className={`flex-1 py-1 font-mono text-[10px] border transition-colors ${
                    cantidadKits === n ? 'border-[#FF007F] text-[#FF007F]' : 'border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm">Tu kit está vacío.</p>
              <p className="text-zinc-300 text-xs mt-1">Agrega productos desde el catálogo.</p>
            </div>
          ) : items.map(({ producto: p, cantidad }) => (
            <div key={p.modelo} className="flex gap-3 items-start">
              <div className="w-16 h-16 flex-shrink-0 bg-zinc-100 relative overflow-hidden">
                {p.imagenes?.[0] ? (
                  <Image src={p.imagenes[0]} alt={p.nombre} fill className="object-cover" sizes="64px" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-zinc-400">{p.modelo}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 leading-tight line-clamp-2">{p.nombre}</p>
                <p className="font-mono text-[10px] text-zinc-400 mt-0.5">{p.modelo}</p>
                <p className="font-mono text-[9px] text-zinc-300 mt-0.5">×{cantidadKits} kit{cantidadKits !== 1 ? 's' : ''} = {cantidad * cantidadKits} pzas</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => onChangeQty(p.modelo, -1)} className="w-6 h-6 flex items-center justify-center border border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-zinc-900 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-sm font-bold text-zinc-900 w-6 text-center">{cantidad}</span>
                  <button onClick={() => onChangeQty(p.modelo, 1)} className="w-6 h-6 flex items-center justify-center border border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-zinc-900 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-[9px] text-zinc-400 ml-1">por kit</span>
                  <button onClick={() => onRemove(p.modelo)} className="ml-auto w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-100 space-y-3">
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>{cantidadKits} kits × {totalArticulos} artículo{totalArticulos !== 1 ? 's' : ''}</span>
              <span className="font-bold text-zinc-900">{cantidadKits * totalArticulos} pzas total</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono border border-zinc-100 px-3 py-2">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>Producción estimada: 10–15 días hábiles · Mockup gratis</span>
            </div>
            <a
              href={buildKitWAUrl(items, cantidadKits, nombre, empresa)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Cotizar {cantidadKits} kit{cantidadKits !== 1 ? 's' : ''} por WhatsApp
            </a>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({ p, nombre, empresa, onClose, onAddToKit, inKit }: {
  p: Producto; nombre: string; empresa: string; onClose: () => void;
  onAddToKit: (p: Producto) => void; inKit: boolean;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs   = p.imagenes ?? [];
  const colores = p.colores ? p.colores.split(' | ').filter(Boolean) : [];
  const isKit   = p.categoria === 'kits';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:px-6 sm:py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white w-full sm:max-w-5xl h-[92vh] sm:h-[82vh] overflow-hidden flex flex-col sm:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Galería ── */}
          <div className="sm:w-1/2 flex-shrink-0 bg-zinc-50 flex flex-col">
            {/* Imagen principal */}
            <div className="relative h-56 sm:h-0 sm:flex-1 overflow-hidden">
              {imgs.length > 0 ? (
                <AnimatePresence>
                  <motion.div key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="absolute inset-0 p-4">
                    <Image src={imgs[imgIdx]} alt={p.nombre} fill className="object-contain" sizes="(max-width: 640px) 100vw, 50vw" />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-3xl font-black text-zinc-300">{p.modelo}</span>
                </div>
              )}
              {imgs.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors z-10">
                    <ChevronLeft className="w-4 h-4 text-zinc-700" />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors z-10">
                    <ChevronRight className="w-4 h-4 text-zinc-700" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="flex gap-1.5 px-3 py-2.5 bg-zinc-100 border-t border-zinc-200 overflow-x-auto flex-shrink-0">
                {imgs.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-12 h-12 relative flex-shrink-0 border-2 transition-all overflow-hidden ${i === imgIdx ? 'border-zinc-900' : 'border-transparent opacity-50 hover:opacity-90'}`}>
                    <Image src={src} alt="" fill className="object-cover" sizes="48px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="sm:w-1/2 flex flex-col min-h-0 flex-1 border-l border-zinc-100">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-zinc-100">
              <div>
                <span className="font-mono text-[9px] font-bold text-[#FF007F] uppercase tracking-widest">{CAT_LABEL[p.categoria] ?? p.categoria}</span>
                <p className="font-mono text-xs text-zinc-400 mt-0.5">{p.modelo}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto min-h-0">
              <h2 className="text-2xl font-black text-zinc-900 leading-tight">{p.nombre}</h2>

              {/* MOQ + entrega — info clave antes de la descripción */}
              {!isKit && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-50 px-3 py-2.5">
                    <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">Mínimo</p>
                    <p className="font-bold text-sm text-zinc-900 mt-0.5">50 piezas</p>
                  </div>
                  <div className="bg-zinc-50 px-3 py-2.5">
                    <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">Producción</p>
                    <p className="font-bold text-sm text-zinc-900 mt-0.5">
                      {p.tecnicas?.[0] ? (TECNICA_TIEMPO[p.tecnicas[0]] ?? '10–15 días') : '10–15 días'}
                    </p>
                  </div>
                </div>
              )}
              {isKit && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-50 px-3 py-2.5">
                    <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">Mínimo</p>
                    <p className="font-bold text-sm text-zinc-900 mt-0.5">Sin mínimo</p>
                  </div>
                  <div className="bg-zinc-50 px-3 py-2.5">
                    <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">Producción</p>
                    <p className="font-bold text-sm text-zinc-900 mt-0.5">10–15 días</p>
                  </div>
                </div>
              )}

              {p.desc && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Descripción</p>
                  <p className="text-zinc-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              )}

              {p.dimensiones && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Dimensiones</p>
                  <p className="text-zinc-900 text-sm font-mono">{p.dimensiones}</p>
                </div>
              )}

              {colores.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Colores disponibles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {colores.map((c) => (
                      <span key={c} className="text-xs px-2.5 py-1 bg-zinc-100 text-zinc-700 font-mono">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Técnicas con descripción y tiempo */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Técnicas de personalización</p>
                <div className="flex flex-col gap-2">
                  {p.tecnicas.map((t) => (
                    <div key={t} className="flex items-start gap-2 border border-zinc-100 px-3 py-2">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">{TECNICA_LABEL[t] ?? t}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{TECNICA_DESC[t] ?? ''}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">Entrega</p>
                        <p className="font-mono text-[10px] font-bold text-zinc-700">{TECNICA_TIEMPO[t] ?? '10–15d'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mockup gratis */}
              <div className="flex items-center gap-2 border border-dashed border-zinc-200 px-3 py-2.5 text-xs text-zinc-500">
                <Layers className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <span>Incluye <strong className="text-zinc-700">mockup digital gratis</strong> con tu logo antes de producir</span>
              </div>
            </div>

            <div className="p-6 pt-0 flex flex-col gap-3">
              {!isKit && (
                <button
                  onClick={() => { onAddToKit(p); onClose(); }}
                  className={`flex items-center justify-center gap-3 w-full py-3 font-black text-sm uppercase tracking-wider transition-colors border-2 ${
                    inKit
                      ? 'border-[#FF007F] text-[#FF007F] hover:bg-[#FF007F] hover:text-white'
                      : 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  {inKit ? 'Agregar otro al kit' : 'Agregar al kit'}
                </button>
              )}
              <a
                href={buildWAUrl(p, nombre, empresa)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-sm uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {isKit ? 'Cotizar este set' : 'Cotizar por WhatsApp'}
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ p, index, onOpen, onAddToKit, inKit }: {
  p: Producto; index: number; onOpen: () => void;
  onAddToKit: (p: Producto) => void; inKit: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const imgs = p.imagenes ?? [];
  const isKit = p.categoria === 'kits';

  // Precarga la imagen al tamaño del modal en cuanto el usuario hace hover
  // Así cuando hace click ya está en caché y el modal abre instantáneo
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (imgs[0]) {
      const img = new window.Image();
      img.src = `/_next/image?url=${encodeURIComponent(imgs[0])}&w=1080&q=75`;
    }
  }, [imgs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-3 cursor-pointer" onClick={onOpen}>
        {imgs.length > 0 ? (
          <>
            <Image src={imgs[0]} alt={p.nombre} fill className={`object-cover transition-all duration-500 ${hovered ? 'scale-105' : 'scale-100'}`} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            {imgs[1] && (
              <Image src={imgs[1]} alt={p.nombre} fill className={`object-cover absolute inset-0 transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
            <span className="font-mono text-xl font-black text-zinc-300">{p.modelo}</span>
          </div>
        )}

        <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.15 }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center">
          <ZoomIn className="w-4 h-4 text-zinc-700" />
        </motion.div>

        <div className="absolute top-3 left-3">
          <span className="font-mono text-[9px] font-bold bg-white/90 text-zinc-700 px-2 py-0.5">{p.modelo}</span>
        </div>

        {!isKit && (
          <motion.button
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => { e.stopPropagation(); onAddToKit(p); }}
            className={`absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
              inKit ? 'bg-[#FF007F] text-white' : 'bg-white/95 text-zinc-900 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Plus className="w-3 h-3" />
            {inKit ? 'En mi kit' : 'Agregar al kit'}
          </motion.button>
        )}
      </div>

      <div className="px-1">
        <h3 onClick={onOpen} className={`font-bold text-sm text-zinc-900 leading-snug transition-colors duration-200 cursor-pointer ${hovered ? 'text-[#FF007F]' : ''}`}>
          {p.nombre}
        </h3>
        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{p.desc}</p>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {p.tecnicas.slice(0, 2).map((t) => (
            <span key={t} className="text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-400 border border-zinc-200 px-1.5 py-0.5">
              {TECNICA_LABEL[t] ?? t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
    .reduce<(number | '…')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-16">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="w-10 h-10 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) => p === '…'
        ? <span key={`el-${i}`} className="text-zinc-300 px-1">…</span>
        : <button key={p} onClick={() => onChange(p as number)} className={`w-10 h-10 font-mono text-xs font-bold border transition-colors ${p === page ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'}`}>{p}</button>
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === Math.ceil(total / pageSize)} className="w-10 h-10 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CatalogoContent() {
  const params  = useSearchParams();
  const nombre  = params.get('nombre')  ?? '';
  const empresa = params.get('empresa') ?? '';
  const expo    = params.get('expo')    ?? '';

  const [activeCategory, setActiveCategory] = useState('todos');
  const [search, setSearch]                 = useState('');
  const [page, setPage]                     = useState(1);
  const [selected, setSelected]             = useState<Producto | null>(null);
  const [kitItems, setKitItems]             = useState<Map<string, KitItem>>(new Map());
  const [kitOpen, setKitOpen]               = useState(false);
  const [kitFlash, setKitFlash]             = useState(false);
  const [cantidadKits, setCantidadKits]     = useState(100);

  const [tecnicas, setTecnicas]     = useState<Tecnica[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [paginated, setPaginated]   = useState<Producto[]>([]);
  const [totalFiltered, setTotal]   = useState(0);
  const [totalProducts, setTotalProducts] = useState(6731);
  const [loading, setLoading]       = useState(false);
  const [, startTransition]         = useTransition();

  // Fetch metadata once
  useEffect(() => {
    fetch('/api/products?meta=1')
      .then(r => r.json())
      .then(d => {
        setTecnicas(d.tecnicas);
        setCategorias(d.categorias);
        setTotalProducts(d.total);
      });
  }, []);

  // Fetch current page whenever filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      category: activeCategory,
      search,
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(d => {
        startTransition(() => {
          setPaginated(d.products);
          setTotal(d.total);
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  }, [activeCategory, search, page]);

  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToKit = useCallback((p: Producto) => {
    setKitItems(prev => {
      const next = new Map(prev);
      const ex   = next.get(p.modelo);
      next.set(p.modelo, { producto: p, cantidad: (ex?.cantidad ?? 0) + 1 });
      return next;
    });
    setKitFlash(true);
    setTimeout(() => setKitFlash(false), 600);
  }, []);

  const handleRemoveFromKit   = useCallback((modelo: string) => setKitItems(prev => { const n = new Map(prev); n.delete(modelo); return n; }), []);
  const handleChangeQty       = useCallback((modelo: string, delta: number) => {
    setKitItems(prev => {
      const n = new Map(prev), item = n.get(modelo);
      if (!item) return prev;
      const q = item.cantidad + delta;
      if (q <= 0) n.delete(modelo); else n.set(modelo, { ...item, cantidad: q });
      return n;
    });
  }, []);

  const kitList  = [...kitItems.values()];
  const kitCount = kitList.reduce((s, { cantidad }) => s + cantidad, 0);
  const expoTag  = expo ? `[${expo.toUpperCase().replace(/\s+/g, '_')}]` : '[CATÁLOGO_2026]';

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased font-sans">

      {/* HERO */}
      <section className="relative bg-zinc-950 text-white overflow-hidden pt-14">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF007F]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="flex justify-center mb-10">
            <Image src="/sozo-logo.png" alt="SOZO" width={120} height={40} className="h-9 w-auto brightness-0 invert" priority />
          </div>
          <span className="inline-block font-mono text-[10px] font-bold text-[#FF007F] tracking-widest uppercase mb-6 border border-[#FF007F]/30 px-4 py-1.5">{expoTag}</span>
          {nombre ? (
            <>
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
                Hola, <span className="text-white">{nombre}</span>{empresa && <span className="text-zinc-600"> · {empresa}</span>}
              </p>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-5">ESTO ES <span className="text-[#FF007F]">SOZO.</span></h1>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">Preparamos este catálogo para ti. Explora y cotiza directo.</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-5">CATÁLOGO <span className="text-[#FF007F]">CORPORATIVO.</span></h1>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">Más de 6,700 productos personalizables. Producción y envío desde CDMX.</p>
            </>
          )}
          <div className="flex items-center justify-center gap-12 sm:gap-20 mt-14">
            {[{ to: totalProducts, suffix: '+', label: 'Productos' }, { to: 6, suffix: '', label: 'Técnicas' }, { to: 11, suffix: '', label: 'Categorías' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-white tabular-nums"><StatCounter to={s.to} suffix={s.suffix} /></p>
                <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-800 overflow-hidden">
          <motion.div className="flex whitespace-nowrap py-4" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, ease: 'linear', repeat: Infinity }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex">
                {tecnicas.map(t => (
                  <span key={t.id} className="inline-flex items-center gap-5 px-8 font-mono text-xs font-bold text-zinc-600 uppercase tracking-widest">
                    {t.nombre}<span className="w-1 h-1 bg-[#FF007F] rounded-full flex-shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESO */}
      <ProcessStrip />

      {/* KIT BUILDER BANNER */}
      <section className="bg-zinc-900 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-widest mb-2">Nuevo · Kit Builder</p>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">¿No encuentras el kit ideal?<br /><span className="text-[#FF007F]">Arma el tuyo.</span></h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-md">Elige los productos, define cuántos kits necesitas y cotiza en segundos.</p>
          </div>
          <button onClick={() => setKitOpen(true)} className="flex-shrink-0 flex items-center gap-3 px-8 py-4 bg-[#FF007F] hover:bg-[#e0006f] text-white font-black text-sm uppercase tracking-wider transition-colors">
            <Package className="w-5 h-5" />
            Ver mi kit {kitCount > 0 && `(${kitCount})`}
          </button>
        </div>
      </section>

      {/* INFO ROW */}
      <InfoRow />

      {/* CATÁLOGO */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o modelo..." className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 focus:outline-none focus:border-zinc-900 transition-colors bg-white placeholder-zinc-400" />
            </div>
            <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest sm:ml-auto">
              {totalFiltered.toLocaleString()} producto{totalFiltered !== 1 ? 's' : ''}{search && ` · "${search}"`}
            </p>
          </div>

          <div className="flex gap-0 overflow-x-auto mb-12 border-b border-zinc-100">
            {[{ id: 'todos', nombre: 'Todos' }, ...categorias].map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`flex-shrink-0 pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px whitespace-nowrap ${activeCategory === c.id ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'}`}>
                {c.nombre}
              </button>
            ))}
          </div>

          <div className={`relative transition-opacity duration-150 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            {paginated.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                {paginated.map((p, i) => (
                  <ProductCard
                    key={p.id} p={p} index={i}
                    onOpen={() => setSelected(p)}
                    onAddToKit={handleAddToKit}
                    inKit={p.categoria !== 'kits' && kitItems.has(p.modelo)}
                  />
                ))}
              </div>
            ) : !loading ? (
              <div className="text-center py-24">
                <p className="text-zinc-400 text-sm">Sin resultados para &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-zinc-100 mb-3" />
                    <div className="h-4 bg-zinc-100 rounded mb-1.5 w-3/4" />
                    <div className="h-3 bg-zinc-50 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalFiltered > PAGE_SIZE && <p className="text-center font-mono text-[10px] text-zinc-400 uppercase tracking-widest mt-10">Página {page} de {Math.ceil(totalFiltered / PAGE_SIZE)}</p>}
          <Pagination page={page} total={totalFiltered} pageSize={PAGE_SIZE} onChange={handlePageChange} />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-zinc-950 text-white">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">¿LISTO PARA<br /><span className="text-[#FF007F]">TU KIT?</span></h2>
            <p className="text-zinc-500 text-base mb-10 leading-relaxed">Cuéntanos tu proyecto. Respuesta en menos de 24 hrs.</p>
            <div className="flex flex-col gap-3">
              <a href={buildGeneralWAUrl(nombre, empresa)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF007F] hover:bg-[#e0006f] text-white font-black text-sm uppercase tracking-wider transition-colors">
                <MessageCircle className="w-5 h-5" />Iniciar cotización por WhatsApp
              </a>
              <a href="mailto:ventas@sozo.com.mx" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-zinc-500 hover:text-white font-bold text-sm uppercase tracking-wider border border-zinc-800 hover:border-zinc-600 transition-all">
                <Mail className="w-4 h-4" />ventas@sozo.com.mx
              </a>
            </div>
            <p className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest mt-10">Ciudad de México · Envíos nacionales</p>
          </motion.div>
        </div>
      </section>

      {/* FLOATING KIT */}
      <AnimatePresence>
        {kitCount > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: kitFlash ? 1.12 : 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            onClick={() => setKitOpen(true)}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-sm uppercase tracking-wider shadow-xl transition-colors"
          >
            <Package className="w-4 h-4" />
            Mi kit
            <span className="bg-[#FF007F] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">{kitCount}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* FLOATING WA */}
      <motion.a href={buildGeneralWAUrl(nombre, empresa)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.5, type: 'spring', bounce: 0.4 }} className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] transition-colors">
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.a>

      {/* MODALS */}
      {selected && (
        <ProductModal p={selected} nombre={nombre} empresa={empresa} onClose={() => setSelected(null)} onAddToKit={handleAddToKit} inKit={selected.categoria !== 'kits' && kitItems.has(selected.modelo)} />
      )}
      {kitOpen && (
        <KitPanel items={kitList} cantidadKits={cantidadKits} nombre={nombre} empresa={empresa} onClose={() => setKitOpen(false)} onRemove={handleRemoveFromKit} onChangeQty={handleChangeQty} onChangeCantidadKits={setCantidadKits} />
      )}
    </div>
  );
}
