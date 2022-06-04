/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatCheckbox } from './checkbox';
import { MatCheckboxRequiredValidator } from './checkbox-required-validator';
import * as i0 from "@angular/core";
/** This module is used by both original and MDC-based checkbox implementations. */
export class _MatCheckboxRequiredValidatorModule {
}
_MatCheckboxRequiredValidatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
_MatCheckboxRequiredValidatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, declarations: [MatCheckboxRequiredValidator], exports: [MatCheckboxRequiredValidator] });
_MatCheckboxRequiredValidatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatCheckboxRequiredValidatorModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatCheckboxRequiredValidatorModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [MatCheckboxRequiredValidator],
                    declarations: [MatCheckboxRequiredValidator],
                }]
        }] });
export class MatCheckboxModule {
}
MatCheckboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatCheckboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCheckboxModule, declarations: [MatCheckbox], imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule], exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule] });
MatCheckboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCheckboxModule, imports: [[MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule], MatCommonModule, _MatCheckboxRequiredValidatorModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatRippleModule, MatCommonModule, ObserversModule, _MatCheckboxRequiredValidatorModule],
                    exports: [MatCheckbox, MatCommonModule, _MatCheckboxRequiredValidatorModule],
                    declarations: [MatCheckbox],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoZWNrYm94L2NoZWNrYm94LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdkMsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sK0JBQStCLENBQUM7O0FBRTNFLG1GQUFtRjtBQUtuRixNQUFNLE9BQU8sbUNBQW1DOztnSUFBbkMsbUNBQW1DO2lJQUFuQyxtQ0FBbUMsaUJBRi9CLDRCQUE0QixhQURqQyw0QkFBNEI7aUlBRzNCLG1DQUFtQzsyRkFBbkMsbUNBQW1DO2tCQUovQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDO29CQUN2QyxZQUFZLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztpQkFDN0M7O0FBUUQsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQUZiLFdBQVcsYUFGaEIsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBSGhELG1DQUFtQyxhQUlwQyxXQUFXLEVBQUUsZUFBZSxFQUozQixtQ0FBbUM7K0dBT25DLGlCQUFpQixZQUpuQixDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLG1DQUFtQyxDQUFDLEVBQzFFLGVBQWUsRUFKM0IsbUNBQW1DOzJGQU9uQyxpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsbUNBQW1DLENBQUM7b0JBQ2pHLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsbUNBQW1DLENBQUM7b0JBQzVFLFlBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Q2hlY2tib3h9IGZyb20gJy4vY2hlY2tib3gnO1xuaW1wb3J0IHtNYXRDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yfSBmcm9tICcuL2NoZWNrYm94LXJlcXVpcmVkLXZhbGlkYXRvcic7XG5cbi8qKiBUaGlzIG1vZHVsZSBpcyB1c2VkIGJ5IGJvdGggb3JpZ2luYWwgYW5kIE1EQy1iYXNlZCBjaGVja2JveCBpbXBsZW1lbnRhdGlvbnMuICovXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcl0sXG4gIGRlY2xhcmF0aW9uczogW01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JdLFxufSlcbmV4cG9ydCBjbGFzcyBfTWF0Q2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvck1vZHVsZSB7fVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0UmlwcGxlTW9kdWxlLCBNYXRDb21tb25Nb2R1bGUsIE9ic2VydmVyc01vZHVsZSwgX01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JNb2R1bGVdLFxuICBleHBvcnRzOiBbTWF0Q2hlY2tib3gsIE1hdENvbW1vbk1vZHVsZSwgX01hdENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRDaGVja2JveF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoZWNrYm94TW9kdWxlIHt9XG4iXX0=