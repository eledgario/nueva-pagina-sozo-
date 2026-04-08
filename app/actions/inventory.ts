'use server';

import { createClient } from '@supabase/supabase-js';
import type { InventoryRow } from '@/lib/inventory-types';

// --- Supabase initialization (same pattern as /api/admin/ routes) ---

function isValidSupabaseUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  isValidSupabaseUrl(supabaseUrl) && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// --- Auth helper ---

function verifyAdminToken(token: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    return decoded.endsWith(`-${adminPassword}`);
  } catch {
    return false;
  }
}

// --- Server Actions ---

export async function getInventory(
  adminToken: string
): Promise<{ data: InventoryRow[] | null; error: string | null }> {
  if (!verifyAdminToken(adminToken)) {
    return { data: null, error: 'Unauthorized' };
  }
  if (!supabase) {
    return { data: null, error: 'Database not configured' };
  }

  const { data, error } = await supabase
    .from('product_variants')
    .select(
      `
      id,
      product_id,
      sku,
      label,
      stock,
      reorder_point,
      is_active,
      products!inner (
        name,
        category,
        image_url,
        base_price_cents
      )
    `
    )
    .eq('is_active', true)
    .order('product_id', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: InventoryRow[] = (data || []).map((v: any) => ({
    variant_id: v.id,
    product_id: v.product_id,
    product_name: v.products.name,
    category: v.products.category,
    image_url: v.products.image_url,
    sku: v.sku,
    variant_label: v.label,
    stock: v.stock,
    reorder_point: v.reorder_point,
    base_price_cents: v.products.base_price_cents,
  }));

  return { data: rows, error: null };
}

export async function updateStock(
  adminToken: string,
  variantId: string,
  delta: number,
  reason: string
): Promise<{ success: boolean; newStock?: number; error: string | null }> {
  if (!verifyAdminToken(adminToken)) {
    return { success: false, error: 'Unauthorized' };
  }
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }
  if (!variantId || delta === 0 || !reason) {
    return { success: false, error: 'Missing required fields' };
  }

  // Fetch current stock
  const { data: variant, error: fetchErr } = await supabase
    .from('product_variants')
    .select('stock')
    .eq('id', variantId)
    .single();

  if (fetchErr || !variant) {
    return { success: false, error: fetchErr?.message || 'Variant not found' };
  }

  const previousStock = variant.stock;
  const newStock = previousStock + delta;

  if (newStock < 0) {
    return { success: false, error: 'Stock no puede ser menor a cero' };
  }

  // Update stock
  const { error: updateErr } = await supabase
    .from('product_variants')
    .update({ stock: newStock })
    .eq('id', variantId);

  if (updateErr) {
    return { success: false, error: updateErr.message };
  }

  // Insert audit log
  const { error: logErr } = await supabase.from('inventory_logs').insert({
    variant_id: variantId,
    previous_stock: previousStock,
    new_stock: newStock,
    delta,
    reason,
    admin_id: 'admin',
  });

  if (logErr) {
    console.error('Failed to insert inventory log:', logErr);
  }

  return { success: true, newStock, error: null };
}
