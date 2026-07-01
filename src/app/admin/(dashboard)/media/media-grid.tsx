'use client';
import { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Trash2, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/admin/empty-state';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { createClient } from '@/lib/supabase/client';
interface MediaFile {
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
}
const BUCKETS = ['products', 'categories', 'banners', 'pages', 'avatars'];
async function listAllMedia(): Promise<MediaFile[]> {
  const supabase = createClient();
  const files: MediaFile[] = [];
  for (const bucket of BUCKETS) {
    const { data, error } = await supabase.storage.from(bucket).list();
    if (error || !data) continue;
    for (const item of data) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(`${item.name}`);
      files.push({
        name: item.name,
        url: urlData.publicUrl,
        created_at: item.created_at || '',
        updated_at: item.updated_at || '',
      });
    }
  }
  return files.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
export function MediaGrid() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteFile, setDeleteFile] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    listAllMedia().then((result) => {
      setFiles(result);
      setLoading(false);
    });
  }, []);
  async function handleUpload(filesList: FileList | null) {
    if (!filesList?.length) return;
    setUploading(true);
    const supabase = createClient();
    for (const file of Array.from(filesList)) {
      const bucket = file.type.startsWith('image/') ? 'products' : 'products';
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }
    const result = await listAllMedia();
    setFiles(result);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  }
  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  }
  async function handleDelete(name: string) {
    setDeleting(true);
    const supabase = createClient();
    for (const bucket of BUCKETS) {
      const { error } = await supabase.storage.from(bucket).remove([name]);
      if (!error) break;
    }
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setDeleting(false);
    setDeleteFile(null);
    toast.success('File deleted');
  }
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {' '}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-muted aspect-square animate-pulse rounded-lg" />
        ))}{' '}
      </div>
    );
  }
  return (
    <>
      {' '}
      <div className="mb-4">
        {' '}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />{' '}
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          {' '}
          {uploading ? (
            <>
              {' '}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...{' '}
            </>
          ) : (
            <>
              {' '}
              <Upload className="mr-2 h-4 w-4" /> Upload Images{' '}
            </>
          )}{' '}
        </Button>{' '}
      </div>{' '}
      {files.length === 0 ? (
        <EmptyState
          title="No media found"
          description="Upload images to use across your store."
          action={
            <Button onClick={() => inputRef.current?.click()}>
              {' '}
              <Upload className="mr-2 h-4 w-4" /> Upload{' '}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {' '}
          {files.map((file) => (
            <div
              key={file.name}
              className="group bg-card relative overflow-hidden rounded-lg border cursor-pointer transition-shadow duration-300 hover:shadow-lg"
            >
              {' '}
              <div className="aspect-square">
                {' '}
                <img src={file.url} alt={file.name} className="h-full w-full object-cover" />{' '}
              </div>{' '}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {' '}
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyUrl(file.url, file.name)}
                >
                  {' '}
                  {copiedId === file.name ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}{' '}
                </Button>{' '}
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDeleteFile(file.name)}
                >
                  {' '}
                  <Trash2 className="h-4 w-4" />{' '}
                </Button>{' '}
              </div>{' '}
              <div className="border-t px-3 py-2">
                {' '}
                <p className="text-muted-foreground truncate text-xs" title={file.name}>
                  {' '}
                  {file.name}{' '}
                </p>{' '}
              </div>{' '}
            </div>
          ))}{' '}
        </div>
      )}{' '}
      <ConfirmDialog
        open={!!deleteFile}
        onOpenChange={() => setDeleteFile(null)}
        title="Delete Media"
        description="Are you sure you want to delete this file? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={async () => {
          if (deleteFile) await handleDelete(deleteFile);
        }}
      />{' '}
    </>
  );
}
