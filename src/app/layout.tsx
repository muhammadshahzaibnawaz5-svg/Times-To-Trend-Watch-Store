import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { Toaster } from 'sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { absoluteUrl } from '@/lib/seo';
import './globals.css';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});
const siteName = 'Times to Trend';
const defaultDescription = 'Discover premium watches for every occasion at Times to Trend. Free shipping on all orders.';
const defaultOgImage = '/images/og-cover.jpg';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://timestotrend.com'),
  title: { default: siteName, template: '%s | Times to Trend' },
  description: defaultDescription,
  applicationName: siteName,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['watches', 'premium watches', 'luxury watches', 'timepieces', 'watch store', 'Times to Trend'],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    title: siteName,
    description: defaultDescription,
    url: absoluteUrl('/'),
    siteName,
    locale: 'en_US',
    type: 'website',
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: siteName, statusBarStyle: 'default' },
  formatDetection: { telephone: true, email: true, address: true },
};
export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning><body className={inter.className}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster richColors position="top-right" />
      </body></html>
  );
}
