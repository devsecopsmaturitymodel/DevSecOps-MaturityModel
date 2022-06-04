/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactoryResolver, Directive, EventEmitter, NgModule, Output, TemplateRef, ViewContainerRef, Inject, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BasePortalOutlet, TemplatePortal } from './portal';
import * as i0 from "@angular/core";
/**
 * Directive version of a `TemplatePortal`. Because the directive *is* a TemplatePortal,
 * the directive instance itself can be attached to a host, enabling declarative use of portals.
 */
export class CdkPortal extends TemplatePortal {
    constructor(templateRef, viewContainerRef) {
        super(templateRef, viewContainerRef);
    }
}
CdkPortal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkPortal, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
CdkPortal.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkPortal, selector: "[cdkPortal]", exportAs: ["cdkPortal"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkPortal, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkPortal]',
                    exportAs: 'cdkPortal',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; } });
/**
 * @deprecated Use `CdkPortal` instead.
 * @breaking-change 9.0.0
 */
export class TemplatePortalDirective extends CdkPortal {
}
TemplatePortalDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: TemplatePortalDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
TemplatePortalDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: TemplatePortalDirective, selector: "[cdk-portal], [portal]", providers: [
        {
            provide: CdkPortal,
            useExisting: TemplatePortalDirective,
        },
    ], exportAs: ["cdkPortal"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: TemplatePortalDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdk-portal], [portal]',
                    exportAs: 'cdkPortal',
                    providers: [
                        {
                            provide: CdkPortal,
                            useExisting: TemplatePortalDirective,
                        },
                    ],
                }]
        }] });
/**
 * Directive version of a PortalOutlet. Because the directive *is* a PortalOutlet, portals can be
 * directly attached to it, enabling declarative use.
 *
 * Usage:
 * `<ng-template [cdkPortalOutlet]="greeting"></ng-template>`
 */
