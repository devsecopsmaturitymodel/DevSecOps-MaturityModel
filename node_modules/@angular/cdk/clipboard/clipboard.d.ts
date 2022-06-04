import { PendingCopy } from './pending-copy';
import * as i0 from "@angular/core";
/**
 * A service for copying text to the clipboard.
 */
export declare class Clipboard {
    private readonly _document;
    constructor(document: any);
    /**
     * Copies the provided text into the user's clipboard.
     *
     * @param text The string to copy.
     * @returns Whether the operation was successful.
     */
    copy(text: string): boolean;
    /**
     * Prepares a string to be copied later. This is useful for large strings
     * which take too long to successfully render and be copied in the same tick.
     *
     * The caller must call `destroy` on the returned `PendingCopy`.
     *
     * @param text The string to copy.
     * @returns the pending copy operation.
     */
    beginCopy(text: string): PendingCopy;
    static ɵfac: i0.ɵɵFactoryDeclaration<Clipboard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Clipboard>;
}
