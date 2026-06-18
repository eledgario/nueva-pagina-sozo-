'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

// ─── Custom SVG Illustrations ────────────────────────────────────────────────

function TruckSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 130" fill="none" className={className}>
      {/* Trailer body */}
      <rect x="8" y="30" width="115" height="65" rx="3" stroke="currentColor" strokeWidth="2"/>
      {/* Cab */}
      <path d="M123 30 L158 30 L175 58 L175 95 L123 95 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      {/* Windshield */}
      <path d="M127 34 L152 34 L164 56 L127 56 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6"/>
      {/* Door */}
      <line x1="127" y1="56" x2="127" y2="93" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="130" cy="75" r="2" fill="currentColor" opacity="0.6"/>
      {/* Undercarriage */}
      <line x1="8" y1="95" x2="175" y2="95" stroke="currentColor" strokeWidth="1.5"/>
      {/* Front wheels */}
      <circle cx="148" cy="108" r="16" stroke="currentColor" strokeWidth="2"/>
      <circle cx="148" cy="108" r="7" stroke="currentColor" strokeWidth="1.5"/>
      {/* Rear wheels */}
      <circle cx="38" cy="108" r="16" stroke="currentColor" strokeWidth="2"/>
      <circle cx="38" cy="108" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="62" cy="108" r="16" stroke="currentColor" strokeWidth="2"/>
      <circle cx="62" cy="108" r="7" stroke="currentColor" strokeWidth="1.5"/>
      {/* Exhaust pipe */}
      <line x1="168" y1="30" x2="168" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Logo dashed area */}
      <rect x="22" y="42" width="87" height="40" rx="2" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.5"/>
    </svg>
  );
}

function CupSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className}>
      {/* Cup body */}
      <path d="M35 55 L42 135 L118 135 L125 55 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      {/* Rim ellipse */}
      <ellipse cx="80" cy="55" rx="45" ry="12" stroke="currentColor" strokeWidth="2"/>
      {/* Handle */}
      <path d="M125 75 Q152 75 152 95 Q152 118 125 118" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Saucer */}
      <ellipse cx="80" cy="140" rx="55" ry="10" stroke="currentColor" strokeWidth="1.5"/>
      {/* Steam */}
      <path d="M60 42 Q65 28 58 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M80 40 Q86 24 80 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M100 42 Q106 28 100 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Logo dashed area */}
      <ellipse cx="80" cy="97" rx="30" ry="22" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.5"/>
    </svg>
  );
}

function HouseSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className}>
      {/* Main house body */}
      <rect x="30" y="80" width="140" height="75" rx="2" stroke="currentColor" strokeWidth="2"/>
      {/* Roof */}
      <path d="M15 82 L100 20 L185 82 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      {/* Door */}
      <rect x="82" y="115" width="36" height="40" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="88" cy="137" r="2.5" fill="currentColor" opacity="0.7"/>
      {/* Windows */}
      <rect x="42" y="95" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="58" y1="95" x2="58" y2="123" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <line x1="42" y1="109" x2="74" y2="109" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <rect x="126" y="95" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="142" y1="95" x2="142" y2="123" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <line x1="126" y1="109" x2="158" y2="109" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      {/* Chimney */}
      <rect x="130" y="28" width="18" height="35" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      {/* Logo on facade */}
      <rect x="50" y="85" width="100" height="8" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
    </svg>
  );
}

function AirplaneSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 140" fill="none" className={className}>
      {/* Fuselage */}
      <path d="M20 72 Q60 55 140 68 Q175 70 200 72 Q175 74 140 78 Q60 85 20 72 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      {/* Main wing */}
      <path d="M75 70 L55 30 L105 52 L115 70 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M75 74 L55 112 L105 90 L115 74 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      {/* Tail wing */}
      <path d="M25 68 L15 45 L42 58 L45 69 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M25 76 L15 98 L42 85 L45 75 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Windows strip */}
      <line x1="90" y1="68" x2="175" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.5"/>
      {/* Nose */}
      <path d="M190 70 Q205 70 210 72 Q205 74 190 74" stroke="currentColor" strokeWidth="1.5"/>
      {/* Engine */}
      <ellipse cx="88" cy="58" rx="10" ry="5" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="88" cy="84" rx="10" ry="5" stroke="currentColor" strokeWidth="1.5"/>
      {/* Logo dashed area */}
      <rect x="110" y="60" width="65" height="20" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
    </svg>
  );
}

function DumbbellSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className}>
      {/* Bar */}
      <rect x="65" y="44" width="70" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      {/* Left collar */}
      <rect x="48" y="38" width="17" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      {/* Left weights */}
      <rect x="12" y="26" width="22" height="48" rx="4" stroke="currentColor" strokeWidth="2"/>
      <rect x="34" y="30" width="14" height="40" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      {/* Right collar */}
      <rect x="135" y="38" width="17" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      {/* Right weights */}
      <rect x="152" y="30" width="14" height="40" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="166" y="26" width="22" height="48" rx="4" stroke="currentColor" strokeWidth="2"/>
      {/* Logo dashed area on bar */}
      <rect x="75" y="46" width="50" height="8" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
    </svg>
  );
}

// ─── Showcase data ────────────────────────────────────────────────────────────

const showcases = [
  {
    id: 'logistica',
    industria: 'Logística & Transporte',
    objeto: 'Tu camioneta, en miniatura',
    detalle: 'Con el modelo de tu flota, color y número económico. Cada repartidor recibe la suya.',
    tag: 'TRANSPORTE',
    SVG: TruckSVG,
  },
  {
    id: 'fb',
    industria: 'Café & Restaurantes',
    objeto: 'Tu taza icónica, en 3D',
    detalle: 'El vaso o taza que ya identifica tu local, hecho merch coleccionable.',
    tag: 'F&B',
    SVG: CupSVG,
  },
  {
    id: 'real-estate',
    industria: 'Real Estate & Construcción',
    objeto: 'Tu desarrollo, en maqueta',
    detalle: 'La casa o edificio más esperado, branded y listo para regalar en el cierre.',
    tag: 'REAL ESTATE',
    SVG: HouseSVG,
  },
  {
    id: 'aerolineas',
    industria: 'Aerolíneas & Viajes',
    objeto: 'Tu avión, en escala',
    detalle: 'Cada aeronave de tu flota replicada. Coleccionable para clientes frecuentes.',
    tag: 'TRAVEL',
    SVG: AirplaneSVG,
  },
  {
    id: 'fitness',
    industria: 'Fitness & Wellness',
    objeto: 'Mancuernas con tu logo',
    detalle: 'El objeto que define tu industria, personalizado para tu comunidad.',
    tag: 'FITNESS',
    SVG: DumbbellSVG,
  },
];

