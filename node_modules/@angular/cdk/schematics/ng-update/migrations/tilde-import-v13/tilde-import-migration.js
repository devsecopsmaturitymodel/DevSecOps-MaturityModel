"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TildeImportMigration = void 0;
const core_1 = require("@angular-devkit/core");
const target_version_1 = require("../../../update-tool/target-version");
const devkit_migration_1 = require("../../devkit-migration");
/** Migration that removes tilde symbols from imports. */
class TildeImportMigration extends devkit_migration_1.DevkitMigration {
    constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === target_version_1.TargetVersion.V13;
    }
    visitStylesheet(stylesheet) {
        const extension = (0, core_1.extname)(stylesheet.filePath);
        if (extension === '.scss' || extension === '.css') {
            const content = stylesheet.content;
            const migratedContent = content.replace(/@(?:import|use) +['"](~@angular\/.*)['"].*;?/g, (match, importPath) => {
                const index = match.indexOf(importPath);
                const newImportPath = importPath.replace(/^~|\.scss$/g, '');
                return match.slice(0, index) + newImportPath + match.slice(index + importPath.length);
            });
            if (migratedContent && migratedContent !== content) {
                this.fileSystem
                    .edit(stylesheet.filePath)
                    .remove(0, stylesheet.content.length)
                    .insertLeft(0, migratedContent);
            }
        }
    }
}
exports.TildeImportMigration = TildeImportMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZGUtaW1wb3J0LW1pZ3JhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy90aWxkZS1pbXBvcnQtdjEzL3RpbGRlLWltcG9ydC1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQTZDO0FBRTdDLHdFQUFrRTtBQUNsRSw2REFBdUQ7QUFFdkQseURBQXlEO0FBQ3pELE1BQWEsb0JBQXFCLFNBQVEsa0NBQXFCO0lBQS9EOztRQUNFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDhCQUFhLENBQUMsR0FBRyxDQUFDO0lBd0JyRCxDQUFDO0lBdEJVLGVBQWUsQ0FBQyxVQUE0QjtRQUNuRCxNQUFNLFNBQVMsR0FBRyxJQUFBLGNBQU8sRUFBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0MsSUFBSSxTQUFTLEtBQUssT0FBTyxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7WUFDakQsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUNuQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUNyQywrQ0FBK0MsRUFDL0MsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUU7Z0JBQ3BCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3hDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEYsQ0FBQyxDQUNGLENBQUM7WUFFRixJQUFJLGVBQWUsSUFBSSxlQUFlLEtBQUssT0FBTyxFQUFFO2dCQUNsRCxJQUFJLENBQUMsVUFBVTtxQkFDWixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztxQkFDekIsTUFBTSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztxQkFDcEMsVUFBVSxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQzthQUNuQztTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBekJELG9EQXlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7UmVzb2x2ZWRSZXNvdXJjZX0gZnJvbSAnLi4vLi4vLi4vdXBkYXRlLXRvb2wvY29tcG9uZW50LXJlc291cmNlLWNvbGxlY3Rvcic7XG5pbXBvcnQge1RhcmdldFZlcnNpb259IGZyb20gJy4uLy4uLy4uL3VwZGF0ZS10b29sL3RhcmdldC12ZXJzaW9uJztcbmltcG9ydCB7RGV2a2l0TWlncmF0aW9ufSBmcm9tICcuLi8uLi9kZXZraXQtbWlncmF0aW9uJztcblxuLyoqIE1pZ3JhdGlvbiB0aGF0IHJlbW92ZXMgdGlsZGUgc3ltYm9scyBmcm9tIGltcG9ydHMuICovXG5leHBvcnQgY2xhc3MgVGlsZGVJbXBvcnRNaWdyYXRpb24gZXh0ZW5kcyBEZXZraXRNaWdyYXRpb248bnVsbD4ge1xuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlYxMztcblxuICBvdmVycmlkZSB2aXNpdFN0eWxlc2hlZXQoc3R5bGVzaGVldDogUmVzb2x2ZWRSZXNvdXJjZSk6IHZvaWQge1xuICAgIGNvbnN0IGV4dGVuc2lvbiA9IGV4dG5hbWUoc3R5bGVzaGVldC5maWxlUGF0aCk7XG5cbiAgICBpZiAoZXh0ZW5zaW9uID09PSAnLnNjc3MnIHx8IGV4dGVuc2lvbiA9PT0gJy5jc3MnKSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gc3R5bGVzaGVldC5jb250ZW50O1xuICAgICAgY29uc3QgbWlncmF0ZWRDb250ZW50ID0gY29udGVudC5yZXBsYWNlKFxuICAgICAgICAvQCg/OmltcG9ydHx1c2UpICtbJ1wiXSh+QGFuZ3VsYXJcXC8uKilbJ1wiXS4qOz8vZyxcbiAgICAgICAgKG1hdGNoLCBpbXBvcnRQYXRoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBtYXRjaC5pbmRleE9mKGltcG9ydFBhdGgpO1xuICAgICAgICAgIGNvbnN0IG5ld0ltcG9ydFBhdGggPSBpbXBvcnRQYXRoLnJlcGxhY2UoL15+fFxcLnNjc3MkL2csICcnKTtcbiAgICAgICAgICByZXR1cm4gbWF0Y2guc2xpY2UoMCwgaW5kZXgpICsgbmV3SW1wb3J0UGF0aCArIG1hdGNoLnNsaWNlKGluZGV4ICsgaW1wb3J0UGF0aC5sZW5ndGgpO1xuICAgICAgICB9LFxuICAgICAgKTtcblxuICAgICAgaWYgKG1pZ3JhdGVkQ29udGVudCAmJiBtaWdyYXRlZENvbnRlbnQgIT09IGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5maWxlU3lzdGVtXG4gICAgICAgICAgLmVkaXQoc3R5bGVzaGVldC5maWxlUGF0aClcbiAgICAgICAgICAucmVtb3ZlKDAsIHN0eWxlc2hlZXQuY29udGVudC5sZW5ndGgpXG4gICAgICAgICAgLmluc2VydExlZnQoMCwgbWlncmF0ZWRDb250ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==