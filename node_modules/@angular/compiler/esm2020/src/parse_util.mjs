/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as chars from './chars';
import { stringify } from './util';
export class ParseLocation {
    constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    toString() {
        return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
    }
    moveBy(delta) {
        const source = this.file.content;
        const len = source.length;
        let offset = this.offset;
        let line = this.line;
        let col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            const ch = source.charCodeAt(offset);
            if (ch == chars.$LF) {
                line--;
                const priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode(chars.$LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            const ch = source.charCodeAt(offset);
            offset++;
            delta--;
            if (ch == chars.$LF) {
                line++;
                col = 0;
            }
            else {
                col++;
            }
        }
        return new ParseLocation(this.file, offset, line, col);
    }
    // Return the source around the location
    // Up to `maxChars` or `maxLines` on each side of the location
    getContext(maxChars, maxLines) {
        const content = this.file.content;
        let startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            let endOffset = startOffset;
            let ctxChars = 0;
            let ctxLines = 0;
            while (ctxChars < maxChars && startOffset > 0) {
                startOffset--;
                ctxChars++;
                if (content[startOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            ctxChars = 0;
            ctxLines = 0;
            while (ctxChars < maxChars && endOffset < content.length - 1) {
                endOffset++;
                ctxChars++;
                if (content[endOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            return {
                before: content.substring(startOffset, this.offset),
                after: content.substring(this.offset, endOffset + 1),
            };
        }
        return null;
    }
}
export class ParseSourceFile {
    constructor(content, url) {
        this.content = content;
        this.url = url;
    }
}
export class ParseSourceSpan {
    /**
     * Create an object that holds information about spans of tokens/nodes captured during
     * lexing/parsing of text.
     *
     * @param start
     * The location of the start of the span (having skipped leading trivia).
     * Skipping leading trivia makes source-spans more "user friendly", since things like HTML
     * elements will appear to begin at the start of the opening tag, rather than at the start of any
     * leading trivia, which could include newlines.
     *
     * @param end
     * The location of the end of the span.
     *
     * @param fullStart
     * The start of the token without skipping the leading trivia.
     * This is used by tooling that splits tokens further, such as extracting Angular interpolations
     * from text tokens. Such tooling creates new source-spans relative to the original token's
     * source-span. If leading trivia characters have been skipped then the new source-spans may be
     * incorrectly offset.
     *
     * @param details
     * Additional information (such as identifier names) that should be associated with the span.
     */
    constructor(start, end, fullStart = start, details = null) {
        this.start = start;
        this.end = end;
        this.fullStart = fullStart;
        this.details = details;
    }
    toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
}
export var ParseErrorLevel;
(function (ParseErrorLevel) {
    ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
    ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
})(ParseErrorLevel || (ParseErrorLevel = {}));
export class ParseError {
    constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    contextualMessage() {
        const ctx = this.span.start.getContext(100, 3);
        return ctx ? `${this.msg} ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` :
            this.msg;
    }
    toString() {
        const details = this.span.details ? `, ${this.span.details}` : '';
        return `${this.contextualMessage()}: ${this.span.start}${details}`;
    }
}
/**
 * Generates Source Span object for a given R3 Type for JIT mode.
 *
 * @param kind Component or Directive.
 * @param typeName name of the Component or Directive.
 * @param sourceUrl reference to Component or Directive source.
 * @returns instance of ParseSourceSpan that represent a given Component or Directive.
 */
export function r3JitTypeSourceSpan(kind, typeName, sourceUrl) {
    const sourceFileName = `in ${kind} ${typeName} in ${sourceUrl}`;
    const sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
let _anonymousTypeIndex = 0;
export function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    const ref = compileIdentifier.reference;
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    if (ref['__forward_ref__']) {
        // We do not want to try to stringify a `forwardRef()` function because that would cause the
        // inner function to be evaluated too early, defeating the whole point of the `forwardRef`.
        return '__forward_ref__';
    }
    let identifier = stringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = `anonymous_${_anonymousTypeIndex++}`;
        ref['__anonymousType'] = identifier;
    }
    else {
        identifier = sanitizeIdentifier(identifier);
    }
    return identifier;
}
export function sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9wYXJzZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sS0FBSyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFakMsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDVyxJQUFxQixFQUFTLE1BQWMsRUFBUyxJQUFZLEVBQ2pFLEdBQVc7UUFEWCxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ2pFLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFBRyxDQUFDO0lBRTFCLFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUMzRixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQWE7UUFDbEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNuQixPQUFPLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUM5QixN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SSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtRQUN0RCxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsTUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDO0lBQ3hDLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDMUIsT0FBTyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUMvQjtJQUNELElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDMUIsNEZBQTRGO1FBQzVGLDJGQUEyRjtRQUMzRixPQUFPLGlCQUFpQixDQUFDO0tBQzFCO0lBQ0QsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEMsNkJBQTZCO1FBQzdCLFVBQVUsR0FBRyxhQUFhLG1CQUFtQixFQUFFLEVBQUUsQ0FBQztRQUNsRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsR0FBRyxVQUFVLENBQUM7S0FDckM7U0FBTTtRQUNMLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3QztJQUNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFNRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsSUFBWTtJQUM3QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIGNoYXJzIGZyb20gJy4vY2hhcnMnO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBQYXJzZUxvY2F0aW9uIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgZmlsZTogUGFyc2VTb3VyY2VGaWxlLCBwdWJsaWMgb2Zmc2V0OiBudW1iZXIsIHB1YmxpYyBsaW5lOiBudW1iZXIsXG4gICAgICBwdWJsaWMgY29sOiBudW1iZXIpIHt9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXQgIT0gbnVsbCA/IGAke3RoaXMuZmlsZS51cmx9QCR7dGhpcy5saW5lfToke3RoaXMuY29sfWAgOiB0aGlzLmZpbGUudXJsO1xuICB9XG5cbiAgbW92ZUJ5KGRlbHRhOiBudW1iZXIpOiBQYXJzZUxvY2F0aW9uIHtcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmZpbGUuY29udGVudDtcbiAgICBjb25zdCBsZW4gPSBzb3VyY2UubGVuZ3RoO1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLm9mZnNldDtcbiAgICBsZXQgbGluZSA9IHRoaXMubGluZTtcbiAgICBsZXQgY29sID0gdGhpcy5jb2w7XG4gICAgd2hpbGUgKG9mZnNldCA+IDAgJiYgZGVsdGEgPCAwKSB7XG4gICAgICBvZmZzZXQtLTtcbiAgICAgIGRlbHRhKys7XG4gICAgICBjb25zdCBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICBpZiAoY2ggPT0gY2hhcnMuJExGKSB7XG4gICAgICAgIGxpbmUtLTtcbiAgICAgICAgY29uc3QgcHJpb3JMaW5lID0gc291cmNlLnN1YnN0cigwLCBvZmZzZXQgLSAxKS5sYXN0SW5kZXhPZihTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJzLiRMRikpO1xuICAgICAgICBjb2wgPSBwcmlvckxpbmUgPiAwID8gb2Zmc2V0IC0gcHJpb3JMaW5lIDogb2Zmc2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sLS07XG4gICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChvZmZzZXQgPCBsZW4gJiYgZGVsdGEgPiAwKSB7XG4gICAgICBjb25zdCBjaCA9IHNvdXJjZS5jaGFyQ29kZUF0KG9mZnNldCk7XG4gICAgICBvZmZzZXQrKztcbiAgICAgIGRlbHRhLS07XG4gICAgICBpZiAoY2ggPT0gY2hhcnMuJExGKSB7XG4gICAgICAgIGxpbmUrKztcbiAgICAgICAgY29sID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbCsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFBhcnNlTG9jYXRpb24odGhpcy5maWxlLCBvZmZzZXQsIGxpbmUsIGNvbCk7XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHNvdXJjZSBhcm91bmQgdGhlIGxvY2F0aW9uXG4gIC8vIFVwIHRvIGBtYXhDaGFyc2Agb3IgYG1heExpbmVzYCBvbiBlYWNoIHNpZGUgb2YgdGhlIGxvY2F0aW9uXG4gIGdldENvbnRleHQobWF4Q2hhcnM6IG51bWJlciwgbWF4TGluZXM6IG51bWJlcik6IHtiZWZvcmU6IHN0cmluZywgYWZ0ZXI6IHN0cmluZ318bnVsbCB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuZmlsZS5jb250ZW50O1xuICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuXG4gICAgaWYgKHN0YXJ0T2Zmc2V0ICE9IG51bGwpIHtcbiAgICAgIGlmIChzdGFydE9mZnNldCA+IGNvbnRlbnQubGVuZ3RoIC0gMSkge1xuICAgICAgICBzdGFydE9mZnNldCA9IGNvbnRlbnQubGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICAgIGxldCBlbmRPZmZzZXQgPSBzdGFydE9mZnNldDtcbiAgICAgIGxldCBjdHhDaGFycyA9IDA7XG4gICAgICBsZXQgY3R4TGluZXMgPSAwO1xuXG4gICAgICB3aGlsZSAoY3R4Q2hhcnMgPCBtYXhDaGFycyAmJiBzdGFydE9mZnNldCA+IDApIHtcbiAgICAgICAgc3RhcnRPZmZzZXQtLTtcbiAgICAgICAgY3R4Q2hhcnMrKztcbiAgICAgICAgaWYgKGNvbnRlbnRbc3RhcnRPZmZzZXRdID09ICdcXG4nKSB7XG4gICAgICAgICAgaWYgKCsrY3R4TGluZXMgPT0gbWF4TGluZXMpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHhDaGFycyA9IDA7XG4gICAgICBjdHhMaW5lcyA9IDA7XG4gICAgICB3aGlsZSAoY3R4Q2hhcnMgPCBtYXhDaGFycyAmJiBlbmRPZmZzZXQgPCBjb250ZW50Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgZW5kT2Zmc2V0Kys7XG4gICAgICAgIGN0eENoYXJzKys7XG4gICAgICAgIGlmIChjb250ZW50W2VuZE9mZnNldF0gPT0gJ1xcbicpIHtcbiAgICAgICAgICBpZiAoKytjdHhMaW5lcyA9PSBtYXhMaW5lcykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJlZm9yZTogY29udGVudC5zdWJzdHJpbmcoc3RhcnRPZmZzZXQsIHRoaXMub2Zmc2V0KSxcbiAgICAgICAgYWZ0ZXI6IGNvbnRlbnQuc3Vic3RyaW5nKHRoaXMub2Zmc2V0LCBlbmRPZmZzZXQgKyAxKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlU291cmNlRmlsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb250ZW50OiBzdHJpbmcsIHB1YmxpYyB1cmw6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlU291cmNlU3BhbiB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gb2JqZWN0IHRoYXQgaG9sZHMgaW5mb3JtYXRpb24gYWJvdXQgc3BhbnMgb2YgdG9rZW5zL25vZGVzIGNhcHR1cmVkIGR1cmluZ1xuICAgKiBsZXhpbmcvcGFyc2luZyBvZiB0ZXh0LlxuICAgKlxuICAgKiBAcGFyYW0gc3RhcnRcbiAgICogVGhlIGxvY2F0aW9uIG9mIHRoZSBzdGFydCBvZiB0aGUgc3BhbiAoaGF2aW5nIHNraXBwZWQgbGVhZGluZyB0cml2aWEpLlxuICAgKiBTa2lwcGluZyBsZWFkaW5nIHRyaXZpYSBtYWtlcyBzb3VyY2Utc3BhbnMgbW9yZSBcInVzZXIgZnJpZW5kbHlcIiwgc2luY2UgdGhpbmdzIGxpa2UgSFRNTFxuICAgKiBlbGVtZW50cyB3aWxsIGFwcGVhciB0byBiZWdpbiBhdCB0aGUgc3RhcnQgb2YgdGhlIG9wZW5pbmcgdGFnLCByYXRoZXIgdGhhbiBhdCB0aGUgc3RhcnQgb2YgYW55XG4gICAqIGxlYWRpbmcgdHJpdmlhLCB3aGljaCBjb3VsZCBpbmNsdWRlIG5ld2xpbmVzLlxuICAgKlxuICAgKiBAcGFyYW0gZW5kXG4gICAqIFRoZSBsb2NhdGlvbiBvZiB0aGUgZW5kIG9mIHRoZSBzcGFuLlxuICAgKlxuICAgKiBAcGFyYW0gZnVsbFN0YXJ0XG4gICAqIFRoZSBzdGFydCBvZiB0aGUgdG9rZW4gd2l0aG91dCBza2lwcGluZyB0aGUgbGVhZGluZyB0cml2aWEuXG4gICAqIFRoaXMgaXMgdXNlZCBieSB0b29saW5nIHRoYXQgc3BsaXRzIHRva2VucyBmdXJ0aGVyLCBzdWNoIGFzIGV4dHJhY3RpbmcgQW5ndWxhciBpbnRlcnBvbGF0aW9uc1xuICAgKiBmcm9tIHRleHQgdG9rZW5zLiBTdWNoIHRvb2xpbmcgY3JlYXRlcyBuZXcgc291cmNlLXNwYW5zIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbCB0b2tlbidzXG4gICAqIHNvdXJjZS1zcGFuLiBJZiBsZWFkaW5nIHRyaXZpYSBjaGFyYWN0ZXJzIGhhdmUgYmVlbiBza2lwcGVkIHRoZW4gdGhlIG5ldyBzb3VyY2Utc3BhbnMgbWF5IGJlXG4gICAqIGluY29ycmVjdGx5IG9mZnNldC5cbiAgICpcbiAgICogQHBhcmFtIGRldGFpbHNcbiAgICogQWRkaXRpb25hbCBpbmZvcm1hdGlvbiAoc3VjaCBhcyBpZGVudGlmaWVyIG5hbWVzKSB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggdGhlIHNwYW4uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBzdGFydDogUGFyc2VMb2NhdGlvbiwgcHVibGljIGVuZDogUGFyc2VMb2NhdGlvbixcbiAgICAgIHB1YmxpYyBmdWxsU3RhcnQ6IFBhcnNlTG9jYXRpb24gPSBzdGFydCwgcHVibGljIGRldGFpbHM6IHN0cmluZ3xudWxsID0gbnVsbCkge31cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmZpbGUuY29udGVudC5zdWJzdHJpbmcodGhpcy5zdGFydC5vZmZzZXQsIHRoaXMuZW5kLm9mZnNldCk7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gUGFyc2VFcnJvckxldmVsIHtcbiAgV0FSTklORyxcbiAgRVJST1IsXG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZUVycm9yIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgc3BhbjogUGFyc2VTb3VyY2VTcGFuLCBwdWJsaWMgbXNnOiBzdHJpbmcsXG4gICAgICBwdWJsaWMgbGV2ZWw6IFBhcnNlRXJyb3JMZXZlbCA9IFBhcnNlRXJyb3JMZXZlbC5FUlJPUikge31cblxuICBjb250ZXh0dWFsTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuc3Bhbi5zdGFydC5nZXRDb250ZXh0KDEwMCwgMyk7XG4gICAgcmV0dXJuIGN0eCA/IGAke3RoaXMubXNnfSAoXCIke2N0eC5iZWZvcmV9WyR7UGFyc2VFcnJvckxldmVsW3RoaXMubGV2ZWxdfSAtPl0ke2N0eC5hZnRlcn1cIilgIDpcbiAgICAgICAgICAgICAgICAgdGhpcy5tc2c7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLnNwYW4uZGV0YWlscyA/IGAsICR7dGhpcy5zcGFuLmRldGFpbHN9YCA6ICcnO1xuICAgIHJldHVybiBgJHt0aGlzLmNvbnRleHR1YWxNZXNzYWdlKCl9OiAke3RoaXMuc3Bhbi5zdGFydH0ke2RldGFpbHN9YDtcbiAgfVxufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBTb3VyY2UgU3BhbiBvYmplY3QgZm9yIGEgZ2l2ZW4gUjMgVHlwZSBmb3IgSklUIG1vZGUuXG4gKlxuICogQHBhcmFtIGtpbmQgQ29tcG9uZW50IG9yIERpcmVjdGl2ZS5cbiAqIEBwYXJhbSB0eXBlTmFtZSBuYW1lIG9mIHRoZSBDb21wb25lbnQgb3IgRGlyZWN0aXZlLlxuICogQHBhcmFtIHNvdXJjZVVybCByZWZlcmVuY2UgdG8gQ29tcG9uZW50IG9yIERpcmVjdGl2ZSBzb3VyY2UuXG4gKiBAcmV0dXJucyBpbnN0YW5jZSBvZiBQYXJzZVNvdXJjZVNwYW4gdGhhdCByZXByZXNlbnQgYSBnaXZlbiBDb21wb25lbnQgb3IgRGlyZWN0aXZlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcjNKaXRUeXBlU291cmNlU3BhbihcbiAgICBraW5kOiBzdHJpbmcsIHR5cGVOYW1lOiBzdHJpbmcsIHNvdXJjZVVybDogc3RyaW5nKTogUGFyc2VTb3VyY2VTcGFuIHtcbiAgY29uc3Qgc291cmNlRmlsZU5hbWUgPSBgaW4gJHtraW5kfSAke3R5cGVOYW1lfSBpbiAke3NvdXJjZVVybH1gO1xuICBjb25zdCBzb3VyY2VGaWxlID0gbmV3IFBhcnNlU291cmNlRmlsZSgnJywgc291cmNlRmlsZU5hbWUpO1xuICByZXR1cm4gbmV3IFBhcnNlU291cmNlU3BhbihcbiAgICAgIG5ldyBQYXJzZUxvY2F0aW9uKHNvdXJjZUZpbGUsIC0xLCAtMSwgLTEpLCBuZXcgUGFyc2VMb2NhdGlvbihzb3VyY2VGaWxlLCAtMSwgLTEsIC0xKSk7XG59XG5cbmxldCBfYW5vbnltb3VzVHlwZUluZGV4ID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGlkZW50aWZpZXJOYW1lKGNvbXBpbGVJZGVudGlmaWVyOiBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhfG51bGx8dW5kZWZpbmVkKTogc3RyaW5nfFxuICAgIG51bGwge1xuICBpZiAoIWNvbXBpbGVJZGVudGlmaWVyIHx8ICFjb21waWxlSWRlbnRpZmllci5yZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCByZWYgPSBjb21waWxlSWRlbnRpZmllci5yZWZlcmVuY2U7XG4gIGlmIChyZWZbJ19fYW5vbnltb3VzVHlwZSddKSB7XG4gICAgcmV0dXJuIHJlZlsnX19hbm9ueW1vdXNUeXBlJ107XG4gIH1cbiAgaWYgKHJlZlsnX19mb3J3YXJkX3JlZl9fJ10pIHtcbiAgICAvLyBXZSBkbyBub3Qgd2FudCB0byB0cnkgdG8gc3RyaW5naWZ5IGEgYGZvcndhcmRSZWYoKWAgZnVuY3Rpb24gYmVjYXVzZSB0aGF0IHdvdWxkIGNhdXNlIHRoZVxuICAgIC8vIGlubmVyIGZ1bmN0aW9uIHRvIGJlIGV2YWx1YXRlZCB0b28gZWFybHksIGRlZmVhdGluZyB0aGUgd2hvbGUgcG9pbnQgb2YgdGhlIGBmb3J3YXJkUmVmYC5cbiAgICByZXR1cm4gJ19fZm9yd2FyZF9yZWZfXyc7XG4gIH1cbiAgbGV0IGlkZW50aWZpZXIgPSBzdHJpbmdpZnkocmVmKTtcbiAgaWYgKGlkZW50aWZpZXIuaW5kZXhPZignKCcpID49IDApIHtcbiAgICAvLyBjYXNlOiBhbm9ueW1vdXMgZnVuY3Rpb25zIVxuICAgIGlkZW50aWZpZXIgPSBgYW5vbnltb3VzXyR7X2Fub255bW91c1R5cGVJbmRleCsrfWA7XG4gICAgcmVmWydfX2Fub255bW91c1R5cGUnXSA9IGlkZW50aWZpZXI7XG4gIH0gZWxzZSB7XG4gICAgaWRlbnRpZmllciA9IHNhbml0aXplSWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlSWRlbnRpZmllck1ldGFkYXRhIHtcbiAgcmVmZXJlbmNlOiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUlkZW50aWZpZXIobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUucmVwbGFjZSgvXFxXL2csICdfJyk7XG59XG4iXX0=