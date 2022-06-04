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
exports.getSharedAnalytics = exports.getWorkspaceAnalytics = exports.hasWorkspaceAnalyticsConfiguration = exports.getGlobalAnalytics = exports.hasGlobalAnalyticsConfiguration = exports.promptProjectAnalytics = exports.promptGlobalAnalytics = exports.setAnalyticsConfig = exports.isPackageNameSafeForAnalytics = exports.analyticsPackageSafelist = exports.AnalyticsProperties = void 0;
const core_1 = require("@angular-devkit/core");
const debug_1 = __importDefault(require("debug"));
const inquirer = __importStar(require("inquirer"));
const uuid_1 = require("uuid");
const version_1 = require("../models/version");
const color_1 = require("../utilities/color");
const config_1 = require("../utilities/config");
const tty_1 = require("../utilities/tty");
const analytics_collector_1 = require("./analytics-collector");
/* eslint-disable no-console */
const analyticsDebug = (0, debug_1.default)('ng:analytics'); // Generate analytics, including settings and users.
let _defaultAngularCliPropertyCache;
exports.AnalyticsProperties = {
    AngularCliProd: 'UA-8594346-29',
    AngularCliStaging: 'UA-8594346-32',
    get AngularCliDefault() {
        if (_defaultAngularCliPropertyCache) {
            return _defaultAngularCliPropertyCache;
        }
        const v = version_1.VERSION.full;
        // The logic is if it's a full version then we should use the prod GA property.
        if (/^\d+\.\d+\.\d+$/.test(v) && v !== '0.0.0') {
            _defaultAngularCliPropertyCache = exports.AnalyticsProperties.AngularCliProd;
        }
        else {
            _defaultAngularCliPropertyCache = exports.AnalyticsProperties.AngularCliStaging;
        }
        return _defaultAngularCliPropertyCache;
    },
};
/**
 * This is the ultimate safelist for checking if a package name is safe to report to analytics.
 */
exports.analyticsPackageSafelist = [
    /^@angular\//,
    /^@angular-devkit\//,
    /^@ngtools\//,
    '@schematics/angular',
];
function isPackageNameSafeForAnalytics(name) {
    return exports.analyticsPackageSafelist.some((pattern) => {
        if (typeof pattern == 'string') {
            return pattern === name;
        }
        else {
            return pattern.test(name);
        }
    });
}
exports.isPackageNameSafeForAnalytics = isPackageNameSafeForAnalytics;
/**
 * Set analytics settings. This does not work if the user is not inside a project.
 * @param level Which config to use. "global" for user-level, and "local" for project-level.
 * @param value Either a user ID, true to generate a new User ID, or false to disable analytics.
 */
function setAnalyticsConfig(level, value) {
    analyticsDebug('setting %s level analytics to: %s', level, value);
    const [config, configPath] = (0, config_1.getWorkspaceRaw)(level);
    if (!config || !configPath) {
        throw new Error(`Could not find ${level} workspace.`);
    }
    const cli = config.get(['cli']);
    if (cli !== undefined && !core_1.json.isJsonObject(cli)) {
        throw new Error(`Invalid config found at ${configPath}. CLI should be an object.`);
    }
    if (value === true) {
        value = (0, uuid_1.v4)();
    }
    config.modify(['cli', 'analytics'], value);
    config.save();
    analyticsDebug('done');
}
exports.setAnalyticsConfig = setAnalyticsConfig;
/**
 * Prompt the user for usage gathering permission.
 * @param force Whether to ask regardless of whether or not the user is using an interactive shell.
 * @return Whether or not the user was shown a prompt.
 */
