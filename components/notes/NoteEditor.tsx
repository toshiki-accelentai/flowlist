'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types';

interface NoteEditorProps {
  note: Note | null;
  onUpdate: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
}

export default function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (note) {
      onUpdate(note.id, { title: value });
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (note) {
      onUpdate(note.id, { content: value });
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-zinc-600">Select or create a note</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-3 overflow-hidden">
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="Note title"
        className="bg-transparent text-lg font-medium text-zinc-100 placeholder-zinc-600 focus:outline-none mb-2"
      />
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Write your note..."
        className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none"
      />
    </div>
  );
}
