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
const target_version_1 = require("../../update-tool/target-version");
exports.methodCallChecks = {
    [target_version_1.TargetVersion.V11]: [
        {
            pr: 'https://github.com/angular/components/pull/20500',
            changes: [
                {
                    className: 'DropListRef',
                    method: 'drop',
                    invalidArgCounts: [
                        {
                            count: 5,
                            message: 'The "previousIndex" parameter is required and the parameter order has changed.',
                        },
                    ],
                },
            ],
        },
    ],
    [target_version_1.TargetVersion.V9]: [
        {
            pr: 'https://github.com/angular/components/pull/17084',
            changes: [
                {
                    className: 'DropListRef',
                    method: 'drop',
                    invalidArgCounts: [{ count: 4, message: 'The "distance" parameter is required' }],
                },
            ],
        },
    ],
    [target_version_1.TargetVersion.V8]: [],
    [target_version_1.TargetVersion.V7]: [],
    [target_version_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10325',
            changes: [
                {
                    className: 'FocusMonitor',
                    method: 'monitor',
                    invalidArgCounts: [{ count: 3, message: 'The "renderer" argument has been removed' }],
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kLWNhbGwtY2hlY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL25nLXVwZGF0ZS9kYXRhL21ldGhvZC1jYWxsLWNoZWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxxRUFBK0Q7QUFTbEQsUUFBQSxnQkFBZ0IsR0FBMEM7SUFDckUsQ0FBQyw4QkFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsU0FBUyxFQUFFLGFBQWE7b0JBQ3hCLE1BQU0sRUFBRSxNQUFNO29CQUNkLGdCQUFnQixFQUFFO3dCQUNoQjs0QkFDRSxLQUFLLEVBQUUsQ0FBQzs0QkFDUixPQUFPLEVBQ0wsZ0ZBQWdGO3lCQUNuRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRjtJQUNELENBQUMsOEJBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNsQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLFNBQVMsRUFBRSxhQUFhO29CQUN4QixNQUFNLEVBQUUsTUFBTTtvQkFDZCxnQkFBZ0IsRUFBRSxDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsc0NBQXNDLEVBQUMsQ0FBQztpQkFDaEY7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QixDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QixDQUFDLDhCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDbEI7WUFDRSxFQUFFLEVBQUUsa0RBQWtEO1lBQ3RELE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxTQUFTLEVBQUUsY0FBYztvQkFDekIsTUFBTSxFQUFFLFNBQVM7b0JBQ2pCLGdCQUFnQixFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSwwQ0FBMEMsRUFBQyxDQUFDO2lCQUNwRjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUYXJnZXRWZXJzaW9ufSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC90YXJnZXQtdmVyc2lvbic7XG5pbXBvcnQge1ZlcnNpb25DaGFuZ2VzfSBmcm9tICcuLi8uLi91cGRhdGUtdG9vbC92ZXJzaW9uLWNoYW5nZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1ldGhvZENhbGxVcGdyYWRlRGF0YSB7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBtZXRob2Q6IHN0cmluZztcbiAgaW52YWxpZEFyZ0NvdW50czoge2NvdW50OiBudW1iZXI7IG1lc3NhZ2U6IHN0cmluZ31bXTtcbn1cblxuZXhwb3J0IGNvbnN0IG1ldGhvZENhbGxDaGVja3M6IFZlcnNpb25DaGFuZ2VzPE1ldGhvZENhbGxVcGdyYWRlRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlYxMV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8yMDUwMCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdEcm9wTGlzdFJlZicsXG4gICAgICAgICAgbWV0aG9kOiAnZHJvcCcsXG4gICAgICAgICAgaW52YWxpZEFyZ0NvdW50czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb3VudDogNSxcbiAgICAgICAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAgICAgICAnVGhlIFwicHJldmlvdXNJbmRleFwiIHBhcmFtZXRlciBpcyByZXF1aXJlZCBhbmQgdGhlIHBhcmFtZXRlciBvcmRlciBoYXMgY2hhbmdlZC4nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WOV06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xNzA4NCcsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdEcm9wTGlzdFJlZicsXG4gICAgICAgICAgbWV0aG9kOiAnZHJvcCcsXG4gICAgICAgICAgaW52YWxpZEFyZ0NvdW50czogW3tjb3VudDogNCwgbWVzc2FnZTogJ1RoZSBcImRpc3RhbmNlXCIgcGFyYW1ldGVyIGlzIHJlcXVpcmVkJ31dLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuICBbVGFyZ2V0VmVyc2lvbi5WOF06IFtdLFxuICBbVGFyZ2V0VmVyc2lvbi5WN106IFtdLFxuICBbVGFyZ2V0VmVyc2lvbi5WNl06IFtcbiAgICB7XG4gICAgICBwcjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDMyNScsXG4gICAgICBjaGFuZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdGb2N1c01vbml0b3InLFxuICAgICAgICAgIG1ldGhvZDogJ21vbml0b3InLFxuICAgICAgICAgIGludmFsaWRBcmdDb3VudHM6IFt7Y291bnQ6IDMsIG1lc3NhZ2U6ICdUaGUgXCJyZW5kZXJlclwiIGFyZ3VtZW50IGhhcyBiZWVuIHJlbW92ZWQnfV0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59O1xuIl19