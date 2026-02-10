'use client';

import { Todo } from '@/types';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="group flex items-center gap-2 p-2 rounded hover:bg-zinc-800">
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          'w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center',
          todo.completed
            ? 'bg-blue-500 border-blue-500'
            : 'border-zinc-600 hover:border-zinc-400'
        )}
      >
        {todo.completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <span
        className={cn(
          'flex-1 text-sm truncate',
          todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
        )}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-300"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}
