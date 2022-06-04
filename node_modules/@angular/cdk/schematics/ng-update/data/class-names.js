"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.classNames = void 0;
const target_version_1 = require("../../update-tool/target-version");
exports.classNames = {
    [target_version_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17084',
            changes: [
                { replace: 'CDK_DROP_LIST_CONTAINER', replaceWith: 'CDK_DROP_LIST' },
                { replace: 'CdkDragConfig', replaceWith: 'DragRefConfig' },
            ],
        },
    ],
    [target_version_1.TargetVersion.V8]: [],
    [target_version_1.TargetVersion.V7]: [],
    [target_version_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10161',
            changes: [
                { replace: 'ConnectedOverlayDirective', replaceWith: 'CdkConnectedOverlay' },
                { replace: 'OverlayOrigin', replaceWith: 'CdkOverlayOrigin' },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10267',
            changes: [{ replace: 'ObserveContent', replaceWith: 'CdkObserveContent' }],
        },
        {
            pr: 'https://github.com/angular/components/pull/10325',
            changes: [{ replace: 'FocusTrapDirective', replaceWith: 'CdkTrapFocus' }],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY2xhc3MtbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgscUVBQStEO0FBVWxELFFBQUEsVUFBVSxHQUF5QztJQUM5RCxDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUCxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFDO2dCQUNsRSxFQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQzthQUN6RDtTQUNGO0tBQ0Y7SUFDRCxDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QixDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QixDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUCxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxXQUFXLEVBQUUscUJBQXFCLEVBQUM7Z0JBQzFFLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUM7YUFDNUQ7U0FDRjtRQUVEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQztTQUN6RTtRQUVEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDLENBQUM7U0FDeEU7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUYXJnZXRWZXJzaW9ufSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC90YXJnZXQtdmVyc2lvbic7XG5pbXBvcnQge1ZlcnNpb25DaGFuZ2VzfSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC92ZXJzaW9uLWNoYW5nZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTmFtZVVwZ3JhZGVEYXRhIHtcbiAgLyoqIFRoZSBDbGFzcyBuYW1lIHRvIHJlcGxhY2UuICovXG4gIHJlcGxhY2U6IHN0cmluZztcbiAgLyoqIFRoZSBuZXcgbmFtZSBmb3IgdGhlIENsYXNzLiAqL1xuICByZXBsYWNlV2l0aDogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgY2xhc3NOYW1lczogVmVyc2lvbkNoYW5nZXM8Q2xhc3NOYW1lVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WOV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNzA4NCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAnQ0RLX0RST1BfTElTVF9DT05UQUlORVInLCByZXBsYWNlV2l0aDogJ0NES19EUk9QX0xJU1QnfSxcbiAgICAgICAge3JlcGxhY2U6ICdDZGtEcmFnQ29uZmlnJywgcmVwbGFjZVdpdGg6ICdEcmFnUmVmQ29uZmlnJ30sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlY4XTogW10sXG4gIFtUYXJnZXRWZXJzaW9uLlY3XTogW10sXG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMTYxJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJywgcmVwbGFjZVdpdGg6ICdDZGtDb25uZWN0ZWRPdmVybGF5J30sXG4gICAgICAgIHtyZXBsYWNlOiAnT3ZlcmxheU9yaWdpbicsIHJlcGxhY2VXaXRoOiAnQ2RrT3ZlcmxheU9yaWdpbid9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyNjcnLFxuICAgICAgY2hhbmdlczogW3tyZXBsYWNlOiAnT2JzZXJ2ZUNvbnRlbnQnLCByZXBsYWNlV2l0aDogJ0Nka09ic2VydmVDb250ZW50J31dLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMyNScsXG4gICAgICBjaGFuZ2VzOiBbe3JlcGxhY2U6ICdGb2N1c1RyYXBEaXJlY3RpdmUnLCByZXBsYWNlV2l0aDogJ0Nka1RyYXBGb2N1cyd9XSxcbiAgICB9LFxuICBdLFxufTtcbiJdfQ==