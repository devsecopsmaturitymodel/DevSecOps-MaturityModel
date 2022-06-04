/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { logging } from '@angular-devkit/core';
import { JsonSchemaForNpmPackageJsonFiles } from './package-json';
export interface NpmRepositoryPackageJson {
    name: string;
    requestedName: string;
    description: string;
    'dist-tags': {
        [name: string]: string;
    };
    versions: {
        [version: string]: JsonSchemaForNpmPackageJsonFiles;
    };
    time: {
        modified: string;
        created: string;
        [version: string]: string;
    };
}
export declare type NgAddSaveDepedency = 'dependencies' | 'devDependencies' | boolean;
export interface PackageIdentifier {
    type: 'git' | 'tag' | 'version' | 'range' | 'file' | 'directory' | 'remote';
    name: string;
    scope: string | null;
    registry: boolean;
    raw: string;
    fetchSpec: string;
    rawSpec: string;
}
export interface PackageManifest {
    name: string;
    version: string;
    license?: string;
    private?: boolean;
    deprecated?: boolean;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
    optionalDependencies: Record<string, string>;
    'ng-add'?: {
        save?: NgAddSaveDepedency;
    };
    'ng-update'?: {
        migrations: string;
        packageGroup: Record<string, string>;
    };
}
export interface PackageMetadata {
    name: string;
    tags: {
        [tag: string]: PackageManifest | undefined;
    };
    versions: Record<string, PackageManifest>;
    'dist-tags'?: unknown;
}
export declare function fetchPackageMetadata(name: string, logger: logging.LoggerApi, options?: {
    registry?: string;
    usingYarn?: boolean;
    verbose?: boolean;
}): Promise<PackageMetadata>;
export declare function fetchPackageManifest(name: string, logger: logging.LoggerApi, options?: {
    registry?: string;
    usingYarn?: boolean;
    verbose?: boolean;
}): Promise<PackageManifest>;
export declare function getNpmPackageJson(packageName: string, logger: logging.LoggerApi, options?: {
    registry?: string;
    usingYarn?: boolean;
    verbose?: boolean;
}): Promise<Partial<NpmRepositoryPackageJson>>;
