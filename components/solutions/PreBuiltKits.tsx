'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, Check, ArrowRight, Sparkles } from 'lucide-react';

export interface KitItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  contents: string[];
  priceRange: string;
  badge?: string;
  badgeColor?: string;
  popular?: boolean;
}

interface PreBuiltKitsProps {
  title?: string;
  subtitle?: string;
  kits: KitItem[];
  accentColor?: string;
}

function KitCard({
  kit,
  index,
  accentColor,
}: {
  kit: KitItem;
  index: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-white rounded-3xl border-2 overflow-hidden group hover:shadow-2xl transition-all duration-500 ${
        kit.popular ? 'border-[#FF007F] shadow-lg shadow-[#FF007F]/10' : 'border-zinc-200 hover:border-zinc-300'
      }`}
    >
      {/* Popular Badge */}
      {kit.popular && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-[#FF007F] text-white text-xs font-bold uppercase rounded-full">
          <Sparkles className="w-3 h-3" />
          Mas Popular
        </div>
      )}

      {/* Custom Badge */}
      {kit.badge && !kit.popular && (
        <div
          className="absolute top-4 right-4 z-20 px-3 py-1.5 text-white text-xs font-bold uppercase rounded-full"
          style={{ backgroundColor: kit.badgeColor || accentColor }}
        >
          {kit.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
        <Image
          src={kit.imageUrl}
          alt={kit.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-black text-zinc-900">{kit.name}</h3>
            <p className="text-zinc-500 text-sm">{kit.description}</p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

        {/* Contents List */}
        <div className="mb-6">
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
            Incluye:
          </p>
          <ul className="space-y-2">
            {kit.contents.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-600">
                <Check
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: accentColor }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <div>
            <p className="text-xs text-zinc-400 font-mono">Desde</p>
            <p
              className="text-2xl font-black"
              style={{ color: accentColor }}
            >
              {kit.priceRange}
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm rounded-full transition-colors group/btn"
            style={{
              ['--hover-bg' as string]: accentColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#18181b';
            }}
          >
            Cotizar
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PreBuiltKits({
  title = 'Kits Pre-Armados',
  subtitle = 'Soluciones listas para enviar. Elige, personaliza y listo.',
  kits,
  accentColor = '#FF007F',
}: PreBuiltKitsProps) {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="font-mono text-sm font-bold mb-4 block"
            style={{ color: accentColor }}
          >
            [KITS_LISTOS]
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Kits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kits.map((kit, index) => (
            <KitCard
              key={kit.id}
              kit={kit}
              index={index}
              accentColor={accentColor}
            />
          ))}
        </div>

        {/* Custom Kit CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-500 mb-4">
            ¿Necesitas algo diferente?
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 border-2 rounded-full font-bold transition-all hover:text-white"
            style={{ borderColor: accentColor, color: accentColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = accentColor;
            }}
          >
            Crear Kit Personalizado
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
