'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useKanban } from '@/hooks/useKanban';
import { COLUMNS, SortOption, ViewMode } from '@/lib/constants';
import { Task, ColumnId, Priority } from '@/types';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import BoardToolbar from './BoardToolbar';
import ListView from './ListView';

export default function KanbanBoard() {
  const {
    tasks,
    isHydrated,
    getTasksByColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderInColumn,
  } = useKanban();

  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [sortBy, setSortBy] = useState<SortOption>('manual');
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);

  const handleUpdatePriority = (id: string, priority: Priority) => {
    updateTask(id, { priority });
  };

  const getFilteredSortedTasks = useCallback(
    (columnId: ColumnId): Task[] => {
      let columnTasks = getTasksByColumn(columnId, sortBy);
      if (filterPriority) {
        columnTasks = columnTasks.filter((t) => t.priority === filterPriority);
      }
      return columnTasks;
    },
    [getTasksByColumn, sortBy, filterPriority]
  );

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);

    if (isOverColumn) {
      const targetColumnId = overId as ColumnId;
      if (activeTask.columnId !== targetColumnId) {
        const targetTasks = getTasksByColumn(targetColumnId);
        moveTask(activeId, targetColumnId, targetTasks.length);
      }
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask && activeTask.columnId !== overTask.columnId) {
        const targetTasks = getTasksByColumn(overTask.columnId);
        const overIndex = targetTasks.findIndex((t) => t.id === overId);
        moveTask(activeId, overTask.columnId, overIndex);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
      reorderInColumn(activeTask.columnId, activeId, overId);
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-full p-4">
        <div className="flex gap-4 h-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 bg-zinc-900 rounded border border-zinc-800 p-3"
            >
              <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[1, 2].map((j) => (
                  <div
                    key={j}
                    className="h-20 bg-zinc-800 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <BoardToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
      />

      {viewMode === 'kanban' ? (
        <div className="flex-1 p-4 overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full">
              {COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getFilteredSortedTasks(column.id)}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onUpdatePriority={handleUpdatePriority}
                  sortBy={sortBy}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <KanbanCard task={activeTask} isDragging />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      ) : (
        <ListView
          getTasksByColumn={(columnId) => getFilteredSortedTasks(columnId)}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onUpdatePriority={handleUpdatePriority}
        />
      )}
    </div>
  );
}
