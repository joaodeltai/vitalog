'use client';

import { SYMPTOM_CATEGORIES, INTENSITY_LABELS } from '@/types';
import type { HealthEntry } from '@/types';
import { relativeTime, intensityColor } from '@/lib/utils';
import { Trash2, Sparkles } from 'lucide-react';

interface EntryCardProps {
  entry: HealthEntry;
  onDelete?: (id: string) => void;
  index?: number;
}

export function EntryCard({ entry, onDelete, index = 0 }: EntryCardProps) {
  const category = SYMPTOM_CATEGORIES.find((c) => c.value === entry.category);
  const intensityInfo = entry.intensity ? INTENSITY_LABELS[entry.intensity] : null;

  return (
    <div
      className="p-4 rounded-2xl transition-all duration-200 hover:shadow-md animate-fade-in group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-light)',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{
                background: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.emoji} {category.label}
            </span>
          )}
          {entry.ai_processed && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium"
              style={{ background: 'rgba(13, 148, 136, 0.08)', color: 'var(--primary)' }}
            >
              <Sparkles className="w-3 h-3" /> IA
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {entry.intensity && (
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-white"
              style={{ background: intensityColor(entry.intensity) }}
            >
              {entry.intensity}
            </span>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg cursor-pointer"
              style={{ color: 'var(--muted)' }}
              title="Excluir registro"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>
        {entry.content_raw}
      </p>

      {/* Symptoms tags */}
      {entry.symptoms && entry.symptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {entry.symptoms.map((symptom, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium"
              style={{ background: 'var(--border-light)', color: 'var(--text-secondary)' }}
            >
              {symptom}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {relativeTime(entry.entry_date)}
        </span>
        {intensityInfo && (
          <span className="text-[11px] font-medium" style={{ color: intensityInfo.color }}>
            {intensityInfo.label}
          </span>
        )}
      </div>
    </div>
  );
}
