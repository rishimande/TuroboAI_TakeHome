"use client";

import { formatFriendlyDate, truncateText } from "@/lib/utils";
import { getCategoryColor } from "@/lib/design-tokens";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const categoryColors = getCategoryColor(note.category_name);

  return (
    <button
      onClick={onClick}
      className="w-full h-[246px] p-4 rounded-[11px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.25)] text-left transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#957139] focus:ring-offset-2 flex flex-col"
      style={{
        backgroundColor: categoryColors.background,
        borderColor: categoryColors.border,
        borderWidth: "3px",
        borderStyle: "solid",
      }}
    >
      <div className="space-y-3 flex-1 overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-black">
          <span className="font-bold">
            {formatFriendlyDate(note.created_at)}
          </span>
          <span className="font-normal">{note.category_name}</span>
        </div>

        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-black truncate">
          {note.title}
        </h3>

        <p className="text-xs text-black line-clamp-6 overflow-hidden">
          {truncateText(note.content, 200)}
        </p>
      </div>
    </button>
  );
}
