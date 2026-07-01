export const SECTION_TYPES = {
  HERO: 'hero',
  FEATURED_PRODUCTS: 'featured_products',
  NEW_ARRIVALS: 'new_arrivals',
  BEST_SELLERS: 'best_sellers',
  TRENDING: 'trending',
  DISCOUNT_PRODUCTS: 'discount_products',
  CATEGORY_GRID: 'category_grid',
  SALE_BANNER: 'sale_banner',
  COUNTDOWN_OFFER: 'countdown_offer',
  NEWSLETTER: 'newsletter',
  FOOTER: 'footer',
} as const;

export const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  featured_products: 'Featured Products',
  new_arrivals: 'New Arrivals',
  best_sellers: 'Best Sellers',
  trending: 'Trending',
  discount_products: 'Discount Products',
  category_grid: 'Category Grid',
  sale_banner: 'Sale Banner',
  countdown_offer: 'Countdown Offer',
  newsletter: 'Newsletter',
  footer: 'Footer',
};
