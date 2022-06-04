/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as chars from '../chars';
export var TokenType;
(function (TokenType) {
    TokenType[TokenType["Character"] = 0] = "Character";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["PrivateIdentifier"] = 2] = "PrivateIdentifier";
    TokenType[TokenType["Keyword"] = 3] = "Keyword";
    TokenType[TokenType["String"] = 4] = "String";
    TokenType[TokenType["Operator"] = 5] = "Operator";
    TokenType[TokenType["Number"] = 6] = "Number";
    TokenType[TokenType["Error"] = 7] = "Error";
})(TokenType || (TokenType = {}));
const KEYWORDS = ['var', 'let', 'as', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
export class Lexer {
    tokenize(text) {
        const scanner = new _Scanner(text);
        const tokens = [];
        let token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    }
}
export class Token {
    constructor(index, end, type, numValue, strValue) {
        this.index = index;
        this.end = end;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    isCharacter(code) {
        return this.type == TokenType.Character && this.numValue == code;
    }
    isNumber() {
        return this.type == TokenType.Number;
    }
    isString() {
        return this.type == TokenType.String;
    }
    isOperator(operator) {
        return this.type == TokenType.Operator && this.strValue == operator;
    }
    isIdentifier() {
        return this.type == TokenType.Identifier;
    }
    isPrivateIdentifier() {
        return this.type == TokenType.PrivateIdentifier;
    }
    isKeyword() {
        return this.type == TokenType.Keyword;
    }
    isKeywordLet() {
        return this.type == TokenType.Keyword && this.strValue == 'let';
    }
    isKeywordAs() {
        return this.type == TokenType.Keyword && this.strValue == 'as';
    }
    isKeywordNull() {
        return this.type == TokenType.Keyword && this.strValue == 'null';
    }
    isKeywordUndefined() {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    }
    isKeywordTrue() {
        return this.type == TokenType.Keyword && this.strValue == 'true';
    }
    isKeywordFalse() {
        return this.type == TokenType.Keyword && this.strValue == 'false';
    }
    isKeywordThis() {
        return this.type == TokenType.Keyword && this.strValue == 'this';
    }
    isError() {
        return this.type == TokenType.Error;
    }
    toNumber() {
        return this.type == TokenType.Number ? this.numValue : -1;
    }
    toString() {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.PrivateIdentifier:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    }
}
function newCharacterToken(index, end, code) {
    return new Token(index, end, TokenType.Character, code, String.fromCharCode(code));
}
function newIdentifierToken(index, end, text) {
    return new Token(index, end, TokenType.Identifier, 0, text);
}
function newPrivateIdentifierToken(index, end, text) {
    return new Token(index, end, TokenType.PrivateIdentifier, 0, text);
}
function newKeywordToken(index, end, text) {
    return new Token(index, end, TokenType.Keyword, 0, text);
}
function newOperatorToken(index, end, text) {
    return new Token(index, end, TokenType.Operator, 0, text);
}
function newStringToken(index, end, text) {
    return new Token(index, end, TokenType.String, 0, text);
}
function newNumberToken(index, end, n) {
    return new Token(index, end, TokenType.Number, n, '');
}
function newErrorToken(index, end, message) {
    return new Token(index, end, TokenType.Error, 0, message);
}
export const EOF = new Token(-1, -1, TokenType.Character, 0, '');
class _Scanner {
    constructor(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    advance() {
        this.peek = ++this.index >= this.length ? chars.$EOF : this.input.charCodeAt(this.index);
    }
    scanToken() {
        const input = this.input, length = this.length;
        let peek = this.peek, index = this.index;
        // Skip whitespace.
        while (peek <= chars.$SPACE) {
            if (++index >= length) {
                peek = chars.$EOF;
                break;
            }
            else {
                peek = input.charCodeAt(index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (chars.isDigit(peek))
            return this.scanNumber(index);
        const start = index;
        switch (peek) {
            case chars.$PERIOD:
                this.advance();
                return chars.isDigit(this.peek) ? this.scanNumber(start) :
                    newCharacterToken(start, this.index, chars.$PERIOD);
            case chars.$LPAREN:
            case chars.$RPAREN:
            case chars.$LBRACE:
            case chars.$RBRACE:
            case chars.$LBRACKET:
            case chars.$RBRACKET:
            case chars.$COMMA:
            case chars.$COLON:
            case chars.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case chars.$SQ:
            case chars.$DQ:
                return this.scanString();
            case chars.$HASH:
                return this.scanPrivateIdentifier();
            case chars.$PLUS:
            case chars.$MINUS:
            case chars.$STAR:
            case chars.$SLASH:
            case chars.$PERCENT:
            case chars.$CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case chars.$QUESTION:
                return this.scanQuestion(start);
            case chars.$LT:
            case chars.$GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, '=');
            case chars.$BANG:
            case chars.$EQ:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, '=', chars.$EQ, '=');
            case chars.$AMPERSAND:
                return this.scanComplexOperator(start, '&', chars.$AMPERSAND, '&');
            case chars.$BAR:
                return this.scanComplexOperator(start, '|', chars.$BAR, '|');
            case chars.$NBSP:
                while (chars.isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.advance();
        return this.error(`Unexpected character [${String.fromCharCode(peek)}]`, 0);
    }
    scanCharacter(start, code) {
        this.advance();
        return newCharacterToken(start, this.index, code);
    }
    scanOperator(start, str) {
        this.advance();
        return newOperatorToken(start, this.index, str);
    }
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param start start index in the expression
     * @param one first symbol (always part of the operator)
     * @param twoCode code point for the second symbol
     * @param two second symbol (part of the operator when the second code point matches)
     * @param threeCode code point for the third symbol
     * @param three third symbol (part of the operator when provided and matches source expression)
     */
    scanComplexOperator(start, one, twoCode, two, threeCode, three) {
        this.advance();
        let str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, this.index, str);
    }
    scanIdentifier() {
        const start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        const str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, this.index, str) :
            newIdentifierToken(start, this.index, str);
    }
    /** Scans an ECMAScript private identifier. */
    scanPrivateIdentifier() {
        const start = this.index;
        this.advance();
        if (!isIdentifierStart(this.peek)) {
            return this.error('Invalid character [#]', -1);
        }
        while (isIdentifierPart(this.peek))
            this.advance();
        const identifierName = this.input.substring(start, this.index);
        return newPrivateIdentifierToken(start, this.index, identifierName);
    }
    scanNumber(start) {
        let simple = (this.index === start);
        let hasSeparators = false;
        this.advance(); // Skip initial digit.
        while (true) {
            if (chars.isDigit(this.peek)) {
                // Do nothing.
            }
            else if (this.peek === chars.$_) {
                // Separators are only valid when they're surrounded by digits. E.g. `1_0_1` is
                // valid while `_101` and `101_` are not. The separator can't be next to the decimal
                // point or another separator either. Note that it's unlikely that we'll hit a case where
                // the underscore is at the start, because that's a valid identifier and it will be picked
                // up earlier in the parsing. We validate for it anyway just in case.
                if (!chars.isDigit(this.input.charCodeAt(this.index - 1)) ||
                    !chars.isDigit(this.input.charCodeAt(this.index + 1))) {
                    return this.error('Invalid numeric separator', 0);
                }
                hasSeparators = true;
            }
            else if (this.peek === chars.$PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!chars.isDigit(this.peek))
                    return this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        let str = this.input.substring(start, this.index);
        if (hasSeparators) {
            str = str.replace(/_/g, '');
        }
        const value = simple ? parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, this.index, value);
    }
    scanString() {
        const start = this.index;
        const quote = this.peek;
        this.advance(); // Skip initial quote.
        let buffer = '';
        let marker = this.index;
        const input = this.input;
        while (this.peek != quote) {
            if (this.peek == chars.$BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                let unescapedCode;
                // Workaround for TS2.1-introduced type strictness
                this.peek = this.peek;
                if (this.peek == chars.$u) {
                    // 4 character hex code for unicode character.
                    const hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error(`Invalid unicode escape [\\u${hex}]`, 0);
                    }
                    for (let i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            }
            else if (this.peek == chars.$EOF) {
                return this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        const last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, this.index, buffer + last);
    }
    scanQuestion(start) {
        this.advance();
        let str = '?';
        // Either `a ?? b` or 'a?.b'.
        if (this.peek === chars.$QUESTION || this.peek === chars.$PERIOD) {
            str += this.peek === chars.$PERIOD ? '.' : '?';
            this.advance();
        }
        return newOperatorToken(start, this.index, str);
    }
    error(message, offset) {
        const position = this.index + offset;
        return newErrorToken(position, this.index, `Lexer Error: ${message} at column ${position} in expression [${this.input}]`);
    }
}
function isIdentifierStart(code) {
    return (chars.$a <= code && code <= chars.$z) || (chars.$A <= code && code <= chars.$Z) ||
        (code == chars.$_) || (code == chars.$$);
}
export function isIdentifier(input) {
    if (input.length == 0)
        return false;
    const scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek))
        return false;
    scanner.advance();
    while (scanner.peek !== chars.$EOF) {
        if (!isIdentifierPart(scanner.peek))
            return false;
        scanner.advance();
    }
    return true;
}
function isIdentifierPart(code) {
    return chars.isAsciiLetter(code) || chars.isDigit(code) || (code == chars.$_) ||
        (code == chars.$$);
}
function isExponentStart(code) {
    return code == chars.$e || code == chars.$E;
}
function isExponentSign(code) {
    return code == chars.$MINUS || code == chars.$PLUS;
}
function unescape(code) {
    switch (code) {
        case chars.$n:
            return chars.$LF;
        case chars.$f:
            return chars.$FF;
        case chars.$r:
            return chars.$CR;
        case chars.$t:
            return chars.$TAB;
        case chars.$v:
            return chars.$VTAB;
        default:
            return code;
    }
}
function parseIntAutoRadix(text) {
    const result = parseInt(text);
    if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvZXhwcmVzc2lvbl9wYXJzZXIvbGV4ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxLQUFLLEtBQUssTUFBTSxVQUFVLENBQUM7QUFFbEMsTUFBTSxDQUFOLElBQVksU0FTWDtBQVRELFdBQVksU0FBUztJQUNuQixtREFBUyxDQUFBO0lBQ1QscURBQVUsQ0FBQTtJQUNWLG1FQUFpQixDQUFBO0lBQ2pCLCtDQUFPLENBQUE7SUFDUCw2Q0FBTSxDQUFBO0lBQ04saURBQVEsQ0FBQTtJQUNSLDZDQUFNLENBQUE7SUFDTiwyQ0FBSyxDQUFBO0FBQ1AsQ0FBQyxFQVRXLFNBQVMsS0FBVCxTQUFTLFFBU3BCO0FBRUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUVsRyxNQUFNLE9BQU8sS0FBSztJQUNoQixRQUFRLENBQUMsSUFBWTtRQUNuQixNQUFNLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxNQUFNLE1BQU0sR0FBWSxFQUFFLENBQUM7UUFDM0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sS0FBSyxJQUFJLElBQUksRUFBRTtZQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDN0I7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sS0FBSztJQUNoQixZQUNXLEtB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Q3pCLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxJQUFZO0lBQ25DLE9BQU8sSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDOUMsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLElBQVk7SUFDbEMsT0FBTyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQztBQUNyRCxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsSUFBWTtJQUM1QixRQUFRLElBQUksRUFBRTtRQUNaLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDbkIsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNYLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNuQixLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ1gsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ25CLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDcEIsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNYLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNyQjtZQUNFLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7QUFDSCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFZO0lBQ3JDLE1BQU0sTUFBTSxHQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBjaGFycyBmcm9tICcuLi9jaGFycyc7XG5cbmV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XG4gIENoYXJhY3RlcixcbiAgSWRlbnRpZmllcixcbiAgUHJpdmF0ZUlkZW50aWZpZXIsXG4gIEtleXdvcmQsXG4gIFN0cmluZyxcbiAgT3BlcmF0b3IsXG4gIE51bWJlcixcbiAgRXJyb3Jcbn1cblxuY29uc3QgS0VZV09SRFMgPSBbJ3ZhcicsICdsZXQnLCAnYXMnLCAnbnVsbCcsICd1bmRlZmluZWQnLCAndHJ1ZScsICdmYWxzZScsICdpZicsICdlbHNlJywgJ3RoaXMnXTtcblxuZXhwb3J0IGNsYXNzIExleGVyIHtcbiAgdG9rZW5pemUodGV4dDogc3RyaW5nKTogVG9rZW5bXSB7XG4gICAgY29uc3Qgc2Nhbm5lciA9IG5ldyBfU2Nhbm5lcih0ZXh0KTtcbiAgICBjb25zdCB0b2tlbnM6IFRva2VuW10gPSBbXTtcbiAgICBsZXQgdG9rZW4gPSBzY2FubmVyLnNjYW5Ub2tlbigpO1xuICAgIHdoaWxlICh0b2tlbiAhPSBudWxsKSB7XG4gICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICB0b2tlbiA9IHNjYW5uZXIuc2NhblRva2VuKCk7XG4gICAgfVxuICAgIHJldHVybiB0b2tlbnM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRva2VuIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgaW5kZXg6IG51bWJlciwgcHVibGljIGVuZDogbnVtYmVyLCBwdWJsaWMgdHlwZTogVG9rZW5UeXBlLCBwdWJsaWMgbnVtVmFsdWU6IG51bWJlcixcbiAgICAgIHB1YmxpYyBzdHJWYWx1ZTogc3RyaW5nKSB7fVxuXG4gIGlzQ2hhcmFjdGVyKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLkNoYXJhY3RlciAmJiB0aGlzLm51bVZhbHVlID09IGNvZGU7XG4gIH1cblxuICBpc051bWJlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09IFRva2VuVHlwZS5OdW1iZXI7XG4gIH1cblxuICBpc1N0cmluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09IFRva2VuVHlwZS5TdHJpbmc7XG4gIH1cblxuICBpc09wZXJhdG9yKG9wZXJhdG9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09IFRva2VuVHlwZS5PcGVyYXRvciAmJiB0aGlzLnN0clZhbHVlID09IG9wZXJhdG9yO1xuICB9XG5cbiAgaXNJZGVudGlmaWVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLklkZW50aWZpZXI7XG4gIH1cblxuICBpc1ByaXZhdGVJZGVudGlmaWVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLlByaXZhdGVJZGVudGlmaWVyO1xuICB9XG5cbiAgaXNLZXl3b3JkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQ7XG4gIH1cblxuICBpc0tleXdvcmRMZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09ICdsZXQnO1xuICB9XG5cbiAgaXNLZXl3b3JkQXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09ICdhcyc7XG4gIH1cblxuICBpc0tleXdvcmROdWxsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PSAnbnVsbCc7XG4gIH1cblxuICBpc0tleXdvcmRVbmRlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgaXNLZXl3b3JkVHJ1ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09IFRva2VuVHlwZS5LZXl3b3JkICYmIHRoaXMuc3RyVmFsdWUgPT0gJ3RydWUnO1xuICB9XG5cbiAgaXNLZXl3b3JkRmFsc2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09ICdmYWxzZSc7XG4gIH1cblxuICBpc0tleXdvcmRUaGlzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PSAndGhpcyc7XG4gIH1cblxuICBpc0Vycm9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT0gVG9rZW5UeXBlLkVycm9yO1xuICB9XG5cbiAgdG9OdW1iZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09IFRva2VuVHlwZS5OdW1iZXIgPyB0aGlzLm51bVZhbHVlIDogLTE7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmd8bnVsbCB7XG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkNoYXJhY3RlcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLklkZW50aWZpZXI6XG4gICAgICBjYXNlIFRva2VuVHlwZS5LZXl3b3JkOlxuICAgICAgY2FzZSBUb2tlblR5cGUuT3BlcmF0b3I6XG4gICAgICBjYXNlIFRva2VuVHlwZS5Qcml2YXRlSWRlbnRpZmllcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0cmluZzpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVycm9yOlxuICAgICAgICByZXR1cm4gdGhpcy5zdHJWYWx1ZTtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk51bWJlcjpcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBuZXdDaGFyYWN0ZXJUb2tlbihpbmRleDogbnVtYmVyLCBlbmQ6IG51bWJlciwgY29kZTogbnVtYmVyKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBlbmQsIFRva2VuVHlwZS5DaGFyYWN0ZXIsIGNvZGUsIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSkpO1xufVxuXG5mdW5jdGlvbiBuZXdJZGVudGlmaWVyVG9rZW4oaW5kZXg6IG51bWJlciwgZW5kOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgZW5kLCBUb2tlblR5cGUuSWRlbnRpZmllciwgMCwgdGV4dCk7XG59XG5cbmZ1bmN0aW9uIG5ld1ByaXZhdGVJZGVudGlmaWVyVG9rZW4oaW5kZXg6IG51bWJlciwgZW5kOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgZW5kLCBUb2tlblR5cGUuUHJpdmF0ZUlkZW50aWZpZXIsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdLZXl3b3JkVG9rZW4oaW5kZXg6IG51bWJlciwgZW5kOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgZW5kLCBUb2tlblR5cGUuS2V5d29yZCwgMCwgdGV4dCk7XG59XG5cbmZ1bmN0aW9uIG5ld09wZXJhdG9yVG9rZW4oaW5kZXg6IG51bWJlciwgZW5kOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgZW5kLCBUb2tlblR5cGUuT3BlcmF0b3IsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdTdHJpbmdUb2tlbihpbmRleDogbnVtYmVyLCBlbmQ6IG51bWJlciwgdGV4dDogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBlbmQsIFRva2VuVHlwZS5TdHJpbmcsIDAsIHRleHQpO1xufVxuXG5mdW5jdGlvbiBuZXdOdW1iZXJUb2tlbihpbmRleDogbnVtYmVyLCBlbmQ6IG51bWJlciwgbjogbnVtYmVyKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBlbmQsIFRva2VuVHlwZS5OdW1iZXIsIG4sICcnKTtcbn1cblxuZnVuY3Rpb24gbmV3RXJyb3JUb2tlbihpbmRleDogbnVtYmVyLCBlbmQ6IG51bWJlciwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBlbmQsIFRva2VuVHlwZS5FcnJvciwgMCwgbWVzc2FnZSk7XG59XG5cbmV4cG9ydCBjb25zdCBFT0Y6IFRva2VuID0gbmV3IFRva2VuKC0xLCAtMSwgVG9rZW5UeXBlLkNoYXJhY3RlciwgMCwgJycpO1xuXG5jbGFzcyBfU2Nhbm5lciB7XG4gIGxlbmd0aDogbnVtYmVyO1xuICBwZWVrOiBudW1iZXIgPSAwO1xuICBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGlucHV0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLmFkdmFuY2UoKTtcbiAgfVxuXG4gIGFkdmFuY2UoKSB7XG4gICAgdGhpcy5wZWVrID0gKyt0aGlzLmluZGV4ID49IHRoaXMubGVuZ3RoID8gY2hhcnMuJEVPRiA6IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLmluZGV4KTtcbiAgfVxuXG4gIHNjYW5Ub2tlbigpOiBUb2tlbnxudWxsIHtcbiAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW5wdXQsIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgIGxldCBwZWVrID0gdGhpcy5wZWVrLCBpbmRleCA9IHRoaXMuaW5kZXg7XG5cbiAgICAvLyBTa2lwIHdoaXRlc3BhY2UuXG4gICAgd2hpbGUgKHBlZWsgPD0gY2hhcnMuJFNQQUNFKSB7XG4gICAgICBpZiAoKytpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgICAgcGVlayA9IGNoYXJzLiRFT0Y7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVlayA9IGlucHV0LmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucGVlayA9IHBlZWs7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGlkZW50aWZpZXJzIGFuZCBudW1iZXJzLlxuICAgIGlmIChpc0lkZW50aWZpZXJTdGFydChwZWVrKSkgcmV0dXJuIHRoaXMuc2NhbklkZW50aWZpZXIoKTtcbiAgICBpZiAoY2hhcnMuaXNEaWdpdChwZWVrKSkgcmV0dXJuIHRoaXMuc2Nhbk51bWJlcihpbmRleCk7XG5cbiAgICBjb25zdCBzdGFydDogbnVtYmVyID0gaW5kZXg7XG4gICAgc3dpdGNoIChwZWVrKSB7XG4gICAgICBjYXNlIGNoYXJzLiRQRVJJT0Q6XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gY2hhcnMuaXNEaWdpdCh0aGlzLnBlZWspID8gdGhpcy5zY2FuTnVtYmVyKHN0YXJ0KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdDaGFyYWN0ZXJUb2tlbihzdGFydCwgdGhpcy5pbmRleCwgY2hhcnMuJFBFUklPRCk7XG4gICAgICBjYXNlIGNoYXJzLiRMUEFSRU46XG4gICAgICBjYXNlIGNoYXJzLiRSUEFSRU46XG4gICAgICBjYXNlIGNoYXJzLiRMQlJBQ0U6XG4gICAgICBjYXNlIGNoYXJzLiRSQlJBQ0U6XG4gICAgICBjYXNlIGNoYXJzLiRMQlJBQ0tFVDpcbiAgICAgIGNhc2UgY2hhcnMuJFJCUkFDS0VUOlxuICAgICAgY2FzZSBjaGFycy4kQ09NTUE6XG4gICAgICBjYXNlIGNoYXJzLiRDT0xPTjpcbiAgICAgIGNhc2UgY2hhcnMuJFNFTUlDT0xPTjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNoYXJhY3RlcihzdGFydCwgcGVlayk7XG4gICAgICBjYXNlIGNoYXJzLiRTUTpcbiAgICAgIGNhc2UgY2hhcnMuJERROlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuU3RyaW5nKCk7XG4gICAgICBjYXNlIGNoYXJzLiRIQVNIOlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuUHJpdmF0ZUlkZW50aWZpZXIoKTtcbiAgICAgIGNhc2UgY2hhcnMuJFBMVVM6XG4gICAgICBjYXNlIGNoYXJzLiRNSU5VUzpcbiAgICAgIGNhc2UgY2hhcnMuJFNUQVI6XG4gICAgICBjYXNlIGNoYXJzLiRTTEFTSDpcbiAgICAgIGNhc2UgY2hhcnMuJFBFUkNFTlQ6XG4gICAgICBjYXNlIGNoYXJzLiRDQVJFVDpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nhbk9wZXJhdG9yKHN0YXJ0LCBTdHJpbmcuZnJvbUNoYXJDb2RlKHBlZWspKTtcbiAgICAgIGNhc2UgY2hhcnMuJFFVRVNUSU9OOlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuUXVlc3Rpb24oc3RhcnQpO1xuICAgICAgY2FzZSBjaGFycy4kTFQ6XG4gICAgICBjYXNlIGNoYXJzLiRHVDpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgU3RyaW5nLmZyb21DaGFyQ29kZShwZWVrKSwgY2hhcnMuJEVRLCAnPScpO1xuICAgICAgY2FzZSBjaGFycy4kQkFORzpcbiAgICAgIGNhc2UgY2hhcnMuJEVROlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuQ29tcGxleE9wZXJhdG9yKFxuICAgICAgICAgICAgc3RhcnQsIFN0cmluZy5mcm9tQ2hhckNvZGUocGVlayksIGNoYXJzLiRFUSwgJz0nLCBjaGFycy4kRVEsICc9Jyk7XG4gICAgICBjYXNlIGNoYXJzLiRBTVBFUlNBTkQ6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsICcmJywgY2hhcnMuJEFNUEVSU0FORCwgJyYnKTtcbiAgICAgIGNhc2UgY2hhcnMuJEJBUjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgJ3wnLCBjaGFycy4kQkFSLCAnfCcpO1xuICAgICAgY2FzZSBjaGFycy4kTkJTUDpcbiAgICAgICAgd2hpbGUgKGNoYXJzLmlzV2hpdGVzcGFjZSh0aGlzLnBlZWspKSB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhblRva2VuKCk7XG4gICAgfVxuXG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIFske1N0cmluZy5mcm9tQ2hhckNvZGUocGVlayl9XWAsIDApO1xuICB9XG5cbiAgc2NhbkNoYXJhY3RlcihzdGFydDogbnVtYmVyLCBjb2RlOiBudW1iZXIpOiBUb2tlbiB7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIG5ld0NoYXJhY3RlclRva2VuKHN0YXJ0LCB0aGlzLmluZGV4LCBjb2RlKTtcbiAgfVxuXG5cbiAgc2Nhbk9wZXJhdG9yKHN0YXJ0OiBudW1iZXIsIHN0cjogc3RyaW5nKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiBuZXdPcGVyYXRvclRva2VuKHN0YXJ0LCB0aGlzLmluZGV4LCBzdHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRva2VuaXplIGEgMi8zIGNoYXIgbG9uZyBvcGVyYXRvclxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnQgc3RhcnQgaW5kZXggaW4gdGhlIGV4cHJlc3Npb25cbiAgICogQHBhcmFtIG9uZSBmaXJzdCBzeW1ib2wgKGFsd2F5cyBwYXJ0IG9mIHRoZSBvcGVyYXRvcilcbiAgICogQHBhcmFtIHR3b0NvZGUgY29kZSBwb2ludCBmb3IgdGhlIHNlY29uZCBzeW1ib2xcbiAgICogQHBhcmFtIHR3byBzZWNvbmQgc3ltYm9sIChwYXJ0IG9mIHRoZSBvcGVyYXRvciB3aGVuIHRoZSBzZWNvbmQgY29kZSBwb2ludCBtYXRjaGVzKVxuICAgKiBAcGFyYW0gdGhyZWVDb2RlIGNvZGUgcG9pbnQgZm9yIHRoZSB0aGlyZCBzeW1ib2xcbiAgICogQHBhcmFtIHRocmVlIHRoaXJkIHN5bWJvbCAocGFydCBvZiB0aGUgb3BlcmF0b3Igd2hlbiBwcm92aWRlZCBhbmQgbWF0Y2hlcyBzb3VyY2UgZXhwcmVzc2lvbilcbiAgICovXG4gIHNjYW5Db21wbGV4T3BlcmF0b3IoXG4gICAgICBzdGFydDogbnVtYmVyLCBvbmU6IHN0cmluZywgdHdvQ29kZTogbnVtYmVyLCB0d286IHN0cmluZywgdGhyZWVDb2RlPzogbnVtYmVyLFxuICAgICAgdGhyZWU/OiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgbGV0IHN0cjogc3RyaW5nID0gb25lO1xuICAgIGlmICh0aGlzLnBlZWsgPT0gdHdvQ29kZSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBzdHIgKz0gdHdvO1xuICAgIH1cbiAgICBpZiAodGhyZWVDb2RlICE9IG51bGwgJiYgdGhpcy5wZWVrID09IHRocmVlQ29kZSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBzdHIgKz0gdGhyZWU7XG4gICAgfVxuICAgIHJldHVybiBuZXdPcGVyYXRvclRva2VuKHN0YXJ0LCB0aGlzLmluZGV4LCBzdHIpO1xuICB9XG5cbiAgc2NhbklkZW50aWZpZXIoKTogVG9rZW4ge1xuICAgIGNvbnN0IHN0YXJ0OiBudW1iZXIgPSB0aGlzLmluZGV4O1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHdoaWxlIChpc0lkZW50aWZpZXJQYXJ0KHRoaXMucGVlaykpIHRoaXMuYWR2YW5jZSgpO1xuICAgIGNvbnN0IHN0cjogc3RyaW5nID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcoc3RhcnQsIHRoaXMuaW5kZXgpO1xuICAgIHJldHVybiBLRVlXT1JEUy5pbmRleE9mKHN0cikgPiAtMSA/IG5ld0tleXdvcmRUb2tlbihzdGFydCwgdGhpcy5pbmRleCwgc3RyKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3SWRlbnRpZmllclRva2VuKHN0YXJ0LCB0aGlzLmluZGV4LCBzdHIpO1xuICB9XG5cbiAgLyoqIFNjYW5zIGFuIEVDTUFTY3JpcHQgcHJpdmF0ZSBpZGVudGlmaWVyLiAqL1xuICBzY2FuUHJpdmF0ZUlkZW50aWZpZXIoKTogVG9rZW4ge1xuICAgIGNvbnN0IHN0YXJ0OiBudW1iZXIgPSB0aGlzLmluZGV4O1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIGlmICghaXNJZGVudGlmaWVyU3RhcnQodGhpcy5wZWVrKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoJ0ludmFsaWQgY2hhcmFjdGVyIFsjXScsIC0xKTtcbiAgICB9XG4gICAgd2hpbGUgKGlzSWRlbnRpZmllclBhcnQodGhpcy5wZWVrKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgY29uc3QgaWRlbnRpZmllck5hbWU6IHN0cmluZyA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgICByZXR1cm4gbmV3UHJpdmF0ZUlkZW50aWZpZXJUb2tlbihzdGFydCwgdGhpcy5pbmRleCwgaWRlbnRpZmllck5hbWUpO1xuICB9XG5cbiAgc2Nhbk51bWJlcihzdGFydDogbnVtYmVyKTogVG9rZW4ge1xuICAgIGxldCBzaW1wbGUgPSAodGhpcy5pbmRleCA9PT0gc3RhcnQpO1xuICAgIGxldCBoYXNTZXBhcmF0b3JzID0gZmFsc2U7XG4gICAgdGhpcy5hZHZhbmNlKCk7ICAvLyBTa2lwIGluaXRpYWwgZGlnaXQuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChjaGFycy5pc0RpZ2l0KHRoaXMucGVlaykpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZy5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrID09PSBjaGFycy4kXykge1xuICAgICAgICAvLyBTZXBhcmF0b3JzIGFyZSBvbmx5IHZhbGlkIHdoZW4gdGhleSdyZSBzdXJyb3VuZGVkIGJ5IGRpZ2l0cy4gRS5nLiBgMV8wXzFgIGlzXG4gICAgICAgIC8vIHZhbGlkIHdoaWxlIGBfMTAxYCBhbmQgYDEwMV9gIGFyZSBub3QuIFRoZSBzZXBhcmF0b3IgY2FuJ3QgYmUgbmV4dCB0byB0aGUgZGVjaW1hbFxuICAgICAgICAvLyBwb2ludCBvciBhbm90aGVyIHNlcGFyYXRvciBlaXRoZXIuIE5vdGUgdGhhdCBpdCdzIHVubGlrZWx5IHRoYXQgd2UnbGwgaGl0IGEgY2FzZSB3aGVyZVxuICAgICAgICAvLyB0aGUgdW5kZXJzY29yZSBpcyBhdCB0aGUgc3RhcnQsIGJlY2F1c2UgdGhhdCdzIGEgdmFsaWQgaWRlbnRpZmllciBhbmQgaXQgd2lsbCBiZSBwaWNrZWRcbiAgICAgICAgLy8gdXAgZWFybGllciBpbiB0aGUgcGFyc2luZy4gV2UgdmFsaWRhdGUgZm9yIGl0IGFueXdheSBqdXN0IGluIGNhc2UuXG4gICAgICAgIGlmICghY2hhcnMuaXNEaWdpdCh0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5pbmRleCAtIDEpKSB8fFxuICAgICAgICAgICAgIWNoYXJzLmlzRGlnaXQodGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuaW5kZXggKyAxKSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcignSW52YWxpZCBudW1lcmljIHNlcGFyYXRvcicsIDApO1xuICAgICAgICB9XG4gICAgICAgIGhhc1NlcGFyYXRvcnMgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBlZWsgPT09IGNoYXJzLiRQRVJJT0QpIHtcbiAgICAgICAgc2ltcGxlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKGlzRXhwb25lbnRTdGFydCh0aGlzLnBlZWspKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBpZiAoaXNFeHBvbmVudFNpZ24odGhpcy5wZWVrKSkgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIGlmICghY2hhcnMuaXNEaWdpdCh0aGlzLnBlZWspKSByZXR1cm4gdGhpcy5lcnJvcignSW52YWxpZCBleHBvbmVudCcsIC0xKTtcbiAgICAgICAgc2ltcGxlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cblxuICAgIGxldCBzdHIgPSB0aGlzLmlucHV0LnN1YnN0cmluZyhzdGFydCwgdGhpcy5pbmRleCk7XG4gICAgaWYgKGhhc1NlcGFyYXRvcnMpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9fL2csICcnKTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBzaW1wbGUgPyBwYXJzZUludEF1dG9SYWRpeChzdHIpIDogcGFyc2VGbG9hdChzdHIpO1xuICAgIHJldHVybiBuZXdOdW1iZXJUb2tlbihzdGFydCwgdGhpcy5pbmRleCwgdmFsdWUpO1xuICB9XG5cbiAgc2NhblN0cmluZygpOiBUb2tlbiB7XG4gICAgY29uc3Qgc3RhcnQ6IG51bWJlciA9IHRoaXMuaW5kZXg7XG4gICAgY29uc3QgcXVvdGU6IG51bWJlciA9IHRoaXMucGVlaztcbiAgICB0aGlzLmFkdmFuY2UoKTsgIC8vIFNraXAgaW5pdGlhbCBxdW90ZS5cblxuICAgIGxldCBidWZmZXI6IHN0cmluZyA9ICcnO1xuICAgIGxldCBtYXJrZXI6IG51bWJlciA9IHRoaXMuaW5kZXg7XG4gICAgY29uc3QgaW5wdXQ6IHN0cmluZyA9IHRoaXMuaW5wdXQ7XG5cbiAgICB3aGlsZSAodGhpcy5wZWVrICE9IHF1b3RlKSB7XG4gICAgICBpZiAodGhpcy5wZWVrID09IGNoYXJzLiRCQUNLU0xBU0gpIHtcbiAgICAgICAgYnVmZmVyICs9IGlucHV0LnN1YnN0cmluZyhtYXJrZXIsIHRoaXMuaW5kZXgpO1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgbGV0IHVuZXNjYXBlZENvZGU6IG51bWJlcjtcbiAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgVFMyLjEtaW50cm9kdWNlZCB0eXBlIHN0cmljdG5lc3NcbiAgICAgICAgdGhpcy5wZWVrID0gdGhpcy5wZWVrO1xuICAgICAgICBpZiAodGhpcy5wZWVrID09IGNoYXJzLiR1KSB7XG4gICAgICAgICAgLy8gNCBjaGFyYWN0ZXIgaGV4IGNvZGUgZm9yIHVuaWNvZGUgY2hhcmFjdGVyLlxuICAgICAgICAgIGNvbnN0IGhleDogc3RyaW5nID0gaW5wdXQuc3Vic3RyaW5nKHRoaXMuaW5kZXggKyAxLCB0aGlzLmluZGV4ICsgNSk7XG4gICAgICAgICAgaWYgKC9eWzAtOWEtZl0rJC9pLnRlc3QoaGV4KSkge1xuICAgICAgICAgICAgdW5lc2NhcGVkQ29kZSA9IHBhcnNlSW50KGhleCwgMTYpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihgSW52YWxpZCB1bmljb2RlIGVzY2FwZSBbXFxcXHUke2hleH1dYCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bmVzY2FwZWRDb2RlID0gdW5lc2NhcGUodGhpcy5wZWVrKTtcbiAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh1bmVzY2FwZWRDb2RlKTtcbiAgICAgICAgbWFya2VyID0gdGhpcy5pbmRleDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrID09IGNoYXJzLiRFT0YpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoJ1VudGVybWluYXRlZCBxdW90ZScsIDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdDogc3RyaW5nID0gaW5wdXQuc3Vic3RyaW5nKG1hcmtlciwgdGhpcy5pbmRleCk7XG4gICAgdGhpcy5hZHZhbmNlKCk7ICAvLyBTa2lwIHRlcm1pbmF0aW5nIHF1b3RlLlxuXG4gICAgcmV0dXJuIG5ld1N0cmluZ1Rva2VuKHN0YXJ0LCB0aGlzLmluZGV4LCBidWZmZXIgKyBsYXN0KTtcbiAgfVxuXG4gIHNjYW5RdWVzdGlvbihzdGFydDogbnVtYmVyKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIGxldCBzdHI6IHN0cmluZyA9ICc/JztcbiAgICAvLyBFaXRoZXIgYGEgPz8gYmAgb3IgJ2E/LmInLlxuICAgIGlmICh0aGlzLnBlZWsgPT09IGNoYXJzLiRRVUVTVElPTiB8fCB0aGlzLnBlZWsgPT09IGNoYXJzLiRQRVJJT0QpIHtcbiAgICAgIHN0ciArPSB0aGlzLnBlZWsgPT09IGNoYXJzLiRQRVJJT0QgPyAnLicgOiAnPyc7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld09wZXJhdG9yVG9rZW4oc3RhcnQsIHRoaXMuaW5kZXgsIHN0cik7XG4gIH1cblxuICBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIG9mZnNldDogbnVtYmVyKTogVG9rZW4ge1xuICAgIGNvbnN0IHBvc2l0aW9uOiBudW1iZXIgPSB0aGlzLmluZGV4ICsgb2Zmc2V0O1xuICAgIHJldHVybiBuZXdFcnJvclRva2VuKFxuICAgICAgICBwb3NpdGlvbiwgdGhpcy5pbmRleCxcbiAgICAgICAgYExleGVyIEVycm9yOiAke21lc3NhZ2V9IGF0IGNvbHVtbiAke3Bvc2l0aW9ufSBpbiBleHByZXNzaW9uIFske3RoaXMuaW5wdXR9XWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzSWRlbnRpZmllclN0YXJ0KGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKGNoYXJzLiRhIDw9IGNvZGUgJiYgY29kZSA8PSBjaGFycy4keikgfHwgKGNoYXJzLiRBIDw9IGNvZGUgJiYgY29kZSA8PSBjaGFycy4kWikgfHxcbiAgICAgIChjb2RlID09IGNoYXJzLiRfKSB8fCAoY29kZSA9PSBjaGFycy4kJCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0lkZW50aWZpZXIoaW5wdXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoaW5wdXQubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc2Nhbm5lciA9IG5ldyBfU2Nhbm5lcihpbnB1dCk7XG4gIGlmICghaXNJZGVudGlmaWVyU3RhcnQoc2Nhbm5lci5wZWVrKSkgcmV0dXJuIGZhbHNlO1xuICBzY2FubmVyLmFkdmFuY2UoKTtcbiAgd2hpbGUgKHNjYW5uZXIucGVlayAhPT0gY2hhcnMuJEVPRikge1xuICAgIGlmICghaXNJZGVudGlmaWVyUGFydChzY2FubmVyLnBlZWspKSByZXR1cm4gZmFsc2U7XG4gICAgc2Nhbm5lci5hZHZhbmNlKCk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzSWRlbnRpZmllclBhcnQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjaGFycy5pc0FzY2lpTGV0dGVyKGNvZGUpIHx8IGNoYXJzLmlzRGlnaXQoY29kZSkgfHwgKGNvZGUgPT0gY2hhcnMuJF8pIHx8XG4gICAgICAoY29kZSA9PSBjaGFycy4kJCk7XG59XG5cbmZ1bmN0aW9uIGlzRXhwb25lbnRTdGFydChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvZGUgPT0gY2hhcnMuJGUgfHwgY29kZSA9PSBjaGFycy4kRTtcbn1cblxuZnVuY3Rpb24gaXNFeHBvbmVudFNpZ24oY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb2RlID09IGNoYXJzLiRNSU5VUyB8fCBjb2RlID09IGNoYXJzLiRQTFVTO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShjb2RlOiBudW1iZXIpOiBudW1iZXIge1xuICBzd2l0Y2ggKGNvZGUpIHtcbiAgICBjYXNlIGNoYXJzLiRuOlxuICAgICAgcmV0dXJuIGNoYXJzLiRMRjtcbiAgICBjYXNlIGNoYXJzLiRmOlxuICAgICAgcmV0dXJuIGNoYXJzLiRGRjtcbiAgICBjYXNlIGNoYXJzLiRyOlxuICAgICAgcmV0dXJuIGNoYXJzLiRDUjtcbiAgICBjYXNlIGNoYXJzLiR0OlxuICAgICAgcmV0dXJuIGNoYXJzLiRUQUI7XG4gICAgY2FzZSBjaGFycy4kdjpcbiAgICAgIHJldHVybiBjaGFycy4kVlRBQjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGNvZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRBdXRvUmFkaXgodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgcmVzdWx0OiBudW1iZXIgPSBwYXJzZUludCh0ZXh0KTtcbiAgaWYgKGlzTmFOKHJlc3VsdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW50ZWdlciBsaXRlcmFsIHdoZW4gcGFyc2luZyAnICsgdGV4dCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==