-- =====================================================
-- INVENTORY MANAGEMENT SCHEMA
-- Migration 003
-- =====================================================

-- Products table (canonical product catalog)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,               -- matches PRODUCT_BASE_PRICES keys e.g. 'founder-hoodie'
  name TEXT NOT NULL,
  category TEXT NOT NULL,            -- 'textil', 'drinkware', 'tech', 'packaging', 'escritura', 'kits'
  base_price_cents INTEGER NOT NULL, -- price in cents (MXN)
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants (sizes, colors, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,          -- e.g. 'HOODIE-BLK-M', 'TEE-WHT-L'
  label TEXT NOT NULL,               -- human-readable e.g. 'Black / Medium'
  stock INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory log (audit trail for every stock change)
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  delta INTEGER NOT NULL,            -- positive = restock, negative = sold/adjustment
  reason TEXT NOT NULL,              -- 'restock', 'sale', 'damaged', 'correction', 'return'
  admin_id TEXT,                     -- store admin identifier
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_inventory_logs_variant_id ON inventory_logs(variant_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at);

-- Enable RLS (service role key bypasses RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at (reuses update_updated_at() from migration 002)
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED: Products from PRODUCT_BASE_PRICES
-- =====================================================
INSERT INTO products (id, name, category, base_price_cents, image_url) VALUES
  ('founder-hoodie',   'Founder Hoodie',     'textil',     89000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'),
  ('promo-tee',        'Promo Tee',          'textil',     18000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'),
  ('eco-tote',         'Canvas Tote',        'textil',     12000, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'),
  ('premium-polo',     'Premium Polo',       'textil',     45000, NULL),
  ('stealth-tumbler',  'Stealth Tumbler',    'drinkware',  45000, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop'),
  ('festival-cup',     'Festival Cup',       'drinkware',   3500, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop'),
  ('ceramic-mug',      'Ceramic Mug',        'drinkware',  18000, NULL),
  ('monolith-stand',   'Monolith Stand',     'tech',       28000, 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop'),
  ('nfc-card',         'NFC Business Card',  'tech',       15000, 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop'),
  ('wireless-charger', 'Wireless Charger',   'tech',       38000, NULL),
  ('premium-box',      'Premium Box',        'packaging',  18000, NULL),
  ('kraft-mailer',     'Kraft Mailer',       'packaging',   2500, NULL),
  ('leather-notebook', 'Leather Notebook',   'escritura',  32000, NULL),
  ('bamboo-pen',       'Bamboo Pen',         'escritura',   8500, NULL),
  ('executive-set',    'Executive Set',      'kits',      250000, NULL),
  ('founders-box',     'Founders Box',       'kits',      450000, NULL),
  ('starter-kit',      'Starter Kit',        'kits',      120000, NULL),
  ('executive-kit',    'Executive Kit',      'kits',      280000, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed default variant per product
INSERT INTO product_variants (product_id, sku, label, stock, reorder_point)
SELECT
  id,
  UPPER(REPLACE(id, '-', '_')) || '_DEFAULT',
  'Default',
  0,
  10
FROM products
ON CONFLICT (sku) DO NOTHING;
