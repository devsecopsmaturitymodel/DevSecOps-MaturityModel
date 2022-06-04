/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional, NgZone } from '@angular/core';
import { InteractivityChecker } from '../interactivity-checker/interactivity-checker';
import { ConfigurableFocusTrap } from './configurable-focus-trap';
import { FOCUS_TRAP_INERT_STRATEGY } from './focus-trap-inert-strategy';
import { EventListenerFocusTrapInertStrategy } from './event-listener-inert-strategy';
import { FocusTrapManager } from './focus-trap-manager';
import * as i0 from "@angular/core";
import * as i1 from "../interactivity-checker/interactivity-checker";
import * as i2 from "./focus-trap-manager";
/** Factory that allows easy instantiation of configurable focus traps. */
export class ConfigurableFocusTrapFactory {
    constructor(_checker, _ngZone, _focusTrapManager, _document, _inertStrategy) {
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._focusTrapManager = _focusTrapManager;
        this._document = _document;
        // TODO split up the strategies into different modules, similar to DateAdapter.
        this._inertStrategy = _inertStrategy || new EventListenerFocusTrapInertStrategy();
    }
    create(element, config = { defer: false }) {
        let configObject;
        if (typeof config === 'boolean') {
            configObject = { defer: config };
        }
        else {
            configObject = config;
        }
        return new ConfigurableFocusTrap(element, this._checker, this._ngZone, this._document, this._focusTrapManager, this._inertStrategy, configObject);
    }
}
ConfigurableFocusTrapFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurableFocusTrapFactory, deps: [{ token: i1.InteractivityChecker }, { token: i0.NgZone }, { token: i2.FocusTrapManager }, { token: DOCUMENT }, { token: FOCUS_TRAP_INERT_STRATEGY, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigurableFocusTrapFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurableFocusTrapFactory, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurableFocusTrapFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.InteractivityChecker }, { type: i0.NgZone }, { type: i2.FocusTrapManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [FOCUS_TRAP_INERT_STRATEGY]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhYmxlLWZvY3VzLXRyYXAtZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvYTExeS9mb2N1cy10cmFwL2NvbmZpZ3VyYWJsZS1mb2N1cy10cmFwLWZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDcEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFFaEUsT0FBTyxFQUFDLHlCQUF5QixFQUF5QixNQUFNLDZCQUE2QixDQUFDO0FBQzlGLE9BQU8sRUFBQyxtQ0FBbUMsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDOzs7O0FBRXRELDBFQUEwRTtBQUUxRSxNQUFNLE9BQU8sNEJBQTRCO0lBSXZDLFlBQ1UsUUFBOEIsRUFDOUIsT0FBZSxFQUNmLGlCQUFtQyxFQUN6QixTQUFjLEVBQ2UsY0FBdUM7UUFKOUUsYUFBUSxHQUFSLFFBQVEsQ0FBc0I7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFJM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsK0VBQStFO1FBQy9FLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLElBQUksbUNBQW1DLEVBQUUsQ0FBQztJQUNwRixDQUFDO0lBZ0JELE1BQU0sQ0FDSixPQUFvQixFQUNwQixTQUFnRCxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUM7UUFFOUQsSUFBSSxZQUF5QyxDQUFDO1FBQzlDLElBQUksT0FBTyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQy9CLFlBQVksR0FBRyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQztTQUNoQzthQUFNO1lBQ0wsWUFBWSxHQUFHLE1BQU0sQ0FBQztTQUN2QjtRQUNELE9BQU8sSUFBSSxxQkFBcUIsQ0FDOUIsT0FBTyxFQUNQLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsSUFBSSxDQUFDLGNBQWMsRUFDbkIsWUFBWSxDQUNiLENBQUM7SUFDSixDQUFDOzt5SEFqRFUsNEJBQTRCLDRHQVE3QixRQUFRLGFBQ0kseUJBQXlCOzZIQVRwQyw0QkFBNEIsY0FEaEIsTUFBTTsyRkFDbEIsNEJBQTRCO2tCQUR4QyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7MEJBUzNCLE1BQU07MkJBQUMsUUFBUTs7MEJBQ2YsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCwgTmdab25lfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SW50ZXJhY3Rpdml0eUNoZWNrZXJ9IGZyb20gJy4uL2ludGVyYWN0aXZpdHktY2hlY2tlci9pbnRlcmFjdGl2aXR5LWNoZWNrZXInO1xuaW1wb3J0IHtDb25maWd1cmFibGVGb2N1c1RyYXB9IGZyb20gJy4vY29uZmlndXJhYmxlLWZvY3VzLXRyYXAnO1xuaW1wb3J0IHtDb25maWd1cmFibGVGb2N1c1RyYXBDb25maWd9IGZyb20gJy4vY29uZmlndXJhYmxlLWZvY3VzLXRyYXAtY29uZmlnJztcbmltcG9ydCB7Rk9DVVNfVFJBUF9JTkVSVF9TVFJBVEVHWSwgRm9jdXNUcmFwSW5lcnRTdHJhdGVneX0gZnJvbSAnLi9mb2N1cy10cmFwLWluZXJ0LXN0cmF0ZWd5JztcbmltcG9ydCB7RXZlbnRMaXN0ZW5lckZvY3VzVHJhcEluZXJ0U3RyYXRlZ3l9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXItaW5lcnQtc3RyYXRlZ3knO1xuaW1wb3J0IHtGb2N1c1RyYXBNYW5hZ2VyfSBmcm9tICcuL2ZvY3VzLXRyYXAtbWFuYWdlcic7XG5cbi8qKiBGYWN0b3J5IHRoYXQgYWxsb3dzIGVhc3kgaW5zdGFudGlhdGlvbiBvZiBjb25maWd1cmFibGUgZm9jdXMgdHJhcHMuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBDb25maWd1cmFibGVGb2N1c1RyYXBGYWN0b3J5IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuICBwcml2YXRlIF9pbmVydFN0cmF0ZWd5OiBGb2N1c1RyYXBJbmVydFN0cmF0ZWd5O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoZWNrZXI6IEludGVyYWN0aXZpdHlDaGVja2VyLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2ZvY3VzVHJhcE1hbmFnZXI6IEZvY3VzVHJhcE1hbmFnZXIsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChGT0NVU19UUkFQX0lORVJUX1NUUkFURUdZKSBfaW5lcnRTdHJhdGVneT86IEZvY3VzVHJhcEluZXJ0U3RyYXRlZ3ksXG4gICkge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICAgIC8vIFRPRE8gc3BsaXQgdXAgdGhlIHN0cmF0ZWdpZXMgaW50byBkaWZmZXJlbnQgbW9kdWxlcywgc2ltaWxhciB0byBEYXRlQWRhcHRlci5cbiAgICB0aGlzLl9pbmVydFN0cmF0ZWd5ID0gX2luZXJ0U3RyYXRlZ3kgfHwgbmV3IEV2ZW50TGlzdGVuZXJGb2N1c1RyYXBJbmVydFN0cmF0ZWd5KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZvY3VzLXRyYXBwZWQgcmVnaW9uIGFyb3VuZCB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICogQHBhcmFtIGVsZW1lbnQgVGhlIGVsZW1lbnQgYXJvdW5kIHdoaWNoIGZvY3VzIHdpbGwgYmUgdHJhcHBlZC5cbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgZm9jdXMgdHJhcCBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyBUaGUgY3JlYXRlZCBmb2N1cyB0cmFwIGluc3RhbmNlLlxuICAgKi9cbiAgY3JlYXRlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjb25maWc/OiBDb25maWd1cmFibGVGb2N1c1RyYXBDb25maWcpOiBDb25maWd1cmFibGVGb2N1c1RyYXA7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFBhc3MgYSBjb25maWcgb2JqZWN0IGluc3RlYWQgb2YgdGhlIGBkZWZlckNhcHR1cmVFbGVtZW50c2AgZmxhZy5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAgICovXG4gIGNyZWF0ZShlbGVtZW50OiBIVE1MRWxlbWVudCwgZGVmZXJDYXB0dXJlRWxlbWVudHM6IGJvb2xlYW4pOiBDb25maWd1cmFibGVGb2N1c1RyYXA7XG5cbiAgY3JlYXRlKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIGNvbmZpZzogQ29uZmlndXJhYmxlRm9jdXNUcmFwQ29uZmlnIHwgYm9vbGVhbiA9IHtkZWZlcjogZmFsc2V9LFxuICApOiBDb25maWd1cmFibGVGb2N1c1RyYXAge1xuICAgIGxldCBjb25maWdPYmplY3Q6IENvbmZpZ3VyYWJsZUZvY3VzVHJhcENvbmZpZztcbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBjb25maWdPYmplY3QgPSB7ZGVmZXI6IGNvbmZpZ307XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpZ09iamVjdCA9IGNvbmZpZztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb25maWd1cmFibGVGb2N1c1RyYXAoXG4gICAgICBlbGVtZW50LFxuICAgICAgdGhpcy5fY2hlY2tlcixcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX2RvY3VtZW50LFxuICAgICAgdGhpcy5fZm9jdXNUcmFwTWFuYWdlcixcbiAgICAgIHRoaXMuX2luZXJ0U3RyYXRlZ3ksXG4gICAgICBjb25maWdPYmplY3QsXG4gICAgKTtcbiAgfVxufVxuIl19