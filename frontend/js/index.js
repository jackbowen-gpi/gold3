"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import pages
var Sentry = require("@sentry/browser");
var client_1 = require("react-dom/client");
var App_1 = require("./App");
require("../sass/style.scss");
Sentry.init({
    dsn: window.SENTRY_DSN,
    release: window.COMMIT_SHA,
});
var root = (0, client_1.createRoot)(document.getElementById("react-app"));
root.render(<App_1.default />);
