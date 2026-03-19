'use client';

import { useState } from 'react';
import { useHealthEntries } from '@/hooks/useHealthEntries';
import { EntryCard } from '@/components/entries/EntryCard';
import { EntryForm } from '@/components/entries/EntryForm';
import { Plus, Heart, ClipboardList, Pill, Activity } from 'lucide-react';
import { getGreeting } from '@/lib/utils';
import Link from 'next/link';

export default function HomePage() {
  const { entries, loading, createEntry, deleteEntry } = useHealthEntries();
  const [formOpen, setFormOpen] = useState(false);

  const todayEntries = entries.filter((e) => {
    const entryDate = new Date(e.entry_date).toDateString();
    return entryDate === new Date().toDateString();
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {getGreeting()} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {todayEntries.length === 0
            ? 'Ainda sem registros hoje. Como você está?'
            : `${todayEntries.length} registro${todayEntries.length > 1 ? 's' : ''} hoje`}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => setFormOpen(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:shadow-md cursor-pointer group"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'rgba(13, 148, 136, 0.1)' }}
          >
            <Plus className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Registrar
          </span>
        </button>

        <Link
          href="/reports"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:shadow-md group"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'rgba(59, 130, 246, 0.1)' }}
          >
            <ClipboardList className="w-5 h-5" style={{ color: 'var(--info)' }} />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Relatório
          </span>
        </Link>

        <Link
          href="/medications"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:shadow-md group"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'rgba(245, 158, 11, 0.1)' }}
          >
            <Pill className="w-5 h-5" style={{ color: 'var(--warning)' }} />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Medicamentos
          </span>
        </Link>

        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:shadow-md group"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'rgba(16, 185, 129, 0.1)' }}
          >
            <Activity className="w-5 h-5" style={{ color: 'var(--success)' }} />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Evolução
          </span>
        </Link>
      </div>

      {/* Feed */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
          Seus registros
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'rgba(13, 148, 136, 0.08)' }}
            >
              <Heart className="w-8 h-8" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>
              Seu diário está vazio
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
              Comece registrando como você está se sentindo hoje.
            </p>
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              }}
            >
              <Plus className="w-4 h-4" /> Primeiro registro
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, i) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={i}
                onDelete={deleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      {entries.length > 0 && (
        <button
          onClick={() => setFormOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105 z-40"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4)',
          }}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Entry form modal */}
      <EntryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createEntry}
      />
    </div>
  );
}
