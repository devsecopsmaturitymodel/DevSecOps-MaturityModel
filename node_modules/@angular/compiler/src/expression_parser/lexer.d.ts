/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare enum TokenType {
    Character = 0,
    Identifier = 1,
    PrivateIdentifier = 2,
    Keyword = 3,
    String = 4,
    Operator = 5,
    Number = 6,
    Error = 7
}
export declare class Lexer {
    tokenize(text: string): Token[];
}
export declare class Token {
    index: number;
    end: number;
    type: TokenType;
    numValue: number;
    strValue: string;
    constructor(index: number, end: number, type: TokenType, numValue: number, strValue: string);
    isCharacter(code: number): boolean;
    isNumber(): boolean;
    isString(): boolean;
    isOperator(operator: string): boolean;
    isIdentifier(): boolean;
    isPrivateIdentifier(): boolean;
    isKeyword(): boolean;
    isKeywordLet(): boolean;
    isKeywordAs(): boolean;
    isKeywordNull(): boolean;
    isKeywordUndefined(): boolean;
    isKeywordTrue(): boolean;
    isKeywordFalse(): boolean;
    isKeywordThis(): boolean;
    isError(): boolean;
    toNumber(): number;
    toString(): string | null;
}
export declare const EOF: Token;
export declare function isIdentifier(input: string): boolean;
