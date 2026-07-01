import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/api-auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export async function POST(request: Request) {
  try {
    await requireApiAuth(request);

    const apiKey = process.env.IMGBB_API_KEY;

    const formData = await request.formData();
    const file = formData.get('file');

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

    if (!apiKey) {
      const fs = await import('fs/promises');
      const join = (await import('path')).join;
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const localPath = join(uploadDir, `${Date.now()}.${ext}`);
      const bytes = await file.arrayBuffer();
      await fs.writeFile(localPath, Buffer.from(bytes));
      const image_url = `/uploads/${localPath.split('\\').pop()?.split('/').pop()}`;

      return NextResponse.json({
        image_url,
        display_url: image_url,
        thumb_url: image_url,
        delete_url: '',
      });
    }

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
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
