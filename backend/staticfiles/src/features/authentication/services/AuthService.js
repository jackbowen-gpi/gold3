"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = '/api/v1';
class AuthService {
    static getCsrfToken() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return null;
    }
    static async login(credentials) {
        const response = await axios_1.default.post(`${API_BASE_URL}/auth/login/`, credentials, {
            headers: {
                'X-CSRFToken': this.getCsrfToken(),
            },
        });
        return response.data;
    }
    static async register(data) {
        const response = await axios_1.default.post(`${API_BASE_URL}/auth/register/`, data, {
            headers: {
                'X-CSRFToken': this.getCsrfToken(),
            },
        });
        return response.data;
    }
    static async logout() {
        await axios_1.default.post(`${API_BASE_URL}/auth/logout/`, {}, {
            headers: {
                'X-CSRFToken': this.getCsrfToken(),
            },
        });
    }
    static async getCurrentUser() {
        const response = await axios_1.default.get(`${API_BASE_URL}/auth/me/`);
        return response.data;
    }
    static async refreshToken() {
        await axios_1.default.post(`${API_BASE_URL}/auth/refresh/`, {}, {
            headers: {
                'X-CSRFToken': this.getCsrfToken(),
            },
        });
    }
}
exports.AuthService = AuthService;
