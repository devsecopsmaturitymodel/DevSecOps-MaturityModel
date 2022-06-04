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
const target_version_1 = require("../../update-tool/target-version");
exports.outputNames = {
    [target_version_1.TargetVersion.V10]: [
        {
            pr: 'https://github.com/angular/components/pull/19362',
            changes: [
                {
                    replace: 'copied',
                    replaceWith: 'cdkCopyToClipboardCopied',
                    limitedTo: {
                        attributes: ['cdkCopyToClipboard'],
                    },
                },
            ],
        },
    ],
    [target_version_1.TargetVersion.V6]: [],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LW5hbWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL25nLXVwZGF0ZS9kYXRhL291dHB1dC1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxRUFBK0Q7QUFpQmxELFFBQUEsV0FBVyxHQUEwQztJQUNoRSxDQUFDLDhCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxPQUFPLEVBQUUsUUFBUTtvQkFDakIsV0FBVyxFQUFFLDBCQUEwQjtvQkFDdkMsU0FBUyxFQUFFO3dCQUNULFVBQVUsRUFBRSxDQUFDLG9CQUFvQixDQUFDO3FCQUNuQztpQkFDRjthQUNGO1NBQ0Y7S0FDRjtJQUNELENBQUMsOEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3ZCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUYXJnZXRWZXJzaW9ufSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC90YXJnZXQtdmVyc2lvbic7XG5pbXBvcnQge1ZlcnNpb25DaGFuZ2VzfSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC92ZXJzaW9uLWNoYW5nZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE91dHB1dE5hbWVVcGdyYWRlRGF0YSB7XG4gIC8qKiBUaGUgQE91dHB1dCgpIG5hbWUgdG8gcmVwbGFjZS4gKi9cbiAgcmVwbGFjZTogc3RyaW5nO1xuICAvKiogVGhlIG5ldyBuYW1lIGZvciB0aGUgQE91dHB1dCgpLiAqL1xuICByZXBsYWNlV2l0aDogc3RyaW5nO1xuICAvKiogQ29udHJvbHMgd2hpY2ggZWxlbWVudHMgYW5kIGF0dHJpYnV0ZXMgaW4gd2hpY2ggdGhpcyByZXBsYWNlbWVudCBpcyBtYWRlLiAqL1xuICBsaW1pdGVkVG86IHtcbiAgICAvKiogTGltaXQgdG8gZWxlbWVudHMgd2l0aCBhbnkgb2YgdGhlc2UgZWxlbWVudCB0YWdzLiAqL1xuICAgIGVsZW1lbnRzPzogc3RyaW5nW107XG4gICAgLyoqIExpbWl0IHRvIGVsZW1lbnRzIHdpdGggYW55IG9mIHRoZXNlIGF0dHJpYnV0ZXMuICovXG4gICAgYXR0cmlidXRlcz86IHN0cmluZ1tdO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3Qgb3V0cHV0TmFtZXM6IFZlcnNpb25DaGFuZ2VzPE91dHB1dE5hbWVVcGdyYWRlRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlYxMF06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xOTM2MicsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByZXBsYWNlOiAnY29waWVkJyxcbiAgICAgICAgICByZXBsYWNlV2l0aDogJ2Nka0NvcHlUb0NsaXBib2FyZENvcGllZCcsXG4gICAgICAgICAgbGltaXRlZFRvOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ2Nka0NvcHlUb0NsaXBib2FyZCddLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW10sXG59O1xuIl19