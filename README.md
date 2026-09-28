# VELVANTE SOLUTIONS — Modern Digital Systems & Full-Stack Platform

> **"We build digital systems that move businesses forward."**

Velvante Solutions is a boutique software engineering studio and digital consultancy founded by **Leart Demaku**. This repository hosts our complete corporate platform—a high-performance, bilingual (English & Albanian) digital experience built with Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4, Prisma ORM, and a custom administrative CMS.

Every component, interaction, and database model in this platform was engineered by hand with an obsessive focus on performance, bulletproof mobile reliability, accessible design, and clean architecture.

---

## 📑 Table of Contents

1. [Platform Overview & Vision](#-platform-overview--vision)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Deep Engineering Highlights](#-deep-engineering-highlights)
   - [Bilingual Core & Routing (i18n)](#1-bilingual-core--routing-i18n)
   - [Mobile-First Overhaul & iOS Low Power Mode Hardening](#2-mobile-first-overhaul--ios-low-power-mode-hardening)
   - [Interactive 8-Step Project Scoping Wizard](#3-interactive-8-step-project-scoping-wizard)
   - [Full Services Catalog (12 Disciplines)](#4-full-services-catalog-12-disciplines)
   - [Portfolio & Case Studies Platform](#5-portfolio--case-studies-platform)
   - [Engineering & Insights Blog](#6-engineering--insights-blog)
   - [Contact Hub & 2-Hour Response SLA](#7-contact-hub--2-hour-response-sla)
   - [Enterprise Admin CMS & Lead Pipeline](#8-enterprise-admin-cms--lead-pipeline)
   - [Dark Neo-Canvas Design System](#9-dark-neo-canvas-design-system)
   - [Privacy, Compliance & Accessibility](#10-privacy-compliance--accessibility)
4. [Email Pipeline & Communications Architecture](#-email-pipeline--communications-architecture)
5. [Database Schema & Models](#-database-schema--models)
6. [Master Implementation Roadmap](#-master-implementation-roadmap)
7. [Repository Structure](#-repository-structure)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
9. [Environment Variables Reference](#-environment-variables-reference)
10. [Production Build & GitHub Deployment](#-production-build--github-deployment)
11. [Codebase Standards & Philosophy](#-codebase-standards--philosophy)
12. [Author & Contact](#-author--contact)

---

## 🌐 Platform Overview & Vision

Velvante Solutions was founded to solve a real industry problem: businesses frequently end up with websites that look reasonable at first glance but crumble in practice—suffering from slow database queries, broken mobile interactions, inaccessible typography, and high vendor lock-in.

This codebase serves as both our primary digital home and a real-world demonstration of how we engineer software:

- **True Bilingualism**: Complete, native English (`/en`) and Albanian (`/sq`) routing with seamless locale persistence and automated route prefetching.
- **Extreme Speed**: Static pre-rendering across 54+ pages, sub-second route transitions with Turbopack, and zero layout shift.
- **Fail-Safe Communications**: Direct, dual-dispatch notifications routing to our official company inbox (`velvantesolutions@outlook.com`) via Resend API and Outlook SMTP fallback.
- **Operational Autonomy**: Full internal CMS (`/admin`) for publishing projects, managing blog articles, adjusting services, and tracking client inquiries through a Kanban-style pipeline.

---

## 🛠 Technology Stack & Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  (Next.js 16 App Router · React 19 · Hardware CSS Motion)│
└────────────────────────────┬─────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────────────┐ ┌────────────────────────┐
│     Public Bilingual Web      │ │    Admin CMS Portal    │
│  /[locale] (en / sq)          │ │  /admin (Dashboard,    │
│  · Homepage (14 Sections)     │ │   Leads, Projects,     │
│  · Services (12 Categories)   │ │   Blog, Services,      │
│  · Projects (Case Studies)    │ │   Media, Settings)     │
│  · Blog, Contact, Wizard      │ └───────────┬────────────┘
└───────────────┬───────────────┘             │
                │                             │
                ▼                             ▼
┌──────────────────────────────────────────────────────────┐
│                    API & Service Layer                   │
│  · REST endpoints (/api/contact, /api/project-inquiries) │
│  · Sliding-window IP Rate Limiting (60s window)          │
│  · Honeypot Bot Filtering & Zod Validation               │
└───────────────┬─────────────────────────────┬────────────┘
                │                             │
                ▼                             ▼
┌───────────────────────────────┐ ┌────────────────────────┐
│     Data Persistence Layer    │ │   Email Dispatch Hub   │
│  · Prisma ORM 6.19            │ │  · Resend REST API     │
│  · PostgreSQL / SQLite Engine │ │  · Outlook SMTP Backup │
│  · Multi-locale Schema Tables │ │  · velvantesolutions@  │
└───────────────────────────────┘ │    outlook.com         │
                                  └────────────────────────┘
```

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.3.1 | App Router with Turbopack compiler, Server Components by default |
| **UI Library** | React 19.2.8 | Strict hydration, server actions ready, zero third-party component wrappers |
| **Language** | TypeScript 5 | Strict mode enabled, zero loose `any` typing |
| **Styling** | Tailwind CSS v4 | CSS theme tokens, variable-driven dark system, zero runtime CSS-in-JS |
| **Internationalization** | `next-intl` 4.13.7 | Request-scoped locale resolution, message namespaces, fallback chains |
| **Data Layer** | Prisma ORM 6.19.3 | Normalized relational schema, automatic timestamps, soft deletion flags |
| **Database** | PostgreSQL / SQLite | Multi-table locale relations for seamless translation management |
| **Email Services** | Resend API + Nodemailer | Dual-delivery architecture for transactional notifications and auto-replies |
| **Input Validation** | Zod | Runtime schema validation on client and server boundaries |
| **Auth** | NextAuth + bcryptjs | Secure salted credential hashing and role-based session management |
| **Icons** | Lucide React | Tree-shaken, high-clarity SVG icon set |

---

## ⚡ Deep Engineering Highlights

### 1. Bilingual Core & Routing (i18n)

Rather than treating internationalization as an afterthought, this platform was architected from the ground up for two primary languages: **English (`/en`)** and **Albanian (`/sq`)**.

- **Clean Route Structure**: Every public URL is scoped under `/[locale]/` with full route equivalence (`/sq/about` matches `/en/about`, `/sq/services/[slug]` matches `/en/services/[slug]`).
- **Legacy Path Redirects**: In-flight redirects configured in `next.config.ts` automatically forward legacy Albanian slugs (`/sq/sherbimet` -> `/sq/services`, `/sq/projektet` -> `/sq/projects`, `/sq/kontakt` -> `/sq/contact`, `/sq/fillo-projektin` -> `/sq/start-project`).
- **Instant Client Prefetching**: The language switcher in the navbar uses Next.js router prefetching on hover and idle, allowing users to toggle between English and Albanian instantly with zero network delay.

### 2. Mobile-First Overhaul & iOS Low Power Mode Hardening

One of the most critical engineering achievements in this platform was completely resolving mobile rendering traps under iOS Safari:

- **The Low Power Mode Trap**: When iPhones enter Low Power Mode (or when users enable "Reduce Motion"), WebKit throttles JavaScript timers and drops `IntersectionObserver` animation triggers. Traditional libraries that start components with `initial={{ opacity: 0 }}` leave elements permanently stuck at zero opacity, turning sections into giant black voids.
- **The Solution**: We completely eradicated initial invisible states on primary content components. All cards, headings, and metrics mount immediately with 100% visibility.
- **Hardware-Accelerated Navigation Drawer**: Framer Motion spring physics were replaced with pure, hardware-accelerated CSS transitions (`translate-x-0` / `translate-x-full`). When closed, the mobile menu receives `pointer-events-none`, guaranteeing it never captures touches or freezes page scrolling.
- **Zero Touch Delay**: Applied `touch-action: manipulation` across all buttons, interactive cards, and form inputs to eliminate the notorious 300ms double-tap delay on mobile devices.
- **Touch Target Integrity**: Every tap target exceeds the Apple Human Interface Guidelines minimum of 44x44px.

### 3. Interactive 8-Step Project Scoping Wizard (`/start-project`)

Instead of a generic, boring contact form, we built an intuitive 8-step project planner that guides potential clients through defining their technical requirements:

1. **Client Identity**: Name and personal contact information.
2. **Business Context**: Company name, current digital footprint, and industry vertical.
3. **Project Classification**: New Website, Full-Stack Web App, E-Commerce Platform, UI/UX Redesign, or Maintenance Retainer.
4. **Service Multi-Select**: Granular selection across our 12 engineering capabilities.
5. **Investment Range**: Budget tiers transparently defined (€1,000–€3,000, €3,000–€7,000, €7,000–€15,000, €15,000+).
6. **Delivery Timeline**: Desired launch window (< 1 month, 1–3 months, 3–6 months, flexible).
7. **Detailed Technical Brief**: Project scope, business goals, and special integrations.
8. **Summary & Verification**: Visual review step with instant progress bar calculation and submission.

Submissions are persisted to the database and immediately trigger formatted notification emails to `velvantesolutions@outlook.com`.

### 4. Full Services Catalog (12 Disciplines)

Our services platform features 12 specialized disciplines, each with its own comprehensive overview, key capabilities, technology badges, deliverables, and dedicated dynamic page (`/services/[slug]`):

1. **Full-Stack Web Development** (`/services/fullstack-development`): End-to-end modern web applications built with Next.js, React, Node.js, and TypeScript.
2. **Web Applications (SaaS)** (`/services/web-applications`): Scalable software platforms with authentication, subscription billing, and real-time features.
3. **E-Commerce Development** (`/services/ecommerce`): Conversion-focused online storefronts with Stripe, PayPal, and custom inventory synchronization.
4. **Custom Web Design** (`/services/web-design`): Bespoke digital aesthetics tailored to elevate high-end brand perception.
5. **UI/UX Design & Prototyping** (`/services/ui-ux-design`): User journey mapping, interactive Figma wireframes, and ergonomic design systems.
6. **Backend & APIs** (`/services/backend-apis`): Resilient microservices, REST/GraphQL APIs, and background job processing pipelines.
7. **Database Architecture & Infrastructure** (`/services/database-infrastructure`): Normalized relational databases, indexing, connection pooling, and automated backups.
8. **SEO & Performance Optimization** (`/services/seo-performance`): Core Web Vitals optimization, semantic schema markup, and high Lighthouse scoring.
9. **AI Integration & Automation** (`/services/ai-automation`): LLM workflow automation, intelligent customer assistants, and data processing bots.
10. **Cybersecurity & Hardening** (`/services/security`): Vulnerability assessments, SSL/TLS enforcement, sanitization, and DDoS mitigation.
11. **Maintenance & SLA Support** (`/services/maintenance-support`): Proactive server monitoring, dependency updates, and guaranteed response times.
12. **Cloud Architecture & DevOps**: Dockerized environments, CI/CD automated deployments, and serverless hosting.

### 5. Portfolio & Case Studies Platform (`/projects` & `/projects/[slug]`)

Our portfolio showcases real-world systems built with our methodology:

- **Filterable Showcase**: Interactive category switcher (E-Commerce, Web Apps, Corporate, SaaS).
- **In-Depth Case Studies**: Each project slug details the initial client challenge, technical solution architecture, technology stack badges, project year, and verified business outcomes (e.g., +140% conversion increase, 60% load time reduction).
- **Direct Live Links**: Clickable verified links to inspect live client deployments.

### 6. Engineering & Insights Blog (`/blog` & `/blog/[slug]`)

A content hub built for technical leadership and educational articles:

- Dynamic reading time estimates based on localized word counts.
- Category organization and tag filtering.
- Author bio integration with social and professional credentials.
- Integrated newsletter subscription widget with instant email validation.

### 7. Contact Hub & 2-Hour Response SLA (`/contact`)

- Direct access channels: Primary company email (`velvantesolutions@outlook.com`), telephone contact, and office address.
- Guaranteed **< 2-Hour Response Time** commitment during active business hours.
- Honeypot bot protection (`botCheck` field) that silently rejects automated spam crawlers without inconveniencing legitimate visitors.
- Sliding-window rate limiting allowing a maximum of 10 submissions per minute per IP address.

### 8. Enterprise Admin CMS & Lead Pipeline (`/admin`)

Built directly into the application for autonomous operational management:

- **Authentication**: Secure login page (`/admin/login`) with bcrypt salted password verification and session protection.
- **Lead Pipeline CRM (`/admin/leads`)**: Centralized view of all contact messages and project scoping inquiries, complete with status tags (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`).
- **Project Manager (`/admin/projects`)**: Create, update, publish, or feature client case studies with multi-image support.
- **Blog Publisher (`/admin/blog`)**: Full rich article drafting, publishing workflow, and category management.
- **Service Offering Editor (`/admin/services`)**: Adjust service titles, descriptions, and feature lists.
- **Testimonial Moderation (`/admin/testimonials`)**: Review and toggle client endorsements.
- **Media Asset Manager (`/admin/media`)**: Image upload management and asset storage.
- **Mobile-Ready Admin Layout**: Horizontal scrolling responsive navigation allowing full administrative control directly from a smartphone.

### 9. Dark Neo-Canvas Design System

The visual design system of Velvante Solutions is based on a dark, technical, and precise aesthetic:

- **Coordinate Canvas (`.grid-overlay`)**: A subtle, elegant 48px grid canvas running across sections to evoke digital engineering and precision.
- **Luminous Ambient Glow**: Soft, hardware-accelerated neon orbs (indigo, cyan, violet) positioned along key page waypoints with `pointer-events-none` so they never interfere with cursor or touch actions.
- **Glassmorphic Cards**: Multi-layered background blur (`backdrop-blur-xl`), subtle borders (`rgb(var(--color-border)/0.8)`), and soft elevation hover states.
- **Typography Hierarchy**: Clear editorial pairing of `Inter` for crisp body prose and `JetBrains Mono` for metadata, tags, and technical metrics.

### 10. Privacy, Compliance & Accessibility

- **GDPR-Ready Privacy Policy** (`/privacy-policy`): Transparent disclosure of data handling and storage practices.
- **Terms of Service** (`/terms`): Clear commercial agreements and licensing terms.
- **Cookie Consent Banner & Policy** (`/cookie-policy`): Interactive cookie preference banner with localStorage state management.
- **WCAG 2.2 AA Accessibility Statement** (`/accessibility`): High-contrast color ratios, semantic HTML landmarks, keyboard tab navigation, and screen reader-friendly aria labels.

---

## 📬 Email Pipeline & Communications Architecture

Communication reliability is mission-critical. When a client requests a project quote or sends an inquiry, the message must never be lost in a void. We engineered a **dual-dispatch email system**:

```
Client Submits Form
         │
         ▼
[Input Validation & Honeypot Check]
         │
         ▼
┌─────────────────────────────────┐
│ Primary: Resend REST API        │ ── Success ──► Delivered to velvantesolutions@outlook.com
└────────────────┬────────────────┘
                 │ (if Resend unavailable / not set)
                 ▼
┌─────────────────────────────────┐
│ Fallback: Outlook SMTP          │ ── Success ──► Delivered to velvantesolutions@outlook.com
│ (smtp-mail.outlook.com:587)     │
└─────────────────────────────────┘
                 │
                 ▼
[Automated Bilingual Client Auto-Reply Sent (EN or SQ)]
                 │
                 ▼
[Record Saved to PostgreSQL / SQLite Database]
```

1. **Recipient Inbox**: All inbound inquiries and project scoping briefs route directly to:
   **`velvantesolutions@outlook.com`**
2. **Branded HTML Notifications**: Notifications arrive in our inbox with client details, phone number, requested services, budget range, timeline, and an instant "Reply Directly to Client" one-click button.
3. **Instant Auto-Replies**: The client automatically receives a polished, bilingual confirmation in their chosen language (English or Albanian) confirming that their message has been received and our engineering team will follow up within 24 hours.

---

## 🗄 Database Schema & Models

The relational database schema is managed via Prisma (`prisma/schema.prisma`):

| Model | Purpose | Key Attributes |
|---|---|---|
| `User` | Admin users & CMS operators | `email`, `password` (bcrypt), `role` (ADMIN/EDITOR), timestamps |
| `Service` | Service catalog entries | `slug`, `icon`, `order`, `published`, `featured` |
| `ServiceTranslation` | Localized service content | `serviceId`, `locale` (en/sq), `title`, `description`, `capabilities` |
| `ProjectCategory` | Portfolio categories | `slug`, `name`, `nameAl` |
| `Project` | Case studies & portfolio items | `slug`, `coverImage`, `technologies`, `year`, `published`, `featured` |
| `ProjectTranslation` | Localized case study briefs | `projectId`, `locale`, `title`, `challenge`, `solution`, `results` |
| `BlogCategory` | Blog article categories | `slug`, `name`, `nameAl` |
| `BlogPost` | Technical articles & tutorials | `slug`, `authorId`, `coverImage`, `status`, `readingTime` |
| `BlogTranslation` | Localized article content | `postId`, `locale`, `title`, `excerpt`, `content` |
| `Testimonial` | Client reviews & endorsements | `name`, `role`, `company`, `rating`, `published` |
| `ContactSubmission` | General contact form leads | `name`, `email`, `phone`, `service`, `message`, `status`, `ipAddress` |
| `ProjectInquiry` | 8-step wizard scoping records | `clientName`, `company`, `budget`, `timeline`, `services`, `status` |
| `NewsletterSubscriber` | Email subscriber list | `email`, `locale`, `confirmed` |
| `MediaAsset` | Uploaded media files | `filename`, `url`, `mimeType`, `size` |

---

## 🗺 Master Implementation Roadmap

### Completed Milestones

- [x] **Milestone 1 — Core Architecture & Internationalization**: Setup Next.js 16 with App Router, Turbopack, and `next-intl` dual-locale routing (`/en`, `/sq`).
- [x] **Milestone 2 — Design System & Custom Canvas**: Implemented dark neo-canvas, 48px coordinate grid, luminous glow orbs, and glassmorphic UI components.
- [x] **Milestone 3 — Content Platforms & Dynamic Routing**: Built 12-service catalog (`/services/[slug]`), portfolio case studies (`/projects/[slug]`), and engineering blog (`/blog/[slug]`).
- [x] **Milestone 4 — 8-Step Project Inquiry Wizard**: Developed the interactive project scoping funnel (`/start-project`) with budget tiers, multi-select services, and step transitions.
- [x] **Milestone 5 — Production Email Pipeline**: Built dual-delivery engine (Resend API + Outlook SMTP fallback) routing to `velvantesolutions@outlook.com` with localized auto-replies.
- [x] **Milestone 6 — Mobile WebKit & Low Power Mode Hardening**: Completely eliminated initial `opacity: 0` states, migrated mobile navigation drawer to hardware CSS transitions, and added `touch-action: manipulation` for zero-delay mobile interactions.
- [x] **Milestone 7 — Admin CMS & Lead Inbox**: Built secure administration portal (`/admin`) for leads, projects, blog posts, services, and testimonials.
- [x] **Milestone 8 — GitHub & Production Optimization**: Full version control via GitHub, zero-error type safety, and production build readiness.

### Ongoing & Future Roadmap

- [ ] **Milestone 9 — Client Portal**: Dedicated client dashboard for tracking project progress, milestones, and invoice history.
- [ ] **Milestone 10 — Instant Estimator Widget**: Interactive pricing calculator providing ballpark estimates before starting the project wizard.
- [ ] **Milestone 11 — Webhook Integrations**: Real-time webhook connectors to Slack and Discord for instant team lead alerts.

---

## 📁 Repository Structure

```
velvantesolutions/
├── app/
│   ├── [locale]/                      # Public bilingual routes (English & Albanian)
│   │   ├── page.tsx                   # Homepage (14 modular sections)
│   │   ├── about/                     # About Velvante, Founder profile & Values
│   │   ├── services/                  # Services index & dynamic [slug] pages
│   │   ├── projects/                  # Portfolio gallery & dynamic [slug] case studies
│   │   ├── blog/                      # Engineering blog & dynamic [slug] articles
│   │   ├── contact/                   # Contact hub, SLA badge & direct inquiry form
│   │   ├── start-project/             # Interactive 8-step project scoping wizard
│   │   ├── privacy-policy/            # GDPR-ready privacy policy
│   │   ├── terms/                     # Terms of service
│   │   ├── cookie-policy/             # Cookie policy & consent management
│   │   └── accessibility/             # WCAG 2.2 AA accessibility statement
│   ├── admin/                         # Enterprise CMS Portal
│   │   ├── login/                     # Secure admin login
│   │   ├── dashboard/                 # Analytics overview & quick actions
│   │   ├── leads/                     # Contact & project inquiry CRM pipeline
│   │   ├── projects/                  # Project case study manager
│   │   ├── blog/                      # Blog article editor & publisher
│   │   ├── services/                  # Service offering configurations
│   │   ├── testimonials/              # Client testimonial moderation
│   │   ├── media/                     # Uploaded media storage
│   │   ├── users/                     # Admin user accounts
│   │   └── settings/                  # System settings
│   ├── api/                           # Backend REST Endpoints
│   │   ├── contact/                   # Contact form submission & email dispatch
│   │   ├── project-inquiries/         # 8-step wizard submission & dispatch
│   │   ├── newsletter/                # Email newsletter subscriptions
│   │   ├── search/                    # Global content search
│   │   ├── auth/login/                # Admin credential authentication
│   │   └── admin/                     # Protected CRUD operations for CMS
│   ├── globals.css                    # Tailwind CSS v4 tokens, canvas grid & reset
│   └── layout.tsx                     # Root layout
├── components/
│   ├── ui/                            # Base primitives (Button, Input, Badge, Card, etc.)
│   ├── layout/                        # Navbar, Footer, CookieBanner, BackToTop
│   ├── home/                          # Modular homepage components
│   ├── about/                         # Founder card, Mission/Vision, Values
│   ├── services/                      # Services filterable view & detail cards
│   ├── projects/                      # Projects filterable view & case study cards
│   ├── blog/                          # Blog cards, reading time & view
│   ├── forms/                         # Newsletter subscription & contact forms
│   └── animations/                    # Hardware-safe motion wrappers
├── lib/
│   ├── db/                            # Prisma client singleton
│   ├── email/                         # Dual-dispatch service (Resend + Outlook SMTP)
│   ├── i18n/                          # Internationalization routing & request handler
│   ├── api/                           # Rate limiter & standardized response envelopes
│   ├── validation/                    # Zod input schemas
│   └── utils.ts                       # Class merging & utility functions
├── locales/
│   ├── en/                            # English translation dictionaries (JSON)
│   └── sq/                            # Albanian translation dictionaries (JSON)
├── prisma/
│   ├── schema.prisma                  # PostgreSQL / SQLite relational models
│   └── seed.ts                        # Comprehensive production seed script
├── public/                            # Static assets, branding logos, favicons, CV
├── next.config.ts                     # Next.js config & legacy route redirects
├── package.json                       # Dependencies & scripts
└── tsconfig.json                      # Strict TypeScript compiler options
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites

- **Node.js**: `v20.x` or higher recommended
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Database**: SQLite (built-in by default) or PostgreSQL instance

### 2. Clone the Repository

```bash
git clone https://github.com/LeartDemaku/velvante_solutions.git
cd velvante_solutions
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root by copying the template:

```bash
cp .env.example .env
```

Fill in your configuration values (see the reference table below).

### 5. Initialize the Database & Run Seeds

```bash
npx prisma generate
npx prisma db push
npm run seed
```

This populates your local database with initial admin credentials, 12 complete services in English and Albanian, sample portfolio case studies, and blog posts.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- English interface: [http://localhost:3000/en](http://localhost:3000/en)
- Albanian interface: [http://localhost:3000/sq](http://localhost:3000/sq)
- Admin CMS login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔐 Environment Variables Reference

| Variable | Required | Description | Example / Default |
|---|---|---|---|
| `DATABASE_URL` | Yes | Database connection string | `file:./dev.db` (SQLite) or `postgresql://...` |
| `RESEND_API_KEY` | Optional | Resend API key for primary email delivery | `re_...` |
| `SMTP_HOST` | Optional | Fallback SMTP server hostname | `smtp-mail.outlook.com` |
| `SMTP_PORT` | Optional | Fallback SMTP port | `587` |
| `SMTP_USER` | Optional | Fallback SMTP username | `velvantesolutions@outlook.com` |
| `SMTP_PASS` | Optional | Fallback SMTP password or App Password | `your-smtp-password` |
| `CONTACT_EMAIL` | Yes | Official company recipient address | `velvantesolutions@outlook.com` |
| `NEXTAUTH_SECRET` | Yes | Secret key used for signing session tokens | `random-32-char-string` |
| `NEXTAUTH_URL` | Yes | Canonical root URL of the deployment | `http://localhost:3000` |

---

## 🚢 Production Build & GitHub Deployment

### Local Production Build

To verify that all routes compile cleanly with zero TypeScript or linting errors:

```bash
npm run build
npm start
```

### GitHub Deployment

This repository is maintained and versioned via GitHub:

1. Push your latest commits to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update platform features"
   git push origin main
   ```
2. Connect your production environment (such as a VPS, cloud server, or container service) directly to your GitHub repository.
3. Configure your production environment variables (`DATABASE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
4. Execute `npm run build` and `npm start` for global, high-speed serving.

---

## 📐 Codebase Standards & Philosophy

We hold ourselves to uncompromising engineering standards:

1. **Zero-Comment Production Code**: Code must be self-explanatory, cleanly named, and structurally clear without relying on cluttering inline comments.
2. **Zero-Error Tolerance**: Every build must pass TypeScript strict type checking and Turbopack static route verification without warnings or errors.
3. **True Mobile Accessibility**: Never assume all users have the latest hardware or uninterrupted network speeds. Design for touch, battery conservation, and instant feedback.
4. **Data Ownership**: Client inquiries and submissions are permanently preserved in our database first, never lost if a third-party email provider experiences temporary downtime.

---

## 👨‍💻 Author & Contact

**Velvante Solutions**  
Digital Systems · High-Velocity Full-Stack Engineering · Strategic UI/UX  

- **Founder & Lead Architect**: Leart Demaku
- **Official Company Email**: [velvantesolutions@outlook.com](mailto:velvantesolutions@outlook.com)
- **Official Website**: [https://velvantesolutions.com](https://velvantesolutions.com)
- **GitHub Repository**: [https://github.com/LeartDemaku/velvante_solutions](https://github.com/LeartDemaku/velvante_solutions)

---

*© 2026 Velvante Solutions. All rights reserved.*
