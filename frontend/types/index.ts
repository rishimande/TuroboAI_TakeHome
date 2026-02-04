export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  sort_order: number;
  note_count: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  category_name: string;
  category_color: string;
  created_at: string;
  updated_at?: string;
  last_edited_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  category: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  category?: string;
}
