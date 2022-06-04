/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '../ripple/index';
import { MatPseudoCheckboxModule } from '../selection/index';
import { MatCommonModule } from '../common-behaviors/common-module';
import { MatOption } from './option';
import { MatOptgroup } from './optgroup';
import * as i0 from "@angular/core";
export class MatOptionModule {
}
MatOptionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatOptionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatOptionModule, declarations: [MatOption, MatOptgroup], imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule], exports: [MatOption, MatOptgroup] });
MatOptionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatOptionModule, imports: [[MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, CommonModule, MatCommonModule, MatPseudoCheckboxModule],
                    exports: [MatOption, MatOptgroup],
                    declarations: [MatOption, MatOptgroup],
                }]
        }] });
export * from './option';
export * from './optgroup';
export * from './option-parent';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2hELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzNELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7O0FBT3ZDLE1BQU0sT0FBTyxlQUFlOzs0R0FBZixlQUFlOzZHQUFmLGVBQWUsaUJBRlgsU0FBUyxFQUFFLFdBQVcsYUFGM0IsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsdUJBQXVCLGFBQ3ZFLFNBQVMsRUFBRSxXQUFXOzZHQUdyQixlQUFlLFlBSmpCLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsdUJBQXVCLENBQUM7MkZBSXZFLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsdUJBQXVCLENBQUM7b0JBQ2xGLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7b0JBQ2pDLFlBQVksRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7aUJBQ3ZDOztBQUdELGNBQWMsVUFBVSxDQUFDO0FBQ3pCLGNBQWMsWUFBWSxDQUFDO0FBQzNCLGNBQWMsaUJBQWlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0UmlwcGxlTW9kdWxlfSBmcm9tICcuLi9yaXBwbGUvaW5kZXgnO1xuaW1wb3J0IHtNYXRQc2V1ZG9DaGVja2JveE1vZHVsZX0gZnJvbSAnLi4vc2VsZWN0aW9uL2luZGV4JztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2NvbW1vbi1tb2R1bGUnO1xuaW1wb3J0IHtNYXRPcHRpb259IGZyb20gJy4vb3B0aW9uJztcbmltcG9ydCB7TWF0T3B0Z3JvdXB9IGZyb20gJy4vb3B0Z3JvdXAnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0UmlwcGxlTW9kdWxlLCBDb21tb25Nb2R1bGUsIE1hdENvbW1vbk1vZHVsZSwgTWF0UHNldWRvQ2hlY2tib3hNb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0T3B0aW9uLCBNYXRPcHRncm91cF0sXG4gIGRlY2xhcmF0aW9uczogW01hdE9wdGlvbiwgTWF0T3B0Z3JvdXBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRpb25Nb2R1bGUge31cblxuZXhwb3J0ICogZnJvbSAnLi9vcHRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9vcHRncm91cCc7XG5leHBvcnQgKiBmcm9tICcuL29wdGlvbi1wYXJlbnQnO1xuIl19