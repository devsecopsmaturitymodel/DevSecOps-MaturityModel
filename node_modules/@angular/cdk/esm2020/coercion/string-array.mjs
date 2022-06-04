/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Coerces a value to an array of trimmed non-empty strings.
 * Any input that is not an array, `null` or `undefined` will be turned into a string
 * via `toString()` and subsequently split with the given separator.
 * `null` and `undefined` will result in an empty array.
 * This results in the following outcomes:
 * - `null` -&gt; `[]`
 * - `[null]` -&gt; `["null"]`
 * - `["a", "b ", " "]` -&gt; `["a", "b"]`
 * - `[1, [2, 3]]` -&gt; `["1", "2,3"]`
 * - `[{ a: 0 }]` -&gt; `["[object Object]"]`
 * - `{ a: 0 }` -&gt; `["[object", "Object]"]`
 *
 * Useful for defining CSS classes or table columns.
 * @param value the value to coerce into an array of strings
 * @param separator split-separator if value isn't an array
 */
export function coerceStringArray(value, separator = /\s+/) {
    const result = [];
    if (value != null) {
        const sourceValues = Array.isArray(value) ? value : `${value}`.split(separator);
        for (const sourceValue of sourceValues) {
            const trimmedString = `${sourceValue}`.trim();
            if (trimmedString) {
                result.push(trimmedString);
            }
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLWFycmF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9jb2VyY2lvbi9zdHJpbmctYXJyYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBVSxFQUFFLFlBQTZCLEtBQUs7SUFDOUUsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBRWxCLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUNqQixNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hGLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO1lBQ3RDLE1BQU0sYUFBYSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDOUMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDNUI7U0FDRjtLQUNGO0lBRUQsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIENvZXJjZXMgYSB2YWx1ZSB0byBhbiBhcnJheSBvZiB0cmltbWVkIG5vbi1lbXB0eSBzdHJpbmdzLlxuICogQW55IGlucHV0IHRoYXQgaXMgbm90IGFuIGFycmF5LCBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgd2lsbCBiZSB0dXJuZWQgaW50byBhIHN0cmluZ1xuICogdmlhIGB0b1N0cmluZygpYCBhbmQgc3Vic2VxdWVudGx5IHNwbGl0IHdpdGggdGhlIGdpdmVuIHNlcGFyYXRvci5cbiAqIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgd2lsbCByZXN1bHQgaW4gYW4gZW1wdHkgYXJyYXkuXG4gKiBUaGlzIHJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyBvdXRjb21lczpcbiAqIC0gYG51bGxgIC0mZ3Q7IGBbXWBcbiAqIC0gYFtudWxsXWAgLSZndDsgYFtcIm51bGxcIl1gXG4gKiAtIGBbXCJhXCIsIFwiYiBcIiwgXCIgXCJdYCAtJmd0OyBgW1wiYVwiLCBcImJcIl1gXG4gKiAtIGBbMSwgWzIsIDNdXWAgLSZndDsgYFtcIjFcIiwgXCIyLDNcIl1gXG4gKiAtIGBbeyBhOiAwIH1dYCAtJmd0OyBgW1wiW29iamVjdCBPYmplY3RdXCJdYFxuICogLSBgeyBhOiAwIH1gIC0mZ3Q7IGBbXCJbb2JqZWN0XCIsIFwiT2JqZWN0XVwiXWBcbiAqXG4gKiBVc2VmdWwgZm9yIGRlZmluaW5nIENTUyBjbGFzc2VzIG9yIHRhYmxlIGNvbHVtbnMuXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIGNvZXJjZSBpbnRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSBzZXBhcmF0b3Igc3BsaXQtc2VwYXJhdG9yIGlmIHZhbHVlIGlzbid0IGFuIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2VyY2VTdHJpbmdBcnJheSh2YWx1ZTogYW55LCBzZXBhcmF0b3I6IHN0cmluZyB8IFJlZ0V4cCA9IC9cXHMrLyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG5cbiAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICBjb25zdCBzb3VyY2VWYWx1ZXMgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogYCR7dmFsdWV9YC5zcGxpdChzZXBhcmF0b3IpO1xuICAgIGZvciAoY29uc3Qgc291cmNlVmFsdWUgb2Ygc291cmNlVmFsdWVzKSB7XG4gICAgICBjb25zdCB0cmltbWVkU3RyaW5nID0gYCR7c291cmNlVmFsdWV9YC50cmltKCk7XG4gICAgICBpZiAodHJpbW1lZFN0cmluZykge1xuICAgICAgICByZXN1bHQucHVzaCh0cmltbWVkU3RyaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19