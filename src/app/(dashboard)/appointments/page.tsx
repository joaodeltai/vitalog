'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Appointment } from '@/types';
import { Plus, Calendar, Stethoscope, Trash2, Loader2 } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { useToast } from '@/components/shared/Toast';
import { useTranslation } from '@/lib/i18n';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();
  const { t, locale } = useTranslation();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('appointments').select('*').eq('user_id', user.id).order('appointment_date', { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  async function handleCreate() {
    if (!date) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('appointments').insert({
        user_id: user.id,
        doctor_name: doctorName || null,
        specialty: specialty || null,
        appointment_date: new Date(date).toISOString(),
        summary: summary || null,
      });

      if (error) throw error;
      setDoctorName(''); setSpecialty(''); setDate(''); setSummary('');
      setFormOpen(false);
      fetchAppointments();
    } catch {
      showToast(t.appointments.errorSave, 'error');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from('appointments').delete().eq('id', id);
      fetchAppointments();
    } catch {
      showToast(t.appointments.errorDelete, 'error');
    }
  }

  const upcoming = appointments.filter(a => new Date(a.appointment_date) >= new Date());
  const past = appointments.filter(a => new Date(a.appointment_date) < new Date());

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{t.appointments.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{t.appointments.upcoming(upcoming.length)}</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)' }}>
          <Plus className="w-4 h-4" /> {t.appointments.schedule}
        </button>
      </div>

      {formOpen && (
        <div className="p-5 rounded-2xl mb-6 animate-scale-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>{t.appointments.newAppointment}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder={t.appointments.doctorPlaceholder} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder={t.appointments.specialtyPlaceholder} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            </div>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder={t.appointments.summaryPlaceholder} rows={2} className="w-full py-3 px-4 rounded-xl text-sm outline-none resize-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving || !date} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-50 transition-all" style={{ background: 'var(--primary)' }}>
                {saving ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : t.appointments.save}
              </button>
              <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>{t.appointments.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <Stethoscope className="w-8 h-8" style={{ color: '#8B5CF6' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>{t.appointments.emptyTitle}</h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t.appointments.emptyDescription}</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>{t.appointments.upcomingLabel}</h3>
              <div className="space-y-3">
                {upcoming.map((apt, i) => (
                  <div key={apt.id} className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:shadow-md animate-fade-in group" style={{ background: 'var(--surface)', border: '1px solid var(--accent)', animationDelay: `${i * 0.05}s` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(13, 148, 136, 0.1)' }}>
                      <Calendar className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{apt.doctor_name || t.appointments.defaultName} {apt.specialty && <span style={{ color: 'var(--muted)' }}>· {apt.specialty}</span>}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--primary)' }}>{formatDate(apt.appointment_date, locale)} {t.appointments.at} {formatTime(apt.appointment_date, locale)}</p>
                      {apt.summary && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{apt.summary}</p>}
                    </div>
                    <button onClick={() => handleDelete(apt.id)} className="p-1.5 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--danger)' }}><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--muted)' }}>{t.appointments.pastLabel}</h3>
              <div className="space-y-3">
                {past.map((apt, i) => (
                  <div key={apt.id} className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:shadow-md animate-fade-in group opacity-70" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', animationDelay: `${i * 0.05}s` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--border-light)' }}>
                      <Calendar className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{apt.doctor_name || t.appointments.defaultName} {apt.specialty && <span style={{ color: 'var(--muted)' }}>· {apt.specialty}</span>}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{formatDate(apt.appointment_date, locale)}</p>
                      {apt.summary && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{apt.summary}</p>}
                    </div>
                    <button onClick={() => handleDelete(apt.id)} className="p-1.5 rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--danger)' }}><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
