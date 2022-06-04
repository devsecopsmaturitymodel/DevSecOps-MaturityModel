/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ResolvedResource } from '../../../update-tool/component-resource-collector';
import { DevkitMigration } from '../../devkit-migration';
/** Migration that removes tilde symbols from imports. */
export declare class TildeImportMigration extends DevkitMigration<null> {
    enabled: boolean;
    visitStylesheet(stylesheet: ResolvedResource): void;
}
