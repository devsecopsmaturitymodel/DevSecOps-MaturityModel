"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const generate_from_files_1 = require("../utility/generate-from-files");
const schema_1 = require("./schema");
function default_1(options) {
    if (!options.implements) {
        throw new schematics_1.SchematicsException('Option "implements" is required.');
    }
    const implementations = options.implements
        .map((implement) => (implement === 'CanDeactivate' ? 'CanDeactivate<unknown>' : implement))
        .join(', ');
    const commonRouterNameImports = ['ActivatedRouteSnapshot', 'RouterStateSnapshot'];
    const routerNamedImports = [...options.implements, 'UrlTree'];
    if (options.implements.includes(schema_1.Implement.CanLoad)) {
        routerNamedImports.push('Route', 'UrlSegment');
        if (options.implements.length > 1) {
            routerNamedImports.push(...commonRouterNameImports);
        }
    }
    else {
        routerNamedImports.push(...commonRouterNameImports);
    }
    routerNamedImports.sort();
    const implementationImports = routerNamedImports.join(', ');
    return (0, generate_from_files_1.generateFromFiles)(options, {
        implementations,
        implementationImports,
    });
}
exports.default = default_1;
