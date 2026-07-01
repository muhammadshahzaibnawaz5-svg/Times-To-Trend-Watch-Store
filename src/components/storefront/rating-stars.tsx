'use client';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
type RatingStarsProps = {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
};
const sizeMap = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };
export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    const filled = rating >= i;
    const half = !filled && rating >= i - 0.5;
    stars.push(
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(i)}
        className={cn(
          'cursor-pointer transition-colors',
          interactive && 'hover:scale-110',
          !interactive && 'cursor-default',
        )}
      >
        {half ? (
          <StarHalf className={cn(sizeMap[size], 'fill-foreground text-foreground')} />
        ) : (
          <Star
            className={cn(
              sizeMap[size],
              filled ? 'fill-foreground text-foreground' : 'fill-muted text-muted-foreground',
            )}
          />
        )}
      </button>,
    );
  }
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of ${maxRating} stars`}>
      {stars}
    </div>
  );
}
