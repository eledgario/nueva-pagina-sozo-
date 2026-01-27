'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Package } from 'lucide-react';

export interface SolutionHeroProps {
  // New simplified props
  title: string;
  subtitle: string;
  image: string;
  category: string;
  accentColor?: string;
  moq?: number;
  ctaText?: string;
  ctaHref?: string;
  // Legacy props (for backward compatibility)
  tag?: string;
  titleAccent?: string;
  description?: string;
  imageUrl?: string;
  stats?: { value: string; label: string }[];
}

export default function SolutionHero({
  // New props
  title,
  subtitle,
  image,
  category,
  accentColor = '#ec4899', // Default pink-500
  moq = 50,
  ctaText = 'Cotizar Ahora',
  ctaHref = '#configurator',
  // Legacy props mapping
  tag,
  titleAccent,
  description,
  imageUrl,
}: SolutionHeroProps) {
  // Handle legacy props for backward compatibility
  const displayCategory = category || tag || 'SERVICIO';
  const displaySubtitle = subtitle || description || '';
  const displayImage = image || imageUrl || '';

  // Combine title and titleAccent if legacy format is used
  const displayTitle = titleAccent ? `${title}\n${titleAccent}` : title;
  const titleLines = displayTitle.split('\n');

  return (
    <section className="relative min-h-[600px] h-[80vh] bg-zinc-50 overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Left Side - Typography */}
        <div className="w-full lg:w-1/2 h-full flex items-center relative z-10 bg-zinc-50">
          <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-0">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <Link
                href="/#solutions"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Todas las Soluciones
              </Link>
            </motion.div>

            {/* Eyebrow Text */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6"
              style={{ color: accentColor }}
            >
              SERVICIO / {displayCategory.toUpperCase()}
            </motion.span>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-zinc-900 leading-[0.9] tracking-tight mb-6"
            >
              {titleLines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < titleLines.length - 1 && <br />}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-md"
            >
              {displaySubtitle}
            </motion.p>

            {/* MOQ Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium border border-zinc-200">
                <Package className="w-4 h-4" />
                Pedido Mínimo: {moq} Piezas
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/5215512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-full transition-all"
              >
                Hablar con Ventas
              </a>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-1/2 h-[40vh] lg:h-full relative"
        >
          <div className="absolute inset-0">
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay for text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Floating accent element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 hidden lg:block"
          >
            <div
              className="px-4 py-2 rounded-full text-white text-sm font-bold backdrop-blur-md"
              style={{ backgroundColor: `${accentColor}CC` }}
            >
              {displayCategory}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom edge gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
    </section>
  );
}
