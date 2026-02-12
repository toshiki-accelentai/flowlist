'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Note } from '@/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      debounceTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setNotes(data.map(mapDbToNote));
      }
      setIsHydrated(true);
    };

    fetchNotes();
  }, [user, supabase]);

  const addNote = useCallback(async () => {
    if (!user) return '';

    const { data } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: 'Untitled',
        content: '',
      })
      .select()
      .single();

    if (data) {
      const note = mapDbToNote(data);
      setNotes((prev) => [note, ...prev]);
      return note.id;
    }
    return '';
  }, [user, supabase]);

  const updateNote = useCallback(
    async (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content = updates.content;

      await supabase.from('notes').update(dbUpdates).eq('id', id);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
        )
      );
    },
    [supabase]
  );

  const updateNoteDebounced = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      // Update local state immediately for responsiveness
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
        )
      );

      const existingTimer = debounceTimers.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        supabase.from('notes').update(dbUpdates).eq('id', id).then(() => {});
        debounceTimers.current.delete(id);
      }, 500);

      debounceTimers.current.set(id, timer);
    },
    [supabase]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      const timer = debounceTimers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        debounceTimers.current.delete(id);
      }
      await supabase.from('notes').delete().eq('id', id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [supabase]
  );

  return {
    notes,
    isHydrated,
    addNote,
    updateNote,
    updateNoteDebounced,
    deleteNote,
  };
}

function mapDbToNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    createdAt: new Date(row.created_at as string).getTime(),
    updatedAt: new Date(row.updated_at as string).getTime(),
  };
}
