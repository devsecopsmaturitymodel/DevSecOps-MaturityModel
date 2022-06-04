/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare type LoadOutputFileFunctionType = (file: string) => Promise<string>;
export declare type CrossOriginValue = 'none' | 'anonymous' | 'use-credentials';
export declare type Entrypoint = [name: string, isModule: boolean];
export interface AugmentIndexHtmlOptions {
    html: string;
    baseHref?: string;
    deployUrl?: string;
    sri: boolean;
    /** crossorigin attribute setting of elements that provide CORS support */
    crossOrigin?: CrossOriginValue;
    files: FileInfo[];
    loadOutputFile: LoadOutputFileFunctionType;
    /** Used to sort the inseration of files in the HTML file */
    entrypoints: Entrypoint[];
    /** Used to set the document default locale */
    lang?: string;
}
export interface FileInfo {
    file: string;
    name: string;
    extension: string;
}
export declare function augmentIndexHtml(params: AugmentIndexHtmlOptions): Promise<{
    content: string;
    warnings: string[];
    errors: string[];
}>;
