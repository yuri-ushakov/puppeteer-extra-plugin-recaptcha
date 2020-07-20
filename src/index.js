"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppeteerExtraPluginRecaptcha = exports.BuiltinSolutionProviders = void 0;
var puppeteer_extra_plugin_1 = require("puppeteer-extra-plugin");
var content_1 = require("./content");
var TwoCaptcha = __importStar(require("./provider/2captcha"));
exports.BuiltinSolutionProviders = [
    {
        id: TwoCaptcha.PROVIDER_ID,
        fn: TwoCaptcha.getSolutions
    }
];
/**
 * A puppeteer-extra plugin to automatically detect and solve reCAPTCHAs.
 * @noInheritDoc
 */
var PuppeteerExtraPluginRecaptcha = /** @class */ (function (_super) {
    __extends(PuppeteerExtraPluginRecaptcha, _super);
    function PuppeteerExtraPluginRecaptcha(opts) {
        var _this = _super.call(this, opts) || this;
        _this.debug('Initialized', _this.opts);
        return _this;
    }
    Object.defineProperty(PuppeteerExtraPluginRecaptcha.prototype, "name", {
        get: function () {
            return 'recaptcha';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PuppeteerExtraPluginRecaptcha.prototype, "defaults", {
        get: function () {
            return {
                visualFeedback: true,
                throwOnError: false
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PuppeteerExtraPluginRecaptcha.prototype, "contentScriptOpts", {
        get: function () {
            var visualFeedback = this.opts.visualFeedback;
            return {
                visualFeedback: visualFeedback
            };
        },
        enumerable: false,
        configurable: true
    });
    PuppeteerExtraPluginRecaptcha.prototype._generateContentScript = function (fn, data) {
        this.debug('_generateContentScript', fn, data);
        return "(async() => {\n      const DATA = " + JSON.stringify(data || null) + "\n      const OPTS = " + JSON.stringify(this.contentScriptOpts) + "\n\n      " + content_1.RecaptchaContentScript.toString() + "\n      const script = new RecaptchaContentScript(OPTS, DATA)\n      return script." + fn + "()\n    })()";
    };
    PuppeteerExtraPluginRecaptcha.prototype.findRecaptchas = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var hasRecaptchaScriptTag, evaluateReturn, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('findRecaptchas');
                        return [4 /*yield*/, page.$("script[src^=\"https://www.google.com/recaptcha/api.js\"]")];
                    case 1:
                        hasRecaptchaScriptTag = _a.sent();
                        this.debug('hasRecaptchaScriptTag', !!hasRecaptchaScriptTag);
                        if (!hasRecaptchaScriptTag) return [3 /*break*/, 3];
                        this.debug('waitForRecaptchaClient - start', new Date());
                        return [4 /*yield*/, page.waitForFunction("\n        (function() {\n          return window.___grecaptcha_cfg && window.___grecaptcha_cfg.count\n        })()\n      ", { polling: 200, timeout: 10 * 1000 })];
                    case 2:
                        _a.sent();
                        this.debug('waitForRecaptchaClient - end', new Date()); // used as timer
                        _a.label = 3;
                    case 3: return [4 /*yield*/, page.evaluate(this._generateContentScript('findRecaptchas'))];
                    case 4:
                        evaluateReturn = _a.sent();
                        response = evaluateReturn;
                        this.debug('findRecaptchas', response);
                        if (this.opts.throwOnError && response.error) {
                            throw new Error(response.error);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    PuppeteerExtraPluginRecaptcha.prototype.getRecaptchaSolutions = function (captchas, provider) {
        return __awaiter(this, void 0, void 0, function () {
            var fn, builtinProvider, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('getRecaptchaSolutions');
                        provider = provider || this.opts.provider;
                        if (!provider ||
                            (!provider.token && !provider.fn) ||
                            (provider.token && provider.token === 'XXXXXXX' && !provider.fn)) {
                            throw new Error('Please provide a solution provider to the plugin.');
                        }
                        fn = provider.fn;
                        if (!fn) {
                            builtinProvider = exports.BuiltinSolutionProviders.find(function (p) { return p.id === (provider || {}).id; });
                            if (!builtinProvider || !builtinProvider.fn) {
                                throw new Error("Cannot find builtin provider with id '" + provider.id + "'.");
                            }
                            fn = builtinProvider.fn;
                        }
                        return [4 /*yield*/, fn.call(this, captchas, provider.token)];
                    case 1:
                        response = _a.sent();
                        response.error =
                            response.error ||
                                response.solutions.find(function (s) { return !!s.error; });
                        this.debug('getRecaptchaSolutions', response);
                        if (response && response.error) {
                            console.warn('PuppeteerExtraPluginRecaptcha: An error occured during "getRecaptchaSolutions":', response.error);
                        }
                        if (this.opts.throwOnError && response.error) {
                            throw new Error(response.error);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    PuppeteerExtraPluginRecaptcha.prototype.enterRecaptchaSolutions = function (page, solutions) {
        return __awaiter(this, void 0, void 0, function () {
            var evaluateReturn, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('enterRecaptchaSolutions');
                        return [4 /*yield*/, page.evaluate(this._generateContentScript('enterRecaptchaSolutions', {
                                solutions: solutions
                            }))];
                    case 1:
                        evaluateReturn = _a.sent();
                        response = evaluateReturn;
                        response.error = response.error || response.solved.find(function (s) { return !!s.error; });
                        this.debug('enterRecaptchaSolutions', response);
                        if (this.opts.throwOnError && response.error) {
                            throw new Error(response.error);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    PuppeteerExtraPluginRecaptcha.prototype.solveRecaptchas = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, captchas, captchasError, _b, solutions, solutionsError, _c, solved, solvedError, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.debug('solveRecaptchas');
                        response = {
                            captchas: [],
                            solutions: [],
                            solved: [],
                            error: null
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.findRecaptchas(page)];
                    case 2:
                        _a = _d.sent(), captchas = _a.captchas, captchasError = _a.error;
                        response.captchas = captchas;
                        if (!captchas.length) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getRecaptchaSolutions(response.captchas)];
                    case 3:
                        _b = _d.sent(), solutions = _b.solutions, solutionsError = _b.error;
                        response.solutions = solutions;
                        return [4 /*yield*/, this.enterRecaptchaSolutions(page, response.solutions)];
                    case 4:
                        _c = _d.sent(), solved = _c.solved, solvedError = _c.error;
                        response.solved = solved;
                        response.error = captchasError || solutionsError || solvedError;
                        _d.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _d.sent();
                        response.error = error_1.toString();
                        return [3 /*break*/, 7];
                    case 7:
                        this.debug('solveRecaptchas', response);
                        if (this.opts.throwOnError && response.error) {
                            throw new Error(response.error);
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    PuppeteerExtraPluginRecaptcha.prototype._addCustomMethods = function (prop) {
        var _this = this;
        prop.findRecaptchas = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.findRecaptchas(prop)];
        }); }); };
        prop.getRecaptchaSolutions = function (captchas, provider) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.getRecaptchaSolutions(captchas, provider)];
        }); }); };
        prop.enterRecaptchaSolutions = function (solutions) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.enterRecaptchaSolutions(prop, solutions)
                // Add convenience methods that wraps all others
            ];
        }); }); };
        // Add convenience methods that wraps all others
        prop.solveRecaptchas = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.solveRecaptchas(prop)];
        }); }); };
    };
    PuppeteerExtraPluginRecaptcha.prototype.onPageCreated = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('onPageCreated', page.url());
                        // Make sure we can run our content script
                        return [4 /*yield*/, page.setBypassCSP(true)
                            // Add custom page methods
                        ];
                    case 1:
                        // Make sure we can run our content script
                        _a.sent();
                        // Add custom page methods
                        this._addCustomMethods(page);
                        // Add custom methods to potential frames as well
                        page.on('frameattached', function (frame) {
                            if (!frame)
                                return;
                            _this._addCustomMethods(frame);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Add additions to already existing pages and frames */
    PuppeteerExtraPluginRecaptcha.prototype.onBrowser = function (browser) {
        return __awaiter(this, void 0, void 0, function () {
            var pages, _i, pages_1, page, _a, _b, frame;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, browser.pages()];
                    case 1:
                        pages = _c.sent();
                        for (_i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
                            page = pages_1[_i];
                            this._addCustomMethods(page);
                            for (_a = 0, _b = page.mainFrame().childFrames(); _a < _b.length; _a++) {
                                frame = _b[_a];
                                this._addCustomMethods(frame);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return PuppeteerExtraPluginRecaptcha;
}(puppeteer_extra_plugin_1.PuppeteerExtraPlugin));
exports.PuppeteerExtraPluginRecaptcha = PuppeteerExtraPluginRecaptcha;
/** Default export, PuppeteerExtraPluginRecaptcha  */
var defaultExport = function (options) {
    return new PuppeteerExtraPluginRecaptcha(options || {});
};
exports.default = defaultExport;
