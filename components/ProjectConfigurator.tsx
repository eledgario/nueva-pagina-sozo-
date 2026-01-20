'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ShirtIcon,
  Coffee,
  Box,
  Upload,
  Check,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Package,
  AlertCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type FlowType = 'individual' | 'kits' | 'custom' | null;
type ProductType = 'hoodie' | 'tshirt' | 'tumbler' | 'mug' | 'stand' | 'nfc';
type KitType = 'starter' | 'tech' | 'full';

interface FormData {
  flow: FlowType;
  selectedProduct?: ProductType;
  selectedKit?: KitType;
  customProducts: ProductType[];
  logo: File | null;
  quantity: number;
  name: string;
  company: string;
  whatsapp: string;
  comments: string;
}

const products = [
  { id: 'hoodie' as ProductType, name: 'Hoodie Premium', icon: ShirtIcon },
  { id: 'tumbler' as ProductType, name: 'Stealth Tumbler', icon: Coffee },
  { id: 'stand' as ProductType, name: 'Monolith Stand', icon: Box },
];

const kits = [
  {
    id: 'starter' as KitType,
    name: 'Starter Kit',
    description: 'Hoodie + Packaging Premium',
    items: ['Hoodie', 'Box'],
    price: 'Desde $850 MXN'
  },
  {
    id: 'tech' as KitType,
    name: 'Tech Kit',
    description: 'Stand + Tumbler + Sticker',
    items: ['3D Stand', 'Tumbler', 'Sticker'],
    price: 'Desde $1,200 MXN'
  },
  {
    id: 'full' as KitType,
    name: 'Full Experience',
    description: 'Todo incluido. La experiencia completa.',
    items: ['Hoodie', 'Tumbler', 'Stand', 'NFC Card', 'Stickers'],
    price: 'Desde $2,500 MXN'
  },
];

const customProducts = [
  { id: 'hoodie' as ProductType, name: 'Hoodie', icon: ShirtIcon },
  { id: 'tshirt' as ProductType, name: 'T-Shirt', icon: ShirtIcon },
  { id: 'tumbler' as ProductType, name: 'Tumbler', icon: Coffee },
  { id: 'mug' as ProductType, name: 'Ceramic Mug', icon: Coffee },
  { id: 'stand' as ProductType, name: '3D Stand', icon: Box },
  { id: 'nfc' as ProductType, name: 'NFC Card', icon: Package },
];

export default function ProjectConfigurator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    flow: null,
    customProducts: [],
    logo: null,
    quantity: 10,
    name: '',
    company: '',
    whatsapp: '',
    comments: '',
  });

  // Trigger confetti on success
  useEffect(() => {
    if (isSuccess) {
      // Fire confetti from multiple locations
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Pink confetti from left
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#FF007F', '#A855F7', '#FFFFFF', '#000000'],
        });

        // Purple confetti from right
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#FF007F', '#A855F7', '#FFFFFF', '#000000'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  // Flow Selection
  const selectFlow = (flow: FlowType) => {
    setFormData({ ...formData, flow });
    setCurrentStep(1);
  };

  // File Upload
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, logo: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, logo: e.target.files[0] });
    }
  };

  // Custom Products Toggle
  const toggleCustomProduct = (productId: ProductType) => {
    const isSelected = formData.customProducts.includes(productId);
    setFormData({
      ...formData,
      customProducts: isSelected
        ? formData.customProducts.filter((p) => p !== productId)
        : [...formData.customProducts, productId],
    });
  };

  // Submit Handler with Supabase Integration
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('Supabase no está configurado. Por favor configura las variables de entorno.');
      }

      // Validate file size (10MB max)
      if (formData.logo && formData.logo.size > 10 * 1024 * 1024) {
        throw new Error('El archivo es muy grande. Máximo 10MB.');
      }

      let logoUrl = null;
      let logoFilename = null;

      // Step 1: Upload logo to Supabase Storage
      if (formData.logo) {
        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = formData.logo.name.split('.').pop();
        const uniqueFilename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('logos')
          .upload(uniqueFilename, formData.logo, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Error al subir logo: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('logos')
          .getPublicUrl(uniqueFilename);

        logoUrl = urlData.publicUrl;
        logoFilename = formData.logo.name;
      }

      // Step 2: Prepare order details based on flow
      let orderDetails: any = {};

      if (formData.flow === 'individual') {
        orderDetails = {
          type: 'individual',
          product: formData.selectedProduct,
          quantity: formData.quantity,
        };
      } else if (formData.flow === 'kits') {
        const selectedKit = kits.find((k) => k.id === formData.selectedKit);
        orderDetails = {
          type: 'kit',
          kitId: formData.selectedKit,
          kitName: selectedKit?.name,
          items: selectedKit?.items,
          quantity: formData.quantity,
        };
      } else if (formData.flow === 'custom') {
        orderDetails = {
          type: 'custom',
          products: formData.customProducts,
          quantity: formData.quantity,
        };
      }

      // Step 3: Insert order into database
      const { data: orderData, error: dbError } = await supabase
        .from('orders')
        .insert([
          {
            name: formData.name,
            company: formData.company,
            whatsapp: formData.whatsapp,
            comments: formData.comments || null,
            flow: formData.flow,
            details: orderDetails,
            quantity: formData.quantity,
            logo_url: logoUrl,
            logo_filename: logoFilename,
            status: 'pending',
          },
        ])
        .select();

      if (dbError) {
        throw new Error(`Error al guardar orden: ${dbError.message}`);
      }

      // Success!
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting order:', err);
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToCheckout = () => {
    if (formData.flow === 'individual') return formData.selectedProduct && formData.logo;
    if (formData.flow === 'kits') return formData.selectedKit && formData.logo;
    if (formData.flow === 'custom') return formData.customProducts.length > 0 && formData.logo;
    return false;
  };

  const canSubmit = formData.name && formData.company && formData.whatsapp;

  return (
    <section className="py-32 px-6 bg-zinc-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [PROJECT_BUILDER]
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
            CREA TU
            <br />
            <span className="text-[#FF007F]">PROYECTO</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            Configura tu orden en 3 pasos. Sin fricción, 100% visual.
          </p>
        </motion.div>

        {/* Main Container */}
        <div className="relative bg-white rounded-3xl border border-zinc-200 p-8 md:p-12 min-h-[600px] shadow-xl shadow-zinc-200/50">
          <AnimatePresence mode="wait">
            {/* STEP 0: Flow Selection */}
            {currentStep === 0 && !isSuccess && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-3xl font-black mb-8 text-zinc-900">Elige tu Flujo</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      id: 'individual' as FlowType,
                      title: 'Producto Individual',
                      description: 'Un solo producto personalizado',
                    },
                    {
                      id: 'kits' as FlowType,
                      title: 'Kits Pre-hechos',
                      description: 'Combos listos para usar',
                    },
                    {
                      id: 'custom' as FlowType,
                      title: 'Build Your Own',
                      description: 'Crea tu combo ideal',
                    },
                  ].map((flow) => (
                    <motion.button
                      key={flow.id}
                      onClick={() => selectFlow(flow.id)}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-8 bg-zinc-50 rounded-3xl border-2 border-zinc-200 hover:border-[#FF007F] transition-all text-left group"
                    >
                      <h4 className="text-2xl font-black mb-3 group-hover:text-[#FF007F] transition-colors">
                        {flow.title}
                      </h4>
                      <p className="text-zinc-500 text-sm">{flow.description}</p>
                      <ArrowRight className="w-6 h-6 text-[#FF007F] mt-4 group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Product/Kit/Custom Selection */}
            {currentStep === 1 && !isSuccess && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Flow A: Individual Product */}
                {formData.flow === 'individual' && (
                  <>
                    <h3 className="text-3xl font-black mb-8 text-zinc-900">Selecciona tu Producto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {products.map((product) => {
                        const Icon = product.icon;
                        const isSelected = formData.selectedProduct === product.id;
                        return (
                          <motion.button
                            key={product.id}
                            onClick={() =>
                              setFormData({ ...formData, selectedProduct: product.id })
                            }
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-3xl border-2 transition-all ${
                              isSelected
                                ? 'border-[#FF007F] bg-[#FF007F]/10'
                                : 'border-zinc-200 bg-zinc-50 hover:border-zinc-700'
                            }`}
                          >
                            <Icon
                              className={`w-12 h-12 mb-4 mx-auto ${
                                isSelected ? 'text-[#FF007F]' : 'text-zinc-500'
                              }`}
                            />
                            <h4 className="font-black">{product.name}</h4>
                            {isSelected && (
                              <Check className="w-6 h-6 text-[#FF007F] mx-auto mt-2" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Quantity */}
                    <div className="mb-8">
                      <label className="block text-sm font-mono font-bold text-zinc-500 mb-3">
                        CANTIDAD (Min. 10)
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: parseInt(e.target.value) })
                        }
                        className="w-full px-6 py-4 bg-white border-2 border-zinc-200 rounded-2xl text-zinc-900 font-bold focus:border-[#FF007F] focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {/* Flow B: Pre-made Kits */}
                {formData.flow === 'kits' && (
                  <>
                    <h3 className="text-3xl font-black mb-8 text-zinc-900">Elige tu Kit</h3>
                    <div className="space-y-4">
                      {kits.map((kit) => {
                        const isSelected = formData.selectedKit === kit.id;
                        return (
                          <motion.button
                            key={kit.id}
                            onClick={() => setFormData({ ...formData, selectedKit: kit.id })}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full p-6 rounded-3xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#FF007F] bg-[#FF007F]/10'
                                : 'border-zinc-200 bg-zinc-50 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-2xl font-black mb-2">{kit.name}</h4>
                                <p className="text-zinc-500 mb-2">{kit.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {kit.items.map((item, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-zinc-800 rounded-full"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[#FF007F] font-black">{kit.price}</div>
                                {isSelected && (
                                  <Check className="w-8 h-8 text-[#FF007F] mt-2" />
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Flow C: Build Your Own */}
                {formData.flow === 'custom' && (
                  <>
                    <h3 className="text-3xl font-black mb-8 text-zinc-900">Build Your Own</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Checklist */}
                      <div className="space-y-3">
                        {customProducts.map((product) => {
                          const Icon = product.icon;
                          const isSelected = formData.customProducts.includes(product.id);
                          return (
                            <motion.button
                              key={product.id}
                              onClick={() => toggleCustomProduct(product.id)}
                              whileHover={{ x: 4 }}
                              className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                isSelected
                                  ? 'border-[#FF007F] bg-[#FF007F]/10'
                                  : 'border-zinc-200 bg-zinc-50'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                  isSelected ? 'border-[#FF007F] bg-[#FF007F]' : 'border-zinc-700'
                                }`}
                              >
                                {isSelected && <Check className="w-4 h-4 text-black" />}
                              </div>
                              <Icon className="w-6 h-6 text-zinc-500" />
                              <span className="font-bold">{product.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Virtual Box */}
                      <div className="bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-300 p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <Package className="w-16 h-16 text-zinc-700 mb-4" />
                        <p className="text-zinc-500 font-mono text-sm mb-4">Tu Box Virtual</p>
                        {formData.customProducts.length === 0 ? (
                          <p className="text-zinc-600 text-sm">Selecciona productos...</p>
                        ) : (
                          <div className="space-y-2 w-full">
                            {formData.customProducts.map((productId, idx) => {
                              const product = customProducts.find((p) => p.id === productId);
                              return (
                                <motion.div
                                  key={productId}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="px-3 py-2 bg-zinc-800 rounded-lg text-sm font-bold text-center"
                                >
                                  ✓ {product?.name}
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* File Upload (Common for all flows) */}
                <div className="mt-8">
                  <label className="block text-sm font-mono font-bold text-[#FF007F] mb-3">
                    SUBE TU LOGO
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                      dragActive
                        ? 'border-[#FF007F] bg-[#FF007F]/10'
                        : 'border-zinc-200 bg-zinc-50 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    {formData.logo ? (
                      <div>
                        <Check className="w-8 h-8 text-[#FF007F] mx-auto mb-2" />
                        <p className="text-[#FF007F] font-bold">{formData.logo.name}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-zinc-500 mb-2">
                          Arrastra tu logo aquí o haz click para seleccionar
                        </p>
                        <p className="text-zinc-600 text-sm">PNG, JPG, PDF (Max 10MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 border-2 border-zinc-800 rounded-2xl font-bold hover:border-zinc-700 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Atrás
                  </button>

                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToCheckout()}
                    className={`px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-2 border-4 transition-all ${
                      canProceedToCheckout()
                        ? 'bg-[#FF007F] text-black border-black cursor-pointer hover:scale-105'
                        : 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Checkout Form */}
            {currentStep === 2 && !isSuccess && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-3xl font-black mb-8 text-zinc-900">Información de Contacto</h3>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-mono font-bold text-zinc-500 mb-2">
                      TU NOMBRE
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Juan Pérez"
                      className="w-full px-6 py-4 bg-white border-2 border-zinc-200 rounded-2xl text-zinc-900 font-bold focus:border-[#FF007F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold text-zinc-500 mb-2">
                      EMPRESA
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="ACME Startup Inc."
                      className="w-full px-6 py-4 bg-white border-2 border-zinc-200 rounded-2xl text-zinc-900 font-bold focus:border-[#FF007F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold text-[#FF007F] mb-2">
                      WHATSAPP (CRUCIAL)
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-6 py-4 bg-white border-2 border-[#FF007F] rounded-2xl text-zinc-900 font-bold focus:border-[#FF007F] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mono font-bold text-zinc-500 mb-2">
                      COMENTARIOS (OPCIONAL)
                    </label>
                    <textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Detalles adicionales sobre tu proyecto..."
                      rows={4}
                      className="w-full px-6 py-4 bg-white border-2 border-zinc-200 rounded-2xl text-zinc-900 font-bold focus:border-[#FF007F] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-2xl flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-500 font-bold text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border-2 border-zinc-800 rounded-2xl font-bold hover:border-zinc-700 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Atrás
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className={`px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 border-4 transition-all relative overflow-hidden ${
                      canSubmit && !isSubmitting
                        ? 'bg-[#FF007F] text-black border-black cursor-pointer hover:scale-105'
                        : 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        ENVIAR PROPUESTA
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS STATE */}
            {isSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                  className="w-24 h-24 bg-[#FF007F] rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <Check className="w-12 h-12 text-black" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-black mb-4"
                >
                  ¡Propuesta Recibida!
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center gap-2 text-[#FF007F] mb-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-mono text-sm">Analizando tu logo...</span>
                  </div>
                  <p className="text-zinc-500 text-lg max-w-md mx-auto">
                    Nos contactaremos por WhatsApp en{' '}
                    <span className="text-zinc-900 font-bold">menos de 24h</span> con una cotización
                    personalizada.
                  </p>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => {
                    setIsSuccess(false);
                    setCurrentStep(0);
                    setFormData({
                      flow: null,
                      customProducts: [],
                      logo: null,
                      quantity: 10,
                      name: '',
                      company: '',
                      whatsapp: '',
                      comments: '',
                    });
                  }}
                  className="px-8 py-4 bg-zinc-50 border-2 border-zinc-200 hover:border-[#FF007F] rounded-2xl font-bold text-zinc-900 transition-all"
                >
                  Crear Otro Proyecto
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
