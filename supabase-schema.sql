-- Create the orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Client Info
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  comments TEXT,

  -- Order Details
  flow TEXT NOT NULL CHECK (flow IN ('individual', 'kits', 'custom')),
  details JSONB NOT NULL,
  quantity INTEGER DEFAULT 10,

  -- Logo
  logo_url TEXT,
  logo_filename TEXT,

  -- Status (expanded workflow: Pending -> Quoted -> Paid -> Production -> Shipped)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'paid', 'production', 'shipped', 'cancelled'))
);

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow public uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'logos');

-- Set up storage policy to allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'logos');

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
