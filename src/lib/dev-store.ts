import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import os from 'os';

type Row = Record<string, unknown>;
type TableName = string;

const STORAGE_KEY = '__adnan_dev_store__';
const DATA_FILE = path.join(
  (() => {
    try {
      const dir = path.join(os.tmpdir(), 'adnan-dev-store');
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      return process.cwd();
    }
  })(),
  '.dev-data.json',
);

const seedMenus = [
  {
    id: 'menu-header-1',
    name: 'Main Navigation',
    location: 'header',
    items: [
      { id: 'nav-1', label: 'Home', url: '/', children: [] },
      { id: 'nav-2', label: 'Products', url: '/products', children: [] },
      { id: 'nav-3', label: 'Contact Us', url: '/contact', children: [] },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'menu-footer-1',
    name: 'Footer Quick Links',
    location: 'footer',
    items: [
      { id: 'fl-1', label: 'Home', url: '/', children: [] },
      { id: 'fl-2', label: 'Shop', url: '/products', children: [] },
      { id: 'fl-3', label: 'Cart', url: '/cart', children: [] },
      { id: 'fl-4', label: 'Wishlist', url: '/wishlist', children: [] },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'menu-footer-2',
    name: 'Footer Support',
    location: 'footer-bottom',
    items: [
      { id: 'fs-1', label: 'Contact', url: '/contact', children: [] },
      { id: 'fs-2', label: 'Collections', url: '/products', children: [] },
      { id: 'fs-3', label: 'Contact', url: '/contact', children: [] },
      { id: 'fs-4', label: 'Checkout', url: '/checkout', children: [] },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const seedBanners = [
  {
    id: 'banner-1',
    title: 'Premium Watches For You',
    subtitle: 'Discover refined everyday watches, dress pieces, and modern sports styles.',
    image_url: '/images/Hero-banner.png',
    button_text: 'Shop Collection',
    button_link: '/products',
    is_active: true,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const seedCategories = [
  { id: 'cat-1', name: 'Chronograph', slug: 'chronograph', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Luxury', slug: 'luxury', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Sports', slug: 'sports', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Minimalist', slug: 'minimalist', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Automatic', slug: 'automatic', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Vintage', slug: 'vintage', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Modern', slug: 'modern', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Classic', slug: 'classic', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Aviation', slug: 'aviation', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'cat-10', name: 'Dress', slug: 'dress', description: null, image_url: null, parent_id: null, is_active: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const seedProducts = [
  { id: 'watch-10', name: 'Classic Chronograph Silver', slug: 'classic-chronograph-silver', description: 'A timeless silver chronograph with precise quartz movement and elegant dial design.', price: 12999, discount_price: 9999, sku: 'CCS-001', stock_quantity: 15, category_id: 'cat-1', status: 'active', is_featured: true, images: [{ url: '/images/w10.png', alt: 'Classic Chronograph Silver' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-14', name: 'Luxury Gold Edition', slug: 'luxury-gold-edition', description: 'Premium gold-toned watch with sapphire crystal glass and genuine leather strap.', price: 24999, discount_price: 19999, sku: 'LGE-002', stock_quantity: 8, category_id: 'cat-2', status: 'active', is_featured: true, images: [{ url: '/images/w14.png', alt: 'Luxury Gold Edition' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-15', name: 'Sport Diver 300M', slug: 'sport-diver-300m', description: 'Professional dive watch with 300m water resistance and rotating bezel.', price: 15999, discount_price: null, sku: 'SD3-003', stock_quantity: 20, category_id: 'cat-3', status: 'active', is_featured: true, images: [{ url: '/images/w15.png', alt: 'Sport Diver 300M' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-16', name: 'Minimalist Black Dial', slug: 'minimalist-black-dial', description: 'Clean, minimalist design with black dial, slim profile, and Italian leather band.', price: 8999, discount_price: 7499, sku: 'MBD-004', stock_quantity: 25, category_id: 'cat-4', status: 'active', is_featured: false, images: [{ url: '/images/w16.png', alt: 'Minimalist Black Dial' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-17', name: 'Automatic Skeleton', slug: 'automatic-skeleton', description: 'Stunning skeleton dial showcasing the automatic movement with exhibition case back.', price: 19999, discount_price: null, sku: 'ASK-005', stock_quantity: 10, category_id: 'cat-5', status: 'active', is_featured: true, images: [{ url: '/images/w17.png', alt: 'Automatic Skeleton' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-18', name: 'Retro Vintage Brown', slug: 'retro-vintage-brown', description: 'Vintage-inspired timepiece with brown leather strap and cream dial with Roman numerals.', price: 10999, discount_price: 8499, sku: 'RVB-006', stock_quantity: 12, category_id: 'cat-6', status: 'active', is_featured: false, images: [{ url: '/images/w18.png', alt: 'Retro Vintage Brown' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-19', name: 'Modern Steel Blue', slug: 'modern-steel-blue', description: 'Contemporary steel watch with striking blue dial and integrated bracelet design.', price: 13999, discount_price: null, sku: 'MSB-007', stock_quantity: 18, category_id: 'cat-7', status: 'active', is_featured: true, images: [{ url: '/images/w19.png', alt: 'Modern Steel Blue' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-20', name: 'Diamond Accent Rose', slug: 'diamond-accent-rose', description: 'Elegant rose gold watch with diamond hour markers and mother-of-pearl dial.', price: 34999, discount_price: 29999, sku: 'DAR-008', stock_quantity: 5, category_id: 'cat-2', status: 'active', is_featured: false, images: [{ url: '/images/w20.png', alt: 'Diamond Accent Rose' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-21', name: 'Carbon Fiber Pro', slug: 'carbon-fiber-pro', description: 'Lightweight carbon fiber watch with chronograph features and bold racing aesthetics.', price: 17999, discount_price: null, sku: 'CFP-009', stock_quantity: 7, category_id: 'cat-3', status: 'active', is_featured: false, images: [{ url: '/images/w21.png', alt: 'Carbon Fiber Pro' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-22', name: 'Classic White Dial', slug: 'classic-white-dial', description: 'Timeless white dial watch with date window, perfect for formal and casual wear.', price: 9999, discount_price: 7999, sku: 'CWD-010', stock_quantity: 22, category_id: 'cat-8', status: 'active', is_featured: true, images: [{ url: '/images/w22.png', alt: 'Classic White Dial' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-23', name: 'Pilot Navigator', slug: 'pilot-navigator', description: 'Aviation-inspired pilot watch with oversized crown, GMT function, and luminescent hands.', price: 18999, discount_price: null, sku: 'PNV-011', stock_quantity: 9, category_id: 'cat-9', status: 'active', is_featured: false, images: [{ url: '/images/w23.png', alt: 'Pilot Navigator' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'watch-24', name: 'Ultra-Thin Dress', slug: 'ultra-thin-dress', description: 'Ultra-slim dress watch at only 6mm thick, with sapphire crystal and alligator strap.', price: 21999, discount_price: 17999, sku: 'UTD-012', stock_quantity: 6, category_id: 'cat-10', status: 'active', is_featured: true, images: [{ url: '/images/w24.png', alt: 'Ultra-Thin Dress' }], variants: [], meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const seedSections = [
  { id: 'sec-1', name: 'Hero Banner', type: 'hero', title: 'Discover Timeless Elegance', subtitle: 'Explore our premium collection of watches', settings: {}, is_active: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sec-2', name: 'Featured Products', type: 'featured_products', title: 'Featured', subtitle: 'Handpicked just for you', settings: {}, is_active: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sec-3', name: 'New Arrivals', type: 'new_arrivals', title: 'New Arrivals', subtitle: 'The latest additions', settings: {}, is_active: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sec-4', name: 'Best Sellers', type: 'best_sellers', title: 'Best Sellers', subtitle: 'Most popular watches', settings: {}, is_active: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sec-5', name: 'Category Grid', type: 'category_grid', title: 'Shop by Category', subtitle: 'Browse our wide selection', settings: {}, is_active: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sec-6', name: 'Newsletter', type: 'newsletter', title: 'Stay Updated', subtitle: 'Subscribe for exclusive offers', settings: {}, is_active: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'sec-7', name: 'Footer', type: 'footer', title: null, subtitle: null, settings: {}, is_active: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const seedSettings = [
  { id: 'set-1', key: 'store_name', value: '"Times to Trend"', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'set-2', key: 'store_description', value: '"Premium watches for every occasion"', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'set-3', key: 'currency', value: '"PKR"', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'set-4', key: 'shipping_fee', value: '250', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'set-5', key: 'free_shipping_threshold', value: '5000', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const INITIAL_TABLES: Record<TableName, Row[]> = {
  menus: seedMenus as unknown as Row[],
  banners: seedBanners as unknown as Row[],
  products: seedProducts as unknown as Row[],
  categories: seedCategories as unknown as Row[],
  sections: seedSections as unknown as Row[],
  settings: seedSettings as unknown as Row[],
};

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function persistStore(store: Record<TableName, Row[]>): void {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[dev-store] Failed to persist data to', DATA_FILE, err);
  }
}

function loadStore(): Record<TableName, Row[]> | null {
  try {
    if (existsSync(DATA_FILE)) {
      const content = readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[dev-store] Failed to load persisted data, falling back to seeds:', err);
  }
  return null;
}

function getMutableStore(): Record<TableName, Row[]> {
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as Record<string, unknown>;
    if (!g[STORAGE_KEY]) {
      const persisted = loadStore();
      if (persisted) {
        g[STORAGE_KEY] = persisted;
      } else {
        const store: Record<string, Row[]> = {};
        for (const key of Object.keys(INITIAL_TABLES)) {
          store[key] = clone(INITIAL_TABLES[key]);
        }
        g[STORAGE_KEY] = store;
        persistStore(store);
      }
    }
    return g[STORAGE_KEY] as Record<TableName, Row[]>;
  }
  return INITIAL_TABLES;
}

export function getTableData(table: string): Row[] {
  const store = getMutableStore();
  if (!store[table]) {
    store[table] = [];
  }
  return store[table];
}

export function devQuery(table: string) {
  const data = getTableData(table);

  let filtered = [...data];
  let selectedColumns: string | undefined;
  let orderColumn: string | undefined;
  let orderAsc = true;
  let rangeFrom: number | undefined;
  let rangeTo: number | undefined;
  let limitCount: number | undefined;
  let countMode = false;

  const chain: Record<string, unknown> = {};

  function resolveSelect(rows: Row[]): Row[] {
    if (!selectedColumns || selectedColumns === '*' || selectedColumns.includes('*')) return rows;
    const cols = selectedColumns.split(',').map(c => c.trim()).filter(c => !c.includes('('));
    if (cols.length === 0) return rows;
    return rows.map(r => {
      const obj: Row = {};
      for (const col of cols) {
        if (col in r) obj[col] = r[col];
      }
      return obj;
    });
  }

  function applyFilters() {
    let result = [...filtered];

    if (orderColumn) {
      result.sort((a, b) => {
        const va = a[orderColumn!];
        const vb = b[orderColumn!];
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'string' && typeof vb === 'string') {
          return orderAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return orderAsc ? (va as number) - (vb as number) : (vb as number) - (va as number);
      });
    }

    result = resolveSelect(result);

    if (rangeFrom !== undefined && rangeTo !== undefined) {
      result = result.slice(rangeFrom, rangeTo + 1);
    } else if (limitCount !== undefined) {
      result = result.slice(0, limitCount);
    }

    return result;
  }

  const exec = async () => {
    const rows = applyFilters();
    if (countMode) {
      return { data: rows, error: null, count: filtered.length };
    }
    return { data: rows, error: null, count: null };
  };

  const methods = {
    select: (columns?: string, opts?: { count?: 'exact' | 'planned' | 'estimated' }) => {
      selectedColumns = columns;
      if (opts?.count === 'exact') countMode = true;
      return { ...chain, ...buildChain() };
    },
    insert: (values: Row) => {
      const newRow = { ...values, id: values.id || crypto.randomUUID() };
      data.push(newRow);
      persistStore(getMutableStore());
      return {
        select: () => ({
          single: async () => Promise.resolve({ data: newRow, error: null }),
        }),
      };
    },
    update: (values: Row) => ({
      eq: (col: string, val: unknown) => {
        const idx = data.findIndex(r => r[col] === val);
        if (idx !== -1) {
          data[idx] = { ...data[idx], ...values, updated_at: new Date().toISOString() };
          persistStore(getMutableStore());
        }
        return {
          select: () => ({
            single: async () => Promise.resolve({ data: idx !== -1 ? data[idx] : null, error: null }),
          }),
        };
      },
    }),
    delete: () => ({
      eq: (col: string, val: unknown) => {
        const idx = data.findIndex(r => r[col] === val);
        if (idx !== -1) {
          data.splice(idx, 1);
          persistStore(getMutableStore());
        }
        return exec;
      },
    }),
    upsert: (values: Row, opts?: { onConflict?: string; ignoreDuplicates?: boolean }) => {
      let existingIdx = -1;
      if (opts?.onConflict) {
        const conflictCols = opts.onConflict.split(',').map(c => c.trim());
        existingIdx = data.findIndex(r =>
          conflictCols.every(col => r[col] === values[col]),
        );
      }

      if (existingIdx !== -1) {
        data[existingIdx] = { ...data[existingIdx], ...values, updated_at: new Date().toISOString() };
        persistStore(getMutableStore());
        const updated = data[existingIdx];
        return {
          select: () => ({
            single: async () => Promise.resolve({ data: updated, error: null }),
          }),
        };
      }

      const newRow = { ...values, id: values.id || crypto.randomUUID() };
      data.push(newRow);
      persistStore(getMutableStore());
      return {
        select: () => ({
          single: async () => Promise.resolve({ data: newRow, error: null }),
        }),
      };
    },
    eq: (col: string, val: unknown) => {
      filtered = filtered.filter(r => r[col] === val);
      return { ...chain, ...buildChain() };
    },
    neq: (col: string, val: unknown) => {
      filtered = filtered.filter(r => r[col] !== val);
      return { ...chain, ...buildChain() };
    },
    in: (col: string, vals: unknown[]) => {
      filtered = filtered.filter(r => vals.includes(r[col]));
      return { ...chain, ...buildChain() };
    },
    is: (col: string, val: unknown) => {
      if (val === null) filtered = filtered.filter(r => r[col] == null);
      else filtered = filtered.filter(r => r[col] === val);
      return { ...chain, ...buildChain() };
    },
    like: (col: string, pattern: string) => {
      const regex = new RegExp('^' + pattern.replace(/%/g, '.*') + '$', 'i');
      filtered = filtered.filter(r => typeof r[col] === 'string' && regex.test(r[col] as string));
      return { ...chain, ...buildChain() };
    },
    ilike: (col: string, pattern: string) => {
      const regex = new RegExp('^' + pattern.replace(/%/g, '.*') + '$', 'i');
      filtered = filtered.filter(r => typeof r[col] === 'string' && regex.test(r[col] as string));
      return { ...chain, ...buildChain() };
    },
    gte: (col: string, val: number) => {
      filtered = filtered.filter(r => (r[col] as number) >= val);
      return { ...chain, ...buildChain() };
    },
    lte: (col: string, val: number) => {
      filtered = filtered.filter(r => (r[col] as number) <= val);
      return { ...chain, ...buildChain() };
    },
    gt: (col: string, val: number) => {
      filtered = filtered.filter(r => (r[col] as number) > val);
      return { ...chain, ...buildChain() };
    },
    lt: (col: string, val: number) => {
      filtered = filtered.filter(r => (r[col] as number) < val);
      return { ...chain, ...buildChain() };
    },
    order: (col: string, opts?: { ascending?: boolean }) => {
      orderColumn = col;
      orderAsc = opts?.ascending ?? true;
      return { ...chain, ...buildChain() };
    },
    range: (from: number, to: number) => {
      rangeFrom = from;
      rangeTo = to;
      return { ...chain, ...buildChain() };
    },
    limit: (n: number) => {
      limitCount = n;
      return { ...chain, ...buildChain() };
    },
    single: async () => {
      const rows = applyFilters();
      return Promise.resolve({ data: rows[0] || null, error: null });
    },
    maybeSingle: async () => {
      const rows = applyFilters();
      return Promise.resolve({ data: rows[0] || null, error: null });
    },
    then: (resolve: (v: { data: Row[]; error: null; count: number | null }) => void) => {
      const rows = applyFilters();
      resolve({ data: rows, error: null, count: countMode ? filtered.length : null });
    },
    catch: () => chain,
    finally: () => chain,
  };

  function buildChain() {
    const c: Record<string, unknown> = {};
    for (const key of Object.keys(methods)) {
      c[key] = (methods as Record<string, unknown>)[key];
    }
    return c as typeof methods;
  }

  return { ...methods, ...buildChain() };
}
