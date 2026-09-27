import { NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  return errorResponse(
    'REGISTRATION_DISABLED',
    'Krijimi i llogarive të reja është i çaktivizuar. Vetëm llogaria e autorizuar velvantesolutions@outlook.com është e lejuar.',
    403
  );
}
