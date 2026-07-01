-- Seed: Default sections for the homepage
INSERT INTO sections (name, type, title, subtitle, settings, is_active, sort_order)
VALUES
  ('Hero Banner', 'hero', 'Discover Timeless Elegance', 'Explore our premium collection of watches', '{}', true, 1),
  ('Featured Products', 'featured_products', 'Featured', 'Handpicked just for you', '{}', true, 2),
  ('New Arrivals', 'new_arrivals', 'New Arrivals', 'The latest additions to our collection', '{}', true, 3),
  ('Best Sellers', 'best_sellers', 'Best Sellers', 'Most popular watches this month', '{}', true, 4),
  ('Category Grid', 'category_grid', 'Shop by Category', 'Browse our wide selection', '{}', true, 5),
  ('Newsletter', 'newsletter', 'Stay Updated', 'Subscribe for exclusive offers', '{}', true, 6),
  ('Footer', 'footer', NULL, NULL, '{}', true, 7);

-- Seed: Default settings
INSERT INTO settings (key, value) VALUES
  ('store_name', '"Times to Trend"'),
  ('store_description', '"Premium watches for every occasion"'),
  ('currency', '"PKR"'),
  ('shipping_fee', '250'),
  ('free_shipping_threshold', '5000');
