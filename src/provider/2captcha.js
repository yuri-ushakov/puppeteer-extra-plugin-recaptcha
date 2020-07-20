"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolutions = exports.PROVIDER_ID = void 0;
exports.PROVIDER_ID = '2captcha';
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default("puppeteer-extra-plugin:recaptcha:" + exports.PROVIDER_ID);
// const solver = require('./2captcha-api')
var solver = __importStar(require("./2captcha-api"));
var secondsBetweenDates = function (before, after) {
    return (after.getTime() - before.getTime()) / 1000;
};
function decodeRecaptchaAsync(token, sitekey, url, opts) {
    if (opts === void 0) { opts = { pollingInterval: 2000 }; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var cb = function (err, result, invalid) {
                        return resolve({ err: err, result: result, invalid: invalid });
                    };
                    try {
                        solver.setApiKey(token);
                        solver.decodeReCaptcha(sitekey, url, opts, cb);
                    }
                    catch (error) {
                        return resolve({ err: error });
                    }
                })];
        });
    });
}
function getSolutions(captchas, token) {
    if (captchas === void 0) { captchas = []; }
    return __awaiter(this, void 0, void 0, function () {
        var solutions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(captchas.map(function (c) { return getSolution(c, token || ''); }))];
                case 1:
                    solutions = _a.sent();
                    return [2 /*return*/, { solutions: solutions, error: solutions.find(function (s) { return !!s.error; }) }];
            }
        });
    });
}
exports.getSolutions = getSolutions;
function getSolution(captcha, token) {
    return __awaiter(this, void 0, void 0, function () {
        var solution, _a, err, result, invalid, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    solution = {
                        provider: exports.PROVIDER_ID
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    if (!captcha || !captcha.sitekey || !captcha.url || !captcha.id) {
                        throw new Error('Missing data in captcha');
                    }
                    solution.id = captcha.id;
                    solution.requestAt = new Date();
                    debug('Requesting solution..', solution);
                    return [4 /*yield*/, decodeRecaptchaAsync(token, captcha.sitekey, captcha.url)];
                case 2:
                    _a = _b.sent(), err = _a.err, result = _a.result, invalid = _a.invalid;
                    debug('Got response', { err: err, result: result, invalid: invalid });
                    if (err)
                        throw new Error(exports.PROVIDER_ID + " error: " + err);
                    if (!result || !result.text || !result.id) {
                        throw new Error(exports.PROVIDER_ID + " error: Missing response data: " + result);
                    }
                    solution.providerCaptchaId = result.id;
                    solution.text = result.text;
                    solution.responseAt = new Date();
                    solution.hasSolution = !!solution.text;
                    solution.duration = secondsBetweenDates(solution.requestAt, solution.responseAt);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    debug('Error', error_1);
                    solution.error = error_1.toString();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, solution];
            }
        });
    });
}
