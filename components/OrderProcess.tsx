'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Pen, Factory, Rocket, Shield } from 'lucide-react';

interface Phase {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const phases: Phase[] = [
  {
    number: '01',
    title: 'DISEÑA',
    subtitle: 'Elige tu Arsenal',
    description:
      'Selecciona los productos de nuestro catálogo curado. Creamos mockups de alta fidelidad con tu marca antes de producir.',
    icon: Pen,
    color: '#FF007F',
  },
  {
    number: '02',
    title: 'ALMACENA',
    subtitle: 'Tu Stock en CDMX',
    description:
      'Producimos tu lote con manufactura híbrida y lo resguardamos en nuestra bodega. Inventario seguro, listo para salir.',
    icon: Factory,
    color: '#FF007F',
  },
  {
    number: '03',
    title: 'DESPLIEGA',
    subtitle: 'Envíos el Mismo Día',
    description:
      'Contrataste a alguien nuevo? Avísanos. Enviamos el kit directo a su puerta. Same-Day en CDMX, Nacional en 48hrs.',
    icon: Rocket,
    color: '#FF007F',
  },
];

export default function OrderProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={containerRef} className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [ASÍ_FUNCIONA]
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-zinc-900">
            TU BODEGA
            <br />
            <span className="text-[#FF007F]">VIRTUAL</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed">
            De la idea a la puerta de tu equipo.{' '}
            <span className="text-zinc-900 font-bold">Diseña → Almacena → Despliega.</span>
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Connector Line (Mobile/Tablet) */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-zinc-200 md:hidden" />

          {/* Animated Progress Line (Mobile) */}
          <motion.div
            className="absolute left-8 top-0 w-1 bg-gradient-to-b from-[#FF007F] to-transparent md:hidden"
            style={{
              height: useTransform(scrollYProgress, [0, 0.5], ['0%', '100%']),
            }}
          />

          {/* Horizontal Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1">
            <div className="relative w-full h-full">
              {/* Base Line */}
              <div className="absolute inset-0 bg-zinc-200" />

              {/* Animated Progress Line */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FF007F] via-[#FF007F] to-transparent origin-left"
                style={{
                  scaleX: useTransform(scrollYProgress, [0.1, 0.6], [0, 1]),
                }}
              />
            </div>
          </div>

          {/* Phases Grid */}
          <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Card Container */}
                  <div className="relative pl-24 md:pl-0 md:pt-32">
                    {/* Icon Circle (Timeline Dot) */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3, type: 'spring', bounce: 0.5 }}
                      className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2 md:top-0 z-20"
                    >
                      <div className="relative">
                        {/* Outer Glow Ring */}
                        <motion.div
                          className="absolute inset-0 w-16 h-16 rounded-full bg-[#FF007F]/20 blur-xl"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.3,
                          }}
                        />

                        {/* Icon Container */}
                        <div className="relative w-16 h-16 bg-[#FF007F] rounded-full border-4 border-white flex items-center justify-center shadow-lg shadow-[#FF007F]/30">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Phase Number Badge */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-[#FF007F] rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-black text-[#FF007F]">{phase.number}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Content Card */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                      className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 hover:border-[#FF007F]/50 transition-all group shadow-xl shadow-zinc-200/50"
                    >
                      {/* Pink Accent on Hover */}
                      <div className="absolute inset-0 rounded-3xl bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-all pointer-events-none" />

                      {/* Title Section */}
                      <div className="relative mb-4">
                        <h3 className="text-3xl font-black mb-1 tracking-tight text-zinc-900">{phase.title}</h3>
                        <p className="text-sm font-mono font-bold text-[#FF007F] uppercase tracking-wider">
                          {phase.subtitle}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="w-12 h-1 bg-[#FF007F] mb-4" />

                      {/* Description */}
                      <p className="font-mono text-sm text-zinc-500 leading-relaxed">{phase.description}</p>

                      {/* Bottom Accent */}
                      <div className="mt-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#FF007F] rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400 uppercase">Phase {phase.number}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Trust Badge Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          {/* Divider */}
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 py-2 bg-white text-xs font-mono font-bold text-zinc-500 uppercase border-2 border-zinc-200 rounded-full">
                Garantía
              </span>
            </div>
          </div>

          {/* Trust Badge Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="relative bg-zinc-50 rounded-3xl border-2 border-[#FF007F] p-8 md:p-10 overflow-hidden shadow-xl shadow-zinc-200/50">
              {/* Content */}
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FF007F] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF007F]/30">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-2 text-zinc-900">Control Total de Inventario</h3>
                  <p className="font-mono text-sm text-zinc-500">
                    Monitorea tu stock en tiempo real vía{' '}
                    <span className="text-[#FF007F] font-bold">WhatsApp</span> o{' '}
                    <span className="text-[#FF007F] font-bold">Dashboard</span>. Sin sorpresas, sin fricción.
                  </p>
                </div>

                {/* Badge */}
                <div className="flex-shrink-0">
                  <div className="px-4 py-2 bg-white border-2 border-[#FF007F] rounded-full shadow-md">
                    <span className="text-xs font-black text-[#FF007F] uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
