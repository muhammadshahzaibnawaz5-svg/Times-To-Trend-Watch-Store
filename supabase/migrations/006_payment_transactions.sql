-- ============================================
-- Payment Transactions — store account & txn ID
-- ============================================

-- 1. Add account_number column (the buyer's account)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS account_number TEXT;

-- 2. Add payment_account_number column (the store account payment was sent to)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account_number TEXT;

-- 3. Add transaction_id column with unique constraint to prevent duplicates
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id) WHERE transaction_id IS NOT NULL;
