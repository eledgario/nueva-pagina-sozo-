'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export interface SolutionHeroProps {
  tag: string;
  title: string;
  titleAccent: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  stats?: { value: string; label: string }[];
  ctaText?: string;
  ctaHref?: string;
}

export default function SolutionHero({
  tag,
  title,
  titleAccent,
  description,
  imageUrl,
  accentColor,
  stats,
  ctaText = 'Cotizar Ahora',
  ctaHref = '#configurator',
}: SolutionHeroProps) {
  return (
    <section className="relative min-h-[90vh] bg-zinc-950 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-[90vh] flex flex-col justify-center">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/#solutions"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Todas las Soluciones
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {tag}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6"
            >
              {title}
              <br />
              <span style={{ color: accentColor }}>{titleAccent}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg"
            >
              {description}
            </motion.p>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-8 mb-10"
              >
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p
                      className="text-3xl font-black"
                      style={{ color: accentColor }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-zinc-500 text-sm font-mono">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/5215512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/20"
              >
                Hablar con Ventas
              </a>
            </motion.div>
          </div>

          {/* Right - Featured Image/Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div
              className="relative aspect-square rounded-3xl overflow-hidden border-2"
              style={{ borderColor: `${accentColor}50` }}
            >
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              />
              {/* Floating Badge */}
              <div
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-md"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <p className="text-white font-bold text-lg">{titleAccent}</p>
                <p className="text-white/70 text-sm">
                  Soluciones llave en mano
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-50 to-transparent" />
    </section>
  );
}
