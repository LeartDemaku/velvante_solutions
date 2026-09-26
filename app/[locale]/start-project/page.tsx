'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Sparkles, Check } from 'lucide-react';

export default function StartProjectPage() {
  const tForm = useTranslations('forms.inquiry');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isSq = locale === 'sq';

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    services: [] as string[],
    budget: '',
    timeline: '',
    description: '',
    goals: '',
    botCheck: '',
  });

  const projectTypes = tForm.raw('projectTypes') as string[];
  const budgetRanges = tForm.raw('budgetRanges') as string[];
  const timelines = tForm.raw('timelines') as string[];
  const availableServices = [
    { id: 'Web Design', label: isSq ? 'Dizajn Uebi' : 'Web Design' },
    { id: 'Full-Stack Development', label: isSq ? 'Zhvillim Full-Stack' : 'Full-Stack Development' },
    { id: 'E-Commerce', label: isSq ? 'E-Commerce' : 'E-Commerce' },
    { id: 'Web Applications', label: isSq ? 'Aplikacione Web' : 'Web Applications' },
    { id: 'UI/UX Design', label: isSq ? 'Dizajn UI/UX' : 'UI/UX Design' },
    { id: 'Backend & APIs', label: isSq ? 'Backend & API' : 'Backend & APIs' },
    { id: 'Database & Infrastructure', label: isSq ? 'Baza të Dhënash & Infrastrukturë' : 'Database & Infrastructure' },
    { id: 'SEO & Performance', label: isSq ? 'SEO & Performancë' : 'SEO & Performance' },
    { id: 'AI & Automation', label: isSq ? 'AI & Automatizim' : 'AI & Automation' },
    { id: 'Security', label: isSq ? 'Siguri Dixhitale' : 'Security' },
    { id: 'Maintenance', label: isSq ? 'Mirëmbajtje & Mbështetje' : 'Maintenance' },
  ];

  const totalSteps = 8;

  function handleServiceToggle(serviceId: string) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  }

  async function handleSubmit() {
    setStatus('loading');
    try {
      const res = await fetch('/api/project-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          projectType: formData.projectType || 'New Website',
          services: formData.services.length > 0 ? formData.services : ['Web Design'],
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description,
          goals: formData.goals,
          botCheck: formData.botCheck,
          locale,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="relative bg-[rgb(var(--color-background))] min-h-screen">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[170px] pointer-events-none" />
        <div className="pt-32 pb-24 container-velvante max-w-2xl text-center space-y-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_32px_rgba(16,185,129,0.25)]"
          >
            <CheckCircle2 size={40} />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-display-md font-black text-[rgb(var(--color-text))] font-mono">
              {tForm('success.title')}
            </h1>
            <p className="text-body-md text-[rgb(var(--color-text-muted))] max-w-md mx-auto leading-relaxed">
              {tForm('success.description')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] text-left space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-[rgb(var(--color-text))] uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles size={16} className="text-[rgb(var(--color-accent-light))]" />
              {isSq ? 'Hapat e ardhshëm:' : 'What happens next:'}
            </h2>
            <ul className="space-y-3">
              {((tForm.raw('success.nextSteps') as string[]) || []).map((stepText, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-muted))]">
                  <span className="w-6 h-6 rounded-full bg-[rgb(var(--color-accent)/0.2)] text-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-accent)/0.4)] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{stepText}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button as="a" href={`/${locale}`} size="lg">
            {isSq ? 'Kthehu në Ballinë' : 'Back to Homepage'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[rgb(var(--color-background))] min-h-screen">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-[35%] -right-20 w-[550px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[450px] bg-indigo-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 container-velvante max-w-3xl space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <Badge variant="accent" dot className="px-3.5 py-1 text-xs">
            {isSq ? 'Filloni Projektin Tuaj' : 'Start Your Project'}
          </Badge>
          <h1 className="text-display-md sm:text-display-lg font-black text-[rgb(var(--color-text))] tracking-tight">
            {isSq ? 'Inxhinieroni Idene Tuaj' : 'Engineer Your Vision'}
          </h1>
          <p className="text-sm font-mono text-[rgb(var(--color-text-muted))]">
            {isSq ? `Hapi ${step} nga ${totalSteps}` : `Step ${step} of ${totalSteps}`} —{' '}
            <span className="text-[rgb(var(--color-accent-light))]">
              {tForm(`steps.${['about', 'business', 'projectType', 'budget', 'timeline', 'requirements', 'contact', 'review'][step - 1]}` as any)}
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-[rgb(var(--color-text-subtle))] px-1">
            <span>Progress</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[rgb(var(--color-surface-elevated))] rounded-full overflow-hidden p-0.5 border border-[rgb(var(--color-border)/0.5)]">
            <div
              className="h-full bg-gradient-to-r from-[rgb(var(--color-accent))] to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-[rgb(var(--color-surface)/0.65)] backdrop-blur-xl border border-[rgb(var(--color-border)/0.8)] p-6 sm:p-10 shadow-2xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 1: Rreth Jush' : 'Step 1: About You'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Na tregoni se si quheni.' : 'Tell us your name.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={tForm('fields.firstName.label')}
                      placeholder={tForm('fields.firstName.placeholder')}
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData((f) => ({ ...f, firstName: e.target.value }))}
                    />
                    <Input
                      label={tForm('fields.lastName.label')}
                      placeholder={tForm('fields.lastName.placeholder')}
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData((f) => ({ ...f, lastName: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 2: Informacioni i Biznesit' : 'Step 2: Business Info'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Emri i kompanisë apo startup-it tuaj.' : 'Your company or startup name.'}
                    </p>
                  </div>
                  <Input
                    label={tForm('fields.company.label')}
                    placeholder={tForm('fields.company.placeholder')}
                    value={formData.company}
                    onChange={(e) => setFormData((f) => ({ ...f, company: e.target.value }))}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 3: Zgjidhni Llojin e Projektit' : 'Step 3: Select Project Type'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Çfarë lloj sistemi dëshironi të ndërtoni?' : 'What kind of system do you want to build?'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {projectTypes.map((type) => {
                      const isSelected = formData.projectType === type;
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData((f) => ({ ...f, projectType: type }))}
                          className={`p-4 rounded-2xl text-left text-sm font-medium border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent)/0.15)] text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                              : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-surface-elevated)/0.4)] hover:border-[rgb(var(--color-accent)/0.5)] hover:text-[rgb(var(--color-text))]'
                          }`}
                        >
                          <span>{type}</span>
                          {isSelected && <Check size={16} className="text-[rgb(var(--color-accent-light))]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 4: Zgjidhni Buxhetin' : 'Step 4: Select Budget Range'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Buxheti i parashikuar për këtë zgjidhje.' : 'Your planned budget for this solution.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {budgetRanges.map((b) => {
                      const isSelected = formData.budget === b;
                      return (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setFormData((f) => ({ ...f, budget: b }))}
                          className={`p-4 rounded-2xl text-left text-sm font-medium border transition-all flex items-center justify-between font-mono ${
                            isSelected
                              ? 'border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent)/0.15)] text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                              : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-surface-elevated)/0.4)] hover:border-[rgb(var(--color-accent)/0.5)] hover:text-[rgb(var(--color-text))]'
                          }`}
                        >
                          <span>{b}</span>
                          {isSelected && <Check size={16} className="text-[rgb(var(--color-accent-light))]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 5: Afati Kohor i Projektit' : 'Step 5: Project Timeline'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Kur dëshironi që projekti të lëshohet live?' : 'When would you like the project to go live?'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {timelines.map((time) => {
                      const isSelected = formData.timeline === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setFormData((f) => ({ ...f, timeline: time }))}
                          className={`p-4 rounded-2xl text-left text-sm font-medium border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent)/0.15)] text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                              : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-surface-elevated)/0.4)] hover:border-[rgb(var(--color-accent)/0.5)] hover:text-[rgb(var(--color-text))]'
                          }`}
                        >
                          <span>{time}</span>
                          {isSelected && <Check size={16} className="text-[rgb(var(--color-accent-light))]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 6: Shërbimet e Kërkuara' : 'Step 6: Services Required'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Mund të zgjidhni më shumë se një shërbim.' : 'You can select multiple services.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {availableServices.map((svc) => {
                      const isSelected = formData.services.includes(svc.id);
                      return (
                        <button
                          type="button"
                          key={svc.id}
                          onClick={() => handleServiceToggle(svc.id)}
                          className={`p-3.5 rounded-2xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[rgb(var(--color-accent))] bg-[rgb(var(--color-accent)/0.15)] text-white shadow-[0_0_16px_rgba(99,102,241,0.25)]'
                              : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] bg-[rgb(var(--color-surface-elevated)/0.4)] hover:border-[rgb(var(--color-accent)/0.5)] hover:text-[rgb(var(--color-text))]'
                          }`}
                        >
                          <span>{svc.label}</span>
                          {isSelected && <Check size={14} className="text-[rgb(var(--color-accent-light))] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <Textarea
                    label={tForm('fields.description.label')}
                    placeholder={tForm('fields.description.placeholder')}
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 7: Detajet e Kontaktit' : 'Step 7: Contact Details'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Ku mund t\'ju dërgojmë vlerësimin dhe propozimin teknik?' : 'Where can we send the estimate and technical proposal?'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Input
                      label={tForm('fields.email.label')}
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                    />
                    <Input
                      label={tForm('fields.phone.label')}
                      value={formData.phone}
                      onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                      {isSq ? 'Hapi 8: Rishikimi & Dërgimi' : 'Step 8: Review & Submit'}
                    </h2>
                    <p className="text-xs font-mono text-[rgb(var(--color-text-subtle))]">
                      {isSq ? 'Ju lutemi rishikoni detajet para dorëzimit.' : 'Please review your details before submission.'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[rgb(var(--color-background)/0.8)] border border-[rgb(var(--color-border-subtle))] space-y-3 text-sm text-[rgb(var(--color-text-muted))]">
                    <div className="flex justify-between py-1 border-b border-[rgb(var(--color-border-subtle))]">
                      <span className="text-[rgb(var(--color-text-subtle))] font-mono text-xs">{isSq ? 'Emri:' : 'Name:'}</span>
                      <span className="font-semibold text-[rgb(var(--color-text))]">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgb(var(--color-border-subtle))]">
                      <span className="text-[rgb(var(--color-text-subtle))] font-mono text-xs">Email:</span>
                      <span className="font-semibold text-[rgb(var(--color-text))]">{formData.email}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgb(var(--color-border-subtle))]">
                      <span className="text-[rgb(var(--color-text-subtle))] font-mono text-xs">{isSq ? 'Lloji i Projektit:' : 'Project Type:'}</span>
                      <span className="font-semibold text-[rgb(var(--color-text))]">{formData.projectType || (isSq ? 'I paspecifikuar' : 'Not specified')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgb(var(--color-border-subtle))]">
                      <span className="text-[rgb(var(--color-text-subtle))] font-mono text-xs">{isSq ? 'Buxheti:' : 'Budget:'}</span>
                      <span className="font-semibold text-emerald-400 font-mono">{formData.budget || (isSq ? 'I paspecifikuar' : 'Not specified')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[rgb(var(--color-border-subtle))]">
                      <span className="text-[rgb(var(--color-text-subtle))] font-mono text-xs">{isSq ? 'Afati Kohor:' : 'Timeline:'}</span>
                      <span className="font-semibold text-[rgb(var(--color-text))]">{formData.timeline || (isSq ? 'I paspecifikuar' : 'Not specified')}</span>
                    </div>
                    <div className="pt-1">
                      <span className="text-[rgb(var(--color-text-subtle))] font-mono text-xs block mb-1.5">{isSq ? 'Shërbimet:' : 'Services:'}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.services.length > 0 ? (
                          formData.services.map((id) => (
                            <span key={id} className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-[rgb(var(--color-surface-elevated))] text-[rgb(var(--color-accent-light))] border border-[rgb(var(--color-border))]">
                              {availableServices.find((s) => s.id === id)?.label || id}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[rgb(var(--color-text-subtle))]">{isSq ? 'Të përgjithshme' : 'General'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center pt-6 border-t border-[rgb(var(--color-border))]">
            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() => setStep((s) => s - 1)}
                leftIcon={<ArrowLeft size={16} />}
                className="backdrop-blur-md bg-[rgb(var(--color-surface)/0.6)]"
              >
                {isSq ? 'Mbrapa' : 'Back'}
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                rightIcon={<ArrowRight size={16} />}
                className="shadow-[0_0_20px_rgba(99,102,241,0.35)]"
              >
                {isSq ? 'Hapi Tjetër' : 'Next Step'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={status === 'loading'}
                rightIcon={<Send size={16} />}
                className="shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)] transition-shadow"
              >
                {isSq ? 'Dërgo Kërkesën' : 'Submit Request'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
