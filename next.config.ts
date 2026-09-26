import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/dashboard', permanent: false },
      { source: '/:locale/sherbimet', destination: '/:locale/services', permanent: false },
      { source: '/:locale/sherbimet/:slug*', destination: '/:locale/services/:slug*', permanent: false },
      { source: '/:locale/projektet', destination: '/:locale/projects', permanent: false },
      { source: '/:locale/projektet/:slug*', destination: '/:locale/projects/:slug*', permanent: false },
      { source: '/:locale/rreth-nesh', destination: '/:locale/about', permanent: false },
      { source: '/:locale/kontakt', destination: '/:locale/contact', permanent: false },
      { source: '/:locale/fillo-projektin', destination: '/:locale/start-project', permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: '/LOGO.png', destination: '/logo.png' },
      { source: '/LOGO', destination: '/logo.png' },
    ];
  },
};

export default withNextIntl(nextConfig);
