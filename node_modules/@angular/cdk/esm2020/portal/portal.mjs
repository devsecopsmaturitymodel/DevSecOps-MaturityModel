/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, } from '@angular/core';
import { throwNullPortalOutletError, throwPortalAlreadyAttachedError, throwNoPortalAttachedError, throwNullPortalError, throwPortalOutletAlreadyDisposedError, throwUnknownPortalTypeError, } from './portal-errors';
/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalOutlet`.
 */
export class Portal {
    /** Attach this portal to a host. */
    attach(host) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (host == null) {
                throwNullPortalOutletError();
            }
            if (host.hasAttached()) {
                throwPortalAlreadyAttachedError();
            }
        }
        this._attachedHost = host;
        return host.attach(this);
    }
    /** Detach this portal from its host */
    detach() {
        let host = this._attachedHost;
        if (host != null) {
            this._attachedHost = null;
            host.detach();
        }
        else if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throwNoPortalAttachedError();
        }
    }
    /** Whether this portal is attached to a host. */
    get isAttached() {
        return this._attachedHost != null;
    }
    /**
     * Sets the PortalOutlet reference without performing `attach()`. This is used directly by
     * the PortalOutlet when it is performing an `attach()` or `detach()`.
     */
    setAttachedHost(host) {
        this._attachedHost = host;
    }
}
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal extends Portal {
    constructor(component, viewContainerRef, injector, componentFactoryResolver) {
        super();
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
    }
}
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
export class TemplatePortal extends Portal {
    constructor(template, viewContainerRef, context) {
        super();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
        this.context = context;
    }
    get origin() {
        return this.templateRef.elementRef;
    }
    /**
     * Attach the portal to the provided `PortalOutlet`.
     * When a context is provided it will override the `context` property of the `TemplatePortal`
     * instance.
     */
    attach(host, context = this.context) {
        this.context = context;
        return super.attach(host);
    }
    detach() {
        this.context = undefined;
        return super.detach();
    }
}
/**
 * A `DomPortal` is a portal whose DOM element will be taken from its current position
 * in the DOM and moved into a portal outlet, when it is attached. On detach, the content
 * will be restored to its original position.
 */
export class DomPortal extends Portal {
    constructor(element) {
        super();
        this.element = element instanceof ElementRef ? element.nativeElement : element;
    }
}
/**
 * Partial implementation of PortalOutlet that handles attaching
 * ComponentPortal and TemplatePortal.
 */
export class BasePortalOutlet {
    constructor() {
        /** Whether this host has already been permanently disposed. */
        this._isDisposed = false;
        // @breaking-change 10.0.0 `attachDomPortal` to become a required abstract method.
        this.attachDomPortal = null;
    }
    /** Whether this host has an attached portal. */
    hasAttached() {
        return !!this._attachedPortal;
    }
    /** Attaches a portal. */
    attach(portal) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!portal) {
                throwNullPortalError();
            }
            if (this.hasAttached()) {
                throwPortalAlreadyAttachedError();
            }
            if (this._isDisposed) {
                throwPortalOutletAlreadyDisposedError();
            }
        }
        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        }
        else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
            // @breaking-change 10.0.0 remove null check for `this.attachDomPortal`.
        }
        else if (this.attachDomPortal && portal instanceof DomPortal) {
            this._attachedPortal = portal;
            return this.attachDomPortal(portal);
        }
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throwUnknownPortalTypeError();
        }
    }
    /** Detaches a previously attached portal. */
    detach() {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
            this._attachedPortal = null;
        }
        this._invokeDisposeFn();
    }
    /** Permanently dispose of this portal host. */
    dispose() {
        if (this.hasAttached()) {
            this.detach();
        }
        this._invokeDisposeFn();
        this._isDisposed = true;
    }
    /** @docs-private */
    setDisposeFn(fn) {
        this._disposeFn = fn;
    }
    _invokeDisposeFn() {
        if (this._disposeFn) {
            this._disposeFn();
            this._disposeFn = null;
        }
    }
}
/**
 * @deprecated Use `BasePortalOutlet` instead.
 * @breaking-change 9.0.0
 */
export class BasePortalHost extends BasePortalOutlet {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9wb3J0YWwvcG9ydGFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFHTCxVQUFVLEdBS1gsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLDBCQUEwQixFQUMxQiwrQkFBK0IsRUFDL0IsMEJBQTBCLEVBQzFCLG9CQUFvQixFQUNwQixxQ0FBcUMsRUFDckMsMkJBQTJCLEdBQzVCLE1BQU0saUJBQWlCLENBQUM7QUFPekI7OztHQUdHO0FBQ0gsTUFBTSxPQUFnQixNQUFNO0lBRzFCLG9DQUFvQztJQUNwQyxNQUFNLENBQUMsSUFBa0I7UUFDdkIsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFO1lBQ2pELElBQUksSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDaEIsMEJBQTBCLEVBQUUsQ0FBQzthQUM5QjtZQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUN0QiwrQkFBK0IsRUFBRSxDQUFDO2FBQ25DO1NBQ0Y7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixPQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxNQUFNO1FBQ0osSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUU5QixJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7YUFBTSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUU7WUFDeEQsMEJBQTBCLEVBQUUsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxpREFBaUQ7SUFDakQs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RztBQUNILE1BQU0sT0FBZ0IsY0FBZSxTQUFRLGdCQUFnQjtDQUFHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBFbGVtZW50UmVmLFxuICBDb21wb25lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgSW5qZWN0b3IsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICB0aHJvd051bGxQb3J0YWxPdXRsZXRFcnJvcixcbiAgdGhyb3dQb3J0YWxBbHJlYWR5QXR0YWNoZWRFcnJvcixcbiAgdGhyb3dOb1BvcnRhbEF0dGFjaGVkRXJyb3IsXG4gIHRocm93TnVsbFBvcnRhbEVycm9yLFxuICB0aHJvd1BvcnRhbE91dGxldEFscmVhZHlEaXNwb3NlZEVycm9yLFxuICB0aHJvd1Vua25vd25Qb3J0YWxUeXBlRXJyb3IsXG59IGZyb20gJy4vcG9ydGFsLWVycm9ycyc7XG5cbi8qKiBJbnRlcmZhY2UgdGhhdCBjYW4gYmUgdXNlZCB0byBnZW5lcmljYWxseSB0eXBlIGEgY2xhc3MuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbXBvbmVudFR5cGU8VD4ge1xuICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogVDtcbn1cblxuLyoqXG4gKiBBIGBQb3J0YWxgIGlzIHNvbWV0aGluZyB0aGF0IHlvdSB3YW50IHRvIHJlbmRlciBzb21ld2hlcmUgZWxzZS5cbiAqIEl0IGNhbiBiZSBhdHRhY2ggdG8gLyBkZXRhY2hlZCBmcm9tIGEgYFBvcnRhbE91dGxldGAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQb3J0YWw8VD4ge1xuICBwcml2YXRlIF9hdHRhY2hlZEhvc3Q6IFBvcnRhbE91dGxldCB8IG51bGw7XG5cbiAgLyoqIEF0dGFjaCB0aGlzIHBvcnRhbCB0byBhIGhvc3QuICovXG4gIGF0dGFjaChob3N0OiBQb3J0YWxPdXRsZXQpOiBUIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoaG9zdCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93TnVsbFBvcnRhbE91dGxldEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChob3N0Lmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgICAgdGhyb3dQb3J0YWxBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2F0dGFjaGVkSG9zdCA9IGhvc3Q7XG4gICAgcmV0dXJuIDxUPmhvc3QuYXR0YWNoKHRoaXMpO1xuICB9XG5cbiAgLyoqIERldGFjaCB0aGlzIHBvcnRhbCBmcm9tIGl0cyBob3N0ICovXG4gIGRldGFjaCgpOiB2b2lkIHtcbiAgICBsZXQgaG9zdCA9IHRoaXMuX2F0dGFjaGVkSG9zdDtcblxuICAgIGlmIChob3N0ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2F0dGFjaGVkSG9zdCA9IG51bGw7XG4gICAgICBob3N0LmRldGFjaCgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICB0aHJvd05vUG9ydGFsQXR0YWNoZWRFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgcG9ydGFsIGlzIGF0dGFjaGVkIHRvIGEgaG9zdC4gKi9cbiAgZ2V0IGlzQXR0YWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dGFjaGVkSG9zdCAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFBvcnRhbE91dGxldCByZWZlcmVuY2Ugd2l0aG91dCBwZXJmb3JtaW5nIGBhdHRhY2goKWAuIFRoaXMgaXMgdXNlZCBkaXJlY3RseSBieVxuICAgKiB0aGUgUG9ydGFsT3V0bGV0IHdoZW4gaXQgaXMgcGVyZm9ybWluZyBhbiBgYXR0YWNoKClgIG9yIGBkZXRhY2goKWAuXG4gICAqL1xuICBzZXRBdHRhY2hlZEhvc3QoaG9zdDogUG9ydGFsT3V0bGV0IHwgbnVsbCkge1xuICAgIHRoaXMuX2F0dGFjaGVkSG9zdCA9IGhvc3Q7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGBDb21wb25lbnRQb3J0YWxgIGlzIGEgcG9ydGFsIHRoYXQgaW5zdGFudGlhdGVzIHNvbWUgQ29tcG9uZW50IHVwb24gYXR0YWNobWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbXBvbmVudFBvcnRhbDxUPiBleHRlbmRzIFBvcnRhbDxDb21wb25lbnRSZWY8VD4+IHtcbiAgLyoqIFRoZSB0eXBlIG9mIHRoZSBjb21wb25lbnQgdGhhdCB3aWxsIGJlIGluc3RhbnRpYXRlZCBmb3IgYXR0YWNobWVudC4gKi9cbiAgY29tcG9uZW50OiBDb21wb25lbnRUeXBlPFQ+O1xuXG4gIC8qKlxuICAgKiBbT3B0aW9uYWxdIFdoZXJlIHRoZSBhdHRhY2hlZCBjb21wb25lbnQgc2hvdWxkIGxpdmUgaW4gQW5ndWxhcidzICpsb2dpY2FsKiBjb21wb25lbnQgdHJlZS5cbiAgICogVGhpcyBpcyBkaWZmZXJlbnQgZnJvbSB3aGVyZSB0aGUgY29tcG9uZW50ICpyZW5kZXJzKiwgd2hpY2ggaXMgZGV0ZXJtaW5lZCBieSB0aGUgUG9ydGFsT3V0bGV0LlxuICAgKiBUaGUgb3JpZ2luIGlzIG5lY2Vzc2FyeSB3aGVuIHRoZSBob3N0IGlzIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgYXBwbGljYXRpb24gY29udGV4dC5cbiAgICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmIHwgbnVsbDtcblxuICAvKiogW09wdGlvbmFsXSBJbmplY3RvciB1c2VkIGZvciB0aGUgaW5zdGFudGlhdGlvbiBvZiB0aGUgY29tcG9uZW50LiAqL1xuICBpbmplY3Rvcj86IEluamVjdG9yIHwgbnVsbDtcblxuICAvKipcbiAgICogQWx0ZXJuYXRlIGBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJgIHRvIHVzZSB3aGVuIHJlc29sdmluZyB0aGUgYXNzb2NpYXRlZCBjb21wb25lbnQuXG4gICAqIERlZmF1bHRzIHRvIHVzaW5nIHRoZSByZXNvbHZlciBmcm9tIHRoZSBvdXRsZXQgdGhhdCB0aGUgcG9ydGFsIGlzIGF0dGFjaGVkIHRvLlxuICAgKi9cbiAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyPzogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb21wb25lbnQ6IENvbXBvbmVudFR5cGU8VD4sXG4gICAgdmlld0NvbnRhaW5lclJlZj86IFZpZXdDb250YWluZXJSZWYgfCBudWxsLFxuICAgIGluamVjdG9yPzogSW5qZWN0b3IgfCBudWxsLFxuICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcj86IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB8IG51bGwsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB0aGlzLmluamVjdG9yID0gaW5qZWN0b3I7XG4gICAgdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgPSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGBUZW1wbGF0ZVBvcnRhbGAgaXMgYSBwb3J0YWwgdGhhdCByZXByZXNlbnRzIHNvbWUgZW1iZWRkZWQgdGVtcGxhdGUgKFRlbXBsYXRlUmVmKS5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlbXBsYXRlUG9ydGFsPEMgPSBhbnk+IGV4dGVuZHMgUG9ydGFsPEVtYmVkZGVkVmlld1JlZjxDPj4ge1xuICAvKiogVGhlIGVtYmVkZGVkIHRlbXBsYXRlIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGluc3RhbnRpYXRlIGFuIGVtYmVkZGVkIFZpZXcgaW4gdGhlIGhvc3QuICovXG4gIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBWaWV3Q29udGFpbmVyIGludG8gd2hpY2ggdGhlIHRlbXBsYXRlIHdpbGwgYmUgc3RhbXBlZCBvdXQuICovXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgLyoqIENvbnRleHR1YWwgZGF0YSB0byBiZSBwYXNzZWQgaW4gdG8gdGhlIGVtYmVkZGVkIHZpZXcuICovXG4gIGNvbnRleHQ6IEMgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IodGVtcGxhdGU6IFRlbXBsYXRlUmVmPEM+LCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBjb250ZXh0PzogQykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50ZW1wbGF0ZVJlZiA9IHRlbXBsYXRlO1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZiA9IHZpZXdDb250YWluZXJSZWY7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIGdldCBvcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVSZWYuZWxlbWVudFJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRhY2ggdGhlIHBvcnRhbCB0byB0aGUgcHJvdmlkZWQgYFBvcnRhbE91dGxldGAuXG4gICAqIFdoZW4gYSBjb250ZXh0IGlzIHByb3ZpZGVkIGl0IHdpbGwgb3ZlcnJpZGUgdGhlIGBjb250ZXh0YCBwcm9wZXJ0eSBvZiB0aGUgYFRlbXBsYXRlUG9ydGFsYFxuICAgKiBpbnN0YW5jZS5cbiAgICovXG4gIG92ZXJyaWRlIGF0dGFjaChob3N0OiBQb3J0YWxPdXRsZXQsIGNvbnRleHQ6IEMgfCB1bmRlZmluZWQgPSB0aGlzLmNvbnRleHQpOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIHN1cGVyLmF0dGFjaChob3N0KTtcbiAgfVxuXG4gIG92ZXJyaWRlIGRldGFjaCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRleHQgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN1cGVyLmRldGFjaCgpO1xuICB9XG59XG5cbi8qKlxuICogQSBgRG9tUG9ydGFsYCBpcyBhIHBvcnRhbCB3aG9zZSBET00gZWxlbWVudCB3aWxsIGJlIHRha2VuIGZyb20gaXRzIGN1cnJlbnQgcG9zaXRpb25cbiAqIGluIHRoZSBET00gYW5kIG1vdmVkIGludG8gYSBwb3J0YWwgb3V0bGV0LCB3aGVuIGl0IGlzIGF0dGFjaGVkLiBPbiBkZXRhY2gsIHRoZSBjb250ZW50XG4gKiB3aWxsIGJlIHJlc3RvcmVkIHRvIGl0cyBvcmlnaW5hbCBwb3NpdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIERvbVBvcnRhbDxUID0gSFRNTEVsZW1lbnQ+IGV4dGVuZHMgUG9ydGFsPFQ+IHtcbiAgLyoqIERPTSBub2RlIGhvc3RpbmcgdGhlIHBvcnRhbCdzIGNvbnRlbnQuICovXG4gIHJlYWRvbmx5IGVsZW1lbnQ6IFQ7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDogVCB8IEVsZW1lbnRSZWY8VD4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50UmVmID8gZWxlbWVudC5uYXRpdmVFbGVtZW50IDogZWxlbWVudDtcbiAgfVxufVxuXG4vKiogQSBgUG9ydGFsT3V0bGV0YCBpcyBhbiBzcGFjZSB0aGF0IGNhbiBjb250YWluIGEgc2luZ2xlIGBQb3J0YWxgLiAqL1xuZXhwb3J0IGludGVyZmFjZSBQb3J0YWxPdXRsZXQge1xuICAvKiogQXR0YWNoZXMgYSBwb3J0YWwgdG8gdGhpcyBvdXRsZXQuICovXG4gIGF0dGFjaChwb3J0YWw6IFBvcnRhbDxhbnk+KTogYW55O1xuXG4gIC8qKiBEZXRhY2hlcyB0aGUgY3VycmVudGx5IGF0dGFjaGVkIHBvcnRhbCBmcm9tIHRoaXMgb3V0bGV0LiAqL1xuICBkZXRhY2goKTogYW55O1xuXG4gIC8qKiBQZXJmb3JtcyBjbGVhbnVwIGJlZm9yZSB0aGUgb3V0bGV0IGlzIGRlc3Ryb3llZC4gKi9cbiAgZGlzcG9zZSgpOiB2b2lkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGN1cnJlbnRseSBhIHBvcnRhbCBhdHRhY2hlZCB0byB0aGlzIG91dGxldC4gKi9cbiAgaGFzQXR0YWNoZWQoKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYFBvcnRhbE91dGxldGAgaW5zdGVhZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgOS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgUG9ydGFsSG9zdCA9IFBvcnRhbE91dGxldDtcblxuLyoqXG4gKiBQYXJ0aWFsIGltcGxlbWVudGF0aW9uIG9mIFBvcnRhbE91dGxldCB0aGF0IGhhbmRsZXMgYXR0YWNoaW5nXG4gKiBDb21wb25lbnRQb3J0YWwgYW5kIFRlbXBsYXRlUG9ydGFsLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIFBvcnRhbE91dGxldCB7XG4gIC8qKiBUaGUgcG9ydGFsIGN1cnJlbnRseSBhdHRhY2hlZCB0byB0aGUgaG9zdC4gKi9cbiAgcHJvdGVjdGVkIF9hdHRhY2hlZFBvcnRhbDogUG9ydGFsPGFueT4gfCBudWxsO1xuXG4gIC8qKiBBIGZ1bmN0aW9uIHRoYXQgd2lsbCBwZXJtYW5lbnRseSBkaXNwb3NlIHRoaXMgaG9zdC4gKi9cbiAgcHJpdmF0ZSBfZGlzcG9zZUZuOiAoKCkgPT4gdm9pZCkgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoaXMgaG9zdCBoYXMgYWxyZWFkeSBiZWVuIHBlcm1hbmVudGx5IGRpc3Bvc2VkLiAqL1xuICBwcml2YXRlIF9pc0Rpc3Bvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhpcyBob3N0IGhhcyBhbiBhdHRhY2hlZCBwb3J0YWwuICovXG4gIGhhc0F0dGFjaGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX2F0dGFjaGVkUG9ydGFsO1xuICB9XG5cbiAgYXR0YWNoPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+O1xuICBhdHRhY2g8VD4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxUPik6IEVtYmVkZGVkVmlld1JlZjxUPjtcbiAgYXR0YWNoKHBvcnRhbDogYW55KTogYW55O1xuXG4gIC8qKiBBdHRhY2hlcyBhIHBvcnRhbC4gKi9cbiAgYXR0YWNoKHBvcnRhbDogUG9ydGFsPGFueT4pOiBhbnkge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghcG9ydGFsKSB7XG4gICAgICAgIHRocm93TnVsbFBvcnRhbEVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgICAgdGhyb3dQb3J0YWxBbHJlYWR5QXR0YWNoZWRFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faXNEaXNwb3NlZCkge1xuICAgICAgICB0aHJvd1BvcnRhbE91dGxldEFscmVhZHlEaXNwb3NlZEVycm9yKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvcnRhbCBpbnN0YW5jZW9mIENvbXBvbmVudFBvcnRhbCkge1xuICAgICAgdGhpcy5fYXR0YWNoZWRQb3J0YWwgPSBwb3J0YWw7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hDb21wb25lbnRQb3J0YWwocG9ydGFsKTtcbiAgICB9IGVsc2UgaWYgKHBvcnRhbCBpbnN0YW5jZW9mIFRlbXBsYXRlUG9ydGFsKSB7XG4gICAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IHBvcnRhbDtcbiAgICAgIHJldHVybiB0aGlzLmF0dGFjaFRlbXBsYXRlUG9ydGFsKHBvcnRhbCk7XG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCByZW1vdmUgbnVsbCBjaGVjayBmb3IgYHRoaXMuYXR0YWNoRG9tUG9ydGFsYC5cbiAgICB9IGVsc2UgaWYgKHRoaXMuYXR0YWNoRG9tUG9ydGFsICYmIHBvcnRhbCBpbnN0YW5jZW9mIERvbVBvcnRhbCkge1xuICAgICAgdGhpcy5fYXR0YWNoZWRQb3J0YWwgPSBwb3J0YWw7XG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hEb21Qb3J0YWwocG9ydGFsKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICB0aHJvd1Vua25vd25Qb3J0YWxUeXBlRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICBhYnN0cmFjdCBhdHRhY2hDb21wb25lbnRQb3J0YWw8VD4ocG9ydGFsOiBDb21wb25lbnRQb3J0YWw8VD4pOiBDb21wb25lbnRSZWY8VD47XG5cbiAgYWJzdHJhY3QgYXR0YWNoVGVtcGxhdGVQb3J0YWw8Qz4ocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDxDPik6IEVtYmVkZGVkVmlld1JlZjxDPjtcblxuICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBgYXR0YWNoRG9tUG9ydGFsYCB0byBiZWNvbWUgYSByZXF1aXJlZCBhYnN0cmFjdCBtZXRob2QuXG4gIHJlYWRvbmx5IGF0dGFjaERvbVBvcnRhbDogbnVsbCB8ICgocG9ydGFsOiBEb21Qb3J0YWwpID0+IGFueSkgPSBudWxsO1xuXG4gIC8qKiBEZXRhY2hlcyBhIHByZXZpb3VzbHkgYXR0YWNoZWQgcG9ydGFsLiAqL1xuICBkZXRhY2goKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2F0dGFjaGVkUG9ydGFsKSB7XG4gICAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbC5zZXRBdHRhY2hlZEhvc3QobnVsbCk7XG4gICAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlRGlzcG9zZUZuKCk7XG4gIH1cblxuICAvKiogUGVybWFuZW50bHkgZGlzcG9zZSBvZiB0aGlzIHBvcnRhbCBob3N0LiAqL1xuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlRGlzcG9zZUZuKCk7XG4gICAgdGhpcy5faXNEaXNwb3NlZCA9IHRydWU7XG4gIH1cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBzZXREaXNwb3NlRm4oZm46ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLl9kaXNwb3NlRm4gPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2ludm9rZURpc3Bvc2VGbigpIHtcbiAgICBpZiAodGhpcy5fZGlzcG9zZUZuKSB7XG4gICAgICB0aGlzLl9kaXNwb3NlRm4oKTtcbiAgICAgIHRoaXMuX2Rpc3Bvc2VGbiA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBCYXNlUG9ydGFsT3V0bGV0YCBpbnN0ZWFkLlxuICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVBvcnRhbEhvc3QgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0IHt9XG4iXX0=