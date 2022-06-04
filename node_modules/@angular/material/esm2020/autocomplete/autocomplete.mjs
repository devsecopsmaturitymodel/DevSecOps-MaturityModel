/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, Directive, } from '@angular/core';
import { MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, mixinDisableRipple, MatOption, } from '@angular/material/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/common";
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueAutocompleteIdCounter = 0;
/** Event object that is emitted when an autocomplete option is selected. */
export class MatAutocompleteSelectedEvent {
    constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    source, 
    /** Option that was selected. */
    option) {
        this.source = source;
        this.option = option;
    }
}
// Boilerplate for applying mixins to MatAutocomplete.
/** @docs-private */
const _MatAutocompleteMixinBase = mixinDisableRipple(class {
});
/** Injection token to be used to override the default options for `mat-autocomplete`. */
export const MAT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken('mat-autocomplete-default-options', {
    providedIn: 'root',
    factory: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY() {
    return { autoActiveFirstOption: false };
}
/** Base class with all of the `MatAutocomplete` functionality. */
export class _MatAutocompleteBase extends _MatAutocompleteMixinBase {
    constructor(_changeDetectorRef, _elementRef, defaults, platform) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._activeOptionChanges = Subscription.EMPTY;
        /** Whether the autocomplete panel should be visible, depending on option length. */
        this.showPanel = false;
        this._isOpen = false;
        /** Function that maps an option's control value to its display value in the trigger. */
        this.displayWith = null;
        /** Event that is emitted whenever an option from the list is selected. */
        this.optionSelected = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is opened. */
        this.opened = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is closed. */
        this.closed = new EventEmitter();
        /** Emits whenever an option is activated. */
        this.optionActivated = new EventEmitter();
        this._classList = {};
        /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
        this.id = `mat-autocomplete-${_uniqueAutocompleteIdCounter++}`;
        // TODO(crisbeto): the problem that the `inertGroups` option resolves is only present on
        // Safari using VoiceOver. We should occasionally check back to see whether the bug
        // wasn't resolved in VoiceOver, and if it has, we can remove this and the `inertGroups`
        // option altogether.
        this.inertGroups = platform?.SAFARI || false;
        this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
    }
    /** Whether the autocomplete panel is open. */
    get isOpen() {
        return this._isOpen && this.showPanel;
    }
    /**
     * Whether the first option should be highlighted when the autocomplete panel is opened.
     * Can be configured globally through the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
     */
    get autoActiveFirstOption() {
        return this._autoActiveFirstOption;
    }
    set autoActiveFirstOption(value) {
        this._autoActiveFirstOption = coerceBooleanProperty(value);
    }
    /**
     * Takes classes set on the host mat-autocomplete element and applies them to the panel
     * inside the overlay container to allow for easy styling.
     */
    set classList(value) {
        if (value && value.length) {
            this._classList = coerceStringArray(value).reduce((classList, className) => {
                classList[className] = true;
                return classList;
            }, {});
        }
        else {
            this._classList = {};
        }
        this._setVisibilityClasses(this._classList);
        this._elementRef.nativeElement.className = '';
    }
    ngAfterContentInit() {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
        this._activeOptionChanges = this._keyManager.change.subscribe(index => {
            if (this.isOpen) {
                this.optionActivated.emit({ source: this, option: this.options.toArray()[index] || null });
            }
        });
        // Set the initial visibility state.
        this._setVisibility();
    }
    ngOnDestroy() {
        this._activeOptionChanges.unsubscribe();
    }
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     */
    _setScrollTop(scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }
    /** Returns the panel's scrollTop. */
    _getScrollTop() {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }
    /** Panel should hide itself when the option list is empty. */
    _setVisibility() {
        this.showPanel = !!this.options.length;
        this._setVisibilityClasses(this._classList);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits the `select` event. */
    _emitSelectEvent(option) {
        const event = new MatAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    }
    /** Gets the aria-labelledby for the autocomplete panel. */
    _getPanelAriaLabelledby(labelId) {
        if (this.ariaLabel) {
            return null;
        }
        const labelExpression = labelId ? labelId + ' ' : '';
        return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
    }
    /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
    _setVisibilityClasses(classList) {
        classList[this._visibleClass] = this.showPanel;
        classList[this._hiddenClass] = !this.showPanel;
    }
}
_MatAutocompleteBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatAutocompleteBase, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Directive });
_MatAutocompleteBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatAutocompleteBase, inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: "autoActiveFirstOption", panelWidth: "panelWidth", classList: ["class", "classList"] }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatAutocompleteBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS]
                }] }, { type: i1.Platform }]; }, propDecorators: { template: [{
                type: ViewChild,
                args: [TemplateRef, { static: true }]
            }], panel: [{
                type: ViewChild,
                args: ['panel']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], displayWith: [{
                type: Input
            }], autoActiveFirstOption: [{
                type: Input
            }], panelWidth: [{
                type: Input
            }], optionSelected: [{
                type: Output
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }], optionActivated: [{
                type: Output
            }], classList: [{
                type: Input,
                args: ['class']
            }] } });
