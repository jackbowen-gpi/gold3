// import pages
import * as Sentry from "@sentry/browser";
// Early marker for automated tests to detect the entry script executed
try { (window as any).__FRONTEND_ENTRY__ = 'loaded'; } catch (e) { (window as any).__FRONTEND_ENTRY__ = 'loaded'; }
import { createRoot } from "react-dom/client";

import App from "./App";
import { AuthProvider } from "../src/features/authentication/AuthContext";

import "../sass/style.scss";

Sentry.init({
  dsn: window.SENTRY_DSN,
  release: window.COMMIT_SHA,
});

// Debug mount: helps automated tests detect that the entry code executed
console.log('FRONTEND ENTRY: mounting react app to #react-app');
try {
  const mount = document.getElementById('react-app');
  if (mount) mount.setAttribute('data-entry', 'ran');
} catch (e) {
  // noop
}

const root = createRoot(document.getElementById("react-app") as HTMLElement);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
