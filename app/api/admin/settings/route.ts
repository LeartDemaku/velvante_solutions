import { type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings/service';
import { successResponse, serverError, validationError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return successResponse(settings);
  } catch (err) {
    console.error('[admin/settings GET] error:', err);
    return serverError();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteName, notificationEmail, contactPhone, primaryLocation, primaryLocationSq } = body;

    if (notificationEmail && !notificationEmail.includes('@')) {
      return validationError({ notificationEmail: 'Invalid notification email address' });
    }

    const updated = await updateSiteSettings({
      siteName,
      notificationEmail,
      contactPhone,
      primaryLocation,
      primaryLocationSq,
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return successResponse(updated);
  } catch (err) {
    console.error('[admin/settings PUT] error:', err);
    return serverError();
  }
}
