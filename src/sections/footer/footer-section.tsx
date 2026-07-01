import Link from 'next/link';
import { ArrowUp, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSectionProps {
  storeName?: string;
  quickLinks?: FooterLink[];
  supportLinks?: FooterLink[];
}

const DEFAULT_QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
  { href: '/wishlist', label: 'Wishlist' },
];

const DEFAULT_SUPPORT_LINKS = [
  { href: '/contact', label: 'Contact' },
  { href: '/products', label: 'Collections' },
  { href: '/faq', label: 'FAQ' },
  { href: '/checkout', label: 'Checkout' },
];

export function FooterSection({
  storeName = 'Times to Trend',
  quickLinks = DEFAULT_QUICK_LINKS,
  supportLinks = DEFAULT_SUPPORT_LINKS,
}: FooterSectionProps) {
  return (
    <footer className="bg-background text-foreground relative overflow-hidden border-t">
      <div
        className="pointer-events-none absolute inset-x-0 top-8 flex justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <span
          className="text-foreground/[0.025] text-[12vw] leading-none font-light whitespace-nowrap"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {storeName}
        </span>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3
              className="text-foreground text-2xl leading-tight font-light"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {storeName}
            </h3>
            <p className="text-muted-foreground/70 mt-1 text-[11px] font-bold uppercase">
              Fine Timepieces
            </p>
            <p className="text-muted-foreground mt-5 text-sm leading-7">
              Premium watches for every occasion, curated with a focus on quality craftsmanship and
              timeless appeal.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Instagram, label: 'Instagram', href: '#' },
                { Icon: Facebook, label: 'Facebook', href: '#' },
                { Icon: Twitter, label: 'Twitter / X', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="border-border text-muted-foreground hover:border-foreground/35 hover:bg-foreground hover:text-background flex h-9 w-9 items-center justify-center rounded-md border transition duration-200"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground/70 mb-5 text-xs font-bold uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className="link-underline text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-muted-foreground/70 mb-5 text-xs font-bold uppercase">Support</h4>
            <ul className="space-y-3.5">
              {supportLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    className="link-underline text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-muted-foreground/70 mb-5 text-xs font-bold uppercase">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail
                  className="text-muted-foreground/65 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.5}
                />
                <a
                  href="mailto:info@timestotrend.com"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  info@timestotrend.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="text-muted-foreground/65 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.5}
                />
                <a
                  href="tel:+923001234567"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="text-muted-foreground/65 mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-muted-foreground text-sm leading-6">
                  123 Watch Avenue, Saddar,
                  <br />
                  Karachi, Pakistan
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border/70 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground/70 text-xs font-medium">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <a
            href="#top"
            className="group text-muted-foreground/70 hover:text-foreground flex items-center gap-2 text-xs font-bold uppercase transition-colors"
          >
            Back to Top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
