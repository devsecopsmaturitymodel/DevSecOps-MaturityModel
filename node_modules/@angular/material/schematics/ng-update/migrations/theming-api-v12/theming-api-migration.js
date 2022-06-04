"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemingApiMigration = void 0;
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular/cdk/schematics");
const migration_1 = require("./migration");
/** Migration that switches all Sass files using Material theming APIs to `@use`. */
class ThemingApiMigration extends schematics_1.DevkitMigration {
    constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V12;
    }
    visitStylesheet(stylesheet) {
        if ((0, core_1.extname)(stylesheet.filePath) === '.scss') {
            const content = stylesheet.content;
            const migratedContent = content
                ? (0, migration_1.migrateFileContent)(content, '@angular/material/', '@angular/cdk/', '@angular/material', '@angular/cdk', undefined, /material\/prebuilt-themes|cdk\/.*-prebuilt/)
                : content;
            if (migratedContent && migratedContent !== content) {
                this.fileSystem
                    .edit(stylesheet.filePath)
                    .remove(0, stylesheet.content.length)
                    .insertLeft(0, migratedContent);
                ThemingApiMigration.migratedFileCount++;
            }
        }
    }
    /** Logs out the number of migrated files at the end of the migration. */
    static globalPostMigration(_tree, _targetVersion, context) {
        const count = ThemingApiMigration.migratedFileCount;
        if (count > 0) {
            context.logger.info(`Migrated ${count === 1 ? `1 file` : `${count} files`} to the ` +
                `new Angular Material theming API.`);
            ThemingApiMigration.migratedFileCount = 0;
        }
    }
}
exports.ThemingApiMigration = ThemingApiMigration;
/** Number of files that have been migrated. */
ThemingApiMigration.migratedFileCount = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWluZy1hcGktbWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL3RoZW1pbmctYXBpLW1pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCwrQ0FBNkM7QUFFN0Msd0RBQXlGO0FBQ3pGLDJDQUErQztBQUUvQyxvRkFBb0Y7QUFDcEYsTUFBYSxtQkFBb0IsU0FBUSw0QkFBcUI7SUFBOUQ7O1FBSUUsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxHQUFHLENBQUM7SUEyQ3JELENBQUM7SUF6Q1UsZUFBZSxDQUFDLFVBQTRCO1FBQ25ELElBQUksSUFBQSxjQUFPLEVBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLE9BQU8sRUFBRTtZQUM1QyxNQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQ25DLE1BQU0sZUFBZSxHQUFHLE9BQU87Z0JBQzdCLENBQUMsQ0FBQyxJQUFBLDhCQUFrQixFQUNoQixPQUFPLEVBQ1Asb0JBQW9CLEVBQ3BCLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsY0FBYyxFQUNkLFNBQVMsRUFDVCw0Q0FBNEMsQ0FDN0M7Z0JBQ0gsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUVaLElBQUksZUFBZSxJQUFJLGVBQWUsS0FBSyxPQUFPLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxVQUFVO3FCQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO3FCQUN6QixNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO3FCQUNwQyxVQUFVLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUNsQyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2FBQ3pDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLE1BQU0sQ0FBVSxtQkFBbUIsQ0FDakMsS0FBYyxFQUNkLGNBQTZCLEVBQzdCLE9BQXlCO1FBRXpCLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDO1FBRXBELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNqQixZQUFZLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLFFBQVEsVUFBVTtnQkFDN0QsbUNBQW1DLENBQ3RDLENBQUM7WUFDRixtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDOztBQTlDSCxrREErQ0M7QUE5Q0MsK0NBQStDO0FBQ3hDLHFDQUFpQixHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2V4dG5hbWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljQ29udGV4dH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtEZXZraXRNaWdyYXRpb24sIFJlc29sdmVkUmVzb3VyY2UsIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7bWlncmF0ZUZpbGVDb250ZW50fSBmcm9tICcuL21pZ3JhdGlvbic7XG5cbi8qKiBNaWdyYXRpb24gdGhhdCBzd2l0Y2hlcyBhbGwgU2FzcyBmaWxlcyB1c2luZyBNYXRlcmlhbCB0aGVtaW5nIEFQSXMgdG8gYEB1c2VgLiAqL1xuZXhwb3J0IGNsYXNzIFRoZW1pbmdBcGlNaWdyYXRpb24gZXh0ZW5kcyBEZXZraXRNaWdyYXRpb248bnVsbD4ge1xuICAvKiogTnVtYmVyIG9mIGZpbGVzIHRoYXQgaGF2ZSBiZWVuIG1pZ3JhdGVkLiAqL1xuICBzdGF0aWMgbWlncmF0ZWRGaWxlQ291bnQgPSAwO1xuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjEyO1xuXG4gIG92ZXJyaWRlIHZpc2l0U3R5bGVzaGVldChzdHlsZXNoZWV0OiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKGV4dG5hbWUoc3R5bGVzaGVldC5maWxlUGF0aCkgPT09ICcuc2NzcycpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdHlsZXNoZWV0LmNvbnRlbnQ7XG4gICAgICBjb25zdCBtaWdyYXRlZENvbnRlbnQgPSBjb250ZW50XG4gICAgICAgID8gbWlncmF0ZUZpbGVDb250ZW50KFxuICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgICdAYW5ndWxhci9tYXRlcmlhbC8nLFxuICAgICAgICAgICAgJ0Bhbmd1bGFyL2Nkay8nLFxuICAgICAgICAgICAgJ0Bhbmd1bGFyL21hdGVyaWFsJyxcbiAgICAgICAgICAgICdAYW5ndWxhci9jZGsnLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgL21hdGVyaWFsXFwvcHJlYnVpbHQtdGhlbWVzfGNka1xcLy4qLXByZWJ1aWx0LyxcbiAgICAgICAgICApXG4gICAgICAgIDogY29udGVudDtcblxuICAgICAgaWYgKG1pZ3JhdGVkQ29udGVudCAmJiBtaWdyYXRlZENvbnRlbnQgIT09IGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5maWxlU3lzdGVtXG4gICAgICAgICAgLmVkaXQoc3R5bGVzaGVldC5maWxlUGF0aClcbiAgICAgICAgICAucmVtb3ZlKDAsIHN0eWxlc2hlZXQuY29udGVudC5sZW5ndGgpXG4gICAgICAgICAgLmluc2VydExlZnQoMCwgbWlncmF0ZWRDb250ZW50KTtcbiAgICAgICAgVGhlbWluZ0FwaU1pZ3JhdGlvbi5taWdyYXRlZEZpbGVDb3VudCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBMb2dzIG91dCB0aGUgbnVtYmVyIG9mIG1pZ3JhdGVkIGZpbGVzIGF0IHRoZSBlbmQgb2YgdGhlIG1pZ3JhdGlvbi4gKi9cbiAgc3RhdGljIG92ZXJyaWRlIGdsb2JhbFBvc3RNaWdyYXRpb24oXG4gICAgX3RyZWU6IHVua25vd24sXG4gICAgX3RhcmdldFZlcnNpb246IFRhcmdldFZlcnNpb24sXG4gICAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY291bnQgPSBUaGVtaW5nQXBpTWlncmF0aW9uLm1pZ3JhdGVkRmlsZUNvdW50O1xuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhcbiAgICAgICAgYE1pZ3JhdGVkICR7Y291bnQgPT09IDEgPyBgMSBmaWxlYCA6IGAke2NvdW50fSBmaWxlc2B9IHRvIHRoZSBgICtcbiAgICAgICAgICBgbmV3IEFuZ3VsYXIgTWF0ZXJpYWwgdGhlbWluZyBBUEkuYCxcbiAgICAgICk7XG4gICAgICBUaGVtaW5nQXBpTWlncmF0aW9uLm1pZ3JhdGVkRmlsZUNvdW50ID0gMDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==