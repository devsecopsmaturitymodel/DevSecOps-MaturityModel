/// <amd-module name="@angular/localize/tools/src/extract/translation_files/xliff1_translation_serializer" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, PathManipulation } from '@angular/compiler-cli/private/localize';
import { ɵParsedMessage } from '@angular/localize';
import { FormatOptions } from './format_options';
import { TranslationSerializer } from './translation_serializer';
/**
 * A translation serializer that can write XLIFF 1.2 formatted files.
 *
 * https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
 * https://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
 *
 * @see Xliff1TranslationParser
 * @publicApi used by CLI
 */
export declare class Xliff1TranslationSerializer implements TranslationSerializer {
    private sourceLocale;
    private basePath;
    private useLegacyIds;
    private formatOptions;
    private fs;
    constructor(sourceLocale: string, basePath: AbsoluteFsPath, useLegacyIds: boolean, formatOptions?: FormatOptions, fs?: PathManipulation);
    serialize(messages: ɵParsedMessage[]): string;
    private serializeMessage;
    private serializeTextPart;
    private serializePlaceholder;
    private serializeNote;
    private serializeLocation;
    private renderContext;
    /**
     * Get the id for the given `message`.
     *
     * If there was a custom id provided, use that.
     *
     * If we have requested legacy message ids, then try to return the appropriate id
     * from the list of legacy ids that were extracted.
     *
     * Otherwise return the canonical message id.
     *
     * An Xliff 1.2 legacy message id is a hex encoded SHA-1 string, which is 40 characters long. See
     * https://csrc.nist.gov/csrc/media/publications/fips/180/4/final/documents/fips180-4-draft-aug2014.pdf
     */
    private getMessageId;
}
