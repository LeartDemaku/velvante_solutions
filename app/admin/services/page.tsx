'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Eye, EyeOff, Wrench, Loader2, Sparkles, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';

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

const emptyForm = {
  id: '',
  slug: '',
  icon: 'Code2',
  titleEn: '',
  shortDescEn: '',
  titleSq: '',
  shortDescSq: '',
  published: true,
  featured: true,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setIsEditing(false);
    setForm(emptyForm);
    setErrorMsg('');
    setSuccessMsg('');
    setModalOpen(true);
  }

  function handleOpenEdit(svc: ServiceItem) {
    setIsEditing(true);
    setErrorMsg('');
    setSuccessMsg('');
    setForm({
      id: svc.id,
      slug: svc.slug,
      icon: svc.icon || 'Code2',
      titleEn: svc.titleEn,
      shortDescEn: svc.shortDescEn,
      titleSq: svc.titleSq || '',
      shortDescSq: svc.shortDescSq || '',
      published: svc.published,
      featured: svc.featured,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const url = isEditing ? `/api/admin/services/${form.id}` : '/api/admin/services';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(isEditing ? 'Service updated successfully.' : 'Service created successfully.');
        setTimeout(() => {
          setModalOpen(false);
          fetchServices();
        }, 800);
      } else {
        setErrorMsg(data.error?.message || 'Failed to save service.');
      }
    } catch {
      setErrorMsg('Network error while saving service.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePublished(svc: ServiceItem) {
    const updated = !svc.published;
    setServices((prev) => prev.map((s) => (s.id === svc.id ? { ...s, published: updated } : s)));
    try {
      await fetch(`/api/admin/services/${svc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: updated }),
      });
    } catch {
      fetchServices();
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[rgb(var(--color-text))] tracking-tight">Manage Services</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">Configure service offerings, icons, and localized descriptions.</p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus size={16} />}>
          Add New Service
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : services.length === 0 ? (
        <Card className="p-16 text-center space-y-4 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
          <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={42} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No services found</h2>
          <Button onClick={handleOpenCreate} size="sm" leftIcon={<Plus size={14} />}>
            Add Service Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <Card
              key={svc.id}
              className="p-5 flex flex-col justify-between space-y-4 bg-[rgb(var(--color-surface)/0.8)] border-[rgb(var(--color-border))]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-accent)/0.15)] text-[rgb(var(--color-accent-light))] flex items-center justify-center font-bold font-mono">
                    <Wrench size={18} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublished(svc)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        svc.published
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                      title={svc.published ? 'Published Live' : 'Draft Only'}
                    >
                      {svc.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <Badge variant={svc.published ? 'success' : 'muted'}>
                      {svc.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))]">{svc.titleEn}</h3>
                  {svc.titleSq && svc.titleSq !== svc.titleEn && (
                    <p className="text-xs text-[rgb(var(--color-text-subtle))] font-medium mt-0.5">
                      AL: {svc.titleSq}
                    </p>
                  )}
                  <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2 mt-2 leading-relaxed">
                    {svc.shortDescEn}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
                <Link
                  href={`/en/services/${svc.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-accent-light))] hover:underline"
                >
                  <span>/{svc.slug}</span>
                  <ExternalLink size={12} />
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-1.5 rounded-lg text-[rgb(var(--color-text-muted))] hover:text-white hover:bg-[rgb(var(--color-surface-elevated))] transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? `Edit Service: ${form.titleEn}` : 'Add New Service'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3.5 text-xs text-red-400 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Service Title (EN)"
              placeholder="e.g. Full-Stack Development"
              required
              value={form.titleEn}
              onChange={(e) => {
                const val = e.target.value;
                setForm((f) => ({
                  ...f,
                  titleEn: val,
                  slug: isEditing ? f.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                }));
              }}
            />
            <Input
              label="Service Title (SQ)"
              placeholder="e.g. Zhvillim Full-Stack"
              value={form.titleSq}
              onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
            />
          </div>

          <Input
            label="URL Slug"
            placeholder="fullstack-development"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />

          <Textarea
            label="Short Description (EN)"
            placeholder="Describe the service..."
            rows={3}
            value={form.shortDescEn}
            onChange={(e) => setForm((f) => ({ ...f, shortDescEn: e.target.value }))}
          />

          <Textarea
            label="Short Description (SQ)"
            placeholder="Përshkruani shërbimin..."
            rows={3}
            value={form.shortDescSq}
            onChange={(e) => setForm((f) => ({ ...f, shortDescSq: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-[rgb(var(--color-border))]">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {isEditing ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
