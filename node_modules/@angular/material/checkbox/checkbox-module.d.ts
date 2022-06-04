import * as i0 from "@angular/core";
import * as i1 from "./checkbox-required-validator";
import * as i2 from "./checkbox";
import * as i3 from "@angular/material/core";
import * as i4 from "@angular/cdk/observers";
/** This module is used by both original and MDC-based checkbox implementations. */
export declare class _MatCheckboxRequiredValidatorModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatCheckboxRequiredValidatorModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<_MatCheckboxRequiredValidatorModule, [typeof i1.MatCheckboxRequiredValidator], never, [typeof i1.MatCheckboxRequiredValidator]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<_MatCheckboxRequiredValidatorModule>;
}
export declare class MatCheckboxModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCheckboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatCheckboxModule, [typeof i2.MatCheckbox], [typeof i3.MatRippleModule, typeof i3.MatCommonModule, typeof i4.ObserversModule, typeof _MatCheckboxRequiredValidatorModule], [typeof i2.MatCheckbox, typeof i3.MatCommonModule, typeof _MatCheckboxRequiredValidatorModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatCheckboxModule>;
}
