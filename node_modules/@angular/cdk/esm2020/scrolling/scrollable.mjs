/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { getRtlScrollAxisType, supportsScrollBehavior, } from '@angular/cdk/platform';
import { Directive, ElementRef, NgZone, Optional } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollDispatcher } from './scroll-dispatcher';
import * as i0 from "@angular/core";
import * as i1 from "./scroll-dispatcher";
import * as i2 from "@angular/cdk/bidi";
/**
 * Sends an event when the directive's element is scrolled. Registers itself with the
 * ScrollDispatcher service to include itself as part of its collection of scrolling events that it
 * can be listened to through the service.
 */
export class CdkScrollable {
    constructor(elementRef, scrollDispatcher, ngZone, dir) {
        this.elementRef = elementRef;
        this.scrollDispatcher = scrollDispatcher;
        this.ngZone = ngZone;
        this.dir = dir;
        this._destroyed = new Subject();
        this._elementScrolled = new Observable((observer) => this.ngZone.runOutsideAngular(() => fromEvent(this.elementRef.nativeElement, 'scroll')
            .pipe(takeUntil(this._destroyed))
            .subscribe(observer)));
    }
    ngOnInit() {
        this.scrollDispatcher.register(this);
    }
    ngOnDestroy() {
        this.scrollDispatcher.deregister(this);
        this._destroyed.next();
        this._destroyed.complete();
    }
    /** Returns observable that emits when a scroll event is fired on the host element. */
    elementScrolled() {
        return this._elementScrolled;
    }
    /** Gets the ElementRef for the viewport. */
    getElementRef() {
        return this.elementRef;
    }
    /**
     * Scrolls to the specified offsets. This is a normalized version of the browser's native scrollTo
     * method, since browsers are not consistent about what scrollLeft means in RTL. For this method
     * left and right always refer to the left and right side of the scrolling container irrespective
     * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
     * in an RTL context.
     * @param options specified the offsets to scroll to.
     */
    scrollTo(options) {
        const el = this.elementRef.nativeElement;
        const isRtl = this.dir && this.dir.value == 'rtl';
        // Rewrite start & end offsets as right or left offsets.
        if (options.left == null) {
            options.left = isRtl ? options.end : options.start;
        }
        if (options.right == null) {
            options.right = isRtl ? options.start : options.end;
        }
        // Rewrite the bottom offset as a top offset.
        if (options.bottom != null) {
            options.top =
                el.scrollHeight - el.clientHeight - options.bottom;
        }
        // Rewrite the right offset as a left offset.
        if (isRtl && getRtlScrollAxisType() != 0 /* NORMAL */) {
            if (options.left != null) {
                options.right =
                    el.scrollWidth - el.clientWidth - options.left;
            }
            if (getRtlScrollAxisType() == 2 /* INVERTED */) {
                options.left = options.right;
            }
            else if (getRtlScrollAxisType() == 1 /* NEGATED */) {
                options.left = options.right ? -options.right : options.right;
            }
        }
        else {
            if (options.right != null) {
                options.left =
                    el.scrollWidth - el.clientWidth - options.right;
            }
        }
        this._applyScrollToOptions(options);
    }
    _applyScrollToOptions(options) {
        const el = this.elementRef.nativeElement;
        if (supportsScrollBehavior()) {
            el.scrollTo(options);
        }
        else {
            if (options.top != null) {
                el.scrollTop = options.top;
            }
            if (options.left != null) {
                el.scrollLeft = options.left;
            }
        }
    }
    /**
     * Measures the scroll offset relative to the specified edge of the viewport. This method can be
     * used instead of directly checking scrollLeft or scrollTop, since browsers are not consistent
     * about what scrollLeft means in RTL. The values returned by this method are normalized such that
     * left and right always refer to the left and right side of the scrolling container irrespective
     * of the layout direction. start and end refer to left and right in an LTR context and vice-versa
     * in an RTL context.
     * @param from The edge to measure from.
     */
    measureScrollOffset(from) {
        const LEFT = 'left';
        const RIGHT = 'right';
        const el = this.elementRef.nativeElement;
        if (from == 'top') {
            return el.scrollTop;
        }
        if (from == 'bottom') {
            return el.scrollHeight - el.clientHeight - el.scrollTop;
        }
        // Rewrite start & end as left or right offsets.
        const isRtl = this.dir && this.dir.value == 'rtl';
        if (from == 'start') {
            from = isRtl ? RIGHT : LEFT;
        }
        else if (from == 'end') {
            from = isRtl ? LEFT : RIGHT;
        }
        if (isRtl && getRtlScrollAxisType() == 2 /* INVERTED */) {
            // For INVERTED, scrollLeft is (scrollWidth - clientWidth) when scrolled all the way left and
            // 0 when scrolled all the way right.
            if (from == LEFT) {
                return el.scrollWidth - el.clientWidth - el.scrollLeft;
            }
            else {
                return el.scrollLeft;
            }
        }
        else if (isRtl && getRtlScrollAxisType() == 1 /* NEGATED */) {
            // For NEGATED, scrollLeft is -(scrollWidth - clientWidth) when scrolled all the way left and
            // 0 when scrolled all the way right.
            if (from == LEFT) {
                return el.scrollLeft + el.scrollWidth - el.clientWidth;
            }
            else {
                return -el.scrollLeft;
            }
        }
        else {
            // For NORMAL, as well as non-RTL contexts, scrollLeft is 0 when scrolled all the way left and
            // (scrollWidth - clientWidth) when scrolled all the way right.
            if (from == LEFT) {
                return el.scrollLeft;
            }
            else {
                return el.scrollWidth - el.clientWidth - el.scrollLeft;
            }
        }
    }
}
CdkScrollable.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkScrollable, deps: [{ token: i0.ElementRef }, { token: i1.ScrollDispatcher }, { token: i0.NgZone }, { token: i2.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkScrollable.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkScrollable, selector: "[cdk-scrollable], [cdkScrollable]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkScrollable, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdk-scrollable], [cdkScrollable]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ScrollDispatcher }, { type: i0.NgZone }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2Nyb2xsaW5nL3Njcm9sbGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFDTCxvQkFBb0IsRUFFcEIsc0JBQXNCLEdBQ3ZCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFxQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekYsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFXLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQzs7OztBQXFCckQ7Ozs7R0FJRztBQUlILE1BQU0sT0FBTyxhQUFhO0lBV3hCLFlBQ1ksVUFBbUMsRUFDbkMsZ0JBQWtDLEVBQ2xDLE1BQWMsRUFDRixHQUFvQjtRQUhoQyxlQUFVLEdBQVYsVUFBVSxDQUF5QjtRQUNuQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDRixRQUFHLEdBQUgsR0FBRyxDQUFpQjtRQWQzQixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUUxQyxxQkFBZ0IsR0FBc0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxRQUF5QixFQUFFLEVBQUUsQ0FDekYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsQ0FDakMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQzthQUMvQyxJQUFJLENBQUMsU0FBUyxDQUFDLElB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QkFBOEIsRUFBRTtZQUNqRSw2RkFBNkY7WUFDN0YscUNBQXFDO1lBQ3JDLElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDaEIsT0FBTyxFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUN4RDtpQkFBTTtnQkFDTCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDdEI7U0FDRjthQUFNLElBQUksS0FBSyxJQUFJLG9CQUFvQixFQUFFLG1CQUE2QixFQUFFO1lBQ3ZFLDZGQUE2RjtZQUM3RixxQ0FBcUM7WUFDckMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO2dCQUNoQixPQUFPLEVBQUUsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO2FBQ3hEO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ3ZCO1NBQ0Y7YUFBTTtZQUNMLDhGQUE4RjtZQUM5RiwrREFBK0Q7WUFDL0QsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO2dCQUNoQixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDdEI7aUJBQU07Z0JBQ0wsT0FBTyxFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUN4RDtTQUNGO0lBQ0gsQ0FBQzs7MEdBM0pVLGFBQWE7OEZBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUh6QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQ0FBbUM7aUJBQzlDOzswQkFnQkksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBnZXRSdGxTY3JvbGxBeGlzVHlwZSxcbiAgUnRsU2Nyb2xsQXhpc1R5cGUsXG4gIHN1cHBvcnRzU2Nyb2xsQmVoYXZpb3IsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgTmdab25lLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YmplY3QsIE9ic2VydmVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1Njcm9sbERpc3BhdGNoZXJ9IGZyb20gJy4vc2Nyb2xsLWRpc3BhdGNoZXInO1xuXG5leHBvcnQgdHlwZSBfV2l0aG91dDxUPiA9IHtbUCBpbiBrZXlvZiBUXT86IG5ldmVyfTtcbmV4cG9ydCB0eXBlIF9YT1I8VCwgVT4gPSAoX1dpdGhvdXQ8VD4gJiBVKSB8IChfV2l0aG91dDxVPiAmIFQpO1xuZXhwb3J0IHR5cGUgX1RvcCA9IHt0b3A/OiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgX0JvdHRvbSA9IHtib3R0b20/OiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgX0xlZnQgPSB7bGVmdD86IG51bWJlcn07XG5leHBvcnQgdHlwZSBfUmlnaHQgPSB7cmlnaHQ/OiBudW1iZXJ9O1xuZXhwb3J0IHR5cGUgX1N0YXJ0ID0ge3N0YXJ0PzogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIF9FbmQgPSB7ZW5kPzogbnVtYmVyfTtcbmV4cG9ydCB0eXBlIF9YQXhpcyA9IF9YT1I8X1hPUjxfTGVmdCwgX1JpZ2h0PiwgX1hPUjxfU3RhcnQsIF9FbmQ+PjtcbmV4cG9ydCB0eXBlIF9ZQXhpcyA9IF9YT1I8X1RvcCwgX0JvdHRvbT47XG5cbi8qKlxuICogQW4gZXh0ZW5kZWQgdmVyc2lvbiBvZiBTY3JvbGxUb09wdGlvbnMgdGhhdCBhbGxvd3MgZXhwcmVzc2luZyBzY3JvbGwgb2Zmc2V0cyByZWxhdGl2ZSB0byB0aGVcbiAqIHRvcCwgYm90dG9tLCBsZWZ0LCByaWdodCwgc3RhcnQsIG9yIGVuZCBvZiB0aGUgdmlld3BvcnQgcmF0aGVyIHRoYW4ganVzdCB0aGUgdG9wIGFuZCBsZWZ0LlxuICogUGxlYXNlIG5vdGU6IHRoZSB0b3AgYW5kIGJvdHRvbSBwcm9wZXJ0aWVzIGFyZSBtdXR1YWxseSBleGNsdXNpdmUsIGFzIGFyZSB0aGUgbGVmdCwgcmlnaHQsXG4gKiBzdGFydCwgYW5kIGVuZCBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgdHlwZSBFeHRlbmRlZFNjcm9sbFRvT3B0aW9ucyA9IF9YQXhpcyAmIF9ZQXhpcyAmIFNjcm9sbE9wdGlvbnM7XG5cbi8qKlxuICogU2VuZHMgYW4gZXZlbnQgd2hlbiB0aGUgZGlyZWN0aXZlJ3MgZWxlbWVudCBpcyBzY3JvbGxlZC4gUmVnaXN0ZXJzIGl0c2VsZiB3aXRoIHRoZVxuICogU2Nyb2xsRGlzcGF0Y2hlciBzZXJ2aWNlIHRvIGluY2x1ZGUgaXRzZWxmIGFzIHBhcnQgb2YgaXRzIGNvbGxlY3Rpb24gb2Ygc2Nyb2xsaW5nIGV2ZW50cyB0aGF0IGl0XG4gKiBjYW4gYmUgbGlzdGVuZWQgdG8gdGhyb3VnaCB0aGUgc2VydmljZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Nkay1zY3JvbGxhYmxlXSwgW2Nka1Njcm9sbGFibGVdJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrU2Nyb2xsYWJsZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIF9lbGVtZW50U2Nyb2xsZWQ6IE9ic2VydmFibGU8RXZlbnQ+ID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBPYnNlcnZlcjxFdmVudD4pID0+XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgIGZyb21FdmVudCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3Njcm9sbCcpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgICAuc3Vic2NyaWJlKG9ic2VydmVyKSxcbiAgICApLFxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBwcm90ZWN0ZWQgbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGRpcj86IERpcmVjdGlvbmFsaXR5LFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyLnJlZ2lzdGVyKHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyLmRlcmVnaXN0ZXIodGhpcyk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGEgc2Nyb2xsIGV2ZW50IGlzIGZpcmVkIG9uIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIGVsZW1lbnRTY3JvbGxlZCgpOiBPYnNlcnZhYmxlPEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRTY3JvbGxlZDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBFbGVtZW50UmVmIGZvciB0aGUgdmlld3BvcnQuICovXG4gIGdldEVsZW1lbnRSZWYoKTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWY7XG4gIH1cblxuICAvKipcbiAgICogU2Nyb2xscyB0byB0aGUgc3BlY2lmaWVkIG9mZnNldHMuIFRoaXMgaXMgYSBub3JtYWxpemVkIHZlcnNpb24gb2YgdGhlIGJyb3dzZXIncyBuYXRpdmUgc2Nyb2xsVG9cbiAgICogbWV0aG9kLCBzaW5jZSBicm93c2VycyBhcmUgbm90IGNvbnNpc3RlbnQgYWJvdXQgd2hhdCBzY3JvbGxMZWZ0IG1lYW5zIGluIFJUTC4gRm9yIHRoaXMgbWV0aG9kXG4gICAqIGxlZnQgYW5kIHJpZ2h0IGFsd2F5cyByZWZlciB0byB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZSBvZiB0aGUgc2Nyb2xsaW5nIGNvbnRhaW5lciBpcnJlc3BlY3RpdmVcbiAgICogb2YgdGhlIGxheW91dCBkaXJlY3Rpb24uIHN0YXJ0IGFuZCBlbmQgcmVmZXIgdG8gbGVmdCBhbmQgcmlnaHQgaW4gYW4gTFRSIGNvbnRleHQgYW5kIHZpY2UtdmVyc2FcbiAgICogaW4gYW4gUlRMIGNvbnRleHQuXG4gICAqIEBwYXJhbSBvcHRpb25zIHNwZWNpZmllZCB0aGUgb2Zmc2V0cyB0byBzY3JvbGwgdG8uXG4gICAqL1xuICBzY3JvbGxUbyhvcHRpb25zOiBFeHRlbmRlZFNjcm9sbFRvT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLmRpciAmJiB0aGlzLmRpci52YWx1ZSA9PSAncnRsJztcblxuICAgIC8vIFJld3JpdGUgc3RhcnQgJiBlbmQgb2Zmc2V0cyBhcyByaWdodCBvciBsZWZ0IG9mZnNldHMuXG4gICAgaWYgKG9wdGlvbnMubGVmdCA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLmxlZnQgPSBpc1J0bCA/IG9wdGlvbnMuZW5kIDogb3B0aW9ucy5zdGFydDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5yaWdodCA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zLnJpZ2h0ID0gaXNSdGwgPyBvcHRpb25zLnN0YXJ0IDogb3B0aW9ucy5lbmQ7XG4gICAgfVxuXG4gICAgLy8gUmV3cml0ZSB0aGUgYm90dG9tIG9mZnNldCBhcyBhIHRvcCBvZmZzZXQuXG4gICAgaWYgKG9wdGlvbnMuYm90dG9tICE9IG51bGwpIHtcbiAgICAgIChvcHRpb25zIGFzIF9XaXRob3V0PF9Cb3R0b20+ICYgX1RvcCkudG9wID1cbiAgICAgICAgZWwuc2Nyb2xsSGVpZ2h0IC0gZWwuY2xpZW50SGVpZ2h0IC0gb3B0aW9ucy5ib3R0b207XG4gICAgfVxuXG4gICAgLy8gUmV3cml0ZSB0aGUgcmlnaHQgb2Zmc2V0IGFzIGEgbGVmdCBvZmZzZXQuXG4gICAgaWYgKGlzUnRsICYmIGdldFJ0bFNjcm9sbEF4aXNUeXBlKCkgIT0gUnRsU2Nyb2xsQXhpc1R5cGUuTk9STUFMKSB7XG4gICAgICBpZiAob3B0aW9ucy5sZWZ0ICE9IG51bGwpIHtcbiAgICAgICAgKG9wdGlvbnMgYXMgX1dpdGhvdXQ8X0xlZnQ+ICYgX1JpZ2h0KS5yaWdodCA9XG4gICAgICAgICAgZWwuc2Nyb2xsV2lkdGggLSBlbC5jbGllbnRXaWR0aCAtIG9wdGlvbnMubGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGdldFJ0bFNjcm9sbEF4aXNUeXBlKCkgPT0gUnRsU2Nyb2xsQXhpc1R5cGUuSU5WRVJURUQpIHtcbiAgICAgICAgb3B0aW9ucy5sZWZ0ID0gb3B0aW9ucy5yaWdodDtcbiAgICAgIH0gZWxzZSBpZiAoZ2V0UnRsU2Nyb2xsQXhpc1R5cGUoKSA9PSBSdGxTY3JvbGxBeGlzVHlwZS5ORUdBVEVEKSB7XG4gICAgICAgIG9wdGlvbnMubGVmdCA9IG9wdGlvbnMucmlnaHQgPyAtb3B0aW9ucy5yaWdodCA6IG9wdGlvbnMucmlnaHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25zLnJpZ2h0ICE9IG51bGwpIHtcbiAgICAgICAgKG9wdGlvbnMgYXMgX1dpdGhvdXQ8X1JpZ2h0PiAmIF9MZWZ0KS5sZWZ0ID1cbiAgICAgICAgICBlbC5zY3JvbGxXaWR0aCAtIGVsLmNsaWVudFdpZHRoIC0gb3B0aW9ucy5yaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9hcHBseVNjcm9sbFRvT3B0aW9ucyhvcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5U2Nyb2xsVG9PcHRpb25zKG9wdGlvbnM6IFNjcm9sbFRvT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoc3VwcG9ydHNTY3JvbGxCZWhhdmlvcigpKSB7XG4gICAgICBlbC5zY3JvbGxUbyhvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wdGlvbnMudG9wICE9IG51bGwpIHtcbiAgICAgICAgZWwuc2Nyb2xsVG9wID0gb3B0aW9ucy50b3A7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5sZWZ0ICE9IG51bGwpIHtcbiAgICAgICAgZWwuc2Nyb2xsTGVmdCA9IG9wdGlvbnMubGVmdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWVhc3VyZXMgdGhlIHNjcm9sbCBvZmZzZXQgcmVsYXRpdmUgdG8gdGhlIHNwZWNpZmllZCBlZGdlIG9mIHRoZSB2aWV3cG9ydC4gVGhpcyBtZXRob2QgY2FuIGJlXG4gICAqIHVzZWQgaW5zdGVhZCBvZiBkaXJlY3RseSBjaGVja2luZyBzY3JvbGxMZWZ0IG9yIHNjcm9sbFRvcCwgc2luY2UgYnJvd3NlcnMgYXJlIG5vdCBjb25zaXN0ZW50XG4gICAqIGFib3V0IHdoYXQgc2Nyb2xsTGVmdCBtZWFucyBpbiBSVEwuIFRoZSB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgYXJlIG5vcm1hbGl6ZWQgc3VjaCB0aGF0XG4gICAqIGxlZnQgYW5kIHJpZ2h0IGFsd2F5cyByZWZlciB0byB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZSBvZiB0aGUgc2Nyb2xsaW5nIGNvbnRhaW5lciBpcnJlc3BlY3RpdmVcbiAgICogb2YgdGhlIGxheW91dCBkaXJlY3Rpb24uIHN0YXJ0IGFuZCBlbmQgcmVmZXIgdG8gbGVmdCBhbmQgcmlnaHQgaW4gYW4gTFRSIGNvbnRleHQgYW5kIHZpY2UtdmVyc2FcbiAgICogaW4gYW4gUlRMIGNvbnRleHQuXG4gICAqIEBwYXJhbSBmcm9tIFRoZSBlZGdlIHRvIG1lYXN1cmUgZnJvbS5cbiAgICovXG4gIG1lYXN1cmVTY3JvbGxPZmZzZXQoZnJvbTogJ3RvcCcgfCAnbGVmdCcgfCAncmlnaHQnIHwgJ2JvdHRvbScgfCAnc3RhcnQnIHwgJ2VuZCcpOiBudW1iZXIge1xuICAgIGNvbnN0IExFRlQgPSAnbGVmdCc7XG4gICAgY29uc3QgUklHSFQgPSAncmlnaHQnO1xuICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGZyb20gPT0gJ3RvcCcpIHtcbiAgICAgIHJldHVybiBlbC5zY3JvbGxUb3A7XG4gICAgfVxuICAgIGlmIChmcm9tID09ICdib3R0b20nKSB7XG4gICAgICByZXR1cm4gZWwuc2Nyb2xsSGVpZ2h0IC0gZWwuY2xpZW50SGVpZ2h0IC0gZWwuc2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIFJld3JpdGUgc3RhcnQgJiBlbmQgYXMgbGVmdCBvciByaWdodCBvZmZzZXRzLlxuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5kaXIgJiYgdGhpcy5kaXIudmFsdWUgPT0gJ3J0bCc7XG4gICAgaWYgKGZyb20gPT0gJ3N0YXJ0Jykge1xuICAgICAgZnJvbSA9IGlzUnRsID8gUklHSFQgOiBMRUZUO1xuICAgIH0gZWxzZSBpZiAoZnJvbSA9PSAnZW5kJykge1xuICAgICAgZnJvbSA9IGlzUnRsID8gTEVGVCA6IFJJR0hUO1xuICAgIH1cblxuICAgIGlmIChpc1J0bCAmJiBnZXRSdGxTY3JvbGxBeGlzVHlwZSgpID09IFJ0bFNjcm9sbEF4aXNUeXBlLklOVkVSVEVEKSB7XG4gICAgICAvLyBGb3IgSU5WRVJURUQsIHNjcm9sbExlZnQgaXMgKHNjcm9sbFdpZHRoIC0gY2xpZW50V2lkdGgpIHdoZW4gc2Nyb2xsZWQgYWxsIHRoZSB3YXkgbGVmdCBhbmRcbiAgICAgIC8vIDAgd2hlbiBzY3JvbGxlZCBhbGwgdGhlIHdheSByaWdodC5cbiAgICAgIGlmIChmcm9tID09IExFRlQpIHtcbiAgICAgICAgcmV0dXJuIGVsLnNjcm9sbFdpZHRoIC0gZWwuY2xpZW50V2lkdGggLSBlbC5zY3JvbGxMZWZ0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVsLnNjcm9sbExlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1J0bCAmJiBnZXRSdGxTY3JvbGxBeGlzVHlwZSgpID09IFJ0bFNjcm9sbEF4aXNUeXBlLk5FR0FURUQpIHtcbiAgICAgIC8vIEZvciBORUdBVEVELCBzY3JvbGxMZWZ0IGlzIC0oc2Nyb2xsV2lkdGggLSBjbGllbnRXaWR0aCkgd2hlbiBzY3JvbGxlZCBhbGwgdGhlIHdheSBsZWZ0IGFuZFxuICAgICAgLy8gMCB3aGVuIHNjcm9sbGVkIGFsbCB0aGUgd2F5IHJpZ2h0LlxuICAgICAgaWYgKGZyb20gPT0gTEVGVCkge1xuICAgICAgICByZXR1cm4gZWwuc2Nyb2xsTGVmdCArIGVsLnNjcm9sbFdpZHRoIC0gZWwuY2xpZW50V2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLWVsLnNjcm9sbExlZnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciBOT1JNQUwsIGFzIHdlbGwgYXMgbm9uLVJUTCBjb250ZXh0cywgc2Nyb2xsTGVmdCBpcyAwIHdoZW4gc2Nyb2xsZWQgYWxsIHRoZSB3YXkgbGVmdCBhbmRcbiAgICAgIC8vIChzY3JvbGxXaWR0aCAtIGNsaWVudFdpZHRoKSB3aGVuIHNjcm9sbGVkIGFsbCB0aGUgd2F5IHJpZ2h0LlxuICAgICAgaWYgKGZyb20gPT0gTEVGVCkge1xuICAgICAgICByZXR1cm4gZWwuc2Nyb2xsTGVmdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBlbC5zY3JvbGxXaWR0aCAtIGVsLmNsaWVudFdpZHRoIC0gZWwuc2Nyb2xsTGVmdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==