'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, Loader2, Sparkles, User, Briefcase, Globe } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  createdAt: string;
  status: string;
}

interface ProjectInquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  projectType: string;
  services: string[];
  budgetMin?: number;
  budgetMax?: number;
  timeline?: string;
  description: string;
  createdAt: string;
  status: string;
}

export default function AdminLeadsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'inquiries' | 'contacts'>('inquiries');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      if (res.ok && data.data) {
        setContacts(data.data.contacts || []);
        setInquiries(data.data.inquiries || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Leads & Inquiries Inbox</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">Incoming submissions from your website forms.</p>
      </div>

      <div className="flex gap-4 border-b border-[rgb(var(--color-border))]">
        <button
          onClick={() => setTab('inquiries')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'inquiries'
              ? 'border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-light))]'
              : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
          }`}
        >
          Project Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            tab === 'contacts'
              ? 'border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-light))]'
              : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
          }`}
        >
          Contact Messages ({contacts.length})
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : tab === 'inquiries' ? (
        inquiries.length === 0 ? (
          <Card className="p-12 text-center space-y-4 bg-[rgb(var(--color-surface))]">
            <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={36} />
            <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No project inquiries received yet</h2>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">Submissions from `/start-project` will appear here.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <Card key={inq.id} className="p-6 space-y-4 bg-[rgb(var(--color-surface))]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgb(var(--color-border))] pb-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[rgb(var(--color-accent-light))]" />
                    <span className="font-bold text-base text-[rgb(var(--color-text))]">{inq.firstName} {inq.lastName}</span>
                    {inq.company && <span className="text-xs text-[rgb(var(--color-text-muted))]">({inq.company})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="accent">{inq.projectType}</Badge>
                    <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">{formatDate(inq.createdAt, 'en')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] block font-mono">Email:</span>
                    <a href={`mailto:${inq.email}`} className="text-[rgb(var(--color-accent-light))] font-semibold">{inq.email}</a>
                  </div>
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] block font-mono">Phone:</span>
                    <span className="text-[rgb(var(--color-text))]">{inq.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] block font-mono">Services:</span>
                    <span className="text-[rgb(var(--color-text))]">{inq.services?.join(', ') || 'General'}</span>
                  </div>
                </div>

                {inq.description && (
                  <div className="p-4 rounded-[var(--radius-md)] bg-[rgb(var(--color-surface-elevated))] text-xs text-[rgb(var(--color-text-muted))] whitespace-pre-wrap">
                    {inq.description}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      ) : contacts.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-[rgb(var(--color-surface))]">
          <Mail className="mx-auto text-[rgb(var(--color-accent-light))]" size={36} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No contact messages received yet</h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Submissions from `/contact` will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <Card key={c.id} className="p-6 space-y-3 bg-[rgb(var(--color-surface))]">
              <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3">
                <span className="font-bold text-base text-[rgb(var(--color-text))]">{c.name} ({c.email})</span>
                <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">{formatDate(c.createdAt, 'en')}</span>
              </div>
              <p className="text-xs text-[rgb(var(--color-text-muted))] whitespace-pre-wrap">{c.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
