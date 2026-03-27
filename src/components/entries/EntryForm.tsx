'use client';

import { useState } from 'react';
import { SYMPTOM_CATEGORIES } from '@/types';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';
import { useTranslation } from '@/lib/i18n';

interface EntryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content_raw: string;
    symptoms?: string[];
    category?: string;
    intensity?: number;
    content_parsed?: Record<string, unknown>;
    ai_processed?: boolean;
  }) => Promise<void>;
}

export function EntryForm({ open, onClose, onSubmit }: EntryFormProps) {
  const [content, setContent] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<Record<string, unknown> | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

  if (!open) return null;

  function getCategoryLabel(value: string): string {
    const key = value as keyof typeof t.symptomCategories;
    return t.symptomCategories[key] || value;
  }

  async function handleAIProcess() {
    if (!content.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/parse-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data);
        if (data.suggested_category) setCategory(data.suggested_category);
        if (data.suggested_intensity) setIntensity(data.suggested_intensity);
      }
    } catch {
      showToast(t.entryForm.errorAI, 'warning');
    }
    setAiLoading(false);
  }

  async function handleSubmit() {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSubmit({
        content_raw: content,
        category: category || undefined,
        intensity,
        symptoms: aiResult ? (aiResult as Record<string, unknown>).symptoms as string[] : undefined,
        content_parsed: aiResult || undefined,
        ai_processed: !!aiResult,
      });
      setContent('');
      setIntensity(5);
      setCategory('');
      setAiResult(null);
      onClose();
    } catch {
      showToast(t.entryForm.errorSave, 'error');
    }
    setLoading(false);
  }

  function getIntensityGradient() {
    return `linear-gradient(90deg, #10B981 0%, #FBBF24 50%, #EF4444 100%)`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-t-3xl md:rounded-2xl p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            {t.entryForm.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl cursor-pointer transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text input */}
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.entryForm.placeholder}
            rows={4}
            autoFocus
            className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all resize-none"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text)',
            }}
          />
          {content.trim() && (
            <button
              type="button"
              onClick={handleAIProcess}
              disabled={aiLoading}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
              style={{
                background: 'rgba(13, 148, 136, 0.08)',
                color: 'var(--primary)',
              }}
            >
              {aiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {aiLoading ? t.entryForm.analyzing : t.entryForm.analyzeAI}
            </button>
          )}
        </div>

        {/* AI result */}
        {aiResult && (
          <div
            className="mb-4 p-3 rounded-xl text-sm animate-scale-in"
            style={{ background: 'rgba(13, 148, 136, 0.06)', border: '1px solid rgba(13, 148, 136, 0.15)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <span className="font-medium" style={{ color: 'var(--primary)' }}>{t.entryForm.aiAnalysis}</span>
            </div>
            {!!(aiResult as Record<string, unknown>).summary && (
              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                {(aiResult as Record<string, unknown>).summary as string}
              </p>
            )}
          </div>
        )}

        {/* Intensity slider */}
        <div className="mb-4">
          <label className="flex items-center justify-between text-sm font-medium mb-2">
            <span style={{ color: 'var(--text-secondary)' }}>{t.entryForm.intensity}</span>
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{intensity}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: getIntensityGradient(),
              accentColor: 'var(--primary)',
            }}
          />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--muted)' }}>
            <span>{t.entryForm.mild}</span>
            <span>{t.entryForm.moderate}</span>
            <span>{t.entryForm.severe}</span>
          </div>
        </div>

        {/* Category selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t.entryForm.category}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SYMPTOM_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(category === cat.value ? '' : cat.value)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
                style={{
                  border: category === cat.value ? `2px solid ${cat.color}` : '1px solid var(--border)',
                  background: category === cat.value ? `${cat.color}10` : 'var(--background)',
                  color: category === cat.value ? cat.color : 'var(--muted)',
                }}
              >
                <span className="text-base">{cat.emoji}</span>
                {getCategoryLabel(cat.value)}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
          }}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" /> {t.entryForm.saveEntry}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
