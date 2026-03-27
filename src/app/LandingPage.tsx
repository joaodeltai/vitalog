'use client';

import Link from 'next/link';
import {
  Heart, Activity, ClipboardList, Pill, Brain, Shield,
  Smartphone, ChevronRight, Star, Check, ArrowRight,
  Sparkles, FileText, TrendingUp, Clock, Zap, Lock,
  BarChart3, Users, Award
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Heart,
      title: t.landing.features.dailyLog,
      description: t.landing.features.dailyLogDesc,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.06)',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    },
    {
      icon: Brain,
      title: t.landing.features.aiAnalysis,
      description: t.landing.features.aiAnalysisDesc,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.06)',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    },
    {
      icon: ClipboardList,
      title: t.landing.features.medReports,
      description: t.landing.features.medReportsDesc,
      color: '#0D9488',
      bg: 'rgba(13, 148, 136, 0.06)',
      gradient: 'linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)',
    },
    {
      icon: Pill,
      title: t.landing.features.medControl,
      description: t.landing.features.medControlDesc,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.06)',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: Smartphone,
      title: t.landing.howItWorks.step1Title,
      description: t.landing.howItWorks.step1Desc,
    },
    {
      number: '02',
      icon: Sparkles,
      title: t.landing.howItWorks.step2Title,
      description: t.landing.howItWorks.step2Desc,
    },
    {
      number: '03',
      icon: FileText,
      title: t.landing.howItWorks.step3Title,
      description: t.landing.howItWorks.step3Desc,
    },
  ];

  const stats = [
    { value: '10k+', label: t.landing.stats.created },
    { value: '98%', label: t.landing.stats.satisfaction },
    { value: '2min', label: t.landing.stats.avgTime },
    { value: '4.9', label: t.landing.stats.appRating, icon: Star },
  ];

  const testimonials = [
    {
      name: t.landing.testimonials.t1.name,
      role: t.landing.testimonials.t1.role,
      text: t.landing.testimonials.t1.text,
      avatar: 'M',
      color: '#EC4899',
    },
    {
      name: t.landing.testimonials.t2.name,
      role: t.landing.testimonials.t2.role,
      text: t.landing.testimonials.t2.text,
      avatar: 'C',
      color: '#3B82F6',
    },
    {
      name: t.landing.testimonials.t3.name,
      role: t.landing.testimonials.t3.role,
      text: t.landing.testimonials.t3.text,
      avatar: 'A',
      color: '#8B5CF6',
    },
  ];

  const extraFeatures = [
    { icon: Shield, text: t.landing.features.extras.encrypted },
    { icon: Zap, text: t.landing.features.extras.fastAI },
    { icon: Clock, text: t.landing.features.extras.fullHistory },
    { icon: Lock, text: t.landing.features.extras.privacy },
  ];

  return (
    <div style={{ background: 'var(--background)' }} className="overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
              }}
            >
              <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              Vita<span className="gradient-text">Log</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
              {t.landing.header.features}
            </a>
            <a href="#how-it-works" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
              {t.landing.header.howItWorks}
            </a>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
              {t.landing.header.plans}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:bg-[rgba(13,148,136,0.06)]"
              style={{ color: 'var(--primary)' }}
            >
              {t.landing.header.login}
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              }}
            >
              {t.landing.header.createAccount}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 animate-blob opacity-20"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--primary-light))', filter: 'blur(80px)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] animate-blob opacity-15"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-light))', filter: 'blur(100px)', animationDelay: '-4s' }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-reveal-up"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(94, 234, 212, 0.08))',
              color: 'var(--primary)',
              border: '1px solid rgba(13, 148, 136, 0.15)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.landing.hero.badge}
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 animate-reveal-up"
            style={{ color: 'var(--text)', animationDelay: '0.1s' }}
          >
            {t.landing.hero.titlePart1}
            <span
              className="animate-gradient-shift"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent), var(--primary-light))',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.landing.hero.titleHighlight}
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed animate-reveal-up"
            style={{ color: 'var(--muted)', animationDelay: '0.2s' }}
          >
            {t.landing.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/signup"
              className="group flex items-center gap-2.5 py-3.5 px-8 rounded-2xl text-white font-semibold text-base transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 8px 32px rgba(13, 148, 136, 0.4)',
              }}
            >
              {t.landing.hero.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {t.landing.hero.trial}
            </p>
          </div>

          {/* Stats bar */}
          <div
            className="mt-16 md:mt-20 flex flex-wrap justify-center gap-6 md:gap-12 animate-reveal-up"
            style={{ animationDelay: '0.5s' }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text)' }}>
                    {stat.value}
                  </span>
                  {stat.icon && <stat.icon className="w-5 h-5 fill-current" style={{ color: '#FBBF24' }} />}
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="relative px-4 sm:px-6 py-20 md:py-28" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ color: 'var(--primary)', background: 'rgba(13, 148, 136, 0.06)' }}
            >
              {t.landing.features.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
              {t.landing.features.sectionTitle}
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              {t.landing.features.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className="bento-card group animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: feat.bg }}
                  >
                    <feat.icon className="w-7 h-7" style={{ color: feat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1.5" style={{ color: 'var(--text)' }}>
                      {feat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra trust features */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {extraFeatures.map((ef) => (
              <div key={ef.text} className="flex items-center gap-2">
                <ef.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{ef.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative px-4 sm:px-6 py-20 md:py-28 noise-bg" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ color: 'var(--primary)', background: 'rgba(13, 148, 136, 0.06)' }}
            >
              {t.landing.howItWorks.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
              {t.landing.howItWorks.sectionTitle}
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              {t.landing.howItWorks.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px]"
                    style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
                  />
                )}
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110 animate-glow-pulse"
                  style={{
                    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(94, 234, 212, 0.08))',
                    border: '1px solid rgba(13, 148, 136, 0.15)',
                    animationDelay: `${i * 1}s`,
                  }}
                >
                  <step.icon className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'var(--accent)' }}
                >
                  {t.landing.howItWorks.step} {step.number}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-2" style={{ color: 'var(--text)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 sm:px-6 py-20 md:py-28" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ color: 'var(--primary)', background: 'rgba(13, 148, 136, 0.06)' }}
            >
              {t.landing.testimonials.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
              {t.landing.testimonials.sectionTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tst, i) => (
              <div
                key={tst.name}
                className="hover-lift p-6 rounded-2xl animate-fade-in"
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border-light)',
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#FBBF24' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{tst.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: tst.color }}
                  >
                    {tst.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{tst.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{tst.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ color: 'var(--primary)', background: 'rgba(13, 148, 136, 0.06)' }}
            >
              {t.landing.pricing.sectionLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
              {t.landing.pricing.sectionTitle}
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              {t.landing.pricing.sectionSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Monthly */}
            <div className="hover-lift p-7 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{t.landing.pricing.monthly}</h3>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{t.landing.pricing.monthlyDesc}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--text)' }}>{t.landing.pricing.monthlyPrice}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{t.landing.pricing.monthlyPeriod}</span>
              </div>
              <ul className="space-y-3 mb-7">
                {t.landing.pricing.monthlyFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <Check className="w-3 h-3" style={{ color: 'var(--success)' }} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  border: '2px solid var(--border)',
                  color: 'var(--text)',
                  background: 'var(--surface)',
                }}
              >
                {t.landing.pricing.startFree}
              </Link>
            </div>

            {/* Annual */}
            <div
              className="hover-lift p-7 rounded-2xl relative"
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--primary)',
                boxShadow: '0 8px 32px rgba(13, 148, 136, 0.15)',
              }}
            >
              <span
                className="absolute -top-3 right-5 px-3.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--success), #059669)' }}
              >
                {t.landing.pricing.freeMonths}
              </span>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>{t.landing.pricing.annual}</h3>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{t.landing.pricing.annualDesc}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold" style={{ color: 'var(--text)' }}>{t.landing.pricing.annualPrice}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{t.landing.pricing.annualPeriod}</span>
              </div>
              <p className="text-xs mb-6" style={{ color: 'var(--success)' }}>
                {t.landing.pricing.annualSavings}
              </p>
              <ul className="space-y-3 mb-7">
                {t.landing.pricing.annualFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <Check className="w-3 h-3" style={{ color: 'var(--success)' }} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center py-3 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
                }}
              >
                {t.landing.pricing.startFree}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 sm:px-6 py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: 'linear-gradient(135deg, var(--primary), #0F766E, var(--primary-light))',
            backgroundSize: '200% 200%',
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 animate-blob opacity-20"
          style={{ background: 'var(--accent)', filter: 'blur(80px)', animationDelay: '-2s' }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 animate-blob opacity-15"
          style={{ background: 'var(--accent-light)', filter: 'blur(60px)', animationDelay: '-5s' }}
        />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {t.landing.cta.title}
          </h2>
          <p className="text-base md:text-lg text-white/75 mb-10 max-w-lg mx-auto">
            {t.landing.cta.subtitle}
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2.5 py-4 px-10 rounded-2xl font-bold text-base transition-all hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'white',
              color: 'var(--primary)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            {t.landing.cta.button}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                }}
              >
                <Heart className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                Vita<span style={{ color: 'var(--primary)' }}>Log</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                {t.landing.header.features}
              </a>
              <a href="#how-it-works" className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                {t.landing.header.howItWorks}
              </a>
              <a href="#pricing" className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
                {t.landing.header.plans}
              </a>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-light)' }}>
              {t.landing.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
