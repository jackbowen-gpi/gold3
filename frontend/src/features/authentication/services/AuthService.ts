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
    // Ensure credentials (cookies) are sent for session-based auth
    // and provide a debug log to help diagnose missing cookies/CSRF.
    const csrf = this.getCsrfToken();
    // eslint-disable-next-line no-console
    console.debug('[AuthService] login csrf=', csrf, 'document.cookie=', document.cookie);
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials, {
      headers: {
        'X-CSRFToken': csrf,
      },
      withCredentials: true,
    });
    return response.data;
  }

  static async register(data: RegisterData): Promise<User> {
    const csrf = this.getCsrfToken();
    // eslint-disable-next-line no-console
    console.debug('[AuthService] register csrf=', csrf, 'document.cookie=', document.cookie);
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, data, {
      headers: {
        'X-CSRFToken': csrf,
      },
      withCredentials: true,
    });
    return response.data;
  }

  static async logout(): Promise<void> {
    const csrf = this.getCsrfToken();
    // eslint-disable-next-line no-console
    console.debug('[AuthService] logout csrf=', csrf, 'document.cookie=', document.cookie);
    await axios.post(`${API_BASE_URL}/auth/logout/`, {}, {
      headers: {
        'X-CSRFToken': csrf,
      },
      withCredentials: true,
    });
  }

  static async getCurrentUser(): Promise<User> {
  // Defensive: ensure credentials sent and log cookies for debugging 401s.
  // eslint-disable-next-line no-console
  console.debug('[AuthService] getCurrentUser document.cookie=', document.cookie);
  const response = await axios.get(`${API_BASE_URL}/auth/me/`, { withCredentials: true });
    return response.data;
  }

  static async refreshToken(): Promise<void> {
    const csrf = this.getCsrfToken();
    // eslint-disable-next-line no-console
    console.debug('[AuthService] refreshToken csrf=', csrf, 'document.cookie=', document.cookie);
    await axios.post(`${API_BASE_URL}/auth/refresh/`, {}, {
      headers: {
        'X-CSRFToken': csrf,
      },
      withCredentials: true,
    });
  }
}