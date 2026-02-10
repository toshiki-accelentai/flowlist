'use client';

import KanbanBoard from '../kanban/KanbanBoard';
import NotesArea from '../notes/NotesArea';

export default function MainContent() {
  return (
    <main className="flex-1 flex overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
      <div className="w-80 border-l border-zinc-800 flex-shrink-0">
        <NotesArea />
      </div>
    </main>
  );
}
