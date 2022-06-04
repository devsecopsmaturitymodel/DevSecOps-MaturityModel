"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RippleSpeedFactorMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
const ripple_speed_factor_1 = require("./ripple-speed-factor");
/** Regular expression that matches [matRippleSpeedFactor]="$NUMBER" in templates. */
const speedFactorNumberRegex = /\[matRippleSpeedFactor]="(\d+(?:\.\d+)?)"/g;
/** Regular expression that matches [matRippleSpeedFactor]="$NOT_A_NUMBER" in templates. */
const speedFactorNotParseable = /\[matRippleSpeedFactor]="(?!\d+(?:\.\d+)?")(.*)"/g;
/**
 * Note that will be added whenever a speed factor expression has been converted to calculate
 * the according duration. This note should encourage people to clean up their code by switching
 * away from the speed factors to explicit durations.
 */
const removeNote = `TODO: Cleanup duration calculation.`;
/**
 * Migration that walks through every property assignment and switches the global `baseSpeedFactor`
 * ripple option to the new global animation config. Also updates every class member assignment
 * that refers to MatRipple#speedFactor.
 */
class RippleSpeedFactorMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 7 as the ripple
        // speed factor has been removed in that version.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V7;
    }
    visitNode(node) {
        if (ts.isBinaryExpression(node)) {
            this._visitBinaryExpression(node);
        }
        else if (ts.isPropertyAssignment(node)) {
            this._visitPropertyAssignment(node);
        }
    }
    visitTemplate(template) {
        let match;
        while ((match = speedFactorNumberRegex.exec(template.content)) !== null) {
            const newEnterDuration = (0, ripple_speed_factor_1.convertSpeedFactorToDuration)(parseFloat(match[1]));
            this._replaceText(template.filePath, template.start + match.index, match[0].length, `[matRippleAnimation]="{enterDuration: ${newEnterDuration}}"`);
        }
        while ((match = speedFactorNotParseable.exec(template.content)) !== null) {
            const newDurationExpression = (0, ripple_speed_factor_1.createSpeedFactorConvertExpression)(match[1]);
            this._replaceText(template.filePath, template.start + match.index, match[0].length, `[matRippleAnimation]="{enterDuration: (${newDurationExpression})}"`);
        }
    }
    /** Switches binary expressions (e.g. myRipple.speedFactor = 0.5) to the new animation config. */
    _visitBinaryExpression(expression) {
        if (!ts.isPropertyAccessExpression(expression.left)) {
            return;
        }
        // Left side expression consists of target object and property name (e.g. myInstance.val)
        const leftExpression = expression.left;
        const targetTypeNode = this.typeChecker.getTypeAtLocation(leftExpression.expression);
        if (!targetTypeNode.symbol) {
            return;
        }
        const targetTypeName = targetTypeNode.symbol.getName();
        const propertyName = leftExpression.name.getText();
        const filePath = this.fileSystem.resolve(leftExpression.getSourceFile().fileName);
        if (targetTypeName === 'MatRipple' && propertyName === 'speedFactor') {
            if (ts.isNumericLiteral(expression.right)) {
                const numericValue = parseFloat(expression.right.text);
                const newEnterDurationValue = (0, ripple_speed_factor_1.convertSpeedFactorToDuration)(numericValue);
                // Replace the `speedFactor` property name with `animation`.
                this._replaceText(filePath, leftExpression.name.getStart(), leftExpression.name.getWidth(), 'animation');
                // Replace the value assignment with the new animation config.
                this._replaceText(filePath, expression.right.getStart(), expression.right.getWidth(), `{enterDuration: ${newEnterDurationValue}}`);
            }
            else {
                // Handle the right expression differently if the previous speed factor value can't
                // be resolved statically. In that case, we just create a TypeScript expression that
                // calculates the explicit duration based on the non-static speed factor expression.
                const newExpression = (0, ripple_speed_factor_1.createSpeedFactorConvertExpression)(expression.right.getText());
                // Replace the `speedFactor` property name with `animation`.
                this._replaceText(filePath, leftExpression.name.getStart(), leftExpression.name.getWidth(), 'animation');
                // Replace the value assignment with the new animation config and remove TODO.
                this._replaceText(filePath, expression.right.getStart(), expression.right.getWidth(), `/** ${removeNote} */ {enterDuration: ${newExpression}}`);
            }
        }
    }
    /**
     * Switches the global option `baseSpeedFactor` to the new animation config. For this
     * we assume that the `baseSpeedFactor` is not used in combination with individual
     * speed factors.
     */
    _visitPropertyAssignment(assignment) {
        // For switching the `baseSpeedFactor` global option we expect the property assignment
        // to be inside of a normal object literal. Custom ripple global options cannot be
        // witched automatically.
        if (!ts.isObjectLiteralExpression(assignment.parent)) {
            return;
        }
        // The assignment consists of a name (key) and initializer (value).
        if (assignment.name.getText() !== 'baseSpeedFactor') {
            return;
        }
        // We could technically lazily check for the MAT_RIPPLE_GLOBAL_OPTIONS injection token to
        // be present, but it's not right to assume that everyone sets the ripple global options
        // immediately in the provider object (e.g. it can happen that someone just imports the
        // config from a separate file).
        const { initializer, name } = assignment;
        const filePath = this.fileSystem.resolve(assignment.getSourceFile().fileName);
        if (ts.isNumericLiteral(initializer)) {
            const numericValue = parseFloat(initializer.text);
            const newEnterDurationValue = (0, ripple_speed_factor_1.convertSpeedFactorToDuration)(numericValue);
            // Replace the `baseSpeedFactor` property name with `animation`.
            this._replaceText(filePath, name.getStart(), name.getWidth(), 'animation');
            // Replace the value assignment initializer with the new animation config.
            this._replaceText(filePath, initializer.getStart(), initializer.getWidth(), `{enterDuration: ${newEnterDurationValue}}`);
        }
        else {
            // Handle the right expression differently if the previous speed factor value can't
            // be resolved statically. In that case, we just create a TypeScript expression that
            // calculates the explicit duration based on the non-static speed factor expression.
            const newExpression = (0, ripple_speed_factor_1.createSpeedFactorConvertExpression)(initializer.getText());
            // Replace the `baseSpeedFactor` property name with `animation`.
            this._replaceText(filePath, name.getStart(), name.getWidth(), 'animation');
            // Replace the value assignment with the new animation config and remove TODO.
            this._replaceText(filePath, initializer.getStart(), initializer.getWidth(), `/** ${removeNote} */ {enterDuration: ${newExpression}}`);
        }
    }
    _replaceText(filePath, start, width, newText) {
        const recorder = this.fileSystem.edit(filePath);
        recorder.remove(start, width);
        recorder.insertRight(start, newText);
    }
}
exports.RippleSpeedFactorMigration = RippleSpeedFactorMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXNwZWVkLWZhY3Rvci1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9taXNjLXJpcHBsZXMtdjcvcmlwcGxlLXNwZWVkLWZhY3Rvci1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWtHO0FBQ2xHLGlDQUFpQztBQUNqQywrREFHK0I7QUFFL0IscUZBQXFGO0FBQ3JGLE1BQU0sc0JBQXNCLEdBQUcsNENBQTRDLENBQUM7QUFFNUUsMkZBQTJGO0FBQzNGLE1BQU0sdUJBQXVCLEdBQUcsbURBQW1ELENBQUM7QUFFcEY7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxHQUFHLHFDQUFxQyxDQUFDO0FBRXpEOzs7O0dBSUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLHNCQUFlO0lBQS9EOztRQUNFLHlFQUF5RTtRQUN6RSxpREFBaUQ7UUFDakQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFpS3BELENBQUM7SUEvSlUsU0FBUyxDQUFDLElBQWE7UUFDOUIsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO2FBQU0sSUFBSSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVRLGFBQWEsQ0FBQyxRQUEwQjtRQUMvQyxJQUFJLEtBQThCLENBQUM7UUFFbkMsT0FBTyxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8s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UmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb24sIFJlc29sdmVkUmVzb3VyY2UsIFRhcmdldFZlcnNpb24sIFdvcmtzcGFjZVBhdGh9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHtcbiAgY29udmVydFNwZWVkRmFjdG9yVG9EdXJhdGlvbixcbiAgY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbixcbn0gZnJvbSAnLi9yaXBwbGUtc3BlZWQtZmFjdG9yJztcblxuLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG1hdGNoZXMgW21hdFJpcHBsZVNwZWVkRmFjdG9yXT1cIiROVU1CRVJcIiBpbiB0ZW1wbGF0ZXMuICovXG5jb25zdCBzcGVlZEZhY3Rvck51bWJlclJlZ2V4ID0gL1xcW21hdFJpcHBsZVNwZWVkRmFjdG9yXT1cIihcXGQrKD86XFwuXFxkKyk/KVwiL2c7XG5cbi8qKiBSZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtYXRjaGVzIFttYXRSaXBwbGVTcGVlZEZhY3Rvcl09XCIkTk9UX0FfTlVNQkVSXCIgaW4gdGVtcGxhdGVzLiAqL1xuY29uc3Qgc3BlZWRGYWN0b3JOb3RQYXJzZWFibGUgPSAvXFxbbWF0UmlwcGxlU3BlZWRGYWN0b3JdPVwiKD8hXFxkKyg/OlxcLlxcZCspP1wiKSguKilcIi9nO1xuXG4vKipcbiAqIE5vdGUgdGhhdCB3aWxsIGJlIGFkZGVkIHdoZW5ldmVyIGEgc3BlZWQgZmFjdG9yIGV4cHJlc3Npb24gaGFzIGJlZW4gY29udmVydGVkIHRvIGNhbGN1bGF0ZVxuICogdGhlIGFjY29yZGluZyBkdXJhdGlvbi4gVGhpcyBub3RlIHNob3VsZCBlbmNvdXJhZ2UgcGVvcGxlIHRvIGNsZWFuIHVwIHRoZWlyIGNvZGUgYnkgc3dpdGNoaW5nXG4gKiBhd2F5IGZyb20gdGhlIHNwZWVkIGZhY3RvcnMgdG8gZXhwbGljaXQgZHVyYXRpb25zLlxuICovXG5jb25zdCByZW1vdmVOb3RlID0gYFRPRE86IENsZWFudXAgZHVyYXRpb24gY2FsY3VsYXRpb24uYDtcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCB3YWxrcyB0aHJvdWdoIGV2ZXJ5IHByb3BlcnR5IGFzc2lnbm1lbnQgYW5kIHN3aXRjaGVzIHRoZSBnbG9iYWwgYGJhc2VTcGVlZEZhY3RvcmBcbiAqIHJpcHBsZSBvcHRpb24gdG8gdGhlIG5ldyBnbG9iYWwgYW5pbWF0aW9uIGNvbmZpZy4gQWxzbyB1cGRhdGVzIGV2ZXJ5IGNsYXNzIG1lbWJlciBhc3NpZ25tZW50XG4gKiB0aGF0IHJlZmVycyB0byBNYXRSaXBwbGUjc3BlZWRGYWN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBSaXBwbGVTcGVlZEZhY3Rvck1pZ3JhdGlvbiBleHRlbmRzIE1pZ3JhdGlvbjxudWxsPiB7XG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA3IGFzIHRoZSByaXBwbGVcbiAgLy8gc3BlZWQgZmFjdG9yIGhhcyBiZWVuIHJlbW92ZWQgaW4gdGhhdCB2ZXJzaW9uLlxuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY3O1xuXG4gIG92ZXJyaWRlIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQobm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0UHJvcGVydHlBc3NpZ25tZW50KG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXkgfCBudWxsO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHNwZWVkRmFjdG9yTnVtYmVyUmVnZXguZXhlYyh0ZW1wbGF0ZS5jb250ZW50KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IG5ld0VudGVyRHVyYXRpb24gPSBjb252ZXJ0U3BlZWRGYWN0b3JUb0R1cmF0aW9uKHBhcnNlRmxvYXQobWF0Y2hbMV0pKTtcblxuICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgIHRlbXBsYXRlLmZpbGVQYXRoLFxuICAgICAgICB0ZW1wbGF0ZS5zdGFydCArIG1hdGNoLmluZGV4ISxcbiAgICAgICAgbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICBgW21hdFJpcHBsZUFuaW1hdGlvbl09XCJ7ZW50ZXJEdXJhdGlvbjogJHtuZXdFbnRlckR1cmF0aW9ufX1cImAsXG4gICAgICApO1xuICAgIH1cblxuICAgIHdoaWxlICgobWF0Y2ggPSBzcGVlZEZhY3Rvck5vdFBhcnNlYWJsZS5leGVjKHRlbXBsYXRlLmNvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3RHVyYXRpb25FeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihtYXRjaFsxXSk7XG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgdGVtcGxhdGUuZmlsZVBhdGgsXG4gICAgICAgIHRlbXBsYXRlLnN0YXJ0ICsgbWF0Y2guaW5kZXghLFxuICAgICAgICBtYXRjaFswXS5sZW5ndGgsXG4gICAgICAgIGBbbWF0UmlwcGxlQW5pbWF0aW9uXT1cIntlbnRlckR1cmF0aW9uOiAoJHtuZXdEdXJhdGlvbkV4cHJlc3Npb259KX1cImAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTd2l0Y2hlcyBiaW5hcnkgZXhwcmVzc2lvbnMgKGUuZy4gbXlSaXBwbGUuc3BlZWRGYWN0b3IgPSAwLjUpIHRvIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZy4gKi9cbiAgcHJpdmF0ZSBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGV4cHJlc3Npb246IHRzLkJpbmFyeUV4cHJlc3Npb24pIHtcbiAgICBpZiAoIXRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKGV4cHJlc3Npb24ubGVmdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMZWZ0IHNpZGUgZXhwcmVzc2lvbiBjb25zaXN0cyBvZiB0YXJnZXQgb2JqZWN0IGFuZCBwcm9wZXJ0eSBuYW1lIChlLmcuIG15SW5zdGFuY2UudmFsKVxuICAgIGNvbnN0IGxlZnRFeHByZXNzaW9uID0gZXhwcmVzc2lvbi5sZWZ0IGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgICBjb25zdCB0YXJnZXRUeXBlTm9kZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24obGVmdEV4cHJlc3Npb24uZXhwcmVzc2lvbik7XG5cbiAgICBpZiAoIXRhcmdldFR5cGVOb2RlLnN5bWJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldFR5cGVOYW1lID0gdGFyZ2V0VHlwZU5vZGUuc3ltYm9sLmdldE5hbWUoKTtcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFRleHQoKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKGxlZnRFeHByZXNzaW9uLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSk7XG5cbiAgICBpZiAodGFyZ2V0VHlwZU5hbWUgPT09ICdNYXRSaXBwbGUnICYmIHByb3BlcnR5TmFtZSA9PT0gJ3NwZWVkRmFjdG9yJykge1xuICAgICAgaWYgKHRzLmlzTnVtZXJpY0xpdGVyYWwoZXhwcmVzc2lvbi5yaWdodCkpIHtcbiAgICAgICAgY29uc3QgbnVtZXJpY1ZhbHVlID0gcGFyc2VGbG9hdChleHByZXNzaW9uLnJpZ2h0LnRleHQpO1xuICAgICAgICBjb25zdCBuZXdFbnRlckR1cmF0aW9uVmFsdWUgPSBjb252ZXJ0U3BlZWRGYWN0b3JUb0R1cmF0aW9uKG51bWVyaWNWYWx1ZSk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYHNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIGxlZnRFeHByZXNzaW9uLm5hbWUuZ2V0U3RhcnQoKSxcbiAgICAgICAgICBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFdpZHRoKCksXG4gICAgICAgICAgJ2FuaW1hdGlvbicsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgYXNzaWdubWVudCB3aXRoIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZy5cbiAgICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgZXhwcmVzc2lvbi5yaWdodC5nZXRTdGFydCgpLFxuICAgICAgICAgIGV4cHJlc3Npb24ucmlnaHQuZ2V0V2lkdGgoKSxcbiAgICAgICAgICBge2VudGVyRHVyYXRpb246ICR7bmV3RW50ZXJEdXJhdGlvblZhbHVlfX1gLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlIHRoZSByaWdodCBleHByZXNzaW9uIGRpZmZlcmVudGx5IGlmIHRoZSBwcmV2aW91cyBzcGVlZCBmYWN0b3IgdmFsdWUgY2FuJ3RcbiAgICAgICAgLy8gYmUgcmVzb2x2ZWQgc3RhdGljYWxseS4gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGNyZWF0ZSBhIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAgICAgIC8vIGNhbGN1bGF0ZXMgdGhlIGV4cGxpY2l0IGR1cmF0aW9uIGJhc2VkIG9uIHRoZSBub24tc3RhdGljIHNwZWVkIGZhY3RvciBleHByZXNzaW9uLlxuICAgICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihleHByZXNzaW9uLnJpZ2h0LmdldFRleHQoKSk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYHNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIGxlZnRFeHByZXNzaW9uLm5hbWUuZ2V0U3RhcnQoKSxcbiAgICAgICAgICBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFdpZHRoKCksXG4gICAgICAgICAgJ2FuaW1hdGlvbicsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgYXNzaWdubWVudCB3aXRoIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZyBhbmQgcmVtb3ZlIFRPRE8uXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICAgIGV4cHJlc3Npb24ucmlnaHQuZ2V0U3RhcnQoKSxcbiAgICAgICAgICBleHByZXNzaW9uLnJpZ2h0LmdldFdpZHRoKCksXG4gICAgICAgICAgYC8qKiAke3JlbW92ZU5vdGV9ICovIHtlbnRlckR1cmF0aW9uOiAke25ld0V4cHJlc3Npb259fWAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN3aXRjaGVzIHRoZSBnbG9iYWwgb3B0aW9uIGBiYXNlU3BlZWRGYWN0b3JgIHRvIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZy4gRm9yIHRoaXNcbiAgICogd2UgYXNzdW1lIHRoYXQgdGhlIGBiYXNlU3BlZWRGYWN0b3JgIGlzIG5vdCB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggaW5kaXZpZHVhbFxuICAgKiBzcGVlZCBmYWN0b3JzLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmlzaXRQcm9wZXJ0eUFzc2lnbm1lbnQoYXNzaWdubWVudDogdHMuUHJvcGVydHlBc3NpZ25tZW50KSB7XG4gICAgLy8gRm9yIHN3aXRjaGluZyB0aGUgYGJhc2VTcGVlZEZhY3RvcmAgZ2xvYmFsIG9wdGlvbiB3ZSBleHBlY3QgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnRcbiAgICAvLyB0byBiZSBpbnNpZGUgb2YgYSBub3JtYWwgb2JqZWN0IGxpdGVyYWwuIEN1c3RvbSByaXBwbGUgZ2xvYmFsIG9wdGlvbnMgY2Fubm90IGJlXG4gICAgLy8gd2l0Y2hlZCBhdXRvbWF0aWNhbGx5LlxuICAgIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihhc3NpZ25tZW50LnBhcmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgYXNzaWdubWVudCBjb25zaXN0cyBvZiBhIG5hbWUgKGtleSkgYW5kIGluaXRpYWxpemVyICh2YWx1ZSkuXG4gICAgaWYgKGFzc2lnbm1lbnQubmFtZS5nZXRUZXh0KCkgIT09ICdiYXNlU3BlZWRGYWN0b3InKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2UgY291bGQgdGVjaG5pY2FsbHkgbGF6aWx5IGNoZWNrIGZvciB0aGUgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyBpbmplY3Rpb24gdG9rZW4gdG9cbiAgICAvLyBiZSBwcmVzZW50LCBidXQgaXQncyBub3QgcmlnaHQgdG8gYXNzdW1lIHRoYXQgZXZlcnlvbmUgc2V0cyB0aGUgcmlwcGxlIGdsb2JhbCBvcHRpb25zXG4gICAgLy8gaW1tZWRpYXRlbHkgaW4gdGhlIHByb3ZpZGVyIG9iamVjdCAoZS5nLiBpdCBjYW4gaGFwcGVuIHRoYXQgc29tZW9uZSBqdXN0IGltcG9ydHMgdGhlXG4gICAgLy8gY29uZmlnIGZyb20gYSBzZXBhcmF0ZSBmaWxlKS5cblxuICAgIGNvbnN0IHtpbml0aWFsaXplciwgbmFtZX0gPSBhc3NpZ25tZW50O1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoYXNzaWdubWVudC5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuXG4gICAgaWYgKHRzLmlzTnVtZXJpY0xpdGVyYWwoaW5pdGlhbGl6ZXIpKSB7XG4gICAgICBjb25zdCBudW1lcmljVmFsdWUgPSBwYXJzZUZsb2F0KGluaXRpYWxpemVyLnRleHQpO1xuICAgICAgY29uc3QgbmV3RW50ZXJEdXJhdGlvblZhbHVlID0gY29udmVydFNwZWVkRmFjdG9yVG9EdXJhdGlvbihudW1lcmljVmFsdWUpO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChmaWxlUGF0aCwgbmFtZS5nZXRTdGFydCgpLCBuYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcbiAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIGFzc2lnbm1lbnQgaW5pdGlhbGl6ZXIgd2l0aCB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgIGluaXRpYWxpemVyLmdldFN0YXJ0KCksXG4gICAgICAgIGluaXRpYWxpemVyLmdldFdpZHRoKCksXG4gICAgICAgIGB7ZW50ZXJEdXJhdGlvbjogJHtuZXdFbnRlckR1cmF0aW9uVmFsdWV9fWAsXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIYW5kbGUgdGhlIHJpZ2h0IGV4cHJlc3Npb24gZGlmZmVyZW50bHkgaWYgdGhlIHByZXZpb3VzIHNwZWVkIGZhY3RvciB2YWx1ZSBjYW4ndFxuICAgICAgLy8gYmUgcmVzb2x2ZWQgc3RhdGljYWxseS4gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGNyZWF0ZSBhIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAgICAvLyBjYWxjdWxhdGVzIHRoZSBleHBsaWNpdCBkdXJhdGlvbiBiYXNlZCBvbiB0aGUgbm9uLXN0YXRpYyBzcGVlZCBmYWN0b3IgZXhwcmVzc2lvbi5cbiAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSBjcmVhdGVTcGVlZEZhY3RvckNvbnZlcnRFeHByZXNzaW9uKGluaXRpYWxpemVyLmdldFRleHQoKSk7XG5cbiAgICAgIC8vIFJlcGxhY2UgdGhlIGBiYXNlU3BlZWRGYWN0b3JgIHByb3BlcnR5IG5hbWUgd2l0aCBgYW5pbWF0aW9uYC5cbiAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KGZpbGVQYXRoLCBuYW1lLmdldFN0YXJ0KCksIG5hbWUuZ2V0V2lkdGgoKSwgJ2FuaW1hdGlvbicpO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSBhc3NpZ25tZW50IHdpdGggdGhlIG5ldyBhbmltYXRpb24gY29uZmlnIGFuZCByZW1vdmUgVE9ETy5cbiAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgaW5pdGlhbGl6ZXIuZ2V0U3RhcnQoKSxcbiAgICAgICAgaW5pdGlhbGl6ZXIuZ2V0V2lkdGgoKSxcbiAgICAgICAgYC8qKiAke3JlbW92ZU5vdGV9ICovIHtlbnRlckR1cmF0aW9uOiAke25ld0V4cHJlc3Npb259fWAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3JlcGxhY2VUZXh0KGZpbGVQYXRoOiBXb3Jrc3BhY2VQYXRoLCBzdGFydDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBuZXdUZXh0OiBzdHJpbmcpIHtcbiAgICBjb25zdCByZWNvcmRlciA9IHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKTtcbiAgICByZWNvcmRlci5yZW1vdmUoc3RhcnQsIHdpZHRoKTtcbiAgICByZWNvcmRlci5pbnNlcnRSaWdodChzdGFydCwgbmV3VGV4dCk7XG4gIH1cbn1cbiJdfQ==