export class CdkPortalOutlet extends BasePortalOutlet {
    constructor(_componentFactoryResolver, _viewContainerRef, 
    /**
     * @deprecated `_document` parameter to be made required.
     * @breaking-change 9.0.0
     */
    _document) {
        super();
        this._componentFactoryResolver = _componentFactoryResolver;
        this._viewContainerRef = _viewContainerRef;
        /** Whether the portal component is initialized. */
        this._isInitialized = false;
        /** Emits when a portal is attached to the outlet. */
        this.attached = new EventEmitter();
        /**
         * Attaches the given DomPortal to this PortalHost by moving all of the portal content into it.
         * @param portal Portal to be attached.
         * @deprecated To be turned into a method.
         * @breaking-change 10.0.0
         */
        this.attachDomPortal = (portal) => {
            // @breaking-change 9.0.0 Remove check and error once the
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
            portal.setAttachedHost(this);
            element.parentNode.insertBefore(anchorNode, element);
            this._getRootNode().appendChild(element);
            this._attachedPortal = portal;
            super.setDisposeFn(() => {
                if (anchorNode.parentNode) {
                    anchorNode.parentNode.replaceChild(element, anchorNode);
                }
            });
        };
        this._document = _document;
    }
    /** Portal associated with the Portal outlet. */
    get portal() {
        return this._attachedPortal;
    }
    set portal(portal) {
        // Ignore the cases where the `portal` is set to a falsy value before the lifecycle hooks have
        // run. This handles the cases where the user might do something like `<div cdkPortalOutlet>`
        // and attach a portal programmatically in the parent component. When Angular does the first CD
        // round, it will fire the setter with empty string, causing the user's content to be cleared.
        if (this.hasAttached() && !portal && !this._isInitialized) {
            return;
        }
        if (this.hasAttached()) {
            super.detach();
        }
        if (portal) {
            super.attach(portal);
        }
        this._attachedPortal = portal || null;
    }
    /** Component or view reference that is attached to the portal. */
    get attachedRef() {
        return this._attachedRef;
    }
    ngOnInit() {
        this._isInitialized = true;
    }
    ngOnDestroy() {
        super.dispose();
        this._attachedPortal = null;
        this._attachedRef = null;
    }
    /**
     * Attach the given ComponentPortal to this PortalOutlet using the ComponentFactoryResolver.
     *
     * @param portal Portal to be attached to the portal outlet.
     * @returns Reference to the created component.
     */
    attachComponentPortal(portal) {
        portal.setAttachedHost(this);
        // If the portal specifies an origin, use that as the logical location of the component
        // in the application tree. Otherwise use the location of this PortalOutlet.
        const viewContainerRef = portal.viewContainerRef != null ? portal.viewContainerRef : this._viewContainerRef;
        const resolver = portal.componentFactoryResolver || this._componentFactoryResolver;
        const componentFactory = resolver.resolveComponentFactory(portal.component);
        const ref = viewContainerRef.createComponent(componentFactory, viewContainerRef.length, portal.injector || viewContainerRef.injector);
        // If we're using a view container that's different from the injected one (e.g. when the portal
        // specifies its own) we need to move the component into the outlet, otherwise it'll be rendered
        // inside of the alternate view container.
        if (viewContainerRef !== this._viewContainerRef) {
            this._getRootNode().appendChild(ref.hostView.rootNodes[0]);
        }
        super.setDisposeFn(() => ref.destroy());
        this._attachedPortal = portal;
        this._attachedRef = ref;
        this.attached.emit(ref);
        return ref;
    }
    /**
     * Attach the given TemplatePortal to this PortalHost as an embedded View.
     * @param portal Portal to be attached.
     * @returns Reference to the created embedded view.
     */
    attachTemplatePortal(portal) {
        portal.setAttachedHost(this);
        const viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context);
        super.setDisposeFn(() => this._viewContainerRef.clear());
        this._attachedPortal = portal;
        this._attachedRef = viewRef;
        this.attached.emit(viewRef);
        return viewRef;
    }
    /** Gets the root node of the portal outlet. */
    _getRootNode() {
        const nativeElement = this._viewContainerRef.element.nativeElement;
        // The directive could be set on a template which will result in a comment
        // node being the root. Use the comment's parent node if that is the case.
        return (nativeElement.nodeType === nativeElement.ELEMENT_NODE
            ? nativeElement
            : nativeElement.parentNode);
    }
}
CdkPortalOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkPortalOutlet, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
CdkPortalOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: { portal: ["cdkPortalOutlet", "portal"] }, outputs: { attached: "attached" }, exportAs: ["cdkPortalOutlet"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkPortalOutlet, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkPortalOutlet]',
                    exportAs: 'cdkPortalOutlet',
                    inputs: ['portal: cdkPortalOutlet'],
                }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { attached: [{
                type: Output
            }] } });
/**
 * @deprecated Use `CdkPortalOutlet` instead.
 * @breaking-change 9.0.0
 */
export class PortalHostDirective extends CdkPortalOutlet {
}
PortalHostDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PortalHostDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
PortalHostDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: PortalHostDirective, selector: "[cdkPortalHost], [portalHost]", inputs: { portal: ["cdkPortalHost", "portal"] }, providers: [
        {
            provide: CdkPortalOutlet,
            useExisting: PortalHostDirective,
        },
    ], exportAs: ["cdkPortalHost"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PortalHostDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkPortalHost], [portalHost]',
                    exportAs: 'cdkPortalHost',
                    inputs: ['portal: cdkPortalHost'],
                    providers: [
                        {
                            provide: CdkPortalOutlet,
                            useExisting: PortalHostDirective,
                        },
                    ],
                }]
        }] });
