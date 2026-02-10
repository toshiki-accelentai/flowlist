'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Priority } from '@/types';
import { PRIORITIES, PRIORITY_MAP } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface KanbanCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onUpdatePriority?: (id: string, priority: Priority) => void;
  isDragging?: boolean;
}

export default function KanbanCard({
  task,
  onDelete,
  onUpdatePriority,
  isDragging,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;

  const cyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdatePriority) return;
    const currentIndex = PRIORITIES.findIndex((p) => p.id === task.priority);
    const nextIndex = (currentIndex + 1) % PRIORITIES.length;
    onUpdatePriority(task.id, PRIORITIES[nextIndex].id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative bg-zinc-800 border border-zinc-700 rounded overflow-hidden cursor-grab active:cursor-grabbing',
        (isDragging || isSortableDragging) && 'opacity-50',
        isDragging && 'shadow-sm ring-1 ring-zinc-600'
      )}
    >
      {/* Priority accent — thin left edge bar */}
      <div className={cn('absolute inset-y-0 left-0 w-[3px]', priority.color)} />

      <div className="pl-3 pr-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm text-zinc-100">{task.title}</h4>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-300 -mt-1 -mr-1 shrink-0"
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
          )}
        </div>
        {task.description && (
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {/* Priority badge — clickable to cycle */}
          <button
            onClick={cyclePriority}
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase transition-colors',
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

          {/* Due date label */}
          {task.dueDate && (() => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const dueDateDay = new Date(
              new Date(task.dueDate).getFullYear(),
              new Date(task.dueDate).getMonth(),
              new Date(task.dueDate).getDate()
            ).getTime();
            const isOverdue = dueDateDay < today && task.columnId !== 'completed';
            const isDueToday = dueDateDay === today && task.columnId !== 'completed';
            const formatted = new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <span className={cn(
                'inline-flex items-center gap-1 text-[10px]',
                isOverdue ? 'text-red-400' : isDueToday ? 'text-amber-400' : 'text-zinc-500'
              )}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatted}
              </span>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
