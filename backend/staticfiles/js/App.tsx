import * as Sentry from "@sentry/react";
import { parse } from "cookie";

import { OpenAPI } from "./api";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthHeader } from "../../frontend/src/features/authentication/components/AuthHeader";
import SideNav from "../../frontend/src/components/SideNav";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isLogin = path.startsWith('/login');
  const isRegister = path.startsWith('/register');

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <div style={{ display: 'flex' }}>
        <SideNav />
        <div style={{ flex: 1 }}>
          <AuthHeader />
          {isLogin ? <LoginPage /> : isRegister ? <RegisterPage /> : <Home />}
        </div>
      </div>
    </Sentry.ErrorBoundary>
  );
};

export default App;
