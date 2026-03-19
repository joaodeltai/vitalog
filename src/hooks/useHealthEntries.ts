'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HealthEntry } from '@/types';

export function useHealthEntries() {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error: err } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(50);

    if (err) {
      setError(err.message);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function createEntry(entry: {
    content_raw: string;
    symptoms?: string[];
    category?: string;
    intensity?: number;
    content_parsed?: Record<string, unknown>;
    ai_processed?: boolean;
    notes?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error: err } = await supabase
      .from('health_entries')
      .insert({
        user_id: user.id,
        ...entry,
      })
      .select()
      .single();

    if (err) throw err;
    setEntries((prev) => [data, ...prev]);
    return data;
  }

  async function deleteEntry(id: string) {
    const { error: err } = await supabase
      .from('health_entries')
      .delete()
      .eq('id', id);

    if (err) throw err;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return { entries, loading, error, createEntry, deleteEntry, refetch: fetchEntries };
}
