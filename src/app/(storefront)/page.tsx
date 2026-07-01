import Link from 'next/link';
import { ArrowRight, Gem, Headphones, Lock, Truck } from 'lucide-react';
import { getStoreBanners } from '@/actions/storefront-actions';
import { getActiveSections } from '@/actions/section-actions';
import { getSectionProducts } from '@/sections/section-products-helper';
import { createServerClient } from '@/lib/supabase/server';
import type { Banner } from '@/types/banner';
import type { Product } from '@/types/product';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductGrid } from '@/components/storefront/product-grid';
import { HeroBanner } from '@/components/storefront/hero-banner';
import { BannerCarousel } from '@/components/storefront/banner-carousel';
import { ReviewCarousel } from '@/components/storefront/review-carousel';

const FALLBACK_IMG = '/images/New-watch.webp';

interface CategoryCard {
  label: string;
  href: string;
  image: string;
  slug: string;
}

interface HomePageData {
  banners: Banner[];
  featuredProducts: Product[];
  categories: CategoryCard[];
}

async function getCategoryImage(slug: string): Promise<string> {
  const supabase = await createServerClient();
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (!category) return FALLBACK_IMG;
  const { data: products } = await supabase
    .from('products')
    .select('images')
    .eq('category_id', category.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1);
  const images = (products?.[0]?.images as { url: string }[]) || [];
  return images[0]?.url || FALLBACK_IMG;
}

async function getHomePageData(): Promise<HomePageData> {
  const [bannersResult, sectionsResult] = await Promise.all([
    getStoreBanners(),
    getActiveSections(),
  ]);
  const banners = bannersResult.data || [];
  const featuredSection = (sectionsResult.data || []).find(
    (s: { type: string }) => s.type === 'featured_products',
  );
  const featuredProducts = ((await getSectionProducts(featuredSection?.id, async (supabase) => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8);
    return data;
  })) || []) as Product[];
  const categoryDefs = [
    { label: 'Dress Watches', slug: 'dress' },
    { label: 'Sport Watches', slug: 'sports' },
    { label: 'Automatic', slug: 'automatic' },
  ];
  const categories = await Promise.all(
    categoryDefs.map(async (cat) => ({
      label: cat.label,
      href: `/products?category=${cat.slug}`,
      image: await getCategoryImage(cat.slug),
      slug: cat.slug,
    })),
  );
  return { banners, featuredProducts, categories };
}

export default async function HomePage() {
  const { banners, featuredProducts, categories } = await getHomePageData();
  const serviceItems = [
    {
      icon: Truck,
      title: 'Free Shipping',
      text: 'Complimentary shipping on every order, no minimum required.',
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      text: 'Protected checkout with encrypted transactions for peace of mind.',
    },
    {
      icon: Gem,
      title: 'Premium Quality',
      text: 'Each timepiece is hand-selected and verified for authentic craftsmanship.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      text: 'Real people ready to help anytime, before, during, and after your purchase.',
    },
  ];

  return (
    <main className="bg-background">
      <HeroBanner banners={banners} />

      <section className="bg-background border-b py-14 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-label text-muted-foreground">Shop by Intent</p>
            <span className="section-rule mx-auto mt-3" />
            <h2 className="text-foreground mt-6 text-4xl leading-tight font-black md:text-5xl">
              Find the Right Watch
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm leading-7">
              Every watch tells a story. Choose the style that matches your rhythm, your
              occasions, and the statement you want to make.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.label}
                href={category.href}
                className="group border-border/60 bg-card hover:border-foreground/25 relative overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-5 md:p-6">
                  <div className="border-border bg-muted/50 text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
                    Collection
                  </div>
                  <h3 className="text-foreground mt-3 text-lg font-bold transition-colors duration-200 group-hover:text-foreground/80">
                    {category.label}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-foreground/40 transition-all duration-300 group-hover:text-foreground/70">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="group border-foreground hover:bg-foreground hover:text-background inline-flex h-12 items-center gap-3 rounded-md border px-8 text-xs font-bold uppercase transition duration-300"
            >
              Browse All Collections
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section id="featured" className="py-14 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-label text-muted-foreground">Curated Collection</p>
                <span className="section-rule mt-3" />
                <h2 className="text-4xl leading-tight font-black md:text-6xl">Featured Watches</h2>
              </div>
              <p className="text-muted-foreground max-w-sm text-sm leading-7 md:text-right">
                A focused selection of watches that pair clean design with practical everyday wear.
              </p>
            </div>
            <ProductGrid>
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product as any} priority={index < 4} />
              ))}
            </ProductGrid>
            <div className="mt-12 flex justify-center">
              <Link
                href="/products"
                className="group border-foreground hover:bg-foreground hover:text-background inline-flex h-12 items-center gap-3 rounded-md border px-8 text-xs font-bold uppercase transition duration-300"
              >
                View All Products
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-14 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="text-label text-muted-foreground">Why Choose Us</p>
            <span className="section-rule mx-auto mt-3" />
            <h2 className="text-foreground mt-4 text-4xl leading-tight font-black md:text-5xl">
              Built on Trust
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-sm leading-7">
              Every decision we make is rooted in quality, reliability, and respect for your time.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="premium-panel-subtle group hover:border-foreground/20 relative rounded-lg px-7 py-9 transition duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="border-foreground/10 bg-muted group-hover:bg-foreground group-hover:text-background flex h-12 w-12 items-center justify-center rounded-md border transition duration-300">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-foreground mt-6 text-sm font-bold uppercase">{item.title}</h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-6">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ReviewCarousel />
      <BannerCarousel />

      <section className="relative overflow-hidden border-t bg-black py-14 md:py-20 text-white">
        <div className="bg-diagonal-lines absolute inset-0 opacity-100" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-label text-white/45">Need Help Choosing?</p>
            <h2 className="mt-4 text-4xl leading-[1.15] font-light md:text-6xl">
              Get a watch that fits <br />
              <em className="font-medium not-italic">your</em> routine.
            </h2>
            <p className="mt-5 text-sm text-white/60">
              Speak to a watch specialist today. No pressure, just good advice.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center gap-3 rounded-md bg-white px-8 text-xs font-bold text-black uppercase transition duration-300 hover:bg-white/90"
              >
                Contact Our Team
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-3 rounded-md border border-white/25 px-8 text-xs font-bold text-white/75 uppercase transition duration-300 hover:border-white/60 hover:text-white"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
