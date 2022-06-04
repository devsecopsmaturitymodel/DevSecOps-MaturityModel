"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsConfig = void 0;
const analytics_1 = require("../plugins/analytics");
function getAnalyticsConfig(wco, context) {
    if (!context.analytics) {
        return {};
    }
    // If there's analytics, add our plugin. Otherwise no need to slow down the build.
    let category = 'build';
    if (context.builder) {
        // We already vetted that this is a "safe" package, otherwise the analytics would be noop.
        category = context.builder.builderName.split(':')[1] || context.builder.builderName || 'build';
    }
    // The category is the builder name if it's an angular builder.
    return {
        plugins: [new analytics_1.NgBuildAnalyticsPlugin(wco.projectRoot, context.analytics, category)],
    };
}
exports.getAnalyticsConfig = getAnalyticsConfig;
