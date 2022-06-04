/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, InjectionToken, Input, ViewEncapsulation, Directive, Inject, Optional, } from '@angular/core';
import { mixinDisabled } from '../common-behaviors/disabled';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
import * as i0 from "@angular/core";
// Notes on the accessibility pattern used for `mat-optgroup`.
// The option group has two different "modes": regular and inert. The regular mode uses the
// recommended a11y pattern which has `role="group"` on the group element with `aria-labelledby`
// pointing to the label. This works for `mat-select`, but it seems to hit a bug for autocomplete
// under VoiceOver where the group doesn't get read out at all. The bug appears to be that if
// there's __any__ a11y-related attribute on the group (e.g. `role` or `aria-labelledby`),
// VoiceOver on Safari won't read it out.
// We've introduced the `inert` mode as a workaround. Under this mode, all a11y attributes are
// removed from the group, and we get the screen reader to read out the group label by mirroring it
// inside an invisible element in the option. This is sub-optimal, because the screen reader will
// repeat the group label on each navigation, whereas the default pattern only reads the group when
// the user enters a new group. The following alternate approaches were considered:
// 1. Reading out the group label using the `LiveAnnouncer` solves the problem, but we can't control
//    when the text will be read out so sometimes it comes in too late or never if the user
//    navigates quickly.
// 2. `<mat-option aria-describedby="groupLabel"` - This works on Safari, but VoiceOver in Chrome
//    won't read out the description at all.
// 3. `<mat-option aria-labelledby="optionLabel groupLabel"` - This works on Chrome, but Safari
//     doesn't read out the text at all. Furthermore, on
// Boilerplate for applying mixins to MatOptgroup.
/** @docs-private */
const _MatOptgroupMixinBase = mixinDisabled(class {
});
// Counter for unique group ids.
let _uniqueOptgroupIdCounter = 0;
export class _MatOptgroupBase extends _MatOptgroupMixinBase {
    constructor(parent) {
        super();
        /** Unique id for the underlying label. */
        this._labelId = `mat-optgroup-label-${_uniqueOptgroupIdCounter++}`;
        this._inert = parent?.inertGroups ?? false;
    }
}
_MatOptgroupBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatOptgroupBase, deps: [{ token: MAT_OPTION_PARENT_COMPONENT, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatOptgroupBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatOptgroupBase, inputs: { label: "label" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatOptgroupBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_OPTION_PARENT_COMPONENT]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { label: [{
                type: Input
            }] } });
/**
 * Injection token that can be used to reference instances of `MatOptgroup`. It serves as
 * alternative token to the actual `MatOptgroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const MAT_OPTGROUP = new InjectionToken('MatOptgroup');
/**
 * Component that is used to group instances of `mat-option`.
 */
