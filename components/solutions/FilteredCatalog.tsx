'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Zap, Package, Leaf, Layers, Check } from 'lucide-react';
import { useState } from 'react';
import { useKitBuilder } from '@/context/KitBuilderContext';
import { useToast } from '@/components/kit-builder/Toast';

export type ProductCategory = 'textil' | 'drinkware' | 'tech' | 'packaging' | 'accessories' | 'premium';
export type BadgeType = 'premium' | 'event-ready' | 'eco' | 'new' | 'bestseller';

export interface CatalogProduct {
  id: string;
  name: string;
  category: ProductCategory;
  badge: BadgeType;
  imageUrl: string;
  specs: {
    moq: string;
    material: string;
    technique: string;
  };
  price: string;
}

interface FilteredCatalogProps {
  title?: string;
  subtitle?: string;
  categories: ProductCategory[];
  products?: CatalogProduct[];
  accentColor?: string;
  maxItems?: number;
}

const badgeConfig: Record<BadgeType, { label: string; color: string; icon: React.ReactNode }> = {
  premium: { label: 'Premium', color: '#8b5cf6', icon: <Zap className="w-3 h-3" /> },
  'event-ready': { label: 'Event Ready', color: '#06b6d4', icon: <Package className="w-3 h-3" /> },
  eco: { label: 'Eco', color: '#22c55e', icon: <Leaf className="w-3 h-3" /> },
  new: { label: 'Nuevo', color: '#FF007F', icon: <Zap className="w-3 h-3" /> },
  bestseller: { label: 'Bestseller', color: '#f59e0b', icon: <Layers className="w-3 h-3" /> },
};

// Default product catalog
const defaultProducts: CatalogProduct[] = [
  // Textil
  {
    id: 'founder-hoodie',
    name: 'Founder Hoodie',
    category: 'textil',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
    specs: { moq: '12', material: 'Cotton 320g', technique: 'Bordado' },
    price: 'Desde $890',
  },
  {
    id: 'promo-tee',
    name: 'Promo Tee',
    category: 'textil',
    badge: 'event-ready',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
    specs: { moq: '50', material: 'Cotton 180g', technique: 'Serigrafía' },
    price: 'Desde $180',
  },
  {
    id: 'eco-tote',
    name: 'Canvas Tote',
    category: 'textil',
    badge: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800',
    specs: { moq: '25', material: 'Algodón Orgánico', technique: 'Serigrafía' },
    price: 'Desde $120',
  },
  {
    id: 'premium-polo',
    name: 'Executive Polo',
    category: 'textil',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1625910513413-5fc5e99d97e4?q=80&w=800',
    specs: { moq: '24', material: 'Piqué 220g', technique: 'Bordado' },
    price: 'Desde $450',
  },
  // Drinkware
  {
    id: 'stealth-tumbler',
    name: 'Stealth Tumbler',
    category: 'drinkware',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800',
    specs: { moq: '24', material: 'Acero Inox', technique: 'Grabado Láser' },
    price: 'Desde $450',
  },
  {
    id: 'festival-cup',
    name: 'Festival Cup',
    category: 'drinkware',
    badge: 'event-ready',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800',
    specs: { moq: '100', material: 'PP Reciclado', technique: 'UV Print' },
    price: 'Desde $35',
  },
  {
    id: 'ceramic-mug',
    name: 'Ceramic Mug',
    category: 'drinkware',
    badge: 'bestseller',
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=800',
    specs: { moq: '36', material: 'Cerámica Mate', technique: 'Sublimación' },
    price: 'Desde $180',
  },
  // Tech
  {
    id: 'monolith-stand',
    name: 'Monolith Stand',
    category: 'tech',
    badge: 'new',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800',
    specs: { moq: '12', material: 'PLA/PETG', technique: '3D Print' },
    price: 'Desde $280',
  },
  {
    id: 'nfc-card',
    name: 'NFC Business Card',
    category: 'tech',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800',
    specs: { moq: '50', material: 'Acrílico Negro', technique: 'Láser + NFC' },
    price: 'Desde $150',
  },
  {
    id: 'wireless-charger',
    name: 'Wireless Charger',
    category: 'tech',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?q=80&w=800',
    specs: { moq: '25', material: 'Bambú + ABS', technique: 'Grabado Láser' },
    price: 'Desde $380',
  },
  // Packaging
  {
    id: 'premium-box',
    name: 'Premium Gift Box',
    category: 'packaging',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
    specs: { moq: '25', material: 'Cartón Rígido', technique: 'Hot Stamping' },
    price: 'Desde $180',
  },
  {
    id: 'kraft-mailer',
    name: 'Kraft Mailer',
    category: 'packaging',
    badge: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800',
    specs: { moq: '100', material: 'Kraft Reciclado', technique: 'Flexografía' },
    price: 'Desde $25',
  },
  // Accessories
  {
    id: 'leather-notebook',
    name: 'Leather Notebook',
    category: 'accessories',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800',
    specs: { moq: '25', material: 'Piel Sintética', technique: 'Grabado Láser' },
    price: 'Desde $320',
  },
  {
    id: 'bamboo-pen',
    name: 'Bamboo Pen Set',
    category: 'accessories',
    badge: 'eco',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=800',
    specs: { moq: '50', material: 'Bambú', technique: 'Grabado Láser' },
    price: 'Desde $85',
  },
  // Premium
  {
    id: 'executive-set',
    name: 'Executive Gift Set',
    category: 'premium',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=800',
    specs: { moq: '10', material: 'Mixed Premium', technique: 'Múltiple' },
    price: 'Desde $2,500',
  },
  {
    id: 'founders-box',
    name: "Founder's Box",
    category: 'premium',
    badge: 'premium',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800',
    specs: { moq: '5', material: 'Ultra Premium', technique: 'Custom' },
    price: 'Desde $4,500',
  },
];

