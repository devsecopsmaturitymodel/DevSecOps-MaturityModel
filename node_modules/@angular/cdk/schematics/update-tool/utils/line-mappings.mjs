"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeLineStartsMap = exports.getLineAndCharacterFromPosition = void 0;
/*
 * Line mapping utilities which can be used to retrieve line and character based
 * on an absolute character position in a given file. This functionality is similar
 * to TypeScript's "ts.getLineAndCharacterFromPosition" utility, but we cannot leverage
 * their logic for line mappings as it's internal and we need to generate line mappings
 * for non-TypeScript files such as HTML templates or stylesheets.
 *
 * Line and character can be retrieved by splitting a given source text based on
 * line breaks into line start entries. Later when a specific position is requested,
 * the closest line-start position is determined based on the given position.
 */
const LF_CHAR = 10;
const CR_CHAR = 13;
const LINE_SEP_CHAR = 8232;
const PARAGRAPH_CHAR = 8233;
/** Gets the line and character for the given position from the line starts map. */
function getLineAndCharacterFromPosition(lineStartsMap, position) {
    const lineIndex = findClosestLineStartPosition(lineStartsMap, position);
    return { character: position - lineStartsMap[lineIndex], line: lineIndex };
}
exports.getLineAndCharacterFromPosition = getLineAndCharacterFromPosition;
/**
 * Computes the line start map of the given text. This can be used in order to
 * retrieve the line and character of a given text position index.
 */
