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
exports.SchematicCommand = exports.UnknownCollectionError = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const inquirer = __importStar(require("inquirer"));
const systemPath = __importStar(require("path"));
const path_1 = require("path");
const color_1 = require("../utilities/color");
const config_1 = require("../utilities/config");
const json_schema_1 = require("../utilities/json-schema");
const package_manager_1 = require("../utilities/package-manager");
const tty_1 = require("../utilities/tty");
const analytics_1 = require("./analytics");
const command_1 = require("./command");
const parser_1 = require("./parser");
const schematic_engine_host_1 = require("./schematic-engine-host");
class UnknownCollectionError extends Error {
    constructor(collectionName) {
        super(`Invalid collection (${collectionName}).`);
    }
}
exports.UnknownCollectionError = UnknownCollectionError;
class SchematicCommand extends command_1.Command {
    constructor(context, description, logger) {
        super(context, description, logger);
        this.allowPrivateSchematics = false;
        this.useReportAnalytics = false;
        this.defaultCollectionName = '@schematics/angular';
        this.collectionName = this.defaultCollectionName;
    }
    async initialize(options) {
        await this.createWorkflow(options);
        if (this.schematicName) {
            // Set the options.
            const collection = this.getCollection(this.collectionName);
            const schematic = this.getSchematic(collection, this.schematicName, true);
            const options = await (0, json_schema_1.parseJsonSchemaToOptions)(this._workflow.registry, schematic.description.schemaJson || {});
            this.description.description = schematic.description.description;
            this.description.options.push(...options.filter((x) => !x.hidden));
            // Remove any user analytics from schematics that are NOT part of our safelist.
            for (const o of this.description.options) {
                if (o.userAnalytics && !(0, analytics_1.isPackageNameSafeForAnalytics)(this.collectionName)) {
                    o.userAnalytics = undefined;
                }
            }
        }
    }
    async printHelp() {
        await super.printHelp();
        this.logger.info('');
        const subCommandOption = this.description.options.filter((x) => x.subcommands)[0];
        if (!subCommandOption || !subCommandOption.subcommands) {
            return 0;
        }
        const schematicNames = Object.keys(subCommandOption.subcommands);
        if (schematicNames.length > 1) {
            this.logger.info('Available Schematics:');
            const namesPerCollection = {};
            schematicNames.forEach((name) => {
                let [collectionName, schematicName] = name.split(/:/, 2);
                if (!schematicName) {
                    schematicName = collectionName;
                    collectionName = this.collectionName;
                }
                if (!namesPerCollection[collectionName]) {
                    namesPerCollection[collectionName] = [];
                }
                namesPerCollection[collectionName].push(schematicName);
            });
            const defaultCollection = await this.getDefaultSchematicCollection();
            Object.keys(namesPerCollection).forEach((collectionName) => {
                const isDefault = defaultCollection == collectionName;
                this.logger.info(`  Collection "${collectionName}"${isDefault ? ' (default)' : ''}:`);
                namesPerCollection[collectionName].forEach((schematicName) => {
                    this.logger.info(`    ${schematicName}`);
                });
            });
        }
        return 0;
    }
    async printHelpUsage() {
        const subCommandOption = this.description.options.filter((x) => x.subcommands)[0];
        if (!subCommandOption || !subCommandOption.subcommands) {
            return;
        }
        const schematicNames = Object.keys(subCommandOption.subcommands);
        if (schematicNames.length == 1) {
            this.logger.info(this.description.description);
            const opts = this.description.options.filter((x) => x.positional === undefined);
            const [collectionName, schematicName] = schematicNames[0].split(/:/)[0];
            // Display <collectionName:schematicName> if this is not the default collectionName,
            // otherwise just show the schematicName.
            const displayName = collectionName == (await this.getDefaultSchematicCollection())
                ? schematicName
                : schematicNames[0];
            const schematicOptions = subCommandOption.subcommands[schematicNames[0]].options;
            const schematicArgs = schematicOptions.filter((x) => x.positional !== undefined);
            const argDisplay = schematicArgs.length > 0
                ? ' ' + schematicArgs.map((a) => `<${core_1.strings.dasherize(a.name)}>`).join(' ')
                : '';
            this.logger.info(core_1.tags.oneLine `
        usage: ng ${this.description.name} ${displayName}${argDisplay}
        ${opts.length > 0 ? `[options]` : ``}
      `);
            this.logger.info('');
        }
        else {
            await super.printHelpUsage();
        }
    }
    getEngine() {
        return this._workflow.engine;
    }
    getCollection(collectionName) {
        const engine = this.getEngine();
        const collection = engine.createCollection(collectionName);
        if (collection === null) {
            throw new UnknownCollectionError(collectionName);
        }
        return collection;
    }
    getSchematic(collection, schematicName, allowPrivate) {
        return collection.createSchematic(schematicName, allowPrivate);
    }
    setPathOptions(options, workingDir) {
        if (workingDir === '') {
            return {};
        }
        return options
            .filter((o) => o.format === 'path')
            .map((o) => o.name)
            .reduce((acc, curr) => {
            acc[curr] = workingDir;
            return acc;
        }, {});
    }
    /*
     * Runtime hook to allow specifying customized workflow
     */
    async createWorkflow(options) {
        if (this._workflow) {
            return this._workflow;
        }
        const { force, dryRun } = options;
        const root = this.context.root;
        const workflow = new tools_1.NodeWorkflow(root, {
            force,
            dryRun,
            packageManager: await (0, package_manager_1.getPackageManager)(root),
            packageRegistry: options.packageRegistry,
            // A schema registry is required to allow customizing addUndefinedDefaults
            registry: new core_1.schema.CoreSchemaRegistry(schematics_1.formats.standardFormats),
            resolvePaths: this.workspace
                ? // Workspace
                    this.collectionName === this.defaultCollectionName
                        ? // Favor __dirname for @schematics/angular to use the build-in version
                            [__dirname, process.cwd(), root]
                        : [process.cwd(), root, __dirname]
                : // Global
                    [__dirname, process.cwd()],
            schemaValidation: true,
            optionTransforms: [
                // Add configuration file defaults
                async (schematic, current) => {
                    const projectName = typeof current.project === 'string'
                        ? current.project
                        : getProjectName();
                    return {
                        ...(await (0, config_1.getSchematicDefaults)(schematic.collection.name, schematic.name, projectName)),
                        ...current,
                    };
                },
            ],
            engineHostCreator: (options) => new schematic_engine_host_1.SchematicEngineHost(options.resolvePaths),
        });
        const getProjectName = () => {
            if (this.workspace) {
                const projectNames = getProjectsByPath(this.workspace, process.cwd(), this.workspace.basePath);
                if (projectNames.length === 1) {
                    return projectNames[0];
                }
                else {
                    if (projectNames.length > 1) {
                        this.logger.warn(core_1.tags.oneLine `
              Two or more projects are using identical roots.
              Unable to determine project using current working directory.
              Using default workspace project instead.
            `);
                    }
                    const defaultProjectName = this.workspace.extensions['defaultProject'];
                    if (typeof defaultProjectName === 'string' && defaultProjectName) {
                        return defaultProjectName;
                    }
                }
            }
            return undefined;
        };
        workflow.registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
        workflow.registry.addSmartDefaultProvider('projectName', getProjectName);
        workflow.registry.useXDeprecatedProvider((msg) => this.logger.warn(msg));
        let shouldReportAnalytics = true;
        workflow.engineHost.registerOptionsTransform(async (_, options) => {
            if (shouldReportAnalytics) {
                shouldReportAnalytics = false;
                await this.reportAnalytics([this.description.name], options);
            }
            return options;
        });
        if (options.interactive !== false && (0, tty_1.isTTY)()) {
            workflow.registry.usePromptProvider((definitions) => {
                const questions = definitions
                    .filter((definition) => !options.defaults || definition.default === undefined)
                    .map((definition) => {
                    var _a;
                    const question = {
                        name: definition.id,
                        message: definition.message,
                        default: definition.default,
                    };
                    const validator = definition.validator;
                    if (validator) {
                        question.validate = (input) => validator(input);
                        // Filter allows transformation of the value prior to validation
                        question.filter = async (input) => {
                            for (const type of definition.propertyTypes) {
                                let value;
                                switch (type) {
                                    case 'string':
                                        value = String(input);
                                        break;
                                    case 'integer':
                                    case 'number':
                                        value = Number(input);
                                        break;
                                    default:
                                        value = input;
                                        break;
                                }
                                // Can be a string if validation fails
                                const isValid = (await validator(value)) === true;
                                if (isValid) {
                                    return value;
                                }
                            }
                            return input;
                        };
                    }
                    switch (definition.type) {
                        case 'confirmation':
                            question.type = 'confirm';
                            break;
                        case 'list':
                            question.type = definition.multiselect ? 'checkbox' : 'list';
                            question.choices = (_a = definition.items) === null || _a === void 0 ? void 0 : _a.map((item) => {
                                return typeof item == 'string'
                                    ? item
                                    : {
                                        name: item.label,
                                        value: item.value,
                                    };
                            });
                            break;
                        default:
                            question.type = definition.type;
                            break;
                    }
                    return question;
                });
                return inquirer.prompt(questions);
            });
        }
        return (this._workflow = workflow);
    }
    async getDefaultSchematicCollection() {
        // Resolve relative collections from the location of `angular.json`
        const resolveRelativeCollection = (collectionName) => collectionName.charAt(0) === '.'
            ? (0, path_1.resolve)(this.context.root, collectionName)
            : collectionName;
        let workspace = await (0, config_1.getWorkspace)('local');
        if (workspace) {
            const project = (0, config_1.getProjectByCwd)(workspace);
            if (project && workspace.getProjectCli(project)) {
                const value = workspace.getProjectCli(project)['defaultCollection'];
                if (typeof value == 'string') {
                    return resolveRelativeCollection(value);
                }
            }
            if (workspace.getCli()) {
                const value = workspace.getCli()['defaultCollection'];
                if (typeof value == 'string') {
                    return resolveRelativeCollection(value);
                }
            }
        }
        workspace = await (0, config_1.getWorkspace)('global');
        if (workspace && workspace.getCli()) {
            const value = workspace.getCli()['defaultCollection'];
            if (typeof value == 'string') {
                return resolveRelativeCollection(value);
            }
        }
        return this.defaultCollectionName;
    }
    async runSchematic(options) {
        const { schematicOptions, debug, dryRun } = options;
        let { collectionName, schematicName } = options;
        let nothingDone = true;
        let loggingQueue = [];
        let error = false;
        const workflow = this._workflow;
        const workingDir = (0, core_1.normalize)(systemPath.relative(this.context.root, process.cwd()));
        // Get the option object from the schematic schema.
        const schematic = this.getSchematic(this.getCollection(collectionName), schematicName, this.allowPrivateSchematics);
        // Update the schematic and collection name in case they're not the same as the ones we
        // received in our options, e.g. after alias resolution or extension.
        collectionName = schematic.collection.description.name;
        schematicName = schematic.description.name;
        // Set the options of format "path".
        let o = null;
        let args;
        if (!schematic.description.schemaJson) {
            args = await this.parseFreeFormArguments(schematicOptions || []);
        }
        else {
            o = await (0, json_schema_1.parseJsonSchemaToOptions)(workflow.registry, schematic.description.schemaJson);
            args = await this.parseArguments(schematicOptions || [], o);
        }
        const allowAdditionalProperties = typeof schematic.description.schemaJson === 'object' &&
            schematic.description.schemaJson.additionalProperties;
        if (args['--'] && !allowAdditionalProperties) {
            args['--'].forEach((additional) => {
                this.logger.fatal(`Unknown option: '${additional.split(/=/)[0]}'`);
            });
            return 1;
        }
        const pathOptions = o ? this.setPathOptions(o, workingDir) : {};
        const input = {
            ...pathOptions,
            ...args,
            ...options.additionalOptions,
        };
        workflow.reporter.subscribe((event) => {
            nothingDone = false;
            // Strip leading slash to prevent confusion.
            const eventPath = event.path.startsWith('/') ? event.path.substr(1) : event.path;
            switch (event.kind) {
                case 'error':
                    error = true;
                    const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist.';
                    this.logger.warn(`ERROR! ${eventPath} ${desc}.`);
                    break;
                case 'update':
                    loggingQueue.push(core_1.tags.oneLine `
            ${color_1.colors.cyan('UPDATE')} ${eventPath} (${event.content.length} bytes)
          `);
                    break;
                case 'create':
                    loggingQueue.push(core_1.tags.oneLine `
            ${color_1.colors.green('CREATE')} ${eventPath} (${event.content.length} bytes)
          `);
                    break;
                case 'delete':
                    loggingQueue.push(`${color_1.colors.yellow('DELETE')} ${eventPath}`);
                    break;
                case 'rename':
                    const eventToPath = event.to.startsWith('/') ? event.to.substr(1) : event.to;
                    loggingQueue.push(`${color_1.colors.blue('RENAME')} ${eventPath} => ${eventToPath}`);
                    break;
            }
        });
        workflow.lifeCycle.subscribe((event) => {
            if (event.kind == 'end' || event.kind == 'post-tasks-start') {
                if (!error) {
                    // Output the logging queue, no error happened.
                    loggingQueue.forEach((log) => this.logger.info(log));
                }
                loggingQueue = [];
                error = false;
            }
        });
        // Temporary compatibility check for NPM 7
        if (collectionName === '@schematics/angular' && schematicName === 'ng-new') {
            if (!input.skipInstall &&
                (input.packageManager === undefined || input.packageManager === 'npm')) {
                await (0, package_manager_1.ensureCompatibleNpm)(this.context.root);
            }
        }
        return new Promise((resolve) => {
            workflow
                .execute({
                collection: collectionName,
                schematic: schematicName,
                options: input,
                debug: debug,
                logger: this.logger,
                allowPrivate: this.allowPrivateSchematics,
            })
                .subscribe({
                error: (err) => {
                    // In case the workflow was not successful, show an appropriate error message.
                    if (err instanceof schematics_1.UnsuccessfulWorkflowExecution) {
                        // "See above" because we already printed the error.
                        this.logger.fatal('The Schematic workflow failed. See above.');
                    }
                    else if (debug) {
                        this.logger.fatal(`An error occurred:\n${err.message}\n${err.stack}`);
                    }
                    else {
                        this.logger.fatal(err.message);
                    }
                    resolve(1);
                },
                complete: () => {
                    const showNothingDone = !(options.showNothingDone === false);
                    if (nothingDone && showNothingDone) {
                        this.logger.info('Nothing to be done.');
                    }
                    if (dryRun) {
                        this.logger.warn(`\nNOTE: The "dryRun" flag means no changes were made.`);
                    }
                    resolve();
                },
            });
        });
    }
    async parseFreeFormArguments(schematicOptions) {
        return (0, parser_1.parseFreeFormArguments)(schematicOptions);
    }
    async parseArguments(schematicOptions, options) {
        return (0, parser_1.parseArguments)(schematicOptions, options, this.logger);
    }
}
exports.SchematicCommand = SchematicCommand;
function getProjectsByPath(workspace, path, root) {
    if (workspace.projects.size === 1) {
        return Array.from(workspace.projects.keys());
    }
    const isInside = (base, potential) => {
        const absoluteBase = systemPath.resolve(root, base);
        const absolutePotential = systemPath.resolve(root, potential);
        const relativePotential = systemPath.relative(absoluteBase, absolutePotential);
        if (!relativePotential.startsWith('..') && !systemPath.isAbsolute(relativePotential)) {
            return true;
        }
        return false;
    };
    const projects = Array.from(workspace.projects.entries())
        .map(([name, project]) => [systemPath.resolve(root, project.root), name])
        .filter((tuple) => isInside(tuple[0], path))
        // Sort tuples by depth, with the deeper ones first. Since the first member is a path and
        // we filtered all invalid paths, the longest will be the deepest (and in case of equality
        // the sort is stable and the first declared project will win).
        .sort((a, b) => b[0].length - a[0].length);
    if (projects.length === 1) {
        return [projects[0][1]];
    }
    else if (projects.length > 1) {
        const firstPath = projects[0][0];
        return projects.filter((v) => v[0] === firstPath).map((v) => v[1]);
    }
    return [];
}
