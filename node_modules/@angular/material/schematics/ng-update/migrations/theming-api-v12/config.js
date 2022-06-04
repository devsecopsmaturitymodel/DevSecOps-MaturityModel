"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unprefixedRemovedVariables = exports.removedMaterialVariables = exports.cdkMixins = exports.cdkVariables = exports.materialVariables = exports.materialFunctions = exports.materialMixins = void 0;
/** Mapping of Material mixins that should be renamed. */
exports.materialMixins = {
    'mat-core': 'core',
    'mat-core-color': 'core-color',
    'mat-core-theme': 'core-theme',
    'angular-material-theme': 'all-component-themes',
    'angular-material-typography': 'all-component-typographies',
    'angular-material-color': 'all-component-colors',
    'mat-base-typography': 'typography-hierarchy',
    'mat-typography-level-to-styles': 'typography-level',
    'mat-elevation': 'elevation',
    'mat-overridable-elevation': 'overridable-elevation',
    'mat-elevation-transition': 'elevation-transition',
    'mat-ripple': 'ripple',
    'mat-ripple-color': 'ripple-color',
    'mat-ripple-theme': 'ripple-theme',
    'mat-strong-focus-indicators': 'strong-focus-indicators',
    'mat-strong-focus-indicators-color': 'strong-focus-indicators-color',
    'mat-strong-focus-indicators-theme': 'strong-focus-indicators-theme',
    'mat-font-shorthand': 'font-shorthand',
    // The expansion panel is a special case, because the package is called `expansion`, but the
    // mixins were prefixed with `expansion-panel`. This was corrected by the Sass module migration.
    'mat-expansion-panel-theme': 'expansion-theme',
    'mat-expansion-panel-color': 'expansion-color',
    'mat-expansion-panel-typography': 'expansion-typography',
};
// The component themes all follow the same pattern so we can spare ourselves some typing.
[
    'option',
    'optgroup',
    'pseudo-checkbox',
    'autocomplete',
    'badge',
    'bottom-sheet',
    'button',
    'button-toggle',
    'card',
    'checkbox',
    'chips',
    'divider',
    'table',
    'datepicker',
    'dialog',
    'grid-list',
    'icon',
    'input',
    'list',
    'menu',
    'paginator',
    'progress-bar',
    'progress-spinner',
    'radio',
    'select',
    'sidenav',
    'slide-toggle',
    'slider',
    'stepper',
    'sort',
    'tabs',
    'toolbar',
    'tooltip',
    'snack-bar',
    'form-field',
    'tree',
].forEach(name => {
    exports.materialMixins[`mat-${name}-theme`] = `${name}-theme`;
    exports.materialMixins[`mat-${name}-color`] = `${name}-color`;
    exports.materialMixins[`mat-${name}-typography`] = `${name}-typography`;
});
/** Mapping of Material functions that should be renamed. */
exports.materialFunctions = {
    'mat-color': 'get-color-from-palette',
    'mat-contrast': 'get-contrast-color-from-palette',
    'mat-palette': 'define-palette',
    'mat-dark-theme': 'define-dark-theme',
    'mat-light-theme': 'define-light-theme',
    'mat-typography-level': 'define-typography-level',
    'mat-typography-config': 'define-typography-config',
    'mat-font-size': 'font-size',
    'mat-line-height': 'line-height',
    'mat-font-weight': 'font-weight',
    'mat-letter-spacing': 'letter-spacing',
    'mat-font-family': 'font-family',
};
/** Mapping of Material variables that should be renamed. */
exports.materialVariables = {
    'mat-light-theme-background': 'light-theme-background-palette',
    'mat-dark-theme-background': 'dark-theme-background-palette',
    'mat-light-theme-foreground': 'light-theme-foreground-palette',
    'mat-dark-theme-foreground': 'dark-theme-foreground-palette',
};
// The palettes all follow the same pattern.
[
    'red',
    'pink',
    'indigo',
    'purple',
    'deep-purple',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
    'gray',
    'blue-grey',
    'blue-gray',
].forEach(name => (exports.materialVariables[`mat-${name}`] = `${name}-palette`));
/** Mapping of CDK variables that should be renamed. */
exports.cdkVariables = {
    'cdk-z-index-overlay-container': 'overlay-container-z-index',
    'cdk-z-index-overlay': 'overlay-z-index',
    'cdk-z-index-overlay-backdrop': 'overlay-backdrop-z-index',
    'cdk-overlay-dark-backdrop-background': 'overlay-backdrop-color',
};
/** Mapping of CDK mixins that should be renamed. */
exports.cdkMixins = {
    'cdk-overlay': 'overlay',
    'cdk-a11y': 'a11y-visually-hidden',
    'cdk-high-contrast': 'high-contrast',
    'cdk-text-field-autofill-color': 'text-field-autofill-color',
    // This one was split up into two mixins which is trickier to
    // migrate so for now we forward to the deprecated variant.
    'cdk-text-field': 'text-field',
};
/**
 * Material variables that have been removed from the public API
 * and which should be replaced with their values.
 */