export class MatOptgroup extends _MatOptgroupBase {
}
MatOptgroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatOptgroup, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatOptgroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatOptgroup, selector: "mat-optgroup", inputs: { disabled: "disabled" }, host: { properties: { "attr.role": "_inert ? null : \"group\"", "attr.aria-disabled": "_inert ? null : disabled.toString()", "attr.aria-labelledby": "_inert ? null : _labelId", "class.mat-optgroup-disabled": "disabled" }, classAttribute: "mat-optgroup" }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatOptgroup }], exportAs: ["matOptgroup"], usesInheritance: true, ngImport: i0, template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatOptgroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-optgroup', exportAs: 'matOptgroup', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['disabled'], host: {
                        'class': 'mat-optgroup',
                        '[attr.role]': '_inert ? null : "group"',
                        '[attr.aria-disabled]': '_inert ? null : disabled.toString()',
                        '[attr.aria-labelledby]': '_inert ? null : _labelId',
                        '[class.mat-optgroup-disabled]': 'disabled',
                    }, providers: [{ provide: MAT_OPTGROUP, useExisting: MatOptgroup }], template: "<span class=\"mat-optgroup-label\" aria-hidden=\"true\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></span>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n", styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}\n"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0Z3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vb3B0Z3JvdXAuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxjQUFjLEVBQ2QsS0FBSyxFQUNMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsTUFBTSxFQUNOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWEsYUFBYSxFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUEyQiwyQkFBMkIsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUV0Riw4REFBOEQ7QUFDOUQsMkZBQTJGO0FBQzNGLGdHQUFnRztBQUNoRyxpR0FBaUc7QUFDakcsNkZBQTZGO0FBQzdGLDBGQUEwRjtBQUMxRix5Q0FBeUM7QUFDekMsOEZBQThGO0FBQzlGLG1HQUFtRztBQUNuRyxpR0FBaUc7QUFDakcsbUdBQW1HO0FBQ25HLG1GQUFtRjtBQUNuRixvR0FBb0c7QUFDcEcsMkZBQTJGO0FBQzNGLHdCQUF3QjtBQUN4QixpR0FBaUc7QUFDakcsNENBQTRDO0FBQzVDLCtGQUErRjtBQUMvRix3REFBd0Q7QUFFeEQsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLHFCQUFxQixHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQUV0RCxnQ0FBZ0M7QUFDaEMsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7QUFHakMsTUFBTSxPQUFPLGdCQUFpQixTQUFRLHFCQUFxQjtJQVV6RCxZQUE2RCxNQUFpQztRQUM1RixLQUFLLEVBQUUsQ0FBQztRQVBWLDBDQUEwQztRQUMxQyxhQUFRLEdBQVcsc0JBQXNCLHdCQUF3QixFQUFFLEVBQUUsQ0FBQztRQU9wRSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRSxXQUFXLElBQUksS0FBSyxDQUFDO0lBQzdDLENBQUM7OzZHQWJVLGdCQUFnQixrQkFVUCwyQkFBMkI7aUdBVnBDLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixTQUFTOzswQkFXSyxNQUFNOzJCQUFDLDJCQUEyQjs7MEJBQUcsUUFBUTs0Q0FSakQsS0FBSztzQkFBYixLQUFLOztBQWNSOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxjQUFjLENBQWMsYUFBYSxDQUFDLENBQUM7QUFFM0U7O0dBRUc7QUFrQkgsTUFBTSxPQUFPLFdBQVksU0FBUSxnQkFBZ0I7O3dHQUFwQyxXQUFXOzRGQUFYLFdBQVcseVVBRlgsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDLDRFQzFGaEUseUxBRUE7MkZEMEZhLFdBQVc7a0JBakJ2QixTQUFTOytCQUNFLGNBQWMsWUFDZCxhQUFhLGlCQUVSLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sVUFDdkMsQ0FBQyxVQUFVLENBQUMsUUFFZDt3QkFDSixPQUFPLEVBQUUsY0FBYzt3QkFDdkIsYUFBYSxFQUFFLHlCQUF5Qjt3QkFDeEMsc0JBQXNCLEVBQUUscUNBQXFDO3dCQUM3RCx3QkFBd0IsRUFBRSwwQkFBMEI7d0JBQ3BELCtCQUErQixFQUFFLFVBQVU7cUJBQzVDLGFBQ1UsQ0FBQyxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxhQUFhLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBtaXhpbkRpc2FibGVkfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2Rpc2FibGVkJztcbmltcG9ydCB7TWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LCBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlR9IGZyb20gJy4vb3B0aW9uLXBhcmVudCc7XG5cbi8vIE5vdGVzIG9uIHRoZSBhY2Nlc3NpYmlsaXR5IHBhdHRlcm4gdXNlZCBmb3IgYG1hdC1vcHRncm91cGAuXG4vLyBUaGUgb3B0aW9uIGdyb3VwIGhhcyB0d28gZGlmZmVyZW50IFwibW9kZXNcIjogcmVndWxhciBhbmQgaW5lcnQuIFRoZSByZWd1bGFyIG1vZGUgdXNlcyB0aGVcbi8vIHJlY29tbWVuZGVkIGExMXkgcGF0dGVybiB3aGljaCBoYXMgYHJvbGU9XCJncm91cFwiYCBvbiB0aGUgZ3JvdXAgZWxlbWVudCB3aXRoIGBhcmlhLWxhYmVsbGVkYnlgXG4vLyBwb2ludGluZyB0byB0aGUgbGFiZWwuIFRoaXMgd29ya3MgZm9yIGBtYXQtc2VsZWN0YCwgYnV0IGl0IHNlZW1zIHRvIGhpdCBhIGJ1ZyBmb3IgYXV0b2NvbXBsZXRlXG4vLyB1bmRlciBWb2ljZU92ZXIgd2hlcmUgdGhlIGdyb3VwIGRvZXNuJ3QgZ2V0IHJlYWQgb3V0IGF0IGFsbC4gVGhlIGJ1ZyBhcHBlYXJzIHRvIGJlIHRoYXQgaWZcbi8vIHRoZXJlJ3MgX19hbnlfXyBhMTF5LXJlbGF0ZWQgYXR0cmlidXRlIG9uIHRoZSBncm91cCAoZS5nLiBgcm9sZWAgb3IgYGFyaWEtbGFiZWxsZWRieWApLFxuLy8gVm9pY2VPdmVyIG9uIFNhZmFyaSB3b24ndCByZWFkIGl0IG91dC5cbi8vIFdlJ3ZlIGludHJvZHVjZWQgdGhlIGBpbmVydGAgbW9kZSBhcyBhIHdvcmthcm91bmQuIFVuZGVyIHRoaXMgbW9kZSwgYWxsIGExMXkgYXR0cmlidXRlcyBhcmVcbi8vIHJlbW92ZWQgZnJvbSB0aGUgZ3JvdXAsIGFuZCB3ZSBnZXQgdGhlIHNjcmVlbiByZWFkZXIgdG8gcmVhZCBvdXQgdGhlIGdyb3VwIGxhYmVsIGJ5IG1pcnJvcmluZyBpdFxuLy8gaW5zaWRlIGFuIGludmlzaWJsZSBlbGVtZW50IGluIHRoZSBvcHRpb24uIFRoaXMgaXMgc3ViLW9wdGltYWwsIGJlY2F1c2UgdGhlIHNjcmVlbiByZWFkZXIgd2lsbFxuLy8gcmVwZWF0IHRoZSBncm91cCBsYWJlbCBvbiBlYWNoIG5hdmlnYXRpb24sIHdoZXJlYXMgdGhlIGRlZmF1bHQgcGF0dGVybiBvbmx5IHJlYWRzIHRoZSBncm91cCB3aGVuXG4vLyB0aGUgdXNlciBlbnRlcnMgYSBuZXcgZ3JvdXAuIFRoZSBmb2xsb3dpbmcgYWx0ZXJuYXRlIGFwcHJvYWNoZXMgd2VyZSBjb25zaWRlcmVkOlxuLy8gMS4gUmVhZGluZyBvdXQgdGhlIGdyb3VwIGxhYmVsIHVzaW5nIHRoZSBgTGl2ZUFubm91bmNlcmAgc29sdmVzIHRoZSBwcm9ibGVtLCBidXQgd2UgY2FuJ3QgY29udHJvbFxuLy8gICAgd2hlbiB0aGUgdGV4dCB3aWxsIGJlIHJlYWQgb3V0IHNvIHNvbWV0aW1lcyBpdCBjb21lcyBpbiB0b28gbGF0ZSBvciBuZXZlciBpZiB0aGUgdXNlclxuLy8gICAgbmF2aWdhdGVzIHF1aWNrbHkuXG4vLyAyLiBgPG1hdC1vcHRpb24gYXJpYS1kZXNjcmliZWRieT1cImdyb3VwTGFiZWxcImAgLSBUaGlzIHdvcmtzIG9uIFNhZmFyaSwgYnV0IFZvaWNlT3ZlciBpbiBDaHJvbWVcbi8vICAgIHdvbid0IHJlYWQgb3V0IHRoZSBkZXNjcmlwdGlvbiBhdCBhbGwuXG4vLyAzLiBgPG1hdC1vcHRpb24gYXJpYS1sYWJlbGxlZGJ5PVwib3B0aW9uTGFiZWwgZ3JvdXBMYWJlbFwiYCAtIFRoaXMgd29ya3Mgb24gQ2hyb21lLCBidXQgU2FmYXJpXG4vLyAgICAgZG9lc24ndCByZWFkIG91dCB0aGUgdGV4dCBhdCBhbGwuIEZ1cnRoZXJtb3JlLCBvblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdE9wdGdyb3VwLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRPcHRncm91cE1peGluQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vLyBDb3VudGVyIGZvciB1bmlxdWUgZ3JvdXAgaWRzLlxubGV0IF91bmlxdWVPcHRncm91cElkQ291bnRlciA9IDA7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRPcHRncm91cEJhc2UgZXh0ZW5kcyBfTWF0T3B0Z3JvdXBNaXhpbkJhc2UgaW1wbGVtZW50cyBDYW5EaXNhYmxlIHtcbiAgLyoqIExhYmVsIGZvciB0aGUgb3B0aW9uIGdyb3VwLiAqL1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSB1bmRlcmx5aW5nIGxhYmVsLiAqL1xuICBfbGFiZWxJZDogc3RyaW5nID0gYG1hdC1vcHRncm91cC1sYWJlbC0ke191bmlxdWVPcHRncm91cElkQ291bnRlcisrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGdyb3VwIGlzIGluIGluZXJ0IGExMXkgbW9kZS4gKi9cbiAgX2luZXJ0OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UKSBAT3B0aW9uYWwoKSBwYXJlbnQ/OiBNYXRPcHRpb25QYXJlbnRDb21wb25lbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2luZXJ0ID0gcGFyZW50Py5pbmVydEdyb3VwcyA/PyBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdE9wdGdyb3VwYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRPcHRncm91cGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfT1BUR1JPVVAgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0T3B0Z3JvdXA+KCdNYXRPcHRncm91cCcpO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGlzIHVzZWQgdG8gZ3JvdXAgaW5zdGFuY2VzIG9mIGBtYXQtb3B0aW9uYC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW9wdGdyb3VwJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnb3B0Z3JvdXAuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgc3R5bGVVcmxzOiBbJ29wdGdyb3VwLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1vcHRncm91cCcsXG4gICAgJ1thdHRyLnJvbGVdJzogJ19pbmVydCA/IG51bGwgOiBcImdyb3VwXCInLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdfaW5lcnQgPyBudWxsIDogZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2luZXJ0ID8gbnVsbCA6IF9sYWJlbElkJyxcbiAgICAnW2NsYXNzLm1hdC1vcHRncm91cC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX09QVEdST1VQLCB1c2VFeGlzdGluZzogTWF0T3B0Z3JvdXB9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0T3B0Z3JvdXAgZXh0ZW5kcyBfTWF0T3B0Z3JvdXBCYXNlIHt9XG4iLCI8c3BhbiBjbGFzcz1cIm1hdC1vcHRncm91cC1sYWJlbFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIFtpZF09XCJfbGFiZWxJZFwiPnt7IGxhYmVsIH19IDxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtb3B0aW9uLCBuZy1jb250YWluZXJcIj48L25nLWNvbnRlbnQ+XG4iXX0=