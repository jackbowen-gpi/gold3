import { useState, useCallback } from "react";
import { AuthService } from "../services/AuthService";

// Initial state for authentication
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Custom React hook for authentication logic.
 * Provides login, register, logout, and error clearing functionality.
 */
export function useAuth() {
  const [state, setState] = useState(initialState);

  /**
   * Log in a user with given credentials.
   * Sets loading state, handles errors, and updates user state on success.
   */
  const login = useCallback(async (credentials) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
    try {
      const user = await AuthService.login(credentials);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Register a new user with given data.
   * Sets loading state, handles errors, and updates user state on success.
   */
  const register = useCallback(async (data) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
    try {
      const user = await AuthService.register(data);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Log out the current user.
   * Resets state to initial values.
   */
  const logout = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      await AuthService.logout();
      setState(initialState);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  /**
   * Clear any authentication error messages.
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Return state and auth actions
  return {
    ...state,
    login,
    register,
    logout,
    clearError,
  };
}