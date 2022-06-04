"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodCallChecks = void 0;
const schematics_1 = require("@angular/cdk/schematics");
exports.methodCallChecks = {
    [schematics_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/pull/20499',
            changes: [
                {
                    className: 'MatTabNav',
                    method: 'updateActiveLink',
                    invalidArgCounts: [{ count: 1, message: 'The "_element" parameter has been removed' }],
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kLWNhbGwtY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL2RhdGEvbWV0aG9kLWNhbGwtY2hlY2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUE2RjtBQUVoRixRQUFBLGdCQUFnQixHQUEwQztJQUNyRSxDQUFDLDBCQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxTQUFTLEVBQUUsV0FBVztvQkFDdEIsTUFBTSxFQUFFLGtCQUFrQjtvQkFDMUIsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLDJDQUEyQyxFQUFDLENBQUM7aUJBQ3JGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01ldGhvZENhbGxVcGdyYWRlRGF0YSwgVGFyZ2V0VmVyc2lvbiwgVmVyc2lvbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuZXhwb3J0IGNvbnN0IG1ldGhvZENhbGxDaGVja3M6IFZlcnNpb25DaGFuZ2VzPE1ldGhvZENhbGxVcGdyYWRlRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlYxMV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMDQ5OScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdNYXRUYWJOYXYnLFxuICAgICAgICAgIG1ldGhvZDogJ3VwZGF0ZUFjdGl2ZUxpbmsnLFxuICAgICAgICAgIGludmFsaWRBcmdDb3VudHM6IFt7Y291bnQ6IDEsIG1lc3NhZ2U6ICdUaGUgXCJfZWxlbWVudFwiIHBhcmFtZXRlciBoYXMgYmVlbiByZW1vdmVkJ31dLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufTtcbiJdfQ==