/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
/** @docs-private */
export declare function MATERIAL_SANITY_CHECKS_FACTORY(): SanityChecks;
/** Injection token that configures whether the Material sanity checks are enabled. */
export declare const MATERIAL_SANITY_CHECKS: InjectionToken<SanityChecks>;
/**
 * Possible sanity checks that can be enabled. If set to
 * true/false, all checks will be enabled/disabled.
 */
export declare type SanityChecks = boolean | GranularSanityChecks;
/** Object that can be used to configure the sanity checks granularly. */
export interface GranularSanityChecks {
    doctype: boolean;
    theme: boolean;
    version: boolean;
}
/**
 * Module that captures anything that should be loaded and/or run for *all* Angular Material
 * components. This includes Bidi, etc.
 *
 * This module should be imported to each top-level component module (e.g., MatTabsModule).
 */
export declare class MatCommonModule {
    private _sanityChecks;
    private _document;
    /** Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype). */
    private _hasDoneGlobalChecks;
    constructor(highContrastModeDetector: HighContrastModeDetector, _sanityChecks: SanityChecks, _document: Document);
    /** Gets whether a specific sanity check is enabled. */
    private _checkIsEnabled;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCommonModule, [null, { optional: true; }, null]>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatCommonModule, never, [typeof i1.BidiModule], [typeof i1.BidiModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatCommonModule>;
}
