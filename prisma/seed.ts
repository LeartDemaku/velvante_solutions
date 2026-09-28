import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Velvante Solutions database...');

  // Clear existing data in correct dependency order
  await prisma.analyticsEvent.deleteMany();
  await prisma.cookieConsent.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.projectInquiry.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.blogPostTag.deleteMany();
  await prisma.blogTranslation.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.author.deleteMany();
  await prisma.testimonialTranslation.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.projectService.deleteMany();
  await prisma.projectTranslation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.serviceTranslation.deleteMany();
  await prisma.service.deleteMany();
  await prisma.teamMemberTranslation.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.user.deleteMany();

  // ── Admin User ──────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@2024!', 12);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@velvante.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // ── Team Members ────────────────────────────────────────────────────────────
  const teamData = [
    {
      name: 'Leart Demaku',
      image: '/images/team/leart-demaku.webp',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com/LeartDemaku',
      order: 1,
      translations: [
        {
          locale: 'en',
          role: 'Founder and CEO of Velvante Solutions',
          bio: 'Full-Stack / Web Developer focused on building modern, responsive, and well-structured web applications. Strong foundation in HTML5, CSS3, JavaScript (ES6+), React/Next.js, Node.js, Python, and SQL database management. Leverages Figma for design, Git/GitHub for version control, and AI-driven tools to optimize development workflows. Committed to clean code, high UX standards, and solving complex business challenges.',
        },
        {
          locale: 'sq',
          role: 'Themelues dhe Drejtor Ekzekutiv i Velvante Solutions',
          bio: 'Zhvillues Full-Stack / Web Developer i fokusuar në ndërtimin e web-aplikacioneve moderne, responsive dhe të mirëstrukturuara. Ka bazë të fortë në HTML5, CSS3 dhe JavaScript (ES6+), si dhe njohuri praktike në Node.js, Python dhe menaxhimin e bazave të të dhënave SQL. Përdor Figma për dizajn, Git/GitHub për versionim dhe mjete AI për të optimizuar proceset e zhvillimit. I orientuar drejt kodit të pastër, standardeve të larta të UX dhe zgjidhjes së problemeve komplekse.',
        },
      ],
    },
  ];

  for (const member of teamData) {
    const { translations, ...rest } = member;
    const created = await prisma.teamMember.create({ data: rest });
    for (const t of translations) {
      await prisma.teamMemberTranslation.create({
        data: { memberId: created.id, ...t },
      });
    }
  }
  console.log('✅ Team members created');

  // ── Services ────────────────────────────────────────────────────────────────
  const servicesData = [
    {
      slug: 'web-design',
      icon: 'Palette',
      order: 1,
      published: true,
      featured: true,
      en: {
        title: 'Web Design',
        shortDesc:
          'Premium, conversion-focused websites that reflect your brand identity.',
        description:
          'We craft visually stunning, strategically designed websites that communicate your brand with precision and drive measurable business results. Every pixel is intentional.',
        capabilities: [
          'Brand Identity Integration',
          'Responsive Design',
          'UX Strategy',
          'Wireframing & Prototyping',
          'Design Systems',
          'Motion Design',
        ],
        technologies: ['Figma', 'Adobe XD', 'Framer', 'Lottie', 'WebGL'],
        deliverables: [
          'Design System',
          'Responsive Mockups',
          'Interactive Prototype',
          'Style Guide',
          'Asset Library',
        ],
        benefits: [
          'Higher conversion rates',
          'Stronger brand perception',
          'Reduced bounce rates',
          'Better user retention',
        ],
        metaTitle: 'Professional Web Design Services | Velvante Solutions',
        metaDesc:
          'Premium, conversion-focused web design services. We craft visually stunning websites that drive business results.',
      },
      sq: {
        title: 'Dizajn Web',
        shortDesc:
          'Faqe interneti premium të fokusuara në konvertim që reflektojnë identitetin tuaj të markës.',
        description:
          'Ne krijojmë faqe interneti vizualisht mahnitëse dhe të dizajnuara strategjikisht që komunikojnë markën tuaj me saktësi dhe nxisin rezultate të matshme biznesi.',
        capabilities: [
          'Integrimi i Identitetit të Markës',
          'Dizajn Responsiv',
          'Strategji UX',
          'Wireframing dhe Prototipim',
          'Sisteme Dizajni',
          'Dizajn Lëvizjeje',
        ],
        technologies: ['Figma', 'Adobe XD', 'Framer', 'Lottie', 'WebGL'],
        deliverables: [
          'Sistem Dizajni',
          'Modele Responsive',
          'Prototip Interaktiv',
          'Udhëzues Stili',
          'Bibliotekë Asetesh',
        ],
        benefits: [
          'Shkallë më të lartë konvertimi',
          'Perceptim më i fortë i markës',
          'Norma më të ulëta të braktisjes',
          'Mbajtje më e mirë e përdoruesve',
        ],
        metaTitle: 'Shërbime Profesionale Dizajni Web | Velvante Solutions',
        metaDesc:
          'Shërbime premium dizajni web të fokusuara në konvertim. Ne krijojmë faqe interneti vizualisht mahnitëse.',
      },
    },
    {
      slug: 'fullstack-development',
      icon: 'Code2',
      order: 2,
      published: true,
      featured: true,
      en: {
        title: 'Full-Stack Development',
        shortDesc:
          'End-to-end web development using modern, scalable technology stacks.',
        description:
          'From pixel-perfect frontends to robust backend systems, we build complete digital products using the most reliable and performant technologies available.',
        capabilities: [
          'Frontend Development',
          'Backend Development',
          'API Design',
          'Database Architecture',
          'Performance Optimization',
          'Code Reviews',
        ],
        technologies: [
          'Next.js',
          'React',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'Redis',
        ],
        deliverables: [
          'Production Codebase',
          'API Documentation',
          'Deployment Configuration',
          'Technical Documentation',
        ],
        benefits: [
          'Faster time-to-market',
          'Maintainable codebase',
          'Scalable architecture',
          'Reduced technical debt',
        ],
        metaTitle: 'Full-Stack Web Development Services | Velvante Solutions',
        metaDesc:
          'End-to-end full-stack web development. We build complete digital products using modern, scalable technologies.',
      },
      sq: {
        title: 'Zhvillim Full-Stack',
        shortDesc:
          'Zhvillim web nga fillimi në fund duke përdorur teknologji moderne dhe të shkallëzueshme.',
        description:
          'Nga frontendet e përsosura deri te sistemet e fuqishme backend, ne ndërtojmë produkte dixhitale të plota duke përdorur teknologjitë më të besueshme dhe me performancë.',
        capabilities: [
          'Zhvillim Frontend',
          'Zhvillim Backend',
          'Dizajn API',
          'Arkitekturë Bazë të Dhënash',
          'Optimizim Performancës',
          'Rishikime Kodi',
        ],
        technologies: [
          'Next.js',
          'React',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'Redis',
        ],
        deliverables: [
          'Kod Prodhimi',
          'Dokumentacion API',
          'Konfigurim Vendosje',
          'Dokumentacion Teknik',
        ],
        benefits: [
          'Kohë më e shpejtë në treg',
          'Kod i mirëmbajtur',
          'Arkitekturë e shkallëzueshme',
          'Borxh teknik i reduktuar',
        ],
        metaTitle: 'Shërbime Zhvillimi Web Full-Stack | Velvante Solutions',
        metaDesc:
          'Zhvillim full-stack web nga fillimi në fund. Ne ndërtojmë produkte dixhitale të plota duke përdorur teknologji moderne.',
      },
    },
    {
      slug: 'ecommerce',
      icon: 'ShoppingCart',
      order: 3,
      published: true,
      featured: true,
      en: {
        title: 'E-Commerce Development',
        shortDesc: 'High-converting online stores built to grow your revenue.',
        description:
          'We build powerful e-commerce platforms that combine beautiful design with intelligent conversion architecture, secure payment systems, and scalable inventory management.',
        capabilities: [
          'Custom E-Commerce Stores',
          'Payment Gateway Integration',
          'Inventory Management',
          'Order Management',
          'Multi-currency Support',
          'Mobile Commerce',
        ],
        technologies: [
          'Next.js',
          'Stripe',
          'Shopify',
          'WooCommerce',
          'PostgreSQL',
          'Prisma',
        ],
        deliverables: [
          'E-Commerce Platform',
          'Admin Dashboard',
          'Payment Integration',
          'Analytics Setup',
          'SEO Configuration',
        ],
        benefits: [
          'Increased revenue',
          'Better customer experience',
          'Automated operations',
          'Scalable infrastructure',
        ],
        metaTitle: 'E-Commerce Development Services | Velvante Solutions',
        metaDesc:
          'High-converting e-commerce development. Custom online stores with secure payments and scalable infrastructure.',
      },
      sq: {
        title: 'Zhvillim E-Commerce',
        shortDesc:
          'Dyqane online me konvertim të lartë të ndërtuar për të rritur të ardhurat tuaja.',
        description:
          'Ne ndërtojmë platforma të fuqishme e-commerce që kombinojnë dizajn të bukur me arkitekturë konvertimi inteligjente, sisteme pagese të sigurta dhe menaxhim të shkallëzueshëm të inventarit.',
        capabilities: [
          'Dyqane Personalizuar E-Commerce',
          'Integrim Portali Pagese',
          'Menaxhim Inventari',
          'Menaxhim Porosive',
          'Mbështetje Shumë-valutore',
          'Commerce Mobil',
        ],
        technologies: [
          'Next.js',
          'Stripe',
          'Shopify',
          'WooCommerce',
          'PostgreSQL',
          'Prisma',
        ],
        deliverables: [
          'Platformë E-Commerce',
          'Panel Administrativ',
          'Integrim Pagese',
          'Konfigurim Analitikës',
          'Konfigurim SEO',
        ],
        benefits: [
          'Të ardhura të rritura',
          'Përvojë më e mirë e klientit',
          'Operacione të automatizuara',
          'Infrastrukturë e shkallëzueshme',
        ],
        metaTitle: 'Shërbime Zhvillimi E-Commerce | Velvante Solutions',
        metaDesc:
          'Zhvillim e-commerce me konvertim të lartë. Dyqane online të personalizuara me pagesa të sigurta.',
      },
    },
    {
      slug: 'web-applications',
      icon: 'AppWindow',
      order: 4,
      published: true,
      featured: false,
      en: {
        title: 'Web Applications',
        shortDesc:
          'Complex, scalable web applications engineered for performance and reliability.',
        description:
          'We architect and build sophisticated web applications — from SaaS platforms to internal business tools — that handle real-world complexity with elegant technical solutions.',
        capabilities: [
          'SaaS Development',
          'Internal Tools',
          'Admin Dashboards',
          'Real-time Features',
          'Multi-tenant Systems',
          'Role-based Access',
        ],
        technologies: [
          'Next.js',
          'React',
          'TypeScript',
          'WebSockets',
          'PostgreSQL',
          'Redis',
          'Docker',
        ],
        deliverables: [
          'Production Application',
          'Admin Panel',
          'API Documentation',
          'Deployment Setup',
          'Monitoring Config',
        ],
        benefits: [
          'Automated workflows',
          'Centralized operations',
          'Reduced manual effort',
          'Scalable from day one',
        ],
        metaTitle: 'Web Application Development | Velvante Solutions',
        metaDesc:
          'Complex, scalable web application development. From SaaS platforms to internal business tools.',
      },
      sq: {
        title: 'Aplikacione Web',
        shortDesc:
          'Aplikacione web komplekse dhe të shkallëzueshme të inxhinieruara për performancë dhe besueshmëri.',
        description:
          'Ne arkitekturojmë dhe ndërtojmë aplikacione web të sofistikuara — nga platformat SaaS deri te mjetet e brendshme të biznesit — që trajtojnë kompleksitetin e botës reale me zgjidhje teknike elegante.',
        capabilities: [
          'Zhvillim SaaS',
          'Mjete të Brendshme',
          'Panele Administrative',
          'Karakteristika në Kohë Reale',
          'Sisteme Shumë-qiradhënëse',
          'Qasje e Bazuar në Role',
        ],
        technologies: [
          'Next.js',
          'React',
          'TypeScript',
          'WebSockets',
          'PostgreSQL',
          'Redis',
          'Docker',
        ],
        deliverables: [
          'Aplikacion Prodhimi',
          'Panel Administrativ',
          'Dokumentacion API',
          'Konfigurim Vendosje',
          'Konfigurim Monitorimi',
        ],
        benefits: [
          'Flukse pune të automatizuara',
          'Operacione të centralizuara',
          'Përpjekje manuale të reduktuara',
          'I shkallëzueshëm nga dita e parë',
        ],
        metaTitle: 'Zhvillim Aplikacionesh Web | Velvante Solutions',
        metaDesc:
          'Zhvillim aplikacionesh web komplekse dhe të shkallëzueshme. Nga platformat SaaS deri te mjetet e brendshme.',
      },
    },
    {
      slug: 'ui-ux-design',
      icon: 'Layers',
      order: 5,
      published: true,
      featured: false,
      en: {
        title: 'UI/UX Design',
        shortDesc:
          'Research-driven design that creates intuitive, engaging digital experiences.',
        description:
          'We combine user research, information architecture, and visual design craft to create interfaces that users genuinely love — and that drive business outcomes.',
        capabilities: [
          'User Research',
          'Information Architecture',
          'Wireframing',
          'Interactive Prototypes',
          'Usability Testing',
          'Design Systems',
        ],
        technologies: [
          'Figma',
          'Maze',
          'Hotjar',
          'UserTesting',
          'Lottie',
          'Principle',
        ],
        deliverables: [
          'UX Research Report',
          'Information Architecture',
          'Wireframes',
          'High-fidelity Designs',
          'Interactive Prototype',
          'Design Handoff',
        ],
        benefits: [
          'Better user satisfaction',
          'Higher task completion',
          'Reduced support requests',
          'Improved conversion',
        ],
        metaTitle: 'UI/UX Design Services | Velvante Solutions',
        metaDesc:
          'Research-driven UI/UX design. We create intuitive interfaces that users love and that drive business results.',
      },
      sq: {
        title: 'Dizajn UI/UX',
        shortDesc:
          'Dizajn i nxitur nga hulumtimi që krijon përvoja dixhitale intuitive dhe tërheqëse.',
        description:
          'Ne kombinojmë hulumtimin e përdoruesve, arkitekturën e informacionit dhe zejen e dizajnit vizual për të krijuar ndërfaqe që përdoruesit i duan sinqerisht — dhe që nxisin rezultate biznesi.',
        capabilities: [
          'Hulumtim Përdoruesish',
          'Arkitekturë Informacioni',
          'Wireframing',
          'Prototipa Interaktivë',
          'Testim Përdorshmërie',
          'Sisteme Dizajni',
        ],
        technologies: [
          'Figma',
          'Maze',
          'Hotjar',
          'UserTesting',
          'Lottie',
          'Principle',
        ],
        deliverables: [
          'Raport Hulumtimi UX',
          'Arkitekturë Informacioni',
          'Wireframe',
          'Dizajne me Fidelitet të Lartë',
          'Prototip Interaktiv',
          'Dorëzim Dizajni',
        ],
        benefits: [
          'Kënaqësi më e mirë e përdoruesve',
          'Përfundim më i lartë i detyrave',
          'Kërkesa të reduktuara mbështetjeje',
          'Konvertim i përmirësuar',
        ],
        metaTitle: 'Shërbime Dizajni UI/UX | Velvante Solutions',
        metaDesc:
          'Dizajn UI/UX i nxitur nga hulumtimi. Ne krijojmë ndërfaqe intuitive që përdoruesit i duan.',
      },
    },
    {
      slug: 'backend-apis',
      icon: 'Server',
      order: 6,
      published: true,
      featured: false,
      en: {
        title: 'Backend & APIs',
        shortDesc:
          'Robust, secure backend systems and API architectures that power your applications.',
        description:
          'We design and build production-grade backend systems — REST APIs, GraphQL endpoints, microservices, and serverless functions — that are secure, performant, and built to last.',
        capabilities: [
          'REST API Development',
          'GraphQL',
          'Microservices',
          'Third-party Integrations',
          'Authentication Systems',
          'Data Processing',
        ],
        technologies: [
          'Node.js',
          'Express',
          'PostgreSQL',
          'Redis',
          'Docker',
          'AWS Lambda',
          'Prisma',
        ],
        deliverables: [
          'API Documentation',
          'Database Schema',
          'Integration Guides',
          'Security Audit',
          'Performance Benchmarks',
        ],
        benefits: [
          'Reliable data management',
          'Secure integrations',
          'Automated processes',
          'Scalable infrastructure',
        ],
        metaTitle: 'Backend Development & API Services | Velvante Solutions',
        metaDesc:
          'Robust backend systems and API development. Secure, scalable architectures that power your applications.',
      },
      sq: {
        title: 'Backend dhe API',
        shortDesc:
          'Sisteme backend të fuqishme dhe të sigurta dhe arkitektura API që fuqizojnë aplikacionet tuaja.',
        description:
          'Ne dizajnojmë dhe ndërtojmë sisteme backend të nivelit të prodhimit — API REST, pikat fundore GraphQL, mikroshërbime dhe funksione serverless — të sigurta, me performancë dhe të ndërtuar për të qëndruar.',
        capabilities: [
          'Zhvillim API REST',
          'GraphQL',
          'Mikroshërbime',
          'Integrime me Palë të Treta',
          'Sisteme Autentikimi',
          'Përpunim të Dhënash',
        ],
        technologies: [
          'Node.js',
          'Express',
          'PostgreSQL',
          'Redis',
          'Docker',
          'AWS Lambda',
          'Prisma',
        ],
        deliverables: [
          'Dokumentacion API',
          'Skemë Baze të Dhënash',
          'Udhëzues Integrimi',
          'Audit Sigurie',
          'Benchmarqe Performancës',
        ],
        benefits: [
          'Menaxhim i besueshëm i të dhënave',
          'Integrime të sigurta',
          'Procese të automatizuara',
          'Infrastrukturë e shkallëzueshme',
        ],
        metaTitle: 'Shërbime Zhvillimi Backend dhe API | Velvante Solutions',
        metaDesc:
          'Sisteme backend dhe zhvillim API të fuqishëm. Arkitektura të sigurta dhe të shkallëzueshme.',
      },
    },
    {
      slug: 'database-infrastructure',
      icon: 'Database',
      order: 7,
      published: true,
      featured: false,
      en: {
        title: 'Database & Infrastructure',
        shortDesc:
          'Optimized database architectures and reliable infrastructure for your digital systems.',
        description:
          'We architect, optimize, and manage databases and infrastructure that form the reliable backbone of high-traffic applications and data-intensive systems.',
        capabilities: [
          'Database Design',
          'Query Optimization',
          'Data Migrations',
          'Backup Systems',
          'High Availability',
          'Disaster Recovery',
        ],
        technologies: [
          'PostgreSQL',
          'MongoDB',
          'Redis',
          'Elasticsearch',
          'AWS RDS',
          'Terraform',
        ],
        deliverables: [
          'Database Schema',
          'Migration Scripts',
          'Backup Configuration',
          'Monitoring Setup',
          'Documentation',
        ],
        benefits: [
          'Improved query performance',
          'Data reliability',
          'Reduced downtime',
          'Scalable storage',
        ],
        metaTitle: 'Database & Infrastructure Services | Velvante Solutions',
        metaDesc:
          'Optimized database architectures and reliable infrastructure. We build data foundations that scale.',
      },
      sq: {
        title: 'Bazë të Dhënash dhe Infrastrukturë',
        shortDesc:
          'Arkitektura të optimizuara bazash të dhënash dhe infrastrukturë e besueshme për sistemet tuaja dixhitale.',
        description:
          'Ne arkitekturojmë, optimizojmë dhe menaxhojmë baza të dhënash dhe infrastrukturë që formojnë shtyllën e besueshme të aplikacioneve me trafik të lartë dhe sistemeve intensive të të dhënave.',
        capabilities: [
          'Dizajn Baze të Dhënash',
          'Optimizim Pyetjesh',
          'Migrime të Dhënash',
          'Sisteme Rezervimi',
          'Disponueshmëri e Lartë',
          'Rikuperim nga Katastrofa',
        ],
        technologies: [
          'PostgreSQL',
          'MongoDB',
          'Redis',
          'Elasticsearch',
          'AWS RDS',
          'Terraform',
        ],
        deliverables: [
          'Skemë Baze të Dhënash',
          'Skripte Migrimi',
          'Konfigurim Rezervimi',
          'Konfigurim Monitorimi',
          'Dokumentacion',
        ],
        benefits: [
          'Performancë e përmirësuar pyetjesh',
          'Besueshmëri e të dhënave',
          'Kohë ndërprerjeje e reduktuar',
          'Ruajtje e shkallëzueshme',
        ],
        metaTitle: 'Shërbime Baze të Dhënash dhe Infrastrukturë | Velvante Solutions',
        metaDesc:
          'Arkitektura të optimizuara bazash të dhënash dhe infrastrukturë e besueshme. Ne ndërtojmë themele të dhënash që shkallëzohen.',
      },
    },
    {
      slug: 'seo-performance',
      icon: 'TrendingUp',
      order: 8,
      published: true,
      featured: false,
      en: {
        title: 'SEO & Performance',
        shortDesc:
          'Technical SEO and performance engineering that drives organic growth.',
        description:
          'We optimize your digital presence for search engines and real users alike — improving Core Web Vitals, organic rankings, and conversion rates through systematic technical excellence.',
        capabilities: [
          'Technical SEO Audits',
          'Core Web Vitals',
          'Page Speed Optimization',
          'Structured Data',
          'Link Building Strategy',
          'Content Architecture',
        ],
        technologies: [
          'Lighthouse',
          'PageSpeed Insights',
          'Ahrefs',
          'Search Console',
          'Screaming Frog',
          'GTmetrix',
        ],
        deliverables: [
          'SEO Audit Report',
          'Performance Report',
          'Optimization Roadmap',
          'Structured Data Implementation',
          'Monthly Reporting',
        ],
        benefits: [
          'Higher search rankings',
          'More organic traffic',
          'Better user experience',
          'Improved conversion rates',
        ],
        metaTitle: 'SEO & Performance Optimization | Velvante Solutions',
        metaDesc:
          'Technical SEO and performance engineering. We improve search rankings, Core Web Vitals, and conversions.',
      },
      sq: {
        title: 'SEO dhe Performancë',
        shortDesc:
          'SEO teknik dhe inxhinieri performancë që nxisin rritjen organike.',
        description:
          'Ne optimizojmë praninë tuaj dixhitale për motorët e kërkimit dhe përdoruesit realë — duke përmirësuar Core Web Vitals, renditjet organike dhe shkallët e konvertimit përmes ekselencës teknike sistematike.',
        capabilities: [
          'Auditime Teknike SEO',
          'Core Web Vitals',
          'Optimizim Shpejtësie Faqes',
          'Të Dhëna të Strukturuara',
          'Strategji Ndërtimi Lidhjesh',
          'Arkitekturë Përmbajtjeje',
        ],
        technologies: [
          'Lighthouse',
          'PageSpeed Insights',
          'Ahrefs',
          'Search Console',
          'Screaming Frog',
          'GTmetrix',
        ],
        deliverables: [
          'Raport Auditi SEO',
          'Raport Performancë',
          'Hartë Rrugore Optimizimi',
          'Implementim Të Dhënash të Strukturuara',
          'Raportim Mujor',
        ],
        benefits: [
          'Renditje më të larta në kërkime',
          'Më shumë trafik organik',
          'Përvojë më e mirë e përdoruesit',
          'Shkallë konvertimi të përmirësuara',
        ],
        metaTitle: 'Optimizim SEO dhe Performancë | Velvante Solutions',
        metaDesc:
          'SEO teknik dhe inxhinieri performancë. Ne përmirësojmë renditjet e kërkimit, Core Web Vitals dhe konvertimet.',
      },
    },
    {
      slug: 'cloud-devops',
      icon: 'Cloud',
      order: 9,
      published: true,
      featured: false,
      en: {
        title: 'Cloud & DevOps',
        shortDesc:
          'Modern cloud architecture and DevOps practices for reliable, scalable deployments.',
        description:
          'We design and implement cloud infrastructure, CI/CD pipelines, and DevOps workflows that reduce deployment risk, improve reliability, and accelerate your delivery cycles.',
        capabilities: [
          'Cloud Architecture',
          'CI/CD Pipelines',
          'Container Orchestration',
          'Infrastructure as Code',
          'Monitoring & Alerting',
          'Cost Optimization',
        ],
        technologies: [
          'AWS',
          'Vercel',
          'Docker',
          'Kubernetes',
          'GitHub Actions',
          'Terraform',
          'Datadog',
        ],
        deliverables: [
          'Infrastructure Design',
          'CI/CD Setup',
          'Deployment Documentation',
          'Monitoring Dashboard',
          'Runbook',
        ],
        benefits: [
          'Faster deployments',
          'Reduced downtime',
          'Better observability',
          'Infrastructure as code',
        ],
        metaTitle: 'Cloud & DevOps Services | Velvante Solutions',
        metaDesc:
          'Modern cloud architecture and DevOps. CI/CD pipelines, container orchestration, and reliable deployments.',
      },
      sq: {
        title: 'Cloud dhe DevOps',
        shortDesc:
          'Arkitekturë moderne cloud dhe praktikat DevOps për vendosje të besueshme dhe të shkallëzueshme.',
        description:
          'Ne dizajnojmë dhe implementojmë infrastrukturë cloud, pipeline CI/CD dhe flukse pune DevOps që reduktojnë rrezikun e vendosjes, përmirësojnë besueshmërinë dhe përshpejtojnë ciklet e dorëzimit tuaj.',
        capabilities: [
          'Arkitekturë Cloud',
          'Pipeline CI/CD',
          'Orkestrimi i Kontejnerëve',
          'Infrastrukturë si Kod',
          'Monitorim dhe Alertim',
          'Optimizim Kostosh',
        ],
        technologies: [
          'AWS',
          'Vercel',
          'Docker',
          'Kubernetes',
          'GitHub Actions',
          'Terraform',
          'Datadog',
        ],
        deliverables: [
          'Dizajn Infrastrukture',
          'Konfigurim CI/CD',
          'Dokumentacion Vendosjeje',
          'Panel Monitorimi',
          'Runbook',
        ],
        benefits: [
          'Vendosje më të shpejta',
          'Kohë ndërprerjeje e reduktuar',
          'Vëzhgueshmëri më e mirë',
          'Infrastrukturë si kod',
        ],
        metaTitle: 'Shërbime Cloud dhe DevOps | Velvante Solutions',
        metaDesc:
          'Arkitekturë moderne cloud dhe DevOps. Pipeline CI/CD, orkestrimi i kontejnerëve dhe vendosje të besueshme.',
      },
    },
    {
      slug: 'ai-automation',
      icon: 'Zap',
      order: 10,
      published: true,
      featured: true,
      en: {
        title: 'AI & Automation',
        shortDesc:
          'AI integrations and intelligent automation that give your business a competitive edge.',
        description:
          'We help businesses leverage artificial intelligence and automation to reduce repetitive work, surface insights from data, and deliver more intelligent, personalized user experiences.',
        capabilities: [
          'AI Integration',
          'LLM Implementation',
          'Process Automation',
          'Data Pipelines',
          'Intelligent Chatbots',
          'Recommendation Systems',
        ],
        technologies: [
          'OpenAI',
          'Anthropic',
          'LangChain',
          'Python',
          'TensorFlow',
          'n8n',
          'Zapier',
        ],
        deliverables: [
          'AI Integration',
          'Automation Workflows',
          'Training Documentation',
          'Performance Metrics',
          'Maintenance Plan',
        ],
        benefits: [
          'Reduced operational costs',
          'Faster decision-making',
          'Better customer experiences',
          'Competitive advantage',
        ],
        metaTitle: 'AI & Automation Services | Velvante Solutions',
        metaDesc:
          'AI integrations and intelligent automation. We help businesses leverage AI for competitive advantage.',
      },
      sq: {
        title: 'AI dhe Automatizim',
        shortDesc:
          'Integrime AI dhe automatizim inteligjent që i japin biznesit tuaj një avantazh konkurrues.',
        description:
          'Ne ndihmojmë bizneset të shfrytëzojnë inteligjencën artificiale dhe automatizimin për të reduktuar punën repetitive, nxjerrë njohuri nga të dhënat dhe ofruar përvoja më inteligjente dhe të personalizuara të përdoruesve.',
        capabilities: [
          'Integrim AI',
          'Implementim LLM',
          'Automatizim Procesesh',
          'Pipeline të Dhënash',
          'Chatbot Inteligjente',
          'Sisteme Rekomandimi',
        ],
        technologies: [
          'OpenAI',
          'Anthropic',
          'LangChain',
          'Python',
          'TensorFlow',
          'n8n',
          'Zapier',
        ],
        deliverables: [
          'Integrim AI',
          'Flukse Pune Automatizimi',
          'Dokumentacion Trajnimi',
          'Metrika Performancë',
          'Plan Mirëmbajtjeje',
        ],
        benefits: [
          'Kosto operative të reduktuara',
          'Vendimmarrje më e shpejtë',
          'Përvoja më të mira të klientëve',
          'Avantazh konkurrues',
        ],
        metaTitle: 'Shërbime AI dhe Automatizimi | Velvante Solutions',
        metaDesc:
          'Integrime AI dhe automatizim inteligjent. Ne ndihmojmë bizneset të shfrytëzojnë AI për avantazh konkurrues.',
      },
    },
    {
      slug: 'security',
      icon: 'Shield',
      order: 11,
      published: true,
      featured: false,
      en: {
        title: 'Security',
        shortDesc:
          'Comprehensive security audits and hardening to protect your digital assets.',
        description:
          'We perform thorough security assessments and implement industry-standard protections to ensure your applications, data, and infrastructure are protected against modern threats.',
        capabilities: [
          'Security Audits',
          'Penetration Testing',
          'OWASP Compliance',
          'Authentication Hardening',
          'Data Encryption',
          'Security Headers',
        ],
        technologies: [
          'OWASP ZAP',
          'Burp Suite',
          'Snyk',
          'SonarQube',
          'AWS Security Hub',
          'Cloudflare',
        ],
        deliverables: [
          'Security Audit Report',
          'Vulnerability Assessment',
          'Remediation Plan',
          'Security Documentation',
          'Compliance Checklist',
        ],
        benefits: [
          'Protected user data',
          'Regulatory compliance',
          'Reduced breach risk',
          'Customer trust',
        ],
        metaTitle: 'Cybersecurity Services | Velvante Solutions',
        metaDesc:
          'Comprehensive security audits and hardening. Protect your digital assets with industry-standard security practices.',
      },
      sq: {
        title: 'Siguri',
        shortDesc:
          'Auditime gjithëpërfshirëse sigurie dhe forcim për të mbrojtur asetet tuaja dixhitale.',
        description:
          'Ne kryejmë vlerësime të plota sigurie dhe implementojmë mbrojtje standarde të industrisë për të siguruar që aplikacionet, të dhënat dhe infrastruktura juaj mbrohen kundër kërcënimeve moderne.',
        capabilities: [
          'Auditime Sigurie',
          'Testim Penetrimi',
          'Pajtueshmëri OWASP',
          'Forcim Autentikimi',
          'Kriptim të Dhënash',
          'Titujt Sigurie',
        ],
        technologies: [
          'OWASP ZAP',
          'Burp Suite',
          'Snyk',
          'SonarQube',
          'AWS Security Hub',
          'Cloudflare',
        ],
        deliverables: [
          'Raport Auditi Sigurie',
          'Vlerësim Cenueshmërie',
          'Plan Rimedimi',
          'Dokumentacion Sigurie',
          'Listë Kontrolli Pajtueshmërie',
        ],
        benefits: [
          'Të dhëna të mbrojtura të përdoruesve',
          'Pajtueshmëri rregullatore',
          'Rrezik i reduktuar shkeljeje',
          'Besim klienti',
        ],
        metaTitle: 'Shërbime Sigurie Kibernetike | Velvante Solutions',
        metaDesc:
          'Auditime gjithëpërfshirëse sigurie dhe forcim. Mbroni asetet tuaja dixhitale me praktika sigurie standarde të industrisë.',
      },
    },
    {
      slug: 'maintenance-support',
      icon: 'Wrench',
      order: 12,
      published: true,
      featured: false,
      en: {
        title: 'Maintenance & Support',
        shortDesc:
          'Proactive maintenance and expert support to keep your digital systems running at peak performance.',
        description:
          'We provide ongoing technical maintenance, monitoring, and support to ensure your applications remain secure, up-to-date, and performing optimally — so you can focus on your business.',
        capabilities: [
          'Proactive Monitoring',
          'Performance Maintenance',
          'Security Updates',
          'Bug Fixes',
          'Feature Updates',
          'Technical Support',
        ],
        technologies: [
          'Datadog',
          'Sentry',
          'PagerDuty',
          'GitHub',
          'Jira',
          'Slack',
        ],
        deliverables: [
          'Monthly Reports',
          'SLA Agreement',
          'Incident Response Plan',
          'Update Documentation',
          'Performance Dashboard',
        ],
        benefits: [
          'Reduced downtime',
          'Security maintained',
          'Technical debt managed',
          'Peace of mind',
        ],
        metaTitle: 'Website Maintenance & Support | Velvante Solutions',
        metaDesc:
          'Proactive maintenance and expert support. Keep your digital systems secure, updated, and performing optimally.',
      },
      sq: {
        title: 'Mirëmbajtje dhe Mbështetje',
        shortDesc:
          'Mirëmbajtje proaktive dhe mbështetje ekspertoze për të mbajtur sistemet tuaja dixhitale në performancë maksimale.',
        description:
          'Ne ofrojmë mirëmbajtje teknike të vazhdueshme, monitorim dhe mbështetje për të siguruar që aplikacionet tuaja mbeten të sigurta, të përditësuara dhe duke performuar në mënyrë optimale.',
        capabilities: [
          'Monitorim Proaktiv',
          'Mirëmbajtje Performancë',
          'Përditësime Sigurie',
          'Korrigjim Gabimesh',
          'Përditësime Veçorish',
          'Mbështetje Teknike',
        ],
        technologies: [
          'Datadog',
          'Sentry',
          'PagerDuty',
          'GitHub',
          'Jira',
          'Slack',
        ],
        deliverables: [
          'Raporte Mujore',
          'Marrëveshje SLA',
          'Plan Reagimit ndaj Incidenteve',
          'Dokumentacion Përditësimesh',
          'Panel Performancë',
        ],
        benefits: [
          'Kohë ndërprerjeje e reduktuar',
          'Siguri e mirëmbajtur',
          'Borxh teknik i menaxhuar',
          'Qetësi mendore',
        ],
        metaTitle: 'Mirëmbajtje dhe Mbështetje Faqesh | Velvante Solutions',
        metaDesc:
          'Mirëmbajtje proaktive dhe mbështetje ekspertoze. Mbani sistemet tuaja dixhitale të sigurta, të përditësuara dhe me performancë optimale.',
      },
    },
  ];

  for (const svc of servicesData) {
    const { en, sq, ...rest } = svc;
    const created = await prisma.service.create({ data: rest });
    await prisma.serviceTranslation.create({
      data: { serviceId: created.id, locale: 'en', ...en },
    });
    await prisma.serviceTranslation.create({
      data: { serviceId: created.id, locale: 'sq', ...sq },
    });
  }
  console.log('✅ Services created');

  // ── Project Categories ──────────────────────────────────────────────────────
  const catWebsites = await prisma.projectCategory.create({
    data: { slug: 'websites', name: 'Websites', nameAl: 'Faqe Interneti', order: 1 },
  });
  const catEcommerce = await prisma.projectCategory.create({
    data: { slug: 'ecommerce', name: 'E-Commerce', nameAl: 'E-Commerce', order: 2 },
  });
  const catWebApps = await prisma.projectCategory.create({
    data: {
      slug: 'web-apps',
      name: 'Web Applications',
      nameAl: 'Aplikacione Web',
      order: 3,
    },
  });
  const catSoftware = await prisma.projectCategory.create({
    data: {
      slug: 'custom-software',
      name: 'Custom Software',
      nameAl: 'Softuer i Personalizuar',
      order: 4,
    },
  });
  console.log('✅ Project categories created');

  // ── Projects ────────────────────────────────────────────────────────────────
  const projectsData = [
    {
      slug: 'meridian-finance-platform',
      categoryId: catWebApps.id,
      coverImage:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'Next.js',
        'TypeScript',
        'PostgreSQL',
        'Prisma',
        'Stripe',
        'AWS',
      ],
      featured: true,
      published: true,
      year: 2024,
      order: 1,
      en: {
        title: 'Meridian Finance Platform',
        client: 'Meridian Capital Group',
        industry: 'Financial Services',
        tagline:
          'A comprehensive financial management platform built for enterprise-scale operations.',
        challenge:
          'Meridian Capital needed to replace their legacy financial management system with a modern, real-time platform capable of handling thousands of concurrent transactions.',
        solution:
          'We architected a full-stack financial platform with real-time data processing, advanced reporting, multi-currency support, and role-based access for different organizational levels.',
        results:
          'The platform now processes over 50,000 transactions daily, reduced reporting time by 78%, and improved team productivity by 45% within three months of launch.',
        metaTitle: 'Meridian Finance Platform Case Study | Velvante Solutions',
        metaDesc:
          'How Velvante Solutions built a comprehensive financial management platform for Meridian Capital Group.',
      },
      sq: {
        title: 'Platforma Financiare Meridian',
        client: 'Meridian Capital Group',
        industry: 'Shërbime Financiare',
        tagline:
          'Një platformë gjithëpërfshirëse e menaxhimit financiar e ndërtuar për operacione në shkallë ndërmarrjesh.',
        challenge:
          'Meridian Capital duhej të zëvendësonte sistemin e tyre të vjetër të menaxhimit financiar me një platformë moderne, në kohë reale, të aftë për të trajtuar mijëra transaksione njëkohësisht.',
        solution:
          'Ne arkitekturuam një platformë financiare full-stack me përpunim të dhënash në kohë reale, raportim të avancuar, mbështetje shumë-valutore dhe qasje të bazuar në role.',
        results:
          'Platforma tani përpunon mbi 50,000 transaksione në ditë, ka reduktuar kohën e raportimit me 78% dhe ka përmirësuar produktivitetin e ekipit me 45% brenda tre muajve nga lançimi.',
        metaTitle: 'Studim Rasti i Platformës Financiare Meridian | Velvante Solutions',
        metaDesc:
          'Si Velvante Solutions ndërtoi një platformë gjithëpërfshirëse të menaxhimit financiar për Meridian Capital Group.',
      },
    },
    {
      slug: 'luxara-ecommerce',
      categoryId: catEcommerce.id,
      coverImage:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'Next.js',
        'Shopify API',
        'TypeScript',
        'Stripe',
        'Prisma',
        'Tailwind CSS',
      ],
      featured: true,
      published: true,
      year: 2024,
      order: 2,
      en: {
        title: 'Luxara Premium Store',
        client: 'Luxara Cosmetics',
        industry: 'Luxury Retail',
        tagline:
          'A high-end e-commerce experience that matches the premium nature of the brand.',
        challenge:
          'Luxara needed an e-commerce platform that would reflect their luxury brand positioning while delivering a seamless, high-converting shopping experience across all devices.',
        solution:
          'We built a custom e-commerce platform with carefully crafted UX, optimized product discovery, one-click checkout, and a sophisticated loyalty program integration.',
        results:
          'Within 60 days of launch, conversion rates increased by 34%, average order value grew by 22%, and mobile revenue doubled.',
        metaTitle: 'Luxara Premium Store Case Study | Velvante Solutions',
        metaDesc:
          'How Velvante Solutions built a premium e-commerce experience that doubled mobile revenue for Luxara Cosmetics.',
      },
      sq: {
        title: 'Dyqani Premium Luxara',
        client: 'Luxara Cosmetics',
        industry: 'Shitje me Pakicë Luks',
        tagline:
          'Një përvojë e-commerce e klasit të lartë që përputhet me natyrën premium të markës.',
        challenge:
          'Luxara kishte nevojë për një platformë e-commerce që do të reflektonte pozicionimin e tyre të markës luks ndërkohë që ofron një përvojë blerjeje të rrjedhshme dhe me konvertim të lartë.',
        solution:
          'Ne ndërtuam një platformë të personalizuar e-commerce me UX të dizajnuar me kujdes, zbulim produktesh të optimizuar, checkout me një klik dhe integrim sofistikues të programit të besnikërisë.',
        results:
          'Brenda 60 ditëve nga lançimi, shkallët e konvertimit u rritën me 34%, vlera mesatare e porosisë u rrit me 22% dhe të ardhurat mobile u dyfishuan.',
        metaTitle: 'Studim Rasti i Dyqanit Premium Luxara | Velvante Solutions',
        metaDesc:
          'Si Velvante Solutions ndërtoi një përvojë premium e-commerce që dyfishoi të ardhurat mobile për Luxara Cosmetics.',
      },
    },
    {
      slug: 'nexora-saas-platform',
      categoryId: catWebApps.id,
      coverImage:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'Next.js',
        'Node.js',
        'PostgreSQL',
        'WebSockets',
        'Redis',
        'Docker',
      ],
      featured: false,
      published: true,
      year: 2024,
      order: 3,
      en: {
        title: 'Nexora SaaS Platform',
        client: 'Nexora Technologies',
        industry: 'Software as a Service',
        tagline:
          'A scalable project management SaaS platform built for distributed teams.',
        challenge:
          'Nexora needed a real-time project management platform that could scale from startup to enterprise while maintaining sub-100ms response times under heavy load.',
        solution:
          'We built a WebSocket-powered real-time platform with optimistic UI updates, offline-first capability, advanced caching, and a microservices backend designed for horizontal scaling.',
        results:
          'The platform successfully scaled to 15,000 monthly active users, maintained 99.98% uptime, and received a 4.9/5 rating from early adopters.',
        metaTitle: 'Nexora SaaS Platform Case Study | Velvante Solutions',
        metaDesc:
          'How Velvante Solutions built a real-time SaaS platform that scaled to 15,000 monthly active users.',
      },
      sq: {
        title: 'Platforma SaaS Nexora',
        client: 'Nexora Technologies',
        industry: 'Softuer si Shërbim',
        tagline:
          'Një platformë e menaxhimit të projekteve SaaS të shkallëzueshme e ndërtuar për ekipe të shpërndara.',
        challenge:
          'Nexora kishte nevojë për një platformë menaxhimi projektesh në kohë reale që mund të shkallëzohej nga startup deri te ndërmarrja ndërkohë që mban kohë reagimi nën 100ms nën ngarkesë të rëndë.',
        solution:
          'Ne ndërtuam një platformë në kohë reale të fuqizuar me WebSocket me përditësime optimiste UI, aftësi offline-first, memorizim të avancuar dhe backend mikroshërbimesh të dizajnuar për shkallëzim horizontal.',
        results:
          'Platforma u shkallëzua me sukses në 15,000 përdorues aktivë mujorë, mbajti 99.98% kohë disponibilitetit dhe mori vlerësim 4.9/5 nga adoptuesit e hershëm.',
        metaTitle: 'Studim Rasti i Platformës SaaS Nexora | Velvante Solutions',
        metaDesc:
          'Si Velvante Solutions ndërtoi një platformë SaaS në kohë reale që u shkallëzua në 15,000 përdorues aktivë mujorë.',
      },
    },
    {
      slug: 'arqua-corporate-website',
      categoryId: catWebsites.id,
      coverImage:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'Next.js',
        'TypeScript',
        'Framer Motion',
        'Contentful',
        'Vercel',
      ],
      featured: false,
      published: true,
      year: 2023,
      order: 4,
      en: {
        title: 'Arqua Corporate Identity',
        client: 'Arqua Real Estate Group',
        industry: 'Real Estate',
        tagline:
          'A premium corporate website that redefined the brand for a leading real estate group.',
        challenge:
          'Arqua Real Estate needed a complete digital rebrand. Their existing website failed to communicate the premium nature of their developments and was losing leads to competitors with stronger online presences.',
        solution:
          'We designed and built a visually striking corporate website with immersive property showcases, sophisticated motion design, and a conversion-optimized inquiry system.',
        results:
          'Organic traffic increased by 156%, lead quality improved significantly, and the time visitors spent on the site tripled within the first 30 days of launch.',
        metaTitle: 'Arqua Corporate Website Case Study | Velvante Solutions',
        metaDesc:
          'How Velvante Solutions redesigned Arqua Real Estate digital presence, tripling visitor engagement in 30 days.',
      },
      sq: {
        title: 'Identiteti Korporativ Arqua',
        client: 'Arqua Real Estate Group',
        industry: 'Pasuritë e Paluajtshme',
        tagline:
          'Një faqe interneti korporative premium që rifikoi markën për një grup kryesor të pasurive të paluajtshme.',
        challenge:
          'Arqua Real Estate kishte nevojë për një ribrandim të plotë dixhital. Faqja e tyre ekzistuese e internetit dështonte të komunikonte natyrën premium të zhvillimeve të tyre dhe po humbiste pluhura ndaj konkurrentëve me preza online më të forta.',
        solution:
          'Ne dizajnuam dhe ndërtuam një faqe interneti korporative vizualisht mbresëlënëse me ekspozita joshëse pronash, dizajn sofistikues lëvizjeje dhe sistem pyetjesh të optimizuar për konvertim.',
        results:
          'Trafiku organik u rrit me 156%, cilësia e pluhurave u përmirësua ndjeshëm dhe koha që vizitorët kalojnë në sit u trefishua brenda 30 ditëve të para nga lançimi.',
        metaTitle: 'Studim Rasti i Faqes Korporative Arqua | Velvante Solutions',
        metaDesc:
          'Si Velvante Solutions ridisakordoi prezencën dixhitale të Arqua Real Estate, trefishoi angazhimin e vizitorëve brenda 30 ditëve.',
      },
    },
    {
      slug: 'helix-health-app',
      categoryId: catWebApps.id,
      coverImage:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'Next.js',
        'React Native',
        'PostgreSQL',
        'AWS',
        'HIPAA Compliance',
        'TypeScript',
      ],
      featured: false,
      published: true,
      year: 2023,
      order: 5,
      en: {
        title: 'Helix Health Portal',
        client: 'Helix Medical Group',
        industry: 'Healthcare',
        tagline:
          'A HIPAA-compliant patient portal that transformed the patient experience for a multi-location medical practice.',
        challenge:
          'Helix Medical needed to modernize their patient management system while maintaining full HIPAA compliance — a complex challenge given the sensitivity of medical data and strict regulatory requirements.',
        solution:
          'We built a secure, HIPAA-compliant patient portal with end-to-end encryption, audit logging, role-based access for medical staff, and an intuitive patient-facing interface.',
        results:
          'Patient satisfaction scores increased by 41%, administrative workload reduced by 60%, and appointment no-show rates dropped by 28%.',
        metaTitle: 'Helix Health Portal Case Study | Velvante Solutions',
        metaDesc:
          'How Velvante Solutions built a HIPAA-compliant patient portal that reduced administrative workload by 60%.',
      },
      sq: {
        title: 'Portali Shëndetësor Helix',
        client: 'Helix Medical Group',
        industry: 'Kujdesi Shëndetësor',
        tagline:
          'Një portal pacientësh i pajtues me HIPAA që transformoi përvojën e pacientit për një praktikë mjekësore shumë-vendore.',
        challenge:
          'Helix Medical kishte nevojë të modernizonte sistemin e tyre të menaxhimit të pacientëve duke ruajtur pajtueshmëri të plotë HIPAA — një sfidë komplekse duke pasur parasysh ndjeshmërinë e të dhënave mjekësore.',
        solution:
          'Ne ndërtuam një portal pacientësh të sigurt dhe të pajtuar me HIPAA me kriptim fundor-në-fund, regjistrim auditimi, qasje të bazuar në role për stafin mjekësor dhe ndërfaqe intuitive të orientuar nga pacientët.',
        results:
          'Rezultatet e kënaqësisë së pacientëve u rritën me 41%, ngarkesa administrative u reduktua me 60% dhe normat e mungesave në takime ranë me 28%.',
        metaTitle: 'Studim Rasti i Portalit Shëndetësor Helix | Velvante Solutions',
        metaDesc:
          'Si Velvante Solutions ndërtoi një portal pacientësh të pajtuar me HIPAA që reduktoi ngarkesën administrative me 60%.',
      },
    },
    {
      slug: 'strata-logistics-dashboard',
      categoryId: catSoftware.id,
      coverImage:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      ],
      technologies: [
        'React',
        'Node.js',
        'PostgreSQL',
        'Mapbox',
        'WebSockets',
        'Redis',
        'Docker',
      ],
      featured: false,
      published: true,
      year: 2023,
      order: 6,
      en: {
        title: 'Strata Logistics Dashboard',
        client: 'Strata Logistics Ltd',
        industry: 'Logistics & Supply Chain',
        tagline:
          'A real-time logistics management dashboard that gave Strata full visibility over their global supply chain.',
        challenge:
          'Strata Logistics was managing a complex global supply chain using spreadsheets and disconnected tools, leading to costly delays, inventory errors, and poor customer visibility.',
        solution:
          'We developed a real-time logistics dashboard with live vehicle tracking, automated inventory alerts, predictive delay detection, and a customer-facing shipment portal.',
        results:
          'Delivery delays reduced by 37%, inventory accuracy improved to 99.2%, customer satisfaction scores rose by 52%, and operational costs decreased by 23%.',
        metaTitle: 'Strata Logistics Dashboard Case Study | Velvante Solutions',
        metaDesc:
          'How Velvante Solutions built a real-time logistics dashboard that reduced delivery delays by 37%.',
      },
      sq: {
        title: 'Paneli Logjistik Strata',
        client: 'Strata Logistics Ltd',
        industry: 'Logjistikë dhe Zinxhir Furnizimi',
        tagline:
          'Një panel menaxhimi logjistik në kohë reale që i dha Strata-s dukshmëri të plotë mbi zinxhirin e tyre global të furnizimit.',
        challenge:
          'Strata Logistics po menaxhonte një zinxhir kompleks global furnizimi duke përdorur spreadsheets dhe mjete të pakonektuara, duke çuar në vonesa të kushtueshme, gabime inventari dhe dukshmëri të dobët ndaj klientëve.',
        solution:
          'Ne zhvilluam një panel logjistik në kohë reale me gjurmim live të automjeteve, alarme të automatizuara inventari, zbulim parashikues të vonesave dhe portal dërgese i orientuar nga klienti.',
        results:
          'Vonesat e dorëzimit u reduktuan me 37%, saktësia e inventarit u përmirësua në 99.2%, rezultatet e kënaqësisë së klientit u rritën me 52% dhe kostot operative u ulën me 23%.',
        metaTitle: 'Studim Rasti i Panelit Logjistik Strata | Velvante Solutions',
        metaDesc:
          'Si Velvante Solutions ndërtoi një panel logjistik në kohë reale që reduktoi vonesat e dorëzimit me 37%.',
      },
    },
  ];

  for (const proj of projectsData) {
    const { en, sq, ...rest } = proj;
    const created = await prisma.project.create({ data: rest });
    await prisma.projectTranslation.create({
      data: { projectId: created.id, locale: 'en', ...en },
    });
    await prisma.projectTranslation.create({
      data: { projectId: created.id, locale: 'sq', ...sq },
    });
  }
  console.log('✅ Projects created');

  // ── Blog Categories ─────────────────────────────────────────────────────────
  const catWebDev = await prisma.blogCategory.create({
    data: { slug: 'web-development', name: 'Web Development', nameAl: 'Zhvillim Web', order: 1 },
  });
  const catDesign = await prisma.blogCategory.create({
    data: { slug: 'design', name: 'Design', nameAl: 'Dizajn', order: 2 },
  });
  const catSEO = await prisma.blogCategory.create({
    data: { slug: 'seo', name: 'SEO', nameAl: 'SEO', order: 3 },
  });
  await prisma.blogCategory.create({
    data: { slug: 'business', name: 'Business', nameAl: 'Biznes', order: 4 },
  });
  console.log('✅ Blog categories created');

  // ── Authors ─────────────────────────────────────────────────────────────────
  const author1 = await prisma.author.create({
    data: {
      name: 'Artan Krasniqi',
      bio: 'CEO of Velvante Solutions with 12+ years in digital transformation and enterprise technology.',
      bioAl:
        'CEO i Velvante Solutions me mbi 12 vite në transformimin dixhital dhe teknologjinë e ndërmarrjeve.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      role: 'CEO & Founder',
      roleAl: 'CEO dhe Themelues',
      linkedin: 'https://linkedin.com',
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'Drin Berisha',
      bio: 'Principal Engineer at Velvante Solutions, specializing in scalable architectures and cloud infrastructure.',
      bioAl:
        'Inxhinier Kryesor në Velvante Solutions, i specializuar në arkitektura të shkallëzueshme dhe infrastrukturë cloud.',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      role: 'Principal Engineer',
      roleAl: 'Inxhinier Kryesor',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  });
  console.log('✅ Authors created');

  // ── Blog Posts ──────────────────────────────────────────────────────────────
  const blogPosts = [
    {
      slug: 'why-your-business-website-is-losing-you-money',
      authorId: author1.id,
      categoryId: catWebDev.id,
      coverImage:
        'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c5ac?w=1200&h=630&fit=crop',
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2024-11-01'),
      readingTime: 7,
      en: {
        title: 'Why Your Business Website Is Losing You Money',
        excerpt:
          'Most business websites are quiet revenue leaks. Here are the technical and UX failures costing you conversions — and how to fix them.',
        content: `# Why Your Business Website Is Losing You Money

Your website is your most important salesperson. Unlike a human sales representative, it works 24/7, reaches every prospect who searches for your business, and can handle thousands of visitors simultaneously. But for most businesses, their website is quietly undermining their revenue rather than growing it.

## The Silent Revenue Leak

Research consistently shows that 53% of mobile users abandon websites that take more than 3 seconds to load. Every additional second of load time corresponds to a 7% reduction in conversions. If your website is generating $100,000 in annual revenue, a single second improvement in load time is worth $7,000.

## The Five Most Common Problems

### 1. Poor Mobile Experience
Over 60% of web traffic now comes from mobile devices, yet many business websites were built primarily for desktop. Text too small to read, buttons too close together to tap, forms that are frustrating to complete — these failures drive away more than half your potential customers before they even read your content.

### 2. Slow Page Speed
Page speed is both a user experience issue and an SEO factor. Google explicitly uses Core Web Vitals — Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint — as ranking factors. A slow website ranks lower in search results and frustrates users who do reach it.

### 3. Weak Conversion Architecture
Most websites are built as digital brochures rather than conversion machines. They lack clear calls to action, trust signals, social proof, and the psychological triggers that move visitors from interest to inquiry.

### 4. Outdated Design
Design communicates trust before a visitor reads a single word. A visually outdated website signals to prospects that your business may be similarly behind the times. First impressions form in 50 milliseconds.

### 5. Poor Technical SEO
You can have the best service in your industry, but if your website is structurally invisible to search engines, your ideal customers will never find you. Technical SEO — site structure, metadata, semantic HTML, schema markup — forms the foundation of organic visibility.

## What to Do About It

The good news is that these problems are solvable. A professional website audit will identify which of these issues affect your specific site, and a phased optimization plan can address them systematically.

At Velvante Solutions, we've helped dozens of businesses transform their websites from quiet liabilities into active revenue generators. The results consistently surprise even our most skeptical clients.`,
        metaTitle:
          'Why Your Business Website Is Losing You Money | Velvante Solutions Blog',
        metaDesc:
          'Most business websites are quiet revenue leaks. Learn the 5 technical and UX failures costing you conversions — and how to fix them.',
      },
      sq: {
        title: 'Pse Faqja Juaj e Internetit po Humb Paratë Tuaja',
        excerpt:
          "Shumica e faqeve të internetit të bizneseve janë rrjedhje të heshtura të të ardhurave. Ja dështimet teknike dhe UX që po ju kushtojnë konvertime — dhe si t'i rregulloni.",
        content: `# Pse Faqja Juaj e Internetit po Humb Paratë Tuaja

Faqja juaj e internetit është shitësi juaj më i rëndësishëm. Ndryshe nga një përfaqësues njerëzor i shitjeve, ajo punon 24/7, arrin çdo perspektivë që kërkon biznesin tuaj dhe mund të trajtojë mijëra vizitorë njëkohësisht.

## Rrjedhja e Heshtur e të Ardhurave

Hulumtimet tregojnë vazhdimisht se 53% e përdoruesve mobile braktisin faqet e internetit që marrin më shumë se 3 sekonda për t'u ngarkuar. Çdo sekondë shtesë e kohës së ngarkimit korrespondon me një reduktim prej 7% të konvertimeve.

## Pesë Problemet Më të Zakonshme

### 1. Përvojë e Dobët Mobile
Mbi 60% e trafikut web tani vjen nga pajisjet mobile, megjithatë shumë faqe interneti biznesesh janë ndërtuar kryesisht për desktop.

### 2. Shpejtësi e Ngadaltë e Faqes
Shpejtësia e faqes është si çështje e përvojës së përdoruesit ashtu edhe faktor SEO. Google eksplicit përdor Core Web Vitals si faktorë renditjeje.

### 3. Arkitekturë e Dobët Konvertimi
Shumica e faqeve të internetit ndërtohen si broshura dixhitale, jo si makina konvertimi. Ato u mungojnë thirrjet e qarta për veprim dhe provat sociale.

### 4. Dizajn i Vjetëruar
Dizajni komunikon besimin para se vizitori të lexojë një fjalë të vetme. Një faqe interneti vizualisht e vjetëruar sinjalizon perspektivave se biznesi juaj mund të jetë po kështu prapa kohëve.

### 5. SEO i Dobët Teknik
Nëse faqja juaj e internetit është strukturalisht e padukshme për motorët e kërkimit, klientët tuaj idealë nuk do t'ju gjejnë kurrë.

## Çfarë të Bëni me Të

Lajmi i mirë është se këto probleme janë të zgjidhshme. Një auditim profesional i faqes së internetit do të identifikojë cilët prej këtyre problemeve ndikojnë faqen tuaj specifike.`,
        metaTitle:
          'Pse Faqja Juaj e Internetit po Humb Paratë Tuaja | Blog Velvante Solutions',
        metaDesc:
          'Shumica e faqeve të internetit të bizneseve janë rrjedhje të heshtura të të ardhurave. Mësoni 5 dështimet teknike dhe UX.',
      },
    },
    {
      slug: 'core-web-vitals-business-impact',
      authorId: author2.id,
      categoryId: catSEO.id,
      coverImage:
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop',
      status: 'PUBLISHED' as const,
      featured: true,
      publishedAt: new Date('2024-10-15'),
      readingTime: 9,
      en: {
        title:
          "Core Web Vitals: What They Are and Why They Matter for Your Business",
        excerpt:
          "Google's Core Web Vitals are now official ranking factors. Here's what LCP, CLS, and INP mean in plain language — and how to improve them.",
        content: `# Core Web Vitals: What They Are and Why They Matter

In 2021, Google made its Core Web Vitals an official ranking factor. For businesses with an online presence, this was a significant signal: user experience metrics now directly affect your search visibility.

## What Are Core Web Vitals?

**Largest Contentful Paint (LCP)** measures loading performance — specifically, how long it takes for the largest visible content element to render. Target: under 2.5 seconds.

**Cumulative Layout Shift (CLS)** measures visual stability — how much page elements unexpectedly move during load. Target: under 0.1.

**Interaction to Next Paint (INP)** measures responsiveness — the time between a user interaction and the browser's visual response. Target: under 200ms.

## Why This Matters for Business

Poor Core Web Vitals correlate directly with higher bounce rates, lower conversion rates, reduced search rankings, and worse user satisfaction.

Conversely, businesses that achieve Good ratings across all three metrics consistently see improvements in all these areas.

## How to Improve Your Core Web Vitals

### Improving LCP
- Optimize and properly size images
- Use a CDN to serve assets closer to users
- Eliminate render-blocking resources
- Implement server-side rendering or static generation

### Improving CLS
- Always specify width and height attributes for images and videos
- Reserve space for ads and embeds
- Avoid inserting content above existing content

### Improving INP
- Break up long JavaScript tasks
- Use web workers for heavy computation
- Implement code splitting and lazy loading`,
        metaTitle: 'Core Web Vitals Business Impact Guide | Velvante Solutions Blog',
        metaDesc:
          'Core Web Vitals are Google ranking factors. Learn what LCP, CLS, and INP mean for your business and how to improve them.',
      },
      sq: {
        title:
          'Core Web Vitals: Çfarë Janë dhe Pse Janë të Rëndësishme për Biznesin Tuaj',
        excerpt:
          'Core Web Vitals të Google janë tani faktorë zyrtar renditjeje. Ja çfarë do të thotë LCP, CLS dhe INP në gjuhë të thjeshtë.',
        content: `# Core Web Vitals: Çfarë Janë dhe Pse Janë të Rëndësishme

Në vitin 2021, Google e bëri Core Web Vitals një faktor zyrtar renditjeje. Për bizneset me prani online, ky ishte një sinjal i rëndësishëm: metrikat e përvojës së përdoruesit tani ndikojnë drejtpërdrejt dukshmërinë tuaj të kërkimit.

## Çfarë Janë Core Web Vitals?

**Largest Contentful Paint (LCP)** mat performancën e ngarkimit. Objektivi: nën 2.5 sekonda.

**Cumulative Layout Shift (CLS)** mat stabilitetin vizual. Objektivi: nën 0.1.

**Interaction to Next Paint (INP)** mat reagimin. Objektivi: nën 200ms.

## Pse Kjo Është e Rëndësishme për Biznesin

Core Web Vitals të dobëta korrelojnë drejtpërdrejt me norma më të larta braktisje, norma më të ulëta konvertimi, renditje të reduktuara kërkimi dhe kënaqësi më të keqe të përdoruesve.`,
        metaTitle:
          'Udhëzues i Ndikimit të Core Web Vitals në Biznes | Blog Velvante Solutions',
        metaDesc:
          'Core Web Vitals janë faktorë renditjeje të Google. Mësoni çfarë do të thotë LCP, CLS dhe INP për biznesin tuaj.',
      },
    },
    {
      slug: 'nextjs-for-business-websites',
      authorId: author2.id,
      categoryId: catWebDev.id,
      coverImage:
        'https://images.unsplash.com/photo-1537884944318-390069bb8665?w=1200&h=630&fit=crop',
      status: 'PUBLISHED' as const,
      featured: false,
      publishedAt: new Date('2024-10-01'),
      readingTime: 8,
      en: {
        title: "Why We Build Business Websites with Next.js",
        excerpt:
          "Next.js has become the standard for high-performance business websites. Here's why we chose it — and why it matters for your results.",
        content: `# Why We Build Business Websites with Next.js

Choosing the right technology foundation for a business website is a decision that affects performance, maintainability, SEO, and ultimately revenue for years to come. At Velvante Solutions, we build the majority of our client websites and applications using Next.js — and there are concrete reasons why.

## What Is Next.js?

Next.js is a React-based framework developed by Vercel that enables developers to build server-rendered, statically generated, and hybrid web applications with exceptional performance characteristics.

## Why Next.js for Business Websites?

### Performance by Default
Next.js includes automatic image optimization, font optimization, script loading optimization, and server-side rendering — all of which contribute to faster page loads and better Core Web Vitals scores.

### SEO Excellence
Server-rendered pages ensure search engines can index your content fully, immediately, and accurately. Dynamic metadata, canonical URLs, and structured data are all first-class features.

### Developer Experience
A great developer experience means your development team can move faster, catch errors earlier, and produce higher-quality code — which ultimately means lower costs and better results for you.

### The App Router
Next.js 13+ introduced the App Router, enabling React Server Components. This architectural shift allows most of your page rendering to happen on the server, dramatically reducing JavaScript sent to the browser and improving load performance.

## The Bottom Line

When we choose Next.js, we're choosing a technology that delivers measurable business outcomes — faster websites, better search rankings, more maintainable codebases, and a better experience for your users.`,
        metaTitle: 'Why We Build with Next.js | Velvante Solutions Blog',
        metaDesc:
          'Next.js is the standard for high-performance business websites. Learn why we chose it and how it benefits your results.',
      },
      sq: {
        title: 'Pse Ne Ndërtojmë Faqe Interneti Biznesesh me Next.js',
        excerpt:
          'Next.js është bërë standardi për faqet e internetit të bizneseve me performancë të lartë. Ja pse e zgjodhëm — dhe pse është e rëndësishme për rezultatet tuaja.',
        content: `# Pse Ne Ndërtojmë Faqe Interneti Biznesesh me Next.js

Zgjedhja e themeleve të duhura teknologjike për një faqe interneti biznesi është një vendim që ndikon performancën, mirëmbajtjen, SEO dhe në fund të fundit të ardhurat për vite me radhë. Në Velvante Solutions, ne ndërtojmë shumicën e faqeve të internetit dhe aplikacioneve tona të klientëve duke përdorur Next.js.

## Çfarë Është Next.js?

Next.js është një framework i bazuar në React i zhvilluar nga Vercel që u mundëson zhvilluesve të ndërtojnë aplikacione web të renderuara nga serveri, të gjeneruara statikisht dhe hibride me karakteristika të jashtëzakonshme performancë.

## Pse Next.js për Faqet Interneti të Bizneseve?

### Performancë si Parazgjedhje
Next.js përfshin optimizim automatik të imazheve, optimizim të fonteve dhe renderim nga ana e serverit — të gjitha kontribuojnë në ngarkime më të shpejta të faqes.

### Ekselencë SEO
Faqet e renderuara nga serveri sigurojnë që motorët e kërkimit mund të indeksojnë përmbajtjen tuaj plotësisht, menjëherë dhe me saktësi.`,
        metaTitle: 'Pse Ndërtojmë me Next.js | Blog Velvante Solutions',
        metaDesc:
          'Next.js është standardi për faqet e internetit të bizneseve me performancë të lartë. Mësoni pse e zgjodhëm.',
      },
    },
    {
      slug: 'design-systems-for-growing-businesses',
      authorId: author1.id,
      categoryId: catDesign.id,
      coverImage:
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=630&fit=crop',
      status: 'PUBLISHED' as const,
      featured: false,
      publishedAt: new Date('2024-09-15'),
      readingTime: 6,
      en: {
        title: 'Why Growing Businesses Need a Design System',
        excerpt:
          "A design system is not just a component library — it's a strategic business asset that scales your brand, speeds up development, and reduces costs.",
        content: `# Why Growing Businesses Need a Design System

As businesses grow, so does the complexity of their digital presence. A single website becomes multiple platforms. One developer becomes a team. What started as a consistent brand begins to fragment across touchpoints.

A design system is the solution — and it's one of the most underrated strategic investments a growing business can make.

## What Is a Design System?

A design system is a collection of reusable components, patterns, guidelines, and documentation that enables teams to build consistent, high-quality interfaces efficiently.

It typically includes:
- **Design tokens**: Colors, typography, spacing, and other visual properties
- **Component library**: Buttons, forms, cards, navigation, and other UI elements
- **Pattern library**: Common layouts and interaction patterns
- **Documentation**: Guidelines, do's and don'ts, and usage examples

## Business Benefits

### Consistency at Scale
Every new page, feature, and product extension automatically inherits your brand standards. No more inconsistent buttons, mismatched typography, or conflicting color usage across products.

### Faster Development
Building new features from existing, tested components rather than from scratch dramatically reduces development time — typically by 30–50%.

### Reduced Costs
Fewer design decisions made per feature, less rework, fewer inconsistencies to fix. Design systems pay for themselves within months for businesses with active development.

### Better Collaboration
Designers and developers work from a shared source of truth, reducing handoff friction and misunderstandings.`,
        metaTitle:
          'Why Growing Businesses Need a Design System | Velvante Solutions Blog',
        metaDesc:
          'A design system is a strategic business asset. Learn how it scales your brand, speeds development, and reduces costs.',
      },
      sq: {
        title: 'Pse Bizneset në Rritje Kanë Nevojë për një Sistem Dizajni',
        excerpt:
          'Një sistem dizajni nuk është vetëm një bibliotekë komponentësh — është një aset strategjik biznesi që shkallëzon markën tuaj, përshpejton zhvillimin dhe redukton kostot.',
        content: `# Pse Bizneset në Rritje Kanë Nevojë për një Sistem Dizajni

Ndërsa bizneset rriten, ashtu edhe kompleksiteti i pranisë së tyre dixhitale. Një faqe interneti bëhet platforma të shumta. Një zhvillues bëhet ekip. Ajo që filloi si një markë e qëndrueshme fillon të fragmentohet nëpër pika kontakti.

Një sistem dizajni është zgjidhja — dhe është një nga investimet strategjike më të nënvlerësuara që mund të bëjë një biznes në rritje.

## Çfarë Është një Sistem Dizajni?

Një sistem dizajni është një koleksion komponentësh të ripërdorshëm, modelesh, udhëzimesh dhe dokumentacioni që u mundëson ekipeve të ndërtojnë ndërfaqe të qëndrueshme dhe të cilësisë së lartë me efikasitet.

## Përfitimet e Biznesit

### Qëndrueshmëri në Shkallë
Çdo faqe, veçori dhe shtesë produkti e re trashëgon automatikisht standardet e markës suaj.

### Zhvillim më i Shpejtë
Ndërtimi i veçorive të reja nga komponentët ekzistues të testuar, jo nga e para, redukton dramatikisht kohën e zhvillimit — zakonisht me 30-50%.

### Kosto të Reduktuara
Më pak vendime dizajni të marra për veçori, më pak ripunë, më pak mospërputhje për t'u rregulluar.`,
        metaTitle:
          'Pse Bizneset në Rritje Kanë Nevojë për një Sistem Dizajni | Blog Velvante Solutions',
        metaDesc:
          'Një sistem dizajni është një aset strategjik biznesi. Mësoni si shkallëzon markën tuaj dhe redukton kostot.',
      },
    },
  ];

  for (const post of blogPosts) {
    const { en, sq, ...rest } = post;
    const created = await prisma.blogPost.create({ data: rest });
    await prisma.blogTranslation.create({
      data: { postId: created.id, locale: 'en', ogImage: rest.coverImage, ...en },
    });
    await prisma.blogTranslation.create({
      data: { postId: created.id, locale: 'sq', ogImage: rest.coverImage, ...sq },
    });
  }
  console.log('✅ Blog posts created');

  // ── Testimonials ────────────────────────────────────────────────────────────
  const testimonials = [
    {
      name: 'Marcus Steinberg',
      role: 'CEO',
      company: 'Meridian Capital Group',
      rating: 5,
      featured: true,
      published: true,
      order: 1,
      en: 'Velvante Solutions transformed our entire digital infrastructure. The platform they built processes 50,000 transactions daily without a single failure. The quality of their engineering is exceptional — I would not trust anyone else with systems this critical.',
      sq: 'Velvante Solutions transformoi gjithë infrastrukturën tonë dixhitale. Platforma që ata ndërtuan përpunon 50,000 transaksione në ditë pa asnjë dështim. Cilësia e inxhinierisë së tyre është e jashtëzakonshme.',
    },
    {
      name: 'Sofia Marchetti',
      role: 'Head of E-Commerce',
      company: 'Luxara Cosmetics',
      rating: 5,
      featured: true,
      published: true,
      order: 2,
      en: 'Our conversion rates increased 34% and mobile revenue doubled within two months of launching the new platform. Velvante Solutions understood our luxury brand positioning from day one and delivered a website that truly reflects who we are.',
      sq: 'Shkallët tona të konvertimit u rritën me 34% dhe të ardhurat mobile u dyfishuan brenda dy muajve nga lançimi i platformës së re. Velvante Solutions e kuptoi pozicionimin tonë të markës luksoze që nga dita e parë.',
    },
    {
      name: 'James Whitmore',
      role: 'CTO',
      company: 'Nexora Technologies',
      rating: 5,
      featured: true,
      published: true,
      order: 3,
      en: 'The technical depth of the Velvante Solutions team is genuinely impressive. They architected a real-time SaaS platform that scaled to 15,000 users while maintaining 99.98% uptime. Their approach to engineering is thorough and principled.',
      sq: 'Thellësia teknike e ekipit Velvante Solutions është vërtet mbresëlënëse. Ata arkitekturuan një platformë SaaS në kohë reale që u shkallëzua në 15,000 përdorues ndërkohë që ruante 99.98% kohë disponibilitetit.',
    },
    {
      name: 'Elena Vasquez',
      role: 'Marketing Director',
      company: 'Arqua Real Estate Group',
      rating: 5,
      featured: false,
      published: true,
      order: 4,
      en: 'Within 30 days of the new website launching, our organic traffic was up 156% and our leads were noticeably higher quality. Velvante Solutions did not just build a beautiful website — they built a system that works.',
      sq: 'Brenda 30 ditëve nga lançimi i faqes së re të internetit, trafiku ynë organik u rrit me 156% dhe pluhurat tona ishin dukshëm të cilësisë më të lartë. Velvante Solutions nuk ndërtoi vetëm një faqe interneti të bukur — ata ndërtuan një sistem që funksionon.',
    },
    {
      name: 'Dr. Kristina Oben',
      role: 'Operations Director',
      company: 'Helix Medical Group',
      rating: 5,
      featured: false,
      published: true,
      order: 5,
      en: 'Healthcare software requires an extraordinary level of precision and security. Velvante Solutions delivered a HIPAA-compliant patient portal that our clinical staff genuinely love using. Our administrative workload dropped 60% on day one.',
      sq: 'Softueri i kujdesit shëndetësor kërkon një nivel të jashtëzakonshëm saktësie dhe sigurie. Velvante Solutions dorëzoi një portal pacientësh të pajtuar me HIPAA që stafi ynë klinik e do vërtet të përdorë. Ngarkesa jonë administrative ra 60% ditën e parë.',
    },
    {
      name: 'Thomas Reuter',
      role: 'Managing Director',
      company: 'Strata Logistics Ltd',
      rating: 5,
      featured: false,
      published: true,
      order: 6,
      en: 'We were drowning in spreadsheets before Velvante Solutions. Now we have full real-time visibility over our entire supply chain. Delivery delays are down 37% and our customers are consistently impressed by our new tracking portal.',
      sq: 'Ne po mbyteshim në spreadsheets para Velvante Solutions. Tani kemi dukshmëri të plotë në kohë reale mbi gjithë zinxhirin tonë të furnizimit. Vonesat e dorëzimit janë ulur me 37% dhe klientët tanë janë vazhdimisht të mahnitur nga portali ynë i ri i gjurmimit.',
    },
  ];

  for (const t of testimonials) {
    const { en, sq, ...rest } = t;
    const created = await prisma.testimonial.create({ data: rest });
    await prisma.testimonialTranslation.create({
      data: { testimonialId: created.id, locale: 'en', quote: en },
    });
    await prisma.testimonialTranslation.create({
      data: { testimonialId: created.id, locale: 'sq', quote: sq },
    });
  }
  console.log('✅ Testimonials created');

  console.log('\n🎉 Velvante Solutions database seeded successfully!');
  console.log('\nAdmin credentials:');
  console.log('  Email: admin@velvante.com');
  console.log('  Password: Admin@2024!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
