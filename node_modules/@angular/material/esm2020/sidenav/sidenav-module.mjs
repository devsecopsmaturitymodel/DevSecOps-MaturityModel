/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from './drawer';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from './sidenav';
import * as i0 from "@angular/core";
export class MatSidenavModule {
}
MatSidenavModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSidenavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSidenavModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSidenavModule, declarations: [MatDrawer,
        MatDrawerContainer,
        MatDrawerContent,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent], imports: [CommonModule, MatCommonModule, CdkScrollableModule], exports: [CdkScrollableModule,
        MatCommonModule,
        MatDrawer,
        MatDrawerContainer,
        MatDrawerContent,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent] });
MatSidenavModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSidenavModule, imports: [[CommonModule, MatCommonModule, CdkScrollableModule], CdkScrollableModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatSidenavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, CdkScrollableModule],
                    exports: [
                        CdkScrollableModule,
                        MatCommonModule,
                        MatDrawer,
                        MatDrawerContainer,
                        MatDrawerContent,
                        MatSidenav,
                        MatSidenavContainer,
                        MatSidenavContent,
                    ],
                    declarations: [
                        MatDrawer,
                        MatDrawerContainer,
                        MatDrawerContent,
                        MatSidenav,
                        MatSidenavContainer,
                        MatSidenavContent,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi9zaWRlbmF2LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN6RSxPQUFPLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sV0FBVyxDQUFDOztBQXVCN0UsTUFBTSxPQUFPLGdCQUFnQjs7NkdBQWhCLGdCQUFnQjs4R0FBaEIsZ0JBQWdCLGlCQVJ6QixTQUFTO1FBQ1Qsa0JBQWtCO1FBQ2xCLGdCQUFnQjtRQUNoQixVQUFVO1FBQ1YsbUJBQW1CO1FBQ25CLGlCQUFpQixhQWpCVCxZQUFZLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixhQUUxRCxtQkFBbUI7UUFDbkIsZUFBZTtRQUNmLFNBQVM7UUFDVCxrQkFBa0I7UUFDbEIsZ0JBQWdCO1FBQ2hCLFVBQVU7UUFDVixtQkFBbUI7UUFDbkIsaUJBQWlCOzhHQVdSLGdCQUFnQixZQXBCbEIsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixDQUFDLEVBRTNELG1CQUFtQjtRQUNuQixlQUFlOzJGQWlCTixnQkFBZ0I7a0JBckI1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsbUJBQW1CLENBQUM7b0JBQzdELE9BQU8sRUFBRTt3QkFDUCxtQkFBbUI7d0JBQ25CLGVBQWU7d0JBQ2YsU0FBUzt3QkFDVCxrQkFBa0I7d0JBQ2xCLGdCQUFnQjt3QkFDaEIsVUFBVTt3QkFDVixtQkFBbUI7d0JBQ25CLGlCQUFpQjtxQkFDbEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFNBQVM7d0JBQ1Qsa0JBQWtCO3dCQUNsQixnQkFBZ0I7d0JBQ2hCLFVBQVU7d0JBQ1YsbUJBQW1CO3dCQUNuQixpQkFBaUI7cUJBQ2xCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Nka1Njcm9sbGFibGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0RHJhd2VyLCBNYXREcmF3ZXJDb250YWluZXIsIE1hdERyYXdlckNvbnRlbnR9IGZyb20gJy4vZHJhd2VyJztcbmltcG9ydCB7TWF0U2lkZW5hdiwgTWF0U2lkZW5hdkNvbnRhaW5lciwgTWF0U2lkZW5hdkNvbnRlbnR9IGZyb20gJy4vc2lkZW5hdic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgQ2RrU2Nyb2xsYWJsZU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBDZGtTY3JvbGxhYmxlTW9kdWxlLFxuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXREcmF3ZXIsXG4gICAgTWF0RHJhd2VyQ29udGFpbmVyLFxuICAgIE1hdERyYXdlckNvbnRlbnQsXG4gICAgTWF0U2lkZW5hdixcbiAgICBNYXRTaWRlbmF2Q29udGFpbmVyLFxuICAgIE1hdFNpZGVuYXZDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXREcmF3ZXIsXG4gICAgTWF0RHJhd2VyQ29udGFpbmVyLFxuICAgIE1hdERyYXdlckNvbnRlbnQsXG4gICAgTWF0U2lkZW5hdixcbiAgICBNYXRTaWRlbmF2Q29udGFpbmVyLFxuICAgIE1hdFNpZGVuYXZDb250ZW50LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTaWRlbmF2TW9kdWxlIHt9XG4iXX0=