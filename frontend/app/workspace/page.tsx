"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, categoriesApi, type User, type Category } from "@/lib/api-client";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import CategoriesSidebar from "@/components/workspace/CategoriesSidebar";
import EmptyState from "@/components/workspace/EmptyState";

export default function WorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeWorkspace() {
      try {
        // Check authentication
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);

        // Fetch categories
        const fetchedCategories = await categoriesApi.getCategories();
        setCategories(fetchedCategories);
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

  function handleCategorySelect(categoryId: string | null) {
    setSelectedCategoryId(categoryId);
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
    <WorkspaceLayout
      user={user}
      sidebar={
        <CategoriesSidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
        />
      }
    >
      {/* Notes Grid Area - Currently showing empty state */}
      <div className="p-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-medium">Error loading categories</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <EmptyState
            categoryName={selectedCategory?.name}
          />
        )}
      </div>
    </WorkspaceLayout>
  );
}
