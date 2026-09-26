# VELVANTE Architecture Overview

## System Layers

1. **Presentation Layer (Next.js 15 App Router)**:
   - Server Components by default for max performance and static prerendering.
   - Client Components isolated to interactive islands (forms, mobile navigation, search, motion wrappers).
   - `next-intl` request configuration handles locale prefixing (`/en`, `/sq`) and namespace-based JSON message loading.

2. **API & Domain Layer (`app/api/`)**:
   - Standardized REST response envelopes via `lib/api/response.ts` (`{ success: true, data: ... }` / `{ success: false, error: { code, message } }`).
   - Strict Zod validation schemas in `lib/validation/`.
   - In-memory rate-limiting middleware per IP for contact and project inquiry endpoints.

3. **Data Layer (Prisma ORM & PostgreSQL)**:
   - Normalized relational schema supporting multi-locale translations for Services, Projects, Blog Posts, Testimonials, and Team Members.
   - Soft deletions (`deletedAt`), indexed queries (`slug`, `published`, `featured`), and cascading foreign keys.

4. **Design Tokens & Motion**:
   - CSS variables in `app/globals.css` driving Tailwind CSS v4 variables.
   - Framer Motion variants library with automatic fallback for users with `prefers-reduced-motion`.
