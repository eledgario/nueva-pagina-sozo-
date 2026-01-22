'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Lock,
  LogOut,
  Package,
  DollarSign,
  Users,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  CreditCard,
  FileText,
  X,
  MessageCircle,
} from 'lucide-react';
import {
  Order,
  OrderStatus,
  DashboardMetrics,
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_OPTIONS,
} from '@/lib/admin-types';

// Agent type
interface Agent {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  whatsapp_number?: string;
  role: 'agent' | 'producer';
  is_active: boolean;
  current_order_count: number;
  max_concurrent_orders: number;
}

// ============================================
// LOGIN GATE COMPONENT
// ============================================
function LoginGate({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        onLogin(data.token);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-[#FF007F]" />
          </div>
          <h1 className="text-2xl font-black text-white">MISSION CONTROL</h1>
          <p className="text-zinc-500 text-sm mt-1">Sozo Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-mono text-zinc-400 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF007F] transition-colors"
              placeholder="Enter password..."
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[#FF007F] hover:bg-[#FF007F]/90 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-6">
          Authorized personnel only
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// METRIC CARD COMPONENT
// ============================================
function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      <p className="text-zinc-500 text-sm font-mono mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      {subtext && <p className="text-zinc-600 text-xs mt-1">{subtext}</p>}
    </motion.div>
  );
}

// ============================================
// STATUS BADGE COMPONENT
// ============================================
function StatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bgColor}`}
      style={{ color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}

// ============================================
// STATUS DROPDOWN COMPONENT
// ============================================
function StatusDropdown({
  currentStatus,
  onStatusChange,
  loading,
}: {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  loading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors disabled:opacity-50"
      >
        <StatusBadge status={currentStatus} />
        {loading ? (
          <RefreshCw className="w-4 h-4 text-zinc-400 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center justify-between ${
                    currentStatus === status ? 'bg-zinc-800' : ''
                  }`}
                >
                  <StatusBadge status={status} />
                  {currentStatus === status && (
                    <CheckCircle2 className="w-4 h-4 text-[#FF007F]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// AGENT DROPDOWN COMPONENT
// ============================================
function AgentDropdown({
  agents,
  currentAgentId,
  onAssign,
  loading,
}: {
  agents: Agent[];
  currentAgentId?: string;
  onAssign: (agentId: string) => void;
  loading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentAgent = agents.find((a) => a.id === currentAgentId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors disabled:opacity-50 min-w-[140px]"
      >
        {currentAgent ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF007F] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {currentAgent.full_name?.charAt(0) || 'A'}
            </div>
            <span className="text-white text-sm truncate max-w-[80px]">
              {currentAgent.full_name || 'Agent'}
            </span>
          </div>
        ) : (
          <span className="text-zinc-400 text-sm">Sin asignar</span>
        )}
        {loading ? (
          <RefreshCw className="w-4 h-4 text-zinc-400 animate-spin ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400 ml-auto" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-zinc-800">
                <p className="text-zinc-400 text-xs font-mono uppercase">Asignar Producer</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {agents.length === 0 ? (
                  <div className="px-4 py-3 text-zinc-500 text-sm">
                    No hay agentes disponibles
                  </div>
                ) : (
                  agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        onAssign(agent.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-3 ${
                        currentAgentId === agent.id ? 'bg-zinc-800' : ''
                      }`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FF007F] to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {agent.full_name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {agent.full_name || agent.email}
                        </p>
                        <p className="text-zinc-500 text-xs">
                          {agent.current_order_count}/{agent.max_concurrent_orders} proyectos
                        </p>
                      </div>
                      {currentAgentId === agent.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#FF007F] flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// ORDER DETAIL MODAL
// ============================================
function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  updatingStatus,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  updatingStatus: boolean;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWhatsAppUrl = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const getItemsSummary = () => {
    if (order.details?.items && order.details.items.length > 0) {
      return order.details.items
        .map((item) => `${item.quantity}x ${item.product}`)
        .join(', ');
    }
    return `${order.quantity} unidades - ${order.flow}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <p className="text-zinc-500 text-sm font-mono">Order #{order.id.slice(0, 8)}</p>
            <h2 className="text-xl font-bold text-white">{order.company}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <p className="text-zinc-500 text-sm font-mono mb-2">Estado</p>
            <StatusDropdown
              currentStatus={order.status}
              onStatusChange={(status) => onStatusChange(order.id, status)}
              loading={updatingStatus}
            />
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-500 text-sm font-mono mb-1">Cliente</p>
              <p className="text-white font-semibold">{order.name}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-mono mb-1">WhatsApp</p>
              <a
                href={formatWhatsAppUrl(order.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF007F] hover:underline flex items-center gap-1"
              >
                {order.whatsapp}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <p className="text-zinc-500 text-sm font-mono mb-2">Detalles del Pedido</p>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-[#FF007F]/20 text-[#FF007F] text-xs font-bold rounded">
                  {order.flow.toUpperCase()}
                </span>
                <span className="text-zinc-400 text-sm">{order.quantity} unidades</span>
              </div>
              <p className="text-white">{getItemsSummary()}</p>
              {order.details?.technique && (
                <p className="text-zinc-500 text-sm mt-1">
                  Tecnica: {order.details.technique}
                </p>
              )}
              {order.comments && (
                <p className="text-zinc-400 text-sm mt-2 italic">&ldquo;{order.comments}&rdquo;</p>
              )}
            </div>
          </div>

          {/* Logo Preview */}
          {order.logo_url && (
            <div>
              <p className="text-zinc-500 text-sm font-mono mb-2">Logo</p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 inline-block">
                <Image
                  src={order.logo_url}
                  alt="Logo"
                  width={150}
                  height={150}
                  className="object-contain rounded-lg"
                />
                <p className="text-zinc-600 text-xs mt-2">{order.logo_filename}</p>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-zinc-600 text-sm">
              Creado: {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-zinc-800 bg-zinc-950/50">
          <a
            href={formatWhatsAppUrl(order.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar por WhatsApp
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// ORDER ROW COMPONENT
// ============================================
function OrderRow({
  order,
  agents,
  onStatusChange,
  onAssignAgent,
  updatingStatus,
  assigningAgent,
  onViewDetails,
}: {
  order: Order & { assigned_agent_id?: string };
  agents: Agent[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onAssignAgent: (orderId: string, agentId: string) => void;
  updatingStatus: string | null;
  assigningAgent: string | null;
  onViewDetails: (order: Order) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWhatsAppUrl = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const getItemsSummary = () => {
    if (order.details?.items && order.details.items.length > 0) {
      const summary = order.details.items
        .slice(0, 2)
        .map((item) => `${item.quantity}x ${item.product}`)
        .join(', ');
      if (order.details.items.length > 2) {
        return `${summary} +${order.details.items.length - 2} mas`;
      }
      return summary;
    }
    return `${order.quantity} unidades`;
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
    >
      {/* Date */}
      <td className="px-4 py-4">
        <span className="text-zinc-400 text-sm font-mono">
          {formatDate(order.created_at)}
        </span>
      </td>

      {/* Client */}
      <td className="px-4 py-4">
        <div>
          <p className="text-white font-semibold">{order.name}</p>
          <p className="text-zinc-500 text-sm">{order.company}</p>
        </div>
      </td>

      {/* WhatsApp */}
      <td className="px-4 py-4">
        <a
          href={formatWhatsAppUrl(order.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#25D366] hover:underline text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          {order.whatsapp}
        </a>
      </td>

      {/* Order Summary */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs font-mono rounded">
            {order.flow}
          </span>
          <span className="text-zinc-400 text-sm truncate max-w-[200px]">
            {getItemsSummary()}
          </span>
        </div>
      </td>

      {/* Logo */}
      <td className="px-4 py-4">
        {order.logo_url ? (
          <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden">
            <Image
              src={order.logo_url}
              alt="Logo"
              width={40}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
        ) : (
          <span className="text-zinc-600 text-sm">-</span>
        )}
      </td>

      {/* Agent */}
      <td className="px-4 py-4">
        <AgentDropdown
          agents={agents}
          currentAgentId={order.assigned_agent_id}
          onAssign={(agentId) => onAssignAgent(order.id, agentId)}
          loading={assigningAgent === order.id}
        />
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusDropdown
          currentStatus={order.status}
          onStatusChange={(status) => onStatusChange(order.id, status)}
          loading={updatingStatus === order.id}
        />
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <button
          onClick={() => onViewDetails(order)}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
        >
          Ver
        </button>
      </td>
    </motion.tr>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [assigningAgent, setAssigningAgent] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getAdminPassword = () => localStorage.getItem('admin_token') || '';

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/agents', {
        headers: { 'x-admin-password': getAdminPassword() },
      });
      const data = await res.json();

      if (res.ok) {
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, [fetchOrders, fetchAgents]);

  const handleAssignAgent = async (orderId: string, agentId: string) => {
    setAssigningAgent(orderId);

    try {
      const res = await fetch('/api/admin/orders/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': getAdminPassword(),
        },
        body: JSON.stringify({ orderId, agentId }),
      });

      if (res.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, assigned_agent_id: agentId, status: order.status === 'paid' ? 'assigned' as OrderStatus : order.status }
              : order
          )
        );
        // Refresh agents to update counts
        fetchAgents();
      }
    } catch (err) {
      console.error('Failed to assign agent:', err);
    } finally {
      setAssigningAgent(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        // Update selected order if open
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Calculate metrics
  const metrics: DashboardMetrics = {
    totalOrders: orders.length,
    pendingRevenue: orders.filter((o) => o.status === 'pending' || o.status === 'quoted').length * 5000, // Estimate
    activeClients: new Set(orders.map((o) => o.company)).size,
    ordersByStatus: ORDER_STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = orders.filter((o) => o.status === status).length;
      return acc;
    }, {} as Record<OrderStatus, number>),
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FF007F] rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">MISSION CONTROL</h1>
              <p className="text-zinc-500 text-xs font-mono">Sozo Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={Package}
            label="Total Ordenes"
            value={metrics.totalOrders}
            subtext="Todas las ordenes"
            color="#FF007F"
          />
          <MetricCard
            icon={Clock}
            label="Pendientes"
            value={metrics.ordersByStatus.pending + metrics.ordersByStatus.quoted}
            subtext="Esperando accion"
            color="#f59e0b"
          />
          <MetricCard
            icon={DollarSign}
            label="En Produccion"
            value={metrics.ordersByStatus.production + metrics.ordersByStatus.paid}
            subtext="Ordenes activas"
            color="#8b5cf6"
          />
          <MetricCard
            icon={Users}
            label="Clientes Unicos"
            value={metrics.activeClients}
            subtext="Empresas"
            color="#06b6d4"
          />
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ORDER_STATUS_OPTIONS.map((status) => {
            const config = ORDER_STATUS_CONFIG[status];
            const count = metrics.ordersByStatus[status];
            return (
              <div
                key={status}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} border`}
                style={{ borderColor: `${config.color}30` }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm font-medium" style={{ color: config.color }}>
                  {config.label}: {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-bold text-white">Ordenes Recientes</h2>
            <span className="text-zinc-500 text-sm font-mono">
              {orders.length} ordenes
            </span>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-zinc-500 mx-auto mb-4 animate-spin" />
              <p className="text-zinc-500">Cargando ordenes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No hay ordenes todavia</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-950 text-left">
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Producer
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      agents={agents}
                      onStatusChange={handleStatusChange}
                      onAssignAgent={handleAssignAgent}
                      updatingStatus={updatingStatus}
                      assigningAgent={assigningAgent}
                      onViewDetails={setSelectedOrder}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
            updatingStatus={updatingStatus !== null}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN PAGE EXPORT
// ============================================
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
