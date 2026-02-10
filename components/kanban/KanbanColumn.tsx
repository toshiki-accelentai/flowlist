'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, Column, ColumnId, Priority } from '@/types';
import { SortOption } from '@/lib/constants';
import KanbanCard from './KanbanCard';
import AddCardForm from './AddCardForm';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (title: string, columnId: ColumnId, description?: string, priority?: Priority, dueDate?: number) => void;
  onDeleteTask: (id: string) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  sortBy?: SortOption;
}

export default function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdatePriority,
}: KanbanColumnProps) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 min-w-0 bg-zinc-900 rounded border border-zinc-800 overflow-hidden ${
        isOver ? 'border-zinc-600' : ''
      }`}
    >
      <div className={`h-1 ${column.color}`} />
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
        <h3 className="text-sm font-medium text-zinc-300 flex-1">{column.title}</h3>
        <span className="text-xs text-zinc-500">{tasks.length}</span>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="text-zinc-500 hover:text-zinc-300"
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

      <div className="flex-1 p-2 overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {isAddFormOpen && (
            <div className="mb-2">
              <AddCardForm
                onAdd={(title, description, priority, dueDate) => onAddTask(title, column.id, description, priority, dueDate)}
                isOpen={isAddFormOpen}
                onOpenChange={setIsAddFormOpen}
              />
            </div>
          )}
          {tasks.length === 0 && !isAddFormOpen ? (
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="w-full text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 text-center py-4 border border-dashed border-zinc-700 rounded transition-colors"
            >
              + Add a task
            </button>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onUpdatePriority={onUpdatePriority}
                />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
