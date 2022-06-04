/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Gets whether the code is currently running in a test environment. */
export function _isTestEnvironment() {
    // We can't use `declare const` because it causes conflicts inside Google with the real typings
    // for these symbols and we can't read them off the global object, because they don't appear to
    // be attached there for some runners like Jest.
    // (see: https://github.com/angular/components/issues/23365#issuecomment-938146643)
    return (
    // @ts-ignore
    (typeof __karma__ !== 'undefined' && !!__karma__) ||
        // @ts-ignore
        (typeof jasmine !== 'undefined' && !!jasmine) ||
        // @ts-ignore
        (typeof jest !== 'undefined' && !!jest) ||
        // @ts-ignore
        (typeof Mocha !== 'undefined' && !!Mocha));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1lbnZpcm9ubWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvcGxhdGZvcm0vZmVhdHVyZXMvdGVzdC1lbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCx3RUFBd0U7QUFDeEUsTUFBTSxVQUFVLGtCQUFrQjtJQUNoQywrRkFBK0Y7SUFDL0YsK0ZBQStGO0lBQy9GLGdEQUFnRDtJQUNoRCxtRkFBbUY7SUFDbkYsT0FBTztJQUNMLGFBQWE7SUFDYixDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2pELGFBQWE7UUFDYixDQUFDLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzdDLGFBQWE7UUFDYixDQUFDLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3ZDLGFBQWE7UUFDYixDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQzFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBHZXRzIHdoZXRoZXIgdGhlIGNvZGUgaXMgY3VycmVudGx5IHJ1bm5pbmcgaW4gYSB0ZXN0IGVudmlyb25tZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9pc1Rlc3RFbnZpcm9ubWVudCgpOiBib29sZWFuIHtcbiAgLy8gV2UgY2FuJ3QgdXNlIGBkZWNsYXJlIGNvbnN0YCBiZWNhdXNlIGl0IGNhdXNlcyBjb25mbGljdHMgaW5zaWRlIEdvb2dsZSB3aXRoIHRoZSByZWFsIHR5cGluZ3NcbiAgLy8gZm9yIHRoZXNlIHN5bWJvbHMgYW5kIHdlIGNhbid0IHJlYWQgdGhlbSBvZmYgdGhlIGdsb2JhbCBvYmplY3QsIGJlY2F1c2UgdGhleSBkb24ndCBhcHBlYXIgdG9cbiAgLy8gYmUgYXR0YWNoZWQgdGhlcmUgZm9yIHNvbWUgcnVubmVycyBsaWtlIEplc3QuXG4gIC8vIChzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIzMzY1I2lzc3VlY29tbWVudC05MzgxNDY2NDMpXG4gIHJldHVybiAoXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgICh0eXBlb2YgX19rYXJtYV9fICE9PSAndW5kZWZpbmVkJyAmJiAhIV9fa2FybWFfXykgfHxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgKHR5cGVvZiBqYXNtaW5lICE9PSAndW5kZWZpbmVkJyAmJiAhIWphc21pbmUpIHx8XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgICh0eXBlb2YgamVzdCAhPT0gJ3VuZGVmaW5lZCcgJiYgISFqZXN0KSB8fFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICAodHlwZW9mIE1vY2hhICE9PSAndW5kZWZpbmVkJyAmJiAhIU1vY2hhKVxuICApO1xufVxuIl19