import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://timestotrend.com';
const siteName = 'Times to Trend';
const defaultOgImage = '/images/og-cover.jpg';

export function absoluteUrl(path: string): string {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildMetadata(overrides: {
  title: string;
  description: string;
  path?: string;
  keywords?: string | null;
  ogImage?: string | null;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article' | 'product';
}): Metadata {
  const url = overrides.path ? absoluteUrl(overrides.path) : baseUrl;
  const ogImage = overrides.ogImage || defaultOgImage;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage);

  return {
    title: overrides.title,
    description: overrides.description,
    alternates: { canonical: url },
    keywords: overrides.keywords || undefined,
    ...(overrides.noindex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true } }),
    openGraph: {
      title: overrides.title,
      description: overrides.description,
      url,
      siteName,
      locale: 'en_US',
      type: overrides.type || 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: overrides.title,
        },
      ],
    } as Metadata['openGraph'],
    twitter: {
      card: 'summary_large_image',
      title: overrides.title,
      description: overrides.description,
      images: [ogImageUrl],
    },
  };
}

export function buildProductMetadata(product: {
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  images: { url: string }[] | null;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}): Metadata {
  const title = product.seo_title || product.name;
  const description =
    product.seo_description ||
    product.description ||
    `Shop ${product.name} at ${siteName}. Premium quality watches with free shipping.`;
  const ogImage = product.og_image || product.images?.[0]?.url || null;
  const price = product.discount_price ?? product.price;
  const availability = product.stock_quantity > 0
    ? ('https://schema.org/InStock' as const)
    : ('https://schema.org/OutOfStock' as const);

  return {
    ...buildMetadata({
      title,
      description,
      path: `/products/${product.slug}`,
      keywords: product.seo_keywords,
      ogImage,
      type: 'website',
    }),
    other: {
      'product:price:amount': String(price),
      'product:price:currency': 'PKR',
      'product:availability': product.stock_quantity > 0 ? 'in stock' : 'out of stock',
    },
  };
}

export function buildCategoryMetadata(category: {
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  image_url: string | null;
}): Metadata {
  const title = category.seo_title || `${category.name} Watches`;
  const description =
    category.seo_description ||
    category.description ||
    `Browse our curated collection of ${category.name.toLowerCase()} watches at ${siteName}.`;
  const ogImage = category.og_image || category.image_url || null;

  return buildMetadata({
    title,
    description,
    path: `/categories/${category.slug}`,
    keywords: category.seo_keywords,
    ogImage,
  });
}

export function productJsonLd(product: {
  name: string;
  description: string | null;
  images: { url: string }[];
  price: number;
  discount_price: number | null;
  stock_quantity: number;
}) {
  const displayPrice = product.discount_price ?? product.price;
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0]?.url,
    offers: {
      '@type': 'Offer',
      price: displayPrice,
      priceCurrency: 'PKR',
      availability: product.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function collectionJsonLd(products: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: absoluteUrl(p.url),
      })),
    },
  };
}
