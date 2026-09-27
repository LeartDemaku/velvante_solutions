import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, validationError } from '@/lib/api/response';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return validationError({ email: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (normalizedEmail !== 'velvantesolutions@outlook.com') {
      return errorResponse(
        'FORBIDDEN',
        'Vetëm llogaria zyrtare (velvantesolutions@outlook.com) është e autorizuar për hyrje në këtë panel.',
        403
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash('Admin@2024!', 10);
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: 'Velvante Admin',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse('INVALID_CREDENTIALS', 'Email ose fjalëkalim i pasaktë.', 401);
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[auth/login] error:', err);
    return errorResponse('SERVER_ERROR', 'Shërbimi i autentifikimit nuk është i disponueshëm.', 500);
  }
}
