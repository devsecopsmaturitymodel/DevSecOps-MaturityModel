/// <amd-module name="@angular/localize/tools/src/translate/translation_files/translation_parsers/translation_utils" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, Node, ParseError, ParseErrorLevel, ParseSourceSpan, ParseTreeResult } from '@angular/compiler';
import { Diagnostics } from '../../../diagnostics';
import { ParseAnalysis, ParsedTranslationBundle } from './translation_parser';
export declare function getAttrOrThrow(element: Element, attrName: string): string;
export declare function getAttribute(element: Element, attrName: string): string | undefined;
/**
 * Parse the "contents" of an XML element.
 *
 * This would be equivalent to parsing the `innerHTML` string of an HTML document.
 *
 * @param element The element whose inner range we want to parse.
 * @returns a collection of XML `Node` objects and any errors that were parsed from the element's
 *     contents.
 */
export declare function parseInnerRange(element: Element): ParseTreeResult;
/**
 * This "hint" object is used to pass information from `canParse()` to `parse()` for
 * `TranslationParser`s that expect XML contents.
 *
 * This saves the `parse()` method from having to re-parse the XML.
 */
export interface XmlTranslationParserHint {
    element: Element;
    errors: ParseError[];
}
/**
 * Can this XML be parsed for translations, given the expected `rootNodeName` and expected root node
 * `attributes` that should appear in the file.
 *
 * @param filePath The path to the file being checked.
 * @param contents The contents of the file being checked.
 * @param rootNodeName The expected name of an XML root node that should exist.
 * @param attributes The attributes (and their values) that should appear on the root node.
 * @returns The `XmlTranslationParserHint` object for use by `TranslationParser.parse()` if the XML
 * document has the expected format.
 */
export declare function canParseXml(filePath: string, contents: string, rootNodeName: string, attributes: Record<string, string>): ParseAnalysis<XmlTranslationParserHint>;
/**
 * Create a predicate, which can be used by things like `Array.filter()`, that will match a named
 * XML Element from a collection of XML Nodes.
 *
 * @param name The expected name of the element to match.
 */
export declare function isNamedElement(name: string): (node: Node) => node is Element;
/**
 * Add an XML parser related message to the given `diagnostics` object.
 */
export declare function addParseDiagnostic(diagnostics: Diagnostics, sourceSpan: ParseSourceSpan, message: string, level: ParseErrorLevel): void;
/**
 * Copy the formatted error message from the given `parseError` object into the given `diagnostics`
 * object.
 */
export declare function addParseError(diagnostics: Diagnostics, parseError: ParseError): void;
/**
 * Add the provided `errors` to the `bundle` diagnostics.
 */
export declare function addErrorsToBundle(bundle: ParsedTranslationBundle, errors: ParseError[]): void;
