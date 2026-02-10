import { Column, ColumnId, Priority } from '@/types';

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'Todo', color: 'bg-blue-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-500' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-500' },
];

export interface PriorityConfig {
  id: Priority;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
}

export const PRIORITIES: PriorityConfig[] = [
  {
    id: 'urgent',
    label: 'Urgent',
    color: 'bg-red-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    dotColor: 'bg-red-400',
  },
  {
    id: 'high',
    label: 'High',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    dotColor: 'bg-orange-400',
  },
  {
    id: 'medium',
    label: 'Medium',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    dotColor: 'bg-yellow-400',
  },
  {
    id: 'low',
    label: 'Low',
    color: 'bg-slate-500',
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    dotColor: 'bg-slate-400',
  },
];

export const PRIORITY_MAP = Object.fromEntries(
  PRIORITIES.map((p) => [p.id, p])
) as Record<Priority, PriorityConfig>;

export const COLUMN_IDS: ColumnId[] = ['todo', 'in-progress', 'completed'];

export type SortOption = 'manual' | 'due-date' | 'date-added' | 'priority';
export type ViewMode = 'kanban' | 'list';

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'manual', label: 'Manual' },
  { id: 'due-date', label: 'Due Date' },
  { id: 'date-added', label: 'Date Added' },
  { id: 'priority', label: 'Priority' },
];

export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const STORAGE_KEYS = {
  TASKS: 'vibe-coder-tasks',
  TODOS: 'vibe-coder-todos',
  NOTES: 'vibe-coder-notes',
} as const;
