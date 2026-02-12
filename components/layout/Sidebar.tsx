'use client';

import TodoList from '../todos/TodoList';
import { useAuth } from '../auth/AuthProvider';

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="w-72 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-medium text-zinc-50">Flowlist</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <TodoList />
      </div>
      {user && (
        <div className="p-3 border-t border-zinc-800 flex items-center gap-2">
          <span className="text-xs text-zinc-500 truncate flex-1">{user.email}</span>
          <button
            onClick={signOut}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
