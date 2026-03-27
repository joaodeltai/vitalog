'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError(t.signup.passwordTooShort);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/onboarding');
    router.refresh();
  }

  async function handleGoogleSignup() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', boxShadow: '0 8px 24px rgba(13, 148, 136, 0.3)' }}
        >
          <Heart className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {t.signup.createAccount}
        </h1>
        <p className="mt-1" style={{ color: 'var(--muted)' }}>
          {t.signup.subtitle}
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text)',
            background: 'var(--background)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.1a6.94 6.94 0 0 1 0-4.24V7.02H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77-.01-.53z" fill="#FBBC05"/>
            <path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" fill="#EA4335"/>
          </svg>
          {t.signup.googleSignup}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{t.signup.or}</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div
              className="p-3 rounded-xl text-sm animate-scale-in"
              style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t.signup.fullName}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-light)' }} />
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.signup.fullNamePlaceholder}
                required
                className="w-full py-3 pl-11 pr-4 rounded-xl text-sm transition-all duration-200 outline-none"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t.signup.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-light)' }} />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.signup.emailPlaceholder}
                required
                className="w-full py-3 pl-11 pr-4 rounded-xl text-sm transition-all duration-200 outline-none"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              {t.signup.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--muted-light)' }} />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.signup.passwordPlaceholder}
                required
                minLength={6}
                className="w-full py-3 pl-11 pr-12 rounded-xl text-sm transition-all duration-200 outline-none"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--muted-light)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
            ) : (
              t.signup.startFree
            )}
          </button>
        </form>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--muted)' }}>
          {t.signup.terms}{' '}
          <a href="#" className="underline">{t.signup.termsOfUse}</a> {t.signup.and}{' '}
          <a href="#" className="underline">{t.signup.privacyPolicy}</a>.
        </p>
      </div>

      {/* Footer link */}
      <p className="text-center mt-6 text-sm" style={{ color: 'var(--muted)' }}>
        {t.signup.hasAccount}{' '}
        <Link
          href="/login"
          className="font-semibold transition-colors hover:underline"
          style={{ color: 'var(--primary)' }}
        >
          {t.signup.login}
        </Link>
      </p>
    </div>
  );
}
