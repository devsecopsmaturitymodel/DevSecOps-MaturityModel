/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, IterableDiffers, TemplateRef, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @publicApi
 */
export class NgForOfContext {
    constructor($implicit, ngForOf, index, count) {
        this.$implicit = $implicit;
        this.ngForOf = ngForOf;
        this.index = index;
        this.count = count;
    }
    get first() {
        return this.index === 0;
    }
    get last() {
        return this.index === this.count - 1;
    }
    get even() {
        return this.index % 2 === 0;
    }
    get odd() {
        return !this.even;
    }
}
/**
 * A [structural directive](guide/structural-directives) that renders
 * a template for each item in a collection.
 * The directive is placed on an element, which becomes the parent
 * of the cloned templates.
 *
 * The `ngForOf` directive is generally used in the
 * [shorthand form](guide/structural-directives#asterisk) `*ngFor`.
 * In this form, the template to be rendered for each iteration is the content
 * of an anchor element containing the directive.
 *
 * The following example shows the shorthand syntax with some options,
 * contained in an `<li>` element.
 *
 * ```
 * <li *ngFor="let item of items; index as i; trackBy: trackByFn">...</li>
 * ```
 *
 * The shorthand form expands into a long form that uses the `ngForOf` selector
 * on an `<ng-template>` element.
 * The content of the `<ng-template>` element is the `<li>` element that held the
 * short-form directive.
 *
 * Here is the expanded version of the short-form example.
 *
 * ```
 * <ng-template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
 *   <li>...</li>
 * </ng-template>
 * ```
 *
 * Angular automatically expands the shorthand syntax as it compiles the template.
 * The context for each embedded view is logically merged to the current component
 * context according to its lexical position.
 *
 * When using the shorthand syntax, Angular allows only [one structural directive
 * on an element](guide/structural-directives#one-per-element).
 * If you want to iterate conditionally, for example,
 * put the `*ngIf` on a container element that wraps the `*ngFor` element.
 * For futher discussion, see
 * [Structural Directives](guide/structural-directives#one-per-element).
 *
 * @usageNotes
 *
 * ### Local variables
 *
 * `NgForOf` provides exported values that can be aliased to local variables.
 * For example:
 *
 *  ```
 * <li *ngFor="let user of users; index as i; first as isFirst">
 *    {{i}}/{{users.length}}. {{user}} <span *ngIf="isFirst">default</span>
 * </li>
 * ```
 *
 * The following exported values can be aliased to local variables:
 *
 * - `$implicit: T`: The value of the individual items in the iterable (`ngForOf`).
 * - `ngForOf: NgIterable<T>`: The value of the iterable expression. Useful when the expression is
 * more complex then a property access, for example when using the async pipe (`userStreams |
 * async`).
 * - `index: number`: The index of the current item in the iterable.
 * - `count: number`: The length of the iterable.
 * - `first: boolean`: True when the item is the first item in the iterable.
 * - `last: boolean`: True when the item is the last item in the iterable.
 * - `even: boolean`: True when the item has an even index in the iterable.
 * - `odd: boolean`: True when the item has an odd index in the iterable.
 *
 * ### Change propagation
 *
 * When the contents of the iterator changes, `NgForOf` makes the corresponding changes to the DOM:
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 * * When an item is removed, its template instance is removed from the DOM.
 * * When items are reordered, their respective templates are reordered in the DOM.
 *
 * Angular uses object identity to track insertions and deletions within the iterator and reproduce
 * those changes in the DOM. This has important implications for animations and any stateful
 * controls that are present, such as `<input>` elements that accept user input. Inserted rows can
 * be animated in, deleted rows can be animated out, and unchanged rows retain any unsaved state
 * such as user input.
 * For more on animations, see [Transitions and Triggers](guide/transition-and-triggers).
 *
 * The identities of elements in the iterator can change while the data does not.
 * This can happen, for example, if the iterator is produced from an RPC to the server, and that
 * RPC is re-run. Even if the data hasn't changed, the second response produces objects with
 * different identities, and Angular must tear down the entire DOM and rebuild it (as if all old
 * elements were deleted and all new elements inserted).
 *
 * To avoid this expensive operation, you can customize the default tracking algorithm.
 * by supplying the `trackBy` option to `NgForOf`.
 * `trackBy` takes a function that has two arguments: `index` and `item`.
 * If `trackBy` is given, Angular tracks changes by the return value of the function.
 *
 * @see [Structural Directives](guide/structural-directives)
 * @ngModule CommonModule
 * @publicApi
 */
export class NgForOf {
    constructor(_viewContainer, _template, _differs) {
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this._ngForOf = null;
        this._ngForOfDirty = true;
        this._differ = null;
    }
    /**
     * The value of the iterable expression, which can be used as a
     * [template input variable](guide/structural-directives#shorthand).
     */
    set ngForOf(ngForOf) {
        this._ngForOf = ngForOf;
        this._ngForOfDirty = true;
    }
    /**
     * Specifies a custom `TrackByFunction` to compute the identity of items in an iterable.
     *
     * If a custom `TrackByFunction` is not provided, `NgForOf` will use the item's [object
     * identity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
     * as the key.
     *
     * `NgForOf` uses the computed key to associate items in an iterable with DOM elements
     * it produces for these items.
     *
     * A custom `TrackByFunction` is useful to provide good user experience in cases when items in an
     * iterable rendered using `NgForOf` have a natural identifier (for example, custom ID or a
     * primary key), and this iterable could be updated with new object instances that still
     * represent the same underlying entity (for example, when data is re-fetched from the server,
     * and the iterable is recreated and re-rendered, but most of the data is still the same).
     *
     * @see `TrackByFunction`
     */
    set ngForTrackBy(fn) {
        if ((typeof ngDevMode === 'undefined' || ngDevMode) && fn != null && typeof fn !== 'function') {
            // TODO(vicb): use a log service once there is a public one available
            if (console && console.warn) {
                console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
                    `See https://angular.io/api/common/NgForOf#change-propagation for more information.`);
            }
        }
        this._trackByFn = fn;
    }
    get ngForTrackBy() {
        return this._trackByFn;
    }
    /**
     * A reference to the template that is stamped out for each item in the iterable.
     * @see [template reference variable](guide/template-reference-variables)
     */
    set ngForTemplate(value) {
        // TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
        // The current type is too restrictive; a template that just uses index, for example,
        // should be acceptable.
        if (value) {
            this._template = value;
        }
    }
    /**
     * Applies the changes when needed.
     * @nodoc
     */
    ngDoCheck() {
        if (this._ngForOfDirty) {
            this._ngForOfDirty = false;
            // React on ngForOf changes only once all inputs have been initialized
            const value = this._ngForOf;
            if (!this._differ && value) {
                if (typeof ngDevMode === 'undefined' || ngDevMode) {
                    try {
                        // CAUTION: this logic is duplicated for production mode below, as the try-catch
                        // is only present in development builds.
                        this._differ = this._differs.find(value).create(this.ngForTrackBy);
                    }
                    catch {
                        throw new Error(`Cannot find a differ supporting object '${value}' of type '${getTypeName(value)}'. NgFor only supports binding to Iterables such as Arrays.`);
                    }
                }
                else {
                    // CAUTION: this logic is duplicated for development mode above, as the try-catch
                    // is only present in development builds.
                    this._differ = this._differs.find(value).create(this.ngForTrackBy);
                }
            }
        }
        if (this._differ) {
            const changes = this._differ.diff(this._ngForOf);
            if (changes)
                this._applyChanges(changes);
        }
    }
    _applyChanges(changes) {
        const viewContainer = this._viewContainer;
        changes.forEachOperation((item, adjustedPreviousIndex, currentIndex) => {
            if (item.previousIndex == null) {
                // NgForOf is never "null" or "undefined" here because the differ detected
                // that a new item needs to be inserted from the iterable. This implies that
                // there is an iterable value for "_ngForOf".
                viewContainer.createEmbeddedView(this._template, new NgForOfContext(item.item, this._ngForOf, -1, -1), currentIndex === null ? undefined : currentIndex);
            }
            else if (currentIndex == null) {
                viewContainer.remove(adjustedPreviousIndex === null ? undefined : adjustedPreviousIndex);
            }
            else if (adjustedPreviousIndex !== null) {
                const view = viewContainer.get(adjustedPreviousIndex);
                viewContainer.move(view, currentIndex);
                applyViewChange(view, item);
            }
        });
        for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
            const viewRef = viewContainer.get(i);
            const context = viewRef.context;
            context.index = i;
            context.count = ilen;
            context.ngForOf = this._ngForOf;
        }
        changes.forEachIdentityChange((record) => {
            const viewRef = viewContainer.get(record.currentIndex);
            applyViewChange(viewRef, record);
        });
    }
    /**
     * Asserts the correct type of the context for the template that `NgForOf` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `NgForOf` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(dir, ctx) {
        return true;
    }
}
NgForOf.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgForOf, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Directive });
NgForOf.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgForOf, selector: "[ngFor][ngForOf]", inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgForOf, decorators: [{
            type: Directive,
            args: [{ selector: '[ngFor][ngForOf]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i0.IterableDiffers }]; }, propDecorators: { ngForOf: [{
                type: Input
            }], ngForTrackBy: [{
                type: Input
            }], ngForTemplate: [{
                type: Input
            }] } });
function applyViewChange(view, record) {
    view.context.$implicit = record.item;
}
function getTypeName(type) {
    return type['name'] || typeof type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9yX29mLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX2Zvcl9vZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUE0QixLQUFLLEVBQXlELGVBQWUsRUFBYyxXQUFXLEVBQW1CLGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUU3TTs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQW1CLFNBQVksRUFBUyxPQUFVLEVBQVMsS0FBYSxFQUFTLEtBQWE7UUFBM0UsY0FBUyxHQUFULFNBQVMsQ0FBRztRQUFTLFlBQU8sR0FBUCxPQUFPLENBQUc7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUFHLENBQUM7SUFFbEcsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpR0c7QUFFSCxNQUFNLE9BQU8sT0FBTztJQW1EbEIsWUFDWSxjQUFnQyxFQUNoQyxTQUE0QyxFQUFV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QyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVMsQ0FBQztTQUNsQztRQUVELE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQzVDLE1BQU0sT0FBTyxHQUEwQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM5RixlQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLHNCQUFzQixDQUE2QixHQUFrQixFQUFFLEdBQVE7UUFFcEYsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOzsrR0FsSlUsT0FBTzttR0FBUCxPQUFPO3NHQUFQLE9BQU87a0JBRG5CLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsa0JBQWtCLEVBQUM7K0pBT25DLE9BQU87c0JBRFYsS0FBSztnQkF3QkYsWUFBWTtzQkFEZixLQUFLO2dCQWdDRixhQUFhO3NCQURoQixLQUFLOztBQTBGUixTQUFTLGVBQWUsQ0FDcEIsSUFBd0MsRUFBRSxNQUErQjtJQUMzRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFTO0lBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIERvQ2hlY2ssIEVtYmVkZGVkVmlld1JlZiwgSW5wdXQsIEl0ZXJhYmxlQ2hhbmdlUmVjb3JkLCBJdGVyYWJsZUNoYW5nZXMsIEl0ZXJhYmxlRGlmZmVyLCBJdGVyYWJsZURpZmZlcnMsIE5nSXRlcmFibGUsIFRlbXBsYXRlUmVmLCBUcmFja0J5RnVuY3Rpb24sIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIE5nRm9yT2ZDb250ZXh0PFQsIFUgZXh0ZW5kcyBOZ0l0ZXJhYmxlPFQ+ID0gTmdJdGVyYWJsZTxUPj4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgJGltcGxpY2l0OiBULCBwdWJsaWMgbmdGb3JPZjogVSwgcHVibGljIGluZGV4OiBudW1iZXIsIHB1YmxpYyBjb3VudDogbnVtYmVyKSB7fVxuXG4gIGdldCBmaXJzdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleCA9PT0gMDtcbiAgfVxuXG4gIGdldCBsYXN0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZGV4ID09PSB0aGlzLmNvdW50IC0gMTtcbiAgfVxuXG4gIGdldCBldmVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZGV4ICUgMiA9PT0gMDtcbiAgfVxuXG4gIGdldCBvZGQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmV2ZW47XG4gIH1cbn1cblxuLyoqXG4gKiBBIFtzdHJ1Y3R1cmFsIGRpcmVjdGl2ZV0oZ3VpZGUvc3RydWN0dXJhbC1kaXJlY3RpdmVzKSB0aGF0IHJlbmRlcnNcbiAqIGEgdGVtcGxhdGUgZm9yIGVhY2ggaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gKiBUaGUgZGlyZWN0aXZlIGlzIHBsYWNlZCBvbiBhbiBlbGVtZW50LCB3aGljaCBiZWNvbWVzIHRoZSBwYXJlbnRcbiAqIG9mIHRoZSBjbG9uZWQgdGVtcGxhdGVzLlxuICpcbiAqIFRoZSBgbmdGb3JPZmAgZGlyZWN0aXZlIGlzIGdlbmVyYWxseSB1c2VkIGluIHRoZVxuICogW3Nob3J0aGFuZCBmb3JtXShndWlkZS9zdHJ1Y3R1cmFsLWRpcmVjdGl2ZXMjYXN0ZXJpc2spIGAqbmdGb3JgLlxuICogSW4gdGhpcyBmb3JtLCB0aGUgdGVtcGxhdGUgdG8gYmUgcmVuZGVyZWQgZm9yIGVhY2ggaXRlcmF0aW9uIGlzIHRoZSBjb250ZW50XG4gKiBvZiBhbiBhbmNob3IgZWxlbWVudCBjb250YWluaW5nIHRoZSBkaXJlY3RpdmUuXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHRoZSBzaG9ydGhhbmQgc3ludGF4IHdpdGggc29tZSBvcHRpb25zLFxuICogY29udGFpbmVkIGluIGFuIGA8bGk+YCBlbGVtZW50LlxuICpcbiAqIGBgYFxuICogPGxpICpuZ0Zvcj1cImxldCBpdGVtIG9mIGl0ZW1zOyBpbmRleCBhcyBpOyB0cmFja0J5OiB0cmFja0J5Rm5cIj4uLi48L2xpPlxuICogYGBgXG4gKlxuICogVGhlIHNob3J0aGFuZCBmb3JtIGV4cGFuZHMgaW50byBhIGxvbmcgZm9ybSB0aGF0IHVzZXMgdGhlIGBuZ0Zvck9mYCBzZWxlY3RvclxuICogb24gYW4gYDxuZy10ZW1wbGF0ZT5gIGVsZW1lbnQuXG4gKiBUaGUgY29udGVudCBvZiB0aGUgYDxuZy10ZW1wbGF0ZT5gIGVsZW1lbnQgaXMgdGhlIGA8bGk+YCBlbGVtZW50IHRoYXQgaGVsZCB0aGVcbiAqIHNob3J0LWZvcm0gZGlyZWN0aXZlLlxuICpcbiAqIEhlcmUgaXMgdGhlIGV4cGFuZGVkIHZlcnNpb24gb2YgdGhlIHNob3J0LWZvcm0gZXhhbXBsZS5cbiAqXG4gKiBgYGBcbiAqIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtaXRlbSBbbmdGb3JPZl09XCJpdGVtc1wiIGxldC1pPVwiaW5kZXhcIiBbbmdGb3JUcmFja0J5XT1cInRyYWNrQnlGblwiPlxuICogICA8bGk+Li4uPC9saT5cbiAqIDwvbmctdGVtcGxhdGU+XG4gKiBgYGBcbiAqXG4gKiBBbmd1bGFyIGF1dG9tYXRpY2FsbHkgZXhwYW5kcyB0aGUgc2hvcnRoYW5kIHN5bnRheCBhcyBpdCBjb21waWxlcyB0aGUgdGVtcGxhdGUuXG4gKiBUaGUgY29udGV4dCBmb3IgZWFjaCBlbWJlZGRlZCB2aWV3IGlzIGxvZ2ljYWxseSBtZXJnZWQgdG8gdGhlIGN1cnJlbnQgY29tcG9uZW50XG4gKiBjb250ZXh0IGFjY29yZGluZyB0byBpdHMgbGV4aWNhbCBwb3NpdGlvbi5cbiAqXG4gKiBXaGVuIHVzaW5nIHRoZSBzaG9ydGhhbmQgc3ludGF4LCBBbmd1bGFyIGFsbG93cyBvbmx5IFtvbmUgc3RydWN0dXJhbCBkaXJlY3RpdmVcbiAqIG9uIGFuIGVsZW1lbnRdKGd1aWRlL3N0cnVjdHVyYWwtZGlyZWN0aXZlcyNvbmUtcGVyLWVsZW1lbnQpLlxuICogSWYgeW91IHdhbnQgdG8gaXRlcmF0ZSBjb25kaXRpb25hbGx5LCBmb3IgZXhhbXBsZSxcbiAqIHB1dCB0aGUgYCpuZ0lmYCBvbiBhIGNvbnRhaW5lciBlbGVtZW50IHRoYXQgd3JhcHMgdGhlIGAqbmdGb3JgIGVsZW1lbnQuXG4gKiBGb3IgZnV0aGVyIGRpc2N1c3Npb24sIHNlZVxuICogW1N0cnVjdHVyYWwgRGlyZWN0aXZlc10oZ3VpZGUvc3RydWN0dXJhbC1kaXJlY3RpdmVzI29uZS1wZXItZWxlbWVudCkuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgTG9jYWwgdmFyaWFibGVzXG4gKlxuICogYE5nRm9yT2ZgIHByb3ZpZGVzIGV4cG9ydGVkIHZhbHVlcyB0aGF0IGNhbiBiZSBhbGlhc2VkIHRvIGxvY2FsIHZhcmlhYmxlcy5cbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICBgYGBcbiAqIDxsaSAqbmdGb3I9XCJsZXQgdXNlciBvZiB1c2VyczsgaW5kZXggYXMgaTsgZmlyc3QgYXMgaXNGaXJzdFwiPlxuICogICAge3tpfX0ve3t1c2Vycy5sZW5ndGh9fS4ge3t1c2VyfX0gPHNwYW4gKm5nSWY9XCJpc0ZpcnN0XCI+ZGVmYXVsdDwvc3Bhbj5cbiAqIDwvbGk+XG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4cG9ydGVkIHZhbHVlcyBjYW4gYmUgYWxpYXNlZCB0byBsb2NhbCB2YXJpYWJsZXM6XG4gKlxuICogLSBgJGltcGxpY2l0OiBUYDogVGhlIHZhbHVlIG9mIHRoZSBpbmRpdmlkdWFsIGl0ZW1zIGluIHRoZSBpdGVyYWJsZSAoYG5nRm9yT2ZgKS5cbiAqIC0gYG5nRm9yT2Y6IE5nSXRlcmFibGU8VD5gOiBUaGUgdmFsdWUgb2YgdGhlIGl0ZXJhYmxlIGV4cHJlc3Npb24uIFVzZWZ1bCB3aGVuIHRoZSBleHByZXNzaW9uIGlzXG4gKiBtb3JlIGNvbXBsZXggdGhlbiBhIHByb3BlcnR5IGFjY2VzcywgZm9yIGV4YW1wbGUgd2hlbiB1c2luZyB0aGUgYXN5bmMgcGlwZSAoYHVzZXJTdHJlYW1zIHxcbiAqIGFzeW5jYCkuXG4gKiAtIGBpbmRleDogbnVtYmVyYDogVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IGl0ZW0gaW4gdGhlIGl0ZXJhYmxlLlxuICogLSBgY291bnQ6IG51bWJlcmA6IFRoZSBsZW5ndGggb2YgdGhlIGl0ZXJhYmxlLlxuICogLSBgZmlyc3Q6IGJvb2xlYW5gOiBUcnVlIHdoZW4gdGhlIGl0ZW0gaXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGl0ZXJhYmxlLlxuICogLSBgbGFzdDogYm9vbGVhbmA6IFRydWUgd2hlbiB0aGUgaXRlbSBpcyB0aGUgbGFzdCBpdGVtIGluIHRoZSBpdGVyYWJsZS5cbiAqIC0gYGV2ZW46IGJvb2xlYW5gOiBUcnVlIHdoZW4gdGhlIGl0ZW0gaGFzIGFuIGV2ZW4gaW5kZXggaW4gdGhlIGl0ZXJhYmxlLlxuICogLSBgb2RkOiBib29sZWFuYDogVHJ1ZSB3aGVuIHRoZSBpdGVtIGhhcyBhbiBvZGQgaW5kZXggaW4gdGhlIGl0ZXJhYmxlLlxuICpcbiAqICMjIyBDaGFuZ2UgcHJvcGFnYXRpb25cbiAqXG4gKiBXaGVuIHRoZSBjb250ZW50cyBvZiB0aGUgaXRlcmF0b3IgY2hhbmdlcywgYE5nRm9yT2ZgIG1ha2VzIHRoZSBjb3JyZXNwb25kaW5nIGNoYW5nZXMgdG8gdGhlIERPTTpcbiAqXG4gKiAqIFdoZW4gYW4gaXRlbSBpcyBhZGRlZCwgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHRlbXBsYXRlIGlzIGFkZGVkIHRvIHRoZSBET00uXG4gKiAqIFdoZW4gYW4gaXRlbSBpcyByZW1vdmVkLCBpdHMgdGVtcGxhdGUgaW5zdGFuY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET00uXG4gKiAqIFdoZW4gaXRlbXMgYXJlIHJlb3JkZXJlZCwgdGhlaXIgcmVzcGVjdGl2ZSB0ZW1wbGF0ZXMgYXJlIHJlb3JkZXJlZCBpbiB0aGUgRE9NLlxuICpcbiAqIEFuZ3VsYXIgdXNlcyBvYmplY3QgaWRlbnRpdHkgdG8gdHJhY2sgaW5zZXJ0aW9ucyBhbmQgZGVsZXRpb25zIHdpdGhpbiB0aGUgaXRlcmF0b3IgYW5kIHJlcHJvZHVjZVxuICogdGhvc2UgY2hhbmdlcyBpbiB0aGUgRE9NLiBUaGlzIGhhcyBpbXBvcnRhbnQgaW1wbGljYXRpb25zIGZvciBhbmltYXRpb25zIGFuZCBhbnkgc3RhdGVmdWxcbiAqIGNvbnRyb2xzIHRoYXQgYXJlIHByZXNlbnQsIHN1Y2ggYXMgYDxpbnB1dD5gIGVsZW1lbnRzIHRoYXQgYWNjZXB0IHVzZXIgaW5wdXQuIEluc2VydGVkIHJvd3MgY2FuXG4gKiBiZSBhbmltYXRlZCBpbiwgZGVsZXRlZCByb3dzIGNhbiBiZSBhbmltYXRlZCBvdXQsIGFuZCB1bmNoYW5nZWQgcm93cyByZXRhaW4gYW55IHVuc2F2ZWQgc3RhdGVcbiAqIHN1Y2ggYXMgdXNlciBpbnB1dC5cbiAqIEZvciBtb3JlIG9uIGFuaW1hdGlvbnMsIHNlZSBbVHJhbnNpdGlvbnMgYW5kIFRyaWdnZXJzXShndWlkZS90cmFuc2l0aW9uLWFuZC10cmlnZ2VycykuXG4gKlxuICogVGhlIGlkZW50aXRpZXMgb2YgZWxlbWVudHMgaW4gdGhlIGl0ZXJhdG9yIGNhbiBjaGFuZ2Ugd2hpbGUgdGhlIGRhdGEgZG9lcyBub3QuXG4gKiBUaGlzIGNhbiBoYXBwZW4sIGZvciBleGFtcGxlLCBpZiB0aGUgaXRlcmF0b3IgaXMgcHJvZHVjZWQgZnJvbSBhbiBSUEMgdG8gdGhlIHNlcnZlciwgYW5kIHRoYXRcbiAqIFJQQyBpcyByZS1ydW4uIEV2ZW4gaWYgdGhlIGRhdGEgaGFzbid0IGNoYW5nZWQsIHRoZSBzZWNvbmQgcmVzcG9uc2UgcHJvZHVjZXMgb2JqZWN0cyB3aXRoXG4gKiBkaWZmZXJlbnQgaWRlbnRpdGllcywgYW5kIEFuZ3VsYXIgbXVzdCB0ZWFyIGRvd24gdGhlIGVudGlyZSBET00gYW5kIHJlYnVpbGQgaXQgKGFzIGlmIGFsbCBvbGRcbiAqIGVsZW1lbnRzIHdlcmUgZGVsZXRlZCBhbmQgYWxsIG5ldyBlbGVtZW50cyBpbnNlcnRlZCkuXG4gKlxuICogVG8gYXZvaWQgdGhpcyBleHBlbnNpdmUgb3BlcmF0aW9uLCB5b3UgY2FuIGN1c3RvbWl6ZSB0aGUgZGVmYXVsdCB0cmFja2luZyBhbGdvcml0aG0uXG4gKiBieSBzdXBwbHlpbmcgdGhlIGB0cmFja0J5YCBvcHRpb24gdG8gYE5nRm9yT2ZgLlxuICogYHRyYWNrQnlgIHRha2VzIGEgZnVuY3Rpb24gdGhhdCBoYXMgdHdvIGFyZ3VtZW50czogYGluZGV4YCBhbmQgYGl0ZW1gLlxuICogSWYgYHRyYWNrQnlgIGlzIGdpdmVuLCBBbmd1bGFyIHRyYWNrcyBjaGFuZ2VzIGJ5IHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uLlxuICpcbiAqIEBzZWUgW1N0cnVjdHVyYWwgRGlyZWN0aXZlc10oZ3VpZGUvc3RydWN0dXJhbC1kaXJlY3RpdmVzKVxuICogQG5nTW9kdWxlIENvbW1vbk1vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ0Zvcl1bbmdGb3JPZl0nfSlcbmV4cG9ydCBjbGFzcyBOZ0Zvck9mPFQsIFUgZXh0ZW5kcyBOZ0l0ZXJhYmxlPFQ+ID0gTmdJdGVyYWJsZTxUPj4gaW1wbGVtZW50cyBEb0NoZWNrIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgaXRlcmFibGUgZXhwcmVzc2lvbiwgd2hpY2ggY2FuIGJlIHVzZWQgYXMgYVxuICAgKiBbdGVtcGxhdGUgaW5wdXQgdmFyaWFibGVdKGd1aWRlL3N0cnVjdHVyYWwtZGlyZWN0aXZlcyNzaG9ydGhhbmQpLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG5nRm9yT2YobmdGb3JPZjogVSZOZ0l0ZXJhYmxlPFQ+fHVuZGVmaW5lZHxudWxsKSB7XG4gICAgdGhpcy5fbmdGb3JPZiA9IG5nRm9yT2Y7XG4gICAgdGhpcy5fbmdGb3JPZkRpcnR5ID0gdHJ1ZTtcbiAgfVxuICAvKipcbiAgICogU3BlY2lmaWVzIGEgY3VzdG9tIGBUcmFja0J5RnVuY3Rpb25gIHRvIGNvbXB1dGUgdGhlIGlkZW50aXR5IG9mIGl0ZW1zIGluIGFuIGl0ZXJhYmxlLlxuICAgKlxuICAgKiBJZiBhIGN1c3RvbSBgVHJhY2tCeUZ1bmN0aW9uYCBpcyBub3QgcHJvdmlkZWQsIGBOZ0Zvck9mYCB3aWxsIHVzZSB0aGUgaXRlbSdzIFtvYmplY3RcbiAgICogaWRlbnRpdHldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pcylcbiAgICogYXMgdGhlIGtleS5cbiAgICpcbiAgICogYE5nRm9yT2ZgIHVzZXMgdGhlIGNvbXB1dGVkIGtleSB0byBhc3NvY2lhdGUgaXRlbXMgaW4gYW4gaXRlcmFibGUgd2l0aCBET00gZWxlbWVudHNcbiAgICogaXQgcHJvZHVjZXMgZm9yIHRoZXNlIGl0ZW1zLlxuICAgKlxuICAgKiBBIGN1c3RvbSBgVHJhY2tCeUZ1bmN0aW9uYCBpcyB1c2VmdWwgdG8gcHJvdmlkZSBnb29kIHVzZXIgZXhwZXJpZW5jZSBpbiBjYXNlcyB3aGVuIGl0ZW1zIGluIGFuXG4gICAqIGl0ZXJhYmxlIHJlbmRlcmVkIHVzaW5nIGBOZ0Zvck9mYCBoYXZlIGEgbmF0dXJhbCBpZGVudGlmaWVyIChmb3IgZXhhbXBsZSwgY3VzdG9tIElEIG9yIGFcbiAgICogcHJpbWFyeSBrZXkpLCBhbmQgdGhpcyBpdGVyYWJsZSBjb3VsZCBiZSB1cGRhdGVkIHdpdGggbmV3IG9iamVjdCBpbnN0YW5jZXMgdGhhdCBzdGlsbFxuICAgKiByZXByZXNlbnQgdGhlIHNhbWUgdW5kZXJseWluZyBlbnRpdHkgKGZvciBleGFtcGxlLCB3aGVuIGRhdGEgaXMgcmUtZmV0Y2hlZCBmcm9tIHRoZSBzZXJ2ZXIsXG4gICAqIGFuZCB0aGUgaXRlcmFibGUgaXMgcmVjcmVhdGVkIGFuZCByZS1yZW5kZXJlZCwgYnV0IG1vc3Qgb2YgdGhlIGRhdGEgaXMgc3RpbGwgdGhlIHNhbWUpLlxuICAgKlxuICAgKiBAc2VlIGBUcmFja0J5RnVuY3Rpb25gXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbmdGb3JUcmFja0J5KGZuOiBUcmFja0J5RnVuY3Rpb248VD4pIHtcbiAgICBpZiAoKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgJiYgZm4gIT0gbnVsbCAmJiB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIFRPRE8odmljYik6IHVzZSBhIGxvZyBzZXJ2aWNlIG9uY2UgdGhlcmUgaXMgYSBwdWJsaWMgb25lIGF2YWlsYWJsZVxuICAgICAgaWYgKDxhbnk+Y29uc29sZSAmJiA8YW55PmNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgdHJhY2tCeSBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KGZuKX0uIGAgK1xuICAgICAgICAgICAgYFNlZSBodHRwczovL2FuZ3VsYXIuaW8vYXBpL2NvbW1vbi9OZ0Zvck9mI2NoYW5nZS1wcm9wYWdhdGlvbiBmb3IgbW9yZSBpbmZvcm1hdGlvbi5gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fdHJhY2tCeUZuID0gZm47XG4gIH1cblxuICBnZXQgbmdGb3JUcmFja0J5KCk6IFRyYWNrQnlGdW5jdGlvbjxUPiB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYWNrQnlGbjtcbiAgfVxuXG4gIHByaXZhdGUgX25nRm9yT2Y6IFV8dW5kZWZpbmVkfG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9uZ0Zvck9mRGlydHk6IGJvb2xlYW4gPSB0cnVlO1xuICBwcml2YXRlIF9kaWZmZXI6IEl0ZXJhYmxlRGlmZmVyPFQ+fG51bGwgPSBudWxsO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdHJhY2tCeUZuITogVHJhY2tCeUZ1bmN0aW9uPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgIHByaXZhdGUgX3RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxOZ0Zvck9mQ29udGV4dDxULCBVPj4sIHByaXZhdGUgX2RpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycykge31cblxuICAvKipcbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIHRlbXBsYXRlIHRoYXQgaXMgc3RhbXBlZCBvdXQgZm9yIGVhY2ggaXRlbSBpbiB0aGUgaXRlcmFibGUuXG4gICAqIEBzZWUgW3RlbXBsYXRlIHJlZmVyZW5jZSB2YXJpYWJsZV0oZ3VpZGUvdGVtcGxhdGUtcmVmZXJlbmNlLXZhcmlhYmxlcylcbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBuZ0ZvclRlbXBsYXRlKHZhbHVlOiBUZW1wbGF0ZVJlZjxOZ0Zvck9mQ29udGV4dDxULCBVPj4pIHtcbiAgICAvLyBUT0RPKFRTMi4xKTogbWFrZSBUZW1wbGF0ZVJlZjxQYXJ0aWFsPE5nRm9yUm93T2Y8VD4+PiBvbmNlIHdlIG1vdmUgdG8gVFMgdjIuMVxuICAgIC8vIFRoZSBjdXJyZW50IHR5cGUgaXMgdG9vIHJlc3RyaWN0aXZlOyBhIHRlbXBsYXRlIHRoYXQganVzdCB1c2VzIGluZGV4LCBmb3IgZXhhbXBsZSxcbiAgICAvLyBzaG91bGQgYmUgYWNjZXB0YWJsZS5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIGNoYW5nZXMgd2hlbiBuZWVkZWQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9uZ0Zvck9mRGlydHkpIHtcbiAgICAgIHRoaXMuX25nRm9yT2ZEaXJ0eSA9IGZhbHNlO1xuICAgICAgLy8gUmVhY3Qgb24gbmdGb3JPZiBjaGFuZ2VzIG9ubHkgb25jZSBhbGwgaW5wdXRzIGhhdmUgYmVlbiBpbml0aWFsaXplZFxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9uZ0Zvck9mO1xuICAgICAgaWYgKCF0aGlzLl9kaWZmZXIgJiYgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBDQVVUSU9OOiB0aGlzIGxvZ2ljIGlzIGR1cGxpY2F0ZWQgZm9yIHByb2R1Y3Rpb24gbW9kZSBiZWxvdywgYXMgdGhlIHRyeS1jYXRjaFxuICAgICAgICAgICAgLy8gaXMgb25seSBwcmVzZW50IGluIGRldmVsb3BtZW50IGJ1aWxkcy5cbiAgICAgICAgICAgIHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh2YWx1ZSkuY3JlYXRlKHRoaXMubmdGb3JUcmFja0J5KTtcbiAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgYSBkaWZmZXIgc3VwcG9ydGluZyBvYmplY3QgJyR7dmFsdWV9JyBvZiB0eXBlICcke1xuICAgICAgICAgICAgICAgIGdldFR5cGVOYW1lKHZhbHVlKX0nLiBOZ0ZvciBvbmx5IHN1cHBvcnRzIGJpbmRpbmcgdG8gSXRlcmFibGVzIHN1Y2ggYXMgQXJyYXlzLmApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDQVVUSU9OOiB0aGlzIGxvZ2ljIGlzIGR1cGxpY2F0ZWQgZm9yIGRldmVsb3BtZW50IG1vZGUgYWJvdmUsIGFzIHRoZSB0cnktY2F0Y2hcbiAgICAgICAgICAvLyBpcyBvbmx5IHByZXNlbnQgaW4gZGV2ZWxvcG1lbnQgYnVpbGRzLlxuICAgICAgICAgIHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh2YWx1ZSkuY3JlYXRlKHRoaXMubmdGb3JUcmFja0J5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5fZGlmZmVyKSB7XG4gICAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5fbmdGb3JPZik7XG4gICAgICBpZiAoY2hhbmdlcykgdGhpcy5fYXBwbHlDaGFuZ2VzKGNoYW5nZXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzOiBJdGVyYWJsZUNoYW5nZXM8VD4pIHtcbiAgICBjb25zdCB2aWV3Q29udGFpbmVyID0gdGhpcy5fdmlld0NvbnRhaW5lcjtcbiAgICBjaGFuZ2VzLmZvckVhY2hPcGVyYXRpb24oXG4gICAgICAgIChpdGVtOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxUPiwgYWRqdXN0ZWRQcmV2aW91c0luZGV4OiBudW1iZXJ8bnVsbCxcbiAgICAgICAgIGN1cnJlbnRJbmRleDogbnVtYmVyfG51bGwpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5wcmV2aW91c0luZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIE5nRm9yT2YgaXMgbmV2ZXIgXCJudWxsXCIgb3IgXCJ1bmRlZmluZWRcIiBoZXJlIGJlY2F1c2UgdGhlIGRpZmZlciBkZXRlY3RlZFxuICAgICAgICAgICAgLy8gdGhhdCBhIG5ldyBpdGVtIG5lZWRzIHRvIGJlIGluc2VydGVkIGZyb20gdGhlIGl0ZXJhYmxlLiBUaGlzIGltcGxpZXMgdGhhdFxuICAgICAgICAgICAgLy8gdGhlcmUgaXMgYW4gaXRlcmFibGUgdmFsdWUgZm9yIFwiX25nRm9yT2ZcIi5cbiAgICAgICAgICAgIHZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlLCBuZXcgTmdGb3JPZkNvbnRleHQ8VCwgVT4oaXRlbS5pdGVtLCB0aGlzLl9uZ0Zvck9mISwgLTEsIC0xKSxcbiAgICAgICAgICAgICAgICBjdXJyZW50SW5kZXggPT09IG51bGwgPyB1bmRlZmluZWQgOiBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXIucmVtb3ZlKFxuICAgICAgICAgICAgICAgIGFkanVzdGVkUHJldmlvdXNJbmRleCA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IGFkanVzdGVkUHJldmlvdXNJbmRleCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhZGp1c3RlZFByZXZpb3VzSW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB2aWV3Q29udGFpbmVyLmdldChhZGp1c3RlZFByZXZpb3VzSW5kZXgpITtcbiAgICAgICAgICAgIHZpZXdDb250YWluZXIubW92ZSh2aWV3LCBjdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgYXBwbHlWaWV3Q2hhbmdlKHZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPE5nRm9yT2ZDb250ZXh0PFQsIFU+PiwgaXRlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBpbGVuID0gdmlld0NvbnRhaW5lci5sZW5ndGg7IGkgPCBpbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXdSZWYgPSA8RW1iZWRkZWRWaWV3UmVmPE5nRm9yT2ZDb250ZXh0PFQsIFU+Pj52aWV3Q29udGFpbmVyLmdldChpKTtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB2aWV3UmVmLmNvbnRleHQ7XG4gICAgICBjb250ZXh0LmluZGV4ID0gaTtcbiAgICAgIGNvbnRleHQuY291bnQgPSBpbGVuO1xuICAgICAgY29udGV4dC5uZ0Zvck9mID0gdGhpcy5fbmdGb3JPZiE7XG4gICAgfVxuXG4gICAgY2hhbmdlcy5mb3JFYWNoSWRlbnRpdHlDaGFuZ2UoKHJlY29yZDogYW55KSA9PiB7XG4gICAgICBjb25zdCB2aWV3UmVmID0gPEVtYmVkZGVkVmlld1JlZjxOZ0Zvck9mQ29udGV4dDxULCBVPj4+dmlld0NvbnRhaW5lci5nZXQocmVjb3JkLmN1cnJlbnRJbmRleCk7XG4gICAgICBhcHBseVZpZXdDaGFuZ2Uodmlld1JlZiwgcmVjb3JkKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnRzIHRoZSBjb3JyZWN0IHR5cGUgb2YgdGhlIGNvbnRleHQgZm9yIHRoZSB0ZW1wbGF0ZSB0aGF0IGBOZ0Zvck9mYCB3aWxsIHJlbmRlci5cbiAgICpcbiAgICogVGhlIHByZXNlbmNlIG9mIHRoaXMgbWV0aG9kIGlzIGEgc2lnbmFsIHRvIHRoZSBJdnkgdGVtcGxhdGUgdHlwZS1jaGVjayBjb21waWxlciB0aGF0IHRoZVxuICAgKiBgTmdGb3JPZmAgc3RydWN0dXJhbCBkaXJlY3RpdmUgcmVuZGVycyBpdHMgdGVtcGxhdGUgd2l0aCBhIHNwZWNpZmljIGNvbnRleHQgdHlwZS5cbiAgICovXG4gIHN0YXRpYyBuZ1RlbXBsYXRlQ29udGV4dEd1YXJkPFQsIFUgZXh0ZW5kcyBOZ0l0ZXJhYmxlPFQ+PihkaXI6IE5nRm9yT2Y8VCwgVT4sIGN0eDogYW55KTpcbiAgICAgIGN0eCBpcyBOZ0Zvck9mQ29udGV4dDxULCBVPiB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlWaWV3Q2hhbmdlPFQ+KFxuICAgIHZpZXc6IEVtYmVkZGVkVmlld1JlZjxOZ0Zvck9mQ29udGV4dDxUPj4sIHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8VD4pIHtcbiAgdmlldy5jb250ZXh0LiRpbXBsaWNpdCA9IHJlY29yZC5pdGVtO1xufVxuXG5mdW5jdGlvbiBnZXRUeXBlTmFtZSh0eXBlOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gdHlwZVsnbmFtZSddIHx8IHR5cGVvZiB0eXBlO1xufVxuIl19