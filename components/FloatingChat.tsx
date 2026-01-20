'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingChat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);

  // Show tooltip on initial load after a delay
  useEffect(() => {
    if (!hasShownTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        setHasShownTooltip(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasShownTooltip]);

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-2xl shadow-xl border border-zinc-200 px-4 py-3 max-w-[200px]"
          >
            {/* Close button */}
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-zinc-500" />
            </button>

            {/* Tooltip Arrow */}
            <div className="absolute right-[-8px] bottom-4 w-4 h-4 bg-white border-r border-b border-zinc-200 transform rotate-[-45deg]" />

            <p className="text-sm font-semibold text-zinc-900">
              Chat con Ventas
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Respondemos en minutos
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.a
        href="https://wa.me/5215512345678"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#FF007F] animate-ping opacity-25" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-[#FF007F] hover:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg shadow-[#FF007F]/30 hover:shadow-zinc-900/30 transition-all duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>

        {/* Online Indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
      </motion.a>
    </div>
  );
}
