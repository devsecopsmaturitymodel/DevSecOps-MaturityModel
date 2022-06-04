/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Attribute, ChangeDetectorRef, ComponentFactoryResolver, Directive, EventEmitter, Output, ViewContainerRef, } from '@angular/core';
import { ChildrenOutletContexts } from '../router_outlet_context';
import { ActivatedRoute } from '../router_state';
import { PRIMARY_OUTLET } from '../shared';
import * as i0 from "@angular/core";
import * as i1 from "../router_outlet_context";
/**
 * @description
 *
 * Acts as a placeholder that Angular dynamically fills based on the current router state.
 *
 * Each outlet can have a unique name, determined by the optional `name` attribute.
 * The name cannot be set or changed dynamically. If not set, default value is "primary".
 *
 * ```
 * <router-outlet></router-outlet>
 * <router-outlet name='left'></router-outlet>
 * <router-outlet name='right'></router-outlet>
 * ```
 *
 * Named outlets can be the targets of secondary routes.
 * The `Route` object for a secondary route has an `outlet` property to identify the target outlet:
 *
 * `{path: <base-path>, component: <component>, outlet: <target_outlet_name>}`
 *
 * Using named outlets and secondary routes, you can target multiple outlets in
 * the same `RouterLink` directive.
 *
 * The router keeps track of separate branches in a navigation tree for each named outlet and
 * generates a representation of that tree in the URL.
 * The URL for a secondary route uses the following syntax to specify both the primary and secondary
 * routes at the same time:
 *
 * `http://base-path/primary-route-path(outlet-name:route-path)`
 *
 * A router outlet emits an activate event when a new component is instantiated,
 * deactivate event when a component is destroyed.
 * An attached event emits when the `RouteReuseStrategy` instructs the outlet to reattach the
 * subtree, and the detached event emits when the `RouteReuseStrategy` instructs the outlet to
 * detach the subtree.
 *
 * ```
 * <router-outlet
 *   (activate)='onActivate($event)'
 *   (deactivate)='onDeactivate($event)'
 *   (attach)='onAttach($event)'
 *   (detach)='onDetach($event)'></router-outlet>
 * ```
 *
 * @see [Routing tutorial](guide/router-tutorial-toh#named-outlets "Example of a named
 * outlet and secondary route configuration").
 * @see `RouterLink`
 * @see `Route`
 * @ngModule RouterModule
 *
 * @publicApi
 */
