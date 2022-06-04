import { CdkStepper } from './stepper';
import * as i0 from "@angular/core";
/** Button that moves to the next step in a stepper workflow. */
export declare class CdkStepperNext {
    _stepper: CdkStepper;
    /** Type of the next button. Defaults to "submit" if not specified. */
    type: string;
    constructor(_stepper: CdkStepper);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkStepperNext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkStepperNext, "button[cdkStepperNext]", never, { "type": "type"; }, {}, never>;
}
/** Button that moves to the previous step in a stepper workflow. */
export declare class CdkStepperPrevious {
    _stepper: CdkStepper;
    /** Type of the previous button. Defaults to "button" if not specified. */
    type: string;
    constructor(_stepper: CdkStepper);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkStepperPrevious, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkStepperPrevious, "button[cdkStepperPrevious]", never, { "type": "type"; }, {}, never>;
}
