"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewCommand = void 0;
const schematic_command_1 = require("../models/schematic-command");
const version_1 = require("../models/version");
class NewCommand extends schematic_command_1.SchematicCommand {
    constructor() {
        super(...arguments);
        this.allowMissingWorkspace = true;
        this.schematicName = 'ng-new';
    }
    async initialize(options) {
        this.collectionName = options.collection || (await this.getDefaultSchematicCollection());
        return super.initialize(options);
    }
    async run(options) {
        // Register the version of the CLI in the registry.
        const version = version_1.VERSION.full;
        this._workflow.registry.addSmartDefaultProvider('ng-cli-version', () => version);
        return this.runSchematic({
            collectionName: this.collectionName,
            schematicName: this.schematicName,
            schematicOptions: options['--'] || [],
            debug: !!options.debug,
            dryRun: !!options.dryRun,
            force: !!options.force,
        });
    }
}
exports.NewCommand = NewCommand;
