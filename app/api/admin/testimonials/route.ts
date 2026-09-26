import { type NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';
import { successResponse, validationError, serverError } from '@/lib/api/response';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
      include: { translations: true },
    });
    return successResponse(testimonials);
  } catch (err) {
    console.error('[admin/testimonials GET] error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, quoteEn, quoteSq, rating } = body;

    if (!name || !quoteEn) {
      return validationError({ name: 'Name and quote are required' });
    }

    const created = await prisma.testimonial.create({
      data: {
        name,
        role: role || 'Client',
        company: company || 'Company',
        rating: parseInt(rating || '5', 10),
        published: true,
        featured: true,
        translations: {
          create: [
            { locale: 'en', quote: quoteEn },
            { locale: 'sq', quote: quoteSq || quoteEn },
          ],
        },
      },
    });

    return successResponse(created, 201);
  } catch (err) {
    console.error('[admin/testimonials POST] error:', err);
    return serverError();
  }
}
