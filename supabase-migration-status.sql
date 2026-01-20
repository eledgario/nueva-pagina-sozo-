-- Migration: Expand order status options
-- Run this in your Supabase SQL Editor if you have an existing 'orders' table

-- Step 1: Drop the existing status constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Add the new expanded status constraint
-- Status flow: Pending -> Quoted -> Paid -> Production -> Shipped
ALTER TABLE orders ADD CONSTRAINT orders_status_check
CHECK (status IN ('pending', 'quoted', 'paid', 'production', 'shipped', 'cancelled'));

-- Step 3: Update any existing 'processing' status to 'production'
UPDATE orders SET status = 'production' WHERE status = 'processing';

-- Step 4: Update any existing 'completed' status to 'shipped'
UPDATE orders SET status = 'shipped' WHERE status = 'completed';

-- Verify the changes
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
