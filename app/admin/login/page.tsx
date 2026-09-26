'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { LogoIcon } from '@/components/ui/logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error?.message || 'Invalid credentials');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center p-4 grid-overlay">
      <Card className="w-full max-w-md p-8 space-y-6 bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]">
        <div className="text-center space-y-2">
          <LogoIcon size={64} className="mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-[rgb(var(--color-text))]">Velvante Solutions CMS</h1>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@Velvante Solutions.com"
            required
            leftIcon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            leftIcon={<Lock size={16} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            Sign In to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-[rgb(var(--color-border))] text-center text-xs text-[rgb(var(--color-text-subtle))]">
          Default Admin: admin@Velvante Solutions.com / Admin@2024!
        </div>
      </Card>
    </div>
  );
}

