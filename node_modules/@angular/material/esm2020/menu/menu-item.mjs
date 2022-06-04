/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, Inject, Optional, Input, ChangeDetectorRef, } from '@angular/core';
import { mixinDisabled, mixinDisableRipple, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MAT_MENU_PANEL } from './menu-panel';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/common";
// Boilerplate for applying mixins to MatMenuItem.
/** @docs-private */
const _MatMenuItemBase = mixinDisableRipple(mixinDisabled(class {
}));
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export class MatMenuItem extends _MatMenuItemBase {
    constructor(_elementRef, _document, _focusMonitor, _parentMenu, _changeDetectorRef) {
        super();
        this._elementRef = _elementRef;
        this._document = _document;
        this._focusMonitor = _focusMonitor;
        this._parentMenu = _parentMenu;
        this._changeDetectorRef = _changeDetectorRef;
        /** ARIA role for the menu item. */
        this.role = 'menuitem';
        /** Stream that emits when the menu item is hovered. */
        this._hovered = new Subject();
        /** Stream that emits when the menu item is focused. */
        this._focused = new Subject();
        /** Whether the menu item is highlighted. */
        this._highlighted = false;
        /** Whether the menu item acts as a trigger for a sub-menu. */
        this._triggersSubmenu = false;
        _parentMenu?.addItem?.(this);
    }
    /** Focuses the menu item. */
    focus(origin, options) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._getHostElement(), origin, options);
        }
        else {
            this._getHostElement().focus(options);
        }
        this._focused.next(this);
    }
    ngAfterViewInit() {
        if (this._focusMonitor) {
            // Start monitoring the element so it gets the appropriate focused classes. We want
            // to show the focus style for menu items only when the focus was not caused by a
            // mouse or touch interaction.
            this._focusMonitor.monitor(this._elementRef, false);
        }
    }
    ngOnDestroy() {
        if (this._focusMonitor) {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        if (this._parentMenu && this._parentMenu.removeItem) {
            this._parentMenu.removeItem(this);
        }
        this._hovered.complete();
        this._focused.complete();
    }
    /** Used to set the `tabindex`. */
    _getTabIndex() {
        return this.disabled ? '-1' : '0';
    }
    /** Returns the host DOM element. */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    /** Emits to the hover stream. */
    _handleMouseEnter() {
        this._hovered.next(this);
    }
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel() {
        const clone = this._elementRef.nativeElement.cloneNode(true);
        const icons = clone.querySelectorAll('mat-icon, .material-icons');
        // Strip away icons so they don't show up in the text.
        for (let i = 0; i < icons.length; i++) {
            icons[i].remove();
        }
        return clone.textContent?.trim() || '';
    }
    _setHighlighted(isHighlighted) {
        // We need to mark this for check for the case where the content is coming from a
        // `matMenuContent` whose change detection tree is at the declaration position,
        // not the insertion position. See #23175.
        // @breaking-change 12.0.0 Remove null check for `_changeDetectorRef`.
        this._highlighted = isHighlighted;
        this._changeDetectorRef?.markForCheck();
    }
    _hasFocus() {
        return this._document && this._document.activeElement === this._getHostElement();
    }
}
MatMenuItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatMenuItem, deps: [{ token: i0.ElementRef }, { token: DOCUMENT }, { token: i1.FocusMonitor }, { token: MAT_MENU_PANEL, optional: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MatMenuItem.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatMenuItem, selector: "[mat-menu-item]", inputs: { disabled: "disabled", disableRipple: "disableRipple", role: "role" }, host: { listeners: { "click": "_checkDisabled($event)", "mouseenter": "_handleMouseEnter()" }, properties: { "attr.role": "role", "class.mat-menu-item": "true", "class.mat-menu-item-highlighted": "_highlighted", "class.mat-menu-item-submenu-trigger": "_triggersSubmenu", "attr.tabindex": "_getTabIndex()", "attr.aria-disabled": "disabled.toString()", "attr.disabled": "disabled || null" }, classAttribute: "mat-focus-indicator" }, exportAs: ["matMenuItem"], usesInheritance: true, ngImport: i0, template: "<ng-content></ng-content>\n<div class=\"mat-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n", directives: [{ type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatMenuItem, decorators: [{
            type: Component,
            args: [{ selector: '[mat-menu-item]', exportAs: 'matMenuItem', inputs: ['disabled', 'disableRipple'], host: {
                        '[attr.role]': 'role',
                        '[class.mat-menu-item]': 'true',
                        '[class.mat-menu-item-highlighted]': '_highlighted',
                        '[class.mat-menu-item-submenu-trigger]': '_triggersSubmenu',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.disabled]': 'disabled || null',
                        'class': 'mat-focus-indicator',
                        '(click)': '_checkDisabled($event)',
                        '(mouseenter)': '_handleMouseEnter()',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content></ng-content>\n<div class=\"mat-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.FocusMonitor }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_MENU_PANEL]
                }, {
                    type: Optional
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { role: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFrQixZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBRVYsaUJBQWlCLEVBQ2pCLE1BQU0sRUFDTixRQUFRLEVBQ1IsS0FBSyxFQUVMLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsYUFBYSxFQUNiLGtCQUFrQixHQUNuQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxjQUFjLEVBQWUsTUFBTSxjQUFjLENBQUM7Ozs7O0FBRTFELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQXFCSCxNQUFNLE9BQU8sV0FDWCxTQUFRLGdCQUFnQjtJQXNDeEIsWUFDVSxXQUFvQyxFQUNsQixTQUFlLEVBQ2pDLGFBQTRCLEVBQ08sV0FBdUMsRUFDMUUsa0JBQXNDO1FBRTlDLEtBQUssRUFBRSxDQUFDO1FBTkEsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ2xCLGNBQVMsR0FBVCxTQUFTLENBQU07UUFDakMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDTyxnQkFBVyxHQUFYLFdBQVcsQ0FBNEI7UUFDMUUsdUJBQWtCLEdBQWxC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b3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIElucHV0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0TWVudUl0ZW0uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdE1lbnVJdGVtQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShtaXhpbkRpc2FibGVkKGNsYXNzIHt9KSk7XG5cbi8qKlxuICogU2luZ2xlIGl0ZW0gaW5zaWRlIG9mIGEgYG1hdC1tZW51YC4gUHJvdmlkZXMgdGhlIG1lbnUgaXRlbSBzdHlsaW5nIGFuZCBhY2Nlc3NpYmlsaXR5IHRyZWF0bWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC1tZW51LWl0ZW1dJyxcbiAgZXhwb3J0QXM6ICdtYXRNZW51SXRlbScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1tjbGFzcy5tYXQtbWVudS1pdGVtXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW0taGlnaGxpZ2h0ZWRdJzogJ19oaWdobGlnaHRlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWVudS1pdGVtLXN1Ym1lbnUtdHJpZ2dlcl0nOiAnX3RyaWdnZXJzU3VibWVudScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ2NsYXNzJzogJ21hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICcoY2xpY2spJzogJ19jaGVja0Rpc2FibGVkKCRldmVudCknLFxuICAgICcobW91c2VlbnRlciknOiAnX2hhbmRsZU1vdXNlRW50ZXIoKScsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUtaXRlbS5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW1cbiAgZXh0ZW5kcyBfTWF0TWVudUl0ZW1CYXNlXG4gIGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBDYW5EaXNhYmxlLCBDYW5EaXNhYmxlUmlwcGxlLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbntcbiAgLyoqIEFSSUEgcm9sZSBmb3IgdGhlIG1lbnUgaXRlbS4gKi9cbiAgQElucHV0KCkgcm9sZTogJ21lbnVpdGVtJyB8ICdtZW51aXRlbXJhZGlvJyB8ICdtZW51aXRlbWNoZWNrYm94JyA9ICdtZW51aXRlbSc7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1lbnUgaXRlbSBpcyBob3ZlcmVkLiAqL1xuICByZWFkb25seSBfaG92ZXJlZDogU3ViamVjdDxNYXRNZW51SXRlbT4gPSBuZXcgU3ViamVjdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiB0aGUgbWVudSBpdGVtIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IF9mb2N1c2VkID0gbmV3IFN1YmplY3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBoaWdobGlnaHRlZC4gKi9cbiAgX2hpZ2hsaWdodGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBhY3RzIGFzIGEgdHJpZ2dlciBmb3IgYSBzdWItbWVudS4gKi9cbiAgX3RyaWdnZXJzU3VibWVudTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGRvY3VtZW50OiBhbnksXG4gICAgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgcGFyZW50TWVudTogTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPiB8IHVuZGVmaW5lZCxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIGBkb2N1bWVudGAsIGBjaGFuZ2VEZXRlY3RvclJlZmAgYW5kIGBmb2N1c01vbml0b3JgIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGRvY3VtZW50PzogYW55LFxuICAgIGZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgICBwYXJlbnRNZW51PzogTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICApO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50PzogYW55LFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9NRU5VX1BBTkVMKSBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudE1lbnU/OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgX3BhcmVudE1lbnU/LmFkZEl0ZW0/Lih0aGlzKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51IGl0ZW0uICovXG4gIGZvY3VzKG9yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2ZvY3VzTW9uaXRvciAmJiBvcmlnaW4pIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9nZXRIb3N0RWxlbWVudCgpLCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9nZXRIb3N0RWxlbWVudCgpLmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzZWQubmV4dCh0aGlzKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICAvLyBTdGFydCBtb25pdG9yaW5nIHRoZSBlbGVtZW50IHNvIGl0IGdldHMgdGhlIGFwcHJvcHJpYXRlIGZvY3VzZWQgY2xhc3Nlcy4gV2Ugd2FudFxuICAgICAgLy8gdG8gc2hvdyB0aGUgZm9jdXMgc3R5bGUgZm9yIG1lbnUgaXRlbXMgb25seSB3aGVuIHRoZSBmb2N1cyB3YXMgbm90IGNhdXNlZCBieSBhXG4gICAgICAvLyBtb3VzZSBvciB0b3VjaCBpbnRlcmFjdGlvbi5cbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudE1lbnUgJiYgdGhpcy5fcGFyZW50TWVudS5yZW1vdmVJdGVtKSB7XG4gICAgICB0aGlzLl9wYXJlbnRNZW51LnJlbW92ZUl0ZW0odGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5faG92ZXJlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZvY3VzZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgYHRhYmluZGV4YC4gKi9cbiAgX2dldFRhYkluZGV4KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAnLTEnIDogJzAnO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGhvc3QgRE9NIGVsZW1lbnQuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBQcmV2ZW50cyB0aGUgZGVmYXVsdCBlbGVtZW50IGFjdGlvbnMgaWYgaXQgaXMgZGlzYWJsZWQuICovXG4gIF9jaGVja0Rpc2FibGVkKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIHRvIHRoZSBob3ZlciBzdHJlYW0uICovXG4gIF9oYW5kbGVNb3VzZUVudGVyKCkge1xuICAgIHRoaXMuX2hvdmVyZWQubmV4dCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCB0byBiZSB1c2VkIHdoZW4gZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgb3B0aW9uIHNob3VsZCBiZSBmb2N1c2VkLiAqL1xuICBnZXRMYWJlbCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNsb25lID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBpY29ucyA9IGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hdC1pY29uLCAubWF0ZXJpYWwtaWNvbnMnKTtcblxuICAgIC8vIFN0cmlwIGF3YXkgaWNvbnMgc28gdGhleSBkb24ndCBzaG93IHVwIGluIHRoZSB0ZXh0LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGljb25zW2ldLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBjbG9uZS50ZXh0Q29udGVudD8udHJpbSgpIHx8ICcnO1xuICB9XG5cbiAgX3NldEhpZ2hsaWdodGVkKGlzSGlnaGxpZ2h0ZWQ6IGJvb2xlYW4pIHtcbiAgICAvLyBXZSBuZWVkIHRvIG1hcmsgdGhpcyBmb3IgY2hlY2sgZm9yIHRoZSBjYXNlIHdoZXJlIHRoZSBjb250ZW50IGlzIGNvbWluZyBmcm9tIGFcbiAgICAvLyBgbWF0TWVudUNvbnRlbnRgIHdob3NlIGNoYW5nZSBkZXRlY3Rpb24gdHJlZSBpcyBhdCB0aGUgZGVjbGFyYXRpb24gcG9zaXRpb24sXG4gICAgLy8gbm90IHRoZSBpbnNlcnRpb24gcG9zaXRpb24uIFNlZSAjMjMxNzUuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMi4wLjAgUmVtb3ZlIG51bGwgY2hlY2sgZm9yIGBfY2hhbmdlRGV0ZWN0b3JSZWZgLlxuICAgIHRoaXMuX2hpZ2hsaWdodGVkID0gaXNIaWdobGlnaHRlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFzRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50ICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuX2dldEhvc3RFbGVtZW50KCk7XG4gIH1cbn1cbiIsIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjxkaXYgY2xhc3M9XCJtYXQtbWVudS1yaXBwbGVcIiBtYXRSaXBwbGVcbiAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cImRpc2FibGVSaXBwbGUgfHwgZGlzYWJsZWRcIlxuICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJfZ2V0SG9zdEVsZW1lbnQoKVwiPlxuPC9kaXY+XG5cbjxzdmdcbiAgKm5nSWY9XCJfdHJpZ2dlcnNTdWJtZW51XCJcbiAgY2xhc3M9XCJtYXQtbWVudS1zdWJtZW51LWljb25cIlxuICB2aWV3Qm94PVwiMCAwIDUgMTBcIlxuICBmb2N1c2FibGU9XCJmYWxzZVwiPjxwb2x5Z29uIHBvaW50cz1cIjAsMCA1LDUgMCwxMFwiLz48L3N2Zz5cbiJdfQ==