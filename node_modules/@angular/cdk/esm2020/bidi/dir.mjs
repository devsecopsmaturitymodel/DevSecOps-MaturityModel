/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { Directionality, _resolveDirectionality } from './directionality';
import * as i0 from "@angular/core";
/**
 * Directive to listen for changes of direction of part of the DOM.
 *
 * Provides itself as Directionality such that descendant directives only need to ever inject
 * Directionality to get the closest direction.
 */
export class Dir {
    constructor() {
        /** Normalized direction that accounts for invalid/unsupported values. */
        this._dir = 'ltr';
        /** Whether the `value` has been set to its initial value. */
        this._isInitialized = false;
        /** Event emitted when the direction changes. */
        this.change = new EventEmitter();
    }
    /** @docs-private */
    get dir() {
        return this._dir;
    }
    set dir(value) {
        const previousValue = this._dir;
        // Note: `_resolveDirectionality` resolves the language based on the browser's language,
        // whereas the browser does it based on the content of the element. Since doing so based
        // on the content can be expensive, for now we're doing the simpler matching.
        this._dir = _resolveDirectionality(value);
        this._rawDir = value;
        if (previousValue !== this._dir && this._isInitialized) {
            this.change.emit(this._dir);
        }
    }
    /** Current layout direction of the element. */
    get value() {
        return this.dir;
    }
    /** Initialize once default value has been set. */
    ngAfterContentInit() {
        this._isInitialized = true;
    }
    ngOnDestroy() {
        this.change.complete();
    }
}
Dir.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Dir, deps: [], target: i0.ɵɵFactoryTarget.Directive });
Dir.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: Dir, selector: "[dir]", inputs: { dir: "dir" }, outputs: { change: "dirChange" }, host: { properties: { "attr.dir": "_rawDir" } }, providers: [{ provide: Directionality, useExisting: Dir }], exportAs: ["dir"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: Dir, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dir]',
                    providers: [{ provide: Directionality, useExisting: Dir }],
                    host: { '[attr.dir]': '_rawDir' },
                    exportAs: 'dir',
                }]
        }], propDecorators: { change: [{
                type: Output,
                args: ['dirChange']
            }], dir: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9iaWRpL2Rpci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUE4QixNQUFNLGVBQWUsQ0FBQztBQUVsRyxPQUFPLEVBQVksY0FBYyxFQUFFLHNCQUFzQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7O0FBRW5GOzs7OztHQUtHO0FBT0gsTUFBTSxPQUFPLEdBQUc7SUFOaEI7UUFPRSx5RUFBeUU7UUFDakUsU0FBSSxHQUFjLEtBQUssQ0FBQztRQUVoQyw2REFBNkQ7UUFDckQsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFLeEMsZ0RBQWdEO1FBQ2xCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYSxDQUFDO0tBa0N0RTtJQWhDQyxvQkFBb0I7SUFDcEIsSUFDSSxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUF5QjtRQUMvQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRWhDLHdGQUF3RjtRQUN4Rix3RkFBd0Y7UUFDeEYsNkVBQTZFO1FBQzdFLElBQUksQ0FBQyxJQUFJLEdBQUcsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFckIsSUFBSSxhQUFhLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDOztnR0E1Q1UsR0FBRztvRkFBSCxHQUFHLDJJQUpILENBQUMsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUMsQ0FBQzsyRkFJN0MsR0FBRztrQkFOZixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxPQUFPO29CQUNqQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxLQUFLLEVBQUMsQ0FBQztvQkFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLFNBQVMsRUFBQztvQkFDL0IsUUFBUSxFQUFFLEtBQUs7aUJBQ2hCOzhCQVkrQixNQUFNO3NCQUFuQyxNQUFNO3VCQUFDLFdBQVc7Z0JBSWYsR0FBRztzQkFETixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBPdXRwdXQsIElucHV0LCBFdmVudEVtaXR0ZXIsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7RGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSwgX3Jlc29sdmVEaXJlY3Rpb25hbGl0eX0gZnJvbSAnLi9kaXJlY3Rpb25hbGl0eSc7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyBvZiBkaXJlY3Rpb24gb2YgcGFydCBvZiB0aGUgRE9NLlxuICpcbiAqIFByb3ZpZGVzIGl0c2VsZiBhcyBEaXJlY3Rpb25hbGl0eSBzdWNoIHRoYXQgZGVzY2VuZGFudCBkaXJlY3RpdmVzIG9ubHkgbmVlZCB0byBldmVyIGluamVjdFxuICogRGlyZWN0aW9uYWxpdHkgdG8gZ2V0IHRoZSBjbG9zZXN0IGRpcmVjdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Rpcl0nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogRGlyZWN0aW9uYWxpdHksIHVzZUV4aXN0aW5nOiBEaXJ9XSxcbiAgaG9zdDogeydbYXR0ci5kaXJdJzogJ19yYXdEaXInfSxcbiAgZXhwb3J0QXM6ICdkaXInLFxufSlcbmV4cG9ydCBjbGFzcyBEaXIgaW1wbGVtZW50cyBEaXJlY3Rpb25hbGl0eSwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIE5vcm1hbGl6ZWQgZGlyZWN0aW9uIHRoYXQgYWNjb3VudHMgZm9yIGludmFsaWQvdW5zdXBwb3J0ZWQgdmFsdWVzLiAqL1xuICBwcml2YXRlIF9kaXI6IERpcmVjdGlvbiA9ICdsdHInO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBgdmFsdWVgIGhhcyBiZWVuIHNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBEaXJlY3Rpb24gYXMgcGFzc2VkIGluIGJ5IHRoZSBjb25zdW1lci4gKi9cbiAgX3Jhd0Rpcjogc3RyaW5nO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGRpcmVjdGlvbiBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCdkaXJDaGFuZ2UnKSByZWFkb25seSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPERpcmVjdGlvbj4oKTtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlyKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpcjtcbiAgfVxuICBzZXQgZGlyKHZhbHVlOiBEaXJlY3Rpb24gfCAnYXV0bycpIHtcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gdGhpcy5fZGlyO1xuXG4gICAgLy8gTm90ZTogYF9yZXNvbHZlRGlyZWN0aW9uYWxpdHlgIHJlc29sdmVzIHRoZSBsYW5ndWFnZSBiYXNlZCBvbiB0aGUgYnJvd3NlcidzIGxhbmd1YWdlLFxuICAgIC8vIHdoZXJlYXMgdGhlIGJyb3dzZXIgZG9lcyBpdCBiYXNlZCBvbiB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudC4gU2luY2UgZG9pbmcgc28gYmFzZWRcbiAgICAvLyBvbiB0aGUgY29udGVudCBjYW4gYmUgZXhwZW5zaXZlLCBmb3Igbm93IHdlJ3JlIGRvaW5nIHRoZSBzaW1wbGVyIG1hdGNoaW5nLlxuICAgIHRoaXMuX2RpciA9IF9yZXNvbHZlRGlyZWN0aW9uYWxpdHkodmFsdWUpO1xuICAgIHRoaXMuX3Jhd0RpciA9IHZhbHVlO1xuXG4gICAgaWYgKHByZXZpb3VzVmFsdWUgIT09IHRoaXMuX2RpciAmJiB0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMuX2Rpcik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEN1cnJlbnQgbGF5b3V0IGRpcmVjdGlvbiBvZiB0aGUgZWxlbWVudC4gKi9cbiAgZ2V0IHZhbHVlKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlyO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemUgb25jZSBkZWZhdWx0IHZhbHVlIGhhcyBiZWVuIHNldC4gKi9cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jaGFuZ2UuY29tcGxldGUoKTtcbiAgfVxufVxuIl19