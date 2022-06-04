/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { analytics } from '@angular-devkit/core';
/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
export declare class AnalyticsCollector implements analytics.Analytics {
    private trackingEventsQueue;
    private readonly parameters;
    private readonly analyticsLogDebug;
    constructor(trackingId: string, userId: string);
    event(ec: string, ea: string, options?: analytics.EventOptions): void;
    pageview(dp: string, options?: analytics.PageviewOptions): void;
    timing(utc: string, utv: string, utt: string | number, options?: analytics.TimingOptions): void;
    screenview(cd: string, an: string, options?: analytics.ScreenviewOptions): void;
    flush(): Promise<void>;
    private addToQueue;
    private send;
    /**
     * Creates the dimension and metrics variables to add to the queue.
     * @private
     */
    private customVariables;
}
