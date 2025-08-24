"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = require("react");
const AuthService_1 = require("../services/AuthService");
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};
const useAuth = () => {
    const [state, setState] = (0, react_1.useState)(initialState);
    const login = (0, react_1.useCallback)(async (credentials) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const user = await AuthService_1.AuthService.login(credentials);
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return user;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
        }
    }, []);
    const register = (0, react_1.useCallback)(async (data) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const user = await AuthService_1.AuthService.register(data);
            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return user;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
            }));
            throw error;
        }
    }, []);
    const logout = (0, react_1.useCallback)(async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            await AuthService_1.AuthService.logout();
            setState(initialState);
        }
        catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, []);
    const clearError = (0, react_1.useCallback)(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);
    return {
        ...state,
        login,
        register,
        logout,
        clearError,
    };
};
exports.useAuth = useAuth;
