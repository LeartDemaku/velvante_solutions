'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Users & Roles</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">Manage system administrators and editor permissions.</p>
      </div>

      <Card className="p-6 space-y-4 bg-[rgb(var(--color-surface))]">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-accent)/0.2)] text-[rgb(var(--color-accent-light))] flex items-center justify-center font-bold">
              V
            </div>
            <div>
              <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">System Administrator</h3>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">velvantesolutions@outlook.com</p>
            </div>
          </div>
          <Badge variant="accent">ADMIN</Badge>
        </div>
      </Card>
    </div>
  );
}
