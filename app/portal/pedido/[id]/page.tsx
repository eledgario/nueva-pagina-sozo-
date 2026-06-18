'use client';

import { useEffect, useState, useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Package, CheckCircle2, Clock, Truck, FileText,
  Sparkles, User, Send, RefreshCw, ThumbsUp, ThumbsDown,
  MessageCircle, ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Agent { id: string; full_name: string; avatar_url?: string; whatsapp_number?: string; email: string; }
interface OrderItem { name: string; quantity: number; }
interface Order {
  id: string; order_number: number; status: string; payment_status: string;
  design_status: string; customer_name: string; customer_email: string;
  items: OrderItem[]; kit_quantity: number; packaging_type: string;
  total_amount: number; created_at: string; paid_at?: string;
  assigned_agent?: Agent;
}
interface Message {
  id: string; order_id: string; sender_name: string; sender_role: string;
  body: string; created_at: string;
}
interface Artwork {
  id: string; order_id: string; file_url: string; file_name?: string;
  notes?: string; version: number; status: string; client_comment?: string;
  reviewed_at?: string; created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WA = '5637929344';

const STEPS = [
  { key: 'paid',          label: 'Confirmado',    icon: CheckCircle2 },
  { key: 'assigned',      label: 'Asignado',      icon: User         },
  { key: 'in_design',     label: 'En diseño',     icon: FileText     },
  { key: 'design_review', label: 'Revisión arte', icon: Sparkles     },
  { key: 'in_production', label: 'Producción',    icon: Package      },
  { key: 'shipped',       label: 'Enviado',       icon: Truck        },
  { key: 'delivered',     label: 'Entregado',     icon: CheckCircle2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

// ─── Status timeline ──────────────────────────────────────────────────────────

function StatusTimeline({ status }: { status: string }) {
  const currentIdx = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i <= currentIdx;
        const current = i === currentIdx;
        return (
          <div key={step.key} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                done ? 'bg-[#FF007F] text-white' : 'bg-zinc-100 text-zinc-400'
              } ${current ? 'ring-4 ring-[#FF007F]/20' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[9px] font-bold mt-1 whitespace-nowrap ${done ? 'text-zinc-700' : 'text-zinc-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mb-4 flex-shrink-0 mx-1 ${i < currentIdx ? 'bg-[#FF007F]' : 'bg-zinc-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Artwork card ─────────────────────────────────────────────────────────────

function ArtworkCard({ artwork, onReview }: {
  artwork: Artwork;
  onReview: (id: string, status: 'approved' | 'rejected', comment: string) => Promise<void>;
}) {
  const [comment, setComment] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onReview(artwork.id, 'approved', '');
    setLoading(false);
  };

  const handleReject = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    await onReview(artwork.id, 'rejected', comment);
    setLoading(false);
  };

  const isPending = artwork.status === 'pending';

  return (
    <div className={`border rounded-2xl overflow-hidden ${
      isPending ? 'border-[#FF007F]/40 ring-2 ring-[#FF007F]/10' : 'border-zinc-200'
    }`}>
      {/* Image */}
      <div className="relative bg-zinc-100">
        <a href={artwork.file_url} target="_blank" rel="noopener noreferrer">
          <div className="relative aspect-video">
            <Image
              src={artwork.file_url}
              alt={artwork.file_name ?? 'Arte'}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, 600px"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <ExternalLink className="w-3 h-3" />
            Ver en pantalla completa
          </div>
        </a>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-zinc-500">Versión {artwork.version}</span>
          {!isPending && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              artwork.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {artwork.status === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}
            </span>
          )}
        </div>

        {artwork.notes && (
          <p className="text-sm text-zinc-600 mb-4 bg-zinc-50 rounded-xl p-3">{artwork.notes}</p>
        )}

        {artwork.status === 'rejected' && artwork.client_comment && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 rounded-xl p-3">
            <span className="font-bold">Tu comentario: </span>{artwork.client_comment}
          </div>
        )}

        {isPending && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-zinc-900">
              ¿El arte está correcto y listo para producir?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Aprobar
              </button>
              <button
                onClick={() => setShowReject(!showReject)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-red-300 hover:bg-red-50 disabled:opacity-50 text-red-600 font-bold text-sm rounded-xl transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
                Solicitar cambio
              </button>
            </div>

            <AnimatePresence>
              {showReject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Qué necesita cambiar? Sé específico para que podamos corregirlo rápido..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                  <button
                    onClick={handleReject}
                    disabled={loading || !comment.trim()}
                    className="w-full mt-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-colors"
                  >
                    Enviar solicitud de cambio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Messages ─────────────────────────────────────────────────────────────────

function MessagesPanel({ orderId, customerName }: { orderId: string; customerName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch(`/api/portal/messages?order_id=${orderId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [orderId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!body.trim() || sending) return;
    setSending(true);
    const res = await fetch('/api/portal/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, body: body.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setBody('');
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2" style={{ maxHeight: 360 }}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-4 h-4 animate-spin text-zinc-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm">Sin mensajes aún</p>
            <p className="text-zinc-400 text-xs mt-1">Escríbenos si tienes alguna duda</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isClient = msg.sender_role === 'client';
            return (
              <div key={msg.id} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isClient
                    ? 'bg-[#FF007F] text-white rounded-br-sm'
                    : 'bg-zinc-100 text-zinc-900 rounded-bl-sm'
                }`}>
                  {!isClient && (
                    <p className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">
                      SOZO · {msg.sender_name}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.body}</p>
                  <p className={`text-[10px] mt-1.5 ${isClient ? 'text-white/60' : 'text-zinc-400'}`}>
                    {fmtTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 border-t border-zinc-100">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:border-transparent"
        />
        <button
          onClick={send}
          disabled={sending || !body.trim()}
          className="w-10 h-10 flex items-center justify-center bg-[#FF007F] hover:bg-[#e0006f] disabled:opacity-40 text-white rounded-xl transition-colors"
        >
          {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    async function load() {
      const [ordRes, artRes] = await Promise.all([
        fetch(`/api/portal/orders`),
        fetch(`/api/portal/artworks?order_id=${id}`),
      ]);

      if (ordRes.ok) {
        const data = await ordRes.json();
        const found = (data.orders as Order[]).find((o) => o.id === id);
        setOrder(found ?? null);
      }
      if (artRes.ok) {
        const data = await artRes.json();
        setArtworks(data.artworks ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleArtworkReview = async (artworkId: string, status: 'approved' | 'rejected', comment: string) => {
    const res = await fetch('/api/portal/artworks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artwork_id: artworkId, status, comment }),
    });
    if (res.ok) {
      const data = await res.json();
      setArtworks((prev) => prev.map((a) => a.id === artworkId ? data.artwork : a));
      if (order) setOrder({ ...order, status: status === 'approved' ? 'in_production' : order.status });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="font-bold text-zinc-900 mb-2">Pedido no encontrado</p>
          <Link href="/portal" className="text-[#FF007F] text-sm hover:underline">← Volver</Link>
        </div>
      </div>
    );
  }

  const pendingArtwork = artworks.find((a) => a.status === 'pending');

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link href="/portal" className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/sozo-logo.png" alt="SOZO" width={64} height={20} className="h-5 w-auto" />
            <span className="text-zinc-300">|</span>
            <span className="font-mono text-sm font-bold text-zinc-500">
              #{String(order.order_number).padStart(4, '0')}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Alert: pending artwork */}
        {pendingArtwork && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-[#FF007F]/10 border border-[#FF007F]/30 rounded-2xl p-4"
          >
            <Sparkles className="w-5 h-5 text-[#FF007F] flex-shrink-0" />
            <div>
              <p className="font-bold text-zinc-900 text-sm">Tu arte está listo para revisar</p>
              <p className="text-zinc-500 text-xs mt-0.5">Apruébalo para que iniciemos producción</p>
            </div>
          </motion.div>
        )}

        {/* Status timeline */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <h2 className="font-bold text-zinc-900 mb-4">Estado del pedido</h2>
          <StatusTimeline status={order.status} />
        </div>

        {/* Order summary */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <button
            className="w-full flex items-center justify-between"
            onClick={() => setShowItems(!showItems)}
          >
            <h2 className="font-bold text-zinc-900">Detalle del pedido</h2>
            {showItems ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          <AnimatePresence>
            {showItems && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-zinc-600">{item.name}</span>
                      <span className="font-bold text-zinc-900">×{item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-zinc-100">
                    <span className="text-zinc-500 text-sm">{order.kit_quantity} kit{order.kit_quantity !== 1 ? 's' : ''}</span>
                    <span className="font-black text-zinc-900">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.total_amount / 100)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    Pedido el {fmtDate(order.created_at)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Artworks */}
        {artworks.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-zinc-900 px-1">Arte y aprobación</h2>
            {artworks.map((a) => (
              <ArtworkCard key={a.id} artwork={a} onReview={handleArtworkReview} />
            ))}
          </div>
        )}

        {/* Agent */}
        {order.assigned_agent && (
          <div className="bg-gradient-to-br from-[#FF007F] to-purple-600 rounded-2xl p-5 text-white">
            <p className="text-white/70 text-xs font-mono uppercase tracking-widest mb-3">Tu ejecutivo SOZO</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
                {order.assigned_agent.full_name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{order.assigned_agent.full_name}</p>
                <p className="text-white/70 text-sm">{order.assigned_agent.email}</p>
              </div>
            </div>
            {order.assigned_agent.whatsapp_number && (
              <a
                href={`https://wa.me/${order.assigned_agent.whatsapp_number}?text=${encodeURIComponent(`Hola, soy ${order.customer_name}. Tengo una pregunta sobre mi pedido #${String(order.order_number).padStart(4, '0')}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zinc-900">Mensajes</h2>
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola SOZO, soy ${order.customer_name}. Quiero preguntar algo sobre mi pedido #${String(order.order_number).padStart(4, '0')}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
          <MessagesPanel orderId={id} customerName={order.customer_name} />
        </div>

      </main>
    </div>
  );
}
