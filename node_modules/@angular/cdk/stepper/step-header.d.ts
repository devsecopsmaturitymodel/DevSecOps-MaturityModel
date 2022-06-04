/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import * as i0 from "@angular/core";
export declare class CdkStepHeader implements FocusableOption {
    _elementRef: ElementRef<HTMLElement>;
    constructor(_elementRef: ElementRef<HTMLElement>);
    /** Focuses the step header. */
    focus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkStepHeader, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkStepHeader, "[cdkStepHeader]", never, {}, {}, never>;
}
