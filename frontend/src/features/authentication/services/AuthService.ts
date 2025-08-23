import axios from 'axios';
import type { LoginCredentials, RegisterData, User } from '../types';

const API_BASE_URL = '/api/v1';

export class AuthService {
  private static getCsrfToken(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        return value;
      }
    }
    return null;
  }

  static async login(credentials: LoginCredentials): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials, {
      headers: {
        'X-CSRFToken': this.getCsrfToken(),
      },
    });
    return response.data;
  }

  static async register(data: RegisterData): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, data, {
      headers: {
        'X-CSRFToken': this.getCsrfToken(),
      },
    });
    return response.data;
  }

  static async logout(): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/logout/`, {}, {
      headers: {
        'X-CSRFToken': this.getCsrfToken(),
      },
    });
  }

  static async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/auth/me/`);
    return response.data;
  }

  static async refreshToken(): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/refresh/`, {}, {
      headers: {
        'X-CSRFToken': this.getCsrfToken(),
      },
    });
  }
}