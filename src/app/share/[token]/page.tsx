import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/types';

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('share_token', token)
    .gt('share_expires_at', new Date().toISOString())
    .single();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Link expirado ou inválido
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Este relatório não está mais disponível. Solicite um novo link ao paciente.
          </p>
        </div>
      </div>
    );
  }

  const content = report.content as Record<string, unknown>;

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                {(content.title as string) || 'Relatório Médico'}
              </h1>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Gerado pelo VitaLog em {new Date(report.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span style={{ color: 'var(--muted)' }}>Paciente:</span>{' '}
              <strong style={{ color: 'var(--text)' }}>{(content.patient_name as string) || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>Período:</span>{' '}
              <strong style={{ color: 'var(--text)' }}>{(content.period as string) || `${report.period_start} a ${report.period_end}`}</strong>
            </div>
          </div>
        </div>

        {/* Summary */}
        {!!content.summary && (
          <div className="p-5 rounded-2xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
            <h2 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>Resumo</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{content.summary as string}</p>
          </div>
        )}

        {/* Patterns */}
        {Array.isArray(content.patterns) && (content.patterns as Array<Record<string, string>>).length > 0 && (
          <div className="p-5 rounded-2xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
            <h2 className="font-semibold mb-3" style={{ color: 'var(--primary)' }}>🔍 Padrões Identificados</h2>
            <div className="space-y-2">
              {(content.patterns as Array<Record<string, string>>).map((p, i) => (
                <div key={i} className="p-3 rounded-xl text-sm" style={{ background: 'var(--warning-light)', color: 'var(--text)' }}>
                  <strong>{p.description}</strong> — {p.frequency} ({p.severity})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--border-light)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Relatório gerado automaticamente pelo <strong>VitaLog</strong> — vitalog.app<br />
            Este relatório é informativo e não substitui avaliação médica profissional.
          </p>
        </div>
      </div>
    </div>
  );
}
