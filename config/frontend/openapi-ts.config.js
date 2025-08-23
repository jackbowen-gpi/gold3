"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var openapi_ts_1 = require("@hey-api/openapi-ts");
exports.default = (0, openapi_ts_1.defineConfig)({
    input: "backend/schema.yml",
    output: {
        path: "frontend/js/api",
        format: "prettier",
    },
    client: "axios",
    useOptions: true,
});
