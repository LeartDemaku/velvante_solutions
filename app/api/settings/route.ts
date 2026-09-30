import { getSiteSettings } from '@/lib/settings/service';
import { successResponse, serverError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return successResponse(settings);
  } catch (err) {
    return serverError();
  }
}
