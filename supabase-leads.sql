-- Tabla de leads de expo
CREATE TABLE IF NOT EXISTS expo_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL
);

-- Permitir inserts públicos (desde el formulario)
ALTER TABLE expo_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON expo_leads
  FOR INSERT TO public
  WITH CHECK (true);

-- Solo lectura con service role (admin)
CREATE POLICY "Allow service role reads" ON expo_leads
  FOR SELECT TO service_role
  USING (true);

-- Índice por fecha
CREATE INDEX IF NOT EXISTS expo_leads_created_at_idx ON expo_leads(created_at DESC);
