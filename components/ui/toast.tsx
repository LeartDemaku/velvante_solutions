'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(() => onRemove(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onRemove]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} className="text-green-400 shrink-0" />,
    error: <AlertCircle size={18} className="text-red-400 shrink-0" />,
    info: <Info size={18} className="text-blue-400 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-yellow-400 shrink-0" />,
  };

  const borderColors: Record<ToastType, string> = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
    warning: 'border-yellow-500/30',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-[var(--radius-lg)] pointer-events-auto',
        'bg-[rgb(var(--color-surface-elevated))] border',
        'shadow-[var(--shadow-lg)] backdrop-blur-sm',
        'animate-slide-up',
        borderColors[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[rgb(var(--color-text))]">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-[rgb(var(--color-text-subtle))] hover:text-[rgb(var(--color-text))] transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
