/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpTestingController } from './api';
import { HttpClientTestingBackend } from './backend';
import * as i0 from "@angular/core";
/**
 * Configures `HttpClientTestingBackend` as the `HttpBackend` used by `HttpClient`.
 *
 * Inject `HttpTestingController` to expect and flush requests in your tests.
 *
 * @publicApi
 */
export class HttpClientTestingModule {
}
HttpClientTestingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpClientTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
HttpClientTestingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpClientTestingModule, imports: [HttpClientModule] });
HttpClientTestingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpClientTestingModule, providers: [
        HttpClientTestingBackend,
        { provide: HttpBackend, useExisting: HttpClientTestingBackend },
        { provide: HttpTestingController, useExisting: HttpClientTestingBackend },
    ], imports: [[
            HttpClientModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpClientTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        HttpClientModule,
                    ],
                    providers: [
                        HttpClientTestingBackend,
                        { provide: HttpBackend, useExisting: HttpClientTestingBackend },
                        { provide: HttpTestingController, useExisting: HttpClientTestingBackend },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdGluZy9zcmMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM1QyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxXQUFXLENBQUM7O0FBR25EOzs7Ozs7R0FNRztBQVdILE1BQU0sT0FBTyx1QkFBdUI7OytIQUF2Qix1QkFBdUI7Z0lBQXZCLHVCQUF1QixZQVJoQyxnQkFBZ0I7Z0lBUVAsdUJBQXVCLGFBTnZCO1FBQ1Qsd0JBQXdCO1FBQ3hCLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsd0JBQXdCLEVBQUM7UUFDN0QsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixFQUFDO0tBQ3hFLFlBUFE7WUFDUCxnQkFBZ0I7U0FDakI7c0dBT1UsdUJBQXVCO2tCQVZuQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxnQkFBZ0I7cUJBQ2pCO29CQUNELFNBQVMsRUFBRTt3QkFDVCx3QkFBd0I7d0JBQ3hCLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsd0JBQXdCLEVBQUM7d0JBQzdELEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBQztxQkFDeEU7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIdHRwQmFja2VuZCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SHR0cFRlc3RpbmdDb250cm9sbGVyfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge0h0dHBDbGllbnRUZXN0aW5nQmFja2VuZH0gZnJvbSAnLi9iYWNrZW5kJztcblxuXG4vKipcbiAqIENvbmZpZ3VyZXMgYEh0dHBDbGllbnRUZXN0aW5nQmFja2VuZGAgYXMgdGhlIGBIdHRwQmFja2VuZGAgdXNlZCBieSBgSHR0cENsaWVudGAuXG4gKlxuICogSW5qZWN0IGBIdHRwVGVzdGluZ0NvbnRyb2xsZXJgIHRvIGV4cGVjdCBhbmQgZmx1c2ggcmVxdWVzdHMgaW4geW91ciB0ZXN0cy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBIdHRwQ2xpZW50VGVzdGluZ0JhY2tlbmQsXG4gICAge3Byb3ZpZGU6IEh0dHBCYWNrZW5kLCB1c2VFeGlzdGluZzogSHR0cENsaWVudFRlc3RpbmdCYWNrZW5kfSxcbiAgICB7cHJvdmlkZTogSHR0cFRlc3RpbmdDb250cm9sbGVyLCB1c2VFeGlzdGluZzogSHR0cENsaWVudFRlc3RpbmdCYWNrZW5kfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgSHR0cENsaWVudFRlc3RpbmdNb2R1bGUge1xufVxuIl19