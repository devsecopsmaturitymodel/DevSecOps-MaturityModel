"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.symbolRemoval = void 0;
const schematics_1 = require("@angular/cdk/schematics");
exports.symbolRemoval = {
    [schematics_1.TargetVersion.V13]: [
        {
            pr: 'https://github.com/angular/components/pull/23529',
            changes: [
                'CanColorCtor',
                'CanDisableRippleCtor',
                'CanDisableCtor',
                'CanUpdateErrorStateCtor',
                'HasInitializedCtor',
                'HasTabIndexCtor',
            ].map(name => ({
                name,
                module: '@angular/material/core',
                message: `\`${name}\` is no longer necessary and has been removed.`,
            })),
        },
    ],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9sLXJlbW92YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvZGF0YS9zeW1ib2wtcmVtb3ZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBZ0c7QUFFbkYsUUFBQSxhQUFhLEdBQTZDO0lBQ3JFLENBQUMsMEJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNuQjtZQUNFLEVBQUUsRUFBRSxrREFBa0Q7WUFDdEQsT0FBTyxFQUFFO2dCQUNQLGNBQWM7Z0JBQ2Qsc0JBQXNCO2dCQUN0QixnQkFBZ0I7Z0JBQ2hCLHlCQUF5QjtnQkFDekIsb0JBQW9CO2dCQUNwQixpQkFBaUI7YUFDbEIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNiLElBQUk7Z0JBQ0osTUFBTSxFQUFFLHdCQUF3QjtnQkFDaEMsT0FBTyxFQUFFLEtBQUssSUFBSSxpREFBaUQ7YUFDcEUsQ0FBQyxDQUFDO1NBQ0o7S0FDRjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTeW1ib2xSZW1vdmFsVXBncmFkZURhdGEsIFRhcmdldFZlcnNpb24sIFZlcnNpb25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbmV4cG9ydCBjb25zdCBzeW1ib2xSZW1vdmFsOiBWZXJzaW9uQ2hhbmdlczxTeW1ib2xSZW1vdmFsVXBncmFkZURhdGE+ID0ge1xuICBbVGFyZ2V0VmVyc2lvbi5WMTNdOiBbXG4gICAge1xuICAgICAgcHI6ICdodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMjM1MjknLFxuICAgICAgY2hhbmdlczogW1xuICAgICAgICAnQ2FuQ29sb3JDdG9yJyxcbiAgICAgICAgJ0NhbkRpc2FibGVSaXBwbGVDdG9yJyxcbiAgICAgICAgJ0NhbkRpc2FibGVDdG9yJyxcbiAgICAgICAgJ0NhblVwZGF0ZUVycm9yU3RhdGVDdG9yJyxcbiAgICAgICAgJ0hhc0luaXRpYWxpemVkQ3RvcicsXG4gICAgICAgICdIYXNUYWJJbmRleEN0b3InLFxuICAgICAgXS5tYXAobmFtZSA9PiAoe1xuICAgICAgICBuYW1lLFxuICAgICAgICBtb2R1bGU6ICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJyxcbiAgICAgICAgbWVzc2FnZTogYFxcYCR7bmFtZX1cXGAgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSBhbmQgaGFzIGJlZW4gcmVtb3ZlZC5gLFxuICAgICAgfSkpLFxuICAgIH0sXG4gIF0sXG59O1xuIl19