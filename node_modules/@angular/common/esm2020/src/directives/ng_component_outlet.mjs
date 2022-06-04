/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactoryResolver, Directive, Injector, Input, NgModuleFactory, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Instantiates a {@link Component} type and inserts its Host View into the current View.
 * `NgComponentOutlet` provides a declarative approach for dynamic component creation.
 *
 * `NgComponentOutlet` requires a component type, if a falsy value is set the view will clear and
 * any existing component will be destroyed.
 *
 * @usageNotes
 *
 * ### Fine tune control
 *
 * You can control the component creation process by using the following optional attributes:
 *
 * * `ngComponentOutletInjector`: Optional custom {@link Injector} that will be used as parent for
 * the Component. Defaults to the injector of the current view container.
 *
 * * `ngComponentOutletContent`: Optional list of projectable nodes to insert into the content
 * section of the component, if it exists.
 *
 * * `ngComponentOutletNgModuleFactory`: Optional module factory to allow loading another
 * module dynamically, then loading a component from that module.
 *
 * ### Syntax
 *
 * Simple
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression"></ng-container>
 * ```
 *
 * Customized injector/content
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   injector: injectorExpression;
 *                                   content: contentNodesExpression;">
 * </ng-container>
 * ```
 *
 * Customized ngModuleFactory
 * ```
 * <ng-container *ngComponentOutlet="componentTypeExpression;
 *                                   ngModuleFactory: moduleFactory;">
 * </ng-container>
 * ```
 *
 * ### A simple example
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='SimpleExample'}
 *
 * A more complete example with additional options:
 *
 * {@example common/ngComponentOutlet/ts/module.ts region='CompleteExample'}
 *
 * @publicApi
 * @ngModule CommonModule
 */
