"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomTheme = void 0;
/** Create custom theme for the given application configuration. */
function createCustomTheme(name = 'app') {
    return `
// Custom Theming for Angular Material
// For more information: https://material.angular.io/guide/theming
@use '@angular/material' as mat;
// Plus imports for other components in your app.

// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat.core();

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
$${name}-primary: mat.define-palette(mat.$indigo-palette);
$${name}-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);

// The warn palette is optional (defaults to red).
$${name}-warn: mat.define-palette(mat.$red-palette);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as "color" or "typography".
$${name}-theme: mat.define-light-theme((
  color: (
    primary: $${name}-primary,
    accent: $${name}-accent,
    warn: $${name}-warn,
  )
));

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include mat.all-component-themes($${name}-theme);

`;
}
exports.createCustomTheme = createCustomTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS10aGVtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLWFkZC90aGVtaW5nL2NyZWF0ZS1jdXN0b20tdGhlbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsbUVBQW1FO0FBQ25FLFNBQWdCLGlCQUFpQixDQUFDLE9BQWUsS0FBSztJQUNwRCxPQUFPOzs7Ozs7Ozs7Ozs7OztHQWNOLElBQUk7R0FDSixJQUFJOzs7R0FHSixJQUFJOzs7O0dBSUosSUFBSTs7Z0JBRVMsSUFBSTtlQUNMLElBQUk7YUFDTixJQUFJOzs7Ozs7O3FDQU9vQixJQUFJOztDQUV4QyxDQUFDO0FBQ0YsQ0FBQztBQXJDRCw4Q0FxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqIENyZWF0ZSBjdXN0b20gdGhlbWUgZm9yIHRoZSBnaXZlbiBhcHBsaWNhdGlvbiBjb25maWd1cmF0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUN1c3RvbVRoZW1lKG5hbWU6IHN0cmluZyA9ICdhcHAnKSB7XG4gIHJldHVybiBgXG4vLyBDdXN0b20gVGhlbWluZyBmb3IgQW5ndWxhciBNYXRlcmlhbFxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb246IGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS90aGVtaW5nXG5AdXNlICdAYW5ndWxhci9tYXRlcmlhbCcgYXMgbWF0O1xuLy8gUGx1cyBpbXBvcnRzIGZvciBvdGhlciBjb21wb25lbnRzIGluIHlvdXIgYXBwLlxuXG4vLyBJbmNsdWRlIHRoZSBjb21tb24gc3R5bGVzIGZvciBBbmd1bGFyIE1hdGVyaWFsLiBXZSBpbmNsdWRlIHRoaXMgaGVyZSBzbyB0aGF0IHlvdSBvbmx5XG4vLyBoYXZlIHRvIGxvYWQgYSBzaW5nbGUgY3NzIGZpbGUgZm9yIEFuZ3VsYXIgTWF0ZXJpYWwgaW4geW91ciBhcHAuXG4vLyBCZSBzdXJlIHRoYXQgeW91IG9ubHkgZXZlciBpbmNsdWRlIHRoaXMgbWl4aW4gb25jZSFcbkBpbmNsdWRlIG1hdC5jb3JlKCk7XG5cbi8vIERlZmluZSB0aGUgcGFsZXR0ZXMgZm9yIHlvdXIgdGhlbWUgdXNpbmcgdGhlIE1hdGVyaWFsIERlc2lnbiBwYWxldHRlcyBhdmFpbGFibGUgaW4gcGFsZXR0ZS5zY3NzXG4vLyAoaW1wb3J0ZWQgYWJvdmUpLiBGb3IgZWFjaCBwYWxldHRlLCB5b3UgY2FuIG9wdGlvbmFsbHkgc3BlY2lmeSBhIGRlZmF1bHQsIGxpZ2h0ZXIsIGFuZCBkYXJrZXJcbi8vIGh1ZS4gQXZhaWxhYmxlIGNvbG9yIHBhbGV0dGVzOiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi9jb2xvci9cbiQke25hbWV9LXByaW1hcnk6IG1hdC5kZWZpbmUtcGFsZXR0ZShtYXQuJGluZGlnby1wYWxldHRlKTtcbiQke25hbWV9LWFjY2VudDogbWF0LmRlZmluZS1wYWxldHRlKG1hdC4kcGluay1wYWxldHRlLCBBMjAwLCBBMTAwLCBBNDAwKTtcblxuLy8gVGhlIHdhcm4gcGFsZXR0ZSBpcyBvcHRpb25hbCAoZGVmYXVsdHMgdG8gcmVkKS5cbiQke25hbWV9LXdhcm46IG1hdC5kZWZpbmUtcGFsZXR0ZShtYXQuJHJlZC1wYWxldHRlKTtcblxuLy8gQ3JlYXRlIHRoZSB0aGVtZSBvYmplY3QuIEEgdGhlbWUgY29uc2lzdHMgb2YgY29uZmlndXJhdGlvbnMgZm9yIGluZGl2aWR1YWxcbi8vIHRoZW1pbmcgc3lzdGVtcyBzdWNoIGFzIFwiY29sb3JcIiBvciBcInR5cG9ncmFwaHlcIi5cbiQke25hbWV9LXRoZW1lOiBtYXQuZGVmaW5lLWxpZ2h0LXRoZW1lKChcbiAgY29sb3I6IChcbiAgICBwcmltYXJ5OiAkJHtuYW1lfS1wcmltYXJ5LFxuICAgIGFjY2VudDogJCR7bmFtZX0tYWNjZW50LFxuICAgIHdhcm46ICQke25hbWV9LXdhcm4sXG4gIClcbikpO1xuXG4vLyBJbmNsdWRlIHRoZW1lIHN0eWxlcyBmb3IgY29yZSBhbmQgZWFjaCBjb21wb25lbnQgdXNlZCBpbiB5b3VyIGFwcC5cbi8vIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gaW1wb3J0IGFuZCBAaW5jbHVkZSB0aGUgdGhlbWUgbWl4aW5zIGZvciBlYWNoIGNvbXBvbmVudFxuLy8gdGhhdCB5b3UgYXJlIHVzaW5nLlxuQGluY2x1ZGUgbWF0LmFsbC1jb21wb25lbnQtdGhlbWVzKCQke25hbWV9LXRoZW1lKTtcblxuYDtcbn1cbiJdfQ==