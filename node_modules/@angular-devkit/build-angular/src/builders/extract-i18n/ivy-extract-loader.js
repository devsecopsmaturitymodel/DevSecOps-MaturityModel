"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodePath = __importStar(require("path"));
const load_esm_1 = require("../../utils/load-esm");
function localizeExtractLoader(content, map) {
    // This loader is not cacheable due to how message extraction works.
    // Extracted messages are not part of webpack pipeline and hence they cannot be retrieved from cache.
    // TODO: We should investigate in the future on making this deterministic and more cacheable.
    this.cacheable(false);
    const options = this.getOptions();
    const callback = this.async();
    extract(this, content, map, options).then(() => {
        // Pass through the original content now that messages have been extracted
        callback(undefined, content, map);
    }, (error) => {
        callback(error);
    });
}
exports.default = localizeExtractLoader;
async function extract(loaderContext, content, map, options) {
    // Try to load the `@angular/localize` message extractor.
    // All the localize usages are setup to first try the ESM entry point then fallback to the deep imports.
    // This provides interim compatibility while the framework is transitioned to bundled ESM packages.
    let MessageExtractor;
    try {
        // Load ESM `@angular/localize/tools` using the TypeScript dynamic import workaround.
        // Once TypeScript provides support for keeping the dynamic import this workaround can be
        // changed to a direct dynamic import.
        const localizeToolsModule = await (0, load_esm_1.loadEsmModule)('@angular/localize/tools');
        MessageExtractor = localizeToolsModule.MessageExtractor;
    }
    catch {
        throw new Error(`Unable to load message extractor. Please ensure '@angular/localize' is installed.`);
    }
    // Setup a Webpack-based logger instance
    const logger = {
        // level 2 is warnings
        level: 2,
        debug(...args) {
            // eslint-disable-next-line no-console
            console.debug(...args);
        },
        info(...args) {
            loaderContext.emitWarning(new Error(args.join('')));
        },
        warn(...args) {
            loaderContext.emitWarning(new Error(args.join('')));
        },
        error(...args) {
            loaderContext.emitError(new Error(args.join('')));
        },
    };
    let filename = loaderContext.resourcePath;
    const mapObject = typeof map === 'string' ? JSON.parse(map) : map;
    if (mapObject === null || mapObject === void 0 ? void 0 : mapObject.file) {
        // The extractor's internal sourcemap handling expects the filenames to match
        filename = nodePath.join(loaderContext.context, mapObject.file);
    }
    // Setup a virtual file system instance for the extractor
    // * MessageExtractor itself uses readFile, relative and resolve
    // * Internal SourceFileLoader (sourcemap support) uses dirname, exists, readFile, and resolve
    const filesystem = {
        readFile(path) {
            if (path === filename) {
                return content;
            }
            else if (path === filename + '.map') {
                return typeof map === 'string' ? map : JSON.stringify(map);
            }
            else {
                throw new Error('Unknown file requested: ' + path);
            }
        },
        relative(from, to) {
            return nodePath.relative(from, to);
        },
        resolve(...paths) {
            return nodePath.resolve(...paths);
        },
        exists(path) {
            return path === filename || path === filename + '.map';
        },
        dirname(path) {
            return nodePath.dirname(path);
        },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractor = new MessageExtractor(filesystem, logger, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        basePath: loaderContext.rootContext,
        useSourceMaps: !!map,
    });
    const messages = extractor.extractMessages(filename);
    if (messages.length > 0) {
        options === null || options === void 0 ? void 0 : options.messageHandler(messages);
    }
}
