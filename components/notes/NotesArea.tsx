'use client';

import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';

export default function NotesArea() {
  const {
    notes,
    isHydrated,
    addNote,
    updateNoteDebounced,
    deleteNote,
  } = useNotes();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const handleAddNote = async () => {
    const id = await addNote();
    setSelectedNoteId(id);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex flex-col h-full bg-zinc-900">
        <div className="p-2 border-b border-zinc-800">
          <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-3">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-24 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <NotesList
        notes={notes}
        selectedId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onAdd={handleAddNote}
        onDelete={handleDeleteNote}
      />
      <NoteEditor
        note={selectedNote}
        onUpdate={updateNoteDebounced}
      />
    </div>
  );
}
