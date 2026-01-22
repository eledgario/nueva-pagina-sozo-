'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Minus,
  Plus,
  Trash2,
  Package,
  MessageCircle,
  ChevronRight,
  Box,
  Sparkles,
} from 'lucide-react';
import {
  useKitBuilder,
  PACKAGING_OPTIONS,
  PackagingType,
} from '@/context/KitBuilderContext';

// Packaging icons
const packagingIcons: Record<PackagingType, React.ReactNode> = {
  mailer: <Package className="w-5 h-5" />,
  kraft: <Box className="w-5 h-5" />,
  premium: <Sparkles className="w-5 h-5" />,
};

export default function KitDrawer() {
  const {
    items,
    packaging,
    kitQuantity,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateItemQuantity,
    setPackaging,
    setKitQuantity,
    clearKit,
    getWhatsAppUrl,
    itemCount,
  } = useKitBuilder();

  // Quantity presets
  const quantityPresets = [25, 50, 100, 250, 500];

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-[480px] md:rounded-l-3xl md:rounded-tr-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF007F] rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Tu Kit</h2>
                  <p className="text-sm text-zinc-500">
                    {itemCount} productos seleccionados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearKit}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Vaciar kit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={closeDrawer}
                  className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* Empty State */
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-zinc-300" />
                  </div>
                  <p className="text-zinc-900 font-semibold mb-2">
                    Tu kit esta vacio
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Agrega productos del catalogo para comenzar
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-4 px-6 py-2 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Explorar Catalogo
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Section 1: Inventory */}
                  <div>
                    <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
                      Contenido del Kit
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-zinc-500">{item.price}</p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 bg-white border border-zinc-200 rounded-lg flex items-center justify-center hover:bg-zinc-100 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-zinc-600" />
                            </button>
                            <span className="w-8 text-center font-bold text-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 bg-white border border-zinc-200 rounded-lg flex items-center justify-center hover:bg-zinc-100 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-zinc-600" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Packaging Selector */}
                  <div>
                    <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
                      Tipo de Empaque
                    </h3>
                    <div className="space-y-2">
                      {PACKAGING_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setPackaging(option.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                            packaging === option.id
                              ? 'border-[#FF007F] bg-[#FF007F]/5'
                              : 'border-zinc-200 hover:border-zinc-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                packaging === option.id
                                  ? 'bg-[#FF007F] text-white'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {packagingIcons[option.id]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-zinc-900">
                                  {option.name}
                                </p>
                                <span
                                  className={`text-sm font-mono ${
                                    packaging === option.id
                                      ? 'text-[#FF007F]'
                                      : 'text-zinc-500'
                                  }`}
                                >
                                  {option.priceLabel}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-500 mt-0.5">
                                {option.description}
                              </p>
                            </div>
                            {/* Radio indicator */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                packaging === option.id
                                  ? 'border-[#FF007F]'
                                  : 'border-zinc-300'
                              }`}
                            >
                              {packaging === option.id && (
                                <div className="w-3 h-3 rounded-full bg-[#FF007F]" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Quantity */}
                  <div>
                    <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
                      Cantidad de Kits
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quantityPresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setKitQuantity(preset)}
                          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            kitQuantity === preset
                              ? 'bg-zinc-900 text-white'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        value={kitQuantity}
                        onChange={(e) =>
                          setKitQuantity(parseInt(e.target.value) || 1)
                        }
                        className="flex-1 px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent"
                      />
                      <span className="text-zinc-500 font-medium">kits</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - CTA */}
            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-zinc-50">
                {/* Summary */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-zinc-500">Resumen:</span>
                  <span className="font-bold text-zinc-900">
                    {itemCount} productos × {kitQuantity} kits
                  </span>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-2xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Cotizacion por WhatsApp
                  <ChevronRight className="w-5 h-5" />
                </a>

                <p className="text-center text-xs text-zinc-400 mt-3">
                  Te responderemos en menos de 2 horas
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
