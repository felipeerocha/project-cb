export interface User {
  id: string;
  nome: string;
  email: string;
  is_superuser: boolean;
  telefone?: string | null;
  foto_url?: string | null;
  created_at?: string;
}

export interface UserFormData {
  nome: string;
  email: string;
  telefone: string;
  is_superuser: boolean;
  password?: string;
}
