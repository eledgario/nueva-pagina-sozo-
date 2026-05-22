'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package, Clock, Truck, CheckCircle2, FileText,
  Sparkles, User, ChevronRight, LogOut, RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  order_number: number;
  status: string;
  payment_status: string;
  design_status: string;
  customer_name: string;
  customer_email: string;
  items: Array<{ name: string; quantity: number }>;
  kit_quantity: number;
  total_amount: number;
  created_at: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  paid:           { label: 'Confirmado',     color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   icon: CheckCircle2 },
  assigned:       { label: 'Asignado',       color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', icon: User },
  in_design:      { label: 'En diseño',      color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200', icon: FileText },
  design_review:  { label: 'Revisión arte',  color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Sparkles },
  in_production:  { label: 'En producción',  color: 'text-pink-700',   bg: 'bg-pink-50 border-pink-200',   icon: Package },
  shipped:        { label: 'Enviado',        color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200',   icon: Truck },
  delivered:      { label: 'Entregado',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200', icon: CheckCircle2 },
};

const PROGRESS_STEPS = ['paid', 'assigned', 'in_design', 'design_review', 'in_production', 'shipped', 'delivered'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusProgress(status: string) {
  const idx = PROGRESS_STEPS.indexOf(status);
  return idx === -1 ? 0 : Math.round((idx / (PROGRESS_STEPS.length - 1)) * 100);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: Order; index: number }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.paid;
  const Icon = cfg.icon;
  const progress = statusProgress(order.status);
  const needsAction = order.design_status === 'awaiting_approval';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link href={`/portal/pedido/${order.id}`} className="block group">
        <div className={`border rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-white ${needsAction ? 'border-[#FF007F]/40 ring-2 ring-[#FF007F]/10' : 'border-zinc-200'}`}>

          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-zinc-400">
                  #{String(order.order_number).padStart(4, '0')}
                </span>
                {needsAction && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF007F] bg-[#FF007F]/10 px-2 py-0.5 rounded-full animate-pulse">
                    <Sparkles className="w-2.5 h-2.5" />
                    Arte pendiente
                  </span>
                )}
              </div>
              <p className="font-bold text-zinc-900 text-base leading-tight">
                {order.items.map((i) => i.name).join(', ')}
              </p>
              <p className="text-zinc-400 text-sm mt-0.5">{fmtDate(order.created_at)}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-700 transition-colors flex-shrink-0 mt-1" />
          </div>

          {/* Status badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold mb-4 ${cfg.bg} ${cfg.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {cfg.label}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#FF007F] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="font-mono text-[9px] text-zinc-400">Confirmado</span>
            <span className="font-mono text-[9px] text-zinc-400">Entregado</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
            <span className="text-zinc-500 text-sm">{order.kit_quantity} kit{order.kit_quantity !== 1 ? 's' : ''}</span>
            <span className="font-bold text-zinc-900">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.total_amount / 100)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PortalPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUserEmail(user?.email ?? '');

        const res = await fetch('/api/portal/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/sozo-logo.png" alt="SOZO" width={80} height={26} className="h-6 w-auto" />
            <span className="text-zinc-300">|</span>
            <span className="font-bold text-sm text-zinc-700">Mi Portal</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-1">{userEmail}</p>
          <h1 className="text-2xl font-black text-zinc-900">Mis pedidos</h1>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-zinc-300 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="font-bold text-zinc-900 mb-1">Sin pedidos aún</p>
            <p className="text-zinc-400 text-sm mb-6">
              Cuando hagas tu primer pedido aparecerá aquí.
            </p>
            <a
              href="https://wa.me/525588060340"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Cotizar un kit
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
