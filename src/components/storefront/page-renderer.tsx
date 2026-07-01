import { cn } from '@/lib/utils';
import type { PageContentBlock } from '@/types/page';
interface PageRendererProps {
  blocks: PageContentBlock[];
}
export function PageRenderer({ blocks }: PageRendererProps) {
  return (
    <div className="page-content">
      {' '}
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}{' '}
    </div>
  );
}
function BlockRenderer({ block }: { block: PageContentBlock }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'columns':
      return <ColumnsBlock block={block} />;
    case 'cta':
      return <CTABlock block={block} />;
    case 'faq':
      return <FAQBlock block={block} />;
    default:
      return null;
  }
}
function HeroBlock({ block }: { block: Extract<PageContentBlock, { type: 'hero' }> }) {
  return (
    <section
      className="from-primary/10 to-primary/5 relative flex min-h-[400px] items-center justify-center bg-gradient-to-br px-6 py-20"
      style={
        block.backgroundImage
          ? {
              backgroundImage: `url(${block.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {' '}
      <div
        className={cn(
          'text-center',
          block.backgroundImage && 'bg-background/85 rounded-md p-8 backdrop-blur-sm',
        )}
      >
        {' '}
        {block.heading && (
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{block.heading}</h1>
        )}{' '}
        {block.subheading && (
          <p className="text-muted-foreground mt-4 text-lg">{block.subheading}</p>
        )}{' '}
        {block.ctaLabel && block.ctaUrl && (
          <a
            href={block.ctaUrl}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold shadow transition-colors"
          >
            {' '}
            {block.ctaLabel}{' '}
          </a>
        )}{' '}
      </div>{' '}
    </section>
  );
}
function TextBlock({ block }: { block: Extract<PageContentBlock, { type: 'text' }> }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {' '}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />{' '}
    </section>
  );
}
function ImageBlock({ block }: { block: Extract<PageContentBlock, { type: 'image' }> }) {
  return (
    <section className="px-6 py-12">
      {' '}
      <figure
        className={cn(
          'mx-auto max-w-4xl',
          block.alignment === 'left' && 'ml-0',
          block.alignment === 'right' && 'mr-0',
          block.alignment === 'center' && 'text-center',
        )}
      >
        {' '}
        <img src={block.imageUrl} alt={block.caption || ''} className="rounded-md shadow-lg" />{' '}
        {block.caption && (
          <figcaption className="text-muted-foreground mt-2 text-sm"> {block.caption} </figcaption>
        )}{' '}
      </figure>{' '}
    </section>
  );
}
function ColumnsBlock({ block }: { block: Extract<PageContentBlock, { type: 'columns' }> }) {
  return (
    <section className="container mx-auto px-4 py-12">
      {' '}
      <div
        className={cn(
          'mx-auto grid max-w-5xl gap-8',
          block.columns === 2 ? 'grid-cols-2 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3',
        )}
      >
        {' '}
        {block.columnContents.map((col, idx) => (
          <div
            key={idx}
            className="prose prose-gray bg-card max-w-none rounded-md border p-6"
            dangerouslySetInnerHTML={{ __html: col.content }}
          />
        ))}{' '}
      </div>{' '}
    </section>
  );
}
function CTABlock({ block }: { block: Extract<PageContentBlock, { type: 'cta' }> }) {
  return (
    <section
      className="px-6 py-16 text-center"
      style={block.backgroundColor ? { backgroundColor: block.backgroundColor } : undefined}
    >
      {' '}
      <div className="mx-auto max-w-2xl">
        {' '}
        {block.heading && (
          <h2 className="text-3xl font-bold tracking-tight">{block.heading}</h2>
        )}{' '}
        {block.description && (
          <p className="text-muted-foreground mt-4 text-lg">{block.description}</p>
        )}{' '}
        {block.buttonLabel && block.buttonUrl && (
          <a
            href={block.buttonUrl}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold shadow transition-colors"
          >
            {' '}
            {block.buttonLabel}{' '}
          </a>
        )}{' '}
      </div>{' '}
    </section>
  );
}
function FAQBlock({ block }: { block: Extract<PageContentBlock, { type: 'faq' }> }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {' '}
      <div className="space-y-4">
        {' '}
        {block.items.map((item, idx) => (
          <details key={idx} className="group bg-card rounded-md border">
            {' '}
            <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-lg font-medium">
              {' '}
              {item.question}{' '}
              <span className="ml-2 shrink-0 transition-transform group-open:rotate-180">
                {' '}
                v{' '}
              </span>{' '}
            </summary>{' '}
            <div className="text-muted-foreground border-t px-6 py-4"> {item.answer} </div>{' '}
          </details>
        ))}{' '}
      </div>{' '}
    </section>
  );
}
