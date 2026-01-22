'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface SolutionCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  tagColor: string;
  imageUrl: string;
  href: string;
  gridClass: string;
}

const solutions: SolutionCard[] = [
  {
    id: 'teams',
    title: 'TEAMS &',
    subtitle: 'ONBOARDING',
    description: 'Equipa a tu fuerza laboral. Kits de bienvenida, aniversarios y cultura remota.',
    tag: 'Incluye Almacenaje',
    tagColor: '#FF007F',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop',
    href: '/solutions/teams',
    gridClass: 'md:col-span-2 md:row-span-1',
  },
  {
    id: 'events',
    title: 'MASSIVE',
    subtitle: 'EVENTS',
    description: 'Volumen para conferencias y expos. 500+ unidades con precios escalonados.',
    tag: 'Precios de Mayoreo',
    tagColor: '#06b6d4',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop',
    href: '/solutions/massive',
    gridClass: 'md:col-span-1 md:row-span-2',
  },
  {
    id: 'gifting',
    title: 'CLIENT',
    subtitle: 'GIFTING',
    description: 'Cierra tratos. Regalos ejecutivos de alto impacto que sí se recuerdan.',
    tag: 'Premium Unboxing',
    tagColor: '#8b5cf6',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
    href: '/solutions/vip',
    gridClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'social',
    title: 'SOCIAL',
    subtitle: 'STUDIO',
    description: 'Bodas, Hangovers y Fiestas. Tu evento con diseño de autor.',
    tag: 'Diseño a Medida',
    tagColor: '#f59e0b',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',
    href: '/solutions/social',
    gridClass: 'md:col-span-1 md:row-span-1',
  },
];

function SolutionCardComponent({ solution, index }: { solution: SolutionCard; index: number }) {
  const isLarge = solution.id === 'teams';
  const isTall = solution.id === 'events';

  return (
    <Link href={solution.href} className={solution.gridClass}>
      <motion.div
        className="group relative overflow-hidden rounded-3xl bg-white border border-zinc-200 cursor-pointer h-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
      >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={solution.imageUrl}
          alt={solution.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/70 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col justify-between ${isLarge ? 'p-8 md:p-10' : isTall ? 'p-6 md:p-8' : 'p-6'}`} style={{ minHeight: isTall ? '500px' : isLarge ? '320px' : '280px' }}>
        {/* Top - Tag */}
        <div className="flex items-start justify-between">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
            style={{ backgroundColor: solution.tagColor }}
          >
            {solution.tag}
          </span>

          {/* Arrow Icon */}
          <motion.div
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
            whileHover={{ rotate: 45, backgroundColor: 'rgba(255,255,255,0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
          </motion.div>
        </div>

        {/* Bottom - Title & Description */}
        <div>
          <h3 className={`font-black text-white leading-[0.9] tracking-tight mb-3 ${isLarge ? 'text-4xl md:text-5xl lg:text-6xl' : isTall ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
            {solution.title}
            <br />
            <span style={{ color: solution.tagColor }}>{solution.subtitle}</span>
          </h3>

          <p className={`text-white/70 leading-relaxed ${isLarge ? 'text-base md:text-lg max-w-md' : 'text-sm'}`}>
            {solution.description}
          </p>

          {/* CTA Text - shows on hover */}
          <motion.div
            className="mt-4 flex items-center gap-2 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white font-bold text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explorar Solución
            </span>
            <motion.div
              className="w-0 group-hover:w-6 overflow-hidden transition-all duration-300"
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 2px ${solution.tagColor}`,
        }}
      />
      </motion.div>
    </Link>
  );
}

export default function SolutionsGrid() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-zinc-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [VERTICALES_DE_NEGOCIO]
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
            UNA SOLUCIÓN
            <br />
            <span className="text-[#FF007F]">PARA CADA MOMENTO</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Desde el primer día de tu nuevo empleado hasta el evento más grande del año.{' '}
            <span className="text-zinc-900 font-semibold">Tenemos el kit perfecto.</span>
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div id="solutions" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {solutions.map((solution, index) => (
            <SolutionCardComponent key={solution.id} solution={solution} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-500 font-mono text-sm mb-4">
            ¿No encajas en ninguna categoría?
          </p>
          <button className="px-8 py-4 bg-white border-2 border-zinc-200 hover:border-[#FF007F] rounded-full font-bold text-zinc-900 transition-all group shadow-sm hover:shadow-md">
            <span className="group-hover:text-[#FF007F] transition-colors">
              Crear Proyecto Custom
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
