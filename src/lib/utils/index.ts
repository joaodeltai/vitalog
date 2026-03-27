import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Translations } from '@/lib/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale || 'pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date, locale?: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale || 'pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: string | Date, locale?: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale || 'pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(date: string | Date, t?: Translations): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (t) {
    if (minutes < 1) return t.time.justNow;
    if (minutes < 60) return t.time.minutesAgo(minutes);
    if (hours < 24) return t.time.hoursAgo(hours);
    if (days < 7) return t.time.daysAgo(days);
    return formatDate(d);
  }

  // Fallback PT-BR
  if (minutes < 1) return 'agora mesmo';
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  return formatDate(d);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function intensityColor(intensity: number): string {
  if (intensity <= 3) return 'var(--success)';
  if (intensity <= 6) return 'var(--warning)';
  return 'var(--danger)';
}

export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
