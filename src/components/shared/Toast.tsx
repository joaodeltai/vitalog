'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
    info: <Info className="w-4 h-4 shrink-0" />,
  };

  const styleMap: Record<ToastType, { bg: string; border: string; color: string }> = {
    success: { bg: 'var(--success-light)', border: 'var(--success)', color: '#065F46' },
    error: { bg: 'var(--danger-light)', border: 'var(--danger)', color: '#991B1B' },
    warning: { bg: 'var(--warning-light)', border: 'var(--warning)', color: '#92400E' },
    info: { bg: 'var(--info-light)', border: 'var(--info)', color: '#1E40AF' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const s = styleMap[toast.type];
          return (
            <div
              key={toast.id}
              className="flex items-start gap-2.5 p-3 rounded-xl text-sm font-medium animate-slide-in-right shadow-lg"
              style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
            >
              {iconMap[toast.type]}
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 cursor-pointer opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
