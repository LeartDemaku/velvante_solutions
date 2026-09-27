'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, Loader2, Sparkles, User, Briefcase, Globe, CheckCircle } from 'lucide-react';
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

  async function handleStatusChange(type: 'contact' | 'inquiry', id: string, newStatus: string) {
    if (type === 'contact') {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    } else {
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    }

    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
    } catch {
      fetchLeads();
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-[rgb(var(--color-border))] pb-6">
        <h1 className="text-2xl font-black text-[rgb(var(--color-text))] tracking-tight">Leads & Inquiries CRM</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">Real-time incoming submissions from contact forms and the 8-step project wizard.</p>
      </div>

      <div className="flex gap-4 border-b border-[rgb(var(--color-border))]">
        <button
          onClick={() => setTab('inquiries')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            tab === 'inquiries'
              ? 'border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-light))]'
              : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
          }`}
        >
          Project Scoping Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            tab === 'contacts'
              ? 'border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-light))]'
              : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
          }`}
        >
          Direct Contact Submissions ({contacts.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : tab === 'inquiries' ? (
        inquiries.length === 0 ? (
          <Card className="p-16 text-center space-y-4 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
            <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={42} />
            <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No project inquiries yet</h2>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">Submissions from `/start-project` will automatically populate here.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <Card key={inq.id} className="p-6 space-y-4 bg-[rgb(var(--color-surface)/0.8)] border-[rgb(var(--color-border))]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[rgb(var(--color-text))]">
                      {inq.firstName} {inq.lastName}
                    </h3>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] font-mono">
                      {inq.company ? `${inq.company} • ` : ''}{inq.projectType}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange('inquiry', inq.id, e.target.value)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] font-mono focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {formatDate(inq.createdAt, 'en')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] block font-mono">Email Address:</span>
                    <a href={`mailto:${inq.email}`} className="text-[rgb(var(--color-accent-light))] font-semibold hover:underline">
                      {inq.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] block font-mono">Phone:</span>
                    <span className="text-[rgb(var(--color-text))] font-mono">{inq.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] block font-mono">Selected Services:</span>
                    <span className="text-[rgb(var(--color-text))]">
                      {Array.isArray(inq.services) ? inq.services.join(', ') : 'General'}
                    </span>
                  </div>
                </div>

                {inq.description && (
                  <div className="p-4 rounded-xl bg-[rgb(var(--color-surface-elevated)/0.5)] border border-[rgb(var(--color-border)/0.5)] text-xs text-[rgb(var(--color-text-muted))] whitespace-pre-wrap leading-relaxed">
                    {inq.description}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      ) : contacts.length === 0 ? (
        <Card className="p-16 text-center space-y-4 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
          <Mail className="mx-auto text-[rgb(var(--color-accent-light))]" size={42} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No contact messages received yet</h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Submissions from `/contact` will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <Card key={c.id} className="p-6 space-y-3 bg-[rgb(var(--color-surface)/0.8)] border-[rgb(var(--color-border))]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgb(var(--color-border))] pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[rgb(var(--color-text))]">
                    {c.name}
                  </h3>
                  <a href={`mailto:${c.email}`} className="text-xs font-mono text-[rgb(var(--color-accent-light))] hover:underline">
                    {c.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange('contact', c.id, e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] font-mono focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <span className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                    {formatDate(c.createdAt, 'en')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {c.service && (
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] font-mono">Service: </span>
                    <span className="text-[rgb(var(--color-text))]">{c.service}</span>
                  </div>
                )}
                {c.phone && (
                  <div>
                    <span className="text-[rgb(var(--color-text-subtle))] font-mono">Phone: </span>
                    <span className="text-[rgb(var(--color-text))] font-mono">{c.phone}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[rgb(var(--color-surface-elevated)/0.5)] border border-[rgb(var(--color-border)/0.5)] text-xs text-[rgb(var(--color-text-muted))] whitespace-pre-wrap leading-relaxed">
                {c.message}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
