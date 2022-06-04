/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BidiModule } from '@angular/cdk/bidi';
import { NgModule } from '@angular/core';
import { CdkFixedSizeVirtualScroll } from './fixed-size-virtual-scroll';
import { CdkScrollable } from './scrollable';
import { CdkVirtualForOf } from './virtual-for-of';
import { CdkVirtualScrollViewport } from './virtual-scroll-viewport';
import * as i0 from "@angular/core";
export class CdkScrollableModule {
}
CdkScrollableModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkScrollableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CdkScrollableModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkScrollableModule, declarations: [CdkScrollable], exports: [CdkScrollable] });
CdkScrollableModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkScrollableModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CdkScrollableModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [CdkScrollable],
                    declarations: [CdkScrollable],
                }]
        }] });
/**
 * @docs-primary-export
 */
export class ScrollingModule {
}
ScrollingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ScrollingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollingModule, declarations: [CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport], imports: [BidiModule, CdkScrollableModule], exports: [BidiModule, CdkScrollableModule, CdkFixedSizeVirtualScroll,
        CdkVirtualForOf,
        CdkVirtualScrollViewport] });
ScrollingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollingModule, imports: [[BidiModule, CdkScrollableModule], BidiModule, CdkScrollableModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScrollingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [BidiModule, CdkScrollableModule],
                    exports: [
                        BidiModule,
                        CdkScrollableModule,
                        CdkFixedSizeVirtualScroll,
                        CdkVirtualForOf,
                        CdkVirtualScrollViewport,
                    ],
                    declarations: [CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsaW5nLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2Nyb2xsaW5nL3Njcm9sbGluZy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDdEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBTW5FLE1BQU0sT0FBTyxtQkFBbUI7O2dIQUFuQixtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkFGZixhQUFhLGFBRGxCLGFBQWE7aUhBR1osbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBSi9CLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUN4QixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7aUJBQzlCOztBQUdEOztHQUVHO0FBWUgsTUFBTSxPQUFPLGVBQWU7OzRHQUFmLGVBQWU7NkdBQWYsZUFBZSxpQkFGWCx5QkFBeUIsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLGFBUnpFLFVBQVUsRUFOVCxtQkFBbUIsYUFRNUIsVUFBVSxFQVJELG1CQUFtQixFQVU1Qix5QkFBeUI7UUFDekIsZUFBZTtRQUNmLHdCQUF3Qjs2R0FJZixlQUFlLFlBVmpCLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLEVBRXhDLFVBQVUsRUFSRCxtQkFBbUI7MkZBZ0JuQixlQUFlO2tCQVgzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQztvQkFDMUMsT0FBTyxFQUFFO3dCQUNQLFVBQVU7d0JBQ1YsbUJBQW1CO3dCQUNuQix5QkFBeUI7d0JBQ3pCLGVBQWU7d0JBQ2Ysd0JBQXdCO3FCQUN6QjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUM7aUJBQ3JGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QmlkaU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGx9IGZyb20gJy4vZml4ZWQtc2l6ZS12aXJ0dWFsLXNjcm9sbCc7XG5pbXBvcnQge0Nka1Njcm9sbGFibGV9IGZyb20gJy4vc2Nyb2xsYWJsZSc7XG5pbXBvcnQge0Nka1ZpcnR1YWxGb3JPZn0gZnJvbSAnLi92aXJ0dWFsLWZvci1vZic7XG5pbXBvcnQge0Nka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydH0gZnJvbSAnLi92aXJ0dWFsLXNjcm9sbC12aWV3cG9ydCc7XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IFtDZGtTY3JvbGxhYmxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ2RrU2Nyb2xsYWJsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENka1Njcm9sbGFibGVNb2R1bGUge31cblxuLyoqXG4gKiBAZG9jcy1wcmltYXJ5LWV4cG9ydFxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQmlkaU1vZHVsZSwgQ2RrU2Nyb2xsYWJsZU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBCaWRpTW9kdWxlLFxuICAgIENka1Njcm9sbGFibGVNb2R1bGUsXG4gICAgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCxcbiAgICBDZGtWaXJ0dWFsRm9yT2YsXG4gICAgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLCBDZGtWaXJ0dWFsRm9yT2YsIENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydF0sXG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbGluZ01vZHVsZSB7fVxuIl19