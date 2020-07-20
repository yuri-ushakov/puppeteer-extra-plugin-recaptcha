"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.RecaptchaContentScript = exports.ContentScriptDefaultData = exports.ContentScriptDefaultOpts = void 0;
exports.ContentScriptDefaultOpts = {
    visualFeedback: true
};
exports.ContentScriptDefaultData = {
    solutions: []
};
/**
 * Content script for Recaptcha handling (runs in browser context)
 * @note External modules are not supported here (due to content script isolation)
 */
var RecaptchaContentScript = /** @class */ (function () {
    function RecaptchaContentScript(opts, data) {
        if (opts === void 0) { opts = exports.ContentScriptDefaultOpts; }
        if (data === void 0) { data = exports.ContentScriptDefaultData; }
        // Poor mans _.pluck
        this._pick = function (props) { return function (o) {
            return props.reduce(function (a, e) {
                var _a;
                return (__assign(__assign({}, a), (_a = {}, _a[e] = o[e], _a)));
            }, {});
        }; };
        this.opts = opts;
        this.data = data;
    }
    // Recaptcha client is a nested, circular object with object keys that seem generated
    // We flatten that object a couple of levels deep for easy access to certain keys we're interested in.
    RecaptchaContentScript.prototype._flattenObject = function (item, levels, ignoreHTML) {
        if (levels === void 0) { levels = 2; }
        if (ignoreHTML === void 0) { ignoreHTML = true; }
        var isObject = function (x) { return x && typeof x === 'object'; };
        var isHTML = function (x) { return x && x instanceof HTMLElement; };
        var newObj = {};
        for (var i = 0; i < levels; i++) {
            item = Object.keys(newObj).length ? newObj : item;
            Object.keys(item).forEach(function (key) {
                if (ignoreHTML && isHTML(item[key]))
                    return;
                if (isObject(item[key])) {
                    Object.keys(item[key]).forEach(function (innerKey) {
                        if (ignoreHTML && isHTML(item[key][innerKey]))
                            return;
                        var keyName = isObject(item[key][innerKey])
                            ? "obj_" + key + "_" + innerKey
                            : "" + innerKey;
                        newObj[keyName] = item[key][innerKey];
                    });
                }
                else {
                    newObj[key] = item[key];
                }
            });
        }
        return newObj;
    };
    // Helper function to return an object based on a well known value
    RecaptchaContentScript.prototype._getKeyByValue = function (object, value) {
        return Object.keys(object).find(function (key) { return object[key] === value; });
    };
    RecaptchaContentScript.prototype._waitUntilDocumentReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (!document || !window)
                            return resolve();
                        var loadedAlready = /^loaded|^i|^c/.test(document.readyState);
                        if (loadedAlready)
                            return resolve();
                        function onReady() {
                            resolve();
                            document.removeEventListener('DOMContentLoaded', onReady);
                            window.removeEventListener('load', onReady);
                        }
                        document.addEventListener('DOMContentLoaded', onReady);
                        window.addEventListener('load', onReady);
                    })];
            });
        });
    };
    RecaptchaContentScript.prototype._paintCaptchaBusy = function ($iframe) {
        try {
            if (this.opts.visualFeedback) {
                $iframe.style.filter = "opacity(60%) hue-rotate(400deg)"; // violet
            }
        }
        catch (error) {
            // noop
        }
        return $iframe;
    };
    RecaptchaContentScript.prototype._paintCaptchaSolved = function ($iframe) {
        try {
            if (this.opts.visualFeedback) {
                $iframe.style.filter = "opacity(60%) hue-rotate(230deg)"; // green
            }
        }
        catch (error) {
            // noop
        }
        return $iframe;
    };
    RecaptchaContentScript.prototype._findVisibleIframeNodes = function () {
        return Array.from(document.querySelectorAll("iframe[src^='https://www.google.com/recaptcha/api2/anchor'][name^=\"a-\"]"));
    };
    RecaptchaContentScript.prototype._isCaptchaChallengeWindowPresent = function () {
        return (Array.from(document.querySelectorAll("iframe[src^='https://www.google.com/recaptcha/api2/bframe'][name^=\"c-\"]")).filter(function (x) { return window.getComputedStyle(x).visibility !== 'hidden'; }).length >
            0);
    };
    RecaptchaContentScript.prototype._findVisibleIframeNodeById = function (id) {
        return document.querySelector("iframe[src^='https://www.google.com/recaptcha/api2/anchor'][name^=\"a-" + (id ||
            '') + "\"]");
    };
    RecaptchaContentScript.prototype._hideChallengeWindowIfPresent = function (id) {
        var frame = document.querySelector("iframe[src^='https://www.google.com/recaptcha/api2/bframe'][name^=\"c-" + (id ||
            '') + "\"]");
        if (!frame) {
            return;
        }
        while (frame &&
            frame.parentElement &&
            frame.parentElement !== document.body) {
            frame = frame.parentElement;
        }
        if (frame) {
            frame.style.visibility = 'hidden';
        }
    };
    RecaptchaContentScript.prototype.getClients = function () {
        // Bail out early if there's no indication of recaptchas
        if (!window || !window.__google_recaptcha_client)
            return;
        if (!window.___grecaptcha_cfg || !window.___grecaptcha_cfg.clients) {
            return;
        }
        if (!Object.keys(window.___grecaptcha_cfg.clients).length)
            return;
        return window.___grecaptcha_cfg.clients;
    };
    RecaptchaContentScript.prototype.getVisibleIframesIds = function () {
        var _this = this;
        // Find all visible recaptcha boxes through their iframes or showed challenges
        var includeInvisible = this._isCaptchaChallengeWindowPresent();
        return (this._findVisibleIframeNodes()
            // do not exclude invisible recaptchas as it could be solved at the same manner
            .filter(function ($f) { return includeInvisible || !$f.src.includes('invisible'); })
            .map(function ($f) { return _this._paintCaptchaBusy($f); })
            .filter(function ($f) { return $f && $f.getAttribute('name'); })
            .map(function ($f) { return $f.getAttribute('name') || ''; }) // a-841543e13666
            .map(function (rawId) { return rawId.split('-').slice(-1)[0]; } // a-841543e13666 => 841543e13666
        )
            .filter(function (id) { return id; }));
    };
    RecaptchaContentScript.prototype.getResponseInputById = function (id) {
        if (!id)
            return;
        var $iframe = this._findVisibleIframeNodeById(id);
        if (!$iframe)
            return;
        var $parentForm = $iframe.closest("form");
        if ($parentForm) {
            return $parentForm.querySelector("[name='g-recaptcha-response']");
        }
        // Not all reCAPTCHAs are in forms
        // https://github.com/berstend/puppeteer-extra/issues/57
        if (document && document.body) {
            return document.body.querySelector("[name='g-recaptcha-response']");
        }
    };
    RecaptchaContentScript.prototype.getClientById = function (id) {
        var _this = this;
        if (!id)
            return;
        var clients = this.getClients();
        // Lookup captcha "client" info using extracted id
        var client = Object.values(clients || {})
            .filter(function (obj) { return _this._getKeyByValue(obj, id); })
            .shift(); // returns first entry in array or undefined
        if (!client)
            return;
        client = this._flattenObject(client);
        client.widgetId = client.id;
        client.id = id;
        return client;
    };
    RecaptchaContentScript.prototype.extractInfoFromClient = function (client) {
        if (!client)
            return;
        var info = this._pick(['sitekey', 'callback'])(client);
        if (!info.sitekey)
            return;
        info.id = client.id;
        info.widgetId = client.widgetId;
        info.display = this._pick([
            'size',
            'top',
            'left',
            'width',
            'height',
            'theme'
        ])(client);
        // callbacks can be strings or funtion refs
        if (info.callback && typeof info.callback === 'function') {
            info.callback = info.callback.name || 'anonymous';
        }
        if (document && document.location)
            info.url = document.location.href;
        return info;
    };
    RecaptchaContentScript.prototype.findRecaptchas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, clients, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {
                            captchas: [],
                            error: null
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._waitUntilDocumentReady()];
                    case 2:
                        _a.sent();
                        clients = this.getClients();
                        if (!clients)
                            return [2 /*return*/, result];
                        result.captchas = this.getVisibleIframesIds()
                            .map(function (id) { return _this.getClientById(id); })
                            .map(function (client) { return _this.extractInfoFromClient(client); })
                            .map(function (info) {
                            if (!info)
                                return;
                            var $input = _this.getResponseInputById(info.id);
                            info.hasResponseElement = !!$input;
                            info.responseElementContent = $input ? $input.innerHTML : undefined;
                            return info;
                        })
                            .filter(function (info) { return info; });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        result.error = error_1;
                        return [2 /*return*/, result];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    RecaptchaContentScript.prototype.enterRecaptchaSolutions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, clients, solutions_1, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = {
                            solved: [],
                            error: null
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._waitUntilDocumentReady()];
                    case 2:
                        _a.sent();
                        clients = this.getClients();
                        if (!clients) {
                            result.error = 'No recaptchas found';
                            return [2 /*return*/, result];
                        }
                        solutions_1 = this.data.solutions;
                        if (!solutions_1 || !solutions_1.length) {
                            result.error = 'No solutions provided';
                            return [2 /*return*/, result];
                        }
                        result.solved = this.getVisibleIframesIds()
                            .map(function (id) { return _this.getClientById(id); })
                            .map(function (client) {
                            var solved = {
                                id: client.id,
                                responseElement: false,
                                responseCallback: false
                            };
                            var $iframe = _this._findVisibleIframeNodeById(solved.id);
                            if (!$iframe) {
                                solved.error = "Iframe not found for id '" + solved.id + "'";
                                return solved;
                            }
                            var solution = solutions_1.find(function (s) { return s.id === solved.id; });
                            if (!solution || !solution.text) {
                                solved.error = "Solution not found for id '" + solved.id + "'";
                                return solved;
                            }
                            // Hide if present challenge window
                            _this._hideChallengeWindowIfPresent(solved.id);
                            // Enter solution in response textarea
                            var $input = _this.getResponseInputById(solved.id);
                            if ($input) {
                                $input.innerHTML = solution.text;
                                solved.responseElement = true;
                            }
                            // Enter solution in optional callback
                            if (client.callback) {
                                try {
                                    if (typeof client.callback === 'function') {
                                        client.callback.call(window, solution.text);
                                    }
                                    else {
                                        eval(client.callback).call(window, solution.text); // tslint:disable-line
                                    }
                                    solved.responseCallback = true;
                                }
                                catch (error) {
                                    solved.error = error;
                                }
                            }
                            // Finishing up
                            solved.isSolved = solved.responseCallback || solved.responseElement;
                            solved.solvedAt = new Date();
                            _this._paintCaptchaSolved($iframe);
                            return solved;
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        result.error = error_2;
                        return [2 /*return*/, result];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    return RecaptchaContentScript;
}());
exports.RecaptchaContentScript = RecaptchaContentScript;
/*
// Example data

{
    "captchas": [{
        "sitekey": "6LdAUwoUAAAAAH44X453L0tUWOvx11XXXXXXXX",
        "id": "lnfy52r0cccc",
        "widgetId": 0,
        "display": {
            "size": null,
            "top": 23,
            "left": 13,
            "width": 28,
            "height": 28,
            "theme": null
        },
        "url": "https://example.com",
        "hasResponseElement": true
    }],
    "error": null
}

{
    "solutions": [{
        "id": "lnfy52r0cccc",
        "provider": "2captcha",
        "providerCaptchaId": "61109548000",
        "text": "03AF6jDqVSOVODT-wLKZ47U0UXz...",
        "requestAt": "2019-02-09T18:30:43.587Z",
        "responseAt": "2019-02-09T18:30:57.937Z"
    }]
    "error": null
}

{
    "solved": [{
        "id": "lnfy52r0cccc",
        "responseElement": true,
        "responseCallback": false,
        "isSolved": true,
        "solvedAt": {}
    }]
    "error": null
}
*/
