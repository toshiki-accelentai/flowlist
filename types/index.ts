export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: number;
  columnId: 'todo' | 'in-progress' | 'completed';
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type ColumnId = Task['columnId'];

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}
