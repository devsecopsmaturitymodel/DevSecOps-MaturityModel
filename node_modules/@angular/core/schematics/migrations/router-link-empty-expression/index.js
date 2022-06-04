/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/core/schematics/migrations/router-link-empty-expression", ["require", "exports", "@angular-devkit/core", "@angular-devkit/schematics", "path", "@angular/core/schematics/utils/load_esm", "@angular/core/schematics/utils/ng_component_template", "@angular/core/schematics/utils/project_tsconfig_paths", "@angular/core/schematics/utils/typescript/compiler_host", "@angular/core/schematics/migrations/router-link-empty-expression/analyze_template"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core_1 = require("@angular-devkit/core");
    const schematics_1 = require("@angular-devkit/schematics");
    const path_1 = require("path");
    const load_esm_1 = require("@angular/core/schematics/utils/load_esm");
    const ng_component_template_1 = require("@angular/core/schematics/utils/ng_component_template");
    const project_tsconfig_paths_1 = require("@angular/core/schematics/utils/project_tsconfig_paths");
    const compiler_host_1 = require("@angular/core/schematics/utils/typescript/compiler_host");
    const analyze_template_1 = require("@angular/core/schematics/migrations/router-link-empty-expression/analyze_template");
    const README_URL = 'https://github.com/angular/angular/blob/master/packages/core/schematics/migrations/router-link-empty-expression/README.md';
    /** Entry point for the RouterLink empty expression migration. */
    function default_1() {
        return (tree, context) => __awaiter(this, void 0, void 0, function* () {
            const { buildPaths, testPaths } = yield (0, project_tsconfig_paths_1.getProjectTsConfigPaths)(tree);
            const basePath = process.cwd();
            if (!buildPaths.length && !testPaths.length) {
                throw new schematics_1.SchematicsException('Could not find any tsconfig file. Cannot check templates for empty routerLinks.');
            }
            let compilerModule;
            try {
                // Load ESM `@angular/compiler` using the TypeScript dynamic import workaround.
                // Once TypeScript provides support for keeping the dynamic import this workaround can be
                // changed to a direct dynamic import.
                compilerModule = yield (0, load_esm_1.loadEsmModule)('@angular/compiler');
            }
            catch (e) {
                throw new schematics_1.SchematicsException(`Unable to load the '@angular/compiler' package. Details: ${e.message}`);
            }
            for (const tsconfigPath of [...buildPaths, ...testPaths]) {
                runEmptyRouterLinkExpressionMigration(tree, tsconfigPath, basePath, context.logger, compilerModule);
            }
        });
    }
    exports.default = default_1;
    /**
     * Runs the routerLink migration, changing routerLink="" to routerLink="[]" and notifying developers
     * which templates received updates.
     */
    function runEmptyRouterLinkExpressionMigration(tree, tsconfigPath, basePath, logger, compilerModule) {
        const { program } = (0, compiler_host_1.createMigrationProgram)(tree, tsconfigPath, basePath);
        const typeChecker = program.getTypeChecker();
        const templateVisitor = new ng_component_template_1.NgComponentTemplateVisitor(typeChecker, basePath, tree);
        const sourceFiles = program.getSourceFiles().filter(sourceFile => (0, compiler_host_1.canMigrateFile)(basePath, sourceFile, program));
        // Analyze source files by detecting HTML templates.
        sourceFiles.forEach(sourceFile => templateVisitor.visitNode(sourceFile));
        const { resolvedTemplates } = templateVisitor;
        fixEmptyRouterlinks(resolvedTemplates, tree, logger, compilerModule);
    }
    function fixEmptyRouterlinks(resolvedTemplates, tree, logger, compilerModule) {
        var _a;
        const basePath = process.cwd();
        const collectedFixes = [];
        const fixesByFile = getFixesByFile(resolvedTemplates, compilerModule);
        for (const [absFilePath, templateFixes] of fixesByFile) {
            const treeFilePath = (0, path_1.relative)((0, core_1.normalize)(basePath), (0, core_1.normalize)(absFilePath));
            const originalFileContent = (_a = tree.read(treeFilePath)) === null || _a === void 0 ? void 0 : _a.toString();
            if (originalFileContent === undefined) {
                logger.error(`Failed to read file containing template; cannot apply fixes for empty routerLink expressions in ${treeFilePath}.`);
                continue;
            }
            const updater = tree.beginUpdate(treeFilePath);
            for (const templateFix of templateFixes) {
                // Sort backwards so string replacements do not conflict
                templateFix.replacements.sort((a, b) => b.start - a.start);
                for (const replacement of templateFix.replacements) {
                    updater.remove(replacement.start, replacement.end - replacement.start);
                    updater.insertLeft(replacement.start, replacement.newContent);
                }
                const displayFilePath = (0, core_1.normalize)((0, path_1.relative)(basePath, templateFix.originalTemplate.filePath));
                for (const n of templateFix.emptyRouterlinkExpressions) {
                    const { line, character } = templateFix.originalTemplate.getCharacterAndLineOfPosition(n.sourceSpan.start.offset);
                    collectedFixes.push(`${displayFilePath}@${line + 1}:${character + 1}`);
                }
                tree.commitUpdate(updater);
            }
        }
        if (collectedFixes.length > 0) {
            logger.info('---- RouterLink empty assignment schematic ----');
            logger.info('The behavior of empty/`undefined` inputs for `routerLink` has changed');
            logger.info('from linking to the current page to instead completely disable the link.');
            logger.info(`Read more about this change here: ${README_URL}`);
            logger.info('');
            logger.info('The following empty `routerLink` inputs were found and fixed:');
            collectedFixes.forEach(fix => logger.warn(`⮑   ${fix}`));
        }
    }
    /**
     * Returns fixes for nodes in templates which contain empty routerLink assignments, grouped by file.
     */
    function getFixesByFile(templates, compilerModule) {
        const fixesByFile = new Map();
        for (const template of templates) {
            const templateFix = fixEmptyRouterlinksInTemplate(template, compilerModule);
            if (templateFix === null) {
                continue;
            }
            const file = template.filePath;
            if (fixesByFile.has(file)) {
                if (template.inline) {
                    // External templates may be referenced multiple times in the project
                    // (e.g. if shared between components), but we only want to record them
                    // once. On the other hand, an inline template resides in a TS file that
                    // may contain multiple inline templates.
                    fixesByFile.get(file).push(templateFix);
                }
            }
            else {
                fixesByFile.set(file, [templateFix]);
            }
        }
        return fixesByFile;
    }
    function fixEmptyRouterlinksInTemplate(template, compilerModule) {
        const emptyRouterlinkExpressions = (0, analyze_template_1.analyzeResolvedTemplate)(template, compilerModule);
        if (!emptyRouterlinkExpressions || emptyRouterlinkExpressions.length === 0) {
            return null;
        }
        const replacements = [];
        for (const expr of emptyRouterlinkExpressions) {
            let replacement;
            if (expr.valueSpan) {
                replacement = {
                    start: template.start + expr.value.sourceSpan.start,
                    end: template.start + expr.value.sourceSpan.end,
                    newContent: '[]',
                };
            }
            else {
                const spanLength = expr.sourceSpan.end.offset - expr.sourceSpan.start.offset;
                // `expr.value.sourceSpan.start` is the start of the very beginning of the binding since there
                // is no value
                const endOfExpr = template.start + expr.value.sourceSpan.start + spanLength;
                replacement = {
                    start: endOfExpr,
                    end: endOfExpr,
                    newContent: '="[]"',
                };
            }
            replacements.push(replacement);
        }
        return { originalTemplate: template, replacements, emptyRouterlinkExpressions };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NjaGVtYXRpY3MvbWlncmF0aW9ucy9yb3V0ZXItbGluay1lbXB0eS1leHByZXNzaW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRUgsK0NBQXdEO0lBQ3hELDJEQUE2RjtJQUU3RiwrQkFBOEI7SUFDOUIsc0VBQW1EO0lBRW5ELGdHQUErRjtJQUMvRixrR0FBMkU7SUFDM0UsMkZBQTRGO0lBRTVGLHdIQUEyRDtJQUkzRCxNQUFNLFVBQVUsR0FDWiwySEFBMkgsQ0FBQztJQWFoSSxpRUFBaUU7SUFDakU7UUFDRSxPQUFPLENBQU8sSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUNyRCxNQUFNLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBQyxHQUFHLE1BQU0sSUFBQSxnREFBdUIsRUFBQyxJQUFJLENBQUMsQ0FBQztZQUNwRSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUMzQyxNQUFNLElBQUksZ0NBQW1CLENBQ3pCLGlGQUFpRixDQUFDLENBQUM7YUFDeEY7WUFFRCxJQUFJLGNBQWMsQ0FBQztZQUNuQixJQUFJO2dCQUNGLCtFQUErRTtnQkFDL0UseUZBQXlGO2dCQUN6RixzQ0FBc0M7Z0JBQ3RDLGNBQWMsR0FBRyxNQUFNLElBQUEsd0JBQWEsRUFBcUMsbUJBQW1CLENBQUMsQ0FBQzthQUMvRjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sSUFBSSxnQ0FBbUIsQ0FDekIsNERBQTZELENBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQ3pGO1lBRUQsS0FBSyxNQUFNLFlBQVksSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsU0FBUyxDQUFDLEVBQUU7Z0JBQ3hELHFDQUFxQyxDQUNqQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ25FO1FBQ0gsQ0FBQyxDQUFBLENBQUM7SUFDSixDQUFDO0lBMUJELDRCQTBCQztJQUVEOzs7T0FHRztJQUNILFNBQVMscUNBQXFDLENBQzFDLElBQVUsRUFBRSxZQUFvQixFQUFFLFFBQWdCLEVBQUUsTUFBYyxFQUNsRSxjQUFrRDtRQUNwRCxNQUFNLEVBQUMsT0FBTyxFQUFDLEdBQUcsSUFBQSxzQ0FBc0IsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM3QyxNQUFNLGVBQWUsR0FBRyxJQUFJLGtEQUEwQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEYsTUFBTSxXQUFXLEdBQ2IsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUEsOEJBQWMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFakcsb0RBQW9EO1FBQ3BELFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFekUsTUFBTSxFQUFDLGlCQUFpQixFQUFDLEdBQUcsZUFBZSxDQUFDO1FBQzVDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQ3hCLGlCQUFxQyxFQUFFLElBQVUsRUFBRSxNQUFjLEVBQ2pFLGNBQWtEOztRQUNwRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDL0IsTUFBTSxjQUFjLEdBQWEsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUV0RSxLQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLElBQUksV0FBVyxFQUFFO1lBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUEsZUFBUSxFQUFDLElBQUEsZ0JBQVMsRUFBQyxRQUFRLENBQUMsRUFBRSxJQUFBLGdCQUFTLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMzRSxNQUFNLG1CQUFtQixHQUFHLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsMENBQUUsUUFBUSxFQUFFLENBQUM7WUFDaEUsSUFBSSxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7Z0JBQ3JDLE1BQU0sQ0FBQyxLQUFLLENBQ1IsbUdBQ0ksWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDekIsU0FBUzthQUNWO1lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvQyxLQUFLLE1BQU0sV0FBVyxJQUFJLGFBQWEsRUFBRTtnQkFDdkMsd0RBQXdEO2dCQUN4RCxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFdBQVcsQ0FBQyxZQUFZLEVBQUU7b0JBQ2xELE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztpQkFDL0Q7Z0JBQ0QsTUFBTSxlQUFlLEdBQUcsSUFBQSxnQkFBUyxFQUFDLElBQUEsZUFBUSxFQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0YsS0FBSyxNQUFNLENBQUMsSUFBSSxXQUFXLENBQUMsMEJBQTBCLEVBQUU7b0JBQ3RELE1BQU0sRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLEdBQ25CLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDMUYsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLGVBQWUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUN4RTtnQkFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVCO1NBQ0Y7UUFFRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLElBQUksQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1lBQ3hGLE1BQU0sQ0FBQyxJQUFJLENBQUMscUNBQXFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7WUFDN0UsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLGNBQWMsQ0FDbkIsU0FBNkIsRUFDN0IsY0FBa0Q7UUFDcEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQTJCLENBQUM7UUFDdkQsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7WUFDaEMsTUFBTSxXQUFXLEdBQUcsNkJBQTZCLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzVFLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDeEIsU0FBUzthQUNWO1lBRUQsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUMvQixJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDbkIscUVBQXFFO29CQUNyRSx1RUFBdUU7b0JBQ3ZFLHdFQUF3RTtvQkFDeEUseUNBQXlDO29CQUN6QyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDMUM7YUFDRjtpQkFBTTtnQkFDTCxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDdEM7U0FDRjtRQUVELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxTQUFTLDZCQUE2QixDQUNsQyxRQUEwQixFQUFFLGNBQWtEO1FBRWhGLE1BQU0sMEJBQTBCLEdBQUcsSUFBQSwwQ0FBdUIsRUFBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFckYsSUFBSSxDQUFDLDBCQUEwQixJQUFJLDBCQUEwQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUUsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sWUFBWSxHQUFrQixFQUFFLENBQUM7UUFDdkMsS0FBSyxNQUFNLElBQUksSUFBSSwwQkFBMEIsRUFBRTtZQUM3QyxJQUFJLFdBQXdCLENBQUM7WUFDN0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixXQUFXLEdBQUc7b0JBQ1osS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSztvQkFDbkQsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRztvQkFDL0MsVUFBVSxFQUFFLElBQUk7aUJBQ2pCLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUM3RSw4RkFBOEY7Z0JBQzlGLGNBQWM7Z0JBQ2QsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO2dCQUM1RSxXQUFXLEdBQUc7b0JBQ1osS0FBSyxFQUFFLFNBQVM7b0JBQ2hCLEdBQUcsRUFBRSxTQUFTO29CQUNkLFVBQVUsRUFBRSxPQUFPO2lCQUNwQixDQUFDO2FBQ0g7WUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsMEJBQTBCLEVBQUMsQ0FBQztJQUNoRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7bG9nZ2luZywgbm9ybWFsaXplfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFNjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB0eXBlIHtUbXBsQXN0Qm91bmRBdHRyaWJ1dGV9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcbmltcG9ydCB7cmVsYXRpdmV9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtsb2FkRXNtTW9kdWxlfSBmcm9tICcuLi8uLi91dGlscy9sb2FkX2VzbSc7XG5cbmltcG9ydCB7TmdDb21wb25lbnRUZW1wbGF0ZVZpc2l0b3IsIFJlc29sdmVkVGVtcGxhdGV9IGZyb20gJy4uLy4uL3V0aWxzL25nX2NvbXBvbmVudF90ZW1wbGF0ZSc7XG5pbXBvcnQge2dldFByb2plY3RUc0NvbmZpZ1BhdGhzfSBmcm9tICcuLi8uLi91dGlscy9wcm9qZWN0X3RzY29uZmlnX3BhdGhzJztcbmltcG9ydCB7Y2FuTWlncmF0ZUZpbGUsIGNyZWF0ZU1pZ3JhdGlvblByb2dyYW19IGZyb20gJy4uLy4uL3V0aWxzL3R5cGVzY3JpcHQvY29tcGlsZXJfaG9zdCc7XG5cbmltcG9ydCB7YW5hbHl6ZVJlc29sdmVkVGVtcGxhdGV9IGZyb20gJy4vYW5hbHl6ZV90ZW1wbGF0ZSc7XG5cbnR5cGUgTG9nZ2VyID0gbG9nZ2luZy5Mb2dnZXJBcGk7XG5cbmNvbnN0IFJFQURNRV9VUkwgPVxuICAgICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL2NvcmUvc2NoZW1hdGljcy9taWdyYXRpb25zL3JvdXRlci1saW5rLWVtcHR5LWV4cHJlc3Npb24vUkVBRE1FLm1kJztcblxuaW50ZXJmYWNlIFJlcGxhY2VtZW50IHtcbiAgc3RhcnQ6IG51bWJlcjtcbiAgZW5kOiBudW1iZXI7XG4gIG5ld0NvbnRlbnQ6IHN0cmluZztcbn1cbmludGVyZmFjZSBGaXhlZFRlbXBsYXRlIHtcbiAgb3JpZ2luYWxUZW1wbGF0ZTogUmVzb2x2ZWRUZW1wbGF0ZTtcbiAgcmVwbGFjZW1lbnRzOiBSZXBsYWNlbWVudFtdO1xuICBlbXB0eVJvdXRlcmxpbmtFeHByZXNzaW9uczogVG1wbEFzdEJvdW5kQXR0cmlidXRlW107XG59XG5cbi8qKiBFbnRyeSBwb2ludCBmb3IgdGhlIFJvdXRlckxpbmsgZW1wdHkgZXhwcmVzc2lvbiBtaWdyYXRpb24uICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpOiBSdWxlIHtcbiAgcmV0dXJuIGFzeW5jICh0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3Qge2J1aWxkUGF0aHMsIHRlc3RQYXRoc30gPSBhd2FpdCBnZXRQcm9qZWN0VHNDb25maWdQYXRocyh0cmVlKTtcbiAgICBjb25zdCBiYXNlUGF0aCA9IHByb2Nlc3MuY3dkKCk7XG5cbiAgICBpZiAoIWJ1aWxkUGF0aHMubGVuZ3RoICYmICF0ZXN0UGF0aHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgICAgICAnQ291bGQgbm90IGZpbmQgYW55IHRzY29uZmlnIGZpbGUuIENhbm5vdCBjaGVjayB0ZW1wbGF0ZXMgZm9yIGVtcHR5IHJvdXRlckxpbmtzLicpO1xuICAgIH1cblxuICAgIGxldCBjb21waWxlck1vZHVsZTtcbiAgICB0cnkge1xuICAgICAgLy8gTG9hZCBFU00gYEBhbmd1bGFyL2NvbXBpbGVyYCB1c2luZyB0aGUgVHlwZVNjcmlwdCBkeW5hbWljIGltcG9ydCB3b3JrYXJvdW5kLlxuICAgICAgLy8gT25jZSBUeXBlU2NyaXB0IHByb3ZpZGVzIHN1cHBvcnQgZm9yIGtlZXBpbmcgdGhlIGR5bmFtaWMgaW1wb3J0IHRoaXMgd29ya2Fyb3VuZCBjYW4gYmVcbiAgICAgIC8vIGNoYW5nZWQgdG8gYSBkaXJlY3QgZHluYW1pYyBpbXBvcnQuXG4gICAgICBjb21waWxlck1vZHVsZSA9IGF3YWl0IGxvYWRFc21Nb2R1bGU8dHlwZW9mIGltcG9ydCgnQGFuZ3VsYXIvY29tcGlsZXInKT4oJ0Bhbmd1bGFyL2NvbXBpbGVyJyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICAgICAgYFVuYWJsZSB0byBsb2FkIHRoZSAnQGFuZ3VsYXIvY29tcGlsZXInIHBhY2thZ2UuIERldGFpbHM6ICR7KGUgYXMgRXJyb3IpLm1lc3NhZ2V9YCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCB0c2NvbmZpZ1BhdGggb2YgWy4uLmJ1aWxkUGF0aHMsIC4uLnRlc3RQYXRoc10pIHtcbiAgICAgIHJ1bkVtcHR5Um91dGVyTGlua0V4cHJlc3Npb25NaWdyYXRpb24oXG4gICAgICAgICAgdHJlZSwgdHNjb25maWdQYXRoLCBiYXNlUGF0aCwgY29udGV4dC5sb2dnZXIsIGNvbXBpbGVyTW9kdWxlKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUnVucyB0aGUgcm91dGVyTGluayBtaWdyYXRpb24sIGNoYW5naW5nIHJvdXRlckxpbms9XCJcIiB0byByb3V0ZXJMaW5rPVwiW11cIiBhbmQgbm90aWZ5aW5nIGRldmVsb3BlcnNcbiAqIHdoaWNoIHRlbXBsYXRlcyByZWNlaXZlZCB1cGRhdGVzLlxuICovXG5mdW5jdGlvbiBydW5FbXB0eVJvdXRlckxpbmtFeHByZXNzaW9uTWlncmF0aW9uKFxuICAgIHRyZWU6IFRyZWUsIHRzY29uZmlnUGF0aDogc3RyaW5nLCBiYXNlUGF0aDogc3RyaW5nLCBsb2dnZXI6IExvZ2dlcixcbiAgICBjb21waWxlck1vZHVsZTogdHlwZW9mIGltcG9ydCgnQGFuZ3VsYXIvY29tcGlsZXInKSkge1xuICBjb25zdCB7cHJvZ3JhbX0gPSBjcmVhdGVNaWdyYXRpb25Qcm9ncmFtKHRyZWUsIHRzY29uZmlnUGF0aCwgYmFzZVBhdGgpO1xuICBjb25zdCB0eXBlQ2hlY2tlciA9IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKTtcbiAgY29uc3QgdGVtcGxhdGVWaXNpdG9yID0gbmV3IE5nQ29tcG9uZW50VGVtcGxhdGVWaXNpdG9yKHR5cGVDaGVja2VyLCBiYXNlUGF0aCwgdHJlZSk7XG4gIGNvbnN0IHNvdXJjZUZpbGVzID1cbiAgICAgIHByb2dyYW0uZ2V0U291cmNlRmlsZXMoKS5maWx0ZXIoc291cmNlRmlsZSA9PiBjYW5NaWdyYXRlRmlsZShiYXNlUGF0aCwgc291cmNlRmlsZSwgcHJvZ3JhbSkpO1xuXG4gIC8vIEFuYWx5emUgc291cmNlIGZpbGVzIGJ5IGRldGVjdGluZyBIVE1MIHRlbXBsYXRlcy5cbiAgc291cmNlRmlsZXMuZm9yRWFjaChzb3VyY2VGaWxlID0+IHRlbXBsYXRlVmlzaXRvci52aXNpdE5vZGUoc291cmNlRmlsZSkpO1xuXG4gIGNvbnN0IHtyZXNvbHZlZFRlbXBsYXRlc30gPSB0ZW1wbGF0ZVZpc2l0b3I7XG4gIGZpeEVtcHR5Um91dGVybGlua3MocmVzb2x2ZWRUZW1wbGF0ZXMsIHRyZWUsIGxvZ2dlciwgY29tcGlsZXJNb2R1bGUpO1xufVxuXG5mdW5jdGlvbiBmaXhFbXB0eVJvdXRlcmxpbmtzKFxuICAgIHJlc29sdmVkVGVtcGxhdGVzOiBSZXNvbHZlZFRlbXBsYXRlW10sIHRyZWU6IFRyZWUsIGxvZ2dlcjogTG9nZ2VyLFxuICAgIGNvbXBpbGVyTW9kdWxlOiB0eXBlb2YgaW1wb3J0KCdAYW5ndWxhci9jb21waWxlcicpKSB7XG4gIGNvbnN0IGJhc2VQYXRoID0gcHJvY2Vzcy5jd2QoKTtcbiAgY29uc3QgY29sbGVjdGVkRml4ZXM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGZpeGVzQnlGaWxlID0gZ2V0Rml4ZXNCeUZpbGUocmVzb2x2ZWRUZW1wbGF0ZXMsIGNvbXBpbGVyTW9kdWxlKTtcblxuICBmb3IgKGNvbnN0IFthYnNGaWxlUGF0aCwgdGVtcGxhdGVGaXhlc10gb2YgZml4ZXNCeUZpbGUpIHtcbiAgICBjb25zdCB0cmVlRmlsZVBhdGggPSByZWxhdGl2ZShub3JtYWxpemUoYmFzZVBhdGgpLCBub3JtYWxpemUoYWJzRmlsZVBhdGgpKTtcbiAgICBjb25zdCBvcmlnaW5hbEZpbGVDb250ZW50ID0gdHJlZS5yZWFkKHRyZWVGaWxlUGF0aCk/LnRvU3RyaW5nKCk7XG4gICAgaWYgKG9yaWdpbmFsRmlsZUNvbnRlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGBGYWlsZWQgdG8gcmVhZCBmaWxlIGNvbnRhaW5pbmcgdGVtcGxhdGU7IGNhbm5vdCBhcHBseSBmaXhlcyBmb3IgZW1wdHkgcm91dGVyTGluayBleHByZXNzaW9ucyBpbiAke1xuICAgICAgICAgICAgICB0cmVlRmlsZVBhdGh9LmApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlciA9IHRyZWUuYmVnaW5VcGRhdGUodHJlZUZpbGVQYXRoKTtcbiAgICBmb3IgKGNvbnN0IHRlbXBsYXRlRml4IG9mIHRlbXBsYXRlRml4ZXMpIHtcbiAgICAgIC8vIFNvcnQgYmFja3dhcmRzIHNvIHN0cmluZyByZXBsYWNlbWVudHMgZG8gbm90IGNvbmZsaWN0XG4gICAgICB0ZW1wbGF0ZUZpeC5yZXBsYWNlbWVudHMuc29ydCgoYSwgYikgPT4gYi5zdGFydCAtIGEuc3RhcnQpO1xuICAgICAgZm9yIChjb25zdCByZXBsYWNlbWVudCBvZiB0ZW1wbGF0ZUZpeC5yZXBsYWNlbWVudHMpIHtcbiAgICAgICAgdXBkYXRlci5yZW1vdmUocmVwbGFjZW1lbnQuc3RhcnQsIHJlcGxhY2VtZW50LmVuZCAtIHJlcGxhY2VtZW50LnN0YXJ0KTtcbiAgICAgICAgdXBkYXRlci5pbnNlcnRMZWZ0KHJlcGxhY2VtZW50LnN0YXJ0LCByZXBsYWNlbWVudC5uZXdDb250ZW50KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRpc3BsYXlGaWxlUGF0aCA9IG5vcm1hbGl6ZShyZWxhdGl2ZShiYXNlUGF0aCwgdGVtcGxhdGVGaXgub3JpZ2luYWxUZW1wbGF0ZS5maWxlUGF0aCkpO1xuICAgICAgZm9yIChjb25zdCBuIG9mIHRlbXBsYXRlRml4LmVtcHR5Um91dGVybGlua0V4cHJlc3Npb25zKSB7XG4gICAgICAgIGNvbnN0IHtsaW5lLCBjaGFyYWN0ZXJ9ID1cbiAgICAgICAgICAgIHRlbXBsYXRlRml4Lm9yaWdpbmFsVGVtcGxhdGUuZ2V0Q2hhcmFjdGVyQW5kTGluZU9mUG9zaXRpb24obi5zb3VyY2VTcGFuLnN0YXJ0Lm9mZnNldCk7XG4gICAgICAgIGNvbGxlY3RlZEZpeGVzLnB1c2goYCR7ZGlzcGxheUZpbGVQYXRofUAke2xpbmUgKyAxfToke2NoYXJhY3RlciArIDF9YCk7XG4gICAgICB9XG4gICAgICB0cmVlLmNvbW1pdFVwZGF0ZSh1cGRhdGVyKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY29sbGVjdGVkRml4ZXMubGVuZ3RoID4gMCkge1xuICAgIGxvZ2dlci5pbmZvKCctLS0tIFJvdXRlckxpbmsgZW1wdHkgYXNzaWdubWVudCBzY2hlbWF0aWMgLS0tLScpO1xuICAgIGxvZ2dlci5pbmZvKCdUaGUgYmVoYXZpb3Igb2YgZW1wdHkvYHVuZGVmaW5lZGAgaW5wdXRzIGZvciBgcm91dGVyTGlua2AgaGFzIGNoYW5nZWQnKTtcbiAgICBsb2dnZXIuaW5mbygnZnJvbSBsaW5raW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgdG8gaW5zdGVhZCBjb21wbGV0ZWx5IGRpc2FibGUgdGhlIGxpbmsuJyk7XG4gICAgbG9nZ2VyLmluZm8oYFJlYWQgbW9yZSBhYm91dCB0aGlzIGNoYW5nZSBoZXJlOiAke1JFQURNRV9VUkx9YCk7XG4gICAgbG9nZ2VyLmluZm8oJycpO1xuICAgIGxvZ2dlci5pbmZvKCdUaGUgZm9sbG93aW5nIGVtcHR5IGByb3V0ZXJMaW5rYCBpbnB1dHMgd2VyZSBmb3VuZCBhbmQgZml4ZWQ6Jyk7XG4gICAgY29sbGVjdGVkRml4ZXMuZm9yRWFjaChmaXggPT4gbG9nZ2VyLndhcm4oYOKukSAgICR7Zml4fWApKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgZml4ZXMgZm9yIG5vZGVzIGluIHRlbXBsYXRlcyB3aGljaCBjb250YWluIGVtcHR5IHJvdXRlckxpbmsgYXNzaWdubWVudHMsIGdyb3VwZWQgYnkgZmlsZS5cbiAqL1xuZnVuY3Rpb24gZ2V0Rml4ZXNCeUZpbGUoXG4gICAgdGVtcGxhdGVzOiBSZXNvbHZlZFRlbXBsYXRlW10sXG4gICAgY29tcGlsZXJNb2R1bGU6IHR5cGVvZiBpbXBvcnQoJ0Bhbmd1bGFyL2NvbXBpbGVyJykpOiBNYXA8c3RyaW5nLCBGaXhlZFRlbXBsYXRlW10+IHtcbiAgY29uc3QgZml4ZXNCeUZpbGUgPSBuZXcgTWFwPHN0cmluZywgRml4ZWRUZW1wbGF0ZVtdPigpO1xuICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIHRlbXBsYXRlcykge1xuICAgIGNvbnN0IHRlbXBsYXRlRml4ID0gZml4RW1wdHlSb3V0ZXJsaW5rc0luVGVtcGxhdGUodGVtcGxhdGUsIGNvbXBpbGVyTW9kdWxlKTtcbiAgICBpZiAodGVtcGxhdGVGaXggPT09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSB0ZW1wbGF0ZS5maWxlUGF0aDtcbiAgICBpZiAoZml4ZXNCeUZpbGUuaGFzKGZpbGUpKSB7XG4gICAgICBpZiAodGVtcGxhdGUuaW5saW5lKSB7XG4gICAgICAgIC8vIEV4dGVybmFsIHRlbXBsYXRlcyBtYXkgYmUgcmVmZXJlbmNlZCBtdWx0aXBsZSB0aW1lcyBpbiB0aGUgcHJvamVjdFxuICAgICAgICAvLyAoZS5nLiBpZiBzaGFyZWQgYmV0d2VlbiBjb21wb25lbnRzKSwgYnV0IHdlIG9ubHkgd2FudCB0byByZWNvcmQgdGhlbVxuICAgICAgICAvLyBvbmNlLiBPbiB0aGUgb3RoZXIgaGFuZCwgYW4gaW5saW5lIHRlbXBsYXRlIHJlc2lkZXMgaW4gYSBUUyBmaWxlIHRoYXRcbiAgICAgICAgLy8gbWF5IGNvbnRhaW4gbXVsdGlwbGUgaW5saW5lIHRlbXBsYXRlcy5cbiAgICAgICAgZml4ZXNCeUZpbGUuZ2V0KGZpbGUpIS5wdXNoKHRlbXBsYXRlRml4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZml4ZXNCeUZpbGUuc2V0KGZpbGUsIFt0ZW1wbGF0ZUZpeF0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmaXhlc0J5RmlsZTtcbn1cblxuZnVuY3Rpb24gZml4RW1wdHlSb3V0ZXJsaW5rc0luVGVtcGxhdGUoXG4gICAgdGVtcGxhdGU6IFJlc29sdmVkVGVtcGxhdGUsIGNvbXBpbGVyTW9kdWxlOiB0eXBlb2YgaW1wb3J0KCdAYW5ndWxhci9jb21waWxlcicpKTogRml4ZWRUZW1wbGF0ZXxcbiAgICBudWxsIHtcbiAgY29uc3QgZW1wdHlSb3V0ZXJsaW5rRXhwcmVzc2lvbnMgPSBhbmFseXplUmVzb2x2ZWRUZW1wbGF0ZSh0ZW1wbGF0ZSwgY29tcGlsZXJNb2R1bGUpO1xuXG4gIGlmICghZW1wdHlSb3V0ZXJsaW5rRXhwcmVzc2lvbnMgfHwgZW1wdHlSb3V0ZXJsaW5rRXhwcmVzc2lvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCByZXBsYWNlbWVudHM6IFJlcGxhY2VtZW50W10gPSBbXTtcbiAgZm9yIChjb25zdCBleHByIG9mIGVtcHR5Um91dGVybGlua0V4cHJlc3Npb25zKSB7XG4gICAgbGV0IHJlcGxhY2VtZW50OiBSZXBsYWNlbWVudDtcbiAgICBpZiAoZXhwci52YWx1ZVNwYW4pIHtcbiAgICAgIHJlcGxhY2VtZW50ID0ge1xuICAgICAgICBzdGFydDogdGVtcGxhdGUuc3RhcnQgKyBleHByLnZhbHVlLnNvdXJjZVNwYW4uc3RhcnQsXG4gICAgICAgIGVuZDogdGVtcGxhdGUuc3RhcnQgKyBleHByLnZhbHVlLnNvdXJjZVNwYW4uZW5kLFxuICAgICAgICBuZXdDb250ZW50OiAnW10nLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc3Bhbkxlbmd0aCA9IGV4cHIuc291cmNlU3Bhbi5lbmQub2Zmc2V0IC0gZXhwci5zb3VyY2VTcGFuLnN0YXJ0Lm9mZnNldDtcbiAgICAgIC8vIGBleHByLnZhbHVlLnNvdXJjZVNwYW4uc3RhcnRgIGlzIHRoZSBzdGFydCBvZiB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgdGhlIGJpbmRpbmcgc2luY2UgdGhlcmVcbiAgICAgIC8vIGlzIG5vIHZhbHVlXG4gICAgICBjb25zdCBlbmRPZkV4cHIgPSB0ZW1wbGF0ZS5zdGFydCArIGV4cHIudmFsdWUuc291cmNlU3Bhbi5zdGFydCArIHNwYW5MZW5ndGg7XG4gICAgICByZXBsYWNlbWVudCA9IHtcbiAgICAgICAgc3RhcnQ6IGVuZE9mRXhwcixcbiAgICAgICAgZW5kOiBlbmRPZkV4cHIsXG4gICAgICAgIG5ld0NvbnRlbnQ6ICc9XCJbXVwiJyxcbiAgICAgIH07XG4gICAgfVxuICAgIHJlcGxhY2VtZW50cy5wdXNoKHJlcGxhY2VtZW50KTtcbiAgfVxuXG4gIHJldHVybiB7b3JpZ2luYWxUZW1wbGF0ZTogdGVtcGxhdGUsIHJlcGxhY2VtZW50cywgZW1wdHlSb3V0ZXJsaW5rRXhwcmVzc2lvbnN9O1xufVxuIl19