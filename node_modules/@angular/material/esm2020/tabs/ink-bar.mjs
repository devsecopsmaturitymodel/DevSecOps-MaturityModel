/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, InjectionToken, NgZone, Optional } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
/** Injection token for the MatInkBar's Positioner. */
export const _MAT_INK_BAR_POSITIONER = new InjectionToken('MatInkBarPositioner', {
    providedIn: 'root',
    factory: _MAT_INK_BAR_POSITIONER_FACTORY,
});
/**
 * The default positioner function for the MatInkBar.
 * @docs-private
 */
export function _MAT_INK_BAR_POSITIONER_FACTORY() {
    const method = (element) => ({
        left: element ? (element.offsetLeft || 0) + 'px' : '0',
        width: element ? (element.offsetWidth || 0) + 'px' : '0',
    });
    return method;
}
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 */
export class MatInkBar {
    constructor(_elementRef, _ngZone, _inkBarPositioner, _animationMode) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._inkBarPositioner = _inkBarPositioner;
        this._animationMode = _animationMode;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param element
     */
    alignToElement(element) {
        this.show();
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
            const positions = this._inkBarPositioner(element);
            const inkBar = this._elementRef.nativeElement;
            inkBar.style.left = positions.left;
            inkBar.style.width = positions.width;
        });
    }
    /** Shows the ink bar. */
    show() {
        this._elementRef.nativeElement.style.visibility = 'visible';
    }
    /** Hides the ink bar. */
    hide() {
        this._elementRef.nativeElement.style.visibility = 'hidden';
    }
}
MatInkBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatInkBar, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: _MAT_INK_BAR_POSITIONER }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatInkBar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatInkBar, selector: "mat-ink-bar", host: { properties: { "class._mat-animation-noopable": "_animationMode === 'NoopAnimations'" }, classAttribute: "mat-ink-bar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatInkBar, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-ink-bar',
                    host: {
                        'class': 'mat-ink-bar',
                        '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [_MAT_INK_BAR_POSITIONER]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFVcEMsc0RBQXNEO0FBQ3RELE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUN2RCxxQkFBcUIsRUFDckI7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsK0JBQStCO0NBQ3pDLENBQ0YsQ0FBQztBQUVGOzs7R0FHRztBQUNILE1BQU0sVUFBVSwrQkFBK0I7SUFDN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7UUFDdEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRztLQUN6RCxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQ7OztHQUdHO0FBUUgsTUFBTSxPQUFPLFNBQVM7SUFDcEIsWUFDVSxXQUFvQyxFQUNwQyxPQUFlLEVBQ2tCLGlCQUF1QyxFQUM5QixjQUF1QjtRQUhqRSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNrQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQXNCO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO0lBQ3hFLENBQUM7SUFFSjs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLE9BQW9CO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2pELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7WUFDM0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUQsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFDN0QsQ0FBQzs7c0dBL0JVLFNBQVMsa0VBSVYsdUJBQXVCLGFBQ1gscUJBQXFCOzBGQUxoQyxTQUFTOzJGQUFULFNBQVM7a0JBUHJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsYUFBYTt3QkFDdEIsaUNBQWlDLEVBQUUscUNBQXFDO3FCQUN6RTtpQkFDRjs7MEJBS0ksTUFBTTsyQkFBQyx1QkFBdUI7OzBCQUM5QixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgTmdab25lLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgYSBhIE1hdElua0JhciBwb3NpdGlvbmVyIG1ldGhvZCwgZGVmaW5pbmcgdGhlIHBvc2l0aW9uaW5nIGFuZCB3aWR0aCBvZiB0aGUgaW5rXG4gKiBiYXIgaW4gYSBzZXQgb2YgdGFicy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBfTWF0SW5rQmFyUG9zaXRpb25lciB7XG4gIChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHtsZWZ0OiBzdHJpbmc7IHdpZHRoOiBzdHJpbmd9O1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIGZvciB0aGUgTWF0SW5rQmFyJ3MgUG9zaXRpb25lci4gKi9cbmV4cG9ydCBjb25zdCBfTUFUX0lOS19CQVJfUE9TSVRJT05FUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxfTWF0SW5rQmFyUG9zaXRpb25lcj4oXG4gICdNYXRJbmtCYXJQb3NpdGlvbmVyJyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiBfTUFUX0lOS19CQVJfUE9TSVRJT05FUl9GQUNUT1JZLFxuICB9LFxuKTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBwb3NpdGlvbmVyIGZ1bmN0aW9uIGZvciB0aGUgTWF0SW5rQmFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX01BVF9JTktfQkFSX1BPU0lUSU9ORVJfRkFDVE9SWSgpOiBfTWF0SW5rQmFyUG9zaXRpb25lciB7XG4gIGNvbnN0IG1ldGhvZCA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gKHtcbiAgICBsZWZ0OiBlbGVtZW50ID8gKGVsZW1lbnQub2Zmc2V0TGVmdCB8fCAwKSArICdweCcgOiAnMCcsXG4gICAgd2lkdGg6IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwKSArICdweCcgOiAnMCcsXG4gIH0pO1xuXG4gIHJldHVybiBtZXRob2Q7XG59XG5cbi8qKlxuICogVGhlIGluay1iYXIgaXMgdXNlZCB0byBkaXNwbGF5IGFuZCBhbmltYXRlIHRoZSBsaW5lIHVuZGVybmVhdGggdGhlIGN1cnJlbnQgYWN0aXZlIHRhYiBsYWJlbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWluay1iYXInLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1pbmstYmFyJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6IGBfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJ2AsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdElua0JhciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoX01BVF9JTktfQkFSX1BPU0lUSU9ORVIpIHByaXZhdGUgX2lua0JhclBvc2l0aW9uZXI6IF9NYXRJbmtCYXJQb3NpdGlvbmVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge31cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3R5bGVzIGZyb20gdGhlIHByb3ZpZGVkIGVsZW1lbnQgaW4gb3JkZXIgdG8gYWxpZ24gdGhlIGluay1iYXIgdG8gdGhhdCBlbGVtZW50LlxuICAgKiBTaG93cyB0aGUgaW5rIGJhciBpZiBwcmV2aW91c2x5IHNldCBhcyBoaWRkZW4uXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqL1xuICBhbGlnblRvRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuc2hvdygpO1xuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLl9pbmtCYXJQb3NpdGlvbmVyKGVsZW1lbnQpO1xuICAgICAgY29uc3QgaW5rQmFyOiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGlua0Jhci5zdHlsZS5sZWZ0ID0gcG9zaXRpb25zLmxlZnQ7XG4gICAgICBpbmtCYXIuc3R5bGUud2lkdGggPSBwb3NpdGlvbnMud2lkdGg7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU2hvd3MgdGhlIGluayBiYXIuICovXG4gIHNob3coKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gIH1cblxuICAvKiogSGlkZXMgdGhlIGluayBiYXIuICovXG4gIGhpZGUoKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgfVxufVxuIl19