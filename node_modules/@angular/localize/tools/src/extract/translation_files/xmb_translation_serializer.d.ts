/// <amd-module name="@angular/localize/tools/src/extract/translation_files/xmb_translation_serializer" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbsoluteFsPath, PathManipulation } from '@angular/compiler-cli/private/localize';
import { ɵParsedMessage } from '@angular/localize';
import { TranslationSerializer } from './translation_serializer';
/**
 * A translation serializer that can write files in XMB format.
 *
 * http://cldr.unicode.org/development/development-process/design-proposals/xmb
 *
 * @see XmbTranslationParser
 * @publicApi used by CLI
 */
export declare class XmbTranslationSerializer implements TranslationSerializer {
    private basePath;
    private useLegacyIds;
    private fs;
    constructor(basePath: AbsoluteFsPath, useLegacyIds: boolean, fs?: PathManipulation);
    serialize(messages: ɵParsedMessage[]): string;
    private serializeLocation;
    private serializeMessage;
    private serializeTextPart;
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
     * An XMB legacy message id is a 64 bit number encoded as a decimal string, which will have
     * at most 20 digits, since 2^65-1 = 36,893,488,147,419,103,231. This digest is based on:
     * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
     */
    private getMessageId;
}