async function promptGlobalAnalytics(force = false) {
    analyticsDebug('prompting global analytics.');
    if (force || (0, tty_1.isTTY)()) {
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'analytics',
                message: core_1.tags.stripIndents `
          Would you like to share anonymous usage data with the Angular Team at Google under
          Google’s Privacy Policy at https://policies.google.com/privacy? For more details and
          how to change this setting, see https://angular.io/analytics.
        `,
                default: false,
            },
        ]);
        setAnalyticsConfig('global', answers.analytics);
        if (answers.analytics) {
            console.log('');
            console.log(core_1.tags.stripIndent `
        Thank you for sharing anonymous usage data. If you change your mind, the following
        command will disable this feature entirely:

            ${color_1.colors.yellow('ng analytics off')}
      `);
            console.log('');
            // Send back a ping with the user `optin`.
            const ua = new analytics_collector_1.AnalyticsCollector(exports.AnalyticsProperties.AngularCliDefault, 'optin');
            ua.pageview('/telemetry/optin');
            await ua.flush();
        }
        else {
            // Send back a ping with the user `optout`. This is the only thing we send.
            const ua = new analytics_collector_1.AnalyticsCollector(exports.AnalyticsProperties.AngularCliDefault, 'optout');
            ua.pageview('/telemetry/optout');
            await ua.flush();
        }
        return true;
    }
    else {
        analyticsDebug('Either STDOUT or STDIN are not TTY and we skipped the prompt.');
    }
    return false;
}
exports.promptGlobalAnalytics = promptGlobalAnalytics;
/**
 * Prompt the user for usage gathering permission for the local project. Fails if there is no
 * local workspace.
 * @param force Whether to ask regardless of whether or not the user is using an interactive shell.
 * @return Whether or not the user was shown a prompt.
 */
async function promptProjectAnalytics(force = false) {
    analyticsDebug('prompting user');
    const [config, configPath] = (0, config_1.getWorkspaceRaw)('local');
    if (!config || !configPath) {
        throw new Error(`Could not find a local workspace. Are you in a project?`);
    }
    if (force || (0, tty_1.isTTY)()) {
        const answers = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'analytics',
                message: core_1.tags.stripIndents `
          Would you like to share anonymous usage data about this project with the Angular Team at
          Google under Google’s Privacy Policy at https://policies.google.com/privacy? For more
          details and how to change this setting, see https://angular.io/analytics.

        `,
                default: false,
            },
        ]);
        setAnalyticsConfig('local', answers.analytics);
        if (answers.analytics) {
            console.log('');
            console.log(core_1.tags.stripIndent `
        Thank you for sharing anonymous usage data. Should you change your mind, the following
        command will disable this feature entirely:

            ${color_1.colors.yellow('ng analytics project off')}
      `);
            console.log('');
            // Send back a ping with the user `optin`.
            const ua = new analytics_collector_1.AnalyticsCollector(exports.AnalyticsProperties.AngularCliDefault, 'optin');
            ua.pageview('/telemetry/project/optin');
            await ua.flush();
        }
        else {
            // Send back a ping with the user `optout`. This is the only thing we send.
            const ua = new analytics_collector_1.AnalyticsCollector(exports.AnalyticsProperties.AngularCliDefault, 'optout');
            ua.pageview('/telemetry/project/optout');
            await ua.flush();
        }
        return true;
    }
    return false;
}
exports.promptProjectAnalytics = promptProjectAnalytics;
async function hasGlobalAnalyticsConfiguration() {
    try {
        const globalWorkspace = await (0, config_1.getWorkspace)('global');
        const analyticsConfig = globalWorkspace && globalWorkspace.getCli() && globalWorkspace.getCli()['analytics'];
        if (analyticsConfig !== null && analyticsConfig !== undefined) {
            return true;
        }
    }
    catch { }
    return false;
}
exports.hasGlobalAnalyticsConfiguration = hasGlobalAnalyticsConfiguration;
/**
 * Get the global analytics object for the user. This returns an instance of UniversalAnalytics,
 * or undefined if analytics are disabled.
 *
 * If any problem happens, it is considered the user has been opting out of analytics.
 */
