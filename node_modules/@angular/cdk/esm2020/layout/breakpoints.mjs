/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// PascalCase is being used as Breakpoints is used like an enum.
// tslint:disable-next-line:variable-name
export const Breakpoints = {
    XSmall: '(max-width: 599.98px)',
    Small: '(min-width: 600px) and (max-width: 959.98px)',
    Medium: '(min-width: 960px) and (max-width: 1279.98px)',
    Large: '(min-width: 1280px) and (max-width: 1919.98px)',
    XLarge: '(min-width: 1920px)',
    Handset: '(max-width: 599.98px) and (orientation: portrait), ' +
        '(max-width: 959.98px) and (orientation: landscape)',
    Tablet: '(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), ' +
        '(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)',
    Web: '(min-width: 840px) and (orientation: portrait), ' +
        '(min-width: 1280px) and (orientation: landscape)',
    HandsetPortrait: '(max-width: 599.98px) and (orientation: portrait)',
    TabletPortrait: '(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)',
    WebPortrait: '(min-width: 840px) and (orientation: portrait)',
    HandsetLandscape: '(max-width: 959.98px) and (orientation: landscape)',
    TabletLandscape: '(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)',
    WebLandscape: '(min-width: 1280px) and (orientation: landscape)',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtwb2ludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2xheW91dC9icmVha3BvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxnRUFBZ0U7QUFDaEUseUNBQXlDO0FBQ3pDLE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRztJQUN6QixNQUFNLEVBQUUsdUJBQXVCO0lBQy9CLEtBQUssRUFBRSw4Q0FBOEM7SUFDckQsTUFBTSxFQUFFLCtDQUErQztJQUN2RCxLQUFLLEVBQUUsZ0RBQWdEO0lBQ3ZELE1BQU0sRUFBRSxxQkFBcUI7SUFFN0IsT0FBTyxFQUNMLHFEQUFxRDtRQUNyRCxvREFBb0Q7SUFDdEQsTUFBTSxFQUNKLDRFQUE0RTtRQUM1RSw0RUFBNEU7SUFDOUUsR0FBRyxFQUNELGtEQUFrRDtRQUNsRCxrREFBa0Q7SUFFcEQsZUFBZSxFQUFFLG1EQUFtRDtJQUNwRSxjQUFjLEVBQUUsMEVBQTBFO0lBQzFGLFdBQVcsRUFBRSxnREFBZ0Q7SUFFN0QsZ0JBQWdCLEVBQUUsb0RBQW9EO0lBQ3RFLGVBQWUsRUFBRSw0RUFBNEU7SUFDN0YsWUFBWSxFQUFFLGtEQUFrRDtDQUNqRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyBQYXNjYWxDYXNlIGlzIGJlaW5nIHVzZWQgYXMgQnJlYWtwb2ludHMgaXMgdXNlZCBsaWtlIGFuIGVudW0uXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuZXhwb3J0IGNvbnN0IEJyZWFrcG9pbnRzID0ge1xuICBYU21hbGw6ICcobWF4LXdpZHRoOiA1OTkuOThweCknLFxuICBTbWFsbDogJyhtaW4td2lkdGg6IDYwMHB4KSBhbmQgKG1heC13aWR0aDogOTU5Ljk4cHgpJyxcbiAgTWVkaXVtOiAnKG1pbi13aWR0aDogOTYwcHgpIGFuZCAobWF4LXdpZHRoOiAxMjc5Ljk4cHgpJyxcbiAgTGFyZ2U6ICcobWluLXdpZHRoOiAxMjgwcHgpIGFuZCAobWF4LXdpZHRoOiAxOTE5Ljk4cHgpJyxcbiAgWExhcmdlOiAnKG1pbi13aWR0aDogMTkyMHB4KScsXG5cbiAgSGFuZHNldDpcbiAgICAnKG1heC13aWR0aDogNTk5Ljk4cHgpIGFuZCAob3JpZW50YXRpb246IHBvcnRyYWl0KSwgJyArXG4gICAgJyhtYXgtd2lkdGg6IDk1OS45OHB4KSBhbmQgKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpJyxcbiAgVGFibGV0OlxuICAgICcobWluLXdpZHRoOiA2MDBweCkgYW5kIChtYXgtd2lkdGg6IDgzOS45OHB4KSBhbmQgKG9yaWVudGF0aW9uOiBwb3J0cmFpdCksICcgK1xuICAgICcobWluLXdpZHRoOiA5NjBweCkgYW5kIChtYXgtd2lkdGg6IDEyNzkuOThweCkgYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG4gIFdlYjpcbiAgICAnKG1pbi13aWR0aDogODQwcHgpIGFuZCAob3JpZW50YXRpb246IHBvcnRyYWl0KSwgJyArXG4gICAgJyhtaW4td2lkdGg6IDEyODBweCkgYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG5cbiAgSGFuZHNldFBvcnRyYWl0OiAnKG1heC13aWR0aDogNTk5Ljk4cHgpIGFuZCAob3JpZW50YXRpb246IHBvcnRyYWl0KScsXG4gIFRhYmxldFBvcnRyYWl0OiAnKG1pbi13aWR0aDogNjAwcHgpIGFuZCAobWF4LXdpZHRoOiA4MzkuOThweCkgYW5kIChvcmllbnRhdGlvbjogcG9ydHJhaXQpJyxcbiAgV2ViUG9ydHJhaXQ6ICcobWluLXdpZHRoOiA4NDBweCkgYW5kIChvcmllbnRhdGlvbjogcG9ydHJhaXQpJyxcblxuICBIYW5kc2V0TGFuZHNjYXBlOiAnKG1heC13aWR0aDogOTU5Ljk4cHgpIGFuZCAob3JpZW50YXRpb246IGxhbmRzY2FwZSknLFxuICBUYWJsZXRMYW5kc2NhcGU6ICcobWluLXdpZHRoOiA5NjBweCkgYW5kIChtYXgtd2lkdGg6IDEyNzkuOThweCkgYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG4gIFdlYkxhbmRzY2FwZTogJyhtaW4td2lkdGg6IDEyODBweCkgYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG59O1xuIl19