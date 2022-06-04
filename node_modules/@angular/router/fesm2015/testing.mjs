/**
 * @license Angular v13.3.10
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */

import { Location, LocationStrategy } from '@angular/common';
import { SpyLocation, MockLocationStrategy } from '@angular/common/testing';
import * as i0 from '@angular/core';
import { Compiler, Injector, Optional, NgModule } from '@angular/core';
import { Router, ɵflatten, ɵassignExtraOptionsToRouter, provideRoutes, ROUTER_CONFIGURATION, RouterModule, ɵROUTER_PROVIDERS, UrlSerializer, ChildrenOutletContexts, ROUTES, UrlHandlingStrategy, RouteReuseStrategy, PreloadingStrategy, NoPreloading } from '@angular/router';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This file exists to easily patch the SpyNgModuleFactoryLoader into g3
const EXTRA_ROUTER_TESTING_PROVIDERS = [];

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function isUrlHandlingStrategy(opts) {
    // This property check is needed because UrlHandlingStrategy is an interface and doesn't exist at
    // runtime.
    return 'shouldProcessUrl' in opts;
}
/**
 * Router setup factory function used for testing.
 *
 * @publicApi
 */
function setupTestingRouter(urlSerializer, contexts, location, compiler, injector, routes, opts, urlHandlingStrategy, routeReuseStrategy) {
    const router = new Router(null, urlSerializer, contexts, location, injector, compiler, ɵflatten(routes));
    if (opts) {
        // Handle deprecated argument ordering.
        if (isUrlHandlingStrategy(opts)) {
            router.urlHandlingStrategy = opts;
        }
        else {
            // Handle ExtraOptions
            ɵassignExtraOptionsToRouter(opts, router);
        }
    }
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    if (routeReuseStrategy) {
        router.routeReuseStrategy = routeReuseStrategy;
    }
    return router;
}
/**
 * @description
 *
 * Sets up the router to be used for testing.
 *
 * The modules sets up the router to be used for testing.
 * It provides spy implementations of `Location` and `LocationStrategy`.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * beforeEach(() => {
 *   TestBed.configureTestingModule({
 *     imports: [
 *       RouterTestingModule.withRoutes(
 *         [{path: '', component: BlankCmp}, {path: 'simple', component: SimpleCmp}]
 *       )
 *     ]
 *   });
 * });
 * ```
 *
 * @publicApi
 */
class RouterTestingModule {
    static withRoutes(routes, config) {
        return {
            ngModule: RouterTestingModule,
            providers: [
                provideRoutes(routes),
                { provide: ROUTER_CONFIGURATION, useValue: config ? config : {} },
            ]
        };
    }
}
RouterTestingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
RouterTestingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterTestingModule, exports: [RouterModule] });
RouterTestingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterTestingModule, providers: [
        ɵROUTER_PROVIDERS,
        EXTRA_ROUTER_TESTING_PROVIDERS,
        { provide: Location, useClass: SpyLocation },
        { provide: LocationStrategy, useClass: MockLocationStrategy },
        {
            provide: Router,
            useFactory: setupTestingRouter,
            deps: [
                UrlSerializer, ChildrenOutletContexts, Location, Compiler, Injector, ROUTES,
                ROUTER_CONFIGURATION, [UrlHandlingStrategy, new Optional()],
                [RouteReuseStrategy, new Optional()]
            ]
        },
        { provide: PreloadingStrategy, useExisting: NoPreloading },
        provideRoutes([]),
    ], imports: [RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [RouterModule],
                    providers: [
                        ɵROUTER_PROVIDERS,
                        EXTRA_ROUTER_TESTING_PROVIDERS,
                        { provide: Location, useClass: SpyLocation },
                        { provide: LocationStrategy, useClass: MockLocationStrategy },
                        {
                            provide: Router,
                            useFactory: setupTestingRouter,
                            deps: [
                                UrlSerializer, ChildrenOutletContexts, Location, Compiler, Injector, ROUTES,
                                ROUTER_CONFIGURATION, [UrlHandlingStrategy, new Optional()],
                                [RouteReuseStrategy, new Optional()]
                            ]
                        },
                        { provide: PreloadingStrategy, useExisting: NoPreloading },
                        provideRoutes([]),
                    ]
                }]
        }] });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This file exists for easily patching SpyNgModuleFactoryLoader in g3
var spy_ng_module_factory_loader = {};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This file only reexports content of the `src` folder. Keep it that way.

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { RouterTestingModule, setupTestingRouter };
//# sourceMappingURL=testing.mjs.map
