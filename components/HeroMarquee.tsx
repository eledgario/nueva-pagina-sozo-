'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

const productImages: ProductImage[] = [
  {
    id: 'hoodie',
    src: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    alt: 'Premium Hoodie',
  },
  {
    id: 'tumbler',
    src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
    alt: 'Stealth Tumbler',
  },
  {
    id: 'tshirt',
    src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
    alt: 'Founder Tee',
  },
  {
    id: 'tech-stand',
    src: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop',
    alt: 'Monolith Stand',
  },
  {
    id: 'mug',
    src: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
    alt: 'Ceramic Mug',
  },
  {
    id: 'nfc-card',
    src: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop',
    alt: 'NFC Card',
  },
];

export default function HeroMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...productImages, ...productImages];

  return (
    <div className="w-full py-12 overflow-hidden">
      {/* Container with fade edges */}
      <div
        className="relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        {/* Marquee Track */}
        <motion.div
          className="flex gap-8"
          animate={{
            x: isPaused ? undefined : ['0%', '-50%'],
          }}
          transition={{
            x: {
              duration: 25,
              ease: 'linear',
              repeat: Infinity,
            },
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedImages.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              className="relative flex-shrink-0 w-64 h-80 rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-lg group cursor-pointer"
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Product Image */}
              <Image
                src={product.src}
                alt={product.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="256px"
              />

              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Product Label */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-zinc-900">
                  {product.alt}
                </span>
              </div>

              {/* Pink accent on hover */}
              <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Subtle label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6 text-xs font-mono text-zinc-400 uppercase tracking-widest"
      >
        Hover to pause • Scroll to explore
      </motion.p>
    </div>
  );
}
