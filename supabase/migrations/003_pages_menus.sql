-- ============================================
-- Adnan Watch Store — Pages & Menus Schema
-- ============================================

-- 1. PAGE TEMPLATE ENUM
CREATE TYPE page_template AS ENUM ('default', 'full_width', 'sidebar', 'landing');

-- 2. PAGES TABLE
CREATE TABLE pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  content         JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title      TEXT,
  meta_description TEXT,
  template        page_template NOT NULL DEFAULT 'default',
  is_published    BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. MENUS TABLE
CREATE TABLE menus (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  location   TEXT NOT NULL UNIQUE,
  items      JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INDEXES
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published) WHERE is_published = true;

-- 5. UPDATED_AT TRIGGERS
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_menus_updated_at
  BEFORE UPDATE ON menus FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. RLS

-- 6.1 pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Admins full access to pages"
  ON pages FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6.2 menus
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view menus"
  ON menus FOR SELECT USING (true);
CREATE POLICY "Admins full access to menus"
  ON menus FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