const otrosEjemplos = [
  'Farmacéutica → Cápsulas y moléculas',
  'Tech → Chips y circuitos',
  'Música → Instrumentos y notas',
  'Retail → Tu producto best-seller',
  'Energía → Turbinas y rayos',
  'Educación → Togas y diplomas',
  'Agro → Tractores y semillas',
  'Salud → Instrumental médico',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Impresion3D() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6 bg-zinc-950 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-3xl"
        >
          <span className="font-mono text-[10px] font-bold text-[#FF007F] uppercase tracking-widest">
            [IMPRESIÓN_3D]
          </span>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mt-4 mb-6 tracking-tight leading-none text-white">
            CADA MARCA<br />
            <span className="text-[#FF007F]">TIENE SU OBJETO.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            ¿Qué símbolo identifica a tu empresa?
            Sea un camión, una taza, un edificio o lo que sea —
            lo diseñamos en 3D y lo convertimos en el merch
            que <span className="text-white font-semibold">nadie más va a tener.</span>
          </p>
        </motion.div>

        {/* Main showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Left: tabs */}
          <div className="flex flex-col gap-2">
            {showcases.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className={`text-left px-5 py-4 border transition-all ${
                  active === i
                    ? 'border-[#FF007F] bg-[#FF007F]/5'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${active === i ? 'text-[#FF007F]' : 'text-zinc-600'}`}>
                      {s.tag}
                    </span>
                    <p className={`font-black text-sm mt-0.5 ${active === i ? 'text-white' : 'text-zinc-400'}`}>
                      {s.industria}
                    </p>
                  </div>
                  <motion.span
                    animate={{ x: active === i ? 0 : -4, opacity: active === i ? 1 : 0 }}
                    className="text-[#FF007F] font-bold text-lg"
                  >
                    →
                  </motion.span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right: visual panel */}
          <div className="relative bg-zinc-900 border border-zinc-800 flex flex-col min-h-[420px] lg:min-h-0">

            <AnimatePresence mode="wait">
              {showcases.map((s, i) =>
                active === i ? (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full p-8"
                  >
                    {/* Tag */}
                    <span className="font-mono text-[9px] font-bold text-[#FF007F] uppercase tracking-widest mb-4">
                      [{s.tag}]
                    </span>

                    {/* SVG Illustration */}
                    <div className="flex-1 flex items-center justify-center py-6">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="w-full max-w-xs text-[#FF007F]"
                      >
                        <s.SVG className="w-full h-auto drop-shadow-[0_0_24px_rgba(255,0,127,0.2)]" />
                      </motion.div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-zinc-800 pt-6 mt-4">
                      <h3 className="text-2xl font-black text-white mb-2">{s.objeto}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{s.detalle}</p>
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>

            {/* Corner label */}
            <div className="absolute top-4 right-4">
              <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
                ÁREA_LOGO →
              </span>
            </div>
          </div>
        </div>

        {/* Other examples ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-zinc-800 bg-zinc-900 overflow-hidden mb-12"
        >
          <div className="flex items-center gap-0 divide-x divide-zinc-800 overflow-x-auto">
            <div className="flex-shrink-0 px-5 py-3 bg-zinc-800">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                + TAMBIÉN
              </span>
            </div>
            {otrosEjemplos.map((e) => (
              <div key={e} className="flex-shrink-0 px-5 py-3">
                <span className="font-mono text-xs text-zinc-500 whitespace-nowrap">{e}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Process + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* 4 steps */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-zinc-800 divide-y divide-zinc-800"
          >
            {[
              { step: '01', label: 'Nos cuentas qué te identifica', sub: 'Logo, mascota, producto, vehículo...' },
              { step: '02', label: 'Diseñamos el modelo 3D', sub: 'Render + validación contigo' },
              { step: '03', label: 'Imprimimos y terminamos', sub: 'Pintura, acabado y empaque' },
              { step: '04', label: 'Entregamos en todo México', sub: 'Same-day CDMX · Nacional' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-4 px-6 py-4 bg-zinc-900">
                <span className="font-mono text-xs font-bold text-[#FF007F] w-6 flex-shrink-0">{s.step}</span>
                <div>
                  <p className="text-white font-bold text-sm">{s.label}</p>
                  <p className="text-zinc-600 text-xs font-mono">{s.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-[#FF007F]/30 bg-[#FF007F]/5 p-8 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[9px] font-bold text-[#FF007F] uppercase tracking-widest">
                [DISEÑO_PERSONALIZADO]
              </span>
              <h3 className="text-3xl font-black text-white mt-3 mb-3 leading-tight">
                ¿Ya sabes qué<br />objeto te representa?
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Mándanos una foto, un boceto o solo cuéntanos la idea.
                Nosotros hacemos el diseño 3D sin costo extra.
              </p>
            </div>
            <a
              href="https://wa.me/5637929344?text=Hola%20SOZO!%20Quiero%20cotizar%20merch%20personalizado%20en%203D%20para%20mi%20marca."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF007F] hover:bg-[#e0006f] text-white font-black text-sm uppercase tracking-wider border-4 border-[#FF007F] shadow-[4px_4px_0px_0px_rgba(255,0,127,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(255,0,127,0.3)] transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Diseña tu merch 3D
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
