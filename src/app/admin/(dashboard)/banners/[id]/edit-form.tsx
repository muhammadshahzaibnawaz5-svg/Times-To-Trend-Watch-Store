'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateBanner } from '@/actions/banner-actions';
import { BannerForm } from '../banner-form';

interface EditBannerFormProps {
  banner: Record<string, unknown>;
}

export function EditBannerForm({ banner }: EditBannerFormProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const bannerId = banner.id as string;
  const currentImage = banner.image_url as string;

  async function handleImageUpload(url: string) {
    if (url === currentImage) return;
    setUploading(true);
    const fd = new FormData();
    fd.set('imageUrl', url);
    const result = await updateBanner(bannerId, fd);
    setUploading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Banner image updated');
      router.push('/admin/banners');
    }
  }

  return (
    <div className="space-y-4">
      {uploading && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating banner...
        </div>
      )}
      <BannerForm onImageUpload={handleImageUpload} currentImage={currentImage} />
    </div>
  );
}
