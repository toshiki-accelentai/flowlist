'use client';

import { useCallback, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useLocalStorage } from './useLocalStorage';
import { Note } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

export function useNotes() {
  const [notes, setNotes, isHydrated] = useLocalStorage<Note[]>(
    STORAGE_KEYS.NOTES,
    []
  );

  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      debounceTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: nanoid(),
      title: 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    return newNote.id;
  }, [setNotes]);

  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, ...updates, updatedAt: Date.now() }
            : note
        )
      );
    },
    [setNotes]
  );

  const updateNoteDebounced = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
      const existingTimer = debounceTimers.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        updateNote(id, updates);
        debounceTimers.current.delete(id);
      }, 500);

      debounceTimers.current.set(id, timer);
    },
    [updateNote]
  );

  const deleteNote = useCallback(
    (id: string) => {
      const timer = debounceTimers.current.get(id);
      if (timer) {
        clearTimeout(timer);
        debounceTimers.current.delete(id);
      }
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes]
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
