/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { OverlayContainer } from '../overlay-container';
import { FlexibleConnectedPositionStrategy, } from './flexible-connected-position-strategy';
import { GlobalPositionStrategy } from './global-position-strategy';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/platform";
import * as i3 from "../overlay-container";
/** Builder for overlay position strategy. */
export class OverlayPositionBuilder {
    constructor(_viewportRuler, _document, _platform, _overlayContainer) {
        this._viewportRuler = _viewportRuler;
        this._document = _document;
        this._platform = _platform;
        this._overlayContainer = _overlayContainer;
    }
    /**
     * Creates a global position strategy.
     */
    global() {
        return new GlobalPositionStrategy();
    }
    /**
     * Creates a flexible position strategy.
     * @param origin Origin relative to which to position the overlay.
     */
    flexibleConnectedTo(origin) {
        return new FlexibleConnectedPositionStrategy(origin, this._viewportRuler, this._document, this._platform, this._overlayContainer);
    }
}
OverlayPositionBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayPositionBuilder, deps: [{ token: i1.ViewportRuler }, { token: DOCUMENT }, { token: i2.Platform }, { token: i3.OverlayContainer }], target: i0.ɵɵFactoryTarget.Injectable });
OverlayPositionBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayPositionBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: OverlayPositionBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.ViewportRuler }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.Platform }, { type: i3.OverlayContainer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS1wb3NpdGlvbi1idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9vdmVybGF5L3Bvc2l0aW9uL292ZXJsYXktcG9zaXRpb24tYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQ0wsaUNBQWlDLEdBRWxDLE1BQU0sd0NBQXdDLENBQUM7QUFDaEQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sNEJBQTRCLENBQUM7Ozs7O0FBRWxFLDZDQUE2QztBQUU3QyxNQUFNLE9BQU8sc0JBQXNCO0lBQ2pDLFlBQ1UsY0FBNkIsRUFDWCxTQUFjLEVBQ2hDLFNBQW1CLEVBQ25CLGlCQUFtQztRQUhuQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUNYLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDaEMsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO0lBQzFDLENBQUM7SUFFSjs7T0FFRztJQUNILE1BQU07UUFDSixPQUFPLElBQUksc0JBQXNCLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsbUJBQW1CLENBQ2pCLE1BQStDO1FBRS9DLE9BQU8sSUFBSSxpQ0FBaUMsQ0FDMUMsTUFBTSxFQUNOLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLFNBQVMsRUFDZCxJQUFJLENBQUMsaUJBQWlCLENBQ3ZCLENBQUM7SUFDSixDQUFDOzttSEE3QlUsc0JBQXNCLCtDQUd2QixRQUFRO3VIQUhQLHNCQUFzQixjQURWLE1BQU07MkZBQ2xCLHNCQUFzQjtrQkFEbEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OzBCQUkzQixNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPdmVybGF5Q29udGFpbmVyfSBmcm9tICcuLi9vdmVybGF5LWNvbnRhaW5lcic7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneU9yaWdpbixcbn0gZnJvbSAnLi9mbGV4aWJsZS1jb25uZWN0ZWQtcG9zaXRpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHtHbG9iYWxQb3NpdGlvblN0cmF0ZWd5fSBmcm9tICcuL2dsb2JhbC1wb3NpdGlvbi1zdHJhdGVneSc7XG5cbi8qKiBCdWlsZGVyIGZvciBvdmVybGF5IHBvc2l0aW9uIHN0cmF0ZWd5LiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgT3ZlcmxheVBvc2l0aW9uQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBfb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZ2xvYmFsIHBvc2l0aW9uIHN0cmF0ZWd5LlxuICAgKi9cbiAgZ2xvYmFsKCk6IEdsb2JhbFBvc2l0aW9uU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgR2xvYmFsUG9zaXRpb25TdHJhdGVneSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmbGV4aWJsZSBwb3NpdGlvbiBzdHJhdGVneS5cbiAgICogQHBhcmFtIG9yaWdpbiBPcmlnaW4gcmVsYXRpdmUgdG8gd2hpY2ggdG8gcG9zaXRpb24gdGhlIG92ZXJsYXkuXG4gICAqL1xuICBmbGV4aWJsZUNvbm5lY3RlZFRvKFxuICAgIG9yaWdpbjogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luLFxuICApOiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kge1xuICAgIHJldHVybiBuZXcgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KFxuICAgICAgb3JpZ2luLFxuICAgICAgdGhpcy5fdmlld3BvcnRSdWxlcixcbiAgICAgIHRoaXMuX2RvY3VtZW50LFxuICAgICAgdGhpcy5fcGxhdGZvcm0sXG4gICAgICB0aGlzLl9vdmVybGF5Q29udGFpbmVyLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==