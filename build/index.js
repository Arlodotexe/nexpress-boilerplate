"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var body_parser_1 = __importDefault(require("body-parser"));
var glob_1 = __importDefault(require("glob"));
var helpers = __importStar(require("./helpers"));
/**
 * This file sets up API endpoints based on the current folder tree in Heroku.
 *
 * Here's how it works:
 * Consumable JS files named with an HTTP method (all lowercase) are handed the Request and Response parameters from ExpressJS
 * The path of the file is set up as the endpoint on the server, and is set up with the HTTP method indicated by the filename
 *
 * Example:
 * The file `./src/api/data/bugreport/post.js` is set up at `POST https://example.com/data/bugreport/`
 */
/** */
var app = express_1.default(); // Casting needed for websocket
// Websocket support
express_ws_1.default(app);
// Cors setup
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    // Pass to next layer of middleware
    next();
});
var PORT = process.env.PORT || 5000;
var apiPath = process.env.APIPATH || "/api";
app.listen(PORT, function () {
    console.log("Ready, listening on port " + PORT);
});
var HttpMethodsRegex = /((?:post|get|put|patch|delete|ws)+)(?:.js)/;
function SetupAPI() {
    glob_1.default(__dirname + "/**/*.js", function (err, result) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, _i, result_1, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err)
                            throw err;
                        _loop_1 = function (filePath) {
                            var serverPath, folderPath_1, method, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                            return __generator(this, function (_v) {
                                switch (_v.label) {
                                    case 0:
                                        if (!(!filePath.includes("node_modules") && helpers.match(filePath, HttpMethodsRegex))) return [3 /*break*/, 13];
                                        serverPath = filePath
                                            .replace(HttpMethodsRegex, "")
                                            .replace("/app", "") // Remove first instance of "/app", for heroku hosting
                                            .replace(apiPath, "")
                                            .replace("/build", "");
                                        if (helpers.match(serverPath, /{(.+)}\/?$/)) {
                                            folderPath_1 = filePath.replace(/{.+}(.+)$/, "\/\*\/");
                                            glob_1.default(folderPath_1, function (err, siblingDir) {
                                                if (siblingDir.length > 1)
                                                    throw new Error("Folder representing a route parameter cannot have sibling folders: " + folderPath_1);
                                            });
                                        }
                                        // Reformat route params from folder-friendly to express spec
                                        serverPath = serverPath.replace(/{([^\/]+)}/g, ":$1");
                                        if (helpers.DEVENV)
                                            serverPath = serverPath.replace(__dirname.replace(/\\/g, "/").replace("/build", ""), "");
                                        method = helpers.match(filePath, HttpMethodsRegex);
                                        if (!method)
                                            return [2 /*return*/, "continue"];
                                        console.log("Setting up " + filePath + " as " + method.toUpperCase() + " " + serverPath);
                                        _a = method;
                                        switch (_a) {
                                            case "post": return [3 /*break*/, 1];
                                            case "get": return [3 /*break*/, 3];
                                            case "put": return [3 /*break*/, 5];
                                            case "patch": return [3 /*break*/, 7];
                                            case "delete": return [3 /*break*/, 9];
                                            case "ws": return [3 /*break*/, 11];
                                        }
                                        return [3 /*break*/, 13];
                                    case 1:
                                        _c = (_b = app).post;
                                        _d = [serverPath];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(filePath)); })];
                                    case 2:
                                        _c.apply(_b, _d.concat([_v.sent()]));
                                        return [3 /*break*/, 13];
                                    case 3:
                                        _f = (_e = app).get;
                                        _g = [serverPath];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(filePath)); })];
                                    case 4:
                                        _f.apply(_e, _g.concat([_v.sent()]));
                                        return [3 /*break*/, 13];
                                    case 5:
                                        _j = (_h = app).put;
                                        _k = [serverPath];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(filePath)); })];
                                    case 6:
                                        _j.apply(_h, _k.concat([_v.sent()]));
                                        return [3 /*break*/, 13];
                                    case 7:
                                        _m = (_l = app).patch;
                                        _o = [serverPath];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(filePath)); })];
                                    case 8:
                                        _m.apply(_l, _o.concat([_v.sent()]));
                                        return [3 /*break*/, 13];
                                    case 9:
                                        _q = (_p = app).delete;
                                        _r = [serverPath];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(filePath)); })];
                                    case 10:
                                        _q.apply(_p, _r.concat([_v.sent()]));
                                        return [3 /*break*/, 13];
                                    case 11:
                                        _t = (_s = app).ws;
                                        _u = [serverPath];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(filePath)); })];
                                    case 12:
                                        _t.apply(_s, _u.concat([(_v.sent())(express_ws_1.default, serverPath)]));
                                        return [3 /*break*/, 13];
                                    case 13: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, result_1 = result;
                        _a.label = 1;
                    case 1:
                        if (!(_i < result_1.length)) return [3 /*break*/, 4];
                        filePath = result_1[_i];
                        return [5 /*yield**/, _loop_1(filePath)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
}
SetupAPI();
//# sourceMappingURL=index.js.map