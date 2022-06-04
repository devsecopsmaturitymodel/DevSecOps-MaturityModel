/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatInkBar } from './ink-bar';
import { MatTab } from './tab';
import { MatTabBody, MatTabBodyPortal } from './tab-body';
import { MatTabContent } from './tab-content';
import { MatTabGroup } from './tab-group';
import { MatTabHeader } from './tab-header';
import { MatTabLabel } from './tab-label';
import { MatTabLabelWrapper } from './tab-label-wrapper';
import { MatTabLink, MatTabNav, MatTabNavPanel } from './tab-nav-bar/tab-nav-bar';
import * as i0 from "@angular/core";
export class MatTabsModule {
}
MatTabsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatTabsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabsModule, declarations: [MatTabGroup,
        MatTabLabel,
        MatTab,
        MatInkBar,
        MatTabLabelWrapper,
        MatTabNav,
        MatTabNavPanel,
        MatTabLink,
        MatTabBody,
        MatTabBodyPortal,
        MatTabHeader,
        MatTabContent], imports: [CommonModule,
        MatCommonModule,
        PortalModule,
        MatRippleModule,
        ObserversModule,
        A11yModule], exports: [MatCommonModule,
        MatTabGroup,
        MatTabLabel,
        MatTab,
        MatTabNav,
        MatTabNavPanel,
        MatTabLink,
        MatTabContent] });
MatTabsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabsModule, imports: [[
            CommonModule,
            MatCommonModule,
            PortalModule,
            MatRippleModule,
            ObserversModule,
            A11yModule,
        ], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatTabsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatCommonModule,
                        PortalModule,
                        MatRippleModule,
                        ObserversModule,
                        A11yModule,
                    ],
                    // Don't export all components because some are only to be used internally.
                    exports: [
                        MatCommonModule,
                        MatTabGroup,
                        MatTabLabel,
                        MatTab,
                        MatTabNav,
                        MatTabNavPanel,
                        MatTabLink,
                        MatTabContent,
                    ],
                    declarations: [
                        MatTabGroup,
                        MatTabLabel,
                        MatTab,
                        MatInkBar,
                        MatTabLabelWrapper,
                        MatTabNav,
                        MatTabNavPanel,
                        MatTabLink,
                        MatTabBody,
                        MatTabBodyPortal,
                        MatTabHeader,
                        MatTabContent,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWJzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDcEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM3QixPQUFPLEVBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBcUNoRixNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQWR0QixXQUFXO1FBQ1gsV0FBVztRQUNYLE1BQU07UUFDTixTQUFTO1FBQ1Qsa0JBQWtCO1FBQ2xCLFNBQVM7UUFDVCxjQUFjO1FBQ2QsVUFBVTtRQUNWLFVBQVU7UUFDVixnQkFBZ0I7UUFDaEIsWUFBWTtRQUNaLGFBQWEsYUE5QmIsWUFBWTtRQUNaLGVBQWU7UUFDZixZQUFZO1FBQ1osZUFBZTtRQUNmLGVBQWU7UUFDZixVQUFVLGFBSVYsZUFBZTtRQUNmLFdBQVc7UUFDWCxXQUFXO1FBQ1gsTUFBTTtRQUNOLFNBQVM7UUFDVCxjQUFjO1FBQ2QsVUFBVTtRQUNWLGFBQWE7MkdBaUJKLGFBQWEsWUFsQ2Y7WUFDUCxZQUFZO1lBQ1osZUFBZTtZQUNmLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtZQUNmLFVBQVU7U0FDWCxFQUdDLGVBQWU7MkZBd0JOLGFBQWE7a0JBbkN6QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGVBQWU7d0JBQ2YsVUFBVTtxQkFDWDtvQkFDRCwyRUFBMkU7b0JBQzNFLE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLFdBQVc7d0JBQ1gsV0FBVzt3QkFDWCxNQUFNO3dCQUNOLFNBQVM7d0JBQ1QsY0FBYzt3QkFDZCxVQUFVO3dCQUNWLGFBQWE7cUJBQ2Q7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFdBQVc7d0JBQ1gsV0FBVzt3QkFDWCxNQUFNO3dCQUNOLFNBQVM7d0JBQ1Qsa0JBQWtCO3dCQUNsQixTQUFTO3dCQUNULGNBQWM7d0JBQ2QsVUFBVTt3QkFDVixVQUFVO3dCQUNWLGdCQUFnQjt3QkFDaEIsWUFBWTt3QkFDWixhQUFhO3FCQUNkO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QTExeU1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHtQb3J0YWxNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlLCBNYXRSaXBwbGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRJbmtCYXJ9IGZyb20gJy4vaW5rLWJhcic7XG5pbXBvcnQge01hdFRhYn0gZnJvbSAnLi90YWInO1xuaW1wb3J0IHtNYXRUYWJCb2R5LCBNYXRUYWJCb2R5UG9ydGFsfSBmcm9tICcuL3RhYi1ib2R5JztcbmltcG9ydCB7TWF0VGFiQ29udGVudH0gZnJvbSAnLi90YWItY29udGVudCc7XG5pbXBvcnQge01hdFRhYkdyb3VwfSBmcm9tICcuL3RhYi1ncm91cCc7XG5pbXBvcnQge01hdFRhYkhlYWRlcn0gZnJvbSAnLi90YWItaGVhZGVyJztcbmltcG9ydCB7TWF0VGFiTGFiZWx9IGZyb20gJy4vdGFiLWxhYmVsJztcbmltcG9ydCB7TWF0VGFiTGFiZWxXcmFwcGVyfSBmcm9tICcuL3RhYi1sYWJlbC13cmFwcGVyJztcbmltcG9ydCB7TWF0VGFiTGluaywgTWF0VGFiTmF2LCBNYXRUYWJOYXZQYW5lbH0gZnJvbSAnLi90YWItbmF2LWJhci90YWItbmF2LWJhcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBNYXRSaXBwbGVNb2R1bGUsXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICAgIEExMXlNb2R1bGUsXG4gIF0sXG4gIC8vIERvbid0IGV4cG9ydCBhbGwgY29tcG9uZW50cyBiZWNhdXNlIHNvbWUgYXJlIG9ubHkgdG8gYmUgdXNlZCBpbnRlcm5hbGx5LlxuICBleHBvcnRzOiBbXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdFRhYkdyb3VwLFxuICAgIE1hdFRhYkxhYmVsLFxuICAgIE1hdFRhYixcbiAgICBNYXRUYWJOYXYsXG4gICAgTWF0VGFiTmF2UGFuZWwsXG4gICAgTWF0VGFiTGluayxcbiAgICBNYXRUYWJDb250ZW50LFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBNYXRUYWJHcm91cCxcbiAgICBNYXRUYWJMYWJlbCxcbiAgICBNYXRUYWIsXG4gICAgTWF0SW5rQmFyLFxuICAgIE1hdFRhYkxhYmVsV3JhcHBlcixcbiAgICBNYXRUYWJOYXYsXG4gICAgTWF0VGFiTmF2UGFuZWwsXG4gICAgTWF0VGFiTGluayxcbiAgICBNYXRUYWJCb2R5LFxuICAgIE1hdFRhYkJvZHlQb3J0YWwsXG4gICAgTWF0VGFiSGVhZGVyLFxuICAgIE1hdFRhYkNvbnRlbnQsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYnNNb2R1bGUge31cbiJdfQ==