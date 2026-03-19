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

    const { content } = await request.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // If OpenAI key is not configured, return a basic analysis
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        symptoms: [],
        summary: 'Análise de IA não disponível. Configure a chave OPENAI_API_KEY.',
        suggested_category: 'outros',
        suggested_intensity: 5,
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente médico que analisa registros de saúde em português.
Extraia informações do texto do paciente e retorne um JSON com:
- symptoms: array de strings com os sintomas identificados
- summary: resumo clínico breve do registro (1-2 frases)
- suggested_category: uma das categorias: dor, humor, energia, digestão, sono, respiração, pele, outros
- suggested_intensity: número de 1 a 10 estimando a gravidade
- triggers: array de possíveis gatilhos mencionados
- duration: duração mencionada se houver

Retorne APENAS o JSON válido, sem markdown ou texto adicional.`,
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(responseText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('AI Parse Error:', error);
    return NextResponse.json(
      { error: 'Failed to parse entry' },
      { status: 500 }
    );
  }
}
