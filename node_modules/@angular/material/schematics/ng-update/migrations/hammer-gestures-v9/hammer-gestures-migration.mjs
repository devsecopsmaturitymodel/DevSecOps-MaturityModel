"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HammerGesturesMigration = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular/cdk/schematics");
const change_1 = require("@schematics/angular/utility/change");
const fs_1 = require("fs");
const ts = require("typescript");
const find_hammer_script_tags_1 = require("./find-hammer-script-tags");
const find_main_module_1 = require("./find-main-module");
const hammer_template_check_1 = require("./hammer-template-check");
const import_manager_1 = require("./import-manager");
const remove_array_element_1 = require("./remove-array-element");
const remove_element_from_html_1 = require("./remove-element-from-html");
const GESTURE_CONFIG_CLASS_NAME = 'GestureConfig';
const GESTURE_CONFIG_FILE_NAME = 'gesture-config';
const GESTURE_CONFIG_TEMPLATE_PATH = './gesture-config.template';
const HAMMER_CONFIG_TOKEN_NAME = 'HAMMER_GESTURE_CONFIG';
const HAMMER_CONFIG_TOKEN_MODULE = '@angular/platform-browser';
const HAMMER_MODULE_NAME = 'HammerModule';
const HAMMER_MODULE_IMPORT = '@angular/platform-browser';
const HAMMER_MODULE_SPECIFIER = 'hammerjs';
const CANNOT_REMOVE_REFERENCE_ERROR = `Cannot remove reference to "GestureConfig". Please remove manually.`;
class HammerGesturesMigration extends schematics_1.DevkitMigration {
    constructor() {
        super(...arguments);
        // The migration is enabled when v9 or v10 are targeted, but actual targets are only
        // migrated if they are not test targets. We cannot migrate test targets since they have
        // a limited scope, in regards to their source files, and therefore the HammerJS usage
        // detection could be incorrect.
        this.enabled = HammerGesturesMigration._isAllowedVersion(this.targetVersion) && !this.context.isTestTarget;
        this._printer = ts.createPrinter();
        this._importManager = new import_manager_1.ImportManager(this.fileSystem, this._printer);
        this._nodeFailures = [];
        /**
         * Whether custom HammerJS events provided by the Material gesture
         * config are used in a template.
         */
        this._customEventsUsedInTemplate = false;
        /** Whether standard HammerJS events are used in a template. */
        this._standardEventsUsedInTemplate = false;
        /** Whether HammerJS is accessed at runtime. */
        this._usedInRuntime = false;
        /**
         * List of imports that make "hammerjs" available globally. We keep track of these
         * since we might need to remove them if Hammer is not used.
         */
        this._installImports = [];
        /**
         * List of identifiers which resolve to the gesture config from Angular Material.
         */
        this._gestureConfigReferences = [];
        /**
         * List of identifiers which resolve to the "HAMMER_GESTURE_CONFIG" token from
         * "@angular/platform-browser".
         */
        this._hammerConfigTokenReferences = [];
        /**
         * List of identifiers which resolve to the "HammerModule" from
         * "@angular/platform-browser".
         */
        this._hammerModuleReferences = [];
        /**
         * List of identifiers that have been deleted from source files. This can be
         * used to determine if certain imports are still used or not.
         */
        this._deletedIdentifiers = [];
    }
    visitTemplate(template) {
        if (!this._customEventsUsedInTemplate || !this._standardEventsUsedInTemplate) {
            const { standardEvents, customEvents } = (0, hammer_template_check_1.isHammerJsUsedInTemplate)(template.content);
            this._customEventsUsedInTemplate = this._customEventsUsedInTemplate || customEvents;
            this._standardEventsUsedInTemplate = this._standardEventsUsedInTemplate || standardEvents;
        }
    }
    visitNode(node) {
        this._checkHammerImports(node);
        this._checkForRuntimeHammerUsage(node);
        this._checkForMaterialGestureConfig(node);
        this._checkForHammerGestureConfigToken(node);
        this._checkForHammerModuleReference(node);
    }
    postAnalysis() {
        // Walk through all hammer config token references and check if there
        // is a potential custom gesture config setup.
        const hasCustomGestureConfigSetup = this._hammerConfigTokenReferences.some(r => this._checkForCustomGestureConfigSetup(r));
        const usedInTemplate = this._standardEventsUsedInTemplate || this._customEventsUsedInTemplate;
        /*
          Possible scenarios and how the migration should change the project:
            1. We detect that a custom HammerJS gesture config is set up:
                - Remove references to the Material gesture config if no HammerJS event is used.
                - Print a warning about ambiguous configuration that cannot be handled completely
                  if there are references to the Material gesture config.
            2. We detect that HammerJS is only used programmatically:
                - Remove references to GestureConfig of Material.
                - Remove references to the "HammerModule" if present.
            3. We detect that standard HammerJS events are used in a template:
                - Set up the "HammerModule" from platform-browser.
                - Remove all gesture config references.
            4. We detect that custom HammerJS events provided by the Material gesture
               config are used.
                - Copy the Material gesture config into the app.
                - Rewrite all gesture config references to the newly copied one.
                - Set up the new gesture config in the root app module.
                - Set up the "HammerModule" from platform-browser.
            4. We detect no HammerJS usage at all:
                - Remove Hammer imports
                - Remove Material gesture config references
                - Remove HammerModule setup if present.
                - Remove Hammer script imports in "index.html" files.
        */
        if (hasCustomGestureConfigSetup) {
            // If a custom gesture config is provided, we always assume that HammerJS is used.
            HammerGesturesMigration.globalUsesHammer = true;
            if (!usedInTemplate && this._gestureConfigReferences.length) {
                // If the Angular Material gesture events are not used and we found a custom
                // gesture config, we can safely remove references to the Material gesture config
                // since events provided by the Material gesture config are guaranteed to be unused.
                this._removeMaterialGestureConfigSetup();
                this.printInfo('The HammerJS v9 migration for Angular Components detected that HammerJS is ' +
                    'manually set up in combination with references to the Angular Material gesture ' +
                    'config. This target cannot be migrated completely, but all references to the ' +
                    'deprecated Angular Material gesture have been removed. Read more here: ' +
                    'https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do');
            }
            else if (usedInTemplate && this._gestureConfigReferences.length) {
                // Since there is a reference to the Angular Material gesture config, and we detected
                // usage of a gesture event that could be provided by Angular Material, we *cannot*
                // automatically remove references. This is because we do *not* know whether the
                // event is actually provided by the custom config or by the Material config.
                this.printInfo('The HammerJS v9 migration for Angular Components detected that HammerJS is ' +
                    'manually set up in combination with references to the Angular Material gesture ' +
                    'config. This target cannot be migrated completely. Please manually remove ' +
                    'references to the deprecated Angular Material gesture config. Read more here: ' +
                    'https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do');
            }
        }
        else if (this._usedInRuntime || usedInTemplate) {
            // We keep track of whether Hammer is used globally. This is necessary because we
            // want to only remove Hammer from the "package.json" if it is not used in any project
            // target. Just because it isn't used in one target doesn't mean that we can safely
            // remove the dependency.
            HammerGesturesMigration.globalUsesHammer = true;
            // If hammer is only used at runtime, we don't need the gesture config or "HammerModule"
            // and can remove it (along with the hammer config token import if no longer needed).
            if (!usedInTemplate) {
                this._removeMaterialGestureConfigSetup();
                this._removeHammerModuleReferences();
            }
            else if (this._standardEventsUsedInTemplate && !this._customEventsUsedInTemplate) {
                this._setupHammerWithStandardEvents();
            }
            else {
                this._setupHammerWithCustomEvents();
            }
        }
        else {
            this._removeHammerSetup();
        }
        // Record the changes collected in the import manager. Changes need to be applied
        // once the import manager registered all import modifications. This avoids collisions.
        this._importManager.recordChanges();
        // Create migration failures that will be printed by the update-tool on migration
        // completion. We need special logic for updating failure positions to reflect
        // the new source file after modifications from the import manager.
        this.failures.push(...this._createMigrationFailures());
        // The template check for HammerJS events is not completely reliable as the event
        // output could also be from a component having an output named similarly to a known
        // hammerjs event (e.g. "@Output() slide"). The usage is therefore somewhat ambiguous
        // and we want to print a message that developers might be able to remove Hammer manually.
        if (!hasCustomGestureConfigSetup && !this._usedInRuntime && usedInTemplate) {
            this.printInfo('The HammerJS v9 migration for Angular Components migrated the ' +
                'project to keep HammerJS installed, but detected ambiguous usage of HammerJS. Please ' +
                'manually check if you can remove HammerJS from your application. More details: ' +
                'https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do');
        }
    }
    /**
     * Sets up the hammer gesture config in the current project. To achieve this, the
     * following steps are performed:
     *   1) Create copy of Angular Material gesture config.
     *   2) Rewrite all references to the Angular Material gesture config to the
     *      new gesture config.
     *   3) Setup the HAMMER_GESTURE_CONFIG in the root app module (if not done already).
     *   4) Setup the "HammerModule" in the root app module (if not done already).
     */
    _setupHammerWithCustomEvents() {
        const project = this.context.project;
        const sourceRoot = this.fileSystem.resolve(project.sourceRoot || project.root);
        const newConfigPath = (0, core_1.join)(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
        // Copy gesture config template into the CLI project.
        this.fileSystem.create(newConfigPath, (0, fs_1.readFileSync)(require.resolve(GESTURE_CONFIG_TEMPLATE_PATH), 'utf8'));
        // Replace all Material gesture config references to resolve to the
        // newly copied gesture config.
        this._gestureConfigReferences.forEach(i => {
            const filePath = this.fileSystem.resolve(i.node.getSourceFile().fileName);
            return this._replaceGestureConfigReference(i, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(newConfigPath, filePath));
        });
        // Setup the gesture config provider and the "HammerModule" in the root module
        // if not done already. The "HammerModule" is needed in v9 since it enables the
        // Hammer event plugin that was previously enabled by default in v8.
        this._setupNewGestureConfigInRootModule(newConfigPath);
        this._setupHammerModuleInRootModule();
    }
    /**
     * Sets up the standard hammer module in the project and removes all
     * references to the deprecated Angular Material gesture config.
     */
    _setupHammerWithStandardEvents() {
        // Setup the HammerModule. The HammerModule enables support for
        // the standard HammerJS events.
        this._setupHammerModuleInRootModule();
        this._removeMaterialGestureConfigSetup();
    }
    /**
     * Removes Hammer from the current project. The following steps are performed:
     *   1) Delete all TypeScript imports to "hammerjs".
     *   2) Remove references to the Angular Material gesture config.
     *   3) Remove "hammerjs" from all index HTML files of the current project.
     */
    _removeHammerSetup() {
        this._installImports.forEach(i => this._importManager.deleteImportByDeclaration(i));
        this._removeMaterialGestureConfigSetup();
        this._removeHammerModuleReferences();
        this._removeHammerFromIndexFile();
    }
    /**
     * Removes the gesture config setup by deleting all found references to the Angular
     * Material gesture config. Additionally, unused imports to the hammer gesture config
     * token from "@angular/platform-browser" will be removed as well.
     */
    _removeMaterialGestureConfigSetup() {
        this._gestureConfigReferences.forEach(r => this._removeGestureConfigReference(r));
        this._hammerConfigTokenReferences.forEach(r => {
            if (r.isImport) {
                this._removeHammerConfigTokenImportIfUnused(r);
            }
        });
    }
    /** Removes all references to the "HammerModule" from "@angular/platform-browser". */
    _removeHammerModuleReferences() {
        this._hammerModuleReferences.forEach(({ node, isImport, importData }) => {
            const sourceFile = node.getSourceFile();
            const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
            // Only remove the import for the HammerModule if the module has been accessed
            // through a non-namespaced identifier access.
            if (!isNamespacedIdentifierAccess(node)) {
                this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_MODULE_NAME, importData.moduleName);
            }
            // For references from within an import, we do not need to do anything other than
            // removing the import. For other references, we remove the import and the actual
            // identifier in the module imports.
            if (isImport) {
                return;
            }
            // If the "HammerModule" is referenced within an array literal, we can
            // remove the element easily. Otherwise if it's outside of an array literal,
            // we need to replace the reference with an empty object literal w/ todo to
            // not break the application.
            if (ts.isArrayLiteralExpression(node.parent)) {
                // Removes the "HammerModule" from the parent array expression. Removes
                // the trailing comma token if present.
                (0, remove_array_element_1.removeElementFromArrayExpression)(node, recorder);
            }
            else {
                recorder.remove(node.getStart(), node.getWidth());
                recorder.insertRight(node.getStart(), `/* TODO: remove */ {}`);
                this._nodeFailures.push({
                    node: node,
                    message: 'Unable to delete reference to "HammerModule".',
                });
            }
        });
    }
    /**
     * Checks if the given node is a reference to the hammer gesture config
     * token from platform-browser. If so, keeps track of the reference.
     */
    _checkForHammerGestureConfigToken(node) {
        if (ts.isIdentifier(node)) {
            const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
            if (importData &&
                importData.symbolName === HAMMER_CONFIG_TOKEN_NAME &&
                importData.moduleName === HAMMER_CONFIG_TOKEN_MODULE) {
                this._hammerConfigTokenReferences.push({
                    node,
                    importData,
                    isImport: ts.isImportSpecifier(node.parent),
                });
            }
        }
    }
    /**
     * Checks if the given node is a reference to the HammerModule from
     * "@angular/platform-browser". If so, keeps track of the reference.
     */
    _checkForHammerModuleReference(node) {
        if (ts.isIdentifier(node)) {
            const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
            if (importData &&
                importData.symbolName === HAMMER_MODULE_NAME &&
                importData.moduleName === HAMMER_MODULE_IMPORT) {
                this._hammerModuleReferences.push({
                    node,
                    importData,
                    isImport: ts.isImportSpecifier(node.parent),
                });
            }
        }
    }
    /**
     * Checks if the given node is an import to the HammerJS package. Imports to
     * HammerJS which load specific symbols from the package are considered as
     * runtime usage of Hammer. e.g. `import {Symbol} from "hammerjs";`.
     */
    _checkHammerImports(node) {
        if (ts.isImportDeclaration(node) &&
            ts.isStringLiteral(node.moduleSpecifier) &&
            node.moduleSpecifier.text === HAMMER_MODULE_SPECIFIER) {
            // If there is an import to HammerJS that imports symbols, or is namespaced
            // (e.g. "import {A, B} from ..." or "import * as hammer from ..."), then we
            // assume that some exports are used at runtime.
            if (node.importClause &&
                !(node.importClause.namedBindings &&
                    ts.isNamedImports(node.importClause.namedBindings) &&
                    node.importClause.namedBindings.elements.length === 0)) {
                this._usedInRuntime = true;
            }
            else {
                this._installImports.push(node);
            }
        }
    }
    /**
     * Checks if the given node accesses the global "Hammer" symbol at runtime. If so,
     * the migration rule state will be updated to reflect that Hammer is used at runtime.
     */
    _checkForRuntimeHammerUsage(node) {
        if (this._usedInRuntime) {
            return;
        }
        // Detects usages of "window.Hammer".
        if (ts.isPropertyAccessExpression(node) && node.name.text === 'Hammer') {
            const originExpr = unwrapExpression(node.expression);
            if (ts.isIdentifier(originExpr) && originExpr.text === 'window') {
                this._usedInRuntime = true;
            }
            return;
        }
        // Detects usages of "window['Hammer']".
        if (ts.isElementAccessExpression(node) &&
            ts.isStringLiteral(node.argumentExpression) &&
            node.argumentExpression.text === 'Hammer') {
            const originExpr = unwrapExpression(node.expression);
            if (ts.isIdentifier(originExpr) && originExpr.text === 'window') {
                this._usedInRuntime = true;
            }
            return;
        }
        // Handles usages of plain identifier with the name "Hammer". These usage
        // are valid if they resolve to "@types/hammerjs". e.g. "new Hammer(myElement)".
        if (ts.isIdentifier(node) &&
            node.text === 'Hammer' &&
            !ts.isPropertyAccessExpression(node.parent) &&
            !ts.isElementAccessExpression(node.parent)) {
            const symbol = this._getDeclarationSymbolOfNode(node);
            if (symbol &&
                symbol.valueDeclaration &&
                symbol.valueDeclaration.getSourceFile().fileName.includes('@types/hammerjs')) {
                this._usedInRuntime = true;
            }
        }
    }
    /**
     * Checks if the given node references the gesture config from Angular Material.
     * If so, we keep track of the found symbol reference.
     */
    _checkForMaterialGestureConfig(node) {
        if (ts.isIdentifier(node)) {
            const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
            if (importData &&
                importData.symbolName === GESTURE_CONFIG_CLASS_NAME &&
                importData.moduleName.startsWith('@angular/material/')) {
                this._gestureConfigReferences.push({
                    node,
                    importData,
                    isImport: ts.isImportSpecifier(node.parent),
                });
            }
        }
    }
    /**
     * Checks if the given Hammer gesture config token reference is part of an
     * Angular provider definition that sets up a custom gesture config.
     */
    _checkForCustomGestureConfigSetup(tokenRef) {
        // Walk up the tree to look for a parent property assignment of the
        // reference to the hammer gesture config token.
        let propertyAssignment = tokenRef.node;
        while (propertyAssignment && !ts.isPropertyAssignment(propertyAssignment)) {
            propertyAssignment = propertyAssignment.parent;
        }
        if (!propertyAssignment ||
            !ts.isPropertyAssignment(propertyAssignment) ||
            getPropertyNameText(propertyAssignment.name) !== 'provide') {
            return false;
        }
        const objectLiteralExpr = propertyAssignment.parent;
        const matchingIdentifiers = findMatchingChildNodes(objectLiteralExpr, ts.isIdentifier);
        // We naively assume that if there is a reference to the "GestureConfig" export
        // from Angular Material in the provider literal, that the provider sets up the
        // Angular Material gesture config.
        return !this._gestureConfigReferences.some(r => matchingIdentifiers.includes(r.node));
    }
    /**
     * Determines an available file name for the gesture config which should
     * be stored in the specified file path.
     */
    _getAvailableGestureConfigFileName(sourceRoot) {
        if (!this.fileSystem.fileExists((0, core_1.join)(sourceRoot, `${GESTURE_CONFIG_FILE_NAME}.ts`))) {
            return `${GESTURE_CONFIG_FILE_NAME}.ts`;
        }
        let possibleName = `${GESTURE_CONFIG_FILE_NAME}-`;
        let index = 1;
        while (this.fileSystem.fileExists((0, core_1.join)(sourceRoot, `${possibleName}-${index}.ts`))) {
            index++;
        }
        return `${possibleName + index}.ts`;
    }
    /** Replaces a given gesture config reference with a new import. */
    _replaceGestureConfigReference({ node, importData, isImport }, symbolName, moduleSpecifier) {
        const sourceFile = node.getSourceFile();
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        // List of all identifiers referring to the gesture config in the current file. This
        // allows us to add an import for the copied gesture configuration without generating a
        // new identifier for the import to avoid collisions. i.e. "GestureConfig_1". The import
        // manager checks for possible name collisions, but is able to ignore specific identifiers.
        // We use this to ignore all references to the original Angular Material gesture config,
        // because these will be replaced and therefore will not interfere.
        const gestureIdentifiersInFile = this._getGestureConfigIdentifiersOfFile(sourceFile);
        // If the parent of the identifier is accessed through a namespace, we can just
        // import the new gesture config without rewriting the import declaration because
        // the config has been imported through a namespaced import.
        if (isNamespacedIdentifierAccess(node)) {
            const newExpression = this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleSpecifier, false, gestureIdentifiersInFile);
            recorder.remove(node.parent.getStart(), node.parent.getWidth());
            recorder.insertRight(node.parent.getStart(), this._printNode(newExpression, sourceFile));
            return;
        }
        // Delete the old import to the "GestureConfig".
        this._importManager.deleteNamedBindingImport(sourceFile, GESTURE_CONFIG_CLASS_NAME, importData.moduleName);
        // If the current reference is not from inside of a import, we need to add a new
        // import to the copied gesture config and replace the identifier. For references
        // within an import, we do nothing but removing the actual import. This allows us
        // to remove unused imports to the Material gesture config.
        if (!isImport) {
            const newExpression = this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleSpecifier, false, gestureIdentifiersInFile);
            recorder.remove(node.getStart(), node.getWidth());
            recorder.insertRight(node.getStart(), this._printNode(newExpression, sourceFile));
        }
    }
    /**
     * Removes a given gesture config reference and its corresponding import from
     * its containing source file. Imports will be always removed, but in some cases,
     * where it's not guaranteed that a removal can be performed safely, we just
     * create a migration failure (and add a TODO if possible).
     */
    _removeGestureConfigReference({ node, importData, isImport }) {
        const sourceFile = node.getSourceFile();
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        // Only remove the import for the gesture config if the gesture config has
        // been accessed through a non-namespaced identifier access.
        if (!isNamespacedIdentifierAccess(node)) {
            this._importManager.deleteNamedBindingImport(sourceFile, GESTURE_CONFIG_CLASS_NAME, importData.moduleName);
        }
        // For references from within an import, we do not need to do anything other than
        // removing the import. For other references, we remove the import and the reference
        // identifier if used inside of a provider definition.
        if (isImport) {
            return;
        }
        const providerAssignment = node.parent;
        // Only remove references to the gesture config which are part of a statically
        // analyzable provider definition. We only support the common case of a gesture
        // config provider definition where the config is set up through "useClass".
        // Otherwise, it's not guaranteed that we can safely remove the provider definition.
        if (!ts.isPropertyAssignment(providerAssignment) ||
            getPropertyNameText(providerAssignment.name) !== 'useClass') {
            this._nodeFailures.push({ node, message: CANNOT_REMOVE_REFERENCE_ERROR });
            return;
        }
        const objectLiteralExpr = providerAssignment.parent;
        const provideToken = objectLiteralExpr.properties.find((p) => ts.isPropertyAssignment(p) && getPropertyNameText(p.name) === 'provide');
        // Do not remove the reference if the gesture config is not part of a provider definition,
        // or if the provided toke is not referring to the known HAMMER_GESTURE_CONFIG token
        // from platform-browser.
        if (!provideToken || !this._isReferenceToHammerConfigToken(provideToken.initializer)) {
            this._nodeFailures.push({ node, message: CANNOT_REMOVE_REFERENCE_ERROR });
            return;
        }
        // Collect all nested identifiers which will be deleted. This helps us
        // determining if we can remove imports for the "HAMMER_GESTURE_CONFIG" token.
        this._deletedIdentifiers.push(...findMatchingChildNodes(objectLiteralExpr, ts.isIdentifier));
        // In case the found provider definition is not part of an array literal,
        // we cannot safely remove the provider. This is because it could be declared
        // as a variable. e.g. "const gestureProvider = {provide: .., useClass: GestureConfig}".
        // In that case, we just add an empty object literal with TODO and print a failure.
        if (!ts.isArrayLiteralExpression(objectLiteralExpr.parent)) {
            recorder.remove(objectLiteralExpr.getStart(), objectLiteralExpr.getWidth());
            recorder.insertRight(objectLiteralExpr.getStart(), `/* TODO: remove */ {}`);
            this._nodeFailures.push({
                node: objectLiteralExpr,
                message: `Unable to delete provider definition for "GestureConfig" completely. ` +
                    `Please clean up the provider.`,
            });
            return;
        }
        // Removes the object literal from the parent array expression. Removes
        // the trailing comma token if present.
        (0, remove_array_element_1.removeElementFromArrayExpression)(objectLiteralExpr, recorder);
    }
    /** Removes the given hammer config token import if it is not used. */
    _removeHammerConfigTokenImportIfUnused({ node, importData }) {
        const sourceFile = node.getSourceFile();
        const isTokenUsed = this._hammerConfigTokenReferences.some(r => !r.isImport &&
            !isNamespacedIdentifierAccess(r.node) &&
            r.node.getSourceFile() === sourceFile &&
            !this._deletedIdentifiers.includes(r.node));
        // We don't want to remove the import for the token if the token is
        // still used somewhere.
        if (!isTokenUsed) {
            this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_CONFIG_TOKEN_NAME, importData.moduleName);
        }
    }
    /** Removes Hammer from all index HTML files of the current project. */
    _removeHammerFromIndexFile() {
        const indexFilePaths = (0, schematics_1.getProjectIndexFiles)(this.context.project);
        indexFilePaths.forEach(filePath => {
            if (!this.fileSystem.fileExists(filePath)) {
                return;
            }
            const htmlContent = this.fileSystem.read(filePath);
            const recorder = this.fileSystem.edit(filePath);
            (0, find_hammer_script_tags_1.findHammerScriptImportElements)(htmlContent).forEach(el => (0, remove_element_from_html_1.removeElementFromHtml)(el, recorder));
        });
    }
    /** Sets up the Hammer gesture config in the root module if needed. */
    _setupNewGestureConfigInRootModule(gestureConfigPath) {
        const { project } = this.context;
        const mainFilePath = (0, schematics_1.getProjectMainFile)(project);
        const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
        if (rootModuleSymbol === null || rootModuleSymbol.valueDeclaration === undefined) {
            this.failures.push({
                filePath: mainFilePath,
                message: `Could not setup Hammer gestures in module. Please ` +
                    `manually ensure that the Hammer gesture config is set up.`,
            });
            return;
        }
        const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
        const metadata = (0, schematics_1.getDecoratorMetadata)(sourceFile, 'NgModule', '@angular/core');
        // If no "NgModule" definition is found inside the source file, we just do nothing.
        if (!metadata.length) {
            return;
        }
        const filePath = this.fileSystem.resolve(sourceFile.fileName);
        const recorder = this.fileSystem.edit(filePath);
        const providersField = (0, schematics_1.getMetadataField)(metadata[0], 'providers')[0];
        const providerIdentifiers = providersField
            ? findMatchingChildNodes(providersField, ts.isIdentifier)
            : null;
        const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(gestureConfigPath, filePath), false, this._getGestureConfigIdentifiersOfFile(sourceFile));
        const hammerConfigTokenExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_CONFIG_TOKEN_NAME, HAMMER_CONFIG_TOKEN_MODULE);
        const newProviderNode = ts.createObjectLiteral([
            ts.createPropertyAssignment('provide', hammerConfigTokenExpr),
            ts.createPropertyAssignment('useClass', gestureConfigExpr),
        ]);
        // If the providers field exists and already contains references to the hammer gesture
        // config token and the gesture config, we naively assume that the gesture config is
        // already set up. We only want to add the gesture config provider if it is not set up.
        if (!providerIdentifiers ||
            !(this._hammerConfigTokenReferences.some(r => providerIdentifiers.includes(r.node)) &&
                this._gestureConfigReferences.some(r => providerIdentifiers.includes(r.node)))) {
            const symbolName = this._printNode(newProviderNode, sourceFile);
            (0, schematics_1.addSymbolToNgModuleMetadata)(sourceFile, sourceFile.fileName, 'providers', symbolName, null).forEach(change => {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertRight(change.pos, change.toAdd);
                }
            });
        }
    }
    /**
     * Gets the TypeScript symbol of the root module by looking for the module
     * bootstrap expression in the specified source file.
     */
    _getRootModuleSymbol(mainFilePath) {
        const mainFile = this.program.getSourceFile(mainFilePath);
        if (!mainFile) {
            return null;
        }
        const appModuleExpr = (0, find_main_module_1.findMainModuleExpression)(mainFile);
        if (!appModuleExpr) {
            return null;
        }
        const appModuleSymbol = this._getDeclarationSymbolOfNode(unwrapExpression(appModuleExpr));
        if (!appModuleSymbol || !appModuleSymbol.valueDeclaration) {
            return null;
        }
        return appModuleSymbol;
    }
    /** Sets up the "HammerModule" in the root module of the current project. */
    _setupHammerModuleInRootModule() {
        const { project } = this.context;
        const mainFilePath = (0, schematics_1.getProjectMainFile)(project);
        const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
        if (rootModuleSymbol === null || rootModuleSymbol.valueDeclaration === undefined) {
            this.failures.push({
                filePath: mainFilePath,
                message: `Could not setup HammerModule. Please manually set up the "HammerModule" ` +
                    `from "@angular/platform-browser".`,
            });
            return;
        }
        const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
        const metadata = (0, schematics_1.getDecoratorMetadata)(sourceFile, 'NgModule', '@angular/core');
        if (!metadata.length) {
            return;
        }
        const importsField = (0, schematics_1.getMetadataField)(metadata[0], 'imports')[0];
        const importIdentifiers = importsField
            ? findMatchingChildNodes(importsField, ts.isIdentifier)
            : null;
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        const hammerModuleExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_MODULE_NAME, HAMMER_MODULE_IMPORT);
        // If the "HammerModule" is not already imported in the app module, we set it up
        // by adding it to the "imports" field of the app module.
        if (!importIdentifiers ||
            !this._hammerModuleReferences.some(r => importIdentifiers.includes(r.node))) {
            const symbolName = this._printNode(hammerModuleExpr, sourceFile);
            (0, schematics_1.addSymbolToNgModuleMetadata)(sourceFile, sourceFile.fileName, 'imports', symbolName, null).forEach(change => {
                if (change instanceof change_1.InsertChange) {
                    recorder.insertRight(change.pos, change.toAdd);
                }
            });
        }
    }
    /** Prints a given node within the specified source file. */
    _printNode(node, sourceFile) {
        return this._printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
    }
    /** Gets all referenced gesture config identifiers of a given source file */
    _getGestureConfigIdentifiersOfFile(sourceFile) {
        return this._gestureConfigReferences
            .filter(d => d.node.getSourceFile() === sourceFile)
            .map(d => d.node);
    }
    /** Gets the symbol that contains the value declaration of the specified node. */
    _getDeclarationSymbolOfNode(node) {
        const symbol = this.typeChecker.getSymbolAtLocation(node);
        // Symbols can be aliases of the declaration symbol. e.g. in named import specifiers.
        // We need to resolve the aliased symbol back to the declaration symbol.
        // tslint:disable-next-line:no-bitwise
        if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
            return this.typeChecker.getAliasedSymbol(symbol);
        }
        return symbol;
    }
    /**
     * Checks whether the given expression resolves to a hammer gesture config
     * token reference from "@angular/platform-browser".
     */
    _isReferenceToHammerConfigToken(expr) {
        const unwrapped = unwrapExpression(expr);
        if (ts.isIdentifier(unwrapped)) {
            return this._hammerConfigTokenReferences.some(r => r.node === unwrapped);
        }
        else if (ts.isPropertyAccessExpression(unwrapped)) {
            return this._hammerConfigTokenReferences.some(r => r.node === unwrapped.name);
        }
        return false;
    }
    /**
     * Creates migration failures of the collected node failures. The returned migration
     * failures are updated to reflect the post-migration state of source files. Meaning
     * that failure positions are corrected if source file modifications shifted lines.
     */
    _createMigrationFailures() {
        return this._nodeFailures.map(({ node, message }) => {
            const sourceFile = node.getSourceFile();
            const offset = node.getStart();
            const position = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
            return {
                position: this._importManager.correctNodePosition(node, offset, position),
                message: message,
                filePath: this.fileSystem.resolve(sourceFile.fileName),
            };
        });
    }
    /**
     * Static migration rule method that will be called once all project targets
     * have been migrated individually. This method can be used to make changes based
     * on the analysis of the individual targets. For example: we only remove Hammer
     * from the "package.json" if it is not used in *any* project target.
     */
    static globalPostMigration(tree, target, context) {
        // Skip printing any global messages when the target version is not allowed.
        if (!this._isAllowedVersion(target)) {
            return;
        }
        // Always notify the developer that the Hammer v9 migration does not migrate tests.
        context.logger.info('\n⚠  General notice: The HammerJS v9 migration for Angular Components is not able to ' +
            'migrate tests. Please manually clean up tests in your project if they rely on ' +
            (this.globalUsesHammer ? 'the deprecated Angular Material gesture config.' : 'HammerJS.'));
        context.logger.info('Read more about migrating tests: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#how-to-migrate-my-tests');
        if (!this.globalUsesHammer && this._removeHammerFromPackageJson(tree)) {
            // Since Hammer has been removed from the workspace "package.json" file,
            // we schedule a node package install task to refresh the lock file.
            return { runPackageManager: true };
        }
        // Clean global state once the workspace has been migrated. This is technically
        // not necessary in "ng update", but in tests we re-use the same rule class.
        this.globalUsesHammer = false;
    }
    /**
     * Removes the hammer package from the workspace "package.json".
     * @returns Whether Hammer was set up and has been removed from the "package.json"
     */
    static _removeHammerFromPackageJson(tree) {
        if (!tree.exists('/package.json')) {
            return false;
        }
        const packageJson = JSON.parse(tree.read('/package.json').toString('utf8'));
        // We do not handle the case where someone manually added "hammerjs" to the dev dependencies.
        if (packageJson.dependencies && packageJson.dependencies[HAMMER_MODULE_SPECIFIER]) {
            delete packageJson.dependencies[HAMMER_MODULE_SPECIFIER];
            tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2));
            return true;
        }
        return false;
    }
    /** Gets whether the migration is allowed to run for specified target version. */
    static _isAllowedVersion(target) {
        // This migration is only allowed to run for v9 or v10 target versions.
        return target === schematics_1.TargetVersion.V9 || target === schematics_1.TargetVersion.V10;
    }
}
exports.HammerGesturesMigration = HammerGesturesMigration;
/** Global state of whether Hammer is used in any analyzed project target. */
HammerGesturesMigration.globalUsesHammer = false;
/**
 * Recursively unwraps a given expression if it is wrapped
 * by parenthesis, type casts or type assertions.
 */
