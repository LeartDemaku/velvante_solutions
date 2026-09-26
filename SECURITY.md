# VELVANTE Security Policy

## Security Controls Implemented

1. **Authentication & Password Hashing**:
   - Password hashing using `bcryptjs` with salt round 12.
   - HttpOnly, Secure, SameSite=Lax cookie session handling for admin access.

2. **Input Validation & Sanitization**:
   - Every API endpoint validates input via strict Zod schemas.
   - HTML/script injection protection in user-submitted text.

3. **Rate Limiting**:
   - IP-based rate limiting on sensitive routes (`/api/contact`, `/api/project-inquiries`, `/api/newsletter`).

4. **Security Headers**:
   - Configured in `next.config.ts`:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `X-XSS-Protection: 1; mode=block`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `Permissions-Policy` restrictions

## Reporting Vulnerabilities

If you discover a security vulnerability in VELVANTE, please report it to `security@velvante.com`.
