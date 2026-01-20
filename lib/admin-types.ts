// Order Status Flow: Pending -> Quoted -> Paid -> Production -> Shipped
export type OrderStatus = 'pending' | 'quoted' | 'paid' | 'production' | 'shipped' | 'cancelled';

export interface OrderItem {
  product: string;
  quantity: number;
  technique?: string;
  color?: string;
}

export interface OrderDetails {
  items?: OrderItem[];
  category?: string;
  technique?: string;
  urgency?: string;
  notes?: string;
}

export interface Order {
  id: string;
  created_at: string;
  name: string;
  company: string;
  whatsapp: string;
  comments: string | null;
  flow: 'individual' | 'kits' | 'custom';
  details: OrderDetails;
  quantity: number;
  logo_url: string | null;
  logo_filename: string | null;
  status: OrderStatus;
}

export interface DashboardMetrics {
  totalOrders: number;
  pendingRevenue: number;
  activeClients: number;
  ordersByStatus: Record<OrderStatus, number>;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pendiente', color: '#f59e0b', bgColor: 'bg-amber-500/20' },
  quoted: { label: 'Cotizado', color: '#3b82f6', bgColor: 'bg-blue-500/20' },
  paid: { label: 'Pagado', color: '#22c55e', bgColor: 'bg-green-500/20' },
  production: { label: 'Produccion', color: '#8b5cf6', bgColor: 'bg-purple-500/20' },
  shipped: { label: 'Enviado', color: '#06b6d4', bgColor: 'bg-cyan-500/20' },
  cancelled: { label: 'Cancelado', color: '#ef4444', bgColor: 'bg-red-500/20' },
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = ['pending', 'quoted', 'paid', 'production', 'shipped', 'cancelled'];
