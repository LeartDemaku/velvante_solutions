import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';
import { successResponse, errorResponse, validationError, serverError } from '@/lib/api/response';
import { getSessionUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(users);
  } catch (err) {
    console.error('[admin/users GET] error:', err);
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (session?.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'Only administrators can create user accounts', 403);
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    const errors: Record<string, string> = {};
    if (!name || String(name).trim().length < 2) {
      errors.name = 'Full name is required';
    }
    if (!email || !String(email).includes('@')) {
      errors.email = 'Valid email address is required';
    }
    if (!password || String(password).length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (Object.keys(errors).length > 0) {
      return validationError(errors);
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return errorResponse('CONFLICT', 'A user with this email address already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role === 'EDITOR' ? 'EDITOR' : 'ADMIN';

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: assignedRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse(user, 201);
  } catch (err) {
    console.error('[admin/users POST] error:', err);
    return serverError();
  }
}
