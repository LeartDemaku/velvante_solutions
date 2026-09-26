'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';

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
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    slug: '',
    titleEn: '',
    excerptEn: '',
    contentEn: '',
    titleSq: '',
    excerptSq: '',
    contentSq: '',
    readingTime: '5',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      if (res.ok && data.data) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalOpen(false);
        setForm({
          slug: '',
          titleEn: '',
          excerptEn: '',
          contentEn: '',
          titleSq: '',
          excerptSq: '',
          contentSq: '',
          readingTime: '5',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        });
        fetchPosts();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || 'Failed to create blog post. Please verify all inputs.');
      }
    } catch (err) {
      setErrorMsg('Network error. Failed to save blog post.');
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Manage Blog Posts</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Create, publish, and edit articles.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} leftIcon={<Plus size={16} />}>
          Write New Article
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-[rgb(var(--color-surface))]">
          <FileText className="mx-auto text-[rgb(var(--color-accent-light))]" size={36} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No blog posts found</h2>
          <Button onClick={() => setModalOpen(true)} size="sm" leftIcon={<Plus size={14} />}>
            Create Post Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-44 bg-[rgb(var(--color-surface-elevated))] relative">
                  <img src={post.coverImage} alt={post.titleEn} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="success">{post.status}</Badge>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[rgb(var(--color-text))]">{post.titleEn}</h3>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">By {post.author} • {post.readingTime} min read</p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))] line-clamp-2 mt-2">{post.excerptEn}</p>
                </div>
              </div>

              <div className="p-4 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[rgb(var(--color-accent-light))]">/{post.slug}</span>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Write New Article" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-sm)]">
              {errorMsg}
            </div>
          )}
          <Input
            label="Article Title (EN)"
            placeholder="e.g. Building Scalable Web Architecture in 2025"
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
            label="Article Title (SQ - Albanian)"
            placeholder="e.g. Ndërtimi i Arkitekturës Web të Shkallëzueshme në 2025"
            value={form.titleSq}
            onChange={(e) => setForm((f) => ({ ...f, titleSq: e.target.value }))}
          />
          <Input
            label="URL Slug"
            placeholder="building-scalable-web-architecture"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          />
          <Textarea
            label="Excerpt / Summary (EN)"
            placeholder="A technical guide on building web applications for high performance..."
            rows={2}
            value={form.excerptEn}
            onChange={(e) => setForm((f) => ({ ...f, excerptEn: e.target.value }))}
          />
          <Textarea
            label="Full Article Content (EN)"
            placeholder="Write markdown or text content..."
            rows={5}
            value={form.contentEn}
            onChange={(e) => setForm((f) => ({ ...f, contentEn: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Publish Article
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
