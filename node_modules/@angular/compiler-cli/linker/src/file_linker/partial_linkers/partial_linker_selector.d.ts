/// <amd-module name="@angular/compiler-cli/linker/src/file_linker/partial_linkers/partial_linker_selector" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import semver from 'semver';
import { AbsoluteFsPath } from '../../../../src/ngtsc/file_system';
import { Logger } from '../../../../src/ngtsc/logging';
import { LinkerEnvironment } from '../linker_environment';
import { PartialLinker } from './partial_linker';
export declare const ɵɵngDeclareDirective = "\u0275\u0275ngDeclareDirective";
export declare const ɵɵngDeclareClassMetadata = "\u0275\u0275ngDeclareClassMetadata";
export declare const ɵɵngDeclareComponent = "\u0275\u0275ngDeclareComponent";
export declare const ɵɵngDeclareFactory = "\u0275\u0275ngDeclareFactory";
export declare const ɵɵngDeclareInjectable = "\u0275\u0275ngDeclareInjectable";
export declare const ɵɵngDeclareInjector = "\u0275\u0275ngDeclareInjector";
export declare const ɵɵngDeclareNgModule = "\u0275\u0275ngDeclareNgModule";
export declare const ɵɵngDeclarePipe = "\u0275\u0275ngDeclarePipe";
export declare const declarationFunctions: string[];
export interface LinkerRange<TExpression> {
    range: semver.Range;
    linker: PartialLinker<TExpression>;
}
/**
 * Create a mapping between partial-declaration call name and collections of partial-linkers.
 *
 * Each collection of partial-linkers will contain a version range that will be matched against the
 * `minVersion` of the partial-declaration. (Additionally, a partial-linker may modify its behaviour
 * internally based on the `version` property of the declaration.)
 *
 * Versions should be sorted in ascending order. The most recent partial-linker will be used as the
 * fallback linker if none of the other version ranges match. For example:
 *
 * ```
 * {range: getRange('<=', '13.0.0'), linker PartialDirectiveLinkerVersion2(...) },
 * {range: getRange('<=', '13.1.0'), linker PartialDirectiveLinkerVersion3(...) },
 * {range: getRange('<=', '14.0.0'), linker PartialDirectiveLinkerVersion4(...) },
 * {range: LATEST_VERSION_RANGE, linker: new PartialDirectiveLinkerVersion1(...)},
 * ```
 *
 * If the `LATEST_VERSION_RANGE` is `<=15.0.0` then the fallback linker would be
 * `PartialDirectiveLinkerVersion1` for any version greater than `15.0.0`.
 *
 * When there is a change to a declaration interface that requires a new partial-linker, the
 * `minVersion` of the partial-declaration should be updated, the new linker implementation should
 * be added to the end of the collection, and the version of the previous linker should be updated.
 */
export declare function createLinkerMap<TStatement, TExpression>(environment: LinkerEnvironment<TStatement, TExpression>, sourceUrl: AbsoluteFsPath, code: string): Map<string, LinkerRange<TExpression>[]>;
/**
 * A helper that selects the appropriate `PartialLinker` for a given declaration.
 *
 * The selection is made from a database of linker instances, chosen if their given semver range
 * satisfies the `minVersion` of the partial declaration to be linked.
 *
 * Note that the ranges are checked in order, and the first matching range will be selected. So
 * ranges should be most restrictive first. In practice, since ranges are always `<=X.Y.Z` this
 * means that ranges should be in ascending order.
 *
 * Note that any "pre-release" versions are stripped from ranges. Therefore if a `minVersion` is
 * `11.1.0-next.1` then this would match `11.1.0-next.2` and also `12.0.0-next.1`. (This is
 * different to standard semver range checking, where pre-release versions do not cross full version
 * boundaries.)
 */
export declare class PartialLinkerSelector<TExpression> {
    private readonly linkers;
    private readonly logger;
    private readonly unknownDeclarationVersionHandling;
    constructor(linkers: Map<string, LinkerRange<TExpression>[]>, logger: Logger, unknownDeclarationVersionHandling: 'ignore' | 'warn' | 'error');
    /**
     * Returns true if there are `PartialLinker` classes that can handle functions with this name.
     */
    supportsDeclaration(functionName: string): boolean;
    /**
     * Returns the `PartialLinker` that can handle functions with the given name and version.
     * Throws an error if there is none.
     */
    getLinker(functionName: string, minVersion: string, version: string): PartialLinker<TExpression>;
}
