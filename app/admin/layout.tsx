import Link from 'next/link';
import {
  LayoutDashboard, FolderKanban, Wrench, FileText, MessageSquare,
  Mail, Image as ImageIcon, Users, Settings, LogOut
} from 'lucide-react';
import { LogoIcon } from '@/components/ui/logo';
import '@/app/globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { label: 'Leads / Inquiries', href: '/admin/leads', icon: Mail },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { label: 'Media Manager', href: '/admin/media', icon: ImageIcon },
    { label: 'Users & Roles', href: '/admin/users', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <html lang="en">
      <body className="bg-[rgb(var(--color-background))] text-[rgb(var(--color-text))] antialiased min-h-screen flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-[rgb(var(--color-surface))] border-b md:border-b-0 md:border-r border-[rgb(var(--color-border))] flex flex-col shrink-0">
          <div className="p-4 md:p-6 border-b border-[rgb(var(--color-border))] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoIcon size={38} />
              <span className="font-extrabold text-base tracking-tight text-[rgb(var(--color-text))]">Velvante Solutions CMS</span>
            </div>
            <Link
              href="/"
              className="text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] md:hidden"
            >
              Uebi &rarr;
            </Link>
          </div>

          <nav className="flex md:flex-col p-2 md:p-4 gap-1 overflow-x-auto md:overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 md:py-2.5 rounded-[var(--radius-md)] text-xs font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface-elevated))] transition-colors shrink-0"
                >
                  <Icon size={15} className="text-[rgb(var(--color-accent-light))]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block p-4 border-t border-[rgb(var(--color-border))]">
            <Link
              href="/admin/login"
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-[var(--radius-md)] transition-colors"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}

