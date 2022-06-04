/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/serialize_translation_message" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, ParseError } from '@angular/compiler';
import { ɵParsedTranslation } from '@angular/localize';
import { MessageSerializerConfig } from '../message_serialization/message_serializer';
/**
 * Serialize the given `element` into a parsed translation using the given `serializer`.
 */
export declare function serializeTranslationMessage(element: Element, config: MessageSerializerConfig): {
    translation: ɵParsedTranslation | null;
    parseErrors: ParseError[];
    serializeErrors: ParseError[];
};
