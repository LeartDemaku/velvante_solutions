import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const [contacts, inquiries] = await Promise.all([
      prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
      prisma.projectInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    ]);

    return successResponse({ contacts, inquiries });
  } catch (err) {
    console.error('[admin/leads GET] error:', err);
    return serverError();
  }
}
