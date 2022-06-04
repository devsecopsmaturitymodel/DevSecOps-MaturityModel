import * as i0 from "@angular/core";
import * as i1 from "./slide-toggle-required-validator";
import * as i2 from "./slide-toggle";
import * as i3 from "@angular/material/core";
import * as i4 from "@angular/cdk/observers";
/** This module is used by both original and MDC-based slide-toggle implementations. */
export declare class _MatSlideToggleRequiredValidatorModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatSlideToggleRequiredValidatorModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<_MatSlideToggleRequiredValidatorModule, [typeof i1.MatSlideToggleRequiredValidator], never, [typeof i1.MatSlideToggleRequiredValidator]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<_MatSlideToggleRequiredValidatorModule>;
}
export declare class MatSlideToggleModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatSlideToggleModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatSlideToggleModule, [typeof i2.MatSlideToggle], [typeof _MatSlideToggleRequiredValidatorModule, typeof i3.MatRippleModule, typeof i3.MatCommonModule, typeof i4.ObserversModule], [typeof _MatSlideToggleRequiredValidatorModule, typeof i2.MatSlideToggle, typeof i3.MatCommonModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatSlideToggleModule>;
}
