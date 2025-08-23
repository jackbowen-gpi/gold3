import axios from "axios";

const API_BASE_URL = "/api/v1";

/**
 * AuthService provides static methods for authentication-related API calls.
 * Handles login, registration, logout, user info, and token refresh.
 */
export class AuthService {
  /**
   * Retrieve CSRF token from browser cookies.
   * @returns {string|null} The CSRF token or null if not found.
   */
  static getCsrfToken() {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrftoken") {
        return value;
      }
    }
    return null;
  }

  /**
   * Log in a user with given credentials.
   * @param {Object} credentials - The login credentials.
   * @returns {Promise<Object>} The user data.
   */
  static async login(credentials) {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login/`,
      credentials,
      {
        headers: {
          "X-CSRFToken": this.getCsrfToken(),
        },
      }
    );
    return response.data;
  }

  /**
   * Register a new user.
   * @param {Object} data - The registration data.
   * @returns {Promise<Object>} The user data.
   */
  static async register(data) {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register/`,
      data,
      {
        headers: {
          "X-CSRFToken": this.getCsrfToken(),
        },
      }
    );
    return response.data;
  }

  /**
   * Log out the current user.
   * @returns {Promise<void>}
   */
  static async logout() {
    await axios.post(
      `${API_BASE_URL}/auth/logout/`,
      {},
      {
        headers: {
          "X-CSRFToken": this.getCsrfToken(),
        },
      }
    );
  }

  /**
   * Get the current authenticated user's info.
   * @returns {Promise<Object>} The user data.
   */
  static async getCurrentUser() {
    const response = await axios.get(`${API_BASE_URL}/auth/me/`);
    return response.data;
  }

  /**
   * Refresh the authentication token.
   * @returns {Promise<void>}
   */
  static async refreshToken() {
    await axios.post(
      `${API_BASE_URL}/auth/refresh/`,
      {},
      {
        headers: {
          "X-CSRFToken": this.getCsrfToken(),
        },
      }
    );
  }
}