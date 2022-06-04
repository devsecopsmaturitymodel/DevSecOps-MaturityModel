/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatAccordion } from './accordion';
import { MatExpansionPanel, MatExpansionPanelActionRow } from './expansion-panel';
import { MatExpansionPanelContent } from './expansion-panel-content';
import { MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, } from './expansion-panel-header';
import * as i0 from "@angular/core";
export class MatExpansionModule {
}
MatExpansionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatExpansionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatExpansionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatExpansionModule, declarations: [MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelActionRow,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatExpansionPanelContent], imports: [CommonModule, MatCommonModule, CdkAccordionModule, PortalModule], exports: [MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelActionRow,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatExpansionPanelContent] });
MatExpansionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatExpansionModule, imports: [[CommonModule, MatCommonModule, CdkAccordionModule, PortalModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatExpansionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MatCommonModule, CdkAccordionModule, PortalModule],
                    exports: [
                        MatAccordion,
                        MatExpansionPanel,
                        MatExpansionPanelActionRow,
                        MatExpansionPanelHeader,
                        MatExpansionPanelTitle,
                        MatExpansionPanelDescription,
                        MatExpansionPanelContent,
                    ],
                    declarations: [
                        MatAccordion,
                        MatExpansionPanel,
                        MatExpansionPanelActionRow,
                        MatExpansionPanelHeader,
                        MatExpansionPanelTitle,
                        MatExpansionPanelDescription,
                        MatExpansionPanelContent,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9leHBhbnNpb24vZXhwYW5zaW9uLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDakQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbkUsT0FBTyxFQUNMLDRCQUE0QixFQUM1Qix1QkFBdUIsRUFDdkIsc0JBQXNCLEdBQ3ZCLE1BQU0sMEJBQTBCLENBQUM7O0FBdUJsQyxNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBVDNCLFlBQVk7UUFDWixpQkFBaUI7UUFDakIsMEJBQTBCO1FBQzFCLHVCQUF1QjtRQUN2QixzQkFBc0I7UUFDdEIsNEJBQTRCO1FBQzVCLHdCQUF3QixhQWpCaEIsWUFBWSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLGFBRXZFLFlBQVk7UUFDWixpQkFBaUI7UUFDakIsMEJBQTBCO1FBQzFCLHVCQUF1QjtRQUN2QixzQkFBc0I7UUFDdEIsNEJBQTRCO1FBQzVCLHdCQUF3QjtnSEFZZixrQkFBa0IsWUFwQnBCLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLENBQUM7MkZBb0IvRCxrQkFBa0I7a0JBckI5QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxDQUFDO29CQUMxRSxPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixpQkFBaUI7d0JBQ2pCLDBCQUEwQjt3QkFDMUIsdUJBQXVCO3dCQUN2QixzQkFBc0I7d0JBQ3RCLDRCQUE0Qjt3QkFDNUIsd0JBQXdCO3FCQUN6QjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osWUFBWTt3QkFDWixpQkFBaUI7d0JBQ2pCLDBCQUEwQjt3QkFDMUIsdUJBQXVCO3dCQUN2QixzQkFBc0I7d0JBQ3RCLDRCQUE0Qjt3QkFDNUIsd0JBQXdCO3FCQUN6QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka0FjY29yZGlvbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5pbXBvcnQge1BvcnRhbE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRBY2NvcmRpb259IGZyb20gJy4vYWNjb3JkaW9uJztcbmltcG9ydCB7TWF0RXhwYW5zaW9uUGFuZWwsIE1hdEV4cGFuc2lvblBhbmVsQWN0aW9uUm93fSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbCc7XG5pbXBvcnQge01hdEV4cGFuc2lvblBhbmVsQ29udGVudH0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtY29udGVudCc7XG5pbXBvcnQge1xuICBNYXRFeHBhbnNpb25QYW5lbERlc2NyaXB0aW9uLFxuICBNYXRFeHBhbnNpb25QYW5lbEhlYWRlcixcbiAgTWF0RXhwYW5zaW9uUGFuZWxUaXRsZSxcbn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBDZGtBY2NvcmRpb25Nb2R1bGUsIFBvcnRhbE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRBY2NvcmRpb24sXG4gICAgTWF0RXhwYW5zaW9uUGFuZWwsXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxBY3Rpb25Sb3csXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIsXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxUaXRsZSxcbiAgICBNYXRFeHBhbnNpb25QYW5lbERlc2NyaXB0aW9uLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsQ29udGVudCxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0QWNjb3JkaW9uLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsQWN0aW9uUm93LFxuICAgIE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLFxuICAgIE1hdEV4cGFuc2lvblBhbmVsVGl0bGUsXG4gICAgTWF0RXhwYW5zaW9uUGFuZWxEZXNjcmlwdGlvbixcbiAgICBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvbk1vZHVsZSB7fVxuIl19