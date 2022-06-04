"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeSelectorsMigration = void 0;
const ts = require("typescript");
const migration_1 = require("../../update-tool/migration");
const literal_1 = require("../typescript/literal");
const upgrade_data_1 = require("../upgrade-data");
/**
 * Migration that walks through every string literal, template and stylesheet
 * in order to switch deprecated attribute selectors to the updated selector.
 */
class AttributeSelectorsMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /** Required upgrade changes for specified target version. */
        this.data = (0, upgrade_data_1.getVersionUpgradeData)(this, 'attributeSelectors');
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.data.length !== 0;
    }
    visitNode(node) {
        if (ts.isStringLiteralLike(node)) {
            this._visitStringLiteralLike(node);
        }
    }
    visitTemplate(template) {
        this.data.forEach(selector => {
            (0, literal_1.findAllSubstringIndices)(template.content, selector.replace)
                .map(offset => template.start + offset)
                .forEach(start => this._replaceSelector(template.filePath, start, selector));
        });
    }
    visitStylesheet(stylesheet) {
        this.data.forEach(selector => {
            const currentSelector = `[${selector.replace}]`;
            const updatedSelector = `[${selector.replaceWith}]`;
            (0, literal_1.findAllSubstringIndices)(stylesheet.content, currentSelector)
                .map(offset => stylesheet.start + offset)
                .forEach(start => this._replaceSelector(stylesheet.filePath, start, {
                replace: currentSelector,
                replaceWith: updatedSelector,
            }));
        });
    }
    _visitStringLiteralLike(literal) {
        if (literal.parent && literal.parent.kind !== ts.SyntaxKind.CallExpression) {
            return;
        }
        const literalText = literal.getText();
        const filePath = this.fileSystem.resolve(literal.getSourceFile().fileName);
        this.data.forEach(selector => {
            (0, literal_1.findAllSubstringIndices)(literalText, selector.replace)
                .map(offset => literal.getStart() + offset)
                .forEach(start => this._replaceSelector(filePath, start, selector));
        });
    }
    _replaceSelector(filePath, start, data) {
        this.fileSystem
            .edit(filePath)
            .remove(start, data.replace.length)
            .insertRight(start, data.replaceWith);
    }
}
exports.AttributeSelectorsMigration = AttributeSelectorsMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLXNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9hdHRyaWJ1dGUtc2VsZWN0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlDQUFpQztBQUdqQywyREFBc0Q7QUFFdEQsbURBQThEO0FBQzlELGtEQUFtRTtBQUVuRTs7O0dBR0c7QUFDSCxNQUFhLDJCQUE0QixTQUFRLHFCQUFzQjtJQUF2RTs7UUFDRSw2REFBNkQ7UUFDN0QsU0FBSSxHQUFHLElBQUEsb0NBQXFCLEVBQUMsSUFBSSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFFekQsMkRBQTJEO1FBQzNELFlBQU8sR0FBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUF5RDVDLENBQUM7SUF2RFUsU0FBUyxDQUFDLElBQWE7UUFDOUIsSUFBSSxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUVRLGFBQWEsQ0FBQyxRQUEwQjtRQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixJQUFBLGlDQUF1QixFQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztpQkFDeEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7aUJBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVRLGVBQWUsQ0FBQyxVQUE0QjtRQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixNQUFNLGVBQWUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQztZQUNoRCxNQUFNLGVBQWUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEdBQUcsQ0FBQztZQUVwRCxJQUFBLGlDQUF1QixFQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDO2lCQUN6RCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztpQkFDeEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQ2YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFO2dCQUNoRCxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsV0FBVyxFQUFFLGVBQWU7YUFDN0IsQ0FBQyxDQUNILENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxPQUE2QjtRQUMzRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUU7WUFDMUUsT0FBTztTQUNSO1FBRUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixJQUFBLGlDQUF1QixFQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO2lCQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDO2lCQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQixDQUN0QixRQUF1QixFQUN2QixLQUFhLEVBQ2IsSUFBa0M7UUFFbEMsSUFBSSxDQUFDLFVBQVU7YUFDWixJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ2QsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUNsQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUE5REQsa0VBOERDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtXb3Jrc3BhY2VQYXRofSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC9maWxlLXN5c3RlbSc7XG5pbXBvcnQge1Jlc29sdmVkUmVzb3VyY2V9IGZyb20gJy4uLy4uL3VwZGF0ZS10b29sL2NvbXBvbmVudC1yZXNvdXJjZS1jb2xsZWN0b3InO1xuaW1wb3J0IHtNaWdyYXRpb259IGZyb20gJy4uLy4uL3VwZGF0ZS10b29sL21pZ3JhdGlvbic7XG5pbXBvcnQge0F0dHJpYnV0ZVNlbGVjdG9yVXBncmFkZURhdGF9IGZyb20gJy4uL2RhdGEvYXR0cmlidXRlLXNlbGVjdG9ycyc7XG5pbXBvcnQge2ZpbmRBbGxTdWJzdHJpbmdJbmRpY2VzfSBmcm9tICcuLi90eXBlc2NyaXB0L2xpdGVyYWwnO1xuaW1wb3J0IHtnZXRWZXJzaW9uVXBncmFkZURhdGEsIFVwZ3JhZGVEYXRhfSBmcm9tICcuLi91cGdyYWRlLWRhdGEnO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IHdhbGtzIHRocm91Z2ggZXZlcnkgc3RyaW5nIGxpdGVyYWwsIHRlbXBsYXRlIGFuZCBzdHlsZXNoZWV0XG4gKiBpbiBvcmRlciB0byBzd2l0Y2ggZGVwcmVjYXRlZCBhdHRyaWJ1dGUgc2VsZWN0b3JzIHRvIHRoZSB1cGRhdGVkIHNlbGVjdG9yLlxuICovXG5leHBvcnQgY2xhc3MgQXR0cmlidXRlU2VsZWN0b3JzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPFVwZ3JhZGVEYXRhPiB7XG4gIC8qKiBSZXF1aXJlZCB1cGdyYWRlIGNoYW5nZXMgZm9yIHNwZWNpZmllZCB0YXJnZXQgdmVyc2lvbi4gKi9cbiAgZGF0YSA9IGdldFZlcnNpb25VcGdyYWRlRGF0YSh0aGlzLCAnYXR0cmlidXRlU2VsZWN0b3JzJyk7XG5cbiAgLy8gT25seSBlbmFibGUgdGhlIG1pZ3JhdGlvbiBydWxlIGlmIHRoZXJlIGlzIHVwZ3JhZGUgZGF0YS5cbiAgZW5hYmxlZDogYm9vbGVhbiA9IHRoaXMuZGF0YS5sZW5ndGggIT09IDA7XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpIHtcbiAgICBpZiAodHMuaXNTdHJpbmdMaXRlcmFsTGlrZShub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRTdHJpbmdMaXRlcmFsTGlrZShub2RlKTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKSB7XG4gICAgdGhpcy5kYXRhLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgZmluZEFsbFN1YnN0cmluZ0luZGljZXModGVtcGxhdGUuY29udGVudCwgc2VsZWN0b3IucmVwbGFjZSlcbiAgICAgICAgLm1hcChvZmZzZXQgPT4gdGVtcGxhdGUuc3RhcnQgKyBvZmZzZXQpXG4gICAgICAgIC5mb3JFYWNoKHN0YXJ0ID0+IHRoaXMuX3JlcGxhY2VTZWxlY3Rvcih0ZW1wbGF0ZS5maWxlUGF0aCwgc3RhcnQsIHNlbGVjdG9yKSk7XG4gICAgfSk7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdFN0eWxlc2hlZXQoc3R5bGVzaGVldDogUmVzb2x2ZWRSZXNvdXJjZSk6IHZvaWQge1xuICAgIHRoaXMuZGF0YS5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvciA9IGBbJHtzZWxlY3Rvci5yZXBsYWNlfV1gO1xuICAgICAgY29uc3QgdXBkYXRlZFNlbGVjdG9yID0gYFske3NlbGVjdG9yLnJlcGxhY2VXaXRofV1gO1xuXG4gICAgICBmaW5kQWxsU3Vic3RyaW5nSW5kaWNlcyhzdHlsZXNoZWV0LmNvbnRlbnQsIGN1cnJlbnRTZWxlY3RvcilcbiAgICAgICAgLm1hcChvZmZzZXQgPT4gc3R5bGVzaGVldC5zdGFydCArIG9mZnNldClcbiAgICAgICAgLmZvckVhY2goc3RhcnQgPT5cbiAgICAgICAgICB0aGlzLl9yZXBsYWNlU2VsZWN0b3Ioc3R5bGVzaGVldC5maWxlUGF0aCwgc3RhcnQsIHtcbiAgICAgICAgICAgIHJlcGxhY2U6IGN1cnJlbnRTZWxlY3RvcixcbiAgICAgICAgICAgIHJlcGxhY2VXaXRoOiB1cGRhdGVkU2VsZWN0b3IsXG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdFN0cmluZ0xpdGVyYWxMaWtlKGxpdGVyYWw6IHRzLlN0cmluZ0xpdGVyYWxMaWtlKSB7XG4gICAgaWYgKGxpdGVyYWwucGFyZW50ICYmIGxpdGVyYWwucGFyZW50LmtpbmQgIT09IHRzLlN5bnRheEtpbmQuQ2FsbEV4cHJlc3Npb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXRlcmFsVGV4dCA9IGxpdGVyYWwuZ2V0VGV4dCgpO1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUobGl0ZXJhbC5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuXG4gICAgdGhpcy5kYXRhLmZvckVhY2goc2VsZWN0b3IgPT4ge1xuICAgICAgZmluZEFsbFN1YnN0cmluZ0luZGljZXMobGl0ZXJhbFRleHQsIHNlbGVjdG9yLnJlcGxhY2UpXG4gICAgICAgIC5tYXAob2Zmc2V0ID0+IGxpdGVyYWwuZ2V0U3RhcnQoKSArIG9mZnNldClcbiAgICAgICAgLmZvckVhY2goc3RhcnQgPT4gdGhpcy5fcmVwbGFjZVNlbGVjdG9yKGZpbGVQYXRoLCBzdGFydCwgc2VsZWN0b3IpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlcGxhY2VTZWxlY3RvcihcbiAgICBmaWxlUGF0aDogV29ya3NwYWNlUGF0aCxcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIGRhdGE6IEF0dHJpYnV0ZVNlbGVjdG9yVXBncmFkZURhdGEsXG4gICkge1xuICAgIHRoaXMuZmlsZVN5c3RlbVxuICAgICAgLmVkaXQoZmlsZVBhdGgpXG4gICAgICAucmVtb3ZlKHN0YXJ0LCBkYXRhLnJlcGxhY2UubGVuZ3RoKVxuICAgICAgLmluc2VydFJpZ2h0KHN0YXJ0LCBkYXRhLnJlcGxhY2VXaXRoKTtcbiAgfVxufVxuIl19