"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigCommand = void 0;
const core_1 = require("@angular-devkit/core");
const uuid_1 = require("uuid");
const command_1 = require("../models/command");
const interface_1 = require("../models/interface");
const config_1 = require("../utilities/config");
const json_file_1 = require("../utilities/json-file");
const validCliPaths = new Map([
    ['cli.warnings.versionMismatch', undefined],
    ['cli.defaultCollection', undefined],
    ['cli.packageManager', undefined],
    ['cli.analytics', undefined],
    ['cli.analyticsSharing.tracking', undefined],
    ['cli.analyticsSharing.uuid', (v) => (v === '' ? (0, uuid_1.v4)() : `${v}`)],
    ['cli.cache.enabled', undefined],
    ['cli.cache.environment', undefined],
    ['cli.cache.path', undefined],
]);
/**
 * Splits a JSON path string into fragments. Fragments can be used to get the value referenced
 * by the path. For example, a path of "a[3].foo.bar[2]" would give you a fragment array of
 * ["a", 3, "foo", "bar", 2].
 * @param path The JSON string to parse.
 * @returns {(string|number)[]} The fragments for the string.
 * @private
 */
function parseJsonPath(path) {
    const fragments = (path || '').split(/\./g);
    const result = [];
    while (fragments.length > 0) {
        const fragment = fragments.shift();
        if (fragment == undefined) {
            break;
        }
        const match = fragment.match(/([^[]+)((\[.*\])*)/);
        if (!match) {
            throw new Error('Invalid JSON path.');
        }
        result.push(match[1]);
        if (match[2]) {
            const indices = match[2]
                .slice(1, -1)
                .split('][')
                .map((x) => (/^\d$/.test(x) ? +x : x.replace(/"|'/g, '')));
            result.push(...indices);
        }
    }
    return result.filter((fragment) => fragment != null);
}
function normalizeValue(value) {
    const valueString = `${value}`.trim();
    switch (valueString) {
        case 'true':
            return true;
        case 'false':
            return false;
        case 'null':
            return null;
        case 'undefined':
            return undefined;
    }
    if (isFinite(+valueString)) {
        return +valueString;
    }
    try {
        // We use `JSON.parse` instead of `parseJson` because the latter will parse UUIDs
        // and convert them into a numberic entities.
        // Example: 73b61974-182c-48e4-b4c6-30ddf08c5c98 -> 73.
        // These values should never contain comments, therefore using `JSON.parse` is safe.
        return JSON.parse(valueString);
    }
    catch {
        return value;
    }
}
class ConfigCommand extends command_1.Command {
    async run(options) {
        const level = options.global ? 'global' : 'local';
        if (!options.global) {
            await this.validateScope(interface_1.CommandScope.InProject);
        }
        let [config] = (0, config_1.getWorkspaceRaw)(level);
        if (options.global && !config) {
            try {
                if ((0, config_1.migrateLegacyGlobalConfig)()) {
                    config = (0, config_1.getWorkspaceRaw)(level)[0];
                    this.logger.info(core_1.tags.oneLine `
            We found a global configuration that was used in Angular CLI 1.
            It has been automatically migrated.`);
                }
            }
            catch { }
        }
        if (options.value == undefined) {
            if (!config) {
                this.logger.error('No config found.');
                return 1;
            }
            return this.get(config, options);
        }
        else {
            return this.set(options);
        }
    }
    get(jsonFile, options) {
        let value;
        if (options.jsonPath) {
            value = jsonFile.get(parseJsonPath(options.jsonPath));
        }
        else {
            value = jsonFile.content;
        }
        if (value === undefined) {
            this.logger.error('Value cannot be found.');
            return 1;
        }
        else if (typeof value === 'string') {
            this.logger.info(value);
        }
        else {
            this.logger.info(JSON.stringify(value, null, 2));
        }
        return 0;
    }
    async set(options) {
        var _a, _b, _c;
        if (!((_a = options.jsonPath) === null || _a === void 0 ? void 0 : _a.trim())) {
            throw new Error('Invalid Path.');
        }
        if (options.global &&
            !options.jsonPath.startsWith('schematics.') &&
            !validCliPaths.has(options.jsonPath)) {
            throw new Error('Invalid Path.');
        }
        const [config, configPath] = (0, config_1.getWorkspaceRaw)(options.global ? 'global' : 'local');
        if (!config || !configPath) {
            this.logger.error('Confguration file cannot be found.');
            return 1;
        }
        const jsonPath = parseJsonPath(options.jsonPath);
        const value = (_c = (_b = validCliPaths.get(options.jsonPath)) === null || _b === void 0 ? void 0 : _b(options.value)) !== null && _c !== void 0 ? _c : options.value;
        const modified = config.modify(jsonPath, normalizeValue(value));
        if (!modified) {
            this.logger.error('Value cannot be found.');
            return 1;
        }
        try {
            await (0, config_1.validateWorkspace)((0, json_file_1.parseJson)(config.content));
        }
        catch (error) {
            this.logger.fatal(error.message);
            return 1;
        }
        config.save();
        return 0;
    }
}
exports.ConfigCommand = ConfigCommand;
