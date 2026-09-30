'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Check, Mail, Send, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface SettingsForm {
  siteName: string;
  notificationEmail: string;
  contactPhone: string;
  primaryLocation: string;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    siteName: 'Velvante Solutions',
    notificationEmail: 'velvantesolutions@outlook.com',
    contactPhone: '+383 45 319 619',
    primaryLocation: 'Pristina, Kosovo',
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            setForm({
              siteName: data.data.siteName || 'Velvante Solutions',
              notificationEmail: data.data.notificationEmail || 'velvantesolutions@outlook.com',
              contactPhone: data.data.contactPhone || '+383 45 319 619',
              primaryLocation: data.data.primaryLocation || 'Pristina, Kosovo',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(data.error?.message || 'Dështoi ruajtja e konfigurimeve.');
      }
    } catch (err: any) {
      setSaveError(err?.message || 'Gabim rrjeti gjatë ruajtjes së konfigurimeve.');
    } finally {
      setSaving(false);
    }
  }

  async function handleTestEmail() {
    setTestingEmail(true);
    setTestResult({ status: 'idle', message: '' });

    try {
      const res = await fetch('/api/admin/email-test', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setTestResult({
          status: 'success',
          message: data.data?.message || `Test email dispatched successfully to ${form.notificationEmail}`,
        });
      } else {
        setTestResult({
          status: 'error',
          message: data.error?.message || 'Failed to connect to SMTP server. Check credentials in .env',
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err?.message || 'Network error while attempting to test SMTP service',
      });
    } finally {
      setTestingEmail(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">System Settings</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Global website configuration and email notification settings.</p>
        </div>
        {initialLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-[rgb(var(--color-text-muted))]">
            <Loader2 size={14} className="animate-spin" />
            Duke ngarkuar...
          </div>
        )}
      </div>

      <Card className="p-6 bg-[rgb(var(--color-surface))] space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Site Name"
            value={form.siteName}
            onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
            disabled={initialLoading || saving}
            hint="Emri zyrtar i brendit që shfaqet në titull dhe fundfaqe."
          />
          <Input
            label="Notification Email"
            type="email"
            value={form.notificationEmail}
            onChange={(e) => setForm((prev) => ({ ...prev, notificationEmail: e.target.value }))}
            disabled={initialLoading || saving}
            hint="Email-i ku vijnë të gjitha njoftimet nga formularët e kontaktit dhe inquiries."
          />
          <Input
            label="Contact Phone Number"
            value={form.contactPhone}
            onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
            disabled={initialLoading || saving}
            placeholder="+383 45 319 619"
            hint="Ky numër shfaqet në të gjithë uebsajtin (faqja Contact, Footer, etj.) dhe hapet direkt me klikim."
          />
          <Input
            label="Primary Location"
            value={form.primaryLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, primaryLocation: e.target.value }))}
            disabled={initialLoading || saving}
            placeholder="Pristina, Kosovo"
            hint="Vendndodhja kryesore e zyrës që shfaqet në uebsajt."
          />

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-emerald-400 text-xs font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Konfigurimet u ruajtën me sukses dhe u aplikuan në të gjithë uebsajtin!</span>
            </div>
          )}

          {saveError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="pt-4 border-t border-[rgb(var(--color-border))] flex items-center gap-3">
            <Button
              type="submit"
              disabled={initialLoading || saving}
              loading={saving}
              leftIcon={saveSuccess ? <Check size={16} /> : <Save size={16} />}
            >
              {saveSuccess ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 bg-[rgb(var(--color-surface))] space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgb(var(--color-border))]">
          <div className="w-10 h-10 rounded-xl bg-[rgb(var(--color-accent)/0.15)] text-[rgb(var(--color-accent-light))] flex items-center justify-center">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[rgb(var(--color-text))]">Email & SMTP Diagnostics</h2>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">Verify live delivery to {form.notificationEmail}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[rgb(var(--color-text-muted))]">
            <span>Target Inbox:</span>
            <span className="text-[rgb(var(--color-text))] font-bold">{form.notificationEmail}</span>
          </div>
          <div className="flex justify-between text-[rgb(var(--color-text-muted))]">
            <span>SMTP Server:</span>
            <span className="text-[rgb(var(--color-text))]">smtp-mail.outlook.com:587</span>
          </div>
          <div className="flex justify-between text-[rgb(var(--color-text-muted))]">
            <span>Encryption:</span>
            <span className="text-emerald-400">STARTTLS (TLS 1.2)</span>
          </div>
        </div>

        {testResult.status === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-emerald-400 text-xs font-medium">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{testResult.message}</span>
          </div>
        )}

        {testResult.status === 'error' && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3 text-red-400 text-xs font-medium">
            <AlertCircle size={16} className="shrink-0" />
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="button"
            variant="secondary"
            loading={testingEmail}
            onClick={handleTestEmail}
            rightIcon={<Send size={15} />}
          >
            Send Test Email to {form.notificationEmail}
          </Button>
        </div>
      </Card>
    </div>
  );
}
