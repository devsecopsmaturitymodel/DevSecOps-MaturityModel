"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const remapping_1 = __importDefault(require("@ampproject/remapping"));
const terser_1 = require("terser");
const esbuild_executor_1 = require("./esbuild-executor");
/**
 * The cached esbuild executor.
 * This will automatically use the native or WASM version based on platform and availability
 * with the native version given priority due to its superior performance.
 */
let esbuild;
/**
 * Handles optimization requests sent from the main thread via the `JavaScriptOptimizerPlugin`.
 */
async function default_1({ asset, options }) {
    // esbuild is used as a first pass
    const esbuildResult = await optimizeWithEsbuild(asset.code, asset.name, options);
    // terser is used as a second pass
    const terserResult = await optimizeWithTerser(asset.name, esbuildResult.code, options.sourcemap, 
    // Terser only supports up to ES2020.
    options.target === 'next' ? 2020 : options.target, options.advanced);
    // Merge intermediate sourcemaps with input sourcemap if enabled
    let fullSourcemap;
    if (options.sourcemap) {
        const partialSourcemaps = [];
        if (esbuildResult.map) {
            partialSourcemaps.unshift(JSON.parse(esbuildResult.map));
        }
        if (terserResult.map) {
            partialSourcemaps.unshift(terserResult.map);
        }
        if (asset.map) {
            partialSourcemaps.push(asset.map);
        }
        fullSourcemap = (0, remapping_1.default)(partialSourcemaps, () => null);
    }
    return { name: asset.name, code: terserResult.code, map: fullSourcemap };
}
exports.default = default_1;
/**
 * Optimizes a JavaScript asset using esbuild.
 *
 * @param content The JavaScript asset source content to optimize.
 * @param name The name of the JavaScript asset. Used to generate source maps.
 * @param options The optimization request options to apply to the content.
 * @returns A promise that resolves with the optimized code, source map, and any warnings.
 */
async function optimizeWithEsbuild(content, name, options) {
    var _a;
    if (!esbuild) {
        esbuild = new esbuild_executor_1.EsbuildExecutor(options.alwaysUseWasm);
    }
    let result;
    try {
        result = await esbuild.transform(content, {
            minifyIdentifiers: !options.keepIdentifierNames,
            minifySyntax: true,
            // NOTE: Disabling whitespace ensures unused pure annotations are kept
            minifyWhitespace: false,
            pure: ['forwardRef'],
            legalComments: options.removeLicenses ? 'none' : 'inline',
            sourcefile: name,
            sourcemap: options.sourcemap && 'external',
            define: options.define,
            // This option should always be disabled for browser builds as we don't rely on `.name`
            // and causes deadcode to be retained which makes `NG_BUILD_MANGLE` unusable to investigate tree-shaking issues.
            // We enable `keepNames` only for server builds as Domino relies on `.name`.
            // Once we no longer rely on Domino for SSR we should be able to remove this.
            keepNames: options.keepNames,
            target: `es${options.target}`,
        });
    }
    catch (error) {
        const failure = error;
        // If esbuild fails with only ES5 support errors, fallback to just terser.
        // This will only happen if ES5 is the output target and a global script contains ES2015+ syntax.
        // In that case, the global script is technically already invalid for the target environment but
        // this is and has been considered a configuration issue. Global scripts must be compatible with
        // the target environment.
        if ((_a = failure.errors) === null || _a === void 0 ? void 0 : _a.every((error) => error.text.includes('to the configured target environment ("es5") is not supported yet'))) {
            result = {
                code: content,
                map: '',
                warnings: [],
            };
        }
        else {
            throw error;
        }
    }
    return result;
}
/**
 * Optimizes a JavaScript asset using terser.
 *
 * @param name The name of the JavaScript asset. Used to generate source maps.
 * @param code The JavaScript asset source content to optimize.
 * @param sourcemaps If true, generate an output source map for the optimized code.
 * @param target Specifies the target ECMAScript version for the output code.
 * @param advanced Controls advanced optimizations.
 * @returns A promise that resolves with the optimized code and source map.
 */
async function optimizeWithTerser(name, code, sourcemaps, target, advanced) {
    const result = await (0, terser_1.minify)({ [name]: code }, {
        compress: {
            passes: advanced ? 2 : 1,
            pure_getters: advanced,
        },
        ecma: target,
        // esbuild in the first pass is used to minify identifiers instead of mangle here
        mangle: false,
        // esbuild in the first pass is used to minify function names
        keep_fnames: true,
        format: {
            // ASCII output is enabled here as well to prevent terser from converting back to UTF-8
            ascii_only: true,
            wrap_func_args: false,
        },
        sourceMap: sourcemaps &&
            {
                asObject: true,
                // typings don't include asObject option
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            },
    });
    if (!result.code) {
        throw new Error('Terser failed for unknown reason.');
    }
    return { code: result.code, map: result.map };
}
