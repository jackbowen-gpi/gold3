// This test file is currently in CommonJS output format (likely compiled from TypeScript).
// The following comments explain each section for clarity.

// Import testing utilities and modules
var react_1 = require("@testing-library/react");
var api_1 = require("../../api");
var Home_1 = require("../Home");

// Mock the RestService to control API responses in tests
jest.mock("../../api", function () { 
    return ({
        RestService: {
            restRestCheckRetrieve: jest.fn(), // Mock the API call
        },
    }); 
});

// Group related tests for the Home component
describe("Home", function () {
    // Before each test, set up the mock to resolve with a test message
    beforeEach(function () {
        api_1.RestService.restRestCheckRetrieve.mockResolvedValue({
            message: "Test Result",
        });
    });

    // After each test, clear all mocks to avoid cross-test pollution
    afterEach(function () {
        jest.clearAllMocks();
    });

    // Test that the Home component renders static assets and API data
    test("renders static assets and rest API data", function () { 
        return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Render the Home component
                        (0, react_1.render)(<Home_1.default />);
                        // Check for static text
                        expect(react_1.screen.getByText("Static assets")).toBeInTheDocument();
                        expect(react_1.screen.getByText("Rest API")).toBeInTheDocument();
                        // Wait for the mocked API message to appear
                        _a = expect;
                        return [4 /*yield*/, react_1.screen.findByText("Test Result")];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); 
    });

    // Test that the API call is made when the component mounts
    test("calls restRestCheckRetrieve on mount", function () { 
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Render the Home component
                        (0, react_1.render)(<Home_1.default />);
                        // Wait for the API call to have been made
                        return [4 /*yield*/, (0, react_1.waitFor)(function () {
                                expect(api_1.RestService.restRestCheckRetrieve).toHaveBeenCalledWith();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); 
    });
});