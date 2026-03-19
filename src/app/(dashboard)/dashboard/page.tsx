'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HealthEntry } from '@/types';
import { SYMPTOM_CATEGORIES } from '@/types';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PERIODS = [
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: '90 dias', days: 90 },
];

export default function DashboardPage() {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const since = subDays(new Date(), period).toISOString();
    const { data } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', since)
      .order('entry_date', { ascending: true });

    setEntries(data || []);
    setLoading(false);
  }, [supabase, period]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // Prepare chart data: group by day
  const chartData = (() => {
    const days: Record<string, { date: string; avgIntensity: number; count: number; total: number }> = {};

    for (let i = period - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      days[d] = { date: d, avgIntensity: 0, count: 0, total: 0 };
    }

    entries.forEach((e) => {
      const d = format(new Date(e.entry_date), 'yyyy-MM-dd');
      if (days[d]) {
        days[d].count++;
        days[d].total += e.intensity || 0;
        days[d].avgIntensity = days[d].total / days[d].count;
      }
    });

    return Object.values(days).map((d) => ({
      ...d,
      label: format(new Date(d.date), 'dd/MM', { locale: ptBR }),
      avgIntensity: Math.round(d.avgIntensity * 10) / 10,
    }));
  })();

  // Category breakdown
  const categoryStats = (() => {
    const stats: Record<string, number> = {};
    entries.forEach((e) => {
      const cat = e.category || 'outros';
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([cat, count]) => ({
        category: SYMPTOM_CATEGORIES.find((c) => c.value === cat) || SYMPTOM_CATEGORIES[SYMPTOM_CATEGORIES.length - 1],
        count,
      }))
      .sort((a, b) => b.count - a.count);
  })();

  const avgIntensity = entries.length > 0
    ? Math.round((entries.reduce((sum, e) => sum + (e.intensity || 0), 0) / entries.length) * 10) / 10
    : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Evolução</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Acompanhe seus padrões de saúde</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--border-light)' }}>
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setPeriod(p.days)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
              style={{
                background: period === p.days ? 'var(--surface)' : 'transparent',
                color: period === p.days ? 'var(--primary)' : 'var(--muted)',
                boxShadow: period === p.days ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Total registros</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{entries.length}</p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Intensidade média</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{avgIntensity || '—'}</p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Categorias</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{categoryStats.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="skeleton h-64 rounded-2xl mb-6" />
      ) : (
        <>
          {/* Intensity chart */}
          <div className="p-5 rounded-2xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Intensidade ao longo do tempo</h3>
            </div>
            {entries.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8F5F3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B8E8B' }} tickLine={false} axisLine={false} interval={period > 30 ? 6 : period > 14 ? 2 : 0} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#6B8E8B' }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid #D1E8E5',
                      borderRadius: '10px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(13, 148, 136, 0.1)',
                    }}
                    formatter={(value: any) => [value, 'Intensidade']}
                  />
                  <Area type="monotone" dataKey="avgIntensity" stroke="#0D9488" strokeWidth={2} fill="url(#intensityGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48" style={{ color: 'var(--muted)' }}>
                <p className="text-sm">Sem dados nesse período</p>
              </div>
            )}
          </div>

          {/* Registros per day chart */}
          <div className="p-5 rounded-2xl mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Registros por dia</h3>
            </div>
            {entries.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5EEAD4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5EEAD4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8F5F3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B8E8B' }} tickLine={false} axisLine={false} interval={period > 30 ? 6 : period > 14 ? 2 : 0} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B8E8B' }} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #D1E8E5', borderRadius: '10px', fontSize: '12px' }} formatter={(value: any) => [value, 'Registros']} />
                  <Area type="monotone" dataKey="count" stroke="#5EEAD4" strokeWidth={2} fill="url(#countGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-44" style={{ color: 'var(--muted)' }}>
                <p className="text-sm">Sem dados nesse período</p>
              </div>
            )}
          </div>

          {/* Category breakdown */}
          {categoryStats.length > 0 && (
            <div className="p-5 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Por categoria</h3>
              <div className="space-y-3">
                {categoryStats.map(({ category, count }) => (
                  <div key={category.value} className="flex items-center gap-3">
                    <span className="text-lg">{category.emoji}</span>
                    <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{category.label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border-light)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / entries.length) * 100}%`,
                          background: category.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8 text-right" style={{ color: 'var(--muted)' }}>{count}</span>
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
