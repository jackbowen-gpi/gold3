"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sentry = require("@sentry/react");
var cookie_1 = require("cookie");
var api_1 = require("./api");
var Home_1 = require("./pages/Home");
api_1.OpenAPI.interceptors.request.use(function (request) {
    var csrftoken = (0, cookie_1.parse)(document.cookie).csrftoken;
    if (request.headers && csrftoken) {
        request.headers["X-CSRFTOKEN"] = csrftoken;
    }
    return request;
});
var App = function () { return (<Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <Home_1.default />
  </Sentry.ErrorBoundary>); };
exports.default = App;
