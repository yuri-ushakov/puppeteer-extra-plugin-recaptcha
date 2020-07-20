"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rollup_plugin_node_resolve_1 = __importDefault(require("rollup-plugin-node-resolve"));
var rollup_plugin_sourcemaps_1 = __importDefault(require("rollup-plugin-sourcemaps"));
var rollup_plugin_typescript2_1 = __importDefault(require("rollup-plugin-typescript2"));
var pkg = require('./package.json');
var entryFile = 'index';
var banner = ("\n/*!\n * " + pkg.name + " v" + pkg.version + " by " + pkg.author + "\n * " + (pkg.homepage || "https://github.com/" + pkg.repository) + "\n * @license " + pkg.license + "\n */\n").trim();
var defaultExportOutro = "\n  module.exports = exports.default || {}\n  Object.entries(exports).forEach(([key, value]) => { module.exports[key] = value })\n";
exports.default = {
    input: "src/" + entryFile + ".ts",
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
            outro: defaultExportOutro,
            banner: banner
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
            exports: 'named',
            banner: banner
        }
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: __spreadArrays(Object.keys(pkg.dependencies || {}), Object.keys(pkg.peerDependencies || {})),
    watch: {
        include: 'src/**'
    },
    plugins: [
        // Compile TypeScript files
        rollup_plugin_typescript2_1.default({ useTsconfigDeclarationDir: true }),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        // commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        rollup_plugin_node_resolve_1.default(),
        // Resolve source maps to the original source
        rollup_plugin_sourcemaps_1.default()
    ]
};
