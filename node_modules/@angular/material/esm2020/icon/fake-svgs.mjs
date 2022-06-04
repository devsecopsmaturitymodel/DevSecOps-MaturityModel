/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Fake URLs and associated SVG documents used by tests.
 * The ID attribute is used to load the icons, the name attribute is only used for testing.
 * @docs-private
 */
export const FAKE_SVGS = {
    cat: '<svg><path id="meow" name="meow"></path></svg>',
    dog: '<svg><path id="woof" name="woof"></path></svg>',
    dogWithSpaces: '<svg><path id="woof says the dog" name="woof"></path></svg>',
    farmSet1: `
    <svg>
      <defs>
        <g id="pig" name="pig"><path name="oink"></path></g>
        <g id="cow" name="cow"><path name="moo"></path></g>
      </defs>
    </svg>
  `,
    farmSet2: `
    <svg>
      <defs>
        <g id="cow" name="cow"><path name="moo moo"></path></g>
        <g id="sheep" name="sheep"><path name="baa"></path></g>
      </defs>
    </svg>
  `,
    farmSet3: `
    <svg>
      <symbol id="duck" name="duck">
        <path id="quack" name="quack"></path>
      </symbol>
    </svg>
  `,
    farmSet4: `
    <svg>
      <defs>
        <g id="pig with spaces" name="pig"><path name="oink"></path></g>
      </defs>
    </svg>
  `,
    farmSet5: `
    <svg>
      <symbol id="duck" viewBox="0 0 13 37">
        <path id="quack" name="quack"></path>
      </symbol>
    </svg>
  `,
    arrows: `
    <svg>
      <defs>
        <svg id="left-arrow" name="left-arrow"><path name="left"></path></svg>
        <svg id="right-arrow" name="right-arrow"><path name="right"></path></svg>
      </defs>
    </svg>  `,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1zdmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vZmFrZS1zdmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUc7SUFDdkIsR0FBRyxFQUFFLGdEQUFnRDtJQUNyRCxHQUFHLEVBQUUsZ0RBQWdEO0lBQ3JELGFBQWEsRUFBRSw2REFBNkQ7SUFDNUUsUUFBUSxFQUFFOzs7Ozs7O0dBT1Q7SUFDRCxRQUFRLEVBQUU7Ozs7Ozs7R0FPVDtJQUNELFFBQVEsRUFBRTs7Ozs7O0dBTVQ7SUFDRCxRQUFRLEVBQUU7Ozs7OztHQU1UO0lBQ0QsUUFBUSxFQUFFOzs7Ozs7R0FNVDtJQUNELE1BQU0sRUFBRTs7Ozs7O2FBTUc7Q0FDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogRmFrZSBVUkxzIGFuZCBhc3NvY2lhdGVkIFNWRyBkb2N1bWVudHMgdXNlZCBieSB0ZXN0cy5cbiAqIFRoZSBJRCBhdHRyaWJ1dGUgaXMgdXNlZCB0byBsb2FkIHRoZSBpY29ucywgdGhlIG5hbWUgYXR0cmlidXRlIGlzIG9ubHkgdXNlZCBmb3IgdGVzdGluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IEZBS0VfU1ZHUyA9IHtcbiAgY2F0OiAnPHN2Zz48cGF0aCBpZD1cIm1lb3dcIiBuYW1lPVwibWVvd1wiPjwvcGF0aD48L3N2Zz4nLFxuICBkb2c6ICc8c3ZnPjxwYXRoIGlkPVwid29vZlwiIG5hbWU9XCJ3b29mXCI+PC9wYXRoPjwvc3ZnPicsXG4gIGRvZ1dpdGhTcGFjZXM6ICc8c3ZnPjxwYXRoIGlkPVwid29vZiBzYXlzIHRoZSBkb2dcIiBuYW1lPVwid29vZlwiPjwvcGF0aD48L3N2Zz4nLFxuICBmYXJtU2V0MTogYFxuICAgIDxzdmc+XG4gICAgICA8ZGVmcz5cbiAgICAgICAgPGcgaWQ9XCJwaWdcIiBuYW1lPVwicGlnXCI+PHBhdGggbmFtZT1cIm9pbmtcIj48L3BhdGg+PC9nPlxuICAgICAgICA8ZyBpZD1cImNvd1wiIG5hbWU9XCJjb3dcIj48cGF0aCBuYW1lPVwibW9vXCI+PC9wYXRoPjwvZz5cbiAgICAgIDwvZGVmcz5cbiAgICA8L3N2Zz5cbiAgYCxcbiAgZmFybVNldDI6IGBcbiAgICA8c3ZnPlxuICAgICAgPGRlZnM+XG4gICAgICAgIDxnIGlkPVwiY293XCIgbmFtZT1cImNvd1wiPjxwYXRoIG5hbWU9XCJtb28gbW9vXCI+PC9wYXRoPjwvZz5cbiAgICAgICAgPGcgaWQ9XCJzaGVlcFwiIG5hbWU9XCJzaGVlcFwiPjxwYXRoIG5hbWU9XCJiYWFcIj48L3BhdGg+PC9nPlxuICAgICAgPC9kZWZzPlxuICAgIDwvc3ZnPlxuICBgLFxuICBmYXJtU2V0MzogYFxuICAgIDxzdmc+XG4gICAgICA8c3ltYm9sIGlkPVwiZHVja1wiIG5hbWU9XCJkdWNrXCI+XG4gICAgICAgIDxwYXRoIGlkPVwicXVhY2tcIiBuYW1lPVwicXVhY2tcIj48L3BhdGg+XG4gICAgICA8L3N5bWJvbD5cbiAgICA8L3N2Zz5cbiAgYCxcbiAgZmFybVNldDQ6IGBcbiAgICA8c3ZnPlxuICAgICAgPGRlZnM+XG4gICAgICAgIDxnIGlkPVwicGlnIHdpdGggc3BhY2VzXCIgbmFtZT1cInBpZ1wiPjxwYXRoIG5hbWU9XCJvaW5rXCI+PC9wYXRoPjwvZz5cbiAgICAgIDwvZGVmcz5cbiAgICA8L3N2Zz5cbiAgYCxcbiAgZmFybVNldDU6IGBcbiAgICA8c3ZnPlxuICAgICAgPHN5bWJvbCBpZD1cImR1Y2tcIiB2aWV3Qm94PVwiMCAwIDEzIDM3XCI+XG4gICAgICAgIDxwYXRoIGlkPVwicXVhY2tcIiBuYW1lPVwicXVhY2tcIj48L3BhdGg+XG4gICAgICA8L3N5bWJvbD5cbiAgICA8L3N2Zz5cbiAgYCxcbiAgYXJyb3dzOiBgXG4gICAgPHN2Zz5cbiAgICAgIDxkZWZzPlxuICAgICAgICA8c3ZnIGlkPVwibGVmdC1hcnJvd1wiIG5hbWU9XCJsZWZ0LWFycm93XCI+PHBhdGggbmFtZT1cImxlZnRcIj48L3BhdGg+PC9zdmc+XG4gICAgICAgIDxzdmcgaWQ9XCJyaWdodC1hcnJvd1wiIG5hbWU9XCJyaWdodC1hcnJvd1wiPjxwYXRoIG5hbWU9XCJyaWdodFwiPjwvcGF0aD48L3N2Zz5cbiAgICAgIDwvZGVmcz5cbiAgICA8L3N2Zz4gIGAsXG59O1xuIl19