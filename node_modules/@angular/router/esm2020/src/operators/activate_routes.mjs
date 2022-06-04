/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { map } from 'rxjs/operators';
import { ActivationEnd, ChildActivationEnd } from '../events';
import { advanceActivatedRoute } from '../router_state';
import { forEach } from '../utils/collection';
import { nodeChildrenAsMap } from '../utils/tree';
export const activateRoutes = (rootContexts, routeReuseStrategy, forwardEvent) => map(t => {
    new ActivateRoutes(routeReuseStrategy, t.targetRouterState, t.currentRouterState, forwardEvent)
        .activate(rootContexts);
    return t;
});
export class ActivateRoutes {
    constructor(routeReuseStrategy, futureState, currState, forwardEvent) {
        this.routeReuseStrategy = routeReuseStrategy;
        this.futureState = futureState;
        this.currState = currState;
        this.forwardEvent = forwardEvent;
    }
    activate(parentContexts) {
        const futureRoot = this.futureState._root;
        const currRoot = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
        advanceActivatedRoute(this.futureState.root);
        this.activateChildRoutes(futureRoot, currRoot, parentContexts);
    }
    // De-activate the child route that are not re-used for the future state
    deactivateChildRoutes(futureNode, currNode, contexts) {
        const children = nodeChildrenAsMap(currNode);
        // Recurse on the routes active in the future state to de-activate deeper children
        futureNode.children.forEach(futureChild => {
            const childOutletName = futureChild.value.outlet;
            this.deactivateRoutes(futureChild, children[childOutletName], contexts);
            delete children[childOutletName];
        });
        // De-activate the routes that will not be re-used
        forEach(children, (v, childName) => {
            this.deactivateRouteAndItsChildren(v, contexts);
        });
    }
    deactivateRoutes(futureNode, currNode, parentContext) {
        const future = futureNode.value;
        const curr = currNode ? currNode.value : null;
        if (future === curr) {
            // Reusing the node, check to see if the children need to be de-activated
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                const context = parentContext.getContext(future.outlet);
                if (context) {
                    this.deactivateChildRoutes(futureNode, currNode, context.children);
                }
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.deactivateChildRoutes(futureNode, currNode, parentContext);
            }
        }
        else {
            if (curr) {
                // Deactivate the current route which will not be re-used
                this.deactivateRouteAndItsChildren(currNode, parentContext);
            }
        }
    }
    deactivateRouteAndItsChildren(route, parentContexts) {
        // If there is no component, the Route is never attached to an outlet (because there is no
        // component to attach).
        if (route.value.component && this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
            this.detachAndStoreRouteSubtree(route, parentContexts);
        }
        else {
            this.deactivateRouteAndOutlet(route, parentContexts);
        }
    }
    detachAndStoreRouteSubtree(route, parentContexts) {
        const context = parentContexts.getContext(route.value.outlet);
        const contexts = context && route.value.component ? context.children : parentContexts;
        const children = nodeChildrenAsMap(route);
        for (const childOutlet of Object.keys(children)) {
            this.deactivateRouteAndItsChildren(children[childOutlet], contexts);
        }
        if (context && context.outlet) {
            const componentRef = context.outlet.detach();
            const contexts = context.children.onOutletDeactivated();
            this.routeReuseStrategy.store(route.value.snapshot, { componentRef, route, contexts });
        }
    }
    deactivateRouteAndOutlet(route, parentContexts) {
        const context = parentContexts.getContext(route.value.outlet);
        // The context could be `null` if we are on a componentless route but there may still be
        // children that need deactivating.
        const contexts = context && route.value.component ? context.children : parentContexts;
        const children = nodeChildrenAsMap(route);
        for (const childOutlet of Object.keys(children)) {
            this.deactivateRouteAndItsChildren(children[childOutlet], contexts);
        }
        if (context && context.outlet) {
            // Destroy the component
            context.outlet.deactivate();
            // Destroy the contexts for all the outlets that were in the component
            context.children.onOutletDeactivated();
            // Clear the information about the attached component on the context but keep the reference to
            // the outlet.
            context.attachRef = null;
            context.resolver = null;
            context.route = null;
        }
    }
    activateChildRoutes(futureNode, currNode, contexts) {
        const children = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(c => {
            this.activateRoutes(c, children[c.value.outlet], contexts);
            this.forwardEvent(new ActivationEnd(c.value.snapshot));
        });
        if (futureNode.children.length) {
            this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
        }
    }
    activateRoutes(futureNode, currNode, parentContexts) {
        const future = futureNode.value;
        const curr = currNode ? currNode.value : null;
        advanceActivatedRoute(future);
        // reusing the node
        if (future === curr) {
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                const context = parentContexts.getOrCreateContext(future.outlet);
                this.activateChildRoutes(futureNode, currNode, context.children);
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.activateChildRoutes(futureNode, currNode, parentContexts);
            }
        }
        else {
            if (future.component) {
                // if we have a normal route, we need to place the component into the outlet and recurse.
                const context = parentContexts.getOrCreateContext(future.outlet);
                if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
                    const stored = this.routeReuseStrategy.retrieve(future.snapshot);
                    this.routeReuseStrategy.store(future.snapshot, null);
                    context.children.onOutletReAttached(stored.contexts);
                    context.attachRef = stored.componentRef;
                    context.route = stored.route.value;
                    if (context.outlet) {
                        // Attach right away when the outlet has already been instantiated
                        // Otherwise attach from `RouterOutlet.ngOnInit` when it is instantiated
                        context.outlet.attach(stored.componentRef, stored.route.value);
                    }
                    advanceActivatedRoute(stored.route.value);
                    this.activateChildRoutes(futureNode, null, context.children);
                }
                else {
                    const config = parentLoadedConfig(future.snapshot);
                    const cmpFactoryResolver = config ? config.module.componentFactoryResolver : null;
                    context.attachRef = null;
                    context.route = future;
                    context.resolver = cmpFactoryResolver;
                    if (context.outlet) {
                        // Activate the outlet when it has already been instantiated
                        // Otherwise it will get activated from its `ngOnInit` when instantiated
                        context.outlet.activateWith(future, cmpFactoryResolver);
                    }
                    this.activateChildRoutes(futureNode, null, context.children);
                }
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.activateChildRoutes(futureNode, null, parentContexts);
            }
        }
    }
}
function parentLoadedConfig(snapshot) {
    for (let s = snapshot.parent; s; s = s.parent) {
        const route = s.routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
        if (route && route.component)
            return null;
    }
    return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZhdGVfcm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9vcGVyYXRvcnMvYWN0aXZhdGVfcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUduQyxPQUFPLEVBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFRLE1BQU0sV0FBVyxDQUFDO0FBSW5FLE9BQU8sRUFBeUMscUJBQXFCLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGlCQUFpQixFQUFXLE1BQU0sZUFBZSxDQUFDO0FBRTFELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FDdkIsQ0FBQyxZQUFvQyxFQUFFLGtCQUFzQyxFQUM1RSxZQUFrQyxFQUFrRCxFQUFFLENBQ25GLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNOLElBQUksY0FBYyxDQUNkLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxpQkFBa0IsRUFBRSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDO1NBQzVFLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1QixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQyxDQUFDO0FBRVgsTUFBTSxPQUFPLGNBQWM7SUFDekIsWUFDWSxrQkFBc0MsRUFBVSxXQUF3QixFQUN4RSxTQUFzQixFQUFVLFlBQWtDO1FBRGxFLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4RSxjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQXNCO0lBQUcsQ0FBQztJQUVsRixRQUFRLENBQUMsY0FBc0M7UUFDN0MsTUFBTSxV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QkFBa0IsQ0FBQyxDQUFDO3FCQUN6RDtvQkFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzlEO2FBQ0Y7aUJBQU07Z0JBQ0wsNkVBQTZFO2dCQUM3RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQzthQUM1RDtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxRQUFnQztJQUMxRCxLQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQzdDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDNUIsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLGFBQWE7WUFBRSxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDN0QsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFNBQVM7WUFBRSxPQUFPLElBQUksQ0FBQztLQUMzQztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0xvYWRlZFJvdXRlckNvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7QWN0aXZhdGlvbkVuZCwgQ2hpbGRBY3RpdmF0aW9uRW5kLCBFdmVudH0gZnJvbSAnLi4vZXZlbnRzJztcbmltcG9ydCB7RGV0YWNoZWRSb3V0ZUhhbmRsZUludGVybmFsLCBSb3V0ZVJldXNlU3RyYXRlZ3l9IGZyb20gJy4uL3JvdXRlX3JldXNlX3N0cmF0ZWd5JztcbmltcG9ydCB7TmF2aWdhdGlvblRyYW5zaXRpb259IGZyb20gJy4uL3JvdXRlcic7XG5pbXBvcnQge0NoaWxkcmVuT3V0bGV0Q29udGV4dHN9IGZyb20gJy4uL3JvdXRlcl9vdXRsZXRfY29udGV4dCc7XG5pbXBvcnQge0FjdGl2YXRlZFJvdXRlLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBhZHZhbmNlQWN0aXZhdGVkUm91dGUsIFJvdXRlclN0YXRlfSBmcm9tICcuLi9yb3V0ZXJfc3RhdGUnO1xuaW1wb3J0IHtmb3JFYWNofSBmcm9tICcuLi91dGlscy9jb2xsZWN0aW9uJztcbmltcG9ydCB7bm9kZUNoaWxkcmVuQXNNYXAsIFRyZWVOb2RlfSBmcm9tICcuLi91dGlscy90cmVlJztcblxuZXhwb3J0IGNvbnN0IGFjdGl2YXRlUm91dGVzID1cbiAgICAocm9vdENvbnRleHRzOiBDaGlsZHJlbk91dGxldENvbnRleHRzLCByb3V0ZVJldXNlU3RyYXRlZ3k6IFJvdXRlUmV1c2VTdHJhdGVneSxcbiAgICAgZm9yd2FyZEV2ZW50OiAoZXZ0OiBFdmVudCkgPT4gdm9pZCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxOYXZpZ2F0aW9uVHJhbnNpdGlvbj4gPT5cbiAgICAgICAgbWFwKHQgPT4ge1xuICAgICAgICAgIG5ldyBBY3RpdmF0ZVJvdXRlcyhcbiAgICAgICAgICAgICAgcm91dGVSZXVzZVN0cmF0ZWd5LCB0LnRhcmdldFJvdXRlclN0YXRlISwgdC5jdXJyZW50Um91dGVyU3RhdGUsIGZvcndhcmRFdmVudClcbiAgICAgICAgICAgICAgLmFjdGl2YXRlKHJvb3RDb250ZXh0cyk7XG4gICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgIH0pO1xuXG5leHBvcnQgY2xhc3MgQWN0aXZhdGVSb3V0ZXMge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcm91dGVSZXVzZVN0cmF0ZWd5OiBSb3V0ZVJldXNlU3RyYXRlZ3ksIHByaXZhdGUgZnV0dXJlU3RhdGU6IFJvdXRlclN0YXRlLFxuICAgICAgcHJpdmF0ZSBjdXJyU3RhdGU6IFJvdXRlclN0YXRlLCBwcml2YXRlIGZvcndhcmRFdmVudDogKGV2dDogRXZlbnQpID0+IHZvaWQpIHt9XG5cbiAgYWN0aXZhdGUocGFyZW50Q29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMpOiB2b2lkIHtcbiAgICBjb25zdCBmdXR1cmVSb290ID0gdGhpcy5mdXR1cmVTdGF0ZS5fcm9vdDtcbiAgICBjb25zdCBjdXJyUm9vdCA9IHRoaXMuY3VyclN0YXRlID8gdGhpcy5jdXJyU3RhdGUuX3Jvb3QgOiBudWxsO1xuXG4gICAgdGhpcy5kZWFjdGl2YXRlQ2hpbGRSb3V0ZXMoZnV0dXJlUm9vdCwgY3VyclJvb3QsIHBhcmVudENvbnRleHRzKTtcbiAgICBhZHZhbmNlQWN0aXZhdGVkUm91dGUodGhpcy5mdXR1cmVTdGF0ZS5yb290KTtcbiAgICB0aGlzLmFjdGl2YXRlQ2hpbGRSb3V0ZXMoZnV0dXJlUm9vdCwgY3VyclJvb3QsIHBhcmVudENvbnRleHRzKTtcbiAgfVxuXG4gIC8vIERlLWFjdGl2YXRlIHRoZSBjaGlsZCByb3V0ZSB0aGF0IGFyZSBub3QgcmUtdXNlZCBmb3IgdGhlIGZ1dHVyZSBzdGF0ZVxuICBwcml2YXRlIGRlYWN0aXZhdGVDaGlsZFJvdXRlcyhcbiAgICAgIGZ1dHVyZU5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPiwgY3Vyck5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPnxudWxsLFxuICAgICAgY29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMpOiB2b2lkIHtcbiAgICBjb25zdCBjaGlsZHJlbjoge1tvdXRsZXROYW1lOiBzdHJpbmddOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZT59ID0gbm9kZUNoaWxkcmVuQXNNYXAoY3Vyck5vZGUpO1xuXG4gICAgLy8gUmVjdXJzZSBvbiB0aGUgcm91dGVzIGFjdGl2ZSBpbiB0aGUgZnV0dXJlIHN0YXRlIHRvIGRlLWFjdGl2YXRlIGRlZXBlciBjaGlsZHJlblxuICAgIGZ1dHVyZU5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdXR1cmVDaGlsZCA9PiB7XG4gICAgICBjb25zdCBjaGlsZE91dGxldE5hbWUgPSBmdXR1cmVDaGlsZC52YWx1ZS5vdXRsZXQ7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVSb3V0ZXMoZnV0dXJlQ2hpbGQsIGNoaWxkcmVuW2NoaWxkT3V0bGV0TmFtZV0sIGNvbnRleHRzKTtcbiAgICAgIGRlbGV0ZSBjaGlsZHJlbltjaGlsZE91dGxldE5hbWVdO1xuICAgIH0pO1xuXG4gICAgLy8gRGUtYWN0aXZhdGUgdGhlIHJvdXRlcyB0aGF0IHdpbGwgbm90IGJlIHJlLXVzZWRcbiAgICBmb3JFYWNoKGNoaWxkcmVuLCAodjogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+LCBjaGlsZE5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlUm91dGVBbmRJdHNDaGlsZHJlbih2LCBjb250ZXh0cyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRlYWN0aXZhdGVSb3V0ZXMoXG4gICAgICBmdXR1cmVOb2RlOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZT4sIGN1cnJOb2RlOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZT4sXG4gICAgICBwYXJlbnRDb250ZXh0OiBDaGlsZHJlbk91dGxldENvbnRleHRzKTogdm9pZCB7XG4gICAgY29uc3QgZnV0dXJlID0gZnV0dXJlTm9kZS52YWx1ZTtcbiAgICBjb25zdCBjdXJyID0gY3Vyck5vZGUgPyBjdXJyTm9kZS52YWx1ZSA6IG51bGw7XG5cbiAgICBpZiAoZnV0dXJlID09PSBjdXJyKSB7XG4gICAgICAvLyBSZXVzaW5nIHRoZSBub2RlLCBjaGVjayB0byBzZWUgaWYgdGhlIGNoaWxkcmVuIG5lZWQgdG8gYmUgZGUtYWN0aXZhdGVkXG4gICAgICBpZiAoZnV0dXJlLmNvbXBvbmVudCkge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgbm9ybWFsIHJvdXRlLCB3ZSBuZWVkIHRvIGdvIHRocm91Z2ggYW4gb3V0bGV0LlxuICAgICAgICBjb25zdCBjb250ZXh0ID0gcGFyZW50Q29udGV4dC5nZXRDb250ZXh0KGZ1dHVyZS5vdXRsZXQpO1xuICAgICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIGN1cnJOb2RlLCBjb250ZXh0LmNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIGNvbXBvbmVudGxlc3Mgcm91dGUsIHdlIHJlY3Vyc2UgYnV0IGtlZXAgdGhlIHNhbWUgb3V0bGV0IG1hcC5cbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgY3Vyck5vZGUsIHBhcmVudENvbnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3Vycikge1xuICAgICAgICAvLyBEZWFjdGl2YXRlIHRoZSBjdXJyZW50IHJvdXRlIHdoaWNoIHdpbGwgbm90IGJlIHJlLXVzZWRcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm91dGVBbmRJdHNDaGlsZHJlbihjdXJyTm9kZSwgcGFyZW50Q29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZWFjdGl2YXRlUm91dGVBbmRJdHNDaGlsZHJlbihcbiAgICAgIHJvdXRlOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZT4sIHBhcmVudENvbnRleHRzOiBDaGlsZHJlbk91dGxldENvbnRleHRzKTogdm9pZCB7XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gY29tcG9uZW50LCB0aGUgUm91dGUgaXMgbmV2ZXIgYXR0YWNoZWQgdG8gYW4gb3V0bGV0IChiZWNhdXNlIHRoZXJlIGlzIG5vXG4gICAgLy8gY29tcG9uZW50IHRvIGF0dGFjaCkuXG4gICAgaWYgKHJvdXRlLnZhbHVlLmNvbXBvbmVudCAmJiB0aGlzLnJvdXRlUmV1c2VTdHJhdGVneS5zaG91bGREZXRhY2gocm91dGUudmFsdWUuc25hcHNob3QpKSB7XG4gICAgICB0aGlzLmRldGFjaEFuZFN0b3JlUm91dGVTdWJ0cmVlKHJvdXRlLCBwYXJlbnRDb250ZXh0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZVJvdXRlQW5kT3V0bGV0KHJvdXRlLCBwYXJlbnRDb250ZXh0cyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZXRhY2hBbmRTdG9yZVJvdXRlU3VidHJlZShcbiAgICAgIHJvdXRlOiBUcmVlTm9kZTxBY3RpdmF0ZWRSb3V0ZT4sIHBhcmVudENvbnRleHRzOiBDaGlsZHJlbk91dGxldENvbnRleHRzKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IHBhcmVudENvbnRleHRzLmdldENvbnRleHQocm91dGUudmFsdWUub3V0bGV0KTtcbiAgICBjb25zdCBjb250ZXh0cyA9IGNvbnRleHQgJiYgcm91dGUudmFsdWUuY29tcG9uZW50ID8gY29udGV4dC5jaGlsZHJlbiA6IHBhcmVudENvbnRleHRzO1xuICAgIGNvbnN0IGNoaWxkcmVuOiB7W291dGxldE5hbWU6IHN0cmluZ106IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPn0gPSBub2RlQ2hpbGRyZW5Bc01hcChyb3V0ZSk7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkT3V0bGV0IG9mIE9iamVjdC5rZXlzKGNoaWxkcmVuKSkge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlUm91dGVBbmRJdHNDaGlsZHJlbihjaGlsZHJlbltjaGlsZE91dGxldF0sIGNvbnRleHRzKTtcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0Lm91dGxldCkge1xuICAgICAgY29uc3QgY29tcG9uZW50UmVmID0gY29udGV4dC5vdXRsZXQuZGV0YWNoKCk7XG4gICAgICBjb25zdCBjb250ZXh0cyA9IGNvbnRleHQuY2hpbGRyZW4ub25PdXRsZXREZWFjdGl2YXRlZCgpO1xuICAgICAgdGhpcy5yb3V0ZVJldXNlU3RyYXRlZ3kuc3RvcmUocm91dGUudmFsdWUuc25hcHNob3QsIHtjb21wb25lbnRSZWYsIHJvdXRlLCBjb250ZXh0c30pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGVhY3RpdmF0ZVJvdXRlQW5kT3V0bGV0KFxuICAgICAgcm91dGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPiwgcGFyZW50Q29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0ID0gcGFyZW50Q29udGV4dHMuZ2V0Q29udGV4dChyb3V0ZS52YWx1ZS5vdXRsZXQpO1xuICAgIC8vIFRoZSBjb250ZXh0IGNvdWxkIGJlIGBudWxsYCBpZiB3ZSBhcmUgb24gYSBjb21wb25lbnRsZXNzIHJvdXRlIGJ1dCB0aGVyZSBtYXkgc3RpbGwgYmVcbiAgICAvLyBjaGlsZHJlbiB0aGF0IG5lZWQgZGVhY3RpdmF0aW5nLlxuICAgIGNvbnN0IGNvbnRleHRzID0gY29udGV4dCAmJiByb3V0ZS52YWx1ZS5jb21wb25lbnQgPyBjb250ZXh0LmNoaWxkcmVuIDogcGFyZW50Q29udGV4dHM7XG4gICAgY29uc3QgY2hpbGRyZW46IHtbb3V0bGV0TmFtZTogc3RyaW5nXTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+fSA9IG5vZGVDaGlsZHJlbkFzTWFwKHJvdXRlKTtcblxuICAgIGZvciAoY29uc3QgY2hpbGRPdXRsZXQgb2YgT2JqZWN0LmtleXMoY2hpbGRyZW4pKSB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVSb3V0ZUFuZEl0c0NoaWxkcmVuKGNoaWxkcmVuW2NoaWxkT3V0bGV0XSwgY29udGV4dHMpO1xuICAgIH1cblxuICAgIGlmIChjb250ZXh0ICYmIGNvbnRleHQub3V0bGV0KSB7XG4gICAgICAvLyBEZXN0cm95IHRoZSBjb21wb25lbnRcbiAgICAgIGNvbnRleHQub3V0bGV0LmRlYWN0aXZhdGUoKTtcbiAgICAgIC8vIERlc3Ryb3kgdGhlIGNvbnRleHRzIGZvciBhbGwgdGhlIG91dGxldHMgdGhhdCB3ZXJlIGluIHRoZSBjb21wb25lbnRcbiAgICAgIGNvbnRleHQuY2hpbGRyZW4ub25PdXRsZXREZWFjdGl2YXRlZCgpO1xuICAgICAgLy8gQ2xlYXIgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhdHRhY2hlZCBjb21wb25lbnQgb24gdGhlIGNvbnRleHQgYnV0IGtlZXAgdGhlIHJlZmVyZW5jZSB0b1xuICAgICAgLy8gdGhlIG91dGxldC5cbiAgICAgIGNvbnRleHQuYXR0YWNoUmVmID0gbnVsbDtcbiAgICAgIGNvbnRleHQucmVzb2x2ZXIgPSBudWxsO1xuICAgICAgY29udGV4dC5yb3V0ZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZUNoaWxkUm91dGVzKFxuICAgICAgZnV0dXJlTm9kZTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+LCBjdXJyTm9kZTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+fG51bGwsXG4gICAgICBjb250ZXh0czogQ2hpbGRyZW5PdXRsZXRDb250ZXh0cyk6IHZvaWQge1xuICAgIGNvbnN0IGNoaWxkcmVuOiB7W291dGxldDogc3RyaW5nXTogVHJlZU5vZGU8QWN0aXZhdGVkUm91dGU+fSA9IG5vZGVDaGlsZHJlbkFzTWFwKGN1cnJOb2RlKTtcbiAgICBmdXR1cmVOb2RlLmNoaWxkcmVuLmZvckVhY2goYyA9PiB7XG4gICAgICB0aGlzLmFjdGl2YXRlUm91dGVzKGMsIGNoaWxkcmVuW2MudmFsdWUub3V0bGV0XSwgY29udGV4dHMpO1xuICAgICAgdGhpcy5mb3J3YXJkRXZlbnQobmV3IEFjdGl2YXRpb25FbmQoYy52YWx1ZS5zbmFwc2hvdCkpO1xuICAgIH0pO1xuICAgIGlmIChmdXR1cmVOb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgdGhpcy5mb3J3YXJkRXZlbnQobmV3IENoaWxkQWN0aXZhdGlvbkVuZChmdXR1cmVOb2RlLnZhbHVlLnNuYXBzaG90KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhY3RpdmF0ZVJvdXRlcyhcbiAgICAgIGZ1dHVyZU5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPiwgY3Vyck5vZGU6IFRyZWVOb2RlPEFjdGl2YXRlZFJvdXRlPixcbiAgICAgIHBhcmVudENvbnRleHRzOiBDaGlsZHJlbk91dGxldENvbnRleHRzKTogdm9pZCB7XG4gICAgY29uc3QgZnV0dXJlID0gZnV0dXJlTm9kZS52YWx1ZTtcbiAgICBjb25zdCBjdXJyID0gY3Vyck5vZGUgPyBjdXJyTm9kZS52YWx1ZSA6IG51bGw7XG5cbiAgICBhZHZhbmNlQWN0aXZhdGVkUm91dGUoZnV0dXJlKTtcblxuICAgIC8vIHJldXNpbmcgdGhlIG5vZGVcbiAgICBpZiAoZnV0dXJlID09PSBjdXJyKSB7XG4gICAgICBpZiAoZnV0dXJlLmNvbXBvbmVudCkge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgbm9ybWFsIHJvdXRlLCB3ZSBuZWVkIHRvIGdvIHRocm91Z2ggYW4gb3V0bGV0LlxuICAgICAgICBjb25zdCBjb250ZXh0ID0gcGFyZW50Q29udGV4dHMuZ2V0T3JDcmVhdGVDb250ZXh0KGZ1dHVyZS5vdXRsZXQpO1xuICAgICAgICB0aGlzLmFjdGl2YXRlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgY3Vyck5vZGUsIGNvbnRleHQuY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIGNvbXBvbmVudGxlc3Mgcm91dGUsIHdlIHJlY3Vyc2UgYnV0IGtlZXAgdGhlIHNhbWUgb3V0bGV0IG1hcC5cbiAgICAgICAgdGhpcy5hY3RpdmF0ZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIGN1cnJOb2RlLCBwYXJlbnRDb250ZXh0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmdXR1cmUuY29tcG9uZW50KSB7XG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBub3JtYWwgcm91dGUsIHdlIG5lZWQgdG8gcGxhY2UgdGhlIGNvbXBvbmVudCBpbnRvIHRoZSBvdXRsZXQgYW5kIHJlY3Vyc2UuXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBwYXJlbnRDb250ZXh0cy5nZXRPckNyZWF0ZUNvbnRleHQoZnV0dXJlLm91dGxldCk7XG5cbiAgICAgICAgaWYgKHRoaXMucm91dGVSZXVzZVN0cmF0ZWd5LnNob3VsZEF0dGFjaChmdXR1cmUuc25hcHNob3QpKSB7XG4gICAgICAgICAgY29uc3Qgc3RvcmVkID1cbiAgICAgICAgICAgICAgKDxEZXRhY2hlZFJvdXRlSGFuZGxlSW50ZXJuYWw+dGhpcy5yb3V0ZVJldXNlU3RyYXRlZ3kucmV0cmlldmUoZnV0dXJlLnNuYXBzaG90KSk7XG4gICAgICAgICAgdGhpcy5yb3V0ZVJldXNlU3RyYXRlZ3kuc3RvcmUoZnV0dXJlLnNuYXBzaG90LCBudWxsKTtcbiAgICAgICAgICBjb250ZXh0LmNoaWxkcmVuLm9uT3V0bGV0UmVBdHRhY2hlZChzdG9yZWQuY29udGV4dHMpO1xuICAgICAgICAgIGNvbnRleHQuYXR0YWNoUmVmID0gc3RvcmVkLmNvbXBvbmVudFJlZjtcbiAgICAgICAgICBjb250ZXh0LnJvdXRlID0gc3RvcmVkLnJvdXRlLnZhbHVlO1xuICAgICAgICAgIGlmIChjb250ZXh0Lm91dGxldCkge1xuICAgICAgICAgICAgLy8gQXR0YWNoIHJpZ2h0IGF3YXkgd2hlbiB0aGUgb3V0bGV0IGhhcyBhbHJlYWR5IGJlZW4gaW5zdGFudGlhdGVkXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UgYXR0YWNoIGZyb20gYFJvdXRlck91dGxldC5uZ09uSW5pdGAgd2hlbiBpdCBpcyBpbnN0YW50aWF0ZWRcbiAgICAgICAgICAgIGNvbnRleHQub3V0bGV0LmF0dGFjaChzdG9yZWQuY29tcG9uZW50UmVmLCBzdG9yZWQucm91dGUudmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFkdmFuY2VBY3RpdmF0ZWRSb3V0ZShzdG9yZWQucm91dGUudmFsdWUpO1xuICAgICAgICAgIHRoaXMuYWN0aXZhdGVDaGlsZFJvdXRlcyhmdXR1cmVOb2RlLCBudWxsLCBjb250ZXh0LmNoaWxkcmVuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBwYXJlbnRMb2FkZWRDb25maWcoZnV0dXJlLnNuYXBzaG90KTtcbiAgICAgICAgICBjb25zdCBjbXBGYWN0b3J5UmVzb2x2ZXIgPSBjb25maWcgPyBjb25maWcubW9kdWxlLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciA6IG51bGw7XG5cbiAgICAgICAgICBjb250ZXh0LmF0dGFjaFJlZiA9IG51bGw7XG4gICAgICAgICAgY29udGV4dC5yb3V0ZSA9IGZ1dHVyZTtcbiAgICAgICAgICBjb250ZXh0LnJlc29sdmVyID0gY21wRmFjdG9yeVJlc29sdmVyO1xuICAgICAgICAgIGlmIChjb250ZXh0Lm91dGxldCkge1xuICAgICAgICAgICAgLy8gQWN0aXZhdGUgdGhlIG91dGxldCB3aGVuIGl0IGhhcyBhbHJlYWR5IGJlZW4gaW5zdGFudGlhdGVkXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UgaXQgd2lsbCBnZXQgYWN0aXZhdGVkIGZyb20gaXRzIGBuZ09uSW5pdGAgd2hlbiBpbnN0YW50aWF0ZWRcbiAgICAgICAgICAgIGNvbnRleHQub3V0bGV0LmFjdGl2YXRlV2l0aChmdXR1cmUsIGNtcEZhY3RvcnlSZXNvbHZlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZUNoaWxkUm91dGVzKGZ1dHVyZU5vZGUsIG51bGwsIGNvbnRleHQuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgY29tcG9uZW50bGVzcyByb3V0ZSwgd2UgcmVjdXJzZSBidXQga2VlcCB0aGUgc2FtZSBvdXRsZXQgbWFwLlxuICAgICAgICB0aGlzLmFjdGl2YXRlQ2hpbGRSb3V0ZXMoZnV0dXJlTm9kZSwgbnVsbCwgcGFyZW50Q29udGV4dHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJlbnRMb2FkZWRDb25maWcoc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBMb2FkZWRSb3V0ZXJDb25maWd8bnVsbCB7XG4gIGZvciAobGV0IHMgPSBzbmFwc2hvdC5wYXJlbnQ7IHM7IHMgPSBzLnBhcmVudCkge1xuICAgIGNvbnN0IHJvdXRlID0gcy5yb3V0ZUNvbmZpZztcbiAgICBpZiAocm91dGUgJiYgcm91dGUuX2xvYWRlZENvbmZpZykgcmV0dXJuIHJvdXRlLl9sb2FkZWRDb25maWc7XG4gICAgaWYgKHJvdXRlICYmIHJvdXRlLmNvbXBvbmVudCkgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==