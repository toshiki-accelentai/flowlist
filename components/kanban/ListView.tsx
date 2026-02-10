'use client';

import { useState } from 'react';
import { Task, Priority, ColumnId } from '@/types';
import { COLUMNS, PRIORITY_MAP, PRIORITIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import AddCardForm from './AddCardForm';

interface ListViewProps {
  getTasksByColumn: (columnId: ColumnId) => Task[];
  onAddTask: (title: string, columnId: ColumnId, description?: string, priority?: Priority, dueDate?: number) => void;
  onDeleteTask: (id: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
}

export default function ListView({
  getTasksByColumn,
  onAddTask,
  onDeleteTask,
  onUpdatePriority,
}: ListViewProps) {
  const [addFormOpenFor, setAddFormOpenFor] = useState<ColumnId | null>(null);
  const cyclePriority = (task: Task) => {
    const currentIndex = PRIORITIES.findIndex((p) => p.id === task.priority);
    const nextIndex = (currentIndex + 1) % PRIORITIES.length;
    onUpdatePriority(task.id, PRIORITIES[nextIndex].id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDueDateStyle = (task: Task) => {
    if (!task.dueDate || task.columnId === 'completed') return 'text-zinc-500';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dueDateDay = new Date(
      new Date(task.dueDate).getFullYear(),
      new Date(task.dueDate).getMonth(),
      new Date(task.dueDate).getDate()
    ).getTime();
    if (dueDateDay < today) return 'text-red-400';
    if (dueDateDay === today) return 'text-amber-400';
    return 'text-zinc-500';
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="space-y-6">
        {COLUMNS.map((column) => {
          const tasks = getTasksByColumn(column.id);
          return (
            <div key={column.id}>
              {/* Section header */}
              <div className="flex items-center gap-2 mb-2">
                <div className={cn('w-2 h-2 rounded-full', column.color)} />
                <h3 className="text-sm font-medium text-zinc-300">{column.title}</h3>
                <span className="text-xs text-zinc-500">{tasks.length}</span>
                <button
                  onClick={() => setAddFormOpenFor(addFormOpenFor === column.id ? null : column.id)}
                  className="text-zinc-500 hover:text-zinc-300 ml-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {addFormOpenFor === column.id && (
                <div className="mb-2 pl-4 max-w-md">
                  <AddCardForm
                    onAdd={(title, description, priority, dueDate) => {
                      onAddTask(title, column.id, description, priority, dueDate);
                      setAddFormOpenFor(null);
                    }}
                    isOpen={true}
                    onOpenChange={(open) => { if (!open) setAddFormOpenFor(null); }}
                  />
                </div>
              )}

              {tasks.length === 0 && addFormOpenFor !== column.id ? (
                <button
                  onClick={() => setAddFormOpenFor(column.id)}
                  className="w-full text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 text-center py-4 border border-dashed border-zinc-700 rounded transition-colors"
                >
                  + Add a task
                </button>
              ) : tasks.length > 0 ? (
                <div className="border border-zinc-800 rounded overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-2 px-3 py-2 bg-zinc-900/50 border-b border-zinc-800 text-[11px] text-zinc-500 uppercase tracking-wide">
                    <span>Title</span>
                    <span>Priority</span>
                    <span>Due Date</span>
                    <span>Added</span>
                    <span />
                  </div>

                  {/* Rows */}
                  {tasks.map((task) => {
                    const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;
                    return (
                      <div
                        key={task.id}
                        className="group grid grid-cols-[1fr_100px_100px_100px_40px] gap-2 px-3 py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 items-center"
                      >
                        {/* Title + description */}
                        <div className="min-w-0">
                          <p className="text-sm text-zinc-100 truncate">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-zinc-500 truncate">{task.description}</p>
                          )}
                        </div>

                        {/* Priority badge */}
                        <button
                          onClick={() => cyclePriority(task)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase transition-colors w-fit',
                            priority.bgColor,
                            priority.textColor,
                            'border',
                            priority.borderColor,
                            'hover:brightness-125'
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full', priority.dotColor)} />
                          {priority.label}
                        </button>

                        {/* Due date */}
                        <span className={cn('text-xs', getDueDateStyle(task))}>
                          {task.dueDate ? formatDate(task.dueDate) : '—'}
                        </span>

                        {/* Date added */}
                        <span className="text-xs text-zinc-500">
                          {formatDate(task.createdAt)}
                        </span>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-300 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
