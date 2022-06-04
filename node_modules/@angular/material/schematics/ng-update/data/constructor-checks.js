"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructorChecks = void 0;
const schematics_1 = require("@angular/cdk/schematics");
/**
 * List of class names for which the constructor signature has been changed. The new constructor
 * signature types don't need to be stored here because the signature will be determined
 * automatically through type checking.
 */
exports.constructorChecks = {
    [schematics_1.TargetVersion.V13]: [
        {
            pr: 'https://github.com/angular/components/pull/23389',
            changes: ['MatFormField'],
        },
        {
            pr: 'https://github.com/angular/components/pull/23573',
            changes: ['MatDatepicker', 'MatDateRangePicker'],
        },
    ],
    [schematics_1.TargetVersion.V12]: [
        {
            pr: 'https://github.com/angular/components/pull/21897',
            changes: ['MatTooltip'],
        },
        {
            pr: 'https://github.com/angular/components/pull/21952',
            changes: ['MatDatepickerContent'],
        },
        {
            pr: 'https://github.com/angular/components/issues/21900',
            changes: ['MatVerticalStepper', 'MatStep'],
        },
    ],
    [schematics_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/issues/20463',
            changes: ['MatChip', 'MatChipRemove'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20449',
            changes: ['MatDatepickerContent'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20545',
            changes: ['MatBottomSheet', 'MatBottomSheetRef'],
        },
        {
            pr: 'https://github.com/angular/components/issues/20535',
            changes: ['MatCheckbox'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20499',
            changes: ['MatPaginatedTabHeader', 'MatTabBodyPortal', 'MatTabNav', 'MatTab'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20479',
            changes: ['MatCommonModule'],
        },
    ],
    [schematics_1.TargetVersion.V10]: [
        {
            pr: 'https://github.com/angular/components/pull/19307',
            changes: ['MatSlideToggle'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19379',
            changes: ['MatSlider'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19372',
            changes: ['MatSortHeader'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19324',
            changes: ['MatAutocompleteTrigger'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19363',
            changes: ['MatTooltip'],
        },
        {
            pr: 'https://github.com/angular/components/pull/19323',
            changes: ['MatIcon', 'MatIconRegistry'],
        },
    ],
    [schematics_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17230',
            changes: ['MatSelect'],
        },
        {
            pr: 'https://github.com/angular/components/pull/17333',
            changes: ['MatDialogRef'],
        },
    ],
    [schematics_1.TargetVersion.V8]: [
        {
            pr: 'https://github.com/angular/components/pull/15647',
            changes: ['MatFormField', 'MatTabLink', 'MatVerticalStepper'],
        },
        { pr: 'https://github.com/angular/components/pull/15757', changes: ['MatBadge'] },
        { pr: 'https://github.com/angular/components/issues/15734', changes: ['MatButton', 'MatAnchor'] },
        {
            pr: 'https://github.com/angular/components/pull/15761',
            changes: ['MatSpinner', 'MatProgressSpinner'],
        },
        { pr: 'https://github.com/angular/components/pull/15723', changes: ['MatList', 'MatListItem'] },
        { pr: 'https://github.com/angular/components/pull/15722', changes: ['MatExpansionPanel'] },
        {
            pr: 'https://github.com/angular/components/pull/15737',
            changes: ['MatTabHeader', 'MatTabBody'],
        },
        { pr: 'https://github.com/angular/components/pull/15806', changes: ['MatSlideToggle'] },
        { pr: 'https://github.com/angular/components/pull/15773', changes: ['MatDrawerContainer'] },
    ],
    [schematics_1.TargetVersion.V7]: [
        {
            pr: 'https://github.com/angular/components/pull/11706',
            changes: ['MatDrawerContent'],
        },
        { pr: 'https://github.com/angular/components/pull/11706', changes: ['MatSidenavContent'] },
    ],
    [schematics_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/9190',
            changes: ['NativeDateAdapter'],
        },
        {
            pr: 'https://github.com/angular/components/pull/10319',
            changes: ['MatAutocomplete'],
        },
        {
            pr: 'https://github.com/angular/components/pull/10344',
            changes: ['MatTooltip'],
        },
        {
            pr: 'https://github.com/angular/components/pull/10389',
            changes: ['MatIconRegistry'],
        },
        {
            pr: 'https://github.com/angular/components/pull/9775',
            changes: ['MatCalendar'],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvY29uc3RydWN0b3ItY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUFvRztBQUVwRzs7OztHQUlHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBaUQ7SUFDN0UsQ0FBQywwQkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7U0FDMUI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLG9CQUFvQixDQUFDO1NBQ2pEO0tBQ0Y7SUFDRCxDQUFDLDBCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNsQztRQUNEO1lBQ0UsRUFBRSxFQUFFLG9EQUFvRDtZQUN4RCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUM7U0FDM0M7S0FDRjtJQUNELENBQUMsMEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxvREFBb0Q7WUFDeEQsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQztTQUN0QztRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztTQUNsQztRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUs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QUNyRCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztTQUMvQjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztTQUM3QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7U0FDN0I7UUFDRDtZQUNFLEVBQUUsRUFBRSxpREFBaUQ7WUFDckQsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQ3pCO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29uc3RydWN0b3JDaGVja3NVcGdyYWRlRGF0YSwgVGFyZ2V0VmVyc2lvbiwgVmVyc2lvbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuLyoqXG4gKiBMaXN0IG9mIGNsYXNzIG5hbWVzIGZvciB3aGljaCB0aGUgY29uc3RydWN0b3Igc2lnbmF0dXJlIGhhcyBiZWVuIGNoYW5nZWQuIFRoZSBuZXcgY29uc3RydWN0b3JcbiAqIHNpZ25hdHVyZSB0eXBlcyBkb24ndCBuZWVkIHRvIGJlIHN0b3JlZCBoZXJlIGJlY2F1c2UgdGhlIHNpZ25hdHVyZSB3aWxsIGJlIGRldGVybWluZWRcbiAqIGF1dG9tYXRpY2FsbHkgdGhyb3VnaCB0eXBlIGNoZWNraW5nLlxuICovXG5leHBvcnQgY29uc3QgY29uc3RydWN0b3JDaGVja3M6IFZlcnNpb25DaGFuZ2VzPENvbnN0cnVjdG9yQ2hlY2tzVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WMTNdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjMzODknLFxuICAgICAgY2hhbmdlczogWydNYXRGb3JtRmllbGQnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIzNTczJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGF0ZXBpY2tlcicsICdNYXREYXRlUmFuZ2VQaWNrZXInXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WMTJdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjE4OTcnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMTk1MicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERhdGVwaWNrZXJDb250ZW50J10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIxOTAwJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0VmVydGljYWxTdGVwcGVyJywgJ01hdFN0ZXAnXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WMTFdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMDQ2MycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENoaXAnLCAnTWF0Q2hpcFJlbW92ZSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA0NDknLFxuICAgICAgY2hhbmdlczogWydNYXREYXRlcGlja2VyQ29udGVudCddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjA1NDUnLFxuICAgICAgY2hhbmdlczogWydNYXRCb3R0b21TaGVldCcsICdNYXRCb3R0b21TaGVldFJlZiddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMDUzNScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENoZWNrYm94J10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMDQ5OScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFBhZ2luYXRlZFRhYkhlYWRlcicsICdNYXRUYWJCb2R5UG9ydGFsJywgJ01hdFRhYk5hdicsICdNYXRUYWInXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNDc5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0Q29tbW9uTW9kdWxlJ10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjEwXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzA3JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVUb2dnbGUnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5Mzc5JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0U2xpZGVyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTM3MicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdFNvcnRIZWFkZXInXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzI0JyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTkzNjMnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTMyMycsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEljb24nLCAnTWF0SWNvblJlZ2lzdHJ5J10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjldOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTcyMzAnLFxuICAgICAgY2hhbmdlczogWydNYXRTZWxlY3QnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE3MzMzJyxcbiAgICAgIGNoYW5nZXM6IFsnTWF0RGlhbG9nUmVmJ10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjhdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU2NDcnLFxuICAgICAgY2hhbmdlczogWydNYXRGb3JtRmllbGQnLCAnTWF0VGFiTGluaycsICdNYXRWZXJ0aWNhbFN0ZXBwZXInXSxcbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTc1NycsIGNoYW5nZXM6IFsnTWF0QmFkZ2UnXX0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTU3MzQnLCBjaGFuZ2VzOiBbJ01hdEJ1dHRvbicsICdNYXRBbmNob3InXX0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NjEnLFxuICAgICAgY2hhbmdlczogWydNYXRTcGlubmVyJywgJ01hdFByb2dyZXNzU3Bpbm5lciddLFxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1NzIzJywgY2hhbmdlczogWydNYXRMaXN0JywgJ01hdExpc3RJdGVtJ119LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNTcyMicsIGNoYW5nZXM6IFsnTWF0RXhwYW5zaW9uUGFuZWwnXX0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3MzcnLFxuICAgICAgY2hhbmdlczogWydNYXRUYWJIZWFkZXInLCAnTWF0VGFiQm9keSddLFxuICAgIH0sXG4gICAge3ByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE1ODA2JywgY2hhbmdlczogWydNYXRTbGlkZVRvZ2dsZSddfSxcbiAgICB7cHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU3NzMnLCBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRhaW5lciddfSxcbiAgXSxcblxuICBbVGFyZ2V0VmVyc2lvbi5WN106IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsXG4gICAgICBjaGFuZ2VzOiBbJ01hdERyYXdlckNvbnRlbnQnXSxcbiAgICB9LFxuICAgIHtwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMTcwNicsIGNoYW5nZXM6IFsnTWF0U2lkZW5hdkNvbnRlbnQnXX0sXG4gIF0sXG5cbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTE5MCcsXG4gICAgICBjaGFuZ2VzOiBbJ05hdGl2ZURhdGVBZGFwdGVyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMxOScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEF1dG9jb21wbGV0ZSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzNDQnLFxuICAgICAgY2hhbmdlczogWydNYXRUb29sdGlwJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM4OScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdEljb25SZWdpc3RyeSddLFxuICAgIH0sXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvOTc3NScsXG4gICAgICBjaGFuZ2VzOiBbJ01hdENhbGVuZGFyJ10sXG4gICAgfSxcbiAgXSxcbn07XG4iXX0=