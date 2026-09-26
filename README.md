# VELVANTE — Digital Experiences & Full-Stack Solutions

> “We Build Digital Systems That Move Businesses Forward.”

VELVANTE is a production-grade, premium, bilingual (English & Albanian) corporate website and digital platform built with Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, next-intl, Prisma, and PostgreSQL.

---

## 🌟 Key Features

- 🌍 **Full Internationalization (i18n)**: Seamless English (`/en`) and Albanian (`/sq`) support with route preservation, hreflang metadata, and locale-aware structured data.
- 🎨 **Design System**: Premium dark visual identity with CSS custom property tokens, editorial typography hierarchy (`Inter` + `JetBrains Mono`), spring motion curves, and custom utility classes.
- 📱 **Responsive & Mobile-First**: Custom hamburger drawer, focus trapping, ESC key listener, body scroll locking, touch-optimised interactions, and safe-area support.
- 💼 **Complete Corporate Platform**:
  - **Homepage**: 14 modular sections (Hero, Trust metrics, Problem/Solution, Services preview, Process, Featured projects, Tech stack, Why VELVANTE, Testimonials, Blog preview, Final CTA).
  - **About Page**: Company overview, Mission, Vision, 6 Core Values, Team members.
  - **Services**: 12 detailed services with dedicated pages (`/services/[slug]`).
  - **Projects / Portfolio**: Filterable project gallery and comprehensive case studies (`/projects/[slug]`).
  - **Blog**: SEO-friendly localized blog platform with articles, reading time, table of contents, and share actions.
  - **Contact & Inquiry System**: Standard contact form plus an 8-step interactive project inquiry workflow (`/start-project`).
  - **Legal & Trust Pages**: Privacy Policy, Terms of Service, Cookie Policy, Accessibility Statement (WCAG 2.2 AA).
- 🔐 **Admin CMS**: Secure admin dashboard (`/admin`) for content management, leads inbox, media manager, and role-based access control.
- ⚡ **Performance & SEO**: Lighthouse 90+ optimized, AVIF/WebP image formatting, Core Web Vitals tuned, dynamic Open Graph images, JSON-LD structured data, and security headers.

---

## 🏗️ Architecture Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (Strict mode) |
| i18n | `next-intl` |
| Styling | Tailwind CSS v4 |
| Motion | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Authentication | Session-based (bcryptjs) |
| Validation | Zod |
| Email | Nodemailer |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm / pnpm / yarn
- PostgreSQL instance (or local Docker container)

### 2. Environment Setup
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seed
```bash
npx prisma generate
npx prisma db push
npm run seed
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the platform.

---

## 🔑 Default Credentials

- **Admin Login Route**: `/admin/login`
- **Email**: `admin@velvante.com`
- **Password**: `Admin@2024!`

---

## 📂 Project Directory Structure

```
velvante/
├── app/
│   ├── [locale]/              # Public bilingual pages (en/sq)
│   │   ├── page.tsx           # Homepage (14 sections)
│   │   ├── about/             # About VELVANTE
│   │   ├── services/          # Services index & [slug] details
│   │   ├── projects/          # Portfolio index & [slug] case studies
│   │   ├── blog/              # Blog index & [slug] articles
│   │   ├── contact/           # Contact form page
│   │   ├── start-project/     # 8-step project inquiry workflow
│   │   ├── privacy-policy/
│   │   ├── terms/
│   │   ├── cookie-policy/
│   │   └── accessibility/
│   ├── admin/                 # CMS Dashboard (Login, Overview)
│   └── api/                   # REST API Endpoints (contact, inquiry, search, etc.)
├── components/
│   ├── ui/                    # Base UI components (Button, Input, Card, Modal...)
│   ├── layout/                # Navbar, Footer, CookieBanner, BackToTop
│   ├── forms/                 # Newsletter, Contact, Inquiry forms
│   └── animations/            # MotionWrapper & Stagger components
├── lib/
│   ├── db/                    # Prisma client
│   ├── i18n/                  # next-intl configuration & routing
│   ├── validation/            # Zod schemas
│   ├── api/                   # API response formatters & rate limiting
│   └── email/                 # Email notification service
├── locales/
│   ├── en/                    # English translation JSONs
│   └── sq/                    # Albanian translation JSONs
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Production seed script
└── docs/                      # Technical documentation
```

---

## 📜 License

© VELVANTE. All rights reserved. Proprietary digital platform codebase.
