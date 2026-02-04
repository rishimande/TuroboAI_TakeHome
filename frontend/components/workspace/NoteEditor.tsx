"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category, NoteDetail } from "@/lib/api-client";

interface NoteEditorProps {
  note: NoteDetail | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    id?: string;
    category: string;
    title: string;
    content: string;
  }) => Promise<void>;
}

export default function NoteEditor({
  note,
  categories,
  isOpen,
  onClose,
  onSave,
}: NoteEditorProps) {
  const [categoryId, setCategoryId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChangesRef = useRef(false);

  // Get the selected category for theming
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const categoryColor = selectedCategory?.color || "#E5E7EB";

  // Initialize form with note data or defaults
  useEffect(() => {
    if (isOpen) {
      if (note) {
        // Editing existing note
        setCategoryId(note.category);
        setTitle(note.title);
        setContent(note.content);
        setLastSaved(formatLastEdited(note.last_edited_at));
      } else {
        // Creating new note - use first category as default
        const defaultCategory = categories[0]?.id || "";
        setCategoryId(defaultCategory);
        setTitle("Note Title:");
        setContent("");
        setLastSaved("");
      }
      hasChangesRef.current = false;
    }
  }, [isOpen, note, categories]);

  // Format last edited timestamp
  function formatLastEdited(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }

  // Debounced autosave function
  const debouncedSave = useCallback(async () => {
    if (!hasChangesRef.current || !categoryId) return;

    setIsSaving(true);
    try {
      await onSave({
        id: note?.id,
        category: categoryId,
        title,
        content,
      });
      setLastSaved(formatLastEdited(new Date().toISOString()));
      hasChangesRef.current = false;
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  }, [categoryId, title, content, note?.id, onSave]);

  // Trigger autosave on field changes with debouncing
  useEffect(() => {
    if (!isOpen) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    hasChangesRef.current = true;
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave();
    }, 1000); // 1 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, categoryId, isOpen, debouncedSave]);

  // Save on close
  async function handleClose() {
    if (hasChangesRef.current) {
      await debouncedSave();
    }
    onClose();
  }

  // Handle category change (immediate save)
  async function handleCategoryChange(newCategoryId: string) {
    setCategoryId(newCategoryId);
    hasChangesRef.current = true;
    
    // Clear existing timeout and save immediately on category change
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setIsSaving(true);
    try {
      await onSave({
        id: note?.id,
        category: newCategoryId,
        title,
        content,
      });
      setLastSaved(formatLastEdited(new Date().toISOString()));
      hasChangesRef.current = false;
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  }

  // Prevent scroll on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
          style={{
            backgroundColor: `${categoryColor}15`,
            borderTop: `4px solid ${categoryColor}`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {note ? "Edit Note" : "New Note"}
              </h2>
              {isSaving && (
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Saving...
                </span>
              )}
              {!isSaving && lastSaved && (
                <span className="text-sm text-gray-500">
                  Last edited {lastSaved}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                style={{
                  borderColor: categoryColor,
                }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium text-lg"
                style={{
                  borderColor: categoryColor,
                }}
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note..."
                rows={12}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                style={{
                  borderColor: categoryColor,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
            <Button
              onClick={handleClose}
              variant="secondary"
              className="px-6 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
