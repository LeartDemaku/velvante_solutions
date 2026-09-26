'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Check, Mail, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          message: data.data?.message || 'Test email dispatched successfully to velvantesolutions@outlook.com',
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
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">System Settings</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">Global website configuration and email notification settings.</p>
      </div>

      <Card className="p-6 bg-[rgb(var(--color-surface))] space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Site Name" defaultValue="Velvante Solutions" />
          <Input label="Notification Email" defaultValue="velvantesolutions@outlook.com" />
          <Input label="Contact Phone Number" defaultValue="+383 44 000 000" />
          <Input label="Primary Location" defaultValue="Pristina, Kosovo" />

          <div className="pt-4 border-t border-[rgb(var(--color-border))] flex items-center gap-3">
            <Button type="submit" leftIcon={saved ? <Check size={16} /> : <Save size={16} />}>
              {saved ? 'Settings Saved!' : 'Save Settings'}
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
            <p className="text-xs text-[rgb(var(--color-text-muted))]">Verify live delivery to velvantesolutions@outlook.com</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[rgb(var(--color-text-muted))]">
            <span>Target Inbox:</span>
            <span className="text-[rgb(var(--color-text))] font-bold">velvantesolutions@outlook.com</span>
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
            Send Test Email to velvantesolutions@outlook.com
          </Button>
        </div>
      </Card>
    </div>
  );
}
