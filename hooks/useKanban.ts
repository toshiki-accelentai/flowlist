'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Task, ColumnId, Priority } from '@/types';
import { SortOption, PRIORITY_ORDER } from '@/lib/constants';

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch tasks on mount
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .order('order', { ascending: true });

      if (data) {
        setTasks(data.map(mapDbToTask));
      }
      setIsHydrated(true);
    };

    fetchTasks();
  }, [user, supabase]);

  const sortTasks = useCallback(
    (taskList: Task[], sortBy: SortOption): Task[] => {
      if (sortBy === 'manual') {
        return [...taskList].sort((a, b) => a.order - b.order);
      }
      return [...taskList].sort((a, b) => {
        if (sortBy === 'due-date') {
          if (!a.dueDate && !b.dueDate) return a.order - b.order;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate - b.dueDate;
        }
        if (sortBy === 'date-added') {
          return a.createdAt - b.createdAt;
        }
        if (sortBy === 'priority') {
          const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          return diff !== 0 ? diff : a.order - b.order;
        }
        return a.order - b.order;
      });
    },
    []
  );

  const getTasksByColumn = useCallback(
    (columnId: ColumnId, sortBy: SortOption = 'manual'): Task[] => {
      const columnTasks = tasks.filter((task) => task.columnId === columnId);
      return sortTasks(columnTasks, sortBy);
    },
    [tasks, sortTasks]
  );

  const addTask = useCallback(
    async (title: string, columnId: ColumnId, description?: string, priority: Priority = 'medium', dueDate?: number) => {
      const trimmed = title.trim();
      if (!trimmed || !user) return;

      const columnTasks = tasks.filter((t) => t.columnId === columnId);
      const maxOrder = columnTasks.reduce((max, t) => Math.max(max, t.order), -1);

      const now = new Date().toISOString();
      const dbRow = {
        user_id: user.id,
        title: trimmed,
        description: description?.trim() || null,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        column_id: columnId,
        order: maxOrder + 1,
        created_at: now,
        updated_at: now,
      };

      const { data } = await supabase.from('tasks').insert(dbRow).select().single();
      if (data) {
        setTasks((prev) => [...prev, mapDbToTask(data)]);
      }
    },
    [tasks, user, supabase]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>) => {
      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description || null;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate ? new Date(updates.dueDate).toISOString() : null;

      await supabase.from('tasks').update(dbUpdates).eq('id', id);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
        )
      );
    },
    [supabase]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await supabase.from('tasks').delete().eq('id', id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [supabase]
  );

  const moveTask = useCallback(
    async (taskId: string, targetColumnId: ColumnId, targetIndex: number) => {
      setTasks((prev) => {
        const taskToMove = prev.find((t) => t.id === taskId);
        if (!taskToMove) return prev;

        const targetColumnTasks = prev
          .filter((t) => t.columnId === targetColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        targetColumnTasks.splice(targetIndex, 0, {
          ...taskToMove,
          columnId: targetColumnId,
          updatedAt: Date.now(),
        });

        const reorderedTargetTasks = targetColumnTasks.map((task, index) => ({
          ...task,
          order: index,
        }));

        const otherTasks = prev.filter(
          (t) => t.columnId !== targetColumnId && t.id !== taskId
        );

        const newTasks = [...otherTasks, ...reorderedTargetTasks];

        // Persist to Supabase
        reorderedTargetTasks.forEach((t) => {
          supabase.from('tasks').update({
            column_id: t.columnId,
            order: t.order,
            updated_at: new Date().toISOString(),
          }).eq('id', t.id).then(() => {});
        });

        return newTasks;
      });
    },
    [supabase]
  );

  const reorderInColumn = useCallback(
    async (columnId: ColumnId, activeId: string, overId: string) => {
      setTasks((prev) => {
        const columnTasks = prev
          .filter((t) => t.columnId === columnId)
          .sort((a, b) => a.order - b.order);

        const activeIndex = columnTasks.findIndex((t) => t.id === activeId);
        const overIndex = columnTasks.findIndex((t) => t.id === overId);

        if (activeIndex === -1 || overIndex === -1) return prev;

        const [movedTask] = columnTasks.splice(activeIndex, 1);
        columnTasks.splice(overIndex, 0, movedTask);

        const reorderedTasks = columnTasks.map((task, index) => ({
          ...task,
          order: index,
          updatedAt: Date.now(),
        }));

        const otherTasks = prev.filter((t) => t.columnId !== columnId);

        // Persist to Supabase
        reorderedTasks.forEach((t) => {
          supabase.from('tasks').update({
            order: t.order,
            updated_at: new Date().toISOString(),
          }).eq('id', t.id).then(() => {});
        });

        return [...otherTasks, ...reorderedTasks];
      });
    },
    [supabase]
  );

  return {
    tasks,
    isHydrated,
    getTasksByColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderInColumn,
  };
}

// Map Supabase row to frontend Task type
function mapDbToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || undefined,
    priority: row.priority as Priority,
    dueDate: row.due_date ? new Date(row.due_date as string).getTime() : undefined,
    columnId: row.column_id as ColumnId,
    order: row.order as number,
    createdAt: new Date(row.created_at as string).getTime(),
    updatedAt: new Date(row.updated_at as string).getTime(),
  };
}
