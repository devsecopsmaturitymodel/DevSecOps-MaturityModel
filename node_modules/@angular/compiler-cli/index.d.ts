/// <amd-module name="@angular/compiler-cli" />
export { VERSION } from './src/version';
export * from './src/transformers/api';
export * from './src/transformers/entry_points';
export * from './src/perform_compile';
export { CompilerOptions as AngularCompilerOptions } from './src/transformers/api';
export * from './private/tooling';
export * from './src/ngtsc/logging';
export * from './src/ngtsc/file_system';
export { NgTscPlugin } from './src/ngtsc/tsc_plugin';
export { NgtscProgram } from './src/ngtsc/program';
export { OptimizeFor } from './src/ngtsc/typecheck/api';
export { ConsoleLogger, Logger, LogLevel } from './src/ngtsc/logging';
export { NodeJSFileSystem } from './src/ngtsc/file_system';
