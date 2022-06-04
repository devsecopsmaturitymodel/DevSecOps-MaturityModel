/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { CdkMonitorFocus } from './focus-monitor/focus-monitor';
import { CdkTrapFocus } from './focus-trap/focus-trap';
import { HighContrastModeDetector } from './high-contrast-mode/high-contrast-mode-detector';
import { CdkAriaLive } from './live-announcer/live-announcer';
import * as i0 from "@angular/core";
import * as i1 from "./high-contrast-mode/high-contrast-mode-detector";
export class A11yModule {
    constructor(highContrastModeDetector) {
        highContrastModeDetector._applyBodyHighContrastModeCssClasses();
    }
}
A11yModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: A11yModule, deps: [{ token: i1.HighContrastModeDetector }], target: i0.ɵɵFactoryTarget.NgModule });
A11yModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: A11yModule, declarations: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus], imports: [ObserversModule], exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus] });
A11yModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: A11yModule, imports: [[ObserversModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: A11yModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ObserversModule],
                    declarations: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
                    exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
                }]
        }], ctorParameters: function () { return [{ type: i1.HighContrastModeDetector }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYTExeS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2ExMXkvYTExeS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUMxRixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUNBQWlDLENBQUM7OztBQU81RCxNQUFNLE9BQU8sVUFBVTtJQUNyQixZQUFZLHdCQUFrRDtRQUM1RCx3QkFBd0IsQ0FBQyxvQ0FBb0MsRUFBRSxDQUFDO0lBQ2xFLENBQUM7O3VHQUhVLFVBQVU7d0dBQVYsVUFBVSxpQkFITixXQUFXLEVBQUUsWUFBWSxFQUFFLGVBQWUsYUFEL0MsZUFBZSxhQUVmLFdBQVcsRUFBRSxZQUFZLEVBQUUsZUFBZTt3R0FFekMsVUFBVSxZQUpaLENBQUMsZUFBZSxDQUFDOzJGQUlmLFVBQVU7a0JBTHRCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQztvQkFDMUQsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUM7aUJBQ3REIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T2JzZXJ2ZXJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvb2JzZXJ2ZXJzJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDZGtNb25pdG9yRm9jdXN9IGZyb20gJy4vZm9jdXMtbW9uaXRvci9mb2N1cy1tb25pdG9yJztcbmltcG9ydCB7Q2RrVHJhcEZvY3VzfSBmcm9tICcuL2ZvY3VzLXRyYXAvZm9jdXMtdHJhcCc7XG5pbXBvcnQge0hpZ2hDb250cmFzdE1vZGVEZXRlY3Rvcn0gZnJvbSAnLi9oaWdoLWNvbnRyYXN0LW1vZGUvaGlnaC1jb250cmFzdC1tb2RlLWRldGVjdG9yJztcbmltcG9ydCB7Q2RrQXJpYUxpdmV9IGZyb20gJy4vbGl2ZS1hbm5vdW5jZXIvbGl2ZS1hbm5vdW5jZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbT2JzZXJ2ZXJzTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ2RrQXJpYUxpdmUsIENka1RyYXBGb2N1cywgQ2RrTW9uaXRvckZvY3VzXSxcbiAgZXhwb3J0czogW0Nka0FyaWFMaXZlLCBDZGtUcmFwRm9jdXMsIENka01vbml0b3JGb2N1c10sXG59KVxuZXhwb3J0IGNsYXNzIEExMXlNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihoaWdoQ29udHJhc3RNb2RlRGV0ZWN0b3I6IEhpZ2hDb250cmFzdE1vZGVEZXRlY3Rvcikge1xuICAgIGhpZ2hDb250cmFzdE1vZGVEZXRlY3Rvci5fYXBwbHlCb2R5SGlnaENvbnRyYXN0TW9kZUNzc0NsYXNzZXMoKTtcbiAgfVxufVxuIl19