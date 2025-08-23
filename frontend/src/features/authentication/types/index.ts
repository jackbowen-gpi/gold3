// Authentication types
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  dateJoined: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}