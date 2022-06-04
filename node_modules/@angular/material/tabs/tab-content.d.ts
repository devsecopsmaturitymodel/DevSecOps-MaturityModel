/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `MatTabContent`. It serves as
 * alternative token to the actual `MatTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const MAT_TAB_CONTENT: InjectionToken<MatTabContent>;
/** Decorates the `ng-template` tags and reads out the template from it. */
export declare class MatTabContent {
    template: TemplateRef<any>;
    constructor(/** Content for the tab. */ template: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTabContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatTabContent, "[matTabContent]", never, {}, {}, never>;
}
