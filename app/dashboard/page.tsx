'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Warehouse,
  Package,
  Boxes,
  TrendingUp,
  Clock,
  ChevronRight,
  ShoppingBag,
  FileText,
  Settings,
  HelpCircle,
  Plus,
} from 'lucide-react';

// Types for the warehouse widget
interface RecentProduct {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  addedAt: string;
}

interface WarehouseData {
  totalSkus: number;
  totalUnits: number;
  recentProducts: RecentProduct[];
}

// Mock data - will be replaced with API data
const mockWarehouseData: WarehouseData = {
  totalSkus: 24,
  totalUnits: 1250,
  recentProducts: [
    {
      id: '1',
      name: 'Termo Premium 500ml',
      imageUrl: '/catalog/drinkware/termo-premium.jpg',
      quantity: 150,
      addedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Libreta Executive A5',
      imageUrl: '/catalog/office/libreta-executive.jpg',
      quantity: 200,
      addedAt: '2024-01-12',
    },
    {
      id: '3',
      name: 'Power Bank 10000mAh',
      imageUrl: '/catalog/tech/powerbank-10k.jpg',
      quantity: 75,
      addedAt: '2024-01-10',
    },
  ],
};

// Warehouse Widget Component
function WarehouseWidget({ data }: { data: WarehouseData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-zinc-200 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-100 bg-gradient-to-r from-zinc-900 to-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Warehouse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mi Almacen</h2>
            <p className="text-sm text-zinc-400">Inventario personalizado</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-px bg-zinc-100">
        <div className="bg-white p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Package className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Total SKUs
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900">{data.totalSkus}</p>
          <p className="text-xs text-zinc-500 mt-1">productos unicos</p>
        </div>
        <div className="bg-white p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Boxes className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Unidades
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900">
            {data.totalUnits.toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 mt-1">en inventario</p>
        </div>
      </div>

      {/* Recent Products */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-wide">
            Agregados Recientemente
          </h3>
          <Link
            href="/dashboard/inventory"
            className="text-xs text-[#FF007F] font-medium hover:underline"
          >
            Ver todo
          </Link>
        </div>

        <div className="space-y-3">
          {data.recentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {product.quantity} unidades
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(product.addedAt).toLocaleDateString('es-MX', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Add Button */}
        <Link
          href="/catalogo"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar productos
        </Link>
      </div>
    </motion.div>
  );
}

// Quick Action Card
function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  color = 'zinc',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  color?: 'pink' | 'zinc' | 'green' | 'blue';
}) {
  const colorClasses = {
    pink: 'bg-[#FF007F]/10 text-[#FF007F]',
    zinc: 'bg-zinc-100 text-zinc-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-300 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-900">{title}</h3>
            <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-300" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function ClientDashboard() {
  // In production, this would come from an API
  const [warehouseData] = useState<WarehouseData>(mockWarehouseData);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-black text-[#FF007F]">
              SOZO
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-900"
              >
                Dashboard
              </Link>
              <Link
                href="/catalogo"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
              >
                Catalogo
              </Link>
              <Link
                href="/client/portal"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
              >
                Mis Ordenes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">
            Bienvenido de vuelta
          </h1>
          <p className="text-zinc-500 mt-1">
            Gestiona tu inventario y crea nuevos kits corporativos
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Warehouse Widget */}
          <div className="lg:col-span-2">
            <WarehouseWidget data={warehouseData} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-700 uppercase tracking-wide">
              Acciones Rapidas
            </h2>

            <QuickActionCard
              icon={ShoppingBag}
              title="Crear Nuevo Kit"
              description="Arma un kit personalizado para tu equipo"
              href="/catalogo"
              color="pink"
            />

            <QuickActionCard
              icon={FileText}
              title="Mis Ordenes"
              description="Revisa el estado de tus pedidos"
              href="/client/portal"
              color="blue"
            />

            <QuickActionCard
              icon={TrendingUp}
              title="Reportes"
              description="Analiza tu consumo y tendencias"
              href="/dashboard/reports"
              color="green"
            />

            <QuickActionCard
              icon={Settings}
              title="Configuracion"
              description="Ajusta preferencias de tu cuenta"
              href="/dashboard/settings"
              color="zinc"
            />

            {/* Help Card */}
            <div className="bg-gradient-to-br from-[#FF007F] to-purple-600 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold">Necesitas ayuda?</h3>
                  <p className="text-sm text-white/80 mt-1">
                    Contacta a tu Producer asignado o escribenos a hola@sozo.mx
                  </p>
                  <a
                    href="mailto:hola@sozo.mx"
                    className="inline-block mt-3 px-4 py-2 bg-white text-[#FF007F] text-sm font-bold rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Contactar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-900">
              Actividad Reciente
            </h2>
            <button className="text-sm text-[#FF007F] font-medium hover:underline">
              Ver historial
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
            {/* Activity items - mock data */}
            {[
              {
                action: 'Orden #1042 enviada',
                date: '15 Ene 2024',
                icon: Package,
              },
              {
                action: '150 unidades de Termo Premium agregadas',
                date: '15 Ene 2024',
                icon: Plus,
              },
              {
                action: 'Orden #1041 completada',
                date: '10 Ene 2024',
                icon: Package,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{item.action}</p>
                  <p className="text-sm text-zinc-500">{item.date}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-300" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
