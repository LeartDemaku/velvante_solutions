'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Wrench, Loader2, Sparkles } from 'lucide-react';

interface ServiceItem {
  id: string;
  slug: string;
  icon: string;
  published: boolean;
  featured: boolean;
  titleEn: string;
  shortDescEn: string;
  titleSq: string;
  shortDescSq: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    titleEn: '',
    shortDescEn: '',
    titleSq: '',
    shortDescSq: '',
    icon: 'Code2',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (res.ok && data.data) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalOpen(false);
        setForm({ slug: '', titleEn: '', shortDescEn: '', titleSq: '', shortDescSq: '', icon: 'Code2' });
        fetchServices();
      }
    } catch (err) {
      console.error('Failed to create service:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Manage Services</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Add and edit corporate digital services.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} leftIcon={<Plus size={16} />}>
          Add New Service
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : services.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-[rgb(var(--color-surface))]">
          <Wrench className="mx-auto text-[rgb(var(--color-accent-light))]" size={36} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No services found</h2>
          <Button onClick={() => setModalOpen(true)} size="sm" leftIcon={<Plus size={14} />}>
            Add Service Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <Card key={svc.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[rgb(var(--color-accent)/0.1)] text-[rgb(var(--color-accent-light))] flex items-center justify-center font-bold font-mono">
                    {svc.icon[0]}
                  </div>
                  <Badge variant={svc.published ? 'success' : 'muted'}>
                    {svc.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-[rgb(var(--color-text))]">{svc.titleEn}</h3>
                <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2">{svc.shortDescEn}</p>
              </div>

              <div className="pt-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[rgb(var(--color-accent-light))]">/{svc.slug}</span>
                <button
                  onClick={() => handleDelete(svc.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Service">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Service Title (EN)"
            placeholder="e.g. Web Design & Branding"
            required
            value={form.titleEn}
            onChange={(e) => {
              const val = e.target.value;
              setForm((f) => ({
                ...f,
                titleEn: val,
                slug: f.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              }));
            }}
          />
          <Input
            label="Service Title (SQ - Albanian)"
            placeholder="e.g. Dizajn Web dhe Markimi"
            value={form.titleSq}
            onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
          />
          <Input
            label="URL Slug"
            placeholder="web-design"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <Textarea
            label="Short Description (EN)"
            placeholder="Premium conversion-focused web design..."
            rows={3}
            value={form.shortDescEn}
            onChange={(e) => setForm((f) => ({ ...f, shortDescEn: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
