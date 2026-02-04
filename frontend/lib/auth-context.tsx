"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCsrfToken, getCurrentUser, signIn as apiSignIn, signOut as apiSignOut, signUp as apiSignUp } from "./api";
import type { SignInData, SignUpData, User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(data: SignInData) {
    const userData = await apiSignIn(data);
    setUser(userData);
    router.push("/workspace");
  }

  async function signUp(data: SignUpData) {
    const userData = await apiSignUp(data);
    setUser(userData);
    router.push("/workspace");
  }

  async function signOut() {
    await apiSignOut();
    setUser(null);
    router.push("/signin");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
