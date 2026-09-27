'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Mail, Loader2, CheckCircle2, Lock } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[rgb(var(--color-text))] tracking-tight">
            Users & Access Control
          </h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
            Authorized administrative account and system permissions.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
          <Shield size={14} />
          <span>Locked to Master Administrator</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] flex items-start gap-3">
        <Lock size={18} className="text-[rgb(var(--color-accent-light))] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-[rgb(var(--color-text))]">Politika e Sigurisë së Llogarive</p>
          <p className="text-[rgb(var(--color-text-muted))] leading-relaxed">
            Regjistrimet e reja janë të çaktivizuara përgjithmonë. Vetëm llogaria primare administrative (<span className="font-mono text-[rgb(var(--color-text))]">velvantesolutions@outlook.com</span>) ka të drejtë qasjeje. Fjalëkalimi mund të ndryshohet në mënyrë të sigurt përmes verifikimit me email.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <Card
              key={u.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[rgb(var(--color-surface)/0.8)] border-[rgb(var(--color-border))]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">{u.name}</h3>
                    <Badge variant="accent" className="text-[10px] font-mono px-2 py-0.5">
                      {u.role}
                    </Badge>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <CheckCircle2 size={10} /> Active Master
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-muted))] mt-1 font-mono">
                    <Mail size={13} />
                    <span>{u.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[11px] font-mono text-[rgb(var(--color-text-subtle))]">
                  Krijuar: {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
