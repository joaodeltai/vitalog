import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { period_start, period_end } = await request.json();
    if (!period_start || !period_end) {
      return NextResponse.json({ error: 'Period start and end are required' }, { status: 400 });
    }

    // Fetch entries in period
    const { data: entries } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', new Date(period_start).toISOString())
      .lte('entry_date', new Date(period_end + 'T23:59:59').toISOString())
      .order('entry_date', { ascending: true });

    // Fetch medications
    const { data: medications } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, chronic_conditions, allergies')
      .eq('id', user.id)
      .single();

    if (!entries || entries.length === 0) {
      return NextResponse.json({ error: 'Nenhum registro encontrado nesse período' }, { status: 400 });
    }

    let reportContent;

    if (!process.env.OPENAI_API_KEY) {
      // Fallback: generate a basic report without AI
      reportContent = {
        title: 'Relatório Médico — VitaLog',
        patient_name: profile?.full_name || 'Paciente',
        period: `${period_start} a ${period_end}`,
        summary: `Relatório gerado com ${entries.length} registro(s) no período.`,
        timeline: entries.map(e => ({
          date: e.entry_date,
          entries: [{ symptom: e.content_raw, intensity: e.intensity || 0, category: e.category || 'outros' }],
        })),
        patterns: [],
        medications: (medications || []).map(m => ({ name: m.name, dosage: m.dosage || '', adherence_rate: 0 })),
        recommendations: ['Configure a chave OPENAI_API_KEY para relatórios completos com IA.'],
      };
    } else {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const entriesSummary = entries.map(e =>
        `[${new Date(e.entry_date).toLocaleDateString('pt-BR')}] Categoria: ${e.category || 'N/A'} | Intensidade: ${e.intensity || 'N/A'}/10 | ${e.content_raw}`
      ).join('\n');

      const medicationsSummary = (medications || []).map(m => `${m.name} ${m.dosage || ''} - ${m.frequency || ''}`).join(', ');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente médico gerando um relatório clínico a partir de registros de saúde de um paciente.
O relatório deve ser profissional, organizado e útil para um médico.

Retorne APENAS um JSON válido com esta estrutura:
{
  "title": "Relatório Médico — VitaLog",
  "patient_name": "nome do paciente",
  "period": "período",
  "summary": "resumo executivo em 2-3 frases",
  "timeline": [{"date": "data", "entries": [{"symptom": "desc", "intensity": 5, "category": "cat", "notes": "obs"}]}],
  "patterns": [{"description": "padrão identificado", "frequency": "frequência", "severity": "gravidade"}],
  "medications": [{"name": "nome", "dosage": "dose", "adherence_rate": 0}],
  "recommendations": ["recomendação 1", "recomendação 2"]
}`,
          },
          {
            role: 'user',
            content: `Paciente: ${profile?.full_name || 'Não informado'}
Condições: ${(profile?.chronic_conditions || []).join(', ') || 'Nenhuma informada'}
Alergias: ${(profile?.allergies || []).join(', ') || 'Nenhuma informada'}
Medicamentos: ${medicationsSummary || 'Nenhum'}
Período: ${period_start} a ${period_end}
Total de registros: ${entries.length}

Registros:
${entriesSummary}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      reportContent = JSON.parse(responseText);
    }

    // Save report
    const { data: report, error: insertError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        period_start,
        period_end,
        content: reportContent,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Generate Report Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