function computeLineStartsMap(text) {
    const result = [0];
    let pos = 0;
    while (pos < text.length) {
        const char = text.charCodeAt(pos++);
        // Handles the "CRLF" line break. In that case we peek the character
        // after the "CR" and check if it is a line feed.
        if (char === CR_CHAR) {
            if (text.charCodeAt(pos) === LF_CHAR) {
                pos++;
            }
            result.push(pos);
        }
        else if (char === LF_CHAR || char === LINE_SEP_CHAR || char === PARAGRAPH_CHAR) {
            result.push(pos);
        }
    }
    result.push(pos);
    return result;
}
exports.computeLineStartsMap = computeLineStartsMap;
/** Finds the closest line start for the given position. */
function findClosestLineStartPosition(linesMap, position, low = 0, high = linesMap.length - 1) {
    while (low <= high) {
        const pivotIndex = Math.floor((low + high) / 2);
        const pivotEl = linesMap[pivotIndex];
        if (pivotEl === position) {
            return pivotIndex;
        }
        else if (position > pivotEl) {
            low = pivotIndex + 1;
        }
        else {
            high = pivotIndex - 1;
        }
    }
    // In case there was no exact match, return the closest "lower" line index. We also
    // subtract the index by one because want the index of the previous line start.
    return low - 1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS1tYXBwaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy91cGRhdGUtdG9vbC91dGlscy9saW5lLW1hcHBpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVIOzs7Ozs7Ozs7O0dBVUc7QUFFSCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbkIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ25CLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQztBQUMzQixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFPNUIsbUZBQW1GO0FBQ25GLFNBQWdCLCtCQUErQixDQUFDLGFBQXVCLEVBQUUsUUFBZ0I7SUFDdkYsTUFBTSxTQUFTLEdBQUcsNEJBQTRCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUUsUUFBUSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUM7QUFDM0UsQ0FBQztBQUhELDBFQUdDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsSUFBWTtJQUMvQyxNQUFNLE1BQU0sR0FBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNaLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLG9FQUFvRTtRQUNwRSxpREFBaUQ7UUFDakQsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxPQUFPLEVBQUU7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2FBQ1A7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxJQUFJLElBQUksS0FBSyxhQUFhLElBQUksSUFBSSxLQUFLLGNBQWMsRUFBRTtZQUNoRixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO0tBQ0Y7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFsQkQsb0RBa0JDO0FBRUQsMkRBQTJEO0FBQzNELFNBQVMsNEJBQTRCLENBQ25DLFFBQWEsRUFDYixRQUFXLEVBQ1gsR0FBRyxHQUFHLENBQUMsRUFDUCxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO0lBRTFCLE9BQU8sR0FBRyxJQUFJLElBQUksRUFBRTtRQUNsQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyQyxJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDeEIsT0FBTyxVQUFVLENBQUM7U0FDbkI7YUFBTSxJQUFJLFFBQVEsR0FBRyxPQUFPLEVBQUU7WUFDN0IsR0FBRyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO0tBQ0Y7SUFFRCxtRkFBbUY7SUFDbkYsK0VBQStFO0lBQy9FLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qXG4gKiBMaW5lIG1hcHBpbmcgdXRpbGl0aWVzIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHJldHJpZXZlIGxpbmUgYW5kIGNoYXJhY3RlciBiYXNlZFxuICogb24gYW4gYWJzb2x1dGUgY2hhcmFjdGVyIHBvc2l0aW9uIGluIGEgZ2l2ZW4gZmlsZS4gVGhpcyBmdW5jdGlvbmFsaXR5IGlzIHNpbWlsYXJcbiAqIHRvIFR5cGVTY3JpcHQncyBcInRzLmdldExpbmVBbmRDaGFyYWN0ZXJGcm9tUG9zaXRpb25cIiB1dGlsaXR5LCBidXQgd2UgY2Fubm90IGxldmVyYWdlXG4gKiB0aGVpciBsb2dpYyBmb3IgbGluZSBtYXBwaW5ncyBhcyBpdCdzIGludGVybmFsIGFuZCB3ZSBuZWVkIHRvIGdlbmVyYXRlIGxpbmUgbWFwcGluZ3NcbiAqIGZvciBub24tVHlwZVNjcmlwdCBmaWxlcyBzdWNoIGFzIEhUTUwgdGVtcGxhdGVzIG9yIHN0eWxlc2hlZXRzLlxuICpcbiAqIExpbmUgYW5kIGNoYXJhY3RlciBjYW4gYmUgcmV0cmlldmVkIGJ5IHNwbGl0dGluZyBhIGdpdmVuIHNvdXJjZSB0ZXh0IGJhc2VkIG9uXG4gKiBsaW5lIGJyZWFrcyBpbnRvIGxpbmUgc3RhcnQgZW50cmllcy4gTGF0ZXIgd2hlbiBhIHNwZWNpZmljIHBvc2l0aW9uIGlzIHJlcXVlc3RlZCxcbiAqIHRoZSBjbG9zZXN0IGxpbmUtc3RhcnQgcG9zaXRpb24gaXMgZGV0ZXJtaW5lZCBiYXNlZCBvbiB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gKi9cblxuY29uc3QgTEZfQ0hBUiA9IDEwO1xuY29uc3QgQ1JfQ0hBUiA9IDEzO1xuY29uc3QgTElORV9TRVBfQ0hBUiA9IDgyMzI7XG5jb25zdCBQQVJBR1JBUEhfQ0hBUiA9IDgyMzM7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGluZUFuZENoYXJhY3RlciB7XG4gIGNoYXJhY3RlcjogbnVtYmVyO1xuICBsaW5lOiBudW1iZXI7XG59XG5cbi8qKiBHZXRzIHRoZSBsaW5lIGFuZCBjaGFyYWN0ZXIgZm9yIHRoZSBnaXZlbiBwb3NpdGlvbiBmcm9tIHRoZSBsaW5lIHN0YXJ0cyBtYXAuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGluZUFuZENoYXJhY3RlckZyb21Qb3NpdGlvbihsaW5lU3RhcnRzTWFwOiBudW1iZXJbXSwgcG9zaXRpb246IG51bWJlcikge1xuICBjb25zdCBsaW5lSW5kZXggPSBmaW5kQ2xvc2VzdExpbmVTdGFydFBvc2l0aW9uKGxpbmVTdGFydHNNYXAsIHBvc2l0aW9uKTtcbiAgcmV0dXJuIHtjaGFyYWN0ZXI6IHBvc2l0aW9uIC0gbGluZVN0YXJ0c01hcFtsaW5lSW5kZXhdLCBsaW5lOiBsaW5lSW5kZXh9O1xufVxuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBsaW5lIHN0YXJ0IG1hcCBvZiB0aGUgZ2l2ZW4gdGV4dC4gVGhpcyBjYW4gYmUgdXNlZCBpbiBvcmRlciB0b1xuICogcmV0cmlldmUgdGhlIGxpbmUgYW5kIGNoYXJhY3RlciBvZiBhIGdpdmVuIHRleHQgcG9zaXRpb24gaW5kZXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlTGluZVN0YXJ0c01hcCh0ZXh0OiBzdHJpbmcpOiBudW1iZXJbXSB7XG4gIGNvbnN0IHJlc3VsdDogbnVtYmVyW10gPSBbMF07XG4gIGxldCBwb3MgPSAwO1xuICB3aGlsZSAocG9zIDwgdGV4dC5sZW5ndGgpIHtcbiAgICBjb25zdCBjaGFyID0gdGV4dC5jaGFyQ29kZUF0KHBvcysrKTtcbiAgICAvLyBIYW5kbGVzIHRoZSBcIkNSTEZcIiBsaW5lIGJyZWFrLiBJbiB0aGF0IGNhc2Ugd2UgcGVlayB0aGUgY2hhcmFjdGVyXG4gICAgLy8gYWZ0ZXIgdGhlIFwiQ1JcIiBhbmQgY2hlY2sgaWYgaXQgaXMgYSBsaW5lIGZlZWQuXG4gICAgaWYgKGNoYXIgPT09IENSX0NIQVIpIHtcbiAgICAgIGlmICh0ZXh0LmNoYXJDb2RlQXQocG9zKSA9PT0gTEZfQ0hBUikge1xuICAgICAgICBwb3MrKztcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHBvcyk7XG4gICAgfSBlbHNlIGlmIChjaGFyID09PSBMRl9DSEFSIHx8IGNoYXIgPT09IExJTkVfU0VQX0NIQVIgfHwgY2hhciA9PT0gUEFSQUdSQVBIX0NIQVIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHBvcyk7XG4gICAgfVxuICB9XG4gIHJlc3VsdC5wdXNoKHBvcyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBGaW5kcyB0aGUgY2xvc2VzdCBsaW5lIHN0YXJ0IGZvciB0aGUgZ2l2ZW4gcG9zaXRpb24uICovXG5mdW5jdGlvbiBmaW5kQ2xvc2VzdExpbmVTdGFydFBvc2l0aW9uPFQ+KFxuICBsaW5lc01hcDogVFtdLFxuICBwb3NpdGlvbjogVCxcbiAgbG93ID0gMCxcbiAgaGlnaCA9IGxpbmVzTWFwLmxlbmd0aCAtIDEsXG4pIHtcbiAgd2hpbGUgKGxvdyA8PSBoaWdoKSB7XG4gICAgY29uc3QgcGl2b3RJbmRleCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgY29uc3QgcGl2b3RFbCA9IGxpbmVzTWFwW3Bpdm90SW5kZXhdO1xuXG4gICAgaWYgKHBpdm90RWwgPT09IHBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gcGl2b3RJbmRleDtcbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID4gcGl2b3RFbCkge1xuICAgICAgbG93ID0gcGl2b3RJbmRleCArIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZ2ggPSBwaXZvdEluZGV4IC0gMTtcbiAgICB9XG4gIH1cblxuICAvLyBJbiBjYXNlIHRoZXJlIHdhcyBubyBleGFjdCBtYXRjaCwgcmV0dXJuIHRoZSBjbG9zZXN0IFwibG93ZXJcIiBsaW5lIGluZGV4LiBXZSBhbHNvXG4gIC8vIHN1YnRyYWN0IHRoZSBpbmRleCBieSBvbmUgYmVjYXVzZSB3YW50IHRoZSBpbmRleCBvZiB0aGUgcHJldmlvdXMgbGluZSBzdGFydC5cbiAgcmV0dXJuIGxvdyAtIDE7XG59XG4iXX0=