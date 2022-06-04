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
const target_version_1 = require("../../update-tool/target-version");
exports.propertyNames = {
    [target_version_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17084',
            changes: [
                {
                    replace: 'boundaryElementSelector',
                    replaceWith: 'boundaryElement',
                    limitedTo: { classes: ['CdkDrag'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/17302',
            changes: [
                {
                    replace: 'onChange',
                    replaceWith: 'changed',
                    limitedTo: { classes: ['SelectionModel'] },
                },
            ],
        },
    ],
    [target_version_1.TargetVersion.V8]: [],
    [target_version_1.TargetVersion.V7]: [
        {
            pr: 'https://github.com/angular/components/pull/8286',
            changes: [
                { replace: 'onChange', replaceWith: 'changed', limitedTo: { classes: ['SelectionModel'] } },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/12927',
            changes: [
                {
                    replace: 'flexibleDiemsions',
                    replaceWith: 'flexibleDimensions',
                    limitedTo: { classes: ['CdkConnectedOverlay'] },
                },
            ],
        },
    ],
    [target_version_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10161',
            changes: [
                {
                    replace: '_deprecatedOrigin',
                    replaceWith: 'origin',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedPositions',
                    replaceWith: 'positions',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedOffsetX',
                    replaceWith: 'offsetX',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedOffsetY',
                    replaceWith: 'offsetY',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedWidth',
                    replaceWith: 'width',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedHeight',
                    replaceWith: 'height',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedMinWidth',
                    replaceWith: 'minWidth',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedMinHeight',
                    replaceWith: 'minHeight',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedBackdropClass',
                    replaceWith: 'backdropClass',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedScrollStrategy',
                    replaceWith: 'scrollStrategy',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedOpen',
                    replaceWith: 'open',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
                {
                    replace: '_deprecatedHasBackdrop',
                    replaceWith: 'hasBackdrop',
                    limitedTo: { classes: ['CdkConnectedOverlay', 'ConnectedOverlayDirective'] },
                },
            ],
        },
        {
            pr: 'https://github.com/angular/components/pull/10257',
            changes: [
                {
                    replace: '_deprecatedPortal',
                    replaceWith: 'portal',
                    limitedTo: { classes: ['CdkPortalOutlet'] },
                },
                {
                    replace: '_deprecatedPortalHost',
                    replaceWith: 'portal',
                    limitedTo: { classes: ['CdkPortalOutlet'] },
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvcHJvcGVydHktbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgscUVBQStEO0FBZWxELFFBQUEsYUFBYSxHQUE0QztJQUNwRSxDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxPQUFPLEVBQUUseUJBQXlCO29CQUNsQyxXQUFXLEVBQUUsaUJBQWlCO29CQUM5QixTQUFTLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBQztpQkFDbEM7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsV0FBVyxFQUFFLFNBQVM7b0JBQ3RCLFNBQVMsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUM7aUJBQ3pDO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdEIsQ0FBQyw4QkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGlEQUFpRDtZQUNyRCxPQUFPLEVBQUU7Z0JBQ1AsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxFQUFDO2FBQ3hGO1NBQ0Y7UUFFRDtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxtQkFBbUI7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LEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDO2lCQUMxQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsdUJBQXVCO29CQUNoQyxXQUFXLEVBQUUsUUFBUTtvQkFDckIsU0FBUyxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBQztpQkFDMUM7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VGFyZ2V0VmVyc2lvbn0gZnJvbSAnLi4vLi4vdXBkYXRlLXRvb2wvdGFyZ2V0LXZlcnNpb24nO1xuaW1wb3J0IHtWZXJzaW9uQ2hhbmdlc30gZnJvbSAnLi4vLi4vdXBkYXRlLXRvb2wvdmVyc2lvbi1jaGFuZ2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wZXJ0eU5hbWVVcGdyYWRlRGF0YSB7XG4gIC8qKiBUaGUgcHJvcGVydHkgbmFtZSB0byByZXBsYWNlLiAqL1xuICByZXBsYWNlOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IG5hbWUgZm9yIHRoZSBwcm9wZXJ0eS4gKi9cbiAgcmVwbGFjZVdpdGg6IHN0cmluZztcbiAgLyoqIENvbnRyb2xzIHdoaWNoIGNsYXNzZXMgaW4gd2hpY2ggdGhpcyByZXBsYWNlbWVudCBpcyBtYWRlLiAqL1xuICBsaW1pdGVkVG86IHtcbiAgICAvKiogUmVwbGFjZSB0aGUgcHJvcGVydHkgb25seSB3aGVuIGl0cyB0eXBlIGlzIG9uZSBvZiB0aGUgZ2l2ZW4gQ2xhc3Nlcy4gKi9cbiAgICBjbGFzc2VzOiBzdHJpbmdbXTtcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IHByb3BlcnR5TmFtZXM6IFZlcnNpb25DaGFuZ2VzPFByb3BlcnR5TmFtZVVwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjldOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTcwODQnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2JvdW5kYXJ5RWxlbWVudFNlbGVjdG9yJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2JvdW5kYXJ5RWxlbWVudCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydDZGtEcmFnJ119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE3MzAyJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdvbkNoYW5nZScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdjaGFuZ2VkJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ1NlbGVjdGlvbk1vZGVsJ119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WOF06IFtdLFxuICBbVGFyZ2V0VmVyc2lvbi5WN106IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC84Mjg2JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdvbkNoYW5nZScsIHJlcGxhY2VXaXRoOiAnY2hhbmdlZCcsIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnU2VsZWN0aW9uTW9kZWwnXX19LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTI5MjcnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ2ZsZXhpYmxlRGllbXNpb25zJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2ZsZXhpYmxlRGltZW5zaW9ucycsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydDZGtDb25uZWN0ZWRPdmVybGF5J119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuXG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMTYxJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfZGVwcmVjYXRlZE9yaWdpbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcmlnaW4nLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrQ29ubmVjdGVkT3ZlcmxheScsICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkUG9zaXRpb25zJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3Bvc2l0aW9ucycsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydDZGtDb25uZWN0ZWRPdmVybGF5JywgJ0Nvbm5lY3RlZE92ZXJsYXlEaXJlY3RpdmUnXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnX2RlcHJlY2F0ZWRPZmZzZXRYJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ29mZnNldFgnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrQ29ubmVjdGVkT3ZlcmxheScsICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkT2Zmc2V0WScsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvZmZzZXRZJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ0Nka0Nvbm5lY3RlZE92ZXJsYXknLCAnQ29ubmVjdGVkT3ZlcmxheURpcmVjdGl2ZSddfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfZGVwcmVjYXRlZFdpZHRoJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ3dpZHRoJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ0Nka0Nvbm5lY3RlZE92ZXJsYXknLCAnQ29ubmVjdGVkT3ZlcmxheURpcmVjdGl2ZSddfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfZGVwcmVjYXRlZEhlaWdodCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdoZWlnaHQnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrQ29ubmVjdGVkT3ZlcmxheScsICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkTWluV2lkdGgnLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnbWluV2lkdGgnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrQ29ubmVjdGVkT3ZlcmxheScsICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkTWluSGVpZ2h0JyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ21pbkhlaWdodCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7Y2xhc3NlczogWydDZGtDb25uZWN0ZWRPdmVybGF5JywgJ0Nvbm5lY3RlZE92ZXJsYXlEaXJlY3RpdmUnXX0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnX2RlcHJlY2F0ZWRCYWNrZHJvcENsYXNzJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2JhY2tkcm9wQ2xhc3MnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrQ29ubmVjdGVkT3ZlcmxheScsICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkU2Nyb2xsU3RyYXRlZ3knLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiAnc2Nyb2xsU3RyYXRlZ3knLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrQ29ubmVjdGVkT3ZlcmxheScsICdDb25uZWN0ZWRPdmVybGF5RGlyZWN0aXZlJ119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkT3BlbicsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdvcGVuJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ0Nka0Nvbm5lY3RlZE92ZXJsYXknLCAnQ29ubmVjdGVkT3ZlcmxheURpcmVjdGl2ZSddfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfZGVwcmVjYXRlZEhhc0JhY2tkcm9wJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2hhc0JhY2tkcm9wJyxcbiAgICAgICAgICBsaW1pdGVkVG86IHtjbGFzc2VzOiBbJ0Nka0Nvbm5lY3RlZE92ZXJsYXknLCAnQ29ubmVjdGVkT3ZlcmxheURpcmVjdGl2ZSddfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcblxuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjU3JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHJlcGxhY2U6ICdfZGVwcmVjYXRlZFBvcnRhbCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdwb3J0YWwnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrUG9ydGFsT3V0bGV0J119LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJ19kZXByZWNhdGVkUG9ydGFsSG9zdCcsXG4gICAgICAgICAgcmVwbGFjZVdpdGg6ICdwb3J0YWwnLFxuICAgICAgICAgIGxpbWl0ZWRUbzoge2NsYXNzZXM6IFsnQ2RrUG9ydGFsT3V0bGV0J119LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufTtcbiJdfQ==