import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session cookies
});

// Get CSRF token from cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Add CSRF token to requests
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");
  if (csrfToken && config.method !== "get") {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Note types
export interface Note {
  id: string;
  category: string;
  category_name: string;
  category_color: string;
  title: string;
  content: string;
  created_at: string;
  last_edited_at: string;
}

export interface NoteDetail extends Note {
  user: string;
  updated_at: string;
}

// Authentication API functions
export const authApi = {
  // Sign up a new user
  signup: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/signup/", data);
    return response.data;
  },

  // Log in an existing user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login/", data);
    return response.data;
  },

  // Log out the current user
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>("/auth/logout/");
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me/");
    return response.data;
  },
};

// Categories API functions
export const categoriesApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories/");
    return response.data;
  },
};

// Notes API functions
export const notesApi = {
  // Get all notes, optionally filtered by category
  getNotes: async (categoryId?: string): Promise<Note[]> => {
    const params = categoryId ? { categoryId } : {};
    const response = await apiClient.get<Note[]>("/notes/", { params });
    return response.data;
  },

  // Get a single note by ID
  getNote: async (id: string): Promise<NoteDetail> => {
    const response = await apiClient.get<NoteDetail>(`/notes/${id}/`);
    return response.data;
  },
};

export default apiClient;
