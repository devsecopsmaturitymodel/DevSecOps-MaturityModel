/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** CSS class applied to the document body when in black-on-white high-contrast mode. */
export const BLACK_ON_WHITE_CSS_CLASS = 'cdk-high-contrast-black-on-white';
/** CSS class applied to the document body when in white-on-black high-contrast mode. */
export const WHITE_ON_BLACK_CSS_CLASS = 'cdk-high-contrast-white-on-black';
/** CSS class applied to the document body when in high-contrast mode. */
export const HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = 'cdk-high-contrast-active';
/**
 * Service to determine whether the browser is currently in a high-contrast-mode environment.
 *
 * Microsoft Windows supports an accessibility feature called "High Contrast Mode". This mode
 * changes the appearance of all applications, including web applications, to dramatically increase
 * contrast.
 *
 * IE, Edge, and Firefox currently support this mode. Chrome does not support Windows High Contrast
 * Mode. This service does not detect high-contrast mode as added by the Chrome "High Contrast"
 * browser extension.
 */
export class HighContrastModeDetector {
    constructor(_platform, document) {
        this._platform = _platform;
        this._document = document;
    }
    /** Gets the current high-contrast-mode for the page. */
    getHighContrastMode() {
        if (!this._platform.isBrowser) {
            return 0 /* NONE */;
        }
        // Create a test element with an arbitrary background-color that is neither black nor
        // white; high-contrast mode will coerce the color to either black or white. Also ensure that
        // appending the test element to the DOM does not affect layout by absolutely positioning it
        const testElement = this._document.createElement('div');
        testElement.style.backgroundColor = 'rgb(1,2,3)';
        testElement.style.position = 'absolute';
        this._document.body.appendChild(testElement);
        // Get the computed style for the background color, collapsing spaces to normalize between
        // browsers. Once we get this color, we no longer need the test element. Access the `window`
        // via the document so we can fake it in tests. Note that we have extra null checks, because
        // this logic will likely run during app bootstrap and throwing can break the entire app.
        const documentWindow = this._document.defaultView || window;
        const computedStyle = documentWindow && documentWindow.getComputedStyle
            ? documentWindow.getComputedStyle(testElement)
            : null;
        const computedColor = ((computedStyle && computedStyle.backgroundColor) || '').replace(/ /g, '');
        testElement.remove();
        switch (computedColor) {
            case 'rgb(0,0,0)':
                return 2 /* WHITE_ON_BLACK */;
            case 'rgb(255,255,255)':
                return 1 /* BLACK_ON_WHITE */;
        }
        return 0 /* NONE */;
    }
    /** Applies CSS classes indicating high-contrast mode to document body (browser-only). */
    _applyBodyHighContrastModeCssClasses() {
        if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
            const bodyClasses = this._document.body.classList;
            // IE11 doesn't support `classList` operations with multiple arguments
            bodyClasses.remove(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS);
            bodyClasses.remove(BLACK_ON_WHITE_CSS_CLASS);
            bodyClasses.remove(WHITE_ON_BLACK_CSS_CLASS);
            this._hasCheckedHighContrastMode = true;
            const mode = this.getHighContrastMode();
            if (mode === 1 /* BLACK_ON_WHITE */) {
                bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS);
                bodyClasses.add(BLACK_ON_WHITE_CSS_CLASS);
            }
            else if (mode === 2 /* WHITE_ON_BLACK */) {
                bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS);
                bodyClasses.add(WHITE_ON_BLACK_CSS_CLASS);
            }
        }
    }
}
HighContrastModeDetector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HighContrastModeDetector, deps: [{ token: i1.Platform }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
HighContrastModeDetector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HighContrastModeDetector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HighContrastModeDetector, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Platform }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaC1jb250cmFzdC1tb2RlLWRldGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9hMTF5L2hpZ2gtY29udHJhc3QtbW9kZS9oaWdoLWNvbnRyYXN0LW1vZGUtZGV0ZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7O0FBU2pELHdGQUF3RjtBQUN4RixNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBRyxrQ0FBa0MsQ0FBQztBQUUzRSx3RkFBd0Y7QUFDeEYsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUcsa0NBQWtDLENBQUM7QUFFM0UseUVBQXlFO0FBQ3pFLE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFHLDBCQUEwQixDQUFDO0FBRTlFOzs7Ozs7Ozs7O0dBVUc7QUFFSCxNQUFNLE9BQU8sd0JBQXdCO0lBUW5DLFlBQW9CLFNBQW1CLEVBQW9CLFFBQWE7UUFBcEQsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDO0lBRUQsd0RBQXdEO0lBQ3hELG1CQUFtQjtRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDN0Isb0JBQTZCO1NBQzlCO1FBRUQscUZBQXFGO1FBQ3JGLDZGQUE2RjtRQUM3Riw0RkFBNEY7UUFDNUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsV0FBVyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDO1FBQ2pELFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFN0MsMEZBQTBGO1FBQzFGLDRGQUE0RjtRQUM1Riw0RkFBNEY7UUFDNUYseUZBQXlGO1FBQ3pGLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQztRQUM1RCxNQUFNLGFBQWEsR0FDakIsY0FBYyxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0I7WUFDL0MsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7WUFDOUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNYLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FDcEYsSUFBSSxFQUNKLEVBQUUsQ0FDSCxDQUFDO1FBQ0YsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXJCLFFBQVEsYUFBYSxFQUFFO1lBQ3JCLEtBQUssWUFBWTtnQkFDZiw4QkFBdUM7WUFDekMsS0FBSyxrQkFBa0I7Z0JBQ3JCLDhCQUF1QztTQUMxQztRQUNELG9CQUE2QjtJQUMvQixDQUFDO0lBRUQseUZBQXlGO0lBQ3pGLG9DQUFvQztRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ3hGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNsRCxzRUFBc0U7WUFDdEUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ3hELFdBQVcsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUM3QyxXQUFXLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQztZQUV4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUN4QyxJQUFJLElBQUksMkJBQW9DLEVBQUU7Z0JBQzVDLFdBQVcsQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFDckQsV0FBVyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2FBQzNDO2lCQUFNLElBQUksSUFBSSwyQkFBb0MsRUFBRTtnQkFDbkQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO2dCQUNyRCxXQUFXLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7YUFDM0M7U0FDRjtJQUNILENBQUM7O3FIQXJFVSx3QkFBd0IsMENBUWMsUUFBUTt5SEFSOUMsd0JBQXdCLGNBRFosTUFBTTsyRkFDbEIsd0JBQXdCO2tCQURwQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7MEJBU1ksTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogU2V0IG9mIHBvc3NpYmxlIGhpZ2gtY29udHJhc3QgbW9kZSBiYWNrZ3JvdW5kcy4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIEhpZ2hDb250cmFzdE1vZGUge1xuICBOT05FLFxuICBCTEFDS19PTl9XSElURSxcbiAgV0hJVEVfT05fQkxBQ0ssXG59XG5cbi8qKiBDU1MgY2xhc3MgYXBwbGllZCB0byB0aGUgZG9jdW1lbnQgYm9keSB3aGVuIGluIGJsYWNrLW9uLXdoaXRlIGhpZ2gtY29udHJhc3QgbW9kZS4gKi9cbmV4cG9ydCBjb25zdCBCTEFDS19PTl9XSElURV9DU1NfQ0xBU1MgPSAnY2RrLWhpZ2gtY29udHJhc3QtYmxhY2stb24td2hpdGUnO1xuXG4vKiogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gdGhlIGRvY3VtZW50IGJvZHkgd2hlbiBpbiB3aGl0ZS1vbi1ibGFjayBoaWdoLWNvbnRyYXN0IG1vZGUuICovXG5leHBvcnQgY29uc3QgV0hJVEVfT05fQkxBQ0tfQ1NTX0NMQVNTID0gJ2Nkay1oaWdoLWNvbnRyYXN0LXdoaXRlLW9uLWJsYWNrJztcblxuLyoqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHRoZSBkb2N1bWVudCBib2R5IHdoZW4gaW4gaGlnaC1jb250cmFzdCBtb2RlLiAqL1xuZXhwb3J0IGNvbnN0IEhJR0hfQ09OVFJBU1RfTU9ERV9BQ1RJVkVfQ1NTX0NMQVNTID0gJ2Nkay1oaWdoLWNvbnRyYXN0LWFjdGl2ZSc7XG5cbi8qKlxuICogU2VydmljZSB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgYnJvd3NlciBpcyBjdXJyZW50bHkgaW4gYSBoaWdoLWNvbnRyYXN0LW1vZGUgZW52aXJvbm1lbnQuXG4gKlxuICogTWljcm9zb2Z0IFdpbmRvd3Mgc3VwcG9ydHMgYW4gYWNjZXNzaWJpbGl0eSBmZWF0dXJlIGNhbGxlZCBcIkhpZ2ggQ29udHJhc3QgTW9kZVwiLiBUaGlzIG1vZGVcbiAqIGNoYW5nZXMgdGhlIGFwcGVhcmFuY2Ugb2YgYWxsIGFwcGxpY2F0aW9ucywgaW5jbHVkaW5nIHdlYiBhcHBsaWNhdGlvbnMsIHRvIGRyYW1hdGljYWxseSBpbmNyZWFzZVxuICogY29udHJhc3QuXG4gKlxuICogSUUsIEVkZ2UsIGFuZCBGaXJlZm94IGN1cnJlbnRseSBzdXBwb3J0IHRoaXMgbW9kZS4gQ2hyb21lIGRvZXMgbm90IHN1cHBvcnQgV2luZG93cyBIaWdoIENvbnRyYXN0XG4gKiBNb2RlLiBUaGlzIHNlcnZpY2UgZG9lcyBub3QgZGV0ZWN0IGhpZ2gtY29udHJhc3QgbW9kZSBhcyBhZGRlZCBieSB0aGUgQ2hyb21lIFwiSGlnaCBDb250cmFzdFwiXG4gKiBicm93c2VyIGV4dGVuc2lvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgSGlnaENvbnRyYXN0TW9kZURldGVjdG9yIHtcbiAgLyoqXG4gICAqIEZpZ3VyaW5nIG91dCB0aGUgaGlnaCBjb250cmFzdCBtb2RlIGFuZCBhZGRpbmcgdGhlIGJvZHkgY2xhc3NlcyBjYW4gY2F1c2VcbiAgICogc29tZSBleHBlbnNpdmUgbGF5b3V0cy4gVGhpcyBmbGFnIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXQgd2Ugb25seSBkbyBpdCBvbmNlLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGFzQ2hlY2tlZEhpZ2hDb250cmFzdE1vZGU6IGJvb2xlYW47XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgaGlnaC1jb250cmFzdC1tb2RlIGZvciB0aGUgcGFnZS4gKi9cbiAgZ2V0SGlnaENvbnRyYXN0TW9kZSgpOiBIaWdoQ29udHJhc3RNb2RlIHtcbiAgICBpZiAoIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuIEhpZ2hDb250cmFzdE1vZGUuTk9ORTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYSB0ZXN0IGVsZW1lbnQgd2l0aCBhbiBhcmJpdHJhcnkgYmFja2dyb3VuZC1jb2xvciB0aGF0IGlzIG5laXRoZXIgYmxhY2sgbm9yXG4gICAgLy8gd2hpdGU7IGhpZ2gtY29udHJhc3QgbW9kZSB3aWxsIGNvZXJjZSB0aGUgY29sb3IgdG8gZWl0aGVyIGJsYWNrIG9yIHdoaXRlLiBBbHNvIGVuc3VyZSB0aGF0XG4gICAgLy8gYXBwZW5kaW5nIHRoZSB0ZXN0IGVsZW1lbnQgdG8gdGhlIERPTSBkb2VzIG5vdCBhZmZlY3QgbGF5b3V0IGJ5IGFic29sdXRlbHkgcG9zaXRpb25pbmcgaXRcbiAgICBjb25zdCB0ZXN0RWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRlc3RFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMSwyLDMpJztcbiAgICB0ZXN0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0RWxlbWVudCk7XG5cbiAgICAvLyBHZXQgdGhlIGNvbXB1dGVkIHN0eWxlIGZvciB0aGUgYmFja2dyb3VuZCBjb2xvciwgY29sbGFwc2luZyBzcGFjZXMgdG8gbm9ybWFsaXplIGJldHdlZW5cbiAgICAvLyBicm93c2Vycy4gT25jZSB3ZSBnZXQgdGhpcyBjb2xvciwgd2Ugbm8gbG9uZ2VyIG5lZWQgdGhlIHRlc3QgZWxlbWVudC4gQWNjZXNzIHRoZSBgd2luZG93YFxuICAgIC8vIHZpYSB0aGUgZG9jdW1lbnQgc28gd2UgY2FuIGZha2UgaXQgaW4gdGVzdHMuIE5vdGUgdGhhdCB3ZSBoYXZlIGV4dHJhIG51bGwgY2hlY2tzLCBiZWNhdXNlXG4gICAgLy8gdGhpcyBsb2dpYyB3aWxsIGxpa2VseSBydW4gZHVyaW5nIGFwcCBib290c3RyYXAgYW5kIHRocm93aW5nIGNhbiBicmVhayB0aGUgZW50aXJlIGFwcC5cbiAgICBjb25zdCBkb2N1bWVudFdpbmRvdyA9IHRoaXMuX2RvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICBjb25zdCBjb21wdXRlZFN0eWxlID1cbiAgICAgIGRvY3VtZW50V2luZG93ICYmIGRvY3VtZW50V2luZG93LmdldENvbXB1dGVkU3R5bGVcbiAgICAgICAgPyBkb2N1bWVudFdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRlc3RFbGVtZW50KVxuICAgICAgICA6IG51bGw7XG4gICAgY29uc3QgY29tcHV0ZWRDb2xvciA9ICgoY29tcHV0ZWRTdHlsZSAmJiBjb21wdXRlZFN0eWxlLmJhY2tncm91bmRDb2xvcikgfHwgJycpLnJlcGxhY2UoXG4gICAgICAvIC9nLFxuICAgICAgJycsXG4gICAgKTtcbiAgICB0ZXN0RWxlbWVudC5yZW1vdmUoKTtcblxuICAgIHN3aXRjaCAoY29tcHV0ZWRDb2xvcikge1xuICAgICAgY2FzZSAncmdiKDAsMCwwKSc6XG4gICAgICAgIHJldHVybiBIaWdoQ29udHJhc3RNb2RlLldISVRFX09OX0JMQUNLO1xuICAgICAgY2FzZSAncmdiKDI1NSwyNTUsMjU1KSc6XG4gICAgICAgIHJldHVybiBIaWdoQ29udHJhc3RNb2RlLkJMQUNLX09OX1dISVRFO1xuICAgIH1cbiAgICByZXR1cm4gSGlnaENvbnRyYXN0TW9kZS5OT05FO1xuICB9XG5cbiAgLyoqIEFwcGxpZXMgQ1NTIGNsYXNzZXMgaW5kaWNhdGluZyBoaWdoLWNvbnRyYXN0IG1vZGUgdG8gZG9jdW1lbnQgYm9keSAoYnJvd3Nlci1vbmx5KS4gKi9cbiAgX2FwcGx5Qm9keUhpZ2hDb250cmFzdE1vZGVDc3NDbGFzc2VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faGFzQ2hlY2tlZEhpZ2hDb250cmFzdE1vZGUgJiYgdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyICYmIHRoaXMuX2RvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNvbnN0IGJvZHlDbGFzc2VzID0gdGhpcy5fZG9jdW1lbnQuYm9keS5jbGFzc0xpc3Q7XG4gICAgICAvLyBJRTExIGRvZXNuJ3Qgc3VwcG9ydCBgY2xhc3NMaXN0YCBvcGVyYXRpb25zIHdpdGggbXVsdGlwbGUgYXJndW1lbnRzXG4gICAgICBib2R5Q2xhc3Nlcy5yZW1vdmUoSElHSF9DT05UUkFTVF9NT0RFX0FDVElWRV9DU1NfQ0xBU1MpO1xuICAgICAgYm9keUNsYXNzZXMucmVtb3ZlKEJMQUNLX09OX1dISVRFX0NTU19DTEFTUyk7XG4gICAgICBib2R5Q2xhc3Nlcy5yZW1vdmUoV0hJVEVfT05fQkxBQ0tfQ1NTX0NMQVNTKTtcbiAgICAgIHRoaXMuX2hhc0NoZWNrZWRIaWdoQ29udHJhc3RNb2RlID0gdHJ1ZTtcblxuICAgICAgY29uc3QgbW9kZSA9IHRoaXMuZ2V0SGlnaENvbnRyYXN0TW9kZSgpO1xuICAgICAgaWYgKG1vZGUgPT09IEhpZ2hDb250cmFzdE1vZGUuQkxBQ0tfT05fV0hJVEUpIHtcbiAgICAgICAgYm9keUNsYXNzZXMuYWRkKEhJR0hfQ09OVFJBU1RfTU9ERV9BQ1RJVkVfQ1NTX0NMQVNTKTtcbiAgICAgICAgYm9keUNsYXNzZXMuYWRkKEJMQUNLX09OX1dISVRFX0NTU19DTEFTUyk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGUgPT09IEhpZ2hDb250cmFzdE1vZGUuV0hJVEVfT05fQkxBQ0spIHtcbiAgICAgICAgYm9keUNsYXNzZXMuYWRkKEhJR0hfQ09OVFJBU1RfTU9ERV9BQ1RJVkVfQ1NTX0NMQVNTKTtcbiAgICAgICAgYm9keUNsYXNzZXMuYWRkKFdISVRFX09OX0JMQUNLX0NTU19DTEFTUyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=