exports.removedMaterialVariables = {
    // Note: there's also a usage of a variable called `$pi`, but the name is short enough that
    // it matches things like `$mat-pink`. Don't migrate it since it's unlikely to be used.
    'mat-xsmall': 'max-width: 599px',
    'mat-small': 'max-width: 959px',
    'mat-toggle-padding': '8px',
    'mat-toggle-size': '20px',
    'mat-linear-out-slow-in-timing-function': 'cubic-bezier(0, 0, 0.2, 0.1)',
    'mat-fast-out-slow-in-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'mat-fast-out-linear-in-timing-function': 'cubic-bezier(0.4, 0, 1, 1)',
    'mat-elevation-transition-duration': '280ms',
    'mat-elevation-transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'mat-elevation-color': '#000',
    'mat-elevation-opacity': '1',
    'mat-elevation-prefix': `'mat-elevation-z'`,
    'mat-ripple-color-opacity': '0.1',
    'mat-badge-font-size': '12px',
    'mat-badge-font-weight': '600',
    'mat-badge-default-size': '22px',
    'mat-badge-small-size': '16px',
    'mat-badge-large-size': '28px',
    'mat-button-toggle-standard-height': '48px',
    'mat-button-toggle-standard-minimum-height': '24px',
    'mat-button-toggle-standard-maximum-height': '48px',
    'mat-chip-remove-font-size': '18px',
    'mat-datepicker-selected-today-box-shadow-width': '1px',
    'mat-datepicker-selected-fade-amount': '0.6',
    'mat-datepicker-range-fade-amount': '0.2',
    'mat-datepicker-today-fade-amount': '0.2',
    'mat-calendar-body-font-size': '13px',
    'mat-calendar-weekday-table-font-size': '11px',
    'mat-expansion-panel-header-collapsed-height': '48px',
    'mat-expansion-panel-header-collapsed-minimum-height': '36px',
    'mat-expansion-panel-header-collapsed-maximum-height': '48px',
    'mat-expansion-panel-header-expanded-height': '64px',
    'mat-expansion-panel-header-expanded-minimum-height': '48px',
    'mat-expansion-panel-header-expanded-maximum-height': '64px',
    'mat-expansion-panel-header-transition': '225ms cubic-bezier(0.4, 0, 0.2, 1)',
    'mat-menu-side-padding': '16px',
    'menu-menu-item-height': '48px',
    'menu-menu-icon-margin': '16px',
    'mat-paginator-height': '56px',
    'mat-paginator-minimum-height': '40px',
    'mat-paginator-maximum-height': '56px',
    'mat-stepper-header-height': '72px',
    'mat-stepper-header-minimum-height': '42px',
    'mat-stepper-header-maximum-height': '72px',
    'mat-stepper-label-header-height': '24px',
    'mat-stepper-label-position-bottom-top-gap': '16px',
    'mat-stepper-label-min-width': '50px',
    'mat-vertical-stepper-content-margin': '36px',
    'mat-stepper-side-gap': '24px',
    'mat-stepper-line-width': '1px',
    'mat-stepper-line-gap': '8px',
    'mat-step-sub-label-font-size': '12px',
    'mat-step-header-icon-size': '16px',
    'mat-toolbar-minimum-height': '44px',
    'mat-toolbar-height-desktop': '64px',
    'mat-toolbar-maximum-height-desktop': '64px',
    'mat-toolbar-minimum-height-desktop': '44px',
    'mat-toolbar-height-mobile': '56px',
    'mat-toolbar-maximum-height-mobile': '56px',
    'mat-toolbar-minimum-height-mobile': '44px',
    'mat-tooltip-target-height': '22px',
    'mat-tooltip-font-size': '10px',
    'mat-tooltip-vertical-padding': '6px',
    'mat-tooltip-handset-target-height': '30px',
    'mat-tooltip-handset-font-size': '14px',
    'mat-tooltip-handset-vertical-padding': '8px',
    'mat-tree-node-height': '48px',
    'mat-tree-node-minimum-height': '24px',
    'mat-tree-node-maximum-height': '48px',
};
/**
 * Material variables **without a `mat-` prefix** that have been removed from the public API
 * and which should be replaced with their values. These should be migrated only when there's a
 * Material import, because their names could conflict with other variables in the user's app.
 */
