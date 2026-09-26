'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const tContact = useTranslations('contact');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    botCheck: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const serviceOptions = [
    { value: 'Web Design', label: locale === 'sq' ? 'Dizajn Uebi' : 'Web Design' },
    { value: 'Full-Stack Development', label: locale === 'sq' ? 'Zhvillim Full-Stack' : 'Full-Stack Development' },
    { value: 'E-Commerce Development', label: locale === 'sq' ? 'Zhvillim E-Commerce' : 'E-Commerce Development' },
    { value: 'Web Applications', label: locale === 'sq' ? 'Aplikacione Web' : 'Web Applications' },
    { value: 'UI/UX Design', label: locale === 'sq' ? 'Dizajn UI/UX' : 'UI/UX Design' },
    { value: 'Backend & APIs', label: locale === 'sq' ? 'Backend & API' : 'Backend & APIs' },
    { value: 'SEO & Performance', label: locale === 'sq' ? 'SEO & Performancë' : 'SEO & Performance' },
    { value: 'AI & Automation', label: locale === 'sq' ? 'AI & Automatizim' : 'AI & Automation' },
    { value: 'Security', label: locale === 'sq' ? 'Siguri Dixhitale' : 'Security' },
    { value: 'Maintenance & Support', label: locale === 'sq' ? 'Mirëmbajtje & Mbështetje' : 'Maintenance & Support' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', company: '', email: '', phone: '', service: '', message: '', botCheck: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error?.message || tContact('form.error.description'));
      }
    } catch {
      setStatus('error');
      setErrorMessage(tContact('form.error.description'));
    }
  }

  return (
    <div className="relative bg-[rgb(var(--color-background))] min-h-screen">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-[35%] -left-20 w-[550px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[450px] bg-indigo-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 space-y-16 container-velvante relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="accent" dot className="px-3.5 py-1 text-xs">
            {locale === 'sq' ? 'Kontaktoni Velvante Solutions' : 'Contact Velvante Solutions'}
          </Badge>

          <h1 className="text-display-lg sm:text-display-xl font-black text-[rgb(var(--color-text))] tracking-tight leading-[1.08]">
            {tContact('hero.headline')}
          </h1>

          <p className="text-body-lg text-[rgb(var(--color-text-muted))] leading-relaxed max-w-2xl mx-auto">
            {tContact('hero.subheadline')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-[rgb(var(--color-text-subtle))]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {locale === 'sq' ? 'Përgjigje brenda 24 orëve' : '24-Hour Response'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {locale === 'sq' ? 'Konsultim Fillestar Falas' : 'Free Initial Consultation'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {locale === 'sq' ? 'Pa Asnjë Detyrim' : 'No Commitment'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] p-8 sm:p-10 shadow-2xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                  {tContact('form.title')}
                </h2>
                <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                  {locale === 'sq' ? 'Plotësoni të dhënat dhe do t\'ju kontaktojmë menjëherë.' : 'Fill out the details and we will reach out promptly.'}
                </p>
              </div>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-4 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 font-mono">
                    {tContact('form.success.title')}
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-muted))] max-w-md mx-auto leading-relaxed">
                    {tContact('form.success.description')}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setStatus('idle')}
                    className="mt-4 backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
                  >
                    {locale === 'sq' ? 'Dërgoni një mesazh tjetër' : 'Send another message'}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="botCheck"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={formData.botCheck}
                    onChange={(e) => setFormData((f) => ({ ...f, botCheck: e.target.value }))}
                    className="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
                  />
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={tContact('form.fields.name.label')}
                      placeholder={tContact('form.fields.name.placeholder')}
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    />
                    <Input
                      label={tContact('form.fields.email.label')}
                      type="email"
                      placeholder={tContact('form.fields.email.placeholder')}
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={tContact('form.fields.company.label')}
                      placeholder={tContact('form.fields.company.placeholder')}
                      value={formData.company}
                      onChange={(e) => setFormData((f) => ({ ...f, company: e.target.value }))}
                    />
                    <Input
                      label={tContact('form.fields.phone.label')}
                      placeholder={tContact('form.fields.phone.placeholder')}
                      value={formData.phone}
                      onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>

                  <Select
                    label={tContact('form.fields.service.label')}
                    placeholder={tContact('form.fields.service.placeholder')}
                    options={serviceOptions}
                    value={formData.service}
                    onChange={(e) => setFormData((f) => ({ ...f, service: e.target.value }))}
                  />

                  <Textarea
                    label={tContact('form.fields.message.label')}
                    placeholder={tContact('form.fields.message.placeholder')}
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    loading={status === 'loading'}
                    fullWidth
                    rightIcon={<Send size={16} />}
                    className="shadow-[0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_36px_rgba(99,102,241,0.55)] transition-shadow"
                  >
                    {tCommon('cta.send')}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[rgb(var(--color-border)/0.5)]">
                <h3 className="text-xl font-bold text-[rgb(var(--color-text))]">
                  {tContact('methods.title')}
                </h3>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available Now
                </span>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${tContact('methods.email.value')}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[rgb(var(--color-surface-elevated)/0.5)] border border-[rgb(var(--color-border)/0.5)] hover:border-[rgb(var(--color-accent)/0.5)] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-accent-light))] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[rgb(var(--color-text-subtle))] uppercase tracking-wider font-mono">
                      {tContact('methods.email.label')}
                    </p>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text))] group-hover:text-[rgb(var(--color-accent-light))] transition-colors mt-0.5">
                      {tContact('methods.email.value')}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${tContact('methods.phone.value')}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[rgb(var(--color-surface-elevated)/0.5)] border border-[rgb(var(--color-border)/0.5)] hover:border-[rgb(var(--color-accent)/0.5)] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[rgb(var(--color-text-subtle))] uppercase tracking-wider font-mono">
                      {tContact('methods.phone.label')}
                    </p>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text))] group-hover:text-cyan-300 transition-colors mt-0.5">
                      {tContact('methods.phone.value')}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[rgb(var(--color-surface-elevated)/0.5)] border border-[rgb(var(--color-border)/0.5)]">
                  <div className="w-12 h-12 rounded-2xl bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[rgb(var(--color-text-subtle))] uppercase tracking-wider font-mono">
                      {tContact('methods.location.label')}
                    </p>
                    <p className="text-sm font-semibold text-[rgb(var(--color-text))] mt-0.5">
                      {tContact('methods.location.value')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[rgb(var(--color-surface)/0.5)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.7)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[rgb(var(--color-accent-light))]">
                <Clock size={14} />
                <span>{locale === 'sq' ? 'Koha e Reagimit:' : 'Response Time Guarantee:'}</span>
              </div>
              <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed">
                {locale === 'sq'
                  ? 'Koha jonë mesatare e reagimit është më pak se 2 orë gjatë orarit të punës.'
                  : 'Our average response turnaround is under 2 hours during active business hours.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
