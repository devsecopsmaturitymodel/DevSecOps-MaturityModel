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
exports.ArchitectCommand = void 0;
const architect_1 = require("@angular-devkit/architect");
const node_1 = require("@angular-devkit/architect/node");
const core_1 = require("@angular-devkit/core");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const json_schema_1 = require("../utilities/json-schema");
const package_manager_1 = require("../utilities/package-manager");
const analytics_1 = require("./analytics");
const command_1 = require("./command");
const parser_1 = require("./parser");
class ArchitectCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.useReportAnalytics = false;
        // If this command supports running multiple targets.
        this.multiTarget = false;
    }
    async onMissingTarget(projectName) {
        if (this.missingTargetError) {
            this.logger.fatal(this.missingTargetError);
            return 1;
        }
        if (projectName) {
            this.logger.fatal(`Project '${projectName}' does not support the '${this.target}' target.`);
        }
        else {
            this.logger.fatal(`No projects support the '${this.target}' target.`);
        }
        return 1;
    }
    // eslint-disable-next-line max-lines-per-function
    async initialize(options) {
        this._registry = new core_1.json.schema.CoreSchemaRegistry();
        this._registry.addPostTransform(core_1.json.schema.transforms.addUndefinedDefaults);
        this._registry.useXDeprecatedProvider((msg) => this.logger.warn(msg));
        if (!this.workspace) {
            this.logger.fatal('A workspace is required for this command.');
            return 1;
        }
        this._architectHost = new node_1.WorkspaceNodeModulesArchitectHost(this.workspace, this.workspace.basePath);
        this._architect = new architect_1.Architect(this._architectHost, this._registry);
        if (!this.target) {
            if (options.help) {
                // This is a special case where we just return.
                return;
            }
            const specifier = this._makeTargetSpecifier(options);
            if (!specifier.project || !specifier.target) {
                this.logger.fatal('Cannot determine project or target for command.');
                return 1;
            }
            return;
        }
        let projectName = options.project;
        if (projectName && !this.workspace.projects.has(projectName)) {
            this.logger.fatal(`Project '${projectName}' does not exist.`);
            return 1;
        }
        const commandLeftovers = options['--'];
        const targetProjectNames = [];
        for (const [name, project] of this.workspace.projects) {
            if (project.targets.has(this.target)) {
                targetProjectNames.push(name);
            }
        }
        if (projectName && !targetProjectNames.includes(projectName)) {
            return await this.onMissingTarget(projectName);
        }
        if (targetProjectNames.length === 0) {
            return await this.onMissingTarget();
        }
        if (!projectName && commandLeftovers && commandLeftovers.length > 0) {
            const builderNames = new Set();
            const leftoverMap = new Map();
            let potentialProjectNames = new Set(targetProjectNames);
            for (const name of targetProjectNames) {
                const builderName = await this._architectHost.getBuilderNameForTarget({
                    project: name,
                    target: this.target,
                });
                if (this.multiTarget) {
                    builderNames.add(builderName);
                }
                let builderDesc;
                try {
                    builderDesc = await this._architectHost.resolveBuilder(builderName);
                }
                catch (e) {
                    if (e.code === 'MODULE_NOT_FOUND') {
                        await this.warnOnMissingNodeModules(this.workspace.basePath);
                        this.logger.fatal(`Could not find the '${builderName}' builder's node package.`);
                        return 1;
                    }
                    throw e;
                }
                const optionDefs = await (0, json_schema_1.parseJsonSchemaToOptions)(this._registry, builderDesc.optionSchema);
                const parsedOptions = (0, parser_1.parseArguments)([...commandLeftovers], optionDefs);
                const builderLeftovers = parsedOptions['--'] || [];
                leftoverMap.set(name, { optionDefs, parsedOptions });
                potentialProjectNames = new Set(builderLeftovers.filter((x) => potentialProjectNames.has(x)));
            }
            if (potentialProjectNames.size === 1) {
                projectName = [...potentialProjectNames][0];
                // remove the project name from the leftovers
                const optionInfo = leftoverMap.get(projectName);
                if (optionInfo) {
                    const locations = [];
                    let i = 0;
                    while (i < commandLeftovers.length) {
                        i = commandLeftovers.indexOf(projectName, i + 1);
                        if (i === -1) {
                            break;
                        }
                        locations.push(i);
                    }
                    delete optionInfo.parsedOptions['--'];
                    for (const location of locations) {
                        const tempLeftovers = [...commandLeftovers];
                        tempLeftovers.splice(location, 1);
                        const tempArgs = (0, parser_1.parseArguments)([...tempLeftovers], optionInfo.optionDefs);
                        delete tempArgs['--'];
                        if (JSON.stringify(optionInfo.parsedOptions) === JSON.stringify(tempArgs)) {
                            options['--'] = tempLeftovers;
                            break;
                        }
                    }
                }
            }
            if (!projectName && this.multiTarget && builderNames.size > 1) {
                this.logger.fatal(core_1.tags.oneLine `
          Architect commands with command line overrides cannot target different builders. The
          '${this.target}' target would run on projects ${targetProjectNames.join()} which have the
          following builders: ${'\n  ' + [...builderNames].join('\n  ')}
        `);
                return 1;
            }
        }
        if (!projectName && !this.multiTarget) {
            const defaultProjectName = this.workspace.extensions['defaultProject'];
            if (targetProjectNames.length === 1) {
                projectName = targetProjectNames[0];
            }
            else if (defaultProjectName && targetProjectNames.includes(defaultProjectName)) {
                projectName = defaultProjectName;
            }
            else if (options.help) {
                // This is a special case where we just return.
                return;
            }
            else {
                this.logger.fatal(this.missingTargetError || 'Cannot determine project or target for command.');
                return 1;
            }
        }
        options.project = projectName;
        const builderConf = await this._architectHost.getBuilderNameForTarget({
            project: projectName || (targetProjectNames.length > 0 ? targetProjectNames[0] : ''),
            target: this.target,
        });
        let builderDesc;
        try {
            builderDesc = await this._architectHost.resolveBuilder(builderConf);
        }
        catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                await this.warnOnMissingNodeModules(this.workspace.basePath);
                this.logger.fatal(`Could not find the '${builderConf}' builder's node package.`);
                return 1;
            }
            throw e;
        }
        this.description.options.push(...(await (0, json_schema_1.parseJsonSchemaToOptions)(this._registry, builderDesc.optionSchema)));
        // Update options to remove analytics from options if the builder isn't safelisted.
        for (const o of this.description.options) {
            if (o.userAnalytics && !(0, analytics_1.isPackageNameSafeForAnalytics)(builderConf)) {
                o.userAnalytics = undefined;
            }
        }
    }
    async warnOnMissingNodeModules(basePath) {
        // Check for a `node_modules` directory (npm, yarn non-PnP, etc.)
        if ((0, fs_1.existsSync)(path.resolve(basePath, 'node_modules'))) {
            return;
        }
        // Check for yarn PnP files
        if ((0, fs_1.existsSync)(path.resolve(basePath, '.pnp.js')) ||
            (0, fs_1.existsSync)(path.resolve(basePath, '.pnp.cjs')) ||
            (0, fs_1.existsSync)(path.resolve(basePath, '.pnp.mjs'))) {
            return;
        }
        const packageManager = await (0, package_manager_1.getPackageManager)(basePath);
        let installSuggestion = 'Try installing with ';
        switch (packageManager) {
            case 'npm':
                installSuggestion += `'npm install'`;
                break;
            case 'yarn':
                installSuggestion += `'yarn'`;
                break;
            default:
                installSuggestion += `the project's package manager`;
                break;
        }
        this.logger.warn(`Node packages may not be installed. ${installSuggestion}.`);
    }
    async run(options) {
        return await this.runArchitectTarget(options);
    }
    async runSingleTarget(target, targetOptions) {
        // We need to build the builderSpec twice because architect does not understand
        // overrides separately (getting the configuration builds the whole project, including
        // overrides).
        const builderConf = await this._architectHost.getBuilderNameForTarget(target);
        let builderDesc;
        try {
            builderDesc = await this._architectHost.resolveBuilder(builderConf);
        }
        catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                await this.warnOnMissingNodeModules(this.workspace.basePath);
                this.logger.fatal(`Could not find the '${builderConf}' builder's node package.`);
                return 1;
            }
            throw e;
        }
        const targetOptionArray = await (0, json_schema_1.parseJsonSchemaToOptions)(this._registry, builderDesc.optionSchema);
        const overrides = (0, parser_1.parseArguments)(targetOptions, targetOptionArray, this.logger);
        const allowAdditionalProperties = typeof builderDesc.optionSchema === 'object' && builderDesc.optionSchema.additionalProperties;
        if (overrides['--'] && !allowAdditionalProperties) {
            (overrides['--'] || []).forEach((additional) => {
                this.logger.fatal(`Unknown option: '${additional.split(/=/)[0]}'`);
            });
            return 1;
        }
        await this.reportAnalytics([this.description.name], {
            ...(await this._architectHost.getOptionsForTarget(target)),
            ...overrides,
        });
        const run = await this._architect.scheduleTarget(target, overrides, {
            logger: this.logger,
            analytics: (0, analytics_1.isPackageNameSafeForAnalytics)(builderConf) ? this.analytics : undefined,
        });
        const { error, success } = await run.output.toPromise();
        await run.stop();
        if (error) {
            this.logger.error(error);
        }
        return success ? 0 : 1;
    }
    async runArchitectTarget(options) {
        var _a;
        const extra = options['--'] || [];
        try {
            const targetSpec = this._makeTargetSpecifier(options);
            if (!targetSpec.project && this.target) {
                // This runs each target sequentially.
                // Running them in parallel would jumble the log messages.
                let result = 0;
                for (const project of this.getProjectNamesByTarget(this.target)) {
                    result |= await this.runSingleTarget({ ...targetSpec, project }, extra);
                }
                return result;
            }
            else {
                return await this.runSingleTarget(targetSpec, extra);
            }
        }
        catch (e) {
            if (e instanceof core_1.schema.SchemaValidationException) {
                const newErrors = [];
                for (const schemaError of e.errors) {
                    if (schemaError.keyword === 'additionalProperties') {
                        const unknownProperty = (_a = schemaError.params) === null || _a === void 0 ? void 0 : _a.additionalProperty;
                        if (unknownProperty in options) {
                            const dashes = unknownProperty.length === 1 ? '-' : '--';
                            this.logger.fatal(`Unknown option: '${dashes}${unknownProperty}'`);
                            continue;
                        }
                    }
                    newErrors.push(schemaError);
                }
                if (newErrors.length > 0) {
                    this.logger.error(new core_1.schema.SchemaValidationException(newErrors).message);
                }
                return 1;
            }
            else {
                throw e;
            }
        }
    }
    getProjectNamesByTarget(targetName) {
        const allProjectsForTargetName = [];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const [name, project] of this.workspace.projects) {
            if (project.targets.has(targetName)) {
                allProjectsForTargetName.push(name);
            }
        }
        if (this.multiTarget) {
            // For multi target commands, we always list all projects that have the target.
            return allProjectsForTargetName;
        }
        else {
            // For single target commands, we try the default project first,
            // then the full list if it has a single project, then error out.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const maybeDefaultProject = this.workspace.extensions['defaultProject'];
            if (maybeDefaultProject && allProjectsForTargetName.includes(maybeDefaultProject)) {
                return [maybeDefaultProject];
            }
            if (allProjectsForTargetName.length === 1) {
                return allProjectsForTargetName;
            }
            throw new Error(`Could not determine a single project for the '${targetName}' target.`);
        }
    }
    _makeTargetSpecifier(commandOptions) {
        var _a, _b, _c;
        let project, target, configuration;
        if (commandOptions.target) {
            [project, target, configuration] = commandOptions.target.split(':');
            if (commandOptions.configuration) {
                configuration = commandOptions.configuration;
            }
        }
        else {
            project = commandOptions.project;
            target = this.target;
            if (commandOptions.prod) {
                const defaultConfig = project &&
                    target &&
                    ((_c = (_b = (_a = this.workspace) === null || _a === void 0 ? void 0 : _a.projects.get(project)) === null || _b === void 0 ? void 0 : _b.targets.get(target)) === null || _c === void 0 ? void 0 : _c.defaultConfiguration);
                this.logger.warn(defaultConfig === 'production'
                    ? 'Option "--prod" is deprecated: No need to use this option as this builder defaults to configuration "production".'
                    : 'Option "--prod" is deprecated: Use "--configuration production" instead.');
                // The --prod flag will always be the first configuration, available to be overwritten
                // by following configurations.
                configuration = 'production';
            }
            if (commandOptions.configuration) {
                configuration = `${configuration ? `${configuration},` : ''}${commandOptions.configuration}`;
            }
        }
        if (!project) {
            project = '';
        }
        if (!target) {
            target = '';
        }
        return {
            project,
            configuration: configuration || '',
            target,
        };
    }
}
exports.ArchitectCommand = ArchitectCommand;