exports.unprefixedRemovedVariables = {
    'z-index-fab': '20',
    'z-index-drawer': '100',
    'ease-in-out-curve-function': 'cubic-bezier(0.35, 0, 0.25, 1)',
    'swift-ease-out-duration': '400ms',
    'swift-ease-out-timing-function': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    'swift-ease-out': 'all 400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
    'swift-ease-in-duration': '300ms',
    'swift-ease-in-timing-function': 'cubic-bezier(0.55, 0, 0.55, 0.2)',
    'swift-ease-in': 'all 300ms cubic-bezier(0.55, 0, 0.55, 0.2)',
    'swift-ease-in-out-duration': '500ms',
    'swift-ease-in-out-timing-function': 'cubic-bezier(0.35, 0, 0.25, 1)',
    'swift-ease-in-out': 'all 500ms cubic-bezier(0.35, 0, 0.25, 1)',
    'swift-linear-duration': '80ms',
    'swift-linear-timing-function': 'linear',
    'swift-linear': 'all 80ms linear',
    'black-87-opacity': 'rgba(black, 0.87)',
    'white-87-opacity': 'rgba(white, 0.87)',
    'black-12-opacity': 'rgba(black, 0.12)',
    'white-12-opacity': 'rgba(white, 0.12)',
    'black-6-opacity': 'rgba(black, 0.06)',
    'white-6-opacity': 'rgba(white, 0.06)',
    'dark-primary-text': 'rgba(black, 0.87)',
    'dark-secondary-text': 'rgba(black, 0.54)',
    'dark-disabled-text': 'rgba(black, 0.38)',
    'dark-dividers': 'rgba(black, 0.12)',
    'dark-focused': 'rgba(black, 0.12)',
    'light-primary-text': 'white',
    'light-secondary-text': 'rgba(white, 0.7)',
    'light-disabled-text': 'rgba(white, 0.5)',
    'light-dividers': 'rgba(white, 0.12)',
    'light-focused': 'rgba(white, 0.12)',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvdGhlbWluZy1hcGktdjEyL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx5REFBeUQ7QUFDNUMsUUFBQSxjQUFjLEdBQTJCO0lBQ3BELFVBQVUsRUFBRSxNQUFNO0lBQ2xCLGdCQUFnQixFQUFFLFlBQVk7SUFDOUIsZ0JBQWdCLEVBQUUsWUFBWTtJQUM5Qix3QkFBd0IsRUFBRSxzQkFBc0I7SUFDaEQsNkJBQTZCLEVBQUUsNEJBQTRCO0lBQzNELHdCQUF3QixFQUFFLHNCQUFzQjtJQUNoRCxxQkFBcUIsRUFBRSxzQkFBc0I7SUFDN0MsZ0NBQWdDLEVBQUUsa0JBQWtCO0lBQ3BELGVBQWUsRUFBRSxXQUFXO0lBQzVCLDJCQUEyQixFQUFFLHVCQUF1QjtJQUNwRCwwQkFBMEIsRUFBRSxzQkFBc0I7SUFDbEQsWUFBWSxFQUFFLFFBQVE7SUFDdEIsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyxrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLDZCQUE2QixFQUFFLHlCQUF5QjtJQUN4RCxtQ0FBbUMsRUFBRSwrQkFBK0I7SUFDcEUsbUNBQW1DLEVBQUUsK0JBQStCO0lBQ3BFLG9CQUFvQixFQUFFLGdCQUFnQjtJQUN0Qyw0RkFBNEY7SUFDNUYsZ0dBQWdHO0lBQ2hHLDJCQUEyQixFQUFFLGlCQUFpQjtJQUM5QywyQkFBMkIsRUFBRSxpQkFBaUI7SUFDOUMsZ0NBQWdDLEVBQUUsc0JBQXNCO0NBQ3pELENBQUM7QUFFRiwwRkFBMEY7QUFDMUY7SUFDRSxRQUFRO0lBQ1IsVUFBVTtJQUNWLGlCQUFpQjtJQUNqQixjQUFjO0lBQ2QsT0FBTztJQUNQLGNBQWM7SUFDZCxRQUFRO0lBQ1IsZUFBZTtJQUNmLE1BQU07SUFDTixVQUFVO0lB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LG1DQUFtQyxFQUFFLGdDQUFnQztJQUNyRSxtQkFBbUIsRUFBRSwwQ0FBMEM7SUFDL0QsdUJBQXVCLEVBQUUsTUFBTTtJQUMvQiw4QkFBOEIsRUFBRSxRQUFRO0lBQ3hDLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsa0JBQWtCLEVBQUUsbUJBQW1CO0lBQ3ZDLGtCQUFrQixFQUFFLG1CQUFtQjtJQUN2QyxrQkFBa0IsRUFBRSxtQkFBbUI7SUFDdkMsa0JBQWtCLEVBQUUsbUJBQW1CO0lBQ3ZDLGlCQUFpQixFQUFFLG1CQUFtQjtJQUN0QyxpQkFBaUIsRUFBRSxtQkFBbUI7SUFDdEMsbUJBQW1CLEVBQUUsbUJBQW1CO0lBQ3hDLHFCQUFxQixFQUFFLG1CQUFtQjtJQUMxQyxvQkFBb0IsRUFBRSxtQkFBbUI7SUFDekMsZUFBZSxFQUFFLG1CQUFtQjtJQUNwQyxjQUFjLEVBQUUsbUJBQW1CO0lBQ25DLG9CQUFvQixFQUFFLE9BQU87SUFDN0Isc0JBQXNCLEVBQUUsa0JBQWtCO0lBQzFDLHFCQUFxQixFQUFFLGtCQUFrQjtJQUN6QyxnQkFBZ0IsRUFBRSxtQkFBbUI7SUFDckMsZUFBZSxFQUFFLG1CQUFtQjtDQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIG1peGlucyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGVyaWFsTWl4aW5zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnbWF0LWNvcmUnOiAnY29yZScsXG4gICdtYXQtY29yZS1jb2xvcic6ICdjb3JlLWNvbG9yJyxcbiAgJ21hdC1jb3JlLXRoZW1lJzogJ2NvcmUtdGhlbWUnLFxuICAnYW5ndWxhci1tYXRlcmlhbC10aGVtZSc6ICdhbGwtY29tcG9uZW50LXRoZW1lcycsXG4gICdhbmd1bGFyLW1hdGVyaWFsLXR5cG9ncmFwaHknOiAnYWxsLWNvbXBvbmVudC10eXBvZ3JhcGhpZXMnLFxuICAnYW5ndWxhci1tYXRlcmlhbC1jb2xvcic6ICdhbGwtY29tcG9uZW50LWNvbG9ycycsXG4gICdtYXQtYmFzZS10eXBvZ3JhcGh5JzogJ3R5cG9ncmFwaHktaGllcmFyY2h5JyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsLXRvLXN0eWxlcyc6ICd0eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC1lbGV2YXRpb24nOiAnZWxldmF0aW9uJyxcbiAgJ21hdC1vdmVycmlkYWJsZS1lbGV2YXRpb24nOiAnb3ZlcnJpZGFibGUtZWxldmF0aW9uJyxcbiAgJ21hdC1lbGV2YXRpb24tdHJhbnNpdGlvbic6ICdlbGV2YXRpb24tdHJhbnNpdGlvbicsXG4gICdtYXQtcmlwcGxlJzogJ3JpcHBsZScsXG4gICdtYXQtcmlwcGxlLWNvbG9yJzogJ3JpcHBsZS1jb2xvcicsXG4gICdtYXQtcmlwcGxlLXRoZW1lJzogJ3JpcHBsZS10aGVtZScsXG4gICdtYXQtc3Ryb25nLWZvY3VzLWluZGljYXRvcnMnOiAnc3Ryb25nLWZvY3VzLWluZGljYXRvcnMnLFxuICAnbWF0LXN0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLWNvbG9yJzogJ3N0cm9uZy1mb2N1cy1pbmRpY2F0b3JzLWNvbG9yJyxcbiAgJ21hdC1zdHJvbmctZm9jdXMtaW5kaWNhdG9ycy10aGVtZSc6ICdzdHJvbmctZm9jdXMtaW5kaWNhdG9ycy10aGVtZScsXG4gICdtYXQtZm9udC1zaG9ydGhhbmQnOiAnZm9udC1zaG9ydGhhbmQnLFxuICAvLyBUaGUgZXhwYW5zaW9uIHBhbmVsIGlzIGEgc3BlY2lhbCBjYXNlLCBiZWNhdXNlIHRoZSBwYWNrYWdlIGlzIGNhbGxlZCBgZXhwYW5zaW9uYCwgYnV0IHRoZVxuICAvLyBtaXhpbnMgd2VyZSBwcmVmaXhlZCB3aXRoIGBleHBhbnNpb24tcGFuZWxgLiBUaGlzIHdhcyBjb3JyZWN0ZWQgYnkgdGhlIFNhc3MgbW9kdWxlIG1pZ3JhdGlvbi5cbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtdGhlbWUnOiAnZXhwYW5zaW9uLXRoZW1lJyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtY29sb3InOiAnZXhwYW5zaW9uLWNvbG9yJyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtdHlwb2dyYXBoeSc6ICdleHBhbnNpb24tdHlwb2dyYXBoeScsXG59O1xuXG4vLyBUaGUgY29tcG9uZW50IHRoZW1lcyBhbGwgZm9sbG93IHRoZSBzYW1lIHBhdHRlcm4gc28gd2UgY2FuIHNwYXJlIG91cnNlbHZlcyBzb21lIHR5cGluZy5cbltcbiAgJ29wdGlvbicsXG4gICdvcHRncm91cCcsXG4gICdwc2V1ZG8tY2hlY2tib3gnLFxuICAnYXV0b2NvbXBsZXRlJyxcbiAgJ2JhZGdlJyxcbiAgJ2JvdHRvbS1zaGVldCcsXG4gICdidXR0b24nLFxuICAnYnV0dG9uLXRvZ2dsZScsXG4gICdjYXJkJyxcbiAgJ2NoZWNrYm94JyxcbiAgJ2NoaXBzJyxcbiAgJ2RpdmlkZXInLFxuICAndGFibGUnLFxuICAnZGF0ZXBpY2tlcicsXG4gICdkaWFsb2cnLFxuICAnZ3JpZC1saXN0JyxcbiAgJ2ljb24nLFxuICAnaW5wdXQnLFxuICAnbGlzdCcsXG4gICdtZW51JyxcbiAgJ3BhZ2luYXRvcicsXG4gICdwcm9ncmVzcy1iYXInLFxuICAncHJvZ3Jlc3Mtc3Bpbm5lcicsXG4gICdyYWRpbycsXG4gICdzZWxlY3QnLFxuICAnc2lkZW5hdicsXG4gICdzbGlkZS10b2dnbGUnLFxuICAnc2xpZGVyJyxcbiAgJ3N0ZXBwZXInLFxuICAnc29ydCcsXG4gICd0YWJzJyxcbiAgJ3Rvb2xiYXInLFxuICAndG9vbHRpcCcsXG4gICdzbmFjay1iYXInLFxuICAnZm9ybS1maWVsZCcsXG4gICd0cmVlJyxcbl0uZm9yRWFjaChuYW1lID0+IHtcbiAgbWF0ZXJpYWxNaXhpbnNbYG1hdC0ke25hbWV9LXRoZW1lYF0gPSBgJHtuYW1lfS10aGVtZWA7XG4gIG1hdGVyaWFsTWl4aW5zW2BtYXQtJHtuYW1lfS1jb2xvcmBdID0gYCR7bmFtZX0tY29sb3JgO1xuICBtYXRlcmlhbE1peGluc1tgbWF0LSR7bmFtZX0tdHlwb2dyYXBoeWBdID0gYCR7bmFtZX0tdHlwb2dyYXBoeWA7XG59KTtcblxuLyoqIE1hcHBpbmcgb2YgTWF0ZXJpYWwgZnVuY3Rpb25zIHRoYXQgc2hvdWxkIGJlIHJlbmFtZWQuICovXG5leHBvcnQgY29uc3QgbWF0ZXJpYWxGdW5jdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICdtYXQtY29sb3InOiAnZ2V0LWNvbG9yLWZyb20tcGFsZXR0ZScsXG4gICdtYXQtY29udHJhc3QnOiAnZ2V0LWNvbnRyYXN0LWNvbG9yLWZyb20tcGFsZXR0ZScsXG4gICdtYXQtcGFsZXR0ZSc6ICdkZWZpbmUtcGFsZXR0ZScsXG4gICdtYXQtZGFyay10aGVtZSc6ICdkZWZpbmUtZGFyay10aGVtZScsXG4gICdtYXQtbGlnaHQtdGhlbWUnOiAnZGVmaW5lLWxpZ2h0LXRoZW1lJyxcbiAgJ21hdC10eXBvZ3JhcGh5LWxldmVsJzogJ2RlZmluZS10eXBvZ3JhcGh5LWxldmVsJyxcbiAgJ21hdC10eXBvZ3JhcGh5LWNvbmZpZyc6ICdkZWZpbmUtdHlwb2dyYXBoeS1jb25maWcnLFxuICAnbWF0LWZvbnQtc2l6ZSc6ICdmb250LXNpemUnLFxuICAnbWF0LWxpbmUtaGVpZ2h0JzogJ2xpbmUtaGVpZ2h0JyxcbiAgJ21hdC1mb250LXdlaWdodCc6ICdmb250LXdlaWdodCcsXG4gICdtYXQtbGV0dGVyLXNwYWNpbmcnOiAnbGV0dGVyLXNwYWNpbmcnLFxuICAnbWF0LWZvbnQtZmFtaWx5JzogJ2ZvbnQtZmFtaWx5Jyxcbn07XG5cbi8qKiBNYXBwaW5nIG9mIE1hdGVyaWFsIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGVyaWFsVmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnbWF0LWxpZ2h0LXRoZW1lLWJhY2tncm91bmQnOiAnbGlnaHQtdGhlbWUtYmFja2dyb3VuZC1wYWxldHRlJyxcbiAgJ21hdC1kYXJrLXRoZW1lLWJhY2tncm91bmQnOiAnZGFyay10aGVtZS1iYWNrZ3JvdW5kLXBhbGV0dGUnLFxuICAnbWF0LWxpZ2h0LXRoZW1lLWZvcmVncm91bmQnOiAnbGlnaHQtdGhlbWUtZm9yZWdyb3VuZC1wYWxldHRlJyxcbiAgJ21hdC1kYXJrLXRoZW1lLWZvcmVncm91bmQnOiAnZGFyay10aGVtZS1mb3JlZ3JvdW5kLXBhbGV0dGUnLFxufTtcblxuLy8gVGhlIHBhbGV0dGVzIGFsbCBmb2xsb3cgdGhlIHNhbWUgcGF0dGVybi5cbltcbiAgJ3JlZCcsXG4gICdwaW5rJyxcbiAgJ2luZGlnbycsXG4gICdwdXJwbGUnLFxuICAnZGVlcC1wdXJwbGUnLFxuICAnYmx1ZScsXG4gICdsaWdodC1ibHVlJyxcbiAgJ2N5YW4nLFxuICAndGVhbCcsXG4gICdncmVlbicsXG4gICdsaWdodC1ncmVlbicsXG4gICdsaW1lJyxcbiAgJ3llbGxvdycsXG4gICdhbWJlcicsXG4gICdvcmFuZ2UnLFxuICAnZGVlcC1vcmFuZ2UnLFxuICAnYnJvd24nLFxuICAnZ3JleScsXG4gICdncmF5JyxcbiAgJ2JsdWUtZ3JleScsXG4gICdibHVlLWdyYXknLFxuXS5mb3JFYWNoKG5hbWUgPT4gKG1hdGVyaWFsVmFyaWFibGVzW2BtYXQtJHtuYW1lfWBdID0gYCR7bmFtZX0tcGFsZXR0ZWApKTtcblxuLyoqIE1hcHBpbmcgb2YgQ0RLIHZhcmlhYmxlcyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuZXhwb3J0IGNvbnN0IGNka1ZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2Nkay16LWluZGV4LW92ZXJsYXktY29udGFpbmVyJzogJ292ZXJsYXktY29udGFpbmVyLXotaW5kZXgnLFxuICAnY2RrLXotaW5kZXgtb3ZlcmxheSc6ICdvdmVybGF5LXotaW5kZXgnLFxuICAnY2RrLXotaW5kZXgtb3ZlcmxheS1iYWNrZHJvcCc6ICdvdmVybGF5LWJhY2tkcm9wLXotaW5kZXgnLFxuICAnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcC1iYWNrZ3JvdW5kJzogJ292ZXJsYXktYmFja2Ryb3AtY29sb3InLFxufTtcblxuLyoqIE1hcHBpbmcgb2YgQ0RLIG1peGlucyB0aGF0IHNob3VsZCBiZSByZW5hbWVkLiAqL1xuZXhwb3J0IGNvbnN0IGNka01peGluczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgJ2Nkay1vdmVybGF5JzogJ292ZXJsYXknLFxuICAnY2RrLWExMXknOiAnYTExeS12aXN1YWxseS1oaWRkZW4nLFxuICAnY2RrLWhpZ2gtY29udHJhc3QnOiAnaGlnaC1jb250cmFzdCcsXG4gICdjZGstdGV4dC1maWVsZC1hdXRvZmlsbC1jb2xvcic6ICd0ZXh0LWZpZWxkLWF1dG9maWxsLWNvbG9yJyxcbiAgLy8gVGhpcyBvbmUgd2FzIHNwbGl0IHVwIGludG8gdHdvIG1peGlucyB3aGljaCBpcyB0cmlja2llciB0b1xuICAvLyBtaWdyYXRlIHNvIGZvciBub3cgd2UgZm9yd2FyZCB0byB0aGUgZGVwcmVjYXRlZCB2YXJpYW50LlxuICAnY2RrLXRleHQtZmllbGQnOiAndGV4dC1maWVsZCcsXG59O1xuXG4vKipcbiAqIE1hdGVyaWFsIHZhcmlhYmxlcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIGZyb20gdGhlIHB1YmxpYyBBUElcbiAqIGFuZCB3aGljaCBzaG91bGQgYmUgcmVwbGFjZWQgd2l0aCB0aGVpciB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVkTWF0ZXJpYWxWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIC8vIE5vdGU6IHRoZXJlJ3MgYWxzbyBhIHVzYWdlIG9mIGEgdmFyaWFibGUgY2FsbGVkIGAkcGlgLCBidXQgdGhlIG5hbWUgaXMgc2hvcnQgZW5vdWdoIHRoYXRcbiAgLy8gaXQgbWF0Y2hlcyB0aGluZ3MgbGlrZSBgJG1hdC1waW5rYC4gRG9uJ3QgbWlncmF0ZSBpdCBzaW5jZSBpdCdzIHVubGlrZWx5IHRvIGJlIHVzZWQuXG4gICdtYXQteHNtYWxsJzogJ21heC13aWR0aDogNTk5cHgnLFxuICAnbWF0LXNtYWxsJzogJ21heC13aWR0aDogOTU5cHgnLFxuICAnbWF0LXRvZ2dsZS1wYWRkaW5nJzogJzhweCcsXG4gICdtYXQtdG9nZ2xlLXNpemUnOiAnMjBweCcsXG4gICdtYXQtbGluZWFyLW91dC1zbG93LWluLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAwLjEpJyxcbiAgJ21hdC1mYXN0LW91dC1zbG93LWluLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpJyxcbiAgJ21hdC1mYXN0LW91dC1saW5lYXItaW4tdGltaW5nLWZ1bmN0aW9uJzogJ2N1YmljLWJlemllcigwLjQsIDAsIDEsIDEpJyxcbiAgJ21hdC1lbGV2YXRpb24tdHJhbnNpdGlvbi1kdXJhdGlvbic6ICcyODBtcycsXG4gICdtYXQtZWxldmF0aW9uLXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uJzogJ2N1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSknLFxuICAnbWF0LWVsZXZhdGlvbi1jb2xvcic6ICcjMDAwJyxcbiAgJ21hdC1lbGV2YXRpb24tb3BhY2l0eSc6ICcxJyxcbiAgJ21hdC1lbGV2YXRpb24tcHJlZml4JzogYCdtYXQtZWxldmF0aW9uLXonYCxcbiAgJ21hdC1yaXBwbGUtY29sb3Itb3BhY2l0eSc6ICcwLjEnLFxuICAnbWF0LWJhZGdlLWZvbnQtc2l6ZSc6ICcxMnB4JyxcbiAgJ21hdC1iYWRnZS1mb250LXdlaWdodCc6ICc2MDAnLFxuICAnbWF0LWJhZGdlLWRlZmF1bHQtc2l6ZSc6ICcyMnB4JyxcbiAgJ21hdC1iYWRnZS1zbWFsbC1zaXplJzogJzE2cHgnLFxuICAnbWF0LWJhZGdlLWxhcmdlLXNpemUnOiAnMjhweCcsXG4gICdtYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFyZC1oZWlnaHQnOiAnNDhweCcsXG4gICdtYXQtYnV0dG9uLXRvZ2dsZS1zdGFuZGFyZC1taW5pbXVtLWhlaWdodCc6ICcyNHB4JyxcbiAgJ21hdC1idXR0b24tdG9nZ2xlLXN0YW5kYXJkLW1heGltdW0taGVpZ2h0JzogJzQ4cHgnLFxuICAnbWF0LWNoaXAtcmVtb3ZlLWZvbnQtc2l6ZSc6ICcxOHB4JyxcbiAgJ21hdC1kYXRlcGlja2VyLXNlbGVjdGVkLXRvZGF5LWJveC1zaGFkb3ctd2lkdGgnOiAnMXB4JyxcbiAgJ21hdC1kYXRlcGlja2VyLXNlbGVjdGVkLWZhZGUtYW1vdW50JzogJzAuNicsXG4gICdtYXQtZGF0ZXBpY2tlci1yYW5nZS1mYWRlLWFtb3VudCc6ICcwLjInLFxuICAnbWF0LWRhdGVwaWNrZXItdG9kYXktZmFkZS1hbW91bnQnOiAnMC4yJyxcbiAgJ21hdC1jYWxlbmRhci1ib2R5LWZvbnQtc2l6ZSc6ICcxM3B4JyxcbiAgJ21hdC1jYWxlbmRhci13ZWVrZGF5LXRhYmxlLWZvbnQtc2l6ZSc6ICcxMXB4JyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLWNvbGxhcHNlZC1oZWlnaHQnOiAnNDhweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1jb2xsYXBzZWQtbWluaW11bS1oZWlnaHQnOiAnMzZweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1jb2xsYXBzZWQtbWF4aW11bS1oZWlnaHQnOiAnNDhweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1leHBhbmRlZC1oZWlnaHQnOiAnNjRweCcsXG4gICdtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1leHBhbmRlZC1taW5pbXVtLWhlaWdodCc6ICc0OHB4JyxcbiAgJ21hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLWV4cGFuZGVkLW1heGltdW0taGVpZ2h0JzogJzY0cHgnLFxuICAnbWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItdHJhbnNpdGlvbic6ICcyMjVtcyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpJyxcbiAgJ21hdC1tZW51LXNpZGUtcGFkZGluZyc6ICcxNnB4JyxcbiAgJ21lbnUtbWVudS1pdGVtLWhlaWdodCc6ICc0OHB4JyxcbiAgJ21lbnUtbWVudS1pY29uLW1hcmdpbic6ICcxNnB4JyxcbiAgJ21hdC1wYWdpbmF0b3ItaGVpZ2h0JzogJzU2cHgnLFxuICAnbWF0LXBhZ2luYXRvci1taW5pbXVtLWhlaWdodCc6ICc0MHB4JyxcbiAgJ21hdC1wYWdpbmF0b3ItbWF4aW11bS1oZWlnaHQnOiAnNTZweCcsXG4gICdtYXQtc3RlcHBlci1oZWFkZXItaGVpZ2h0JzogJzcycHgnLFxuICAnbWF0LXN0ZXBwZXItaGVhZGVyLW1pbmltdW0taGVpZ2h0JzogJzQycHgnLFxuICAnbWF0LXN0ZXBwZXItaGVhZGVyLW1heGltdW0taGVpZ2h0JzogJzcycHgnLFxuICAnbWF0LXN0ZXBwZXItbGFiZWwtaGVhZGVyLWhlaWdodCc6ICcyNHB4JyxcbiAgJ21hdC1zdGVwcGVyLWxhYmVsLXBvc2l0aW9uLWJvdHRvbS10b3AtZ2FwJzogJzE2cHgnLFxuICAnbWF0LXN0ZXBwZXItbGFiZWwtbWluLXdpZHRoJzogJzUwcHgnLFxuICAnbWF0LXZlcnRpY2FsLXN0ZXBwZXItY29udGVudC1tYXJnaW4nOiAnMzZweCcsXG4gICdtYXQtc3RlcHBlci1zaWRlLWdhcCc6ICcyNHB4JyxcbiAgJ21hdC1zdGVwcGVyLWxpbmUtd2lkdGgnOiAnMXB4JyxcbiAgJ21hdC1zdGVwcGVyLWxpbmUtZ2FwJzogJzhweCcsXG4gICdtYXQtc3RlcC1zdWItbGFiZWwtZm9udC1zaXplJzogJzEycHgnLFxuICAnbWF0LXN0ZXAtaGVhZGVyLWljb24tc2l6ZSc6ICcxNnB4JyxcbiAgJ21hdC10b29sYmFyLW1pbmltdW0taGVpZ2h0JzogJzQ0cHgnLFxuICAnbWF0LXRvb2xiYXItaGVpZ2h0LWRlc2t0b3AnOiAnNjRweCcsXG4gICdtYXQtdG9vbGJhci1tYXhpbXVtLWhlaWdodC1kZXNrdG9wJzogJzY0cHgnLFxuICAnbWF0LXRvb2xiYXItbWluaW11bS1oZWlnaHQtZGVza3RvcCc6ICc0NHB4JyxcbiAgJ21hdC10b29sYmFyLWhlaWdodC1tb2JpbGUnOiAnNTZweCcsXG4gICdtYXQtdG9vbGJhci1tYXhpbXVtLWhlaWdodC1tb2JpbGUnOiAnNTZweCcsXG4gICdtYXQtdG9vbGJhci1taW5pbXVtLWhlaWdodC1tb2JpbGUnOiAnNDRweCcsXG4gICdtYXQtdG9vbHRpcC10YXJnZXQtaGVpZ2h0JzogJzIycHgnLFxuICAnbWF0LXRvb2x0aXAtZm9udC1zaXplJzogJzEwcHgnLFxuICAnbWF0LXRvb2x0aXAtdmVydGljYWwtcGFkZGluZyc6ICc2cHgnLFxuICAnbWF0LXRvb2x0aXAtaGFuZHNldC10YXJnZXQtaGVpZ2h0JzogJzMwcHgnLFxuICAnbWF0LXRvb2x0aXAtaGFuZHNldC1mb250LXNpemUnOiAnMTRweCcsXG4gICdtYXQtdG9vbHRpcC1oYW5kc2V0LXZlcnRpY2FsLXBhZGRpbmcnOiAnOHB4JyxcbiAgJ21hdC10cmVlLW5vZGUtaGVpZ2h0JzogJzQ4cHgnLFxuICAnbWF0LXRyZWUtbm9kZS1taW5pbXVtLWhlaWdodCc6ICcyNHB4JyxcbiAgJ21hdC10cmVlLW5vZGUtbWF4aW11bS1oZWlnaHQnOiAnNDhweCcsXG59O1xuXG4vKipcbiAqIE1hdGVyaWFsIHZhcmlhYmxlcyAqKndpdGhvdXQgYSBgbWF0LWAgcHJlZml4KiogdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBwdWJsaWMgQVBJXG4gKiBhbmQgd2hpY2ggc2hvdWxkIGJlIHJlcGxhY2VkIHdpdGggdGhlaXIgdmFsdWVzLiBUaGVzZSBzaG91bGQgYmUgbWlncmF0ZWQgb25seSB3aGVuIHRoZXJlJ3MgYVxuICogTWF0ZXJpYWwgaW1wb3J0LCBiZWNhdXNlIHRoZWlyIG5hbWVzIGNvdWxkIGNvbmZsaWN0IHdpdGggb3RoZXIgdmFyaWFibGVzIGluIHRoZSB1c2VyJ3MgYXBwLlxuICovXG5leHBvcnQgY29uc3QgdW5wcmVmaXhlZFJlbW92ZWRWYXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICd6LWluZGV4LWZhYic6ICcyMCcsXG4gICd6LWluZGV4LWRyYXdlcic6ICcxMDAnLFxuICAnZWFzZS1pbi1vdXQtY3VydmUtZnVuY3Rpb24nOiAnY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJyxcbiAgJ3N3aWZ0LWVhc2Utb3V0LWR1cmF0aW9uJzogJzQwMG1zJyxcbiAgJ3N3aWZ0LWVhc2Utb3V0LXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC4yNSwgMC44LCAwLjI1LCAxKScsXG4gICdzd2lmdC1lYXNlLW91dCc6ICdhbGwgNDAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSknLFxuICAnc3dpZnQtZWFzZS1pbi1kdXJhdGlvbic6ICczMDBtcycsXG4gICdzd2lmdC1lYXNlLWluLXRpbWluZy1mdW5jdGlvbic6ICdjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScsXG4gICdzd2lmdC1lYXNlLWluJzogJ2FsbCAzMDBtcyBjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScsXG4gICdzd2lmdC1lYXNlLWluLW91dC1kdXJhdGlvbic6ICc1MDBtcycsXG4gICdzd2lmdC1lYXNlLWluLW91dC10aW1pbmctZnVuY3Rpb24nOiAnY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJyxcbiAgJ3N3aWZ0LWVhc2UtaW4tb3V0JzogJ2FsbCA1MDBtcyBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknLFxuICAnc3dpZnQtbGluZWFyLWR1cmF0aW9uJzogJzgwbXMnLFxuICAnc3dpZnQtbGluZWFyLXRpbWluZy1mdW5jdGlvbic6ICdsaW5lYXInLFxuICAnc3dpZnQtbGluZWFyJzogJ2FsbCA4MG1zIGxpbmVhcicsXG4gICdibGFjay04Ny1vcGFjaXR5JzogJ3JnYmEoYmxhY2ssIDAuODcpJyxcbiAgJ3doaXRlLTg3LW9wYWNpdHknOiAncmdiYSh3aGl0ZSwgMC44NyknLFxuICAnYmxhY2stMTItb3BhY2l0eSc6ICdyZ2JhKGJsYWNrLCAwLjEyKScsXG4gICd3aGl0ZS0xMi1vcGFjaXR5JzogJ3JnYmEod2hpdGUsIDAuMTIpJyxcbiAgJ2JsYWNrLTYtb3BhY2l0eSc6ICdyZ2JhKGJsYWNrLCAwLjA2KScsXG4gICd3aGl0ZS02LW9wYWNpdHknOiAncmdiYSh3aGl0ZSwgMC4wNiknLFxuICAnZGFyay1wcmltYXJ5LXRleHQnOiAncmdiYShibGFjaywgMC44NyknLFxuICAnZGFyay1zZWNvbmRhcnktdGV4dCc6ICdyZ2JhKGJsYWNrLCAwLjU0KScsXG4gICdkYXJrLWRpc2FibGVkLXRleHQnOiAncmdiYShibGFjaywgMC4zOCknLFxuICAnZGFyay1kaXZpZGVycyc6ICdyZ2JhKGJsYWNrLCAwLjEyKScsXG4gICdkYXJrLWZvY3VzZWQnOiAncmdiYShibGFjaywgMC4xMiknLFxuICAnbGlnaHQtcHJpbWFyeS10ZXh0JzogJ3doaXRlJyxcbiAgJ2xpZ2h0LXNlY29uZGFyeS10ZXh0JzogJ3JnYmEod2hpdGUsIDAuNyknLFxuICAnbGlnaHQtZGlzYWJsZWQtdGV4dCc6ICdyZ2JhKHdoaXRlLCAwLjUpJyxcbiAgJ2xpZ2h0LWRpdmlkZXJzJzogJ3JnYmEod2hpdGUsIDAuMTIpJyxcbiAgJ2xpZ2h0LWZvY3VzZWQnOiAncmdiYSh3aGl0ZSwgMC4xMiknLFxufTtcbiJdfQ==