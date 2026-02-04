"use client";

import { Button } from "@/components/ui/button";

interface WorkspaceNavbarProps {
  onCreateNote: () => void;
  isCreating: boolean;
}

export function WorkspaceNavbar({ onCreateNote, isCreating }: WorkspaceNavbarProps) {
  return (
    <nav className="bg-[#faf1e3] px-6 h-[100px] flex items-center justify-end">
      {/* Right side - New Note button */}
      <Button onClick={onCreateNote} disabled={isCreating}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Note
      </Button>
    </nav>
  );
}
