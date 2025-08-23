import React from "react";
import * as Sentry from "@sentry/react";
import { parse } from "cookie";
import { OpenAPI } from "./api";
import Home from "./pages/Home";

// Attach CSRF token to API requests
OpenAPI.interceptors.request.use((request) => {
  const csrftoken = parse(document.cookie).csrftoken;
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const ErrorBoundary = Sentry.ErrorBoundary;

const App = () => React.createElement(
  ErrorBoundary,
  { fallback: React.createElement('p', null, 'An error has occurred') },
  React.createElement(Home, null)
);

export default App;