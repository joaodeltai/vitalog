import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Fetch profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const content = report.content as Record<string, unknown>;

    // Generate a simple HTML PDF (for MVP; can be replaced with @react-pdf/renderer for server-side)
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Médico — VitaLog</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #134E4A; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #0D9488; font-size: 24px; border-bottom: 2px solid #5EEAD4; padding-bottom: 8px; }
    h2 { color: #0D9488; font-size: 18px; margin-top: 24px; }
    .meta { color: #6B8E8B; font-size: 13px; margin: 8px 0 24px; }
    .summary { background: #F7FFFE; border-left: 3px solid #0D9488; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #0D9488; color: white; text-align: left; padding: 8px 12px; font-size: 13px; }
    td { padding: 8px 12px; border-bottom: 1px solid #D1E8E5; font-size: 13px; }
    tr:nth-child(even) { background: #F7FFFE; }
    .pattern { background: #FEF3C7; border-radius: 6px; padding: 8px 12px; margin: 6px 0; font-size: 13px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #D1E8E5; color: #6B8E8B; font-size: 11px; }
  </style>
</head>
<body>
  <h1>📋 ${content.title || 'Relatório Médico'}</h1>
  <div class="meta">
    <strong>Paciente:</strong> ${content.patient_name || profile?.full_name || 'N/A'}<br>
    <strong>Período:</strong> ${content.period || `${report.period_start} a ${report.period_end}`}<br>
    <strong>Gerado em:</strong> ${new Date(report.created_at).toLocaleDateString('pt-BR')}
  </div>

  ${content.summary ? `<div class="summary"><strong>Resumo:</strong> ${content.summary}</div>` : ''}

  ${Array.isArray(content.patterns) && (content.patterns as Array<Record<string, string>>).length > 0 ? `
    <h2>🔍 Padrões Identificados</h2>
    ${(content.patterns as Array<Record<string, string>>).map((p) => `<div class="pattern">⚠️ <strong>${p.description}</strong> — ${p.frequency} (${p.severity})</div>`).join('')}
  ` : ''}

  ${Array.isArray(content.timeline) && (content.timeline as Array<Record<string, unknown>>).length > 0 ? `
    <h2>📅 Timeline de Sintomas</h2>
    <table>
      <tr><th>Data</th><th>Sintoma</th><th>Intensidade</th><th>Categoria</th></tr>
      ${(content.timeline as Array<Record<string, unknown>>).map((day) =>
        (day.entries as Array<Record<string, unknown>>).map((e) =>
          `<tr><td>${new Date(day.date as string).toLocaleDateString('pt-BR')}</td><td>${e.symptom}</td><td>${e.intensity}/10</td><td>${e.category}</td></tr>`
        ).join('')
      ).join('')}
    </table>
  ` : ''}

  ${Array.isArray(content.medications) && (content.medications as Array<Record<string, unknown>>).length > 0 ? `
    <h2>💊 Medicamentos</h2>
    <table>
      <tr><th>Medicamento</th><th>Dosagem</th></tr>
      ${(content.medications as Array<Record<string, string>>).map((m) =>
        `<tr><td>${m.name}</td><td>${m.dosage || '—'}</td></tr>`
      ).join('')}
    </table>
  ` : ''}

  ${Array.isArray(content.recommendations) && (content.recommendations as string[]).length > 0 ? `
    <h2>💡 Recomendações</h2>
    <ul>${(content.recommendations as string[]).map((r) => `<li>${r}</li>`).join('')}</ul>
  ` : ''}

  <div class="footer">
    Relatório gerado automaticamente pelo VitaLog — vitalog.app<br>
    Este relatório é informativo e não substitui avaliação médica profissional.
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="relatorio-vitalog-${report.period_start}.html"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
