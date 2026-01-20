'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ShirtIcon, Cpu, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';

// Type Definitions
type ProductType = 'welcome-kit' | 'streetwear' | 'tech-objects' | null;
type VibeType = 'minimalist' | 'cyberpunk' | 'corporate' | null;

interface FormData {
  product: ProductType;
  quantity: number;
  vibe: VibeType;
  name: string;
  company: string;
  whatsapp: string;
}

const products = [
  {
    id: 'welcome-kit' as ProductType,
    title: 'The Welcome Kit',
    description: 'Hoodie + Termo + Stickers',
    icon: Box,
  },
  {
    id: 'streetwear' as ProductType,
    title: 'Streetwear Batch',
    description: 'Solo Ropa Heavyweight',
    icon: ShirtIcon,
  },
  {
    id: 'tech-objects' as ProductType,
    title: 'Tech Objects',
    description: '3D Stands + Accesorios',
    icon: Cpu,
  },
];

const vibes = [
  { id: 'minimalist' as VibeType, label: 'Minimalist', emoji: '⚪' },
  { id: 'cyberpunk' as VibeType, label: 'Cyberpunk', emoji: '🔮' },
  { id: 'corporate' as VibeType, label: 'Corporate', emoji: '💼' },
];

export default function OrderWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    product: null,
    quantity: 50,
    vibe: null,
    name: '',
    company: '',
    whatsapp: '',
  });

  const totalSteps = 3;

  // Navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handlers
  const selectProduct = (productId: ProductType) => {
    setFormData({ ...formData, product: productId });
  };

  const selectVibe = (vibeId: VibeType) => {
    setFormData({ ...formData, vibe: vibeId });
  };

  const handleSubmit = () => {
    // Format WhatsApp message
    const message = `¡Hola! Quiero iniciar un proyecto:%0A%0A🎯 Producto: ${formData.product}%0A📦 Cantidad: ${formData.quantity}%0A🎨 Vibe: ${formData.vibe}%0A👤 Nombre: ${formData.name}%0A🏢 Empresa: ${formData.company}`;

    // Open WhatsApp
    window.open(`https://wa.me/${formData.whatsapp}?text=${message}`, '_blank');
  };

  // Validation
  const canProceedStep1 = formData.product !== null;
  const canProceedStep2 = formData.vibe !== null;
  const canSubmit = formData.name && formData.company && formData.whatsapp;

  return (
    <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
      {/* Background Studio Lights */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,127,0.4) 0%, rgba(255,0,127,0) 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(147,51,234,0) 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [ORDER_WIZARD]
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            BUILD YOUR
            <br />
            <span className="text-[#FF007F]">DROP</span>
          </h2>
          <p className="text-xl text-zinc-400">
            3 pasos. Sin fricción. 100% gamificado.
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                className={`
                  relative w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-lg
                  transition-all duration-300
                  ${
                    currentStep >= step
                      ? 'border-[#FF007F] bg-[#FF007F] text-black'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-600'
                  }
                `}
                animate={currentStep === step ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {currentStep > step ? <Check className="w-6 h-6" /> : step}

                {/* Glow Effect for Active Step */}
                {currentStep === step && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#FF007F]/50 blur-xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Connector Line */}
              {step < 3 && (
                <div
                  className={`
                    w-16 h-1 mx-2 transition-all duration-300
                    ${currentStep > step ? 'bg-[#FF007F]' : 'bg-zinc-800'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Wizard Container */}
        <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 min-h-[500px] overflow-hidden">
          {/* Pink Glow Inside */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,0,127,0.5) 0%, rgba(255,0,127,0) 70%)',
              filter: 'blur(80px)',
            }}
          />

          <AnimatePresence mode="wait">
            {/* STEP 1: Choose Your Weapon */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-black mb-2">Choose Your Weapon</h3>
                  <p className="text-zinc-400">Selecciona tu pack ideal</p>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => {
                    const Icon = product.icon;
                    const isSelected = formData.product === product.id;

                    return (
                      <motion.button
                        key={product.id}
                        onClick={() => selectProduct(product.id)}
                        whileHover={{ y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative p-8 rounded-3xl border-4 transition-all duration-300 text-left
                          ${
                            isSelected
                              ? 'border-[#FF007F] bg-[#FF007F]/10'
                              : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                          }
                        `}
                      >
                        {/* Glow Effect */}
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0 rounded-3xl bg-[#FF007F]/20 blur-xl"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}

                        <div className="relative z-10">
                          {/* Icon */}
                          <div
                            className={`
                              w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
                              ${isSelected ? 'bg-[#FF007F] text-black' : 'bg-zinc-800 text-zinc-500'}
                            `}
                          >
                            <Icon className="w-8 h-8" />
                          </div>

                          {/* Text */}
                          <h4 className="text-xl font-black mb-2">{product.title}</h4>
                          <p className="text-sm text-zinc-400">{product.description}</p>

                          {/* Selected Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-8 h-8 bg-[#FF007F] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-5 h-5 text-black" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Scale It */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-black mb-2">Scale It</h3>
                  <p className="text-zinc-400">Define cantidad y vibe</p>
                </div>

                {/* Quantity Slider */}
                <div className="mb-12">
                  <label className="block text-sm font-mono font-bold text-[#FF007F] mb-4">
                    CANTIDAD DE UNIDADES
                  </label>

                  {/* Big Number Display */}
                  <div className="text-center mb-6">
                    <motion.div
                      key={formData.quantity}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl font-black text-[#FF007F] tracking-tighter"
                    >
                      {formData.quantity}
                    </motion.div>
                    <p className="text-zinc-500 font-mono text-sm mt-2">unidades</p>
                  </div>

                  {/* Custom Slider */}
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: parseInt(e.target.value) })
                    }
                    className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer slider-pink"
                    style={{
                      background: `linear-gradient(to right, #FF007F 0%, #FF007F ${
                        ((formData.quantity - 10) / (500 - 10)) * 100
                      }%, rgb(39 39 42) ${
                        ((formData.quantity - 10) / (500 - 10)) * 100
                      }%, rgb(39 39 42) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-2 font-mono">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Vibe Selector */}
                <div>
                  <label className="block text-sm font-mono font-bold text-[#FF007F] mb-4">
                    ELIGE TU VIBE
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vibes.map((vibe) => {
                      const isSelected = formData.vibe === vibe.id;

                      return (
                        <motion.button
                          key={vibe.id}
                          onClick={() => selectVibe(vibe.id)}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative p-6 rounded-2xl border-4 transition-all duration-300
                            ${
                              isSelected
                                ? 'border-[#FF007F] bg-[#FF007F]/10'
                                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                            }
                          `}
                        >
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 rounded-2xl bg-[#FF007F]/20 blur-lg"
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}

                          <div className="relative z-10">
                            <div className="text-4xl mb-2">{vibe.emoji}</div>
                            <div className="text-lg font-black">{vibe.label}</div>
                          </div>

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 w-6 h-6 bg-[#FF007F] rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-black" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Launch */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-black mb-2">Launch</h3>
                  <p className="text-zinc-400">Último paso para iniciar tu proyecto</p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-mono font-bold text-zinc-400 mb-2">
                      TU NOMBRE
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                      className="w-full px-6 py-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl text-white font-bold focus:border-[#FF007F] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-mono font-bold text-zinc-400 mb-2">
                      EMPRESA
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="ACME Startup Inc."
                      className="w-full px-6 py-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl text-white font-bold focus:border-[#FF007F] focus:outline-none transition-all"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-sm font-mono font-bold text-[#FF007F] mb-2">
                      WHATSAPP (CRUCIAL)
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-6 py-4 bg-zinc-950 border-2 border-[#FF007F] rounded-2xl text-white font-bold focus:border-[#FF007F] focus:outline-none transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    whileHover={canSubmit ? { scale: 1.02 } : {}}
                    whileTap={canSubmit ? { scale: 0.98 } : {}}
                    className={`
                      w-full py-6 rounded-2xl font-black text-xl uppercase flex items-center justify-center gap-3 border-4 transition-all relative overflow-hidden
                      ${
                        canSubmit
                          ? 'bg-[#FF007F] text-black border-black cursor-pointer'
                          : 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                      }
                    `}
                  >
                    {canSubmit && (
                      <>
                        {/* Pulse Animation Background */}
                        <motion.div
                          className="absolute inset-0 bg-white"
                          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Lightning Icon */}
                        <Zap className="w-6 h-6 fill-black" />
                      </>
                    )}

                    <span className="relative z-10">Iniciar Proyecto</span>

                    {canSubmit && <ArrowRight className="w-6 h-6 relative z-10" />}
                  </motion.button>
                </div>

                {/* Summary Preview */}
                <div className="mt-8 p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-zinc-800">
                  <p className="text-xs font-mono text-zinc-500 mb-2">TU ORDEN:</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 bg-[#FF007F]/20 text-[#FF007F] rounded-full font-bold">
                      {formData.product}
                    </span>
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full font-bold">
                      {formData.quantity} unidades
                    </span>
                    <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full font-bold">
                      {formData.vibe}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 relative z-10">
            {/* Back Button */}
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                ${
                  currentStep === 1
                    ? 'opacity-0 pointer-events-none'
                    : 'border-2 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>

            {/* Next Button */}
            {currentStep < 3 && (
              <motion.button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2)
                }
                whileHover={
                  (currentStep === 1 && canProceedStep1) ||
                  (currentStep === 2 && canProceedStep2)
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  (currentStep === 1 && canProceedStep1) ||
                  (currentStep === 2 && canProceedStep2)
                    ? { scale: 0.95 }
                    : {}
                }
                className={`
                  px-8 py-4 rounded-xl font-black text-lg flex items-center gap-2 border-4 transition-all
                  ${
                    (currentStep === 1 && canProceedStep1) ||
                    (currentStep === 2 && canProceedStep2)
                      ? 'bg-[#FF007F] text-black border-black cursor-pointer'
                      : 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                  }
                `}
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx global>{`
        .slider-pink::-webkit-slider-thumb {
          appearance: none;
          width: 28px;
          height: 28px;
          background: #FF007F;
          border: 4px solid black;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(255, 0, 127, 0.5);
          transition: all 0.2s;
        }

        .slider-pink::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 30px rgba(255, 0, 127, 0.8);
        }

        .slider-pink::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: #FF007F;
          border: 4px solid black;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(255, 0, 127, 0.5);
          transition: all 0.2s;
        }

        .slider-pink::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 30px rgba(255, 0, 127, 0.8);
        }
      `}</style>
    </section>
  );
}
