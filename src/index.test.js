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
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var index_1 = __importDefault(require("./index"));
// import * as types from './types'
// import { Puppeteer } from './puppeteer-mods'
var puppeteer_extra_1 = require("puppeteer-extra");
var PUPPETEER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];
ava_1.default('will detect captchas', function (t) { return __awaiter(void 0, void 0, void 0, function () {
    var puppeteer, recaptchaPlugin, browser, page, url, _a, captchas, error, c;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                puppeteer = puppeteer_extra_1.addExtra(require('puppeteer'));
                recaptchaPlugin = index_1.default();
                puppeteer.use(recaptchaPlugin);
                return [4 /*yield*/, puppeteer.launch({
                        args: PUPPETEER_ARGS,
                        headless: true
                    })];
            case 1:
                browser = _b.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _b.sent();
                url = 'https://www.google.com/recaptcha/api2/demo';
                return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle0' })];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.findRecaptchas()];
            case 4:
                _a = _b.sent(), captchas = _a.captchas, error = _a.error;
                t.is(error, null);
                t.is(captchas.length, 1);
                c = captchas[0];
                t.is(c.callback, 'onSuccess');
                t.is(c.hasResponseElement, true);
                t.is(c.responseElementContent, '');
                t.is(c.url, url);
                t.true(c.sitekey && c.sitekey.length > 5);
                return [4 /*yield*/, browser.close()];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
// TODO: test/mock the rest
