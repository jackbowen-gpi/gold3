"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.useAuth = void 0;
var useAuth_1 = require("./hooks/useAuth");
Object.defineProperty(exports, "useAuth", { enumerable: true, get: function () { return useAuth_1.useAuth; } });
var AuthService_1 = require("./services/AuthService");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return AuthService_1.AuthService; } });
// Component exports would go here when created
// export { LoginForm } from './components/LoginForm';
// export { RegisterForm } from './components/RegisterForm';
