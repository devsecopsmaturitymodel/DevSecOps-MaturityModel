/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * @ngModule CommonModule
 *
 * @description
 *
 * Inserts an embedded view from a prepared `TemplateRef`.
 *
 * You can attach a context object to the `EmbeddedViewRef` by setting `[ngTemplateOutletContext]`.
 * `[ngTemplateOutletContext]` should be an object, the object's keys will be available for binding
 * by the local template `let` declarations.
 *
 * @usageNotes
 * ```
 * <ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
 * ```
 *
 * Using the key `$implicit` in the context object will set its value as default.
 *
 * ### Example
 *
 * {@example common/ngTemplateOutlet/ts/module.ts region='NgTemplateOutlet'}
 *
 * @publicApi
 */
export class NgTemplateOutlet {
    constructor(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
        this._viewRef = null;
        /**
         * A context object to attach to the {@link EmbeddedViewRef}. This should be an
         * object, the object's keys will be available for binding by the local template `let`
         * declarations.
         * Using the key `$implicit` in the context object will set its value as default.
         */
        this.ngTemplateOutletContext = null;
        /**
         * A string defining the template reference and optionally the context object for the template.
         */
        this.ngTemplateOutlet = null;
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (changes['ngTemplateOutlet']) {
            const viewContainerRef = this._viewContainerRef;
            if (this._viewRef) {
                viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
            }
            this._viewRef = this.ngTemplateOutlet ?
                viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext) :
                null;
        }
        else if (this._viewRef && changes['ngTemplateOutletContext'] && this.ngTemplateOutletContext) {
            this._viewRef.context = this.ngTemplateOutletContext;
        }
    }
}
NgTemplateOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgTemplateOutlet, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
NgTemplateOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: { ngTemplateOutletContext: "ngTemplateOutletContext", ngTemplateOutlet: "ngTemplateOutlet" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgTemplateOutlet, decorators: [{
            type: Directive,
            args: [{ selector: '[ngTemplateOutlet]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; }, propDecorators: { ngTemplateOutletContext: [{
                type: Input
            }], ngTemplateOutlet: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfdGVtcGxhdGVfb3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX3RlbXBsYXRlX291dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFtQixLQUFLLEVBQXVELGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUV2STs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFFSCxNQUFNLE9BQU8sZ0JBQWdCO0lBZ0IzQixZQUFvQixpQkFBbUM7UUFBbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQWYvQyxhQUFRLEdBQThCLElBQUksQ0FBQztRQUVuRDs7Ozs7V0FLRztRQUNhLDRCQUF1QixHQUFnQixJQUFJLENBQUM7UUFFNUQ7O1dBRUc7UUFDYSxxQkFBZ0IsR0FBMEIsSUFBSSxDQUFDO0lBRUwsQ0FBQztJQUUzRCxhQUFhO0lBQ2IsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDL0IsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFFaEQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ2xFO1lBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDbkMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzFGLElBQUksQ0FBQztTQUNWO2FBQU0sSUFDSCxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUN2RixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUM7U0FDdEQ7SUFDSCxDQUFDOzt3SEFsQ1UsZ0JBQWdCOzRHQUFoQixnQkFBZ0I7c0dBQWhCLGdCQUFnQjtrQkFENUIsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBQzt1R0FVekIsdUJBQXVCO3NCQUF0QyxLQUFLO2dCQUtVLGdCQUFnQjtzQkFBL0IsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRW1iZWRkZWRWaWV3UmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2UsIFNpbXBsZUNoYW5nZXMsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAbmdNb2R1bGUgQ29tbW9uTW9kdWxlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogSW5zZXJ0cyBhbiBlbWJlZGRlZCB2aWV3IGZyb20gYSBwcmVwYXJlZCBgVGVtcGxhdGVSZWZgLlxuICpcbiAqIFlvdSBjYW4gYXR0YWNoIGEgY29udGV4dCBvYmplY3QgdG8gdGhlIGBFbWJlZGRlZFZpZXdSZWZgIGJ5IHNldHRpbmcgYFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF1gLlxuICogYFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF1gIHNob3VsZCBiZSBhbiBvYmplY3QsIHRoZSBvYmplY3QncyBrZXlzIHdpbGwgYmUgYXZhaWxhYmxlIGZvciBiaW5kaW5nXG4gKiBieSB0aGUgbG9jYWwgdGVtcGxhdGUgYGxldGAgZGVjbGFyYXRpb25zLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBgYGBcbiAqIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0ZW1wbGF0ZVJlZkV4cDsgY29udGV4dDogY29udGV4dEV4cFwiPjwvbmctY29udGFpbmVyPlxuICogYGBgXG4gKlxuICogVXNpbmcgdGhlIGtleSBgJGltcGxpY2l0YCBpbiB0aGUgY29udGV4dCBvYmplY3Qgd2lsbCBzZXQgaXRzIHZhbHVlIGFzIGRlZmF1bHQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL25nVGVtcGxhdGVPdXRsZXQvdHMvbW9kdWxlLnRzIHJlZ2lvbj0nTmdUZW1wbGF0ZU91dGxldCd9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ1RlbXBsYXRlT3V0bGV0XSd9KVxuZXhwb3J0IGNsYXNzIE5nVGVtcGxhdGVPdXRsZXQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBwcml2YXRlIF92aWV3UmVmOiBFbWJlZGRlZFZpZXdSZWY8YW55PnxudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogQSBjb250ZXh0IG9iamVjdCB0byBhdHRhY2ggdG8gdGhlIHtAbGluayBFbWJlZGRlZFZpZXdSZWZ9LiBUaGlzIHNob3VsZCBiZSBhblxuICAgKiBvYmplY3QsIHRoZSBvYmplY3QncyBrZXlzIHdpbGwgYmUgYXZhaWxhYmxlIGZvciBiaW5kaW5nIGJ5IHRoZSBsb2NhbCB0ZW1wbGF0ZSBgbGV0YFxuICAgKiBkZWNsYXJhdGlvbnMuXG4gICAqIFVzaW5nIHRoZSBrZXkgYCRpbXBsaWNpdGAgaW4gdGhlIGNvbnRleHQgb2JqZWN0IHdpbGwgc2V0IGl0cyB2YWx1ZSBhcyBkZWZhdWx0LlxuICAgKi9cbiAgQElucHV0KCkgcHVibGljIG5nVGVtcGxhdGVPdXRsZXRDb250ZXh0OiBPYmplY3R8bnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIGRlZmluaW5nIHRoZSB0ZW1wbGF0ZSByZWZlcmVuY2UgYW5kIG9wdGlvbmFsbHkgdGhlIGNvbnRleHQgb2JqZWN0IGZvciB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBASW5wdXQoKSBwdWJsaWMgbmdUZW1wbGF0ZU91dGxldDogVGVtcGxhdGVSZWY8YW55PnxudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7fVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWyduZ1RlbXBsYXRlT3V0bGV0J10pIHtcbiAgICAgIGNvbnN0IHZpZXdDb250YWluZXJSZWYgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmO1xuXG4gICAgICBpZiAodGhpcy5fdmlld1JlZikge1xuICAgICAgICB2aWV3Q29udGFpbmVyUmVmLnJlbW92ZSh2aWV3Q29udGFpbmVyUmVmLmluZGV4T2YodGhpcy5fdmlld1JlZikpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92aWV3UmVmID0gdGhpcy5uZ1RlbXBsYXRlT3V0bGV0ID9cbiAgICAgICAgICB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLm5nVGVtcGxhdGVPdXRsZXQsIHRoaXMubmdUZW1wbGF0ZU91dGxldENvbnRleHQpIDpcbiAgICAgICAgICBudWxsO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuX3ZpZXdSZWYgJiYgY2hhbmdlc1snbmdUZW1wbGF0ZU91dGxldENvbnRleHQnXSAmJiB0aGlzLm5nVGVtcGxhdGVPdXRsZXRDb250ZXh0KSB7XG4gICAgICB0aGlzLl92aWV3UmVmLmNvbnRleHQgPSB0aGlzLm5nVGVtcGxhdGVPdXRsZXRDb250ZXh0O1xuICAgIH1cbiAgfVxufVxuIl19