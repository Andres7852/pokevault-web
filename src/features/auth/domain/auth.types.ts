export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}