/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { BlockScrollStrategy } from './block-scroll-strategy';
import { CloseScrollStrategy } from './close-scroll-strategy';
import { NoopScrollStrategy } from './noop-scroll-strategy';
import { RepositionScrollStrategy, } from './reposition-scroll-strategy';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
/**
 * Options for how an overlay will handle scrolling.
 *
 * Users can provide a custom value for `ScrollStrategyOptions` to replace the default
 * behaviors. This class primarily acts as a factory for ScrollStrategy instances.
 */
export class ScrollStrategyOptions {
    constructor(_scrollDispatcher, _viewportRuler, _ngZone, document) {
        this._scrollDispatcher = _scrollDispatcher;
        this._viewportRuler = _viewportRuler;
        this._ngZone = _ngZone;
        /** Do nothing on scroll. */
        this.noop = () => new NoopScrollStrategy();
        /**
         * Close the overlay as soon as the user scrolls.
         * @param config Configuration to be used inside the scroll strategy.
         */
        this.close = (config) => new CloseScrollStrategy(this._scrollDispatcher, this._ngZone, this._viewportRuler, config);
        /** Block scrolling. */
        this.block = () => new BlockScrollStrategy(this._viewportRuler, this._document);
        /**
         * Update the overlay's position on scroll.
         * @param config Configuration to be used inside the scroll strategy.
         * Allows debouncing the reposition calls.
         */
        this.reposition = (config) => new RepositionScrollStrategy(this._scrollDispatcher, this._viewportRuler, this._ngZone, config);
        this._document = document;
    }
}
ScrollStrategyOptions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollStrategyOptions, deps: [{ token: i1.ScrollDispatcher }, { token: i1.ViewportRuler }, { token: i0.NgZone }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ScrollStrategyOptions.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollStrategyOptions, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollStrategyOptions, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.ScrollDispatcher }, { type: i1.ViewportRuler }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXN0cmF0ZWd5LW9wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL292ZXJsYXkvc2Nyb2xsL3Njcm9sbC1zdHJhdGVneS1vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxtQkFBbUIsRUFBNEIsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQ0wsd0JBQXdCLEdBRXpCLE1BQU0sOEJBQThCLENBQUM7OztBQUV0Qzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFDVSxpQkFBbUMsRUFDbkMsY0FBNkIsRUFDN0IsT0FBZSxFQUNMLFFBQWE7UUFIdkIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUNuQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBTXpCLDRCQUE0QjtRQUM1QixTQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBRXRDOzs7V0FHRztRQUNILFVBQUssR0FBRyxDQUFDLE1BQWtDLEVBQUUsRUFBRSxDQUM3QyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFN0YsdUJBQXVCO1FBQ3ZCLFVBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTNFOzs7O1dBSUc7UUFDSCxlQUFVLEdBQUcsQ0FBQyxNQUF1QyxFQUFFLEVBQUUsQ0FDdkQsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBdEJoRyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUM1QixDQUFDOztrSEFWVSxxQkFBcUIscUdBT3RCLFFBQVE7c0hBUFAscUJBQXFCLGNBRFQsTUFBTTsyRkFDbEIscUJBQXFCO2tCQURqQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7MEJBUTNCLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1Njcm9sbERpc3BhdGNoZXIsIFZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCbG9ja1Njcm9sbFN0cmF0ZWd5fSBmcm9tICcuL2Jsb2NrLXNjcm9sbC1zdHJhdGVneSc7XG5pbXBvcnQge0Nsb3NlU2Nyb2xsU3RyYXRlZ3ksIENsb3NlU2Nyb2xsU3RyYXRlZ3lDb25maWd9IGZyb20gJy4vY2xvc2Utc2Nyb2xsLXN0cmF0ZWd5JztcbmltcG9ydCB7Tm9vcFNjcm9sbFN0cmF0ZWd5fSBmcm9tICcuL25vb3Atc2Nyb2xsLXN0cmF0ZWd5JztcbmltcG9ydCB7XG4gIFJlcG9zaXRpb25TY3JvbGxTdHJhdGVneSxcbiAgUmVwb3NpdGlvblNjcm9sbFN0cmF0ZWd5Q29uZmlnLFxufSBmcm9tICcuL3JlcG9zaXRpb24tc2Nyb2xsLXN0cmF0ZWd5JztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBob3cgYW4gb3ZlcmxheSB3aWxsIGhhbmRsZSBzY3JvbGxpbmcuXG4gKlxuICogVXNlcnMgY2FuIHByb3ZpZGUgYSBjdXN0b20gdmFsdWUgZm9yIGBTY3JvbGxTdHJhdGVneU9wdGlvbnNgIHRvIHJlcGxhY2UgdGhlIGRlZmF1bHRcbiAqIGJlaGF2aW9ycy4gVGhpcyBjbGFzcyBwcmltYXJpbHkgYWN0cyBhcyBhIGZhY3RvcnkgZm9yIFNjcm9sbFN0cmF0ZWd5IGluc3RhbmNlcy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgU2Nyb2xsU3RyYXRlZ3lPcHRpb25zIHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3Njcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LFxuICApIHtcbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgLyoqIERvIG5vdGhpbmcgb24gc2Nyb2xsLiAqL1xuICBub29wID0gKCkgPT4gbmV3IE5vb3BTY3JvbGxTdHJhdGVneSgpO1xuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgb3ZlcmxheSBhcyBzb29uIGFzIHRoZSB1c2VyIHNjcm9sbHMuXG4gICAqIEBwYXJhbSBjb25maWcgQ29uZmlndXJhdGlvbiB0byBiZSB1c2VkIGluc2lkZSB0aGUgc2Nyb2xsIHN0cmF0ZWd5LlxuICAgKi9cbiAgY2xvc2UgPSAoY29uZmlnPzogQ2xvc2VTY3JvbGxTdHJhdGVneUNvbmZpZykgPT5cbiAgICBuZXcgQ2xvc2VTY3JvbGxTdHJhdGVneSh0aGlzLl9zY3JvbGxEaXNwYXRjaGVyLCB0aGlzLl9uZ1pvbmUsIHRoaXMuX3ZpZXdwb3J0UnVsZXIsIGNvbmZpZyk7XG5cbiAgLyoqIEJsb2NrIHNjcm9sbGluZy4gKi9cbiAgYmxvY2sgPSAoKSA9PiBuZXcgQmxvY2tTY3JvbGxTdHJhdGVneSh0aGlzLl92aWV3cG9ydFJ1bGVyLCB0aGlzLl9kb2N1bWVudCk7XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgb3ZlcmxheSdzIHBvc2l0aW9uIG9uIHNjcm9sbC5cbiAgICogQHBhcmFtIGNvbmZpZyBDb25maWd1cmF0aW9uIHRvIGJlIHVzZWQgaW5zaWRlIHRoZSBzY3JvbGwgc3RyYXRlZ3kuXG4gICAqIEFsbG93cyBkZWJvdW5jaW5nIHRoZSByZXBvc2l0aW9uIGNhbGxzLlxuICAgKi9cbiAgcmVwb3NpdGlvbiA9IChjb25maWc/OiBSZXBvc2l0aW9uU2Nyb2xsU3RyYXRlZ3lDb25maWcpID0+XG4gICAgbmV3IFJlcG9zaXRpb25TY3JvbGxTdHJhdGVneSh0aGlzLl9zY3JvbGxEaXNwYXRjaGVyLCB0aGlzLl92aWV3cG9ydFJ1bGVyLCB0aGlzLl9uZ1pvbmUsIGNvbmZpZyk7XG59XG4iXX0=