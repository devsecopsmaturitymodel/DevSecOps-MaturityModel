/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, Injector, Optional, SkipSelf, TemplateRef, InjectionToken, Inject, InjectFlags, } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetConfig } from './bottom-sheet-config';
import { MatBottomSheetContainer } from './bottom-sheet-container';
import { MatBottomSheetModule } from './bottom-sheet-module';
import { MatBottomSheetRef } from './bottom-sheet-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "./bottom-sheet-config";
/** Injection token that can be used to specify default bottom sheet options. */
export const MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken('mat-bottom-sheet-default-options');
/**
 * Service to trigger Material Design bottom sheets.
 */
export class MatBottomSheet {
    constructor(_overlay, _injector, _parentBottomSheet, _defaultOptions) {
        this._overlay = _overlay;
        this._injector = _injector;
        this._parentBottomSheet = _parentBottomSheet;
        this._defaultOptions = _defaultOptions;
        this._bottomSheetRefAtThisLevel = null;
    }
    /** Reference to the currently opened bottom sheet. */
    get _openedBottomSheetRef() {
        const parent = this._parentBottomSheet;
        return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
    }
    set _openedBottomSheetRef(value) {
        if (this._parentBottomSheet) {
            this._parentBottomSheet._openedBottomSheetRef = value;
        }
        else {
            this._bottomSheetRefAtThisLevel = value;
        }
    }
    open(componentOrTemplateRef, config) {
        const _config = _applyConfigDefaults(this._defaultOptions || new MatBottomSheetConfig(), config);
        const overlayRef = this._createOverlay(_config);
        const container = this._attachContainer(overlayRef, _config);
        const ref = new MatBottomSheetRef(container, overlayRef);
        if (componentOrTemplateRef instanceof TemplateRef) {
            container.attachTemplatePortal(new TemplatePortal(componentOrTemplateRef, null, {
                $implicit: _config.data,
                bottomSheetRef: ref,
            }));
        }
        else {
            const portal = new ComponentPortal(componentOrTemplateRef, undefined, this._createInjector(_config, ref));
            const contentRef = container.attachComponentPortal(portal);
            ref.instance = contentRef.instance;
        }
        // When the bottom sheet is dismissed, clear the reference to it.
        ref.afterDismissed().subscribe(() => {
            // Clear the bottom sheet ref if it hasn't already been replaced by a newer one.
            if (this._openedBottomSheetRef == ref) {
                this._openedBottomSheetRef = null;
            }
        });
        if (this._openedBottomSheetRef) {
            // If a bottom sheet is already in view, dismiss it and enter the
            // new bottom sheet after exit animation is complete.
            this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance.enter());
            this._openedBottomSheetRef.dismiss();
        }
        else {
            // If no bottom sheet is in view, enter the new bottom sheet.
            ref.containerInstance.enter();
        }
        this._openedBottomSheetRef = ref;
        return ref;
    }
    /**
     * Dismisses the currently-visible bottom sheet.
     * @param result Data to pass to the bottom sheet instance.
     */
    dismiss(result) {
        if (this._openedBottomSheetRef) {
            this._openedBottomSheetRef.dismiss(result);
        }
    }
    ngOnDestroy() {
        if (this._bottomSheetRefAtThisLevel) {
            this._bottomSheetRefAtThisLevel.dismiss();
        }
    }
    /**
     * Attaches the bottom sheet container component to the overlay.
     */
    _attachContainer(overlayRef, config) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injector = Injector.create({
            parent: userInjector || this._injector,
            providers: [{ provide: MatBottomSheetConfig, useValue: config }],
        });
        const containerPortal = new ComponentPortal(MatBottomSheetContainer, config.viewContainerRef, injector);
        const containerRef = overlayRef.attach(containerPortal);
        return containerRef.instance;
    }
    /**
     * Creates a new overlay and places it in the correct location.
     * @param config The user-specified bottom sheet config.
     */
    _createOverlay(config) {
        const overlayConfig = new OverlayConfig({
            direction: config.direction,
            hasBackdrop: config.hasBackdrop,
            disposeOnNavigation: config.closeOnNavigation,
            maxWidth: '100%',
            scrollStrategy: config.scrollStrategy || this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position().global().centerHorizontally().bottom('0'),
        });
        if (config.backdropClass) {
            overlayConfig.backdropClass = config.backdropClass;
        }
        return this._overlay.create(overlayConfig);
    }
    /**
     * Creates an injector to be used inside of a bottom sheet component.
     * @param config Config that was used to create the bottom sheet.
     * @param bottomSheetRef Reference to the bottom sheet.
     */
    _createInjector(config, bottomSheetRef) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const providers = [
            { provide: MatBottomSheetRef, useValue: bottomSheetRef },
            { provide: MAT_BOTTOM_SHEET_DATA, useValue: config.data },
        ];
        if (config.direction &&
            (!userInjector ||
                !userInjector.get(Directionality, null, InjectFlags.Optional))) {
            providers.push({
                provide: Directionality,
                useValue: { value: config.direction, change: observableOf() },
            });
        }
        return Injector.create({ parent: userInjector || this._injector, providers });
    }
}
MatBottomSheet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatBottomSheet, deps: [{ token: i1.Overlay }, { token: i0.Injector }, { token: MatBottomSheet, optional: true, skipSelf: true }, { token: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
MatBottomSheet.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatBottomSheet, providedIn: MatBottomSheetModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatBottomSheet, decorators: [{
            type: Injectable,
            args: [{ providedIn: MatBottomSheetModule }]
        }], ctorParameters: function () { return [{ type: i1.Overlay }, { type: i0.Injector }, { type: MatBottomSheet, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i2.MatBottomSheetConfig, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_BOTTOM_SHEET_DEFAULT_OPTIONS]
                }] }]; } });
