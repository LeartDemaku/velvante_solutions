'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Mail, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { LogoIcon } from '@/components/ui/logo';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('velvantesolutions@outlook.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error?.message || 'Email ose fjalëkalim i pasaktë.');
      }
    } catch {
      setError('Ndodhi një gabim i papritur në rrjet. Ju lutem provoni përsëri.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Linku i sigurt i rivendosjes u dërgua me sukses në email! Ju lutem kontrolloni postën tuaj.');
      } else {
        setError(data.error?.message || 'Nuk mund të dërgohet linku i rivendosjes.');
      }
    } catch {
      setError('Ndodhi një gabim në rrjet gjatë dërgimit të kërkesës.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-[rgb(var(--color-surface)/0.9)] backdrop-blur-xl border-[rgb(var(--color-border))] shadow-2xl relative z-10">
      <div className="text-center space-y-2">
        <LogoIcon size={56} className="mx-auto mb-2" />
        <h1 className="text-2xl font-black tracking-tight text-[rgb(var(--color-text))]">
          Velvante Solutions CMS
        </h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          Administrative & Content Management Workspace
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="velvantesolutions@outlook.com"
            required
            leftIcon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              leftIcon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setView('forgot');
                  setError('');
                  setSuccess('');
                }}
                className="text-xs text-[rgb(var(--color-accent-light))] hover:underline"
              >
                Keni harruar fjalëkalimin?
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} rightIcon={<ArrowRight size={15} />}>
            Sign In to Dashboard
          </Button>
        </form>
      ) : (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[rgb(var(--color-surface-elevated))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-muted))]">
            Shkruani adresën e email-it zyrtar për të marrë linkun e sigurt për ndryshimin e fjalëkalimit tuaj.
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="velvantesolutions@outlook.com"
            required
            leftIcon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" fullWidth loading={loading} rightIcon={<ArrowRight size={15} />}>
            Dërgo Linkun me Email
          </Button>

          <button
            type="button"
            onClick={() => {
              setView('login');
              setError('');
              setSuccess('');
            }}
            className="w-full py-2 text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kthehu te Kyçja (Sign In)</span>
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-[rgb(var(--color-border))] text-center space-y-1">
        <p className="text-[11px] text-[rgb(var(--color-text-subtle))] font-mono">
          Authorized Personnel Only • IP Monitored
        </p>
        <p className="text-[11px] text-[rgb(var(--color-text-muted))]">
          Official System Email: <span className="font-mono text-[rgb(var(--color-text))]">velvantesolutions@outlook.com</span>
        </p>
      </div>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 grid-overlay relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[140px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-[rgb(var(--color-text-muted))]">Loading workspace...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
