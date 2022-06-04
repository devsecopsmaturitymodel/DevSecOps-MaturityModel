/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, InjectionToken, Inject, Optional, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MAT_TAB_CONTENT } from './tab-content';
import { MAT_TAB_LABEL, MatTabLabel, MAT_TAB } from './tab-label';
import * as i0 from "@angular/core";
// Boilerplate for applying mixins to MatTab.
/** @docs-private */
const _MatTabBase = mixinDisabled(class {
});
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export const MAT_TAB_GROUP = new InjectionToken('MAT_TAB_GROUP');
export class MatTab extends _MatTabBase {
    constructor(_viewContainerRef, _closestTabGroup) {
        super();
        this._viewContainerRef = _viewContainerRef;
        this._closestTabGroup = _closestTabGroup;
        /** Plain text label for the tab, used when there is no template label. */
        this.textLabel = '';
        /** Portal that will be the hosted content of the tab */
        this._contentPortal = null;
        /** Emits whenever the internal state of the tab changes. */
        this._stateChanges = new Subject();
        /**
         * The relatively indexed position where 0 represents the center, negative is left, and positive
         * represents the right.
         */
        this.position = null;
        /**
         * The initial relatively index origin of the tab if it was created and selected after there
         * was already a selected tab. Provides context of what position the tab should originate from.
         */
        this.origin = null;
        /**
         * Whether the tab is currently active.
         */
        this.isActive = false;
    }
    /** Content for the tab label given by `<ng-template mat-tab-label>`. */
    get templateLabel() {
        return this._templateLabel;
    }
    set templateLabel(value) {
        this._setTemplateLabelInput(value);
    }
    /** @docs-private */
    get content() {
        return this._contentPortal;
    }
    ngOnChanges(changes) {
        if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
            this._stateChanges.next();
        }
    }
    ngOnDestroy() {
        this._stateChanges.complete();
    }
    ngOnInit() {
        this._contentPortal = new TemplatePortal(this._explicitContent || this._implicitContent, this._viewContainerRef);
    }
    /**
     * This has been extracted to a util because of TS 4 and VE.
     * View Engine doesn't support property rename inheritance.
     * TS 4.0 doesn't allow properties to override accessors or vice-versa.
     * @docs-private
     */
    _setTemplateLabelInput(value) {
        // Only update the label if the query managed to find one. This works around an issue where a
        // user may have manually set `templateLabel` during creation mode, which would then get
        // clobbered by `undefined` when the query resolves. Also note that we check that the closest
        // tab matches the current one so that we don't pick up labels from nested tabs.
        if (value && value._closestTab === this) {
            this._templateLabel = value;
        }
    }
}
MatTab.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTab, deps: [{ token: i0.ViewContainerRef }, { token: MAT_TAB_GROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatTab.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatTab, selector: "mat-tab", inputs: { disabled: "disabled", textLabel: ["label", "textLabel"], ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], labelClass: "labelClass", bodyClass: "bodyClass" }, providers: [{ provide: MAT_TAB, useExisting: MatTab }], queries: [{ propertyName: "templateLabel", first: true, predicate: MAT_TAB_LABEL, descendants: true }, { propertyName: "_explicitContent", first: true, predicate: MAT_TAB_CONTENT, descendants: true, read: TemplateRef, static: true }], viewQueries: [{ propertyName: "_implicitContent", first: true, predicate: TemplateRef, descendants: true, static: true }], exportAs: ["matTab"], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n", changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTab, decorators: [{
            type: Component,
            args: [{ selector: 'mat-tab', inputs: ['disabled'], changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, exportAs: 'matTab', providers: [{ provide: MAT_TAB, useExisting: MatTab }], template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_TAB_GROUP]
                }, {
                    type: Optional
                }] }]; }, propDecorators: { templateLabel: [{
                type: ContentChild,
                args: [MAT_TAB_LABEL]
            }], _explicitContent: [{
                type: ContentChild,
                args: [MAT_TAB_CONTENT, { read: TemplateRef, static: true }]
            }], _implicitContent: [{
                type: ViewChild,
                args: [TemplateRef, { static: true }]
            }], textLabel: [{
                type: Input,
                args: ['label']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], labelClass: [{
                type: Input
            }], bodyClass: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBS0wsV0FBVyxFQUNYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBYSxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFDLE1BQU0sYUFBYSxDQUFDOztBQUVoRSw2Q0FBNkM7QUFDN0Msb0JBQW9CO0FBQ3BCLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQUU1Qzs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQU0sZUFBZSxDQUFDLENBQUM7QUFZdEUsTUFBTSxPQUFPLE1BQU8sU0FBUSxXQUFXO0lBd0VyQyxZQUNVLGlCQUFtQyxFQUNELGdCQUFxQjtRQUUvRCxLQUFLLEVBQUUsQ0FBQztRQUhBLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQUs7UUF0RGpFLDBFQUEwRTtRQUMxRCxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBdUJ2Qyx3REFBd0Q7UUFDaEQsbUJBQWMsR0FBMEIsSUFBSSxDQUFDO1FBT3JELDREQUE0RDtRQUNuRCxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFN0M7OztXQUdHO1FBQ0gsYUFBUSxHQUFrQixJQUFJLENBQUM7UUFFL0I7OztXQUdHO1FBQ0gsV0FBTSxHQUFrQixJQUFJLENBQUM7UUFFN0I7O1dBRUc7UUFDSCxhQUFRLEdBQUcsS0FBSyxDQUFDO0lBT2pCLENBQUM7SUE1RUQsd0VBQXdFO0lBQ3hFLElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsS0FBa0I7UUFDbEMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUF1Q0Qsb0JBQW9CO0lBQ3BCLElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBNkJELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDdEMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFDOUMsSUFBSSxDQUFDLGlCQUFpQixDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sc0JBQXNCLENBQUMsS0FBOEI7UUFDN0QsNkZBQTZGO1FBQzdGLHdGQUF3RjtRQUN4Riw2RkFBNkY7UUFDN0YsZ0ZBQWdGO1FBQ2hGLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs7bUdBOUdVLE1BQU0sa0RBMEVQLGFBQWE7dUZBMUVaLE1BQU0sd1BBRk4sQ0FBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBQyxDQUFDLHFFQUl0QyxhQUFhLG1GQVliLGVBQWUsMkJBQVMsV0FBVyw2RkFJdEMsV0FBVyxnSUNyRXhCLCtRQUlBOzJGRCtDYSxNQUFNO2tCQVZsQixTQUFTOytCQUNFLFNBQVMsVUFFWCxDQUFDLFVBQVUsQ0FBQyxtQkFFSCx1QkFBdUIsQ0FBQyxPQUFPLGlCQUNqQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQzNCLFFBQVEsYUFDUCxDQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxXQUFXLFFBQVEsRUFBQyxDQUFDOzswQkE0RWpELE1BQU07MkJBQUMsYUFBYTs7MEJBQUcsUUFBUTs0Q0F2RTlCLGFBQWE7c0JBRGhCLFlBQVk7dUJBQUMsYUFBYTtnQkFhM0IsZ0JBQWdCO3NCQURmLFlBQVk7dUJBQUMsZUFBZSxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUl4QixnQkFBZ0I7c0JBQXZELFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFHdEIsU0FBUztzQkFBeEIsS0FBSzt1QkFBQyxPQUFPO2dCQUdPLFNBQVM7c0JBQTdCLEtBQUs7dUJBQUMsWUFBWTtnQkFNTyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFNZixVQUFVO3NCQUFsQixLQUFLO2dCQU1HLFNBQVM7c0JBQWpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBtaXhpbkRpc2FibGVkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01BVF9UQUJfQ09OVEVOVH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01BVF9UQUJfTEFCRUwsIE1hdFRhYkxhYmVsLCBNQVRfVEFCfSBmcm9tICcuL3RhYi1sYWJlbCc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRUYWJCYXNlID0gbWl4aW5EaXNhYmxlZChjbGFzcyB7fSk7XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgdGFiIGdyb3VwIHRvIGEgdGFiIHdpdGhvdXQgY2F1c2luZyBhIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfVEFCX0dST1VQID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ01BVF9UQUJfR1JPVVAnKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYicsXG4gIHRlbXBsYXRlVXJsOiAndGFiLmh0bWwnLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBleHBvcnRBczogJ21hdFRhYicsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfVEFCLCB1c2VFeGlzdGluZzogTWF0VGFifV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYiBleHRlbmRzIF9NYXRUYWJCYXNlIGltcGxlbWVudHMgT25Jbml0LCBDYW5EaXNhYmxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKiBDb250ZW50IGZvciB0aGUgdGFiIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1BVF9UQUJfTEFCRUwpXG4gIGdldCB0ZW1wbGF0ZUxhYmVsKCk6IE1hdFRhYkxhYmVsIHtcbiAgICByZXR1cm4gdGhpcy5fdGVtcGxhdGVMYWJlbDtcbiAgfVxuICBzZXQgdGVtcGxhdGVMYWJlbCh2YWx1ZTogTWF0VGFiTGFiZWwpIHtcbiAgICB0aGlzLl9zZXRUZW1wbGF0ZUxhYmVsSW5wdXQodmFsdWUpO1xuICB9XG4gIHByb3RlY3RlZCBfdGVtcGxhdGVMYWJlbDogTWF0VGFiTGFiZWw7XG5cbiAgLyoqXG4gICAqIFRlbXBsYXRlIHByb3ZpZGVkIGluIHRoZSB0YWIgY29udGVudCB0aGF0IHdpbGwgYmUgdXNlZCBpZiBwcmVzZW50LCB1c2VkIHRvIGVuYWJsZSBsYXp5LWxvYWRpbmdcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTUFUX1RBQl9DT05URU5ULCB7cmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZX0pXG4gIF9leHBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFRlbXBsYXRlIGluc2lkZSB0aGUgTWF0VGFiIHZpZXcgdGhhdCBjb250YWlucyBhbiBgPG5nLWNvbnRlbnQ+YC4gKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIF9pbXBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFBsYWluIHRleHQgbGFiZWwgZm9yIHRoZSB0YWIsIHVzZWQgd2hlbiB0aGVyZSBpcyBubyB0ZW1wbGF0ZSBsYWJlbC4gKi9cbiAgQElucHV0KCdsYWJlbCcpIHRleHRMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEFyaWEgbGFiZWwgZm9yIHRoZSB0YWIuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCB0aGUgdGFiIGlzIGxhYmVsbGVkIGJ5LlxuICAgKiBXaWxsIGJlIGNsZWFyZWQgaWYgYGFyaWEtbGFiZWxgIGlzIHNldCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgdGFiIGxhYmVsIGluc2lkZSB0aGUgbWF0LXRhYi1oZWFkZXIgY29udGFpbmVyLlxuICAgKiBTdXBwb3J0cyBzdHJpbmcgYW5kIHN0cmluZyBhcnJheSB2YWx1ZXMsIHNhbWUgYXMgYG5nQ2xhc3NgLlxuICAgKi9cbiAgQElucHV0KCkgbGFiZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSB0YWIgbWF0LXRhYi1ib2R5IGNvbnRhaW5lci5cbiAgICogU3VwcG9ydHMgc3RyaW5nIGFuZCBzdHJpbmcgYXJyYXkgdmFsdWVzLCBzYW1lIGFzIGBuZ0NsYXNzYC5cbiAgICovXG4gIEBJbnB1dCgpIGJvZHlDbGFzczogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFBvcnRhbCB0aGF0IHdpbGwgYmUgdGhlIGhvc3RlZCBjb250ZW50IG9mIHRoZSB0YWIgKi9cbiAgcHJpdmF0ZSBfY29udGVudFBvcnRhbDogVGVtcGxhdGVQb3J0YWwgfCBudWxsID0gbnVsbDtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBnZXQgY29udGVudCgpOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50UG9ydGFsO1xuICB9XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgdGFiIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVsYXRpdmVseSBpbmRleGVkIHBvc2l0aW9uIHdoZXJlIDAgcmVwcmVzZW50cyB0aGUgY2VudGVyLCBuZWdhdGl2ZSBpcyBsZWZ0LCBhbmQgcG9zaXRpdmVcbiAgICogcmVwcmVzZW50cyB0aGUgcmlnaHQuXG4gICAqL1xuICBwb3NpdGlvbjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBpbml0aWFsIHJlbGF0aXZlbHkgaW5kZXggb3JpZ2luIG9mIHRoZSB0YWIgaWYgaXQgd2FzIGNyZWF0ZWQgYW5kIHNlbGVjdGVkIGFmdGVyIHRoZXJlXG4gICAqIHdhcyBhbHJlYWR5IGEgc2VsZWN0ZWQgdGFiLiBQcm92aWRlcyBjb250ZXh0IG9mIHdoYXQgcG9zaXRpb24gdGhlIHRhYiBzaG91bGQgb3JpZ2luYXRlIGZyb20uXG4gICAqL1xuICBvcmlnaW46IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB0YWIgaXMgY3VycmVudGx5IGFjdGl2ZS5cbiAgICovXG4gIGlzQWN0aXZlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1BVF9UQUJfR1JPVVApIEBPcHRpb25hbCgpIHB1YmxpYyBfY2xvc2VzdFRhYkdyb3VwOiBhbnksXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ3RleHRMYWJlbCcpIHx8IGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZW50UG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKFxuICAgICAgdGhpcy5fZXhwbGljaXRDb250ZW50IHx8IHRoaXMuX2ltcGxpY2l0Q29udGVudCxcbiAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGhhcyBiZWVuIGV4dHJhY3RlZCB0byBhIHV0aWwgYmVjYXVzZSBvZiBUUyA0IGFuZCBWRS5cbiAgICogVmlldyBFbmdpbmUgZG9lc24ndCBzdXBwb3J0IHByb3BlcnR5IHJlbmFtZSBpbmhlcml0YW5jZS5cbiAgICogVFMgNC4wIGRvZXNuJ3QgYWxsb3cgcHJvcGVydGllcyB0byBvdmVycmlkZSBhY2Nlc3NvcnMgb3IgdmljZS12ZXJzYS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcHJvdGVjdGVkIF9zZXRUZW1wbGF0ZUxhYmVsSW5wdXQodmFsdWU6IE1hdFRhYkxhYmVsIHwgdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSB1cGRhdGUgdGhlIGxhYmVsIGlmIHRoZSBxdWVyeSBtYW5hZ2VkIHRvIGZpbmQgb25lLiBUaGlzIHdvcmtzIGFyb3VuZCBhbiBpc3N1ZSB3aGVyZSBhXG4gICAgLy8gdXNlciBtYXkgaGF2ZSBtYW51YWxseSBzZXQgYHRlbXBsYXRlTGFiZWxgIGR1cmluZyBjcmVhdGlvbiBtb2RlLCB3aGljaCB3b3VsZCB0aGVuIGdldFxuICAgIC8vIGNsb2JiZXJlZCBieSBgdW5kZWZpbmVkYCB3aGVuIHRoZSBxdWVyeSByZXNvbHZlcy4gQWxzbyBub3RlIHRoYXQgd2UgY2hlY2sgdGhhdCB0aGUgY2xvc2VzdFxuICAgIC8vIHRhYiBtYXRjaGVzIHRoZSBjdXJyZW50IG9uZSBzbyB0aGF0IHdlIGRvbid0IHBpY2sgdXAgbGFiZWxzIGZyb20gbmVzdGVkIHRhYnMuXG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLl9jbG9zZXN0VGFiID09PSB0aGlzKSB7XG4gICAgICB0aGlzLl90ZW1wbGF0ZUxhYmVsID0gdmFsdWU7XG4gICAgfVxuICB9XG59XG4iLCI8IS0tIENyZWF0ZSBhIHRlbXBsYXRlIGZvciB0aGUgY29udGVudCBvZiB0aGUgPG1hdC10YWI+IHNvIHRoYXQgd2UgY2FuIGdyYWIgYSByZWZlcmVuY2UgdG8gdGhpc1xuICAgIFRlbXBsYXRlUmVmIGFuZCB1c2UgaXQgaW4gYSBQb3J0YWwgdG8gcmVuZGVyIHRoZSB0YWIgY29udGVudCBpbiB0aGUgYXBwcm9wcmlhdGUgcGxhY2UgaW4gdGhlXG4gICAgdGFiLWdyb3VwLiAtLT5cbjxuZy10ZW1wbGF0ZT48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9uZy10ZW1wbGF0ZT5cbiJdfQ==