export class PortalModule {
}
PortalModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PortalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PortalModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PortalModule, declarations: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective], exports: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective] });
PortalModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PortalModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PortalModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective],
                    declarations: [CdkPortal, CdkPortalOutlet, TemplatePortalDirective, PortalHostDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGFsLWRpcmVjdGl2ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3BvcnRhbC9wb3J0YWwtZGlyZWN0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsd0JBQXdCLEVBRXhCLFNBQVMsRUFFVCxZQUFZLEVBQ1osUUFBUSxFQUdSLE1BQU0sRUFDTixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGdCQUFnQixFQUEyQixjQUFjLEVBQVksTUFBTSxVQUFVLENBQUM7O0FBRTlGOzs7R0FHRztBQUtILE1BQU0sT0FBTyxTQUFVLFNBQVEsY0FBYztJQUMzQyxZQUFZLFdBQTZCLEVBQUUsZ0JBQWtDO1FBQzNFLEtBQUssQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN2QyxDQUFDOztzR0FIVSxTQUFTOzBGQUFULFNBQVM7MkZBQVQsU0FBUztrQkFKckIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsUUFBUSxFQUFFLFdBQVc7aUJBQ3RCOztBQU9EOzs7R0FHRztBQVdILE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxTQUFTOztvSEFBekMsdUJBQXVCO3dHQUF2Qix1QkFBdUIsaURBUHZCO1FBQ1Q7WUFDRSxPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsdUJBQXVCO1NBQ3JDO0tBQ0Y7MkZBRVUsdUJBQXVCO2tCQVZuQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRSxXQUFXO29CQUNyQixTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLFNBQVM7NEJBQ2xCLFdBQVcseUJBQXlCO3lCQUNyQztxQkFDRjtp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QUFZSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsZUFBZTs7Z0hBQTNDLG1CQUFtQjtvR0FBbkIsbUJBQW1CLHlHQVBuQjtRQUNUO1lBQ0UsT0FBTyxFQUFFLGVBQWU7WUFDeEIsV0FBVyxFQUFFLG1CQUFtQjtTQUNqQztLQUNGOzJGQUVVLG1CQUFtQjtrQkFYL0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsK0JBQStCO29CQUN6QyxRQUFRLEVBQUUsZUFBZTtvQkFDekIsTUFBTSxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ2pDLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsZUFBZTs0QkFDeEIsV0FBVyxxQkFBcUI7eUJBQ2pDO3FCQUNGO2lCQUNGOztBQU9ELE1BQU0sT0FBTyxZQUFZOzt5R0FBWixZQUFZOzBHQUFaLFlBQVksaUJBck9aLFNBQVMsRUF1Q1QsZUFBZSxFQW5CZix1QkFBdUIsRUEyTXZCLG1CQUFtQixhQS9ObkIsU0FBUyxFQXVDVCxlQUFlLEVBbkJmLHVCQUF1QixFQTJNdkIsbUJBQW1COzBHQU1uQixZQUFZOzJGQUFaLFlBQVk7a0JBSnhCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxtQkFBbUIsQ0FBQztvQkFDbkYsWUFBWSxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxtQkFBbUIsQ0FBQztpQkFDekYiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIE5nTW9kdWxlLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgSW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Jhc2VQb3J0YWxPdXRsZXQsIENvbXBvbmVudFBvcnRhbCwgUG9ydGFsLCBUZW1wbGF0ZVBvcnRhbCwgRG9tUG9ydGFsfSBmcm9tICcuL3BvcnRhbCc7XG5cbi8qKlxuICogRGlyZWN0aXZlIHZlcnNpb24gb2YgYSBgVGVtcGxhdGVQb3J0YWxgLiBCZWNhdXNlIHRoZSBkaXJlY3RpdmUgKmlzKiBhIFRlbXBsYXRlUG9ydGFsLFxuICogdGhlIGRpcmVjdGl2ZSBpbnN0YW5jZSBpdHNlbGYgY2FuIGJlIGF0dGFjaGVkIHRvIGEgaG9zdCwgZW5hYmxpbmcgZGVjbGFyYXRpdmUgdXNlIG9mIHBvcnRhbHMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtQb3J0YWxdJyxcbiAgZXhwb3J0QXM6ICdjZGtQb3J0YWwnLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtQb3J0YWwgZXh0ZW5kcyBUZW1wbGF0ZVBvcnRhbCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+LCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7XG4gICAgc3VwZXIodGVtcGxhdGVSZWYsIHZpZXdDb250YWluZXJSZWYpO1xuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBDZGtQb3J0YWxgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGstcG9ydGFsXSwgW3BvcnRhbF0nLFxuICBleHBvcnRBczogJ2Nka1BvcnRhbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IENka1BvcnRhbCxcbiAgICAgIHVzZUV4aXN0aW5nOiBUZW1wbGF0ZVBvcnRhbERpcmVjdGl2ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZVBvcnRhbERpcmVjdGl2ZSBleHRlbmRzIENka1BvcnRhbCB7fVxuXG4vKipcbiAqIFBvc3NpYmxlIGF0dGFjaGVkIHJlZmVyZW5jZXMgdG8gdGhlIENka1BvcnRhbE91dGxldC5cbiAqL1xuZXhwb3J0IHR5cGUgQ2RrUG9ydGFsT3V0bGV0QXR0YWNoZWRSZWYgPSBDb21wb25lbnRSZWY8YW55PiB8IEVtYmVkZGVkVmlld1JlZjxhbnk+IHwgbnVsbDtcblxuLyoqXG4gKiBEaXJlY3RpdmUgdmVyc2lvbiBvZiBhIFBvcnRhbE91dGxldC4gQmVjYXVzZSB0aGUgZGlyZWN0aXZlICppcyogYSBQb3J0YWxPdXRsZXQsIHBvcnRhbHMgY2FuIGJlXG4gKiBkaXJlY3RseSBhdHRhY2hlZCB0byBpdCwgZW5hYmxpbmcgZGVjbGFyYXRpdmUgdXNlLlxuICpcbiAqIFVzYWdlOlxuICogYDxuZy10ZW1wbGF0ZSBbY2RrUG9ydGFsT3V0bGV0XT1cImdyZWV0aW5nXCI+PC9uZy10ZW1wbGF0ZT5gXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtQb3J0YWxPdXRsZXRdJyxcbiAgZXhwb3J0QXM6ICdjZGtQb3J0YWxPdXRsZXQnLFxuICBpbnB1dHM6IFsncG9ydGFsOiBjZGtQb3J0YWxPdXRsZXQnXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2RrUG9ydGFsT3V0bGV0IGV4dGVuZHMgQmFzZVBvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBwb3J0YWwgY29tcG9uZW50IGlzIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5LWF0dGFjaGVkIGNvbXBvbmVudC92aWV3IHJlZi4gKi9cbiAgcHJpdmF0ZSBfYXR0YWNoZWRSZWY6IENka1BvcnRhbE91dGxldEF0dGFjaGVkUmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2RvY3VtZW50YCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAgICovXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50PzogYW55LFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqIFBvcnRhbCBhc3NvY2lhdGVkIHdpdGggdGhlIFBvcnRhbCBvdXRsZXQuICovXG4gIGdldCBwb3J0YWwoKTogUG9ydGFsPGFueT4gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRQb3J0YWw7XG4gIH1cblxuICBzZXQgcG9ydGFsKHBvcnRhbDogUG9ydGFsPGFueT4gfCBudWxsIHwgdW5kZWZpbmVkIHwgJycpIHtcbiAgICAvLyBJZ25vcmUgdGhlIGNhc2VzIHdoZXJlIHRoZSBgcG9ydGFsYCBpcyBzZXQgdG8gYSBmYWxzeSB2YWx1ZSBiZWZvcmUgdGhlIGxpZmVjeWNsZSBob29rcyBoYXZlXG4gICAgLy8gcnVuLiBUaGlzIGhhbmRsZXMgdGhlIGNhc2VzIHdoZXJlIHRoZSB1c2VyIG1pZ2h0IGRvIHNvbWV0aGluZyBsaWtlIGA8ZGl2IGNka1BvcnRhbE91dGxldD5gXG4gICAgLy8gYW5kIGF0dGFjaCBhIHBvcnRhbCBwcm9ncmFtbWF0aWNhbGx5IGluIHRoZSBwYXJlbnQgY29tcG9uZW50LiBXaGVuIEFuZ3VsYXIgZG9lcyB0aGUgZmlyc3QgQ0RcbiAgICAvLyByb3VuZCwgaXQgd2lsbCBmaXJlIHRoZSBzZXR0ZXIgd2l0aCBlbXB0eSBzdHJpbmcsIGNhdXNpbmcgdGhlIHVzZXIncyBjb250ZW50IHRvIGJlIGNsZWFyZWQuXG4gICAgaWYgKHRoaXMuaGFzQXR0YWNoZWQoKSAmJiAhcG9ydGFsICYmICF0aGlzLl9pc0luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgc3VwZXIuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgaWYgKHBvcnRhbCkge1xuICAgICAgc3VwZXIuYXR0YWNoKHBvcnRhbCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYXR0YWNoZWRQb3J0YWwgPSBwb3J0YWwgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuIGEgcG9ydGFsIGlzIGF0dGFjaGVkIHRvIHRoZSBvdXRsZXQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhdHRhY2hlZDogRXZlbnRFbWl0dGVyPENka1BvcnRhbE91dGxldEF0dGFjaGVkUmVmPiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxDZGtQb3J0YWxPdXRsZXRBdHRhY2hlZFJlZj4oKTtcblxuICAvKiogQ29tcG9uZW50IG9yIHZpZXcgcmVmZXJlbmNlIHRoYXQgaXMgYXR0YWNoZWQgdG8gdGhlIHBvcnRhbC4gKi9cbiAgZ2V0IGF0dGFjaGVkUmVmKCk6IENka1BvcnRhbE91dGxldEF0dGFjaGVkUmVmIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0YWNoZWRSZWY7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IG51bGw7XG4gICAgdGhpcy5fYXR0YWNoZWRSZWYgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCB0aGUgZ2l2ZW4gQ29tcG9uZW50UG9ydGFsIHRvIHRoaXMgUG9ydGFsT3V0bGV0IHVzaW5nIHRoZSBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkIHRvIHRoZSBwb3J0YWwgb3V0bGV0LlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIGNyZWF0ZWQgY29tcG9uZW50LlxuICAgKi9cbiAgYXR0YWNoQ29tcG9uZW50UG9ydGFsPFQ+KHBvcnRhbDogQ29tcG9uZW50UG9ydGFsPFQ+KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICBwb3J0YWwuc2V0QXR0YWNoZWRIb3N0KHRoaXMpO1xuXG4gICAgLy8gSWYgdGhlIHBvcnRhbCBzcGVjaWZpZXMgYW4gb3JpZ2luLCB1c2UgdGhhdCBhcyB0aGUgbG9naWNhbCBsb2NhdGlvbiBvZiB0aGUgY29tcG9uZW50XG4gICAgLy8gaW4gdGhlIGFwcGxpY2F0aW9uIHRyZWUuIE90aGVyd2lzZSB1c2UgdGhlIGxvY2F0aW9uIG9mIHRoaXMgUG9ydGFsT3V0bGV0LlxuICAgIGNvbnN0IHZpZXdDb250YWluZXJSZWYgPVxuICAgICAgcG9ydGFsLnZpZXdDb250YWluZXJSZWYgIT0gbnVsbCA/IHBvcnRhbC52aWV3Q29udGFpbmVyUmVmIDogdGhpcy5fdmlld0NvbnRhaW5lclJlZjtcblxuICAgIGNvbnN0IHJlc29sdmVyID0gcG9ydGFsLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciB8fCB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBvcnRhbC5jb21wb25lbnQpO1xuICAgIGNvbnN0IHJlZiA9IHZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KFxuICAgICAgY29tcG9uZW50RmFjdG9yeSxcbiAgICAgIHZpZXdDb250YWluZXJSZWYubGVuZ3RoLFxuICAgICAgcG9ydGFsLmluamVjdG9yIHx8IHZpZXdDb250YWluZXJSZWYuaW5qZWN0b3IsXG4gICAgKTtcblxuICAgIC8vIElmIHdlJ3JlIHVzaW5nIGEgdmlldyBjb250YWluZXIgdGhhdCdzIGRpZmZlcmVudCBmcm9tIHRoZSBpbmplY3RlZCBvbmUgKGUuZy4gd2hlbiB0aGUgcG9ydGFsXG4gICAgLy8gc3BlY2lmaWVzIGl0cyBvd24pIHdlIG5lZWQgdG8gbW92ZSB0aGUgY29tcG9uZW50IGludG8gdGhlIG91dGxldCwgb3RoZXJ3aXNlIGl0J2xsIGJlIHJlbmRlcmVkXG4gICAgLy8gaW5zaWRlIG9mIHRoZSBhbHRlcm5hdGUgdmlldyBjb250YWluZXIuXG4gICAgaWYgKHZpZXdDb250YWluZXJSZWYgIT09IHRoaXMuX3ZpZXdDb250YWluZXJSZWYpIHtcbiAgICAgIHRoaXMuX2dldFJvb3ROb2RlKCkuYXBwZW5kQ2hpbGQoKHJlZi5ob3N0VmlldyBhcyBFbWJlZGRlZFZpZXdSZWY8YW55Pikucm9vdE5vZGVzWzBdKTtcbiAgICB9XG5cbiAgICBzdXBlci5zZXREaXNwb3NlRm4oKCkgPT4gcmVmLmRlc3Ryb3koKSk7XG4gICAgdGhpcy5fYXR0YWNoZWRQb3J0YWwgPSBwb3J0YWw7XG4gICAgdGhpcy5fYXR0YWNoZWRSZWYgPSByZWY7XG4gICAgdGhpcy5hdHRhY2hlZC5lbWl0KHJlZik7XG5cbiAgICByZXR1cm4gcmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCB0aGUgZ2l2ZW4gVGVtcGxhdGVQb3J0YWwgdG8gdGhpcyBQb3J0YWxIb3N0IGFzIGFuIGVtYmVkZGVkIFZpZXcuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkLlxuICAgKiBAcmV0dXJucyBSZWZlcmVuY2UgdG8gdGhlIGNyZWF0ZWQgZW1iZWRkZWQgdmlldy5cbiAgICovXG4gIGF0dGFjaFRlbXBsYXRlUG9ydGFsPEM+KHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8Qz4pOiBFbWJlZGRlZFZpZXdSZWY8Qz4ge1xuICAgIHBvcnRhbC5zZXRBdHRhY2hlZEhvc3QodGhpcyk7XG4gICAgY29uc3Qgdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHBvcnRhbC50ZW1wbGF0ZVJlZiwgcG9ydGFsLmNvbnRleHQpO1xuICAgIHN1cGVyLnNldERpc3Bvc2VGbigoKSA9PiB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNsZWFyKCkpO1xuXG4gICAgdGhpcy5fYXR0YWNoZWRQb3J0YWwgPSBwb3J0YWw7XG4gICAgdGhpcy5fYXR0YWNoZWRSZWYgPSB2aWV3UmVmO1xuICAgIHRoaXMuYXR0YWNoZWQuZW1pdCh2aWV3UmVmKTtcblxuICAgIHJldHVybiB2aWV3UmVmO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVzIHRoZSBnaXZlbiBEb21Qb3J0YWwgdG8gdGhpcyBQb3J0YWxIb3N0IGJ5IG1vdmluZyBhbGwgb2YgdGhlIHBvcnRhbCBjb250ZW50IGludG8gaXQuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIGF0dGFjaGVkLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIG1ldGhvZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIG92ZXJyaWRlIGF0dGFjaERvbVBvcnRhbCA9IChwb3J0YWw6IERvbVBvcnRhbCkgPT4ge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgOS4wLjAgUmVtb3ZlIGNoZWNrIGFuZCBlcnJvciBvbmNlIHRoZVxuICAgIC8vIGBfZG9jdW1lbnRgIGNvbnN0cnVjdG9yIHBhcmFtZXRlciBpcyByZXF1aXJlZC5cbiAgICBpZiAoIXRoaXMuX2RvY3VtZW50ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQ2Fubm90IGF0dGFjaCBET00gcG9ydGFsIHdpdGhvdXQgX2RvY3VtZW50IGNvbnN0cnVjdG9yIHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSBwb3J0YWwuZWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQucGFyZW50Tm9kZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0RPTSBwb3J0YWwgY29udGVudCBtdXN0IGJlIGF0dGFjaGVkIHRvIGEgcGFyZW50IG5vZGUuJyk7XG4gICAgfVxuXG4gICAgLy8gQW5jaG9yIHVzZWQgdG8gc2F2ZSB0aGUgZWxlbWVudCdzIHByZXZpb3VzIHBvc2l0aW9uIHNvXG4gICAgLy8gdGhhdCB3ZSBjYW4gcmVzdG9yZSBpdCB3aGVuIHRoZSBwb3J0YWwgaXMgZGV0YWNoZWQuXG4gICAgY29uc3QgYW5jaG9yTm9kZSA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ2RvbS1wb3J0YWwnKTtcblxuICAgIHBvcnRhbC5zZXRBdHRhY2hlZEhvc3QodGhpcyk7XG4gICAgZWxlbWVudC5wYXJlbnROb2RlIS5pbnNlcnRCZWZvcmUoYW5jaG9yTm9kZSwgZWxlbWVudCk7XG4gICAgdGhpcy5fZ2V0Um9vdE5vZGUoKS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICB0aGlzLl9hdHRhY2hlZFBvcnRhbCA9IHBvcnRhbDtcblxuICAgIHN1cGVyLnNldERpc3Bvc2VGbigoKSA9PiB7XG4gICAgICBpZiAoYW5jaG9yTm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgIGFuY2hvck5vZGUucGFyZW50Tm9kZSEucmVwbGFjZUNoaWxkKGVsZW1lbnQsIGFuY2hvck5vZGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKiBHZXRzIHRoZSByb290IG5vZGUgb2YgdGhlIHBvcnRhbCBvdXRsZXQuICovXG4gIHByaXZhdGUgX2dldFJvb3ROb2RlKCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBuYXRpdmVFbGVtZW50OiBOb2RlID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBUaGUgZGlyZWN0aXZlIGNvdWxkIGJlIHNldCBvbiBhIHRlbXBsYXRlIHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgY29tbWVudFxuICAgIC8vIG5vZGUgYmVpbmcgdGhlIHJvb3QuIFVzZSB0aGUgY29tbWVudCdzIHBhcmVudCBub2RlIGlmIHRoYXQgaXMgdGhlIGNhc2UuXG4gICAgcmV0dXJuIChcbiAgICAgIG5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgPT09IG5hdGl2ZUVsZW1lbnQuRUxFTUVOVF9OT0RFXG4gICAgICAgID8gbmF0aXZlRWxlbWVudFxuICAgICAgICA6IG5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSFcbiAgICApIGFzIEhUTUxFbGVtZW50O1xuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBDZGtQb3J0YWxPdXRsZXRgIGluc3RlYWQuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjZGtQb3J0YWxIb3N0XSwgW3BvcnRhbEhvc3RdJyxcbiAgZXhwb3J0QXM6ICdjZGtQb3J0YWxIb3N0JyxcbiAgaW5wdXRzOiBbJ3BvcnRhbDogY2RrUG9ydGFsSG9zdCddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBDZGtQb3J0YWxPdXRsZXQsXG4gICAgICB1c2VFeGlzdGluZzogUG9ydGFsSG9zdERpcmVjdGl2ZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBQb3J0YWxIb3N0RGlyZWN0aXZlIGV4dGVuZHMgQ2RrUG9ydGFsT3V0bGV0IHt9XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtDZGtQb3J0YWwsIENka1BvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWxEaXJlY3RpdmUsIFBvcnRhbEhvc3REaXJlY3RpdmVdLFxuICBkZWNsYXJhdGlvbnM6IFtDZGtQb3J0YWwsIENka1BvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWxEaXJlY3RpdmUsIFBvcnRhbEhvc3REaXJlY3RpdmVdLFxufSlcbmV4cG9ydCBjbGFzcyBQb3J0YWxNb2R1bGUge31cbiJdfQ==