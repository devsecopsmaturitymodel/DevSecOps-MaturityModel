/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/localize/tools/src/extract/translation_files/xml_file" />
interface Options {
    selfClosing?: boolean;
    preserveWhitespace?: boolean;
}
export declare class XmlFile {
    private output;
    private indent;
    private elements;
    private preservingWhitespace;
    toString(): string;
    startTag(name: string, attributes?: Record<string, string | undefined>, { selfClosing, preserveWhitespace }?: Options): this;
    endTag(name: string, { preserveWhitespace }?: Options): this;
    text(str: string): this;
    rawText(str: string): this;
    private incIndent;
    private decIndent;
}
export {};
