// import pages
import * as Sentry from "@sentry/browser";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AuthProvider } from "../src/features/authentication/AuthContext";

import "../sass/style.scss";

Sentry.init({
  dsn: window.SENTRY_DSN,
  release: window.COMMIT_SHA,
});

const root = createRoot(document.getElementById("react-app") as HTMLElement);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
