'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, Wrench, FileText, MessageSquare,
  Mail, Users, Settings, LogOut, Menu, X, Shield, ExternalLink
} from 'lucide-react';
import { LogoIcon } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/reset-password') return;

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          setUser(data.data);
        }
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Services', href: '/admin/services', icon: Wrench },
    { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { label: 'Leads / Inquiries', href: '/admin/leads', icon: Mail },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { label: 'Users & Roles', href: '/admin/users', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-text))]">
      <header className="md:hidden flex items-center justify-between p-4 bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <LogoIcon size={32} />
          <span className="font-extrabold text-sm tracking-tight text-[rgb(var(--color-text))]">Velvante CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] flex items-center gap-1"
          >
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))]"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 md:w-64 bg-[rgb(var(--color-surface))] border-r border-[rgb(var(--color-border))] flex flex-col h-screen h-[100dvh] overflow-hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-[rgb(var(--color-border))] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <LogoIcon size={36} />
            <div>
              <div className="font-black text-sm tracking-tight text-[rgb(var(--color-text))]">Velvante CMS</div>
              <div className="text-[10px] font-mono text-[rgb(var(--color-accent-light))]">Admin Workspace</div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]"
          >
            <X size={18} />
          </button>
        </div>

        {user && (
          <div className="px-5 py-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-elevated)/0.4)] flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[rgb(var(--color-text))] truncate">{user.name}</div>
              <div className="text-[10px] text-[rgb(var(--color-text-muted))] truncate">{user.email}</div>
            </div>
            <Badge variant="accent" className="text-[10px] px-2 py-0.5 font-mono">
              {user.role}
            </Badge>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[rgb(var(--color-accent))] text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                    : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface-elevated))]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[rgb(var(--color-accent-light))]'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[rgb(var(--color-border))] space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-surface-elevated))] rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink size={14} />
              <span>Public Platform</span>
            </span>
            <span className="text-[10px] font-mono text-[rgb(var(--color-text-subtle))]">Uebi &rarr;</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={15} />
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      <div className="md:pl-64 flex flex-col min-h-screen w-full">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
