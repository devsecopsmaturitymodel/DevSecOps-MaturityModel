/// <amd-module name="@angular/localize/tools/src/extract/translation_files/legacy_message_id_migration_serializer" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedMessage as ParsedMessage } from '@angular/localize';
import { Diagnostics } from '../../diagnostics';
import { TranslationSerializer } from './translation_serializer';
/**
 * A translation serializer that generates the mapping file for the legacy message ID migration.
 * The file is used by the `localize-migrate` script to migrate existing translation files from
 * the legacy message IDs to the canonical ones.
 */
export declare class LegacyMessageIdMigrationSerializer implements TranslationSerializer {
    private _diagnostics;
    constructor(_diagnostics: Diagnostics);
    serialize(messages: ParsedMessage[]): string;
}
