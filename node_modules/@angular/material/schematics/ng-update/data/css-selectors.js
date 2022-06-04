"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssSelectors = void 0;
const schematics_1 = require("@angular/cdk/schematics");
exports.cssSelectors = {
    [schematics_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/components/pull/10296',
            changes: [
                { replace: '.mat-form-field-placeholder', replaceWith: '.mat-form-field-label' },
                { replace: '.mat-input-container', replaceWith: '.mat-form-field' },
                { replace: '.mat-input-flex', replaceWith: '.mat-form-field-flex' },
                { replace: '.mat-input-hint-spacer', replaceWith: '.mat-form-field-hint-spacer' },
                { replace: '.mat-input-hint-wrapper', replaceWith: '.mat-form-field-hint-wrapper' },
                { replace: '.mat-input-infix', replaceWith: '.mat-form-field-infix' },
                { replace: '.mat-input-invalid', replaceWith: '.mat-form-field-invalid' },
                { replace: '.mat-input-placeholder', replaceWith: '.mat-form-field-label' },
                { replace: '.mat-input-placeholder-wrapper', replaceWith: '.mat-form-field-label-wrapper' },
                { replace: '.mat-input-prefix', replaceWith: '.mat-form-field-prefix' },
                { replace: '.mat-input-ripple', replaceWith: '.mat-form-field-ripple' },
                { replace: '.mat-input-subscript-wrapper', replaceWith: '.mat-form-field-subscript-wrapper' },
                { replace: '.mat-input-suffix', replaceWith: '.mat-form-field-suffix' },
                { replace: '.mat-input-underline', replaceWith: '.mat-form-field-underline' },
                { replace: '.mat-input-wrapper', replaceWith: '.mat-form-field-wrapper' },
            ],
        },
        // TODO(devversion): this shouldn't be here because it's not a CSS selector. Move into misc
        // rule.
        {
            pr: 'https://github.com/angular/components/pull/10430',
            changes: [
                {
                    replace: '$mat-font-family',
                    replaceWith: "Roboto, 'Helvetica Neue', sans-serif",
                    replaceIn: { stylesheet: true },
                },
            ],
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLXNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9kYXRhL2Nzcy1zZWxlY3RvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQXNFO0FBcUJ6RCxRQUFBLFlBQVksR0FBNEM7SUFDbkUsQ0FBQywwQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ2xCO1lBQ0UsRUFBRSxFQUFFLGtEQUFrRDtZQUN0RCxPQUFPLEVBQUU7Z0JBQ1AsRUFBQyxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsV0FBVyxFQUFFLHVCQUF1QixFQUFDO2dCQUM5RSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUM7Z0JBQ2pFLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBQztnQkFDakUsRUFBQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsV0FBVyxFQUFFLDZCQUE2QixFQUFDO2dCQUMvRSxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsOEJBQThCLEVBQUM7Z0JBQ2pGLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSx1QkFBdUIsRUFBQztnQkFDbkUsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLHlCQUF5QixFQUFDO2dCQUN2RSxFQUFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxXQUFXLEVBQUUsdUJBQXVCLEVBQUM7Z0JBQ3pFLEVBQUMsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLFdBQVcsRUFBRSwrQkFBK0IsRUFBQztnQkFDekYsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixFQUFDO2dCQUNyRSxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsd0JBQXdCLEVBQUM7Z0JBQ3JFLEVBQUMsT0FBTyxFQUFFLDhCQUE4QixFQUFFLFdBQVcsRUFBRSxtQ0FBbUMsRUFBQztnQkFDM0YsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixFQUFDO2dCQUNyRSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLEVBQUM7Z0JBQzNFLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsRUFBRSx5QkFBeUIsRUFBQzthQUN4RTtTQUNGO1FBRUQsMkZBQTJGO1FBQzNGLFFBQVE7UUFDUjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLFdBQVcsRUFBRSxzQ0FBc0M7b0JBQ25ELFNBQVMsRUFBRSxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUM7aUJBQzlCO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RhcmdldFZlcnNpb24sIFZlcnNpb25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWF0ZXJpYWxDc3NTZWxlY3RvckRhdGEge1xuICAvKiogVGhlIENTUyBzZWxlY3RvciB0byByZXBsYWNlLiAqL1xuICByZXBsYWNlOiBzdHJpbmc7XG4gIC8qKiBUaGUgbmV3IENTUyBzZWxlY3Rvci4gKi9cbiAgcmVwbGFjZVdpdGg6IHN0cmluZztcbiAgLyoqXG4gICAqIENvbnRyb2xzIHdoaWNoIGZpbGUgdHlwZXMgaW4gd2hpY2ggdGhpcyByZXBsYWNlbWVudCBpcyBtYWRlLiBJZiBvbWl0dGVkLCBpdCBpcyBtYWRlIGluIGFsbFxuICAgKiBmaWxlcy5cbiAgICovXG4gIHJlcGxhY2VJbj86IHtcbiAgICAvKiogUmVwbGFjZSB0aGlzIG5hbWUgaW4gc3R5bGVzaGVldCBmaWxlcy4gKi9cbiAgICBzdHlsZXNoZWV0PzogYm9vbGVhbjtcbiAgICAvKiogUmVwbGFjZSB0aGlzIG5hbWUgaW4gSFRNTCBmaWxlcy4gKi9cbiAgICBodG1sPzogYm9vbGVhbjtcbiAgICAvKiogUmVwbGFjZSB0aGlzIG5hbWUgaW4gVHlwZVNjcmlwdCBzdHJpbmdzLiAqL1xuICAgIHRzU3RyaW5nTGl0ZXJhbHM/OiBib29sZWFuO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY3NzU2VsZWN0b3JzOiBWZXJzaW9uQ2hhbmdlczxNYXRlcmlhbENzc1NlbGVjdG9yRGF0YT4gPSB7XG4gIFtUYXJnZXRWZXJzaW9uLlY2XTogW1xuICAgIHtcbiAgICAgIHByOiAnaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwMjk2JyxcbiAgICAgIGNoYW5nZXM6IFtcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWZvcm0tZmllbGQtcGxhY2Vob2xkZXInLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1sYWJlbCd9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtY29udGFpbmVyJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LWZsZXgnLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1mbGV4J30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1oaW50LXNwYWNlcicsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLWhpbnQtc3BhY2VyJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1oaW50LXdyYXBwZXInLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1oaW50LXdyYXBwZXInfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LWluZml4JywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtaW5maXgnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LWludmFsaWQnLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1pbnZhbGlkJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1wbGFjZWhvbGRlcicsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLWxhYmVsJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1wbGFjZWhvbGRlci13cmFwcGVyJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtbGFiZWwtd3JhcHBlcid9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtcHJlZml4JywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtcHJlZml4J30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC1yaXBwbGUnLCByZXBsYWNlV2l0aDogJy5tYXQtZm9ybS1maWVsZC1yaXBwbGUnfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LXN1YnNjcmlwdC13cmFwcGVyJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtc3Vic2NyaXB0LXdyYXBwZXInfSxcbiAgICAgICAge3JlcGxhY2U6ICcubWF0LWlucHV0LXN1ZmZpeCcsIHJlcGxhY2VXaXRoOiAnLm1hdC1mb3JtLWZpZWxkLXN1ZmZpeCd9LFxuICAgICAgICB7cmVwbGFjZTogJy5tYXQtaW5wdXQtdW5kZXJsaW5lJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtdW5kZXJsaW5lJ30sXG4gICAgICAgIHtyZXBsYWNlOiAnLm1hdC1pbnB1dC13cmFwcGVyJywgcmVwbGFjZVdpdGg6ICcubWF0LWZvcm0tZmllbGQtd3JhcHBlcid9LFxuICAgICAgXSxcbiAgICB9LFxuXG4gICAgLy8gVE9ETyhkZXZ2ZXJzaW9uKTogdGhpcyBzaG91bGRuJ3QgYmUgaGVyZSBiZWNhdXNlIGl0J3Mgbm90IGEgQ1NTIHNlbGVjdG9yLiBNb3ZlIGludG8gbWlzY1xuICAgIC8vIHJ1bGUuXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTA0MzAnLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgcmVwbGFjZTogJyRtYXQtZm9udC1mYW1pbHknLFxuICAgICAgICAgIHJlcGxhY2VXaXRoOiBcIlJvYm90bywgJ0hlbHZldGljYSBOZXVlJywgc2Fucy1zZXJpZlwiLFxuICAgICAgICAgIHJlcGxhY2VJbjoge3N0eWxlc2hlZXQ6IHRydWV9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufTtcbiJdfQ==