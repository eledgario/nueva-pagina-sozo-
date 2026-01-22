'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Package, Layers, Leaf, Zap, Check } from 'lucide-react';
import { useKitBuilder } from '@/context/KitBuilderContext';
import { useToast } from '@/components/kit-builder/Toast';

type Category = 'todos' | 'textil' | 'drinkware' | 'tech' | 'packaging' | 'kits';
type BadgeType = 'premium' | 'event-ready' | 'eco' | 'new' | 'bestseller';

interface Product {
  id: string;
  name: string;
  category: Category;
  badge: BadgeType;
  imageUrl: string;
  specs: {
    moq: string;
    material: string;
    technique: string;
  };
  price: string;
}

const filterTabs: { id: Category; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'textil', label: 'Textil' },
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'tech', label: 'Tech' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'kits', label: 'Kits' },
];

const badgeConfig: Record<BadgeType, { label: string; color: string; icon: React.ReactNode }> = {
  premium: { label: 'Premium', color: '#8b5cf6', icon: <Zap className="w-3 h-3" /> },
  'event-ready': { label: 'Event Ready', color: '#06b6d4', icon: <Package className="w-3 h-3" /> },
  eco: { label: 'Eco', color: '#22c55e', icon: <Leaf className="w-3 h-3" /> },
  new: { label: 'Nuevo', color: '#FF007F', icon: <Zap className="w-3 h-3" /> },
  bestseller: { label: 'Bestseller', color: '#f59e0b', icon: <Layers className="w-3 h-3" /> },
};

const products: Product[] = [
  // Textil
  {
    id: 'founder-hoodie',
    name: 'Founder Hoodie',
    category: 'textil',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '12', material: 'Cotton 320g', technique: 'Bordado' },
    price: 'Desde $890',
  },
  {
    id: 'promo-tee',
    name: 'Promo Tee',
    category: 'textil',
    badge: 'event-ready',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '50', material: 'Cotton 180g', technique: 'Serigrafía' },
    price: 'Desde $180',
  },
  {
    id: 'eco-tote',
    name: 'Canvas Tote',
    category: 'textil',
    badge: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '25', material: 'Algodón Orgánico', technique: 'Serigrafía' },
    price: 'Desde $120',
  },
  // Drinkware
  {
    id: 'stealth-tumbler',
    name: 'Stealth Tumbler',
    category: 'drinkware',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '24', material: 'Acero Inox', technique: 'Grabado Láser' },
    price: 'Desde $450',
  },
  {
    id: 'festival-cup',
    name: 'Festival Cup',
    category: 'drinkware',
    badge: 'event-ready',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '100', material: 'PP Reciclado', technique: 'UV Print' },
    price: 'Desde $35',
  },
  {
    id: 'ceramic-mug',
    name: 'Ceramic Mug',
    category: 'drinkware',
    badge: 'bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '36', material: 'Cerámica Mate', technique: 'Sublimación' },
    price: 'Desde $180',
  },
  // Tech
  {
    id: 'monolith-stand',
    name: 'Monolith Stand',
    category: 'tech',
    badge: 'new',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '12', material: 'PLA/PETG', technique: '3D Print' },
    price: 'Desde $280',
  },
  {
    id: 'nfc-card',
    name: 'NFC Business Card',
    category: 'tech',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '50', material: 'Acrílico Negro', technique: 'Láser + NFC' },
    price: 'Desde $150',
  },
  // Packaging
  {
    id: 'premium-box',
    name: 'Premium Gift Box',
    category: 'packaging',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '25', material: 'Cartón Rígido', technique: 'Hot Stamping' },
    price: 'Desde $180',
  },
  {
    id: 'kraft-mailer',
    name: 'Kraft Mailer',
    category: 'packaging',
    badge: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '100', material: 'Kraft Reciclado', technique: 'Flexografía' },
    price: 'Desde $25',
  },
  // Kits
  {
    id: 'starter-kit',
    name: 'Starter Kit',
    category: 'kits',
    badge: 'bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '10', material: 'Mixed', technique: 'Múltiple' },
    price: 'Desde $1,200',
  },
  {
    id: 'executive-kit',
    name: 'Executive Kit',
    category: 'kits',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    specs: { moq: '5', material: 'Premium', technique: 'Láser + Bordado' },
    price: 'Desde $2,800',
  },
];

function ProductCard({
  product,
  index,
  onAddToKit,
}: {
  product: Product;
  index: number;
  onAddToKit: (product: Product) => void;
}) {
  const badge = badgeConfig[product.badge];
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToKit = () => {
    onAddToKit(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all cursor-pointer"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: badge.color }}
        >
          {badge.icon}
          {badge.label}
        </div>

        {/* Quick Add Button */}
        <motion.button
          onClick={handleAddToKit}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all border ${
            justAdded
              ? 'bg-green-500 border-green-500 opacity-100'
              : 'bg-white border-zinc-200 opacity-0 group-hover:opacity-100 hover:bg-[#FF007F] hover:text-white hover:border-[#FF007F]'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {justAdded ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </motion.button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-zinc-900 text-lg leading-tight">
            {product.name}
          </h3>
          <span className="text-sm font-bold text-[#FF007F] whitespace-nowrap">
            {product.price}
          </span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-600">
            MOQ: {product.specs.moq}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-600">
            {product.specs.material}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-600">
            {product.specs.technique}
          </span>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleAddToKit}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-2.5 font-bold text-sm uppercase tracking-wider rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${
            justAdded
              ? 'bg-green-500 text-white'
              : 'bg-zinc-900 hover:bg-[#FF007F] text-white'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              Agregado
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Agregar al Kit
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function TheArsenal() {
  const [activeFilter, setActiveFilter] = useState<Category>('todos');
  const { addItem } = useKitBuilder();
  const { showToast } = useToast();

  const filteredProducts = activeFilter === 'todos'
    ? products
    : products.filter((p) => p.category === activeFilter);

  const handleAddToKit = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      category: product.category,
    });
    showToast(`${product.name} agregado al kit`, 'success');
  };

  return (
    <section className="py-24 lg:py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-sm font-bold text-[#FF007F] mb-4 block">
            [CATÁLOGO_INTELIGENTE]
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-zinc-900 tracking-tight">
            EL ARSENAL
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Todo lo que necesitas para equipar a tu equipo.{' '}
            <span className="text-zinc-900 font-semibold">Filtra, explora, cotiza.</span>
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-1 p-1.5 bg-zinc-100 rounded-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors rounded-full ${
                  activeFilter === tab.id
                    ? 'text-white'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {/* Animated Background */}
                {activeFilter === tab.id && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-zinc-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onAddToKit={handleAddToKit}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-zinc-500 text-lg">No hay productos en esta categoría.</p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <p className="text-zinc-500 font-mono text-sm">
              ¿No encuentras lo que buscas?
            </p>
            <button className="px-6 py-3 bg-[#FF007F] hover:bg-zinc-900 text-white font-bold text-sm uppercase tracking-wider rounded-full transition-colors">
              Solicitar Producto Custom
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
