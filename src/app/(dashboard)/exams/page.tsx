'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Exam } from '@/types';
import { Plus, FileText, Upload, Trash2, Loader2, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/shared/Toast';
import { useTranslation } from '@/lib/i18n';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();
  const { t, locale } = useTranslation();

  const fetchExams = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('exams').select('*').eq('user_id', user.id).order('exam_date', { ascending: false });
    setExams(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let fileUrl = null;
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('exams').upload(path, file);
        if (uploadError) {
          showToast(t.exams.errorUpload, 'error');
        }
        if (uploadData) {
          const { data: urlData } = supabase.storage.from('exams').getPublicUrl(path);
          fileUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from('exams').insert({
        user_id: user.id,
        name,
        exam_date: examDate || null,
        notes: notes || null,
        file_url: fileUrl,
      });

      if (error) throw error;
      setName(''); setExamDate(''); setNotes(''); setFile(null);
      setFormOpen(false);
      fetchExams();
    } catch {
      showToast(t.exams.errorSave, 'error');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from('exams').delete().eq('id', id);
      fetchExams();
    } catch {
      showToast(t.exams.errorDelete, 'error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{t.exams.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{t.exams.count(exams.length)}</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)' }}>
          <Plus className="w-4 h-4" /> {t.exams.add}
        </button>
      </div>

      {formOpen && (
        <div className="p-5 rounded-2xl mb-6 animate-scale-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>{t.exams.newExam}</h3>
          <div className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.exams.examNamePlaceholder} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.exams.notesPlaceholder} rows={2} className="w-full py-3 px-4 rounded-xl text-sm outline-none resize-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all" style={{ border: '2px dashed var(--border)', background: 'var(--background)' }}>
              <Upload className="w-5 h-5" style={{ color: 'var(--muted)' }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: file ? 'var(--primary)' : 'var(--muted)' }}>{file ? file.name : t.exams.uploadLabel}</p>
              </div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving || !name.trim()} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-50 transition-all" style={{ background: 'var(--primary)' }}>
                {saving ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : t.exams.save}
              </button>
              <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>{t.exams.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <FileText className="w-8 h-8" style={{ color: 'var(--info)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>{t.exams.emptyTitle}</h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t.exams.emptyDescription}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam, i) => (
            <div key={exam.id} className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:shadow-md animate-fade-in group" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', animationDelay: `${i * 0.05}s` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--info)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{exam.name}</p>
                {exam.exam_date && (<p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--muted)' }}><Calendar className="w-3 h-3" />{formatDate(exam.exam_date, locale)}</p>)}
                {exam.notes && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{exam.notes}</p>}
              </div>
              <div className="flex items-center gap-1">
                {exam.file_url && (<a href={exam.file_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg" style={{ color: 'var(--primary)' }}><ExternalLink className="w-4 h-4" /></a>)}
                <button onClick={() => handleDelete(exam.id)} className="p-1.5 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--danger)' }}><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
