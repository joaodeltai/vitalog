'use client';

import Link from 'next/link';
import {
  Heart, Activity, ClipboardList, Pill, Brain, Shield,
  Smartphone, ChevronRight, Star, Check
} from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Registro diário',
    description: 'Anote sintomas, humor e como se sente em suas próprias palavras.',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.08)',
  },
  {
    icon: Brain,
    title: 'Análise com IA',
    description: 'Nossa IA identifica padrões, categoriza sintomas e sugere intensidade.',
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.08)',
  },
  {
    icon: ClipboardList,
    title: 'Relatórios médicos',
    description: 'Gere relatórios completos em PDF para levar ao seu médico.',
    color: '#0D9488',
    bg: 'rgba(13, 148, 136, 0.08)',
  },
  {
    icon: Pill,
    title: 'Controle de medicamentos',
    description: 'Acompanhe doses, horários e nunca esqueça de tomar seu remédio.',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
];

const testimonials = [
  {
    name: 'Marina S.',
    role: 'Paciente crônica',
    text: 'Finalmente consigo explicar pro meu médico tudo que sinto entre as consultas. O relatório em PDF é um diferencial enorme.',
  },
  {
    name: 'Dr. Carlos R.',
    role: 'Clínico geral',
    text: 'Recomendo para todos os meus pacientes. Os relatórios chegam organizados e me ajudam a tomar decisões mais rápidas.',
  },
  {
    name: 'Ana Paula M.',
    role: 'Mãe de 2 filhos',
    text: 'Uso para acompanhar a saúde da família toda. Simples, rápido e me dá segurança de não esquecer nada.',
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
              }}
            >
              <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Vita<span style={{ color: 'var(--primary)' }}>Log</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-xl transition-all"
              style={{ color: 'var(--primary)' }}
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              }}
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(13, 148, 136, 0.08)', color: 'var(--primary)' }}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Seu diário de saúde pessoal com IA
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
            style={{ color: 'var(--text)' }}
          >
            Chegue na consulta com{' '}
            <span className="gradient-text">tudo que o médico precisa saber</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8"
            style={{ color: 'var(--muted)' }}
          >
            Registre sintomas no dia a dia e transforme tudo em um relatório médico completo.
            Sem esquecer nada, sem enrolação.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="flex items-center gap-2 py-3 px-8 rounded-xl text-white font-semibold transition-all hover:shadow-xl text-base"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.35)',
              }}
            >
              Começar grátis <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              14 dias grátis, sem cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16" style={{ background: 'var(--surface)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Tudo para cuidar da sua saúde
            </h2>
            <p className="text-base" style={{ color: 'var(--muted)' }}>
              Ferramentas simples que fazem diferença no seu dia a dia
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className="flex gap-4 p-5 rounded-2xl transition-all hover:shadow-md animate-fade-in"
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border-light)',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: feat.bg }}
                >
                  <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Planos simples, sem surpresa
            </h2>
            <p className="text-base" style={{ color: 'var(--muted)' }}>
              Comece grátis por 14 dias. Cancele quando quiser.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Monthly */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}
            >
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Pro Mensal</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold" style={{ color: 'var(--text)' }}>R$29</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>/mês</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {['Registros ilimitados', 'Análise com IA', 'Relatórios em PDF', 'Controle de medicamentos'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="w-4 h-4" style={{ color: 'var(--success)' }} /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ border: '2px solid var(--primary)', color: 'var(--primary)' }}
              >
                Começar grátis
              </Link>
            </div>

            {/* Annual */}
            <div
              className="p-6 rounded-2xl relative"
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--primary)',
                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.15)',
              }}
            >
              <span
                className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--success)' }}
              >
                2 meses grátis
              </span>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Pro Anual</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold" style={{ color: 'var(--text)' }}>R$199</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>/ano</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {['Tudo do plano mensal', 'Prioridade no suporte', 'Exportação completa', 'Economia de R$149/ano'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="w-4 h-4" style={{ color: 'var(--success)' }} /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
                }}
              >
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-16" style={{ background: 'var(--surface)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Quem usa, recomenda
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="p-5 rounded-2xl animate-fade-in"
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border-light)',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#FBBF24' }} />
                  ))}
                </div>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Comece a cuidar da sua saúde hoje
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--muted)' }}>
            Crie sua conta em segundos e ganhe 14 dias grátis.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 py-3 px-8 rounded-xl text-white font-semibold text-base transition-all hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              boxShadow: '0 8px 24px rgba(13, 148, 136, 0.35)',
            }}
          >
            Criar conta grátis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8" style={{ borderTop: '1px solid var(--border-light)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>VitaLog</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            &copy; 2024 VitaLog. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
