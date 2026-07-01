'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface ImageItem {
  url: string;
  file?: File;
}
interface ImageUploadProps {
  bucket: string;
  onImagesChange: (urls: string[]) => void;
  existingUrls?: string[];
  maxFiles?: number;
  accept?: string;
  endpoint?: string;
}
export function ImageUpload({
  bucket,
  onImagesChange,
  existingUrls = [],
  maxFiles = 5,
  accept = 'image/jpeg,image/png,image/webp',
  endpoint,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageItem[]>(existingUrls.map((url) => ({ url })));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateImages = useCallback(
    (newImages: ImageItem[]) => {
      setImages(newImages);
      onImagesChange(newImages.map((img) => img.url));
    },
    [onImagesChange],
  );
  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    if (images.length + files.length > maxFiles) {
      return;
    }
    setUploading(true);
    setUploadError(null);
    const newImages = [...images];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (endpoint) {
        formData.delete('bucket');
      }
      try {
        const uploadUrl = endpoint || '/api/upload';
        const res = await fetch(uploadUrl, { method: 'POST', body: formData });
        const result = await res.json();
        if (!res.ok) {
          setUploadError(result.error || 'Upload failed');
          continue;
        }
        const imageUrl = result.url || result.image_url;
        if (imageUrl) {
          newImages.push({ url: imageUrl, file });
        }
      } catch {
        setUploadError('Upload failed. Please try again.');
      }
    }
    updateImages(newImages);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }
  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    updateImages(newImages);
  }
  return (
    <div className="space-y-3">
      {' '}
      <div className="flex flex-wrap gap-3">
        {' '}
        {images.map((img, idx) => (
          <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-md border">
            {' '}
            <img src={img.url} alt="" className="h-full w-full object-cover" />{' '}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="bg-background/80 absolute top-1 right-1 hidden cursor-pointer rounded-full p-0.5 group-hover:block"
            >
              {' '}
              <X className="h-4 w-4" />{' '}
            </button>{' '}
          </div>
        ))}{' '}
        {images.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              'text-muted-foreground hover:border-primary hover:text-primary flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed',
              uploading && 'cursor-not-allowed opacity-50',
            )}
          >
            {' '}
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                {' '}
                <Upload className="mb-1 h-5 w-5" /> <span className="text-xs">Upload</span>{' '}
              </>
            )}{' '}
          </button>
        )}{' '}
      </div>{' '}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />{' '}
      {uploadError && (
        <p className="text-destructive flex items-center gap-1.5 text-xs">
          {' '}
          <AlertCircle className="h-3.5 w-3.5" /> {uploadError}{' '}
        </p>
      )}{' '}
      <p className="text-muted-foreground text-xs">
        {' '}
        {images.length}/{maxFiles} files. Supports JPEG, PNG, WebP.{' '}
      </p>{' '}
    </div>
  );
}
