export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
