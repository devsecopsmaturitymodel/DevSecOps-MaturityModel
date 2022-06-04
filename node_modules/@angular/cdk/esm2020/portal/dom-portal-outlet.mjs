/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector, } from '@angular/core';
import { BasePortalOutlet } from './portal';
/**
 * A PortalOutlet for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 */
export class DomPortalOutlet extends BasePortalOutlet {
    /**
     * @param outletElement Element into which the content is projected.
     * @param _componentFactoryResolver Used to resolve the component factory.
     *   Only required when attaching component portals.
     * @param _appRef Reference to the application. Only used in component portals when there
     *   is no `ViewContainerRef` available.
     * @param _defaultInjector Injector to use as a fallback when the portal being attached doesn't
     *   have one. Only used for component portals.
     * @param _document Reference to the document. Used when attaching a DOM portal. Will eventually
     *   become a required parameter.
     */
    constructor(
    /** Element into which the content is projected. */
    outletElement, _componentFactoryResolver, _appRef, _defaultInjector, 
    /**
     * @deprecated `_document` Parameter to be made required.
     * @breaking-change 10.0.0
     */
    _document) {
        super();
        this.outletElement = outletElement;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._appRef = _appRef;
        this._defaultInjector = _defaultInjector;
        /**
         * Attaches a DOM portal by transferring its content into the outlet.
         * @param portal Portal to be attached.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            // @breaking-change 10.0.0 Remove check and error once the
            // `_document` constructor parameter is required.
            if (!this._document && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Cannot attach DOM portal without _document constructor parameter');
            }
            const element = portal.element;
            if (!element.parentNode && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('DOM portal content must be attached to a parent node.');
            }
            // Anchor used to save the element's previous position so
            // that we can restore it when the portal is detached.
            const anchorNode = this._document.createComment('dom-portal');
            element.parentNode.insertBefore(anchorNode, element);
            this.outletElement.appendChild(element);
            this._attachedPortal = portal;
            super.setDisposeFn(() => {
                // We can't use `replaceWith` here because IE doesn't support it.
                if (anchorNode.parentNode) {
                    anchorNode.parentNode.replaceChild(element, anchorNode);
                }
            });
        };
        this._document = _document;
    }
    /**
     * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
     * @param portal Portal to be attached
     * @returns Reference to the created component.
     */
    attachComponentPortal(portal) {
        const resolver = (portal.componentFactoryResolver || this._componentFactoryResolver);
        if ((typeof ngDevMode === 'undefined' || ngDevMode) && !resolver) {
            throw Error('Cannot attach component portal to outlet without a ComponentFactoryResolver.');
        }
        const componentFactory = resolver.resolveComponentFactory(portal.component);
        let componentRef;
        // If the portal specifies a ViewContainerRef, we will use that as the attachment point
        // for the component (in terms of Angular's component tree, not rendering).
        // When the ViewContainerRef is missing, we use the factory to create the component directly
        // and then manually attach the view to the application.
        if (portal.viewContainerRef) {
            componentRef = portal.viewContainerRef.createComponent(componentFactory, portal.viewContainerRef.length, portal.injector || portal.viewContainerRef.injector);
            this.setDisposeFn(() => componentRef.destroy());
        }
        else {
            if ((typeof ngDevMode === 'undefined' || ngDevMode) && !this._appRef) {
                throw Error('Cannot attach component portal to outlet without an ApplicationRef.');
            }
            componentRef = componentFactory.create(portal.injector || this._defaultInjector || Injector.NULL);
            this._appRef.attachView(componentRef.hostView);
            this.setDisposeFn(() => {
                // Verify that the ApplicationRef has registered views before trying to detach a host view.
                // This check also protects the `detachView` from being called on a destroyed ApplicationRef.
                if (this._appRef.viewCount > 0) {
                    this._appRef.detachView(componentRef.hostView);
                }
                componentRef.destroy();
            });
        }
        // At this point the component has been instantiated, so we move it to the location in the DOM
        // where we want it to be rendered.
        this.outletElement.appendChild(this._getComponentRootNode(componentRef));
        this._attachedPortal = portal;
        return componentRef;
    }
    /**
     * Attaches a template portal to the DOM as an embedded view.
     * @param portal Portal to be attached.
     * @returns Reference to the created embedded view.
     */
    attachTemplatePortal(portal) {
        let viewContainer = portal.viewContainerRef;
        let viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context);
        // The method `createEmbeddedView` will add the view as a child of the viewContainer.
        // But for the DomPortalOutlet the view can be added everywhere in the DOM
        // (e.g Overlay Container) To move the view to the specified host element. We just
        // re-append the existing root nodes.
        viewRef.rootNodes.forEach(rootNode => this.outletElement.appendChild(rootNode));
        // Note that we want to detect changes after the nodes have been moved so that
        // any directives inside the portal that are looking at the DOM inside a lifecycle
        // hook won't be invoked too early.
        viewRef.detectChanges();
        this.setDisposeFn(() => {
            let index = viewContainer.indexOf(viewRef);
            if (index !== -1) {
                viewContainer.remove(index);
            }
        });
        this._attachedPortal = portal;
        // TODO(jelbourn): Return locals from view.
        return viewRef;
    }
    /**
     * Clears out a portal from the DOM.
     */
    dispose() {
        super.dispose();
        this.outletElement.remove();
    }
    /** Gets the root HTMLElement for an instantiated component. */
    _getComponentRootNode(componentRef) {
        return componentRef.hostView.rootNodes[0];
    }
}
/**
 * @deprecated Use `DomPortalOutlet` instead.
 * @breaking-change 9.0.0
 */
