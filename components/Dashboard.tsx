'use client';

import Sidebar from './layout/Sidebar';
import MainContent from './layout/MainContent';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar />
      <MainContent />
    </div>
  );
}
