import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const [rawContacts, rawInquiries] = await Promise.all([
      prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.projectInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    ]);

    const inquiries = rawInquiries.map((inq) => {
      let parsedServices: string[] = [];
      if (Array.isArray(inq.services)) {
        parsedServices = inq.services as string[];
      } else if (typeof inq.services === 'string') {
        try {
          const parsed = JSON.parse(inq.services);
          parsedServices = Array.isArray(parsed) ? parsed : [inq.services];
        } catch {
          parsedServices = (inq.services as string).split(',').map((s) => s.trim()).filter(Boolean);
        }
      }

      return {
        ...inq,
        services: parsedServices,
      };
    });

    return successResponse({ contacts: rawContacts, inquiries });
  } catch (err) {
    console.error('[admin/leads GET] error:', err);
    return serverError();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return validationError({ message: 'Type, ID, and Status are required' });
    }

    if (type === 'contact') {
      await prisma.contactSubmission.update({
        where: { id },
        data: { status },
      });
    } else if (type === 'inquiry') {
      await prisma.projectInquiry.update({
        where: { id },
        data: { status },
      });
    } else {
      return validationError({ type: 'Invalid lead type' });
    }

    return successResponse({ id, status, message: 'Status updated successfully' });
  } catch (err) {
    console.error('[admin/leads PATCH] error:', err);
    return serverError();
  }
}
