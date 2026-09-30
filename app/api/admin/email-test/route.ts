import { type NextRequest } from 'next/server';
import { verifySmtpConnection, sendTestEmail } from '@/lib/email/service';
import { getSiteSettings } from '@/lib/settings/service';
import { successResponse, errorResponse } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const settings = await getSiteSettings();
    const recipient = settings.notificationEmail || 'velvantesolutions@outlook.com';

    const connectionTest = await verifySmtpConnection();
    if (!connectionTest.ok) {
      return errorResponse('SMTP_CONNECTION_ERROR', connectionTest.error || 'Failed to connect to SMTP server', 400);
    }

    const testSendResult = await sendTestEmail(recipient);
    if (!testSendResult.ok) {
      return errorResponse('SMTP_SEND_ERROR', testSendResult.error || 'Failed to dispatch test email', 400);
    }

    return successResponse({
      message: `Test email dispatched successfully to ${recipient}`,
      messageId: testSendResult.messageId,
    });
  } catch (err: any) {
    return errorResponse('INTERNAL_ERROR', err?.message || 'Internal server error while testing email', 500);
  }
}
