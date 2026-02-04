"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, type User } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export default function WorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Not authenticated, redirect to login
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  async function handleLogout() {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Temporary workspace placeholder */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notes Workspace
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user.email}
              </p>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              Log Out
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Coming Soon!
              </h2>
              <p className="text-gray-600 mb-4">
                This is a placeholder for the notes workspace.
                Notes functionality will be added in Slice 2.
              </p>
              <p className="text-sm text-gray-500">
                You are successfully authenticated and can access this protected page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
