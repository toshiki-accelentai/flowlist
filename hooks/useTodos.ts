'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Todo } from '@/types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      const { data } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setTodos(data.map(mapDbToTodo));
      }
      setIsHydrated(true);
    };

    fetchTodos();
  }, [user, supabase]);

  const addTodo = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !user) return;

      const { data } = await supabase
        .from('todos')
        .insert({
          user_id: user.id,
          text: trimmed,
          completed: false,
        })
        .select()
        .single();

      if (data) {
        setTodos((prev) => [mapDbToTodo(data), ...prev]);
      }
    },
    [user, supabase]
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      await supabase.from('todos').update({ completed: !todo.completed }).eq('id', id);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [todos, supabase]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      await supabase.from('todos').delete().eq('id', id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [supabase]
  );

  const clearCompleted = useCallback(async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;

    await supabase.from('todos').delete().in('id', completedIds);
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, [todos, supabase]);

  return {
    todos,
    isHydrated,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
}

function mapDbToTodo(row: Record<string, unknown>): Todo {
  return {
    id: row.id as string,
    text: row.text as string,
    completed: row.completed as boolean,
    createdAt: new Date(row.created_at as string).getTime(),
  };
}
