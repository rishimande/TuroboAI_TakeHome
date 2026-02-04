"use client";

import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";
import type { Note } from "@/lib/api-client";

interface NotesGridProps {
  notes: Note[];
  isLoading?: boolean;
  categoryName?: string;
  onNoteClick?: (note: Note) => void;
}

export default function NotesGrid({
  notes,
  isLoading = false,
  categoryName,
  onNoteClick,
}: NotesGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return <EmptyState categoryName={categoryName} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onNoteClick?.(note)}
        />
      ))}
    </div>
  );
}
