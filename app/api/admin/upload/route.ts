import { type NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { successResponse, errorResponse, serverError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('BAD_REQUEST', 'No file uploaded', 400);
    }

    if (!file.type.startsWith('image/')) {
      return errorResponse('BAD_REQUEST', 'Only image files are permitted', 400);
    }

    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return errorResponse('BAD_REQUEST', 'File size exceeds 15MB limit', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    await mkdir(uploadsDir, { recursive: true });

    const originalName = file.name || 'image.png';
    const ext = path.extname(originalName) || '.png';
    const base = path.basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${Date.now()}-${base || 'project'}${ext}`;
    const destination = path.join(uploadsDir, filename);

    await writeFile(destination, buffer);

    const publicUrl = `/uploads/projects/${filename}`;

    return successResponse({
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
    }, 201);
  } catch (err) {
    console.error('[admin/upload POST] error:', err);
    return serverError();
  }
}
