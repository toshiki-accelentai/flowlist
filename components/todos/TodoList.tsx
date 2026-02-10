'use client';

import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';

export default function TodoList() {
  const { todos, isHydrated, addTodo, toggleTodo, deleteTodo, clearCompleted } =
    useTodos();

  const completedCount = todos.filter((t) => t.completed).length;

  if (!isHydrated) {
    return (
      <div className="p-4">
        <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-400">Quick Tasks</h2>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear done
            </button>
          )}
        </div>
        <AddTodoForm onAdd={addTodo} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {todos.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">
            No tasks yet
          </p>
        ) : (
          <ul className="space-y-1">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
