import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#134E4A' },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#0D9488', marginBottom: 6 },
  meta: { fontSize: 10, color: '#6B8E8B', marginBottom: 4 },
  summaryBox: { backgroundColor: '#F7FFFE', borderLeftWidth: 3, borderLeftColor: '#0D9488', padding: 10, marginVertical: 12, borderRadius: 3 },
  summaryText: { fontSize: 11, lineHeight: 1.5 },
  sectionTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: '#0D9488', marginTop: 18, marginBottom: 8 },
  table: { marginVertical: 8 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#0D9488', borderRadius: 3 },
  tableHeaderCell: { flex: 1, padding: 6, color: '#FFFFFF', fontSize: 10, fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D1E8E5' },
  tableRowEven: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#D1E8E5', backgroundColor: '#F7FFFE' },
  tableCell: { flex: 1, padding: 6, fontSize: 10 },
  pattern: { backgroundColor: '#FEF3C7', borderRadius: 4, padding: 8, marginVertical: 4 },
  patternText: { fontSize: 10 },
  patternBold: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  listItem: { flexDirection: 'row', marginVertical: 2 },
  bullet: { width: 12, fontSize: 10 },
  listText: { flex: 1, fontSize: 10, lineHeight: 1.5 },
  footer: { marginTop: 30, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#D1E8E5' },
  footerText: { fontSize: 8, color: '#6B8E8B' },
});

function ReportPDF({ content, profile, report }: { content: Record<string, unknown>; profile: { full_name?: string | null }; report: Record<string, unknown> }) {
  const timeline = (Array.isArray(content.timeline) ? content.timeline : []) as Array<Record<string, unknown>>;
  const patterns = (Array.isArray(content.patterns) ? content.patterns : []) as Array<Record<string, string>>;
  const medications = (Array.isArray(content.medications) ? content.medications : []) as Array<Record<string, unknown>>;
  const recommendations = (Array.isArray(content.recommendations) ? content.recommendations : []) as string[];

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, String(content.title || 'Relatório Médico — VitaLog')),
        React.createElement(Text, { style: styles.meta }, `Paciente: ${content.patient_name || profile?.full_name || 'N/A'}`),
        React.createElement(Text, { style: styles.meta }, `Período: ${content.period || `${report.period_start} a ${report.period_end}`}`),
        React.createElement(Text, { style: styles.meta }, `Gerado em: ${new Date(report.created_at as string).toLocaleDateString('pt-BR')}`)
      ),
      // Summary
      content.summary
        ? React.createElement(
            View,
            { style: styles.summaryBox },
            React.createElement(Text, { style: { ...styles.patternBold, marginBottom: 4 } }, 'Resumo:'),
            React.createElement(Text, { style: styles.summaryText }, String(content.summary))
          )
        : null,
      // Patterns
      patterns.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, 'Padrões Identificados'),
            ...patterns.map((p, i) =>
              React.createElement(
                View,
                { key: i, style: styles.pattern },
                React.createElement(Text, { style: styles.patternBold }, p.description),
                React.createElement(Text, { style: styles.patternText }, `${p.frequency} — ${p.severity}`)
              )
            )
          )
        : null,
      // Timeline
      timeline.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, 'Timeline de Sintomas'),
            React.createElement(
              View,
              { style: styles.table },
              React.createElement(
                View,
                { style: styles.tableHeader },
                React.createElement(Text, { style: styles.tableHeaderCell }, 'Data'),
                React.createElement(Text, { style: styles.tableHeaderCell }, 'Sintoma'),
                React.createElement(Text, { style: styles.tableHeaderCell }, 'Intensidade'),
                React.createElement(Text, { style: styles.tableHeaderCell }, 'Categoria')
              ),
              ...timeline.flatMap((day, di) =>
                ((day.entries as Array<Record<string, unknown>>) || []).map((e, ei) =>
                  React.createElement(
                    View,
                    { key: `${di}-${ei}`, style: (di + ei) % 2 === 0 ? styles.tableRow : styles.tableRowEven },
                    React.createElement(Text, { style: styles.tableCell }, new Date(day.date as string).toLocaleDateString('pt-BR')),
                    React.createElement(Text, { style: styles.tableCell }, String(e.symptom)),
                    React.createElement(Text, { style: styles.tableCell }, `${e.intensity}/10`),
                    React.createElement(Text, { style: styles.tableCell }, String(e.category))
                  )
                )
              )
            )
          )
        : null,
      // Medications
      medications.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, 'Medicamentos'),
            React.createElement(
              View,
              { style: styles.table },
              React.createElement(
                View,
                { style: styles.tableHeader },
                React.createElement(Text, { style: styles.tableHeaderCell }, 'Medicamento'),
                React.createElement(Text, { style: styles.tableHeaderCell }, 'Dosagem')
              ),
              ...medications.map((m, i) =>
                React.createElement(
                  View,
                  { key: i, style: i % 2 === 0 ? styles.tableRow : styles.tableRowEven },
                  React.createElement(Text, { style: styles.tableCell }, String(m.name)),
                  React.createElement(Text, { style: styles.tableCell }, String(m.dosage || '—'))
                )
              )
            )
          )
        : null,
      // Recommendations
      recommendations.length > 0
        ? React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.sectionTitle }, 'Recomendações'),
            ...recommendations.map((r, i) =>
              React.createElement(
                View,
                { key: i, style: styles.listItem },
                React.createElement(Text, { style: styles.bullet }, '•'),
                React.createElement(Text, { style: styles.listText }, r)
              )
            )
          )
        : null,
      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerText }, 'Relatório gerado automaticamente pelo VitaLog — vitalog.app'),
        React.createElement(Text, { style: styles.footerText }, 'Este relatório é informativo e não substitui avaliação médica profissional.')
      )
    )
  );
}

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

    const { data: report } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const content = report.content as Record<string, unknown>;

    const pdfBuffer = await renderToBuffer(
      ReportPDF({ content, profile: profile || {}, report })
    );

    const dateStr = report.period_start || new Date().toISOString().split('T')[0];

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-vitalog-${dateStr}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