async function getGlobalAnalytics() {
    analyticsDebug('getGlobalAnalytics');
    const propertyId = exports.AnalyticsProperties.AngularCliDefault;
    if ('NG_CLI_ANALYTICS' in process.env) {
        if (process.env['NG_CLI_ANALYTICS'] == 'false' || process.env['NG_CLI_ANALYTICS'] == '') {
            analyticsDebug('NG_CLI_ANALYTICS is false');
            return undefined;
        }
        if (process.env['NG_CLI_ANALYTICS'] === 'ci') {
            analyticsDebug('Running in CI mode');
            return new analytics_collector_1.AnalyticsCollector(propertyId, 'ci');
        }
    }
    // If anything happens we just keep the NOOP analytics.
    try {
        const globalWorkspace = await (0, config_1.getWorkspace)('global');
        const analyticsConfig = globalWorkspace && globalWorkspace.getCli() && globalWorkspace.getCli()['analytics'];
        analyticsDebug('Client Analytics config found: %j', analyticsConfig);
        if (analyticsConfig === false) {
            analyticsDebug('Analytics disabled. Ignoring all analytics.');
            return undefined;
        }
        else if (analyticsConfig === undefined || analyticsConfig === null) {
            analyticsDebug('Analytics settings not found. Ignoring all analytics.');
            // globalWorkspace can be null if there is no file. analyticsConfig would be null in this
            // case. Since there is no file, the user hasn't answered and the expected return value is
            // undefined.
            return undefined;
        }
        else {
            let uid = undefined;
            if (typeof analyticsConfig == 'string') {
                uid = analyticsConfig;
            }
            else if (typeof analyticsConfig == 'object' && typeof analyticsConfig['uid'] == 'string') {
                uid = analyticsConfig['uid'];
            }
            analyticsDebug('client id: %j', uid);
            if (uid == undefined) {
                return undefined;
            }
            return new analytics_collector_1.AnalyticsCollector(propertyId, uid);
        }
    }
    catch (err) {
        analyticsDebug('Error happened during reading of analytics config: %s', err.message);
        return undefined;
    }
}
exports.getGlobalAnalytics = getGlobalAnalytics;
async function hasWorkspaceAnalyticsConfiguration() {
    try {
        const globalWorkspace = await (0, config_1.getWorkspace)('local');
        const analyticsConfig = globalWorkspace && globalWorkspace.getCli() && globalWorkspace.getCli()['analytics'];
        if (analyticsConfig !== undefined) {
            return true;
        }
    }
    catch { }
    return false;
}
exports.hasWorkspaceAnalyticsConfiguration = hasWorkspaceAnalyticsConfiguration;
/**
 * Get the workspace analytics object for the user. This returns an instance of AnalyticsCollector,
 * or undefined if analytics are disabled.
 *
 * If any problem happens, it is considered the user has been opting out of analytics.
 */
async function getWorkspaceAnalytics() {
    analyticsDebug('getWorkspaceAnalytics');
    try {
        const globalWorkspace = await (0, config_1.getWorkspace)('local');
        const analyticsConfig = globalWorkspace === null || globalWorkspace === void 0 ? void 0 : globalWorkspace.getCli()['analytics'];
        analyticsDebug('Workspace Analytics config found: %j', analyticsConfig);
        if (analyticsConfig === false) {
            analyticsDebug('Analytics disabled. Ignoring all analytics.');
            return undefined;
        }
        else if (analyticsConfig === undefined || analyticsConfig === null) {
            analyticsDebug('Analytics settings not found. Ignoring all analytics.');
            return undefined;
        }
        else {
            let uid = undefined;
            if (typeof analyticsConfig == 'string') {
                uid = analyticsConfig;
            }
            else if (typeof analyticsConfig == 'object' && typeof analyticsConfig['uid'] == 'string') {
                uid = analyticsConfig['uid'];
            }
            analyticsDebug('client id: %j', uid);
            if (uid == undefined) {
                return undefined;
            }
            return new analytics_collector_1.AnalyticsCollector(exports.AnalyticsProperties.AngularCliDefault, uid);
        }
    }
    catch (err) {
        analyticsDebug('Error happened during reading of analytics config: %s', err.message);
        return undefined;
    }
}
exports.getWorkspaceAnalytics = getWorkspaceAnalytics;
/**
 * Return the usage analytics sharing setting, which is either a property string (GA-XXXXXXX-XX),
 * or undefined if no sharing.
 */
async function getSharedAnalytics() {
    analyticsDebug('getSharedAnalytics');
    const envVarName = 'NG_CLI_ANALYTICS_SHARE';
    if (envVarName in process.env) {
        if (process.env[envVarName] == 'false' || process.env[envVarName] == '') {
            analyticsDebug('NG_CLI_ANALYTICS is false');
            return undefined;
        }
    }
    // If anything happens we just keep the NOOP analytics.
    try {
        const globalWorkspace = await (0, config_1.getWorkspace)('global');
        const analyticsConfig = globalWorkspace === null || globalWorkspace === void 0 ? void 0 : globalWorkspace.getCli()['analyticsSharing'];
        if (!analyticsConfig || !analyticsConfig.tracking || !analyticsConfig.uuid) {
            return undefined;
        }
        else {
            analyticsDebug('Analytics sharing info: %j', analyticsConfig);
            return new analytics_collector_1.AnalyticsCollector(analyticsConfig.tracking, analyticsConfig.uuid);
        }
    }
    catch (err) {
        analyticsDebug('Error happened during reading of analytics sharing config: %s', err.message);
        return undefined;
    }
}
exports.getSharedAnalytics = getSharedAnalytics;
