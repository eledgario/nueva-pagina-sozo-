'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  FileText,
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';

interface Agent {
  id: string;
  full_name: string;
  avatar_url?: string;
  whatsapp_number?: string;
  email: string;
}

interface OrderDetails {
  id: string;
  order_number: number;
  status: string;
  payment_status: string;
  design_status: string;
  customer_name: string;
  customer_email: string;
  items: Array<{ id: string; name: string; quantity: number }>;
  kit_quantity: number;
  packaging_type: string;
  total_amount: number;
  assigned_agent?: Agent;
  created_at: string;
  paid_at?: string;
}

const STATUS_STEPS = [
  { key: 'paid', label: 'Pago Confirmado', icon: CheckCircle2 },
  { key: 'assigned', label: 'Producer Asignado', icon: User },
  { key: 'in_design', label: 'En Diseno', icon: FileText },
  { key: 'approved', label: 'Diseno Aprobado', icon: Sparkles },
  { key: 'in_production', label: 'En Produccion', icon: Package },
  { key: 'shipped', label: 'Enviado', icon: Truck },
];

function AgentCard({ agent }: { agent: Agent }) {
  const whatsappUrl = agent.whatsapp_number
    ? `https://wa.me/${agent.whatsapp_number}?text=${encodeURIComponent('Hola! Tengo una pregunta sobre mi pedido.')}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#FF007F] to-purple-600 rounded-3xl p-6 text-white"
    >
      <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
        <Sparkles className="w-4 h-4" />
        <span className="font-mono uppercase tracking-wider">Tu Producer Personal</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {agent.avatar_url ? (
            <Image
              src={agent.avatar_url}
              alt={agent.full_name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-black">
              {agent.full_name?.charAt(0) || 'P'}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <h3 className="text-xl font-bold">{agent.full_name}</h3>
          <p className="text-white/70 text-sm">Producer Certificado</p>
        </div>
      </div>

      <p className="text-white/90 text-sm mb-6">
        Tu Producer personal esta revisando tu pedido para iniciar el proceso de diseno.
        Te contactara en las proximas 24 horas.
      </p>

      <div className="space-y-3">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </a>
        )}

        <a
          href={`mailto:${agent.email}`}
          className="flex items-center justify-center gap-3 w-full py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-colors"
        >
          <Mail className="w-5 h-5" />
          Enviar Email
        </a>
      </div>
    </motion.div>
  );
}

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-4">
      {STATUS_STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                isCompleted
                  ? 'bg-[#FF007F] text-white'
                  : 'bg-zinc-100 text-zinc-400'
              } ${isCurrent ? 'ring-4 ring-[#FF007F]/20' : ''}`}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Label */}
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  isCompleted ? 'text-zinc-900' : 'text-zinc-400'
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-sm text-[#FF007F]">En progreso</p>
              )}
            </div>

            {/* Check */}
            {isCompleted && !isCurrent && (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ClientPortalPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Check for session_id in URL (from success page redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (sessionId) {
      fetchOrderBySession(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrderBySession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/client/order?session_id=${sessionId}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLookingUp(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/client/order?email=${encodeURIComponent(email)}&order_number=${orderNumber}`
      );
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch {
      setError('Connection error');
    } finally {
      setIsLookingUp(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#FF007F] animate-spin" />
      </div>
    );
  }

  // Order Lookup Form
  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 px-6">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#FF007F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#FF007F]" />
              </div>
              <h1 className="text-2xl font-black text-zinc-900 mb-2">
                Mi Proyecto
              </h1>
              <p className="text-zinc-500">
                Ingresa tus datos para ver el estado de tu pedido
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Numero de Orden
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent"
                  placeholder="12345"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLookingUp}
                className="w-full py-4 bg-[#FF007F] hover:bg-[#FF007F]/90 disabled:bg-zinc-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLookingUp ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Ver Mi Pedido
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Order Details View
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-zinc-500 text-sm font-mono mb-1">
                    ORDEN #{order.order_number}
                  </p>
                  <h1 className="text-3xl font-black text-zinc-900">
                    {order.customer_name}
                  </h1>
                  <p className="text-zinc-500 mt-1">{order.customer_email}</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-zinc-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-zinc-900 mb-4">Resumen del Pedido</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-zinc-600">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                  ))}
                  <div className="h-px bg-zinc-200 my-4" />
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Cantidad de Kits</span>
                    <span className="font-bold">{order.kit_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Empaque</span>
                    <span className="font-bold capitalize">{order.packaging_type}</span>
                  </div>
                  <div className="h-px bg-zinc-200 my-4" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="font-black text-[#FF007F]">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Creado: {formatDate(order.created_at)}</span>
                </div>
                {order.paid_at && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Pagado: {formatDate(order.paid_at)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h2 className="text-xl font-bold text-zinc-900 mb-6">
                Estado del Proyecto
              </h2>
              <StatusTimeline currentStatus={order.status} />
            </motion.div>
          </div>

          {/* Sidebar - Agent Card */}
          <div className="lg:col-span-1">
            {order.assigned_agent ? (
              <AgentCard agent={order.assigned_agent} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl p-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="font-bold text-zinc-900 mb-2">
                    Asignando Producer
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    Un Producer sera asignado a tu proyecto en las proximas horas.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-6 mt-6"
            >
              <h3 className="font-bold text-zinc-900 mb-4">Necesitas ayuda?</h3>
              <p className="text-zinc-500 text-sm mb-4">
                Nuestro equipo esta disponible para responder tus preguntas.
              </p>
              <a
                href="https://wa.me/5215512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Soporte General
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
