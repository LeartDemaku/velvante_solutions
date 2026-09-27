'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { LogoIcon } from '@/components/ui/logo';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Fjalëkalimi duhet të ketë së paku 8 karaktere.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Fjalëkalimi u përditësua me sukses! Po ridrejtoheni te faqja e kyçjes...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 1500);
      } else {
        setError(data.error?.message || 'Nuk mund të përditësohet fjalëkalimi. Linku mund të ketë skaduar.');
      }
    } catch {
      setError('Ndodhi një gabim në rrjet gjatë përditësimit.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-[rgb(var(--color-surface)/0.9)] backdrop-blur-xl border-[rgb(var(--color-border))] shadow-2xl relative z-10 text-center">
        <LogoIcon size={56} className="mx-auto mb-2" />
        <h1 className="text-xl font-bold text-[rgb(var(--color-text))]">Link i Pavlefshëm</h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          Nuk u gjet token i vlefshëm për rivendosjen e fjalëkalimit. Ju lutem kërkoni një link të ri nga faqja e kyçjes.
        </p>
        <Link href="/admin/login">
          <Button fullWidth className="mt-4">
            Kthehu te Kyçja
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-[rgb(var(--color-surface)/0.9)] backdrop-blur-xl border-[rgb(var(--color-border))] shadow-2xl relative z-10">
      <div className="text-center space-y-2">
        <LogoIcon size={56} className="mx-auto mb-2" />
        <h1 className="text-2xl font-black tracking-tight text-[rgb(var(--color-text))]">
          Rivendosja e Fjalëkalimit
        </h1>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          Vendosni fjalëkalimin tuaj të ri për llogarinë administrative
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

      <form onSubmit={handleReset} className="space-y-4">
        <Input
          label="Fjalëkalimi i Ri"
          type="password"
          placeholder="••••••••"
          required
          leftIcon={<Lock size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Konfirmo Fjalëkalimin"
          type="password"
          placeholder="••••••••"
          required
          leftIcon={<Lock size={16} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" fullWidth loading={loading} rightIcon={<ArrowRight size={15} />}>
          Përditëso Fjalëkalimin
        </Button>
      </form>

      <div className="pt-4 border-t border-[rgb(var(--color-border))] text-center">
        <Link href="/admin/login" className="text-xs text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors">
          Kthehu te Faqja e Kyçjes
        </Link>
      </div>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 grid-overlay relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[rgb(var(--color-accent)/0.15)] rounded-full blur-[140px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-[rgb(var(--color-text-muted))]">Loading workspace...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
