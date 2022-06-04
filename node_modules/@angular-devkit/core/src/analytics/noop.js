"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoopAnalytics = void 0;
/**
 * Analytics implementation that does nothing.
 */
class NoopAnalytics {
    event() { }
    screenview() { }
    pageview() { }
    timing() { }
    flush() {
        return Promise.resolve();
    }
}
exports.NoopAnalytics = NoopAnalytics;