export class RouterOutlet {
    constructor(parentContexts, location, resolver, name, changeDetector) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.resolver = resolver;
        this.changeDetector = changeDetector;
        this.activated = null;
        this._activatedRoute = null;
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
        /**
         * Emits an attached component instance when the `RouteReuseStrategy` instructs to re-attach a
         * previously detached subtree.
         **/
        this.attachEvents = new EventEmitter();
        /**
         * Emits a detached component instance when the `RouteReuseStrategy` instructs to detach the
         * subtree.
         */
        this.detachEvents = new EventEmitter();
        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, this);
    }
    /** @nodoc */
    ngOnDestroy() {
        this.parentContexts.onChildOutletDestroyed(this.name);
    }
    /** @nodoc */
    ngOnInit() {
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            const context = this.parentContexts.getContext(this.name);
            if (context && context.route) {
                if (context.attachRef) {
                    // `attachRef` is populated when there is an existing component to mount
                    this.attach(context.attachRef, context.route);
                }
                else {
                    // otherwise the component defined in the configuration is created
                    this.activateWith(context.route, context.resolver || null);
                }
            }
        }
    }
    get isActivated() {
        return !!this.activated;
    }
    /**
     * @returns The currently activated component instance.
     * @throws An error if the outlet is not activated.
     */
    get component() {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        return this.activated.instance;
    }
    get activatedRoute() {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        return this._activatedRoute;
    }
    get activatedRouteData() {
        if (this._activatedRoute) {
            return this._activatedRoute.snapshot.data;
        }
        return {};
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach() {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        this.location.detach();
        const cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        this.detachEvents.emit(cmp.instance);
        return cmp;
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    attach(ref, activatedRoute) {
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
        this.attachEvents.emit(ref.instance);
    }
    deactivate() {
        if (this.activated) {
            const c = this.component;
            this.activated.destroy();
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    }
    activateWith(activatedRoute, resolver) {
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        const snapshot = activatedRoute._futureSnapshot;
        const component = snapshot.routeConfig.component;
        resolver = resolver || this.resolver;
        const factory = resolver.resolveComponentFactory(component);
        const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
        this.activated = this.location.createComponent(factory, this.location.length, injector);
        // Calling `markForCheck` to make sure we will run the change detection when the
        // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
        this.changeDetector.markForCheck();
        this.activateEvents.emit(this.activated.instance);
    }
}
RouterOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterOutlet, deps: [{ token: i1.ChildrenOutletContexts }, { token: i0.ViewContainerRef }, { token: i0.ComponentFactoryResolver }, { token: 'name', attribute: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
RouterOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: RouterOutlet, selector: "router-outlet", outputs: { activateEvents: "activate", deactivateEvents: "deactivate", attachEvents: "attach", detachEvents: "detach" }, exportAs: ["outlet"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: RouterOutlet, decorators: [{
            type: Directive,
            args: [{ selector: 'router-outlet', exportAs: 'outlet' }]
        }], ctorParameters: function () { return [{ type: i1.ChildrenOutletContexts }, { type: i0.ViewContainerRef }, { type: i0.ComponentFactoryResolver }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['name']
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { activateEvents: [{
                type: Output,
                args: ['activate']
            }], deactivateEvents: [{
                type: Output,
                args: ['deactivate']
            }], attachEvents: [{
                type: Output,
                args: ['attach']
            }], detachEvents: [{
                type: Output,
                args: ['detach']
            }] } });
class OutletInjector {
    constructor(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    get(token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        return this.parent.get(token, notFoundValue);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX291dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3JvdXRlci9zcmMvZGlyZWN0aXZlcy9yb3V0ZXJfb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQStCLE1BQU0sRUFBRSxnQkFBZ0IsR0FBRSxNQUFNLGVBQWUsQ0FBQztBQUdwTCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7O0FBcUZ6Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrREc7QUFFSCxNQUFNLE9BQU8sWUFBWTtJQWtCdkIsWUFDWSxjQUFzQyxFQUFVLFFBQTBCLEVBQzFFLFFBQWtDLEVBQXFCLElBQVksRUFDbkUsY0FBaUM7UUFGakMsbUJBQWMsR0FBZCxjQUFjLENBQXdCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7UUFDMUUsYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFDbEMsbUJBQWMsR0FBZCxjQUFjLENBQW1CO1FBcEJyQyxjQUFTLEdBQTJCLElBQUksQ0FBQztRQUN6QyxvQkFBZSxHQUF3QixJQUFJLENBQUM7UUFHaEMsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3ZDLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDakU7OztZQUdJO1FBQ2MsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQzdEOzs7V0FHRztRQUNlLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQU0zRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxjQUFjLENBQUM7UUFDbkMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELGFBQWE7SUFDYixXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELGFBQWE7SUFDYixRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsNkZBQTZGO1lBQzdGLHVEQUF1RDtZQUN2RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDNUIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO29CQUNyQix3RUFBd0U7b0JBQ3hFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQy9DO3FCQUFNO29CQUNMLGtFQUFrRTtvQkFDbEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUM7aUJBQzVEO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLFNBQVM7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDaEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUNoRSxPQUFPLElBQUksQ0FBQyxlQUFpQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLGtCQUFrQjtRQUNwQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7U0FDM0M7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU07UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxHQUFzQixFQUFFLGNBQThCO1FBQzNELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQsWUFBWSxDQUFDLGNBQThCLEVBQUUsUUFBdUM7UUFDbEYsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztTQUNoRTtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxlQUFlLENBQUM7UUFDaEQsTUFBTSxTQUFTLEdBQVEsUUFBUSxDQUFDLFdBQVksQ0FBQyxTQUFTLENBQUM7UUFDdkQsUUFBUSxHQUFHLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDakYsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hGLGdGQUFnRjtRQUNoRix5RUFBeUU7UUFDekUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7O29IQTNIVSxZQUFZLGdJQW9Cb0MsTUFBTTt3R0FwQnRELFlBQVk7c0dBQVosWUFBWTtrQkFEeEIsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQzs7MEJBcUJQLFNBQVM7MkJBQUMsTUFBTTs0RUFmN0MsY0FBYztzQkFBakMsTUFBTTt1QkFBQyxVQUFVO2dCQUNJLGdCQUFnQjtzQkFBckMsTUFBTTt1QkFBQyxZQUFZO2dCQUtGLFlBQVk7c0JBQTdCLE1BQU07dUJBQUMsUUFBUTtnQkFLRSxZQUFZO3NCQUE3QixNQUFNO3VCQUFDLFFBQVE7O0FBOEdsQixNQUFNLGNBQWM7SUFDbEIsWUFDWSxLQUFxQixFQUFVLGFBQXFDLEVBQ3BFLE1BQWdCO1FBRGhCLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQXdCO1FBQ3BFLFdBQU0sR0FBTixNQUFNLENBQVU7SUFBRyxDQUFDO0lBRWhDLEdBQUcsQ0FBQyxLQUFVLEVBQUUsYUFBbUI7UUFDakMsSUFBSSxLQUFLLEtBQUssY0FBYyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQjtRQUVELElBQUksS0FBSyxLQUFLLHNCQUFzQixFQUFFO1lBQ3BDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUMzQjtRQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0F0dHJpYnV0ZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgQ29tcG9uZW50UmVmLCBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFZpZXdDb250YWluZXJSZWYsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtEYXRhfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtDaGlsZHJlbk91dGxldENvbnRleHRzfSBmcm9tICcuLi9yb3V0ZXJfb3V0bGV0X2NvbnRleHQnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZX0gZnJvbSAnLi4vcm91dGVyX3N0YXRlJztcbmltcG9ydCB7UFJJTUFSWV9PVVRMRVR9IGZyb20gJy4uL3NoYXJlZCc7XG5cbi8qKlxuICogQW4gaW50ZXJmYWNlIHRoYXQgZGVmaW5lcyB0aGUgY29udHJhY3QgZm9yIGRldmVsb3BpbmcgYSBjb21wb25lbnQgb3V0bGV0IGZvciB0aGUgYFJvdXRlcmAuXG4gKlxuICogQW4gb3V0bGV0IGFjdHMgYXMgYSBwbGFjZWhvbGRlciB0aGF0IEFuZ3VsYXIgZHluYW1pY2FsbHkgZmlsbHMgYmFzZWQgb24gdGhlIGN1cnJlbnQgcm91dGVyIHN0YXRlLlxuICpcbiAqIEEgcm91dGVyIG91dGxldCBzaG91bGQgcmVnaXN0ZXIgaXRzZWxmIHdpdGggdGhlIGBSb3V0ZXJgIHZpYVxuICogYENoaWxkcmVuT3V0bGV0Q29udGV4dHMjb25DaGlsZE91dGxldENyZWF0ZWRgIGFuZCB1bnJlZ2lzdGVyIHdpdGhcbiAqIGBDaGlsZHJlbk91dGxldENvbnRleHRzI29uQ2hpbGRPdXRsZXREZXN0cm95ZWRgLiBXaGVuIHRoZSBgUm91dGVyYCBpZGVudGlmaWVzIGEgbWF0Y2hlZCBgUm91dGVgLFxuICogaXQgbG9va3MgZm9yIGEgcmVnaXN0ZXJlZCBvdXRsZXQgaW4gdGhlIGBDaGlsZHJlbk91dGxldENvbnRleHRzYCBhbmQgYWN0aXZhdGVzIGl0LlxuICpcbiAqIEBzZWUgYENoaWxkcmVuT3V0bGV0Q29udGV4dHNgXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUm91dGVyT3V0bGV0Q29udHJhY3Qge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgZ2l2ZW4gb3V0bGV0IGlzIGFjdGl2YXRlZC5cbiAgICpcbiAgICogQW4gb3V0bGV0IGlzIGNvbnNpZGVyZWQgXCJhY3RpdmF0ZWRcIiBpZiBpdCBoYXMgYW4gYWN0aXZlIGNvbXBvbmVudC5cbiAgICovXG4gIGlzQWN0aXZhdGVkOiBib29sZWFuO1xuXG4gIC8qKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIGFjdGl2YXRlZCBjb21wb25lbnQgb3IgYG51bGxgIGlmIHRoZSBvdXRsZXQgaXMgbm90IGFjdGl2YXRlZC4gKi9cbiAgY29tcG9uZW50OiBPYmplY3R8bnVsbDtcblxuICAvKipcbiAgICogVGhlIGBEYXRhYCBvZiB0aGUgYEFjdGl2YXRlZFJvdXRlYCBzbmFwc2hvdC5cbiAgICovXG4gIGFjdGl2YXRlZFJvdXRlRGF0YTogRGF0YTtcblxuICAvKipcbiAgICogVGhlIGBBY3RpdmF0ZWRSb3V0ZWAgZm9yIHRoZSBvdXRsZXQgb3IgYG51bGxgIGlmIHRoZSBvdXRsZXQgaXMgbm90IGFjdGl2YXRlZC5cbiAgICovXG4gIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZXxudWxsO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIGBSb3V0ZXJgIHdoZW4gdGhlIG91dGxldCBzaG91bGQgYWN0aXZhdGUgKGNyZWF0ZSBhIGNvbXBvbmVudCkuXG4gICAqL1xuICBhY3RpdmF0ZVdpdGgoYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyfG51bGwpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBIHJlcXVlc3QgdG8gZGVzdHJveSB0aGUgY3VycmVudGx5IGFjdGl2YXRlZCBjb21wb25lbnQuXG4gICAqXG4gICAqIFdoZW4gYSBgUm91dGVSZXVzZVN0cmF0ZWd5YCBpbmRpY2F0ZXMgdGhhdCBhbiBgQWN0aXZhdGVkUm91dGVgIHNob3VsZCBiZSByZW1vdmVkIGJ1dCBzdG9yZWQgZm9yXG4gICAqIGxhdGVyIHJlLXVzZSByYXRoZXIgdGhhbiBkZXN0cm95ZWQsIHRoZSBgUm91dGVyYCB3aWxsIGNhbGwgYGRldGFjaGAgaW5zdGVhZC5cbiAgICovXG4gIGRlYWN0aXZhdGUoKTogdm9pZDtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0byBkZXRhY2ggdGhlIHN1YnRyZWUuXG4gICAqXG4gICAqIFRoaXMgaXMgc2ltaWxhciB0byBgZGVhY3RpdmF0ZWAsIGJ1dCB0aGUgYWN0aXZhdGVkIGNvbXBvbmVudCBzaG91bGQgX25vdF8gYmUgZGVzdHJveWVkLlxuICAgKiBJbnN0ZWFkLCBpdCBpcyByZXR1cm5lZCBzbyB0aGF0IGl0IGNhbiBiZSByZWF0dGFjaGVkIGxhdGVyIHZpYSB0aGUgYGF0dGFjaGAgbWV0aG9kLlxuICAgKi9cbiAgZGV0YWNoKCk6IENvbXBvbmVudFJlZjx1bmtub3duPjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0byByZS1hdHRhY2ggYSBwcmV2aW91c2x5IGRldGFjaGVkIHN1YnRyZWUuXG4gICAqL1xuICBhdHRhY2gocmVmOiBDb21wb25lbnRSZWY8dW5rbm93bj4sIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGFjdGl2YXRlIGV2ZW50IHdoZW4gYSBuZXcgY29tcG9uZW50IGlzIGluc3RhbnRpYXRlZFxuICAgKiovXG4gIGFjdGl2YXRlRXZlbnRzPzogRXZlbnRFbWl0dGVyPHVua25vd24+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhIGRlYWN0aXZhdGUgZXZlbnQgd2hlbiBhIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBkZWFjdGl2YXRlRXZlbnRzPzogRXZlbnRFbWl0dGVyPHVua25vd24+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBhdHRhY2hlZCBjb21wb25lbnQgaW5zdGFuY2Ugd2hlbiB0aGUgYFJvdXRlUmV1c2VTdHJhdGVneWAgaW5zdHJ1Y3RzIHRvIHJlLWF0dGFjaCBhXG4gICAqIHByZXZpb3VzbHkgZGV0YWNoZWQgc3VidHJlZS5cbiAgICoqL1xuICBhdHRhY2hFdmVudHM/OiBFdmVudEVtaXR0ZXI8dW5rbm93bj47XG5cbiAgLyoqXG4gICAqIEVtaXRzIGEgZGV0YWNoZWQgY29tcG9uZW50IGluc3RhbmNlIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0byBkZXRhY2ggdGhlXG4gICAqIHN1YnRyZWUuXG4gICAqL1xuICBkZXRhY2hFdmVudHM/OiBFdmVudEVtaXR0ZXI8dW5rbm93bj47XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQWN0cyBhcyBhIHBsYWNlaG9sZGVyIHRoYXQgQW5ndWxhciBkeW5hbWljYWxseSBmaWxscyBiYXNlZCBvbiB0aGUgY3VycmVudCByb3V0ZXIgc3RhdGUuXG4gKlxuICogRWFjaCBvdXRsZXQgY2FuIGhhdmUgYSB1bmlxdWUgbmFtZSwgZGV0ZXJtaW5lZCBieSB0aGUgb3B0aW9uYWwgYG5hbWVgIGF0dHJpYnV0ZS5cbiAqIFRoZSBuYW1lIGNhbm5vdCBiZSBzZXQgb3IgY2hhbmdlZCBkeW5hbWljYWxseS4gSWYgbm90IHNldCwgZGVmYXVsdCB2YWx1ZSBpcyBcInByaW1hcnlcIi5cbiAqXG4gKiBgYGBcbiAqIDxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD5cbiAqIDxyb3V0ZXItb3V0bGV0IG5hbWU9J2xlZnQnPjwvcm91dGVyLW91dGxldD5cbiAqIDxyb3V0ZXItb3V0bGV0IG5hbWU9J3JpZ2h0Jz48L3JvdXRlci1vdXRsZXQ+XG4gKiBgYGBcbiAqXG4gKiBOYW1lZCBvdXRsZXRzIGNhbiBiZSB0aGUgdGFyZ2V0cyBvZiBzZWNvbmRhcnkgcm91dGVzLlxuICogVGhlIGBSb3V0ZWAgb2JqZWN0IGZvciBhIHNlY29uZGFyeSByb3V0ZSBoYXMgYW4gYG91dGxldGAgcHJvcGVydHkgdG8gaWRlbnRpZnkgdGhlIHRhcmdldCBvdXRsZXQ6XG4gKlxuICogYHtwYXRoOiA8YmFzZS1wYXRoPiwgY29tcG9uZW50OiA8Y29tcG9uZW50Piwgb3V0bGV0OiA8dGFyZ2V0X291dGxldF9uYW1lPn1gXG4gKlxuICogVXNpbmcgbmFtZWQgb3V0bGV0cyBhbmQgc2Vjb25kYXJ5IHJvdXRlcywgeW91IGNhbiB0YXJnZXQgbXVsdGlwbGUgb3V0bGV0cyBpblxuICogdGhlIHNhbWUgYFJvdXRlckxpbmtgIGRpcmVjdGl2ZS5cbiAqXG4gKiBUaGUgcm91dGVyIGtlZXBzIHRyYWNrIG9mIHNlcGFyYXRlIGJyYW5jaGVzIGluIGEgbmF2aWdhdGlvbiB0cmVlIGZvciBlYWNoIG5hbWVkIG91dGxldCBhbmRcbiAqIGdlbmVyYXRlcyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoYXQgdHJlZSBpbiB0aGUgVVJMLlxuICogVGhlIFVSTCBmb3IgYSBzZWNvbmRhcnkgcm91dGUgdXNlcyB0aGUgZm9sbG93aW5nIHN5bnRheCB0byBzcGVjaWZ5IGJvdGggdGhlIHByaW1hcnkgYW5kIHNlY29uZGFyeVxuICogcm91dGVzIGF0IHRoZSBzYW1lIHRpbWU6XG4gKlxuICogYGh0dHA6Ly9iYXNlLXBhdGgvcHJpbWFyeS1yb3V0ZS1wYXRoKG91dGxldC1uYW1lOnJvdXRlLXBhdGgpYFxuICpcbiAqIEEgcm91dGVyIG91dGxldCBlbWl0cyBhbiBhY3RpdmF0ZSBldmVudCB3aGVuIGEgbmV3IGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQsXG4gKiBkZWFjdGl2YXRlIGV2ZW50IHdoZW4gYSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICogQW4gYXR0YWNoZWQgZXZlbnQgZW1pdHMgd2hlbiB0aGUgYFJvdXRlUmV1c2VTdHJhdGVneWAgaW5zdHJ1Y3RzIHRoZSBvdXRsZXQgdG8gcmVhdHRhY2ggdGhlXG4gKiBzdWJ0cmVlLCBhbmQgdGhlIGRldGFjaGVkIGV2ZW50IGVtaXRzIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0aGUgb3V0bGV0IHRvXG4gKiBkZXRhY2ggdGhlIHN1YnRyZWUuXG4gKlxuICogYGBgXG4gKiA8cm91dGVyLW91dGxldFxuICogICAoYWN0aXZhdGUpPSdvbkFjdGl2YXRlKCRldmVudCknXG4gKiAgIChkZWFjdGl2YXRlKT0nb25EZWFjdGl2YXRlKCRldmVudCknXG4gKiAgIChhdHRhY2gpPSdvbkF0dGFjaCgkZXZlbnQpJ1xuICogICAoZGV0YWNoKT0nb25EZXRhY2goJGV2ZW50KSc+PC9yb3V0ZXItb3V0bGV0PlxuICogYGBgXG4gKlxuICogQHNlZSBbUm91dGluZyB0dXRvcmlhbF0oZ3VpZGUvcm91dGVyLXR1dG9yaWFsLXRvaCNuYW1lZC1vdXRsZXRzIFwiRXhhbXBsZSBvZiBhIG5hbWVkXG4gKiBvdXRsZXQgYW5kIHNlY29uZGFyeSByb3V0ZSBjb25maWd1cmF0aW9uXCIpLlxuICogQHNlZSBgUm91dGVyTGlua2BcbiAqIEBzZWUgYFJvdXRlYFxuICogQG5nTW9kdWxlIFJvdXRlck1vZHVsZVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdyb3V0ZXItb3V0bGV0JywgZXhwb3J0QXM6ICdvdXRsZXQnfSlcbmV4cG9ydCBjbGFzcyBSb3V0ZXJPdXRsZXQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCwgUm91dGVyT3V0bGV0Q29udHJhY3Qge1xuICBwcml2YXRlIGFjdGl2YXRlZDogQ29tcG9uZW50UmVmPGFueT58bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2FjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZXxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBuYW1lOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnYWN0aXZhdGUnKSBhY3RpdmF0ZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdkZWFjdGl2YXRlJykgZGVhY3RpdmF0ZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAvKipcbiAgICogRW1pdHMgYW4gYXR0YWNoZWQgY29tcG9uZW50IGluc3RhbmNlIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0byByZS1hdHRhY2ggYVxuICAgKiBwcmV2aW91c2x5IGRldGFjaGVkIHN1YnRyZWUuXG4gICAqKi9cbiAgQE91dHB1dCgnYXR0YWNoJykgYXR0YWNoRXZlbnRzID0gbmV3IEV2ZW50RW1pdHRlcjx1bmtub3duPigpO1xuICAvKipcbiAgICogRW1pdHMgYSBkZXRhY2hlZCBjb21wb25lbnQgaW5zdGFuY2Ugd2hlbiB0aGUgYFJvdXRlUmV1c2VTdHJhdGVneWAgaW5zdHJ1Y3RzIHRvIGRldGFjaCB0aGVcbiAgICogc3VidHJlZS5cbiAgICovXG4gIEBPdXRwdXQoJ2RldGFjaCcpIGRldGFjaEV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8dW5rbm93bj4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcGFyZW50Q29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMsIHByaXZhdGUgbG9jYXRpb246IFZpZXdDb250YWluZXJSZWYsXG4gICAgICBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIEBBdHRyaWJ1dGUoJ25hbWUnKSBuYW1lOiBzdHJpbmcsXG4gICAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMubmFtZSA9IG5hbWUgfHwgUFJJTUFSWV9PVVRMRVQ7XG4gICAgcGFyZW50Q29udGV4dHMub25DaGlsZE91dGxldENyZWF0ZWQodGhpcy5uYW1lLCB0aGlzKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnRDb250ZXh0cy5vbkNoaWxkT3V0bGV0RGVzdHJveWVkKHRoaXMubmFtZSk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIC8vIElmIHRoZSBvdXRsZXQgd2FzIG5vdCBpbnN0YW50aWF0ZWQgYXQgdGhlIHRpbWUgdGhlIHJvdXRlIGdvdCBhY3RpdmF0ZWQgd2UgbmVlZCB0byBwb3B1bGF0ZVxuICAgICAgLy8gdGhlIG91dGxldCB3aGVuIGl0IGlzIGluaXRpYWxpemVkIChpZSBpbnNpZGUgYSBOZ0lmKVxuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMucGFyZW50Q29udGV4dHMuZ2V0Q29udGV4dCh0aGlzLm5hbWUpO1xuICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5yb3V0ZSkge1xuICAgICAgICBpZiAoY29udGV4dC5hdHRhY2hSZWYpIHtcbiAgICAgICAgICAvLyBgYXR0YWNoUmVmYCBpcyBwb3B1bGF0ZWQgd2hlbiB0aGVyZSBpcyBhbiBleGlzdGluZyBjb21wb25lbnQgdG8gbW91bnRcbiAgICAgICAgICB0aGlzLmF0dGFjaChjb250ZXh0LmF0dGFjaFJlZiwgY29udGV4dC5yb3V0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBjb21wb25lbnQgZGVmaW5lZCBpbiB0aGUgY29uZmlndXJhdGlvbiBpcyBjcmVhdGVkXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZVdpdGgoY29udGV4dC5yb3V0ZSwgY29udGV4dC5yZXNvbHZlciB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBpc0FjdGl2YXRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmFjdGl2YXRlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBUaGUgY3VycmVudGx5IGFjdGl2YXRlZCBjb21wb25lbnQgaW5zdGFuY2UuXG4gICAqIEB0aHJvd3MgQW4gZXJyb3IgaWYgdGhlIG91dGxldCBpcyBub3QgYWN0aXZhdGVkLlxuICAgKi9cbiAgZ2V0IGNvbXBvbmVudCgpOiBPYmplY3Qge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHRocm93IG5ldyBFcnJvcignT3V0bGV0IGlzIG5vdCBhY3RpdmF0ZWQnKTtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmF0ZWQuaW5zdGFuY2U7XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkUm91dGUoKTogQWN0aXZhdGVkUm91dGUge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHRocm93IG5ldyBFcnJvcignT3V0bGV0IGlzIG5vdCBhY3RpdmF0ZWQnKTtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVkUm91dGUgYXMgQWN0aXZhdGVkUm91dGU7XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkUm91dGVEYXRhKCk6IERhdGEge1xuICAgIGlmICh0aGlzLl9hY3RpdmF0ZWRSb3V0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2YXRlZFJvdXRlLnNuYXBzaG90LmRhdGE7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYFJvdXRlUmV1c2VTdHJhdGVneWAgaW5zdHJ1Y3RzIHRvIGRldGFjaCB0aGUgc3VidHJlZVxuICAgKi9cbiAgZGV0YWNoKCk6IENvbXBvbmVudFJlZjxhbnk+IHtcbiAgICBpZiAoIXRoaXMuYWN0aXZhdGVkKSB0aHJvdyBuZXcgRXJyb3IoJ091dGxldCBpcyBub3QgYWN0aXZhdGVkJyk7XG4gICAgdGhpcy5sb2NhdGlvbi5kZXRhY2goKTtcbiAgICBjb25zdCBjbXAgPSB0aGlzLmFjdGl2YXRlZDtcbiAgICB0aGlzLmFjdGl2YXRlZCA9IG51bGw7XG4gICAgdGhpcy5fYWN0aXZhdGVkUm91dGUgPSBudWxsO1xuICAgIHRoaXMuZGV0YWNoRXZlbnRzLmVtaXQoY21wLmluc3RhbmNlKTtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgUm91dGVSZXVzZVN0cmF0ZWd5YCBpbnN0cnVjdHMgdG8gcmUtYXR0YWNoIGEgcHJldmlvdXNseSBkZXRhY2hlZCBzdWJ0cmVlXG4gICAqL1xuICBhdHRhY2gocmVmOiBDb21wb25lbnRSZWY8YW55PiwgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgdGhpcy5hY3RpdmF0ZWQgPSByZWY7XG4gICAgdGhpcy5fYWN0aXZhdGVkUm91dGUgPSBhY3RpdmF0ZWRSb3V0ZTtcbiAgICB0aGlzLmxvY2F0aW9uLmluc2VydChyZWYuaG9zdFZpZXcpO1xuICAgIHRoaXMuYXR0YWNoRXZlbnRzLmVtaXQocmVmLmluc3RhbmNlKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICBjb25zdCBjID0gdGhpcy5jb21wb25lbnQ7XG4gICAgICB0aGlzLmFjdGl2YXRlZC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IG51bGw7XG4gICAgICB0aGlzLl9hY3RpdmF0ZWRSb3V0ZSA9IG51bGw7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVFdmVudHMuZW1pdChjKTtcbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZVdpdGgoYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyfG51bGwpIHtcbiAgICBpZiAodGhpcy5pc0FjdGl2YXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWN0aXZhdGUgYW4gYWxyZWFkeSBhY3RpdmF0ZWQgb3V0bGV0Jyk7XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2YXRlZFJvdXRlID0gYWN0aXZhdGVkUm91dGU7XG4gICAgY29uc3Qgc25hcHNob3QgPSBhY3RpdmF0ZWRSb3V0ZS5fZnV0dXJlU25hcHNob3Q7XG4gICAgY29uc3QgY29tcG9uZW50ID0gPGFueT5zbmFwc2hvdC5yb3V0ZUNvbmZpZyEuY29tcG9uZW50O1xuICAgIHJlc29sdmVyID0gcmVzb2x2ZXIgfHwgdGhpcy5yZXNvbHZlcjtcbiAgICBjb25zdCBmYWN0b3J5ID0gcmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICBjb25zdCBjaGlsZENvbnRleHRzID0gdGhpcy5wYXJlbnRDb250ZXh0cy5nZXRPckNyZWF0ZUNvbnRleHQodGhpcy5uYW1lKS5jaGlsZHJlbjtcbiAgICBjb25zdCBpbmplY3RvciA9IG5ldyBPdXRsZXRJbmplY3RvcihhY3RpdmF0ZWRSb3V0ZSwgY2hpbGRDb250ZXh0cywgdGhpcy5sb2NhdGlvbi5pbmplY3Rvcik7XG4gICAgdGhpcy5hY3RpdmF0ZWQgPSB0aGlzLmxvY2F0aW9uLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5LCB0aGlzLmxvY2F0aW9uLmxlbmd0aCwgaW5qZWN0b3IpO1xuICAgIC8vIENhbGxpbmcgYG1hcmtGb3JDaGVja2AgdG8gbWFrZSBzdXJlIHdlIHdpbGwgcnVuIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW4gdGhlXG4gICAgLy8gYFJvdXRlck91dGxldGAgaXMgaW5zaWRlIGEgYENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaGAgY29tcG9uZW50LlxuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5hY3RpdmF0ZUV2ZW50cy5lbWl0KHRoaXMuYWN0aXZhdGVkLmluc3RhbmNlKTtcbiAgfVxufVxuXG5jbGFzcyBPdXRsZXRJbmplY3RvciBpbXBsZW1lbnRzIEluamVjdG9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSBjaGlsZENvbnRleHRzOiBDaGlsZHJlbk91dGxldENvbnRleHRzLFxuICAgICAgcHJpdmF0ZSBwYXJlbnQ6IEluamVjdG9yKSB7fVxuXG4gIGdldCh0b2tlbjogYW55LCBub3RGb3VuZFZhbHVlPzogYW55KTogYW55IHtcbiAgICBpZiAodG9rZW4gPT09IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5yb3V0ZTtcbiAgICB9XG5cbiAgICBpZiAodG9rZW4gPT09IENoaWxkcmVuT3V0bGV0Q29udGV4dHMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkQ29udGV4dHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyZW50LmdldCh0b2tlbiwgbm90Rm91bmRWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==