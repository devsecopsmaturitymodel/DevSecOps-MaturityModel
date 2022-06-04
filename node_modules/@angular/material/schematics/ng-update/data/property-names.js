"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyNames = void 0;
const schematics_1 = require("@angular/cdk/schematics");
exports.propertyNames = {
    [schematics_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/pull/20449',
            changes: [
                {
                    replace: 'getPopupConnectionElementRef',
                    replaceWith: 'getConnectedOverlayOrigin',
                    limitedTo: { classes: ['MatDatepickerInput'] },
                },
            ],
        },
    ],
    [schematics_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17333',
            changes: [
                {
                    replace: 'afterOpen',
                    replaceWith: 'afterOpened',
                    limitedTo: { classes: ['MatDialogRef'] },
                },
                {
                    replace: 'beforeClose',
                    replaceWith: 'beforeClosed',
                    limitedTo: { classes: ['MatDialogRef'] },
                },
                {
                    replace: 'afterOpen',
                    replaceWith: 'afterOpened',
                    limitedTo: { classes: ['MatDialog'] },
                },
            ],
        },
    ],
    [schematics_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10163',
            changes: [
                { replace: 'change', replaceWith: 'selectionChange', limitedTo: { classes: ['MatSelect'] } },
                {
                    replace: 'onOpen',
                    replaceWith: 'openedChange.pipe(filter(isOpen => isOpen))',
                    limitedTo: { classes: ['MatSelect'] },
                },
                {
                    replace: 'onClose',
                    replaceWith: 'openedChange.pipe(filter(isOpen => !isOpen))',
                    limitedTo: { classes: ['MatSelect'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10218',
            changes: [
                {
                    replace: 'align',
                    replaceWith: 'labelPosition',
                    limitedTo: { classes: ['MatRadioGroup', 'MatRadioButton'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10253',
            changes: [
                {
                    replace: 'extraClasses',
                    replaceWith: 'panelClass',
                    limitedTo: { classes: ['MatSnackBarConfig'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10279',
            changes: [
                {
                    replace: 'align',
                    replaceWith: 'position',
                    limitedTo: { classes: ['MatDrawer', 'MatSidenav'] },
                },
                {
                    replace: 'onAlignChanged',
                    replaceWith: 'onPositionChanged',
                    limitedTo: { classes: ['MatDrawer', 'MatSidenav'] },
                },
                {
                    replace: 'onOpen',
                    replaceWith: 'openedChange.pipe(filter(isOpen => isOpen))',
                    limitedTo: { classes: ['MatDrawer', 'MatSidenav'] },
                },
                {
                    replace: 'onClose',
                    replaceWith: 'openedChange.pipe(filter(isOpen => !isOpen))',
                    limitedTo: { classes: ['MatDrawer', 'MatSidenav'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10293',
            changes: [
                {
                    replace: 'shouldPlaceholderFloat',
                    replaceWith: 'shouldLabelFloat',
                    limitedTo: { classes: ['MatFormFieldControl', 'MatSelect'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10294',
            changes: [
                { replace: 'dividerColor', replaceWith: 'color', limitedTo: { classes: ['MatFormField'] } },
                {
                    replace: 'floatPlaceholder',
                    replaceWith: 'floatLabel',
                    limitedTo: { classes: ['MatFormField'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10309',
            changes: [
                {
                    replace: 'selectChange',
                    replaceWith: 'selectedTabChange',
                    limitedTo: { classes: ['MatTabGroup'] },
                },
                {
                    replace: '_dynamicHeightDeprecated',
                    replaceWith: 'dynamicHeight',
                    limitedTo: { classes: ['MatTabGroup'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10311',
            changes: [
                { replace: 'destroy', replaceWith: 'destroyed', limitedTo: { classes: ['MatChip'] } },
                { replace: 'onRemove', replaceWith: 'removed', limitedTo: { classes: ['MatChip'] } },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10342',
            changes: [
                { replace: 'align', replaceWith: 'labelPosition', limitedTo: { classes: ['MatCheckbox'] } },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10344',
            changes: [
                {
                    replace: '_positionDeprecated',
                    replaceWith: 'position',
                    limitedTo: { classes: ['MatTooltip'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10373',
            changes: [
                {
                    replace: '_thumbLabelDeprecated',
                    replaceWith: 'thumbLabel',
                    limitedTo: { classes: ['MatSlider'] },
                },
                {
                    replace: '_tickIntervalDeprecated',
                    replaceWith: 'tickInterval',
                    limitedTo: { classes: ['MatSlider'] },
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9wcm9wZXJ0eS1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBK0Y7QUFFbEYsUUFBQSxhQUFhLEdBQTRDO0lBQ3BFLENBQUMsMEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSw4QkFBOEI7b0JBQ3ZDLFdBQVcsRUFBRSwyQkFBMkI7b0JBQ3hDLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUM7aUJBQzdDO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsT0FBTyxFQUFFLFdBQVc7b0JBQ3BCLFdBQVcsRUFBRSxhQUFhO29CQUMxQixTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQztpQkFDdkM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFdBQVcsRUFBRSxjQUFjO29CQUMzQixTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQztpQkFDdkM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLFdBQVc7b0JBQ3BCLFdBQVcsRUFBRSxhQUFhO29CQUMxQixTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBQztpQkFDcEM7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxDQUFDLDBCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFD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QUUseUJBQXlCO29CQUNsQyxXQUFXLEVBQUUsY0FBYztvQkFDM0IsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUM7aUJBQ3BDO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1Byb3BlcnR5TmFtZVVwZ3JhZGVEYXRhLCBUYXJnZXRWZXJzaW9uLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgY29uc3QgcHJvcGVydHlOYW1lczogVmVyc2lvbkNoYW5nZXM8UHJvcGVydHlOYW1lVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WMTFdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA0NDknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2dldFBvcHVwQ29ubmVjdGlvbkVsZW1lbnRSZWYnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbicsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXREYXRlcGlja2VySW5wdXQnXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlY5XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE3MzMzJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdhZnRlck9wZW4nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnYWZ0ZXJPcGVuZWQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0RGlhbG9nUmVmJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2JlZm9yZUNsb3NlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2JlZm9yZUNsb3NlZCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXREaWFsb2dSZWYnXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnYWZ0ZXJPcGVuJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2FmdGVyT3BlbmVkJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ01hdERpYWxvZyddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAxNjMnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7cmVwbGFjZTogJ2NoYW5nZScsIHJlcGxhY2VXaXRoOiAnc2VsZWN0aW9uQ2hhbmdlJywgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXRTZWxlY3QnXX19LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ29uT3BlbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIoaXNPcGVuID0+IGlzT3BlbikpJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ01hdFNlbGVjdCddfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdvbkNsb3NlJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29wZW5lZENoYW5nZS5waXBlKGZpbHRlcihpc09wZW4gPT4gIWlzT3BlbikpJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ01hdFNlbGVjdCddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjE4JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdhbGlnbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdsYWJlbFBvc2l0aW9uJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ01hdFJhZGlvR3JvdXAnLCAnTWF0UmFkaW9CdXR0b24nXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI1MycsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnZXh0cmFDbGFzc2VzJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3BhbmVsQ2xhc3MnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0U25hY2tCYXJDb25maWcnXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI3OScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnYWxpZ24nLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAncG9zaXRpb24nLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0RHJhd2VyJywgJ01hdFNpZGVuYXYnXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25BbGlnbkNoYW5nZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnb25Qb3NpdGlvbkNoYW5nZWQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0RHJhd2VyJywgJ01hdFNpZGVuYXYnXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25PcGVuJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29wZW5lZENoYW5nZS5waXBlKGZpbHRlcihpc09wZW4gPT4gaXNPcGVuKSknLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0RHJhd2VyJywgJ01hdFNpZGVuYXYnXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnb25DbG9zZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIoaXNPcGVuID0+ICFpc09wZW4pKScsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXREcmF3ZXInLCAnTWF0U2lkZW5hdiddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjkzJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdzaG91bGRQbGFjZWhvbGRlckZsb2F0JyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3Nob3VsZExhYmVsRmxvYXQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0Rm9ybUZpZWxkQ29udHJvbCcsICdNYXRTZWxlY3QnXX0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG5cbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5NCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtyZXBsYWNlOiAnZGl2aWRlckNvbG9yJywgcmVwbGFjZVdpdGg6ICdjb2xvcicsIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0Rm9ybUZpZWxkJ119fSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdmbG9hdFBsYWNlaG9sZGVyJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2Zsb2F0TGFiZWwnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0Rm9ybUZpZWxkJ119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzMDknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ3NlbGVjdENoYW5nZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdzZWxlY3RlZFRhYkNoYW5nZScsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXRUYWJHcm91cCddfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfZHluYW1pY0hlaWdodERlcHJlY2F0ZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnZHluYW1pY0hlaWdodCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXRUYWJHcm91cCddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzExJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdkZXN0cm95JywgcmVwbGFjZVdpdGg6ICdkZXN0cm95ZWQnLCBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ01hdENoaXAnXX19LFxuICAgICAgICB7cmVwbGFjZTogJ29uUmVtb3ZlJywgcmVwbGFjZVdpdGg6ICdyZW1vdmVkJywgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXRDaGlwJ119fSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzQyJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdhbGlnbicsIHJlcGxhY2VXaXRoOiAnbGFiZWxQb3NpdGlvbicsIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0Q2hlY2tib3gnXX19LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDQnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19wb3NpdGlvbkRlcHJlY2F0ZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAncG9zaXRpb24nLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnTWF0VG9vbHRpcCddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMzczJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfdGh1bWJMYWJlbERlcHJlY2F0ZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAndGh1bWJMYWJlbCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydNYXRTbGlkZXInXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnX3RpY2tJbnRlcnZhbERlcHJlY2F0ZWQnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAndGlja0ludGVydmFsJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ01hdFNsaWRlciddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn07XG4iXX0=