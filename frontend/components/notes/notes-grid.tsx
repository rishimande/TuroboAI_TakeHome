"use client";

import { NoteCard } from "./note-card";
import type { Note } from "@/types";

interface NotesGridProps {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}

export function NotesGrid({ notes, onNoteClick }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="w-64 h-64 mb-6 relative flex items-center justify-center">
          {/* Empty state illustration - cute coffee cup */}
          <svg width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Coffee cup */}
            <path d="M40 80 L40 140 Q40 150 50 150 L110 150 Q120 150 120 140 L120 80 Z" fill="#D4A574"/>
            <ellipse cx="80" cy="80" rx="40" ry="10" fill="#C8946A"/>
            {/* Coffee surface */}
            <ellipse cx="80" cy="85" rx="35" ry="8" fill="#8B6F47"/>
            {/* Handle */}
            <path d="M120 95 Q140 95 140 110 Q140 125 120 125" stroke="#D4A574" strokeWidth="8" fill="none"/>
            {/* Steam */}
            <path d="M60 60 Q55 45 60 30" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
            <path d="M80 55 Q75 40 80 25" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
            <path d="M100 60 Q105 45 100 30" stroke="#D4A574" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
            {/* Saucer */}
            <ellipse cx="80" cy="155" rx="55" ry="12" fill="#E8D5C4"/>
          </svg>
        </div>
        <p className="text-2xl font-[family-name:var(--font-heading)] text-[#88642a]">
          I&apos;m just here waiting for your charming notes...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pt-6 px-6 pb-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onNoteClick(note)}
        />
      ))}
    </div>
  );
}
