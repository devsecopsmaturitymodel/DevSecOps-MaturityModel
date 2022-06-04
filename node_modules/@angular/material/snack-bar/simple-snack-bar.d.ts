import { MatSnackBarRef } from './snack-bar-ref';
import * as i0 from "@angular/core";
/**
 * Interface for a simple snack bar component that has a message and a single action.
 */
export interface TextOnlySnackBar {
    data: {
        message: string;
        action: string;
    };
    snackBarRef: MatSnackBarRef<TextOnlySnackBar>;
    action: () => void;
    hasAction: boolean;
}
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
export declare class SimpleSnackBar implements TextOnlySnackBar {
    snackBarRef: MatSnackBarRef<SimpleSnackBar>;
    /** Data that was injected into the snack bar. */
    data: {
        message: string;
        action: string;
    };
    constructor(snackBarRef: MatSnackBarRef<SimpleSnackBar>, data: any);
    /** Performs the action on the snack bar. */
    action(): void;
    /** If the action button should be shown. */
    get hasAction(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<SimpleSnackBar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SimpleSnackBar, "simple-snack-bar", never, {}, {}, never, never>;
}
