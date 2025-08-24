"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.catchErrorCodes = exports.getResponseBody = exports.getResponseHeader = exports.sendRequest = exports.getRequestBody = exports.getHeaders = exports.resolve = exports.getFormData = exports.getQueryString = exports.base64 = exports.isSuccess = exports.isFormData = exports.isBlob = exports.isStringWithValue = exports.isString = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = require("./ApiError");
const CancelablePromise_1 = require("./CancelablePromise");
const isString = (value) => {
    return typeof value === "string";
};
exports.isString = isString;
const isStringWithValue = (value) => {
    return (0, exports.isString)(value) && value !== "";
};
exports.isStringWithValue = isStringWithValue;
const isBlob = (value) => {
    return value instanceof Blob;
};
exports.isBlob = isBlob;
const isFormData = (value) => {
    return value instanceof FormData;
};
exports.isFormData = isFormData;
const isSuccess = (status) => {
    return status >= 200 && status < 300;
};
exports.isSuccess = isSuccess;
const base64 = (str) => {
    try {
        return btoa(str);
    }
    catch (err) {
        // @ts-ignore
        return Buffer.from(str).toString("base64");
    }
};
exports.base64 = base64;
const getQueryString = (params) => {
    const qs = [];
    const append = (key, value) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };
    const encodePair = (key, value) => {
        if (value === undefined || value === null) {
            return;
        }
        if (value instanceof Date) {
            append(key, value.toISOString());
        }
        else if (Array.isArray(value)) {
            value.forEach((v) => encodePair(key, v));
        }
        else if (typeof value === "object") {
            Object.entries(value).forEach(([k, v]) => encodePair(`${key}[${k}]`, v));
        }
        else {
            append(key, value);
        }
    };
    Object.entries(params).forEach(([key, value]) => encodePair(key, value));
    return qs.length ? `?${qs.join("&")}` : "";
};
exports.getQueryString = getQueryString;
const getUrl = (config, options) => {
    const encoder = config.ENCODE_PATH || encodeURI;
    const path = options.url
        .replace("{api-version}", config.VERSION)
        .replace(/{(.*?)}/g, (substring, group) => {
        if (options.path?.hasOwnProperty(group)) {
            return encoder(String(options.path[group]));
        }
        return substring;
    });
    const url = config.BASE + path;
    return options.query ? url + (0, exports.getQueryString)(options.query) : url;
};
const getFormData = (options) => {
    if (options.formData) {
        const formData = new FormData();
        const process = (key, value) => {
            if ((0, exports.isString)(value) || (0, exports.isBlob)(value)) {
                formData.append(key, value);
            }
            else {
                formData.append(key, JSON.stringify(value));
            }
        };
        Object.entries(options.formData)
            .filter(([, value]) => value !== undefined && value !== null)
            .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => process(key, v));
            }
            else {
                process(key, value);
            }
        });
        return formData;
    }
    return undefined;
};
exports.getFormData = getFormData;
const resolve = async (options, resolver) => {
    if (typeof resolver === "function") {
        return resolver(options);
    }
    return resolver;
};
exports.resolve = resolve;
const getHeaders = async (config, options) => {
    const [token, username, password, additionalHeaders] = await Promise.all([
        (0, exports.resolve)(options, config.TOKEN),
        (0, exports.resolve)(options, config.USERNAME),
        (0, exports.resolve)(options, config.PASSWORD),
        (0, exports.resolve)(options, config.HEADERS),
    ]);
    const headers = Object.entries({
        Accept: "application/json",
        ...additionalHeaders,
        ...options.headers,
    })
        .filter(([, value]) => value !== undefined && value !== null)
        .reduce((headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
    }), {});
    if ((0, exports.isStringWithValue)(token)) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if ((0, exports.isStringWithValue)(username) && (0, exports.isStringWithValue)(password)) {
        const credentials = (0, exports.base64)(`${username}:${password}`);
        headers["Authorization"] = `Basic ${credentials}`;
    }
    if (options.body !== undefined) {
        if (options.mediaType) {
            headers["Content-Type"] = options.mediaType;
        }
        else if ((0, exports.isBlob)(options.body)) {
            headers["Content-Type"] = options.body.type || "application/octet-stream";
        }
        else if ((0, exports.isString)(options.body)) {
            headers["Content-Type"] = "text/plain";
        }
        else if (!(0, exports.isFormData)(options.body)) {
            headers["Content-Type"] = "application/json";
        }
    }
    else if (options.formData !== undefined) {
        if (options.mediaType) {
            headers["Content-Type"] = options.mediaType;
        }
    }
    return headers;
};
exports.getHeaders = getHeaders;
const getRequestBody = (options) => {
    if (options.body) {
        return options.body;
    }
    return undefined;
};
exports.getRequestBody = getRequestBody;
const sendRequest = async (config, options, url, body, formData, headers, onCancel, axiosClient) => {
    const controller = new AbortController();
    let requestConfig = {
        data: body ?? formData,
        headers,
        method: options.method,
        signal: controller.signal,
        url,
        withCredentials: config.WITH_CREDENTIALS,
    };
    onCancel(() => controller.abort());
    for (const fn of config.interceptors.request._fns) {
        requestConfig = await fn(requestConfig);
    }
    try {
        return await axiosClient.request(requestConfig);
    }
    catch (error) {
        const axiosError = error;
        if (axiosError.response) {
            return axiosError.response;
        }
        throw error;
    }
};
exports.sendRequest = sendRequest;
const getResponseHeader = (response, responseHeader) => {
    if (responseHeader) {
        const content = response.headers[responseHeader];
        if ((0, exports.isString)(content)) {
            return content;
        }
    }
    return undefined;
};
exports.getResponseHeader = getResponseHeader;
const getResponseBody = (response) => {
    if (response.status !== 204) {
        return response.data;
    }
    return undefined;
};
exports.getResponseBody = getResponseBody;
const catchErrorCodes = (options, result) => {
    const errors = {
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        416: "Range Not Satisfiable",
        417: "Expectation Failed",
        418: "Im a teapot",
        421: "Misdirected Request",
        422: "Unprocessable Content",
        423: "Locked",
        424: "Failed Dependency",
        425: "Too Early",
        426: "Upgrade Required",
        428: "Precondition Required",
        429: "Too Many Requests",
        431: "Request Header Fields Too Large",
        451: "Unavailable For Legal Reasons",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates",
        507: "Insufficient Storage",
        508: "Loop Detected",
        510: "Not Extended",
        511: "Network Authentication Required",
        ...options.errors,
    };
    const error = errors[result.status];
    if (error) {
        throw new ApiError_1.ApiError(options, result, error);
    }
    if (!result.ok) {
        const errorStatus = result.status ?? "unknown";
        const errorStatusText = result.statusText ?? "unknown";
        const errorBody = (() => {
            try {
                return JSON.stringify(result.body, null, 2);
            }
            catch (e) {
                return undefined;
            }
        })();
        throw new ApiError_1.ApiError(options, result, `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`);
    }
};
exports.catchErrorCodes = catchErrorCodes;
/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @param axiosClient The axios client instance to use
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
const request = (config, options, axiosClient = axios_1.default) => {
    return new CancelablePromise_1.CancelablePromise(async (resolve, reject, onCancel) => {
        try {
            const url = getUrl(config, options);
            const formData = (0, exports.getFormData)(options);
            const body = (0, exports.getRequestBody)(options);
            const headers = await (0, exports.getHeaders)(config, options);
            if (!onCancel.isCancelled) {
                let response = await (0, exports.sendRequest)(config, options, url, body, formData, headers, onCancel, axiosClient);
                for (const fn of config.interceptors.response._fns) {
                    response = await fn(response);
                }
                const responseBody = (0, exports.getResponseBody)(response);
                const responseHeader = (0, exports.getResponseHeader)(response, options.responseHeader);
                const result = {
                    url,
                    ok: (0, exports.isSuccess)(response.status),
                    status: response.status,
                    statusText: response.statusText,
                    body: responseHeader ?? responseBody,
                };
                (0, exports.catchErrorCodes)(options, result);
                resolve(result.body);
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.request = request;
