/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from './snack-bar-config';
import { MatSnackBarRef } from './snack-bar-ref';
import * as i0 from "@angular/core";
import * as i1 from "./snack-bar-ref";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/common";
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
export class SimpleSnackBar {
    constructor(snackBarRef, data) {
        this.snackBarRef = snackBarRef;
        this.data = data;
    }
    /** Performs the action on the snack bar. */
    action() {
        this.snackBarRef.dismissWithAction();
    }
    /** If the action button should be shown. */
    get hasAction() {
        return !!this.data.action;
    }
}
SimpleSnackBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SimpleSnackBar, deps: [{ token: i1.MatSnackBarRef }, { token: MAT_SNACK_BAR_DATA }], target: i0.ɵɵFactoryTarget.Component });
SimpleSnackBar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: SimpleSnackBar, selector: "simple-snack-bar", host: { classAttribute: "mat-simple-snackbar" }, ngImport: i0, template: "<span class=\"mat-simple-snack-bar-content\">{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n", styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}.mat-simple-snack-bar-content{overflow:hidden;text-overflow:ellipsis}\n"], components: [{ type: i2.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SimpleSnackBar, decorators: [{
            type: Component,
            args: [{ selector: 'simple-snack-bar', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'class': 'mat-simple-snackbar',
                    }, template: "<span class=\"mat-simple-snack-bar-content\">{{data.message}}</span>\n<div class=\"mat-simple-snackbar-action\"  *ngIf=\"hasAction\">\n  <button mat-button (click)=\"action()\">{{data.action}}</button>\n</div>\n", styles: [".mat-simple-snackbar{display:flex;justify-content:space-between;align-items:center;line-height:20px;opacity:1}.mat-simple-snackbar-action{flex-shrink:0;margin:-8px -8px -8px 8px}.mat-simple-snackbar-action button{max-height:36px;min-width:0}[dir=rtl] .mat-simple-snackbar-action{margin-left:-8px;margin-right:8px}.mat-simple-snack-bar-content{overflow:hidden;text-overflow:ellipsis}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatSnackBarRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SNACK_BAR_DATA]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLXNuYWNrLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zbmFjay1iYXIvc2ltcGxlLXNuYWNrLWJhci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7QUFZL0M7OztHQUdHO0FBV0gsTUFBTSxPQUFPLGNBQWM7SUFJekIsWUFDUyxXQUEyQyxFQUN0QixJQUFTO1FBRDlCLGdCQUFXLEdBQVgsV0FBVyxDQUFnQztRQUdsRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsNENBQTRDO0lBQzVDLE1BQU07UUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxJQUFJLFNBQVM7UUFDWCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM1QixDQUFDOzsyR0FuQlUsY0FBYyxnREFNZixrQkFBa0I7K0ZBTmpCLGNBQWMseUdDcEMzQixxTkFJQTsyRkRnQ2EsY0FBYztrQkFWMUIsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxRQUN6Qzt3QkFDSixPQUFPLEVBQUUscUJBQXFCO3FCQUMvQjs7MEJBUUUsTUFBTTsyQkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3QsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX1NOQUNLX0JBUl9EQVRBfSBmcm9tICcuL3NuYWNrLWJhci1jb25maWcnO1xuaW1wb3J0IHtNYXRTbmFja0JhclJlZn0gZnJvbSAnLi9zbmFjay1iYXItcmVmJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGEgc2ltcGxlIHNuYWNrIGJhciBjb21wb25lbnQgdGhhdCBoYXMgYSBtZXNzYWdlIGFuZCBhIHNpbmdsZSBhY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGV4dE9ubHlTbmFja0JhciB7XG4gIGRhdGE6IHttZXNzYWdlOiBzdHJpbmc7IGFjdGlvbjogc3RyaW5nfTtcbiAgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPFRleHRPbmx5U25hY2tCYXI+O1xuICBhY3Rpb246ICgpID0+IHZvaWQ7XG4gIGhhc0FjdGlvbjogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB1c2VkIHRvIG9wZW4gYXMgdGhlIGRlZmF1bHQgc25hY2sgYmFyLCBtYXRjaGluZyBtYXRlcmlhbCBzcGVjLlxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGludGVybmFsbHkgYnkgdGhlIHNuYWNrIGJhciBzZXJ2aWNlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdzaW1wbGUtc25hY2stYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICdzaW1wbGUtc25hY2stYmFyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2ltcGxlLXNuYWNrLWJhci5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNpbXBsZS1zbmFja2JhcicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIFNpbXBsZVNuYWNrQmFyIGltcGxlbWVudHMgVGV4dE9ubHlTbmFja0JhciB7XG4gIC8qKiBEYXRhIHRoYXQgd2FzIGluamVjdGVkIGludG8gdGhlIHNuYWNrIGJhci4gKi9cbiAgZGF0YToge21lc3NhZ2U6IHN0cmluZzsgYWN0aW9uOiBzdHJpbmd9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8U2ltcGxlU25hY2tCYXI+LFxuICAgIEBJbmplY3QoTUFUX1NOQUNLX0JBUl9EQVRBKSBkYXRhOiBhbnksXG4gICkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICAvKiogUGVyZm9ybXMgdGhlIGFjdGlvbiBvbiB0aGUgc25hY2sgYmFyLiAqL1xuICBhY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zbmFja0JhclJlZi5kaXNtaXNzV2l0aEFjdGlvbigpO1xuICB9XG5cbiAgLyoqIElmIHRoZSBhY3Rpb24gYnV0dG9uIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgZ2V0IGhhc0FjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmRhdGEuYWN0aW9uO1xuICB9XG59XG4iLCI8c3BhbiBjbGFzcz1cIm1hdC1zaW1wbGUtc25hY2stYmFyLWNvbnRlbnRcIj57e2RhdGEubWVzc2FnZX19PC9zcGFuPlxuPGRpdiBjbGFzcz1cIm1hdC1zaW1wbGUtc25hY2tiYXItYWN0aW9uXCIgICpuZ0lmPVwiaGFzQWN0aW9uXCI+XG4gIDxidXR0b24gbWF0LWJ1dHRvbiAoY2xpY2spPVwiYWN0aW9uKClcIj57e2RhdGEuYWN0aW9ufX08L2J1dHRvbj5cbjwvZGl2PlxuIl19