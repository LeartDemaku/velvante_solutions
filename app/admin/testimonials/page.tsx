'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Plus, Star, MessageSquare, Loader2 } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  translations: { locale: string; quote: string }[];
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    quoteEn: '',
    quoteSq: '',
    rating: '5',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (res.ok && data.data) {
        setTestimonials(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalOpen(false);
        setForm({ name: '', role: '', company: '', quoteEn: '', quoteSq: '', rating: '5' });
        fetchTestimonials();
      }
    } catch (err) {
      console.error('Failed to create testimonial:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">Manage Testimonials</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Client feedback and reviews.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} leftIcon={<Plus size={16} />}>
          Add Testimonial
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center text-[rgb(var(--color-accent-light))]">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-[rgb(var(--color-surface))]">
          <MessageSquare className="mx-auto text-[rgb(var(--color-accent-light))]" size={36} />
          <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">No testimonials found</h2>
          <Button onClick={() => setModalOpen(true)} size="sm" leftIcon={<Plus size={14} />}>
            Add Testimonial Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => {
            const quoteEn = item.translations?.find((t) => t.locale === 'en')?.quote || '';
            return (
              <Card key={item.id} className="p-6 space-y-3 bg-[rgb(var(--color-surface))]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[rgb(var(--color-text))]">{item.name}</h3>
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">{item.role} at {item.company}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[rgb(var(--color-text-muted))] italic">&ldquo;{quoteEn}&rdquo;</p>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Testimonial">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Client Name"
            placeholder="e.g. Elena Hoxha"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Role"
              placeholder="CTO"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
            <Input
              label="Company"
              placeholder="TechCorp"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </div>
          <Textarea
            label="Quote / Feedback (EN)"
            placeholder="Velvante Solutions transformed our web architecture..."
            required
            rows={3}
            value={form.quoteEn}
            onChange={(e) => setForm((f) => ({ ...f, quoteEn: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Testimonial
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

