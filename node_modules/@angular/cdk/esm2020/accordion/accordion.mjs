/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, InjectionToken, Input } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/** Used to generate unique ID for each accordion. */
let nextId = 0;
/**
 * Injection token that can be used to reference instances of `CdkAccordion`. It serves
 * as alternative token to the actual `CdkAccordion` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CDK_ACCORDION = new InjectionToken('CdkAccordion');
/**
 * Directive whose purpose is to manage the expanded state of CdkAccordionItem children.
 */
export class CdkAccordion {
    constructor() {
        /** Emits when the state of the accordion changes */
        this._stateChanges = new Subject();
        /** Stream that emits true/false when openAll/closeAll is triggered. */
        this._openCloseAllActions = new Subject();
        /** A readonly id value to use for unique selection coordination. */
        this.id = `cdk-accordion-${nextId++}`;
        this._multi = false;
    }
    /** Whether the accordion should allow multiple expanded accordion items simultaneously. */
    get multi() {
        return this._multi;
    }
    set multi(multi) {
        this._multi = coerceBooleanProperty(multi);
    }
    /** Opens all enabled accordion items in an accordion where multi is enabled. */
    openAll() {
        if (this._multi) {
            this._openCloseAllActions.next(true);
        }
    }
    /** Closes all enabled accordion items in an accordion where multi is enabled. */
    closeAll() {
        this._openCloseAllActions.next(false);
    }
    ngOnChanges(changes) {
        this._stateChanges.next(changes);
    }
    ngOnDestroy() {
        this._stateChanges.complete();
        this._openCloseAllActions.complete();
    }
}
CdkAccordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAccordion, deps: [], target: i0.ɵɵFactoryTarget.Directive });
CdkAccordion.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkAccordion, selector: "cdk-accordion, [cdkAccordion]", inputs: { multi: "multi" }, providers: [{ provide: CDK_ACCORDION, useExisting: CdkAccordion }], exportAs: ["cdkAccordion"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkAccordion, decorators: [{
            type: Directive,
            args: [{
                    selector: 'cdk-accordion, [cdkAccordion]',
                    exportAs: 'cdkAccordion',
                    providers: [{ provide: CDK_ACCORDION, useExisting: CdkAccordion }],
                }]
        }], propDecorators: { multi: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9hY2NvcmRpb24vYWNjb3JkaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBc0MsTUFBTSxlQUFlLENBQUM7QUFDcEcsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7QUFFN0IscURBQXFEO0FBQ3JELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQWUsY0FBYyxDQUFDLENBQUM7QUFFOUU7O0dBRUc7QUFNSCxNQUFNLE9BQU8sWUFBWTtJQUx6QjtRQU1FLG9EQUFvRDtRQUMzQyxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFpQixDQUFDO1FBRXRELHVFQUF1RTtRQUM5RCx5QkFBb0IsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUV6RSxvRUFBb0U7UUFDM0QsT0FBRSxHQUFXLGlCQUFpQixNQUFNLEVBQUUsRUFBRSxDQUFDO1FBVTFDLFdBQU0sR0FBWSxLQUFLLENBQUM7S0FzQmpDO0lBOUJDLDJGQUEyRjtJQUMzRixJQUNJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUNELElBQUksS0FBSyxDQUFDLEtBQW1CO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUdELGdGQUFnRjtJQUNoRixPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFRCxpRkFBaUY7SUFDakYsUUFBUTtRQUNOLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7O3lHQXZDVSxZQUFZOzZGQUFaLFlBQVksb0ZBRlosQ0FBQyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBQyxDQUFDOzJGQUVyRCxZQUFZO2tCQUx4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLFFBQVEsRUFBRSxjQUFjO29CQUN4QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxjQUFjLEVBQUMsQ0FBQztpQkFDakU7OEJBYUssS0FBSztzQkFEUixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5qZWN0aW9uVG9rZW4sIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSB1bmlxdWUgSUQgZm9yIGVhY2ggYWNjb3JkaW9uLiAqL1xubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgQ2RrQWNjb3JkaW9uYC4gSXQgc2VydmVzXG4gKiBhcyBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBDZGtBY2NvcmRpb25gIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgQ0RLX0FDQ09SRElPTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxDZGtBY2NvcmRpb24+KCdDZGtBY2NvcmRpb24nKTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBtYW5hZ2UgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIENka0FjY29yZGlvbkl0ZW0gY2hpbGRyZW4uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nkay1hY2NvcmRpb24sIFtjZGtBY2NvcmRpb25dJyxcbiAgZXhwb3J0QXM6ICdjZGtBY2NvcmRpb24nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ0RLX0FDQ09SRElPTiwgdXNlRXhpc3Rpbmc6IENka0FjY29yZGlvbn1dLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtBY2NvcmRpb24gaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzdGF0ZSBvZiB0aGUgYWNjb3JkaW9uIGNoYW5nZXMgKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PFNpbXBsZUNoYW5nZXM+KCk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHRydWUvZmFsc2Ugd2hlbiBvcGVuQWxsL2Nsb3NlQWxsIGlzIHRyaWdnZXJlZC4gKi9cbiAgcmVhZG9ubHkgX29wZW5DbG9zZUFsbEFjdGlvbnM6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKiBBIHJlYWRvbmx5IGlkIHZhbHVlIHRvIHVzZSBmb3IgdW5pcXVlIHNlbGVjdGlvbiBjb29yZGluYXRpb24uICovXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmcgPSBgY2RrLWFjY29yZGlvbi0ke25leHRJZCsrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjY29yZGlvbiBzaG91bGQgYWxsb3cgbXVsdGlwbGUgZXhwYW5kZWQgYWNjb3JkaW9uIGl0ZW1zIHNpbXVsdGFuZW91c2x5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpO1xuICB9XG4gIHNldCBtdWx0aShtdWx0aTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fbXVsdGkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkobXVsdGkpO1xuICB9XG4gIHByaXZhdGUgX211bHRpOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE9wZW5zIGFsbCBlbmFibGVkIGFjY29yZGlvbiBpdGVtcyBpbiBhbiBhY2NvcmRpb24gd2hlcmUgbXVsdGkgaXMgZW5hYmxlZC4gKi9cbiAgb3BlbkFsbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbXVsdGkpIHtcbiAgICAgIHRoaXMuX29wZW5DbG9zZUFsbEFjdGlvbnMubmV4dCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIGFsbCBlbmFibGVkIGFjY29yZGlvbiBpdGVtcyBpbiBhbiBhY2NvcmRpb24gd2hlcmUgbXVsdGkgaXMgZW5hYmxlZC4gKi9cbiAgY2xvc2VBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5fb3BlbkNsb3NlQWxsQWN0aW9ucy5uZXh0KGZhbHNlKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dChjaGFuZ2VzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX29wZW5DbG9zZUFsbEFjdGlvbnMuY29tcGxldGUoKTtcbiAgfVxufVxuIl19