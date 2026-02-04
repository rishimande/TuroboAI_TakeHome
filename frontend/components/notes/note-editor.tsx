"use client";

import { useEffect, useState, useCallback } from "react";
import { getCategoryColor } from "@/lib/design-tokens";
import { formatLastEdited, debounce } from "@/lib/utils";
import { updateNote } from "@/lib/api";
import type { Category, Note } from "@/types";

interface NoteEditorProps {
  note: Note;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export function NoteEditor({
  note,
  categories,
  onClose,
  onSave,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [categoryId, setCategoryId] = useState(note.category);
  const [isSaving, setIsSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastEdited, setLastEdited] = useState(note.last_edited_at);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const categoryColors = getCategoryColor(selectedCategory?.name || "");

  // Autosave function
  const saveChanges = async (updates: {
    title?: string;
    content?: string;
    category?: string;
  }) => {
    setIsSaving(true);
    try {
      const updatedNote = await updateNote(note.id, updates);
      setLastEdited(updatedNote.last_edited_at);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced autosave for typing
  const debouncedSave = useCallback(
    debounce((title: string, content: string) => {
      saveChanges({ title, content });
    }, 1000),
    [note.id]
  );

  // Handle title change
  function handleTitleChange(value: string) {
    setTitle(value);
    debouncedSave(value, content);
  }

  // Handle content change
  function handleContentChange(value: string) {
    setContent(value);
    debouncedSave(title, value);
  }

  // Handle category change (immediate save)
  async function handleCategoryChange(newCategoryId: string) {
    setCategoryId(newCategoryId);
    setShowDropdown(false);
    await saveChanges({ category: newCategoryId });
  }

  // Save on close
  async function handleClose() {
    if (title !== note.title || content !== note.content || categoryId !== note.category) {
      await saveChanges({ title, content, category: categoryId });
    }
    onSave();
    onClose();
  }

  // Handle backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Handle escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [title, content, categoryId]);

  return (
    <div
      className="fixed inset-0 bg-[#faf1e3] z-50 overflow-auto"
      onClick={handleBackdropClick}
    >
      <div className="ml-[37px] mt-[33px] mb-[48px] w-[1199px]">
        {/* Category dropdown and close button row */}
        <div className="flex justify-between items-start mb-[18px] relative">
          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="w-[225px] px-[15px] py-[7px] h-[39px] rounded-md border border-[#957139] text-xs text-left flex items-center justify-between hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#957139] bg-[#faf1e3]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-[11px] h-[11px] rounded-full"
                  style={{ backgroundColor: selectedCategory?.color }}
                />
                <span>{selectedCategory?.name}</span>
              </div>
              <svg
                className="w-6 h-6 text-[#957139]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-[225px] bg-white border border-[#957139] rounded-md shadow-lg z-30">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryChange(category.id);
                    }}
                    className="w-full px-4 py-2 text-xs text-left flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-0 hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-[#957139]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Note modal */}
        <div
          className="w-full h-[700px] rounded-[11px] shadow-lg"
          style={{
            backgroundColor: categoryColors.background,
            borderColor: categoryColors.border,
            borderWidth: "3px",
            borderStyle: "solid",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col" style={{ paddingLeft: '52px', paddingRight: '52px', paddingTop: '30px', paddingBottom: '48px' }}>

          {/* Last edited timestamp at top */}
          <div style={{ marginBottom: '25px' }}>
            <p className="text-xs text-black text-right">
              Last Edited: {formatLastEdited(lastEdited)}
            </p>
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note Title:"
            className="w-full text-2xl font-bold border-none bg-transparent focus:outline-none focus:ring-0"
            style={{ fontFamily: 'Inria Serif, serif', padding: 0, marginBottom: '14px' }}
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Pour your heart out..."
            className="flex-1 w-full text-base border-none bg-transparent focus:outline-none focus:ring-0 resize-none"
            style={{ padding: 0, lineHeight: '27px' }}
          />

        </div>
      </div>
    </div>
    </div>
  );
}
