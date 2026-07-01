-- ============================================
-- Adnan Watch Store — Section Products Junction
-- ============================================

-- Junction table: manually assign products to sections with sort order
CREATE TABLE section_products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(section_id, product_id)
);

-- Indexes
CREATE INDEX idx_section_products_section ON section_products(section_id);
CREATE INDEX idx_section_products_product ON section_products(product_id);
CREATE INDEX idx_section_products_sort ON section_products(section_id, sort_order);

-- RLS
ALTER TABLE section_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view section products"
  ON section_products FOR SELECT USING (true);

CREATE POLICY "Admins full access to section products"
  ON section_products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
