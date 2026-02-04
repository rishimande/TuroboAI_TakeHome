"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  categoriesApi,
  notesApi,
  type User,
  type Category,
  type Note,
  type NoteDetail,
} from "@/lib/api-client";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import CategoriesSidebar from "@/components/workspace/CategoriesSidebar";
import NotesGrid from "@/components/workspace/NotesGrid";
import NoteEditor from "@/components/workspace/NoteEditor";

export default function WorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteDetail | null>(null);

  useEffect(() => {
    async function initializeWorkspace() {
      try {
        // Check authentication
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);

        // Fetch categories
        const fetchedCategories = await categoriesApi.getCategories();
        setCategories(fetchedCategories);

        // Fetch initial notes
        const fetchedNotes = await notesApi.getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Initialization error:", error);
        // If authentication fails, redirect to login
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    initializeWorkspace();
  }, [router]);

  // Fetch notes when category selection changes
  useEffect(() => {
    async function fetchNotes() {
      if (!user) return;

      setNotesLoading(true);
      try {
        const fetchedNotes = await notesApi.getNotes(selectedCategoryId || undefined);
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to load notes");
      } finally {
        setNotesLoading(false);
      }
    }

    if (!isLoading) {
      fetchNotes();
    }
  }, [selectedCategoryId, user, isLoading]);

  function handleCategorySelect(categoryId: string | null) {
    setSelectedCategoryId(categoryId);
    setError(null); // Clear any errors when switching categories
  }

  async function handleNoteClick(note: Note) {
    try {
      // Fetch full note details before editing
      const fullNote = await notesApi.getNote(note.id);
      setEditingNote(fullNote);
      setIsEditorOpen(true);
    } catch (error) {
      console.error("Error loading note:", error);
      setError("Failed to load note");
    }
  }

  function handleNewNote() {
    setEditingNote(null);
    setIsEditorOpen(true);
  }

  function handleCloseEditor() {
    setIsEditorOpen(false);
    setEditingNote(null);
  }

  async function handleSaveNote(noteData: {
    id?: string;
    category: string;
    title: string;
    content: string;
  }) {
    try {
      if (noteData.id) {
        // Update existing note
        const updatedNote = await notesApi.updateNote(noteData.id, {
          category: noteData.category,
          title: noteData.title,
          content: noteData.content,
        });
        setEditingNote(updatedNote);

        // Update the note in the list
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === updatedNote.id
              ? {
                  ...note,
                  category: updatedNote.category,
                  category_name: updatedNote.category_name,
                  category_color: updatedNote.category_color,
                  title: updatedNote.title,
                  content: updatedNote.content,
                  last_edited_at: updatedNote.last_edited_at,
                }
              : note
          )
        );
      } else {
        // Create new note
        const newNote = await notesApi.createNote({
          category: noteData.category,
          title: noteData.title,
          content: noteData.content,
        });
        setEditingNote(newNote);

        // Add the new note to the list
        const newNotePreview: Note = {
          id: newNote.id,
          category: newNote.category,
          category_name: newNote.category_name,
          category_color: newNote.category_color,
          title: newNote.title,
          content: newNote.content,
          created_at: newNote.created_at,
          last_edited_at: newNote.last_edited_at,
        };

        setNotes((prevNotes) => [newNotePreview, ...prevNotes]);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      throw error;
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Get selected category name for empty state
  const selectedCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)
    : null;

  return (
    <>
      <WorkspaceLayout
        user={user}
        onNewNote={handleNewNote}
        sidebar={
          <CategoriesSidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
          />
        }
      >
        {/* Notes Grid Area */}
        <div className="p-8">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <p className="font-medium">Error loading notes</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : (
            <NotesGrid
              notes={notes}
              isLoading={notesLoading}
              categoryName={selectedCategory?.name}
              onNoteClick={handleNoteClick}
            />
          )}
        </div>
      </WorkspaceLayout>

      {/* Note Editor Modal */}
      <NoteEditor
        note={editingNote}
        categories={categories}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />
    </>
  );
}
