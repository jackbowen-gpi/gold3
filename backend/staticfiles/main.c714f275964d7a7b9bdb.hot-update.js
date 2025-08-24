"use strict";
self["webpackHotUpdategold3_frontend"]("main",{

/***/ "./frontend/js/App.tsx":
/*!*****************************!*\
  !*** ./frontend/js/App.tsx ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var _sentry_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/react */ "./node_modules/@sentry/react/build/esm/errorboundary.js");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cookie */ "./node_modules/cookie/dist/index.js");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api */ "./frontend/js/api/index.ts");
/* harmony import */ var _pages_Home__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/Home */ "./frontend/js/pages/Home.tsx");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");

var _this = undefined;





_api__WEBPACK_IMPORTED_MODULE_3__.OpenAPI.interceptors.request.use(function(request) {
    var csrftoken = (0,cookie__WEBPACK_IMPORTED_MODULE_2__.parse)(document.cookie).csrftoken;
    if (request.headers && csrftoken) {
        request.headers["X-CSRFTOKEN"] = csrftoken;
    }
    return request;
});
var App = function() {
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_sentry_react__WEBPACK_IMPORTED_MODULE_1__.ErrorBoundary, {
        fallback: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("p", {
            children: "An error has occurred"
        }, void 0, false, {
            fileName: "/app/frontend/js/App.tsx",
            lineNumber: 16,
            columnNumber: 35
        }, void 0),
        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_pages_Home__WEBPACK_IMPORTED_MODULE_4__["default"], {}, void 0, false, {
            fileName: "/app/frontend/js/App.tsx",
            lineNumber: 17,
            columnNumber: 5
        }, _this)
    }, void 0, false, {
        fileName: "/app/frontend/js/App.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, _this);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
			errorOverlay = __react_refresh_error_overlay__;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ }),

/***/ "./frontend/js/index.tsx":
/*!*******************************!*\
  !*** ./frontend/js/index.tsx ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/browser */ "./node_modules/@sentry/browser/build/npm/esm/sdk.js");
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App */ "./frontend/js/App.tsx");
/* harmony import */ var _sass_style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../sass/style.scss */ "./frontend/sass/style.scss");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");

// import pages





_sentry_browser__WEBPACK_IMPORTED_MODULE_1__.init({
    dsn: window.SENTRY_DSN,
    release: window.COMMIT_SHA
});
var root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot)(document.getElementById("react-app"));
root.render(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {}, void 0, false, {
    fileName: "/app/frontend/js/index.tsx",
    lineNumber: 15,
    columnNumber: 13
}, undefined));


const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
			errorOverlay = __react_refresh_error_overlay__;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("23116e47681008d9359b")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=main.c714f275964d7a7b9bdb.hot-update.js.map