/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
/** Set of possible high-contrast mode backgrounds. */
export declare const enum HighContrastMode {
    NONE = 0,
    BLACK_ON_WHITE = 1,
    WHITE_ON_BLACK = 2
}
/** CSS class applied to the document body when in black-on-white high-contrast mode. */
export declare const BLACK_ON_WHITE_CSS_CLASS = "cdk-high-contrast-black-on-white";
/** CSS class applied to the document body when in white-on-black high-contrast mode. */
export declare const WHITE_ON_BLACK_CSS_CLASS = "cdk-high-contrast-white-on-black";
/** CSS class applied to the document body when in high-contrast mode. */
export declare const HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = "cdk-high-contrast-active";
/**
 * Service to determine whether the browser is currently in a high-contrast-mode environment.
 *
 * Microsoft Windows supports an accessibility feature called "High Contrast Mode". This mode
 * changes the appearance of all applications, including web applications, to dramatically increase
 * contrast.
 *
 * IE, Edge, and Firefox currently support this mode. Chrome does not support Windows High Contrast
 * Mode. This service does not detect high-contrast mode as added by the Chrome "High Contrast"
 * browser extension.
 */
export declare class HighContrastModeDetector {
    private _platform;
    /**
     * Figuring out the high contrast mode and adding the body classes can cause
     * some expensive layouts. This flag is used to ensure that we only do it once.
     */
    private _hasCheckedHighContrastMode;
    private _document;
    constructor(_platform: Platform, document: any);
    /** Gets the current high-contrast-mode for the page. */
    getHighContrastMode(): HighContrastMode;
    /** Applies CSS classes indicating high-contrast mode to document body (browser-only). */
    _applyBodyHighContrastModeCssClasses(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<HighContrastModeDetector, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HighContrastModeDetector>;
}
