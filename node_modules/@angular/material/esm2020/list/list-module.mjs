/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatLineModule, MatPseudoCheckboxModule, MatRippleModule, } from '@angular/material/core';
import { MatList, MatNavList, MatListAvatarCssMatStyler, MatListIconCssMatStyler, MatListItem, MatListSubheaderCssMatStyler, } from './list';
import { MatListOption, MatSelectionList } from './selection-list';
import { MatDividerModule } from '@angular/material/divider';
import * as i0 from "@angular/core";
export class MatListModule {
}
MatListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatListModule, declarations: [MatList,
        MatNavList,
        MatListItem,
        MatListAvatarCssMatStyler,
        MatListIconCssMatStyler,
        MatListSubheaderCssMatStyler,
        MatSelectionList,
        MatListOption], imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule], exports: [MatList,
        MatNavList,
        MatListItem,
        MatListAvatarCssMatStyler,
        MatLineModule,
        MatCommonModule,
        MatListIconCssMatStyler,
        MatListSubheaderCssMatStyler,
        MatPseudoCheckboxModule,
        MatSelectionList,
        MatListOption,
        MatDividerModule] });
MatListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatListModule, imports: [[MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule], MatLineModule,
        MatCommonModule,
        MatPseudoCheckboxModule,
        MatDividerModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule],
                    exports: [
                        MatList,
                        MatNavList,
                        MatListItem,
                        MatListAvatarCssMatStyler,
                        MatLineModule,
                        MatCommonModule,
                        MatListIconCssMatStyler,
                        MatListSubheaderCssMatStyler,
                        MatPseudoCheckboxModule,
                        MatSelectionList,
                        MatListOption,
                        MatDividerModule,
                    ],
                    declarations: [
                        MatList,
                        MatNavList,
                        MatListItem,
                        MatListAvatarCssMatStyler,
                        MatListIconCssMatStyler,
                        MatListSubheaderCssMatStyler,
                        MatSelectionList,
                        MatListOption,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQ0wsZUFBZSxFQUNmLGFBQWEsRUFDYix1QkFBdUIsRUFDdkIsZUFBZSxHQUNoQixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFDTCxPQUFPLEVBQ1AsVUFBVSxFQUNWLHlCQUF5QixFQUN6Qix1QkFBdUIsRUFDdkIsV0FBVyxFQUNYLDRCQUE0QixHQUM3QixNQUFNLFFBQVEsQ0FBQztBQUNoQixPQUFPLEVBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDakUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBNkIzRCxNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQVZ0QixPQUFPO1FBQ1AsVUFBVTtRQUNWLFdBQVc7UUFDWCx5QkFBeUI7UUFDekIsdUJBQXVCO1FBQ3ZCLDRCQUE0QjtRQUM1QixnQkFBZ0I7UUFDaEIsYUFBYSxhQXZCTCxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLGFBRTlGLE9BQU87UUFDUCxVQUFVO1FBQ1YsV0FBVztRQUNYLHlCQUF5QjtRQUN6QixhQUFhO1FBQ2IsZUFBZTtRQUNmLHVCQUF1QjtRQUN2Qiw0QkFBNEI7UUFDNUIsdUJBQXVCO1FBQ3ZCLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsZ0JBQWdCOzJHQWFQLGFBQWEsWUExQmYsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSx1QkFBdUIsRUFBRSxZQUFZLENBQUMsRUFNL0YsYUFBYTtRQUNiLGVBQWU7UUFHZix1QkFBdUI7UUFHdkIsZ0JBQWdCOzJGQWFQLGFBQWE7a0JBM0J6QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLHVCQUF1QixFQUFFLFlBQVksQ0FBQztvQkFDakcsT0FBTyxFQUFFO3dCQUNQLE9BQU87d0JBQ1AsVUFBVTt3QkFDVixXQUFXO3dCQUNYLHlCQUF5Qjt3QkFDekIsYUFBYTt3QkFDYixlQUFlO3dCQUNmLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1Qix1QkFBdUI7d0JBQ3ZCLGdCQUFnQjt3QkFDaEIsYUFBYTt3QkFDYixnQkFBZ0I7cUJBQ2pCO29CQUNELFlBQVksRUFBRTt3QkFDWixPQUFPO3dCQUNQLFVBQVU7d0JBQ1YsV0FBVzt3QkFDWCx5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1QixnQkFBZ0I7d0JBQ2hCLGFBQWE7cUJBQ2Q7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1hdENvbW1vbk1vZHVsZSxcbiAgTWF0TGluZU1vZHVsZSxcbiAgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGUsXG4gIE1hdFJpcHBsZU1vZHVsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBNYXRMaXN0LFxuICBNYXROYXZMaXN0LFxuICBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLFxuICBNYXRMaXN0SWNvbkNzc01hdFN0eWxlcixcbiAgTWF0TGlzdEl0ZW0sXG4gIE1hdExpc3RTdWJoZWFkZXJDc3NNYXRTdHlsZXIsXG59IGZyb20gJy4vbGlzdCc7XG5pbXBvcnQge01hdExpc3RPcHRpb24sIE1hdFNlbGVjdGlvbkxpc3R9IGZyb20gJy4vc2VsZWN0aW9uLWxpc3QnO1xuaW1wb3J0IHtNYXREaXZpZGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaXZpZGVyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdExpbmVNb2R1bGUsIE1hdFJpcHBsZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlLCBNYXRQc2V1ZG9DaGVja2JveE1vZHVsZSwgQ29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdExpc3QsXG4gICAgTWF0TmF2TGlzdCxcbiAgICBNYXRMaXN0SXRlbSxcbiAgICBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdExpbmVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyLFxuICAgIE1hdExpc3RTdWJoZWFkZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGUsXG4gICAgTWF0U2VsZWN0aW9uTGlzdCxcbiAgICBNYXRMaXN0T3B0aW9uLFxuICAgIE1hdERpdmlkZXJNb2R1bGUsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdExpc3QsXG4gICAgTWF0TmF2TGlzdCxcbiAgICBNYXRMaXN0SXRlbSxcbiAgICBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyLFxuICAgIE1hdExpc3RTdWJoZWFkZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0U2VsZWN0aW9uTGlzdCxcbiAgICBNYXRMaXN0T3B0aW9uLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0TW9kdWxlIHt9XG4iXX0=