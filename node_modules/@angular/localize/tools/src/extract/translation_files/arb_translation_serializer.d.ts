/// <amd-module name="@angular/localize/tools/src/extract/translation_files/arb_translation_serializer" />
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
 * A translation serializer that can render JSON formatted as an Application Resource Bundle (ARB).
 *
 * See https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification
 *
 * ```
 * {
 *   "@@locale": "en-US",
 *   "message-id": "Target message string",
 *   "@message-id": {
 *     "type": "text",
 *     "description": "Some description text",
 *     "x-locations": [
 *       {
 *         "start": {"line": 23, "column": 145},
 *         "end": {"line": 24, "column": 53},
 *         "file": "some/file.ts"
 *       },
 *       ...
 *     ]
 *   },
 *   ...
 * }
 * ```
 */
export declare class ArbTranslationSerializer implements TranslationSerializer {
    private sourceLocale;
    private basePath;
    private fs;
    constructor(sourceLocale: string, basePath: AbsoluteFsPath, fs: PathManipulation);
    serialize(messages: ɵParsedMessage[]): string;
    private serializeMessage;
    private serializeMeta;
    private serializeLocation;
}
