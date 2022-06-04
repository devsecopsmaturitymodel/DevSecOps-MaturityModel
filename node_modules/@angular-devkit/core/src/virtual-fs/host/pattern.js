"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternMatchingHost = void 0;
const resolver_1 = require("./resolver");
/**
 */
class PatternMatchingHost extends resolver_1.ResolverHost {
    constructor() {
        super(...arguments);
        this._patterns = new Map();
    }
    addPattern(pattern, replacementFn) {
        // Simple GLOB pattern replacement.
        const reString = '^(' +
            (Array.isArray(pattern) ? pattern : [pattern])
                .map((ex) => '(' +
                ex
                    .split(/[/\\]/g)
                    .map((f) => f
                    .replace(/[-[\]{}()+?.^$|]/g, '\\$&')
                    .replace(/^\*\*/g, '(.+?)?')
                    .replace(/\*/g, '[^/\\\\]*'))
                    .join('[/\\\\]') +
                ')')
                .join('|') +
            ')($|/|\\\\)';
        this._patterns.set(new RegExp(reString), replacementFn);
    }
    _resolve(path) {
        let newPath = path;
        this._patterns.forEach((fn, re) => {
            if (re.test(path)) {
                newPath = fn(newPath);
            }
        });
        return newPath;
    }
}
exports.PatternMatchingHost = PatternMatchingHost;
