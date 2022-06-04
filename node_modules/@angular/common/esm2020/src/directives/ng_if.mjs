/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef, ViewContainerRef, ɵstringify as stringify } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A structural directive that conditionally includes a template based on the value of
 * an expression coerced to Boolean.
 * When the expression evaluates to true, Angular renders the template
 * provided in a `then` clause, and when  false or null,
 * Angular renders the template provided in an optional `else` clause. The default
 * template for the `else` clause is blank.
 *
 * A [shorthand form](guide/structural-directives#asterisk) of the directive,
 * `*ngIf="condition"`, is generally used, provided
 * as an attribute of the anchor element for the inserted template.
 * Angular expands this into a more explicit version, in which the anchor element
 * is contained in an `<ng-template>` element.
 *
 * Simple form with shorthand syntax:
 *
 * ```
 * <div *ngIf="condition">Content to render when condition is true.</div>
 * ```
 *
 * Simple form with expanded syntax:
 *
 * ```
 * <ng-template [ngIf]="condition"><div>Content to render when condition is
 * true.</div></ng-template>
 * ```
 *
 * Form with an "else" block:
 *
 * ```
 * <div *ngIf="condition; else elseBlock">Content to render when condition is true.</div>
 * <ng-template #elseBlock>Content to render when condition is false.</ng-template>
 * ```
 *
 * Shorthand form with "then" and "else" blocks:
 *
 * ```
 * <div *ngIf="condition; then thenBlock else elseBlock"></div>
 * <ng-template #thenBlock>Content to render when condition is true.</ng-template>
 * <ng-template #elseBlock>Content to render when condition is false.</ng-template>
 * ```
 *
 * Form with storing the value locally:
 *
 * ```
 * <div *ngIf="condition as value; else elseBlock">{{value}}</div>
 * <ng-template #elseBlock>Content to render when value is null.</ng-template>
 * ```
 *
 * @usageNotes
 *
 * The `*ngIf` directive is most commonly used to conditionally show an inline template,
 * as seen in the following  example.
 * The default `else` template is blank.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfSimple'}
 *
 * ### Showing an alternative template using `else`
 *
 * To display a template when `expression` evaluates to false, use an `else` template
 * binding as shown in the following example.
 * The `else` binding points to an `<ng-template>`  element labeled `#elseBlock`.
 * The template can be defined anywhere in the component view, but is typically placed right after
 * `ngIf` for readability.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfElse'}
 *
 * ### Using an external `then` template
 *
 * In the previous example, the then-clause template is specified inline, as the content of the
 * tag that contains the `ngIf` directive. You can also specify a template that is defined
 * externally, by referencing a labeled `<ng-template>` element. When you do this, you can
 * change which template to use at runtime, as shown in the following example.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfThenElse'}
 *
 * ### Storing a conditional result in a variable
 *
 * You might want to show a set of properties from the same object. If you are waiting
 * for asynchronous data, the object can be undefined.
 * In this case, you can use `ngIf` and store the result of the condition in a local
 * variable as shown in the following example.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfAs'}
 *
 * This code uses only one `AsyncPipe`, so only one subscription is created.
 * The conditional statement stores the result of `userStream|async` in the local variable `user`.
 * You can then bind the local `user` repeatedly.
 *
 * The conditional displays the data only if `userStream` returns a value,
 * so you don't need to use the
 * safe-navigation-operator (`?.`)
 * to guard against null values when accessing properties.
 * You can display an alternative template while waiting for the data.
 *
 * ### Shorthand syntax
 *
 * The shorthand syntax `*ngIf` expands into two separate template specifications
 * for the "then" and "else" clauses. For example, consider the following shorthand statement,
 * that is meant to show a loading page while waiting for data to be loaded.
 *
 * ```
 * <div class="hero-list" *ngIf="heroes else loading">
 *  ...
 * </div>
 *
 * <ng-template #loading>
 *  <div>Loading...</div>
 * </ng-template>
 * ```
 *
 * You can see that the "else" clause references the `<ng-template>`
 * with the `#loading` label, and the template for the "then" clause
 * is provided as the content of the anchor element.
 *
 * However, when Angular expands the shorthand syntax, it creates
 * another `<ng-template>` tag, with `ngIf` and `ngIfElse` directives.
 * The anchor element containing the template for the "then" clause becomes
 * the content of this unlabeled `<ng-template>` tag.
 *
 * ```
 * <ng-template [ngIf]="heroes" [ngIfElse]="loading">
 *  <div class="hero-list">
 *   ...
 *  </div>
 * </ng-template>
 *
 * <ng-template #loading>
 *  <div>Loading...</div>
 * </ng-template>
 * ```
 *
 * The presence of the implicit template object has implications for the nesting of
 * structural directives. For more on this subject, see
 * [Structural Directives](guide/structural-directives#one-per-element).
 *
 * @ngModule CommonModule
 * @publicApi
 */
export class NgIf {
    constructor(_viewContainer, templateRef) {
        this._viewContainer = _viewContainer;
        this._context = new NgIfContext();
        this._thenTemplateRef = null;
        this._elseTemplateRef = null;
        this._thenViewRef = null;
        this._elseViewRef = null;
        this._thenTemplateRef = templateRef;
    }
    /**
     * The Boolean expression to evaluate as the condition for showing a template.
     */
    set ngIf(condition) {
        this._context.$implicit = this._context.ngIf = condition;
        this._updateView();
    }
    /**
     * A template to show if the condition expression evaluates to true.
     */
    set ngIfThen(templateRef) {
        assertTemplate('ngIfThen', templateRef);
        this._thenTemplateRef = templateRef;
        this._thenViewRef = null; // clear previous view if any.
        this._updateView();
    }
    /**
     * A template to show if the condition expression evaluates to false.
     */
    set ngIfElse(templateRef) {
        assertTemplate('ngIfElse', templateRef);
        this._elseTemplateRef = templateRef;
        this._elseViewRef = null; // clear previous view if any.
        this._updateView();
    }
    _updateView() {
        if (this._context.$implicit) {
            if (!this._thenViewRef) {
                this._viewContainer.clear();
                this._elseViewRef = null;
                if (this._thenTemplateRef) {
                    this._thenViewRef =
                        this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
                }
            }
        }
        else {
            if (!this._elseViewRef) {
                this._viewContainer.clear();
                this._thenViewRef = null;
                if (this._elseTemplateRef) {
                    this._elseViewRef =
                        this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
                }
            }
        }
    }
    /**
     * Asserts the correct type of the context for the template that `NgIf` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `NgIf` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(dir, ctx) {
        return true;
    }
}
NgIf.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgIf, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgIf.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgIf, selector: "[ngIf]", inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgIf, decorators: [{
            type: Directive,
            args: [{ selector: '[ngIf]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }]; }, propDecorators: { ngIf: [{
                type: Input
            }], ngIfThen: [{
                type: Input
            }], ngIfElse: [{
                type: Input
            }] } });
/**
 * @publicApi
 */
export class NgIfContext {
    constructor() {
        this.$implicit = null;
        this.ngIf = null;
    }
}
function assertTemplate(property, templateRef) {
    const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
    if (!isTemplateRefOrNull) {
        throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfaWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2RpcmVjdGl2ZXMvbmdfaWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBbUIsS0FBSyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLElBQUksU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUd4SDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMElHO0FBRUgsTUFBTSxPQUFPLElBQUk7SUFPZixZQUFvQixjQUFnQyxFQUFFLFdBQXdDO1FBQTFFLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQU41QyxhQUFRLEdBQW1CLElBQUksV0FBVyxFQUFLLENBQUM7UUFDaEQscUJBQWdCLEdBQXFDLElBQUksQ0FBQztRQUMxRCxxQkFBZ0IsR0FBcUMsSUFBSSxDQUFDO1FBQzFELGlCQUFZLEdBQXlDLElBQUksQ0FBQztRQUMxRCxpQkFBWSxHQUF5QyxJQUFJLENBQUM7UUFHaEUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLElBQUksQ0FBQyxTQUFZO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFDSSxRQUFRLENBQUMsV0FBNkM7UUFDeEQsY0FBYyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUUsOEJBQThCO1FBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFFBQVEsQ0FBQyxXQUE2QztRQUN4RCxjQUFjLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7UUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBRSw4QkFBOEI7UUFDekQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTyxXQUFXO1FBQ2pCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDekIsSUFBSSxDQUFDLFlBQVk7d0JBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNsRjthQUNGO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDekIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxZQUFZO3dCQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDbEY7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQWVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLHNCQUFzQixDQUFJLEdBQVksRUFBRSxHQUFRO1FBRXJELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzs7NEdBdEZVLElBQUk7Z0dBQUosSUFBSTtzR0FBSixJQUFJO2tCQURoQixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQztpSUFnQnpCLElBQUk7c0JBRFAsS0FBSztnQkFVRixRQUFRO3NCQURYLEtBQUs7Z0JBWUYsUUFBUTtzQkFEWCxLQUFLOztBQXVEUjs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBQXhCO1FBQ1MsY0FBUyxHQUFNLElBQUssQ0FBQztRQUNyQixTQUFJLEdBQU0sSUFBSyxDQUFDO0lBQ3pCLENBQUM7Q0FBQTtBQUVELFNBQVMsY0FBYyxDQUFDLFFBQWdCLEVBQUUsV0FBa0M7SUFDMUUsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFFBQVEseUNBQXlDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakc7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbWJlZGRlZFZpZXdSZWYsIElucHV0LCBUZW1wbGF0ZVJlZiwgVmlld0NvbnRhaW5lclJlZiwgybVzdHJpbmdpZnkgYXMgc3RyaW5naWZ5fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG4vKipcbiAqIEEgc3RydWN0dXJhbCBkaXJlY3RpdmUgdGhhdCBjb25kaXRpb25hbGx5IGluY2x1ZGVzIGEgdGVtcGxhdGUgYmFzZWQgb24gdGhlIHZhbHVlIG9mXG4gKiBhbiBleHByZXNzaW9uIGNvZXJjZWQgdG8gQm9vbGVhbi5cbiAqIFdoZW4gdGhlIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIHRydWUsIEFuZ3VsYXIgcmVuZGVycyB0aGUgdGVtcGxhdGVcbiAqIHByb3ZpZGVkIGluIGEgYHRoZW5gIGNsYXVzZSwgYW5kIHdoZW4gIGZhbHNlIG9yIG51bGwsXG4gKiBBbmd1bGFyIHJlbmRlcnMgdGhlIHRlbXBsYXRlIHByb3ZpZGVkIGluIGFuIG9wdGlvbmFsIGBlbHNlYCBjbGF1c2UuIFRoZSBkZWZhdWx0XG4gKiB0ZW1wbGF0ZSBmb3IgdGhlIGBlbHNlYCBjbGF1c2UgaXMgYmxhbmsuXG4gKlxuICogQSBbc2hvcnRoYW5kIGZvcm1dKGd1aWRlL3N0cnVjdHVyYWwtZGlyZWN0aXZlcyNhc3Rlcmlzaykgb2YgdGhlIGRpcmVjdGl2ZSxcbiAqIGAqbmdJZj1cImNvbmRpdGlvblwiYCwgaXMgZ2VuZXJhbGx5IHVzZWQsIHByb3ZpZGVkXG4gKiBhcyBhbiBhdHRyaWJ1dGUgb2YgdGhlIGFuY2hvciBlbGVtZW50IGZvciB0aGUgaW5zZXJ0ZWQgdGVtcGxhdGUuXG4gKiBBbmd1bGFyIGV4cGFuZHMgdGhpcyBpbnRvIGEgbW9yZSBleHBsaWNpdCB2ZXJzaW9uLCBpbiB3aGljaCB0aGUgYW5jaG9yIGVsZW1lbnRcbiAqIGlzIGNvbnRhaW5lZCBpbiBhbiBgPG5nLXRlbXBsYXRlPmAgZWxlbWVudC5cbiAqXG4gKiBTaW1wbGUgZm9ybSB3aXRoIHNob3J0aGFuZCBzeW50YXg6XG4gKlxuICogYGBgXG4gKiA8ZGl2ICpuZ0lmPVwiY29uZGl0aW9uXCI+Q29udGVudCB0byByZW5kZXIgd2hlbiBjb25kaXRpb24gaXMgdHJ1ZS48L2Rpdj5cbiAqIGBgYFxuICpcbiAqIFNpbXBsZSBmb3JtIHdpdGggZXhwYW5kZWQgc3ludGF4OlxuICpcbiAqIGBgYFxuICogPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImNvbmRpdGlvblwiPjxkaXY+Q29udGVudCB0byByZW5kZXIgd2hlbiBjb25kaXRpb24gaXNcbiAqIHRydWUuPC9kaXY+PC9uZy10ZW1wbGF0ZT5cbiAqIGBgYFxuICpcbiAqIEZvcm0gd2l0aCBhbiBcImVsc2VcIiBibG9jazpcbiAqXG4gKiBgYGBcbiAqIDxkaXYgKm5nSWY9XCJjb25kaXRpb247IGVsc2UgZWxzZUJsb2NrXCI+Q29udGVudCB0byByZW5kZXIgd2hlbiBjb25kaXRpb24gaXMgdHJ1ZS48L2Rpdj5cbiAqIDxuZy10ZW1wbGF0ZSAjZWxzZUJsb2NrPkNvbnRlbnQgdG8gcmVuZGVyIHdoZW4gY29uZGl0aW9uIGlzIGZhbHNlLjwvbmctdGVtcGxhdGU+XG4gKiBgYGBcbiAqXG4gKiBTaG9ydGhhbmQgZm9ybSB3aXRoIFwidGhlblwiIGFuZCBcImVsc2VcIiBibG9ja3M6XG4gKlxuICogYGBgXG4gKiA8ZGl2ICpuZ0lmPVwiY29uZGl0aW9uOyB0aGVuIHRoZW5CbG9jayBlbHNlIGVsc2VCbG9ja1wiPjwvZGl2PlxuICogPG5nLXRlbXBsYXRlICN0aGVuQmxvY2s+Q29udGVudCB0byByZW5kZXIgd2hlbiBjb25kaXRpb24gaXMgdHJ1ZS48L25nLXRlbXBsYXRlPlxuICogPG5nLXRlbXBsYXRlICNlbHNlQmxvY2s+Q29udGVudCB0byByZW5kZXIgd2hlbiBjb25kaXRpb24gaXMgZmFsc2UuPC9uZy10ZW1wbGF0ZT5cbiAqIGBgYFxuICpcbiAqIEZvcm0gd2l0aCBzdG9yaW5nIHRoZSB2YWx1ZSBsb2NhbGx5OlxuICpcbiAqIGBgYFxuICogPGRpdiAqbmdJZj1cImNvbmRpdGlvbiBhcyB2YWx1ZTsgZWxzZSBlbHNlQmxvY2tcIj57e3ZhbHVlfX08L2Rpdj5cbiAqIDxuZy10ZW1wbGF0ZSAjZWxzZUJsb2NrPkNvbnRlbnQgdG8gcmVuZGVyIHdoZW4gdmFsdWUgaXMgbnVsbC48L25nLXRlbXBsYXRlPlxuICogYGBgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUaGUgYCpuZ0lmYCBkaXJlY3RpdmUgaXMgbW9zdCBjb21tb25seSB1c2VkIHRvIGNvbmRpdGlvbmFsbHkgc2hvdyBhbiBpbmxpbmUgdGVtcGxhdGUsXG4gKiBhcyBzZWVuIGluIHRoZSBmb2xsb3dpbmcgIGV4YW1wbGUuXG4gKiBUaGUgZGVmYXVsdCBgZWxzZWAgdGVtcGxhdGUgaXMgYmxhbmsuXG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9uZ0lmL3RzL21vZHVsZS50cyByZWdpb249J05nSWZTaW1wbGUnfVxuICpcbiAqICMjIyBTaG93aW5nIGFuIGFsdGVybmF0aXZlIHRlbXBsYXRlIHVzaW5nIGBlbHNlYFxuICpcbiAqIFRvIGRpc3BsYXkgYSB0ZW1wbGF0ZSB3aGVuIGBleHByZXNzaW9uYCBldmFsdWF0ZXMgdG8gZmFsc2UsIHVzZSBhbiBgZWxzZWAgdGVtcGxhdGVcbiAqIGJpbmRpbmcgYXMgc2hvd24gaW4gdGhlIGZvbGxvd2luZyBleGFtcGxlLlxuICogVGhlIGBlbHNlYCBiaW5kaW5nIHBvaW50cyB0byBhbiBgPG5nLXRlbXBsYXRlPmAgIGVsZW1lbnQgbGFiZWxlZCBgI2Vsc2VCbG9ja2AuXG4gKiBUaGUgdGVtcGxhdGUgY2FuIGJlIGRlZmluZWQgYW55d2hlcmUgaW4gdGhlIGNvbXBvbmVudCB2aWV3LCBidXQgaXMgdHlwaWNhbGx5IHBsYWNlZCByaWdodCBhZnRlclxuICogYG5nSWZgIGZvciByZWFkYWJpbGl0eS5cbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL25nSWYvdHMvbW9kdWxlLnRzIHJlZ2lvbj0nTmdJZkVsc2UnfVxuICpcbiAqICMjIyBVc2luZyBhbiBleHRlcm5hbCBgdGhlbmAgdGVtcGxhdGVcbiAqXG4gKiBJbiB0aGUgcHJldmlvdXMgZXhhbXBsZSwgdGhlIHRoZW4tY2xhdXNlIHRlbXBsYXRlIGlzIHNwZWNpZmllZCBpbmxpbmUsIGFzIHRoZSBjb250ZW50IG9mIHRoZVxuICogdGFnIHRoYXQgY29udGFpbnMgdGhlIGBuZ0lmYCBkaXJlY3RpdmUuIFlvdSBjYW4gYWxzbyBzcGVjaWZ5IGEgdGVtcGxhdGUgdGhhdCBpcyBkZWZpbmVkXG4gKiBleHRlcm5hbGx5LCBieSByZWZlcmVuY2luZyBhIGxhYmVsZWQgYDxuZy10ZW1wbGF0ZT5gIGVsZW1lbnQuIFdoZW4geW91IGRvIHRoaXMsIHlvdSBjYW5cbiAqIGNoYW5nZSB3aGljaCB0ZW1wbGF0ZSB0byB1c2UgYXQgcnVudGltZSwgYXMgc2hvd24gaW4gdGhlIGZvbGxvd2luZyBleGFtcGxlLlxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vbmdJZi90cy9tb2R1bGUudHMgcmVnaW9uPSdOZ0lmVGhlbkVsc2UnfVxuICpcbiAqICMjIyBTdG9yaW5nIGEgY29uZGl0aW9uYWwgcmVzdWx0IGluIGEgdmFyaWFibGVcbiAqXG4gKiBZb3UgbWlnaHQgd2FudCB0byBzaG93IGEgc2V0IG9mIHByb3BlcnRpZXMgZnJvbSB0aGUgc2FtZSBvYmplY3QuIElmIHlvdSBhcmUgd2FpdGluZ1xuICogZm9yIGFzeW5jaHJvbm91cyBkYXRhLCB0aGUgb2JqZWN0IGNhbiBiZSB1bmRlZmluZWQuXG4gKiBJbiB0aGlzIGNhc2UsIHlvdSBjYW4gdXNlIGBuZ0lmYCBhbmQgc3RvcmUgdGhlIHJlc3VsdCBvZiB0aGUgY29uZGl0aW9uIGluIGEgbG9jYWxcbiAqIHZhcmlhYmxlIGFzIHNob3duIGluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZS5cbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL25nSWYvdHMvbW9kdWxlLnRzIHJlZ2lvbj0nTmdJZkFzJ31cbiAqXG4gKiBUaGlzIGNvZGUgdXNlcyBvbmx5IG9uZSBgQXN5bmNQaXBlYCwgc28gb25seSBvbmUgc3Vic2NyaXB0aW9uIGlzIGNyZWF0ZWQuXG4gKiBUaGUgY29uZGl0aW9uYWwgc3RhdGVtZW50IHN0b3JlcyB0aGUgcmVzdWx0IG9mIGB1c2VyU3RyZWFtfGFzeW5jYCBpbiB0aGUgbG9jYWwgdmFyaWFibGUgYHVzZXJgLlxuICogWW91IGNhbiB0aGVuIGJpbmQgdGhlIGxvY2FsIGB1c2VyYCByZXBlYXRlZGx5LlxuICpcbiAqIFRoZSBjb25kaXRpb25hbCBkaXNwbGF5cyB0aGUgZGF0YSBvbmx5IGlmIGB1c2VyU3RyZWFtYCByZXR1cm5zIGEgdmFsdWUsXG4gKiBzbyB5b3UgZG9uJ3QgbmVlZCB0byB1c2UgdGhlXG4gKiBzYWZlLW5hdmlnYXRpb24tb3BlcmF0b3IgKGA/LmApXG4gKiB0byBndWFyZCBhZ2FpbnN0IG51bGwgdmFsdWVzIHdoZW4gYWNjZXNzaW5nIHByb3BlcnRpZXMuXG4gKiBZb3UgY2FuIGRpc3BsYXkgYW4gYWx0ZXJuYXRpdmUgdGVtcGxhdGUgd2hpbGUgd2FpdGluZyBmb3IgdGhlIGRhdGEuXG4gKlxuICogIyMjIFNob3J0aGFuZCBzeW50YXhcbiAqXG4gKiBUaGUgc2hvcnRoYW5kIHN5bnRheCBgKm5nSWZgIGV4cGFuZHMgaW50byB0d28gc2VwYXJhdGUgdGVtcGxhdGUgc3BlY2lmaWNhdGlvbnNcbiAqIGZvciB0aGUgXCJ0aGVuXCIgYW5kIFwiZWxzZVwiIGNsYXVzZXMuIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGUgZm9sbG93aW5nIHNob3J0aGFuZCBzdGF0ZW1lbnQsXG4gKiB0aGF0IGlzIG1lYW50IHRvIHNob3cgYSBsb2FkaW5nIHBhZ2Ugd2hpbGUgd2FpdGluZyBmb3IgZGF0YSB0byBiZSBsb2FkZWQuXG4gKlxuICogYGBgXG4gKiA8ZGl2IGNsYXNzPVwiaGVyby1saXN0XCIgKm5nSWY9XCJoZXJvZXMgZWxzZSBsb2FkaW5nXCI+XG4gKiAgLi4uXG4gKiA8L2Rpdj5cbiAqXG4gKiA8bmctdGVtcGxhdGUgI2xvYWRpbmc+XG4gKiAgPGRpdj5Mb2FkaW5nLi4uPC9kaXY+XG4gKiA8L25nLXRlbXBsYXRlPlxuICogYGBgXG4gKlxuICogWW91IGNhbiBzZWUgdGhhdCB0aGUgXCJlbHNlXCIgY2xhdXNlIHJlZmVyZW5jZXMgdGhlIGA8bmctdGVtcGxhdGU+YFxuICogd2l0aCB0aGUgYCNsb2FkaW5nYCBsYWJlbCwgYW5kIHRoZSB0ZW1wbGF0ZSBmb3IgdGhlIFwidGhlblwiIGNsYXVzZVxuICogaXMgcHJvdmlkZWQgYXMgdGhlIGNvbnRlbnQgb2YgdGhlIGFuY2hvciBlbGVtZW50LlxuICpcbiAqIEhvd2V2ZXIsIHdoZW4gQW5ndWxhciBleHBhbmRzIHRoZSBzaG9ydGhhbmQgc3ludGF4LCBpdCBjcmVhdGVzXG4gKiBhbm90aGVyIGA8bmctdGVtcGxhdGU+YCB0YWcsIHdpdGggYG5nSWZgIGFuZCBgbmdJZkVsc2VgIGRpcmVjdGl2ZXMuXG4gKiBUaGUgYW5jaG9yIGVsZW1lbnQgY29udGFpbmluZyB0aGUgdGVtcGxhdGUgZm9yIHRoZSBcInRoZW5cIiBjbGF1c2UgYmVjb21lc1xuICogdGhlIGNvbnRlbnQgb2YgdGhpcyB1bmxhYmVsZWQgYDxuZy10ZW1wbGF0ZT5gIHRhZy5cbiAqXG4gKiBgYGBcbiAqIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCJoZXJvZXNcIiBbbmdJZkVsc2VdPVwibG9hZGluZ1wiPlxuICogIDxkaXYgY2xhc3M9XCJoZXJvLWxpc3RcIj5cbiAqICAgLi4uXG4gKiAgPC9kaXY+XG4gKiA8L25nLXRlbXBsYXRlPlxuICpcbiAqIDxuZy10ZW1wbGF0ZSAjbG9hZGluZz5cbiAqICA8ZGl2PkxvYWRpbmcuLi48L2Rpdj5cbiAqIDwvbmctdGVtcGxhdGU+XG4gKiBgYGBcbiAqXG4gKiBUaGUgcHJlc2VuY2Ugb2YgdGhlIGltcGxpY2l0IHRlbXBsYXRlIG9iamVjdCBoYXMgaW1wbGljYXRpb25zIGZvciB0aGUgbmVzdGluZyBvZlxuICogc3RydWN0dXJhbCBkaXJlY3RpdmVzLiBGb3IgbW9yZSBvbiB0aGlzIHN1YmplY3QsIHNlZVxuICogW1N0cnVjdHVyYWwgRGlyZWN0aXZlc10oZ3VpZGUvc3RydWN0dXJhbC1kaXJlY3RpdmVzI29uZS1wZXItZWxlbWVudCkuXG4gKlxuICogQG5nTW9kdWxlIENvbW1vbk1vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ0lmXSd9KVxuZXhwb3J0IGNsYXNzIE5nSWY8VCA9IHVua25vd24+IHtcbiAgcHJpdmF0ZSBfY29udGV4dDogTmdJZkNvbnRleHQ8VD4gPSBuZXcgTmdJZkNvbnRleHQ8VD4oKTtcbiAgcHJpdmF0ZSBfdGhlblRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ0lmQ29udGV4dDxUPj58bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2Vsc2VUZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TmdJZkNvbnRleHQ8VD4+fG51bGwgPSBudWxsO1xuICBwcml2YXRlIF90aGVuVmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPE5nSWZDb250ZXh0PFQ+PnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfZWxzZVZpZXdSZWY6IEVtYmVkZGVkVmlld1JlZjxOZ0lmQ29udGV4dDxUPj58bnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZiwgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nSWZDb250ZXh0PFQ+Pikge1xuICAgIHRoaXMuX3RoZW5UZW1wbGF0ZVJlZiA9IHRlbXBsYXRlUmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBCb29sZWFuIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUgYXMgdGhlIGNvbmRpdGlvbiBmb3Igc2hvd2luZyBhIHRlbXBsYXRlLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG5nSWYoY29uZGl0aW9uOiBUKSB7XG4gICAgdGhpcy5fY29udGV4dC4kaW1wbGljaXQgPSB0aGlzLl9jb250ZXh0Lm5nSWYgPSBjb25kaXRpb247XG4gICAgdGhpcy5fdXBkYXRlVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgdGVtcGxhdGUgdG8gc2hvdyBpZiB0aGUgY29uZGl0aW9uIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIHRydWUuXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbmdJZlRoZW4odGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nSWZDb250ZXh0PFQ+PnxudWxsKSB7XG4gICAgYXNzZXJ0VGVtcGxhdGUoJ25nSWZUaGVuJywgdGVtcGxhdGVSZWYpO1xuICAgIHRoaXMuX3RoZW5UZW1wbGF0ZVJlZiA9IHRlbXBsYXRlUmVmO1xuICAgIHRoaXMuX3RoZW5WaWV3UmVmID0gbnVsbDsgIC8vIGNsZWFyIHByZXZpb3VzIHZpZXcgaWYgYW55LlxuICAgIHRoaXMuX3VwZGF0ZVZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHRlbXBsYXRlIHRvIHNob3cgaWYgdGhlIGNvbmRpdGlvbiBleHByZXNzaW9uIGV2YWx1YXRlcyB0byBmYWxzZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBuZ0lmRWxzZSh0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TmdJZkNvbnRleHQ8VD4+fG51bGwpIHtcbiAgICBhc3NlcnRUZW1wbGF0ZSgnbmdJZkVsc2UnLCB0ZW1wbGF0ZVJlZik7XG4gICAgdGhpcy5fZWxzZVRlbXBsYXRlUmVmID0gdGVtcGxhdGVSZWY7XG4gICAgdGhpcy5fZWxzZVZpZXdSZWYgPSBudWxsOyAgLy8gY2xlYXIgcHJldmlvdXMgdmlldyBpZiBhbnkuXG4gICAgdGhpcy5fdXBkYXRlVmlldygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVmlldygpIHtcbiAgICBpZiAodGhpcy5fY29udGV4dC4kaW1wbGljaXQpIHtcbiAgICAgIGlmICghdGhpcy5fdGhlblZpZXdSZWYpIHtcbiAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgICAgICB0aGlzLl9lbHNlVmlld1JlZiA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl90aGVuVGVtcGxhdGVSZWYpIHtcbiAgICAgICAgICB0aGlzLl90aGVuVmlld1JlZiA9XG4gICAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RoZW5UZW1wbGF0ZVJlZiwgdGhpcy5fY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLl9lbHNlVmlld1JlZikge1xuICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX3RoZW5WaWV3UmVmID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuX2Vsc2VUZW1wbGF0ZVJlZikge1xuICAgICAgICAgIHRoaXMuX2Vsc2VWaWV3UmVmID1cbiAgICAgICAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5fZWxzZVRlbXBsYXRlUmVmLCB0aGlzLl9jb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIHN0YXRpYyBuZ0lmVXNlSWZUeXBlR3VhcmQ6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGUgY29ycmVjdCB0eXBlIG9mIHRoZSBleHByZXNzaW9uIGJvdW5kIHRvIHRoZSBgbmdJZmAgaW5wdXQgd2l0aGluIHRoZSB0ZW1wbGF0ZS5cbiAgICpcbiAgICogVGhlIHByZXNlbmNlIG9mIHRoaXMgc3RhdGljIGZpZWxkIGlzIGEgc2lnbmFsIHRvIHRoZSBJdnkgdGVtcGxhdGUgdHlwZSBjaGVjayBjb21waWxlciB0aGF0XG4gICAqIHdoZW4gdGhlIGBOZ0lmYCBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZSByZW5kZXJzIGl0cyB0ZW1wbGF0ZSwgdGhlIHR5cGUgb2YgdGhlIGV4cHJlc3Npb24gYm91bmRcbiAgICogdG8gYG5nSWZgIHNob3VsZCBiZSBuYXJyb3dlZCBpbiBzb21lIHdheS4gRm9yIGBOZ0lmYCwgdGhlIGJpbmRpbmcgZXhwcmVzc2lvbiBpdHNlbGYgaXMgdXNlZCB0b1xuICAgKiBuYXJyb3cgaXRzIHR5cGUsIHdoaWNoIGFsbG93cyB0aGUgc3RyaWN0TnVsbENoZWNrcyBmZWF0dXJlIG9mIFR5cGVTY3JpcHQgdG8gd29yayB3aXRoIGBOZ0lmYC5cbiAgICovXG4gIHN0YXRpYyBuZ1RlbXBsYXRlR3VhcmRfbmdJZjogJ2JpbmRpbmcnO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoZSBjb3JyZWN0IHR5cGUgb2YgdGhlIGNvbnRleHQgZm9yIHRoZSB0ZW1wbGF0ZSB0aGF0IGBOZ0lmYCB3aWxsIHJlbmRlci5cbiAgICpcbiAgICogVGhlIHByZXNlbmNlIG9mIHRoaXMgbWV0aG9kIGlzIGEgc2lnbmFsIHRvIHRoZSBJdnkgdGVtcGxhdGUgdHlwZS1jaGVjayBjb21waWxlciB0aGF0IHRoZVxuICAgKiBgTmdJZmAgc3RydWN0dXJhbCBkaXJlY3RpdmUgcmVuZGVycyBpdHMgdGVtcGxhdGUgd2l0aCBhIHNwZWNpZmljIGNvbnRleHQgdHlwZS5cbiAgICovXG4gIHN0YXRpYyBuZ1RlbXBsYXRlQ29udGV4dEd1YXJkPFQ+KGRpcjogTmdJZjxUPiwgY3R4OiBhbnkpOlxuICAgICAgY3R4IGlzIE5nSWZDb250ZXh0PEV4Y2x1ZGU8VCwgZmFsc2V8MHwnJ3xudWxsfHVuZGVmaW5lZD4+IHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIE5nSWZDb250ZXh0PFQgPSB1bmtub3duPiB7XG4gIHB1YmxpYyAkaW1wbGljaXQ6IFQgPSBudWxsITtcbiAgcHVibGljIG5nSWY6IFQgPSBudWxsITtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0VGVtcGxhdGUocHJvcGVydHk6IHN0cmluZywgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT58bnVsbCk6IHZvaWQge1xuICBjb25zdCBpc1RlbXBsYXRlUmVmT3JOdWxsID0gISEoIXRlbXBsYXRlUmVmIHx8IHRlbXBsYXRlUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyk7XG4gIGlmICghaXNUZW1wbGF0ZVJlZk9yTnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtwcm9wZXJ0eX0gbXVzdCBiZSBhIFRlbXBsYXRlUmVmLCBidXQgcmVjZWl2ZWQgJyR7c3RyaW5naWZ5KHRlbXBsYXRlUmVmKX0nLmApO1xuICB9XG59XG4iXX0=