export class NgComponentOutlet {
    constructor(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
        this._componentRef = null;
        this._moduleRef = null;
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._viewContainerRef.clear();
        this._componentRef = null;
        if (this.ngComponentOutlet) {
            const elInjector = this.ngComponentOutletInjector || this._viewContainerRef.parentInjector;
            if (changes['ngComponentOutletNgModuleFactory']) {
                if (this._moduleRef)
                    this._moduleRef.destroy();
                if (this.ngComponentOutletNgModuleFactory) {
                    const parentModule = elInjector.get(NgModuleRef);
                    this._moduleRef = this.ngComponentOutletNgModuleFactory.create(parentModule.injector);
                }
                else {
                    this._moduleRef = null;
                }
            }
            const componentFactoryResolver = this._moduleRef ? this._moduleRef.componentFactoryResolver :
                elInjector.get(ComponentFactoryResolver);
            const componentFactory = componentFactoryResolver.resolveComponentFactory(this.ngComponentOutlet);
            this._componentRef = this._viewContainerRef.createComponent(componentFactory, this._viewContainerRef.length, elInjector, this.ngComponentOutletContent);
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this._moduleRef)
            this._moduleRef.destroy();
    }
}
NgComponentOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgComponentOutlet, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
NgComponentOutlet.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.10", type: NgComponentOutlet, selector: "[ngComponentOutlet]", inputs: { ngComponentOutlet: "ngComponentOutlet", ngComponentOutletInjector: "ngComponentOutletInjector", ngComponentOutletContent: "ngComponentOutletContent", ngComponentOutletNgModuleFactory: "ngComponentOutletNgModuleFactory" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: NgComponentOutlet, decorators: [{
            type: Directive,
            args: [{ selector: '[ngComponentOutlet]' }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; }, propDecorators: { ngComponentOutlet: [{
                type: Input
            }], ngComponentOutletInjector: [{
                type: Input
            }], ngComponentOutletContent: [{
                type: Input
            }], ngComponentOutletNgModuleFactory: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29tcG9uZW50X291dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvZGlyZWN0aXZlcy9uZ19jb21wb25lbnRfb3V0bGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyx3QkFBd0IsRUFBZ0IsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBdUQsSUFBSSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUc1TTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0RHO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQWE1QixZQUFvQixpQkFBbUM7UUFBbkMsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUgvQyxrQkFBYSxHQUEyQixJQUFJLENBQUM7UUFDN0MsZUFBVSxHQUEwQixJQUFJLENBQUM7SUFFUyxDQUFDO0lBRTNELGFBQWE7SUFDYixXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTFCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDO1lBRTNGLElBQUksT0FBTyxDQUFDLGtDQUFrQyxDQUFDLEVBQUU7Z0JBQy9DLElBQUksSUFBSSxDQUFDLFVBQVU7b0JBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFFL0MsSUFBSSxJQUFJLENBQUMsZ0NBQWdDLEVBQUU7b0JBQ3pDLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3ZGO3FCQUFNO29CQUNMLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2lCQUN4QjthQUNGO1lBRUQsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQzFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUU1RixNQUFNLGdCQUFnQixHQUNsQix3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUU3RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQ3ZELGdCQUFnQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUMzRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRCxhQUFhO0lBQ2IsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFVBQVU7WUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pELENBQUM7O3lIQWpEVSxpQkFBaUI7NkdBQWpCLGlCQUFpQjtzR0FBakIsaUJBQWlCO2tCQUQ3QixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFDO3VHQUdqQyxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBRUcseUJBQXlCO3NCQUFqQyxLQUFLO2dCQUVHLHdCQUF3QjtzQkFBaEMsS0FBSztnQkFFRyxnQ0FBZ0M7c0JBQXhDLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIENvbXBvbmVudFJlZiwgRGlyZWN0aXZlLCBJbmplY3RvciwgSW5wdXQsIE5nTW9kdWxlRmFjdG9yeSwgTmdNb2R1bGVSZWYsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBTaW1wbGVDaGFuZ2VzLCBTdGF0aWNQcm92aWRlciwgVHlwZSwgVmlld0NvbnRhaW5lclJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuLyoqXG4gKiBJbnN0YW50aWF0ZXMgYSB7QGxpbmsgQ29tcG9uZW50fSB0eXBlIGFuZCBpbnNlcnRzIGl0cyBIb3N0IFZpZXcgaW50byB0aGUgY3VycmVudCBWaWV3LlxuICogYE5nQ29tcG9uZW50T3V0bGV0YCBwcm92aWRlcyBhIGRlY2xhcmF0aXZlIGFwcHJvYWNoIGZvciBkeW5hbWljIGNvbXBvbmVudCBjcmVhdGlvbi5cbiAqXG4gKiBgTmdDb21wb25lbnRPdXRsZXRgIHJlcXVpcmVzIGEgY29tcG9uZW50IHR5cGUsIGlmIGEgZmFsc3kgdmFsdWUgaXMgc2V0IHRoZSB2aWV3IHdpbGwgY2xlYXIgYW5kXG4gKiBhbnkgZXhpc3RpbmcgY29tcG9uZW50IHdpbGwgYmUgZGVzdHJveWVkLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEZpbmUgdHVuZSBjb250cm9sXG4gKlxuICogWW91IGNhbiBjb250cm9sIHRoZSBjb21wb25lbnQgY3JlYXRpb24gcHJvY2VzcyBieSB1c2luZyB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIGF0dHJpYnV0ZXM6XG4gKlxuICogKiBgbmdDb21wb25lbnRPdXRsZXRJbmplY3RvcmA6IE9wdGlvbmFsIGN1c3RvbSB7QGxpbmsgSW5qZWN0b3J9IHRoYXQgd2lsbCBiZSB1c2VkIGFzIHBhcmVudCBmb3JcbiAqIHRoZSBDb21wb25lbnQuIERlZmF1bHRzIHRvIHRoZSBpbmplY3RvciBvZiB0aGUgY3VycmVudCB2aWV3IGNvbnRhaW5lci5cbiAqXG4gKiAqIGBuZ0NvbXBvbmVudE91dGxldENvbnRlbnRgOiBPcHRpb25hbCBsaXN0IG9mIHByb2plY3RhYmxlIG5vZGVzIHRvIGluc2VydCBpbnRvIHRoZSBjb250ZW50XG4gKiBzZWN0aW9uIG9mIHRoZSBjb21wb25lbnQsIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiAqIGBuZ0NvbXBvbmVudE91dGxldE5nTW9kdWxlRmFjdG9yeWA6IE9wdGlvbmFsIG1vZHVsZSBmYWN0b3J5IHRvIGFsbG93IGxvYWRpbmcgYW5vdGhlclxuICogbW9kdWxlIGR5bmFtaWNhbGx5LCB0aGVuIGxvYWRpbmcgYSBjb21wb25lbnQgZnJvbSB0aGF0IG1vZHVsZS5cbiAqXG4gKiAjIyMgU3ludGF4XG4gKlxuICogU2ltcGxlXG4gKiBgYGBcbiAqIDxuZy1jb250YWluZXIgKm5nQ29tcG9uZW50T3V0bGV0PVwiY29tcG9uZW50VHlwZUV4cHJlc3Npb25cIj48L25nLWNvbnRhaW5lcj5cbiAqIGBgYFxuICpcbiAqIEN1c3RvbWl6ZWQgaW5qZWN0b3IvY29udGVudFxuICogYGBgXG4gKiA8bmctY29udGFpbmVyICpuZ0NvbXBvbmVudE91dGxldD1cImNvbXBvbmVudFR5cGVFeHByZXNzaW9uO1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdG9yOiBpbmplY3RvckV4cHJlc3Npb247XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogY29udGVudE5vZGVzRXhwcmVzc2lvbjtcIj5cbiAqIDwvbmctY29udGFpbmVyPlxuICogYGBgXG4gKlxuICogQ3VzdG9taXplZCBuZ01vZHVsZUZhY3RvcnlcbiAqIGBgYFxuICogPG5nLWNvbnRhaW5lciAqbmdDb21wb25lbnRPdXRsZXQ9XCJjb21wb25lbnRUeXBlRXhwcmVzc2lvbjtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ01vZHVsZUZhY3Rvcnk6IG1vZHVsZUZhY3Rvcnk7XCI+XG4gKiA8L25nLWNvbnRhaW5lcj5cbiAqIGBgYFxuICpcbiAqICMjIyBBIHNpbXBsZSBleGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9uZ0NvbXBvbmVudE91dGxldC90cy9tb2R1bGUudHMgcmVnaW9uPSdTaW1wbGVFeGFtcGxlJ31cbiAqXG4gKiBBIG1vcmUgY29tcGxldGUgZXhhbXBsZSB3aXRoIGFkZGl0aW9uYWwgb3B0aW9uczpcbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL25nQ29tcG9uZW50T3V0bGV0L3RzL21vZHVsZS50cyByZWdpb249J0NvbXBsZXRlRXhhbXBsZSd9XG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIENvbW1vbk1vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ0NvbXBvbmVudE91dGxldF0nfSlcbmV4cG9ydCBjbGFzcyBOZ0NvbXBvbmVudE91dGxldCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG5nQ29tcG9uZW50T3V0bGV0ITogVHlwZTxhbnk+O1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgbmdDb21wb25lbnRPdXRsZXRJbmplY3RvciE6IEluamVjdG9yO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgbmdDb21wb25lbnRPdXRsZXRDb250ZW50ITogYW55W11bXTtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG5nQ29tcG9uZW50T3V0bGV0TmdNb2R1bGVGYWN0b3J5ITogTmdNb2R1bGVGYWN0b3J5PGFueT47XG5cbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfbW9kdWxlUmVmOiBOZ01vZHVsZVJlZjxhbnk+fG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHt9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuICAgIHRoaXMuX2NvbXBvbmVudFJlZiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5uZ0NvbXBvbmVudE91dGxldCkge1xuICAgICAgY29uc3QgZWxJbmplY3RvciA9IHRoaXMubmdDb21wb25lbnRPdXRsZXRJbmplY3RvciB8fCB0aGlzLl92aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yO1xuXG4gICAgICBpZiAoY2hhbmdlc1snbmdDb21wb25lbnRPdXRsZXROZ01vZHVsZUZhY3RvcnknXSkge1xuICAgICAgICBpZiAodGhpcy5fbW9kdWxlUmVmKSB0aGlzLl9tb2R1bGVSZWYuZGVzdHJveSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm5nQ29tcG9uZW50T3V0bGV0TmdNb2R1bGVGYWN0b3J5KSB7XG4gICAgICAgICAgY29uc3QgcGFyZW50TW9kdWxlID0gZWxJbmplY3Rvci5nZXQoTmdNb2R1bGVSZWYpO1xuICAgICAgICAgIHRoaXMuX21vZHVsZVJlZiA9IHRoaXMubmdDb21wb25lbnRPdXRsZXROZ01vZHVsZUZhY3RvcnkuY3JlYXRlKHBhcmVudE1vZHVsZS5pbmplY3Rvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fbW9kdWxlUmVmID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIgPSB0aGlzLl9tb2R1bGVSZWYgPyB0aGlzLl9tb2R1bGVSZWYuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsSW5qZWN0b3IuZ2V0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPVxuICAgICAgICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0aGlzLm5nQ29tcG9uZW50T3V0bGV0KTtcblxuICAgICAgdGhpcy5fY29tcG9uZW50UmVmID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoXG4gICAgICAgICAgY29tcG9uZW50RmFjdG9yeSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5sZW5ndGgsIGVsSW5qZWN0b3IsXG4gICAgICAgICAgdGhpcy5uZ0NvbXBvbmVudE91dGxldENvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX21vZHVsZVJlZikgdGhpcy5fbW9kdWxlUmVmLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19