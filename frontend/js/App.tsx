import * as Sentry from "@sentry/react";
import { parse } from "cookie";

import { OpenAPI } from "./api";
import Home from "./pages/Home";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <Home />
  </Sentry.ErrorBoundary>
);

export default App;
