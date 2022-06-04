"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingAnalytics = void 0;
/**
 * Analytics implementation that logs analytics events to a logger. This should be used for
 * debugging mainly.
 */
class LoggingAnalytics {
    constructor(_logger) {
        this._logger = _logger;
    }
    event(category, action, options) {
        this._logger.info('event ' + JSON.stringify({ category, action, ...options }));
    }
    screenview(screenName, appName, options) {
        this._logger.info('screenview ' + JSON.stringify({ screenName, appName, ...options }));
    }
    pageview(path, options) {
        this._logger.info('pageview ' + JSON.stringify({ path, ...options }));
    }
    timing(category, variable, time, options) {
        this._logger.info('timing ' + JSON.stringify({ category, variable, time, ...options }));
    }
    flush() {
        return Promise.resolve();
    }
}
exports.LoggingAnalytics = LoggingAnalytics;