/**
 * Applies default options to the bottom sheet config.
 * @param defaults Object containing the default values to which to fall back.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(defaults, config) {
    return { ...defaults, ...config };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90dG9tLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2JvdHRvbS1zaGVldC9ib3R0b20tc2hlZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFhLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGVBQWUsRUFBaUIsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkYsT0FBTyxFQUVMLFVBQVUsRUFDVixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsRUFDUixXQUFXLEVBQ1gsY0FBYyxFQUNkLE1BQU0sRUFHTixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLEVBQUUsSUFBSSxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDakUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFFckQsZ0ZBQWdGO0FBQ2hGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHLElBQUksY0FBYyxDQUNoRSxrQ0FBa0MsQ0FDbkMsQ0FBQztBQUVGOztHQUVHO0FBRUgsTUFBTSxPQUFPLGNBQWM7SUFpQnpCLFlBQ1UsUUFBaUIsRUFDakIsU0FBbUIsRUFDSyxrQkFBa0MsRUFHMUQsZUFBc0M7UUFMdEMsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ0ssdUJBQWtC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Qzs7MkdBMUxVLGNBQWMsaUVBb0I2QixjQUFjLDZDQUUxRCxnQ0FBZ0M7K0dBdEIvQixjQUFjLGNBREYsb0JBQW9COzJGQUNoQyxjQUFjO2tCQUQxQixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUFDO3VHQXFCVSxjQUFjOzBCQUFqRSxRQUFROzswQkFBSSxRQUFROzswQkFDcEIsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxnQ0FBZ0M7O0FBdUs1Qzs7Ozs7R0FLRztBQUNILFNBQVMsb0JBQW9CLENBQzNCLFFBQThCLEVBQzlCLE1BQTZCO0lBRTdCLE9BQU8sRUFBQyxHQUFHLFFBQVEsRUFBRSxHQUFHLE1BQU0sRUFBQyxDQUFDO0FBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50UmVmLFxuICBJbmplY3RhYmxlLFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBUZW1wbGF0ZVJlZixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT25EZXN0cm95LFxuICBTdGF0aWNQcm92aWRlcixcbiAgSW5qZWN0RmxhZ3MsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNQVRfQk9UVE9NX1NIRUVUX0RBVEEsIE1hdEJvdHRvbVNoZWV0Q29uZmlnfSBmcm9tICcuL2JvdHRvbS1zaGVldC1jb25maWcnO1xuaW1wb3J0IHtNYXRCb3R0b21TaGVldENvbnRhaW5lcn0gZnJvbSAnLi9ib3R0b20tc2hlZXQtY29udGFpbmVyJztcbmltcG9ydCB7TWF0Qm90dG9tU2hlZXRNb2R1bGV9IGZyb20gJy4vYm90dG9tLXNoZWV0LW1vZHVsZSc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0UmVmfSBmcm9tICcuL2JvdHRvbS1zaGVldC1yZWYnO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBkZWZhdWx0IGJvdHRvbSBzaGVldCBvcHRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CT1RUT01fU0hFRVRfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdEJvdHRvbVNoZWV0Q29uZmlnPihcbiAgJ21hdC1ib3R0b20tc2hlZXQtZGVmYXVsdC1vcHRpb25zJyxcbik7XG5cbi8qKlxuICogU2VydmljZSB0byB0cmlnZ2VyIE1hdGVyaWFsIERlc2lnbiBib3R0b20gc2hlZXRzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogTWF0Qm90dG9tU2hlZXRNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIE1hdEJvdHRvbVNoZWV0IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYm90dG9tU2hlZXRSZWZBdFRoaXNMZXZlbDogTWF0Qm90dG9tU2hlZXRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgYm90dG9tIHNoZWV0LiAqL1xuICBnZXQgX29wZW5lZEJvdHRvbVNoZWV0UmVmKCk6IE1hdEJvdHRvbVNoZWV0UmVmPGFueT4gfCBudWxsIHtcbiAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9wYXJlbnRCb3R0b21TaGVldDtcbiAgICByZXR1cm4gcGFyZW50ID8gcGFyZW50Ll9vcGVuZWRCb3R0b21TaGVldFJlZiA6IHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWw7XG4gIH1cblxuICBzZXQgX29wZW5lZEJvdHRvbVNoZWV0UmVmKHZhbHVlOiBNYXRCb3R0b21TaGVldFJlZjxhbnk+IHwgbnVsbCkge1xuICAgIGlmICh0aGlzLl9wYXJlbnRCb3R0b21TaGVldCkge1xuICAgICAgdGhpcy5fcGFyZW50Qm90dG9tU2hlZXQuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JvdHRvbVNoZWV0UmVmQXRUaGlzTGV2ZWwgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBwcml2YXRlIF9wYXJlbnRCb3R0b21TaGVldDogTWF0Qm90dG9tU2hlZXQsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9CT1RUT01fU0hFRVRfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zPzogTWF0Qm90dG9tU2hlZXRDb25maWcsXG4gICkge31cblxuICAvKipcbiAgICogT3BlbnMgYSBib3R0b20gc2hlZXQgY29udGFpbmluZyB0aGUgZ2l2ZW4gY29tcG9uZW50LlxuICAgKiBAcGFyYW0gY29tcG9uZW50IFR5cGUgb2YgdGhlIGNvbXBvbmVudCB0byBsb2FkIGludG8gdGhlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIGNvbmZpZyBFeHRyYSBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAqIEByZXR1cm5zIFJlZmVyZW5jZSB0byB0aGUgbmV3bHktb3BlbmVkIGJvdHRvbSBzaGVldC5cbiAgICovXG4gIG9wZW48VCwgRCA9IGFueSwgUiA9IGFueT4oXG4gICAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+LFxuICAgIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnPEQ+LFxuICApOiBNYXRCb3R0b21TaGVldFJlZjxULCBSPjtcblxuICAvKipcbiAgICogT3BlbnMgYSBib3R0b20gc2hlZXQgY29udGFpbmluZyB0aGUgZ2l2ZW4gdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB0ZW1wbGF0ZSBUZW1wbGF0ZVJlZiB0byBpbnN0YW50aWF0ZSBhcyB0aGUgYm90dG9tIHNoZWV0IGNvbnRlbnQuXG4gICAqIEBwYXJhbSBjb25maWcgRXh0cmEgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIG5ld2x5LW9wZW5lZCBib3R0b20gc2hlZXQuXG4gICAqL1xuICBvcGVuPFQsIEQgPSBhbnksIFIgPSBhbnk+KFxuICAgIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxUPixcbiAgICBjb25maWc/OiBNYXRCb3R0b21TaGVldENvbmZpZzxEPixcbiAgKTogTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj47XG5cbiAgb3BlbjxULCBEID0gYW55LCBSID0gYW55PihcbiAgICBjb21wb25lbnRPclRlbXBsYXRlUmVmOiBDb21wb25lbnRUeXBlPFQ+IHwgVGVtcGxhdGVSZWY8VD4sXG4gICAgY29uZmlnPzogTWF0Qm90dG9tU2hlZXRDb25maWc8RD4sXG4gICk6IE1hdEJvdHRvbVNoZWV0UmVmPFQsIFI+IHtcbiAgICBjb25zdCBfY29uZmlnID0gX2FwcGx5Q29uZmlnRGVmYXVsdHMoXG4gICAgICB0aGlzLl9kZWZhdWx0T3B0aW9ucyB8fCBuZXcgTWF0Qm90dG9tU2hlZXRDb25maWcoKSxcbiAgICAgIGNvbmZpZyxcbiAgICApO1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9jcmVhdGVPdmVybGF5KF9jb25maWcpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2F0dGFjaENvbnRhaW5lcihvdmVybGF5UmVmLCBfY29uZmlnKTtcbiAgICBjb25zdCByZWYgPSBuZXcgTWF0Qm90dG9tU2hlZXRSZWY8VCwgUj4oY29udGFpbmVyLCBvdmVybGF5UmVmKTtcblxuICAgIGlmIChjb21wb25lbnRPclRlbXBsYXRlUmVmIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIGNvbnRhaW5lci5hdHRhY2hUZW1wbGF0ZVBvcnRhbChcbiAgICAgICAgbmV3IFRlbXBsYXRlUG9ydGFsPFQ+KGNvbXBvbmVudE9yVGVtcGxhdGVSZWYsIG51bGwhLCB7XG4gICAgICAgICAgJGltcGxpY2l0OiBfY29uZmlnLmRhdGEsXG4gICAgICAgICAgYm90dG9tU2hlZXRSZWY6IHJlZixcbiAgICAgICAgfSBhcyBhbnkpLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgICAgY29tcG9uZW50T3JUZW1wbGF0ZVJlZixcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICB0aGlzLl9jcmVhdGVJbmplY3RvcihfY29uZmlnLCByZWYpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGNvbnRlbnRSZWYgPSBjb250YWluZXIuYXR0YWNoQ29tcG9uZW50UG9ydGFsKHBvcnRhbCk7XG4gICAgICByZWYuaW5zdGFuY2UgPSBjb250ZW50UmVmLmluc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFdoZW4gdGhlIGJvdHRvbSBzaGVldCBpcyBkaXNtaXNzZWQsIGNsZWFyIHRoZSByZWZlcmVuY2UgdG8gaXQuXG4gICAgcmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENsZWFyIHRoZSBib3R0b20gc2hlZXQgcmVmIGlmIGl0IGhhc24ndCBhbHJlYWR5IGJlZW4gcmVwbGFjZWQgYnkgYSBuZXdlciBvbmUuXG4gICAgICBpZiAodGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYgPT0gcmVmKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZikge1xuICAgICAgLy8gSWYgYSBib3R0b20gc2hlZXQgaXMgYWxyZWFkeSBpbiB2aWV3LCBkaXNtaXNzIGl0IGFuZCBlbnRlciB0aGVcbiAgICAgIC8vIG5ldyBib3R0b20gc2hlZXQgYWZ0ZXIgZXhpdCBhbmltYXRpb24gaXMgY29tcGxldGUuXG4gICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZi5hZnRlckRpc21pc3NlZCgpLnN1YnNjcmliZSgoKSA9PiByZWYuY29udGFpbmVySW5zdGFuY2UuZW50ZXIoKSk7XG4gICAgICB0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZi5kaXNtaXNzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIG5vIGJvdHRvbSBzaGVldCBpcyBpbiB2aWV3LCBlbnRlciB0aGUgbmV3IGJvdHRvbSBzaGVldC5cbiAgICAgIHJlZi5jb250YWluZXJJbnN0YW5jZS5lbnRlcigpO1xuICAgIH1cblxuICAgIHRoaXMuX29wZW5lZEJvdHRvbVNoZWV0UmVmID0gcmVmO1xuXG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseS12aXNpYmxlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIHJlc3VsdCBEYXRhIHRvIHBhc3MgdG8gdGhlIGJvdHRvbSBzaGVldCBpbnN0YW5jZS5cbiAgICovXG4gIGRpc21pc3M8UiA9IGFueT4ocmVzdWx0PzogUik6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWRCb3R0b21TaGVldFJlZikge1xuICAgICAgdGhpcy5fb3BlbmVkQm90dG9tU2hlZXRSZWYuZGlzbWlzcyhyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsKSB7XG4gICAgICB0aGlzLl9ib3R0b21TaGVldFJlZkF0VGhpc0xldmVsLmRpc21pc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhlIGJvdHRvbSBzaGVldCBjb250YWluZXIgY29tcG9uZW50IHRvIHRoZSBvdmVybGF5LlxuICAgKi9cbiAgcHJpdmF0ZSBfYXR0YWNoQ29udGFpbmVyKFxuICAgIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWYsXG4gICAgY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyxcbiAgKTogTWF0Qm90dG9tU2hlZXRDb250YWluZXIge1xuICAgIGNvbnN0IHVzZXJJbmplY3RvciA9IGNvbmZpZyAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZiAmJiBjb25maWcudmlld0NvbnRhaW5lclJlZi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBNYXRCb3R0b21TaGVldENvbmZpZywgdXNlVmFsdWU6IGNvbmZpZ31dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChcbiAgICAgIE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyLFxuICAgICAgY29uZmlnLnZpZXdDb250YWluZXJSZWYsXG4gICAgICBpbmplY3RvcixcbiAgICApO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPE1hdEJvdHRvbVNoZWV0Q29udGFpbmVyPiA9IG92ZXJsYXlSZWYuYXR0YWNoKGNvbnRhaW5lclBvcnRhbCk7XG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IG92ZXJsYXkgYW5kIHBsYWNlcyBpdCBpbiB0aGUgY29ycmVjdCBsb2NhdGlvbi5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgdXNlci1zcGVjaWZpZWQgYm90dG9tIHNoZWV0IGNvbmZpZy5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU92ZXJsYXkoY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyk6IE92ZXJsYXlSZWYge1xuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBkaXJlY3Rpb246IGNvbmZpZy5kaXJlY3Rpb24sXG4gICAgICBoYXNCYWNrZHJvcDogY29uZmlnLmhhc0JhY2tkcm9wLFxuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogY29uZmlnLmNsb3NlT25OYXZpZ2F0aW9uLFxuICAgICAgbWF4V2lkdGg6ICcxMDAlJyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiBjb25maWcuc2Nyb2xsU3RyYXRlZ3kgfHwgdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCksXG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuYm90dG9tKCcwJyksXG4gICAgfSk7XG5cbiAgICBpZiAoY29uZmlnLmJhY2tkcm9wQ2xhc3MpIHtcbiAgICAgIG92ZXJsYXlDb25maWcuYmFja2Ryb3BDbGFzcyA9IGNvbmZpZy5iYWNrZHJvcENsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vdmVybGF5LmNyZWF0ZShvdmVybGF5Q29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluamVjdG9yIHRvIGJlIHVzZWQgaW5zaWRlIG9mIGEgYm90dG9tIHNoZWV0IGNvbXBvbmVudC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWcgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhlIGJvdHRvbSBzaGVldC5cbiAgICogQHBhcmFtIGJvdHRvbVNoZWV0UmVmIFJlZmVyZW5jZSB0byB0aGUgYm90dG9tIHNoZWV0LlxuICAgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5qZWN0b3I8VD4oXG4gICAgY29uZmlnOiBNYXRCb3R0b21TaGVldENvbmZpZyxcbiAgICBib3R0b21TaGVldFJlZjogTWF0Qm90dG9tU2hlZXRSZWY8VD4sXG4gICk6IEluamVjdG9yIHtcbiAgICBjb25zdCB1c2VySW5qZWN0b3IgPSBjb25maWcgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYgJiYgY29uZmlnLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgY29uc3QgcHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdID0gW1xuICAgICAge3Byb3ZpZGU6IE1hdEJvdHRvbVNoZWV0UmVmLCB1c2VWYWx1ZTogYm90dG9tU2hlZXRSZWZ9LFxuICAgICAge3Byb3ZpZGU6IE1BVF9CT1RUT01fU0hFRVRfREFUQSwgdXNlVmFsdWU6IGNvbmZpZy5kYXRhfSxcbiAgICBdO1xuXG4gICAgaWYgKFxuICAgICAgY29uZmlnLmRpcmVjdGlvbiAmJlxuICAgICAgKCF1c2VySW5qZWN0b3IgfHxcbiAgICAgICAgIXVzZXJJbmplY3Rvci5nZXQ8RGlyZWN0aW9uYWxpdHkgfCBudWxsPihEaXJlY3Rpb25hbGl0eSwgbnVsbCwgSW5qZWN0RmxhZ3MuT3B0aW9uYWwpKVxuICAgICkge1xuICAgICAgcHJvdmlkZXJzLnB1c2goe1xuICAgICAgICBwcm92aWRlOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgdXNlVmFsdWU6IHt2YWx1ZTogY29uZmlnLmRpcmVjdGlvbiwgY2hhbmdlOiBvYnNlcnZhYmxlT2YoKX0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW5qZWN0b3IuY3JlYXRlKHtwYXJlbnQ6IHVzZXJJbmplY3RvciB8fCB0aGlzLl9pbmplY3RvciwgcHJvdmlkZXJzfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBsaWVzIGRlZmF1bHQgb3B0aW9ucyB0byB0aGUgYm90dG9tIHNoZWV0IGNvbmZpZy5cbiAqIEBwYXJhbSBkZWZhdWx0cyBPYmplY3QgY29udGFpbmluZyB0aGUgZGVmYXVsdCB2YWx1ZXMgdG8gd2hpY2ggdG8gZmFsbCBiYWNrLlxuICogQHBhcmFtIGNvbmZpZyBUaGUgY29uZmlndXJhdGlvbiB0byB3aGljaCB0aGUgZGVmYXVsdHMgd2lsbCBiZSBhcHBsaWVkLlxuICogQHJldHVybnMgVGhlIG5ldyBjb25maWd1cmF0aW9uIG9iamVjdCB3aXRoIGRlZmF1bHRzIGFwcGxpZWQuXG4gKi9cbmZ1bmN0aW9uIF9hcHBseUNvbmZpZ0RlZmF1bHRzKFxuICBkZWZhdWx0czogTWF0Qm90dG9tU2hlZXRDb25maWcsXG4gIGNvbmZpZz86IE1hdEJvdHRvbVNoZWV0Q29uZmlnLFxuKTogTWF0Qm90dG9tU2hlZXRDb25maWcge1xuICByZXR1cm4gey4uLmRlZmF1bHRzLCAuLi5jb25maWd9O1xufVxuIl19