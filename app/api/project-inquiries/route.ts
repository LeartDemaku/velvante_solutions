import { type NextRequest } from 'next/server';
import { projectInquirySchema } from '@/lib/validation/contact';
import { prisma } from '@/lib/db/client';
import { sendProjectInquiryNotification, sendAutoReply } from '@/lib/email/service';
import {
  successResponse, validationError, rateLimitError,
} from '@/lib/api/response';
import { rateLimit, getClientIp } from '@/lib/api/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`inquiry:${ip}`, { max: 10, windowMs: 300_000 });
  if (!allowed) return rateLimitError();

  let body: unknown;
  try { body = await request.json(); } catch { return validationError({ body: 'Invalid JSON' }); }

  const parsed = projectInquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) { const p = issue.path.join('.'); if (p) fields[p] = issue.message; }
    return validationError(fields);
  }

  const data = parsed.data;

  if (data.botCheck && data.botCheck.length > 0) {
    return successResponse({ message: 'Project inquiry received.' }, 200);
  }

  try {
    const { getSiteSettings } = await import('@/lib/settings/service');
    const settings = await getSiteSettings();
    await sendProjectInquiryNotification(data, settings.notificationEmail);
    await sendAutoReply(data.email, `${data.firstName} ${data.lastName}`, data.locale);
  } catch (emailErr) {
    console.error('[project-inquiries/route] Email error:', emailErr);
  }

  try {
    await prisma.projectInquiry.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        website: data.website || null,
        projectType: data.projectType,
        services: data.services,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        timeline: data.timeline,
        description: data.description || 'Project Inquiry Submission',
        goals: data.goals,
        locale: data.locale,
        ipAddress: ip,
      },
    });
  } catch (dbErr) {
    console.warn('[project-inquiries/route] DB error:', dbErr);
  }

  return successResponse({ message: 'Project inquiry received.' }, 201);
}
