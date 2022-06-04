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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsCollector = void 0;
const core_1 = require("@angular-devkit/core");
const child_process_1 = require("child_process");
const debug_1 = __importDefault(require("debug"));
const https = __importStar(require("https"));
const os = __importStar(require("os"));
const querystring = __importStar(require("querystring"));
const version_1 = require("./version");
/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
class AnalyticsCollector {
    constructor(trackingId, userId) {
        this.trackingEventsQueue = [];
        this.parameters = {};
        this.analyticsLogDebug = (0, debug_1.default)('ng:analytics:log');
        // API Version
        this.parameters['v'] = '1';
        // User ID
        this.parameters['cid'] = userId;
        // Tracking
        this.parameters['tid'] = trackingId;
        this.parameters['ds'] = 'cli';
        this.parameters['ua'] = _buildUserAgentString();
        this.parameters['ul'] = _getLanguage();
        // @angular/cli with version.
        this.parameters['an'] = '@angular/cli';
        this.parameters['av'] = version_1.VERSION.full;
        // We use the application ID for the Node version. This should be "node v12.10.0".
        const nodeVersion = `node ${process.version}`;
        this.parameters['aid'] = nodeVersion;
        // Custom dimentions
        // We set custom metrics for values we care about.
        this.parameters['cd' + core_1.analytics.NgCliAnalyticsDimensions.CpuCount] = os.cpus().length;
        // Get the first CPU's speed. It's very rare to have multiple CPUs of different speed (in most
        // non-ARM configurations anyway), so that's all we care about.
        this.parameters['cd' + core_1.analytics.NgCliAnalyticsDimensions.CpuSpeed] = Math.floor(os.cpus()[0].speed);
        this.parameters['cd' + core_1.analytics.NgCliAnalyticsDimensions.RamInGigabytes] = Math.round(os.totalmem() / (1024 * 1024 * 1024));
        this.parameters['cd' + core_1.analytics.NgCliAnalyticsDimensions.NodeVersion] = nodeVersion;
        this.parameters['cd' + core_1.analytics.NgCliAnalyticsDimensions.AngularCLIMajorVersion] =
            version_1.VERSION.major;
    }
    event(ec, ea, options = {}) {
        const { label: el, value: ev, metrics, dimensions } = options;
        this.addToQueue('event', { ec, ea, el, ev, metrics, dimensions });
    }
    pageview(dp, options = {}) {
        const { hostname: dh, title: dt, metrics, dimensions } = options;
        this.addToQueue('pageview', { dp, dh, dt, metrics, dimensions });
    }
    timing(utc, utv, utt, options = {}) {
        const { label: utl, metrics, dimensions } = options;
        this.addToQueue('timing', { utc, utv, utt, utl, metrics, dimensions });
    }
    screenview(cd, an, options = {}) {
        const { appVersion: av, appId: aid, appInstallerId: aiid, metrics, dimensions } = options;
        this.addToQueue('screenview', { cd, an, av, aid, aiid, metrics, dimensions });
    }
    async flush() {
        const pending = this.trackingEventsQueue.length;
        this.analyticsLogDebug(`flush queue size: ${pending}`);
        if (!pending) {
            return;
        }
        // The below is needed so that if flush is called multiple times,
        // we don't report the same event multiple times.
        const pendingTrackingEvents = this.trackingEventsQueue;
        this.trackingEventsQueue = [];
        try {
            await this.send(pendingTrackingEvents);
        }
        catch (error) {
            // Failure to report analytics shouldn't crash the CLI.
            this.analyticsLogDebug('send error: %j', error);
        }
    }
    addToQueue(eventType, parameters) {
        const { metrics, dimensions, ...restParameters } = parameters;
        const data = {
            ...this.parameters,
            ...restParameters,
            ...this.customVariables({ metrics, dimensions }),
            t: eventType,
        };
        this.analyticsLogDebug('add event to queue: %j', data);
        this.trackingEventsQueue.push(data);
    }
    async send(data) {
        this.analyticsLogDebug('send event: %j', data);
        return new Promise((resolve, reject) => {
            const request = https.request({
                host: 'www.google-analytics.com',
                method: 'POST',
                path: data.length > 1 ? '/batch' : '/collect',
            }, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Analytics reporting failed with status code: ${response.statusCode}.`));
                    return;
                }
            });
            request.on('error', reject);
            const queryParameters = data.map((p) => querystring.stringify(p)).join('\n');
            request.write(queryParameters);
            request.end(resolve);
        });
    }
    /**
     * Creates the dimension and metrics variables to add to the queue.
     * @private
     */
    customVariables(options) {
        const additionals = {};
        const { dimensions, metrics } = options;
        dimensions === null || dimensions === void 0 ? void 0 : dimensions.forEach((v, i) => (additionals[`cd${i}`] = v));
        metrics === null || metrics === void 0 ? void 0 : metrics.forEach((v, i) => (additionals[`cm${i}`] = v));
        return additionals;
    }
}
exports.AnalyticsCollector = AnalyticsCollector;
// These are just approximations of UA strings. We just try to fool Google Analytics to give us the
// data we want.
// See https://developers.whatismybrowser.com/useragents/
const osVersionMap = {
    darwin: {
        '1.3.1': '10_0_4',
        '1.4.1': '10_1_0',
        '5.1': '10_1_1',
        '5.2': '10_1_5',
        '6.0.1': '10_2',
        '6.8': '10_2_8',
        '7.0': '10_3_0',
        '7.9': '10_3_9',
        '8.0': '10_4_0',
        '8.11': '10_4_11',
        '9.0': '10_5_0',
        '9.8': '10_5_8',
        '10.0': '10_6_0',
        '10.8': '10_6_8',
        // We stop here because we try to math out the version for anything greater than 10, and it
        // works. Those versions are standardized using a calculation now.
    },
    win32: {
        '6.3.9600': 'Windows 8.1',
        '6.2.9200': 'Windows 8',
        '6.1.7601': 'Windows 7 SP1',
        '6.1.7600': 'Windows 7',
        '6.0.6002': 'Windows Vista SP2',
        '6.0.6000': 'Windows Vista',
        '5.1.2600': 'Windows XP',
    },
};
/**
 * Build a fake User Agent string. This gets sent to Analytics so it shows the proper OS version.
 * @private
 */
function _buildUserAgentString() {
    switch (os.platform()) {
        case 'darwin': {
            let v = osVersionMap.darwin[os.release()];
            if (!v) {
                // Remove 4 to tie Darwin version to OSX version, add other info.
                const x = parseFloat(os.release());
                if (x > 10) {
                    v = `10_` + (x - 4).toString().replace('.', '_');
                }
            }
            const cpuModel = os.cpus()[0].model.match(/^[a-z]+/i);
            const cpu = cpuModel ? cpuModel[0] : os.cpus()[0].model;
            return `(Macintosh; ${cpu} Mac OS X ${v || os.release()})`;
        }
        case 'win32':
            return `(Windows NT ${os.release()})`;
        case 'linux':
            return `(X11; Linux i686; ${os.release()}; ${os.cpus()[0].model})`;
        default:
            return os.platform() + ' ' + os.release();
    }
}
/**
 * Get a language code.
 * @private
 */
function _getLanguage() {
    // Note: Windows does not expose the configured language by default.
    return (process.env.LANG || // Default Unix env variable.
        process.env.LC_CTYPE || // For C libraries. Sometimes the above isn't set.
        process.env.LANGSPEC || // For Windows, sometimes this will be set (not always).
        _getWindowsLanguageCode() ||
        '??'); // ¯\_(ツ)_/¯
}
/**
 * Attempt to get the Windows Language Code string.
 * @private
 */
function _getWindowsLanguageCode() {
    if (!os.platform().startsWith('win')) {
        return undefined;
    }
    try {
        // This is true on Windows XP, 7, 8 and 10 AFAIK. Would return empty string or fail if it
        // doesn't work.
        return (0, child_process_1.execSync)('wmic.exe os get locale').toString().trim();
    }
    catch { }
    return undefined;
}
