'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock,
  LogOut,
  Package,
  RefreshCw,
  AlertCircle,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Warehouse,
  AlertTriangle,
  PackageX,
  Layers,
  Search,
} from 'lucide-react';
import type { InventoryRow, StockChangeReason } from '@/lib/inventory-types';
import { STOCK_CHANGE_REASONS } from '@/lib/inventory-types';
import { getInventory, updateStock } from '@/app/actions/inventory';
import { formatPrice } from '@/lib/pricing';

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-[#FF007F]" />
          </div>
          <h1 className="text-2xl font-black text-white">INVENTARIO</h1>
          <p className="text-zinc-500 text-sm mt-1">Sozo Admin Dashboard</p>
        </div>

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
// CATEGORY BADGE
// ============================================
const CATEGORY_COLORS: Record<string, string> = {
  textil: '#3B82F6',
  drinkware: '#F59E0B',
  tech: '#8B5CF6',
  packaging: '#6B7280',
  escritura: '#10B981',
  kits: '#FF007F',
};

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || '#6B7280';
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono rounded"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {category}
    </span>
  );
}

// ============================================
// RESTOCK MODAL
// ============================================
function RestockModal({
  row,
  onClose,
  onSubmit,
}: {
  row: InventoryRow;
  onClose: () => void;
  onSubmit: (delta: number, reason: StockChangeReason) => Promise<void>;
}) {
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [reason, setReason] = useState<StockChangeReason>('restock');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setError('Cantidad debe ser mayor a 0');
      return;
    }

    const delta = mode === 'add' ? quantity : -quantity;

    if (mode === 'remove' && quantity > row.stock) {
      setError('No puedes remover mas de lo que hay en stock');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit(delta, reason);
      onClose();
    } catch {
      setError('Error al actualizar stock');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-white">Ajustar Stock</h2>
            <p className="text-zinc-500 text-sm font-mono">{row.product_name} — {row.sku}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Stock Display */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">Stock Actual</p>
            <p className={`text-4xl font-mono font-black ${row.stock < row.reorder_point ? 'text-red-400' : 'text-white'}`}>
              {row.stock}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setMode('add'); setReason('restock'); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
                mode === 'add'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
            <button
              type="button"
              onClick={() => { setMode('remove'); setReason('sale'); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${
                mode === 'remove'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <Minus className="w-4 h-4" />
              Remover
            </button>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-mono text-zinc-400 mb-2">
              Cantidad
            </label>
            <input
              type="number"
              min={1}
              max={mode === 'remove' ? row.stock : 99999}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-lg font-mono text-center focus:outline-none focus:border-[#FF007F] transition-colors"
              autoFocus
            />
          </div>

          {/* Reason Dropdown */}
          <div>
            <label className="block text-sm font-mono text-zinc-400 mb-2">
              Motivo
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as StockChangeReason)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-[#FF007F] transition-colors appearance-none"
            >
              {STOCK_CHANGE_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-sm font-mono">Resultado</span>
              <span className="text-white text-lg font-mono font-bold">
                {row.stock} {mode === 'add' ? '+' : '−'} {quantity} = {' '}
                <span className={mode === 'add' ? 'text-emerald-400' : 'text-red-400'}>
                  {mode === 'add' ? row.stock + quantity : row.stock - quantity}
                </span>
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || quantity <= 0}
              className={`flex-1 py-3 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                mode === 'add'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-zinc-800 disabled:text-zinc-600'
                  : 'bg-red-600 hover:bg-red-500 text-white disabled:bg-zinc-800 disabled:text-zinc-600'
              }`}
            >
              {submitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'add' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  Confirmar
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// INVENTORY DASHBOARD
// ============================================
function InventoryDashboard({ onLogout }: { onLogout: () => void }) {
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [restockRow, setRestockRow] = useState<InventoryRow | null>(null);

  const getToken = () => localStorage.getItem('admin_token') || '';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getInventory(getToken());

      if (result.error) {
        setError(result.error);
      } else {
        setInventory(result.data || []);
        setError(null);
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStock = async (delta: number, reason: StockChangeReason) => {
    if (!restockRow) return;

    const result = await updateStock(getToken(), restockRow.variant_id, delta, reason);

    if (!result.success) {
      throw new Error(result.error || 'Failed to update stock');
    }

    // Update local state optimistically
    setInventory((prev) =>
      prev.map((r) =>
        r.variant_id === restockRow.variant_id
          ? { ...r, stock: result.newStock ?? r.stock + delta }
          : r
      )
    );
  };

  // Filtered inventory
  const filtered = searchQuery
    ? inventory.filter(
        (r) =>
          r.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : inventory;

  // Metrics
  const totalProducts = inventory.length;
  const lowStock = inventory.filter((r) => r.stock > 0 && r.stock < r.reorder_point).length;
  const outOfStock = inventory.filter((r) => r.stock === 0).length;
  const totalUnits = inventory.reduce((sum, r) => sum + r.stock, 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#FF007F] rounded-xl flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">INVENTARIO</h1>
              <p className="text-zinc-500 text-xs font-mono">Stock Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Ordenes
            </Link>
            <button
              onClick={fetchData}
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
            icon={Layers}
            label="Total Productos"
            value={totalProducts}
            color="#3B82F6"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Stock Bajo"
            value={lowStock}
            subtext={`< reorder point`}
            color="#F59E0B"
          />
          <MetricCard
            icon={PackageX}
            label="Sin Stock"
            value={outOfStock}
            color="#EF4444"
          />
          <MetricCard
            icon={Package}
            label="Total Unidades"
            value={totalUnits.toLocaleString('es-MX')}
            color="#10B981"
          />
        </div>

        {/* Table Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Table Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">Productos</h2>
              <span className="text-zinc-500 text-sm font-mono">
                {filtered.length} items
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar producto o SKU..."
                className="pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#FF007F] transition-colors w-64"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <p className="text-zinc-400">{error}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Package className="w-12 h-12 text-zinc-600" />
              <p className="text-zinc-500">
                {searchQuery ? 'No se encontraron resultados' : 'No hay productos'}
              </p>
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-950">
                    <th className="text-left text-xs font-mono text-zinc-500 uppercase tracking-wider px-6 py-3">
                      Producto
                    </th>
                    <th className="text-left text-xs font-mono text-zinc-500 uppercase tracking-wider px-6 py-3">
                      SKU / Variante
                    </th>
                    <th className="text-left text-xs font-mono text-zinc-500 uppercase tracking-wider px-6 py-3">
                      Precio Base
                    </th>
                    <th className="text-center text-xs font-mono text-zinc-500 uppercase tracking-wider px-6 py-3">
                      Stock
                    </th>
                    <th className="text-right text-xs font-mono text-zinc-500 uppercase tracking-wider px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <motion.tr
                      key={row.variant_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {row.image_url ? (
                              <Image
                                src={row.image_url}
                                alt={row.product_name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-zinc-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{row.product_name}</p>
                            <CategoryBadge category={row.category} />
                          </div>
                        </div>
                      </td>

                      {/* SKU / Variant */}
                      <td className="px-6 py-4">
                        <p className="text-zinc-300 text-sm font-mono">{row.sku}</p>
                        <p className="text-zinc-600 text-xs">{row.variant_label}</p>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="text-zinc-300 text-sm font-mono">
                          {formatPrice(row.base_price_cents)}
                        </p>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`text-lg font-mono font-black ${
                              row.stock === 0
                                ? 'text-red-400'
                                : row.stock < row.reorder_point
                                  ? 'text-amber-400'
                                  : 'text-white'
                            }`}
                          >
                            {row.stock}
                          </span>
                          {row.stock < row.reorder_point && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold ${
                                row.stock === 0
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {row.stock === 0 ? 'SIN STOCK' : 'BAJO'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setRestockRow(row)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Ajustar
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Restock Modal */}
      <AnimatePresence>
        {restockRow && (
          <RestockModal
            row={restockRow}
            onClose={() => setRestockRow(null)}
            onSubmit={handleUpdateStock}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN PAGE EXPORT
// ============================================
export default function InventoryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
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

  return <InventoryDashboard onLogout={handleLogout} />;
}
