"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProject = void 0;
const ts = require("typescript");
const component_resource_collector_1 = require("./component-resource-collector");
const logger_1 = require("./logger");
const parse_tsconfig_1 = require("./utils/parse-tsconfig");
const virtual_host_1 = require("./utils/virtual-host");
/**
 * An update project that can be run against individual migrations. An update project
 * accepts a TypeScript program and a context that is provided to all migrations. The
 * context is usually not used by migrations, but in some cases migrations rely on
 * specifics from the tool that performs the update (e.g. the Angular CLI). In those cases,
 * the context can provide the necessary specifics to the migrations in a type-safe way.
 */
class UpdateProject {
    constructor(
    /** Context provided to all migrations. */
    _context, 
    /** TypeScript program using workspace paths. */
    _program, 
    /** File system used for reading, writing and editing files. */
    _fileSystem, 
    /**
     * Set of analyzed files. Used for avoiding multiple migration runs if
     * files overlap between targets.
     */
    _analyzedFiles = new Set(), 
    /** Logger used for printing messages. */
    _logger = logger_1.defaultLogger) {
        this._context = _context;
        this._program = _program;
        this._fileSystem = _fileSystem;
        this._analyzedFiles = _analyzedFiles;
        this._logger = _logger;
        this._typeChecker = this._program.getTypeChecker();
    }
    /**
     * Migrates the project to the specified target version.
     * @param migrationTypes Migrations that should be run.
     * @param target Version the project should be updated to.
     * @param data Upgrade data that is passed to all migration rules.
     * @param additionalStylesheetPaths Additional stylesheets that should be migrated, if not
     *   referenced in an Angular component. This is helpful for global stylesheets in a project.
     */
    migrate(migrationTypes, target, data, additionalStylesheetPaths) {
        // Create instances of the specified migrations.
        const migrations = this._createMigrations(migrationTypes, target, data);
        // Creates the component resource collector. The collector can visit arbitrary
        // TypeScript nodes and will find Angular component resources. Resources include
        // templates and stylesheets. It also captures inline stylesheets and templates.
        const resourceCollector = new component_resource_collector_1.ComponentResourceCollector(this._typeChecker, this._fileSystem);
        // Collect all of the TypeScript source files we want to migrate. We don't
        // migrate type definition files, or source files from external libraries.
        const sourceFiles = this._program
            .getSourceFiles()
            .filter(f => !f.isDeclarationFile && !this._program.isSourceFileFromExternalLibrary(f));
        // Helper function that visits a given TypeScript node and collects all referenced
        // component resources (i.e. stylesheets or templates). Additionally, the helper
        // visits the node in each instantiated migration.
        const visitNodeAndCollectResources = (node) => {
            migrations.forEach(r => r.visitNode(node));
            ts.forEachChild(node, visitNodeAndCollectResources);
            resourceCollector.visitNode(node);
        };
        // Walk through all source file, if it has not been visited before, and
        // visit found nodes while collecting potential resources.
        sourceFiles.forEach(sourceFile => {
            const resolvedPath = this._fileSystem.resolve(sourceFile.fileName);
            // Do not visit source files which have been checked as part of a
            // previously migrated TypeScript project.
            if (!this._analyzedFiles.has(resolvedPath)) {
                visitNodeAndCollectResources(sourceFile);
                this._analyzedFiles.add(resolvedPath);
            }
        });
        // Walk through all resolved templates and visit them in each instantiated
        // migration. Note that this can only happen after source files have been
        // visited because we find templates through the TypeScript source files.
        resourceCollector.resolvedTemplates.forEach(template => {
            // Do not visit the template if it has been checked before. Inline
            // templates cannot be referenced multiple times.
            if (template.inline || !this._analyzedFiles.has(template.filePath)) {
                migrations.forEach(m => m.visitTemplate(template));
                this._analyzedFiles.add(template.filePath);
            }
        });
        // Walk through all resolved stylesheets and visit them in each instantiated
        // migration. Note that this can only happen after source files have been
        // visited because we find stylesheets through the TypeScript source files.
        resourceCollector.resolvedStylesheets.forEach(stylesheet => {
            // Do not visit the stylesheet if it has been checked before. Inline
            // stylesheets cannot be referenced multiple times.
            if (stylesheet.inline || !this._analyzedFiles.has(stylesheet.filePath)) {
                migrations.forEach(r => r.visitStylesheet(stylesheet));
                this._analyzedFiles.add(stylesheet.filePath);
            }
        });
        // In some applications, developers will have global stylesheets which are not
        // specified in any Angular component. Therefore we allow for additional stylesheets
        // being specified. We visit them in each migration unless they have been already
        // discovered before as actual component resource.
        if (additionalStylesheetPaths) {
            additionalStylesheetPaths.forEach(filePath => {
                const resolvedPath = this._fileSystem.resolve(filePath);
                const stylesheet = resourceCollector.resolveExternalStylesheet(resolvedPath, null);
                // Do not visit stylesheets which have been referenced from a component.
                if (!this._analyzedFiles.has(resolvedPath) && stylesheet) {
                    migrations.forEach(r => r.visitStylesheet(stylesheet));
                    this._analyzedFiles.add(resolvedPath);
                }
            });
        }
        // Call the "postAnalysis" method for each migration.
        migrations.forEach(r => r.postAnalysis());
        // Collect all failures reported by individual migrations.
        const failures = migrations.reduce((res, m) => res.concat(m.failures), []);
        // In case there are failures, print these to the CLI logger as warnings.
        if (failures.length) {
            failures.forEach(({ filePath, message, position }) => {
                const lineAndCharacter = position ? `@${position.line + 1}:${position.character + 1}` : '';
                this._logger.warn(`${filePath}${lineAndCharacter} - ${message}`);
            });
        }
        return {
            hasFailures: !!failures.length,
        };
    }
    /**
     * Creates instances of the given migrations with the specified target
     * version and data.
     */
    _createMigrations(types, target, data) {
        const result = [];
        for (const ctor of types) {
            const instance = new ctor(this._program, this._typeChecker, target, this._context, data, this._fileSystem, this._logger);
            instance.init();
            if (instance.enabled) {
                result.push(instance);
            }
        }
        return result;
    }
    /**
     * Creates a program form the specified tsconfig and patches the host
     * to read files and directories through the given file system.
     */
    static createProgramFromTsconfig(tsconfigPath, fs) {
        const parsed = (0, parse_tsconfig_1.parseTsconfigFile)(fs.resolve(tsconfigPath), fs);
        const host = (0, virtual_host_1.createFileSystemCompilerHost)(parsed.options, fs);
        return ts.createProgram(parsed.fileNames, parsed.options, host);
    }
}
exports.UpdateProject = UpdateProject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXBkYXRlLXRvb2wvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsaUNBQWlDO0FBRWpDLGlGQUEwRTtBQUUxRSxxQ0FBcUQ7QUFHckQsMkRBQXlEO0FBQ3pELHVEQUFrRTtBQUVsRTs7Ozs7O0dBTUc7QUFDSCxNQUFhLGFBQWE7SUFHeEI7SUFDRSwwQ0FBMEM7SUFDbEMsUUFBaUI7SUFDekIsZ0RBQWdEO0lBQ3hDLFFBQW9CO0lBQzVCLCtEQUErRDtJQUN2RCxXQUF1QjtJQUMvQjs7O09BR0c7SUFDSyxpQkFBcUMsSUFBSSxHQUFHLEVBQUU7SUFDdEQseUNBQXlDO0lBQ2pDLFVBQXdCLHNCQUFhO1FBWHJDLGFBQVEsR0FBUixRQUFRLENBQVM7UUFFakIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUVwQixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUt2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0M7UUFFOUMsWUFBTyxHQUFQLE9BQU8sQ0FBOEI7UUFmOUIsaUJBQVksR0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQWdCNUUsQ0FBQztJQUVKOzs7Ozs7O09BT0c7SUFDSCxPQUFPLENBQ0wsY0FBOEMsRUFDOUMsTUFBcUIsRUFDckIsSUFBVSxFQUNWLHlCQUFvQztRQUVwQyxnREFBZ0Q7UUFDaEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEUsOEVBQThFO1FBQzlFLGdGQUFnRjtRQUNoRixnRkFBZ0Y7UUFDaEYsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLHlEQUEwQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzlG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bGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7Q29tcG9uZW50UmVzb3VyY2VDb2xsZWN0b3J9IGZyb20gJy4vY29tcG9uZW50LXJlc291cmNlLWNvbGxlY3Rvcic7XG5pbXBvcnQge0ZpbGVTeXN0ZW0sIFdvcmtzcGFjZVBhdGh9IGZyb20gJy4vZmlsZS1zeXN0ZW0nO1xuaW1wb3J0IHtkZWZhdWx0TG9nZ2VyLCBVcGRhdGVMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7TWlncmF0aW9uLCBNaWdyYXRpb25DdG9yLCBNaWdyYXRpb25GYWlsdXJlfSBmcm9tICcuL21pZ3JhdGlvbic7XG5pbXBvcnQge1RhcmdldFZlcnNpb259IGZyb20gJy4vdGFyZ2V0LXZlcnNpb24nO1xuaW1wb3J0IHtwYXJzZVRzY29uZmlnRmlsZX0gZnJvbSAnLi91dGlscy9wYXJzZS10c2NvbmZpZyc7XG5pbXBvcnQge2NyZWF0ZUZpbGVTeXN0ZW1Db21waWxlckhvc3R9IGZyb20gJy4vdXRpbHMvdmlydHVhbC1ob3N0JztcblxuLyoqXG4gKiBBbiB1cGRhdGUgcHJvamVjdCB0aGF0IGNhbiBiZSBydW4gYWdhaW5zdCBpbmRpdmlkdWFsIG1pZ3JhdGlvbnMuIEFuIHVwZGF0ZSBwcm9qZWN0XG4gKiBhY2NlcHRzIGEgVHlwZVNjcmlwdCBwcm9ncmFtIGFuZCBhIGNvbnRleHQgdGhhdCBpcyBwcm92aWRlZCB0byBhbGwgbWlncmF0aW9ucy4gVGhlXG4gKiBjb250ZXh0IGlzIHVzdWFsbHkgbm90IHVzZWQgYnkgbWlncmF0aW9ucywgYnV0IGluIHNvbWUgY2FzZXMgbWlncmF0aW9ucyByZWx5IG9uXG4gKiBzcGVjaWZpY3MgZnJvbSB0aGUgdG9vbCB0aGF0IHBlcmZvcm1zIHRoZSB1cGRhdGUgKGUuZy4gdGhlIEFuZ3VsYXIgQ0xJKS4gSW4gdGhvc2UgY2FzZXMsXG4gKiB0aGUgY29udGV4dCBjYW4gcHJvdmlkZSB0aGUgbmVjZXNzYXJ5IHNwZWNpZmljcyB0byB0aGUgbWlncmF0aW9ucyBpbiBhIHR5cGUtc2FmZSB3YXkuXG4gKi9cbmV4cG9ydCBjbGFzcyBVcGRhdGVQcm9qZWN0PENvbnRleHQ+IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyID0gdGhpcy5fcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBDb250ZXh0IHByb3ZpZGVkIHRvIGFsbCBtaWdyYXRpb25zLiAqL1xuICAgIHByaXZhdGUgX2NvbnRleHQ6IENvbnRleHQsXG4gICAgLyoqIFR5cGVTY3JpcHQgcHJvZ3JhbSB1c2luZyB3b3Jrc3BhY2UgcGF0aHMuICovXG4gICAgcHJpdmF0ZSBfcHJvZ3JhbTogdHMuUHJvZ3JhbSxcbiAgICAvKiogRmlsZSBzeXN0ZW0gdXNlZCBmb3IgcmVhZGluZywgd3JpdGluZyBhbmQgZWRpdGluZyBmaWxlcy4gKi9cbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBGaWxlU3lzdGVtLFxuICAgIC8qKlxuICAgICAqIFNldCBvZiBhbmFseXplZCBmaWxlcy4gVXNlZCBmb3IgYXZvaWRpbmcgbXVsdGlwbGUgbWlncmF0aW9uIHJ1bnMgaWZcbiAgICAgKiBmaWxlcyBvdmVybGFwIGJldHdlZW4gdGFyZ2V0cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9hbmFseXplZEZpbGVzOiBTZXQ8V29ya3NwYWNlUGF0aD4gPSBuZXcgU2V0KCksXG4gICAgLyoqIExvZ2dlciB1c2VkIGZvciBwcmludGluZyBtZXNzYWdlcy4gKi9cbiAgICBwcml2YXRlIF9sb2dnZXI6IFVwZGF0ZUxvZ2dlciA9IGRlZmF1bHRMb2dnZXIsXG4gICkge31cblxuICAvKipcbiAgICogTWlncmF0ZXMgdGhlIHByb2plY3QgdG8gdGhlIHNwZWNpZmllZCB0YXJnZXQgdmVyc2lvbi5cbiAgICogQHBhcmFtIG1pZ3JhdGlvblR5cGVzIE1pZ3JhdGlvbnMgdGhhdCBzaG91bGQgYmUgcnVuLlxuICAgKiBAcGFyYW0gdGFyZ2V0IFZlcnNpb24gdGhlIHByb2plY3Qgc2hvdWxkIGJlIHVwZGF0ZWQgdG8uXG4gICAqIEBwYXJhbSBkYXRhIFVwZ3JhZGUgZGF0YSB0aGF0IGlzIHBhc3NlZCB0byBhbGwgbWlncmF0aW9uIHJ1bGVzLlxuICAgKiBAcGFyYW0gYWRkaXRpb25hbFN0eWxlc2hlZXRQYXRocyBBZGRpdGlvbmFsIHN0eWxlc2hlZXRzIHRoYXQgc2hvdWxkIGJlIG1pZ3JhdGVkLCBpZiBub3RcbiAgICogICByZWZlcmVuY2VkIGluIGFuIEFuZ3VsYXIgY29tcG9uZW50LiBUaGlzIGlzIGhlbHBmdWwgZm9yIGdsb2JhbCBzdHlsZXNoZWV0cyBpbiBhIHByb2plY3QuXG4gICAqL1xuICBtaWdyYXRlPERhdGE+KFxuICAgIG1pZ3JhdGlvblR5cGVzOiBNaWdyYXRpb25DdG9yPERhdGEsIENvbnRleHQ+W10sXG4gICAgdGFyZ2V0OiBUYXJnZXRWZXJzaW9uLFxuICAgIGRhdGE6IERhdGEsXG4gICAgYWRkaXRpb25hbFN0eWxlc2hlZXRQYXRocz86IHN0cmluZ1tdLFxuICApOiB7aGFzRmFpbHVyZXM6IGJvb2xlYW59IHtcbiAgICAvLyBDcmVhdGUgaW5zdGFuY2VzIG9mIHRoZSBzcGVjaWZpZWQgbWlncmF0aW9ucy5cbiAgICBjb25zdCBtaWdyYXRpb25zID0gdGhpcy5fY3JlYXRlTWlncmF0aW9ucyhtaWdyYXRpb25UeXBlcywgdGFyZ2V0LCBkYXRhKTtcbiAgICAvLyBDcmVhdGVzIHRoZSBjb21wb25lbnQgcmVzb3VyY2UgY29sbGVjdG9yLiBUaGUgY29sbGVjdG9yIGNhbiB2aXNpdCBhcmJpdHJhcnlcbiAgICAvLyBUeXBlU2NyaXB0IG5vZGVzIGFuZCB3aWxsIGZpbmQgQW5ndWxhciBjb21wb25lbnQgcmVzb3VyY2VzLiBSZXNvdXJjZXMgaW5jbHVkZVxuICAgIC8vIHRlbXBsYXRlcyBhbmQgc3R5bGVzaGVldHMuIEl0IGFsc28gY2FwdHVyZXMgaW5saW5lIHN0eWxlc2hlZXRzIGFuZCB0ZW1wbGF0ZXMuXG4gICAgY29uc3QgcmVzb3VyY2VDb2xsZWN0b3IgPSBuZXcgQ29tcG9uZW50UmVzb3VyY2VDb2xsZWN0b3IodGhpcy5fdHlwZUNoZWNrZXIsIHRoaXMuX2ZpbGVTeXN0ZW0pO1xuICAgIC8vIENvbGxlY3QgYWxsIG9mIHRoZSBUeXBlU2NyaXB0IHNvdXJjZSBmaWxlcyB3ZSB3YW50IHRvIG1pZ3JhdGUuIFdlIGRvbid0XG4gICAgLy8gbWlncmF0ZSB0eXBlIGRlZmluaXRpb24gZmlsZXMsIG9yIHNvdXJjZSBmaWxlcyBmcm9tIGV4dGVybmFsIGxpYnJhcmllcy5cbiAgICBjb25zdCBzb3VyY2VGaWxlcyA9IHRoaXMuX3Byb2dyYW1cbiAgICAgIC5nZXRTb3VyY2VGaWxlcygpXG4gICAgICAuZmlsdGVyKGYgPT4gIWYuaXNEZWNsYXJhdGlvbkZpbGUgJiYgIXRoaXMuX3Byb2dyYW0uaXNTb3VyY2VGaWxlRnJvbUV4dGVybmFsTGlicmFyeShmKSk7XG5cbiAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdGhhdCB2aXNpdHMgYSBnaXZlbiBUeXBlU2NyaXB0IG5vZGUgYW5kIGNvbGxlY3RzIGFsbCByZWZlcmVuY2VkXG4gICAgLy8gY29tcG9uZW50IHJlc291cmNlcyAoaS5lLiBzdHlsZXNoZWV0cyBvciB0ZW1wbGF0ZXMpLiBBZGRpdGlvbmFsbHksIHRoZSBoZWxwZXJcbiAgICAvLyB2aXNpdHMgdGhlIG5vZGUgaW4gZWFjaCBpbnN0YW50aWF0ZWQgbWlncmF0aW9uLlxuICAgIGNvbnN0IHZpc2l0Tm9kZUFuZENvbGxlY3RSZXNvdXJjZXMgPSAobm9kZTogdHMuTm9kZSkgPT4ge1xuICAgICAgbWlncmF0aW9ucy5mb3JFYWNoKHIgPT4gci52aXNpdE5vZGUobm9kZSkpO1xuICAgICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIHZpc2l0Tm9kZUFuZENvbGxlY3RSZXNvdXJjZXMpO1xuICAgICAgcmVzb3VyY2VDb2xsZWN0b3IudmlzaXROb2RlKG5vZGUpO1xuICAgIH07XG5cbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIHNvdXJjZSBmaWxlLCBpZiBpdCBoYXMgbm90IGJlZW4gdmlzaXRlZCBiZWZvcmUsIGFuZFxuICAgIC8vIHZpc2l0IGZvdW5kIG5vZGVzIHdoaWxlIGNvbGxlY3RpbmcgcG90ZW50aWFsIHJlc291cmNlcy5cbiAgICBzb3VyY2VGaWxlcy5mb3JFYWNoKHNvdXJjZUZpbGUgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gdGhpcy5fZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpO1xuICAgICAgLy8gRG8gbm90IHZpc2l0IHNvdXJjZSBmaWxlcyB3aGljaCBoYXZlIGJlZW4gY2hlY2tlZCBhcyBwYXJ0IG9mIGFcbiAgICAgIC8vIHByZXZpb3VzbHkgbWlncmF0ZWQgVHlwZVNjcmlwdCBwcm9qZWN0LlxuICAgICAgaWYgKCF0aGlzLl9hbmFseXplZEZpbGVzLmhhcyhyZXNvbHZlZFBhdGgpKSB7XG4gICAgICAgIHZpc2l0Tm9kZUFuZENvbGxlY3RSZXNvdXJjZXMoc291cmNlRmlsZSk7XG4gICAgICAgIHRoaXMuX2FuYWx5emVkRmlsZXMuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBXYWxrIHRocm91Z2ggYWxsIHJlc29sdmVkIHRlbXBsYXRlcyBhbmQgdmlzaXQgdGhlbSBpbiBlYWNoIGluc3RhbnRpYXRlZFxuICAgIC8vIG1pZ3JhdGlvbi4gTm90ZSB0aGF0IHRoaXMgY2FuIG9ubHkgaGFwcGVuIGFmdGVyIHNvdXJjZSBmaWxlcyBoYXZlIGJlZW5cbiAgICAvLyB2aXNpdGVkIGJlY2F1c2Ugd2UgZmluZCB0ZW1wbGF0ZXMgdGhyb3VnaCB0aGUgVHlwZVNjcmlwdCBzb3VyY2UgZmlsZXMuXG4gICAgcmVzb3VyY2VDb2xsZWN0b3IucmVzb2x2ZWRUZW1wbGF0ZXMuZm9yRWFjaCh0ZW1wbGF0ZSA9PiB7XG4gICAgICAvLyBEbyBub3QgdmlzaXQgdGhlIHRlbXBsYXRlIGlmIGl0IGhhcyBiZWVuIGNoZWNrZWQgYmVmb3JlLiBJbmxpbmVcbiAgICAgIC8vIHRlbXBsYXRlcyBjYW5ub3QgYmUgcmVmZXJlbmNlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIGlmICh0ZW1wbGF0ZS5pbmxpbmUgfHwgIXRoaXMuX2FuYWx5emVkRmlsZXMuaGFzKHRlbXBsYXRlLmZpbGVQYXRoKSkge1xuICAgICAgICBtaWdyYXRpb25zLmZvckVhY2gobSA9PiBtLnZpc2l0VGVtcGxhdGUodGVtcGxhdGUpKTtcbiAgICAgICAgdGhpcy5fYW5hbHl6ZWRGaWxlcy5hZGQodGVtcGxhdGUuZmlsZVBhdGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gV2FsayB0aHJvdWdoIGFsbCByZXNvbHZlZCBzdHlsZXNoZWV0cyBhbmQgdmlzaXQgdGhlbSBpbiBlYWNoIGluc3RhbnRpYXRlZFxuICAgIC8vIG1pZ3JhdGlvbi4gTm90ZSB0aGF0IHRoaXMgY2FuIG9ubHkgaGFwcGVuIGFmdGVyIHNvdXJjZSBmaWxlcyBoYXZlIGJlZW5cbiAgICAvLyB2aXNpdGVkIGJlY2F1c2Ugd2UgZmluZCBzdHlsZXNoZWV0cyB0aHJvdWdoIHRoZSBUeXBlU2NyaXB0IHNvdXJjZSBmaWxlcy5cbiAgICByZXNvdXJjZUNvbGxlY3Rvci5yZXNvbHZlZFN0eWxlc2hlZXRzLmZvckVhY2goc3R5bGVzaGVldCA9PiB7XG4gICAgICAvLyBEbyBub3QgdmlzaXQgdGhlIHN0eWxlc2hlZXQgaWYgaXQgaGFzIGJlZW4gY2hlY2tlZCBiZWZvcmUuIElubGluZVxuICAgICAgLy8gc3R5bGVzaGVldHMgY2Fubm90IGJlIHJlZmVyZW5jZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICBpZiAoc3R5bGVzaGVldC5pbmxpbmUgfHwgIXRoaXMuX2FuYWx5emVkRmlsZXMuaGFzKHN0eWxlc2hlZXQuZmlsZVBhdGgpKSB7XG4gICAgICAgIG1pZ3JhdGlvbnMuZm9yRWFjaChyID0+IHIudmlzaXRTdHlsZXNoZWV0KHN0eWxlc2hlZXQpKTtcbiAgICAgICAgdGhpcy5fYW5hbHl6ZWRGaWxlcy5hZGQoc3R5bGVzaGVldC5maWxlUGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBJbiBzb21lIGFwcGxpY2F0aW9ucywgZGV2ZWxvcGVycyB3aWxsIGhhdmUgZ2xvYmFsIHN0eWxlc2hlZXRzIHdoaWNoIGFyZSBub3RcbiAgICAvLyBzcGVjaWZpZWQgaW4gYW55IEFuZ3VsYXIgY29tcG9uZW50LiBUaGVyZWZvcmUgd2UgYWxsb3cgZm9yIGFkZGl0aW9uYWwgc3R5bGVzaGVldHNcbiAgICAvLyBiZWluZyBzcGVjaWZpZWQuIFdlIHZpc2l0IHRoZW0gaW4gZWFjaCBtaWdyYXRpb24gdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIGFscmVhZHlcbiAgICAvLyBkaXNjb3ZlcmVkIGJlZm9yZSBhcyBhY3R1YWwgY29tcG9uZW50IHJlc291cmNlLlxuICAgIGlmIChhZGRpdGlvbmFsU3R5bGVzaGVldFBhdGhzKSB7XG4gICAgICBhZGRpdGlvbmFsU3R5bGVzaGVldFBhdGhzLmZvckVhY2goZmlsZVBhdGggPT4ge1xuICAgICAgICBjb25zdCByZXNvbHZlZFBhdGggPSB0aGlzLl9maWxlU3lzdGVtLnJlc29sdmUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCBzdHlsZXNoZWV0ID0gcmVzb3VyY2VDb2xsZWN0b3IucmVzb2x2ZUV4dGVybmFsU3R5bGVzaGVldChyZXNvbHZlZFBhdGgsIG51bGwpO1xuICAgICAgICAvLyBEbyBub3QgdmlzaXQgc3R5bGVzaGVldHMgd2hpY2ggaGF2ZSBiZWVuIHJlZmVyZW5jZWQgZnJvbSBhIGNvbXBvbmVudC5cbiAgICAgICAgaWYgKCF0aGlzLl9hbmFseXplZEZpbGVzLmhhcyhyZXNvbHZlZFBhdGgpICYmIHN0eWxlc2hlZXQpIHtcbiAgICAgICAgICBtaWdyYXRpb25zLmZvckVhY2gociA9PiByLnZpc2l0U3R5bGVzaGVldChzdHlsZXNoZWV0KSk7XG4gICAgICAgICAgdGhpcy5fYW5hbHl6ZWRGaWxlcy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ2FsbCB0aGUgXCJwb3N0QW5hbHlzaXNcIiBtZXRob2QgZm9yIGVhY2ggbWlncmF0aW9uLlxuICAgIG1pZ3JhdGlvbnMuZm9yRWFjaChyID0+IHIucG9zdEFuYWx5c2lzKCkpO1xuXG4gICAgLy8gQ29sbGVjdCBhbGwgZmFpbHVyZXMgcmVwb3J0ZWQgYnkgaW5kaXZpZHVhbCBtaWdyYXRpb25zLlxuICAgIGNvbnN0IGZhaWx1cmVzID0gbWlncmF0aW9ucy5yZWR1Y2UoXG4gICAgICAocmVzLCBtKSA9PiByZXMuY29uY2F0KG0uZmFpbHVyZXMpLFxuICAgICAgW10gYXMgTWlncmF0aW9uRmFpbHVyZVtdLFxuICAgICk7XG5cbiAgICAvLyBJbiBjYXNlIHRoZXJlIGFyZSBmYWlsdXJlcywgcHJpbnQgdGhlc2UgdG8gdGhlIENMSSBsb2dnZXIgYXMgd2FybmluZ3MuXG4gICAgaWYgKGZhaWx1cmVzLmxlbmd0aCkge1xuICAgICAgZmFpbHVyZXMuZm9yRWFjaCgoe2ZpbGVQYXRoLCBtZXNzYWdlLCBwb3NpdGlvbn0pID0+IHtcbiAgICAgICAgY29uc3QgbGluZUFuZENoYXJhY3RlciA9IHBvc2l0aW9uID8gYEAke3Bvc2l0aW9uLmxpbmUgKyAxfToke3Bvc2l0aW9uLmNoYXJhY3RlciArIDF9YCA6ICcnO1xuICAgICAgICB0aGlzLl9sb2dnZXIud2FybihgJHtmaWxlUGF0aH0ke2xpbmVBbmRDaGFyYWN0ZXJ9IC0gJHttZXNzYWdlfWApO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGhhc0ZhaWx1cmVzOiAhIWZhaWx1cmVzLmxlbmd0aCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgaW5zdGFuY2VzIG9mIHRoZSBnaXZlbiBtaWdyYXRpb25zIHdpdGggdGhlIHNwZWNpZmllZCB0YXJnZXRcbiAgICogdmVyc2lvbiBhbmQgZGF0YS5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU1pZ3JhdGlvbnM8RGF0YT4oXG4gICAgdHlwZXM6IE1pZ3JhdGlvbkN0b3I8RGF0YSwgQ29udGV4dD5bXSxcbiAgICB0YXJnZXQ6IFRhcmdldFZlcnNpb24sXG4gICAgZGF0YTogRGF0YSxcbiAgKTogTWlncmF0aW9uPERhdGEsIENvbnRleHQ+W10ge1xuICAgIGNvbnN0IHJlc3VsdDogTWlncmF0aW9uPERhdGEsIENvbnRleHQ+W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGN0b3Igb2YgdHlwZXMpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGN0b3IoXG4gICAgICAgIHRoaXMuX3Byb2dyYW0sXG4gICAgICAgIHRoaXMuX3R5cGVDaGVja2VyLFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIHRoaXMuX2NvbnRleHQsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0sXG4gICAgICAgIHRoaXMuX2xvZ2dlcixcbiAgICAgICk7XG4gICAgICBpbnN0YW5jZS5pbml0KCk7XG4gICAgICBpZiAoaW5zdGFuY2UuZW5hYmxlZCkge1xuICAgICAgICByZXN1bHQucHVzaChpbnN0YW5jZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHByb2dyYW0gZm9ybSB0aGUgc3BlY2lmaWVkIHRzY29uZmlnIGFuZCBwYXRjaGVzIHRoZSBob3N0XG4gICAqIHRvIHJlYWQgZmlsZXMgYW5kIGRpcmVjdG9yaWVzIHRocm91Z2ggdGhlIGdpdmVuIGZpbGUgc3lzdGVtLlxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZVByb2dyYW1Gcm9tVHNjb25maWcodHNjb25maWdQYXRoOiBXb3Jrc3BhY2VQYXRoLCBmczogRmlsZVN5c3RlbSk6IHRzLlByb2dyYW0ge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlVHNjb25maWdGaWxlKGZzLnJlc29sdmUodHNjb25maWdQYXRoKSwgZnMpO1xuICAgIGNvbnN0IGhvc3QgPSBjcmVhdGVGaWxlU3lzdGVtQ29tcGlsZXJIb3N0KHBhcnNlZC5vcHRpb25zLCBmcyk7XG4gICAgcmV0dXJuIHRzLmNyZWF0ZVByb2dyYW0ocGFyc2VkLmZpbGVOYW1lcywgcGFyc2VkLm9wdGlvbnMsIGhvc3QpO1xuICB9XG59XG4iXX0=