/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ArchitectCommand } from '../models/architect-command';
import { Arguments } from '../models/interface';
import { Schema as ExtractI18nCommandSchema } from './extract-i18n';
export declare class ExtractI18nCommand extends ArchitectCommand<ExtractI18nCommandSchema> {
    readonly target = "extract-i18n";
    run(options: ExtractI18nCommandSchema & Arguments): Promise<number>;
}
