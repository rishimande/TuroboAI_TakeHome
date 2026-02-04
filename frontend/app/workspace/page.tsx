"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { WorkspaceNavbar } from "@/components/notes/workspace-navbar";
import { CategorySidebar } from "@/components/notes/category-sidebar";
import { NotesGrid } from "@/components/notes/notes-grid";
import { NoteEditor } from "@/components/notes/note-editor";
import { getCategories, getNotes, createNote } from "@/lib/api";
import type { Category, Note } from "@/types";

export default function WorkspacePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [categoriesData, notesData] = await Promise.all([
        getCategories(),
        getNotes(),
      ]);
      setCategories(categoriesData);
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCategorySelect(categoryId: string | null) {
    setSelectedCategoryId(categoryId);
    setIsLoading(true);
    try {
      const notesData = await getNotes(categoryId || undefined);
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateNote() {
    if (isCreating || categories.length === 0) return;

    setIsCreating(true);
    try {
      const defaultCategory = categories[0];
      const newNote = await createNote({
        title: "Note Title:",
        content: "",
        category: defaultCategory.id,
      });
      setSelectedNote(newNote);
      await loadData();
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsCreating(false);
    }
  }

  function handleNoteClick(note: Note) {
    setSelectedNote(note);
  }

  function handleCloseEditor() {
    setSelectedNote(null);
  }

  async function handleSaveNote() {
    await loadData();
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#faf1e3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#957139] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#88642a]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf1e3] flex flex-col">
      {/* Top Navbar */}
      <WorkspaceNavbar 
        onCreateNote={handleCreateNote} 
        isCreating={isCreating}
      />

      {/* Main content area with sidebar and notes grid */}
      <div className="flex flex-1">
        <CategorySidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
        />

        <main className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-[#957139] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <NotesGrid notes={notes} onNoteClick={handleNoteClick} />
          )}
        </main>
      </div>

      {selectedNote && (
        <NoteEditor
          note={selectedNote}
          categories={categories}
          onClose={handleCloseEditor}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}
