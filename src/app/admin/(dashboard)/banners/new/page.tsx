'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBanner } from '@/actions/banner-actions';
import { BannerForm } from '../banner-form';
export default function NewBannerPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  async function handleImageUpload(url: string) {
    setUploading(true);
    const fd = new FormData();
    fd.set('imageUrl', url);
    const result = await createBanner(fd);
    setUploading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Banner added successfully');
      router.push('/admin/banners');
    }
  }
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {' '}
      <h1 className="text-3xl font-bold">New Banner</h1>{' '}
      {uploading && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          {' '}
          <Loader2 className="h-4 w-4 animate-spin" /> Saving banner...{' '}
        </div>
      )}{' '}
      <BannerForm onImageUpload={handleImageUpload} />{' '}
    </div>
  );
}
