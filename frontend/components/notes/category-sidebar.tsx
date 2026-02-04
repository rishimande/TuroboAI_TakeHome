"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <div className="w-[288px] bg-[#faf1e3] px-6 pt-6">
      <div className="flex flex-col">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            "w-full flex items-center h-8 px-4",
            "text-xs font-bold text-black",
            "cursor-pointer",
            "focus:outline-none"
          )}
        >
          <span>All Categories</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "w-full flex items-center gap-2 h-8 px-4",
              "text-xs font-normal text-black",
              "cursor-pointer",
              "focus:outline-none"
            )}
          >
            <div
              className="w-[11px] h-[11px] rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="flex-1 text-left">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
