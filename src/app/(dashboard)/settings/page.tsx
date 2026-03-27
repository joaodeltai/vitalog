'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';
import { BLOOD_TYPES } from '@/types';
import { User, Heart, Bell, CreditCard, Save, Loader2, Check, Globe } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';
import { useTranslation, type Language } from '@/lib/i18n';

type Tab = 'profile' | 'plan' | 'notifications';

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();
  const { t, language, setLanguage } = useTranslation();

  // Notification preferences
  const [notifyMedication, setNotifyMedication] = useState(true);
  const [notifyDailyCheckin, setNotifyDailyCheckin] = useState(true);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
      setDateOfBirth(data.date_of_birth || '');
      setBloodType(data.blood_type || '');
      setConditions((data.chronic_conditions || []).join(', '));
      setAllergies((data.allergies || []).join(', '));
      setEmergencyContact(data.emergency_contact || '');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      setNotifyMedication(d.notify_medication ?? true);
      setNotifyDailyCheckin(d.notify_daily_checkin ?? true);
      setNotifyWeeklyReport(d.notify_weekly_report ?? false);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({
      full_name: fullName || null,
      date_of_birth: dateOfBirth || null,
      blood_type: bloodType || null,
      chronic_conditions: conditions ? conditions.split(',').map(c => c.trim()).filter(Boolean) : [],
      allergies: allergies ? allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
      emergency_contact: emergencyContact || null,
    }).eq('id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleNotifSave(key: string, value: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('profiles').update({ [key]: value }).eq('id', user.id);
      if (error) throw error;
    } catch {
      showToast(t.settings.notifications.errorSave, 'error');
    }
  }

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: t.settings.tabs.profile, icon: Heart },
    { key: 'plan', label: t.settings.tabs.plan, icon: CreditCard },
    { key: 'notifications', label: t.settings.tabs.notifications, icon: Bell },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>{t.settings.title}</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'var(--border-light)' }}>
        {TABS.map((tab_item) => (
          <button
            key={tab_item.key}
            onClick={() => setTab(tab_item.key)}
            className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
            style={{
              background: tab === tab_item.key ? 'var(--surface)' : 'transparent',
              color: tab === tab_item.key ? 'var(--primary)' : 'var(--muted)',
              boxShadow: tab === tab_item.key ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <tab_item.icon className="w-4 h-4" /> {tab_item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-64 rounded-2xl" />
      ) : (
        <>
          {tab === 'profile' && (
            <div className="space-y-6">
              {/* Language selector */}
              <div className="p-6 rounded-2xl animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                    <Globe className="w-5 h-5" style={{ color: 'var(--info)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t.settings.language.title}</h3>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{t.settings.language.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('pt')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
                    style={{
                      border: language === 'pt' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: language === 'pt' ? 'rgba(13, 148, 136, 0.06)' : 'var(--background)',
                      color: language === 'pt' ? 'var(--primary)' : 'var(--muted)',
                    }}
                  >
                    🇧🇷 {t.settings.language.pt}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
                    style={{
                      border: language === 'en' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: language === 'en' ? 'rgba(13, 148, 136, 0.06)' : 'var(--background)',
                      color: language === 'en' ? 'var(--primary)' : 'var(--muted)',
                    }}
                  >
                    🇺🇸 {t.settings.language.en}
                  </button>
                </div>
              </div>

              {/* Profile form */}
              <div className="p-6 rounded-2xl animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t.settings.profile.fullName}</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t.settings.profile.dateOfBirth}</label>
                      <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t.settings.profile.bloodType}</label>
                      <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}>
                        <option value="">{t.settings.profile.selectBlood}</option>
                        {BLOOD_TYPES.map((bt) => <option key={bt} value={bt}>{bt}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t.settings.profile.chronicConditions}</label>
                    <textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder={t.settings.profile.chronicPlaceholder} rows={2} className="w-full py-3 px-4 rounded-xl text-sm outline-none resize-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t.settings.profile.allergies}</label>
                    <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder={t.settings.profile.allergiesPlaceholder} rows={2} className="w-full py-3 px-4 rounded-xl text-sm outline-none resize-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{t.settings.profile.emergencyContact}</label>
                    <input type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder={t.settings.profile.emergencyPlaceholder} className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
                  </div>

                  <button onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-50 transition-all" style={{ background: saved ? 'var(--success)' : 'var(--primary)' }}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> {t.settings.profile.saved}</> : <><Save className="w-4 h-4" /> {t.settings.profile.saveChanges}</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'plan' && (
            <div className="p-6 rounded-2xl animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>{t.settings.plan.proTrial}</h3>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{t.settings.plan.daysLeft}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>{t.settings.plan.availablePlans}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ border: '2px solid var(--primary)', background: 'rgba(13,148,136,0.04)' }}>
                    <div><p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{t.settings.plan.proMonthly}</p></div>
                    <span className="font-bold" style={{ color: 'var(--primary)' }}>{t.settings.plan.proMonthlyPrice}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ border: '1px solid var(--border)' }}>
                    <div><p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{t.settings.plan.proAnnual}</p><p className="text-[10px]" style={{ color: 'var(--success)' }}>{t.settings.plan.freeMonths}</p></div>
                    <span className="font-bold" style={{ color: 'var(--text)' }}>{t.settings.plan.proAnnualPrice}</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 rounded-xl text-white text-sm font-semibold cursor-pointer transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', boxShadow: '0 4px 14px rgba(13,148,136,0.3)' }}>
                {t.settings.plan.subscribe}
              </button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="p-6 rounded-2xl animate-fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
              <div className="space-y-4">
                {[
                  { label: t.settings.notifications.medicationReminder, desc: t.settings.notifications.medicationDesc, checked: notifyMedication, onChange: (v: boolean) => { setNotifyMedication(v); handleNotifSave('notify_medication', v); } },
                  { label: t.settings.notifications.dailyCheckin, desc: t.settings.notifications.dailyCheckinDesc, checked: notifyDailyCheckin, onChange: (v: boolean) => { setNotifyDailyCheckin(v); handleNotifSave('notify_daily_checkin', v); } },
                  { label: t.settings.notifications.weeklyReport, desc: t.settings.notifications.weeklyReportDesc, checked: notifyWeeklyReport, onChange: (v: boolean) => { setNotifyWeeklyReport(v); handleNotifSave('notify_weekly_report', v); } },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--background)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={item.checked} onChange={(e) => item.onChange(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:w-5 after:h-5 after:transition-all" style={{ background: item.checked ? 'var(--primary)' : 'var(--border)' }} />
                    </label>
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
