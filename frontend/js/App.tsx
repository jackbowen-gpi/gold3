import * as Sentry from "@sentry/react";
import { parse } from "cookie";

import { OpenAPI } from "./api";
import axios from 'axios';
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthHeader } from "../src/features/authentication/components/AuthHeader";

// Ensure the generated OpenAPI client sends cookies/credentials by default in dev.
// The client uses OpenAPI.WITH_CREDENTIALS to set axios/fetch withCredentials.
OpenAPI.WITH_CREDENTIALS = true;

// Also make sure axios (used directly by some services) sends cookies by default.
axios.defaults.withCredentials = true;

// Debug: expose current credentials settings on startup to help diagnose 401s
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.debug('[App] OpenAPI.WITH_CREDENTIALS=', OpenAPI.WITH_CREDENTIALS, 'axios.defaults.withCredentials=', axios.defaults.withCredentials);
}

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  // Debug: log the client-side pathname and route detection to help diagnose
  // cases where the URL is /login but the client still renders the Home page.
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('[App] pathname=', path, 'isLogin=', path.startsWith('/login'), 'isRegister=', path.startsWith('/register'));
  }
  const isLogin = path.startsWith('/login');
  const isRegister = path.startsWith('/register');

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <AuthHeader />
  {isLogin ? <LoginPage /> : isRegister ? <RegisterPage /> : <Home />}
    </Sentry.ErrorBoundary>
  );
};

export default App;
