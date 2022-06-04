"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const core_1 = require("@angular-devkit/core");
const color_1 = require("../utilities/color");
const interface_1 = require("./interface");
class Command {
    constructor(context, description, logger) {
        this.context = context;
        this.description = description;
        this.logger = logger;
        this.allowMissingWorkspace = false;
        this.useReportAnalytics = true;
        this.workspace = context.workspace;
        this.analytics = context.analytics || new core_1.analytics.NoopAnalytics();
    }
    static setCommandMap(map) {
        this.commandMap = map;
    }
    async initialize(options) { }
    async printHelp() {
        await this.printHelpUsage();
        await this.printHelpOptions();
        return 0;
    }
    async printJsonHelp() {
        const replacer = (key, value) => key === 'name' ? core_1.strings.dasherize(value) : value;
        this.logger.info(JSON.stringify(this.description, replacer, 2));
        return 0;
    }
    async printHelpUsage() {
        this.logger.info(this.description.description);
        const name = this.description.name;
        const args = this.description.options.filter((x) => x.positional !== undefined);
        const opts = this.description.options.filter((x) => x.positional === undefined);
        const argDisplay = args && args.length > 0 ? ' ' + args.map((a) => `<${a.name}>`).join(' ') : '';
        const optionsDisplay = opts && opts.length > 0 ? ` [options]` : ``;
        this.logger.info(`usage: ng ${name}${argDisplay}${optionsDisplay}`);
        this.logger.info('');
    }
    async printHelpOptions(options = this.description.options) {
        const args = options.filter((opt) => opt.positional !== undefined);
        const opts = options.filter((opt) => opt.positional === undefined);
        const formatDescription = (description) => `    ${description.replace(/\n/g, '\n    ')}`;
        if (args.length > 0) {
            this.logger.info(`arguments:`);
            args.forEach((o) => {
                this.logger.info(`  ${color_1.colors.cyan(o.name)}`);
                if (o.description) {
                    this.logger.info(formatDescription(o.description));
                }
            });
        }
        if (options.length > 0) {
            if (args.length > 0) {
                this.logger.info('');
            }
            this.logger.info(`options:`);
            opts
                .filter((o) => !o.hidden)
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach((o) => {
                const aliases = o.aliases && o.aliases.length > 0
                    ? '(' + o.aliases.map((a) => `-${a}`).join(' ') + ')'
                    : '';
                this.logger.info(`  ${color_1.colors.cyan('--' + core_1.strings.dasherize(o.name))} ${aliases}`);
                if (o.description) {
                    this.logger.info(formatDescription(o.description));
                }
            });
        }
    }
    async validateScope(scope) {
        switch (scope === undefined ? this.description.scope : scope) {
            case interface_1.CommandScope.OutProject:
                if (this.workspace) {
                    this.logger.fatal(core_1.tags.oneLine `
            The ${this.description.name} command requires to be run outside of a project, but a
            project definition was found at "${this.workspace.filePath}".
          `);
                    // eslint-disable-next-line no-throw-literal
                    throw 1;
                }
                break;
            case interface_1.CommandScope.InProject:
                if (!this.workspace) {
                    this.logger.fatal(core_1.tags.oneLine `
            The ${this.description.name} command requires to be run in an Angular project, but a
            project definition could not be found.
          `);
                    // eslint-disable-next-line no-throw-literal
                    throw 1;
                }
                break;
            case interface_1.CommandScope.Everywhere:
                // Can't miss this.
                break;
        }
    }
    async reportAnalytics(paths, options, dimensions = [], metrics = []) {
        for (const option of this.description.options) {
            const ua = option.userAnalytics;
            const v = options[option.name];
            if (v !== undefined && !Array.isArray(v) && ua) {
                dimensions[ua] = v;
            }
        }
        this.analytics.pageview('/command/' + paths.join('/'), { dimensions, metrics });
    }
    async validateAndRun(options) {
        if (!(options.help === true || options.help === 'json' || options.help === 'JSON')) {
            await this.validateScope();
        }
        let result = await this.initialize(options);
        if (typeof result === 'number' && result !== 0) {
            return result;
        }
        if (options.help === true) {
            return this.printHelp();
        }
        else if (options.help === 'json' || options.help === 'JSON') {
            return this.printJsonHelp();
        }
        else {
            const startTime = +new Date();
            if (this.useReportAnalytics) {
                await this.reportAnalytics([this.description.name], options);
            }
            result = await this.run(options);
            const endTime = +new Date();
            this.analytics.timing(this.description.name, 'duration', endTime - startTime);
            return result;
        }
    }
}
exports.Command = Command;
