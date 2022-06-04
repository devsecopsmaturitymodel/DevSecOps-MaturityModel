/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
declare module '@yarnpkg/lockfile' {
    function parse(data: string): Record<string, any>;
}
declare module 'ini' {
    function parse(data: string): Record<string, any>;
}
declare module 'npm-pick-manifest' {
    function pickManifest(metadata: import('../utilities/package-metadata').PackageMetadata, selector: string): import('../utilities/package-metadata').PackageManifest;
    export = pickManifest;
}
declare module 'pacote' {
    function manifest(specifier: string, options: Record<string, unknown>): Promise<{
        name: string;
        version: string;
    }>;
    function packument(specifier: string, options: Record<string, unknown>): Promise<import('../utilities/package-metadata').NpmRepositoryPackageJson>;
}
