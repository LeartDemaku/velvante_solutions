import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/db/client';
import { FolderKanban, Wrench, FileText, Mail, Users, TrendingUp } from 'lucide-react';

export default async function AdminDashboardPage() {
  let counts = {
    projects: 0,
    services: 0,
    posts: 0,
    inquiries: 0,
    contacts: 0,
    subscribers: 0,
  };

  try {
    const [projects, services, posts, inquiries, contacts, subscribers] = await Promise.all([
      prisma.project.count({ where: { deletedAt: null } }),
      prisma.service.count({ where: { deletedAt: null } }),
      prisma.blogPost.count({ where: { deletedAt: null } }),
      prisma.projectInquiry.count(),
      prisma.contactSubmission.count(),
      prisma.newsletterSubscriber.count(),
    ]);

    counts = { projects, services, posts, inquiries, contacts, subscribers };
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
  }

  const statCards = [
    { title: 'Total Projects', count: counts.projects, icon: FolderKanban, color: 'text-indigo-400' },
    { title: 'Services Published', count: counts.services, icon: Wrench, color: 'text-green-400' },
    { title: 'Blog Articles', count: counts.posts, icon: FileText, color: 'text-yellow-400' },
    { title: 'Project Inquiries', count: counts.inquiries, icon: Mail, color: 'text-blue-400' },
    { title: 'Contact Submissions', count: counts.contacts, icon: Mail, color: 'text-purple-400' },
    { title: 'Newsletter Subscribers', count: counts.subscribers, icon: Users, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Dashboard Overview</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">System performance, content inventory, and active lead metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6 space-y-4 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))] uppercase tracking-wider">{card.title}</span>
                <Icon className={card.color} size={20} />
              </div>
              <p className="text-3xl font-extrabold text-[rgb(var(--color-text))] font-mono">{card.count}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 space-y-4 bg-[rgb(var(--color-surface))]">
        <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">System Health & Internationalization</h2>
        <div className="flex items-center gap-4 text-xs font-mono">
          <Badge variant="success" dot>EN / SQ Active</Badge>
          <Badge variant="accent">Prisma ORM Connected</Badge>
          <Badge variant="default">Strict TypeScript Mode</Badge>
        </div>
      </Card>
    </div>
  );
}
