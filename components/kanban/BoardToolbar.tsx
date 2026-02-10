'use client';

import { SortOption, ViewMode, SORT_OPTIONS, PRIORITIES } from '@/lib/constants';
import { Priority } from '@/types';
import { cn } from '@/lib/utils';

interface BoardToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterPriority: Priority | null;
  onFilterPriorityChange: (priority: Priority | null) => void;
}

export default function BoardToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filterPriority,
  onFilterPriorityChange,
}: BoardToolbarProps) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-0">
      {/* View toggle */}
      <div className="flex items-center bg-zinc-800 rounded border border-zinc-700 p-0.5">
        <button
          onClick={() => onViewModeChange('kanban')}
          className={cn(
            'p-1.5 rounded transition-colors',
            viewMode === 'kanban'
              ? 'bg-zinc-700 text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
          title="Board view"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={cn(
            'p-1.5 rounded transition-colors',
            viewMode === 'list'
              ? 'bg-zinc-700 text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
          title="List view"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wide">Sort</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-600 [color-scheme:dark]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter by priority */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-zinc-500 uppercase tracking-wide">Filter</span>
        <div className="flex gap-0.5">
          <button
            onClick={() => onFilterPriorityChange(null)}
            className={cn(
              'px-2 py-1 rounded text-[11px] font-medium transition-colors border',
              filterPriority === null
                ? 'bg-zinc-700 text-zinc-100 border-zinc-600'
                : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50 hover:text-zinc-400'
            )}
          >
            All
          </button>
          {PRIORITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => onFilterPriorityChange(filterPriority === p.id ? null : p.id)}
              className={cn(
                'px-2 py-1 rounded text-[11px] font-medium transition-colors border',
                filterPriority === p.id
                  ? cn(p.bgColor, p.textColor, p.borderColor)
                  : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50 hover:text-zinc-400'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
