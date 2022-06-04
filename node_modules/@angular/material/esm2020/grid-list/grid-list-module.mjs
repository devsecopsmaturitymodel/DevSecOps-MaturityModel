/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatLineModule, MatCommonModule } from '@angular/material/core';
import { MatGridTile, MatGridTileText, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler, MatGridAvatarCssMatStyler, } from './grid-tile';
import { MatGridList } from './grid-list';
import * as i0 from "@angular/core";
export class MatGridListModule {
}
MatGridListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatGridListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridListModule, declarations: [MatGridList,
        MatGridTile,
        MatGridTileText,
        MatGridTileHeaderCssMatStyler,
        MatGridTileFooterCssMatStyler,
        MatGridAvatarCssMatStyler], imports: [MatLineModule, MatCommonModule], exports: [MatGridList,
        MatGridTile,
        MatGridTileText,
        MatLineModule,
        MatCommonModule,
        MatGridTileHeaderCssMatStyler,
        MatGridTileFooterCssMatStyler,
        MatGridAvatarCssMatStyler] });
MatGridListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridListModule, imports: [[MatLineModule, MatCommonModule], MatLineModule,
        MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatGridListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatLineModule, MatCommonModule],
                    exports: [
                        MatGridList,
                        MatGridTile,
                        MatGridTileText,
                        MatLineModule,
                        MatCommonModule,
                        MatGridTileHeaderCssMatStyler,
                        MatGridTileFooterCssMatStyler,
                        MatGridAvatarCssMatStyler,
                    ],
                    declarations: [
                        MatGridList,
                        MatGridTile,
                        MatGridTileText,
                        MatGridTileHeaderCssMatStyler,
                        MatGridTileFooterCssMatStyler,
                        MatGridAvatarCssMatStyler,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvZ3JpZC1saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxhQUFhLEVBQUUsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEUsT0FBTyxFQUNMLFdBQVcsRUFDWCxlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLDZCQUE2QixFQUM3Qix5QkFBeUIsR0FDMUIsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUF1QnhDLE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFSMUIsV0FBVztRQUNYLFdBQVc7UUFDWCxlQUFlO1FBQ2YsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3Qix5QkFBeUIsYUFqQmpCLGFBQWEsRUFBRSxlQUFlLGFBRXRDLFdBQVc7UUFDWCxXQUFXO1FBQ1gsZUFBZTtRQUNmLGFBQWE7UUFDYixlQUFlO1FBQ2YsNkJBQTZCO1FBQzdCLDZCQUE2QjtRQUM3Qix5QkFBeUI7K0dBV2hCLGlCQUFpQixZQXBCbkIsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLEVBS3ZDLGFBQWE7UUFDYixlQUFlOzJGQWNOLGlCQUFpQjtrQkFyQjdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQztvQkFDekMsT0FBTyxFQUFFO3dCQUNQLFdBQVc7d0JBQ1gsV0FBVzt3QkFDWCxlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsZUFBZTt3QkFDZiw2QkFBNkI7d0JBQzdCLDZCQUE2Qjt3QkFDN0IseUJBQXlCO3FCQUMxQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osV0FBVzt3QkFDWCxXQUFXO3dCQUNYLGVBQWU7d0JBQ2YsNkJBQTZCO3dCQUM3Qiw2QkFBNkI7d0JBQzdCLHlCQUF5QjtxQkFDMUI7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdExpbmVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBNYXRHcmlkVGlsZSxcbiAgTWF0R3JpZFRpbGVUZXh0LFxuICBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlcixcbiAgTWF0R3JpZFRpbGVIZWFkZXJDc3NNYXRTdHlsZXIsXG4gIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXIsXG59IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7TWF0R3JpZExpc3R9IGZyb20gJy4vZ3JpZC1saXN0JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW01hdExpbmVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRHcmlkTGlzdCxcbiAgICBNYXRHcmlkVGlsZSxcbiAgICBNYXRHcmlkVGlsZVRleHQsXG4gICAgTWF0TGluZU1vZHVsZSxcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gICAgTWF0R3JpZFRpbGVIZWFkZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0R3JpZFRpbGVGb290ZXJDc3NNYXRTdHlsZXIsXG4gICAgTWF0R3JpZEF2YXRhckNzc01hdFN0eWxlcixcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0R3JpZExpc3QsXG4gICAgTWF0R3JpZFRpbGUsXG4gICAgTWF0R3JpZFRpbGVUZXh0LFxuICAgIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXIsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRMaXN0TW9kdWxlIHt9XG4iXX0=