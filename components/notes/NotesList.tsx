'use client';

import { Note } from '@/types';
import { cn } from '@/lib/utils';

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export default function NotesList({
  notes,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
}: NotesListProps) {
  return (
    <div className="border-b border-zinc-800">
      <div className="p-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">Notes</h3>
        <button
          onClick={onAdd}
          className="text-zinc-500 hover:text-zinc-300 p-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div className="px-2 pb-2 overflow-x-auto">
        {notes.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center py-2">No notes</p>
        ) : (
          <div className="flex gap-1">
            {notes.map((note) => (
              <button
                key={note.id}
                className={cn(
                  'group flex items-center gap-1 rounded px-2 py-1 text-sm whitespace-nowrap',
                  selectedId === note.id
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                )}
                onClick={() => onSelect(note.id)}
              >
                <span className="truncate max-w-24">
                  {note.title || 'Untitled'}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
