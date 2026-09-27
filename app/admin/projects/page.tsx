'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Trash2, Edit3, Eye, EyeOff, Star, ExternalLink,
  Sparkles, Loader2, Search, Filter, AlertCircle, CheckCircle2
} from 'lucide-react';

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  year: number;
  category: string;
  categorySlug: string;
  titleEn: string;
  clientEn: string;
  industryEn: string;
  taglineEn: string;
  challengeEn: string;
  solutionEn: string;
  resultsEn: string;
  titleSq: string;
  clientSq: string;
  industrySq: string;
  taglineSq: string;
  challengeSq: string;
  solutionSq: string;
  resultsSq: string;
}

const emptyForm = {
  id: '',
  slug: '',
  titleEn: '',
  clientEn: '',
  industryEn: 'Technology',
  taglineEn: '',
  challengeEn: '',
  solutionEn: '',
  resultsEn: '',
  titleSq: '',
  clientSq: '',
  industrySq: 'Teknologji',
  taglineSq: '',
  challengeSq: '',
  solutionSq: '',
  resultsSq: '',
  categorySlug: 'websites',
  technologies: 'Next.js, TypeScript, Tailwind CSS',
  year: '2025',
  coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  published: true,
  featured: false,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
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

  function handleOpenEdit(proj: ProjectItem) {
    setIsEditing(true);
    setForm({
      id: proj.id,
      slug: proj.slug,
      titleEn: proj.titleEn,
      clientEn: proj.clientEn,
      industryEn: proj.industryEn || 'Technology',
      taglineEn: proj.taglineEn || '',
      challengeEn: proj.challengeEn || '',
      solutionEn: proj.solutionEn || '',
      resultsEn: proj.resultsEn || '',
      titleSq: proj.titleSq || '',
      clientSq: proj.clientSq || '',
      industrySq: proj.industrySq || 'Teknologji',
      taglineSq: proj.taglineSq || '',
      challengeSq: proj.challengeSq || '',
      solutionSq: proj.solutionSq || '',
      resultsSq: proj.resultsSq || '',
      categorySlug: proj.categorySlug || 'websites',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      year: String(proj.year || 2025),
      coverImage: proj.coverImage,
      published: proj.published,
      featured: proj.featured,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
      year: parseInt(form.year, 10) || new Date().getFullYear(),
    };

    try {
      const url = isEditing ? `/api/admin/projects/${form.id}` : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok) {
        setSuccessMsg(isEditing ? 'Project updated successfully.' : 'Project created successfully.');
        setTimeout(() => {
          setModalOpen(false);
          fetchProjects();
        }, 800);
      } else {
        setErrorMsg(resData.error?.message || 'Failed to save project. Please check required fields.');
      }
    } catch {
      setErrorMsg('Network error occurred while saving project.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  }

  async function handleTogglePublished(proj: ProjectItem) {
    const updatedStatus = !proj.published;
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, published: updatedStatus } : p))
    );

    try {
      await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: updatedStatus }),
      });
    } catch {
      fetchProjects();
    }
  }

  async function handleToggleFeatured(proj: ProjectItem) {
    const updatedFeatured = !proj.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, featured: updatedFeatured } : p))
    );

    try {
      await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: updatedFeatured }),
      });
    } catch {
      fetchProjects();
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleSq.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = activeCategory === 'all' || p.categorySlug === activeCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[rgb(var(--color-text))] tracking-tight">
            Manage Projects & Case Studies
          </h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
            Create, edit, toggle visibility, and maintain bilingual portfolio case studies.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus size={16} />}>
          Add New Project
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="Search projects by title, client, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-accent))]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'websites', label: 'Websites' },
            { id: 'web-applications', label: 'Web Apps' },
            { id: 'ecommerce', label: 'E-Commerce' },
            { id: 'custom-software', label: 'Custom Software' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[rgb(var(--color-accent))] text-white shadow-sm'
                  : 'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={36} />
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Loading database records...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-16 text-center space-y-4 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
          <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={42} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No projects found</h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))] max-w-sm mx-auto">
            {searchTerm || activeCategory !== 'all'
              ? 'Try adjusting your search criteria or category filter.'
              : 'Add your first portfolio project to showcase on the public platform.'}
          </p>
          <Button onClick={handleOpenCreate} size="sm" leftIcon={<Plus size={14} />}>
            Add Project Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Card
              key={proj.id}
              className="overflow-hidden flex flex-col justify-between bg-[rgb(var(--color-surface)/0.8)] border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-border-hover))] transition-all group"
            >
              <div>
                <div className="h-48 bg-[rgb(var(--color-surface-elevated))] relative overflow-hidden">
                  <img
                    src={proj.coverImage}
                    alt={proj.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleFeatured(proj)}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        proj.featured
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-black/60 text-zinc-400 hover:text-white'
                      }`}
                      title={proj.featured ? 'Featured on Homepage' : 'Mark as Featured'}
                    >
                      <Star size={14} fill={proj.featured ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      onClick={() => handleTogglePublished(proj)}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        proj.published
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
                      }`}
                      title={proj.published ? 'Published Live' : 'Draft Only'}
                    >
                      {proj.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                    <span className="font-mono text-[11px] font-semibold">{proj.clientEn}</span>
                    <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded text-zinc-400">
                      {proj.year}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors">
                      {proj.titleEn}
                    </h3>
                    {proj.titleSq && proj.titleSq !== proj.titleEn && (
                      <p className="text-xs text-[rgb(var(--color-text-subtle))] font-medium mt-0.5">
                        AL: {proj.titleSq}
                      </p>
                    )}
                  </div>

                  {proj.taglineEn && (
                    <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2 leading-relaxed">
                      {proj.taglineEn}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(Array.isArray(proj.technologies) ? proj.technologies : []).slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-text-muted))] border border-[rgb(var(--color-border)/0.5)]"
                      >
                        {tech}
                      </span>
                    ))}
                    {(Array.isArray(proj.technologies) ? proj.technologies.length : 0) > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-[rgb(var(--color-text-subtle))]">
                        +{proj.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between bg-[rgb(var(--color-surface-elevated)/0.3)]">
                <Link
                  href={`/en/projects/${proj.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-accent-light))] hover:underline"
                >
                  <span>/{proj.slug}</span>
                  <ExternalLink size={12} />
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg text-[rgb(var(--color-text-muted))] hover:text-white hover:bg-[rgb(var(--color-surface-elevated))] transition-colors"
                    title="Edit project details"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {deleteConfirmId && (
        <Modal
          open={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Project Deletion"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[rgb(var(--color-text-muted))] leading-relaxed">
              Are you sure you want to remove this project? It will be archived and hidden from both English and Albanian portfolio listings.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-[rgb(var(--color-border))]">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? `Edit Project: ${form.titleEn}` : 'Add New Portfolio Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
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

          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-accent-light))]">
              1. Basic Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Project Title (English)"
                placeholder="e.g. Meridian Financial Dashboard"
                required
                value={form.titleEn}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((f) => ({
                    ...f,
                    titleEn: val,
                    slug: isEditing
                      ? f.slug
                      : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                  }));
                }}
              />
              <Input
                label="Project Title (Albanian - Shqip)"
                placeholder="e.g. Paneli Financiar Meridian"
                value={form.titleSq}
                onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="URL Slug (Permanent link)"
                placeholder="meridian-financial-dashboard"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-text))] mb-1.5">
                  Category
                </label>
                <select
                  value={form.categorySlug}
                  onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-accent))]"
                >
                  <option value="websites">Websites / Corporate</option>
                  <option value="web-applications">Web Applications (SaaS)</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="custom-software">Custom Software & APIs</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-[rgb(var(--color-border))]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-accent-light))]">
              2. Client & Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Client Name"
                placeholder="e.g. Meridian Group"
                value={form.clientEn}
                onChange={(e) => setForm((f) => ({ ...f, clientEn: e.target.value, clientSq: f.clientSq || e.target.value }))}
              />
              <Input
                label="Industry"
                placeholder="e.g. Fintech, Healthcare"
                value={form.industryEn}
                onChange={(e) => setForm((f) => ({ ...f, industryEn: e.target.value }))}
              />
              <Input
                label="Year Completed"
                placeholder="2025"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />
            </div>

            <Input
              label="Technologies (comma separated tags)"
              placeholder="Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma"
              value={form.technologies}
              onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
            />

            <div>
              <Input
                label="Cover Image URL"
                placeholder="https://images.unsplash.com/photo-..."
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
              />
              {form.coverImage && (
                <div className="mt-2 h-28 w-full rounded-xl overflow-hidden bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))]">
                  <img
                    src={form.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-[rgb(var(--color-border))]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-accent-light))]">
              3. Case Study Story (EN & SQ)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tagline (English)"
                placeholder="High-frequency financial reporting platform"
                value={form.taglineEn}
                onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))}
              />
              <Input
                label="Tagline (Albanian)"
                placeholder="Platformë raportimi financiar me shpejtësi të lartë"
                value={form.taglineSq}
                onChange={(e) => setForm((f) => ({ ...f, taglineSq: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="The Challenge (English)"
                placeholder="What bottlenecks or issues was the client facing?"
                rows={3}
                value={form.challengeEn}
                onChange={(e) => setForm((f) => ({ ...f, challengeEn: e.target.value }))}
              />
              <Textarea
                label="The Challenge (Albanian)"
                placeholder="Me çfarë problemesh po përballej klienti?"
                rows={3}
                value={form.challengeSq}
                onChange={(e) => setForm((f) => ({ ...f, challengeSq: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="The Solution (English)"
                placeholder="How did Velvante Solutions engineer the digital system?"
                rows={3}
                value={form.solutionEn}
                onChange={(e) => setForm((f) => ({ ...f, solutionEn: e.target.value }))}
              />
              <Textarea
                label="The Solution (Albanian)"
                placeholder="Si e inxhinieroi ekipi ynë zgjidhjen?"
                rows={3}
                value={form.solutionSq}
                onChange={(e) => setForm((f) => ({ ...f, solutionSq: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Measurable Results (English)"
                placeholder="e.g. +140% user engagement, 80% query speedup"
                value={form.resultsEn}
                onChange={(e) => setForm((f) => ({ ...f, resultsEn: e.target.value }))}
              />
              <Input
                label="Measurable Results (Albanian)"
                placeholder="e.g. +140% angazhim përdoruesish, 80% shpejtësi"
                value={form.resultsSq}
                onChange={(e) => setForm((f) => ({ ...f, resultsSq: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[rgb(var(--color-text))]">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-0"
                />
                <span>Published (Live)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[rgb(var(--color-text))]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-0"
                />
                <span>Featured (Homepage)</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                {isEditing ? 'Save Changes' : 'Create Project'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
