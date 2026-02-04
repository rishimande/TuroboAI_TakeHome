"use client";

import { Category } from "@/lib/api-client";

interface CategoriesSidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoriesSidebar({
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CategoriesSidebarProps) {
  const isAllSelected = selectedCategoryId === null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
      </div>

      {/* Categories List */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* All Categories Option */}
        <button
          onClick={() => onCategorySelect(null)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-colors ${
            isAllSelected
              ? "bg-gray-100 text-gray-900"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
            <span className="font-medium">All Categories</span>
          </div>
          <span className="text-sm text-gray-500">
            {categories.reduce((sum) => sum, 0)}
          </span>
        </button>

        {/* Individual Categories */}
        <div className="space-y-1">
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Color Indicator */}
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                {/* Note Count - will be 0 for now */}
                <span className="text-sm text-gray-500">0</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
