'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package, Clock, Truck, CheckCircle2, FileText,
  Sparkles, User, ChevronRight, LogOut, RefreshCw,
  Phone, MessageCircle, Save, Pencil, X,
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

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  role: string;
  created_at: string;
}

type View = 'orders' | 'profile';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  paid:           { label: 'Confirmado',     color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: CheckCircle2 },
  assigned:       { label: 'Asignado',       color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', icon: User },
  in_design:      { label: 'En diseño',      color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',   icon: FileText },
  design_review:  { label: 'Revisión arte',  color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Sparkles },
  in_production:  { label: 'En producción',  color: 'text-pink-700',   bg: 'bg-pink-50 border-pink-200',     icon: Package },
  shipped:        { label: 'Enviado',        color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200',     icon: Truck },
  delivered:      { label: 'Entregado',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: CheckCircle2 },
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

function initials(name: string | null, email: string) {
  if (name?.trim()) {
    return name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }
  return email[0].toUpperCase();
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

// ─── Profile view ─────────────────────────────────────────────────────────────

function ProfileView({ profile, onSaved }: { profile: Profile; onSaved: (p: Profile) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    phone: profile.phone ?? '',
    whatsapp_number: profile.whatsapp_number ?? '',
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/portal/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSaved(data.profile);
      setEditing(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: profile.full_name ?? '',
      phone: profile.phone ?? '',
      whatsapp_number: profile.whatsapp_number ?? '',
    });
    setEditing(false);
    setError(null);
  };

  return (
    <motion.div
      key="profile-view"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Avatar + name card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name ?? ''} width={64} height={64} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-white text-xl font-black">
              {initials(profile.full_name, profile.email)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-black text-zinc-900 text-lg leading-tight truncate">
            {profile.full_name || 'Sin nombre'}
          </p>
          <p className="text-zinc-400 text-sm truncate">{profile.email}</p>
          <p className="font-mono text-[10px] text-zinc-300 uppercase tracking-widest mt-1">
            Miembro desde {fmtDate(profile.created_at)}
          </p>
        </div>
      </div>

      {/* Fields card */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-zinc-900">Datos de contacto</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Nombre completo
            </label>
            {editing ? (
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 py-3 px-4 bg-zinc-50 rounded-xl">
                <User className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-zinc-700">{profile.full_name || <span className="text-zinc-400 italic">Sin nombre</span>}</span>
              </div>
            )}
          </div>

          {/* Email — siempre readonly */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <div className="flex items-center gap-3 py-3 px-4 bg-zinc-50 rounded-xl">
              <span className="text-zinc-700">{profile.email}</span>
              <span className="ml-auto font-mono text-[10px] text-zinc-300 uppercase">Verificado</span>
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Teléfono
            </label>
            {editing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+52 55 1234 5678"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 py-3 px-4 bg-zinc-50 rounded-xl">
                <Phone className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-zinc-700">{profile.phone || <span className="text-zinc-400 italic">Sin teléfono</span>}</span>
              </div>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              WhatsApp
            </label>
            {editing ? (
              <input
                type="tel"
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="+52 55 1234 5678"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 py-3 px-4 bg-zinc-50 rounded-xl">
                <MessageCircle className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <span className="text-zinc-700">{profile.whatsapp_number || <span className="text-zinc-400 italic">Sin WhatsApp</span>}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Save button */}
        {editing && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSave}
            disabled={saving}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-300 text-white font-bold rounded-xl transition-colors"
          >
            {saving ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Guardando...</>
            ) : (
              <><Save className="w-4 h-4" /> Guardar cambios</>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PortalPage() {
  const [view, setView] = useState<View>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, profileRes] = await Promise.all([
          fetch('/api/portal/orders'),
          fetch('/api/portal/profile'),
        ]);

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data.orders ?? []);
        }
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.profile ?? null);
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

  const handleProfileSaved = useCallback((updated: Profile) => {
    setProfile(updated);
  }, []);

  const displayName = profile?.full_name || profile?.email || '';

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

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1">
            {([
              { id: 'orders',  label: 'Mis pedidos', icon: Package },
              { id: 'profile', label: 'Mi perfil',   icon: User },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  view === id
                    ? 'border-[#FF007F] text-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-1">
            {profile?.email ?? ''}
          </p>
          <h1 className="text-2xl font-black text-zinc-900">
            {view === 'orders'
              ? (displayName ? `Hola, ${displayName.split(' ')[0]}` : 'Mis pedidos')
              : 'Mi perfil'}
          </h1>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-zinc-300 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'orders' ? (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-zinc-300" />
                    </div>
                    <p className="font-bold text-zinc-900 mb-1">Sin pedidos aún</p>
                    <p className="text-zinc-400 text-sm mb-6">
                      Cuando hagas tu primer pedido aparecerá aquí.
                    </p>
                    <a
                      href="https://wa.me/5637929344"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      Cotizar un kit
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, i) => (
                      <OrderCard key={order.id} order={order} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {profile ? (
                  <ProfileView profile={profile} onSaved={handleProfileSaved} />
                ) : (
                  <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-6 h-6 text-zinc-300 animate-spin" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
