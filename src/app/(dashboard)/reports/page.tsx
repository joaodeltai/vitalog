'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Report } from '@/types';
import { ClipboardList, Plus, Download, Share2, Loader2, Calendar, ExternalLink, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/shared/Toast';
import { useTranslation } from '@/lib/i18n';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();
  const { t, locale } = useTranslation();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setReports(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  async function handleGenerate() {
    if (!periodStart || !periodEnd) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_start: periodStart, period_end: periodEnd }),
      });
      if (res.ok) {
        setFormOpen(false);
        setPeriodStart('');
        setPeriodEnd('');
        fetchReports();
      }
    } catch {
      showToast(t.reports.errorGenerate, 'error');
    }
    setGenerating(false);
  }

  async function handleShare(reportId: string) {
    try {
      const res = await fetch(`/api/reports/${reportId}/share`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(`${window.location.origin}/share/${data.share_token}`);
        showToast(t.reports.linkCopied, 'success');
      } else {
        showToast(t.reports.errorShare, 'error');
      }
    } catch {
      showToast(t.reports.errorShareRetry, 'error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{t.reports.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{t.reports.subtitle}</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)' }}>
          <Sparkles className="w-4 h-4" /> {t.reports.generateReport}
        </button>
      </div>

      {formOpen && (
        <div className="p-5 rounded-2xl mb-6 animate-scale-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{t.reports.generateNew}</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>{t.reports.selectPeriod}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.reports.from}</label>
              <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{t.reports.to}</label>
              <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleGenerate} disabled={generating || !periodStart || !periodEnd} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-50 transition-all" style={{ background: 'var(--primary)' }}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> {t.reports.generateWithAI}</>}
            </button>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>{t.reports.cancel}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(13, 148, 136, 0.1)' }}>
            <ClipboardList className="w-8 h-8" style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>{t.reports.emptyTitle}</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{t.reports.emptyDescription}</p>
          <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-white text-sm font-semibold cursor-pointer" style={{ background: 'var(--primary)' }}>
            <Sparkles className="w-4 h-4" /> {t.reports.generateFirst}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, i) => (
            <div key={report.id} className="p-4 rounded-2xl transition-all hover:shadow-md animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(13, 148, 136, 0.1)' }}>
                    <ClipboardList className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{t.reports.medicalReport}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                      <Calendar className="w-3 h-3" /> {formatDate(report.period_start, locale)} — {formatDate(report.period_end, locale)}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(13, 148, 136, 0.08)', color: 'var(--primary)' }}>
                  {formatDate(report.created_at, locale)}
                </span>
              </div>

              {report.content && typeof report.content === 'object' && !!(report.content as unknown as Record<string, unknown>).summary && (
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--muted)' }}>
                  {(report.content as unknown as Record<string, unknown>).summary as string}
                </p>
              )}

              <div className="flex items-center gap-2">
                <a href={`/api/reports/${report.id}/pdf`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all" style={{ background: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
                <button onClick={() => handleShare(report.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all" style={{ background: 'var(--border-light)', color: 'var(--text-secondary)' }}>
                  <Share2 className="w-3.5 h-3.5" /> {t.reports.share}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
