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
const target_version_1 = require("../../update-tool/target-version");
/**
 * List of class names for which the constructor signature has been changed. The new constructor
 * signature types don't need to be stored here because the signature will be determined
 * automatically through type checking.
 */
exports.constructorChecks = {
    [target_version_1.TargetVersion.V12]: [
        {
            pr: 'https://github.com/angular/components/pull/21876',
            changes: ['CdkTable', 'StickyStyler'],
        },
        {
            pr: 'https://github.com/angular/components/issues/21900',
            changes: ['CdkStepper'],
        },
    ],
    [target_version_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/pull/20454',
            changes: ['ScrollDispatcher', 'ViewportRuler', 'CdkVirtualScrollViewport'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20500',
            changes: ['CdkDropList'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20572',
            changes: ['CdkTreeNodePadding'],
        },
        {
            pr: 'https://github.com/angular/components/pull/20511',
            changes: ['OverlayContainer', 'FullscreenOverlayContainer', 'OverlayRef', 'Overlay'],
        },
    ],
    [target_version_1.TargetVersion.V10]: [
        {
            pr: 'https://github.com/angular/components/pull/19347',
            changes: ['Platform'],
        },
    ],
    [target_version_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17084',
            changes: ['DropListRef'],
        },
    ],
    [target_version_1.TargetVersion.V8]: [
        {
            pr: 'https://github.com/angular/components/pull/15647',
            changes: [
                'CdkDrag',
                'CdkDropList',
                'ConnectedPositionStrategy',
                'FlexibleConnectedPositionStrategy',
                'OverlayPositionBuilder',
                'CdkTable',
            ],
        },
    ],
    [target_version_1.TargetVersion.V7]: [],
    [target_version_1.TargetVersion.V6]: [],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0b3ItY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL25nLXVwZGF0ZS9kYXRhL2NvbnN0cnVjdG9yLWNoZWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxRUFBK0Q7QUFLL0Q7Ozs7R0FJRztBQUNVLFFBQUEsaUJBQWlCLEdBQWlEO0lBQzdFLENBQUMsOEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQztTQUN0QztRQUNEO1lBQ0UsRUFBRSxFQUFFLG9EQUFvRDtZQUN4RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7S0FDRjtJQUNELENBQUMsOEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLDBCQUEwQixDQUFDO1NBQzNFO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztTQUN6QjtRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztTQUNoQztRQUNEO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSw0QkFBNEIsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDO1NBQ3JGO0tBQ0Y7SUFDRCxDQUFDLDhCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUN0QjtLQUNGO0lBQ0QsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7U0FDekI7S0FDRjtJQUNELENBQUMsOEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQLFNBQVM7Z0JBQ1QsYUFBYTtnQkFDYiwyQkFBMkI7Z0JBQzNCLG1DQUFtQztnQkFDbkMsd0JBQXdCO2dCQUN4QixVQUFVO2FBQ1g7U0FDRjtLQUNGO0lBQ0QsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdEIsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RhcmdldFZlcnNpb259IGZyb20gJy4uLy4uL3VwZGF0ZS10b29sL3RhcmdldC12ZXJzaW9uJztcbmltcG9ydCB7VmVyc2lvbkNoYW5nZXN9IGZyb20gJy4uLy4uL3VwZGF0ZS10b29sL3ZlcnNpb24tY2hhbmdlcyc7XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yQ2hlY2tzVXBncmFkZURhdGEgPSBzdHJpbmc7XG5cbi8qKlxuICogTGlzdCBvZiBjbGFzcyBuYW1lcyBmb3Igd2hpY2ggdGhlIGNvbnN0cnVjdG9yIHNpZ25hdHVyZSBoYXMgYmVlbiBjaGFuZ2VkLiBUaGUgbmV3IGNvbnN0cnVjdG9yXG4gKiBzaWduYXR1cmUgdHlwZXMgZG9uJ3QgbmVlZCB0byBiZSBzdG9yZWQgaGVyZSBiZWNhdXNlIHRoZSBzaWduYXR1cmUgd2lsbCBiZSBkZXRlcm1pbmVkXG4gKiBhdXRvbWF0aWNhbGx5IHRocm91Z2ggdHlwZSBjaGVja2luZy5cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnN0cnVjdG9yQ2hlY2tzOiBWZXJzaW9uQ2hhbmdlczxDb25zdHJ1Y3RvckNoZWNrc1VwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjEyXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIxODc2JyxcbiAgICAgIGNoYW5nZXM6IFsnQ2RrVGFibGUnLCAnU3RpY2t5U3R5bGVyJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIxOTAwJyxcbiAgICAgIGNoYW5nZXM6IFsnQ2RrU3RlcHBlciddLFxuICAgIH0sXG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlYxMV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMDQ1NCcsXG4gICAgICBjaGFuZ2VzOiBbJ1Njcm9sbERpc3BhdGNoZXInLCAnVmlld3BvcnRSdWxlcicsICdDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNTAwJyxcbiAgICAgIGNoYW5nZXM6IFsnQ2RrRHJvcExpc3QnXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzIwNTcyJyxcbiAgICAgIGNoYW5nZXM6IFsnQ2RrVHJlZU5vZGVQYWRkaW5nJ10sXG4gICAgfSxcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMDUxMScsXG4gICAgICBjaGFuZ2VzOiBbJ092ZXJsYXlDb250YWluZXInLCAnRnVsbHNjcmVlbk92ZXJsYXlDb250YWluZXInLCAnT3ZlcmxheVJlZicsICdPdmVybGF5J10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjEwXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5MzQ3JyxcbiAgICAgIGNoYW5nZXM6IFsnUGxhdGZvcm0nXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WOV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNzA4NCcsXG4gICAgICBjaGFuZ2VzOiBbJ0Ryb3BMaXN0UmVmJ10sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjhdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTU2NDcnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICAnQ2RrRHJhZycsXG4gICAgICAgICdDZGtEcm9wTGlzdCcsXG4gICAgICAgICdDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5JyxcbiAgICAgICAgJ0ZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneScsXG4gICAgICAgICdPdmVybGF5UG9zaXRpb25CdWlsZGVyJyxcbiAgICAgICAgJ0Nka1RhYmxlJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgW1RhcmdldFZlcnNpb24uVjddOiBbXSxcbiAgW1RhcmdldFZlcnNpb24uVjZdOiBbXSxcbn07XG4iXX0=