/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { Inject, InjectionToken, NgModule, Optional } from '@angular/core';
import { VERSION as CDK_VERSION } from '@angular/cdk';
import { DOCUMENT } from '@angular/common';
import { _isTestEnvironment } from '@angular/cdk/platform';
import { VERSION } from '../version';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
/** @docs-private */
export function MATERIAL_SANITY_CHECKS_FACTORY() {
    return true;
}
/** Injection token that configures whether the Material sanity checks are enabled. */
export const MATERIAL_SANITY_CHECKS = new InjectionToken('mat-sanity-checks', {
    providedIn: 'root',
    factory: MATERIAL_SANITY_CHECKS_FACTORY,
});
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, etc.
 *
 * This module should be imported to each top-level component module (e.g., MatTabsModule).
 */
export class MatCommonModule {
    constructor(highContrastModeDetector, _sanityChecks, _document) {
        this._sanityChecks = _sanityChecks;
        this._document = _document;
        /** Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype). */
        this._hasDoneGlobalChecks = false;
        // While A11yModule also does this, we repeat it here to avoid importing A11yModule
        // in MatCommonModule.
        highContrastModeDetector._applyBodyHighContrastModeCssClasses();
        if (!this._hasDoneGlobalChecks) {
            this._hasDoneGlobalChecks = true;
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                if (this._checkIsEnabled('doctype')) {
                    _checkDoctypeIsDefined(this._document);
                }
                if (this._checkIsEnabled('theme')) {
                    _checkThemeIsPresent(this._document);
                }
                if (this._checkIsEnabled('version')) {
                    _checkCdkVersionMatch();
                }
            }
        }
    }
    /** Gets whether a specific sanity check is enabled. */
    _checkIsEnabled(name) {
        if (_isTestEnvironment()) {
            return false;
        }
        if (typeof this._sanityChecks === 'boolean') {
            return this._sanityChecks;
        }
        return !!this._sanityChecks[name];
    }
}
MatCommonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCommonModule, deps: [{ token: i1.HighContrastModeDetector }, { token: MATERIAL_SANITY_CHECKS, optional: true }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.NgModule });
MatCommonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCommonModule, imports: [BidiModule], exports: [BidiModule] });
MatCommonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCommonModule, imports: [[BidiModule], BidiModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [BidiModule],
                    exports: [BidiModule],
                }]
        }], ctorParameters: function () { return [{ type: i1.HighContrastModeDetector }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MATERIAL_SANITY_CHECKS]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/** Checks that the page has a doctype. */
function _checkDoctypeIsDefined(doc) {
    if (!doc.doctype) {
        console.warn('Current document does not have a doctype. This may cause ' +
            'some Angular Material components not to behave as expected.');
    }
}
/** Checks that a theme has been included. */
function _checkThemeIsPresent(doc) {
    // We need to assert that the `body` is defined, because these checks run very early
    // and the `body` won't be defined if the consumer put their scripts in the `head`.
    if (!doc.body || typeof getComputedStyle !== 'function') {
        return;
    }
    const testElement = doc.createElement('div');
    testElement.classList.add('mat-theme-loaded-marker');
    doc.body.appendChild(testElement);
    const computedStyle = getComputedStyle(testElement);
    // In some situations the computed style of the test element can be null. For example in
    // Firefox, the computed style is null if an application is running inside of a hidden iframe.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    if (computedStyle && computedStyle.display !== 'none') {
        console.warn('Could not find Angular Material core theme. Most Material ' +
            'components may not work as expected. For more info refer ' +
            'to the theming guide: https://material.angular.io/guide/theming');
    }
    testElement.remove();
}
/** Checks whether the Material version matches the CDK version. */
function _checkCdkVersionMatch() {
    if (VERSION.full !== CDK_VERSION.full) {
        console.warn('The Angular Material version (' +
            VERSION.full +
            ') does not match ' +
            'the Angular CDK version (' +
            CDK_VERSION.full +
            ').\n' +
            'Please ensure the versions of these two packages exactly match.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RSxPQUFPLEVBQUMsT0FBTyxJQUFJLFdBQVcsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQzs7O0FBRW5DLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsOEJBQThCO0lBQzVDLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHNGQUFzRjtBQUN0RixNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBZSxtQkFBbUIsRUFBRTtJQUMxRixVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsOEJBQThCO0NBQ3hDLENBQUMsQ0FBQztBQWVIOzs7OztHQUtHO0FBS0gsTUFBTSxPQUFPLGVBQWU7SUFJMUIsWUFDRSx3QkFBa0QsRUFDRSxhQUEyQixFQUNyRCxTQUFtQjtRQURPLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1FBQ3JELGNBQVMsR0FBVCxTQUFTLENBQVU7UUFOL0MsZ0dBQWdHO1FBQ3hGLHlCQUFvQixHQUFHLEtBQUssQ0FBQztRQU9uQyxtRkFBbUY7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Z0M7WUFDOUIsT0FBTyxDQUFDLElBQUk7WUFDWixtQkFBbUI7WUFDbkIsMkJBQTJCO1lBQzNCLFdBQVcsQ0FBQyxJQUFJO1lBQ2hCLE1BQU07WUFDTixpRUFBaUUsQ0FDcEUsQ0FBQztLQUNIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hpZ2hDb250cmFzdE1vZGVEZXRlY3Rvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCaWRpTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0aW9uVG9rZW4sIE5nTW9kdWxlLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1ZFUlNJT04gYXMgQ0RLX1ZFUlNJT059IGZyb20gJ0Bhbmd1bGFyL2Nkayc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtfaXNUZXN0RW52aXJvbm1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1ZFUlNJT059IGZyb20gJy4uL3ZlcnNpb24nO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVEVSSUFMX1NBTklUWV9DSEVDS1NfRkFDVE9SWSgpOiBTYW5pdHlDaGVja3Mge1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNvbmZpZ3VyZXMgd2hldGhlciB0aGUgTWF0ZXJpYWwgc2FuaXR5IGNoZWNrcyBhcmUgZW5hYmxlZC4gKi9cbmV4cG9ydCBjb25zdCBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTID0gbmV3IEluamVjdGlvblRva2VuPFNhbml0eUNoZWNrcz4oJ21hdC1zYW5pdHktY2hlY2tzJywge1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIGZhY3Rvcnk6IE1BVEVSSUFMX1NBTklUWV9DSEVDS1NfRkFDVE9SWSxcbn0pO1xuXG4vKipcbiAqIFBvc3NpYmxlIHNhbml0eSBjaGVja3MgdGhhdCBjYW4gYmUgZW5hYmxlZC4gSWYgc2V0IHRvXG4gKiB0cnVlL2ZhbHNlLCBhbGwgY2hlY2tzIHdpbGwgYmUgZW5hYmxlZC9kaXNhYmxlZC5cbiAqL1xuZXhwb3J0IHR5cGUgU2FuaXR5Q2hlY2tzID0gYm9vbGVhbiB8IEdyYW51bGFyU2FuaXR5Q2hlY2tzO1xuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBzYW5pdHkgY2hlY2tzIGdyYW51bGFybHkuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyYW51bGFyU2FuaXR5Q2hlY2tzIHtcbiAgZG9jdHlwZTogYm9vbGVhbjtcbiAgdGhlbWU6IGJvb2xlYW47XG4gIHZlcnNpb246IGJvb2xlYW47XG59XG5cbi8qKlxuICogTW9kdWxlIHRoYXQgY2FwdHVyZXMgYW55dGhpbmcgdGhhdCBzaG91bGQgYmUgbG9hZGVkIGFuZC9vciBydW4gZm9yICphbGwqIEFuZ3VsYXIgTWF0ZXJpYWxcbiAqIGNvbXBvbmVudHMuIFRoaXMgaW5jbHVkZXMgQmlkaSwgZXRjLlxuICpcbiAqIFRoaXMgbW9kdWxlIHNob3VsZCBiZSBpbXBvcnRlZCB0byBlYWNoIHRvcC1sZXZlbCBjb21wb25lbnQgbW9kdWxlIChlLmcuLCBNYXRUYWJzTW9kdWxlKS5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0JpZGlNb2R1bGVdLFxuICBleHBvcnRzOiBbQmlkaU1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENvbW1vbk1vZHVsZSB7XG4gIC8qKiBXaGV0aGVyIHdlJ3ZlIGRvbmUgdGhlIGdsb2JhbCBzYW5pdHkgY2hlY2tzIChlLmcuIGEgdGhlbWUgaXMgbG9hZGVkLCB0aGVyZSBpcyBhIGRvY3R5cGUpLiAqL1xuICBwcml2YXRlIF9oYXNEb25lR2xvYmFsQ2hlY2tzID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaGlnaENvbnRyYXN0TW9kZURldGVjdG9yOiBIaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTKSBwcml2YXRlIF9zYW5pdHlDaGVja3M6IFNhbml0eUNoZWNrcyxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQsXG4gICkge1xuICAgIC8vIFdoaWxlIEExMXlNb2R1bGUgYWxzbyBkb2VzIHRoaXMsIHdlIHJlcGVhdCBpdCBoZXJlIHRvIGF2b2lkIGltcG9ydGluZyBBMTF5TW9kdWxlXG4gICAgLy8gaW4gTWF0Q29tbW9uTW9kdWxlLlxuICAgIGhpZ2hDb250cmFzdE1vZGVEZXRlY3Rvci5fYXBwbHlCb2R5SGlnaENvbnRyYXN0TW9kZUNzc0NsYXNzZXMoKTtcblxuICAgIGlmICghdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcykge1xuICAgICAgdGhpcy5faGFzRG9uZUdsb2JhbENoZWNrcyA9IHRydWU7XG5cbiAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NoZWNrSXNFbmFibGVkKCdkb2N0eXBlJykpIHtcbiAgICAgICAgICBfY2hlY2tEb2N0eXBlSXNEZWZpbmVkKHRoaXMuX2RvY3VtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jaGVja0lzRW5hYmxlZCgndGhlbWUnKSkge1xuICAgICAgICAgIF9jaGVja1RoZW1lSXNQcmVzZW50KHRoaXMuX2RvY3VtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jaGVja0lzRW5hYmxlZCgndmVyc2lvbicpKSB7XG4gICAgICAgICAgX2NoZWNrQ2RrVmVyc2lvbk1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIGEgc3BlY2lmaWMgc2FuaXR5IGNoZWNrIGlzIGVuYWJsZWQuICovXG4gIHByaXZhdGUgX2NoZWNrSXNFbmFibGVkKG5hbWU6IGtleW9mIEdyYW51bGFyU2FuaXR5Q2hlY2tzKTogYm9vbGVhbiB7XG4gICAgaWYgKF9pc1Rlc3RFbnZpcm9ubWVudCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLl9zYW5pdHlDaGVja3MgPT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIHRoaXMuX3Nhbml0eUNoZWNrcztcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLl9zYW5pdHlDaGVja3NbbmFtZV07XG4gIH1cbn1cblxuLyoqIENoZWNrcyB0aGF0IHRoZSBwYWdlIGhhcyBhIGRvY3R5cGUuICovXG5mdW5jdGlvbiBfY2hlY2tEb2N0eXBlSXNEZWZpbmVkKGRvYzogRG9jdW1lbnQpOiB2b2lkIHtcbiAgaWYgKCFkb2MuZG9jdHlwZSkge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgICdDdXJyZW50IGRvY3VtZW50IGRvZXMgbm90IGhhdmUgYSBkb2N0eXBlLiBUaGlzIG1heSBjYXVzZSAnICtcbiAgICAgICAgJ3NvbWUgQW5ndWxhciBNYXRlcmlhbCBjb21wb25lbnRzIG5vdCB0byBiZWhhdmUgYXMgZXhwZWN0ZWQuJyxcbiAgICApO1xuICB9XG59XG5cbi8qKiBDaGVja3MgdGhhdCBhIHRoZW1lIGhhcyBiZWVuIGluY2x1ZGVkLiAqL1xuZnVuY3Rpb24gX2NoZWNrVGhlbWVJc1ByZXNlbnQoZG9jOiBEb2N1bWVudCk6IHZvaWQge1xuICAvLyBXZSBuZWVkIHRvIGFzc2VydCB0aGF0IHRoZSBgYm9keWAgaXMgZGVmaW5lZCwgYmVjYXVzZSB0aGVzZSBjaGVja3MgcnVuIHZlcnkgZWFybHlcbiAgLy8gYW5kIHRoZSBgYm9keWAgd29uJ3QgYmUgZGVmaW5lZCBpZiB0aGUgY29uc3VtZXIgcHV0IHRoZWlyIHNjcmlwdHMgaW4gdGhlIGBoZWFkYC5cbiAgaWYgKCFkb2MuYm9keSB8fCB0eXBlb2YgZ2V0Q29tcHV0ZWRTdHlsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHRlc3RFbGVtZW50ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtdGhlbWUtbG9hZGVkLW1hcmtlcicpO1xuICBkb2MuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUodGVzdEVsZW1lbnQpO1xuXG4gIC8vIEluIHNvbWUgc2l0dWF0aW9ucyB0aGUgY29tcHV0ZWQgc3R5bGUgb2YgdGhlIHRlc3QgZWxlbWVudCBjYW4gYmUgbnVsbC4gRm9yIGV4YW1wbGUgaW5cbiAgLy8gRmlyZWZveCwgdGhlIGNvbXB1dGVkIHN0eWxlIGlzIG51bGwgaWYgYW4gYXBwbGljYXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgYSBoaWRkZW4gaWZyYW1lLlxuICAvLyBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTU0ODM5N1xuICBpZiAoY29tcHV0ZWRTdHlsZSAmJiBjb21wdXRlZFN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgICdDb3VsZCBub3QgZmluZCBBbmd1bGFyIE1hdGVyaWFsIGNvcmUgdGhlbWUuIE1vc3QgTWF0ZXJpYWwgJyArXG4gICAgICAgICdjb21wb25lbnRzIG1heSBub3Qgd29yayBhcyBleHBlY3RlZC4gRm9yIG1vcmUgaW5mbyByZWZlciAnICtcbiAgICAgICAgJ3RvIHRoZSB0aGVtaW5nIGd1aWRlOiBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvdGhlbWluZycsXG4gICAgKTtcbiAgfVxuXG4gIHRlc3RFbGVtZW50LnJlbW92ZSgpO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgdGhlIE1hdGVyaWFsIHZlcnNpb24gbWF0Y2hlcyB0aGUgQ0RLIHZlcnNpb24uICovXG5mdW5jdGlvbiBfY2hlY2tDZGtWZXJzaW9uTWF0Y2goKTogdm9pZCB7XG4gIGlmIChWRVJTSU9OLmZ1bGwgIT09IENES19WRVJTSU9OLmZ1bGwpIHtcbiAgICBjb25zb2xlLndhcm4oXG4gICAgICAnVGhlIEFuZ3VsYXIgTWF0ZXJpYWwgdmVyc2lvbiAoJyArXG4gICAgICAgIFZFUlNJT04uZnVsbCArXG4gICAgICAgICcpIGRvZXMgbm90IG1hdGNoICcgK1xuICAgICAgICAndGhlIEFuZ3VsYXIgQ0RLIHZlcnNpb24gKCcgK1xuICAgICAgICBDREtfVkVSU0lPTi5mdWxsICtcbiAgICAgICAgJykuXFxuJyArXG4gICAgICAgICdQbGVhc2UgZW5zdXJlIHRoZSB2ZXJzaW9ucyBvZiB0aGVzZSB0d28gcGFja2FnZXMgZXhhY3RseSBtYXRjaC4nLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==