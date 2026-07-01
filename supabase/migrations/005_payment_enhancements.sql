-- ============================================
-- Payment Enhancements — half_paid, screenshots
-- ============================================

-- 1. Add 'half_paid' to the payment_status enum
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'half_paid';

-- 2. Add paid_amount and payment_screenshot columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10,2) CHECK (paid_amount >= 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_screenshot TEXT;
