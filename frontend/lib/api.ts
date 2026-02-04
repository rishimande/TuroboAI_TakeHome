import axios from "axios";
import type {
  Category,
  CreateNoteData,
  Note,
  SignInData,
  SignUpData,
  UpdateNoteData,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add CSRF token handling - only for non-exempt endpoints
api.interceptors.request.use((config) => {
  // Skip CSRF token for signup, login, and csrf endpoints (they are CSRF exempt)
  const csrfExemptPaths = ["/auth/signup/", "/auth/login/", "/auth/csrf/"];
  const isExempt = csrfExemptPaths.some(path => config.url?.includes(path));
  
  if (!isExempt) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
  }
  return config;
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// CSRF Token API
export async function fetchCsrfToken(): Promise<void> {
  try {
    await api.get("/auth/csrf/");
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
}

// Authentication API
export async function signUp(data: SignUpData): Promise<User> {
  const response = await api.post<User>("/auth/signup/", data);
  return response.data;
}

export async function signIn(data: SignInData): Promise<User> {
  const response = await api.post<User>("/auth/login/", data);
  return response.data;
}

export async function signOut(): Promise<void> {
  await api.post("/auth/logout/");
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/auth/me/");
  return response.data;
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories/");
  return response.data;
}

// Notes API
export async function getNotes(categoryId?: string): Promise<Note[]> {
  const params = categoryId ? { categoryId } : {};
  const response = await api.get<Note[]>("/notes/", { params });
  return response.data;
}

export async function getNote(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}/`);
  return response.data;
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes/create/", data);
  return response.data;
}

export async function updateNote(
  id: string,
  data: UpdateNoteData
): Promise<Note> {
  const response = await api.patch<Note>(`/notes/${id}/update/`, data);
  return response.data;
}

export default api;
