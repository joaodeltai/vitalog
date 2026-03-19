'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Heart, User, Calendar, Droplets, ShieldAlert, Pill, Clock,
  ChevronRight, ChevronLeft, Check, Loader2
} from 'lucide-react';
import { BLOOD_TYPES } from '@/types';

const STEPS = [
  { title: 'Seus dados básicos', subtitle: 'Informações para personalizar sua experiência' },
  { title: 'Condições de saúde', subtitle: 'Nos ajuda a identificar padrões relevantes' },
  { title: 'Medicamentos', subtitle: 'Configure seus lembretes (opcional)' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Step 1 data
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('');

  // Step 2 data
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');

  // Step 3 data
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');

  async function handleFinish() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update profile
    const profileUpdate: Record<string, unknown> = {
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    if (fullName) profileUpdate.full_name = fullName;
    if (dateOfBirth) profileUpdate.date_of_birth = dateOfBirth;
    if (bloodType) profileUpdate.blood_type = bloodType;
    if (conditions) {
      profileUpdate.chronic_conditions = conditions.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (allergies) {
      profileUpdate.allergies = allergies.split(',').map(a => a.trim()).filter(Boolean);
    }

    await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', user.id);

    // Create medication if provided
    if (medName) {
      await supabase.from('medications').insert({
        user_id: user.id,
        name: medName,
        dosage: medDosage || null,
        frequency: medFrequency || null,
        is_active: true,
      });
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i <= step
                ? 'linear-gradient(90deg, var(--primary), var(--accent))'
                : 'var(--border)',
            }}
          />
        ))}
      </div>

      {/* Step header */}
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', boxShadow: '0 8px 24px rgba(13, 148, 136, 0.3)' }}
        >
          <Heart className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          {STEPS[step].title}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {STEPS[step].subtitle}
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <User className="w-4 h-4" /> Nome completo
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all"
                style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Calendar className="w-4 h-4" /> Data de nascimento
              </label>
              <input
                id="onboarding-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all"
                style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Droplets className="w-4 h-4" /> Tipo sanguíneo
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setBloodType(bt === bloodType ? '' : bt)}
                    className="py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    style={{
                      border: bloodType === bt ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: bloodType === bt ? 'rgba(13, 148, 136, 0.08)' : 'var(--background)',
                      color: bloodType === bt ? 'var(--primary)' : 'var(--muted)',
                    }}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Health Conditions */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <ShieldAlert className="w-4 h-4" /> Condições crônicas
              </label>
              <textarea
                id="onboarding-conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Ex: diabetes, hipertensão, ansiedade (separe por vírgula)"
                rows={3}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all resize-none"
                style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                Separe várias condições por vírgula. Deixe vazio se não tiver.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <ShieldAlert className="w-4 h-4" /> Alergias
              </label>
              <textarea
                id="onboarding-allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ex: dipirona, amoxicilina, frutos do mar"
                rows={3}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all resize-none"
                style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
              />
            </div>
          </div>
        )}

        {/* Step 3: First Medication */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div
              className="p-3 rounded-xl text-sm"
              style={{ background: 'rgba(13, 148, 136, 0.06)', color: 'var(--text-secondary)' }}
            >
              💡 Opcional — você pode cadastrar medicamentos depois também.
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Pill className="w-4 h-4" /> Nome do medicamento
              </label>
              <input
                id="onboarding-med-name"
                type="text"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="Ex: Losartana"
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all"
                style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Dosagem
                </label>
                <input
                  id="onboarding-med-dosage"
                  type="text"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  placeholder="Ex: 50mg"
                  className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-3.5 h-3.5" /> Frequência
                </label>
                <input
                  id="onboarding-med-frequency"
                  type="text"
                  value={medFrequency}
                  onChange={(e) => setMedFrequency(e.target.value)}
                  placeholder="Ex: 2x ao dia"
                  className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all"
                  style={{ border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 py-2.5 px-5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              }}
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer hover:shadow-lg disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> Concluir
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Skip */}
      {step === 2 && (
        <button
          type="button"
          onClick={handleFinish}
          disabled={loading}
          className="block mx-auto mt-4 text-sm cursor-pointer transition-colors hover:underline"
          style={{ color: 'var(--muted)' }}
        >
          Pular e configurar depois
        </button>
      )}
    </div>
  );
}
