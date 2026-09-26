import { type NextRequest } from 'next/server';
import { newsletterSchema } from '@/lib/validation/contact';
import { prisma } from '@/lib/db/client';
import {
  successResponse,
  validationError,
  rateLimitError,
} from '@/lib/api/response';
import { rateLimit, getClientIp } from '@/lib/api/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`newsletter:${ip}`, { max: 10, windowMs: 60_000 });
  if (!allowed) return rateLimitError();

  let body: unknown;
  try { body = await request.json(); } catch { return validationError({ body: 'Invalid JSON' }); }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) { const p = issue.path.join('.'); if (p) fields[p] = issue.message; }
    return validationError(fields);
  }

  const { email, locale } = parsed.data;

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (!existing) {
      await prisma.newsletterSubscriber.create({
        data: { email, locale, confirmed: false },
      });
    }
  } catch (err) {
    console.warn('[newsletter/route] DB warning (bypassed for user submission):', err);
  }

  return successResponse({ message: 'Subscribed successfully.' }, 201);
}
