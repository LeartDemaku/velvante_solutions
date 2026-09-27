'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, FileText, Loader2, Sparkles, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BlogItem {
  id: string;
  slug: string;
  coverImage: string;
  status: string;
  readingTime: number;
  author: string;
  category: string;
  titleEn: string;
  excerptEn: string;
  titleSq?: string;
  excerptSq?: string;
}

const emptyForm = {
  id: '',
  slug: '',
  titleEn: '',
  excerptEn: '',
  contentEn: '',
  titleSq: '',
  excerptSq: '',
  contentSq: '',
  readingTime: '5',
  coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
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

  async function handleOpenEdit(post: BlogItem) {
    setIsEditing(true);
    setErrorMsg('');
    setSuccessMsg('');
    setForm({
      ...emptyForm,
      id: post.id,
      slug: post.slug,
      titleEn: post.titleEn,
      excerptEn: post.excerptEn,
      titleSq: post.titleSq || '',
      excerptSq: post.excerptSq || '',
      readingTime: String(post.readingTime || 5),
      coverImage: post.coverImage,
    });
    setModalOpen(true);

    try {
      const res = await fetch(`/api/admin/blog/${post.id}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setForm((prev) => ({
          ...prev,
          contentEn: data.data.contentEn || '',
          contentSq: data.data.contentSq || '',
        }));
      }
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const url = isEditing ? `/api/admin/blog/${form.id}` : '/api/admin/blog';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(isEditing ? 'Article updated successfully.' : 'Article published successfully.');
        setTimeout(() => {
          setModalOpen(false);
          fetchPosts();
        }, 800);
      } else {
        setErrorMsg(data.error?.message || 'Failed to save blog post.');
      }
    } catch {
      setErrorMsg('Network error while saving article.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgb(var(--color-border))] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[rgb(var(--color-text))] tracking-tight">Manage Blog Posts</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">Create, edit, and publish technical insights.</p>
        </div>
        <Button onClick={handleOpenCreate} leftIcon={<Plus size={16} />}>
          Write New Article
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-16 text-center space-y-4 bg-[rgb(var(--color-surface))]">
          <Sparkles className="mx-auto text-[rgb(var(--color-accent-light))]" size={42} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No blog posts found</h2>
          <Button onClick={handleOpenCreate} size="sm" leftIcon={<Plus size={14} />}>
            Create Post Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col justify-between bg-[rgb(var(--color-surface)/0.8)] border-[rgb(var(--color-border))]">
              <div>
                <div className="h-44 bg-[rgb(var(--color-surface-elevated))] relative overflow-hidden">
                  <img src={post.coverImage} alt={post.titleEn} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="success">{post.status}</Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))]">{post.titleEn}</h3>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    By {post.author} • {post.readingTime} min read
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2 mt-2 leading-relaxed">
                    {post.excerptEn}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between bg-[rgb(var(--color-surface-elevated)/0.3)]">
                <Link
                  href={`/en/blog/${post.slug}`}
                  target="_blank"
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-accent-light))] hover:underline"
                >
                  <span>/{post.slug}</span>
                  <ExternalLink size={12} />
                </Link>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-1.5 rounded-lg text-[rgb(var(--color-text-muted))] hover:text-white hover:bg-[rgb(var(--color-surface-elevated))] transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isEditing ? `Edit Article: ${form.titleEn}` : 'Write New Article'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
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
              label="Article Title (English)"
              placeholder="e.g. Scaling Next.js in 2026"
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
              label="Article Title (Albanian)"
              placeholder="e.g. Shkallëzimi i Next.js në 2026"
              value={form.titleSq}
              onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL Slug"
              placeholder="scaling-nextjs-2026"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            />
            <Input
              label="Estimated Reading Time (Minutes)"
              placeholder="5"
              value={form.readingTime}
              onChange={(e) => setForm((f) => ({ ...f, readingTime: e.target.value }))}
            />
          </div>

          <Input
            label="Cover Image URL"
            placeholder="https://images.unsplash.com/..."
            value={form.coverImage}
            onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Excerpt (English)"
              rows={2}
              placeholder="Brief summary..."
              value={form.excerptEn}
              onChange={(e) => setForm((f) => ({ ...f, excerptEn: e.target.value }))}
            />
            <Textarea
              label="Excerpt (Albanian)"
              rows={2}
              placeholder="Përmbledhje e shkurtër..."
              value={form.excerptSq}
              onChange={(e) => setForm((f) => ({ ...f, excerptSq: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Content (English)"
              rows={5}
              placeholder="Full article content..."
              value={form.contentEn}
              onChange={(e) => setForm((f) => ({ ...f, contentEn: e.target.value }))}
            />
            <Textarea
              label="Content (Albanian)"
              rows={5}
              placeholder="Përmbajtja e artikullit..."
              value={form.contentSq}
              onChange={(e) => setForm((f) => ({ ...f, contentSq: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[rgb(var(--color-border))]">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {isEditing ? 'Save Changes' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
