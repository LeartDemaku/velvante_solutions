'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import {
  Plus, Trash2, Edit3, Eye, EyeOff, Star, ExternalLink,
  Sparkles, Loader2, Search, AlertCircle, CheckCircle2,
  UploadCloud, Globe, Image as ImageIcon, X
} from 'lucide-react';

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string;
  liveUrl?: string;
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
  solutionEn: string;
  titleSq: string;
  clientSq: string;
  industrySq: string;
  taglineSq: string;
  solutionSq: string;
}

const emptyForm = {
  id: '',
  slug: '',
  titleEn: '',
  clientEn: '',
  industryEn: 'Technology',
  taglineEn: '',
  solutionEn: '',
  titleSq: '',
  clientSq: '',
  industrySq: 'Teknologji',
  taglineSq: '',
  solutionSq: '',
  categorySlug: 'websites',
  technologies: 'Next.js, TypeScript, Tailwind CSS',
  year: '2025',
  coverImage: '',
  liveUrl: '',
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showManualUrl, setShowManualUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
    setUploadError('');
    setShowManualUrl(false);
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
      solutionEn: proj.solutionEn || '',
      titleSq: proj.titleSq || '',
      clientSq: proj.clientSq || '',
      industrySq: proj.industrySq || 'Teknologji',
      taglineSq: proj.taglineSq || '',
      solutionSq: proj.solutionSq || '',
      categorySlug: proj.categorySlug || 'websites',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      year: String(proj.year || 2025),
      coverImage: proj.coverImage || '',
      liveUrl: proj.liveUrl || '',
      published: proj.published,
      featured: proj.featured,
    });
    setErrorMsg('');
    setSuccessMsg('');
    setUploadError('');
    setShowManualUrl(Boolean(proj.coverImage && !proj.coverImage.startsWith('/uploads/')));
    setModalOpen(true);
  }

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      setUploadError('Ju lutem ngarkoni vetëm skedarë fotografie (PNG, JPG, WebP).');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.data?.url) {
        setForm((prev) => ({ ...prev, coverImage: data.data.url }));
      } else {
        setUploadError(data.error?.message || 'Dështoi ngarkimi i fotos.');
      }
    } catch {
      setUploadError('Ndodhi një gabim me rrjetin gjatë ngarkimit të fotos.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
        setSuccessMsg(isEditing ? 'Projekti u përditësua me sukses.' : 'Projekti u krijua me sukses.');
        setTimeout(() => {
          setModalOpen(false);
          fetchProjects();
        }, 800);
      } else {
        setErrorMsg(resData.error?.message || 'Dështoi ruajtja e projektit. Kontrolloni fushat e kërkuara.');
      }
    } catch {
      setErrorMsg('Ndodhi një problem me lidhjen gjatë ruajtjes.');
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
            Menaxhimi i Projekteve & Portfolio
          </h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
            Krijoni, modifikoni dhe kontrolloni projektet e prezantuara në faqen publike.
          </p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus size={16} />}>
          Shto Projekt të Ri
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="Kërko projekte sipas titullit, klientit, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-accent))]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'Të Gjitha' },
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
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Po ngarkohen të dhënat e projekteve...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-16 text-center space-y-4 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
          <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={42} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">Nuk u gjet asnjë projekt</h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))] max-w-sm mx-auto">
            {searchTerm || activeCategory !== 'all'
              ? 'Provoni të rregulloni filtrin ose termin e kërkimit.'
              : 'Shtoni projektin e parë në portofol për t’u shfaqur në uebsajt.'}
          </p>
          <Button onClick={handleOpenCreate} size="sm" leftIcon={<Plus size={14} />}>
            Shto Projekt Tani
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
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-950/80 border-b border-[rgb(var(--color-border))] flex items-center justify-center p-2 sm:p-2.5">
                  {proj.coverImage ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 pointer-events-none scale-110"
                        style={{ backgroundImage: `url(${proj.coverImage})` }}
                      />
                      <img
                        src={proj.coverImage}
                        alt={proj.titleEn}
                        className="relative z-10 w-full h-full object-contain rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[rgb(var(--color-text-muted))] bg-zinc-900/60 rounded-xl">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                      {proj.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
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

                  <div className="absolute bottom-2.5 left-3 right-3 z-20 flex items-center justify-between text-xs text-zinc-300 pointer-events-none">
                    <span className="font-mono text-[11px] font-semibold bg-black/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">{proj.clientEn}</span>
                    <span className="font-mono text-[11px] bg-black/70 px-2 py-0.5 rounded text-zinc-300 backdrop-blur-md border border-white/10">
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

              <div className="p-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between bg-[rgb(var(--color-surface-elevated)/0.3)] gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shrink-0"
                      title="Hap projektin live në dritare të re"
                    >
                      <Globe size={12} />
                      <span>Live Project</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : null}

                  <Link
                    href={`/en/projects/${proj.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-[11px] font-mono text-[rgb(var(--color-accent-light))] hover:underline truncate"
                  >
                    <span>/{proj.slug}</span>
                    <ExternalLink size={11} className="shrink-0" />
                  </Link>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg text-[rgb(var(--color-text-muted))] hover:text-white hover:bg-[rgb(var(--color-surface-elevated))] transition-colors"
                    title="Ndrysho të dhënat"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Fshij projektin"
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
          title="Konfirmo Fshirjen e Projektit"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[rgb(var(--color-text-muted))] leading-relaxed">
              Jeni të sigurt që dëshironi ta fshini këtë projekt? Ai do të fshihet nga listat e projekteve në uebsajt.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-[rgb(var(--color-border))]">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Anulo
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Konfirmo Fshirjen
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? `Modifiko Projektin: ${form.titleEn}` : 'Shto Projekt të Ri në Portofol'}
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
              1. Identifikimi Bazë
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Titulli i Projektit (Anglisht)"
                placeholder="p.sh. Meridian Financial Platform"
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
                label="Titulli i Projektit (Shqip)"
                placeholder="p.sh. Platforma Financiare Meridian"
                value={form.titleSq}
                onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="URL Slug (Linku unik)"
                placeholder="meridian-financial-platform"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-text))] mb-1.5">
                  Kategoria
                </label>
                <select
                  value={form.categorySlug}
                  onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-accent))]"
                >
                  <option value="websites">Websites / Korporative</option>
                  <option value="web-applications">Web Applications (SaaS)</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="custom-software">Custom Software & API</option>
                </select>
              </div>
            </div>

            <Input
              label="Linku i Projektit Live (URL)"
              placeholder="https://klienti-juaj.com"
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              leftIcon={<Globe size={15} />}
              hint="Linku direkt ku klienti apo vizitori mund ta hapë dhe shohë faqen/aplikacionin live."
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-[rgb(var(--color-border))]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-accent-light))]">
              2. Detajet & Ngarkimi i Fotos (Screenshot)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Emri i Klientit"
                placeholder="p.sh. Meridian Group"
                value={form.clientEn}
                onChange={(e) => setForm((f) => ({ ...f, clientEn: e.target.value, clientSq: f.clientSq || e.target.value }))}
              />
              <Input
                label="Industria"
                placeholder="p.sh. Fintech, Healthcare"
                value={form.industryEn}
                onChange={(e) => setForm((f) => ({ ...f, industryEn: e.target.value }))}
              />
              <Input
                label="Viti i Përfundimit"
                placeholder="2025"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />
            </div>

            <Input
              label="Teknologjitë e Përdorura (të ndara me presje)"
              placeholder="Next.js 15, TypeScript, Tailwind CSS, PostgreSQL, Prisma"
              value={form.technologies}
              onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
            />

            <div className="space-y-2">
              <label className="block text-xs font-medium text-[rgb(var(--color-text))]">
                Foto / Screenshot i Projektit
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {form.coverImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-[rgb(var(--color-border))] bg-zinc-950/90 group p-2">
                  <div className="relative w-full aspect-[16/10] overflow-hidden flex items-center justify-center bg-black/40 rounded-xl">
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 pointer-events-none scale-110"
                      style={{ backgroundImage: `url(${form.coverImage})` }}
                    />
                    <img
                      src={form.coverImage}
                      alt="Project Screenshot Preview"
                      className="relative z-10 w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-[rgb(var(--color-surface))] flex items-center justify-between border-t border-[rgb(var(--color-border))] text-xs">
                    <span className="font-mono text-[11px] text-[rgb(var(--color-text-muted))] truncate max-w-[220px]">
                      {form.coverImage}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        leftIcon={uploadingImage ? <Loader2 className="animate-spin" size={12} /> : <UploadCloud size={12} />}
                      >
                        Ndrysho Foton
                      </Button>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hiq foton"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="border-2 border-dashed border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-accent))] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-[rgb(var(--color-surface)/0.5)] hover:bg-[rgb(var(--color-surface))]"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-[rgb(var(--color-accent)/0.1)] text-[rgb(var(--color-accent-light))] flex items-center justify-center">
                      {uploadingImage ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <UploadCloud size={24} />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[rgb(var(--color-text))]">
                        {uploadingImage ? 'Po ngarkohet fotografia...' : 'Kliko ose tërhiq foton / screenshot këtu'}
                      </p>
                      <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
                        Mbështet PNG, JPG, WebP deri në 15MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
                  <AlertCircle size={13} />
                  <span>{uploadError}</span>
                </p>
              )}

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[11px] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-accent-light))] transition-colors"
                >
                  {showManualUrl ? 'Fshih linkun manual të fotos' : 'Ose vendos linkun e fotos manualisht (URL)'}
                </button>
              </div>

              {showManualUrl && (
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                />
              )}
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-[rgb(var(--color-border))]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[rgb(var(--color-accent-light))]">
              3. Përshkrimi & Zgjidhja e Projektit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tagline (Anglisht)"
                placeholder="High-frequency financial reporting platform"
                value={form.taglineEn}
                onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))}
              />
              <Input
                label="Tagline (Shqip)"
                placeholder="Platformë raportimi financiar me shpejtësi të lartë"
                value={form.taglineSq}
                onChange={(e) => setForm((f) => ({ ...f, taglineSq: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Zgjidhja / Përshkrimi i Projektit (Anglisht)"
                placeholder="Describe how the solution was engineered and delivered..."
                rows={3}
                value={form.solutionEn}
                onChange={(e) => setForm((f) => ({ ...f, solutionEn: e.target.value }))}
              />
              <Textarea
                label="Zgjidhja / Përshkrimi i Projektit (Shqip)"
                placeholder="Përshkruani se si u inxhinierua dhe u implementua zgjidhja..."
                rows={3}
                value={form.solutionSq}
                onChange={(e) => setForm((f) => ({ ...f, solutionSq: e.target.value }))}
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
                <span>Publikuar (Live)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[rgb(var(--color-text))]">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-accent))] focus:ring-0"
                />
                <span>Kryesor (Faqja Kryesore)</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
                Anulo
              </Button>
              <Button type="submit" loading={submitting}>
                {isEditing ? 'Ruaj Ndryshimet' : 'Krijo Projektin'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
