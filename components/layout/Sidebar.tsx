'use client';

import TodoList from '../todos/TodoList';

export default function Sidebar() {
  return (
    <aside className="w-72 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-lg font-medium text-zinc-50">Flowlist</h1>
      </div>
      <div className="flex-1 overflow-hidden">
        <TodoList />
      </div>
    </aside>
  );
}
