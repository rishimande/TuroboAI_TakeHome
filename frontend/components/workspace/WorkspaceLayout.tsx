"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { authApi, User } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface WorkspaceLayoutProps {
  user: User;
  sidebar: ReactNode;
  children: ReactNode;
  onNewNote?: () => void;
}

export default function WorkspaceLayout({
  user,
  sidebar,
  children,
  onNewNote,
}: WorkspaceLayoutProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {sidebar}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={onNewNote}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm"
              >
                <Plus size={20} />
                New Note
              </Button>
              <Button onClick={handleLogout} variant="secondary" className="px-4 py-2">
                Log Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
