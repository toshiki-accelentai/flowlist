'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { Priority } from '@/types';
import { PRIORITIES, PRIORITY_MAP } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AddCardFormProps {
  onAdd: (title: string, description?: string, priority?: Priority, dueDate?: number) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AddCardForm({ onAdd, isOpen: controlledIsOpen, onOpenChange }: AddCardFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (title.trim()) {
      const dueDateTimestamp = dueDate ? new Date(dueDate + 'T00:00:00').getTime() : undefined;
      onAdd(title, description || undefined, priority, dueDateTimestamp);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Card title"
        autoFocus
        className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
      />

      {/* Due date */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-600 [color-scheme:dark]"
      />

      {/* Priority selector */}
      <div className="flex gap-1">
        {PRIORITIES.map((p) => {
          const isSelected = priority === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPriority(p.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-1 py-1.5 rounded text-[11px] font-medium transition-all border',
                isSelected
                  ? cn(p.bgColor, p.textColor, p.borderColor)
                  : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50 hover:text-zinc-400 hover:border-zinc-600'
              )}
            >
              <span className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                isSelected ? p.dotColor : 'bg-zinc-600'
              )} />
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-zinc-400 text-sm hover:text-zinc-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
