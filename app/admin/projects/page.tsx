'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Globe, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  year: number;
  category: string;
  titleEn: string;
  clientEn: string;
  titleSq: string;
  clientSq: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    slug: '',
    titleEn: '',
    clientEn: '',
    taglineEn: '',
    challengeEn: '',
    solutionEn: '',
    resultsEn: '',
    titleSq: '',
    clientSq: '',
    taglineSq: '',
    technologies: 'Next.js, TypeScript, Tailwind CSS',
    year: '2024',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin projects:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          technologies: form.technologies.split(',').map((t) => t.trim()),
          year: parseInt(form.year, 10),
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setForm({
          slug: '',
          titleEn: '',
          clientEn: '',
          taglineEn: '',
          challengeEn: '',
          solutionEn: '',
          resultsEn: '',
          titleSq: '',
          clientSq: '',
          taglineSq: '',
          technologies: 'Next.js, TypeScript, Tailwind CSS',
          year: '2024',
          coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        });
        fetchProjects();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || 'Failed to create project. Please verify the inputs.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to save project.');
      console.error('Failed to create project:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Manage Projects / Portfolio</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Add completed client work, case studies, and technologies.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} leftIcon={<Plus size={16} />}>
          Add New Project
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-[rgb(var(--color-surface))]">
          <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={36} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No projects added yet</h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))] max-w-sm mx-auto">Click &quot;Add New Project&quot; above to create your first portfolio case study.</p>
          <Button onClick={() => setModalOpen(true)} size="sm" leftIcon={<Plus size={14} />}>
            Add Project Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-44 bg-[rgb(var(--color-surface-elevated))] relative">
                  <img src={proj.coverImage} alt={proj.titleEn} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant={proj.published ? 'success' : 'muted'}>
                      {proj.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))]">{proj.titleEn}</h3>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">{proj.clientEn} • {proj.year}</p>

                  <div className="flex flex-wrap gap-1 pt-2">
                    {proj.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-subtle))]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[rgb(var(--color-accent-light))]">/{proj.slug}</span>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  aria-label="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Project" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-sm)]">
              {errorMsg}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Title (EN)"
              placeholder="e.g. Meridian Finance Platform"
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
              label="Project Title (SQ - Albanian)"
              placeholder="e.g. Platforma Financiare Meridian"
              value={form.titleSq}
              onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL Slug"
              placeholder="meridian-finance-platform"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <Input
              label="Client Name"
              placeholder="Meridian Capital"
              value={form.clientEn}
              onChange={(e) => setForm((f) => ({ ...f, clientEn: e.target.value }))}
            />
          </div>

          <Input
            label="Tagline / Short Summary"
            placeholder="Next-generation enterprise financial analytics portal"
            value={form.taglineEn}
            onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Technologies (comma separated)"
              placeholder="Next.js, TypeScript, PostgreSQL, Tailwind"
              value={form.technologies}
              onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
            />
            <Input
              label="Year Completed"
              placeholder="2024"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            />
          </div>

          <Input
            label="Cover Image URL"
            placeholder="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
            value={form.coverImage}
            onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
          />

          <Textarea
            label="Challenge"
            placeholder="Describe the problem the client was facing..."
            rows={3}
            value={form.challengeEn}
            onChange={(e) => setForm((f) => ({ ...f, challengeEn: e.target.value }))}
          />

          <Textarea
            label="Solution & Results"
            placeholder="Describe the architecture built and results delivered..."
            rows={3}
            value={form.solutionEn}
            onChange={(e) => setForm((f) => ({ ...f, solutionEn: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save & Publish Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
