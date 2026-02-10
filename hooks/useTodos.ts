'use client';

import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useLocalStorage } from './useLocalStorage';
import { Todo } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

export function useTodos() {
  const [todos, setTodos, isHydrated] = useLocalStorage<Todo[]>(
    STORAGE_KEYS.TODOS,
    []
  );

  const addTodo = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const newTodo: Todo = {
        id: nanoid(),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      setTodos((prev) => [newTodo, ...prev]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  return {
    todos,
    isHydrated,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
}
