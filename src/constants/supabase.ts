export const SUPABASE_STORAGE = {
  BUCKETS: {
    PRODUCTS: 'products',
    BANNERS: 'banners',
    CATEGORIES: 'categories',
    PAGES: 'pages',
    AVATARS: 'avatars',
  },
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
