-- =====================================================
-- SOZO E-COMMERCE SCHEMA UPDATE
-- Run this migration in Supabase SQL Editor
-- =====================================================

-- Create ENUM types for status tracking
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE design_status AS ENUM ('awaiting_files', 'in_review', 'revision_requested', 'approved', 'in_production', 'completed');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'assigned', 'in_design', 'approved', 'in_production', 'shipped', 'delivered', 'cancelled');
CREATE TYPE user_role AS ENUM ('client', 'agent', 'producer', 'admin');

-- =====================================================
-- PROFILES TABLE (Users/Agents/Producers)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  role user_role DEFAULT 'client',
  is_active BOOLEAN DEFAULT true,
  specialties TEXT[], -- ['textil', 'tech', 'packaging']
  max_concurrent_orders INTEGER DEFAULT 5,
  current_order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE (Updated with Agent/Payment fields)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE,

  -- Customer Info
  customer_id UUID REFERENCES profiles(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  company_name TEXT,

  -- Order Details
  items JSONB NOT NULL, -- Array of kit items
  packaging_type TEXT NOT NULL,
  kit_quantity INTEGER NOT NULL,

  -- Pricing (all in cents)
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  tax_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,

  -- Payment
  payment_status payment_status DEFAULT 'pending',
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  payment_method TEXT, -- 'card', 'spei', etc.
  paid_at TIMESTAMPTZ,

  -- Agent Assignment
  assigned_agent_id UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ,
  assigned_by UUID REFERENCES profiles(id),

  -- Design Workflow
  design_status design_status DEFAULT 'awaiting_files',
  design_files_url TEXT[],
  design_notes TEXT,
  design_approved_at TIMESTAMPTZ,

  -- Overall Status
  status order_status DEFAULT 'pending',

  -- Shipping
  shipping_address JSONB,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ORDER EVENTS (Activity Log)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'created', 'paid', 'assigned', 'status_changed', etc.
  description TEXT,
  old_value JSONB,
  new_value JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'order_assigned', 'payment_received', 'design_approved', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_assigned_agent_id ON orders(assigned_agent_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_checkout_session_id);
CREATE INDEX idx_order_events_order_id ON order_events(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Agents can view client profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'producer'))
  );

-- Orders: Clients see own orders, agents see assigned, admins see all
CREATE POLICY "Clients can view own orders" ON orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Agents can view assigned orders" ON orders
  FOR SELECT USING (assigned_agent_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Notifications: Users see own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to auto-assign orders (round-robin)
CREATE OR REPLACE FUNCTION auto_assign_order(p_order_id UUID)
RETURNS UUID AS $$
DECLARE
  v_agent_id UUID;
BEGIN
  -- Find available agent with least orders (round-robin)
  SELECT id INTO v_agent_id
  FROM profiles
  WHERE role IN ('agent', 'producer')
    AND is_active = true
    AND current_order_count < max_concurrent_orders
  ORDER BY current_order_count ASC, RANDOM()
  LIMIT 1;

  IF v_agent_id IS NOT NULL THEN
    -- Update order
    UPDATE orders
    SET assigned_agent_id = v_agent_id,
        assigned_at = NOW(),
        status = 'assigned'
    WHERE id = p_order_id;

    -- Increment agent's order count
    UPDATE profiles
    SET current_order_count = current_order_count + 1
    WHERE id = v_agent_id;

    -- Log event
    INSERT INTO order_events (order_id, event_type, description, new_value)
    VALUES (p_order_id, 'auto_assigned', 'Order auto-assigned to agent', jsonb_build_object('agent_id', v_agent_id));
  END IF;

  RETURN v_agent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to manually assign order
CREATE OR REPLACE FUNCTION assign_order_to_agent(
  p_order_id UUID,
  p_agent_id UUID,
  p_assigned_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_agent_id UUID;
BEGIN
  -- Get current agent (if any)
  SELECT assigned_agent_id INTO v_old_agent_id
  FROM orders WHERE id = p_order_id;

  -- Decrement old agent's count
  IF v_old_agent_id IS NOT NULL THEN
    UPDATE profiles
    SET current_order_count = GREATEST(0, current_order_count - 1)
    WHERE id = v_old_agent_id;
  END IF;

  -- Update order
  UPDATE orders
  SET assigned_agent_id = p_agent_id,
      assigned_at = NOW(),
      assigned_by = p_assigned_by,
      status = CASE WHEN status = 'paid' THEN 'assigned' ELSE status END
  WHERE id = p_order_id;

  -- Increment new agent's count
  UPDATE profiles
  SET current_order_count = current_order_count + 1
  WHERE id = p_agent_id;

  -- Log event
  INSERT INTO order_events (order_id, event_type, description, old_value, new_value, created_by)
  VALUES (
    p_order_id,
    'assigned',
    'Order assigned to agent',
    jsonb_build_object('agent_id', v_old_agent_id),
    jsonb_build_object('agent_id', p_agent_id),
    p_assigned_by
  );

  -- Create notification for agent
  INSERT INTO notifications (user_id, order_id, type, title, message)
  SELECT
    p_agent_id,
    p_order_id,
    'order_assigned',
    'Nuevo Proyecto Asignado',
    'Se te ha asignado la Orden #' || order_number || '. Revisa los detalles y contacta al cliente.'
  FROM orders WHERE id = p_order_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update order status
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_new_status order_status,
  p_updated_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_old_status order_status;
BEGIN
  SELECT status INTO v_old_status FROM orders WHERE id = p_order_id;

  UPDATE orders
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_order_id;

  INSERT INTO order_events (order_id, event_type, description, old_value, new_value, created_by)
  VALUES (
    p_order_id,
    'status_changed',
    'Order status updated',
    jsonb_build_object('status', v_old_status),
    jsonb_build_object('status', p_new_status),
    p_updated_by
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA: Sample Agents/Producers
-- =====================================================
-- INSERT INTO profiles (id, email, full_name, phone, whatsapp_number, role, specialties)
-- VALUES
--   (gen_random_uuid(), 'producer1@sozo.mx', 'Maria Garcia', '+525512345678', '5215512345678', 'producer', ARRAY['textil', 'packaging']),
--   (gen_random_uuid(), 'producer2@sozo.mx', 'Carlos Lopez', '+525587654321', '5215587654321', 'producer', ARRAY['tech', 'drinkware']);
