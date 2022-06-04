import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
/** A utility for calling matchMedia queries. */
export declare class MediaMatcher {
    private _platform;
    /** The internal matchMedia method to return back a MediaQueryList like object. */
    private _matchMedia;
    constructor(_platform: Platform);
    /**
     * Evaluates the given media query and returns the native MediaQueryList from which results
     * can be retrieved.
     * Confirms the layout engine will trigger for the selector query provided and returns the
     * MediaQueryList for the query provided.
     */
    matchMedia(query: string): MediaQueryList;
    static ɵfac: i0.ɵɵFactoryDeclaration<MediaMatcher, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MediaMatcher>;
}
