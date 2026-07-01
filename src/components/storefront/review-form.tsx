'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createReview } from '@/actions/review-actions';
import { reviewSchema } from '@/schemas/review-schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingStars } from './rating-stars';
import { toast } from 'sonner';

type ReviewFormProps = { productId: string };

export function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    const parsed = reviewSchema.safeParse({
      productId,
      rating,
      comment: comment || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.set('productId', productId);
    formData.set('rating', String(rating));
    formData.set('comment', comment || '');
    const result = await createReview(formData);
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Review submitted successfully!');
    setRating(0);
    setComment('');
    setError(null);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">Write a Review</h3>

      <div className="space-y-2">
        <Label>Rating</Label>
        <RatingStars rating={rating} interactive onRatingChange={setRating} size="lg" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment (optional)</Label>
        <Textarea
          id="comment"
          placeholder="Share your thoughts about this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}