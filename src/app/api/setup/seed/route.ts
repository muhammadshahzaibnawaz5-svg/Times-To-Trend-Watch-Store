import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isDevMode } from '@/lib/dev-auth';
import type { Database } from '@/types/database';

export async function POST() {
  if (isDevMode()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured' },
      { status: 400 },
    );
  }

  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const adminEmail = 'admin@watchstore.com';
    const adminPassword = 'admin123';

    let adminUserId: string;

    const { data: existingUsers } = await supabase.auth.admin.listUsers();

    const existingUser = existingUsers?.users?.find(
      (u) => u.email === adminEmail,
    );

    if (existingUser) {
      adminUserId = existingUser.id;
    } else {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Admin User' },
      });

      if (createError || !newUser?.user) {
        return NextResponse.json(
          { error: createError?.message || 'Failed to create admin user' },
          { status: 500 },
        );
      }
      adminUserId = newUser.user.id;
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: adminUserId,
      email: adminEmail,
      full_name: 'Admin User',
      role: 'admin',
      phone: '+92-300-1234567',
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const categories = [
      { id: 'cat-1', name: 'Chronograph', slug: 'chronograph', sort_order: 0, is_active: true },
      { id: 'cat-2', name: 'Luxury', slug: 'luxury', sort_order: 1, is_active: true },
      { id: 'cat-3', name: 'Sports', slug: 'sports', sort_order: 2, is_active: true },
      { id: 'cat-4', name: 'Minimalist', slug: 'minimalist', sort_order: 3, is_active: true },
      { id: 'cat-5', name: 'Automatic', slug: 'automatic', sort_order: 4, is_active: true },
      { id: 'cat-6', name: 'Vintage', slug: 'vintage', sort_order: 5, is_active: true },
      { id: 'cat-7', name: 'Modern', slug: 'modern', sort_order: 6, is_active: true },
      { id: 'cat-8', name: 'Classic', slug: 'classic', sort_order: 7, is_active: true },
      { id: 'cat-9', name: 'Aviation', slug: 'aviation', sort_order: 8, is_active: true },
      { id: 'cat-10', name: 'Dress', slug: 'dress', sort_order: 9, is_active: true },
    ];

    const { error: catError } = await supabase.from('categories').upsert(categories, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (catError) {
      return NextResponse.json({ error: `Categories seed failed: ${catError.message}` }, { status: 500 });
    }

    const products = [
      { id: 'watch-10', name: 'Classic Chronograph Silver', slug: 'classic-chronograph-silver', description: 'A timeless silver chronograph with precise quartz movement and elegant dial design.', price: 12999, discount_price: 9999, sku: 'CCS-001', stock_quantity: 15, category_id: 'cat-1', status: 'active' as const, is_featured: true, images: [{ url: '/images/w10.png', alt: 'Classic Chronograph Silver' }] },
      { id: 'watch-14', name: 'Luxury Gold Edition', slug: 'luxury-gold-edition', description: 'Premium gold-toned watch with sapphire crystal glass and genuine leather strap.', price: 24999, discount_price: 19999, sku: 'LGE-002', stock_quantity: 8, category_id: 'cat-2', status: 'active' as const, is_featured: true, images: [{ url: '/images/w14.png', alt: 'Luxury Gold Edition' }] },
      { id: 'watch-15', name: 'Sport Diver 300M', slug: 'sport-diver-300m', description: 'Professional dive watch with 300m water resistance and rotating bezel.', price: 15999, discount_price: null, sku: 'SD3-003', stock_quantity: 20, category_id: 'cat-3', status: 'active' as const, is_featured: true, images: [{ url: '/images/w15.png', alt: 'Sport Diver 300M' }] },
      { id: 'watch-16', name: 'Minimalist Black Dial', slug: 'minimalist-black-dial', description: 'Clean, minimalist design with black dial, slim profile, and Italian leather band.', price: 8999, discount_price: 7499, sku: 'MBD-004', stock_quantity: 25, category_id: 'cat-4', status: 'active' as const, is_featured: false, images: [{ url: '/images/w16.png', alt: 'Minimalist Black Dial' }] },
      { id: 'watch-17', name: 'Automatic Skeleton', slug: 'automatic-skeleton', description: 'Stunning skeleton dial showcasing the automatic movement with exhibition case back.', price: 19999, discount_price: null, sku: 'ASK-005', stock_quantity: 10, category_id: 'cat-5', status: 'active' as const, is_featured: true, images: [{ url: '/images/w17.png', alt: 'Automatic Skeleton' }] },
      { id: 'watch-18', name: 'Retro Vintage Brown', slug: 'retro-vintage-brown', description: 'Vintage-inspired timepiece with brown leather strap and cream dial with Roman numerals.', price: 10999, discount_price: 8499, sku: 'RVB-006', stock_quantity: 12, category_id: 'cat-6', status: 'active' as const, is_featured: false, images: [{ url: '/images/w18.png', alt: 'Retro Vintage Brown' }] },
      { id: 'watch-19', name: 'Modern Steel Blue', slug: 'modern-steel-blue', description: 'Contemporary steel watch with striking blue dial and integrated bracelet design.', price: 13999, discount_price: null, sku: 'MSB-007', stock_quantity: 18, category_id: 'cat-7', status: 'active' as const, is_featured: true, images: [{ url: '/images/w19.png', alt: 'Modern Steel Blue' }] },
      { id: 'watch-20', name: 'Diamond Accent Rose', slug: 'diamond-accent-rose', description: 'Elegant rose gold watch with diamond hour markers and mother-of-pearl dial.', price: 34999, discount_price: 29999, sku: 'DAR-008', stock_quantity: 5, category_id: 'cat-2', status: 'active' as const, is_featured: false, images: [{ url: '/images/w20.png', alt: 'Diamond Accent Rose' }] },
      { id: 'watch-21', name: 'Carbon Fiber Pro', slug: 'carbon-fiber-pro', description: 'Lightweight carbon fiber watch with chronograph features and bold racing aesthetics.', price: 17999, discount_price: null, sku: 'CFP-009', stock_quantity: 7, category_id: 'cat-3', status: 'active' as const, is_featured: false, images: [{ url: '/images/w21.png', alt: 'Carbon Fiber Pro' }] },
      { id: 'watch-22', name: 'Classic White Dial', slug: 'classic-white-dial', description: 'Timeless white dial watch with date window, perfect for formal and casual wear.', price: 9999, discount_price: 7999, sku: 'CWD-010', stock_quantity: 22, category_id: 'cat-8', status: 'active' as const, is_featured: true, images: [{ url: '/images/w22.png', alt: 'Classic White Dial' }] },
      { id: 'watch-23', name: 'Pilot Navigator', slug: 'pilot-navigator', description: 'Aviation-inspired pilot watch with oversized crown, GMT function, and luminescent hands.', price: 18999, discount_price: null, sku: 'PNV-011', stock_quantity: 9, category_id: 'cat-9', status: 'active' as const, is_featured: false, images: [{ url: '/images/w23.png', alt: 'Pilot Navigator' }] },
      { id: 'watch-24', name: 'Ultra-Thin Dress', slug: 'ultra-thin-dress', description: 'Ultra-slim dress watch at only 6mm thick, with sapphire crystal and alligator strap.', price: 21999, discount_price: 17999, sku: 'UTD-012', stock_quantity: 6, category_id: 'cat-10', status: 'active' as const, is_featured: true, images: [{ url: '/images/w24.png', alt: 'Ultra-Thin Dress' }] },
    ];

    const { error: prodError } = await supabase.from('products').upsert(products, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (prodError) {
      return NextResponse.json({ error: `Products seed failed: ${prodError.message}` }, { status: 500 });
    }

    const sections = [
      { id: 'sec-1', name: 'Hero Banner', type: 'hero', title: 'Discover Timeless Elegance', subtitle: 'Explore our premium collection of watches', settings: {}, is_active: true, sort_order: 1 },
      { id: 'sec-2', name: 'Featured Products', type: 'featured_products', title: 'Featured', subtitle: 'Handpicked just for you', settings: {}, is_active: true, sort_order: 2 },
      { id: 'sec-3', name: 'New Arrivals', type: 'new_arrivals', title: 'New Arrivals', subtitle: 'The latest additions', settings: {}, is_active: true, sort_order: 3 },
      { id: 'sec-4', name: 'Best Sellers', type: 'best_sellers', title: 'Best Sellers', subtitle: 'Most popular watches', settings: {}, is_active: true, sort_order: 4 },
      { id: 'sec-5', name: 'Category Grid', type: 'category_grid', title: 'Shop by Category', subtitle: 'Browse our wide selection', settings: {}, is_active: true, sort_order: 5 },
      { id: 'sec-6', name: 'Newsletter', type: 'newsletter', title: 'Stay Updated', subtitle: 'Subscribe for exclusive offers', settings: {}, is_active: true, sort_order: 6 },
      { id: 'sec-7', name: 'Footer', type: 'footer', title: null, subtitle: null, settings: {}, is_active: true, sort_order: 7 },
    ];

    await supabase.from('sections').upsert(sections, { onConflict: 'id', ignoreDuplicates: false });

    const settings = [
      { id: 'set-1', key: 'store_name', value: 'Times to Trend' },
      { id: 'set-2', key: 'store_description', value: 'Premium watches for every occasion' },
      { id: 'set-3', key: 'currency', value: 'PKR' },
      { id: 'set-4', key: 'shipping_fee', value: 250 },
      { id: 'set-5', key: 'free_shipping_threshold', value: 5000 },
    ];

    await supabase.from('settings').upsert(settings, { onConflict: 'id', ignoreDuplicates: false });

    const menus = [
      { id: 'menu-header-1', name: 'Main Navigation', location: 'header', items: [{ id: 'nav-1', label: 'Home', url: '/', children: [] }, { id: 'nav-2', label: 'Products', url: '/products', children: [] }, { id: 'nav-3', label: 'Contact Us', url: '/contact', children: [] }] },
      { id: 'menu-footer-1', name: 'Footer Quick Links', location: 'footer', items: [{ id: 'fl-1', label: 'Home', url: '/', children: [] }, { id: 'fl-2', label: 'Shop', url: '/products', children: [] }, { id: 'fl-3', label: 'Cart', url: '/cart', children: [] }, { id: 'fl-4', label: 'Wishlist', url: '/wishlist', children: [] }] },
      { id: 'menu-footer-2', name: 'Footer Support', location: 'footer-bottom', items: [{ id: 'fs-1', label: 'Contact', url: '/contact', children: [] }, { id: 'fs-2', label: 'Collections', url: '/products', children: [] }, { id: 'fs-3', label: 'Contact', url: '/contact', children: [] }, { id: 'fs-4', label: 'Checkout', url: '/checkout', children: [] }] },
    ];

    await supabase.from('menus').upsert(menus, { onConflict: 'id', ignoreDuplicates: false });

    const { error: bannerError } = await supabase.from('banners').upsert(
      { id: 'banner-1', title: 'Premium Watches For You', subtitle: 'Discover refined everyday watches, dress pieces, and modern sports styles.', image_url: '/images/Hero-banner.png', button_text: 'Shop Collection', button_link: '/products', is_active: true, sort_order: 0 },
      { onConflict: 'id', ignoreDuplicates: false },
    );

    if (bannerError) {
      return NextResponse.json({ error: `Banner seed failed: ${bannerError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      admin_email: adminEmail,
      admin_password: adminPassword,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
