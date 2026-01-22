'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  Minus,
  Plus,
  Trash2,
  Package,
  ChevronRight,
  Box,
  Sparkles,
  CreditCard,
  Shield,
  Zap,
  Loader2,
  TrendingDown,
} from 'lucide-react';
import {
  useKitBuilder,
  PACKAGING_OPTIONS,
  PackagingType,
} from '@/context/KitBuilderContext';
import {
  calculatePricing,
  formatPrice,
  PRODUCT_BASE_PRICES,
  PACKAGING_PRICES,
  VOLUME_TIERS,
} from '@/lib/pricing';

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
    itemCount,
  } = useKitBuilder();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quantity presets
  const quantityPresets = [25, 50, 100, 250, 500];

  // Calculate pricing
  const pricing = useMemo(() => {
    if (items.length === 0) return null;

    const pricingItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      basePrice: PRODUCT_BASE_PRICES[item.id] || 10000,
      quantity: item.quantity,
    }));

    const packagingPrice = PACKAGING_PRICES[packaging] || PACKAGING_PRICES.kraft;

    return calculatePricing(pricingItems, kitQuantity, packagingPrice);
  }, [items, packaging, kitQuantity]);

  // Handle checkout
  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          packaging,
          kitQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesion de pago');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

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
            className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-[520px] md:rounded-l-3xl md:rounded-tr-none"
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
                            <p className="text-sm text-zinc-500">
                              {formatPrice(PRODUCT_BASE_PRICES[item.id] || 10000)}/ud
                            </p>
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
                                  {formatPrice(PACKAGING_PRICES[option.id])}
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

                  {/* Section 3: Quantity with Volume Pricing */}
                  <div>
                    <h3 className="text-sm font-mono font-bold text-zinc-400 uppercase tracking-widest mb-4">
                      Cantidad de Kits
                    </h3>

                    {/* Volume Tiers Display */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {VOLUME_TIERS.map((tier, index) => {
                        const isActive =
                          pricing?.currentTier.minQty === tier.minQty;
                        const isPast = pricing
                          ? kitQuantity >= tier.minQty
                          : false;

                        return (
                          <div
                            key={index}
                            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-green-100 text-green-700 border border-green-300'
                                : isPast
                                ? 'bg-zinc-100 text-zinc-500'
                                : 'bg-zinc-50 text-zinc-400'
                            }`}
                          >
                            <span className="font-bold">
                              {tier.maxQty === Infinity
                                ? `${tier.minQty}+`
                                : `${tier.minQty}-${tier.maxQty}`}
                            </span>
                            <span className="ml-1">
                              {tier.discount === 0
                                ? 'Base'
                                : `-${Math.round(tier.discount * 100)}%`}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quantity Presets */}
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

                    {/* Custom Quantity Input */}
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

                    {/* Next Tier Hint */}
                    {pricing && pricing.nextTier && pricing.unitsToNextTier > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <div className="flex items-center gap-2 text-amber-700">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Agrega {pricing.unitsToNextTier} kits mas y obtiene{' '}
                            <strong>
                              {Math.round(pricing.nextTier.discount * 100)}% de descuento
                            </strong>
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Pricing & CTA */}
            {items.length > 0 && pricing && (
              <div className="border-t border-zinc-200 bg-zinc-50">
                {/* Savings Banner */}
                {pricing.discount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 py-3 bg-green-500 text-white"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-bold">
                        Ahorraste {formatPrice(pricing.discount)} (
                        {Math.round(pricing.discountPercent * 100)}% descuento por
                        volumen)
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="p-6 space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="text-zinc-700">
                        {formatPrice(pricing.subtotal)}
                      </span>
                    </div>

                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">
                          Descuento ({pricing.discountLabel})
                        </span>
                        <span className="text-green-600 font-medium">
                          -{formatPrice(pricing.discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">IVA (16%)</span>
                      <span className="text-zinc-700">
                        {formatPrice(pricing.tax)}
                      </span>
                    </div>

                    <div className="h-px bg-zinc-200 my-2" />

                    <div className="flex justify-between">
                      <span className="font-bold text-zinc-900">Total</span>
                      <span className="text-2xl font-black text-[#FF007F]">
                        {formatPrice(pricing.total)}
                      </span>
                    </div>

                    <div className="text-right text-xs text-zinc-500">
                      {formatPrice(pricing.pricePerKit)} por kit
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#FF007F] hover:bg-[#FF007F]/90 disabled:bg-zinc-300 text-white font-bold rounded-2xl transition-colors"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pagar Orden Completa
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>
                      Garantia de devolucion. Produccion inicia solo tras
                      aprobacion del diseno.
                    </span>
                  </div>

                  {/* Payment Methods */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <span className="px-2 py-1 bg-zinc-100 rounded text-xs font-bold text-zinc-500">
                      VISA
                    </span>
                    <span className="px-2 py-1 bg-zinc-100 rounded text-xs font-bold text-zinc-500">
                      MC
                    </span>
                    <span className="px-2 py-1 bg-zinc-100 rounded text-xs font-bold text-zinc-500">
                      AMEX
                    </span>
                    <span className="px-2 py-1 bg-zinc-100 rounded text-xs font-bold text-zinc-500">
                      OXXO
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
