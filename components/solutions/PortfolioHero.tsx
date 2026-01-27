'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Package, Clock } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

export interface PortfolioHeroProps {
  title: string;
  subtitle: string;
  category: string;
  images: string[];
  accentColor?: string;
  moq?: number;
  leadTime?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function PortfolioHero({
  title,
  subtitle,
  category,
  images,
  accentColor = '#FF007F',
  moq = 50,
  leadTime = '5-7 días',
  ctaText = 'Armar Kit',
  ctaHref = '#kits',
}: PortfolioHeroProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative min-h-screen bg-white border-b border-zinc-200">
      {/* Industrial Grid Background */}
      <div className="industrial-grid" />

      {/* Top Bar */}
      <div className="absolute top-14 left-0 right-0 h-10 border-b border-zinc-200 bg-white z-20">
        <div className="max-w-[1800px] mx-auto h-full flex items-center">
          <Link
            href="/#solutions"
            className="flex items-center h-full px-6 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-r border-zinc-200"
          >
            <ArrowLeft className="w-3 h-3 mr-2" />
            Soluciones
          </Link>
          <div className="flex items-center h-full px-6 font-mono text-[10px] uppercase tracking-wider text-zinc-400 border-r border-zinc-200">
            {category}
          </div>
          <div className="flex-1" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="pt-24 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-6rem)]">

          {/* Left Panel - Content */}
          <div className="flex flex-col justify-center border-r border-zinc-200">
            <div className="p-8 md:p-12 lg:p-16">
              {/* Category Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <span
                  className="inline-block px-4 py-1 font-mono text-[10px] uppercase tracking-wider text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {category}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-black uppercase leading-[0.85] tracking-tight text-zinc-900 mb-8"
              >
                {title.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </motion.h1>

              {/* Description Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="border border-zinc-200 mb-8"
              >
                {/* Description */}
                <div className="p-6 border-b border-zinc-200">
                  <p className="text-zinc-600 text-base leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 divide-x divide-zinc-200">
                  <div className="p-4 flex items-center gap-3">
                    <Package className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block">
                        Min. Order
                      </span>
                      <span className="font-mono text-sm font-bold text-zinc-900">
                        {moq} pzs
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 block">
                        Lead Time
                      </span>
                      <span className="font-mono text-sm font-bold text-zinc-900">
                        {leadTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href={ctaHref}
                  className="btn-primary"
                  style={{
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  }}
                >
                  {ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/5215512345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Contactar
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right Panel - Image Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-[#f4f4f4] min-h-[50vh] lg:min-h-full"
          >
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              className="h-full w-full absolute inset-0"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className="relative">
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons - Industrial Style */}
            <div className="absolute bottom-0 right-0 z-10 flex border-t border-l border-zinc-200 bg-white">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-12 h-12 flex items-center justify-center hover:bg-zinc-50 transition-colors border-r border-zinc-200"
                aria-label="Previous slide"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-900" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="w-12 h-12 flex items-center justify-center hover:bg-zinc-50 transition-colors"
                aria-label="Next slide"
              >
                <ArrowRight className="w-4 h-4 text-zinc-900" />
              </button>
            </div>

            {/* Slide Counter */}
            <div className="absolute top-0 right-0 z-10 px-4 py-2 bg-white border-b border-l border-zinc-200">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                {images.length} Images
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