function unwrapExpression(node) {
    if (ts.isParenthesizedExpression(node)) {
        return unwrapExpression(node.expression);
    }
    else if (ts.isAsExpression(node)) {
        return unwrapExpression(node.expression);
    }
    else if (ts.isTypeAssertion(node)) {
        return unwrapExpression(node.expression);
    }
    return node;
}
/**
 * Converts the specified path to a valid TypeScript module specifier which is
 * relative to the given containing file.
 */
function getModuleSpecifier(newPath, containingFile) {
    let result = (0, core_1.relative)((0, core_1.dirname)(containingFile), newPath).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!result.startsWith('.')) {
        result = `./${result}`;
    }
    return result;
}
/**
 * Gets the text of the given property name.
 * @returns Text of the given property name. Null if not statically analyzable.
 */
function getPropertyNameText(node) {
    if (ts.isIdentifier(node) || ts.isStringLiteralLike(node)) {
        return node.text;
    }
    return null;
}
/** Checks whether the given identifier is part of a namespaced access. */
function isNamespacedIdentifierAccess(node) {
    return ts.isQualifiedName(node.parent) || ts.isPropertyAccessExpression(node.parent);
}
/**
 * Walks through the specified node and returns all child nodes which match the
 * given predicate.
 */
function findMatchingChildNodes(parent, predicate) {
    const result = [];
    const visitNode = (node) => {
        if (predicate(node)) {
            result.push(node);
        }
        ts.forEachChild(node, visitNode);
    };
    ts.forEachChild(parent, visitNode);
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLWdlc3R1cmVzLW1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL2hhbW1lci1nZXN0dXJlcy12OS9oYW1tZXItZ2VzdHVyZXMtbWlncmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILCtDQUFtRTtBQUVuRSx3REFhaUM7QUFDakMsK0RBQWdFO0FBQ2hFLDJCQUFnQztBQUNoQyxpQ0FBaUM7QUFFakMsdUVBQXlFO0FBQ3pFLHlEQUE0RDtBQUM1RCxtRUFBaUU7QUFDakUscURBQStDO0FBQy9DLGlFQUF3RTtBQUN4RSx5RUFBaUU7QUFFakUsTUFBTSx5QkFBeUIsR0FBRyxlQUFlLENBQUM7QUFDbEQsTUFBTSx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUNsRCxNQUFNLDRCQUE0QixHQUFHLDJCQUEyQixDQUFDO0FBRWpFLE1BQU0sd0JBQXdCLEdBQUcsdUJBQXVCLENBQUM7QUFDekQsTUFBTSwwQkFBMEIsR0FBRywyQkFBMkIsQ0FBQztBQUUvRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztBQUMxQyxNQUFNLG9CQUFvQixHQUFHLDJCQUEyQixDQUFDO0FBRXpELE1BQU0sdUJBQXVCLEdBQUcsVUFBVSxDQUFDO0FBRTNDLE1BQU0sNkJBQTZCLEdBQUcscUVBQXFFLENBQUM7QUFZNUcsTUFBYSx1QkFBd0IsU0FBUSw0QkFBcUI7SUFBbEU7O1FBQ0Usb0ZBQW9GO1FBQ3BGLHdGQUF3RjtRQUN4RixzRkFBc0Y7UUFDdEYsZ0NBQWdDO1FBQ2hDLFlBQU8sR0FDTCx1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUV0RixhQUFRLEdBQUcsRUFB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QUFFRDs7O0dBR0c7QUFDSCxTQUFTLG1CQUFtQixDQUFDLElBQXFCO0lBQ2hELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDekQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsMEVBQTBFO0FBQzFFLFNBQVMsNEJBQTRCLENBQUMsSUFBbUI7SUFDdkQsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZGLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLHNCQUFzQixDQUM3QixNQUFlLEVBQ2YsU0FBdUM7SUFFdkMsTUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO0lBQ3ZCLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUU7UUFDbEMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQjtRQUNELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQztJQUNGLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtkaXJuYW1lLCBqb2luLCBQYXRoLCByZWxhdGl2ZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtTY2hlbWF0aWNDb250ZXh0LCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEsXG4gIERldmtpdE1pZ3JhdGlvbixcbiAgZ2V0RGVjb3JhdG9yTWV0YWRhdGEsXG4gIGdldEltcG9ydE9mSWRlbnRpZmllcixcbiAgZ2V0TWV0YWRhdGFGaWVsZCxcbiAgZ2V0UHJvamVjdEluZGV4RmlsZXMsXG4gIGdldFByb2plY3RNYWluRmlsZSxcbiAgSW1wb3J0LFxuICBNaWdyYXRpb25GYWlsdXJlLFxuICBQb3N0TWlncmF0aW9uQWN0aW9uLFxuICBSZXNvbHZlZFJlc291cmNlLFxuICBUYXJnZXRWZXJzaW9uLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge0luc2VydENoYW5nZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NoYW5nZSc7XG5pbXBvcnQge3JlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7ZmluZEhhbW1lclNjcmlwdEltcG9ydEVsZW1lbnRzfSBmcm9tICcuL2ZpbmQtaGFtbWVyLXNjcmlwdC10YWdzJztcbmltcG9ydCB7ZmluZE1haW5Nb2R1bGVFeHByZXNzaW9ufSBmcm9tICcuL2ZpbmQtbWFpbi1tb2R1bGUnO1xuaW1wb3J0IHtpc0hhbW1lckpzVXNlZEluVGVtcGxhdGV9IGZyb20gJy4vaGFtbWVyLXRlbXBsYXRlLWNoZWNrJztcbmltcG9ydCB7SW1wb3J0TWFuYWdlcn0gZnJvbSAnLi9pbXBvcnQtbWFuYWdlcic7XG5pbXBvcnQge3JlbW92ZUVsZW1lbnRGcm9tQXJyYXlFeHByZXNzaW9ufSBmcm9tICcuL3JlbW92ZS1hcnJheS1lbGVtZW50JztcbmltcG9ydCB7cmVtb3ZlRWxlbWVudEZyb21IdG1sfSBmcm9tICcuL3JlbW92ZS1lbGVtZW50LWZyb20taHRtbCc7XG5cbmNvbnN0IEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUgPSAnR2VzdHVyZUNvbmZpZyc7XG5jb25zdCBHRVNUVVJFX0NPTkZJR19GSUxFX05BTUUgPSAnZ2VzdHVyZS1jb25maWcnO1xuY29uc3QgR0VTVFVSRV9DT05GSUdfVEVNUExBVEVfUEFUSCA9ICcuL2dlc3R1cmUtY29uZmlnLnRlbXBsYXRlJztcblxuY29uc3QgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FID0gJ0hBTU1FUl9HRVNUVVJFX0NPTkZJRyc7XG5jb25zdCBIQU1NRVJfQ09ORklHX1RPS0VOX01PRFVMRSA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuY29uc3QgSEFNTUVSX01PRFVMRV9OQU1FID0gJ0hhbW1lck1vZHVsZSc7XG5jb25zdCBIQU1NRVJfTU9EVUxFX0lNUE9SVCA9ICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuY29uc3QgSEFNTUVSX01PRFVMRV9TUEVDSUZJRVIgPSAnaGFtbWVyanMnO1xuXG5jb25zdCBDQU5OT1RfUkVNT1ZFX1JFRkVSRU5DRV9FUlJPUiA9IGBDYW5ub3QgcmVtb3ZlIHJlZmVyZW5jZSB0byBcIkdlc3R1cmVDb25maWdcIi4gUGxlYXNlIHJlbW92ZSBtYW51YWxseS5gO1xuXG5pbnRlcmZhY2UgSWRlbnRpZmllclJlZmVyZW5jZSB7XG4gIG5vZGU6IHRzLklkZW50aWZpZXI7XG4gIGltcG9ydERhdGE6IEltcG9ydDtcbiAgaXNJbXBvcnQ6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBQYWNrYWdlSnNvbiB7XG4gIGRlcGVuZGVuY2llczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuZXhwb3J0IGNsYXNzIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uIGV4dGVuZHMgRGV2a2l0TWlncmF0aW9uPG51bGw+IHtcbiAgLy8gVGhlIG1pZ3JhdGlvbiBpcyBlbmFibGVkIHdoZW4gdjkgb3IgdjEwIGFyZSB0YXJnZXRlZCwgYnV0IGFjdHVhbCB0YXJnZXRzIGFyZSBvbmx5XG4gIC8vIG1pZ3JhdGVkIGlmIHRoZXkgYXJlIG5vdCB0ZXN0IHRhcmdldHMuIFdlIGNhbm5vdCBtaWdyYXRlIHRlc3QgdGFyZ2V0cyBzaW5jZSB0aGV5IGhhdmVcbiAgLy8gYSBsaW1pdGVkIHNjb3BlLCBpbiByZWdhcmRzIHRvIHRoZWlyIHNvdXJjZSBmaWxlcywgYW5kIHRoZXJlZm9yZSB0aGUgSGFtbWVySlMgdXNhZ2VcbiAgLy8gZGV0ZWN0aW9uIGNvdWxkIGJlIGluY29ycmVjdC5cbiAgZW5hYmxlZCA9XG4gICAgSGFtbWVyR2VzdHVyZXNNaWdyYXRpb24uX2lzQWxsb3dlZFZlcnNpb24odGhpcy50YXJnZXRWZXJzaW9uKSAmJiAhdGhpcy5jb250ZXh0LmlzVGVzdFRhcmdldDtcblxuICBwcml2YXRlIF9wcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcigpO1xuICBwcml2YXRlIF9pbXBvcnRNYW5hZ2VyID0gbmV3IEltcG9ydE1hbmFnZXIodGhpcy5maWxlU3lzdGVtLCB0aGlzLl9wcmludGVyKTtcbiAgcHJpdmF0ZSBfbm9kZUZhaWx1cmVzOiB7bm9kZTogdHMuTm9kZTsgbWVzc2FnZTogc3RyaW5nfVtdID0gW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY3VzdG9tIEhhbW1lckpTIGV2ZW50cyBwcm92aWRlZCBieSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZVxuICAgKiBjb25maWcgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZS5cbiAgICovXG4gIHByaXZhdGUgX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgc3RhbmRhcmQgSGFtbWVySlMgZXZlbnRzIGFyZSB1c2VkIGluIGEgdGVtcGxhdGUuICovXG4gIHByaXZhdGUgX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBIYW1tZXJKUyBpcyBhY2Nlc3NlZCBhdCBydW50aW1lLiAqL1xuICBwcml2YXRlIF91c2VkSW5SdW50aW1lID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaW1wb3J0cyB0aGF0IG1ha2UgXCJoYW1tZXJqc1wiIGF2YWlsYWJsZSBnbG9iYWxseS4gV2Uga2VlcCB0cmFjayBvZiB0aGVzZVxuICAgKiBzaW5jZSB3ZSBtaWdodCBuZWVkIHRvIHJlbW92ZSB0aGVtIGlmIEhhbW1lciBpcyBub3QgdXNlZC5cbiAgICovXG4gIHByaXZhdGUgX2luc3RhbGxJbXBvcnRzOiB0cy5JbXBvcnREZWNsYXJhdGlvbltdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXM6IElkZW50aWZpZXJSZWZlcmVuY2VbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGlkZW50aWZpZXJzIHdoaWNoIHJlc29sdmUgdG8gdGhlIFwiSEFNTUVSX0dFU1RVUkVfQ09ORklHXCIgdG9rZW4gZnJvbVxuICAgKiBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgd2hpY2ggcmVzb2x2ZSB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFtbWVyTW9kdWxlUmVmZXJlbmNlczogSWRlbnRpZmllclJlZmVyZW5jZVtdID0gW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaWRlbnRpZmllcnMgdGhhdCBoYXZlIGJlZW4gZGVsZXRlZCBmcm9tIHNvdXJjZSBmaWxlcy4gVGhpcyBjYW4gYmVcbiAgICogdXNlZCB0byBkZXRlcm1pbmUgaWYgY2VydGFpbiBpbXBvcnRzIGFyZSBzdGlsbCB1c2VkIG9yIG5vdC5cbiAgICovXG4gIHByaXZhdGUgX2RlbGV0ZWRJZGVudGlmaWVyczogdHMuSWRlbnRpZmllcltdID0gW107XG5cbiAgb3ZlcnJpZGUgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogUmVzb2x2ZWRSZXNvdXJjZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgfHwgIXRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIGNvbnN0IHtzdGFuZGFyZEV2ZW50cywgY3VzdG9tRXZlbnRzfSA9IGlzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZSh0ZW1wbGF0ZS5jb250ZW50KTtcbiAgICAgIHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlID0gdGhpcy5fY3VzdG9tRXZlbnRzVXNlZEluVGVtcGxhdGUgfHwgY3VzdG9tRXZlbnRzO1xuICAgICAgdGhpcy5fc3RhbmRhcmRFdmVudHNVc2VkSW5UZW1wbGF0ZSA9IHRoaXMuX3N0YW5kYXJkRXZlbnRzVXNlZEluVGVtcGxhdGUgfHwgc3RhbmRhcmRFdmVudHM7XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0hhbW1lckltcG9ydHMobm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JSdW50aW1lSGFtbWVyVXNhZ2Uobm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JNYXRlcmlhbEdlc3R1cmVDb25maWcobm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JIYW1tZXJHZXN0dXJlQ29uZmlnVG9rZW4obm9kZSk7XG4gICAgdGhpcy5fY2hlY2tGb3JIYW1tZXJNb2R1bGVSZWZlcmVuY2Uobm9kZSk7XG4gIH1cblxuICBvdmVycmlkZSBwb3N0QW5hbHlzaXMoKTogdm9pZCB7XG4gICAgLy8gV2FsayB0aHJvdWdoIGFsbCBoYW1tZXIgY29uZmlnIHRva2VuIHJlZmVyZW5jZXMgYW5kIGNoZWNrIGlmIHRoZXJlXG4gICAgLy8gaXMgYSBwb3RlbnRpYWwgY3VzdG9tIGdlc3R1cmUgY29uZmlnIHNldHVwLlxuICAgIGNvbnN0IGhhc0N1c3RvbUdlc3R1cmVDb25maWdTZXR1cCA9IHRoaXMuX2hhbW1lckNvbmZpZ1Rva2VuUmVmZXJlbmNlcy5zb21lKHIgPT5cbiAgICAgIHRoaXMuX2NoZWNrRm9yQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKHIpLFxuICAgICk7XG4gICAgY29uc3QgdXNlZEluVGVtcGxhdGUgPSB0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlIHx8IHRoaXMuX2N1c3RvbUV2ZW50c1VzZWRJblRlbXBsYXRlO1xuXG4gICAgLypcbiAgICAgIFBvc3NpYmxlIHNjZW5hcmlvcyBhbmQgaG93IHRoZSBtaWdyYXRpb24gc2hvdWxkIGNoYW5nZSB0aGUgcHJvamVjdDpcbiAgICAgICAgMS4gV2UgZGV0ZWN0IHRoYXQgYSBjdXN0b20gSGFtbWVySlMgZ2VzdHVyZSBjb25maWcgaXMgc2V0IHVwOlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaWYgbm8gSGFtbWVySlMgZXZlbnQgaXMgdXNlZC5cbiAgICAgICAgICAgIC0gUHJpbnQgYSB3YXJuaW5nIGFib3V0IGFtYmlndW91cyBjb25maWd1cmF0aW9uIHRoYXQgY2Fubm90IGJlIGhhbmRsZWQgY29tcGxldGVseVxuICAgICAgICAgICAgICBpZiB0aGVyZSBhcmUgcmVmZXJlbmNlcyB0byB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgICAgIDIuIFdlIGRldGVjdCB0aGF0IEhhbW1lckpTIGlzIG9ubHkgdXNlZCBwcm9ncmFtbWF0aWNhbGx5OlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byBHZXN0dXJlQ29uZmlnIG9mIE1hdGVyaWFsLlxuICAgICAgICAgICAgLSBSZW1vdmUgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBpZiBwcmVzZW50LlxuICAgICAgICAzLiBXZSBkZXRlY3QgdGhhdCBzdGFuZGFyZCBIYW1tZXJKUyBldmVudHMgYXJlIHVzZWQgaW4gYSB0ZW1wbGF0ZTpcbiAgICAgICAgICAgIC0gU2V0IHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gcGxhdGZvcm0tYnJvd3Nlci5cbiAgICAgICAgICAgIC0gUmVtb3ZlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzLlxuICAgICAgICA0LiBXZSBkZXRlY3QgdGhhdCBjdXN0b20gSGFtbWVySlMgZXZlbnRzIHByb3ZpZGVkIGJ5IHRoZSBNYXRlcmlhbCBnZXN0dXJlXG4gICAgICAgICAgIGNvbmZpZyBhcmUgdXNlZC5cbiAgICAgICAgICAgIC0gQ29weSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgaW50byB0aGUgYXBwLlxuICAgICAgICAgICAgLSBSZXdyaXRlIGFsbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzIHRvIHRoZSBuZXdseSBjb3BpZWQgb25lLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyBpbiB0aGUgcm9vdCBhcHAgbW9kdWxlLlxuICAgICAgICAgICAgLSBTZXQgdXAgdGhlIFwiSGFtbWVyTW9kdWxlXCIgZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgICAgICA0LiBXZSBkZXRlY3Qgbm8gSGFtbWVySlMgdXNhZ2UgYXQgYWxsOlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIGltcG9ydHNcbiAgICAgICAgICAgIC0gUmVtb3ZlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZXNcbiAgICAgICAgICAgIC0gUmVtb3ZlIEhhbW1lck1vZHVsZSBzZXR1cCBpZiBwcmVzZW50LlxuICAgICAgICAgICAgLSBSZW1vdmUgSGFtbWVyIHNjcmlwdCBpbXBvcnRzIGluIFwiaW5kZXguaHRtbFwiIGZpbGVzLlxuICAgICovXG5cbiAgICBpZiAoaGFzQ3VzdG9tR2VzdHVyZUNvbmZpZ1NldHVwKSB7XG4gICAgICAvLyBJZiBhIGN1c3RvbSBnZXN0dXJlIGNvbmZpZyBpcyBwcm92aWRlZCwgd2UgYWx3YXlzIGFzc3VtZSB0aGF0IEhhbW1lckpTIGlzIHVzZWQuXG4gICAgICBIYW1tZXJHZXN0dXJlc01pZ3JhdGlvbi5nbG9iYWxVc2VzSGFtbWVyID0gdHJ1ZTtcbiAgICAgIGlmICghdXNlZEluVGVtcGxhdGUgJiYgdGhpcy5fZ2VzdHVyZUNvbmZpZ1JlZmVyZW5jZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIElmIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgZXZlbnRzIGFyZSBub3QgdXNlZCBhbmQgd2UgZm91bmQgYSBjdXN0b21cbiAgICAgICAgLy8gZ2VzdHVyZSBjb25maWcsIHdlIGNhbiBzYWZlbHkgcmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnXG4gICAgICAgIC8vIHNpbmNlIGV2ZW50cyBwcm92aWRlZCBieSB0aGUgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcgYXJlIGd1YXJhbnRlZWQgdG8gYmUgdW51c2VkLlxuICAgICAgICB0aGlzLl9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpO1xuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHksIGJ1dCBhbGwgcmVmZXJlbmNlcyB0byB0aGUgJyArXG4gICAgICAgICAgICAnZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgaGF2ZSBiZWVuIHJlbW92ZWQuIFJlYWQgbW9yZSBoZXJlOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2Jsb2IvM2EyMDRkYTM3ZmQxMzY2Y2FlNDExYjVjMjM0NTE3ZWNhZDE5OTczNy9ndWlkZXMvdjktaGFtbWVyanMtbWlncmF0aW9uLm1kI3RoZS1taWdyYXRpb24tcmVwb3J0ZWQtYW1iaWd1b3VzLXVzYWdlLXdoYXQtc2hvdWxkLWktZG8nLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh1c2VkSW5UZW1wbGF0ZSAmJiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gU2luY2UgdGhlcmUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsIGFuZCB3ZSBkZXRlY3RlZFxuICAgICAgICAvLyB1c2FnZSBvZiBhIGdlc3R1cmUgZXZlbnQgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBieSBBbmd1bGFyIE1hdGVyaWFsLCB3ZSAqY2Fubm90KlxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IHJlbW92ZSByZWZlcmVuY2VzLiBUaGlzIGlzIGJlY2F1c2Ugd2UgZG8gKm5vdCoga25vdyB3aGV0aGVyIHRoZVxuICAgICAgICAvLyBldmVudCBpcyBhY3R1YWxseSBwcm92aWRlZCBieSB0aGUgY3VzdG9tIGNvbmZpZyBvciBieSB0aGUgTWF0ZXJpYWwgY29uZmlnLlxuICAgICAgICB0aGlzLnByaW50SW5mbyhcbiAgICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIGRldGVjdGVkIHRoYXQgSGFtbWVySlMgaXMgJyArXG4gICAgICAgICAgICAnbWFudWFsbHkgc2V0IHVwIGluIGNvbWJpbmF0aW9uIHdpdGggcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlICcgK1xuICAgICAgICAgICAgJ2NvbmZpZy4gVGhpcyB0YXJnZXQgY2Fubm90IGJlIG1pZ3JhdGVkIGNvbXBsZXRlbHkuIFBsZWFzZSBtYW51YWxseSByZW1vdmUgJyArXG4gICAgICAgICAgICAncmVmZXJlbmNlcyB0byB0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLiBSZWFkIG1vcmUgaGVyZTogJyArXG4gICAgICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9ibG9iLzNhMjA0ZGEzN2ZkMTM2NmNhZTQxMWI1YzIzNDUxN2VjYWQxOTk3MzcvZ3VpZGVzL3Y5LWhhbW1lcmpzLW1pZ3JhdGlvbi5tZCN0aGUtbWlncmF0aW9uLXJlcG9ydGVkLWFtYmlndW91cy11c2FnZS13aGF0LXNob3VsZC1pLWRvJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX3VzZWRJblJ1bnRpbWUgfHwgdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIC8vIFdlIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBIYW1tZXIgaXMgdXNlZCBnbG9iYWxseS4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSB3ZVxuICAgICAgLy8gd2FudCB0byBvbmx5IHJlbW92ZSBIYW1tZXIgZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIiBpZiBpdCBpcyBub3QgdXNlZCBpbiBhbnkgcHJvamVjdFxuICAgICAgLy8gdGFyZ2V0LiBKdXN0IGJlY2F1c2UgaXQgaXNuJ3QgdXNlZCBpbiBvbmUgdGFyZ2V0IGRvZXNuJ3QgbWVhbiB0aGF0IHdlIGNhbiBzYWZlbHlcbiAgICAgIC8vIHJlbW92ZSB0aGUgZGVwZW5kZW5jeS5cbiAgICAgIEhhbW1lckdlc3R1cmVzTWlncmF0aW9uLmdsb2JhbFVzZXNIYW1tZXIgPSB0cnVlO1xuXG4gICAgICAvLyBJZiBoYW1tZXIgaXMgb25seSB1c2VkIGF0IHJ1bnRpbWUsIHdlIGRvbid0IG5lZWQgdGhlIGdlc3R1cmUgY29uZmlnIG9yIFwiSGFtbWVyTW9kdWxlXCJcbiAgICAgIC8vIGFuZCBjYW4gcmVtb3ZlIGl0IChhbG9uZyB3aXRoIHRoZSBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBubyBsb25nZXIgbmVlZGVkKS5cbiAgICAgIGlmICghdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGFuZGFyZEV2ZW50c1VzZWRJblRlbXBsYXRlICYmICF0aGlzLl9jdXN0b21FdmVudHNVc2VkSW5UZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLl9zZXR1cEhhbW1lcldpdGhTdGFuZGFyZEV2ZW50cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0dXBIYW1tZXJXaXRoQ3VzdG9tRXZlbnRzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbW92ZUhhbW1lclNldHVwKCk7XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoZSBjaGFuZ2VzIGNvbGxlY3RlZCBpbiB0aGUgaW1wb3J0IG1hbmFnZXIuIENoYW5nZXMgbmVlZCB0byBiZSBhcHBsaWVkXG4gICAgLy8gb25jZSB0aGUgaW1wb3J0IG1hbmFnZXIgcmVnaXN0ZXJlZCBhbGwgaW1wb3J0IG1vZGlmaWNhdGlvbnMuIFRoaXMgYXZvaWRzIGNvbGxpc2lvbnMuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5yZWNvcmRDaGFuZ2VzKCk7XG5cbiAgICAvLyBDcmVhdGUgbWlncmF0aW9uIGZhaWx1cmVzIHRoYXQgd2lsbCBiZSBwcmludGVkIGJ5IHRoZSB1cGRhdGUtdG9vbCBvbiBtaWdyYXRpb25cbiAgICAvLyBjb21wbGV0aW9uLiBXZSBuZWVkIHNwZWNpYWwgbG9naWMgZm9yIHVwZGF0aW5nIGZhaWx1cmUgcG9zaXRpb25zIHRvIHJlZmxlY3RcbiAgICAvLyB0aGUgbmV3IHNvdXJjZSBmaWxlIGFmdGVyIG1vZGlmaWNhdGlvbnMgZnJvbSB0aGUgaW1wb3J0IG1hbmFnZXIuXG4gICAgdGhpcy5mYWlsdXJlcy5wdXNoKC4uLnRoaXMuX2NyZWF0ZU1pZ3JhdGlvbkZhaWx1cmVzKCkpO1xuXG4gICAgLy8gVGhlIHRlbXBsYXRlIGNoZWNrIGZvciBIYW1tZXJKUyBldmVudHMgaXMgbm90IGNvbXBsZXRlbHkgcmVsaWFibGUgYXMgdGhlIGV2ZW50XG4gICAgLy8gb3V0cHV0IGNvdWxkIGFsc28gYmUgZnJvbSBhIGNvbXBvbmVudCBoYXZpbmcgYW4gb3V0cHV0IG5hbWVkIHNpbWlsYXJseSB0byBhIGtub3duXG4gICAgLy8gaGFtbWVyanMgZXZlbnQgKGUuZy4gXCJAT3V0cHV0KCkgc2xpZGVcIikuIFRoZSB1c2FnZSBpcyB0aGVyZWZvcmUgc29tZXdoYXQgYW1iaWd1b3VzXG4gICAgLy8gYW5kIHdlIHdhbnQgdG8gcHJpbnQgYSBtZXNzYWdlIHRoYXQgZGV2ZWxvcGVycyBtaWdodCBiZSBhYmxlIHRvIHJlbW92ZSBIYW1tZXIgbWFudWFsbHkuXG4gICAgaWYgKCFoYXNDdXN0b21HZXN0dXJlQ29uZmlnU2V0dXAgJiYgIXRoaXMuX3VzZWRJblJ1bnRpbWUgJiYgdXNlZEluVGVtcGxhdGUpIHtcbiAgICAgIHRoaXMucHJpbnRJbmZvKFxuICAgICAgICAnVGhlIEhhbW1lckpTIHY5IG1pZ3JhdGlvbiBmb3IgQW5ndWxhciBDb21wb25lbnRzIG1pZ3JhdGVkIHRoZSAnICtcbiAgICAgICAgICAncHJvamVjdCB0byBrZWVwIEhhbW1lckpTIGluc3RhbGxlZCwgYnV0IGRldGVjdGVkIGFtYmlndW91cyB1c2FnZSBvZiBIYW1tZXJKUy4gUGxlYXNlICcgK1xuICAgICAgICAgICdtYW51YWxseSBjaGVjayBpZiB5b3UgY2FuIHJlbW92ZSBIYW1tZXJKUyBmcm9tIHlvdXIgYXBwbGljYXRpb24uIE1vcmUgZGV0YWlsczogJyArXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvYmxvYi8zYTIwNGRhMzdmZDEzNjZjYWU0MTFiNWMyMzQ1MTdlY2FkMTk5NzM3L2d1aWRlcy92OS1oYW1tZXJqcy1taWdyYXRpb24ubWQjdGhlLW1pZ3JhdGlvbi1yZXBvcnRlZC1hbWJpZ3VvdXMtdXNhZ2Utd2hhdC1zaG91bGQtaS1kbycsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgcHJvamVjdC4gVG8gYWNoaWV2ZSB0aGlzLCB0aGVcbiAgICogZm9sbG93aW5nIHN0ZXBzIGFyZSBwZXJmb3JtZWQ6XG4gICAqICAgMSkgQ3JlYXRlIGNvcHkgb2YgQW5ndWxhciBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAyKSBSZXdyaXRlIGFsbCByZWZlcmVuY2VzIHRvIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnIHRvIHRoZVxuICAgKiAgICAgIG5ldyBnZXN0dXJlIGNvbmZpZy5cbiAgICogICAzKSBTZXR1cCB0aGUgSEFNTUVSX0dFU1RVUkVfQ09ORklHIGluIHRoZSByb290IGFwcCBtb2R1bGUgKGlmIG5vdCBkb25lIGFscmVhZHkpLlxuICAgKiAgIDQpIFNldHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGluIHRoZSByb290IGFwcCBtb2R1bGUgKGlmIG5vdCBkb25lIGFscmVhZHkpLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0dXBIYW1tZXJXaXRoQ3VzdG9tRXZlbnRzKCkge1xuICAgIGNvbnN0IHByb2plY3QgPSB0aGlzLmNvbnRleHQucHJvamVjdDtcbiAgICBjb25zdCBzb3VyY2VSb290ID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUocHJvamVjdC5zb3VyY2VSb290IHx8IHByb2plY3Qucm9vdCk7XG4gICAgY29uc3QgbmV3Q29uZmlnUGF0aCA9IGpvaW4oc291cmNlUm9vdCwgdGhpcy5fZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3QpKTtcblxuICAgIC8vIENvcHkgZ2VzdHVyZSBjb25maWcgdGVtcGxhdGUgaW50byB0aGUgQ0xJIHByb2plY3QuXG4gICAgdGhpcy5maWxlU3lzdGVtLmNyZWF0ZShcbiAgICAgIG5ld0NvbmZpZ1BhdGgsXG4gICAgICByZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKEdFU1RVUkVfQ09ORklHX1RFTVBMQVRFX1BBVEgpLCAndXRmOCcpLFxuICAgICk7XG5cbiAgICAvLyBSZXBsYWNlIGFsbCBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZyByZWZlcmVuY2VzIHRvIHJlc29sdmUgdG8gdGhlXG4gICAgLy8gbmV3bHkgY29waWVkIGdlc3R1cmUgY29uZmlnLlxuICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLmZvckVhY2goaSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKGkubm9kZS5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcGxhY2VHZXN0dXJlQ29uZmlnUmVmZXJlbmNlKFxuICAgICAgICBpLFxuICAgICAgICBHRVNUVVJFX0NPTkZJR19DTEFTU19OQU1FLFxuICAgICAgICBnZXRNb2R1bGVTcGVjaWZpZXIobmV3Q29uZmlnUGF0aCwgZmlsZVBhdGgpLFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIFNldHVwIHRoZSBnZXN0dXJlIGNvbmZpZyBwcm92aWRlciBhbmQgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaW4gdGhlIHJvb3QgbW9kdWxlXG4gICAgLy8gaWYgbm90IGRvbmUgYWxyZWFkeS4gVGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgbmVlZGVkIGluIHY5IHNpbmNlIGl0IGVuYWJsZXMgdGhlXG4gICAgLy8gSGFtbWVyIGV2ZW50IHBsdWdpbiB0aGF0IHdhcyBwcmV2aW91c2x5IGVuYWJsZWQgYnkgZGVmYXVsdCBpbiB2OC5cbiAgICB0aGlzLl9zZXR1cE5ld0dlc3R1cmVDb25maWdJblJvb3RNb2R1bGUobmV3Q29uZmlnUGF0aCk7XG4gICAgdGhpcy5fc2V0dXBIYW1tZXJNb2R1bGVJblJvb3RNb2R1bGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBzdGFuZGFyZCBoYW1tZXIgbW9kdWxlIGluIHRoZSBwcm9qZWN0IGFuZCByZW1vdmVzIGFsbFxuICAgKiByZWZlcmVuY2VzIHRvIHRoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lcldpdGhTdGFuZGFyZEV2ZW50cygpIHtcbiAgICAvLyBTZXR1cCB0aGUgSGFtbWVyTW9kdWxlLiBUaGUgSGFtbWVyTW9kdWxlIGVuYWJsZXMgc3VwcG9ydCBmb3JcbiAgICAvLyB0aGUgc3RhbmRhcmQgSGFtbWVySlMgZXZlbnRzLlxuICAgIHRoaXMuX3NldHVwSGFtbWVyTW9kdWxlSW5Sb290TW9kdWxlKCk7XG4gICAgdGhpcy5fcmVtb3ZlTWF0ZXJpYWxHZXN0dXJlQ29uZmlnU2V0dXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIEhhbW1lciBmcm9tIHRoZSBjdXJyZW50IHByb2plY3QuIFRoZSBmb2xsb3dpbmcgc3RlcHMgYXJlIHBlcmZvcm1lZDpcbiAgICogICAxKSBEZWxldGUgYWxsIFR5cGVTY3JpcHQgaW1wb3J0cyB0byBcImhhbW1lcmpzXCIuXG4gICAqICAgMikgUmVtb3ZlIHJlZmVyZW5jZXMgdG8gdGhlIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAqICAgMykgUmVtb3ZlIFwiaGFtbWVyanNcIiBmcm9tIGFsbCBpbmRleCBIVE1MIGZpbGVzIG9mIHRoZSBjdXJyZW50IHByb2plY3QuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJTZXR1cCgpIHtcbiAgICB0aGlzLl9pbnN0YWxsSW1wb3J0cy5mb3JFYWNoKGkgPT4gdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVJbXBvcnRCeURlY2xhcmF0aW9uKGkpKTtcblxuICAgIHRoaXMuX3JlbW92ZU1hdGVyaWFsR2VzdHVyZUNvbmZpZ1NldHVwKCk7XG4gICAgdGhpcy5fcmVtb3ZlSGFtbWVyTW9kdWxlUmVmZXJlbmNlcygpO1xuICAgIHRoaXMuX3JlbW92ZUhhbW1lckZyb21JbmRleEZpbGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBnZXN0dXJlIGNvbmZpZyBzZXR1cCBieSBkZWxldGluZyBhbGwgZm91bmQgcmVmZXJlbmNlcyB0byB0aGUgQW5ndWxhclxuICAgKiBNYXRlcmlhbCBnZXN0dXJlIGNvbmZpZy4gQWRkaXRpb25hbGx5LCB1bnVzZWQgaW1wb3J0cyB0byB0aGUgaGFtbWVyIGdlc3R1cmUgY29uZmlnXG4gICAqIHRva2VuIGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCIgd2lsbCBiZSByZW1vdmVkIGFzIHdlbGwuXG4gICAqL1xuICBwcml2YXRlIF9yZW1vdmVNYXRlcmlhbEdlc3R1cmVDb25maWdTZXR1cCgpIHtcbiAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5mb3JFYWNoKHIgPT4gdGhpcy5fcmVtb3ZlR2VzdHVyZUNvbmZpZ1JlZmVyZW5jZShyKSk7XG5cbiAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuZm9yRWFjaChyID0+IHtcbiAgICAgIGlmIChyLmlzSW1wb3J0KSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUhhbW1lckNvbmZpZ1Rva2VuSW1wb3J0SWZVbnVzZWQocik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhbGwgcmVmZXJlbmNlcyB0byB0aGUgXCJIYW1tZXJNb2R1bGVcIiBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiAqL1xuICBwcml2YXRlIF9yZW1vdmVIYW1tZXJNb2R1bGVSZWZlcmVuY2VzKCkge1xuICAgIHRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuZm9yRWFjaCgoe25vZGUsIGlzSW1wb3J0LCBpbXBvcnREYXRhfSkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IG5vZGUuZ2V0U291cmNlRmlsZSgpO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdCh0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShzb3VyY2VGaWxlLmZpbGVOYW1lKSk7XG5cbiAgICAgIC8vIE9ubHkgcmVtb3ZlIHRoZSBpbXBvcnQgZm9yIHRoZSBIYW1tZXJNb2R1bGUgaWYgdGhlIG1vZHVsZSBoYXMgYmVlbiBhY2Nlc3NlZFxuICAgICAgLy8gdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgICAgaWYgKCFpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGUpKSB7XG4gICAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgICAgSEFNTUVSX01PRFVMRV9OQU1FLFxuICAgICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgICAvLyByZW1vdmluZyB0aGUgaW1wb3J0LiBGb3Igb3RoZXIgcmVmZXJlbmNlcywgd2UgcmVtb3ZlIHRoZSBpbXBvcnQgYW5kIHRoZSBhY3R1YWxcbiAgICAgIC8vIGlkZW50aWZpZXIgaW4gdGhlIG1vZHVsZSBpbXBvcnRzLlxuICAgICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIFwiSGFtbWVyTW9kdWxlXCIgaXMgcmVmZXJlbmNlZCB3aXRoaW4gYW4gYXJyYXkgbGl0ZXJhbCwgd2UgY2FuXG4gICAgICAvLyByZW1vdmUgdGhlIGVsZW1lbnQgZWFzaWx5LiBPdGhlcndpc2UgaWYgaXQncyBvdXRzaWRlIG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgICAvLyB3ZSBuZWVkIHRvIHJlcGxhY2UgdGhlIHJlZmVyZW5jZSB3aXRoIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHcvIHRvZG8gdG9cbiAgICAgIC8vIG5vdCBicmVhayB0aGUgYXBwbGljYXRpb24uXG4gICAgICBpZiAodHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG5vZGUucGFyZW50KSkge1xuICAgICAgICAvLyBSZW1vdmVzIHRoZSBcIkhhbW1lck1vZHVsZVwiIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgICAgIC8vIHRoZSB0cmFpbGluZyBjb21tYSB0b2tlbiBpZiBwcmVzZW50LlxuICAgICAgICByZW1vdmVFbGVtZW50RnJvbUFycmF5RXhwcmVzc2lvbihub2RlLCByZWNvcmRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5nZXRTdGFydCgpLCBub2RlLmdldFdpZHRoKCkpO1xuICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe1xuICAgICAgICAgIG5vZGU6IG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byBkZWxldGUgcmVmZXJlbmNlIHRvIFwiSGFtbWVyTW9kdWxlXCIuJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBoYW1tZXIgZ2VzdHVyZSBjb25maWdcbiAgICogdG9rZW4gZnJvbSBwbGF0Zm9ybS1icm93c2VyLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyR2VzdHVyZUNvbmZpZ1Rva2VuKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKFxuICAgICAgICBpbXBvcnREYXRhICYmXG4gICAgICAgIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FICYmXG4gICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEVcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMucHVzaCh7XG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBpbXBvcnREYXRhLFxuICAgICAgICAgIGlzSW1wb3J0OiB0cy5pc0ltcG9ydFNwZWNpZmllcihub2RlLnBhcmVudCksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSByZWZlcmVuY2UgdG8gdGhlIEhhbW1lck1vZHVsZSBmcm9tXG4gICAqIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiLiBJZiBzbywga2VlcHMgdHJhY2sgb2YgdGhlIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9ySGFtbWVyTW9kdWxlUmVmZXJlbmNlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKFxuICAgICAgICBpbXBvcnREYXRhICYmXG4gICAgICAgIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gSEFNTUVSX01PRFVMRV9OQU1FICYmXG4gICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSA9PT0gSEFNTUVSX01PRFVMRV9JTVBPUlRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9oYW1tZXJNb2R1bGVSZWZlcmVuY2VzLnB1c2goe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgaW1wb3J0RGF0YSxcbiAgICAgICAgICBpc0ltcG9ydDogdHMuaXNJbXBvcnRTcGVjaWZpZXIobm9kZS5wYXJlbnQpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGFuIGltcG9ydCB0byB0aGUgSGFtbWVySlMgcGFja2FnZS4gSW1wb3J0cyB0b1xuICAgKiBIYW1tZXJKUyB3aGljaCBsb2FkIHNwZWNpZmljIHN5bWJvbHMgZnJvbSB0aGUgcGFja2FnZSBhcmUgY29uc2lkZXJlZCBhc1xuICAgKiBydW50aW1lIHVzYWdlIG9mIEhhbW1lci4gZS5nLiBgaW1wb3J0IHtTeW1ib2x9IGZyb20gXCJoYW1tZXJqc1wiO2AuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0hhbW1lckltcG9ydHMobm9kZTogdHMuTm9kZSkge1xuICAgIGlmIChcbiAgICAgIHRzLmlzSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgJiZcbiAgICAgIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlLm1vZHVsZVNwZWNpZmllcikgJiZcbiAgICAgIG5vZGUubW9kdWxlU3BlY2lmaWVyLnRleHQgPT09IEhBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXG4gICAgKSB7XG4gICAgICAvLyBJZiB0aGVyZSBpcyBhbiBpbXBvcnQgdG8gSGFtbWVySlMgdGhhdCBpbXBvcnRzIHN5bWJvbHMsIG9yIGlzIG5hbWVzcGFjZWRcbiAgICAgIC8vIChlLmcuIFwiaW1wb3J0IHtBLCBCfSBmcm9tIC4uLlwiIG9yIFwiaW1wb3J0ICogYXMgaGFtbWVyIGZyb20gLi4uXCIpLCB0aGVuIHdlXG4gICAgICAvLyBhc3N1bWUgdGhhdCBzb21lIGV4cG9ydHMgYXJlIHVzZWQgYXQgcnVudGltZS5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS5pbXBvcnRDbGF1c2UgJiZcbiAgICAgICAgIShcbiAgICAgICAgICBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzICYmXG4gICAgICAgICAgdHMuaXNOYW1lZEltcG9ydHMobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykgJiZcbiAgICAgICAgICBub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzLmxlbmd0aCA9PT0gMFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbnN0YWxsSW1wb3J0cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgYWNjZXNzZXMgdGhlIGdsb2JhbCBcIkhhbW1lclwiIHN5bWJvbCBhdCBydW50aW1lLiBJZiBzbyxcbiAgICogdGhlIG1pZ3JhdGlvbiBydWxlIHN0YXRlIHdpbGwgYmUgdXBkYXRlZCB0byByZWZsZWN0IHRoYXQgSGFtbWVyIGlzIHVzZWQgYXQgcnVudGltZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yUnVudGltZUhhbW1lclVzYWdlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodGhpcy5fdXNlZEluUnVudGltZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERldGVjdHMgdXNhZ2VzIG9mIFwid2luZG93LkhhbW1lclwiLlxuICAgIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJiBub2RlLm5hbWUudGV4dCA9PT0gJ0hhbW1lcicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRGV0ZWN0cyB1c2FnZXMgb2YgXCJ3aW5kb3dbJ0hhbW1lciddXCIuXG4gICAgaWYgKFxuICAgICAgdHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlKSAmJlxuICAgICAgdHMuaXNTdHJpbmdMaXRlcmFsKG5vZGUuYXJndW1lbnRFeHByZXNzaW9uKSAmJlxuICAgICAgbm9kZS5hcmd1bWVudEV4cHJlc3Npb24udGV4dCA9PT0gJ0hhbW1lcidcbiAgICApIHtcbiAgICAgIGNvbnN0IG9yaWdpbkV4cHIgPSB1bndyYXBFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgICBpZiAodHMuaXNJZGVudGlmaWVyKG9yaWdpbkV4cHIpICYmIG9yaWdpbkV4cHIudGV4dCA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgdGhpcy5fdXNlZEluUnVudGltZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyB1c2FnZXMgb2YgcGxhaW4gaWRlbnRpZmllciB3aXRoIHRoZSBuYW1lIFwiSGFtbWVyXCIuIFRoZXNlIHVzYWdlXG4gICAgLy8gYXJlIHZhbGlkIGlmIHRoZXkgcmVzb2x2ZSB0byBcIkB0eXBlcy9oYW1tZXJqc1wiLiBlLmcuIFwibmV3IEhhbW1lcihteUVsZW1lbnQpXCIuXG4gICAgaWYgKFxuICAgICAgdHMuaXNJZGVudGlmaWVyKG5vZGUpICYmXG4gICAgICBub2RlLnRleHQgPT09ICdIYW1tZXInICYmXG4gICAgICAhdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpICYmXG4gICAgICAhdHMuaXNFbGVtZW50QWNjZXNzRXhwcmVzc2lvbihub2RlLnBhcmVudClcbiAgICApIHtcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHRoaXMuX2dldERlY2xhcmF0aW9uU3ltYm9sT2ZOb2RlKG5vZGUpO1xuICAgICAgaWYgKFxuICAgICAgICBzeW1ib2wgJiZcbiAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gJiZcbiAgICAgICAgc3ltYm9sLnZhbHVlRGVjbGFyYXRpb24uZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lLmluY2x1ZGVzKCdAdHlwZXMvaGFtbWVyanMnKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX3VzZWRJblJ1bnRpbWUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGdpdmVuIG5vZGUgcmVmZXJlbmNlcyB0aGUgZ2VzdHVyZSBjb25maWcgZnJvbSBBbmd1bGFyIE1hdGVyaWFsLlxuICAgKiBJZiBzbywgd2Uga2VlcCB0cmFjayBvZiB0aGUgZm91bmQgc3ltYm9sIHJlZmVyZW5jZS5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrRm9yTWF0ZXJpYWxHZXN0dXJlQ29uZmlnKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICBjb25zdCBpbXBvcnREYXRhID0gZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKG5vZGUsIHRoaXMudHlwZUNoZWNrZXIpO1xuICAgICAgaWYgKFxuICAgICAgICBpbXBvcnREYXRhICYmXG4gICAgICAgIGltcG9ydERhdGEuc3ltYm9sTmFtZSA9PT0gR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSAmJlxuICAgICAgICBpbXBvcnREYXRhLm1vZHVsZU5hbWUuc3RhcnRzV2l0aCgnQGFuZ3VsYXIvbWF0ZXJpYWwvJylcbiAgICAgICkge1xuICAgICAgICB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5wdXNoKHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGltcG9ydERhdGEsXG4gICAgICAgICAgaXNJbXBvcnQ6IHRzLmlzSW1wb3J0U3BlY2lmaWVyKG5vZGUucGFyZW50KSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gSGFtbWVyIGdlc3R1cmUgY29uZmlnIHRva2VuIHJlZmVyZW5jZSBpcyBwYXJ0IG9mIGFuXG4gICAqIEFuZ3VsYXIgcHJvdmlkZXIgZGVmaW5pdGlvbiB0aGF0IHNldHMgdXAgYSBjdXN0b20gZ2VzdHVyZSBjb25maWcuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja0ZvckN1c3RvbUdlc3R1cmVDb25maWdTZXR1cCh0b2tlblJlZjogSWRlbnRpZmllclJlZmVyZW5jZSk6IGJvb2xlYW4ge1xuICAgIC8vIFdhbGsgdXAgdGhlIHRyZWUgdG8gbG9vayBmb3IgYSBwYXJlbnQgcHJvcGVydHkgYXNzaWdubWVudCBvZiB0aGVcbiAgICAvLyByZWZlcmVuY2UgdG8gdGhlIGhhbW1lciBnZXN0dXJlIGNvbmZpZyB0b2tlbi5cbiAgICBsZXQgcHJvcGVydHlBc3NpZ25tZW50OiB0cy5Ob2RlID0gdG9rZW5SZWYubm9kZTtcbiAgICB3aGlsZSAocHJvcGVydHlBc3NpZ25tZW50ICYmICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eUFzc2lnbm1lbnQpKSB7XG4gICAgICBwcm9wZXJ0eUFzc2lnbm1lbnQgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICFwcm9wZXJ0eUFzc2lnbm1lbnQgfHxcbiAgICAgICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eUFzc2lnbm1lbnQpIHx8XG4gICAgICBnZXRQcm9wZXJ0eU5hbWVUZXh0KHByb3BlcnR5QXNzaWdubWVudC5uYW1lKSAhPT0gJ3Byb3ZpZGUnXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0TGl0ZXJhbEV4cHIgPSBwcm9wZXJ0eUFzc2lnbm1lbnQucGFyZW50O1xuICAgIGNvbnN0IG1hdGNoaW5nSWRlbnRpZmllcnMgPSBmaW5kTWF0Y2hpbmdDaGlsZE5vZGVzKG9iamVjdExpdGVyYWxFeHByLCB0cy5pc0lkZW50aWZpZXIpO1xuXG4gICAgLy8gV2UgbmFpdmVseSBhc3N1bWUgdGhhdCBpZiB0aGVyZSBpcyBhIHJlZmVyZW5jZSB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIgZXhwb3J0XG4gICAgLy8gZnJvbSBBbmd1bGFyIE1hdGVyaWFsIGluIHRoZSBwcm92aWRlciBsaXRlcmFsLCB0aGF0IHRoZSBwcm92aWRlciBzZXRzIHVwIHRoZVxuICAgIC8vIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcuXG4gICAgcmV0dXJuICF0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlcy5zb21lKHIgPT4gbWF0Y2hpbmdJZGVudGlmaWVycy5pbmNsdWRlcyhyLm5vZGUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGFuIGF2YWlsYWJsZSBmaWxlIG5hbWUgZm9yIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBzaG91bGRcbiAgICogYmUgc3RvcmVkIGluIHRoZSBzcGVjaWZpZWQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0QXZhaWxhYmxlR2VzdHVyZUNvbmZpZ0ZpbGVOYW1lKHNvdXJjZVJvb3Q6IFBhdGgpIHtcbiAgICBpZiAoIXRoaXMuZmlsZVN5c3RlbS5maWxlRXhpc3RzKGpvaW4oc291cmNlUm9vdCwgYCR7R0VTVFVSRV9DT05GSUdfRklMRV9OQU1FfS50c2ApKSkge1xuICAgICAgcmV0dXJuIGAke0dFU1RVUkVfQ09ORklHX0ZJTEVfTkFNRX0udHNgO1xuICAgIH1cblxuICAgIGxldCBwb3NzaWJsZU5hbWUgPSBgJHtHRVNUVVJFX0NPTkZJR19GSUxFX05BTUV9LWA7XG4gICAgbGV0IGluZGV4ID0gMTtcbiAgICB3aGlsZSAodGhpcy5maWxlU3lzdGVtLmZpbGVFeGlzdHMoam9pbihzb3VyY2VSb290LCBgJHtwb3NzaWJsZU5hbWV9LSR7aW5kZXh9LnRzYCkpKSB7XG4gICAgICBpbmRleCsrO1xuICAgIH1cbiAgICByZXR1cm4gYCR7cG9zc2libGVOYW1lICsgaW5kZXh9LnRzYDtcbiAgfVxuXG4gIC8qKiBSZXBsYWNlcyBhIGdpdmVuIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZSB3aXRoIGEgbmV3IGltcG9ydC4gKi9cbiAgcHJpdmF0ZSBfcmVwbGFjZUdlc3R1cmVDb25maWdSZWZlcmVuY2UoXG4gICAge25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSxcbiAgICBzeW1ib2xOYW1lOiBzdHJpbmcsXG4gICAgbW9kdWxlU3BlY2lmaWVyOiBzdHJpbmcsXG4gICkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcblxuICAgIC8vIExpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHJlZmVycmluZyB0byB0aGUgZ2VzdHVyZSBjb25maWcgaW4gdGhlIGN1cnJlbnQgZmlsZS4gVGhpc1xuICAgIC8vIGFsbG93cyB1cyB0byBhZGQgYW4gaW1wb3J0IGZvciB0aGUgY29waWVkIGdlc3R1cmUgY29uZmlndXJhdGlvbiB3aXRob3V0IGdlbmVyYXRpbmcgYVxuICAgIC8vIG5ldyBpZGVudGlmaWVyIGZvciB0aGUgaW1wb3J0IHRvIGF2b2lkIGNvbGxpc2lvbnMuIGkuZS4gXCJHZXN0dXJlQ29uZmlnXzFcIi4gVGhlIGltcG9ydFxuICAgIC8vIG1hbmFnZXIgY2hlY2tzIGZvciBwb3NzaWJsZSBuYW1lIGNvbGxpc2lvbnMsIGJ1dCBpcyBhYmxlIHRvIGlnbm9yZSBzcGVjaWZpYyBpZGVudGlmaWVycy5cbiAgICAvLyBXZSB1c2UgdGhpcyB0byBpZ25vcmUgYWxsIHJlZmVyZW5jZXMgdG8gdGhlIG9yaWdpbmFsIEFuZ3VsYXIgTWF0ZXJpYWwgZ2VzdHVyZSBjb25maWcsXG4gICAgLy8gYmVjYXVzZSB0aGVzZSB3aWxsIGJlIHJlcGxhY2VkIGFuZCB0aGVyZWZvcmUgd2lsbCBub3QgaW50ZXJmZXJlLlxuICAgIGNvbnN0IGdlc3R1cmVJZGVudGlmaWVyc0luRmlsZSA9IHRoaXMuX2dldEdlc3R1cmVDb25maWdJZGVudGlmaWVyc09mRmlsZShzb3VyY2VGaWxlKTtcblxuICAgIC8vIElmIHRoZSBwYXJlbnQgb2YgdGhlIGlkZW50aWZpZXIgaXMgYWNjZXNzZWQgdGhyb3VnaCBhIG5hbWVzcGFjZSwgd2UgY2FuIGp1c3RcbiAgICAvLyBpbXBvcnQgdGhlIG5ldyBnZXN0dXJlIGNvbmZpZyB3aXRob3V0IHJld3JpdGluZyB0aGUgaW1wb3J0IGRlY2xhcmF0aW9uIGJlY2F1c2VcbiAgICAvLyB0aGUgY29uZmlnIGhhcyBiZWVuIGltcG9ydGVkIHRocm91Z2ggYSBuYW1lc3BhY2VkIGltcG9ydC5cbiAgICBpZiAoaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzeW1ib2xOYW1lLFxuICAgICAgICBtb2R1bGVTcGVjaWZpZXIsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICBnZXN0dXJlSWRlbnRpZmllcnNJbkZpbGUsXG4gICAgICApO1xuXG4gICAgICByZWNvcmRlci5yZW1vdmUobm9kZS5wYXJlbnQuZ2V0U3RhcnQoKSwgbm9kZS5wYXJlbnQuZ2V0V2lkdGgoKSk7XG4gICAgICByZWNvcmRlci5pbnNlcnRSaWdodChub2RlLnBhcmVudC5nZXRTdGFydCgpLCB0aGlzLl9wcmludE5vZGUobmV3RXhwcmVzc2lvbiwgc291cmNlRmlsZSkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIERlbGV0ZSB0aGUgb2xkIGltcG9ydCB0byB0aGUgXCJHZXN0dXJlQ29uZmlnXCIuXG4gICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgR0VTVFVSRV9DT05GSUdfQ0xBU1NfTkFNRSxcbiAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSxcbiAgICApO1xuXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgcmVmZXJlbmNlIGlzIG5vdCBmcm9tIGluc2lkZSBvZiBhIGltcG9ydCwgd2UgbmVlZCB0byBhZGQgYSBuZXdcbiAgICAvLyBpbXBvcnQgdG8gdGhlIGNvcGllZCBnZXN0dXJlIGNvbmZpZyBhbmQgcmVwbGFjZSB0aGUgaWRlbnRpZmllci4gRm9yIHJlZmVyZW5jZXNcbiAgICAvLyB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3RoaW5nIGJ1dCByZW1vdmluZyB0aGUgYWN0dWFsIGltcG9ydC4gVGhpcyBhbGxvd3MgdXNcbiAgICAvLyB0byByZW1vdmUgdW51c2VkIGltcG9ydHMgdG8gdGhlIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLlxuICAgIGlmICghaXNJbXBvcnQpIHtcbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSB0aGlzLl9pbXBvcnRNYW5hZ2VyLmFkZEltcG9ydFRvU291cmNlRmlsZShcbiAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgc3ltYm9sTmFtZSxcbiAgICAgICAgbW9kdWxlU3BlY2lmaWVyLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgZ2VzdHVyZUlkZW50aWZpZXJzSW5GaWxlLFxuICAgICAgKTtcblxuICAgICAgcmVjb3JkZXIucmVtb3ZlKG5vZGUuZ2V0U3RhcnQoKSwgbm9kZS5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG5vZGUuZ2V0U3RhcnQoKSwgdGhpcy5fcHJpbnROb2RlKG5ld0V4cHJlc3Npb24sIHNvdXJjZUZpbGUpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGdpdmVuIGdlc3R1cmUgY29uZmlnIHJlZmVyZW5jZSBhbmQgaXRzIGNvcnJlc3BvbmRpbmcgaW1wb3J0IGZyb21cbiAgICogaXRzIGNvbnRhaW5pbmcgc291cmNlIGZpbGUuIEltcG9ydHMgd2lsbCBiZSBhbHdheXMgcmVtb3ZlZCwgYnV0IGluIHNvbWUgY2FzZXMsXG4gICAqIHdoZXJlIGl0J3Mgbm90IGd1YXJhbnRlZWQgdGhhdCBhIHJlbW92YWwgY2FuIGJlIHBlcmZvcm1lZCBzYWZlbHksIHdlIGp1c3RcbiAgICogY3JlYXRlIGEgbWlncmF0aW9uIGZhaWx1cmUgKGFuZCBhZGQgYSBUT0RPIGlmIHBvc3NpYmxlKS5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZUdlc3R1cmVDb25maWdSZWZlcmVuY2Uoe25vZGUsIGltcG9ydERhdGEsIGlzSW1wb3J0fTogSWRlbnRpZmllclJlZmVyZW5jZSkge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcbiAgICAvLyBPbmx5IHJlbW92ZSB0aGUgaW1wb3J0IGZvciB0aGUgZ2VzdHVyZSBjb25maWcgaWYgdGhlIGdlc3R1cmUgY29uZmlnIGhhc1xuICAgIC8vIGJlZW4gYWNjZXNzZWQgdGhyb3VnaCBhIG5vbi1uYW1lc3BhY2VkIGlkZW50aWZpZXIgYWNjZXNzLlxuICAgIGlmICghaXNOYW1lc3BhY2VkSWRlbnRpZmllckFjY2Vzcyhub2RlKSkge1xuICAgICAgdGhpcy5faW1wb3J0TWFuYWdlci5kZWxldGVOYW1lZEJpbmRpbmdJbXBvcnQoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRm9yIHJlZmVyZW5jZXMgZnJvbSB3aXRoaW4gYW4gaW1wb3J0LCB3ZSBkbyBub3QgbmVlZCB0byBkbyBhbnl0aGluZyBvdGhlciB0aGFuXG4gICAgLy8gcmVtb3ZpbmcgdGhlIGltcG9ydC4gRm9yIG90aGVyIHJlZmVyZW5jZXMsIHdlIHJlbW92ZSB0aGUgaW1wb3J0IGFuZCB0aGUgcmVmZXJlbmNlXG4gICAgLy8gaWRlbnRpZmllciBpZiB1c2VkIGluc2lkZSBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKGlzSW1wb3J0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXJBc3NpZ25tZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgICAvLyBPbmx5IHJlbW92ZSByZWZlcmVuY2VzIHRvIHRoZSBnZXN0dXJlIGNvbmZpZyB3aGljaCBhcmUgcGFydCBvZiBhIHN0YXRpY2FsbHlcbiAgICAvLyBhbmFseXphYmxlIHByb3ZpZGVyIGRlZmluaXRpb24uIFdlIG9ubHkgc3VwcG9ydCB0aGUgY29tbW9uIGNhc2Ugb2YgYSBnZXN0dXJlXG4gICAgLy8gY29uZmlnIHByb3ZpZGVyIGRlZmluaXRpb24gd2hlcmUgdGhlIGNvbmZpZyBpcyBzZXQgdXAgdGhyb3VnaCBcInVzZUNsYXNzXCIuXG4gICAgLy8gT3RoZXJ3aXNlLCBpdCdzIG5vdCBndWFyYW50ZWVkIHRoYXQgd2UgY2FuIHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyIGRlZmluaXRpb24uXG4gICAgaWYgKFxuICAgICAgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3ZpZGVyQXNzaWdubWVudCkgfHxcbiAgICAgIGdldFByb3BlcnR5TmFtZVRleHQocHJvdmlkZXJBc3NpZ25tZW50Lm5hbWUpICE9PSAndXNlQ2xhc3MnXG4gICAgKSB7XG4gICAgICB0aGlzLl9ub2RlRmFpbHVyZXMucHVzaCh7bm9kZSwgbWVzc2FnZTogQ0FOTk9UX1JFTU9WRV9SRUZFUkVOQ0VfRVJST1J9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvYmplY3RMaXRlcmFsRXhwciA9IHByb3ZpZGVyQXNzaWdubWVudC5wYXJlbnQ7XG4gICAgY29uc3QgcHJvdmlkZVRva2VuID0gb2JqZWN0TGl0ZXJhbEV4cHIucHJvcGVydGllcy5maW5kKFxuICAgICAgKHApOiBwIGlzIHRzLlByb3BlcnR5QXNzaWdubWVudCA9PlxuICAgICAgICB0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwKSAmJiBnZXRQcm9wZXJ0eU5hbWVUZXh0KHAubmFtZSkgPT09ICdwcm92aWRlJyxcbiAgICApO1xuXG4gICAgLy8gRG8gbm90IHJlbW92ZSB0aGUgcmVmZXJlbmNlIGlmIHRoZSBnZXN0dXJlIGNvbmZpZyBpcyBub3QgcGFydCBvZiBhIHByb3ZpZGVyIGRlZmluaXRpb24sXG4gICAgLy8gb3IgaWYgdGhlIHByb3ZpZGVkIHRva2UgaXMgbm90IHJlZmVycmluZyB0byB0aGUga25vd24gSEFNTUVSX0dFU1RVUkVfQ09ORklHIHRva2VuXG4gICAgLy8gZnJvbSBwbGF0Zm9ybS1icm93c2VyLlxuICAgIGlmICghcHJvdmlkZVRva2VuIHx8ICF0aGlzLl9pc1JlZmVyZW5jZVRvSGFtbWVyQ29uZmlnVG9rZW4ocHJvdmlkZVRva2VuLmluaXRpYWxpemVyKSkge1xuICAgICAgdGhpcy5fbm9kZUZhaWx1cmVzLnB1c2goe25vZGUsIG1lc3NhZ2U6IENBTk5PVF9SRU1PVkVfUkVGRVJFTkNFX0VSUk9SfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29sbGVjdCBhbGwgbmVzdGVkIGlkZW50aWZpZXJzIHdoaWNoIHdpbGwgYmUgZGVsZXRlZC4gVGhpcyBoZWxwcyB1c1xuICAgIC8vIGRldGVybWluaW5nIGlmIHdlIGNhbiByZW1vdmUgaW1wb3J0cyBmb3IgdGhlIFwiSEFNTUVSX0dFU1RVUkVfQ09ORklHXCIgdG9rZW4uXG4gICAgdGhpcy5fZGVsZXRlZElkZW50aWZpZXJzLnB1c2goLi4uZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhvYmplY3RMaXRlcmFsRXhwciwgdHMuaXNJZGVudGlmaWVyKSk7XG5cbiAgICAvLyBJbiBjYXNlIHRoZSBmb3VuZCBwcm92aWRlciBkZWZpbml0aW9uIGlzIG5vdCBwYXJ0IG9mIGFuIGFycmF5IGxpdGVyYWwsXG4gICAgLy8gd2UgY2Fubm90IHNhZmVseSByZW1vdmUgdGhlIHByb3ZpZGVyLiBUaGlzIGlzIGJlY2F1c2UgaXQgY291bGQgYmUgZGVjbGFyZWRcbiAgICAvLyBhcyBhIHZhcmlhYmxlLiBlLmcuIFwiY29uc3QgZ2VzdHVyZVByb3ZpZGVyID0ge3Byb3ZpZGU6IC4uLCB1c2VDbGFzczogR2VzdHVyZUNvbmZpZ31cIi5cbiAgICAvLyBJbiB0aGF0IGNhc2UsIHdlIGp1c3QgYWRkIGFuIGVtcHR5IG9iamVjdCBsaXRlcmFsIHdpdGggVE9ETyBhbmQgcHJpbnQgYSBmYWlsdXJlLlxuICAgIGlmICghdHMuaXNBcnJheUxpdGVyYWxFeHByZXNzaW9uKG9iamVjdExpdGVyYWxFeHByLnBhcmVudCkpIHtcbiAgICAgIHJlY29yZGVyLnJlbW92ZShvYmplY3RMaXRlcmFsRXhwci5nZXRTdGFydCgpLCBvYmplY3RMaXRlcmFsRXhwci5nZXRXaWR0aCgpKTtcbiAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KG9iamVjdExpdGVyYWxFeHByLmdldFN0YXJ0KCksIGAvKiBUT0RPOiByZW1vdmUgKi8ge31gKTtcbiAgICAgIHRoaXMuX25vZGVGYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgbm9kZTogb2JqZWN0TGl0ZXJhbEV4cHIsXG4gICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgYFVuYWJsZSB0byBkZWxldGUgcHJvdmlkZXIgZGVmaW5pdGlvbiBmb3IgXCJHZXN0dXJlQ29uZmlnXCIgY29tcGxldGVseS4gYCArXG4gICAgICAgICAgYFBsZWFzZSBjbGVhbiB1cCB0aGUgcHJvdmlkZXIuYCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZXMgdGhlIG9iamVjdCBsaXRlcmFsIGZyb20gdGhlIHBhcmVudCBhcnJheSBleHByZXNzaW9uLiBSZW1vdmVzXG4gICAgLy8gdGhlIHRyYWlsaW5nIGNvbW1hIHRva2VuIGlmIHByZXNlbnQuXG4gICAgcmVtb3ZlRWxlbWVudEZyb21BcnJheUV4cHJlc3Npb24ob2JqZWN0TGl0ZXJhbEV4cHIsIHJlY29yZGVyKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBnaXZlbiBoYW1tZXIgY29uZmlnIHRva2VuIGltcG9ydCBpZiBpdCBpcyBub3QgdXNlZC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyQ29uZmlnVG9rZW5JbXBvcnRJZlVudXNlZCh7bm9kZSwgaW1wb3J0RGF0YX06IElkZW50aWZpZXJSZWZlcmVuY2UpIHtcbiAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgaXNUb2tlblVzZWQgPSB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShcbiAgICAgIHIgPT5cbiAgICAgICAgIXIuaXNJbXBvcnQgJiZcbiAgICAgICAgIWlzTmFtZXNwYWNlZElkZW50aWZpZXJBY2Nlc3Moci5ub2RlKSAmJlxuICAgICAgICByLm5vZGUuZ2V0U291cmNlRmlsZSgpID09PSBzb3VyY2VGaWxlICYmXG4gICAgICAgICF0aGlzLl9kZWxldGVkSWRlbnRpZmllcnMuaW5jbHVkZXMoci5ub2RlKSxcbiAgICApO1xuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGltcG9ydCBmb3IgdGhlIHRva2VuIGlmIHRoZSB0b2tlbiBpc1xuICAgIC8vIHN0aWxsIHVzZWQgc29tZXdoZXJlLlxuICAgIGlmICghaXNUb2tlblVzZWQpIHtcbiAgICAgIHRoaXMuX2ltcG9ydE1hbmFnZXIuZGVsZXRlTmFtZWRCaW5kaW5nSW1wb3J0KFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBIQU1NRVJfQ09ORklHX1RPS0VOX05BTUUsXG4gICAgICAgIGltcG9ydERhdGEubW9kdWxlTmFtZSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlbW92ZXMgSGFtbWVyIGZyb20gYWxsIGluZGV4IEhUTUwgZmlsZXMgb2YgdGhlIGN1cnJlbnQgcHJvamVjdC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlSGFtbWVyRnJvbUluZGV4RmlsZSgpIHtcbiAgICBjb25zdCBpbmRleEZpbGVQYXRocyA9IGdldFByb2plY3RJbmRleEZpbGVzKHRoaXMuY29udGV4dC5wcm9qZWN0KTtcbiAgICBpbmRleEZpbGVQYXRocy5mb3JFYWNoKGZpbGVQYXRoID0+IHtcbiAgICAgIGlmICghdGhpcy5maWxlU3lzdGVtLmZpbGVFeGlzdHMoZmlsZVBhdGgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSB0aGlzLmZpbGVTeXN0ZW0ucmVhZChmaWxlUGF0aCkhO1xuICAgICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChmaWxlUGF0aCk7XG5cbiAgICAgIGZpbmRIYW1tZXJTY3JpcHRJbXBvcnRFbGVtZW50cyhodG1sQ29udGVudCkuZm9yRWFjaChlbCA9PlxuICAgICAgICByZW1vdmVFbGVtZW50RnJvbUh0bWwoZWwsIHJlY29yZGVyKSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgSGFtbWVyIGdlc3R1cmUgY29uZmlnIGluIHRoZSByb290IG1vZHVsZSBpZiBuZWVkZWQuICovXG4gIHByaXZhdGUgX3NldHVwTmV3R2VzdHVyZUNvbmZpZ0luUm9vdE1vZHVsZShnZXN0dXJlQ29uZmlnUGF0aDogUGF0aCkge1xuICAgIGNvbnN0IHtwcm9qZWN0fSA9IHRoaXMuY29udGV4dDtcbiAgICBjb25zdCBtYWluRmlsZVBhdGggPSBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCk7XG4gICAgY29uc3Qgcm9vdE1vZHVsZVN5bWJvbCA9IHRoaXMuX2dldFJvb3RNb2R1bGVTeW1ib2wobWFpbkZpbGVQYXRoKTtcblxuICAgIGlmIChyb290TW9kdWxlU3ltYm9sID09PSBudWxsIHx8IHJvb3RNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgICBmaWxlUGF0aDogbWFpbkZpbGVQYXRoLFxuICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgIGBDb3VsZCBub3Qgc2V0dXAgSGFtbWVyIGdlc3R1cmVzIGluIG1vZHVsZS4gUGxlYXNlIGAgK1xuICAgICAgICAgIGBtYW51YWxseSBlbnN1cmUgdGhhdCB0aGUgSGFtbWVyIGdlc3R1cmUgY29uZmlnIGlzIHNldCB1cC5gLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlRmlsZSA9IHJvb3RNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBnZXREZWNvcmF0b3JNZXRhZGF0YShcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAnTmdNb2R1bGUnLFxuICAgICAgJ0Bhbmd1bGFyL2NvcmUnLFxuICAgICkgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcblxuICAgIC8vIElmIG5vIFwiTmdNb2R1bGVcIiBkZWZpbml0aW9uIGlzIGZvdW5kIGluc2lkZSB0aGUgc291cmNlIGZpbGUsIHdlIGp1c3QgZG8gbm90aGluZy5cbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChmaWxlUGF0aCk7XG4gICAgY29uc3QgcHJvdmlkZXJzRmllbGQgPSBnZXRNZXRhZGF0YUZpZWxkKG1ldGFkYXRhWzBdLCAncHJvdmlkZXJzJylbMF07XG4gICAgY29uc3QgcHJvdmlkZXJJZGVudGlmaWVycyA9IHByb3ZpZGVyc0ZpZWxkXG4gICAgICA/IGZpbmRNYXRjaGluZ0NoaWxkTm9kZXMocHJvdmlkZXJzRmllbGQsIHRzLmlzSWRlbnRpZmllcilcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCBnZXN0dXJlQ29uZmlnRXhwciA9IHRoaXMuX2ltcG9ydE1hbmFnZXIuYWRkSW1wb3J0VG9Tb3VyY2VGaWxlKFxuICAgICAgc291cmNlRmlsZSxcbiAgICAgIEdFU1RVUkVfQ09ORklHX0NMQVNTX05BTUUsXG4gICAgICBnZXRNb2R1bGVTcGVjaWZpZXIoZ2VzdHVyZUNvbmZpZ1BhdGgsIGZpbGVQYXRoKSxcbiAgICAgIGZhbHNlLFxuICAgICAgdGhpcy5fZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGUpLFxuICAgICk7XG4gICAgY29uc3QgaGFtbWVyQ29uZmlnVG9rZW5FeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgSEFNTUVSX0NPTkZJR19UT0tFTl9OQU1FLFxuICAgICAgSEFNTUVSX0NPTkZJR19UT0tFTl9NT0RVTEUsXG4gICAgKTtcbiAgICBjb25zdCBuZXdQcm92aWRlck5vZGUgPSB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKFtcbiAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudCgncHJvdmlkZScsIGhhbW1lckNvbmZpZ1Rva2VuRXhwciksXG4gICAgICB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQoJ3VzZUNsYXNzJywgZ2VzdHVyZUNvbmZpZ0V4cHIpLFxuICAgIF0pO1xuXG4gICAgLy8gSWYgdGhlIHByb3ZpZGVycyBmaWVsZCBleGlzdHMgYW5kIGFscmVhZHkgY29udGFpbnMgcmVmZXJlbmNlcyB0byB0aGUgaGFtbWVyIGdlc3R1cmVcbiAgICAvLyBjb25maWcgdG9rZW4gYW5kIHRoZSBnZXN0dXJlIGNvbmZpZywgd2UgbmFpdmVseSBhc3N1bWUgdGhhdCB0aGUgZ2VzdHVyZSBjb25maWcgaXNcbiAgICAvLyBhbHJlYWR5IHNldCB1cC4gV2Ugb25seSB3YW50IHRvIGFkZCB0aGUgZ2VzdHVyZSBjb25maWcgcHJvdmlkZXIgaWYgaXQgaXMgbm90IHNldCB1cC5cbiAgICBpZiAoXG4gICAgICAhcHJvdmlkZXJJZGVudGlmaWVycyB8fFxuICAgICAgIShcbiAgICAgICAgdGhpcy5faGFtbWVyQ29uZmlnVG9rZW5SZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpICYmXG4gICAgICAgIHRoaXMuX2dlc3R1cmVDb25maWdSZWZlcmVuY2VzLnNvbWUociA9PiBwcm92aWRlcklkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpXG4gICAgICApXG4gICAgKSB7XG4gICAgICBjb25zdCBzeW1ib2xOYW1lID0gdGhpcy5fcHJpbnROb2RlKG5ld1Byb3ZpZGVyTm9kZSwgc291cmNlRmlsZSk7XG4gICAgICBhZGRTeW1ib2xUb05nTW9kdWxlTWV0YWRhdGEoXG4gICAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAgIHNvdXJjZUZpbGUuZmlsZU5hbWUsXG4gICAgICAgICdwcm92aWRlcnMnLFxuICAgICAgICBzeW1ib2xOYW1lLFxuICAgICAgICBudWxsLFxuICAgICAgKS5mb3JFYWNoKGNoYW5nZSA9PiB7XG4gICAgICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgICAgICByZWNvcmRlci5pbnNlcnRSaWdodChjaGFuZ2UucG9zLCBjaGFuZ2UudG9BZGQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgVHlwZVNjcmlwdCBzeW1ib2wgb2YgdGhlIHJvb3QgbW9kdWxlIGJ5IGxvb2tpbmcgZm9yIHRoZSBtb2R1bGVcbiAgICogYm9vdHN0cmFwIGV4cHJlc3Npb24gaW4gdGhlIHNwZWNpZmllZCBzb3VyY2UgZmlsZS5cbiAgICovXG4gIHByaXZhdGUgX2dldFJvb3RNb2R1bGVTeW1ib2wobWFpbkZpbGVQYXRoOiBQYXRoKTogdHMuU3ltYm9sIHwgbnVsbCB7XG4gICAgY29uc3QgbWFpbkZpbGUgPSB0aGlzLnByb2dyYW0uZ2V0U291cmNlRmlsZShtYWluRmlsZVBhdGgpO1xuICAgIGlmICghbWFpbkZpbGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGFwcE1vZHVsZUV4cHIgPSBmaW5kTWFpbk1vZHVsZUV4cHJlc3Npb24obWFpbkZpbGUpO1xuICAgIGlmICghYXBwTW9kdWxlRXhwcikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwTW9kdWxlU3ltYm9sID0gdGhpcy5fZ2V0RGVjbGFyYXRpb25TeW1ib2xPZk5vZGUodW53cmFwRXhwcmVzc2lvbihhcHBNb2R1bGVFeHByKSk7XG4gICAgaWYgKCFhcHBNb2R1bGVTeW1ib2wgfHwgIWFwcE1vZHVsZVN5bWJvbC52YWx1ZURlY2xhcmF0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGFwcE1vZHVsZVN5bWJvbDtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBcIkhhbW1lck1vZHVsZVwiIGluIHRoZSByb290IG1vZHVsZSBvZiB0aGUgY3VycmVudCBwcm9qZWN0LiAqL1xuICBwcml2YXRlIF9zZXR1cEhhbW1lck1vZHVsZUluUm9vdE1vZHVsZSgpIHtcbiAgICBjb25zdCB7cHJvamVjdH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3QgbWFpbkZpbGVQYXRoID0gZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpO1xuICAgIGNvbnN0IHJvb3RNb2R1bGVTeW1ib2wgPSB0aGlzLl9nZXRSb290TW9kdWxlU3ltYm9sKG1haW5GaWxlUGF0aCk7XG5cbiAgICBpZiAocm9vdE1vZHVsZVN5bWJvbCA9PT0gbnVsbCB8fCByb290TW9kdWxlU3ltYm9sLnZhbHVlRGVjbGFyYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5mYWlsdXJlcy5wdXNoKHtcbiAgICAgICAgZmlsZVBhdGg6IG1haW5GaWxlUGF0aCxcbiAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICBgQ291bGQgbm90IHNldHVwIEhhbW1lck1vZHVsZS4gUGxlYXNlIG1hbnVhbGx5IHNldCB1cCB0aGUgXCJIYW1tZXJNb2R1bGVcIiBgICtcbiAgICAgICAgICBgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5gLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlRmlsZSA9IHJvb3RNb2R1bGVTeW1ib2wudmFsdWVEZWNsYXJhdGlvbi5nZXRTb3VyY2VGaWxlKCk7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBnZXREZWNvcmF0b3JNZXRhZGF0YShcbiAgICAgIHNvdXJjZUZpbGUsXG4gICAgICAnTmdNb2R1bGUnLFxuICAgICAgJ0Bhbmd1bGFyL2NvcmUnLFxuICAgICkgYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb25bXTtcbiAgICBpZiAoIW1ldGFkYXRhLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydHNGaWVsZCA9IGdldE1ldGFkYXRhRmllbGQobWV0YWRhdGFbMF0sICdpbXBvcnRzJylbMF07XG4gICAgY29uc3QgaW1wb3J0SWRlbnRpZmllcnMgPSBpbXBvcnRzRmllbGRcbiAgICAgID8gZmluZE1hdGNoaW5nQ2hpbGROb2RlcyhpbXBvcnRzRmllbGQsIHRzLmlzSWRlbnRpZmllcilcbiAgICAgIDogbnVsbDtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpKTtcbiAgICBjb25zdCBoYW1tZXJNb2R1bGVFeHByID0gdGhpcy5faW1wb3J0TWFuYWdlci5hZGRJbXBvcnRUb1NvdXJjZUZpbGUoXG4gICAgICBzb3VyY2VGaWxlLFxuICAgICAgSEFNTUVSX01PRFVMRV9OQU1FLFxuICAgICAgSEFNTUVSX01PRFVMRV9JTVBPUlQsXG4gICAgKTtcblxuICAgIC8vIElmIHRoZSBcIkhhbW1lck1vZHVsZVwiIGlzIG5vdCBhbHJlYWR5IGltcG9ydGVkIGluIHRoZSBhcHAgbW9kdWxlLCB3ZSBzZXQgaXQgdXBcbiAgICAvLyBieSBhZGRpbmcgaXQgdG8gdGhlIFwiaW1wb3J0c1wiIGZpZWxkIG9mIHRoZSBhcHAgbW9kdWxlLlxuICAgIGlmIChcbiAgICAgICFpbXBvcnRJZGVudGlmaWVycyB8fFxuICAgICAgIXRoaXMuX2hhbW1lck1vZHVsZVJlZmVyZW5jZXMuc29tZShyID0+IGltcG9ydElkZW50aWZpZXJzLmluY2x1ZGVzKHIubm9kZSkpXG4gICAgKSB7XG4gICAgICBjb25zdCBzeW1ib2xOYW1lID0gdGhpcy5fcHJpbnROb2RlKGhhbW1lck1vZHVsZUV4cHIsIHNvdXJjZUZpbGUpO1xuICAgICAgYWRkU3ltYm9sVG9OZ01vZHVsZU1ldGFkYXRhKFxuICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgICAnaW1wb3J0cycsXG4gICAgICAgIHN5bWJvbE5hbWUsXG4gICAgICAgIG51bGwsXG4gICAgICApLmZvckVhY2goY2hhbmdlID0+IHtcbiAgICAgICAgaWYgKGNoYW5nZSBpbnN0YW5jZW9mIEluc2VydENoYW5nZSkge1xuICAgICAgICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGNoYW5nZS5wb3MsIGNoYW5nZS50b0FkZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBQcmludHMgYSBnaXZlbiBub2RlIHdpdGhpbiB0aGUgc3BlY2lmaWVkIHNvdXJjZSBmaWxlLiAqL1xuICBwcml2YXRlIF9wcmludE5vZGUobm9kZTogdHMuTm9kZSwgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBub2RlLCBzb3VyY2VGaWxlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCByZWZlcmVuY2VkIGdlc3R1cmUgY29uZmlnIGlkZW50aWZpZXJzIG9mIGEgZ2l2ZW4gc291cmNlIGZpbGUgKi9cbiAgcHJpdmF0ZSBfZ2V0R2VzdHVyZUNvbmZpZ0lkZW50aWZpZXJzT2ZGaWxlKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpOiB0cy5JZGVudGlmaWVyW10ge1xuICAgIHJldHVybiB0aGlzLl9nZXN0dXJlQ29uZmlnUmVmZXJlbmNlc1xuICAgICAgLmZpbHRlcihkID0+IGQubm9kZS5nZXRTb3VyY2VGaWxlKCkgPT09IHNvdXJjZUZpbGUpXG4gICAgICAubWFwKGQgPT4gZC5ub2RlKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBzeW1ib2wgdGhhdCBjb250YWlucyB0aGUgdmFsdWUgZGVjbGFyYXRpb24gb2YgdGhlIHNwZWNpZmllZCBub2RlLiAqL1xuICBwcml2YXRlIF9nZXREZWNsYXJhdGlvblN5bWJvbE9mTm9kZShub2RlOiB0cy5Ob2RlKTogdHMuU3ltYm9sIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBzeW1ib2wgPSB0aGlzLnR5cGVDaGVja2VyLmdldFN5bWJvbEF0TG9jYXRpb24obm9kZSk7XG5cbiAgICAvLyBTeW1ib2xzIGNhbiBiZSBhbGlhc2VzIG9mIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuIGUuZy4gaW4gbmFtZWQgaW1wb3J0IHNwZWNpZmllcnMuXG4gICAgLy8gV2UgbmVlZCB0byByZXNvbHZlIHRoZSBhbGlhc2VkIHN5bWJvbCBiYWNrIHRvIHRoZSBkZWNsYXJhdGlvbiBzeW1ib2wuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWJpdHdpc2VcbiAgICBpZiAoc3ltYm9sICYmIChzeW1ib2wuZmxhZ3MgJiB0cy5TeW1ib2xGbGFncy5BbGlhcykgIT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnR5cGVDaGVja2VyLmdldEFsaWFzZWRTeW1ib2woc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHN5bWJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gZXhwcmVzc2lvbiByZXNvbHZlcyB0byBhIGhhbW1lciBnZXN0dXJlIGNvbmZpZ1xuICAgKiB0b2tlbiByZWZlcmVuY2UgZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIi5cbiAgICovXG4gIHByaXZhdGUgX2lzUmVmZXJlbmNlVG9IYW1tZXJDb25maWdUb2tlbihleHByOiB0cy5FeHByZXNzaW9uKSB7XG4gICAgY29uc3QgdW53cmFwcGVkID0gdW53cmFwRXhwcmVzc2lvbihleHByKTtcbiAgICBpZiAodHMuaXNJZGVudGlmaWVyKHVud3JhcHBlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHIubm9kZSA9PT0gdW53cmFwcGVkKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKHVud3JhcHBlZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYW1tZXJDb25maWdUb2tlblJlZmVyZW5jZXMuc29tZShyID0+IHIubm9kZSA9PT0gdW53cmFwcGVkLm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBtaWdyYXRpb24gZmFpbHVyZXMgb2YgdGhlIGNvbGxlY3RlZCBub2RlIGZhaWx1cmVzLiBUaGUgcmV0dXJuZWQgbWlncmF0aW9uXG4gICAqIGZhaWx1cmVzIGFyZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIHBvc3QtbWlncmF0aW9uIHN0YXRlIG9mIHNvdXJjZSBmaWxlcy4gTWVhbmluZ1xuICAgKiB0aGF0IGZhaWx1cmUgcG9zaXRpb25zIGFyZSBjb3JyZWN0ZWQgaWYgc291cmNlIGZpbGUgbW9kaWZpY2F0aW9ucyBzaGlmdGVkIGxpbmVzLlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlTWlncmF0aW9uRmFpbHVyZXMoKTogTWlncmF0aW9uRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZUZhaWx1cmVzLm1hcCgoe25vZGUsIG1lc3NhZ2V9KSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gbm9kZS5nZXRTb3VyY2VGaWxlKCk7XG4gICAgICBjb25zdCBvZmZzZXQgPSBub2RlLmdldFN0YXJ0KCk7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKHNvdXJjZUZpbGUsIG5vZGUuZ2V0U3RhcnQoKSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbjogdGhpcy5faW1wb3J0TWFuYWdlci5jb3JyZWN0Tm9kZVBvc2l0aW9uKG5vZGUsIG9mZnNldCwgcG9zaXRpb24pLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICBmaWxlUGF0aDogdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoc291cmNlRmlsZS5maWxlTmFtZSksXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEdsb2JhbCBzdGF0ZSBvZiB3aGV0aGVyIEhhbW1lciBpcyB1c2VkIGluIGFueSBhbmFseXplZCBwcm9qZWN0IHRhcmdldC4gKi9cbiAgc3RhdGljIGdsb2JhbFVzZXNIYW1tZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogU3RhdGljIG1pZ3JhdGlvbiBydWxlIG1ldGhvZCB0aGF0IHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIHByb2plY3QgdGFyZ2V0c1xuICAgKiBoYXZlIGJlZW4gbWlncmF0ZWQgaW5kaXZpZHVhbGx5LiBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCB0byBtYWtlIGNoYW5nZXMgYmFzZWRcbiAgICogb24gdGhlIGFuYWx5c2lzIG9mIHRoZSBpbmRpdmlkdWFsIHRhcmdldHMuIEZvciBleGFtcGxlOiB3ZSBvbmx5IHJlbW92ZSBIYW1tZXJcbiAgICogZnJvbSB0aGUgXCJwYWNrYWdlLmpzb25cIiBpZiBpdCBpcyBub3QgdXNlZCBpbiAqYW55KiBwcm9qZWN0IHRhcmdldC5cbiAgICovXG4gIHN0YXRpYyBvdmVycmlkZSBnbG9iYWxQb3N0TWlncmF0aW9uKFxuICAgIHRyZWU6IFRyZWUsXG4gICAgdGFyZ2V0OiBUYXJnZXRWZXJzaW9uLFxuICAgIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQsXG4gICk6IFBvc3RNaWdyYXRpb25BY3Rpb24ge1xuICAgIC8vIFNraXAgcHJpbnRpbmcgYW55IGdsb2JhbCBtZXNzYWdlcyB3aGVuIHRoZSB0YXJnZXQgdmVyc2lvbiBpcyBub3QgYWxsb3dlZC5cbiAgICBpZiAoIXRoaXMuX2lzQWxsb3dlZFZlcnNpb24odGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEFsd2F5cyBub3RpZnkgdGhlIGRldmVsb3BlciB0aGF0IHRoZSBIYW1tZXIgdjkgbWlncmF0aW9uIGRvZXMgbm90IG1pZ3JhdGUgdGVzdHMuXG4gICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICdcXG7imqAgIEdlbmVyYWwgbm90aWNlOiBUaGUgSGFtbWVySlMgdjkgbWlncmF0aW9uIGZvciBBbmd1bGFyIENvbXBvbmVudHMgaXMgbm90IGFibGUgdG8gJyArXG4gICAgICAgICdtaWdyYXRlIHRlc3RzLiBQbGVhc2UgbWFudWFsbHkgY2xlYW4gdXAgdGVzdHMgaW4geW91ciBwcm9qZWN0IGlmIHRoZXkgcmVseSBvbiAnICtcbiAgICAgICAgKHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA/ICd0aGUgZGVwcmVjYXRlZCBBbmd1bGFyIE1hdGVyaWFsIGdlc3R1cmUgY29uZmlnLicgOiAnSGFtbWVySlMuJyksXG4gICAgKTtcbiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKFxuICAgICAgJ1JlYWQgbW9yZSBhYm91dCBtaWdyYXRpbmcgdGVzdHM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvYmxvYi8zYTIwNGRhMzdmZDEzNjZjYWU0MTFiNWMyMzQ1MTdlY2FkMTk5NzM3L2d1aWRlcy92OS1oYW1tZXJqcy1taWdyYXRpb24ubWQjaG93LXRvLW1pZ3JhdGUtbXktdGVzdHMnLFxuICAgICk7XG5cbiAgICBpZiAoIXRoaXMuZ2xvYmFsVXNlc0hhbW1lciAmJiB0aGlzLl9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZSkpIHtcbiAgICAgIC8vIFNpbmNlIEhhbW1lciBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiIGZpbGUsXG4gICAgICAvLyB3ZSBzY2hlZHVsZSBhIG5vZGUgcGFja2FnZSBpbnN0YWxsIHRhc2sgdG8gcmVmcmVzaCB0aGUgbG9jayBmaWxlLlxuICAgICAgcmV0dXJuIHtydW5QYWNrYWdlTWFuYWdlcjogdHJ1ZX07XG4gICAgfVxuXG4gICAgLy8gQ2xlYW4gZ2xvYmFsIHN0YXRlIG9uY2UgdGhlIHdvcmtzcGFjZSBoYXMgYmVlbiBtaWdyYXRlZC4gVGhpcyBpcyB0ZWNobmljYWxseVxuICAgIC8vIG5vdCBuZWNlc3NhcnkgaW4gXCJuZyB1cGRhdGVcIiwgYnV0IGluIHRlc3RzIHdlIHJlLXVzZSB0aGUgc2FtZSBydWxlIGNsYXNzLlxuICAgIHRoaXMuZ2xvYmFsVXNlc0hhbW1lciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGhhbW1lciBwYWNrYWdlIGZyb20gdGhlIHdvcmtzcGFjZSBcInBhY2thZ2UuanNvblwiLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIEhhbW1lciB3YXMgc2V0IHVwIGFuZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIFwicGFja2FnZS5qc29uXCJcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIF9yZW1vdmVIYW1tZXJGcm9tUGFja2FnZUpzb24odHJlZTogVHJlZSk6IGJvb2xlYW4ge1xuICAgIGlmICghdHJlZS5leGlzdHMoJy9wYWNrYWdlLmpzb24nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWQoJy9wYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0ZjgnKSkgYXMgUGFja2FnZUpzb247XG5cbiAgICAvLyBXZSBkbyBub3QgaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHNvbWVvbmUgbWFudWFsbHkgYWRkZWQgXCJoYW1tZXJqc1wiIHRvIHRoZSBkZXYgZGVwZW5kZW5jaWVzLlxuICAgIGlmIChwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMgJiYgcGFja2FnZUpzb24uZGVwZW5kZW5jaWVzW0hBTU1FUl9NT0RVTEVfU1BFQ0lGSUVSXSkge1xuICAgICAgZGVsZXRlIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tIQU1NRVJfTU9EVUxFX1NQRUNJRklFUl07XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgbWlncmF0aW9uIGlzIGFsbG93ZWQgdG8gcnVuIGZvciBzcGVjaWZpZWQgdGFyZ2V0IHZlcnNpb24uICovXG4gIHByaXZhdGUgc3RhdGljIF9pc0FsbG93ZWRWZXJzaW9uKHRhcmdldDogVGFyZ2V0VmVyc2lvbikge1xuICAgIC8vIFRoaXMgbWlncmF0aW9uIGlzIG9ubHkgYWxsb3dlZCB0byBydW4gZm9yIHY5IG9yIHYxMCB0YXJnZXQgdmVyc2lvbnMuXG4gICAgcmV0dXJuIHRhcmdldCA9PT0gVGFyZ2V0VmVyc2lvbi5WOSB8fCB0YXJnZXQgPT09IFRhcmdldFZlcnNpb24uVjEwO1xuICB9XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgdW53cmFwcyBhIGdpdmVuIGV4cHJlc3Npb24gaWYgaXQgaXMgd3JhcHBlZFxuICogYnkgcGFyZW50aGVzaXMsIHR5cGUgY2FzdHMgb3IgdHlwZSBhc3NlcnRpb25zLlxuICovXG5mdW5jdGlvbiB1bndyYXBFeHByZXNzaW9uKG5vZGU6IHRzLk5vZGUpOiB0cy5Ob2RlIHtcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9IGVsc2UgaWYgKHRzLmlzQXNFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgcmV0dXJuIHVud3JhcEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKTtcbiAgfSBlbHNlIGlmICh0cy5pc1R5cGVBc3NlcnRpb24obm9kZSkpIHtcbiAgICByZXR1cm4gdW53cmFwRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBzcGVjaWZpZWQgcGF0aCB0byBhIHZhbGlkIFR5cGVTY3JpcHQgbW9kdWxlIHNwZWNpZmllciB3aGljaCBpc1xuICogcmVsYXRpdmUgdG8gdGhlIGdpdmVuIGNvbnRhaW5pbmcgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0TW9kdWxlU3BlY2lmaWVyKG5ld1BhdGg6IFBhdGgsIGNvbnRhaW5pbmdGaWxlOiBQYXRoKSB7XG4gIGxldCByZXN1bHQgPSByZWxhdGl2ZShkaXJuYW1lKGNvbnRhaW5pbmdGaWxlKSwgbmV3UGF0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL1xcLnRzJC8sICcnKTtcbiAgaWYgKCFyZXN1bHQuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgcmVzdWx0ID0gYC4vJHtyZXN1bHR9YDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHRleHQgb2YgdGhlIGdpdmVuIHByb3BlcnR5IG5hbWUuXG4gKiBAcmV0dXJucyBUZXh0IG9mIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lLiBOdWxsIGlmIG5vdCBzdGF0aWNhbGx5IGFuYWx5emFibGUuXG4gKi9cbmZ1bmN0aW9uIGdldFByb3BlcnR5TmFtZVRleHQobm9kZTogdHMuUHJvcGVydHlOYW1lKTogc3RyaW5nIHwgbnVsbCB7XG4gIGlmICh0cy5pc0lkZW50aWZpZXIobm9kZSkgfHwgdHMuaXNTdHJpbmdMaXRlcmFsTGlrZShub2RlKSkge1xuICAgIHJldHVybiBub2RlLnRleHQ7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gaWRlbnRpZmllciBpcyBwYXJ0IG9mIGEgbmFtZXNwYWNlZCBhY2Nlc3MuICovXG5mdW5jdGlvbiBpc05hbWVzcGFjZWRJZGVudGlmaWVyQWNjZXNzKG5vZGU6IHRzLklkZW50aWZpZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIHRzLmlzUXVhbGlmaWVkTmFtZShub2RlLnBhcmVudCkgfHwgdHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZS5wYXJlbnQpO1xufVxuXG4vKipcbiAqIFdhbGtzIHRocm91Z2ggdGhlIHNwZWNpZmllZCBub2RlIGFuZCByZXR1cm5zIGFsbCBjaGlsZCBub2RlcyB3aGljaCBtYXRjaCB0aGVcbiAqIGdpdmVuIHByZWRpY2F0ZS5cbiAqL1xuZnVuY3Rpb24gZmluZE1hdGNoaW5nQ2hpbGROb2RlczxUIGV4dGVuZHMgdHMuTm9kZT4oXG4gIHBhcmVudDogdHMuTm9kZSxcbiAgcHJlZGljYXRlOiAobm9kZTogdHMuTm9kZSkgPT4gbm9kZSBpcyBULFxuKTogVFtdIHtcbiAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgY29uc3QgdmlzaXROb2RlID0gKG5vZGU6IHRzLk5vZGUpID0+IHtcbiAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICByZXN1bHQucHVzaChub2RlKTtcbiAgICB9XG4gICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZSk7XG4gIH07XG4gIHRzLmZvckVhY2hDaGlsZChwYXJlbnQsIHZpc2l0Tm9kZSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=