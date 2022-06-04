/// <amd-module name="@angular/compiler-cli/linker/src/ast/utils" />
/**
 * Assert that the given `node` is of the type guarded by the `predicate` function.
 */
export declare function assert<T, K extends T>(node: T, predicate: (node: T) => node is K, expected: string): asserts node is K;
