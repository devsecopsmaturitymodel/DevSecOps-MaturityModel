/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ParseSourceSpan } from '../parse_util';
export declare const enum TokenType {
    TAG_OPEN_START = 0,
    TAG_OPEN_END = 1,
    TAG_OPEN_END_VOID = 2,
    TAG_CLOSE = 3,
    INCOMPLETE_TAG_OPEN = 4,
    TEXT = 5,
    ESCAPABLE_RAW_TEXT = 6,
    RAW_TEXT = 7,
    INTERPOLATION = 8,
    ENCODED_ENTITY = 9,
    COMMENT_START = 10,
    COMMENT_END = 11,
    CDATA_START = 12,
    CDATA_END = 13,
    ATTR_NAME = 14,
    ATTR_QUOTE = 15,
    ATTR_VALUE_TEXT = 16,
    ATTR_VALUE_INTERPOLATION = 17,
    DOC_TYPE = 18,
    EXPANSION_FORM_START = 19,
    EXPANSION_CASE_VALUE = 20,
    EXPANSION_CASE_EXP_START = 21,
    EXPANSION_CASE_EXP_END = 22,
    EXPANSION_FORM_END = 23,
    EOF = 24
}
export declare type Token = TagOpenStartToken | TagOpenEndToken | TagOpenEndVoidToken | TagCloseToken | IncompleteTagOpenToken | TextToken | InterpolationToken | EncodedEntityToken | CommentStartToken | CommentEndToken | CdataStartToken | CdataEndToken | AttributeNameToken | AttributeQuoteToken | AttributeValueTextToken | AttributeValueInterpolationToken | DocTypeToken | ExpansionFormStartToken | ExpansionCaseValueToken | ExpansionCaseExpressionStartToken | ExpansionCaseExpressionEndToken | ExpansionFormEndToken | EndOfFileToken;
export declare type InterpolatedTextToken = TextToken | InterpolationToken | EncodedEntityToken;
export declare type InterpolatedAttributeToken = AttributeValueTextToken | AttributeValueInterpolationToken | EncodedEntityToken;
export interface TokenBase {
    type: TokenType;
    parts: string[];
    sourceSpan: ParseSourceSpan;
}
export interface TagOpenStartToken extends TokenBase {
    type: TokenType.TAG_OPEN_START;
    parts: [prefix: string, name: string];
}
export interface TagOpenEndToken extends TokenBase {
    type: TokenType.TAG_OPEN_END;
    parts: [];
}
export interface TagOpenEndVoidToken extends TokenBase {
    type: TokenType.TAG_OPEN_END_VOID;
    parts: [];
}
export interface TagCloseToken extends TokenBase {
    type: TokenType.TAG_CLOSE;
    parts: [prefix: string, name: string];
}
export interface IncompleteTagOpenToken extends TokenBase {
    type: TokenType.INCOMPLETE_TAG_OPEN;
    parts: [prefix: string, name: string];
}
export interface TextToken extends TokenBase {
    type: TokenType.TEXT | TokenType.ESCAPABLE_RAW_TEXT | TokenType.RAW_TEXT;
    parts: [text: string];
}
export interface InterpolationToken extends TokenBase {
    type: TokenType.INTERPOLATION;
    parts: [startMarker: string, expression: string, endMarker: string] | [
        startMarker: string,
        expression: string
    ];
}
export interface EncodedEntityToken extends TokenBase {
    type: TokenType.ENCODED_ENTITY;
    parts: [decoded: string, encoded: string];
}
export interface CommentStartToken extends TokenBase {
    type: TokenType.COMMENT_START;
    parts: [];
}
export interface CommentEndToken extends TokenBase {
    type: TokenType.COMMENT_END;
    parts: [];
}
export interface CdataStartToken extends TokenBase {
    type: TokenType.CDATA_START;
    parts: [];
}
export interface CdataEndToken extends TokenBase {
    type: TokenType.CDATA_END;
    parts: [];
}
export interface AttributeNameToken extends TokenBase {
    type: TokenType.ATTR_NAME;
    parts: [prefix: string, name: string];
}
export interface AttributeQuoteToken extends TokenBase {
    type: TokenType.ATTR_QUOTE;
    parts: [quote: '\'' | '"'];
}
export interface AttributeValueTextToken extends TokenBase {
    type: TokenType.ATTR_VALUE_TEXT;
    parts: [value: string];
}
export interface AttributeValueInterpolationToken extends TokenBase {
    type: TokenType.ATTR_VALUE_INTERPOLATION;
    parts: [startMarker: string, expression: string, endMarker: string] | [
        startMarker: string,
        expression: string
    ];
}
export interface DocTypeToken extends TokenBase {
    type: TokenType.DOC_TYPE;
    parts: [content: string];
}
export interface ExpansionFormStartToken extends TokenBase {
    type: TokenType.EXPANSION_FORM_START;
    parts: [];
}
export interface ExpansionCaseValueToken extends TokenBase {
    type: TokenType.EXPANSION_CASE_VALUE;
    parts: [value: string];
}
export interface ExpansionCaseExpressionStartToken extends TokenBase {
    type: TokenType.EXPANSION_CASE_EXP_START;
    parts: [];
}
export interface ExpansionCaseExpressionEndToken extends TokenBase {
    type: TokenType.EXPANSION_CASE_EXP_END;
    parts: [];
}
export interface ExpansionFormEndToken extends TokenBase {
    type: TokenType.EXPANSION_FORM_END;
    parts: [];
}
export interface EndOfFileToken extends TokenBase {
    type: TokenType.EOF;
    parts: [];
}
