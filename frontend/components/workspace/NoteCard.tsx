"use client";

import { formatFriendlyDate } from "@/lib/utils";
import type { Note } from "@/lib/api-client";

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  // Truncate content if it's too long
  const maxContentLength = 150;
  const truncatedContent =
    note.content.length > maxContentLength
      ? note.content.slice(0, maxContentLength) + "..."
      : note.content;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
    >
      {/* Date and Category Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">
          {formatFriendlyDate(note.last_edited_at)}
        </span>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: note.category_color }}
            aria-label={note.category_name}
          />
          <span className="text-sm text-gray-600">{note.category_name}</span>
        </div>
      </div>

      {/* Note Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {note.title}
      </h3>

      {/* Note Content Preview */}
      {note.content && (
        <p className="text-gray-600 text-sm line-clamp-3 whitespace-pre-wrap">
          {truncatedContent}
        </p>
      )}
    </div>
  );
}
