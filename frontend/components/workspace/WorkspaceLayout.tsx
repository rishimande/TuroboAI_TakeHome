"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi, User } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

interface WorkspaceLayoutProps {
  user: User;
  sidebar: ReactNode;
  children: ReactNode;
}

export default function WorkspaceLayout({
  user,
  sidebar,
  children,
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
            <Button onClick={handleLogout} variant="secondary" className="px-4 py-2">
              Log Out
            </Button>
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
