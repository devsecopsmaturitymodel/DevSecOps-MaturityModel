/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Rule } from '@angular-devkit/schematics';
/**
 * Migrates all polyfills files of projects to remove two dependencies originally needed by Internet
 * Explorer, but which are no longer needed now that support for IE has been dropped (`classlist.js`
 * and `web-animations-js`).
 *
 * The polyfills file includes side-effectful imports of these dependencies with comments about
 * their usage:
 *
 * ```
 * /**
 *  * IE11 requires the following for NgClass support on SVG elements
 *  *\/
 * import 'classlist.js';
 *
 * /**
 *  * Web Animations `@angular/platform-browser/animations`
 *  * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 *  * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 *  *\/
 * import 'web-animations-js';
 * ```
 *
 * This migration removes the `import` statements as well as any preceeding comments. It also
 * removes these dependencies from `package.json` if present and schedules an `npm install` task to
 * remove them from `node_modules/`.
 *
 * Also, the polyfills file has previously been generated with these imports commented out, to not
 * include the dependencies by default, but still allow users to easily uncomment and enable them
 * when required. So the migration also looks for:
 *
 * ```
 * // import 'classlist.js';  // Run `npm install --save classlist.js`.
 * // OR
 * // import 'web-animations-js';  // Run `npm install --save web-animations-js`.
 * ```
 *
 * And removes them as well. This keeps the polyfills files clean and up to date. Whitespace is
 * handled by leaving all trailing whitespace alone, and deleting all the leading newlines until the
 * previous non-empty line of code. This means any extra lines before a removed polyfill is dropped,
 * while any extra lines after a polyfill are retained. This roughly correlates to how a real
 * developer might write such a file.
 */
export default function (): Rule;
