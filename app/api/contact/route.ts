import { type NextRequest } from 'next/server';
import { contactSchema } from '@/lib/validation/contact';
import { prisma } from '@/lib/db/client';
import { sendContactNotification, sendAutoReply } from '@/lib/email/service';
import {
  successResponse,
  validationError,
  rateLimitError,
} from '@/lib/api/response';
import { rateLimit, getClientIp } from '@/lib/api/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`contact:${ip}`, { max: 10, windowMs: 60_000 });

  if (!allowed) return rateLimitError();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError({ body: 'Invalid JSON' });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.');
      if (path) fields[path] = issue.message;
    }
    return validationError(fields);
  }

  const data = parsed.data;

  if (data.botCheck && data.botCheck.length > 0) {
    return successResponse({ message: 'Your message has been received.' }, 200);
  }

  try {
    await sendContactNotification(data);
    await sendAutoReply(data.email, data.name, data.locale);
  } catch (emailErr) {
    console.error('[contact/route] Email send notification:', emailErr);
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        locale: data.locale,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') ?? undefined,
      },
    });
  } catch (dbErr) {
    console.warn('[contact/route] DB connection warning:', dbErr);
  }

  return successResponse({ message: 'Your message has been received.' }, 201);
}