function ProductCard({
  product,
  index,
  accentColor,
  onAddToKit,
}: {
  product: CatalogProduct;
  index: number;
  accentColor: string;
  onAddToKit: (product: CatalogProduct) => void;
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all"
    >
      {/* Image */}
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
              : 'bg-white border-zinc-200 opacity-0 group-hover:opacity-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={!justAdded ? { ['--hover-bg' as string]: accentColor } : {}}
        >
          {justAdded ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <Plus className="w-5 h-5 text-zinc-700" />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-zinc-900 text-lg leading-tight">
            {product.name}
          </h3>
          <span
            className="text-sm font-bold whitespace-nowrap"
            style={{ color: accentColor }}
          >
            {product.price}
          </span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-600">
            MOQ: {product.specs.moq}
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-600">
            {product.specs.material}
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-zinc-100 rounded text-[10px] font-mono text-zinc-600">
            {product.specs.technique}
          </span>
        </div>

        {/* CTA - Add to Kit Button */}
        <motion.button
          onClick={handleAddToKit}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-2.5 font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            justAdded
              ? 'bg-green-500 text-white'
              : 'bg-zinc-900 hover:bg-[#FF007F] text-white'
          }`}
          style={!justAdded ? { ['--hover-bg' as string]: accentColor } : {}}
          onMouseEnter={(e) => {
            if (!justAdded) e.currentTarget.style.backgroundColor = accentColor;
          }}
          onMouseLeave={(e) => {
            if (!justAdded) e.currentTarget.style.backgroundColor = '#18181b';
          }}
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

export default function FilteredCatalog({
  title = 'Catalogo',
  subtitle = 'Productos seleccionados para esta solucion.',
  categories,
  products = defaultProducts,
  accentColor = '#FF007F',
  maxItems = 8,
}: FilteredCatalogProps) {
  const { addItem } = useKitBuilder();
  const { showToast } = useToast();

  // Filter products by categories
  const filteredProducts = products
    .filter((p) => categories.includes(p.category))
    .slice(0, maxItems);

  const handleAddToKit = (product: CatalogProduct) => {
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
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="font-mono text-sm font-bold mb-4 block"
            style={{ color: accentColor }}
          >
            [PRODUCTOS_RECOMENDADOS]
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              accentColor={accentColor}
              onAddToKit={handleAddToKit}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="/#arsenal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-full transition-colors"
          >
            Ver Catalogo Completo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
