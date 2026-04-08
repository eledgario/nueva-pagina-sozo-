export interface Product {
  id: string;
  name: string;
  category: string;
  base_price_cents: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  label: string;
  stock: number;
  reorder_point: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryLog {
  id: string;
  variant_id: string;
  previous_stock: number;
  new_stock: number;
  delta: number;
  reason: string;
  admin_id: string | null;
  created_at: string;
}

// Flattened join type for table display
export interface InventoryRow {
  variant_id: string;
  product_id: string;
  product_name: string;
  category: string;
  image_url: string | null;
  sku: string;
  variant_label: string;
  stock: number;
  reorder_point: number;
  base_price_cents: number;
}

export type StockChangeReason = 'restock' | 'sale' | 'damaged' | 'correction' | 'return';

export const STOCK_CHANGE_REASONS: { value: StockChangeReason; label: string }[] = [
  { value: 'restock', label: 'Envio de Proveedor' },
  { value: 'return', label: 'Devolucion' },
  { value: 'correction', label: 'Correccion' },
  { value: 'damaged', label: 'Danado' },
  { value: 'sale', label: 'Venta' },
];
