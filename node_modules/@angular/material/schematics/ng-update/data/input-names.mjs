"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputNames = void 0;
const schematics_1 = require("@angular/cdk/schematics");
exports.inputNames = {
    [schematics_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10218',
            changes: [
                {
                    replace: 'align',
                    replaceWith: 'labelPosition',
                    limitedTo: { elements: ['mat-radio-group', 'mat-radio-button'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10279',
            changes: [
                {
                    replace: 'align',
                    replaceWith: 'position',
                    limitedTo: { elements: ['mat-drawer', 'mat-sidenav'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10294',
            changes: [
                { replace: 'dividerColor', replaceWith: 'color', limitedTo: { elements: ['mat-form-field'] } },
                {
                    replace: 'floatPlaceholder',
                    replaceWith: 'floatLabel',
                    limitedTo: { elements: ['mat-form-field'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10309',
            changes: [
                {
                    replace: 'mat-dynamic-height',
                    replaceWith: 'dynamicHeight',
                    limitedTo: { elements: ['mat-tab-group'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10342',
            changes: [
                { replace: 'align', replaceWith: 'labelPosition', limitedTo: { elements: ['mat-checkbox'] } },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10344',
            changes: [
                {
                    replace: 'tooltip-position',
                    replaceWith: 'matTooltipPosition',
                    limitedTo: { attributes: ['matTooltip'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10373',
            changes: [
                { replace: 'thumb-label', replaceWith: 'thumbLabel', limitedTo: { elements: ['mat-slider'] } },
                {
                    replace: 'tick-interval',
                    replaceWith: 'tickInterval',
                    limitedTo: { elements: ['mat-slider'] },
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9pbnB1dC1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBNEY7QUFFL0UsUUFBQSxVQUFVLEdBQXlDO0lBQzlELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxPQUFPO29CQUNoQixXQUFXLEVBQUUsZUFBZTtvQkFDNUIsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLENBQUMsRUFBQztpQkFDL0Q7YUFDRjtTQUNGO1FBRUQ7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxPQUFPLEVBQUUsT0FBTztvQkFDaEIsV0FBVyxFQUFFLFVBQVU7b0JBQ3ZCLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsRUFBQztpQkFDckQ7YUFDRjtTQUNGO1FBRUQ7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUCxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEVBQUM7Z0JBQzFGO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLFdBQVcsRUFBRSxZQUFZO29CQUN6QixTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDO2lCQUMxQzthQUNGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxvQkFBb0I7b0JBQzdCLFdBQVcsRUFBRSxlQUFlO29CQUM1QixTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBQztpQkFDekM7YUFDRjtTQUNGO1FBRUQ7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUCxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQyxFQUFDO2FBQzFGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLFdBQVcsRUFBRSxvQkFBb0I7b0JBQ2pDLFNBQVMsRUFBRSxFQUFDLFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDO2lCQUN4QzthQUNGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDLEVBQUM7Z0JBQzFGO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixXQUFXLEVBQUUsY0FBYztvQkFDM0IsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUM7aUJBQ3RDO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0lucHV0TmFtZVVwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgY29uc3QgaW5wdXROYW1lczogVmVyc2lvbkNoYW5nZXM8SW5wdXROYW1lVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WNl06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDIxOCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnYWxpZ24nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnbGFiZWxQb3NpdGlvbicsXG4gICAgICAgICAgbGltaXRlZFRvOiB7ZWxlbWVudHM6IFsnbWF0LXJhZGlvLWdyb3VwJywgJ21hdC1yYWRpby1idXR0b24nXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI3OScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnYWxpZ24nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAncG9zaXRpb24nLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2VsZW1lbnRzOiBbJ21hdC1kcmF3ZXInLCAnbWF0LXNpZGVuYXYnXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5NCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAnZGl2aWRlckNvbG9yJywgcmVwbGFjZVdpdGg6ICdjb2xvcicsIGxpbWl0ZWRUbzoge2VsZW1lbnRzOiBbJ21hdC1mb3JtLWZpZWxkJ119fSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdmbG9hdFBsYWNlaG9sZGVyJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2Zsb2F0TGFiZWwnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2VsZW1lbnRzOiBbJ21hdC1mb3JtLWZpZWxkJ119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMDknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ21hdC1keW5hbWljLWhlaWdodCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdkeW5hbWljSGVpZ2h0JyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtlbGVtZW50czogWydtYXQtdGFiLWdyb3VwJ119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDInLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJ2FsaWduJywgcmVwbGFjZVdpdGg6ICdsYWJlbFBvc2l0aW9uJywgbGltaXRlZFRvOiB7ZWxlbWVudHM6IFsnbWF0LWNoZWNrYm94J119fSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzQ0JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICd0b29sdGlwLXBvc2l0aW9uJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ21hdFRvb2x0aXBQb3NpdGlvbicsXG4gICAgICAgICAgbGltaXRlZFRvOiB7YXR0cmlidXRlczogWydtYXRUb29sdGlwJ119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNzMnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJ3RodW1iLWxhYmVsJywgcmVwbGFjZVdpdGg6ICd0aHVtYkxhYmVsJywgbGltaXRlZFRvOiB7ZWxlbWVudHM6IFsnbWF0LXNsaWRlciddfX0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAndGljay1pbnRlcnZhbCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICd0aWNrSW50ZXJ2YWwnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2VsZW1lbnRzOiBbJ21hdC1zbGlkZXInXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59O1xuIl19