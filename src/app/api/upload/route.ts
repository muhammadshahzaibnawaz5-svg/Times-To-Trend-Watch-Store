import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { requireApiAuth, getApiUserId } from '@/lib/api-auth';
import { SUPABASE_STORAGE } from '@/constants';

const allowedBuckets = z.enum(['products', 'avatars', 'banners', 'categories', 'pages']);

export async function POST(request: Request) {
  try {
    await requireApiAuth(request);
    const supabase = await createServerClient();
    const userId = await getApiUserId(request);

    const formData = await request.formData();
    const fileEntry = formData.get('file');
    const bucketInput = (formData.get('bucket') as string) || 'products';
    const bucketResult = allowedBuckets.safeParse(bucketInput);

    if (!bucketResult.success) {
      return NextResponse.json({ error: 'Invalid upload bucket' }, { status: 400 });
    }

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const file = fileEntry;
    const bucket = bucketResult.data;

    if (!(SUPABASE_STORAGE.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > SUPABASE_STORAGE.MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    const path = `${userId}/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
