"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputNames = void 0;
const schematics_1 = require("@angular/cdk/schematics");
exports.outputNames = {
    [schematics_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10163',
            changes: [
                {
                    replace: 'change',
                    replaceWith: 'selectionChange',
                    limitedTo: {
                        elements: ['mat-select'],
                    },
                },
                {
                    replace: 'onClose',
                    replaceWith: 'closed',
                    limitedTo: {
                        elements: ['mat-select'],
                    },
                },
                {
                    replace: 'onOpen',
                    replaceWith: 'opened',
                    limitedTo: {
                        elements: ['mat-select'],
                    },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10279',
            changes: [
                {
                    replace: 'align-changed',
                    replaceWith: 'positionChanged',
                    limitedTo: {
                        elements: ['mat-drawer', 'mat-sidenav'],
                    },
                },
                {
                    replace: 'close',
                    replaceWith: 'closed',
                    limitedTo: {
                        elements: ['mat-drawer', 'mat-sidenav'],
                    },
                },
                {
                    replace: 'open',
                    replaceWith: 'opened',
                    limitedTo: {
                        elements: ['mat-drawer', 'mat-sidenav'],
                    },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10309',
            changes: [
                {
                    replace: 'selectChange',
                    replaceWith: 'selectedTabChange',
                    limitedTo: {
                        elements: ['mat-tab-group'],
                    },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10311',
            changes: [
                {
                    replace: 'remove',
                    replaceWith: 'removed',
                    limitedTo: {
                        attributes: ['mat-chip', 'mat-basic-chip'],
                        elements: ['mat-chip', 'mat-basic-chip'],
                    },
                },
                {
                    replace: 'destroy',
                    replaceWith: 'destroyed',
                    limitedTo: {
                        attributes: ['mat-chip', 'mat-basic-chip'],
                        elements: ['mat-chip', 'mat-basic-chip'],
                    },
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LW5hbWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvb3V0cHV0LW5hbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUE2RjtBQUVoRixRQUFBLFdBQVcsR0FBMEM7SUFDaEUsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLFdBQVcsRUFBRSxpQkFBaUI7b0JBQzlCLFNBQVMsRUFBRTt3QkFDVCxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUM7cUJBQ3pCO2lCQUNGO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxTQUFTO29CQUNsQixXQUFXLEVBQUUsUUFBUTtvQkFDckIsU0FBUyxFQUFFO3dCQUNULFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQztxQkFDekI7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLFdBQVcsRUFBRSxRQUFRO29CQUNyQixTQUFTLEVBQUU7d0JBQ1QsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDO3FCQUN6QjtpQkFDRjthQUNGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixXQUFXLEVBQUUsaUJBQWlCO29CQUM5QixTQUFTLEVBQUU7d0JBQ1QsUUFBUSxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztxQkFDeEM7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLE9BQU87b0JBQ2hCLFdBQVcsRUFBRSxRQUFRO29CQUNyQixTQUFTLEVBQUU7d0JBQ1QsUUFBUSxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztxQkFDeEM7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLE1BQU07b0JBQ2YsV0FBVyxFQUFFLFFBQVE7b0JBQ3JCLFNBQVMsRUFBRTt3QkFDVCxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO3FCQUN4QztpQkFDRjthQUNGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxjQUFjO29CQUN2QixXQUFXLEVBQUUsbUJBQW1CO29CQUNoQyxTQUFTLEVBQUU7d0JBQ1QsUUFBUSxFQUFFLENBQUMsZUFBZSxDQUFDO3FCQUM1QjtpQkFDRjthQUNGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxRQUFRO29CQUNqQixXQUFXLEVBQUUsU0FBUztvQkFDdEIsU0FBUyxFQUFFO3dCQUNULFVBQVUsRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDMUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDO3FCQUN6QztpQkFDRjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsU0FBUztvQkFDbEIsV0FBVyxFQUFFLFdBQVc7b0JBQ3hCLFNBQVMsRUFBRTt3QkFDVCxVQUFVLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7d0JBQzFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztxQkFDekM7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3V0cHV0TmFtZVVwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgY29uc3Qgb3V0cHV0TmFtZXM6IFZlcnNpb25DaGFuZ2VzPE91dHB1dE5hbWVVcGdyYWRlRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMTYzJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdjaGFuZ2UnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnc2VsZWN0aW9uQ2hhbmdlJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbJ21hdC1zZWxlY3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uQ2xvc2UnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnY2xvc2VkJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbJ21hdC1zZWxlY3QnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uT3BlbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcGVuZWQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge1xuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LXNlbGVjdCddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI3OScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnYWxpZ24tY2hhbmdlZCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdwb3NpdGlvbkNoYW5nZWQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge1xuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LWRyYXdlcicsICdtYXQtc2lkZW5hdiddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnY2xvc2UnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnY2xvc2VkJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbJ21hdC1kcmF3ZXInLCAnbWF0LXNpZGVuYXYnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29wZW4nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb3BlbmVkJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbJ21hdC1kcmF3ZXInLCAnbWF0LXNpZGVuYXYnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMDknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ3NlbGVjdENoYW5nZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdzZWxlY3RlZFRhYkNoYW5nZScsXG4gICAgICAgICAgbGltaXRlZFRvOiB7XG4gICAgICAgICAgICBlbGVtZW50czogWydtYXQtdGFiLWdyb3VwJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzExJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdyZW1vdmUnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAncmVtb3ZlZCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ21hdC1jaGlwJywgJ21hdC1iYXNpYy1jaGlwJ10sXG4gICAgICAgICAgICBlbGVtZW50czogWydtYXQtY2hpcCcsICdtYXQtYmFzaWMtY2hpcCddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnZGVzdHJveScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdkZXN0cm95ZWQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge1xuICAgICAgICAgICAgYXR0cmlidXRlczogWydtYXQtY2hpcCcsICdtYXQtYmFzaWMtY2hpcCddLFxuICAgICAgICAgICAgZWxlbWVudHM6IFsnbWF0LWNoaXAnLCAnbWF0LWJhc2ljLWNoaXAnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufTtcbiJdfQ==