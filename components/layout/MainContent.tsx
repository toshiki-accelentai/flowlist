'use client';

import { useState } from 'react';
import KanbanBoard from '../kanban/KanbanBoard';
import NotesArea from '../notes/NotesArea';

export default function MainContent() {
  const [showNotes, setShowNotes] = useState(true);

  return (
    <main className="flex-1 flex overflow-hidden relative">
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>

      {showNotes && (
        <div className="w-80 border-l border-zinc-800 flex-shrink-0">
          <NotesArea />
        </div>
      )}

      <button
        onClick={() => setShowNotes(!showNotes)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors"
        title={showNotes ? 'Hide notes' : 'Show notes'}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {showNotes ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>
    </main>
  );
}
