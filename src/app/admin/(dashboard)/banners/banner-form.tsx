'use client';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/shared/image-upload';
interface BannerFormProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}
export function BannerForm({ onImageUpload, currentImage }: BannerFormProps) {
  return (
    <div className="space-y-4">
      {' '}
      <div className="space-y-2">
        {' '}
        <Label>Banner Image</Label>{' '}
        <p className="text-muted-foreground text-sm">
          {' '}
          Upload a background image for the hero banner. The existing text and buttons will remain
          unchanged.{' '}
        </p>{' '}
        <ImageUpload
          bucket="banners"
          existingUrls={currentImage ? [currentImage] : []}
          onImagesChange={(urls) => {
            if (urls[0]) onImageUpload(urls[0]);
          }}
          maxFiles={1}
        />{' '}
      </div>{' '}
    </div>
  );
}
