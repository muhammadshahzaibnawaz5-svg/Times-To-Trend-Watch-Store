import Link from 'next/link';
type Crumb = { label: string; href?: string };
type BreadcrumbsProps = { items: Crumb[] };
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      {' '}
      <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase">
        {' '}
        <li>
          {' '}
          <Link href="/" className="hover:text-foreground transition-colors">
            {' '}
            Home{' '}
          </Link>{' '}
        </li>{' '}
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {' '}
            <span className="text-muted-foreground/40" aria-hidden="true">
              /
            </span>{' '}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {' '}
                {item.label}{' '}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}{' '}
          </li>
        ))}{' '}
      </ol>{' '}
    </nav>
  );
}
