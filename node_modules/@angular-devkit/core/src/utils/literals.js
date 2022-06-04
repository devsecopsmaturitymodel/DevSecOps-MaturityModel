"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimNewlines = exports.stripIndents = exports.stripIndent = exports.indentBy = exports.oneLine = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function oneLine(strings, ...values) {
    const endResult = String.raw(strings, ...values);
    return endResult.replace(/(?:\r?\n(?:\s*))+/gm, ' ').trim();
}
exports.oneLine = oneLine;
function indentBy(indentations) {
    let i = '';
    while (indentations--) {
        i += ' ';
    }
    return (strings, ...values) => {
        return i + stripIndent(strings, ...values).replace(/\n/g, '\n' + i);
    };
}
exports.indentBy = indentBy;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripIndent(strings, ...values) {
    const endResult = String.raw(strings, ...values);
    // remove the shortest leading indentation from each line
    const match = endResult.match(/^[ \t]*(?=\S)/gm);
    // return early if there's nothing to strip
    if (match === null) {
        return endResult;
    }
    const indent = Math.min(...match.map((el) => el.length));
    const regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');
    return (indent > 0 ? endResult.replace(regexp, '') : endResult).trim();
}
exports.stripIndent = stripIndent;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripIndents(strings, ...values) {
    return String.raw(strings, ...values)
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
}
exports.stripIndents = stripIndents;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function trimNewlines(strings, ...values) {
    const endResult = String.raw(strings, ...values);
    return (endResult
        // Remove the newline at the start.
        .replace(/^(?:\r?\n)+/, '')
        // Remove the newline at the end and following whitespace.
        .replace(/(?:\r?\n(?:\s*))$/, ''));
}
exports.trimNewlines = trimNewlines;
