'use client';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    image: string;
  };
};
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  return (
    <Button
      onClick={() =>
        addItem({
          id: product.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.image,
        })
      }
      className="w-full"
    >
      {' '}
      Add to Cart{' '}
    </Button>
  );
}
