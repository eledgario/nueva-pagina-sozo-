'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Package, ChevronUp, X } from 'lucide-react';
import { useKitBuilder } from '@/context/KitBuilderContext';

export default function FloatingBuilderBar() {
  const { items, hasItems, itemCount, openDrawer, removeItem } = useKitBuilder();

  // Show only first 5 thumbnails
  const visibleItems = items.slice(0, 5);
  const remainingCount = items.length - 5;

  return (
    <AnimatePresence>
      {hasItems && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl"
        >
          {/* Glassmorphism Bar */}
          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-2xl shadow-black/10 p-3 md:p-4">
            <div className="flex items-center gap-4">
              {/* Left - Label */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF007F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-zinc-900">Tu Kit Personalizado</p>
                  <p className="text-xs text-zinc-500">
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>

              {/* Center - Thumbnails */}
              <div className="flex-1 flex items-center justify-center gap-1 md:gap-2 overflow-hidden">
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-white shadow-md bg-zinc-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Quantity Badge */}
                    {item.quantity > 1 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF007F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    )}
                    {/* Remove on hover (desktop) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}

                {/* +N more indicator */}
                {remainingCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600"
                  >
                    +{remainingCount}
                  </motion.div>
                )}
              </div>

              {/* Right - CTA Button */}
              <motion.button
                onClick={openDrawer}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 md:px-6 py-3 bg-zinc-900 hover:bg-[#FF007F] text-white font-bold text-sm rounded-xl transition-colors flex-shrink-0"
              >
                <span className="hidden sm:inline">Revisar Kit</span>
                <span className="sm:hidden">Ver</span>
                <ChevronUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 bg-[#FF007F]/20 rounded-2xl blur-2xl opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
