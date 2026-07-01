'use client';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';
type ProductImageGalleryProps = { images: ProductImage[]; productName: string };
export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  if (!images.length) {
    return (
      <div className="bg-muted flex aspect-square items-center justify-center rounded-xl">
        {' '}
        <span className="text-muted-foreground text-sm">No image available</span>{' '}
      </div>
    );
  }
  const selectedImage = images[selectedIndex];
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }
  return (
    <div className="space-y-4">
      {' '}
      {/* â”€â”€â”€ Main Image with Zoom â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
      <div
        ref={containerRef}
        className="bg-muted relative aspect-square overflow-hidden rounded-xl"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {' '}
        <img
          src={selectedImage.url}
          alt={selectedImage.alt || productName}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            isZoomed && 'opacity-0',
          )}
          draggable={false}
        />{' '}
        {isZoomed && (
          <div
            className="absolute inset-0 z-10 hidden md:block"
            style={{
              backgroundImage: `url(${selectedImage.url})`,
              backgroundSize: '250%',
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundRepeat: 'no-repeat',
              cursor: 'crosshair',
            }}
          />
        )}{' '}
      </div>{' '}
      {/* â”€â”€â”€ Thumbnails â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}{' '}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {' '}
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setSelectedIndex(i);
                setIsZoomed(false);
              }}
              className={cn(
                'h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200',
                i === selectedIndex
                  ? 'border-foreground ring-foreground ring-1'
                  : 'border-border/60 hover:border-foreground/40',
              )}
            >
              {' '}
              <img
                src={img.url}
                alt={img.alt || `${productName} ${i + 1}`}
                className="h-full w-full object-cover"
              />{' '}
            </button>
          ))}{' '}
        </div>
      )}{' '}
    </div>
  );
}
