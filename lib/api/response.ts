import { NextResponse } from 'next/server';

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export function successResponse<T>(data: T, status = 200, meta?: Record<string, unknown>): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data, ...(meta ? { meta } : {}) }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code, message, ...(fields ? { fields } : {}) } },
    { status }
  );
}

export function validationError(fields: Record<string, string>): NextResponse<ApiError> {
  return errorResponse('VALIDATION_ERROR', 'Validation failed', 400, fields);
}

export function notFoundError(resource = 'Resource'): NextResponse<ApiError> {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404);
}

export function unauthorizedError(): NextResponse<ApiError> {
  return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
}

export function forbiddenError(): NextResponse<ApiError> {
  return errorResponse('FORBIDDEN', 'Insufficient permissions', 403);
}

export function serverError(message = 'Internal server error'): NextResponse<ApiError> {
  return errorResponse('INTERNAL_ERROR', message, 500);
}

export function rateLimitError(): NextResponse<ApiError> {
  return errorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', 429);
}
