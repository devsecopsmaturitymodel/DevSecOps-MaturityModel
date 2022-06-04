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
const schematics_1 = require("@angular/cdk/schematics");
exports.classNames = {
    [schematics_1.TargetVersion.V10]: [
        {
            pr: 'https://github.com/angular/components/pull/19289',
            changes: [{ replace: 'MatButtonToggleGroupMultiple', replaceWith: 'MatButtonToggleGroup' }],
        },
    ],
    [schematics_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10291',
            changes: [
                { replace: 'FloatPlaceholderType', replaceWith: 'FloatLabelType' },
                { replace: 'MAT_PLACEHOLDER_GLOBAL_OPTIONS', replaceWith: 'MAT_LABEL_GLOBAL_OPTIONS' },
                { replace: 'PlaceholderOptions', replaceWith: 'LabelOptions' },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtbmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9jbGFzcy1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBNEY7QUFFL0UsUUFBQSxVQUFVLEdBQXlDO0lBQzlELENBQUMsMEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFDLENBQUM7U0FDMUY7S0FDRjtJQUNELENBQUMsMEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQztnQkFDaEUsRUFBQyxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsV0FBVyxFQUFFLDBCQUEwQixFQUFDO2dCQUNwRixFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFDO2FBQzdEO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDbGFzc05hbWVVcGdyYWRlRGF0YSwgVGFyZ2V0VmVyc2lvbiwgVmVyc2lvbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGNvbnN0IGNsYXNzTmFtZXM6IFZlcnNpb25DaGFuZ2VzPENsYXNzTmFtZVVwZ3JhZGVEYXRhPiA9IHtcbiAgW1RhcmdldFZlcnNpb24uVjEwXTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzE5Mjg5JyxcbiAgICAgIGNoYW5nZXM6IFt7cmVwbGFjZTogJ01hdEJ1dHRvblRvZ2dsZUdyb3VwTXVsdGlwbGUnLCByZXBsYWNlV2l0aDogJ01hdEJ1dHRvblRvZ2dsZUdyb3VwJ31dLFxuICAgIH0sXG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjkxJyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICdGbG9hdFBsYWNlaG9sZGVyVHlwZScsIHJlcGxhY2VXaXRoOiAnRmxvYXRMYWJlbFR5cGUnfSxcbiAgICAgICAge3JlcGxhY2U6ICdNQVRfUExBQ0VIT0xERVJfR0xPQkFMX09QVElPTlMnLCByZXBsYWNlV2l0aDogJ01BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUyd9LFxuICAgICAgICB7cmVwbGFjZTogJ1BsYWNlaG9sZGVyT3B0aW9ucycsIHJlcGxhY2VXaXRoOiAnTGFiZWxPcHRpb25zJ30sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59O1xuIl19