export class MatAutocomplete extends _MatAutocompleteBase {
    constructor() {
        super(...arguments);
        this._visibleClass = 'mat-autocomplete-visible';
        this._hiddenClass = 'mat-autocomplete-hidden';
    }
}
MatAutocomplete.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatAutocomplete, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatAutocomplete.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple" }, host: { classAttribute: "mat-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}\n"], directives: [{ type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-autocomplete',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}\n"] }]
        }], propDecorators: { optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdELE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixFQUVqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVMLFlBQVksRUFDWiwyQkFBMkIsRUFHM0Isa0JBQWtCLEVBQ2xCLFNBQVMsR0FFVixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7QUFFbEM7OztHQUdHO0FBQ0gsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLENBQUM7QUFFckMsNEVBQTRFO0FBQzVFLE1BQU0sT0FBTyw0QkFBNEI7SUFDdkM7SUFDRSxrRUFBa0U7SUFDM0QsTUFBNEI7SUFDbkMsZ0NBQWdDO0lBQ3pCLE1BQXNCO1FBRnRCLFdBQU0sR0FBTixNQUFNLENBQXNCO1FBRTVCLFdBQU0sR0FBTixNQUFNLENBQWdCO0lBQzVCLENBQUM7Q0FDTDtBQVdELHNE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WTtnQkFHTyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFHZixXQUFXO3NCQUFuQixLQUFLO2dCQU9GLHFCQUFxQjtzQkFEeEIsS0FBSztnQkFhRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdhLGNBQWM7c0JBQWhDLE1BQU07Z0JBSVksTUFBTTtzQkFBeEIsTUFBTTtnQkFHWSxNQUFNO3NCQUF4QixNQUFNO2dCQUdZLGVBQWU7c0JBQWpDLE1BQU07Z0JBUUgsU0FBUztzQkFEWixLQUFLO3VCQUFDLE9BQU87O0FBbUhoQixNQUFNLE9BQU8sZUFBZ0IsU0FBUSxvQkFBb0I7SUFiekQ7O1FBa0JZLGtCQUFhLEdBQUcsMEJBQTBCLENBQUM7UUFDM0MsaUJBQVksR0FBRyx5QkFBeUIsQ0FBQztLQUNwRDs7NEdBUFksZUFBZTtnR0FBZixlQUFlLHFJQUZmLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDLHVEQUloRSxZQUFZLDZEQUVaLFNBQVMsc0dDN1M1QixnV0FXQTsyRkQ4UmEsZUFBZTtrQkFiM0IsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxpQkFBaUIsVUFDbkIsQ0FBQyxlQUFlLENBQUMsUUFDbkI7d0JBQ0osT0FBTyxFQUFFLGtCQUFrQjtxQkFDNUIsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsaUJBQWlCLEVBQUMsQ0FBQzs4QkFJN0IsWUFBWTtzQkFBL0QsZUFBZTt1QkFBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVELE9BQU87c0JBQXZELGVBQWU7dUJBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBfTWF0T3B0Z3JvdXBCYXNlLFxuICBfTWF0T3B0aW9uQmFzZSxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBNYXRPcHRpb24sXG4gIE1hdE9wdGdyb3VwLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBBdXRvY29tcGxldGUgSURzIG5lZWQgdG8gYmUgdW5pcXVlIGFjcm9zcyBjb21wb25lbnRzLCBzbyB0aGlzIGNvdW50ZXIgZXhpc3RzIG91dHNpZGUgb2ZcbiAqIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbi5cbiAqL1xubGV0IF91bmlxdWVBdXRvY29tcGxldGVJZENvdW50ZXIgPSAwO1xuXG4vKiogRXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IF9NYXRBdXRvY29tcGxldGVCYXNlLFxuICAgIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogX01hdE9wdGlvbkJhc2UsXG4gICkge31cbn1cblxuLyoqIEV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgb3B0aW9uIGlzIGFjdGl2YXRlZC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgc291cmNlOiBfTWF0QXV0b2NvbXBsZXRlQmFzZTtcblxuICAvKiogT3B0aW9uIHRoYXQgd2FzIHNlbGVjdGVkLiAqL1xuICBvcHRpb246IF9NYXRPcHRpb25CYXNlIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRBdXRvY29tcGxldGUuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShjbGFzcyB7fSk7XG5cbi8qKiBEZWZhdWx0IGBtYXQtYXV0b2NvbXBsZXRlYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBhdXRvQWN0aXZlRmlyc3RPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgYXV0b2NvbXBsZXRlJ3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtYXV0b2NvbXBsZXRlYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucz4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7YXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBmYWxzZX07XG59XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0QXV0b2NvbXBsZXRlYCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdEF1dG9jb21wbGV0ZUJhc2VcbiAgZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgdmlzaWJsZS4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92aXNpYmxlQ2xhc3M6IHN0cmluZztcblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBoaWRkZW4uICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaGlkZGVuQ2xhc3M6IHN0cmluZztcblxuICAvKiogTWFuYWdlcyBhY3RpdmUgaXRlbSBpbiBvcHRpb24gbGlzdCBiYXNlZCBvbiBrZXkgZXZlbnRzLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8X01hdE9wdGlvbkJhc2U+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgc2hvdWxkIGJlIHZpc2libGUsIGRlcGVuZGluZyBvbiBvcHRpb24gbGVuZ3RoLiAqL1xuICBzaG93UGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzT3BlbiAmJiB0aGlzLnNob3dQYW5lbDtcbiAgfVxuICBfaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gVGhlIEBWaWV3Q2hpbGQgcXVlcnkgZm9yIFRlbXBsYXRlUmVmIGhlcmUgbmVlZHMgdG8gYmUgc3RhdGljIGJlY2F1c2Ugc29tZSBjb2RlIHBhdGhzXG4gIC8vIGxlYWQgdG8gdGhlIG92ZXJsYXkgYmVpbmcgY3JlYXRlZCBiZWZvcmUgY2hhbmdlIGRldGVjdGlvbiBoYXMgZmluaXNoZWQgZm9yIHRoaXMgY29tcG9uZW50LlxuICAvLyBOb3RhYmx5LCBhbm90aGVyIGNvbXBvbmVudCBtYXkgdHJpZ2dlciBgZm9jdXNgIG9uIHRoZSBhdXRvY29tcGxldGUtdHJpZ2dlci5cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIEVsZW1lbnQgZm9yIHRoZSBwYW5lbCBjb250YWluaW5nIHRoZSBhdXRvY29tcGxldGUgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb25zIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBvcHRpb25zOiBRdWVyeUxpc3Q8X01hdE9wdGlvbkJhc2U+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbiBncm91cHMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIGFic3RyYWN0IG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PF9NYXRPcHRncm91cEJhc2U+O1xuXG4gIC8qKiBBcmlhIGxhYmVsIG9mIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBJbnB1dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IG1hcHMgYW4gb3B0aW9uJ3MgY29udHJvbCB2YWx1ZSB0byBpdHMgZGlzcGxheSB2YWx1ZSBpbiB0aGUgdHJpZ2dlci4gKi9cbiAgQElucHV0KCkgZGlzcGxheVdpdGg6ICgodmFsdWU6IGFueSkgPT4gc3RyaW5nKSB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmaXJzdCBvcHRpb24gc2hvdWxkIGJlIGhpZ2hsaWdodGVkIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuXG4gICAqIENhbiBiZSBjb25maWd1cmVkIGdsb2JhbGx5IHRocm91Z2ggdGhlIGBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OU2AgdG9rZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb247XG4gIH1cbiAgc2V0IGF1dG9BY3RpdmVGaXJzdE9wdGlvbih2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9hdXRvQWN0aXZlRmlyc3RPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHdpZHRoIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICBDYW4gYmUgYW55IENTUyBzaXppbmcgdmFsdWUsIG90aGVyd2lzZSBpdCB3aWxsXG4gICAqIG1hdGNoIHRoZSB3aWR0aCBvZiBpdHMgaG9zdC5cbiAgICovXG4gIEBJbnB1dCgpIHBhbmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIG9wdGlvbiBmcm9tIHRoZSBsaXN0IGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBvcHRpb24gaXMgYWN0aXZhdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uQWN0aXZhdGVkOiBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUYWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtYXV0b2NvbXBsZXRlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgcGFuZWxcbiAgICogaW5zaWRlIHRoZSBvdmVybGF5IGNvbnRhaW5lciB0byBhbGxvdyBmb3IgZWFzeSBzdHlsaW5nLlxuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBjbGFzc0xpc3QodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gY29lcmNlU3RyaW5nQXJyYXkodmFsdWUpLnJlZHVjZSgoY2xhc3NMaXN0LCBjbGFzc05hbWUpID0+IHtcbiAgICAgICAgY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gY2xhc3NMaXN0O1xuICAgICAgfSwge30gYXMge1trZXk6IHN0cmluZ106IGJvb2xlYW59KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gIH1cbiAgX2NsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgLyoqIFVuaXF1ZSBJRCB0byBiZSB1c2VkIGJ5IGF1dG9jb21wbGV0ZSB0cmlnZ2VyJ3MgXCJhcmlhLW93bnNcIiBwcm9wZXJ0eS4gKi9cbiAgaWQ6IHN0cmluZyA9IGBtYXQtYXV0b2NvbXBsZXRlLSR7X3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlcisrfWA7XG5cbiAgLyoqXG4gICAqIFRlbGxzIGFueSBkZXNjZW5kYW50IGBtYXQtb3B0Z3JvdXBgIHRvIHVzZSB0aGUgaW5lcnQgYTExeSBwYXR0ZXJuLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWFkb25seSBpbmVydEdyb3VwczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdHM6IE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zLFxuICAgIHBsYXRmb3JtPzogUGxhdGZvcm0sXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhlIHByb2JsZW0gdGhhdCB0aGUgYGluZXJ0R3JvdXBzYCBvcHRpb24gcmVzb2x2ZXMgaXMgb25seSBwcmVzZW50IG9uXG4gICAgLy8gU2FmYXJpIHVzaW5nIFZvaWNlT3Zlci4gV2Ugc2hvdWxkIG9jY2FzaW9uYWxseSBjaGVjayBiYWNrIHRvIHNlZSB3aGV0aGVyIHRoZSBidWdcbiAgICAvLyB3YXNuJ3QgcmVzb2x2ZWQgaW4gVm9pY2VPdmVyLCBhbmQgaWYgaXQgaGFzLCB3ZSBjYW4gcmVtb3ZlIHRoaXMgYW5kIHRoZSBgaW5lcnRHcm91cHNgXG4gICAgLy8gb3B0aW9uIGFsdG9nZXRoZXIuXG4gICAgdGhpcy5pbmVydEdyb3VwcyA9IHBsYXRmb3JtPy5TQUZBUkkgfHwgZmFsc2U7XG4gICAgdGhpcy5fYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID0gISFkZWZhdWx0cy5hdXRvQWN0aXZlRmlyc3RPcHRpb247XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxfTWF0T3B0aW9uQmFzZT4odGhpcy5vcHRpb25zKS53aXRoV3JhcCgpO1xuICAgIHRoaXMuX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSB0aGlzLl9rZXlNYW5hZ2VyLmNoYW5nZS5zdWJzY3JpYmUoaW5kZXggPT4ge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgIHRoaXMub3B0aW9uQWN0aXZhdGVkLmVtaXQoe3NvdXJjZTogdGhpcywgb3B0aW9uOiB0aGlzLm9wdGlvbnMudG9BcnJheSgpW2luZGV4XSB8fCBudWxsfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIGluaXRpYWwgdmlzaWJpbGl0eSBzdGF0ZS5cbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9hY3RpdmVPcHRpb25DaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcGFuZWwgc2Nyb2xsVG9wLiBUaGlzIGFsbG93cyB1cyB0byBtYW51YWxseSBzY3JvbGwgdG8gZGlzcGxheSBvcHRpb25zXG4gICAqIGFib3ZlIG9yIGJlbG93IHRoZSBmb2xkLCBhcyB0aGV5IGFyZSBub3QgYWN0dWFsbHkgYmVpbmcgZm9jdXNlZCB3aGVuIGFjdGl2ZS5cbiAgICovXG4gIF9zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgcGFuZWwncyBzY3JvbGxUb3AuICovXG4gIF9nZXRTY3JvbGxUb3AoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbCA/IHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgOiAwO1xuICB9XG5cbiAgLyoqIFBhbmVsIHNob3VsZCBoaWRlIGl0c2VsZiB3aGVuIHRoZSBvcHRpb24gbGlzdCBpcyBlbXB0eS4gKi9cbiAgX3NldFZpc2liaWxpdHkoKSB7XG4gICAgdGhpcy5zaG93UGFuZWwgPSAhIXRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgYHNlbGVjdGAgZXZlbnQuICovXG4gIF9lbWl0U2VsZWN0RXZlbnQob3B0aW9uOiBfTWF0T3B0aW9uQmFzZSk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQodGhpcywgb3B0aW9uKTtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFyaWEtbGFiZWxsZWRieSBmb3IgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkobGFiZWxJZDogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxFeHByZXNzaW9uID0gbGFiZWxJZCA/IGxhYmVsSWQgKyAnICcgOiAnJztcbiAgICByZXR1cm4gdGhpcy5hcmlhTGFiZWxsZWRieSA/IGxhYmVsRXhwcmVzc2lvbiArIHRoaXMuYXJpYUxhYmVsbGVkYnkgOiBsYWJlbElkO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGF1dG9jb21wbGV0ZSB2aXNpYmlsaXR5IGNsYXNzZXMgb24gYSBjbGFzc2xpc3QgYmFzZWQgb24gdGhlIHBhbmVsIGlzIHZpc2libGUuICovXG4gIHByaXZhdGUgX3NldFZpc2liaWxpdHlDbGFzc2VzKGNsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59KSB7XG4gICAgY2xhc3NMaXN0W3RoaXMuX3Zpc2libGVDbGFzc10gPSB0aGlzLnNob3dQYW5lbDtcbiAgICBjbGFzc0xpc3RbdGhpcy5faGlkZGVuQ2xhc3NdID0gIXRoaXMuc2hvd1BhbmVsO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1hdXRvY29tcGxldGUnLFxuICB0ZW1wbGF0ZVVybDogJ2F1dG9jb21wbGV0ZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2F1dG9jb21wbGV0ZS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGV4cG9ydEFzOiAnbWF0QXV0b2NvbXBsZXRlJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYXV0b2NvbXBsZXRlJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdEF1dG9jb21wbGV0ZX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGUgZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlQmFzZSB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbiBncm91cHMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbnMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0T3B0aW9uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPjtcbiAgcHJvdGVjdGVkIF92aXNpYmxlQ2xhc3MgPSAnbWF0LWF1dG9jb21wbGV0ZS12aXNpYmxlJztcbiAgcHJvdGVjdGVkIF9oaWRkZW5DbGFzcyA9ICdtYXQtYXV0b2NvbXBsZXRlLWhpZGRlbic7XG59XG4iLCI8bmctdGVtcGxhdGUgbGV0LWZvcm1GaWVsZElkPVwiaWRcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1hdXRvY29tcGxldGUtcGFuZWxcIlxuICAgICAgIHJvbGU9XCJsaXN0Ym94XCJcbiAgICAgICBbaWRdPVwiaWRcIlxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieShmb3JtRmllbGRJZClcIlxuICAgICAgIFtuZ0NsYXNzXT1cIl9jbGFzc0xpc3RcIlxuICAgICAgICNwYW5lbD5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==