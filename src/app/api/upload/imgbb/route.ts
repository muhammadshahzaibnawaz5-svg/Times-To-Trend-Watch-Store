import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireApiAuth, getApiUserId } from '@/lib/api-auth';
import { SUPABASE_STORAGE } from '@/constants';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export async function POST(request: Request) {
  try {
    await requireApiAuth(request);
    const supabase = await createServerClient();
    const userId = await getApiUserId(request);

    const apiKey = process.env.IMGBB_API_KEY;

    const formData = await request.formData();
    const file = formData.get('file');
    const bucketInput = (formData.get('bucket') as string) || 'products';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 },
      );
    }

    // Prefer ImgBB, fallback to Supabase storage
    if (apiKey) {
      const imgbbFormData = new FormData();
      imgbbFormData.append('image', file);
      imgbbFormData.append('key', apiKey);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgbbFormData,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        console.error('ImgBB upload failed:', response.status, errorBody);
        return NextResponse.json(
          { error: 'Image hosting service error. Please try again.' },
          { status: 502 },
        );
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        return NextResponse.json(
          { error: 'Unexpected response from image hosting service.' },
          { status: 502 },
        );
      }

      const { image, medium, thumb, delete_url, display_url } = result.data;
      const image_url = image?.url || display_url;

      return NextResponse.json({
        image_url,
        display_url: display_url || '',
        thumb_url: medium?.url || thumb?.url || image_url,
        delete_url: delete_url || '',
      });
    }

    // Fallback to Supabase storage
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    const path = `${userId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucketInput)
      .upload(path, file, { upsert: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: { publicUrl } } = supabase.storage.from(bucketInput).getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, image_url: publicUrl, display_url: publicUrl, thumb_url: publicUrl, delete_url: '' });
  } catch (error) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