export class DomPortalHost extends DomPortalOutlet {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLXBvcnRhbC1vdXRsZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3BvcnRhbC9kb20tcG9ydGFsLW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBS0wsUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBNkMsTUFBTSxVQUFVLENBQUM7QUFFdEY7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGVBQWdCLFNBQVEsZ0JBQWdCO0lBR25EOzs7Ozs7Ozs7O09BVUc7SUFDSDtJQUNFLG1EQUFtRDtJQUM1QyxhQUFzQixFQUNyQix5QkFBb0QsRUFDcEQsT0FBd0IsRUFDeEIsZ0JBQTJCO0lBRW5DOzs7T0FHRztJQUNILFNBQWU7UUFFZixLQUFLLEVBQUUsQ0FBQztRQVhELGtCQUFhLEdBQWIsYUFBYSxDQUFTO1FBQ3JCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMkI7UUFDcEQsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFXO1FBa0dyQzs7Ozs7V0FLRztRQUNNLG9CQUFlLEdBQUcsQ0FBQyxNQUFpQixFQUFFLEVBQUU7WUFDL0MsMERBQTBEO1lBQzFELGlEQUFpRDtZQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtnQkFDdEUsTUFBTSxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQzthQUNqRjtZQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7Z0JBQzFFLE1BQU0sS0FBSyxDQUFDLHVEQUF1RCxDQUFD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QUFDO0NBQ0Y7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sYUFBYyxTQUFRLGVBQWU7Q0FBRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbXBvbmVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBBcHBsaWNhdGlvblJlZixcbiAgSW5qZWN0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCYXNlUG9ydGFsT3V0bGV0LCBDb21wb25lbnRQb3J0YWwsIFRlbXBsYXRlUG9ydGFsLCBEb21Qb3J0YWx9IGZyb20gJy4vcG9ydGFsJztcblxuLyoqXG4gKiBBIFBvcnRhbE91dGxldCBmb3IgYXR0YWNoaW5nIHBvcnRhbHMgdG8gYW4gYXJiaXRyYXJ5IERPTSBlbGVtZW50IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXJcbiAqIGFwcGxpY2F0aW9uIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBjbGFzcyBEb21Qb3J0YWxPdXRsZXQgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gb3V0bGV0RWxlbWVudCBFbGVtZW50IGludG8gd2hpY2ggdGhlIGNvbnRlbnQgaXMgcHJvamVjdGVkLlxuICAgKiBAcGFyYW0gX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlciBVc2VkIHRvIHJlc29sdmUgdGhlIGNvbXBvbmVudCBmYWN0b3J5LlxuICAgKiAgIE9ubHkgcmVxdWlyZWQgd2hlbiBhdHRhY2hpbmcgY29tcG9uZW50IHBvcnRhbHMuXG4gICAqIEBwYXJhbSBfYXBwUmVmIFJlZmVyZW5jZSB0byB0aGUgYXBwbGljYXRpb24uIE9ubHkgdXNlZCBpbiBjb21wb25lbnQgcG9ydGFscyB3aGVuIHRoZXJlXG4gICAqICAgaXMgbm8gYFZpZXdDb250YWluZXJSZWZgIGF2YWlsYWJsZS5cbiAgICogQHBhcmFtIF9kZWZhdWx0SW5qZWN0b3IgSW5qZWN0b3IgdG8gdXNlIGFzIGEgZmFsbGJhY2sgd2hlbiB0aGUgcG9ydGFsIGJlaW5nIGF0dGFjaGVkIGRvZXNuJ3RcbiAgICogICBoYXZlIG9uZS4gT25seSB1c2VkIGZvciBjb21wb25lbnQgcG9ydGFscy5cbiAgICogQHBhcmFtIF9kb2N1bWVudCBSZWZlcmVuY2UgdG8gdGhlIGRvY3VtZW50LiBVc2VkIHdoZW4gYXR0YWNoaW5nIGEgRE9NIHBvcnRhbC4gV2lsbCBldmVudHVhbGx5XG4gICAqICAgYmVjb21lIGEgcmVxdWlyZWQgcGFyYW1ldGVyLlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIEVsZW1lbnQgaW50byB3aGljaCB0aGUgY29udGVudCBpcyBwcm9qZWN0ZWQuICovXG4gICAgcHVibGljIG91dGxldEVsZW1lbnQ6IEVsZW1lbnQsXG4gICAgcHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyPzogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgX2FwcFJlZj86IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgX2RlZmF1bHRJbmplY3Rvcj86IEluamVjdG9yLFxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9kb2N1bWVudGAgUGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgKi9cbiAgICBfZG9jdW1lbnQ/OiBhbnksXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIHRoZSBnaXZlbiBDb21wb25lbnRQb3J0YWwgdG8gRE9NIGVsZW1lbnQgdXNpbmcgdGhlIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWRcbiAgICogQHJldHVybnMgUmVmZXJlbmNlIHRvIHRoZSBjcmVhdGVkIGNvbXBvbmVudC5cbiAgICovXG4gIGF0dGFjaENvbXBvbmVudFBvcnRhbDxUPihwb3J0YWw6IENvbXBvbmVudFBvcnRhbDxUPik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgY29uc3QgcmVzb2x2ZXIgPSAocG9ydGFsLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB8fCB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpITtcblxuICAgIGlmICgodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSAmJiAhcmVzb2x2ZXIpIHtcbiAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgYXR0YWNoIGNvbXBvbmVudCBwb3J0YWwgdG8gb3V0bGV0IHdpdGhvdXQgYSBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBvcnRhbC5jb21wb25lbnQpO1xuICAgIGxldCBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxUPjtcblxuICAgIC8vIElmIHRoZSBwb3J0YWwgc3BlY2lmaWVzIGEgVmlld0NvbnRhaW5lclJlZiwgd2Ugd2lsbCB1c2UgdGhhdCBhcyB0aGUgYXR0YWNobWVudCBwb2ludFxuICAgIC8vIGZvciB0aGUgY29tcG9uZW50IChpbiB0ZXJtcyBvZiBBbmd1bGFyJ3MgY29tcG9uZW50IHRyZWUsIG5vdCByZW5kZXJpbmcpLlxuICAgIC8vIFdoZW4gdGhlIFZpZXdDb250YWluZXJSZWYgaXMgbWlzc2luZywgd2UgdXNlIHRoZSBmYWN0b3J5IHRvIGNyZWF0ZSB0aGUgY29tcG9uZW50IGRpcmVjdGx5XG4gICAgLy8gYW5kIHRoZW4gbWFudWFsbHkgYXR0YWNoIHRoZSB2aWV3IHRvIHRoZSBhcHBsaWNhdGlvbi5cbiAgICBpZiAocG9ydGFsLnZpZXdDb250YWluZXJSZWYpIHtcbiAgICAgIGNvbXBvbmVudFJlZiA9IHBvcnRhbC52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChcbiAgICAgICAgY29tcG9uZW50RmFjdG9yeSxcbiAgICAgICAgcG9ydGFsLnZpZXdDb250YWluZXJSZWYubGVuZ3RoLFxuICAgICAgICBwb3J0YWwuaW5qZWN0b3IgfHwgcG9ydGFsLnZpZXdDb250YWluZXJSZWYuaW5qZWN0b3IsXG4gICAgICApO1xuXG4gICAgICB0aGlzLnNldERpc3Bvc2VGbigoKSA9PiBjb21wb25lbnRSZWYuZGVzdHJveSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmICF0aGlzLl9hcHBSZWYpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhdHRhY2ggY29tcG9uZW50IHBvcnRhbCB0byBvdXRsZXQgd2l0aG91dCBhbiBBcHBsaWNhdGlvblJlZi4nKTtcbiAgICAgIH1cblxuICAgICAgY29tcG9uZW50UmVmID0gY29tcG9uZW50RmFjdG9yeS5jcmVhdGUoXG4gICAgICAgIHBvcnRhbC5pbmplY3RvciB8fCB0aGlzLl9kZWZhdWx0SW5qZWN0b3IgfHwgSW5qZWN0b3IuTlVMTCxcbiAgICAgICk7XG4gICAgICB0aGlzLl9hcHBSZWYhLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcbiAgICAgIHRoaXMuc2V0RGlzcG9zZUZuKCgpID0+IHtcbiAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIEFwcGxpY2F0aW9uUmVmIGhhcyByZWdpc3RlcmVkIHZpZXdzIGJlZm9yZSB0cnlpbmcgdG8gZGV0YWNoIGEgaG9zdCB2aWV3LlxuICAgICAgICAvLyBUaGlzIGNoZWNrIGFsc28gcHJvdGVjdHMgdGhlIGBkZXRhY2hWaWV3YCBmcm9tIGJlaW5nIGNhbGxlZCBvbiBhIGRlc3Ryb3llZCBBcHBsaWNhdGlvblJlZi5cbiAgICAgICAgaWYgKHRoaXMuX2FwcFJlZiEudmlld0NvdW50ID4gMCkge1xuICAgICAgICAgIHRoaXMuX2FwcFJlZiEuZGV0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gQXQgdGhpcyBwb2ludCB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGluc3RhbnRpYXRlZCwgc28gd2UgbW92ZSBpdCB0byB0aGUgbG9jYXRpb24gaW4gdGhlIERPTVxuICAgIC8vIHdoZXJlIHdlIHdhbnQgaXQgdG8gYmUgcmVuZGVyZWQuXG4gICAgdGhpcy5vdXRsZXRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2dldENvbXBvbmVudFJvb3ROb2RlKGNvbXBvbmVudFJlZikpO1xuICAgIHRoaXMuX2F0dGFjaGVkUG9ydGFsID0gcG9ydGFsO1xuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIHRlbXBsYXRlIHBvcnRhbCB0byB0aGUgRE9NIGFzIGFuIGVtYmVkZGVkIHZpZXcuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkLlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIGNyZWF0ZWQgZW1iZWRkZWQgdmlldy5cbiAgICovXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIGxldCB2aWV3Q29udGFpbmVyID0gcG9ydGFsLnZpZXdDb250YWluZXJSZWY7XG4gICAgbGV0IHZpZXdSZWYgPSB2aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyhwb3J0YWwudGVtcGxhdGVSZWYsIHBvcnRhbC5jb250ZXh0KTtcblxuICAgIC8vIFRoZSBtZXRob2QgYGNyZWF0ZUVtYmVkZGVkVmlld2Agd2lsbCBhZGQgdGhlIHZpZXcgYXMgYSBjaGlsZCBvZiB0aGUgdmlld0NvbnRhaW5lci5cbiAgICAvLyBCdXQgZm9yIHRoZSBEb21Qb3J0YWxPdXRsZXQgdGhlIHZpZXcgY2FuIGJlIGFkZGVkIGV2ZXJ5d2hlcmUgaW4gdGhlIERPTVxuICAgIC8vIChlLmcgT3ZlcmxheSBDb250YWluZXIpIFRvIG1vdmUgdGhlIHZpZXcgdG8gdGhlIHNwZWNpZmllZCBob3N0IGVsZW1lbnQuIFdlIGp1c3RcbiAgICAvLyByZS1hcHBlbmQgdGhlIGV4aXN0aW5nIHJvb3Qgbm9kZXMuXG4gICAgdmlld1JlZi5yb290Tm9kZXMuZm9yRWFjaChyb290Tm9kZSA9PiB0aGlzLm91dGxldEVsZW1lbnQuYXBwZW5kQ2hpbGQocm9vdE5vZGUpKTtcblxuICAgIC8vIE5vdGUgdGhhdCB3ZSB3YW50IHRvIGRldGVjdCBjaGFuZ2VzIGFmdGVyIHRoZSBub2RlcyBoYXZlIGJlZW4gbW92ZWQgc28gdGhhdFxuICAgIC8vIGFueSBkaXJlY3RpdmVzIGluc2lkZSB0aGUgcG9ydGFsIHRoYXQgYXJlIGxvb2tpbmcgYXQgdGhlIERPTSBpbnNpZGUgYSBsaWZlY3ljbGVcbiAgICAvLyBob29rIHdvbid0IGJlIGludm9rZWQgdG9vIGVhcmx5LlxuICAgIHZpZXdSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgdGhpcy5zZXREaXNwb3NlRm4oKCkgPT4ge1xuICAgICAgbGV0IGluZGV4ID0gdmlld0NvbnRhaW5lci5pbmRleE9mKHZpZXdSZWYpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB2aWV3Q29udGFpbmVyLnJlbW92ZShpbmRleCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IHBvcnRhbDtcblxuICAgIC8vIFRPRE8oamVsYm91cm4pOiBSZXR1cm4gbG9jYWxzIGZyb20gdmlldy5cbiAgICByZXR1cm4gdmlld1JlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2hlcyBhIERPTSBwb3J0YWwgYnkgdHJhbnNmZXJyaW5nIGl0cyBjb250ZW50IGludG8gdGhlIG91dGxldC5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgdG8gYmUgYXR0YWNoZWQuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgbWV0aG9kLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKi9cbiAgb3ZlcnJpZGUgYXR0YWNoRG9tUG9ydGFsID0gKHBvcnRhbDogRG9tUG9ydGFsKSA9PiB7XG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSAxMC4wLjAgUmVtb3ZlIGNoZWNrIGFuZCBlcnJvciBvbmNlIHRoZVxuICAgIC8vIGBfZG9jdW1lbnRgIGNvbnN0cnVjdG9yIHBhcmFtZXRlciBpcyByZXF1aXJlZC5cbiAgICBpZiAoIXRoaXMuX2RvY3VtZW50ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQ2Fubm90IGF0dGFjaCBET00gcG9ydGFsIHdpdGhvdXQgX2RvY3VtZW50IGNvbnN0cnVjdG9yIHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSBwb3J0YWwuZWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0RPTSBwb3J0YWwgY29udGVudCBtdXN0IGJlIGF0dGFjaGVkIHRvIGEgcGFyZW50IG5vZGUuJyk7XG4gICAgfVxuXG4gICAgLy8gQW5jaG9yIHVzZWQgdG8gc2F2ZSB0aGUgZWxlbWVudCdzIHByZXZpb3VzIHBvc2l0aW9uIHNvXG4gICAgLy8gdGhhdCB3ZSBjYW4gcmVzdG9yZSBpdCB3aGVuIHRoZSBwb3J0YWwgaXMgZGV0YWNoZWQuXG4gICAgY29uc3QgYW5jaG9yTm9kZSA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ2RvbS1wb3J0YWwnKTtcblxuICAgIGVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKGFuY2hvck5vZGUsIGVsZW1lbnQpO1xuICAgIHRoaXMub3V0bGV0RWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IHBvcnRhbDtcblxuICAgIHN1cGVyLnNldERpc3Bvc2VGbigoKSA9PiB7XG4gICAgICAvLyBXZSBjYW4ndCB1c2UgYHJlcGxhY2VXaXRoYCBoZXJlIGJlY2F1c2UgSUUgZG9lc24ndCBzdXBwb3J0IGl0LlxuICAgICAgaWYgKGFuY2hvck5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICBhbmNob3JOb2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGVsZW1lbnQsIGFuY2hvck5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhcnMgb3V0IGEgcG9ydGFsIGZyb20gdGhlIERPTS5cbiAgICovXG4gIG92ZXJyaWRlIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgc3VwZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMub3V0bGV0RWxlbWVudC5yZW1vdmUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByb290IEhUTUxFbGVtZW50IGZvciBhbiBpbnN0YW50aWF0ZWQgY29tcG9uZW50LiAqL1xuICBwcml2YXRlIF9nZXRDb21wb25lbnRSb290Tm9kZShjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+KTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYERvbVBvcnRhbE91dGxldGAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIERvbVBvcnRhbEhvc3QgZXh0ZW5kcyBEb21Qb3J0YWxPdXRsZXQge31cbiJdfQ==