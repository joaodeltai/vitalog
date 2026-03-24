'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Medication, MedicationLog } from '@/types';
import {
  Plus, Pill, Clock, Check, X, MoreHorizontal,
  Loader2, Calendar, Trash2
} from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [medsRes, logsRes] = await Promise.all([
      supabase.from('medications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('medication_logs').select('*').eq('user_id', user.id).gte('taken_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

    setMedications(medsRes.data || []);
    setLogs(logsRes.data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('medications').insert({
        user_id: user.id,
        name,
        dosage: dosage || null,
        frequency: frequency || null,
        is_active: true,
      });

      if (error) throw error;
      setName(''); setDosage(''); setFrequency('');
      setFormOpen(false);
      fetchData();
    } catch {
      showToast('Erro ao salvar medicamento. Tente novamente.', 'error');
    }
    setSaving(false);
  }

  async function handleToggleDose(medId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existing = logs.find(l => l.medication_id === medId);
      if (existing) {
        await supabase.from('medication_logs').delete().eq('id', existing.id);
      } else {
        await supabase.from('medication_logs').insert({
          user_id: user.id,
          medication_id: medId,
          taken_at: new Date().toISOString(),
          status: 'taken',
        });
      }
      fetchData();
    } catch {
      showToast('Erro ao registrar dose. Tente novamente.', 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from('medications').delete().eq('id', id);
      fetchData();
    } catch {
      showToast('Erro ao excluir medicamento.', 'error');
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    try {
      await supabase.from('medications').update({ is_active: !currentActive }).eq('id', id);
      fetchData();
    } catch {
      showToast('Erro ao atualizar medicamento.', 'error');
    }
  }

  const activeMeds = medications.filter(m => m.is_active);
  const inactiveMeds = medications.filter(m => !m.is_active);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Medicamentos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {activeMeds.length} ativo{activeMeds.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
          }}
        >
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      {/* Add form */}
      {formOpen && (
        <div className="p-5 rounded-2xl mb-6 animate-scale-in" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>Novo medicamento</h3>
          <div className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do medicamento" className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Dosagem (ex: 50mg)" className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
              <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="Frequência (ex: 2x/dia)" className="w-full py-3 px-4 rounded-xl text-sm outline-none" style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving || !name.trim()} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-50 transition-all" style={{ background: 'var(--primary)' }}>
                {saving ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : 'Salvar'}
              </button>
              <button onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer" style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : medications.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <Pill className="w-8 h-8" style={{ color: 'var(--warning)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>Nenhum medicamento</h3>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Cadastre seus medicamentos para receber lembretes.</p>
        </div>
      ) : (
        <>
          {activeMeds.length > 0 && (
            <div className="space-y-3 mb-6">
              {activeMeds.map((med, i) => {
                const takenToday = logs.some(l => l.medication_id === med.id);
                return (
                  <div key={med.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md animate-fade-in group" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', animationDelay: `${i * 0.05}s` }}>
                    <button onClick={() => handleToggleDose(med.id)} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition-all" style={{ background: takenToday ? 'var(--success)' : 'var(--border-light)', color: takenToday ? 'white' : 'var(--muted)' }}>
                      {takenToday ? <Check className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text)', textDecoration: takenToday ? 'line-through' : 'none', opacity: takenToday ? 0.6 : 1 }}>{med.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {med.dosage && <span className="text-xs" style={{ color: 'var(--muted)' }}>{med.dosage}</span>}
                        {med.frequency && <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}><Clock className="w-3 h-3" />{med.frequency}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleToggleActive(med.id, med.is_active)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--muted)' }} title="Desativar"><X className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(med.id)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--danger)' }} title="Excluir"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {inactiveMeds.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Inativos</h3>
              <div className="space-y-2">
                {inactiveMeds.map((med) => (
                  <div key={med.id} className="flex items-center gap-4 p-3 rounded-xl opacity-60" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                    <Pill className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                    <span className="text-sm flex-1" style={{ color: 'var(--muted)' }}>{med.name} {med.dosage && `· ${med.dosage}`}</span>
                    <button onClick={() => handleToggleActive(med.id, med.is_active)} className="text-xs cursor-pointer" style={{ color: 'var(--primary)' }}>Reativar</button>
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
