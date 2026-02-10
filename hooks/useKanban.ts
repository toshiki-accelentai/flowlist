'use client';

import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useLocalStorage } from './useLocalStorage';
import { Task, ColumnId, Priority } from '@/types';
import { STORAGE_KEYS, SortOption, PRIORITY_ORDER } from '@/lib/constants';

export function useKanban() {
  const [tasks, setTasks, isHydrated] = useLocalStorage<Task[]>(
    STORAGE_KEYS.TASKS,
    []
  );

  const sortTasks = useCallback(
    (taskList: Task[], sortBy: SortOption): Task[] => {
      if (sortBy === 'manual') {
        return taskList.sort((a, b) => a.order - b.order);
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
    (title: string, columnId: ColumnId, description?: string, priority: Priority = 'medium', dueDate?: number) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const columnTasks = tasks.filter((t) => t.columnId === columnId);
      const maxOrder = columnTasks.reduce(
        (max, t) => Math.max(max, t.order),
        -1
      );

      const newTask: Task = {
        id: nanoid(),
        title: trimmed,
        description: description?.trim() || undefined,
        priority,
        dueDate,
        columnId,
        order: maxOrder + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setTasks((prev) => [...prev, newTask]);
    },
    [tasks, setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: Date.now() }
            : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const moveTask = useCallback(
    (taskId: string, targetColumnId: ColumnId, targetIndex: number) => {
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

        return [...otherTasks, ...reorderedTargetTasks];
      });
    },
    [setTasks]
  );

  const reorderInColumn = useCallback(
    (columnId: ColumnId, activeId: string, overId: string) => {
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

        return [...otherTasks, ...reorderedTasks];
      });
    },
    [setTasks]
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
