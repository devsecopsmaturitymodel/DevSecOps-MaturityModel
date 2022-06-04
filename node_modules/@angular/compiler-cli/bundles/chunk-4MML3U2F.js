
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  CompilationMode,
  ComponentDecoratorHandler,
  CompoundMetadataReader,
  CompoundMetadataRegistry,
  DirectiveDecoratorHandler,
  DtsMetadataReader,
  DtsTransformRegistry,
  InjectableClassRegistry,
  InjectableDecoratorHandler,
  LocalMetadataRegistry,
  NgModuleDecoratorHandler,
  NoopReferencesRegistry,
  PartialEvaluator,
  PipeDecoratorHandler,
  ResourceRegistry,
  SemanticDepGraphUpdater,
  TraitCompiler,
  aliasTransformFactory,
  declarationTransformFactory,
  flattenInheritedDirectiveMetadata,
  ivyTransformFactory
} from "./chunk-3URTMUFW.js";
import {
  TypeScriptReflectionHost,
  isNamedClassDeclaration
} from "./chunk-4DFV4CTF.js";
import {
  AbsoluteModuleStrategy,
  AliasStrategy,
  COMPILER_ERRORS_WITH_GUIDES,
  DefaultImportTracker,
  ERROR_DETAILS_PAGE_BASE_URL,
  ErrorCode,
  ExtendedTemplateDiagnosticName,
  ImportFlags,
  ImportManager,
  LocalIdentifierStrategy,
  LogicalProjectStrategy,
  ModuleResolver,
  NoopImportRewriter,
  PrivateExportAliasingHost,
  R3SymbolsImportRewriter,
  Reference,
  ReferenceEmitter,
  RelativePathStrategy,
  UnifiedModulesAliasingHost,
  UnifiedModulesStrategy,
  assertSuccessfulReferenceEmit,
  getRootDirs,
  getSourceFileOrNull,
  getTokenAtPosition,
  identifierOfNode,
  isAssignment,
  isDtsPath,
  isNonDeclarationTsPath,
  isSymbolWithValueDeclaration,
  makeDiagnostic,
  makeRelatedInformation,
  ngErrorCode,
  nodeNameForError,
  normalizeSeparators,
  relativePathBetween,
  replaceTsWithNgInErrors,
  toUnredirectedSourceFile,
  translateExpression,
  translateType
} from "./chunk-HJ5BXSPS.js";
import {
  LogicalFileSystem,
  absoluteFrom,
  absoluteFromSourceFile,
  basename,
  dirname,
  getFileSystem,
  getSourceFileOrError,
  join,
  resolve
} from "./chunk-MMRSE3VM.js";
import {
  ActivePerfRecorder,
  DelegatingPerfRecorder,
  PerfCheckpoint,
  PerfEvent,
  PerfPhase
} from "./chunk-QK4SXRQA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GMSUYBZP.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/api.mjs
var DEFAULT_ERROR_CODE = 100;
var UNKNOWN_ERROR_CODE = 500;
var SOURCE = "angular";
function isTsDiagnostic(diagnostic) {
  return diagnostic != null && diagnostic.source !== "angular";
}
var EmitFlags;
(function(EmitFlags2) {
  EmitFlags2[EmitFlags2["DTS"] = 1] = "DTS";
  EmitFlags2[EmitFlags2["JS"] = 2] = "JS";
  EmitFlags2[EmitFlags2["Metadata"] = 4] = "Metadata";
  EmitFlags2[EmitFlags2["I18nBundle"] = 8] = "I18nBundle";
  EmitFlags2[EmitFlags2["Codegen"] = 16] = "Codegen";
  EmitFlags2[EmitFlags2["Default"] = 19] = "Default";
  EmitFlags2[EmitFlags2["All"] = 31] = "All";
})(EmitFlags || (EmitFlags = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/compiler_host.mjs
import ts from "typescript";
var wrapHostForTest = null;
function createCompilerHost({ options, tsHost = ts.createCompilerHost(options, true) }) {
  if (wrapHostForTest !== null) {
    tsHost = wrapHostForTest(tsHost);
  }
  return tsHost;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/api/checker.mjs
var OptimizeFor;
(function(OptimizeFor2) {
  OptimizeFor2[OptimizeFor2["SingleFile"] = 0] = "SingleFile";
  OptimizeFor2[OptimizeFor2["WholeProgram"] = 1] = "WholeProgram";
})(OptimizeFor || (OptimizeFor = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/api/completion.mjs
var CompletionKind;
(function(CompletionKind2) {
  CompletionKind2[CompletionKind2["Reference"] = 0] = "Reference";
  CompletionKind2[CompletionKind2["Variable"] = 1] = "Variable";
})(CompletionKind || (CompletionKind = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/api/symbols.mjs
var SymbolKind;
(function(SymbolKind2) {
  SymbolKind2[SymbolKind2["Input"] = 0] = "Input";
  SymbolKind2[SymbolKind2["Output"] = 1] = "Output";
  SymbolKind2[SymbolKind2["Binding"] = 2] = "Binding";
  SymbolKind2[SymbolKind2["Reference"] = 3] = "Reference";
  SymbolKind2[SymbolKind2["Variable"] = 4] = "Variable";
  SymbolKind2[SymbolKind2["Directive"] = 5] = "Directive";
  SymbolKind2[SymbolKind2["Element"] = 6] = "Element";
  SymbolKind2[SymbolKind2["Template"] = 7] = "Template";
  SymbolKind2[SymbolKind2["Expression"] = 8] = "Expression";
  SymbolKind2[SymbolKind2["DomBinding"] = 9] = "DomBinding";
  SymbolKind2[SymbolKind2["Pipe"] = 10] = "Pipe";
})(SymbolKind || (SymbolKind = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/program.mjs
import { HtmlParser, MessageBundle } from "@angular/compiler";
import ts35 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/i18n.mjs
import { Xliff, Xliff2, Xmb } from "@angular/compiler";
import * as path from "path";
function i18nGetExtension(formatName) {
  const format = formatName.toLowerCase();
  switch (format) {
    case "xmb":
      return "xmb";
    case "xlf":
    case "xlif":
    case "xliff":
    case "xlf2":
    case "xliff2":
      return "xlf";
  }
  throw new Error(`Unsupported format "${formatName}"`);
}
function i18nExtract(formatName, outFile, host, options, bundle, pathResolve = path.resolve) {
  formatName = formatName || "xlf";
  const ext = i18nGetExtension(formatName);
  const content = i18nSerialize(bundle, formatName, options);
  const dstFile = outFile || `messages.${ext}`;
  const dstPath = pathResolve(options.outDir || options.basePath, dstFile);
  host.writeFile(dstPath, content, false, void 0, []);
  return [dstPath];
}
function i18nSerialize(bundle, formatName, options) {
  const format = formatName.toLowerCase();
  let serializer;
  switch (format) {
    case "xmb":
      serializer = new Xmb();
      break;
    case "xliff2":
    case "xlf2":
      serializer = new Xliff2();
      break;
    case "xlf":
    case "xliff":
    default:
      serializer = new Xliff();
  }
  return bundle.write(serializer, getPathNormalizer(options.basePath));
}
function getPathNormalizer(basePath) {
  return (sourcePath) => {
    sourcePath = basePath ? path.relative(basePath, sourcePath) : sourcePath;
    return sourcePath.split(path.sep).join("/");
  };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/typescript_support.mjs
import ts2 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/version_helpers.mjs
function toNumbers(value) {
  const suffixIndex = value.lastIndexOf("-");
  return value.slice(0, suffixIndex === -1 ? value.length : suffixIndex).split(".").map((segment) => {
    const parsed = parseInt(segment, 10);
    if (isNaN(parsed)) {
      throw Error(`Unable to parse version string ${value}.`);
    }
    return parsed;
  });
}
function compareNumbers(a, b) {
  const max = Math.max(a.length, b.length);
  const min = Math.min(a.length, b.length);
  for (let i = 0; i < min; i++) {
    if (a[i] > b[i])
      return 1;
    if (a[i] < b[i])
      return -1;
  }
  if (min !== max) {
    const longestArray = a.length === max ? a : b;
    const comparisonResult = a.length === max ? 1 : -1;
    for (let i = min; i < max; i++) {
      if (longestArray[i] > 0) {
        return comparisonResult;
      }
    }
  }
  return 0;
}
function compareVersions(v1, v2) {
  return compareNumbers(toNumbers(v1), toNumbers(v2));
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/typescript_support.mjs
var MIN_TS_VERSION = "4.4.2";
var MAX_TS_VERSION = "4.7.0";
var tsVersion = ts2.version;
function checkVersion(version, minVersion, maxVersion) {
  if (compareVersions(version, minVersion) < 0 || compareVersions(version, maxVersion) >= 0) {
    throw new Error(`The Angular Compiler requires TypeScript >=${minVersion} and <${maxVersion} but ${version} was found instead.`);
  }
}
function verifySupportedTypeScriptVersion() {
  checkVersion(tsVersion, MIN_TS_VERSION, MAX_TS_VERSION);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/core/src/compiler.mjs
import ts33 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/cycles/src/analyzer.mjs
var CycleAnalyzer = class {
  constructor(importGraph) {
    this.importGraph = importGraph;
    this.cachedResults = null;
  }
  wouldCreateCycle(from, to) {
    if (this.cachedResults === null || this.cachedResults.from !== from) {
      this.cachedResults = new CycleResults(from, this.importGraph);
    }
    return this.cachedResults.wouldBeCyclic(to) ? new Cycle(this.importGraph, from, to) : null;
  }
  recordSyntheticImport(from, to) {
    this.cachedResults = null;
    this.importGraph.addSyntheticImport(from, to);
  }
};
var NgCyclicResult = Symbol("NgCyclicResult");
var CycleResults = class {
  constructor(from, importGraph) {
    this.from = from;
    this.importGraph = importGraph;
    this.cyclic = {};
    this.acyclic = {};
  }
  wouldBeCyclic(sf) {
    const cached = this.getCachedResult(sf);
    if (cached !== null) {
      return cached;
    }
    if (sf === this.from) {
      return true;
    }
    this.markAcyclic(sf);
    const imports = this.importGraph.importsOf(sf);
    for (const imported of imports) {
      if (this.wouldBeCyclic(imported)) {
        this.markCyclic(sf);
        return true;
      }
    }
    return false;
  }
  getCachedResult(sf) {
    const result = sf[NgCyclicResult];
    if (result === this.cyclic) {
      return true;
    } else if (result === this.acyclic) {
      return false;
    } else {
      return null;
    }
  }
  markCyclic(sf) {
    sf[NgCyclicResult] = this.cyclic;
  }
  markAcyclic(sf) {
    sf[NgCyclicResult] = this.acyclic;
  }
};
var Cycle = class {
  constructor(importGraph, from, to) {
    this.importGraph = importGraph;
    this.from = from;
    this.to = to;
  }
  getPath() {
    return [this.from, ...this.importGraph.findPath(this.to, this.from)];
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/cycles/src/imports.mjs
import ts3 from "typescript";
var ImportGraph = class {
  constructor(checker, perf) {
    this.checker = checker;
    this.perf = perf;
    this.imports = /* @__PURE__ */ new Map();
  }
  importsOf(sf) {
    if (!this.imports.has(sf)) {
      this.imports.set(sf, this.scanImports(sf));
    }
    return this.imports.get(sf);
  }
  findPath(start, end) {
    if (start === end) {
      return [start];
    }
    const found = /* @__PURE__ */ new Set([start]);
    const queue = [new Found(start, null)];
    while (queue.length > 0) {
      const current = queue.shift();
      const imports = this.importsOf(current.sourceFile);
      for (const importedFile of imports) {
        if (!found.has(importedFile)) {
          const next = new Found(importedFile, current);
          if (next.sourceFile === end) {
            return next.toPath();
          }
          found.add(importedFile);
          queue.push(next);
        }
      }
    }
    return null;
  }
  addSyntheticImport(sf, imported) {
    if (isLocalFile(imported)) {
      this.importsOf(sf).add(imported);
    }
  }
  scanImports(sf) {
    return this.perf.inPhase(PerfPhase.CycleDetection, () => {
      const imports = /* @__PURE__ */ new Set();
      for (const stmt of sf.statements) {
        if (!ts3.isImportDeclaration(stmt) && !ts3.isExportDeclaration(stmt) || stmt.moduleSpecifier === void 0) {
          continue;
        }
        if (ts3.isImportDeclaration(stmt) && stmt.importClause !== void 0 && isTypeOnlyImportClause(stmt.importClause)) {
          continue;
        }
        const symbol = this.checker.getSymbolAtLocation(stmt.moduleSpecifier);
        if (symbol === void 0 || symbol.valueDeclaration === void 0) {
          continue;
        }
        const moduleFile = symbol.valueDeclaration;
        if (ts3.isSourceFile(moduleFile) && isLocalFile(moduleFile)) {
          imports.add(moduleFile);
        }
      }
      return imports;
    });
  }
};
function isLocalFile(sf) {
  return !sf.isDeclarationFile;
}
function isTypeOnlyImportClause(node) {
  if (node.isTypeOnly) {
    return true;
  }
  if (node.namedBindings !== void 0 && ts3.isNamedImports(node.namedBindings) && node.namedBindings.elements.every((specifier) => specifier.isTypeOnly)) {
    return true;
  }
  return false;
}
var Found = class {
  constructor(sourceFile, parent) {
    this.sourceFile = sourceFile;
    this.parent = parent;
  }
  toPath() {
    const array = [];
    let current = this;
    while (current !== null) {
      array.push(current.sourceFile);
      current = current.parent;
    }
    return array.reverse();
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/entry_point/src/generator.mjs
import ts4 from "typescript";
var FlatIndexGenerator = class {
  constructor(entryPoint, relativeFlatIndexPath, moduleName) {
    this.entryPoint = entryPoint;
    this.moduleName = moduleName;
    this.shouldEmit = true;
    this.flatIndexPath = join(dirname(entryPoint), relativeFlatIndexPath).replace(/\.js$/, "") + ".ts";
  }
  makeTopLevelShim() {
    const relativeEntryPoint = relativePathBetween(this.flatIndexPath, this.entryPoint);
    const contents = `/**
 * Generated bundle index. Do not edit.
 */

export * from '${relativeEntryPoint}';
`;
    const genFile = ts4.createSourceFile(this.flatIndexPath, contents, ts4.ScriptTarget.ES2015, true, ts4.ScriptKind.TS);
    if (this.moduleName !== null) {
      genFile.moduleName = this.moduleName;
    }
    return genFile;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/entry_point/src/logic.mjs
function findFlatIndexEntryPoint(rootFiles) {
  const tsFiles = rootFiles.filter((file) => isNonDeclarationTsPath(file));
  let resolvedEntryPoint = null;
  if (tsFiles.length === 1) {
    resolvedEntryPoint = tsFiles[0];
  } else {
    for (const tsFile of tsFiles) {
      if (getFileSystem().basename(tsFile) === "index.ts" && (resolvedEntryPoint === null || tsFile.length <= resolvedEntryPoint.length)) {
        resolvedEntryPoint = tsFile;
      }
    }
  }
  return resolvedEntryPoint;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/entry_point/src/private_export_checker.mjs
import ts5 from "typescript";
function checkForPrivateExports(entryPoint, checker, refGraph) {
  const diagnostics = [];
  const topLevelExports = /* @__PURE__ */ new Set();
  const moduleSymbol = checker.getSymbolAtLocation(entryPoint);
  if (moduleSymbol === void 0) {
    throw new Error(`Internal error: failed to get symbol for entrypoint`);
  }
  const exportedSymbols = checker.getExportsOfModule(moduleSymbol);
  exportedSymbols.forEach((symbol) => {
    if (symbol.flags & ts5.SymbolFlags.Alias) {
      symbol = checker.getAliasedSymbol(symbol);
    }
    const decl = symbol.valueDeclaration;
    if (decl !== void 0) {
      topLevelExports.add(decl);
    }
  });
  const checkedSet = /* @__PURE__ */ new Set();
  topLevelExports.forEach((mainExport) => {
    refGraph.transitiveReferencesOf(mainExport).forEach((transitiveReference) => {
      if (checkedSet.has(transitiveReference)) {
        return;
      }
      checkedSet.add(transitiveReference);
      if (!topLevelExports.has(transitiveReference)) {
        const descriptor = getDescriptorOfDeclaration(transitiveReference);
        const name = getNameOfDeclaration(transitiveReference);
        let visibleVia = "NgModule exports";
        const transitivePath = refGraph.pathFrom(mainExport, transitiveReference);
        if (transitivePath !== null) {
          visibleVia = transitivePath.map((seg) => getNameOfDeclaration(seg)).join(" -> ");
        }
        const diagnostic = __spreadProps(__spreadValues({
          category: ts5.DiagnosticCategory.Error,
          code: ngErrorCode(ErrorCode.SYMBOL_NOT_EXPORTED),
          file: transitiveReference.getSourceFile()
        }, getPosOfDeclaration(transitiveReference)), {
          messageText: `Unsupported private ${descriptor} ${name}. This ${descriptor} is visible to consumers via ${visibleVia}, but is not exported from the top-level library entrypoint.`
        });
        diagnostics.push(diagnostic);
      }
    });
  });
  return diagnostics;
}
function getPosOfDeclaration(decl) {
  const node = getIdentifierOfDeclaration(decl) || decl;
  return {
    start: node.getStart(),
    length: node.getEnd() + 1 - node.getStart()
  };
}
function getIdentifierOfDeclaration(decl) {
  if ((ts5.isClassDeclaration(decl) || ts5.isVariableDeclaration(decl) || ts5.isFunctionDeclaration(decl)) && decl.name !== void 0 && ts5.isIdentifier(decl.name)) {
    return decl.name;
  } else {
    return null;
  }
}
function getNameOfDeclaration(decl) {
  const id = getIdentifierOfDeclaration(decl);
  return id !== null ? id.text : "(unnamed)";
}
function getDescriptorOfDeclaration(decl) {
  switch (decl.kind) {
    case ts5.SyntaxKind.ClassDeclaration:
      return "class";
    case ts5.SyntaxKind.FunctionDeclaration:
      return "function";
    case ts5.SyntaxKind.VariableDeclaration:
      return "variable";
    case ts5.SyntaxKind.EnumDeclaration:
      return "enum";
    default:
      return "declaration";
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/entry_point/src/reference_graph.mjs
var ReferenceGraph = class {
  constructor() {
    this.references = /* @__PURE__ */ new Map();
  }
  add(from, to) {
    if (!this.references.has(from)) {
      this.references.set(from, /* @__PURE__ */ new Set());
    }
    this.references.get(from).add(to);
  }
  transitiveReferencesOf(target) {
    const set = /* @__PURE__ */ new Set();
    this.collectTransitiveReferences(set, target);
    return set;
  }
  pathFrom(source, target) {
    return this.collectPathFrom(source, target, /* @__PURE__ */ new Set());
  }
  collectPathFrom(source, target, seen) {
    if (source === target) {
      return [target];
    } else if (seen.has(source)) {
      return null;
    }
    seen.add(source);
    if (!this.references.has(source)) {
      return null;
    } else {
      let candidatePath = null;
      this.references.get(source).forEach((edge) => {
        if (candidatePath !== null) {
          return;
        }
        const partialPath = this.collectPathFrom(edge, target, seen);
        if (partialPath !== null) {
          candidatePath = [source, ...partialPath];
        }
      });
      return candidatePath;
    }
  }
  collectTransitiveReferences(set, decl) {
    if (this.references.has(decl)) {
      this.references.get(decl).forEach((ref) => {
        if (!set.has(ref)) {
          set.add(ref);
          this.collectTransitiveReferences(set, ref);
        }
      });
    }
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/program_driver/src/api.mjs
var NgOriginalFile = Symbol("NgOriginalFile");
var UpdateMode;
(function(UpdateMode2) {
  UpdateMode2[UpdateMode2["Complete"] = 0] = "Complete";
  UpdateMode2[UpdateMode2["Incremental"] = 1] = "Incremental";
})(UpdateMode || (UpdateMode = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/program_driver/src/ts_create_program_driver.mjs
import ts9 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/adapter.mjs
import ts6 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/expando.mjs
var NgExtension = Symbol("NgExtension");
function isExtended(sf) {
  return sf[NgExtension] !== void 0;
}
function sfExtensionData(sf) {
  const extSf = sf;
  if (extSf[NgExtension] !== void 0) {
    return extSf[NgExtension];
  }
  const extension = {
    isTopLevelShim: false,
    fileShim: null,
    originalReferencedFiles: null,
    taggedReferenceFiles: null
  };
  extSf[NgExtension] = extension;
  return extension;
}
function isFileShimSourceFile(sf) {
  return isExtended(sf) && sf[NgExtension].fileShim !== null;
}
function isShim(sf) {
  return isExtended(sf) && (sf[NgExtension].fileShim !== null || sf[NgExtension].isTopLevelShim);
}
function copyFileShimData(from, to) {
  if (!isFileShimSourceFile(from)) {
    return;
  }
  sfExtensionData(to).fileShim = sfExtensionData(from).fileShim;
}
function untagAllTsFiles(program) {
  for (const sf of program.getSourceFiles()) {
    untagTsFile(sf);
  }
}
function retagAllTsFiles(program) {
  for (const sf of program.getSourceFiles()) {
    retagTsFile(sf);
  }
}
function untagTsFile(sf) {
  if (sf.isDeclarationFile || !isExtended(sf)) {
    return;
  }
  const ext = sfExtensionData(sf);
  if (ext.originalReferencedFiles !== null) {
    sf.referencedFiles = ext.originalReferencedFiles;
  }
}
function retagTsFile(sf) {
  if (sf.isDeclarationFile || !isExtended(sf)) {
    return;
  }
  const ext = sfExtensionData(sf);
  if (ext.taggedReferenceFiles !== null) {
    sf.referencedFiles = ext.taggedReferenceFiles;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/util.mjs
var TS_EXTENSIONS = /\.tsx?$/i;
function makeShimFileName(fileName, suffix) {
  return absoluteFrom(fileName.replace(TS_EXTENSIONS, suffix));
}
function generatedModuleName(originalModuleName, originalFileName, genSuffix) {
  let moduleName;
  if (originalFileName.endsWith("/index.ts")) {
    moduleName = originalModuleName + "/index" + genSuffix;
  } else {
    moduleName = originalModuleName + genSuffix;
  }
  return moduleName;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/adapter.mjs
var ShimAdapter = class {
  constructor(delegate, tsRootFiles, topLevelGenerators, perFileGenerators, oldProgram) {
    this.delegate = delegate;
    this.shims = /* @__PURE__ */ new Map();
    this.priorShims = /* @__PURE__ */ new Map();
    this.notShims = /* @__PURE__ */ new Set();
    this.generators = [];
    this.ignoreForEmit = /* @__PURE__ */ new Set();
    this.extensionPrefixes = [];
    for (const gen of perFileGenerators) {
      const pattern = `^(.*)\\.${gen.extensionPrefix}\\.ts$`;
      const regexp = new RegExp(pattern, "i");
      this.generators.push({
        generator: gen,
        test: regexp,
        suffix: `.${gen.extensionPrefix}.ts`
      });
      this.extensionPrefixes.push(gen.extensionPrefix);
    }
    const extraInputFiles = [];
    for (const gen of topLevelGenerators) {
      const sf = gen.makeTopLevelShim();
      sfExtensionData(sf).isTopLevelShim = true;
      if (!gen.shouldEmit) {
        this.ignoreForEmit.add(sf);
      }
      const fileName = absoluteFromSourceFile(sf);
      this.shims.set(fileName, sf);
      extraInputFiles.push(fileName);
    }
    for (const rootFile of tsRootFiles) {
      for (const gen of this.generators) {
        extraInputFiles.push(makeShimFileName(rootFile, gen.suffix));
      }
    }
    this.extraInputFiles = extraInputFiles;
    if (oldProgram !== null) {
      for (const oldSf of oldProgram.getSourceFiles()) {
        if (oldSf.isDeclarationFile || !isFileShimSourceFile(oldSf)) {
          continue;
        }
        this.priorShims.set(absoluteFromSourceFile(oldSf), oldSf);
      }
    }
  }
  maybeGenerate(fileName) {
    if (this.notShims.has(fileName)) {
      return null;
    } else if (this.shims.has(fileName)) {
      return this.shims.get(fileName);
    }
    if (isDtsPath(fileName)) {
      this.notShims.add(fileName);
      return null;
    }
    for (const record of this.generators) {
      const match = record.test.exec(fileName);
      if (match === null) {
        continue;
      }
      const prefix = match[1];
      let baseFileName = absoluteFrom(prefix + ".ts");
      if (!this.delegate.fileExists(baseFileName)) {
        baseFileName = absoluteFrom(prefix + ".tsx");
        if (!this.delegate.fileExists(baseFileName)) {
          return void 0;
        }
      }
      const inputFile = this.delegate.getSourceFile(baseFileName, ts6.ScriptTarget.Latest);
      if (inputFile === void 0 || isShim(inputFile)) {
        return void 0;
      }
      return this.generateSpecific(fileName, record.generator, inputFile);
    }
    this.notShims.add(fileName);
    return null;
  }
  generateSpecific(fileName, generator, inputFile) {
    let priorShimSf = null;
    if (this.priorShims.has(fileName)) {
      priorShimSf = this.priorShims.get(fileName);
      this.priorShims.delete(fileName);
    }
    const shimSf = generator.generateShimForFile(inputFile, fileName, priorShimSf);
    sfExtensionData(shimSf).fileShim = {
      extension: generator.extensionPrefix,
      generatedFrom: absoluteFromSourceFile(inputFile)
    };
    if (!generator.shouldEmit) {
      this.ignoreForEmit.add(shimSf);
    }
    this.shims.set(fileName, shimSf);
    return shimSf;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/factory_generator.mjs
import ts7 from "typescript";
var TS_DTS_SUFFIX = /(\.d)?\.ts$/;
var STRIP_NG_FACTORY = /(.*)NgFactory$/;
var FactoryGenerator = class {
  constructor() {
    this.sourceInfo = /* @__PURE__ */ new Map();
    this.sourceToFactorySymbols = /* @__PURE__ */ new Map();
    this.shouldEmit = true;
    this.extensionPrefix = "ngfactory";
  }
  generateShimForFile(sf, genFilePath) {
    const absoluteSfPath = absoluteFromSourceFile(sf);
    const relativePathToSource = "./" + basename(sf.fileName).replace(TS_DTS_SUFFIX, "");
    const symbolNames = sf.statements.filter(ts7.isClassDeclaration).filter((decl) => isExported(decl) && decl.decorators !== void 0 && decl.name !== void 0).map((decl) => decl.name.text);
    let sourceText = "";
    const leadingComment = getFileoverviewComment(sf);
    if (leadingComment !== null) {
      sourceText = leadingComment + "\n\n";
    }
    if (symbolNames.length > 0) {
      const varLines = symbolNames.map((name) => `export const ${name}NgFactory: i0.\u0275NgModuleFactory<any> = new i0.\u0275NgModuleFactory(${name});`);
      sourceText += [
        `import * as i0 from '@angular/core';`,
        `import {${symbolNames.join(", ")}} from '${relativePathToSource}';`,
        ...varLines
      ].join("\n");
    }
    sourceText += "\nexport const \u0275NonEmptyModule = true;";
    const genFile = ts7.createSourceFile(genFilePath, sourceText, sf.languageVersion, true, ts7.ScriptKind.TS);
    if (sf.moduleName !== void 0) {
      genFile.moduleName = generatedModuleName(sf.moduleName, sf.fileName, ".ngfactory");
    }
    const moduleSymbols = /* @__PURE__ */ new Map();
    this.sourceToFactorySymbols.set(absoluteSfPath, moduleSymbols);
    this.sourceInfo.set(genFilePath, {
      sourceFilePath: absoluteSfPath,
      moduleSymbols
    });
    return genFile;
  }
  track(sf, moduleInfo) {
    if (this.sourceToFactorySymbols.has(sf.fileName)) {
      this.sourceToFactorySymbols.get(sf.fileName).set(moduleInfo.name, moduleInfo);
    }
  }
};
function isExported(decl) {
  return decl.modifiers !== void 0 && decl.modifiers.some((mod) => mod.kind == ts7.SyntaxKind.ExportKeyword);
}
function generatedFactoryTransform(factoryMap, importRewriter) {
  return (context) => {
    return (file) => {
      return transformFactorySourceFile(factoryMap, context, importRewriter, file);
    };
  };
}
function transformFactorySourceFile(factoryMap, context, importRewriter, file) {
  if (!factoryMap.has(file.fileName)) {
    return file;
  }
  const { moduleSymbols, sourceFilePath } = factoryMap.get(file.fileName);
  const transformedStatements = [];
  let nonEmptyExport = null;
  const coreImportIdentifiers = /* @__PURE__ */ new Set();
  for (const stmt of file.statements) {
    if (ts7.isImportDeclaration(stmt) && ts7.isStringLiteral(stmt.moduleSpecifier) && stmt.moduleSpecifier.text === "@angular/core") {
      const rewrittenModuleSpecifier = importRewriter.rewriteSpecifier("@angular/core", sourceFilePath);
      if (rewrittenModuleSpecifier !== stmt.moduleSpecifier.text) {
        transformedStatements.push(ts7.updateImportDeclaration(stmt, stmt.decorators, stmt.modifiers, stmt.importClause, ts7.createStringLiteral(rewrittenModuleSpecifier), void 0));
        if (stmt.importClause !== void 0 && stmt.importClause.namedBindings !== void 0 && ts7.isNamespaceImport(stmt.importClause.namedBindings)) {
          coreImportIdentifiers.add(stmt.importClause.namedBindings.name.text);
        }
      } else {
        transformedStatements.push(stmt);
      }
    } else if (ts7.isVariableStatement(stmt) && stmt.declarationList.declarations.length === 1) {
      const decl = stmt.declarationList.declarations[0];
      if (ts7.isIdentifier(decl.name)) {
        if (decl.name.text === "\u0275NonEmptyModule") {
          nonEmptyExport = stmt;
          continue;
        }
        const match = STRIP_NG_FACTORY.exec(decl.name.text);
        const module = match ? moduleSymbols.get(match[1]) : null;
        if (module) {
          const moduleIsTreeShakable = !module.hasId;
          const newStmt = !moduleIsTreeShakable ? stmt : updateInitializers(stmt, (init) => init ? wrapInNoSideEffects(init) : void 0);
          transformedStatements.push(newStmt);
        }
      } else {
        transformedStatements.push(stmt);
      }
    } else {
      transformedStatements.push(stmt);
    }
  }
  if (!transformedStatements.some(ts7.isVariableStatement) && nonEmptyExport !== null) {
    transformedStatements.push(nonEmptyExport);
  }
  file = ts7.updateSourceFileNode(file, transformedStatements);
  if (coreImportIdentifiers.size > 0) {
    const visit = (node) => {
      node = ts7.visitEachChild(node, (child) => visit(child), context);
      if (ts7.isPropertyAccessExpression(node) && ts7.isIdentifier(node.expression) && coreImportIdentifiers.has(node.expression.text)) {
        const rewrittenSymbol = importRewriter.rewriteSymbol(node.name.text, "@angular/core");
        if (rewrittenSymbol !== node.name.text) {
          const updated = ts7.updatePropertyAccess(node, node.expression, ts7.createIdentifier(rewrittenSymbol));
          node = updated;
        }
      }
      return node;
    };
    file = visit(file);
  }
  return file;
}
function getFileoverviewComment(sourceFile) {
  const text = sourceFile.getFullText();
  const trivia = text.substring(0, sourceFile.getStart());
  const leadingComments = ts7.getLeadingCommentRanges(trivia, 0);
  if (!leadingComments || leadingComments.length === 0) {
    return null;
  }
  const comment = leadingComments[0];
  if (comment.kind !== ts7.SyntaxKind.MultiLineCommentTrivia) {
    return null;
  }
  if (text.substring(comment.end, comment.end + 2) !== "\n\n") {
    return null;
  }
  const commentText = text.substring(comment.pos, comment.end);
  if (commentText.indexOf("@license") !== -1) {
    return null;
  }
  return commentText;
}
function wrapInNoSideEffects(expr) {
  const noSideEffects = ts7.createPropertyAccess(ts7.createIdentifier("i0"), "\u0275noSideEffects");
  return ts7.createCall(noSideEffects, [], [
    ts7.createFunctionExpression([], void 0, void 0, [], [], void 0, ts7.createBlock([
      ts7.createReturn(expr)
    ]))
  ]);
}
function updateInitializers(stmt, update) {
  return ts7.updateVariableStatement(stmt, stmt.modifiers, ts7.updateVariableDeclarationList(stmt.declarationList, stmt.declarationList.declarations.map((decl) => ts7.updateVariableDeclaration(decl, decl.name, decl.type, update(decl.initializer)))));
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/reference_tagger.mjs
var ShimReferenceTagger = class {
  constructor(shimExtensions) {
    this.tagged = /* @__PURE__ */ new Set();
    this.enabled = true;
    this.suffixes = shimExtensions.map((extension) => `.${extension}.ts`);
  }
  tag(sf) {
    if (!this.enabled || sf.isDeclarationFile || isShim(sf) || this.tagged.has(sf) || !isNonDeclarationTsPath(sf.fileName)) {
      return;
    }
    const ext = sfExtensionData(sf);
    if (ext.originalReferencedFiles === null) {
      ext.originalReferencedFiles = sf.referencedFiles;
    }
    const referencedFiles = [...ext.originalReferencedFiles];
    const sfPath = absoluteFromSourceFile(sf);
    for (const suffix of this.suffixes) {
      referencedFiles.push({
        fileName: makeShimFileName(sfPath, suffix),
        pos: 0,
        end: 0
      });
    }
    ext.taggedReferenceFiles = referencedFiles;
    sf.referencedFiles = referencedFiles;
    this.tagged.add(sf);
  }
  finalize() {
    this.enabled = false;
    this.tagged.clear();
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/shims/src/summary_generator.mjs
import ts8 from "typescript";
var SummaryGenerator = class {
  constructor() {
    this.shouldEmit = true;
    this.extensionPrefix = "ngsummary";
  }
  generateShimForFile(sf, genFilePath) {
    const symbolNames = [];
    for (const stmt of sf.statements) {
      if (ts8.isClassDeclaration(stmt)) {
        if (!isExported2(stmt) || stmt.decorators === void 0 || stmt.name === void 0) {
          continue;
        }
        symbolNames.push(stmt.name.text);
      } else if (ts8.isExportDeclaration(stmt)) {
        if (stmt.exportClause === void 0 || stmt.moduleSpecifier !== void 0 || !ts8.isNamedExports(stmt.exportClause)) {
          continue;
        }
        for (const specifier of stmt.exportClause.elements) {
          symbolNames.push(specifier.name.text);
        }
      }
    }
    const varLines = symbolNames.map((name) => `export const ${name}NgSummary: any = null;`);
    if (varLines.length === 0) {
      varLines.push(`export const \u0275empty = null;`);
    }
    const sourceText = varLines.join("\n");
    const genFile = ts8.createSourceFile(genFilePath, sourceText, sf.languageVersion, true, ts8.ScriptKind.TS);
    if (sf.moduleName !== void 0) {
      genFile.moduleName = generatedModuleName(sf.moduleName, sf.fileName, ".ngsummary");
    }
    return genFile;
  }
};
function isExported2(decl) {
  return decl.modifiers !== void 0 && decl.modifiers.some((mod) => mod.kind == ts8.SyntaxKind.ExportKeyword);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/program_driver/src/ts_create_program_driver.mjs
var DelegatingCompilerHost = class {
  constructor(delegate) {
    this.delegate = delegate;
    this.createHash = this.delegateMethod("createHash");
    this.directoryExists = this.delegateMethod("directoryExists");
    this.getCancellationToken = this.delegateMethod("getCancellationToken");
    this.getCanonicalFileName = this.delegateMethod("getCanonicalFileName");
    this.getCurrentDirectory = this.delegateMethod("getCurrentDirectory");
    this.getDefaultLibFileName = this.delegateMethod("getDefaultLibFileName");
    this.getDefaultLibLocation = this.delegateMethod("getDefaultLibLocation");
    this.getDirectories = this.delegateMethod("getDirectories");
    this.getEnvironmentVariable = this.delegateMethod("getEnvironmentVariable");
    this.getNewLine = this.delegateMethod("getNewLine");
    this.getParsedCommandLine = this.delegateMethod("getParsedCommandLine");
    this.getSourceFileByPath = this.delegateMethod("getSourceFileByPath");
    this.readDirectory = this.delegateMethod("readDirectory");
    this.readFile = this.delegateMethod("readFile");
    this.realpath = this.delegateMethod("realpath");
    this.resolveModuleNames = this.delegateMethod("resolveModuleNames");
    this.resolveTypeReferenceDirectives = this.delegateMethod("resolveTypeReferenceDirectives");
    this.trace = this.delegateMethod("trace");
    this.useCaseSensitiveFileNames = this.delegateMethod("useCaseSensitiveFileNames");
    this.getModuleResolutionCache = this.delegateMethod("getModuleResolutionCache");
  }
  delegateMethod(name) {
    return this.delegate[name] !== void 0 ? this.delegate[name].bind(this.delegate) : void 0;
  }
};
var UpdatedProgramHost = class extends DelegatingCompilerHost {
  constructor(sfMap, originalProgram, delegate, shimExtensionPrefixes) {
    super(delegate);
    this.originalProgram = originalProgram;
    this.shimExtensionPrefixes = shimExtensionPrefixes;
    this.shimTagger = new ShimReferenceTagger(this.shimExtensionPrefixes);
    this.sfMap = sfMap;
  }
  getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
    let delegateSf = this.originalProgram.getSourceFile(fileName);
    if (delegateSf === void 0) {
      delegateSf = this.delegate.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    }
    if (delegateSf === void 0) {
      return void 0;
    }
    let sf;
    if (this.sfMap.has(fileName)) {
      sf = this.sfMap.get(fileName);
      copyFileShimData(delegateSf, sf);
    } else {
      sf = delegateSf;
    }
    sf = toUnredirectedSourceFile(sf);
    this.shimTagger.tag(sf);
    return sf;
  }
  postProgramCreationCleanup() {
    this.shimTagger.finalize();
  }
  writeFile() {
    throw new Error(`TypeCheckProgramHost should never write files`);
  }
  fileExists(fileName) {
    return this.sfMap.has(fileName) || this.delegate.fileExists(fileName);
  }
};
var TsCreateProgramDriver = class {
  constructor(originalProgram, originalHost, options, shimExtensionPrefixes) {
    this.originalProgram = originalProgram;
    this.originalHost = originalHost;
    this.options = options;
    this.shimExtensionPrefixes = shimExtensionPrefixes;
    this.sfMap = /* @__PURE__ */ new Map();
    this.program = this.originalProgram;
    this.supportsInlineOperations = true;
  }
  getProgram() {
    return this.program;
  }
  updateFiles(contents, updateMode) {
    if (contents.size === 0) {
      if (updateMode !== UpdateMode.Complete || this.sfMap.size === 0) {
        return;
      }
    }
    if (updateMode === UpdateMode.Complete) {
      this.sfMap.clear();
    }
    for (const [filePath, { newText, originalFile }] of contents.entries()) {
      const sf = ts9.createSourceFile(filePath, newText, ts9.ScriptTarget.Latest, true);
      if (originalFile !== null) {
        sf[NgOriginalFile] = originalFile;
      }
      this.sfMap.set(filePath, sf);
    }
    const host = new UpdatedProgramHost(this.sfMap, this.originalProgram, this.originalHost, this.shimExtensionPrefixes);
    const oldProgram = this.program;
    retagAllTsFiles(oldProgram);
    this.program = ts9.createProgram({
      host,
      rootNames: this.program.getRootFileNames(),
      options: this.options,
      oldProgram
    });
    host.postProgramCreationCleanup();
    untagAllTsFiles(this.program);
    untagAllTsFiles(oldProgram);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/src/dependency_tracking.mjs
var FileDependencyGraph = class {
  constructor() {
    this.nodes = /* @__PURE__ */ new Map();
  }
  addDependency(from, on) {
    this.nodeFor(from).dependsOn.add(absoluteFromSourceFile(on));
  }
  addResourceDependency(from, resource) {
    this.nodeFor(from).usesResources.add(resource);
  }
  recordDependencyAnalysisFailure(file) {
    this.nodeFor(file).failedAnalysis = true;
  }
  getResourceDependencies(from) {
    const node = this.nodes.get(from);
    return node ? [...node.usesResources] : [];
  }
  updateWithPhysicalChanges(previous, changedTsPaths, deletedTsPaths, changedResources) {
    const logicallyChanged = /* @__PURE__ */ new Set();
    for (const sf of previous.nodes.keys()) {
      const sfPath = absoluteFromSourceFile(sf);
      const node = previous.nodeFor(sf);
      if (isLogicallyChanged(sf, node, changedTsPaths, deletedTsPaths, changedResources)) {
        logicallyChanged.add(sfPath);
      } else if (!deletedTsPaths.has(sfPath)) {
        this.nodes.set(sf, {
          dependsOn: new Set(node.dependsOn),
          usesResources: new Set(node.usesResources),
          failedAnalysis: false
        });
      }
    }
    return logicallyChanged;
  }
  nodeFor(sf) {
    if (!this.nodes.has(sf)) {
      this.nodes.set(sf, {
        dependsOn: /* @__PURE__ */ new Set(),
        usesResources: /* @__PURE__ */ new Set(),
        failedAnalysis: false
      });
    }
    return this.nodes.get(sf);
  }
};
function isLogicallyChanged(sf, node, changedTsPaths, deletedTsPaths, changedResources) {
  if (node.failedAnalysis) {
    return true;
  }
  const sfPath = absoluteFromSourceFile(sf);
  if (changedTsPaths.has(sfPath) || deletedTsPaths.has(sfPath)) {
    return true;
  }
  for (const dep of node.dependsOn) {
    if (changedTsPaths.has(dep) || deletedTsPaths.has(dep)) {
      return true;
    }
  }
  for (const dep of node.usesResources) {
    if (changedResources.has(dep)) {
      return true;
    }
  }
  return false;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/src/state.mjs
var IncrementalStateKind;
(function(IncrementalStateKind2) {
  IncrementalStateKind2[IncrementalStateKind2["Fresh"] = 0] = "Fresh";
  IncrementalStateKind2[IncrementalStateKind2["Delta"] = 1] = "Delta";
  IncrementalStateKind2[IncrementalStateKind2["Analyzed"] = 2] = "Analyzed";
})(IncrementalStateKind || (IncrementalStateKind = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/src/incremental.mjs
var PhaseKind;
(function(PhaseKind2) {
  PhaseKind2[PhaseKind2["Analysis"] = 0] = "Analysis";
  PhaseKind2[PhaseKind2["TypeCheckAndEmit"] = 1] = "TypeCheckAndEmit";
})(PhaseKind || (PhaseKind = {}));
var IncrementalCompilation = class {
  constructor(state, depGraph, versions, step) {
    this.depGraph = depGraph;
    this.versions = versions;
    this.step = step;
    this._state = state;
    this.phase = {
      kind: PhaseKind.Analysis,
      semanticDepGraphUpdater: new SemanticDepGraphUpdater(step !== null ? step.priorState.semanticDepGraph : null)
    };
  }
  static fresh(program, versions) {
    const state = {
      kind: IncrementalStateKind.Fresh
    };
    return new IncrementalCompilation(state, new FileDependencyGraph(), versions, null);
  }
  static incremental(program, newVersions, oldProgram, oldState, modifiedResourceFiles, perf) {
    return perf.inPhase(PerfPhase.Reconciliation, () => {
      const physicallyChangedTsFiles = /* @__PURE__ */ new Set();
      const changedResourceFiles = new Set(modifiedResourceFiles != null ? modifiedResourceFiles : []);
      let priorAnalysis;
      switch (oldState.kind) {
        case IncrementalStateKind.Fresh:
          return IncrementalCompilation.fresh(program, newVersions);
        case IncrementalStateKind.Analyzed:
          priorAnalysis = oldState;
          break;
        case IncrementalStateKind.Delta:
          priorAnalysis = oldState.lastAnalyzedState;
          for (const sfPath of oldState.physicallyChangedTsFiles) {
            physicallyChangedTsFiles.add(sfPath);
          }
          for (const resourcePath of oldState.changedResourceFiles) {
            changedResourceFiles.add(resourcePath);
          }
          break;
      }
      const oldVersions = priorAnalysis.versions;
      const oldFilesArray = oldProgram.getSourceFiles().map(toOriginalSourceFile);
      const oldFiles = new Set(oldFilesArray);
      const deletedTsFiles = new Set(oldFilesArray.map((sf) => absoluteFromSourceFile(sf)));
      for (const possiblyRedirectedNewFile of program.getSourceFiles()) {
        const sf = toOriginalSourceFile(possiblyRedirectedNewFile);
        const sfPath = absoluteFromSourceFile(sf);
        deletedTsFiles.delete(sfPath);
        if (oldFiles.has(sf)) {
          if (oldVersions === null || newVersions === null) {
            continue;
          }
          if (oldVersions.has(sfPath) && newVersions.has(sfPath) && oldVersions.get(sfPath) === newVersions.get(sfPath)) {
            continue;
          }
        }
        if (sf.isDeclarationFile) {
          return IncrementalCompilation.fresh(program, newVersions);
        }
        physicallyChangedTsFiles.add(sfPath);
      }
      for (const deletedFileName of deletedTsFiles) {
        physicallyChangedTsFiles.delete(resolve(deletedFileName));
      }
      const depGraph = new FileDependencyGraph();
      const logicallyChangedTsFiles = depGraph.updateWithPhysicalChanges(priorAnalysis.depGraph, physicallyChangedTsFiles, deletedTsFiles, changedResourceFiles);
      for (const sfPath of physicallyChangedTsFiles) {
        logicallyChangedTsFiles.add(sfPath);
      }
      const state = {
        kind: IncrementalStateKind.Delta,
        physicallyChangedTsFiles,
        changedResourceFiles,
        lastAnalyzedState: priorAnalysis
      };
      return new IncrementalCompilation(state, depGraph, newVersions, {
        priorState: priorAnalysis,
        logicallyChangedTsFiles
      });
    });
  }
  get state() {
    return this._state;
  }
  get semanticDepGraphUpdater() {
    if (this.phase.kind !== PhaseKind.Analysis) {
      throw new Error(`AssertionError: Cannot update the SemanticDepGraph after analysis completes`);
    }
    return this.phase.semanticDepGraphUpdater;
  }
  recordSuccessfulAnalysis(traitCompiler) {
    if (this.phase.kind !== PhaseKind.Analysis) {
      throw new Error(`AssertionError: Incremental compilation in phase ${PhaseKind[this.phase.kind]}, expected Analysis`);
    }
    const { needsEmit, needsTypeCheckEmit, newGraph } = this.phase.semanticDepGraphUpdater.finalize();
    let emitted;
    if (this.step === null) {
      emitted = /* @__PURE__ */ new Set();
    } else {
      emitted = new Set(this.step.priorState.emitted);
      for (const sfPath of this.step.logicallyChangedTsFiles) {
        emitted.delete(sfPath);
      }
      for (const sfPath of needsEmit) {
        emitted.delete(sfPath);
      }
    }
    this._state = {
      kind: IncrementalStateKind.Analyzed,
      versions: this.versions,
      depGraph: this.depGraph,
      semanticDepGraph: newGraph,
      priorAnalysis: traitCompiler.getAnalyzedRecords(),
      typeCheckResults: null,
      emitted
    };
    this.phase = {
      kind: PhaseKind.TypeCheckAndEmit,
      needsEmit,
      needsTypeCheckEmit
    };
  }
  recordSuccessfulTypeCheck(results) {
    if (this._state.kind !== IncrementalStateKind.Analyzed) {
      throw new Error(`AssertionError: Expected successfully analyzed compilation.`);
    } else if (this.phase.kind !== PhaseKind.TypeCheckAndEmit) {
      throw new Error(`AssertionError: Incremental compilation in phase ${PhaseKind[this.phase.kind]}, expected TypeCheck`);
    }
    this._state.typeCheckResults = results;
  }
  recordSuccessfulEmit(sf) {
    if (this._state.kind !== IncrementalStateKind.Analyzed) {
      throw new Error(`AssertionError: Expected successfully analyzed compilation.`);
    }
    this._state.emitted.add(absoluteFromSourceFile(sf));
  }
  priorAnalysisFor(sf) {
    if (this.step === null) {
      return null;
    }
    const sfPath = absoluteFromSourceFile(sf);
    if (this.step.logicallyChangedTsFiles.has(sfPath)) {
      return null;
    }
    const priorAnalysis = this.step.priorState.priorAnalysis;
    if (!priorAnalysis.has(sf)) {
      return null;
    }
    return priorAnalysis.get(sf);
  }
  priorTypeCheckingResultsFor(sf) {
    if (this.phase.kind !== PhaseKind.TypeCheckAndEmit) {
      throw new Error(`AssertionError: Expected successfully analyzed compilation.`);
    }
    if (this.step === null) {
      return null;
    }
    const sfPath = absoluteFromSourceFile(sf);
    if (this.step.logicallyChangedTsFiles.has(sfPath) || this.phase.needsTypeCheckEmit.has(sfPath)) {
      return null;
    }
    if (this.step.priorState.typeCheckResults === null || !this.step.priorState.typeCheckResults.has(sfPath)) {
      return null;
    }
    const priorResults = this.step.priorState.typeCheckResults.get(sfPath);
    if (priorResults.hasInlines) {
      return null;
    }
    return priorResults;
  }
  safeToSkipEmit(sf) {
    if (this.step === null) {
      return false;
    }
    const sfPath = absoluteFromSourceFile(sf);
    if (this.step.logicallyChangedTsFiles.has(sfPath)) {
      return false;
    }
    if (this.phase.kind !== PhaseKind.TypeCheckAndEmit) {
      throw new Error(`AssertionError: Expected successful analysis before attempting to emit files`);
    }
    if (this.phase.needsEmit.has(sfPath)) {
      return false;
    }
    return this.step.priorState.emitted.has(sfPath);
  }
};
function toOriginalSourceFile(sf) {
  const unredirectedSf = toUnredirectedSourceFile(sf);
  const originalFile = unredirectedSf[NgOriginalFile];
  if (originalFile !== void 0) {
    return originalFile;
  } else {
    return unredirectedSf;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/src/strategy.mjs
var TrackedIncrementalBuildStrategy = class {
  constructor() {
    this.state = null;
    this.isSet = false;
  }
  getIncrementalState() {
    return this.state;
  }
  setIncrementalState(state) {
    this.state = state;
    this.isSet = true;
  }
  toNextBuildStrategy() {
    const strategy = new TrackedIncrementalBuildStrategy();
    strategy.state = this.isSet ? this.state : null;
    return strategy;
  }
};
var PatchedProgramIncrementalBuildStrategy = class {
  getIncrementalState(program) {
    const state = program[SYM_INCREMENTAL_STATE];
    if (state === void 0) {
      return null;
    }
    return state;
  }
  setIncrementalState(state, program) {
    program[SYM_INCREMENTAL_STATE] = state;
  }
  toNextBuildStrategy() {
    return this;
  }
};
var SYM_INCREMENTAL_STATE = Symbol("NgIncrementalState");

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/indexer/src/api.mjs
var IdentifierKind;
(function(IdentifierKind2) {
  IdentifierKind2[IdentifierKind2["Property"] = 0] = "Property";
  IdentifierKind2[IdentifierKind2["Method"] = 1] = "Method";
  IdentifierKind2[IdentifierKind2["Element"] = 2] = "Element";
  IdentifierKind2[IdentifierKind2["Template"] = 3] = "Template";
  IdentifierKind2[IdentifierKind2["Attribute"] = 4] = "Attribute";
  IdentifierKind2[IdentifierKind2["Reference"] = 5] = "Reference";
  IdentifierKind2[IdentifierKind2["Variable"] = 6] = "Variable";
})(IdentifierKind || (IdentifierKind = {}));
var AbsoluteSourceSpan = class {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/indexer/src/context.mjs
var IndexingContext = class {
  constructor() {
    this.components = /* @__PURE__ */ new Set();
  }
  addComponent(info) {
    this.components.add(info);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/indexer/src/transform.mjs
import { ParseSourceFile } from "@angular/compiler";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/indexer/src/template.mjs
import { ASTWithSource, ImplicitReceiver, PropertyRead, PropertyWrite, RecursiveAstVisitor, TmplAstElement, TmplAstRecursiveVisitor, TmplAstReference, TmplAstTemplate } from "@angular/compiler";
var ExpressionVisitor = class extends RecursiveAstVisitor {
  constructor(expressionStr, absoluteOffset, boundTemplate, targetToIdentifier) {
    super();
    this.expressionStr = expressionStr;
    this.absoluteOffset = absoluteOffset;
    this.boundTemplate = boundTemplate;
    this.targetToIdentifier = targetToIdentifier;
    this.identifiers = [];
    this.errors = [];
  }
  static getIdentifiers(ast, source, absoluteOffset, boundTemplate, targetToIdentifier) {
    const visitor = new ExpressionVisitor(source, absoluteOffset, boundTemplate, targetToIdentifier);
    visitor.visit(ast);
    return { identifiers: visitor.identifiers, errors: visitor.errors };
  }
  visit(ast) {
    ast.visit(this);
  }
  visitPropertyRead(ast, context) {
    this.visitIdentifier(ast, IdentifierKind.Property);
    super.visitPropertyRead(ast, context);
  }
  visitPropertyWrite(ast, context) {
    this.visitIdentifier(ast, IdentifierKind.Property);
    super.visitPropertyWrite(ast, context);
  }
  visitIdentifier(ast, kind) {
    if (!(ast.receiver instanceof ImplicitReceiver)) {
      return;
    }
    let identifierStart = ast.sourceSpan.start - this.absoluteOffset;
    if (ast instanceof PropertyRead || ast instanceof PropertyWrite) {
      identifierStart = ast.nameSpan.start - this.absoluteOffset;
    }
    if (!this.expressionStr.substring(identifierStart).startsWith(ast.name)) {
      this.errors.push(new Error(`Impossible state: "${ast.name}" not found in "${this.expressionStr}" at location ${identifierStart}`));
      return;
    }
    const absoluteStart = this.absoluteOffset + identifierStart;
    const span = new AbsoluteSourceSpan(absoluteStart, absoluteStart + ast.name.length);
    const targetAst = this.boundTemplate.getExpressionTarget(ast);
    const target = targetAst ? this.targetToIdentifier(targetAst) : null;
    const identifier = {
      name: ast.name,
      span,
      kind,
      target
    };
    this.identifiers.push(identifier);
  }
};
var TemplateVisitor = class extends TmplAstRecursiveVisitor {
  constructor(boundTemplate) {
    super();
    this.boundTemplate = boundTemplate;
    this.identifiers = /* @__PURE__ */ new Set();
    this.errors = [];
    this.targetIdentifierCache = /* @__PURE__ */ new Map();
    this.elementAndTemplateIdentifierCache = /* @__PURE__ */ new Map();
  }
  visit(node) {
    node.visit(this);
  }
  visitAll(nodes) {
    nodes.forEach((node) => this.visit(node));
  }
  visitElement(element) {
    const elementIdentifier = this.elementOrTemplateToIdentifier(element);
    if (elementIdentifier !== null) {
      this.identifiers.add(elementIdentifier);
    }
    this.visitAll(element.references);
    this.visitAll(element.inputs);
    this.visitAll(element.attributes);
    this.visitAll(element.children);
    this.visitAll(element.outputs);
  }
  visitTemplate(template) {
    const templateIdentifier = this.elementOrTemplateToIdentifier(template);
    if (templateIdentifier !== null) {
      this.identifiers.add(templateIdentifier);
    }
    this.visitAll(template.variables);
    this.visitAll(template.attributes);
    this.visitAll(template.templateAttrs);
    this.visitAll(template.children);
    this.visitAll(template.references);
  }
  visitBoundAttribute(attribute) {
    if (attribute.valueSpan === void 0) {
      return;
    }
    const { identifiers, errors } = ExpressionVisitor.getIdentifiers(attribute.value, attribute.valueSpan.toString(), attribute.valueSpan.start.offset, this.boundTemplate, this.targetToIdentifier.bind(this));
    identifiers.forEach((id) => this.identifiers.add(id));
    this.errors.push(...errors);
  }
  visitBoundEvent(attribute) {
    this.visitExpression(attribute.handler);
  }
  visitBoundText(text) {
    this.visitExpression(text.value);
  }
  visitReference(reference) {
    const referenceIdentifer = this.targetToIdentifier(reference);
    if (referenceIdentifer === null) {
      return;
    }
    this.identifiers.add(referenceIdentifer);
  }
  visitVariable(variable) {
    const variableIdentifier = this.targetToIdentifier(variable);
    if (variableIdentifier === null) {
      return;
    }
    this.identifiers.add(variableIdentifier);
  }
  elementOrTemplateToIdentifier(node) {
    var _a;
    if (this.elementAndTemplateIdentifierCache.has(node)) {
      return this.elementAndTemplateIdentifierCache.get(node);
    }
    let name;
    let kind;
    if (node instanceof TmplAstTemplate) {
      name = (_a = node.tagName) != null ? _a : "ng-template";
      kind = IdentifierKind.Template;
    } else {
      name = node.name;
      kind = IdentifierKind.Element;
    }
    if (name.startsWith(":")) {
      name = name.split(":").pop();
    }
    const sourceSpan = node.startSourceSpan;
    const start = this.getStartLocation(name, sourceSpan);
    if (start === null) {
      return null;
    }
    const absoluteSpan = new AbsoluteSourceSpan(start, start + name.length);
    const attributes = node.attributes.map(({ name: name2, sourceSpan: sourceSpan2 }) => {
      return {
        name: name2,
        span: new AbsoluteSourceSpan(sourceSpan2.start.offset, sourceSpan2.end.offset),
        kind: IdentifierKind.Attribute
      };
    });
    const usedDirectives = this.boundTemplate.getDirectivesOfNode(node) || [];
    const identifier = {
      name,
      span: absoluteSpan,
      kind,
      attributes: new Set(attributes),
      usedDirectives: new Set(usedDirectives.map((dir) => {
        return {
          node: dir.ref.node,
          selector: dir.selector
        };
      }))
    };
    this.elementAndTemplateIdentifierCache.set(node, identifier);
    return identifier;
  }
  targetToIdentifier(node) {
    if (this.targetIdentifierCache.has(node)) {
      return this.targetIdentifierCache.get(node);
    }
    const { name, sourceSpan } = node;
    const start = this.getStartLocation(name, sourceSpan);
    if (start === null) {
      return null;
    }
    const span = new AbsoluteSourceSpan(start, start + name.length);
    let identifier;
    if (node instanceof TmplAstReference) {
      const refTarget = this.boundTemplate.getReferenceTarget(node);
      let target = null;
      if (refTarget) {
        let node2 = null;
        let directive = null;
        if (refTarget instanceof TmplAstElement || refTarget instanceof TmplAstTemplate) {
          node2 = this.elementOrTemplateToIdentifier(refTarget);
        } else {
          node2 = this.elementOrTemplateToIdentifier(refTarget.node);
          directive = refTarget.directive.ref.node;
        }
        if (node2 === null) {
          return null;
        }
        target = {
          node: node2,
          directive
        };
      }
      identifier = {
        name,
        span,
        kind: IdentifierKind.Reference,
        target
      };
    } else {
      identifier = {
        name,
        span,
        kind: IdentifierKind.Variable
      };
    }
    this.targetIdentifierCache.set(node, identifier);
    return identifier;
  }
  getStartLocation(name, context) {
    const localStr = context.toString();
    if (!localStr.includes(name)) {
      this.errors.push(new Error(`Impossible state: "${name}" not found in "${localStr}"`));
      return null;
    }
    return context.start.offset + localStr.indexOf(name);
  }
  visitExpression(ast) {
    if (ast instanceof ASTWithSource && ast.source !== null) {
      const targetToIdentifier = this.targetToIdentifier.bind(this);
      const absoluteOffset = ast.sourceSpan.start;
      const { identifiers, errors } = ExpressionVisitor.getIdentifiers(ast, ast.source, absoluteOffset, this.boundTemplate, targetToIdentifier);
      identifiers.forEach((id) => this.identifiers.add(id));
      this.errors.push(...errors);
    }
  }
};
function getTemplateIdentifiers(boundTemplate) {
  const visitor = new TemplateVisitor(boundTemplate);
  if (boundTemplate.target.template !== void 0) {
    visitor.visitAll(boundTemplate.target.template);
  }
  return { identifiers: visitor.identifiers, errors: visitor.errors };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/indexer/src/transform.mjs
function generateAnalysis(context) {
  const analysis = /* @__PURE__ */ new Map();
  context.components.forEach(({ declaration, selector, boundTemplate, templateMeta }) => {
    const name = declaration.name.getText();
    const usedComponents = /* @__PURE__ */ new Set();
    const usedDirs = boundTemplate.getUsedDirectives();
    usedDirs.forEach((dir) => {
      if (dir.isComponent) {
        usedComponents.add(dir.ref.node);
      }
    });
    const componentFile = new ParseSourceFile(declaration.getSourceFile().getFullText(), declaration.getSourceFile().fileName);
    let templateFile;
    if (templateMeta.isInline) {
      templateFile = componentFile;
    } else {
      templateFile = templateMeta.file;
    }
    const { identifiers, errors } = getTemplateIdentifiers(boundTemplate);
    analysis.set(declaration, {
      name,
      selector,
      file: componentFile,
      template: {
        identifiers,
        usedComponents,
        isInline: templateMeta.isInline,
        file: templateFile
      },
      errors
    });
  });
  return analysis;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/resource/src/loader.mjs
import ts10 from "typescript";
var CSS_PREPROCESSOR_EXT = /(\.scss|\.sass|\.less|\.styl)$/;
var RESOURCE_MARKER = ".$ngresource$";
var RESOURCE_MARKER_TS = RESOURCE_MARKER + ".ts";
var AdapterResourceLoader = class {
  constructor(adapter, options) {
    this.adapter = adapter;
    this.options = options;
    this.cache = /* @__PURE__ */ new Map();
    this.fetching = /* @__PURE__ */ new Map();
    this.lookupResolutionHost = createLookupResolutionHost(this.adapter);
    this.canPreload = !!this.adapter.readResource;
    this.canPreprocess = !!this.adapter.transformResource;
  }
  resolve(url, fromFile) {
    let resolvedUrl = null;
    if (this.adapter.resourceNameToFileName) {
      resolvedUrl = this.adapter.resourceNameToFileName(url, fromFile, (url2, fromFile2) => this.fallbackResolve(url2, fromFile2));
    } else {
      resolvedUrl = this.fallbackResolve(url, fromFile);
    }
    if (resolvedUrl === null) {
      throw new Error(`HostResourceResolver: could not resolve ${url} in context of ${fromFile})`);
    }
    return resolvedUrl;
  }
  preload(resolvedUrl, context) {
    if (!this.adapter.readResource) {
      throw new Error("HostResourceLoader: the CompilerHost provided does not support pre-loading resources.");
    }
    if (this.cache.has(resolvedUrl)) {
      return void 0;
    } else if (this.fetching.has(resolvedUrl)) {
      return this.fetching.get(resolvedUrl);
    }
    let result = this.adapter.readResource(resolvedUrl);
    if (this.adapter.transformResource && context.type === "style") {
      const resourceContext = {
        type: "style",
        containingFile: context.containingFile,
        resourceFile: resolvedUrl
      };
      result = Promise.resolve(result).then(async (str) => {
        const transformResult = await this.adapter.transformResource(str, resourceContext);
        return transformResult === null ? str : transformResult.content;
      });
    }
    if (typeof result === "string") {
      this.cache.set(resolvedUrl, result);
      return void 0;
    } else {
      const fetchCompletion = result.then((str) => {
        this.fetching.delete(resolvedUrl);
        this.cache.set(resolvedUrl, str);
      });
      this.fetching.set(resolvedUrl, fetchCompletion);
      return fetchCompletion;
    }
  }
  async preprocessInline(data, context) {
    if (!this.adapter.transformResource || context.type !== "style") {
      return data;
    }
    const transformResult = await this.adapter.transformResource(data, { type: "style", containingFile: context.containingFile, resourceFile: null });
    if (transformResult === null) {
      return data;
    }
    return transformResult.content;
  }
  load(resolvedUrl) {
    if (this.cache.has(resolvedUrl)) {
      return this.cache.get(resolvedUrl);
    }
    const result = this.adapter.readResource ? this.adapter.readResource(resolvedUrl) : this.adapter.readFile(resolvedUrl);
    if (typeof result !== "string") {
      throw new Error(`HostResourceLoader: loader(${resolvedUrl}) returned a Promise`);
    }
    this.cache.set(resolvedUrl, result);
    return result;
  }
  invalidate() {
    this.cache.clear();
  }
  fallbackResolve(url, fromFile) {
    let candidateLocations;
    if (url.startsWith("/")) {
      candidateLocations = this.getRootedCandidateLocations(url);
    } else {
      if (!url.startsWith(".")) {
        url = `./${url}`;
      }
      candidateLocations = this.getResolvedCandidateLocations(url, fromFile);
    }
    for (const candidate of candidateLocations) {
      if (this.adapter.fileExists(candidate)) {
        return candidate;
      } else if (CSS_PREPROCESSOR_EXT.test(candidate)) {
        const cssFallbackUrl = candidate.replace(CSS_PREPROCESSOR_EXT, ".css");
        if (this.adapter.fileExists(cssFallbackUrl)) {
          return cssFallbackUrl;
        }
      }
    }
    return null;
  }
  getRootedCandidateLocations(url) {
    const segment = "." + url;
    return this.adapter.rootDirs.map((rootDir) => join(rootDir, segment));
  }
  getResolvedCandidateLocations(url, fromFile) {
    const failedLookup = ts10.resolveModuleName(url + RESOURCE_MARKER, fromFile, this.options, this.lookupResolutionHost);
    if (failedLookup.failedLookupLocations === void 0) {
      throw new Error(`Internal error: expected to find failedLookupLocations during resolution of resource '${url}' in context of ${fromFile}`);
    }
    return failedLookup.failedLookupLocations.filter((candidate) => candidate.endsWith(RESOURCE_MARKER_TS)).map((candidate) => candidate.slice(0, -RESOURCE_MARKER_TS.length));
  }
};
function createLookupResolutionHost(adapter) {
  var _a, _b, _c;
  return {
    directoryExists(directoryName) {
      if (directoryName.includes(RESOURCE_MARKER)) {
        return false;
      } else if (adapter.directoryExists !== void 0) {
        return adapter.directoryExists(directoryName);
      } else {
        return true;
      }
    },
    fileExists(fileName) {
      if (fileName.includes(RESOURCE_MARKER)) {
        return false;
      } else {
        return adapter.fileExists(fileName);
      }
    },
    readFile: adapter.readFile.bind(adapter),
    getCurrentDirectory: adapter.getCurrentDirectory.bind(adapter),
    getDirectories: (_a = adapter.getDirectories) == null ? void 0 : _a.bind(adapter),
    realpath: (_b = adapter.realpath) == null ? void 0 : _b.bind(adapter),
    trace: (_c = adapter.trace) == null ? void 0 : _c.bind(adapter),
    useCaseSensitiveFileNames: typeof adapter.useCaseSensitiveFileNames === "function" ? adapter.useCaseSensitiveFileNames.bind(adapter) : adapter.useCaseSensitiveFileNames
  };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/scope/src/dependency.mjs
var MetadataDtsModuleScopeResolver = class {
  constructor(dtsMetaReader, aliasingHost) {
    this.dtsMetaReader = dtsMetaReader;
    this.aliasingHost = aliasingHost;
    this.cache = /* @__PURE__ */ new Map();
  }
  resolve(ref) {
    const clazz = ref.node;
    const sourceFile = clazz.getSourceFile();
    if (!sourceFile.isDeclarationFile) {
      throw new Error(`Debug error: DtsModuleScopeResolver.read(${ref.debugName} from ${sourceFile.fileName}), but not a .d.ts file`);
    }
    if (this.cache.has(clazz)) {
      return this.cache.get(clazz);
    }
    const directives = [];
    const pipes = [];
    const ngModules = /* @__PURE__ */ new Set([clazz]);
    const meta = this.dtsMetaReader.getNgModuleMetadata(ref);
    if (meta === null) {
      this.cache.set(clazz, null);
      return null;
    }
    const declarations = /* @__PURE__ */ new Set();
    for (const declRef of meta.declarations) {
      declarations.add(declRef.node);
    }
    for (const exportRef of meta.exports) {
      const directive = this.dtsMetaReader.getDirectiveMetadata(exportRef);
      if (directive !== null) {
        const isReExport = !declarations.has(exportRef.node);
        directives.push(this.maybeAlias(directive, sourceFile, isReExport));
        continue;
      }
      const pipe = this.dtsMetaReader.getPipeMetadata(exportRef);
      if (pipe !== null) {
        const isReExport = !declarations.has(exportRef.node);
        pipes.push(this.maybeAlias(pipe, sourceFile, isReExport));
        continue;
      }
      const exportScope2 = this.resolve(exportRef);
      if (exportScope2 !== null) {
        if (this.aliasingHost === null) {
          directives.push(...exportScope2.exported.directives);
          pipes.push(...exportScope2.exported.pipes);
        } else {
          for (const directive2 of exportScope2.exported.directives) {
            directives.push(this.maybeAlias(directive2, sourceFile, true));
          }
          for (const pipe2 of exportScope2.exported.pipes) {
            pipes.push(this.maybeAlias(pipe2, sourceFile, true));
          }
          for (const ngModule of exportScope2.exported.ngModules) {
            ngModules.add(ngModule);
          }
        }
      }
      continue;
    }
    const exportScope = {
      exported: {
        directives,
        pipes,
        ngModules: Array.from(ngModules),
        isPoisoned: false
      }
    };
    this.cache.set(clazz, exportScope);
    return exportScope;
  }
  maybeAlias(dirOrPipe, maybeAliasFrom, isReExport) {
    const ref = dirOrPipe.ref;
    if (this.aliasingHost === null || ref.node.getSourceFile() === maybeAliasFrom) {
      return dirOrPipe;
    }
    const alias = this.aliasingHost.getAliasIn(ref.node, maybeAliasFrom, isReExport);
    if (alias === null) {
      return dirOrPipe;
    }
    return __spreadProps(__spreadValues({}, dirOrPipe), {
      ref: ref.cloneWithAlias(alias)
    });
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/scope/src/local.mjs
import { ExternalExpr } from "@angular/compiler";
import ts11 from "typescript";
var LocalModuleScopeRegistry = class {
  constructor(localReader, dependencyScopeReader, refEmitter, aliasingHost) {
    this.localReader = localReader;
    this.dependencyScopeReader = dependencyScopeReader;
    this.refEmitter = refEmitter;
    this.aliasingHost = aliasingHost;
    this.sealed = false;
    this.declarationToModule = /* @__PURE__ */ new Map();
    this.duplicateDeclarations = /* @__PURE__ */ new Map();
    this.moduleToRef = /* @__PURE__ */ new Map();
    this.cache = /* @__PURE__ */ new Map();
    this.remoteScoping = /* @__PURE__ */ new Map();
    this.scopeErrors = /* @__PURE__ */ new Map();
    this.modulesWithStructuralErrors = /* @__PURE__ */ new Set();
  }
  registerNgModuleMetadata(data) {
    this.assertCollecting();
    const ngModule = data.ref.node;
    this.moduleToRef.set(data.ref.node, data.ref);
    for (const decl of data.declarations) {
      this.registerDeclarationOfModule(ngModule, decl, data.rawDeclarations);
    }
  }
  registerDirectiveMetadata(directive) {
  }
  registerPipeMetadata(pipe) {
  }
  getScopeForComponent(clazz) {
    const scope = !this.declarationToModule.has(clazz) ? null : this.getScopeOfModule(this.declarationToModule.get(clazz).ngModule);
    return scope;
  }
  getDuplicateDeclarations(node) {
    if (!this.duplicateDeclarations.has(node)) {
      return null;
    }
    return Array.from(this.duplicateDeclarations.get(node).values());
  }
  getScopeOfModule(clazz) {
    return this.moduleToRef.has(clazz) ? this.getScopeOfModuleReference(this.moduleToRef.get(clazz)) : null;
  }
  getDiagnosticsOfModule(clazz) {
    this.getScopeOfModule(clazz);
    if (this.scopeErrors.has(clazz)) {
      return this.scopeErrors.get(clazz);
    } else {
      return null;
    }
  }
  registerDeclarationOfModule(ngModule, decl, rawDeclarations) {
    const declData = {
      ngModule,
      ref: decl,
      rawDeclarations
    };
    if (this.duplicateDeclarations.has(decl.node)) {
      this.duplicateDeclarations.get(decl.node).set(ngModule, declData);
    } else if (this.declarationToModule.has(decl.node) && this.declarationToModule.get(decl.node).ngModule !== ngModule) {
      const duplicateDeclMap = /* @__PURE__ */ new Map();
      const firstDeclData = this.declarationToModule.get(decl.node);
      this.modulesWithStructuralErrors.add(firstDeclData.ngModule);
      this.modulesWithStructuralErrors.add(ngModule);
      duplicateDeclMap.set(firstDeclData.ngModule, firstDeclData);
      duplicateDeclMap.set(ngModule, declData);
      this.duplicateDeclarations.set(decl.node, duplicateDeclMap);
      this.declarationToModule.delete(decl.node);
    } else {
      this.declarationToModule.set(decl.node, declData);
    }
  }
  getScopeOfModuleReference(ref) {
    if (this.cache.has(ref.node)) {
      return this.cache.get(ref.node);
    }
    this.sealed = true;
    const ngModule = this.localReader.getNgModuleMetadata(ref);
    if (ngModule === null) {
      this.cache.set(ref.node, null);
      return null;
    }
    const compilationModules = /* @__PURE__ */ new Set([ngModule.ref.node]);
    const exportedModules = /* @__PURE__ */ new Set([ngModule.ref.node]);
    const diagnostics = [];
    const compilationDirectives = /* @__PURE__ */ new Map();
    const compilationPipes = /* @__PURE__ */ new Map();
    const declared = /* @__PURE__ */ new Set();
    const exportDirectives = /* @__PURE__ */ new Map();
    const exportPipes = /* @__PURE__ */ new Map();
    let isPoisoned = false;
    if (this.modulesWithStructuralErrors.has(ngModule.ref.node)) {
      isPoisoned = true;
    }
    for (const decl of ngModule.imports) {
      const importScope = this.getExportedScope(decl, diagnostics, ref.node, "import");
      if (importScope === null) {
        diagnostics.push(invalidRef(ref.node, decl, "import"));
        isPoisoned = true;
        continue;
      } else if (importScope === "invalid" || importScope.exported.isPoisoned) {
        diagnostics.push(invalidTransitiveNgModuleRef(ref.node, decl, "import"));
        isPoisoned = true;
        if (importScope === "invalid") {
          continue;
        }
      }
      for (const directive of importScope.exported.directives) {
        compilationDirectives.set(directive.ref.node, directive);
      }
      for (const pipe of importScope.exported.pipes) {
        compilationPipes.set(pipe.ref.node, pipe);
      }
      for (const importedModule of importScope.exported.ngModules) {
        compilationModules.add(importedModule);
      }
    }
    for (const decl of ngModule.declarations) {
      const directive = this.localReader.getDirectiveMetadata(decl);
      const pipe = this.localReader.getPipeMetadata(decl);
      if (directive !== null) {
        compilationDirectives.set(decl.node, __spreadProps(__spreadValues({}, directive), { ref: decl }));
        if (directive.isPoisoned) {
          isPoisoned = true;
        }
      } else if (pipe !== null) {
        compilationPipes.set(decl.node, __spreadProps(__spreadValues({}, pipe), { ref: decl }));
      } else {
        const errorNode = decl.getOriginForDiagnostics(ngModule.rawDeclarations);
        diagnostics.push(makeDiagnostic(ErrorCode.NGMODULE_INVALID_DECLARATION, errorNode, `The class '${decl.node.name.text}' is listed in the declarations of the NgModule '${ngModule.ref.node.name.text}', but is not a directive, a component, or a pipe. Either remove it from the NgModule's declarations, or add an appropriate Angular decorator.`, [makeRelatedInformation(decl.node.name, `'${decl.node.name.text}' is declared here.`)]));
        isPoisoned = true;
        continue;
      }
      declared.add(decl.node);
    }
    for (const decl of ngModule.exports) {
      const exportScope = this.getExportedScope(decl, diagnostics, ref.node, "export");
      if (exportScope === "invalid" || exportScope !== null && exportScope.exported.isPoisoned) {
        diagnostics.push(invalidTransitiveNgModuleRef(ref.node, decl, "export"));
        isPoisoned = true;
        if (exportScope === "invalid") {
          continue;
        }
      } else if (exportScope !== null) {
        for (const directive of exportScope.exported.directives) {
          exportDirectives.set(directive.ref.node, directive);
        }
        for (const pipe of exportScope.exported.pipes) {
          exportPipes.set(pipe.ref.node, pipe);
        }
        for (const exportedModule of exportScope.exported.ngModules) {
          exportedModules.add(exportedModule);
        }
      } else if (compilationDirectives.has(decl.node)) {
        const directive = compilationDirectives.get(decl.node);
        exportDirectives.set(decl.node, directive);
      } else if (compilationPipes.has(decl.node)) {
        const pipe = compilationPipes.get(decl.node);
        exportPipes.set(decl.node, pipe);
      } else {
        if (this.localReader.getDirectiveMetadata(decl) !== null || this.localReader.getPipeMetadata(decl) !== null) {
          diagnostics.push(invalidReexport(ref.node, decl));
        } else {
          diagnostics.push(invalidRef(ref.node, decl, "export"));
        }
        isPoisoned = true;
        continue;
      }
    }
    const exported = {
      directives: Array.from(exportDirectives.values()),
      pipes: Array.from(exportPipes.values()),
      ngModules: Array.from(exportedModules),
      isPoisoned
    };
    const reexports = this.getReexports(ngModule, ref, declared, exported, diagnostics);
    const scope = {
      ngModule: ngModule.ref.node,
      compilation: {
        directives: Array.from(compilationDirectives.values()),
        pipes: Array.from(compilationPipes.values()),
        ngModules: Array.from(compilationModules),
        isPoisoned
      },
      exported,
      reexports,
      schemas: ngModule.schemas
    };
    if (diagnostics.length > 0) {
      this.scopeErrors.set(ref.node, diagnostics);
      this.modulesWithStructuralErrors.add(ref.node);
    }
    this.cache.set(ref.node, scope);
    return scope;
  }
  getRemoteScope(node) {
    return this.remoteScoping.has(node) ? this.remoteScoping.get(node) : null;
  }
  setComponentRemoteScope(node, directives, pipes) {
    this.remoteScoping.set(node, { directives, pipes });
  }
  getExportedScope(ref, diagnostics, ownerForErrors, type) {
    if (ref.node.getSourceFile().isDeclarationFile) {
      if (!ts11.isClassDeclaration(ref.node)) {
        const code = type === "import" ? ErrorCode.NGMODULE_INVALID_IMPORT : ErrorCode.NGMODULE_INVALID_EXPORT;
        diagnostics.push(makeDiagnostic(code, identifierOfNode(ref.node) || ref.node, `Appears in the NgModule.${type}s of ${nodeNameForError(ownerForErrors)}, but could not be resolved to an NgModule`));
        return "invalid";
      }
      return this.dependencyScopeReader.resolve(ref);
    } else {
      return this.getScopeOfModuleReference(ref);
    }
  }
  getReexports(ngModule, ref, declared, exported, diagnostics) {
    let reexports = null;
    const sourceFile = ref.node.getSourceFile();
    if (this.aliasingHost === null) {
      return null;
    }
    reexports = [];
    const reexportMap = /* @__PURE__ */ new Map();
    const ngModuleRef = ref;
    const addReexport = (exportRef) => {
      if (exportRef.node.getSourceFile() === sourceFile) {
        return;
      }
      const isReExport = !declared.has(exportRef.node);
      const exportName = this.aliasingHost.maybeAliasSymbolAs(exportRef, sourceFile, ngModule.ref.node.name.text, isReExport);
      if (exportName === null) {
        return;
      }
      if (!reexportMap.has(exportName)) {
        if (exportRef.alias && exportRef.alias instanceof ExternalExpr) {
          reexports.push({
            fromModule: exportRef.alias.value.moduleName,
            symbolName: exportRef.alias.value.name,
            asAlias: exportName
          });
        } else {
          const emittedRef = this.refEmitter.emit(exportRef.cloneWithNoIdentifiers(), sourceFile);
          assertSuccessfulReferenceEmit(emittedRef, ngModuleRef.node.name, "class");
          const expr = emittedRef.expression;
          if (!(expr instanceof ExternalExpr) || expr.value.moduleName === null || expr.value.name === null) {
            throw new Error("Expected ExternalExpr");
          }
          reexports.push({
            fromModule: expr.value.moduleName,
            symbolName: expr.value.name,
            asAlias: exportName
          });
        }
        reexportMap.set(exportName, exportRef);
      } else {
        const prevRef = reexportMap.get(exportName);
        diagnostics.push(reexportCollision(ngModuleRef.node, prevRef, exportRef));
      }
    };
    for (const { ref: ref2 } of exported.directives) {
      addReexport(ref2);
    }
    for (const { ref: ref2 } of exported.pipes) {
      addReexport(ref2);
    }
    return reexports;
  }
  assertCollecting() {
    if (this.sealed) {
      throw new Error(`Assertion: LocalModuleScopeRegistry is not COLLECTING`);
    }
  }
};
function invalidRef(clazz, decl, type) {
  const code = type === "import" ? ErrorCode.NGMODULE_INVALID_IMPORT : ErrorCode.NGMODULE_INVALID_EXPORT;
  const resolveTarget = type === "import" ? "NgModule" : "NgModule, Component, Directive, or Pipe";
  let message = `Appears in the NgModule.${type}s of ${nodeNameForError(clazz)}, but could not be resolved to an ${resolveTarget} class.

`;
  const library = decl.ownedByModuleGuess !== null ? ` (${decl.ownedByModuleGuess})` : "";
  const sf = decl.node.getSourceFile();
  if (!sf.isDeclarationFile) {
    const annotationType = type === "import" ? "@NgModule" : "Angular";
    message += `Is it missing an ${annotationType} annotation?`;
  } else if (sf.fileName.indexOf("node_modules") !== -1) {
    message += `This likely means that the library${library} which declares ${decl.debugName} has not been processed correctly by ngcc, or is not compatible with Angular Ivy. Check if a newer version of the library is available, and update if so. Also consider checking with the library's authors to see if the library is expected to be compatible with Ivy.`;
  } else {
    message += `This likely means that the dependency${library} which declares ${decl.debugName} has not been processed correctly by ngcc.`;
  }
  return makeDiagnostic(code, identifierOfNode(decl.node) || decl.node, message);
}
function invalidTransitiveNgModuleRef(clazz, decl, type) {
  const code = type === "import" ? ErrorCode.NGMODULE_INVALID_IMPORT : ErrorCode.NGMODULE_INVALID_EXPORT;
  return makeDiagnostic(code, identifierOfNode(decl.node) || decl.node, `Appears in the NgModule.${type}s of ${nodeNameForError(clazz)}, but itself has errors`);
}
function invalidReexport(clazz, decl) {
  return makeDiagnostic(ErrorCode.NGMODULE_INVALID_REEXPORT, identifierOfNode(decl.node) || decl.node, `Present in the NgModule.exports of ${nodeNameForError(clazz)} but neither declared nor imported`);
}
function reexportCollision(module, refA, refB) {
  const childMessageText = `This directive/pipe is part of the exports of '${module.name.text}' and shares the same name as another exported directive/pipe.`;
  return makeDiagnostic(ErrorCode.NGMODULE_REEXPORT_NAME_COLLISION, module.name, `
    There was a name collision between two classes named '${refA.node.name.text}', which are both part of the exports of '${module.name.text}'.

    Angular generates re-exports of an NgModule's exported directives/pipes from the module's source file in certain cases, using the declared name of the class. If two classes of the same name are exported, this automatic naming does not work.

    To fix this problem please re-export one or both classes directly from this file.
  `.trim(), [
    makeRelatedInformation(refA.node.name, childMessageText),
    makeRelatedInformation(refB.node.name, childMessageText)
  ]);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/scope/src/typecheck.mjs
import { CssSelector, SelectorMatcher } from "@angular/compiler";
import ts12 from "typescript";
var TypeCheckScopeRegistry = class {
  constructor(scopeReader, metaReader) {
    this.scopeReader = scopeReader;
    this.metaReader = metaReader;
    this.flattenedDirectiveMetaCache = /* @__PURE__ */ new Map();
    this.scopeCache = /* @__PURE__ */ new Map();
  }
  getTypeCheckScope(node) {
    const matcher = new SelectorMatcher();
    const directives = [];
    const pipes = /* @__PURE__ */ new Map();
    const scope = this.scopeReader.getScopeForComponent(node);
    if (scope === null) {
      return {
        matcher,
        directives,
        pipes,
        schemas: [],
        isPoisoned: false
      };
    }
    if (this.scopeCache.has(scope.ngModule)) {
      return this.scopeCache.get(scope.ngModule);
    }
    for (const meta of scope.compilation.directives) {
      if (meta.selector !== null) {
        const extMeta = this.getTypeCheckDirectiveMetadata(meta.ref);
        matcher.addSelectables(CssSelector.parse(meta.selector), extMeta);
        directives.push(extMeta);
      }
    }
    for (const { name, ref } of scope.compilation.pipes) {
      if (!ts12.isClassDeclaration(ref.node)) {
        throw new Error(`Unexpected non-class declaration ${ts12.SyntaxKind[ref.node.kind]} for pipe ${ref.debugName}`);
      }
      pipes.set(name, ref);
    }
    const typeCheckScope = {
      matcher,
      directives,
      pipes,
      schemas: scope.schemas,
      isPoisoned: scope.compilation.isPoisoned || scope.exported.isPoisoned
    };
    this.scopeCache.set(scope.ngModule, typeCheckScope);
    return typeCheckScope;
  }
  getTypeCheckDirectiveMetadata(ref) {
    const clazz = ref.node;
    if (this.flattenedDirectiveMetaCache.has(clazz)) {
      return this.flattenedDirectiveMetaCache.get(clazz);
    }
    const meta = flattenInheritedDirectiveMetadata(this.metaReader, ref);
    this.flattenedDirectiveMetaCache.set(clazz, meta);
    return meta;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/checker.mjs
import { CssSelector as CssSelector2, DomElementSchemaRegistry as DomElementSchemaRegistry2 } from "@angular/compiler";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/diagnostics/src/diagnostic.mjs
import ts13 from "typescript";
function makeTemplateDiagnostic(templateId, mapping, span, category, code, messageText, relatedMessages) {
  if (mapping.type === "direct") {
    let relatedInformation = void 0;
    if (relatedMessages !== void 0) {
      relatedInformation = [];
      for (const relatedMessage of relatedMessages) {
        relatedInformation.push({
          category: ts13.DiagnosticCategory.Message,
          code: 0,
          file: relatedMessage.sourceFile,
          start: relatedMessage.start,
          length: relatedMessage.end - relatedMessage.start,
          messageText: relatedMessage.text
        });
      }
    }
    return {
      source: "ngtsc",
      code,
      category,
      messageText,
      file: mapping.node.getSourceFile(),
      componentFile: mapping.node.getSourceFile(),
      templateId,
      start: span.start.offset,
      length: span.end.offset - span.start.offset,
      relatedInformation
    };
  } else if (mapping.type === "indirect" || mapping.type === "external") {
    const componentSf = mapping.componentClass.getSourceFile();
    const componentName = mapping.componentClass.name.text;
    const fileName = mapping.type === "indirect" ? `${componentSf.fileName} (${componentName} template)` : mapping.templateUrl;
    const sf = ts13.createSourceFile(fileName, mapping.template, ts13.ScriptTarget.Latest, false, ts13.ScriptKind.JSX);
    let relatedInformation = [];
    if (relatedMessages !== void 0) {
      for (const relatedMessage of relatedMessages) {
        relatedInformation.push({
          category: ts13.DiagnosticCategory.Message,
          code: 0,
          file: relatedMessage.sourceFile,
          start: relatedMessage.start,
          length: relatedMessage.end - relatedMessage.start,
          messageText: relatedMessage.text
        });
      }
    }
    relatedInformation.push({
      category: ts13.DiagnosticCategory.Message,
      code: 0,
      file: componentSf,
      start: mapping.node.getStart(),
      length: mapping.node.getEnd() - mapping.node.getStart(),
      messageText: `Error occurs in the template of component ${componentName}.`
    });
    return {
      source: "ngtsc",
      category,
      code,
      messageText,
      file: sf,
      componentFile: componentSf,
      templateId,
      start: span.start.offset,
      length: span.end.offset - span.start.offset,
      relatedInformation
    };
  } else {
    throw new Error(`Unexpected source mapping type: ${mapping.type}`);
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/diagnostics/src/id.mjs
var TEMPLATE_ID = Symbol("ngTemplateId");
var NEXT_TEMPLATE_ID = Symbol("ngNextTemplateId");
function getTemplateId(clazz) {
  const node = clazz;
  if (node[TEMPLATE_ID] === void 0) {
    node[TEMPLATE_ID] = allocateTemplateId(node.getSourceFile());
  }
  return node[TEMPLATE_ID];
}
function allocateTemplateId(sf) {
  if (sf[NEXT_TEMPLATE_ID] === void 0) {
    sf[NEXT_TEMPLATE_ID] = 1;
  }
  return `tcb${sf[NEXT_TEMPLATE_ID]++}`;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/completion.mjs
import { EmptyExpr, ImplicitReceiver as ImplicitReceiver2, PropertyRead as PropertyRead2, PropertyWrite as PropertyWrite2, SafePropertyRead, TmplAstReference as TmplAstReference2, TmplAstTextAttribute } from "@angular/compiler";
import ts15 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/comments.mjs
import { AbsoluteSourceSpan as AbsoluteSourceSpan2 } from "@angular/compiler";
import ts14 from "typescript";
var parseSpanComment = /^(\d+),(\d+)$/;
function readSpanComment(node, sourceFile = node.getSourceFile()) {
  return ts14.forEachTrailingCommentRange(sourceFile.text, node.getEnd(), (pos, end, kind) => {
    if (kind !== ts14.SyntaxKind.MultiLineCommentTrivia) {
      return null;
    }
    const commentText = sourceFile.text.substring(pos + 2, end - 2);
    const match = commentText.match(parseSpanComment);
    if (match === null) {
      return null;
    }
    return new AbsoluteSourceSpan2(+match[1], +match[2]);
  }) || null;
}
var CommentTriviaType;
(function(CommentTriviaType2) {
  CommentTriviaType2["DIAGNOSTIC"] = "D";
  CommentTriviaType2["EXPRESSION_TYPE_IDENTIFIER"] = "T";
})(CommentTriviaType || (CommentTriviaType = {}));
var ExpressionIdentifier;
(function(ExpressionIdentifier2) {
  ExpressionIdentifier2["DIRECTIVE"] = "DIR";
  ExpressionIdentifier2["COMPONENT_COMPLETION"] = "COMPCOMP";
  ExpressionIdentifier2["EVENT_PARAMETER"] = "EP";
})(ExpressionIdentifier || (ExpressionIdentifier = {}));
function addExpressionIdentifier(node, identifier) {
  ts14.addSyntheticTrailingComment(node, ts14.SyntaxKind.MultiLineCommentTrivia, `${CommentTriviaType.EXPRESSION_TYPE_IDENTIFIER}:${identifier}`, false);
}
var IGNORE_FOR_DIAGNOSTICS_MARKER = `${CommentTriviaType.DIAGNOSTIC}:ignore`;
function markIgnoreDiagnostics(node) {
  ts14.addSyntheticTrailingComment(node, ts14.SyntaxKind.MultiLineCommentTrivia, IGNORE_FOR_DIAGNOSTICS_MARKER, false);
}
function hasIgnoreForDiagnosticsMarker(node, sourceFile) {
  return ts14.forEachTrailingCommentRange(sourceFile.text, node.getEnd(), (pos, end, kind) => {
    if (kind !== ts14.SyntaxKind.MultiLineCommentTrivia) {
      return null;
    }
    const commentText = sourceFile.text.substring(pos + 2, end - 2);
    return commentText === IGNORE_FOR_DIAGNOSTICS_MARKER;
  }) === true;
}
function makeRecursiveVisitor(visitor) {
  function recursiveVisitor(node) {
    const res = visitor(node);
    return res !== null ? res : node.forEachChild(recursiveVisitor);
  }
  return recursiveVisitor;
}
function getSpanFromOptions(opts) {
  let withSpan = null;
  if (opts.withSpan !== void 0) {
    if (opts.withSpan instanceof AbsoluteSourceSpan2) {
      withSpan = opts.withSpan;
    } else {
      withSpan = { start: opts.withSpan.start.offset, end: opts.withSpan.end.offset };
    }
  }
  return withSpan;
}
function findFirstMatchingNode(tcb, opts) {
  var _a;
  const withSpan = getSpanFromOptions(opts);
  const withExpressionIdentifier = opts.withExpressionIdentifier;
  const sf = tcb.getSourceFile();
  const visitor = makeRecursiveVisitor((node) => {
    if (!opts.filter(node)) {
      return null;
    }
    if (withSpan !== null) {
      const comment = readSpanComment(node, sf);
      if (comment === null || withSpan.start !== comment.start || withSpan.end !== comment.end) {
        return null;
      }
    }
    if (withExpressionIdentifier !== void 0 && !hasExpressionIdentifier(sf, node, withExpressionIdentifier)) {
      return null;
    }
    return node;
  });
  return (_a = tcb.forEachChild(visitor)) != null ? _a : null;
}
function findAllMatchingNodes(tcb, opts) {
  const withSpan = getSpanFromOptions(opts);
  const withExpressionIdentifier = opts.withExpressionIdentifier;
  const results = [];
  const stack = [tcb];
  const sf = tcb.getSourceFile();
  while (stack.length > 0) {
    const node = stack.pop();
    if (!opts.filter(node)) {
      stack.push(...node.getChildren());
      continue;
    }
    if (withSpan !== null) {
      const comment = readSpanComment(node, sf);
      if (comment === null || withSpan.start !== comment.start || withSpan.end !== comment.end) {
        stack.push(...node.getChildren());
        continue;
      }
    }
    if (withExpressionIdentifier !== void 0 && !hasExpressionIdentifier(sf, node, withExpressionIdentifier)) {
      continue;
    }
    results.push(node);
  }
  return results;
}
function hasExpressionIdentifier(sourceFile, node, identifier) {
  return ts14.forEachTrailingCommentRange(sourceFile.text, node.getEnd(), (pos, end, kind) => {
    if (kind !== ts14.SyntaxKind.MultiLineCommentTrivia) {
      return false;
    }
    const commentText = sourceFile.text.substring(pos + 2, end - 2);
    return commentText === `${CommentTriviaType.EXPRESSION_TYPE_IDENTIFIER}:${identifier}`;
  }) || false;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/completion.mjs
var CompletionEngine = class {
  constructor(tcb, data, tcbPath, tcbIsShim) {
    this.tcb = tcb;
    this.data = data;
    this.tcbPath = tcbPath;
    this.tcbIsShim = tcbIsShim;
    this.templateContextCache = /* @__PURE__ */ new Map();
    this.expressionCompletionCache = /* @__PURE__ */ new Map();
    const globalRead = findFirstMatchingNode(this.tcb, {
      filter: ts15.isPropertyAccessExpression,
      withExpressionIdentifier: ExpressionIdentifier.COMPONENT_COMPLETION
    });
    if (globalRead !== null) {
      this.componentContext = {
        tcbPath: this.tcbPath,
        isShimFile: this.tcbIsShim,
        positionInFile: globalRead.name.getStart()
      };
    } else {
      this.componentContext = null;
    }
  }
  getGlobalCompletions(context, node) {
    if (this.componentContext === null) {
      return null;
    }
    const templateContext = this.getTemplateContextCompletions(context);
    if (templateContext === null) {
      return null;
    }
    let nodeContext = null;
    if (node instanceof EmptyExpr) {
      const nodeLocation = findFirstMatchingNode(this.tcb, {
        filter: ts15.isIdentifier,
        withSpan: node.sourceSpan
      });
      if (nodeLocation !== null) {
        nodeContext = {
          tcbPath: this.tcbPath,
          isShimFile: this.tcbIsShim,
          positionInFile: nodeLocation.getStart()
        };
      }
    }
    if (node instanceof PropertyRead2 && node.receiver instanceof ImplicitReceiver2) {
      const nodeLocation = findFirstMatchingNode(this.tcb, {
        filter: ts15.isPropertyAccessExpression,
        withSpan: node.sourceSpan
      });
      if (nodeLocation) {
        nodeContext = {
          tcbPath: this.tcbPath,
          isShimFile: this.tcbIsShim,
          positionInFile: nodeLocation.getStart()
        };
      }
    }
    return {
      componentContext: this.componentContext,
      templateContext,
      nodeContext
    };
  }
  getExpressionCompletionLocation(expr) {
    if (this.expressionCompletionCache.has(expr)) {
      return this.expressionCompletionCache.get(expr);
    }
    let tsExpr = null;
    if (expr instanceof PropertyRead2 || expr instanceof PropertyWrite2) {
      tsExpr = findFirstMatchingNode(this.tcb, {
        filter: ts15.isPropertyAccessExpression,
        withSpan: expr.nameSpan
      });
    } else if (expr instanceof SafePropertyRead) {
      const ternaryExpr = findFirstMatchingNode(this.tcb, {
        filter: ts15.isParenthesizedExpression,
        withSpan: expr.sourceSpan
      });
      if (ternaryExpr === null || !ts15.isConditionalExpression(ternaryExpr.expression)) {
        return null;
      }
      const whenTrue = ternaryExpr.expression.whenTrue;
      if (ts15.isPropertyAccessExpression(whenTrue)) {
        tsExpr = whenTrue;
      } else if (ts15.isCallExpression(whenTrue) && ts15.isPropertyAccessExpression(whenTrue.expression)) {
        tsExpr = whenTrue.expression;
      }
    }
    if (tsExpr === null) {
      return null;
    }
    const res = {
      tcbPath: this.tcbPath,
      isShimFile: this.tcbIsShim,
      positionInFile: tsExpr.name.getEnd()
    };
    this.expressionCompletionCache.set(expr, res);
    return res;
  }
  getLiteralCompletionLocation(expr) {
    if (this.expressionCompletionCache.has(expr)) {
      return this.expressionCompletionCache.get(expr);
    }
    let tsExpr = null;
    if (expr instanceof TmplAstTextAttribute) {
      const strNode = findFirstMatchingNode(this.tcb, {
        filter: ts15.isParenthesizedExpression,
        withSpan: expr.sourceSpan
      });
      if (strNode !== null && ts15.isStringLiteral(strNode.expression)) {
        tsExpr = strNode.expression;
      }
    } else {
      tsExpr = findFirstMatchingNode(this.tcb, {
        filter: (n) => ts15.isStringLiteral(n) || ts15.isNumericLiteral(n),
        withSpan: expr.sourceSpan
      });
    }
    if (tsExpr === null) {
      return null;
    }
    let positionInShimFile = tsExpr.getEnd();
    if (ts15.isStringLiteral(tsExpr)) {
      positionInShimFile -= 1;
    }
    const res = {
      tcbPath: this.tcbPath,
      isShimFile: this.tcbIsShim,
      positionInFile: positionInShimFile
    };
    this.expressionCompletionCache.set(expr, res);
    return res;
  }
  getTemplateContextCompletions(context) {
    if (this.templateContextCache.has(context)) {
      return this.templateContextCache.get(context);
    }
    const templateContext = /* @__PURE__ */ new Map();
    for (const node of this.data.boundTarget.getEntitiesInTemplateScope(context)) {
      if (node instanceof TmplAstReference2) {
        templateContext.set(node.name, {
          kind: CompletionKind.Reference,
          node
        });
      } else {
        templateContext.set(node.name, {
          kind: CompletionKind.Variable,
          node
        });
      }
    }
    this.templateContextCache.set(context, templateContext);
    return templateContext;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/context.mjs
import ts29 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/dom.mjs
import { DomElementSchemaRegistry } from "@angular/compiler";
import ts16 from "typescript";
var REGISTRY = new DomElementSchemaRegistry();
var REMOVE_XHTML_REGEX = /^:xhtml:/;
var RegistryDomSchemaChecker = class {
  constructor(resolver) {
    this.resolver = resolver;
    this._diagnostics = [];
  }
  get diagnostics() {
    return this._diagnostics;
  }
  checkElement(id, element, schemas) {
    const name = element.name.replace(REMOVE_XHTML_REGEX, "");
    if (!REGISTRY.hasElement(name, schemas)) {
      const mapping = this.resolver.getSourceMapping(id);
      let errorMsg = `'${name}' is not a known element:
`;
      errorMsg += `1. If '${name}' is an Angular component, then verify that it is part of this module.
`;
      if (name.indexOf("-") > -1) {
        errorMsg += `2. If '${name}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.`;
      } else {
        errorMsg += `2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
      }
      const diag = makeTemplateDiagnostic(id, mapping, element.startSourceSpan, ts16.DiagnosticCategory.Error, ngErrorCode(ErrorCode.SCHEMA_INVALID_ELEMENT), errorMsg);
      this._diagnostics.push(diag);
    }
  }
  checkProperty(id, element, name, span, schemas) {
    if (!REGISTRY.hasProperty(element.name, name, schemas)) {
      const mapping = this.resolver.getSourceMapping(id);
      let errorMsg = `Can't bind to '${name}' since it isn't a known property of '${element.name}'.`;
      if (element.name.startsWith("ng-")) {
        errorMsg += `
1. If '${name}' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component.
2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
      } else if (element.name.indexOf("-") > -1) {
        errorMsg += `
1. If '${element.name}' is an Angular component and it has '${name}' input, then verify that it is part of this module.
2. If '${element.name}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
      }
      const diag = makeTemplateDiagnostic(id, mapping, span, ts16.DiagnosticCategory.Error, ngErrorCode(ErrorCode.SCHEMA_INVALID_ATTRIBUTE), errorMsg);
      this._diagnostics.push(diag);
    }
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/environment.mjs
import { ExpressionType, ExternalExpr as ExternalExpr2, TypeModifier } from "@angular/compiler";
import ts22 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/ts_util.mjs
import ts17 from "typescript";
var SAFE_TO_CAST_WITHOUT_PARENS = /* @__PURE__ */ new Set([
  ts17.SyntaxKind.ParenthesizedExpression,
  ts17.SyntaxKind.Identifier,
  ts17.SyntaxKind.CallExpression,
  ts17.SyntaxKind.NonNullExpression,
  ts17.SyntaxKind.ElementAccessExpression,
  ts17.SyntaxKind.PropertyAccessExpression,
  ts17.SyntaxKind.ArrayLiteralExpression,
  ts17.SyntaxKind.ObjectLiteralExpression,
  ts17.SyntaxKind.StringLiteral,
  ts17.SyntaxKind.NumericLiteral,
  ts17.SyntaxKind.TrueKeyword,
  ts17.SyntaxKind.FalseKeyword,
  ts17.SyntaxKind.NullKeyword,
  ts17.SyntaxKind.UndefinedKeyword
]);
function tsCastToAny(expr) {
  if (!SAFE_TO_CAST_WITHOUT_PARENS.has(expr.kind)) {
    expr = ts17.createParen(expr);
  }
  return ts17.createParen(ts17.createAsExpression(expr, ts17.createKeywordTypeNode(ts17.SyntaxKind.AnyKeyword)));
}
function tsCreateElement(tagName) {
  const createElement = ts17.createPropertyAccess(ts17.createIdentifier("document"), "createElement");
  return ts17.createCall(createElement, void 0, [ts17.createLiteral(tagName)]);
}
function tsDeclareVariable(id, type) {
  const decl = ts17.createVariableDeclaration(id, type, ts17.createNonNullExpression(ts17.createNull()));
  return ts17.createVariableStatement(void 0, [decl]);
}
function tsCreateTypeQueryForCoercedInput(typeName, coercedInputName) {
  return ts17.createTypeQueryNode(ts17.createQualifiedName(typeName, `ngAcceptInputType_${coercedInputName}`));
}
function tsCreateVariable(id, initializer) {
  const decl = ts17.createVariableDeclaration(id, void 0, initializer);
  return ts17.createVariableStatement(void 0, [decl]);
}
function tsCallMethod(receiver, methodName, args = []) {
  const methodAccess = ts17.createPropertyAccess(receiver, methodName);
  return ts17.createCall(methodAccess, void 0, args);
}
function checkIfClassIsExported(node) {
  if (node.modifiers !== void 0 && node.modifiers.some((mod) => mod.kind === ts17.SyntaxKind.ExportKeyword)) {
    return true;
  } else if (node.parent !== void 0 && ts17.isSourceFile(node.parent) && checkIfFileHasExport(node.parent, node.name.text)) {
    return true;
  }
  return false;
}
function checkIfFileHasExport(sf, name) {
  for (const stmt of sf.statements) {
    if (ts17.isExportDeclaration(stmt) && stmt.exportClause !== void 0 && ts17.isNamedExports(stmt.exportClause)) {
      for (const element of stmt.exportClause.elements) {
        if (element.propertyName === void 0 && element.name.text === name) {
          return true;
        } else if (element.propertyName !== void 0 && element.propertyName.text == name) {
          return true;
        }
      }
    }
  }
  return false;
}
function isAccessExpression(node) {
  return ts17.isPropertyAccessExpression(node) || ts17.isElementAccessExpression(node);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_constructor.mjs
import ts21 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/tcb_util.mjs
import ts20 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_parameter_emitter.mjs
import ts19 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_emitter.mjs
import ts18 from "typescript";
var INELIGIBLE = {};
function canEmitType(type, canEmit) {
  return canEmitTypeWorker(type);
  function canEmitTypeWorker(type2) {
    return visitNode(type2) !== INELIGIBLE;
  }
  function visitNode(node) {
    if (ts18.isImportTypeNode(node)) {
      return INELIGIBLE;
    }
    if (ts18.isTypeReferenceNode(node) && !canEmitTypeReference(node)) {
      return INELIGIBLE;
    } else {
      return ts18.forEachChild(node, visitNode);
    }
  }
  function canEmitTypeReference(type2) {
    if (!canEmit(type2)) {
      return false;
    }
    return type2.typeArguments === void 0 || type2.typeArguments.every(canEmitTypeWorker);
  }
}
var TypeEmitter = class {
  constructor(translator) {
    this.translator = translator;
  }
  emitType(type) {
    const typeReferenceTransformer = (context) => {
      const visitNode = (node) => {
        if (ts18.isImportTypeNode(node)) {
          throw new Error("Unable to emit import type");
        }
        if (ts18.isTypeReferenceNode(node)) {
          return this.emitTypeReference(node);
        } else if (ts18.isLiteralExpression(node)) {
          const clone = ts18.getMutableClone(node);
          ts18.setTextRange(clone, { pos: -1, end: -1 });
          return clone;
        } else {
          return ts18.visitEachChild(node, visitNode, context);
        }
      };
      return (node) => ts18.visitNode(node, visitNode);
    };
    return ts18.transform(type, [typeReferenceTransformer]).transformed[0];
  }
  emitTypeReference(type) {
    const translatedType = this.translator(type);
    if (translatedType === null) {
      throw new Error("Unable to emit an unresolved reference");
    }
    let typeArguments = void 0;
    if (type.typeArguments !== void 0) {
      typeArguments = ts18.createNodeArray(type.typeArguments.map((typeArg) => this.emitType(typeArg)));
    }
    return ts18.updateTypeReferenceNode(type, translatedType.typeName, typeArguments);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_parameter_emitter.mjs
var TypeParameterEmitter = class {
  constructor(typeParameters, reflector) {
    this.typeParameters = typeParameters;
    this.reflector = reflector;
  }
  canEmit(canEmitReference) {
    if (this.typeParameters === void 0) {
      return true;
    }
    return this.typeParameters.every((typeParam) => {
      return this.canEmitType(typeParam.constraint, canEmitReference) && this.canEmitType(typeParam.default, canEmitReference);
    });
  }
  canEmitType(type, canEmitReference) {
    if (type === void 0) {
      return true;
    }
    return canEmitType(type, (typeReference) => {
      const reference = this.resolveTypeReference(typeReference);
      if (reference === null) {
        return false;
      }
      if (reference instanceof Reference) {
        return canEmitReference(reference);
      }
      return true;
    });
  }
  emit(emitReference) {
    if (this.typeParameters === void 0) {
      return void 0;
    }
    const emitter = new TypeEmitter((type) => this.translateTypeReference(type, emitReference));
    return this.typeParameters.map((typeParam) => {
      const constraint = typeParam.constraint !== void 0 ? emitter.emitType(typeParam.constraint) : void 0;
      const defaultType = typeParam.default !== void 0 ? emitter.emitType(typeParam.default) : void 0;
      return ts19.updateTypeParameterDeclaration(typeParam, typeParam.name, constraint, defaultType);
    });
  }
  resolveTypeReference(type) {
    const target = ts19.isIdentifier(type.typeName) ? type.typeName : type.typeName.right;
    const declaration = this.reflector.getDeclarationOfIdentifier(target);
    if (declaration === null || declaration.node === null) {
      return null;
    }
    if (this.isLocalTypeParameter(declaration.node)) {
      return type;
    }
    let owningModule = null;
    if (declaration.viaModule !== null) {
      owningModule = {
        specifier: declaration.viaModule,
        resolutionContext: type.getSourceFile().fileName
      };
    }
    return new Reference(declaration.node, owningModule);
  }
  translateTypeReference(type, emitReference) {
    const reference = this.resolveTypeReference(type);
    if (!(reference instanceof Reference)) {
      return reference;
    }
    const typeNode = emitReference(reference);
    if (typeNode === null) {
      return null;
    }
    if (!ts19.isTypeReferenceNode(typeNode)) {
      throw new Error(`Expected TypeReferenceNode for emitted reference, got ${ts19.SyntaxKind[typeNode.kind]}.`);
    }
    return typeNode;
  }
  isLocalTypeParameter(decl) {
    return this.typeParameters.some((param) => param === decl);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/tcb_util.mjs
var TcbInliningRequirement;
(function(TcbInliningRequirement2) {
  TcbInliningRequirement2[TcbInliningRequirement2["MustInline"] = 0] = "MustInline";
  TcbInliningRequirement2[TcbInliningRequirement2["ShouldInlineForGenericBounds"] = 1] = "ShouldInlineForGenericBounds";
  TcbInliningRequirement2[TcbInliningRequirement2["None"] = 2] = "None";
})(TcbInliningRequirement || (TcbInliningRequirement = {}));
function requiresInlineTypeCheckBlock(node, env, usedPipes, reflector) {
  if (!checkIfClassIsExported(node)) {
    return TcbInliningRequirement.MustInline;
  } else if (!checkIfGenericTypeBoundsCanBeEmitted(node, reflector, env)) {
    return TcbInliningRequirement.ShouldInlineForGenericBounds;
  } else if (Array.from(usedPipes.values()).some((pipeRef) => !checkIfClassIsExported(pipeRef.node))) {
    return TcbInliningRequirement.MustInline;
  } else {
    return TcbInliningRequirement.None;
  }
}
function getTemplateMapping(shimSf, position, resolver, isDiagnosticRequest) {
  const node = getTokenAtPosition(shimSf, position);
  const sourceLocation = findSourceLocation(node, shimSf, isDiagnosticRequest);
  if (sourceLocation === null) {
    return null;
  }
  const mapping = resolver.getSourceMapping(sourceLocation.id);
  const span = resolver.toParseSourceSpan(sourceLocation.id, sourceLocation.span);
  if (span === null) {
    return null;
  }
  return { sourceLocation, templateSourceMapping: mapping, span };
}
function findTypeCheckBlock(file, id, isDiagnosticRequest) {
  for (const stmt of file.statements) {
    if (ts20.isFunctionDeclaration(stmt) && getTemplateId2(stmt, file, isDiagnosticRequest) === id) {
      return stmt;
    }
  }
  return null;
}
function findSourceLocation(node, sourceFile, isDiagnosticsRequest) {
  while (node !== void 0 && !ts20.isFunctionDeclaration(node)) {
    if (hasIgnoreForDiagnosticsMarker(node, sourceFile) && isDiagnosticsRequest) {
      return null;
    }
    const span = readSpanComment(node, sourceFile);
    if (span !== null) {
      const id = getTemplateId2(node, sourceFile, isDiagnosticsRequest);
      if (id === null) {
        return null;
      }
      return { id, span };
    }
    node = node.parent;
  }
  return null;
}
function getTemplateId2(node, sourceFile, isDiagnosticRequest) {
  while (!ts20.isFunctionDeclaration(node)) {
    if (hasIgnoreForDiagnosticsMarker(node, sourceFile) && isDiagnosticRequest) {
      return null;
    }
    node = node.parent;
    if (node === void 0) {
      return null;
    }
  }
  const start = node.getFullStart();
  return ts20.forEachLeadingCommentRange(sourceFile.text, start, (pos, end, kind) => {
    if (kind !== ts20.SyntaxKind.MultiLineCommentTrivia) {
      return null;
    }
    const commentText = sourceFile.text.substring(pos + 2, end - 2);
    return commentText;
  }) || null;
}
function checkIfGenericTypeBoundsCanBeEmitted(node, reflector, env) {
  const emitter = new TypeParameterEmitter(node.typeParameters, reflector);
  return emitter.canEmit((ref) => env.canReferenceType(ref));
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_constructor.mjs
function generateTypeCtorDeclarationFn(node, meta, nodeTypeRef, typeParams) {
  const rawTypeArgs = typeParams !== void 0 ? generateGenericArgs(typeParams) : void 0;
  const rawType = ts21.createTypeReferenceNode(nodeTypeRef, rawTypeArgs);
  const initParam = constructTypeCtorParameter(node, meta, rawType);
  const typeParameters = typeParametersWithDefaultTypes(typeParams);
  if (meta.body) {
    const fnType = ts21.createFunctionTypeNode(typeParameters, [initParam], rawType);
    const decl = ts21.createVariableDeclaration(meta.fnName, fnType, ts21.createNonNullExpression(ts21.createNull()));
    const declList = ts21.createVariableDeclarationList([decl], ts21.NodeFlags.Const);
    return ts21.createVariableStatement(void 0, declList);
  } else {
    return ts21.createFunctionDeclaration(void 0, [ts21.createModifier(ts21.SyntaxKind.DeclareKeyword)], void 0, meta.fnName, typeParameters, [initParam], rawType, void 0);
  }
}
function generateInlineTypeCtor(node, meta) {
  const rawTypeArgs = node.typeParameters !== void 0 ? generateGenericArgs(node.typeParameters) : void 0;
  const rawType = ts21.createTypeReferenceNode(node.name, rawTypeArgs);
  const initParam = constructTypeCtorParameter(node, meta, rawType);
  let body = void 0;
  if (meta.body) {
    body = ts21.createBlock([
      ts21.createReturn(ts21.createNonNullExpression(ts21.createNull()))
    ]);
  }
  return ts21.createMethod(void 0, [ts21.createModifier(ts21.SyntaxKind.StaticKeyword)], void 0, meta.fnName, void 0, typeParametersWithDefaultTypes(node.typeParameters), [initParam], rawType, body);
}
function constructTypeCtorParameter(node, meta, rawType) {
  let initType = null;
  const keys = meta.fields.inputs;
  const plainKeys = [];
  const coercedKeys = [];
  for (const key of keys) {
    if (!meta.coercedInputFields.has(key)) {
      plainKeys.push(ts21.createLiteralTypeNode(ts21.createStringLiteral(key)));
    } else {
      coercedKeys.push(ts21.createPropertySignature(void 0, key, void 0, tsCreateTypeQueryForCoercedInput(rawType.typeName, key), void 0));
    }
  }
  if (plainKeys.length > 0) {
    const keyTypeUnion = ts21.createUnionTypeNode(plainKeys);
    initType = ts21.createTypeReferenceNode("Pick", [rawType, keyTypeUnion]);
  }
  if (coercedKeys.length > 0) {
    const coercedLiteral = ts21.createTypeLiteralNode(coercedKeys);
    initType = initType !== null ? ts21.createIntersectionTypeNode([initType, coercedLiteral]) : coercedLiteral;
  }
  if (initType === null) {
    initType = ts21.createTypeLiteralNode([]);
  }
  return ts21.createParameter(void 0, void 0, void 0, "init", void 0, initType, void 0);
}
function generateGenericArgs(params) {
  return params.map((param) => ts21.createTypeReferenceNode(param.name, void 0));
}
function requiresInlineTypeCtor(node, host, env) {
  return !checkIfGenericTypeBoundsCanBeEmitted(node, host, env);
}
function typeParametersWithDefaultTypes(params) {
  if (params === void 0) {
    return void 0;
  }
  return params.map((param) => {
    if (param.default === void 0) {
      return ts21.updateTypeParameterDeclaration(param, param.name, param.constraint, ts21.createKeywordTypeNode(ts21.SyntaxKind.AnyKeyword));
    } else {
      return param;
    }
  });
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/environment.mjs
var Environment = class {
  constructor(config, importManager, refEmitter, reflector, contextFile) {
    this.config = config;
    this.importManager = importManager;
    this.refEmitter = refEmitter;
    this.reflector = reflector;
    this.contextFile = contextFile;
    this.nextIds = {
      pipeInst: 1,
      typeCtor: 1
    };
    this.typeCtors = /* @__PURE__ */ new Map();
    this.typeCtorStatements = [];
    this.pipeInsts = /* @__PURE__ */ new Map();
    this.pipeInstStatements = [];
  }
  typeCtorFor(dir) {
    const dirRef = dir.ref;
    const node = dirRef.node;
    if (this.typeCtors.has(node)) {
      return this.typeCtors.get(node);
    }
    if (requiresInlineTypeCtor(node, this.reflector, this)) {
      const ref = this.reference(dirRef);
      const typeCtorExpr = ts22.createPropertyAccess(ref, "ngTypeCtor");
      this.typeCtors.set(node, typeCtorExpr);
      return typeCtorExpr;
    } else {
      const fnName = `_ctor${this.nextIds.typeCtor++}`;
      const nodeTypeRef = this.referenceType(dirRef);
      if (!ts22.isTypeReferenceNode(nodeTypeRef)) {
        throw new Error(`Expected TypeReferenceNode from reference to ${dirRef.debugName}`);
      }
      const meta = {
        fnName,
        body: true,
        fields: {
          inputs: dir.inputs.classPropertyNames,
          outputs: dir.outputs.classPropertyNames,
          queries: dir.queries
        },
        coercedInputFields: dir.coercedInputFields
      };
      const typeParams = this.emitTypeParameters(node);
      const typeCtor = generateTypeCtorDeclarationFn(node, meta, nodeTypeRef.typeName, typeParams);
      this.typeCtorStatements.push(typeCtor);
      const fnId = ts22.createIdentifier(fnName);
      this.typeCtors.set(node, fnId);
      return fnId;
    }
  }
  pipeInst(ref) {
    if (this.pipeInsts.has(ref.node)) {
      return this.pipeInsts.get(ref.node);
    }
    const pipeType = this.referenceType(ref);
    const pipeInstId = ts22.createIdentifier(`_pipe${this.nextIds.pipeInst++}`);
    this.pipeInstStatements.push(tsDeclareVariable(pipeInstId, pipeType));
    this.pipeInsts.set(ref.node, pipeInstId);
    return pipeInstId;
  }
  reference(ref) {
    const ngExpr = this.refEmitter.emit(ref, this.contextFile, ImportFlags.NoAliasing);
    assertSuccessfulReferenceEmit(ngExpr, this.contextFile, "class");
    return translateExpression(ngExpr.expression, this.importManager);
  }
  canReferenceType(ref) {
    const result = this.refEmitter.emit(ref, this.contextFile, ImportFlags.NoAliasing | ImportFlags.AllowTypeImports | ImportFlags.AllowRelativeDtsImports);
    return result.kind === 0;
  }
  referenceType(ref) {
    const ngExpr = this.refEmitter.emit(ref, this.contextFile, ImportFlags.NoAliasing | ImportFlags.AllowTypeImports | ImportFlags.AllowRelativeDtsImports);
    assertSuccessfulReferenceEmit(ngExpr, this.contextFile, "symbol");
    return translateType(new ExpressionType(ngExpr.expression), this.importManager);
  }
  emitTypeParameters(declaration) {
    const emitter = new TypeParameterEmitter(declaration.typeParameters, this.reflector);
    return emitter.emit((ref) => this.referenceType(ref));
  }
  referenceExternalType(moduleName, name, typeParams) {
    const external = new ExternalExpr2({ moduleName, name });
    return translateType(new ExpressionType(external, TypeModifier.None, typeParams), this.importManager);
  }
  getPreludeStatements() {
    return [
      ...this.pipeInstStatements,
      ...this.typeCtorStatements
    ];
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/oob.mjs
import { TmplAstElement as TmplAstElement2 } from "@angular/compiler";
import ts23 from "typescript";
var OutOfBandDiagnosticRecorderImpl = class {
  constructor(resolver) {
    this.resolver = resolver;
    this._diagnostics = [];
    this.recordedPipes = /* @__PURE__ */ new Set();
  }
  get diagnostics() {
    return this._diagnostics;
  }
  missingReferenceTarget(templateId, ref) {
    const mapping = this.resolver.getSourceMapping(templateId);
    const value = ref.value.trim();
    const errorMsg = `No directive found with exportAs '${value}'.`;
    this._diagnostics.push(makeTemplateDiagnostic(templateId, mapping, ref.valueSpan || ref.sourceSpan, ts23.DiagnosticCategory.Error, ngErrorCode(ErrorCode.MISSING_REFERENCE_TARGET), errorMsg));
  }
  missingPipe(templateId, ast) {
    if (this.recordedPipes.has(ast)) {
      return;
    }
    const mapping = this.resolver.getSourceMapping(templateId);
    const errorMsg = `No pipe found with name '${ast.name}'.`;
    const sourceSpan = this.resolver.toParseSourceSpan(templateId, ast.nameSpan);
    if (sourceSpan === null) {
      throw new Error(`Assertion failure: no SourceLocation found for usage of pipe '${ast.name}'.`);
    }
    this._diagnostics.push(makeTemplateDiagnostic(templateId, mapping, sourceSpan, ts23.DiagnosticCategory.Error, ngErrorCode(ErrorCode.MISSING_PIPE), errorMsg));
    this.recordedPipes.add(ast);
  }
  illegalAssignmentToTemplateVar(templateId, assignment, target) {
    var _a, _b;
    const mapping = this.resolver.getSourceMapping(templateId);
    const errorMsg = `Cannot use variable '${assignment.name}' as the left-hand side of an assignment expression. Template variables are read-only.`;
    const sourceSpan = this.resolver.toParseSourceSpan(templateId, assignment.sourceSpan);
    if (sourceSpan === null) {
      throw new Error(`Assertion failure: no SourceLocation found for property binding.`);
    }
    this._diagnostics.push(makeTemplateDiagnostic(templateId, mapping, sourceSpan, ts23.DiagnosticCategory.Error, ngErrorCode(ErrorCode.WRITE_TO_READ_ONLY_VARIABLE), errorMsg, [{
      text: `The variable ${assignment.name} is declared here.`,
      start: ((_a = target.valueSpan) == null ? void 0 : _a.start.offset) || target.sourceSpan.start.offset,
      end: ((_b = target.valueSpan) == null ? void 0 : _b.end.offset) || target.sourceSpan.end.offset,
      sourceFile: mapping.node.getSourceFile()
    }]));
  }
  duplicateTemplateVar(templateId, variable, firstDecl) {
    const mapping = this.resolver.getSourceMapping(templateId);
    const errorMsg = `Cannot redeclare variable '${variable.name}' as it was previously declared elsewhere for the same template.`;
    this._diagnostics.push(makeTemplateDiagnostic(templateId, mapping, variable.sourceSpan, ts23.DiagnosticCategory.Error, ngErrorCode(ErrorCode.DUPLICATE_VARIABLE_DECLARATION), errorMsg, [{
      text: `The variable '${firstDecl.name}' was first declared here.`,
      start: firstDecl.sourceSpan.start.offset,
      end: firstDecl.sourceSpan.end.offset,
      sourceFile: mapping.node.getSourceFile()
    }]));
  }
  requiresInlineTcb(templateId, node) {
    this._diagnostics.push(makeInlineDiagnostic(templateId, ErrorCode.INLINE_TCB_REQUIRED, node.name, `This component requires inline template type-checking, which is not supported by the current environment.`));
  }
  requiresInlineTypeConstructors(templateId, node, directives) {
    let message;
    if (directives.length > 1) {
      message = `This component uses directives which require inline type constructors, which are not supported by the current environment.`;
    } else {
      message = `This component uses a directive which requires an inline type constructor, which is not supported by the current environment.`;
    }
    this._diagnostics.push(makeInlineDiagnostic(templateId, ErrorCode.INLINE_TYPE_CTOR_REQUIRED, node.name, message, directives.map((dir) => makeRelatedInformation(dir.name, `Requires an inline type constructor.`))));
  }
  suboptimalTypeInference(templateId, variables) {
    const mapping = this.resolver.getSourceMapping(templateId);
    let diagnosticVar = null;
    for (const variable of variables) {
      if (diagnosticVar === null || (variable.value === "" || variable.value === "$implicit")) {
        diagnosticVar = variable;
      }
    }
    if (diagnosticVar === null) {
      return;
    }
    let varIdentification = `'${diagnosticVar.name}'`;
    if (variables.length === 2) {
      varIdentification += ` (and 1 other)`;
    } else if (variables.length > 2) {
      varIdentification += ` (and ${variables.length - 1} others)`;
    }
    const message = `This structural directive supports advanced type inference, but the current compiler configuration prevents its usage. The variable ${varIdentification} will have type 'any' as a result.

Consider enabling the 'strictTemplates' option in your tsconfig.json for better type inference within this template.`;
    this._diagnostics.push(makeTemplateDiagnostic(templateId, mapping, diagnosticVar.keySpan, ts23.DiagnosticCategory.Suggestion, ngErrorCode(ErrorCode.SUGGEST_SUBOPTIMAL_TYPE_INFERENCE), message));
  }
  splitTwoWayBinding(templateId, input, output, inputConsumer, outputConsumer) {
    const mapping = this.resolver.getSourceMapping(templateId);
    const errorMsg = `The property and event halves of the two-way binding '${input.name}' are not bound to the same target.
            Find more at https://angular.io/guide/two-way-binding#how-two-way-binding-works`;
    const relatedMessages = [];
    relatedMessages.push({
      text: `The property half of the binding is to the '${inputConsumer.name.text}' component.`,
      start: inputConsumer.name.getStart(),
      end: inputConsumer.name.getEnd(),
      sourceFile: inputConsumer.name.getSourceFile()
    });
    if (outputConsumer instanceof TmplAstElement2) {
      let message = `The event half of the binding is to a native event called '${input.name}' on the <${outputConsumer.name}> DOM element.`;
      if (!mapping.node.getSourceFile().isDeclarationFile) {
        message += `
 
 Are you missing an output declaration called '${output.name}'?`;
      }
      relatedMessages.push({
        text: message,
        start: outputConsumer.sourceSpan.start.offset + 1,
        end: outputConsumer.sourceSpan.start.offset + outputConsumer.name.length + 1,
        sourceFile: mapping.node.getSourceFile()
      });
    } else {
      relatedMessages.push({
        text: `The event half of the binding is to the '${outputConsumer.name.text}' component.`,
        start: outputConsumer.name.getStart(),
        end: outputConsumer.name.getEnd(),
        sourceFile: outputConsumer.name.getSourceFile()
      });
    }
    this._diagnostics.push(makeTemplateDiagnostic(templateId, mapping, input.keySpan, ts23.DiagnosticCategory.Error, ngErrorCode(ErrorCode.SPLIT_TWO_WAY_BINDING), errorMsg, relatedMessages));
  }
};
function makeInlineDiagnostic(templateId, code, node, messageText, relatedInformation) {
  return __spreadProps(__spreadValues({}, makeDiagnostic(code, node, messageText, relatedInformation)), {
    componentFile: node.getSourceFile(),
    templateId
  });
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/shim.mjs
import ts24 from "typescript";
var TypeCheckShimGenerator = class {
  constructor() {
    this.extensionPrefix = "ngtypecheck";
    this.shouldEmit = false;
  }
  generateShimForFile(sf, genFilePath, priorShimSf) {
    if (priorShimSf !== null) {
      return priorShimSf;
    }
    return ts24.createSourceFile(genFilePath, "export const USED_FOR_NG_TYPE_CHECKING = true;", ts24.ScriptTarget.Latest, true, ts24.ScriptKind.TS);
  }
  static shimFor(fileName) {
    return absoluteFrom(fileName.replace(/\.tsx?$/, ".ngtypecheck.ts"));
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_check_block.mjs
import { BindingPipe, Call as Call2, DYNAMIC_TYPE, ImplicitReceiver as ImplicitReceiver4, PropertyRead as PropertyRead4, PropertyWrite as PropertyWrite3, SafeCall, SafePropertyRead as SafePropertyRead3, ThisReceiver, TmplAstBoundAttribute, TmplAstBoundText, TmplAstElement as TmplAstElement3, TmplAstIcu, TmplAstReference as TmplAstReference3, TmplAstTemplate as TmplAstTemplate2, TmplAstTextAttribute as TmplAstTextAttribute2, TmplAstVariable as TmplAstVariable2 } from "@angular/compiler";
import ts27 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/diagnostics.mjs
import { AbsoluteSourceSpan as AbsoluteSourceSpan3 } from "@angular/compiler";
import ts25 from "typescript";
function wrapForDiagnostics(expr) {
  return ts25.createParen(expr);
}
function wrapForTypeChecker(expr) {
  return ts25.createParen(expr);
}
function addParseSpanInfo(node, span) {
  let commentText;
  if (span instanceof AbsoluteSourceSpan3) {
    commentText = `${span.start},${span.end}`;
  } else {
    commentText = `${span.start.offset},${span.end.offset}`;
  }
  ts25.addSyntheticTrailingComment(node, ts25.SyntaxKind.MultiLineCommentTrivia, commentText, false);
}
function addTemplateId(tcb, id) {
  ts25.addSyntheticLeadingComment(tcb, ts25.SyntaxKind.MultiLineCommentTrivia, id, true);
}
function shouldReportDiagnostic(diagnostic) {
  const { code } = diagnostic;
  if (code === 6133) {
    return false;
  } else if (code === 6199) {
    return false;
  } else if (code === 2695) {
    return false;
  } else if (code === 7006) {
    return false;
  }
  return true;
}
function translateDiagnostic(diagnostic, resolver) {
  if (diagnostic.file === void 0 || diagnostic.start === void 0) {
    return null;
  }
  const fullMapping = getTemplateMapping(diagnostic.file, diagnostic.start, resolver, true);
  if (fullMapping === null) {
    return null;
  }
  const { sourceLocation, templateSourceMapping, span } = fullMapping;
  return makeTemplateDiagnostic(sourceLocation.id, templateSourceMapping, span, diagnostic.category, diagnostic.code, diagnostic.messageText);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/expression.mjs
import { ASTWithSource as ASTWithSource2, Call, EmptyExpr as EmptyExpr2, PropertyRead as PropertyRead3, SafeKeyedRead, SafePropertyRead as SafePropertyRead2 } from "@angular/compiler";
import ts26 from "typescript";
var NULL_AS_ANY = ts26.createAsExpression(ts26.createNull(), ts26.createKeywordTypeNode(ts26.SyntaxKind.AnyKeyword));
var UNDEFINED = ts26.createIdentifier("undefined");
var UNARY_OPS = /* @__PURE__ */ new Map([
  ["+", ts26.SyntaxKind.PlusToken],
  ["-", ts26.SyntaxKind.MinusToken]
]);
var BINARY_OPS = /* @__PURE__ */ new Map([
  ["+", ts26.SyntaxKind.PlusToken],
  ["-", ts26.SyntaxKind.MinusToken],
  ["<", ts26.SyntaxKind.LessThanToken],
  [">", ts26.SyntaxKind.GreaterThanToken],
  ["<=", ts26.SyntaxKind.LessThanEqualsToken],
  [">=", ts26.SyntaxKind.GreaterThanEqualsToken],
  ["==", ts26.SyntaxKind.EqualsEqualsToken],
  ["===", ts26.SyntaxKind.EqualsEqualsEqualsToken],
  ["*", ts26.SyntaxKind.AsteriskToken],
  ["/", ts26.SyntaxKind.SlashToken],
  ["%", ts26.SyntaxKind.PercentToken],
  ["!=", ts26.SyntaxKind.ExclamationEqualsToken],
  ["!==", ts26.SyntaxKind.ExclamationEqualsEqualsToken],
  ["||", ts26.SyntaxKind.BarBarToken],
  ["&&", ts26.SyntaxKind.AmpersandAmpersandToken],
  ["&", ts26.SyntaxKind.AmpersandToken],
  ["|", ts26.SyntaxKind.BarToken],
  ["??", ts26.SyntaxKind.QuestionQuestionToken]
]);
function astToTypescript(ast, maybeResolve, config) {
  const translator = new AstTranslator(maybeResolve, config);
  return translator.translate(ast);
}
var AstTranslator = class {
  constructor(maybeResolve, config) {
    this.maybeResolve = maybeResolve;
    this.config = config;
  }
  translate(ast) {
    if (ast instanceof ASTWithSource2) {
      ast = ast.ast;
    }
    if (ast instanceof EmptyExpr2) {
      const res = ts26.factory.createIdentifier("undefined");
      addParseSpanInfo(res, ast.sourceSpan);
      return res;
    }
    const resolved = this.maybeResolve(ast);
    if (resolved !== null) {
      return resolved;
    }
    return ast.visit(this);
  }
  visitUnary(ast) {
    const expr = this.translate(ast.expr);
    const op = UNARY_OPS.get(ast.operator);
    if (op === void 0) {
      throw new Error(`Unsupported Unary.operator: ${ast.operator}`);
    }
    const node = wrapForDiagnostics(ts26.createPrefix(op, expr));
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitBinary(ast) {
    const lhs = wrapForDiagnostics(this.translate(ast.left));
    const rhs = wrapForDiagnostics(this.translate(ast.right));
    const op = BINARY_OPS.get(ast.operation);
    if (op === void 0) {
      throw new Error(`Unsupported Binary.operation: ${ast.operation}`);
    }
    const node = ts26.createBinary(lhs, op, rhs);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitChain(ast) {
    const elements = ast.expressions.map((expr) => this.translate(expr));
    const node = wrapForDiagnostics(ts26.createCommaList(elements));
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitConditional(ast) {
    const condExpr = this.translate(ast.condition);
    const trueExpr = this.translate(ast.trueExp);
    const falseExpr = wrapForTypeChecker(this.translate(ast.falseExp));
    const node = ts26.createParen(ts26.createConditional(condExpr, trueExpr, falseExpr));
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitImplicitReceiver(ast) {
    throw new Error("Method not implemented.");
  }
  visitThisReceiver(ast) {
    throw new Error("Method not implemented.");
  }
  visitInterpolation(ast) {
    return ast.expressions.reduce((lhs, ast2) => ts26.createBinary(lhs, ts26.SyntaxKind.PlusToken, wrapForTypeChecker(this.translate(ast2))), ts26.createLiteral(""));
  }
  visitKeyedRead(ast) {
    const receiver = wrapForDiagnostics(this.translate(ast.receiver));
    const key = this.translate(ast.key);
    const node = ts26.createElementAccess(receiver, key);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitKeyedWrite(ast) {
    const receiver = wrapForDiagnostics(this.translate(ast.receiver));
    const left = ts26.createElementAccess(receiver, this.translate(ast.key));
    const right = wrapForTypeChecker(this.translate(ast.value));
    const node = wrapForDiagnostics(ts26.createBinary(left, ts26.SyntaxKind.EqualsToken, right));
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitLiteralArray(ast) {
    const elements = ast.expressions.map((expr) => this.translate(expr));
    const literal = ts26.createArrayLiteral(elements);
    const node = this.config.strictLiteralTypes ? literal : tsCastToAny(literal);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitLiteralMap(ast) {
    const properties = ast.keys.map(({ key }, idx) => {
      const value = this.translate(ast.values[idx]);
      return ts26.createPropertyAssignment(ts26.createStringLiteral(key), value);
    });
    const literal = ts26.createObjectLiteral(properties, true);
    const node = this.config.strictLiteralTypes ? literal : tsCastToAny(literal);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitLiteralPrimitive(ast) {
    let node;
    if (ast.value === void 0) {
      node = ts26.createIdentifier("undefined");
    } else if (ast.value === null) {
      node = ts26.createNull();
    } else {
      node = ts26.createLiteral(ast.value);
    }
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitNonNullAssert(ast) {
    const expr = wrapForDiagnostics(this.translate(ast.expression));
    const node = ts26.createNonNullExpression(expr);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitPipe(ast) {
    throw new Error("Method not implemented.");
  }
  visitPrefixNot(ast) {
    const expression = wrapForDiagnostics(this.translate(ast.expression));
    const node = ts26.createLogicalNot(expression);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitPropertyRead(ast) {
    const receiver = wrapForDiagnostics(this.translate(ast.receiver));
    const name = ts26.createPropertyAccess(receiver, ast.name);
    addParseSpanInfo(name, ast.nameSpan);
    const node = wrapForDiagnostics(name);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitPropertyWrite(ast) {
    const receiver = wrapForDiagnostics(this.translate(ast.receiver));
    const left = ts26.createPropertyAccess(receiver, ast.name);
    addParseSpanInfo(left, ast.nameSpan);
    const leftWithPath = wrapForDiagnostics(left);
    addParseSpanInfo(leftWithPath, ast.sourceSpan);
    const right = wrapForTypeChecker(this.translate(ast.value));
    const node = wrapForDiagnostics(ts26.createBinary(leftWithPath, ts26.SyntaxKind.EqualsToken, right));
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitQuote(ast) {
    return NULL_AS_ANY;
  }
  visitSafePropertyRead(ast) {
    let node;
    const receiver = wrapForDiagnostics(this.translate(ast.receiver));
    if (this.config.strictSafeNavigationTypes) {
      const expr = ts26.createPropertyAccess(ts26.createNonNullExpression(receiver), ast.name);
      addParseSpanInfo(expr, ast.nameSpan);
      node = ts26.createParen(ts26.createConditional(NULL_AS_ANY, expr, UNDEFINED));
    } else if (VeSafeLhsInferenceBugDetector.veWillInferAnyFor(ast)) {
      node = ts26.createPropertyAccess(tsCastToAny(receiver), ast.name);
    } else {
      const expr = ts26.createPropertyAccess(ts26.createNonNullExpression(receiver), ast.name);
      addParseSpanInfo(expr, ast.nameSpan);
      node = tsCastToAny(expr);
    }
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitSafeKeyedRead(ast) {
    const receiver = wrapForDiagnostics(this.translate(ast.receiver));
    const key = this.translate(ast.key);
    let node;
    if (this.config.strictSafeNavigationTypes) {
      const expr = ts26.createElementAccess(ts26.createNonNullExpression(receiver), key);
      addParseSpanInfo(expr, ast.sourceSpan);
      node = ts26.createParen(ts26.createConditional(NULL_AS_ANY, expr, UNDEFINED));
    } else if (VeSafeLhsInferenceBugDetector.veWillInferAnyFor(ast)) {
      node = ts26.createElementAccess(tsCastToAny(receiver), key);
    } else {
      const expr = ts26.createElementAccess(ts26.createNonNullExpression(receiver), key);
      addParseSpanInfo(expr, ast.sourceSpan);
      node = tsCastToAny(expr);
    }
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitCall(ast) {
    const args = ast.args.map((expr2) => this.translate(expr2));
    let expr;
    const receiver = ast.receiver;
    if (receiver instanceof PropertyRead3) {
      const resolved = this.maybeResolve(receiver);
      if (resolved !== null) {
        expr = resolved;
      } else {
        const propertyReceiver = wrapForDiagnostics(this.translate(receiver.receiver));
        expr = ts26.createPropertyAccess(propertyReceiver, receiver.name);
        addParseSpanInfo(expr, receiver.nameSpan);
      }
    } else {
      expr = this.translate(receiver);
    }
    let node;
    if (ast.receiver instanceof SafePropertyRead2 || ast.receiver instanceof SafeKeyedRead) {
      node = this.convertToSafeCall(ast, expr, args);
    } else {
      node = ts26.createCall(expr, void 0, args);
    }
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  visitSafeCall(ast) {
    const args = ast.args.map((expr2) => this.translate(expr2));
    const expr = wrapForDiagnostics(this.translate(ast.receiver));
    const node = this.convertToSafeCall(ast, expr, args);
    addParseSpanInfo(node, ast.sourceSpan);
    return node;
  }
  convertToSafeCall(ast, expr, args) {
    if (this.config.strictSafeNavigationTypes) {
      const call = ts26.createCall(ts26.createNonNullExpression(expr), void 0, args);
      return ts26.createParen(ts26.createConditional(NULL_AS_ANY, call, UNDEFINED));
    }
    if (VeSafeLhsInferenceBugDetector.veWillInferAnyFor(ast)) {
      return ts26.createCall(tsCastToAny(expr), void 0, args);
    }
    return tsCastToAny(ts26.createCall(ts26.createNonNullExpression(expr), void 0, args));
  }
};
var VeSafeLhsInferenceBugDetector = class {
  static veWillInferAnyFor(ast) {
    const visitor = VeSafeLhsInferenceBugDetector.SINGLETON;
    return ast instanceof Call ? ast.visit(visitor) : ast.receiver.visit(visitor);
  }
  visitUnary(ast) {
    return ast.expr.visit(this);
  }
  visitBinary(ast) {
    return ast.left.visit(this) || ast.right.visit(this);
  }
  visitChain(ast) {
    return false;
  }
  visitConditional(ast) {
    return ast.condition.visit(this) || ast.trueExp.visit(this) || ast.falseExp.visit(this);
  }
  visitCall(ast) {
    return true;
  }
  visitSafeCall(ast) {
    return false;
  }
  visitImplicitReceiver(ast) {
    return false;
  }
  visitThisReceiver(ast) {
    return false;
  }
  visitInterpolation(ast) {
    return ast.expressions.some((exp) => exp.visit(this));
  }
  visitKeyedRead(ast) {
    return false;
  }
  visitKeyedWrite(ast) {
    return false;
  }
  visitLiteralArray(ast) {
    return true;
  }
  visitLiteralMap(ast) {
    return true;
  }
  visitLiteralPrimitive(ast) {
    return false;
  }
  visitPipe(ast) {
    return true;
  }
  visitPrefixNot(ast) {
    return ast.expression.visit(this);
  }
  visitNonNullAssert(ast) {
    return ast.expression.visit(this);
  }
  visitPropertyRead(ast) {
    return false;
  }
  visitPropertyWrite(ast) {
    return false;
  }
  visitQuote(ast) {
    return false;
  }
  visitSafePropertyRead(ast) {
    return false;
  }
  visitSafeKeyedRead(ast) {
    return false;
  }
};
VeSafeLhsInferenceBugDetector.SINGLETON = new VeSafeLhsInferenceBugDetector();

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/template_semantics.mjs
import { ImplicitReceiver as ImplicitReceiver3, RecursiveAstVisitor as RecursiveAstVisitor2, TmplAstVariable } from "@angular/compiler";
var ExpressionSemanticVisitor = class extends RecursiveAstVisitor2 {
  constructor(templateId, boundTarget, oob) {
    super();
    this.templateId = templateId;
    this.boundTarget = boundTarget;
    this.oob = oob;
  }
  visitPropertyWrite(ast, context) {
    super.visitPropertyWrite(ast, context);
    if (!(ast.receiver instanceof ImplicitReceiver3)) {
      return;
    }
    const target = this.boundTarget.getExpressionTarget(ast);
    if (target instanceof TmplAstVariable) {
      this.oob.illegalAssignmentToTemplateVar(this.templateId, ast, target);
    }
  }
  static visit(ast, id, boundTarget, oob) {
    ast.visit(new ExpressionSemanticVisitor(id, boundTarget, oob));
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_check_block.mjs
var TcbGenericContextBehavior;
(function(TcbGenericContextBehavior2) {
  TcbGenericContextBehavior2[TcbGenericContextBehavior2["UseEmitter"] = 0] = "UseEmitter";
  TcbGenericContextBehavior2[TcbGenericContextBehavior2["CopyClassNodes"] = 1] = "CopyClassNodes";
  TcbGenericContextBehavior2[TcbGenericContextBehavior2["FallbackToAny"] = 2] = "FallbackToAny";
})(TcbGenericContextBehavior || (TcbGenericContextBehavior = {}));
function generateTypeCheckBlock(env, ref, name, meta, domSchemaChecker, oobRecorder, genericContextBehavior) {
  const tcb = new Context(env, domSchemaChecker, oobRecorder, meta.id, meta.boundTarget, meta.pipes, meta.schemas);
  const scope = Scope.forNodes(tcb, null, tcb.boundTarget.target.template, null);
  const ctxRawType = env.referenceType(ref);
  if (!ts27.isTypeReferenceNode(ctxRawType)) {
    throw new Error(`Expected TypeReferenceNode when referencing the ctx param for ${ref.debugName}`);
  }
  let typeParameters = void 0;
  let typeArguments = void 0;
  if (ref.node.typeParameters !== void 0) {
    if (!env.config.useContextGenericType) {
      genericContextBehavior = TcbGenericContextBehavior.FallbackToAny;
    }
    switch (genericContextBehavior) {
      case TcbGenericContextBehavior.UseEmitter:
        typeParameters = new TypeParameterEmitter(ref.node.typeParameters, env.reflector).emit((typeRef) => env.referenceType(typeRef));
        typeArguments = typeParameters.map((param) => ts27.factory.createTypeReferenceNode(param.name));
        break;
      case TcbGenericContextBehavior.CopyClassNodes:
        typeParameters = [...ref.node.typeParameters];
        typeArguments = typeParameters.map((param) => ts27.factory.createTypeReferenceNode(param.name));
        break;
      case TcbGenericContextBehavior.FallbackToAny:
        typeArguments = ref.node.typeParameters.map(() => ts27.factory.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword));
        break;
    }
  }
  const paramList = [tcbCtxParam(ref.node, ctxRawType.typeName, typeArguments)];
  const scopeStatements = scope.render();
  const innerBody = ts27.createBlock([
    ...env.getPreludeStatements(),
    ...scopeStatements
  ]);
  const body = ts27.createBlock([ts27.createIf(ts27.createTrue(), innerBody, void 0)]);
  const fnDecl = ts27.createFunctionDeclaration(void 0, void 0, void 0, name, env.config.useContextGenericType ? typeParameters : void 0, paramList, void 0, body);
  addTemplateId(fnDecl, meta.id);
  return fnDecl;
}
var TcbOp = class {
  circularFallback() {
    return INFER_TYPE_FOR_CIRCULAR_OP_EXPR;
  }
};
var TcbElementOp = class extends TcbOp {
  constructor(tcb, scope, element) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.element = element;
  }
  get optional() {
    return true;
  }
  execute() {
    const id = this.tcb.allocateId();
    const initializer = tsCreateElement(this.element.name);
    addParseSpanInfo(initializer, this.element.startSourceSpan || this.element.sourceSpan);
    this.scope.addStatement(tsCreateVariable(id, initializer));
    return id;
  }
};
var TcbVariableOp = class extends TcbOp {
  constructor(tcb, scope, template, variable) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.template = template;
    this.variable = variable;
  }
  get optional() {
    return false;
  }
  execute() {
    const ctx = this.scope.resolve(this.template);
    const id = this.tcb.allocateId();
    const initializer = ts27.createPropertyAccess(ctx, this.variable.value || "$implicit");
    addParseSpanInfo(id, this.variable.keySpan);
    let variable;
    if (this.variable.valueSpan !== void 0) {
      addParseSpanInfo(initializer, this.variable.valueSpan);
      variable = tsCreateVariable(id, wrapForTypeChecker(initializer));
    } else {
      variable = tsCreateVariable(id, initializer);
    }
    addParseSpanInfo(variable.declarationList.declarations[0], this.variable.sourceSpan);
    this.scope.addStatement(variable);
    return id;
  }
};
var TcbTemplateContextOp = class extends TcbOp {
  constructor(tcb, scope) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.optional = true;
  }
  execute() {
    const ctx = this.tcb.allocateId();
    const type = ts27.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword);
    this.scope.addStatement(tsDeclareVariable(ctx, type));
    return ctx;
  }
};
var TcbTemplateBodyOp = class extends TcbOp {
  constructor(tcb, scope, template) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.template = template;
  }
  get optional() {
    return false;
  }
  execute() {
    const directiveGuards = [];
    const directives = this.tcb.boundTarget.getDirectivesOfNode(this.template);
    if (directives !== null) {
      for (const dir of directives) {
        const dirInstId = this.scope.resolve(this.template, dir);
        const dirId = this.tcb.env.reference(dir.ref);
        dir.ngTemplateGuards.forEach((guard2) => {
          const boundInput = this.template.inputs.find((i) => i.name === guard2.inputName) || this.template.templateAttrs.find((i) => i instanceof TmplAstBoundAttribute && i.name === guard2.inputName);
          if (boundInput !== void 0) {
            const expr = tcbExpression(boundInput.value, this.tcb, this.scope);
            markIgnoreDiagnostics(expr);
            if (guard2.type === "binding") {
              directiveGuards.push(expr);
            } else {
              const guardInvoke = tsCallMethod(dirId, `ngTemplateGuard_${guard2.inputName}`, [
                dirInstId,
                expr
              ]);
              addParseSpanInfo(guardInvoke, boundInput.value.sourceSpan);
              directiveGuards.push(guardInvoke);
            }
          }
        });
        if (dir.hasNgTemplateContextGuard) {
          if (this.tcb.env.config.applyTemplateContextGuards) {
            const ctx = this.scope.resolve(this.template);
            const guardInvoke = tsCallMethod(dirId, "ngTemplateContextGuard", [dirInstId, ctx]);
            addParseSpanInfo(guardInvoke, this.template.sourceSpan);
            directiveGuards.push(guardInvoke);
          } else if (this.template.variables.length > 0 && this.tcb.env.config.suggestionsForSuboptimalTypeInference) {
            this.tcb.oobRecorder.suboptimalTypeInference(this.tcb.id, this.template.variables);
          }
        }
      }
    }
    let guard = null;
    if (directiveGuards.length > 0) {
      guard = directiveGuards.reduce((expr, dirGuard) => ts27.createBinary(expr, ts27.SyntaxKind.AmpersandAmpersandToken, dirGuard), directiveGuards.pop());
    }
    const tmplScope = Scope.forNodes(this.tcb, this.scope, this.template, guard);
    const statements = tmplScope.render();
    if (statements.length === 0) {
      return null;
    }
    let tmplBlock = ts27.createBlock(statements);
    if (guard !== null) {
      tmplBlock = ts27.createIf(guard, tmplBlock);
    }
    this.scope.addStatement(tmplBlock);
    return null;
  }
};
var TcbTextInterpolationOp = class extends TcbOp {
  constructor(tcb, scope, binding) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.binding = binding;
  }
  get optional() {
    return false;
  }
  execute() {
    const expr = tcbExpression(this.binding.value, this.tcb, this.scope);
    this.scope.addStatement(ts27.createExpressionStatement(expr));
    return null;
  }
};
var TcbDirectiveTypeOpBase = class extends TcbOp {
  constructor(tcb, scope, node, dir) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.node = node;
    this.dir = dir;
  }
  get optional() {
    return true;
  }
  execute() {
    const dirRef = this.dir.ref;
    const rawType = this.tcb.env.referenceType(this.dir.ref);
    let type;
    if (this.dir.isGeneric === false || dirRef.node.typeParameters === void 0) {
      type = rawType;
    } else {
      if (!ts27.isTypeReferenceNode(rawType)) {
        throw new Error(`Expected TypeReferenceNode when referencing the type for ${this.dir.ref.debugName}`);
      }
      const typeArguments = dirRef.node.typeParameters.map(() => ts27.factory.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword));
      type = ts27.factory.createTypeReferenceNode(rawType.typeName, typeArguments);
    }
    const id = this.tcb.allocateId();
    addExpressionIdentifier(type, ExpressionIdentifier.DIRECTIVE);
    addParseSpanInfo(type, this.node.startSourceSpan || this.node.sourceSpan);
    this.scope.addStatement(tsDeclareVariable(id, type));
    return id;
  }
};
var TcbNonGenericDirectiveTypeOp = class extends TcbDirectiveTypeOpBase {
  execute() {
    const dirRef = this.dir.ref;
    if (this.dir.isGeneric) {
      throw new Error(`Assertion Error: expected ${dirRef.debugName} not to be generic.`);
    }
    return super.execute();
  }
};
var TcbGenericDirectiveTypeWithAnyParamsOp = class extends TcbDirectiveTypeOpBase {
  execute() {
    const dirRef = this.dir.ref;
    if (dirRef.node.typeParameters === void 0) {
      throw new Error(`Assertion Error: expected typeParameters when creating a declaration for ${dirRef.debugName}`);
    }
    return super.execute();
  }
};
var TcbReferenceOp = class extends TcbOp {
  constructor(tcb, scope, node, host, target) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.node = node;
    this.host = host;
    this.target = target;
    this.optional = true;
  }
  execute() {
    const id = this.tcb.allocateId();
    let initializer = this.target instanceof TmplAstTemplate2 || this.target instanceof TmplAstElement3 ? this.scope.resolve(this.target) : this.scope.resolve(this.host, this.target);
    if (this.target instanceof TmplAstElement3 && !this.tcb.env.config.checkTypeOfDomReferences || !this.tcb.env.config.checkTypeOfNonDomReferences) {
      initializer = ts27.createAsExpression(initializer, ts27.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword));
    } else if (this.target instanceof TmplAstTemplate2) {
      initializer = ts27.createAsExpression(initializer, ts27.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword));
      initializer = ts27.createAsExpression(initializer, this.tcb.env.referenceExternalType("@angular/core", "TemplateRef", [DYNAMIC_TYPE]));
      initializer = ts27.createParen(initializer);
    }
    addParseSpanInfo(initializer, this.node.sourceSpan);
    addParseSpanInfo(id, this.node.keySpan);
    this.scope.addStatement(tsCreateVariable(id, initializer));
    return id;
  }
};
var TcbInvalidReferenceOp = class extends TcbOp {
  constructor(tcb, scope) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.optional = true;
  }
  execute() {
    const id = this.tcb.allocateId();
    this.scope.addStatement(tsCreateVariable(id, NULL_AS_ANY));
    return id;
  }
};
var TcbDirectiveCtorOp = class extends TcbOp {
  constructor(tcb, scope, node, dir) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.node = node;
    this.dir = dir;
  }
  get optional() {
    return true;
  }
  execute() {
    const id = this.tcb.allocateId();
    addExpressionIdentifier(id, ExpressionIdentifier.DIRECTIVE);
    addParseSpanInfo(id, this.node.startSourceSpan || this.node.sourceSpan);
    const genericInputs = /* @__PURE__ */ new Map();
    const inputs = getBoundInputs(this.dir, this.node, this.tcb);
    for (const input of inputs) {
      if (!this.tcb.env.config.checkTypeOfAttributes && input.attribute instanceof TmplAstTextAttribute2) {
        continue;
      }
      for (const fieldName of input.fieldNames) {
        if (genericInputs.has(fieldName)) {
          continue;
        }
        const expression = translateInput(input.attribute, this.tcb, this.scope);
        genericInputs.set(fieldName, {
          type: "binding",
          field: fieldName,
          expression,
          sourceSpan: input.attribute.sourceSpan
        });
      }
    }
    for (const [fieldName] of this.dir.inputs) {
      if (!genericInputs.has(fieldName)) {
        genericInputs.set(fieldName, { type: "unset", field: fieldName });
      }
    }
    const typeCtor = tcbCallTypeCtor(this.dir, this.tcb, Array.from(genericInputs.values()));
    markIgnoreDiagnostics(typeCtor);
    this.scope.addStatement(tsCreateVariable(id, typeCtor));
    return id;
  }
  circularFallback() {
    return new TcbDirectiveCtorCircularFallbackOp(this.tcb, this.scope, this.node, this.dir);
  }
};
var TcbDirectiveInputsOp = class extends TcbOp {
  constructor(tcb, scope, node, dir) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.node = node;
    this.dir = dir;
  }
  get optional() {
    return false;
  }
  execute() {
    let dirId = null;
    const inputs = getBoundInputs(this.dir, this.node, this.tcb);
    for (const input of inputs) {
      const expr = widenBinding(translateInput(input.attribute, this.tcb, this.scope), this.tcb);
      let assignment = wrapForDiagnostics(expr);
      for (const fieldName of input.fieldNames) {
        let target;
        if (this.dir.coercedInputFields.has(fieldName)) {
          const dirTypeRef = this.tcb.env.referenceType(this.dir.ref);
          if (!ts27.isTypeReferenceNode(dirTypeRef)) {
            throw new Error(`Expected TypeReferenceNode from reference to ${this.dir.ref.debugName}`);
          }
          const id = this.tcb.allocateId();
          const type = tsCreateTypeQueryForCoercedInput(dirTypeRef.typeName, fieldName);
          this.scope.addStatement(tsDeclareVariable(id, type));
          target = id;
        } else if (this.dir.undeclaredInputFields.has(fieldName)) {
          continue;
        } else if (!this.tcb.env.config.honorAccessModifiersForInputBindings && this.dir.restrictedInputFields.has(fieldName)) {
          if (dirId === null) {
            dirId = this.scope.resolve(this.node, this.dir);
          }
          const id = this.tcb.allocateId();
          const dirTypeRef = this.tcb.env.referenceType(this.dir.ref);
          if (!ts27.isTypeReferenceNode(dirTypeRef)) {
            throw new Error(`Expected TypeReferenceNode from reference to ${this.dir.ref.debugName}`);
          }
          const type = ts27.createIndexedAccessTypeNode(ts27.createTypeQueryNode(dirId), ts27.createLiteralTypeNode(ts27.createStringLiteral(fieldName)));
          const temp = tsDeclareVariable(id, type);
          this.scope.addStatement(temp);
          target = id;
        } else {
          if (dirId === null) {
            dirId = this.scope.resolve(this.node, this.dir);
          }
          target = this.dir.stringLiteralInputFields.has(fieldName) ? ts27.createElementAccess(dirId, ts27.createStringLiteral(fieldName)) : ts27.createPropertyAccess(dirId, ts27.createIdentifier(fieldName));
        }
        if (input.attribute.keySpan !== void 0) {
          addParseSpanInfo(target, input.attribute.keySpan);
        }
        assignment = ts27.createBinary(target, ts27.SyntaxKind.EqualsToken, assignment);
      }
      addParseSpanInfo(assignment, input.attribute.sourceSpan);
      if (!this.tcb.env.config.checkTypeOfAttributes && input.attribute instanceof TmplAstTextAttribute2) {
        markIgnoreDiagnostics(assignment);
      }
      this.scope.addStatement(ts27.createExpressionStatement(assignment));
    }
    return null;
  }
};
var TcbDirectiveCtorCircularFallbackOp = class extends TcbOp {
  constructor(tcb, scope, node, dir) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.node = node;
    this.dir = dir;
  }
  get optional() {
    return false;
  }
  execute() {
    const id = this.tcb.allocateId();
    const typeCtor = this.tcb.env.typeCtorFor(this.dir);
    const circularPlaceholder = ts27.createCall(typeCtor, void 0, [ts27.createNonNullExpression(ts27.createNull())]);
    this.scope.addStatement(tsCreateVariable(id, circularPlaceholder));
    return id;
  }
};
var TcbDomSchemaCheckerOp = class extends TcbOp {
  constructor(tcb, element, checkElement, claimedInputs) {
    super();
    this.tcb = tcb;
    this.element = element;
    this.checkElement = checkElement;
    this.claimedInputs = claimedInputs;
  }
  get optional() {
    return false;
  }
  execute() {
    if (this.checkElement) {
      this.tcb.domSchemaChecker.checkElement(this.tcb.id, this.element, this.tcb.schemas);
    }
    for (const binding of this.element.inputs) {
      if (binding.type === 0 && this.claimedInputs.has(binding.name)) {
        continue;
      }
      if (binding.type === 0) {
        if (binding.name !== "style" && binding.name !== "class") {
          const propertyName = ATTR_TO_PROP[binding.name] || binding.name;
          this.tcb.domSchemaChecker.checkProperty(this.tcb.id, this.element, propertyName, binding.sourceSpan, this.tcb.schemas);
        }
      }
    }
    return null;
  }
};
var ATTR_TO_PROP = {
  "class": "className",
  "for": "htmlFor",
  "formaction": "formAction",
  "innerHtml": "innerHTML",
  "readonly": "readOnly",
  "tabindex": "tabIndex"
};
var TcbUnclaimedInputsOp = class extends TcbOp {
  constructor(tcb, scope, element, claimedInputs) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.element = element;
    this.claimedInputs = claimedInputs;
  }
  get optional() {
    return false;
  }
  execute() {
    let elId = null;
    for (const binding of this.element.inputs) {
      if (binding.type === 0 && this.claimedInputs.has(binding.name)) {
        continue;
      }
      const expr = widenBinding(tcbExpression(binding.value, this.tcb, this.scope), this.tcb);
      if (this.tcb.env.config.checkTypeOfDomBindings && binding.type === 0) {
        if (binding.name !== "style" && binding.name !== "class") {
          if (elId === null) {
            elId = this.scope.resolve(this.element);
          }
          const propertyName = ATTR_TO_PROP[binding.name] || binding.name;
          const prop = ts27.createElementAccess(elId, ts27.createStringLiteral(propertyName));
          const stmt = ts27.createBinary(prop, ts27.SyntaxKind.EqualsToken, wrapForDiagnostics(expr));
          addParseSpanInfo(stmt, binding.sourceSpan);
          this.scope.addStatement(ts27.createExpressionStatement(stmt));
        } else {
          this.scope.addStatement(ts27.createExpressionStatement(expr));
        }
      } else {
        this.scope.addStatement(ts27.createExpressionStatement(expr));
      }
    }
    return null;
  }
};
var TcbDirectiveOutputsOp = class extends TcbOp {
  constructor(tcb, scope, node, dir) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.node = node;
    this.dir = dir;
  }
  get optional() {
    return false;
  }
  execute() {
    let dirId = null;
    const outputs = this.dir.outputs;
    for (const output of this.node.outputs) {
      if (output.type !== 0 || !outputs.hasBindingPropertyName(output.name)) {
        continue;
      }
      if (this.tcb.env.config.checkTypeOfOutputEvents && output.name.endsWith("Change")) {
        const inputName = output.name.slice(0, -6);
        isSplitTwoWayBinding(inputName, output, this.node.inputs, this.tcb);
      }
      const field = outputs.getByBindingPropertyName(output.name)[0].classPropertyName;
      if (dirId === null) {
        dirId = this.scope.resolve(this.node, this.dir);
      }
      const outputField = ts27.createElementAccess(dirId, ts27.createStringLiteral(field));
      addParseSpanInfo(outputField, output.keySpan);
      if (this.tcb.env.config.checkTypeOfOutputEvents) {
        const handler = tcbCreateEventHandler(output, this.tcb, this.scope, 0);
        const subscribeFn = ts27.createPropertyAccess(outputField, "subscribe");
        const call = ts27.createCall(subscribeFn, void 0, [handler]);
        addParseSpanInfo(call, output.sourceSpan);
        this.scope.addStatement(ts27.createExpressionStatement(call));
      } else {
        this.scope.addStatement(ts27.createExpressionStatement(outputField));
        const handler = tcbCreateEventHandler(output, this.tcb, this.scope, 1);
        this.scope.addStatement(ts27.createExpressionStatement(handler));
      }
      ExpressionSemanticVisitor.visit(output.handler, this.tcb.id, this.tcb.boundTarget, this.tcb.oobRecorder);
    }
    return null;
  }
};
var TcbUnclaimedOutputsOp = class extends TcbOp {
  constructor(tcb, scope, element, claimedOutputs) {
    super();
    this.tcb = tcb;
    this.scope = scope;
    this.element = element;
    this.claimedOutputs = claimedOutputs;
  }
  get optional() {
    return false;
  }
  execute() {
    let elId = null;
    for (const output of this.element.outputs) {
      if (this.claimedOutputs.has(output.name)) {
        continue;
      }
      if (this.tcb.env.config.checkTypeOfOutputEvents && output.name.endsWith("Change")) {
        const inputName = output.name.slice(0, -6);
        if (isSplitTwoWayBinding(inputName, output, this.element.inputs, this.tcb)) {
          continue;
        }
      }
      if (output.type === 1) {
        const eventType = this.tcb.env.config.checkTypeOfAnimationEvents ? this.tcb.env.referenceExternalType("@angular/animations", "AnimationEvent") : 1;
        const handler = tcbCreateEventHandler(output, this.tcb, this.scope, eventType);
        this.scope.addStatement(ts27.createExpressionStatement(handler));
      } else if (this.tcb.env.config.checkTypeOfDomEvents) {
        const handler = tcbCreateEventHandler(output, this.tcb, this.scope, 0);
        if (elId === null) {
          elId = this.scope.resolve(this.element);
        }
        const propertyAccess = ts27.createPropertyAccess(elId, "addEventListener");
        addParseSpanInfo(propertyAccess, output.keySpan);
        const call = ts27.createCall(propertyAccess, void 0, [ts27.createStringLiteral(output.name), handler]);
        addParseSpanInfo(call, output.sourceSpan);
        this.scope.addStatement(ts27.createExpressionStatement(call));
      } else {
        const handler = tcbCreateEventHandler(output, this.tcb, this.scope, 1);
        this.scope.addStatement(ts27.createExpressionStatement(handler));
      }
      ExpressionSemanticVisitor.visit(output.handler, this.tcb.id, this.tcb.boundTarget, this.tcb.oobRecorder);
    }
    return null;
  }
};
var TcbComponentContextCompletionOp = class extends TcbOp {
  constructor(scope) {
    super();
    this.scope = scope;
    this.optional = false;
  }
  execute() {
    const ctx = ts27.createIdentifier("ctx");
    const ctxDot = ts27.createPropertyAccess(ctx, "");
    markIgnoreDiagnostics(ctxDot);
    addExpressionIdentifier(ctxDot, ExpressionIdentifier.COMPONENT_COMPLETION);
    this.scope.addStatement(ts27.createExpressionStatement(ctxDot));
    return null;
  }
};
var INFER_TYPE_FOR_CIRCULAR_OP_EXPR = ts27.createNonNullExpression(ts27.createNull());
var Context = class {
  constructor(env, domSchemaChecker, oobRecorder, id, boundTarget, pipes, schemas) {
    this.env = env;
    this.domSchemaChecker = domSchemaChecker;
    this.oobRecorder = oobRecorder;
    this.id = id;
    this.boundTarget = boundTarget;
    this.pipes = pipes;
    this.schemas = schemas;
    this.nextId = 1;
  }
  allocateId() {
    return ts27.createIdentifier(`_t${this.nextId++}`);
  }
  getPipeByName(name) {
    if (!this.pipes.has(name)) {
      return null;
    }
    return this.pipes.get(name);
  }
};
var Scope = class {
  constructor(tcb, parent = null, guard = null) {
    this.tcb = tcb;
    this.parent = parent;
    this.guard = guard;
    this.opQueue = [];
    this.elementOpMap = /* @__PURE__ */ new Map();
    this.directiveOpMap = /* @__PURE__ */ new Map();
    this.referenceOpMap = /* @__PURE__ */ new Map();
    this.templateCtxOpMap = /* @__PURE__ */ new Map();
    this.varMap = /* @__PURE__ */ new Map();
    this.statements = [];
  }
  static forNodes(tcb, parent, templateOrNodes, guard) {
    const scope = new Scope(tcb, parent, guard);
    if (parent === null && tcb.env.config.enableTemplateTypeChecker) {
      scope.opQueue.push(new TcbComponentContextCompletionOp(scope));
    }
    let children;
    if (templateOrNodes instanceof TmplAstTemplate2) {
      const varMap = /* @__PURE__ */ new Map();
      for (const v of templateOrNodes.variables) {
        if (!varMap.has(v.name)) {
          varMap.set(v.name, v);
        } else {
          const firstDecl = varMap.get(v.name);
          tcb.oobRecorder.duplicateTemplateVar(tcb.id, v, firstDecl);
        }
        const opIndex = scope.opQueue.push(new TcbVariableOp(tcb, scope, templateOrNodes, v)) - 1;
        scope.varMap.set(v, opIndex);
      }
      children = templateOrNodes.children;
    } else {
      children = templateOrNodes;
    }
    for (const node of children) {
      scope.appendNode(node);
    }
    return scope;
  }
  resolve(node, directive) {
    const res = this.resolveLocal(node, directive);
    if (res !== null) {
      const clone = ts27.getMutableClone(res);
      ts27.setSyntheticTrailingComments(clone, []);
      return clone;
    } else if (this.parent !== null) {
      return this.parent.resolve(node, directive);
    } else {
      throw new Error(`Could not resolve ${node} / ${directive}`);
    }
  }
  addStatement(stmt) {
    this.statements.push(stmt);
  }
  render() {
    for (let i = 0; i < this.opQueue.length; i++) {
      const skipOptional = !this.tcb.env.config.enableTemplateTypeChecker;
      this.executeOp(i, skipOptional);
    }
    return this.statements;
  }
  guards() {
    let parentGuards = null;
    if (this.parent !== null) {
      parentGuards = this.parent.guards();
    }
    if (this.guard === null) {
      return parentGuards;
    } else if (parentGuards === null) {
      return this.guard;
    } else {
      return ts27.createBinary(parentGuards, ts27.SyntaxKind.AmpersandAmpersandToken, this.guard);
    }
  }
  resolveLocal(ref, directive) {
    if (ref instanceof TmplAstReference3 && this.referenceOpMap.has(ref)) {
      return this.resolveOp(this.referenceOpMap.get(ref));
    } else if (ref instanceof TmplAstVariable2 && this.varMap.has(ref)) {
      return this.resolveOp(this.varMap.get(ref));
    } else if (ref instanceof TmplAstTemplate2 && directive === void 0 && this.templateCtxOpMap.has(ref)) {
      return this.resolveOp(this.templateCtxOpMap.get(ref));
    } else if ((ref instanceof TmplAstElement3 || ref instanceof TmplAstTemplate2) && directive !== void 0 && this.directiveOpMap.has(ref)) {
      const dirMap = this.directiveOpMap.get(ref);
      if (dirMap.has(directive)) {
        return this.resolveOp(dirMap.get(directive));
      } else {
        return null;
      }
    } else if (ref instanceof TmplAstElement3 && this.elementOpMap.has(ref)) {
      return this.resolveOp(this.elementOpMap.get(ref));
    } else {
      return null;
    }
  }
  resolveOp(opIndex) {
    const res = this.executeOp(opIndex, false);
    if (res === null) {
      throw new Error(`Error resolving operation, got null`);
    }
    return res;
  }
  executeOp(opIndex, skipOptional) {
    const op = this.opQueue[opIndex];
    if (!(op instanceof TcbOp)) {
      return op;
    }
    if (skipOptional && op.optional) {
      return null;
    }
    this.opQueue[opIndex] = op.circularFallback();
    const res = op.execute();
    this.opQueue[opIndex] = res;
    return res;
  }
  appendNode(node) {
    if (node instanceof TmplAstElement3) {
      const opIndex = this.opQueue.push(new TcbElementOp(this.tcb, this, node)) - 1;
      this.elementOpMap.set(node, opIndex);
      this.appendDirectivesAndInputsOfNode(node);
      this.appendOutputsOfNode(node);
      for (const child of node.children) {
        this.appendNode(child);
      }
      this.checkAndAppendReferencesOfNode(node);
    } else if (node instanceof TmplAstTemplate2) {
      this.appendDirectivesAndInputsOfNode(node);
      this.appendOutputsOfNode(node);
      const ctxIndex = this.opQueue.push(new TcbTemplateContextOp(this.tcb, this)) - 1;
      this.templateCtxOpMap.set(node, ctxIndex);
      if (this.tcb.env.config.checkTemplateBodies) {
        this.opQueue.push(new TcbTemplateBodyOp(this.tcb, this, node));
      } else if (this.tcb.env.config.alwaysCheckSchemaInTemplateBodies) {
        this.appendDeepSchemaChecks(node.children);
      }
      this.checkAndAppendReferencesOfNode(node);
    } else if (node instanceof TmplAstBoundText) {
      this.opQueue.push(new TcbTextInterpolationOp(this.tcb, this, node));
    } else if (node instanceof TmplAstIcu) {
      this.appendIcuExpressions(node);
    }
  }
  checkAndAppendReferencesOfNode(node) {
    for (const ref of node.references) {
      const target = this.tcb.boundTarget.getReferenceTarget(ref);
      let ctxIndex;
      if (target === null) {
        this.tcb.oobRecorder.missingReferenceTarget(this.tcb.id, ref);
        ctxIndex = this.opQueue.push(new TcbInvalidReferenceOp(this.tcb, this)) - 1;
      } else if (target instanceof TmplAstTemplate2 || target instanceof TmplAstElement3) {
        ctxIndex = this.opQueue.push(new TcbReferenceOp(this.tcb, this, ref, node, target)) - 1;
      } else {
        ctxIndex = this.opQueue.push(new TcbReferenceOp(this.tcb, this, ref, node, target.directive)) - 1;
      }
      this.referenceOpMap.set(ref, ctxIndex);
    }
  }
  appendDirectivesAndInputsOfNode(node) {
    const claimedInputs = /* @__PURE__ */ new Set();
    const directives = this.tcb.boundTarget.getDirectivesOfNode(node);
    if (directives === null || directives.length === 0) {
      if (node instanceof TmplAstElement3) {
        this.opQueue.push(new TcbUnclaimedInputsOp(this.tcb, this, node, claimedInputs));
        this.opQueue.push(new TcbDomSchemaCheckerOp(this.tcb, node, true, claimedInputs));
      }
      return;
    }
    const dirMap = /* @__PURE__ */ new Map();
    for (const dir of directives) {
      let directiveOp;
      const host = this.tcb.env.reflector;
      const dirRef = dir.ref;
      if (!dir.isGeneric) {
        directiveOp = new TcbNonGenericDirectiveTypeOp(this.tcb, this, node, dir);
      } else if (!requiresInlineTypeCtor(dirRef.node, host, this.tcb.env) || this.tcb.env.config.useInlineTypeConstructors) {
        directiveOp = new TcbDirectiveCtorOp(this.tcb, this, node, dir);
      } else {
        directiveOp = new TcbGenericDirectiveTypeWithAnyParamsOp(this.tcb, this, node, dir);
      }
      const dirIndex = this.opQueue.push(directiveOp) - 1;
      dirMap.set(dir, dirIndex);
      this.opQueue.push(new TcbDirectiveInputsOp(this.tcb, this, node, dir));
    }
    this.directiveOpMap.set(node, dirMap);
    if (node instanceof TmplAstElement3) {
      for (const dir of directives) {
        for (const propertyName of dir.inputs.propertyNames) {
          claimedInputs.add(propertyName);
        }
      }
      this.opQueue.push(new TcbUnclaimedInputsOp(this.tcb, this, node, claimedInputs));
      const checkElement = directives.length === 0;
      this.opQueue.push(new TcbDomSchemaCheckerOp(this.tcb, node, checkElement, claimedInputs));
    }
  }
  appendOutputsOfNode(node) {
    const claimedOutputs = /* @__PURE__ */ new Set();
    const directives = this.tcb.boundTarget.getDirectivesOfNode(node);
    if (directives === null || directives.length === 0) {
      if (node instanceof TmplAstElement3) {
        this.opQueue.push(new TcbUnclaimedOutputsOp(this.tcb, this, node, claimedOutputs));
      }
      return;
    }
    for (const dir of directives) {
      this.opQueue.push(new TcbDirectiveOutputsOp(this.tcb, this, node, dir));
    }
    if (node instanceof TmplAstElement3) {
      for (const dir of directives) {
        for (const outputProperty of dir.outputs.propertyNames) {
          claimedOutputs.add(outputProperty);
        }
      }
      this.opQueue.push(new TcbUnclaimedOutputsOp(this.tcb, this, node, claimedOutputs));
    }
  }
  appendDeepSchemaChecks(nodes) {
    for (const node of nodes) {
      if (!(node instanceof TmplAstElement3 || node instanceof TmplAstTemplate2)) {
        continue;
      }
      if (node instanceof TmplAstElement3) {
        const claimedInputs = /* @__PURE__ */ new Set();
        const directives = this.tcb.boundTarget.getDirectivesOfNode(node);
        let hasDirectives;
        if (directives === null || directives.length === 0) {
          hasDirectives = false;
        } else {
          hasDirectives = true;
          for (const dir of directives) {
            for (const propertyName of dir.inputs.propertyNames) {
              claimedInputs.add(propertyName);
            }
          }
        }
        this.opQueue.push(new TcbDomSchemaCheckerOp(this.tcb, node, !hasDirectives, claimedInputs));
      }
      this.appendDeepSchemaChecks(node.children);
    }
  }
  appendIcuExpressions(node) {
    for (const variable of Object.values(node.vars)) {
      this.opQueue.push(new TcbTextInterpolationOp(this.tcb, this, variable));
    }
    for (const placeholder of Object.values(node.placeholders)) {
      if (placeholder instanceof TmplAstBoundText) {
        this.opQueue.push(new TcbTextInterpolationOp(this.tcb, this, placeholder));
      }
    }
  }
};
function tcbCtxParam(node, name, typeArguments) {
  const type = ts27.factory.createTypeReferenceNode(name, typeArguments);
  return ts27.factory.createParameterDeclaration(void 0, void 0, void 0, "ctx", void 0, type, void 0);
}
function tcbExpression(ast, tcb, scope) {
  const translator = new TcbExpressionTranslator(tcb, scope);
  return translator.translate(ast);
}
var TcbExpressionTranslator = class {
  constructor(tcb, scope) {
    this.tcb = tcb;
    this.scope = scope;
  }
  translate(ast) {
    return astToTypescript(ast, (ast2) => this.resolve(ast2), this.tcb.env.config);
  }
  resolve(ast) {
    if (ast instanceof PropertyRead4 && ast.receiver instanceof ImplicitReceiver4) {
      return this.resolveTarget(ast);
    } else if (ast instanceof PropertyWrite3 && ast.receiver instanceof ImplicitReceiver4) {
      const target = this.resolveTarget(ast);
      if (target === null) {
        return null;
      }
      const expr = this.translate(ast.value);
      const result = ts27.createParen(ts27.createBinary(target, ts27.SyntaxKind.EqualsToken, expr));
      addParseSpanInfo(result, ast.sourceSpan);
      return result;
    } else if (ast instanceof ImplicitReceiver4) {
      return ts27.createIdentifier("ctx");
    } else if (ast instanceof BindingPipe) {
      const expr = this.translate(ast.exp);
      const pipeRef = this.tcb.getPipeByName(ast.name);
      let pipe;
      if (pipeRef === null) {
        this.tcb.oobRecorder.missingPipe(this.tcb.id, ast);
        pipe = NULL_AS_ANY;
      } else {
        pipe = this.tcb.env.pipeInst(pipeRef);
      }
      const args = ast.args.map((arg) => this.translate(arg));
      let methodAccess = ts27.factory.createPropertyAccessExpression(pipe, "transform");
      addParseSpanInfo(methodAccess, ast.nameSpan);
      if (!this.tcb.env.config.checkTypeOfPipes) {
        methodAccess = ts27.factory.createAsExpression(methodAccess, ts27.factory.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword));
      }
      const result = ts27.createCall(methodAccess, void 0, [expr, ...args]);
      addParseSpanInfo(result, ast.sourceSpan);
      return result;
    } else if ((ast instanceof Call2 || ast instanceof SafeCall) && (ast.receiver instanceof PropertyRead4 || ast.receiver instanceof SafePropertyRead3)) {
      if (ast.receiver.receiver instanceof ImplicitReceiver4 && !(ast.receiver.receiver instanceof ThisReceiver) && ast.receiver.name === "$any" && ast.args.length === 1) {
        const expr = this.translate(ast.args[0]);
        const exprAsAny = ts27.createAsExpression(expr, ts27.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword));
        const result = ts27.createParen(exprAsAny);
        addParseSpanInfo(result, ast.sourceSpan);
        return result;
      }
      const receiver = this.resolveTarget(ast);
      if (receiver === null) {
        return null;
      }
      const method = wrapForDiagnostics(receiver);
      addParseSpanInfo(method, ast.receiver.nameSpan);
      const args = ast.args.map((arg) => this.translate(arg));
      const node = ts27.createCall(method, void 0, args);
      addParseSpanInfo(node, ast.sourceSpan);
      return node;
    } else {
      return null;
    }
  }
  resolveTarget(ast) {
    const binding = this.tcb.boundTarget.getExpressionTarget(ast);
    if (binding === null) {
      return null;
    }
    const expr = this.scope.resolve(binding);
    addParseSpanInfo(expr, ast.sourceSpan);
    return expr;
  }
};
function tcbCallTypeCtor(dir, tcb, inputs) {
  const typeCtor = tcb.env.typeCtorFor(dir);
  const members = inputs.map((input) => {
    const propertyName = ts27.createStringLiteral(input.field);
    if (input.type === "binding") {
      const expr = widenBinding(input.expression, tcb);
      const assignment = ts27.createPropertyAssignment(propertyName, wrapForDiagnostics(expr));
      addParseSpanInfo(assignment, input.sourceSpan);
      return assignment;
    } else {
      return ts27.createPropertyAssignment(propertyName, NULL_AS_ANY);
    }
  });
  return ts27.createCall(typeCtor, void 0, [ts27.createObjectLiteral(members)]);
}
function getBoundInputs(directive, node, tcb) {
  const boundInputs = [];
  const processAttribute = (attr) => {
    if (attr instanceof TmplAstBoundAttribute && attr.type !== 0) {
      return;
    }
    const inputs = directive.inputs.getByBindingPropertyName(attr.name);
    if (inputs === null) {
      return;
    }
    const fieldNames = inputs.map((input) => input.classPropertyName);
    boundInputs.push({ attribute: attr, fieldNames });
  };
  node.inputs.forEach(processAttribute);
  node.attributes.forEach(processAttribute);
  if (node instanceof TmplAstTemplate2) {
    node.templateAttrs.forEach(processAttribute);
  }
  return boundInputs;
}
function translateInput(attr, tcb, scope) {
  if (attr instanceof TmplAstBoundAttribute) {
    return tcbExpression(attr.value, tcb, scope);
  } else {
    return ts27.createStringLiteral(attr.value);
  }
}
function widenBinding(expr, tcb) {
  if (!tcb.env.config.checkTypeOfInputBindings) {
    return tsCastToAny(expr);
  } else if (!tcb.env.config.strictNullInputBindings) {
    if (ts27.isObjectLiteralExpression(expr) || ts27.isArrayLiteralExpression(expr)) {
      return expr;
    } else {
      return ts27.createNonNullExpression(expr);
    }
  } else {
    return expr;
  }
}
var EVENT_PARAMETER = "$event";
function tcbCreateEventHandler(event, tcb, scope, eventType) {
  const handler = tcbEventHandlerExpression(event.handler, tcb, scope);
  let eventParamType;
  if (eventType === 0) {
    eventParamType = void 0;
  } else if (eventType === 1) {
    eventParamType = ts27.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword);
  } else {
    eventParamType = eventType;
  }
  const guards = scope.guards();
  let body = ts27.createExpressionStatement(handler);
  if (guards !== null) {
    body = ts27.createIf(guards, body);
  }
  const eventParam = ts27.createParameter(void 0, void 0, void 0, EVENT_PARAMETER, void 0, eventParamType);
  addExpressionIdentifier(eventParam, ExpressionIdentifier.EVENT_PARAMETER);
  return ts27.createFunctionExpression(void 0, void 0, void 0, void 0, [eventParam], ts27.createKeywordTypeNode(ts27.SyntaxKind.AnyKeyword), ts27.createBlock([body]));
}
function tcbEventHandlerExpression(ast, tcb, scope) {
  const translator = new TcbEventHandlerTranslator(tcb, scope);
  return translator.translate(ast);
}
function isSplitTwoWayBinding(inputName, output, inputs, tcb) {
  const input = inputs.find((input2) => input2.name === inputName);
  if (input === void 0 || input.sourceSpan !== output.sourceSpan) {
    return false;
  }
  const inputConsumer = tcb.boundTarget.getConsumerOfBinding(input);
  const outputConsumer = tcb.boundTarget.getConsumerOfBinding(output);
  if (outputConsumer === null || inputConsumer.ref === void 0 || outputConsumer instanceof TmplAstTemplate2) {
    return false;
  }
  if (outputConsumer instanceof TmplAstElement3) {
    tcb.oobRecorder.splitTwoWayBinding(tcb.id, input, output, inputConsumer.ref.node, outputConsumer);
    return true;
  } else if (outputConsumer.ref !== inputConsumer.ref) {
    tcb.oobRecorder.splitTwoWayBinding(tcb.id, input, output, inputConsumer.ref.node, outputConsumer.ref.node);
    return true;
  }
  return false;
}
var TcbEventHandlerTranslator = class extends TcbExpressionTranslator {
  resolve(ast) {
    if (ast instanceof PropertyRead4 && ast.receiver instanceof ImplicitReceiver4 && !(ast.receiver instanceof ThisReceiver) && ast.name === EVENT_PARAMETER) {
      const event = ts27.createIdentifier(EVENT_PARAMETER);
      addParseSpanInfo(event, ast.nameSpan);
      return event;
    }
    return super.resolve(ast);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/type_check_file.mjs
import ts28 from "typescript";
var TypeCheckFile = class extends Environment {
  constructor(fileName, config, refEmitter, reflector, compilerHost) {
    super(config, new ImportManager(new NoopImportRewriter(), "i"), refEmitter, reflector, ts28.createSourceFile(compilerHost.getCanonicalFileName(fileName), "", ts28.ScriptTarget.Latest, true));
    this.fileName = fileName;
    this.nextTcbId = 1;
    this.tcbStatements = [];
  }
  addTypeCheckBlock(ref, meta, domSchemaChecker, oobRecorder, genericContextBehavior) {
    const fnId = ts28.createIdentifier(`_tcb${this.nextTcbId++}`);
    const fn = generateTypeCheckBlock(this, ref, fnId, meta, domSchemaChecker, oobRecorder, genericContextBehavior);
    this.tcbStatements.push(fn);
  }
  render(removeComments) {
    let source = this.importManager.getAllImports(this.contextFile.fileName).map((i) => `import * as ${i.qualifier.text} from '${i.specifier}';`).join("\n") + "\n\n";
    const printer = ts28.createPrinter({ removeComments });
    source += "\n";
    for (const stmt of this.pipeInstStatements) {
      source += printer.printNode(ts28.EmitHint.Unspecified, stmt, this.contextFile) + "\n";
    }
    for (const stmt of this.typeCtorStatements) {
      source += printer.printNode(ts28.EmitHint.Unspecified, stmt, this.contextFile) + "\n";
    }
    source += "\n";
    for (const stmt of this.tcbStatements) {
      source += printer.printNode(ts28.EmitHint.Unspecified, stmt, this.contextFile) + "\n";
    }
    source += "\nexport const IS_A_MODULE = true;\n";
    return source;
  }
  getPreludeStatements() {
    return [];
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/context.mjs
var InliningMode;
(function(InliningMode2) {
  InliningMode2[InliningMode2["InlineOps"] = 0] = "InlineOps";
  InliningMode2[InliningMode2["Error"] = 1] = "Error";
})(InliningMode || (InliningMode = {}));
var TypeCheckContextImpl = class {
  constructor(config, compilerHost, refEmitter, reflector, host, inlining, perf) {
    this.config = config;
    this.compilerHost = compilerHost;
    this.refEmitter = refEmitter;
    this.reflector = reflector;
    this.host = host;
    this.inlining = inlining;
    this.perf = perf;
    this.fileMap = /* @__PURE__ */ new Map();
    this.opMap = /* @__PURE__ */ new Map();
    this.typeCtorPending = /* @__PURE__ */ new Set();
    if (inlining === InliningMode.Error && config.useInlineTypeConstructors) {
      throw new Error(`AssertionError: invalid inlining configuration.`);
    }
  }
  addTemplate(ref, binder, template, pipes, schemas, sourceMapping, file, parseErrors) {
    if (!this.host.shouldCheckComponent(ref.node)) {
      return;
    }
    const fileData = this.dataForFile(ref.node.getSourceFile());
    const shimData = this.pendingShimForComponent(ref.node);
    const templateId = fileData.sourceManager.getTemplateId(ref.node);
    const templateDiagnostics = [];
    if (parseErrors !== null) {
      templateDiagnostics.push(...this.getTemplateDiagnostics(parseErrors, templateId, sourceMapping));
    }
    const boundTarget = binder.bind({ template });
    if (this.inlining === InliningMode.InlineOps) {
      for (const dir of boundTarget.getUsedDirectives()) {
        const dirRef = dir.ref;
        const dirNode = dirRef.node;
        if (!dir.isGeneric || !requiresInlineTypeCtor(dirNode, this.reflector, shimData.file)) {
          continue;
        }
        this.addInlineTypeCtor(fileData, dirNode.getSourceFile(), dirRef, {
          fnName: "ngTypeCtor",
          body: !dirNode.getSourceFile().isDeclarationFile,
          fields: {
            inputs: dir.inputs.classPropertyNames,
            outputs: dir.outputs.classPropertyNames,
            queries: dir.queries
          },
          coercedInputFields: dir.coercedInputFields
        });
      }
    }
    shimData.templates.set(templateId, {
      template,
      boundTarget,
      templateDiagnostics
    });
    const inliningRequirement = requiresInlineTypeCheckBlock(ref.node, shimData.file, pipes, this.reflector);
    if (this.inlining === InliningMode.Error && inliningRequirement === TcbInliningRequirement.MustInline) {
      shimData.oobRecorder.requiresInlineTcb(templateId, ref.node);
      this.perf.eventCount(PerfEvent.SkipGenerateTcbNoInline);
      return;
    }
    const meta = {
      id: fileData.sourceManager.captureSource(ref.node, sourceMapping, file),
      boundTarget,
      pipes,
      schemas
    };
    this.perf.eventCount(PerfEvent.GenerateTcb);
    if (inliningRequirement !== TcbInliningRequirement.None && this.inlining === InliningMode.InlineOps) {
      this.addInlineTypeCheckBlock(fileData, shimData, ref, meta);
    } else if (inliningRequirement === TcbInliningRequirement.ShouldInlineForGenericBounds && this.inlining === InliningMode.Error) {
      shimData.file.addTypeCheckBlock(ref, meta, shimData.domSchemaChecker, shimData.oobRecorder, TcbGenericContextBehavior.FallbackToAny);
    } else {
      shimData.file.addTypeCheckBlock(ref, meta, shimData.domSchemaChecker, shimData.oobRecorder, TcbGenericContextBehavior.UseEmitter);
    }
  }
  addInlineTypeCtor(fileData, sf, ref, ctorMeta) {
    if (this.typeCtorPending.has(ref.node)) {
      return;
    }
    this.typeCtorPending.add(ref.node);
    if (!this.opMap.has(sf)) {
      this.opMap.set(sf, []);
    }
    const ops = this.opMap.get(sf);
    ops.push(new TypeCtorOp(ref, ctorMeta));
    fileData.hasInlines = true;
  }
  transform(sf) {
    if (!this.opMap.has(sf)) {
      return null;
    }
    const importManager = new ImportManager(new NoopImportRewriter(), "_i");
    const ops = this.opMap.get(sf).sort(orderOps);
    const textParts = splitStringAtPoints(sf.text, ops.map((op) => op.splitPoint));
    const printer = ts29.createPrinter({ omitTrailingSemicolon: true });
    let code = textParts[0];
    ops.forEach((op, idx) => {
      const text = op.execute(importManager, sf, this.refEmitter, printer);
      code += "\n\n" + text + textParts[idx + 1];
    });
    let imports = importManager.getAllImports(sf.fileName).map((i) => `import * as ${i.qualifier.text} from '${i.specifier}';`).join("\n");
    code = imports + "\n" + code;
    return code;
  }
  finalize() {
    const updates = /* @__PURE__ */ new Map();
    for (const originalSf of this.opMap.keys()) {
      const newText = this.transform(originalSf);
      if (newText !== null) {
        updates.set(absoluteFromSourceFile(originalSf), {
          newText,
          originalFile: originalSf
        });
      }
    }
    for (const [sfPath, pendingFileData] of this.fileMap) {
      for (const pendingShimData of pendingFileData.shimData.values()) {
        this.host.recordShimData(sfPath, {
          genesisDiagnostics: [
            ...pendingShimData.domSchemaChecker.diagnostics,
            ...pendingShimData.oobRecorder.diagnostics
          ],
          hasInlines: pendingFileData.hasInlines,
          path: pendingShimData.file.fileName,
          templates: pendingShimData.templates
        });
        const sfText = pendingShimData.file.render(false);
        updates.set(pendingShimData.file.fileName, {
          newText: sfText,
          originalFile: null
        });
      }
    }
    return updates;
  }
  addInlineTypeCheckBlock(fileData, shimData, ref, tcbMeta) {
    const sf = ref.node.getSourceFile();
    if (!this.opMap.has(sf)) {
      this.opMap.set(sf, []);
    }
    const ops = this.opMap.get(sf);
    ops.push(new InlineTcbOp(ref, tcbMeta, this.config, this.reflector, shimData.domSchemaChecker, shimData.oobRecorder));
    fileData.hasInlines = true;
  }
  pendingShimForComponent(node) {
    const fileData = this.dataForFile(node.getSourceFile());
    const shimPath = TypeCheckShimGenerator.shimFor(absoluteFromSourceFile(node.getSourceFile()));
    if (!fileData.shimData.has(shimPath)) {
      fileData.shimData.set(shimPath, {
        domSchemaChecker: new RegistryDomSchemaChecker(fileData.sourceManager),
        oobRecorder: new OutOfBandDiagnosticRecorderImpl(fileData.sourceManager),
        file: new TypeCheckFile(shimPath, this.config, this.refEmitter, this.reflector, this.compilerHost),
        templates: /* @__PURE__ */ new Map()
      });
    }
    return fileData.shimData.get(shimPath);
  }
  dataForFile(sf) {
    const sfPath = absoluteFromSourceFile(sf);
    if (!this.fileMap.has(sfPath)) {
      const data = {
        hasInlines: false,
        sourceManager: this.host.getSourceManager(sfPath),
        shimData: /* @__PURE__ */ new Map()
      };
      this.fileMap.set(sfPath, data);
    }
    return this.fileMap.get(sfPath);
  }
  getTemplateDiagnostics(parseErrors, templateId, sourceMapping) {
    return parseErrors.map((error) => {
      const span = error.span;
      if (span.start.offset === span.end.offset) {
        span.end.offset++;
      }
      return makeTemplateDiagnostic(templateId, sourceMapping, span, ts29.DiagnosticCategory.Error, ngErrorCode(ErrorCode.TEMPLATE_PARSE_ERROR), error.msg);
    });
  }
};
var InlineTcbOp = class {
  constructor(ref, meta, config, reflector, domSchemaChecker, oobRecorder) {
    this.ref = ref;
    this.meta = meta;
    this.config = config;
    this.reflector = reflector;
    this.domSchemaChecker = domSchemaChecker;
    this.oobRecorder = oobRecorder;
  }
  get splitPoint() {
    return this.ref.node.end + 1;
  }
  execute(im, sf, refEmitter, printer) {
    const env = new Environment(this.config, im, refEmitter, this.reflector, sf);
    const fnName = ts29.createIdentifier(`_tcb_${this.ref.node.pos}`);
    const fn = generateTypeCheckBlock(env, this.ref, fnName, this.meta, this.domSchemaChecker, this.oobRecorder, TcbGenericContextBehavior.CopyClassNodes);
    return printer.printNode(ts29.EmitHint.Unspecified, fn, sf);
  }
};
var TypeCtorOp = class {
  constructor(ref, meta) {
    this.ref = ref;
    this.meta = meta;
  }
  get splitPoint() {
    return this.ref.node.end - 1;
  }
  execute(im, sf, refEmitter, printer) {
    const tcb = generateInlineTypeCtor(this.ref.node, this.meta);
    return printer.printNode(ts29.EmitHint.Unspecified, tcb, sf);
  }
};
function orderOps(op1, op2) {
  return op1.splitPoint - op2.splitPoint;
}
function splitStringAtPoints(str, points) {
  const splits = [];
  let start = 0;
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    splits.push(str.substring(start, point));
    start = point;
  }
  splits.push(str.substring(start));
  return splits;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/source.mjs
import { ParseLocation, ParseSourceSpan } from "@angular/compiler";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/line_mappings.mjs
var LF_CHAR = 10;
var CR_CHAR = 13;
var LINE_SEP_CHAR = 8232;
var PARAGRAPH_CHAR = 8233;
function getLineAndCharacterFromPosition(lineStartsMap, position) {
  const lineIndex = findClosestLineStartPosition(lineStartsMap, position);
  return { character: position - lineStartsMap[lineIndex], line: lineIndex };
}
function computeLineStartsMap(text) {
  const result = [0];
  let pos = 0;
  while (pos < text.length) {
    const char = text.charCodeAt(pos++);
    if (char === CR_CHAR) {
      if (text.charCodeAt(pos) === LF_CHAR) {
        pos++;
      }
      result.push(pos);
    } else if (char === LF_CHAR || char === LINE_SEP_CHAR || char === PARAGRAPH_CHAR) {
      result.push(pos);
    }
  }
  result.push(pos);
  return result;
}
function findClosestLineStartPosition(linesMap, position, low = 0, high = linesMap.length - 1) {
  while (low <= high) {
    const pivotIdx = Math.floor((low + high) / 2);
    const pivotEl = linesMap[pivotIdx];
    if (pivotEl === position) {
      return pivotIdx;
    } else if (position > pivotEl) {
      low = pivotIdx + 1;
    } else {
      high = pivotIdx - 1;
    }
  }
  return low - 1;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/source.mjs
var TemplateSource = class {
  constructor(mapping, file) {
    this.mapping = mapping;
    this.file = file;
    this.lineStarts = null;
  }
  toParseSourceSpan(start, end) {
    const startLoc = this.toParseLocation(start);
    const endLoc = this.toParseLocation(end);
    return new ParseSourceSpan(startLoc, endLoc);
  }
  toParseLocation(position) {
    const lineStarts = this.acquireLineStarts();
    const { line, character } = getLineAndCharacterFromPosition(lineStarts, position);
    return new ParseLocation(this.file, position, line, character);
  }
  acquireLineStarts() {
    if (this.lineStarts === null) {
      this.lineStarts = computeLineStartsMap(this.file.content);
    }
    return this.lineStarts;
  }
};
var TemplateSourceManager = class {
  constructor() {
    this.templateSources = /* @__PURE__ */ new Map();
  }
  getTemplateId(node) {
    return getTemplateId(node);
  }
  captureSource(node, mapping, file) {
    const id = getTemplateId(node);
    this.templateSources.set(id, new TemplateSource(mapping, file));
    return id;
  }
  getSourceMapping(id) {
    if (!this.templateSources.has(id)) {
      throw new Error(`Unexpected unknown template ID: ${id}`);
    }
    return this.templateSources.get(id).mapping;
  }
  toParseSourceSpan(id, span) {
    if (!this.templateSources.has(id)) {
      return null;
    }
    const templateSource = this.templateSources.get(id);
    return templateSource.toParseSourceSpan(span.start, span.end);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/template_symbol_builder.mjs
import { AST, ASTWithSource as ASTWithSource3, BindingPipe as BindingPipe2, PropertyRead as PropertyRead5, PropertyWrite as PropertyWrite4, SafePropertyRead as SafePropertyRead4, TmplAstBoundAttribute as TmplAstBoundAttribute2, TmplAstBoundEvent, TmplAstElement as TmplAstElement4, TmplAstReference as TmplAstReference4, TmplAstTemplate as TmplAstTemplate3, TmplAstTextAttribute as TmplAstTextAttribute3, TmplAstVariable as TmplAstVariable3 } from "@angular/compiler";
import ts30 from "typescript";
var SymbolBuilder = class {
  constructor(tcbPath, tcbIsShim, typeCheckBlock, templateData, componentScopeReader, getTypeChecker) {
    this.tcbPath = tcbPath;
    this.tcbIsShim = tcbIsShim;
    this.typeCheckBlock = typeCheckBlock;
    this.templateData = templateData;
    this.componentScopeReader = componentScopeReader;
    this.getTypeChecker = getTypeChecker;
    this.symbolCache = /* @__PURE__ */ new Map();
  }
  getSymbol(node) {
    if (this.symbolCache.has(node)) {
      return this.symbolCache.get(node);
    }
    let symbol = null;
    if (node instanceof TmplAstBoundAttribute2 || node instanceof TmplAstTextAttribute3) {
      symbol = this.getSymbolOfInputBinding(node);
    } else if (node instanceof TmplAstBoundEvent) {
      symbol = this.getSymbolOfBoundEvent(node);
    } else if (node instanceof TmplAstElement4) {
      symbol = this.getSymbolOfElement(node);
    } else if (node instanceof TmplAstTemplate3) {
      symbol = this.getSymbolOfAstTemplate(node);
    } else if (node instanceof TmplAstVariable3) {
      symbol = this.getSymbolOfVariable(node);
    } else if (node instanceof TmplAstReference4) {
      symbol = this.getSymbolOfReference(node);
    } else if (node instanceof BindingPipe2) {
      symbol = this.getSymbolOfPipe(node);
    } else if (node instanceof AST) {
      symbol = this.getSymbolOfTemplateExpression(node);
    } else {
    }
    this.symbolCache.set(node, symbol);
    return symbol;
  }
  getSymbolOfAstTemplate(template) {
    const directives = this.getDirectivesOfNode(template);
    return { kind: SymbolKind.Template, directives, templateNode: template };
  }
  getSymbolOfElement(element) {
    var _a;
    const elementSourceSpan = (_a = element.startSourceSpan) != null ? _a : element.sourceSpan;
    const node = findFirstMatchingNode(this.typeCheckBlock, { withSpan: elementSourceSpan, filter: ts30.isVariableDeclaration });
    if (node === null) {
      return null;
    }
    const symbolFromDeclaration = this.getSymbolOfTsNode(node);
    if (symbolFromDeclaration === null || symbolFromDeclaration.tsSymbol === null) {
      return null;
    }
    const directives = this.getDirectivesOfNode(element);
    return __spreadProps(__spreadValues({}, symbolFromDeclaration), {
      kind: SymbolKind.Element,
      directives,
      templateNode: element
    });
  }
  getDirectivesOfNode(element) {
    var _a;
    const elementSourceSpan = (_a = element.startSourceSpan) != null ? _a : element.sourceSpan;
    const tcbSourceFile = this.typeCheckBlock.getSourceFile();
    const isDirectiveDeclaration = (node) => (ts30.isTypeNode(node) || ts30.isIdentifier(node)) && ts30.isVariableDeclaration(node.parent) && hasExpressionIdentifier(tcbSourceFile, node, ExpressionIdentifier.DIRECTIVE);
    const nodes = findAllMatchingNodes(this.typeCheckBlock, { withSpan: elementSourceSpan, filter: isDirectiveDeclaration });
    return nodes.map((node) => {
      var _a2;
      const symbol = this.getSymbolOfTsNode(node.parent);
      if (symbol === null || !isSymbolWithValueDeclaration(symbol.tsSymbol) || !ts30.isClassDeclaration(symbol.tsSymbol.valueDeclaration)) {
        return null;
      }
      const meta = this.getDirectiveMeta(element, symbol.tsSymbol.valueDeclaration);
      if (meta === null) {
        return null;
      }
      const ngModule = this.getDirectiveModule(symbol.tsSymbol.valueDeclaration);
      if (meta.selector === null) {
        return null;
      }
      const isComponent = (_a2 = meta.isComponent) != null ? _a2 : null;
      const directiveSymbol = __spreadProps(__spreadValues({}, symbol), {
        tsSymbol: symbol.tsSymbol,
        selector: meta.selector,
        isComponent,
        ngModule,
        kind: SymbolKind.Directive,
        isStructural: meta.isStructural
      });
      return directiveSymbol;
    }).filter((d) => d !== null);
  }
  getDirectiveMeta(host, directiveDeclaration) {
    var _a;
    let directives = this.templateData.boundTarget.getDirectivesOfNode(host);
    const firstChild = host.children[0];
    if (firstChild instanceof TmplAstElement4) {
      const isMicrosyntaxTemplate = host instanceof TmplAstTemplate3 && sourceSpanEqual(firstChild.sourceSpan, host.sourceSpan);
      if (isMicrosyntaxTemplate) {
        const firstChildDirectives = this.templateData.boundTarget.getDirectivesOfNode(firstChild);
        if (firstChildDirectives !== null && directives !== null) {
          directives = directives.concat(firstChildDirectives);
        } else {
          directives = directives != null ? directives : firstChildDirectives;
        }
      }
    }
    if (directives === null) {
      return null;
    }
    return (_a = directives.find((m) => m.ref.node === directiveDeclaration)) != null ? _a : null;
  }
  getDirectiveModule(declaration) {
    const scope = this.componentScopeReader.getScopeForComponent(declaration);
    if (scope === null) {
      return null;
    }
    return scope.ngModule;
  }
  getSymbolOfBoundEvent(eventBinding) {
    const consumer = this.templateData.boundTarget.getConsumerOfBinding(eventBinding);
    if (consumer === null) {
      return null;
    }
    let expectedAccess;
    if (consumer instanceof TmplAstTemplate3 || consumer instanceof TmplAstElement4) {
      expectedAccess = "addEventListener";
    } else {
      const bindingPropertyNames = consumer.outputs.getByBindingPropertyName(eventBinding.name);
      if (bindingPropertyNames === null || bindingPropertyNames.length === 0) {
        return null;
      }
      expectedAccess = bindingPropertyNames[0].classPropertyName;
    }
    function filter(n) {
      if (!isAccessExpression(n)) {
        return false;
      }
      if (ts30.isPropertyAccessExpression(n)) {
        return n.name.getText() === expectedAccess;
      } else {
        return ts30.isStringLiteral(n.argumentExpression) && n.argumentExpression.text === expectedAccess;
      }
    }
    const outputFieldAccesses = findAllMatchingNodes(this.typeCheckBlock, { withSpan: eventBinding.keySpan, filter });
    const bindings = [];
    for (const outputFieldAccess of outputFieldAccesses) {
      if (consumer instanceof TmplAstTemplate3 || consumer instanceof TmplAstElement4) {
        if (!ts30.isPropertyAccessExpression(outputFieldAccess)) {
          continue;
        }
        const addEventListener = outputFieldAccess.name;
        const tsSymbol = this.getTypeChecker().getSymbolAtLocation(addEventListener);
        const tsType = this.getTypeChecker().getTypeAtLocation(addEventListener);
        const positionInFile = this.getTcbPositionForNode(addEventListener);
        const target = this.getSymbol(consumer);
        if (target === null || tsSymbol === void 0) {
          continue;
        }
        bindings.push({
          kind: SymbolKind.Binding,
          tsSymbol,
          tsType,
          target,
          tcbLocation: {
            tcbPath: this.tcbPath,
            isShimFile: this.tcbIsShim,
            positionInFile
          }
        });
      } else {
        if (!ts30.isElementAccessExpression(outputFieldAccess)) {
          continue;
        }
        const tsSymbol = this.getTypeChecker().getSymbolAtLocation(outputFieldAccess.argumentExpression);
        if (tsSymbol === void 0) {
          continue;
        }
        const target = this.getDirectiveSymbolForAccessExpression(outputFieldAccess, consumer);
        if (target === null) {
          continue;
        }
        const positionInFile = this.getTcbPositionForNode(outputFieldAccess);
        const tsType = this.getTypeChecker().getTypeAtLocation(outputFieldAccess);
        bindings.push({
          kind: SymbolKind.Binding,
          tsSymbol,
          tsType,
          target,
          tcbLocation: {
            tcbPath: this.tcbPath,
            isShimFile: this.tcbIsShim,
            positionInFile
          }
        });
      }
    }
    if (bindings.length === 0) {
      return null;
    }
    return { kind: SymbolKind.Output, bindings };
  }
  getSymbolOfInputBinding(binding) {
    const consumer = this.templateData.boundTarget.getConsumerOfBinding(binding);
    if (consumer === null) {
      return null;
    }
    if (consumer instanceof TmplAstElement4 || consumer instanceof TmplAstTemplate3) {
      const host = this.getSymbol(consumer);
      return host !== null ? { kind: SymbolKind.DomBinding, host } : null;
    }
    const nodes = findAllMatchingNodes(this.typeCheckBlock, { withSpan: binding.sourceSpan, filter: isAssignment });
    const bindings = [];
    for (const node of nodes) {
      if (!isAccessExpression(node.left)) {
        continue;
      }
      const symbolInfo = this.getSymbolOfTsNode(node.left);
      if (symbolInfo === null || symbolInfo.tsSymbol === null) {
        continue;
      }
      const target = this.getDirectiveSymbolForAccessExpression(node.left, consumer);
      if (target === null) {
        continue;
      }
      bindings.push(__spreadProps(__spreadValues({}, symbolInfo), {
        tsSymbol: symbolInfo.tsSymbol,
        kind: SymbolKind.Binding,
        target
      }));
    }
    if (bindings.length === 0) {
      return null;
    }
    return { kind: SymbolKind.Input, bindings };
  }
  getDirectiveSymbolForAccessExpression(node, { isComponent, selector, isStructural }) {
    var _a;
    const tsSymbol = this.getTypeChecker().getSymbolAtLocation(node.expression);
    if ((tsSymbol == null ? void 0 : tsSymbol.declarations) === void 0 || tsSymbol.declarations.length === 0 || selector === null) {
      return null;
    }
    const [declaration] = tsSymbol.declarations;
    if (!ts30.isVariableDeclaration(declaration) || !hasExpressionIdentifier(declaration.getSourceFile(), (_a = declaration.type) != null ? _a : declaration.name, ExpressionIdentifier.DIRECTIVE)) {
      return null;
    }
    const symbol = this.getSymbolOfTsNode(declaration);
    if (symbol === null || !isSymbolWithValueDeclaration(symbol.tsSymbol) || !ts30.isClassDeclaration(symbol.tsSymbol.valueDeclaration)) {
      return null;
    }
    const ngModule = this.getDirectiveModule(symbol.tsSymbol.valueDeclaration);
    return {
      kind: SymbolKind.Directive,
      tsSymbol: symbol.tsSymbol,
      tsType: symbol.tsType,
      tcbLocation: symbol.tcbLocation,
      isComponent,
      isStructural,
      selector,
      ngModule
    };
  }
  getSymbolOfVariable(variable) {
    const node = findFirstMatchingNode(this.typeCheckBlock, { withSpan: variable.sourceSpan, filter: ts30.isVariableDeclaration });
    if (node === null || node.initializer === void 0) {
      return null;
    }
    const expressionSymbol = this.getSymbolOfTsNode(node.initializer);
    if (expressionSymbol === null) {
      return null;
    }
    return {
      tsType: expressionSymbol.tsType,
      tsSymbol: expressionSymbol.tsSymbol,
      initializerLocation: expressionSymbol.tcbLocation,
      kind: SymbolKind.Variable,
      declaration: variable,
      localVarLocation: {
        tcbPath: this.tcbPath,
        isShimFile: this.tcbIsShim,
        positionInFile: this.getTcbPositionForNode(node.name)
      }
    };
  }
  getSymbolOfReference(ref) {
    const target = this.templateData.boundTarget.getReferenceTarget(ref);
    let node = findFirstMatchingNode(this.typeCheckBlock, { withSpan: ref.sourceSpan, filter: ts30.isVariableDeclaration });
    if (node === null || target === null || node.initializer === void 0) {
      return null;
    }
    const originalDeclaration = ts30.isParenthesizedExpression(node.initializer) && ts30.isAsExpression(node.initializer.expression) ? this.getTypeChecker().getSymbolAtLocation(node.name) : this.getTypeChecker().getSymbolAtLocation(node.initializer);
    if (originalDeclaration === void 0 || originalDeclaration.valueDeclaration === void 0) {
      return null;
    }
    const symbol = this.getSymbolOfTsNode(originalDeclaration.valueDeclaration);
    if (symbol === null || symbol.tsSymbol === null) {
      return null;
    }
    const referenceVarTcbLocation = {
      tcbPath: this.tcbPath,
      isShimFile: this.tcbIsShim,
      positionInFile: this.getTcbPositionForNode(node)
    };
    if (target instanceof TmplAstTemplate3 || target instanceof TmplAstElement4) {
      return {
        kind: SymbolKind.Reference,
        tsSymbol: symbol.tsSymbol,
        tsType: symbol.tsType,
        target,
        declaration: ref,
        targetLocation: symbol.tcbLocation,
        referenceVarLocation: referenceVarTcbLocation
      };
    } else {
      if (!ts30.isClassDeclaration(target.directive.ref.node)) {
        return null;
      }
      return {
        kind: SymbolKind.Reference,
        tsSymbol: symbol.tsSymbol,
        tsType: symbol.tsType,
        declaration: ref,
        target: target.directive.ref.node,
        targetLocation: symbol.tcbLocation,
        referenceVarLocation: referenceVarTcbLocation
      };
    }
  }
  getSymbolOfPipe(expression) {
    const methodAccess = findFirstMatchingNode(this.typeCheckBlock, { withSpan: expression.nameSpan, filter: ts30.isPropertyAccessExpression });
    if (methodAccess === null) {
      return null;
    }
    const pipeVariableNode = methodAccess.expression;
    const pipeDeclaration = this.getTypeChecker().getSymbolAtLocation(pipeVariableNode);
    if (pipeDeclaration === void 0 || pipeDeclaration.valueDeclaration === void 0) {
      return null;
    }
    const pipeInstance = this.getSymbolOfTsNode(pipeDeclaration.valueDeclaration);
    if (pipeInstance === null || !isSymbolWithValueDeclaration(pipeInstance.tsSymbol)) {
      return null;
    }
    const symbolInfo = this.getSymbolOfTsNode(methodAccess);
    if (symbolInfo === null) {
      return null;
    }
    return __spreadProps(__spreadValues({
      kind: SymbolKind.Pipe
    }, symbolInfo), {
      classSymbol: __spreadProps(__spreadValues({}, pipeInstance), {
        tsSymbol: pipeInstance.tsSymbol
      })
    });
  }
  getSymbolOfTemplateExpression(expression) {
    if (expression instanceof ASTWithSource3) {
      expression = expression.ast;
    }
    const expressionTarget = this.templateData.boundTarget.getExpressionTarget(expression);
    if (expressionTarget !== null) {
      return this.getSymbol(expressionTarget);
    }
    let withSpan = expression.sourceSpan;
    if (expression instanceof PropertyWrite4) {
      withSpan = expression.nameSpan;
    }
    let node = null;
    if (expression instanceof PropertyRead5) {
      node = findFirstMatchingNode(this.typeCheckBlock, { withSpan, filter: ts30.isPropertyAccessExpression });
    }
    if (node === null) {
      node = findFirstMatchingNode(this.typeCheckBlock, { withSpan, filter: anyNodeFilter });
    }
    if (node === null) {
      return null;
    }
    while (ts30.isParenthesizedExpression(node)) {
      node = node.expression;
    }
    if (expression instanceof SafePropertyRead4 && ts30.isConditionalExpression(node)) {
      const whenTrueSymbol = this.getSymbolOfTsNode(node.whenTrue);
      if (whenTrueSymbol === null) {
        return null;
      }
      return __spreadProps(__spreadValues({}, whenTrueSymbol), {
        kind: SymbolKind.Expression,
        tsType: this.getTypeChecker().getTypeAtLocation(node)
      });
    } else {
      const symbolInfo = this.getSymbolOfTsNode(node);
      return symbolInfo === null ? null : __spreadProps(__spreadValues({}, symbolInfo), { kind: SymbolKind.Expression });
    }
  }
  getSymbolOfTsNode(node) {
    var _a;
    while (ts30.isParenthesizedExpression(node)) {
      node = node.expression;
    }
    let tsSymbol;
    if (ts30.isPropertyAccessExpression(node)) {
      tsSymbol = this.getTypeChecker().getSymbolAtLocation(node.name);
    } else if (ts30.isElementAccessExpression(node)) {
      tsSymbol = this.getTypeChecker().getSymbolAtLocation(node.argumentExpression);
    } else {
      tsSymbol = this.getTypeChecker().getSymbolAtLocation(node);
    }
    const positionInFile = this.getTcbPositionForNode(node);
    const type = this.getTypeChecker().getTypeAtLocation(node);
    return {
      tsSymbol: (_a = tsSymbol != null ? tsSymbol : type.symbol) != null ? _a : null,
      tsType: type,
      tcbLocation: {
        tcbPath: this.tcbPath,
        isShimFile: this.tcbIsShim,
        positionInFile
      }
    };
  }
  getTcbPositionForNode(node) {
    if (ts30.isTypeReferenceNode(node)) {
      return this.getTcbPositionForNode(node.typeName);
    } else if (ts30.isQualifiedName(node)) {
      return node.right.getStart();
    } else if (ts30.isPropertyAccessExpression(node)) {
      return node.name.getStart();
    } else if (ts30.isElementAccessExpression(node)) {
      return node.argumentExpression.getStart();
    } else {
      return node.getStart();
    }
  }
};
function anyNodeFilter(n) {
  return true;
}
function sourceSpanEqual(a, b) {
  return a.start.offset === b.start.offset && a.end.offset === b.end.offset;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/src/checker.mjs
var REGISTRY2 = new DomElementSchemaRegistry2();
var TemplateTypeCheckerImpl = class {
  constructor(originalProgram, programDriver, typeCheckAdapter, config, refEmitter, reflector, compilerHost, priorBuild, componentScopeReader, typeCheckScopeRegistry, perf) {
    this.originalProgram = originalProgram;
    this.programDriver = programDriver;
    this.typeCheckAdapter = typeCheckAdapter;
    this.config = config;
    this.refEmitter = refEmitter;
    this.reflector = reflector;
    this.compilerHost = compilerHost;
    this.priorBuild = priorBuild;
    this.componentScopeReader = componentScopeReader;
    this.typeCheckScopeRegistry = typeCheckScopeRegistry;
    this.perf = perf;
    this.state = /* @__PURE__ */ new Map();
    this.completionCache = /* @__PURE__ */ new Map();
    this.symbolBuilderCache = /* @__PURE__ */ new Map();
    this.scopeCache = /* @__PURE__ */ new Map();
    this.elementTagCache = /* @__PURE__ */ new Map();
    this.isComplete = false;
  }
  getTemplate(component) {
    const { data } = this.getLatestComponentState(component);
    if (data === null) {
      return null;
    }
    return data.template;
  }
  getLatestComponentState(component) {
    this.ensureShimForComponent(component);
    const sf = component.getSourceFile();
    const sfPath = absoluteFromSourceFile(sf);
    const shimPath = TypeCheckShimGenerator.shimFor(sfPath);
    const fileRecord = this.getFileData(sfPath);
    if (!fileRecord.shimData.has(shimPath)) {
      return { data: null, tcb: null, tcbPath: shimPath, tcbIsShim: true };
    }
    const templateId = fileRecord.sourceManager.getTemplateId(component);
    const shimRecord = fileRecord.shimData.get(shimPath);
    const id = fileRecord.sourceManager.getTemplateId(component);
    const program = this.programDriver.getProgram();
    const shimSf = getSourceFileOrNull(program, shimPath);
    if (shimSf === null || !fileRecord.shimData.has(shimPath)) {
      throw new Error(`Error: no shim file in program: ${shimPath}`);
    }
    let tcb = findTypeCheckBlock(shimSf, id, false);
    let tcbPath = shimPath;
    if (tcb === null) {
      const inlineSf = getSourceFileOrError(program, sfPath);
      tcb = findTypeCheckBlock(inlineSf, id, false);
      if (tcb !== null) {
        tcbPath = sfPath;
      }
    }
    let data = null;
    if (shimRecord.templates.has(templateId)) {
      data = shimRecord.templates.get(templateId);
    }
    return { data, tcb, tcbPath, tcbIsShim: tcbPath === shimPath };
  }
  isTrackedTypeCheckFile(filePath) {
    return this.getFileAndShimRecordsForPath(filePath) !== null;
  }
  getFileRecordForTcbLocation({ tcbPath, isShimFile }) {
    if (!isShimFile) {
      if (this.state.has(tcbPath)) {
        return this.state.get(tcbPath);
      } else {
        return null;
      }
    }
    const records = this.getFileAndShimRecordsForPath(tcbPath);
    if (records !== null) {
      return records.fileRecord;
    } else {
      return null;
    }
  }
  getFileAndShimRecordsForPath(shimPath) {
    for (const fileRecord of this.state.values()) {
      if (fileRecord.shimData.has(shimPath)) {
        return { fileRecord, shimRecord: fileRecord.shimData.get(shimPath) };
      }
    }
    return null;
  }
  getTemplateMappingAtTcbLocation(tcbLocation) {
    const fileRecord = this.getFileRecordForTcbLocation(tcbLocation);
    if (fileRecord === null) {
      return null;
    }
    const shimSf = this.programDriver.getProgram().getSourceFile(tcbLocation.tcbPath);
    if (shimSf === void 0) {
      return null;
    }
    return getTemplateMapping(shimSf, tcbLocation.positionInFile, fileRecord.sourceManager, false);
  }
  generateAllTypeCheckBlocks() {
    this.ensureAllShimsForAllFiles();
  }
  getDiagnosticsForFile(sf, optimizeFor) {
    switch (optimizeFor) {
      case OptimizeFor.WholeProgram:
        this.ensureAllShimsForAllFiles();
        break;
      case OptimizeFor.SingleFile:
        this.ensureAllShimsForOneFile(sf);
        break;
    }
    return this.perf.inPhase(PerfPhase.TtcDiagnostics, () => {
      const sfPath = absoluteFromSourceFile(sf);
      const fileRecord = this.state.get(sfPath);
      const typeCheckProgram = this.programDriver.getProgram();
      const diagnostics = [];
      if (fileRecord.hasInlines) {
        const inlineSf = getSourceFileOrError(typeCheckProgram, sfPath);
        diagnostics.push(...typeCheckProgram.getSemanticDiagnostics(inlineSf).map((diag) => convertDiagnostic(diag, fileRecord.sourceManager)));
      }
      for (const [shimPath, shimRecord] of fileRecord.shimData) {
        const shimSf = getSourceFileOrError(typeCheckProgram, shimPath);
        diagnostics.push(...typeCheckProgram.getSemanticDiagnostics(shimSf).map((diag) => convertDiagnostic(diag, fileRecord.sourceManager)));
        diagnostics.push(...shimRecord.genesisDiagnostics);
        for (const templateData of shimRecord.templates.values()) {
          diagnostics.push(...templateData.templateDiagnostics);
        }
      }
      return diagnostics.filter((diag) => diag !== null);
    });
  }
  getDiagnosticsForComponent(component) {
    this.ensureShimForComponent(component);
    return this.perf.inPhase(PerfPhase.TtcDiagnostics, () => {
      const sf = component.getSourceFile();
      const sfPath = absoluteFromSourceFile(sf);
      const shimPath = TypeCheckShimGenerator.shimFor(sfPath);
      const fileRecord = this.getFileData(sfPath);
      if (!fileRecord.shimData.has(shimPath)) {
        return [];
      }
      const templateId = fileRecord.sourceManager.getTemplateId(component);
      const shimRecord = fileRecord.shimData.get(shimPath);
      const typeCheckProgram = this.programDriver.getProgram();
      const diagnostics = [];
      if (shimRecord.hasInlines) {
        const inlineSf = getSourceFileOrError(typeCheckProgram, sfPath);
        diagnostics.push(...typeCheckProgram.getSemanticDiagnostics(inlineSf).map((diag) => convertDiagnostic(diag, fileRecord.sourceManager)));
      }
      const shimSf = getSourceFileOrError(typeCheckProgram, shimPath);
      diagnostics.push(...typeCheckProgram.getSemanticDiagnostics(shimSf).map((diag) => convertDiagnostic(diag, fileRecord.sourceManager)));
      diagnostics.push(...shimRecord.genesisDiagnostics);
      for (const templateData of shimRecord.templates.values()) {
        diagnostics.push(...templateData.templateDiagnostics);
      }
      return diagnostics.filter((diag) => diag !== null && diag.templateId === templateId);
    });
  }
  getTypeCheckBlock(component) {
    return this.getLatestComponentState(component).tcb;
  }
  getGlobalCompletions(context, component, node) {
    const engine = this.getOrCreateCompletionEngine(component);
    if (engine === null) {
      return null;
    }
    return this.perf.inPhase(PerfPhase.TtcAutocompletion, () => engine.getGlobalCompletions(context, node));
  }
  getExpressionCompletionLocation(ast, component) {
    const engine = this.getOrCreateCompletionEngine(component);
    if (engine === null) {
      return null;
    }
    return this.perf.inPhase(PerfPhase.TtcAutocompletion, () => engine.getExpressionCompletionLocation(ast));
  }
  getLiteralCompletionLocation(node, component) {
    const engine = this.getOrCreateCompletionEngine(component);
    if (engine === null) {
      return null;
    }
    return this.perf.inPhase(PerfPhase.TtcAutocompletion, () => engine.getLiteralCompletionLocation(node));
  }
  invalidateClass(clazz) {
    this.completionCache.delete(clazz);
    this.symbolBuilderCache.delete(clazz);
    this.scopeCache.delete(clazz);
    this.elementTagCache.delete(clazz);
    const sf = clazz.getSourceFile();
    const sfPath = absoluteFromSourceFile(sf);
    const shimPath = TypeCheckShimGenerator.shimFor(sfPath);
    const fileData = this.getFileData(sfPath);
    const templateId = fileData.sourceManager.getTemplateId(clazz);
    fileData.shimData.delete(shimPath);
    fileData.isComplete = false;
    this.isComplete = false;
  }
  makeTemplateDiagnostic(clazz, sourceSpan, category, errorCode, message, relatedInformation) {
    const sfPath = absoluteFromSourceFile(clazz.getSourceFile());
    const fileRecord = this.state.get(sfPath);
    const templateId = fileRecord.sourceManager.getTemplateId(clazz);
    const mapping = fileRecord.sourceManager.getSourceMapping(templateId);
    return __spreadProps(__spreadValues({}, makeTemplateDiagnostic(templateId, mapping, sourceSpan, category, ngErrorCode(errorCode), message, relatedInformation)), {
      __ngCode: errorCode
    });
  }
  getOrCreateCompletionEngine(component) {
    if (this.completionCache.has(component)) {
      return this.completionCache.get(component);
    }
    const { tcb, data, tcbPath, tcbIsShim } = this.getLatestComponentState(component);
    if (tcb === null || data === null) {
      return null;
    }
    const engine = new CompletionEngine(tcb, data, tcbPath, tcbIsShim);
    this.completionCache.set(component, engine);
    return engine;
  }
  maybeAdoptPriorResultsForFile(sf) {
    const sfPath = absoluteFromSourceFile(sf);
    if (this.state.has(sfPath)) {
      const existingResults = this.state.get(sfPath);
      if (existingResults.isComplete) {
        return;
      }
    }
    const previousResults = this.priorBuild.priorTypeCheckingResultsFor(sf);
    if (previousResults === null || !previousResults.isComplete) {
      return;
    }
    this.perf.eventCount(PerfEvent.ReuseTypeCheckFile);
    this.state.set(sfPath, previousResults);
  }
  ensureAllShimsForAllFiles() {
    if (this.isComplete) {
      return;
    }
    this.perf.inPhase(PerfPhase.TcbGeneration, () => {
      const host = new WholeProgramTypeCheckingHost(this);
      const ctx = this.newContext(host);
      for (const sf of this.originalProgram.getSourceFiles()) {
        if (sf.isDeclarationFile || isShim(sf)) {
          continue;
        }
        this.maybeAdoptPriorResultsForFile(sf);
        const sfPath = absoluteFromSourceFile(sf);
        const fileData = this.getFileData(sfPath);
        if (fileData.isComplete) {
          continue;
        }
        this.typeCheckAdapter.typeCheck(sf, ctx);
        fileData.isComplete = true;
      }
      this.updateFromContext(ctx);
      this.isComplete = true;
    });
  }
  ensureAllShimsForOneFile(sf) {
    this.perf.inPhase(PerfPhase.TcbGeneration, () => {
      this.maybeAdoptPriorResultsForFile(sf);
      const sfPath = absoluteFromSourceFile(sf);
      const fileData = this.getFileData(sfPath);
      if (fileData.isComplete) {
        return;
      }
      const host = new SingleFileTypeCheckingHost(sfPath, fileData, this);
      const ctx = this.newContext(host);
      this.typeCheckAdapter.typeCheck(sf, ctx);
      fileData.isComplete = true;
      this.updateFromContext(ctx);
    });
  }
  ensureShimForComponent(component) {
    const sf = component.getSourceFile();
    const sfPath = absoluteFromSourceFile(sf);
    const shimPath = TypeCheckShimGenerator.shimFor(sfPath);
    this.maybeAdoptPriorResultsForFile(sf);
    const fileData = this.getFileData(sfPath);
    if (fileData.shimData.has(shimPath)) {
      return;
    }
    const host = new SingleShimTypeCheckingHost(sfPath, fileData, this, shimPath);
    const ctx = this.newContext(host);
    this.typeCheckAdapter.typeCheck(sf, ctx);
    this.updateFromContext(ctx);
  }
  newContext(host) {
    const inlining = this.programDriver.supportsInlineOperations ? InliningMode.InlineOps : InliningMode.Error;
    return new TypeCheckContextImpl(this.config, this.compilerHost, this.refEmitter, this.reflector, host, inlining, this.perf);
  }
  clearAllShimDataUsingInlines() {
    for (const fileData of this.state.values()) {
      if (!fileData.hasInlines) {
        continue;
      }
      for (const [shimFile, shimData] of fileData.shimData.entries()) {
        if (shimData.hasInlines) {
          fileData.shimData.delete(shimFile);
        }
      }
      fileData.hasInlines = false;
      fileData.isComplete = false;
      this.isComplete = false;
    }
  }
  updateFromContext(ctx) {
    const updates = ctx.finalize();
    return this.perf.inPhase(PerfPhase.TcbUpdateProgram, () => {
      if (updates.size > 0) {
        this.perf.eventCount(PerfEvent.UpdateTypeCheckProgram);
      }
      this.programDriver.updateFiles(updates, UpdateMode.Incremental);
      this.priorBuild.recordSuccessfulTypeCheck(this.state);
      this.perf.memory(PerfCheckpoint.TtcUpdateProgram);
    });
  }
  getFileData(path2) {
    if (!this.state.has(path2)) {
      this.state.set(path2, {
        hasInlines: false,
        sourceManager: new TemplateSourceManager(),
        isComplete: false,
        shimData: /* @__PURE__ */ new Map()
      });
    }
    return this.state.get(path2);
  }
  getSymbolOfNode(node, component) {
    const builder = this.getOrCreateSymbolBuilder(component);
    if (builder === null) {
      return null;
    }
    return this.perf.inPhase(PerfPhase.TtcSymbol, () => builder.getSymbol(node));
  }
  getOrCreateSymbolBuilder(component) {
    if (this.symbolBuilderCache.has(component)) {
      return this.symbolBuilderCache.get(component);
    }
    const { tcb, data, tcbPath, tcbIsShim } = this.getLatestComponentState(component);
    if (tcb === null || data === null) {
      return null;
    }
    const builder = new SymbolBuilder(tcbPath, tcbIsShim, tcb, data, this.componentScopeReader, () => this.programDriver.getProgram().getTypeChecker());
    this.symbolBuilderCache.set(component, builder);
    return builder;
  }
  getDirectivesInScope(component) {
    const data = this.getScopeData(component);
    if (data === null) {
      return null;
    }
    return data.directives;
  }
  getPipesInScope(component) {
    const data = this.getScopeData(component);
    if (data === null) {
      return null;
    }
    return data.pipes;
  }
  getDirectiveMetadata(dir) {
    if (!isNamedClassDeclaration(dir)) {
      return null;
    }
    return this.typeCheckScopeRegistry.getTypeCheckDirectiveMetadata(new Reference(dir));
  }
  getPotentialElementTags(component) {
    if (this.elementTagCache.has(component)) {
      return this.elementTagCache.get(component);
    }
    const tagMap = /* @__PURE__ */ new Map();
    for (const tag of REGISTRY2.allKnownElementNames()) {
      tagMap.set(tag, null);
    }
    const scope = this.getScopeData(component);
    if (scope !== null) {
      for (const directive of scope.directives) {
        for (const selector of CssSelector2.parse(directive.selector)) {
          if (selector.element === null || tagMap.has(selector.element)) {
            continue;
          }
          tagMap.set(selector.element, directive);
        }
      }
    }
    this.elementTagCache.set(component, tagMap);
    return tagMap;
  }
  getPotentialDomBindings(tagName) {
    const attributes = REGISTRY2.allKnownAttributesOfElement(tagName);
    return attributes.map((attribute) => ({
      attribute,
      property: REGISTRY2.getMappedPropName(attribute)
    }));
  }
  getPotentialDomEvents(tagName) {
    return REGISTRY2.allKnownEventsOfElement(tagName);
  }
  getScopeData(component) {
    if (this.scopeCache.has(component)) {
      return this.scopeCache.get(component);
    }
    if (!isNamedClassDeclaration(component)) {
      throw new Error(`AssertionError: components must have names`);
    }
    const scope = this.componentScopeReader.getScopeForComponent(component);
    if (scope === null) {
      return null;
    }
    const data = {
      directives: [],
      pipes: [],
      isPoisoned: scope.compilation.isPoisoned
    };
    const typeChecker = this.programDriver.getProgram().getTypeChecker();
    for (const dir of scope.compilation.directives) {
      if (dir.selector === null) {
        continue;
      }
      const tsSymbol = typeChecker.getSymbolAtLocation(dir.ref.node.name);
      if (!isSymbolWithValueDeclaration(tsSymbol)) {
        continue;
      }
      let ngModule = null;
      const moduleScopeOfDir = this.componentScopeReader.getScopeForComponent(dir.ref.node);
      if (moduleScopeOfDir !== null) {
        ngModule = moduleScopeOfDir.ngModule;
      }
      data.directives.push({
        isComponent: dir.isComponent,
        isStructural: dir.isStructural,
        selector: dir.selector,
        tsSymbol,
        ngModule
      });
    }
    for (const pipe of scope.compilation.pipes) {
      const tsSymbol = typeChecker.getSymbolAtLocation(pipe.ref.node.name);
      if (tsSymbol === void 0) {
        continue;
      }
      data.pipes.push({
        name: pipe.name,
        tsSymbol
      });
    }
    this.scopeCache.set(component, data);
    return data;
  }
};
function convertDiagnostic(diag, sourceResolver) {
  if (!shouldReportDiagnostic(diag)) {
    return null;
  }
  return translateDiagnostic(diag, sourceResolver);
}
var WholeProgramTypeCheckingHost = class {
  constructor(impl) {
    this.impl = impl;
  }
  getSourceManager(sfPath) {
    return this.impl.getFileData(sfPath).sourceManager;
  }
  shouldCheckComponent(node) {
    const sfPath = absoluteFromSourceFile(node.getSourceFile());
    const shimPath = TypeCheckShimGenerator.shimFor(sfPath);
    const fileData = this.impl.getFileData(sfPath);
    return !fileData.shimData.has(shimPath);
  }
  recordShimData(sfPath, data) {
    const fileData = this.impl.getFileData(sfPath);
    fileData.shimData.set(data.path, data);
    if (data.hasInlines) {
      fileData.hasInlines = true;
    }
  }
  recordComplete(sfPath) {
    this.impl.getFileData(sfPath).isComplete = true;
  }
};
var SingleFileTypeCheckingHost = class {
  constructor(sfPath, fileData, impl) {
    this.sfPath = sfPath;
    this.fileData = fileData;
    this.impl = impl;
    this.seenInlines = false;
  }
  assertPath(sfPath) {
    if (this.sfPath !== sfPath) {
      throw new Error(`AssertionError: querying TypeCheckingHost outside of assigned file`);
    }
  }
  getSourceManager(sfPath) {
    this.assertPath(sfPath);
    return this.fileData.sourceManager;
  }
  shouldCheckComponent(node) {
    if (this.sfPath !== absoluteFromSourceFile(node.getSourceFile())) {
      return false;
    }
    const shimPath = TypeCheckShimGenerator.shimFor(this.sfPath);
    return !this.fileData.shimData.has(shimPath);
  }
  recordShimData(sfPath, data) {
    this.assertPath(sfPath);
    if (data.hasInlines && !this.seenInlines) {
      this.impl.clearAllShimDataUsingInlines();
      this.seenInlines = true;
    }
    this.fileData.shimData.set(data.path, data);
    if (data.hasInlines) {
      this.fileData.hasInlines = true;
    }
  }
  recordComplete(sfPath) {
    this.assertPath(sfPath);
    this.fileData.isComplete = true;
  }
};
var SingleShimTypeCheckingHost = class extends SingleFileTypeCheckingHost {
  constructor(sfPath, fileData, impl, shimPath) {
    super(sfPath, fileData, impl);
    this.shimPath = shimPath;
  }
  shouldCheckNode(node) {
    if (this.sfPath !== absoluteFromSourceFile(node.getSourceFile())) {
      return false;
    }
    const shimPath = TypeCheckShimGenerator.shimFor(this.sfPath);
    if (shimPath !== this.shimPath) {
      return false;
    }
    return !this.fileData.shimData.has(shimPath);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/checks/invalid_banana_in_box/index.mjs
import { TmplAstBoundEvent as TmplAstBoundEvent2 } from "@angular/compiler";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/api/api.mjs
import { ASTWithSource as ASTWithSource4, RecursiveAstVisitor as RecursiveAstVisitor3 } from "@angular/compiler";
var TemplateCheckWithVisitor = class {
  run(ctx, component, template) {
    const visitor = new TemplateVisitor2(ctx, component, this);
    return visitor.getDiagnostics(template);
  }
};
var TemplateVisitor2 = class extends RecursiveAstVisitor3 {
  constructor(ctx, component, check) {
    super();
    this.ctx = ctx;
    this.component = component;
    this.check = check;
    this.diagnostics = [];
  }
  visit(node, context) {
    this.diagnostics.push(...this.check.visitNode(this.ctx, this.component, node));
    node.visit(this);
  }
  visitAllNodes(nodes) {
    for (const node of nodes) {
      this.visit(node);
    }
  }
  visitAst(ast) {
    if (ast instanceof ASTWithSource4) {
      ast = ast.ast;
    }
    this.visit(ast);
  }
  visitElement(element) {
    this.visitAllNodes(element.attributes);
    this.visitAllNodes(element.inputs);
    this.visitAllNodes(element.outputs);
    this.visitAllNodes(element.references);
    this.visitAllNodes(element.children);
  }
  visitTemplate(template) {
    this.visitAllNodes(template.attributes);
    if (template.tagName === "ng-template") {
      this.visitAllNodes(template.inputs);
      this.visitAllNodes(template.outputs);
      this.visitAllNodes(template.templateAttrs);
    }
    this.visitAllNodes(template.variables);
    this.visitAllNodes(template.references);
    this.visitAllNodes(template.children);
  }
  visitContent(content) {
  }
  visitVariable(variable) {
  }
  visitReference(reference) {
  }
  visitTextAttribute(attribute) {
  }
  visitBoundAttribute(attribute) {
    this.visitAst(attribute.value);
  }
  visitBoundEvent(attribute) {
    this.visitAst(attribute.handler);
  }
  visitText(text) {
  }
  visitBoundText(text) {
    this.visitAst(text.value);
  }
  visitIcu(icu) {
  }
  getDiagnostics(template) {
    this.diagnostics = [];
    this.visitAllNodes(template);
    return this.diagnostics;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/checks/invalid_banana_in_box/index.mjs
var InvalidBananaInBoxCheck = class extends TemplateCheckWithVisitor {
  constructor() {
    super(...arguments);
    this.code = ErrorCode.INVALID_BANANA_IN_BOX;
  }
  visitNode(ctx, component, node) {
    if (!(node instanceof TmplAstBoundEvent2))
      return [];
    const name = node.name;
    if (!name.startsWith("[") || !name.endsWith("]"))
      return [];
    const boundSyntax = node.sourceSpan.toString();
    const expectedBoundSyntax = boundSyntax.replace(`(${name})`, `[(${name.slice(1, -1)})]`);
    const diagnostic = ctx.makeTemplateDiagnostic(node.sourceSpan, `In the two-way binding syntax the parentheses should be inside the brackets, ex. '${expectedBoundSyntax}'.
        Find more at https://angular.io/guide/two-way-binding`);
    return [diagnostic];
  }
};
var factory = {
  code: ErrorCode.INVALID_BANANA_IN_BOX,
  name: ExtendedTemplateDiagnosticName.INVALID_BANANA_IN_BOX,
  create: () => new InvalidBananaInBoxCheck()
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/checks/nullish_coalescing_not_nullable/index.mjs
import { Binary } from "@angular/compiler";
import ts31 from "typescript";
var NullishCoalescingNotNullableCheck = class extends TemplateCheckWithVisitor {
  constructor() {
    super(...arguments);
    this.code = ErrorCode.NULLISH_COALESCING_NOT_NULLABLE;
  }
  visitNode(ctx, component, node) {
    if (!(node instanceof Binary) || node.operation !== "??")
      return [];
    const symbolLeft = ctx.templateTypeChecker.getSymbolOfNode(node.left, component);
    if (symbolLeft === null || symbolLeft.kind !== SymbolKind.Expression) {
      return [];
    }
    const typeLeft = symbolLeft.tsType;
    if (typeLeft.flags & (ts31.TypeFlags.Any | ts31.TypeFlags.Unknown)) {
      return [];
    }
    if (typeLeft.getNonNullableType() !== typeLeft)
      return [];
    const symbol = ctx.templateTypeChecker.getSymbolOfNode(node, component);
    if (symbol.kind !== SymbolKind.Expression) {
      return [];
    }
    const templateMapping = ctx.templateTypeChecker.getTemplateMappingAtTcbLocation(symbol.tcbLocation);
    if (templateMapping === null) {
      return [];
    }
    const diagnostic = ctx.makeTemplateDiagnostic(templateMapping.span, `The left side of this nullish coalescing operation does not include 'null' or 'undefined' in its type, therefore the '??' operator can be safely removed.`);
    return [diagnostic];
  }
};
var factory2 = {
  code: ErrorCode.NULLISH_COALESCING_NOT_NULLABLE,
  name: ExtendedTemplateDiagnosticName.NULLISH_COALESCING_NOT_NULLABLE,
  create: (options) => {
    const strictNullChecks = options.strictNullChecks === void 0 ? !!options.strict : !!options.strictNullChecks;
    if (!strictNullChecks) {
      return null;
    }
    return new NullishCoalescingNotNullableCheck();
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/src/extended_template_checker.mjs
import ts32 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/core/api/src/public_options.mjs
var DiagnosticCategoryLabel;
(function(DiagnosticCategoryLabel2) {
  DiagnosticCategoryLabel2["Warning"] = "warning";
  DiagnosticCategoryLabel2["Error"] = "error";
  DiagnosticCategoryLabel2["Suppress"] = "suppress";
})(DiagnosticCategoryLabel || (DiagnosticCategoryLabel = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/src/extended_template_checker.mjs
var ExtendedTemplateCheckerImpl = class {
  constructor(templateTypeChecker, typeChecker, templateCheckFactories, options) {
    var _a, _b, _c, _d, _e;
    this.partialCtx = { templateTypeChecker, typeChecker };
    this.templateChecks = /* @__PURE__ */ new Map();
    for (const factory3 of templateCheckFactories) {
      const category = diagnosticLabelToCategory((_e = (_d = (_b = (_a = options == null ? void 0 : options.extendedDiagnostics) == null ? void 0 : _a.checks) == null ? void 0 : _b[factory3.name]) != null ? _d : (_c = options == null ? void 0 : options.extendedDiagnostics) == null ? void 0 : _c.defaultCategory) != null ? _e : DiagnosticCategoryLabel.Warning);
      if (category === null) {
        continue;
      }
      const check = factory3.create(options);
      if (check === null) {
        continue;
      }
      this.templateChecks.set(check, category);
    }
  }
  getDiagnosticsForComponent(component) {
    const template = this.partialCtx.templateTypeChecker.getTemplate(component);
    if (template === null) {
      return [];
    }
    const diagnostics = [];
    for (const [check, category] of this.templateChecks.entries()) {
      const ctx = __spreadProps(__spreadValues({}, this.partialCtx), {
        makeTemplateDiagnostic: (span, message, relatedInformation) => {
          return this.partialCtx.templateTypeChecker.makeTemplateDiagnostic(component, span, category, check.code, message, relatedInformation);
        }
      });
      diagnostics.push(...check.run(ctx, component, template));
    }
    return diagnostics;
  }
};
function diagnosticLabelToCategory(label) {
  switch (label) {
    case DiagnosticCategoryLabel.Warning:
      return ts32.DiagnosticCategory.Warning;
    case DiagnosticCategoryLabel.Error:
      return ts32.DiagnosticCategory.Error;
    case DiagnosticCategoryLabel.Suppress:
      return null;
    default:
      return assertNever(label);
  }
}
function assertNever(value) {
  throw new Error(`Unexpected call to 'assertNever()' with value:
${value}`);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/typecheck/extended/index.mjs
var ALL_DIAGNOSTIC_FACTORIES = [
  factory,
  factory2
];

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/core/src/compiler.mjs
var CompilationTicketKind;
(function(CompilationTicketKind2) {
  CompilationTicketKind2[CompilationTicketKind2["Fresh"] = 0] = "Fresh";
  CompilationTicketKind2[CompilationTicketKind2["IncrementalTypeScript"] = 1] = "IncrementalTypeScript";
  CompilationTicketKind2[CompilationTicketKind2["IncrementalResource"] = 2] = "IncrementalResource";
})(CompilationTicketKind || (CompilationTicketKind = {}));
function freshCompilationTicket(tsProgram, options, incrementalBuildStrategy, programDriver, perfRecorder, enableTemplateTypeChecker, usePoisonedData) {
  return {
    kind: CompilationTicketKind.Fresh,
    tsProgram,
    options,
    incrementalBuildStrategy,
    programDriver,
    enableTemplateTypeChecker,
    usePoisonedData,
    perfRecorder: perfRecorder != null ? perfRecorder : ActivePerfRecorder.zeroedToNow()
  };
}
function incrementalFromCompilerTicket(oldCompiler, newProgram, incrementalBuildStrategy, programDriver, modifiedResourceFiles, perfRecorder) {
  const oldProgram = oldCompiler.getCurrentProgram();
  const oldState = oldCompiler.incrementalStrategy.getIncrementalState(oldProgram);
  if (oldState === null) {
    return freshCompilationTicket(newProgram, oldCompiler.options, incrementalBuildStrategy, programDriver, perfRecorder, oldCompiler.enableTemplateTypeChecker, oldCompiler.usePoisonedData);
  }
  if (perfRecorder === null) {
    perfRecorder = ActivePerfRecorder.zeroedToNow();
  }
  const incrementalCompilation = IncrementalCompilation.incremental(newProgram, versionMapFromProgram(newProgram, programDriver), oldProgram, oldState, modifiedResourceFiles, perfRecorder);
  return {
    kind: CompilationTicketKind.IncrementalTypeScript,
    enableTemplateTypeChecker: oldCompiler.enableTemplateTypeChecker,
    usePoisonedData: oldCompiler.usePoisonedData,
    options: oldCompiler.options,
    incrementalBuildStrategy,
    incrementalCompilation,
    programDriver,
    newProgram,
    perfRecorder
  };
}
function incrementalFromStateTicket(oldProgram, oldState, newProgram, options, incrementalBuildStrategy, programDriver, modifiedResourceFiles, perfRecorder, enableTemplateTypeChecker, usePoisonedData) {
  if (perfRecorder === null) {
    perfRecorder = ActivePerfRecorder.zeroedToNow();
  }
  const incrementalCompilation = IncrementalCompilation.incremental(newProgram, versionMapFromProgram(newProgram, programDriver), oldProgram, oldState, modifiedResourceFiles, perfRecorder);
  return {
    kind: CompilationTicketKind.IncrementalTypeScript,
    newProgram,
    options,
    incrementalBuildStrategy,
    incrementalCompilation,
    programDriver,
    enableTemplateTypeChecker,
    usePoisonedData,
    perfRecorder
  };
}
var NgCompiler = class {
  constructor(adapter, options, inputProgram, programDriver, incrementalStrategy, incrementalCompilation, enableTemplateTypeChecker, usePoisonedData, livePerfRecorder) {
    this.adapter = adapter;
    this.options = options;
    this.inputProgram = inputProgram;
    this.programDriver = programDriver;
    this.incrementalStrategy = incrementalStrategy;
    this.incrementalCompilation = incrementalCompilation;
    this.enableTemplateTypeChecker = enableTemplateTypeChecker;
    this.usePoisonedData = usePoisonedData;
    this.livePerfRecorder = livePerfRecorder;
    this.compilation = null;
    this.constructionDiagnostics = [];
    this.nonTemplateDiagnostics = null;
    this.delegatingPerfRecorder = new DelegatingPerfRecorder(this.perfRecorder);
    this.constructionDiagnostics.push(...this.adapter.constructionDiagnostics, ...verifyCompatibleTypeCheckOptions(this.options));
    this.currentProgram = inputProgram;
    this.closureCompilerEnabled = !!this.options.annotateForClosureCompiler;
    this.entryPoint = adapter.entryPoint !== null ? getSourceFileOrNull(inputProgram, adapter.entryPoint) : null;
    const moduleResolutionCache = ts33.createModuleResolutionCache(this.adapter.getCurrentDirectory(), this.adapter.getCanonicalFileName.bind(this.adapter));
    this.moduleResolver = new ModuleResolver(inputProgram, this.options, this.adapter, moduleResolutionCache);
    this.resourceManager = new AdapterResourceLoader(adapter, this.options);
    this.cycleAnalyzer = new CycleAnalyzer(new ImportGraph(inputProgram.getTypeChecker(), this.delegatingPerfRecorder));
    this.incrementalStrategy.setIncrementalState(this.incrementalCompilation.state, inputProgram);
    this.ignoreForDiagnostics = new Set(inputProgram.getSourceFiles().filter((sf) => this.adapter.isShim(sf)));
    this.ignoreForEmit = this.adapter.ignoreForEmit;
    let dtsFileCount = 0;
    let nonDtsFileCount = 0;
    for (const sf of inputProgram.getSourceFiles()) {
      if (sf.isDeclarationFile) {
        dtsFileCount++;
      } else {
        nonDtsFileCount++;
      }
    }
    livePerfRecorder.eventCount(PerfEvent.InputDtsFile, dtsFileCount);
    livePerfRecorder.eventCount(PerfEvent.InputTsFile, nonDtsFileCount);
  }
  static fromTicket(ticket, adapter) {
    switch (ticket.kind) {
      case CompilationTicketKind.Fresh:
        return new NgCompiler(adapter, ticket.options, ticket.tsProgram, ticket.programDriver, ticket.incrementalBuildStrategy, IncrementalCompilation.fresh(ticket.tsProgram, versionMapFromProgram(ticket.tsProgram, ticket.programDriver)), ticket.enableTemplateTypeChecker, ticket.usePoisonedData, ticket.perfRecorder);
      case CompilationTicketKind.IncrementalTypeScript:
        return new NgCompiler(adapter, ticket.options, ticket.newProgram, ticket.programDriver, ticket.incrementalBuildStrategy, ticket.incrementalCompilation, ticket.enableTemplateTypeChecker, ticket.usePoisonedData, ticket.perfRecorder);
      case CompilationTicketKind.IncrementalResource:
        const compiler = ticket.compiler;
        compiler.updateWithChangedResources(ticket.modifiedResourceFiles, ticket.perfRecorder);
        return compiler;
    }
  }
  get perfRecorder() {
    return this.livePerfRecorder;
  }
  get incrementalDriver() {
    return this.incrementalCompilation;
  }
  updateWithChangedResources(changedResources, perfRecorder) {
    this.livePerfRecorder = perfRecorder;
    this.delegatingPerfRecorder.target = perfRecorder;
    perfRecorder.inPhase(PerfPhase.ResourceUpdate, () => {
      if (this.compilation === null) {
        return;
      }
      this.resourceManager.invalidate();
      const classesToUpdate = /* @__PURE__ */ new Set();
      for (const resourceFile of changedResources) {
        for (const templateClass of this.getComponentsWithTemplateFile(resourceFile)) {
          classesToUpdate.add(templateClass);
        }
        for (const styleClass of this.getComponentsWithStyleFile(resourceFile)) {
          classesToUpdate.add(styleClass);
        }
      }
      for (const clazz of classesToUpdate) {
        this.compilation.traitCompiler.updateResources(clazz);
        if (!ts33.isClassDeclaration(clazz)) {
          continue;
        }
        this.compilation.templateTypeChecker.invalidateClass(clazz);
      }
    });
  }
  getResourceDependencies(file) {
    this.ensureAnalyzed();
    return this.incrementalCompilation.depGraph.getResourceDependencies(file);
  }
  getDiagnostics() {
    const diagnostics = [];
    diagnostics.push(...this.getNonTemplateDiagnostics(), ...this.getTemplateDiagnostics());
    if (this.options.strictTemplates) {
      diagnostics.push(...this.getExtendedTemplateDiagnostics());
    }
    return this.addMessageTextDetails(diagnostics);
  }
  getDiagnosticsForFile(file, optimizeFor) {
    const diagnostics = [];
    diagnostics.push(...this.getNonTemplateDiagnostics().filter((diag) => diag.file === file), ...this.getTemplateDiagnosticsForFile(file, optimizeFor));
    if (this.options.strictTemplates) {
      diagnostics.push(...this.getExtendedTemplateDiagnostics(file));
    }
    return this.addMessageTextDetails(diagnostics);
  }
  getDiagnosticsForComponent(component) {
    const compilation = this.ensureAnalyzed();
    const ttc = compilation.templateTypeChecker;
    const diagnostics = [];
    diagnostics.push(...ttc.getDiagnosticsForComponent(component));
    const extendedTemplateChecker = compilation.extendedTemplateChecker;
    if (this.options.strictTemplates && extendedTemplateChecker) {
      diagnostics.push(...extendedTemplateChecker.getDiagnosticsForComponent(component));
    }
    return this.addMessageTextDetails(diagnostics);
  }
  addMessageTextDetails(diagnostics) {
    return diagnostics.map((diag) => {
      if (diag.code && COMPILER_ERRORS_WITH_GUIDES.has(ngErrorCode(diag.code))) {
        return __spreadProps(__spreadValues({}, diag), {
          messageText: diag.messageText + `. Find more at ${ERROR_DETAILS_PAGE_BASE_URL}/NG${ngErrorCode(diag.code)}`
        });
      }
      return diag;
    });
  }
  getOptionDiagnostics() {
    return this.constructionDiagnostics;
  }
  getCurrentProgram() {
    return this.currentProgram;
  }
  getTemplateTypeChecker() {
    if (!this.enableTemplateTypeChecker) {
      throw new Error("The `TemplateTypeChecker` does not work without `enableTemplateTypeChecker`.");
    }
    return this.ensureAnalyzed().templateTypeChecker;
  }
  getComponentsWithTemplateFile(templateFilePath) {
    const { resourceRegistry } = this.ensureAnalyzed();
    return resourceRegistry.getComponentsWithTemplate(resolve(templateFilePath));
  }
  getComponentsWithStyleFile(styleFilePath) {
    const { resourceRegistry } = this.ensureAnalyzed();
    return resourceRegistry.getComponentsWithStyle(resolve(styleFilePath));
  }
  getComponentResources(classDecl) {
    if (!isNamedClassDeclaration(classDecl)) {
      return null;
    }
    const { resourceRegistry } = this.ensureAnalyzed();
    const styles = resourceRegistry.getStyles(classDecl);
    const template = resourceRegistry.getTemplate(classDecl);
    if (template === null) {
      return null;
    }
    return { styles, template };
  }
  getMeta(classDecl) {
    var _a;
    if (!isNamedClassDeclaration(classDecl)) {
      return null;
    }
    const ref = new Reference(classDecl);
    const { metaReader } = this.ensureAnalyzed();
    const meta = (_a = metaReader.getPipeMetadata(ref)) != null ? _a : metaReader.getDirectiveMetadata(ref);
    if (meta === null) {
      return null;
    }
    return meta;
  }
  async analyzeAsync() {
    if (this.compilation !== null) {
      return;
    }
    await this.perfRecorder.inPhase(PerfPhase.Analysis, async () => {
      this.compilation = this.makeCompilation();
      const promises = [];
      for (const sf of this.inputProgram.getSourceFiles()) {
        if (sf.isDeclarationFile) {
          continue;
        }
        let analysisPromise = this.compilation.traitCompiler.analyzeAsync(sf);
        if (analysisPromise !== void 0) {
          promises.push(analysisPromise);
        }
      }
      await Promise.all(promises);
      this.perfRecorder.memory(PerfCheckpoint.Analysis);
      this.resolveCompilation(this.compilation.traitCompiler);
    });
  }
  prepareEmit() {
    const compilation = this.ensureAnalyzed();
    const coreImportsFrom = compilation.isCore ? getR3SymbolsFile(this.inputProgram) : null;
    let importRewriter;
    if (coreImportsFrom !== null) {
      importRewriter = new R3SymbolsImportRewriter(coreImportsFrom.fileName);
    } else {
      importRewriter = new NoopImportRewriter();
    }
    const defaultImportTracker = new DefaultImportTracker();
    const before = [
      ivyTransformFactory(compilation.traitCompiler, compilation.reflector, importRewriter, defaultImportTracker, this.delegatingPerfRecorder, compilation.isCore, this.closureCompilerEnabled),
      aliasTransformFactory(compilation.traitCompiler.exportStatements),
      defaultImportTracker.importPreservingTransformer()
    ];
    const afterDeclarations = [];
    if (compilation.dtsTransforms !== null) {
      afterDeclarations.push(declarationTransformFactory(compilation.dtsTransforms, importRewriter));
    }
    if (compilation.aliasingHost !== null && compilation.aliasingHost.aliasExportsInDts) {
      afterDeclarations.push(aliasTransformFactory(compilation.traitCompiler.exportStatements));
    }
    if (this.adapter.factoryTracker !== null) {
      before.push(generatedFactoryTransform(this.adapter.factoryTracker.sourceInfo, importRewriter));
    }
    return { transformers: { before, afterDeclarations } };
  }
  getIndexedComponents() {
    const compilation = this.ensureAnalyzed();
    const context = new IndexingContext();
    compilation.traitCompiler.index(context);
    return generateAnalysis(context);
  }
  xi18n(ctx) {
    const compilation = this.ensureAnalyzed();
    compilation.traitCompiler.xi18n(ctx);
  }
  ensureAnalyzed() {
    if (this.compilation === null) {
      this.analyzeSync();
    }
    return this.compilation;
  }
  analyzeSync() {
    this.perfRecorder.inPhase(PerfPhase.Analysis, () => {
      this.compilation = this.makeCompilation();
      for (const sf of this.inputProgram.getSourceFiles()) {
        if (sf.isDeclarationFile) {
          continue;
        }
        this.compilation.traitCompiler.analyzeSync(sf);
      }
      this.perfRecorder.memory(PerfCheckpoint.Analysis);
      this.resolveCompilation(this.compilation.traitCompiler);
    });
  }
  resolveCompilation(traitCompiler) {
    this.perfRecorder.inPhase(PerfPhase.Resolve, () => {
      traitCompiler.resolve();
      this.incrementalCompilation.recordSuccessfulAnalysis(traitCompiler);
      this.perfRecorder.memory(PerfCheckpoint.Resolve);
    });
  }
  get fullTemplateTypeCheck() {
    const strictTemplates = !!this.options.strictTemplates;
    return strictTemplates || !!this.options.fullTemplateTypeCheck;
  }
  getTypeCheckingConfig() {
    const strictTemplates = !!this.options.strictTemplates;
    const useInlineTypeConstructors = this.programDriver.supportsInlineOperations;
    let typeCheckingConfig;
    if (this.fullTemplateTypeCheck) {
      typeCheckingConfig = {
        applyTemplateContextGuards: strictTemplates,
        checkQueries: false,
        checkTemplateBodies: true,
        alwaysCheckSchemaInTemplateBodies: true,
        checkTypeOfInputBindings: strictTemplates,
        honorAccessModifiersForInputBindings: false,
        strictNullInputBindings: strictTemplates,
        checkTypeOfAttributes: strictTemplates,
        checkTypeOfDomBindings: false,
        checkTypeOfOutputEvents: strictTemplates,
        checkTypeOfAnimationEvents: strictTemplates,
        checkTypeOfDomEvents: strictTemplates,
        checkTypeOfDomReferences: strictTemplates,
        checkTypeOfNonDomReferences: true,
        checkTypeOfPipes: true,
        strictSafeNavigationTypes: strictTemplates,
        useContextGenericType: strictTemplates,
        strictLiteralTypes: true,
        enableTemplateTypeChecker: this.enableTemplateTypeChecker,
        useInlineTypeConstructors,
        suggestionsForSuboptimalTypeInference: this.enableTemplateTypeChecker && !strictTemplates
      };
    } else {
      typeCheckingConfig = {
        applyTemplateContextGuards: false,
        checkQueries: false,
        checkTemplateBodies: false,
        alwaysCheckSchemaInTemplateBodies: this.closureCompilerEnabled,
        checkTypeOfInputBindings: false,
        strictNullInputBindings: false,
        honorAccessModifiersForInputBindings: false,
        checkTypeOfAttributes: false,
        checkTypeOfDomBindings: false,
        checkTypeOfOutputEvents: false,
        checkTypeOfAnimationEvents: false,
        checkTypeOfDomEvents: false,
        checkTypeOfDomReferences: false,
        checkTypeOfNonDomReferences: false,
        checkTypeOfPipes: false,
        strictSafeNavigationTypes: false,
        useContextGenericType: false,
        strictLiteralTypes: false,
        enableTemplateTypeChecker: this.enableTemplateTypeChecker,
        useInlineTypeConstructors,
        suggestionsForSuboptimalTypeInference: false
      };
    }
    if (this.options.strictInputTypes !== void 0) {
      typeCheckingConfig.checkTypeOfInputBindings = this.options.strictInputTypes;
      typeCheckingConfig.applyTemplateContextGuards = this.options.strictInputTypes;
    }
    if (this.options.strictInputAccessModifiers !== void 0) {
      typeCheckingConfig.honorAccessModifiersForInputBindings = this.options.strictInputAccessModifiers;
    }
    if (this.options.strictNullInputTypes !== void 0) {
      typeCheckingConfig.strictNullInputBindings = this.options.strictNullInputTypes;
    }
    if (this.options.strictOutputEventTypes !== void 0) {
      typeCheckingConfig.checkTypeOfOutputEvents = this.options.strictOutputEventTypes;
      typeCheckingConfig.checkTypeOfAnimationEvents = this.options.strictOutputEventTypes;
    }
    if (this.options.strictDomEventTypes !== void 0) {
      typeCheckingConfig.checkTypeOfDomEvents = this.options.strictDomEventTypes;
    }
    if (this.options.strictSafeNavigationTypes !== void 0) {
      typeCheckingConfig.strictSafeNavigationTypes = this.options.strictSafeNavigationTypes;
    }
    if (this.options.strictDomLocalRefTypes !== void 0) {
      typeCheckingConfig.checkTypeOfDomReferences = this.options.strictDomLocalRefTypes;
    }
    if (this.options.strictAttributeTypes !== void 0) {
      typeCheckingConfig.checkTypeOfAttributes = this.options.strictAttributeTypes;
    }
    if (this.options.strictContextGenerics !== void 0) {
      typeCheckingConfig.useContextGenericType = this.options.strictContextGenerics;
    }
    if (this.options.strictLiteralTypes !== void 0) {
      typeCheckingConfig.strictLiteralTypes = this.options.strictLiteralTypes;
    }
    return typeCheckingConfig;
  }
  getTemplateDiagnostics() {
    const compilation = this.ensureAnalyzed();
    const diagnostics = [];
    for (const sf of this.inputProgram.getSourceFiles()) {
      if (sf.isDeclarationFile || this.adapter.isShim(sf)) {
        continue;
      }
      diagnostics.push(...compilation.templateTypeChecker.getDiagnosticsForFile(sf, OptimizeFor.WholeProgram));
    }
    const program = this.programDriver.getProgram();
    this.incrementalStrategy.setIncrementalState(this.incrementalCompilation.state, program);
    this.currentProgram = program;
    return diagnostics;
  }
  getTemplateDiagnosticsForFile(sf, optimizeFor) {
    const compilation = this.ensureAnalyzed();
    const diagnostics = [];
    if (!sf.isDeclarationFile && !this.adapter.isShim(sf)) {
      diagnostics.push(...compilation.templateTypeChecker.getDiagnosticsForFile(sf, optimizeFor));
    }
    const program = this.programDriver.getProgram();
    this.incrementalStrategy.setIncrementalState(this.incrementalCompilation.state, program);
    this.currentProgram = program;
    return diagnostics;
  }
  getNonTemplateDiagnostics() {
    if (this.nonTemplateDiagnostics === null) {
      const compilation = this.ensureAnalyzed();
      this.nonTemplateDiagnostics = [...compilation.traitCompiler.diagnostics];
      if (this.entryPoint !== null && compilation.exportReferenceGraph !== null) {
        this.nonTemplateDiagnostics.push(...checkForPrivateExports(this.entryPoint, this.inputProgram.getTypeChecker(), compilation.exportReferenceGraph));
      }
    }
    return this.nonTemplateDiagnostics;
  }
  getExtendedTemplateDiagnostics(sf) {
    const diagnostics = [];
    const compilation = this.ensureAnalyzed();
    const extendedTemplateChecker = compilation.extendedTemplateChecker;
    if (!extendedTemplateChecker) {
      return [];
    }
    if (sf !== void 0) {
      return compilation.traitCompiler.extendedTemplateCheck(sf, extendedTemplateChecker);
    }
    for (const sf2 of this.inputProgram.getSourceFiles()) {
      diagnostics.push(...compilation.traitCompiler.extendedTemplateCheck(sf2, extendedTemplateChecker));
    }
    return diagnostics;
  }
  makeCompilation() {
    const checker = this.inputProgram.getTypeChecker();
    const reflector = new TypeScriptReflectionHost(checker);
    let refEmitter;
    let aliasingHost = null;
    if (this.adapter.unifiedModulesHost === null || !this.options._useHostForImportGeneration) {
      let localImportStrategy;
      if (this.options.rootDir !== void 0 || this.options.rootDirs !== void 0 && this.options.rootDirs.length > 0) {
        localImportStrategy = new LogicalProjectStrategy(reflector, new LogicalFileSystem([...this.adapter.rootDirs], this.adapter));
      } else {
        localImportStrategy = new RelativePathStrategy(reflector);
      }
      refEmitter = new ReferenceEmitter([
        new LocalIdentifierStrategy(),
        new AbsoluteModuleStrategy(this.inputProgram, checker, this.moduleResolver, reflector),
        localImportStrategy
      ]);
      if (this.entryPoint === null && this.options.generateDeepReexports === true) {
        aliasingHost = new PrivateExportAliasingHost(reflector);
      }
    } else {
      refEmitter = new ReferenceEmitter([
        new LocalIdentifierStrategy(),
        new AliasStrategy(),
        new UnifiedModulesStrategy(reflector, this.adapter.unifiedModulesHost)
      ]);
      aliasingHost = new UnifiedModulesAliasingHost(this.adapter.unifiedModulesHost);
    }
    const evaluator = new PartialEvaluator(reflector, checker, this.incrementalCompilation.depGraph);
    const dtsReader = new DtsMetadataReader(checker, reflector);
    const localMetaRegistry = new LocalMetadataRegistry();
    const localMetaReader = localMetaRegistry;
    const depScopeReader = new MetadataDtsModuleScopeResolver(dtsReader, aliasingHost);
    const scopeRegistry = new LocalModuleScopeRegistry(localMetaReader, depScopeReader, refEmitter, aliasingHost);
    const scopeReader = scopeRegistry;
    const semanticDepGraphUpdater = this.incrementalCompilation.semanticDepGraphUpdater;
    const metaRegistry = new CompoundMetadataRegistry([localMetaRegistry, scopeRegistry]);
    const injectableRegistry = new InjectableClassRegistry(reflector);
    const metaReader = new CompoundMetadataReader([localMetaReader, dtsReader]);
    const typeCheckScopeRegistry = new TypeCheckScopeRegistry(scopeReader, metaReader);
    let referencesRegistry;
    let exportReferenceGraph = null;
    if (this.entryPoint !== null) {
      exportReferenceGraph = new ReferenceGraph();
      referencesRegistry = new ReferenceGraphAdapter(exportReferenceGraph);
    } else {
      referencesRegistry = new NoopReferencesRegistry();
    }
    const dtsTransforms = new DtsTransformRegistry();
    const isCore = isAngularCorePackage(this.inputProgram);
    const resourceRegistry = new ResourceRegistry();
    const compilationMode = this.options.compilationMode === "partial" && !isCore ? CompilationMode.PARTIAL : CompilationMode.FULL;
    const cycleHandlingStrategy = compilationMode === CompilationMode.FULL ? 0 : 1;
    const handlers = [
      new ComponentDecoratorHandler(reflector, evaluator, metaRegistry, metaReader, scopeReader, scopeRegistry, typeCheckScopeRegistry, resourceRegistry, isCore, this.resourceManager, this.adapter.rootDirs, this.options.preserveWhitespaces || false, this.options.i18nUseExternalIds !== false, this.options.enableI18nLegacyMessageIdFormat !== false, this.usePoisonedData, this.options.i18nNormalizeLineEndingsInICUs, this.moduleResolver, this.cycleAnalyzer, cycleHandlingStrategy, refEmitter, this.incrementalCompilation.depGraph, injectableRegistry, semanticDepGraphUpdater, this.closureCompilerEnabled, this.delegatingPerfRecorder),
      new DirectiveDecoratorHandler(reflector, evaluator, metaRegistry, scopeRegistry, metaReader, injectableRegistry, isCore, semanticDepGraphUpdater, this.closureCompilerEnabled, false, this.delegatingPerfRecorder),
      new PipeDecoratorHandler(reflector, evaluator, metaRegistry, scopeRegistry, injectableRegistry, isCore, this.delegatingPerfRecorder),
      new InjectableDecoratorHandler(reflector, isCore, this.options.strictInjectionParameters || false, injectableRegistry, this.delegatingPerfRecorder),
      new NgModuleDecoratorHandler(reflector, evaluator, metaReader, metaRegistry, scopeRegistry, referencesRegistry, isCore, refEmitter, this.adapter.factoryTracker, this.closureCompilerEnabled, injectableRegistry, this.delegatingPerfRecorder)
    ];
    const traitCompiler = new TraitCompiler(handlers, reflector, this.delegatingPerfRecorder, this.incrementalCompilation, this.options.compileNonExportedClasses !== false, compilationMode, dtsTransforms, semanticDepGraphUpdater, this.adapter);
    const notifyingDriver = new NotifyingProgramDriverWrapper(this.programDriver, (program) => {
      this.incrementalStrategy.setIncrementalState(this.incrementalCompilation.state, program);
      this.currentProgram = program;
    });
    const templateTypeChecker = new TemplateTypeCheckerImpl(this.inputProgram, notifyingDriver, traitCompiler, this.getTypeCheckingConfig(), refEmitter, reflector, this.adapter, this.incrementalCompilation, scopeRegistry, typeCheckScopeRegistry, this.delegatingPerfRecorder);
    const extendedTemplateChecker = this.constructionDiagnostics.length === 0 ? new ExtendedTemplateCheckerImpl(templateTypeChecker, checker, ALL_DIAGNOSTIC_FACTORIES, this.options) : null;
    return {
      isCore,
      traitCompiler,
      reflector,
      scopeRegistry,
      dtsTransforms,
      exportReferenceGraph,
      metaReader,
      typeCheckScopeRegistry,
      aliasingHost,
      refEmitter,
      templateTypeChecker,
      resourceRegistry,
      extendedTemplateChecker
    };
  }
};
function isAngularCorePackage(program) {
  const r3Symbols = getR3SymbolsFile(program);
  if (r3Symbols === null) {
    return false;
  }
  return r3Symbols.statements.some((stmt) => {
    if (!ts33.isVariableStatement(stmt)) {
      return false;
    }
    if (stmt.modifiers === void 0 || !stmt.modifiers.some((mod) => mod.kind === ts33.SyntaxKind.ExportKeyword)) {
      return false;
    }
    return stmt.declarationList.declarations.some((decl) => {
      if (!ts33.isIdentifier(decl.name) || decl.name.text !== "ITS_JUST_ANGULAR") {
        return false;
      }
      if (decl.initializer === void 0 || decl.initializer.kind !== ts33.SyntaxKind.TrueKeyword) {
        return false;
      }
      return true;
    });
  });
}
function getR3SymbolsFile(program) {
  return program.getSourceFiles().find((file) => file.fileName.indexOf("r3_symbols.ts") >= 0) || null;
}
function* verifyCompatibleTypeCheckOptions(options) {
  var _a, _b, _c;
  if (options.fullTemplateTypeCheck === false && options.strictTemplates === true) {
    yield makeConfigDiagnostic({
      category: ts33.DiagnosticCategory.Error,
      code: ErrorCode.CONFIG_STRICT_TEMPLATES_IMPLIES_FULL_TEMPLATE_TYPECHECK,
      messageText: `
Angular compiler option "strictTemplates" is enabled, however "fullTemplateTypeCheck" is disabled.

Having the "strictTemplates" flag enabled implies that "fullTemplateTypeCheck" is also enabled, so
the latter can not be explicitly disabled.

One of the following actions is required:
1. Remove the "fullTemplateTypeCheck" option.
2. Remove "strictTemplates" or set it to 'false'.

More information about the template type checking compiler options can be found in the documentation:
https://angular.io/guide/template-typecheck
      `.trim()
    });
  }
  if (options.extendedDiagnostics && options.strictTemplates === false) {
    yield makeConfigDiagnostic({
      category: ts33.DiagnosticCategory.Error,
      code: ErrorCode.CONFIG_EXTENDED_DIAGNOSTICS_IMPLIES_STRICT_TEMPLATES,
      messageText: `
Angular compiler option "extendedDiagnostics" is configured, however "strictTemplates" is disabled.

Using "extendedDiagnostics" requires that "strictTemplates" is also enabled.

One of the following actions is required:
1. Remove "strictTemplates: false" to enable it.
2. Remove "extendedDiagnostics" configuration to disable them.
      `.trim()
    });
  }
  const allowedCategoryLabels = Array.from(Object.values(DiagnosticCategoryLabel));
  const defaultCategory = (_a = options.extendedDiagnostics) == null ? void 0 : _a.defaultCategory;
  if (defaultCategory && !allowedCategoryLabels.includes(defaultCategory)) {
    yield makeConfigDiagnostic({
      category: ts33.DiagnosticCategory.Error,
      code: ErrorCode.CONFIG_EXTENDED_DIAGNOSTICS_UNKNOWN_CATEGORY_LABEL,
      messageText: `
Angular compiler option "extendedDiagnostics.defaultCategory" has an unknown diagnostic category: "${defaultCategory}".

Allowed diagnostic categories are:
${allowedCategoryLabels.join("\n")}
      `.trim()
    });
  }
  const allExtendedDiagnosticNames = ALL_DIAGNOSTIC_FACTORIES.map((factory3) => factory3.name);
  for (const [checkName, category] of Object.entries((_c = (_b = options.extendedDiagnostics) == null ? void 0 : _b.checks) != null ? _c : {})) {
    if (!allExtendedDiagnosticNames.includes(checkName)) {
      yield makeConfigDiagnostic({
        category: ts33.DiagnosticCategory.Error,
        code: ErrorCode.CONFIG_EXTENDED_DIAGNOSTICS_UNKNOWN_CHECK,
        messageText: `
Angular compiler option "extendedDiagnostics.checks" has an unknown check: "${checkName}".

Allowed check names are:
${allExtendedDiagnosticNames.join("\n")}
        `.trim()
      });
    }
    if (!allowedCategoryLabels.includes(category)) {
      yield makeConfigDiagnostic({
        category: ts33.DiagnosticCategory.Error,
        code: ErrorCode.CONFIG_EXTENDED_DIAGNOSTICS_UNKNOWN_CATEGORY_LABEL,
        messageText: `
Angular compiler option "extendedDiagnostics.checks['${checkName}']" has an unknown diagnostic category: "${category}".

Allowed diagnostic categories are:
${allowedCategoryLabels.join("\n")}
        `.trim()
      });
    }
  }
}
function makeConfigDiagnostic({ category, code, messageText }) {
  return {
    category,
    code: ngErrorCode(code),
    file: void 0,
    start: void 0,
    length: void 0,
    messageText
  };
}
var ReferenceGraphAdapter = class {
  constructor(graph) {
    this.graph = graph;
  }
  add(source, ...references) {
    for (const { node } of references) {
      let sourceFile = node.getSourceFile();
      if (sourceFile === void 0) {
        sourceFile = ts33.getOriginalNode(node).getSourceFile();
      }
      if (sourceFile === void 0 || !isDtsPath(sourceFile.fileName)) {
        this.graph.add(source, node);
      }
    }
  }
};
var NotifyingProgramDriverWrapper = class {
  constructor(delegate, notifyNewProgram) {
    var _a;
    this.delegate = delegate;
    this.notifyNewProgram = notifyNewProgram;
    this.getSourceFileVersion = (_a = this.delegate.getSourceFileVersion) == null ? void 0 : _a.bind(this);
  }
  get supportsInlineOperations() {
    return this.delegate.supportsInlineOperations;
  }
  getProgram() {
    return this.delegate.getProgram();
  }
  updateFiles(contents, updateMode) {
    this.delegate.updateFiles(contents, updateMode);
    this.notifyNewProgram(this.delegate.getProgram());
  }
};
function versionMapFromProgram(program, driver) {
  if (driver.getSourceFileVersion === void 0) {
    return null;
  }
  const versions = /* @__PURE__ */ new Map();
  for (const possiblyRedirectedSourceFile of program.getSourceFiles()) {
    const sf = toUnredirectedSourceFile(possiblyRedirectedSourceFile);
    versions.set(absoluteFromSourceFile(sf), driver.getSourceFileVersion(sf));
  }
  return versions;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/core/src/host.mjs
import ts34 from "typescript";
var DelegatingCompilerHost2 = class {
  constructor(delegate) {
    this.delegate = delegate;
    this.createHash = this.delegateMethod("createHash");
    this.directoryExists = this.delegateMethod("directoryExists");
    this.fileNameToModuleName = this.delegateMethod("fileNameToModuleName");
    this.getCancellationToken = this.delegateMethod("getCancellationToken");
    this.getCanonicalFileName = this.delegateMethod("getCanonicalFileName");
    this.getCurrentDirectory = this.delegateMethod("getCurrentDirectory");
    this.getDefaultLibFileName = this.delegateMethod("getDefaultLibFileName");
    this.getDefaultLibLocation = this.delegateMethod("getDefaultLibLocation");
    this.getDirectories = this.delegateMethod("getDirectories");
    this.getEnvironmentVariable = this.delegateMethod("getEnvironmentVariable");
    this.getModifiedResourceFiles = this.delegateMethod("getModifiedResourceFiles");
    this.getNewLine = this.delegateMethod("getNewLine");
    this.getParsedCommandLine = this.delegateMethod("getParsedCommandLine");
    this.getSourceFileByPath = this.delegateMethod("getSourceFileByPath");
    this.readDirectory = this.delegateMethod("readDirectory");
    this.readFile = this.delegateMethod("readFile");
    this.readResource = this.delegateMethod("readResource");
    this.transformResource = this.delegateMethod("transformResource");
    this.realpath = this.delegateMethod("realpath");
    this.resolveModuleNames = this.delegateMethod("resolveModuleNames");
    this.resolveTypeReferenceDirectives = this.delegateMethod("resolveTypeReferenceDirectives");
    this.resourceNameToFileName = this.delegateMethod("resourceNameToFileName");
    this.trace = this.delegateMethod("trace");
    this.useCaseSensitiveFileNames = this.delegateMethod("useCaseSensitiveFileNames");
    this.writeFile = this.delegateMethod("writeFile");
    this.getModuleResolutionCache = this.delegateMethod("getModuleResolutionCache");
  }
  delegateMethod(name) {
    return this.delegate[name] !== void 0 ? this.delegate[name].bind(this.delegate) : void 0;
  }
};
var NgCompilerHost = class extends DelegatingCompilerHost2 {
  constructor(delegate, inputFiles, rootDirs, shimAdapter, shimTagger, entryPoint, factoryTracker, diagnostics) {
    super(delegate);
    this.shimAdapter = shimAdapter;
    this.shimTagger = shimTagger;
    this.factoryTracker = null;
    this.entryPoint = null;
    this.factoryTracker = factoryTracker;
    this.entryPoint = entryPoint;
    this.constructionDiagnostics = diagnostics;
    this.inputFiles = [...inputFiles, ...shimAdapter.extraInputFiles];
    this.rootDirs = rootDirs;
    if (this.resolveModuleNames === void 0) {
      this.resolveModuleNames = this.createCachedResolveModuleNamesFunction();
    }
  }
  get ignoreForEmit() {
    return this.shimAdapter.ignoreForEmit;
  }
  get shimExtensionPrefixes() {
    return this.shimAdapter.extensionPrefixes;
  }
  postProgramCreationCleanup() {
    this.shimTagger.finalize();
  }
  static wrap(delegate, inputFiles, options, oldProgram) {
    const allowEmptyCodegenFiles = options.allowEmptyCodegenFiles || false;
    const shouldGenerateFactoryShims = options.generateNgFactoryShims !== void 0 ? options.generateNgFactoryShims : allowEmptyCodegenFiles;
    const shouldGenerateSummaryShims = options.generateNgSummaryShims !== void 0 ? options.generateNgSummaryShims : allowEmptyCodegenFiles;
    const topLevelShimGenerators = [];
    const perFileShimGenerators = [];
    if (shouldGenerateSummaryShims) {
      perFileShimGenerators.push(new SummaryGenerator());
    }
    let factoryTracker = null;
    if (shouldGenerateFactoryShims) {
      const factoryGenerator = new FactoryGenerator();
      perFileShimGenerators.push(factoryGenerator);
      factoryTracker = factoryGenerator;
    }
    const rootDirs = getRootDirs(delegate, options);
    perFileShimGenerators.push(new TypeCheckShimGenerator());
    let diagnostics = [];
    const normalizedTsInputFiles = [];
    for (const inputFile of inputFiles) {
      if (!isNonDeclarationTsPath(inputFile)) {
        continue;
      }
      normalizedTsInputFiles.push(resolve(inputFile));
    }
    let entryPoint = null;
    if (options.flatModuleOutFile != null && options.flatModuleOutFile !== "") {
      entryPoint = findFlatIndexEntryPoint(normalizedTsInputFiles);
      if (entryPoint === null) {
        diagnostics.push({
          category: ts34.DiagnosticCategory.Error,
          code: ngErrorCode(ErrorCode.CONFIG_FLAT_MODULE_NO_INDEX),
          file: void 0,
          start: void 0,
          length: void 0,
          messageText: 'Angular compiler option "flatModuleOutFile" requires one and only one .ts file in the "files" field.'
        });
      } else {
        const flatModuleId = options.flatModuleId || null;
        const flatModuleOutFile = normalizeSeparators(options.flatModuleOutFile);
        const flatIndexGenerator = new FlatIndexGenerator(entryPoint, flatModuleOutFile, flatModuleId);
        topLevelShimGenerators.push(flatIndexGenerator);
      }
    }
    const shimAdapter = new ShimAdapter(delegate, normalizedTsInputFiles, topLevelShimGenerators, perFileShimGenerators, oldProgram);
    const shimTagger = new ShimReferenceTagger(perFileShimGenerators.map((gen) => gen.extensionPrefix));
    return new NgCompilerHost(delegate, inputFiles, rootDirs, shimAdapter, shimTagger, entryPoint, factoryTracker, diagnostics);
  }
  isShim(sf) {
    return isShim(sf);
  }
  isResource(sf) {
    return false;
  }
  getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
    const shimSf = this.shimAdapter.maybeGenerate(resolve(fileName));
    if (shimSf !== null) {
      return shimSf;
    }
    const sf = this.delegate.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    if (sf === void 0) {
      return void 0;
    }
    this.shimTagger.tag(sf);
    return sf;
  }
  fileExists(fileName) {
    return this.delegate.fileExists(fileName) || this.shimAdapter.maybeGenerate(resolve(fileName)) != null;
  }
  get unifiedModulesHost() {
    return this.fileNameToModuleName !== void 0 ? this : null;
  }
  createCachedResolveModuleNamesFunction() {
    const moduleResolutionCache = ts34.createModuleResolutionCache(this.getCurrentDirectory(), this.getCanonicalFileName.bind(this));
    return (moduleNames, containingFile, reusedNames, redirectedReference, options) => {
      return moduleNames.map((moduleName) => {
        const module = ts34.resolveModuleName(moduleName, containingFile, options, this, moduleResolutionCache, redirectedReference);
        return module.resolvedModule;
      });
    };
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/program.mjs
var NgtscProgram = class {
  constructor(rootNames, options, delegateHost, oldProgram) {
    this.options = options;
    const perfRecorder = ActivePerfRecorder.zeroedToNow();
    perfRecorder.phase(PerfPhase.Setup);
    if (!options.disableTypeScriptVersionCheck) {
      verifySupportedTypeScriptVersion();
    }
    const reuseProgram = oldProgram == null ? void 0 : oldProgram.compiler.getCurrentProgram();
    this.host = NgCompilerHost.wrap(delegateHost, rootNames, options, reuseProgram != null ? reuseProgram : null);
    if (reuseProgram !== void 0) {
      retagAllTsFiles(reuseProgram);
    }
    this.tsProgram = perfRecorder.inPhase(PerfPhase.TypeScriptProgramCreate, () => ts35.createProgram(this.host.inputFiles, options, this.host, reuseProgram));
    perfRecorder.phase(PerfPhase.Unaccounted);
    perfRecorder.memory(PerfCheckpoint.TypeScriptProgramCreate);
    this.host.postProgramCreationCleanup();
    untagAllTsFiles(this.tsProgram);
    const programDriver = new TsCreateProgramDriver(this.tsProgram, this.host, this.options, this.host.shimExtensionPrefixes);
    this.incrementalStrategy = oldProgram !== void 0 ? oldProgram.incrementalStrategy.toNextBuildStrategy() : new TrackedIncrementalBuildStrategy();
    const modifiedResourceFiles = /* @__PURE__ */ new Set();
    if (this.host.getModifiedResourceFiles !== void 0) {
      const strings = this.host.getModifiedResourceFiles();
      if (strings !== void 0) {
        for (const fileString of strings) {
          modifiedResourceFiles.add(absoluteFrom(fileString));
        }
      }
    }
    let ticket;
    if (oldProgram === void 0) {
      ticket = freshCompilationTicket(this.tsProgram, options, this.incrementalStrategy, programDriver, perfRecorder, false, false);
    } else {
      ticket = incrementalFromCompilerTicket(oldProgram.compiler, this.tsProgram, this.incrementalStrategy, programDriver, modifiedResourceFiles, perfRecorder);
    }
    this.compiler = NgCompiler.fromTicket(ticket, this.host);
  }
  getTsProgram() {
    return this.tsProgram;
  }
  getReuseTsProgram() {
    return this.compiler.getCurrentProgram();
  }
  getTsOptionDiagnostics(cancellationToken) {
    return this.compiler.perfRecorder.inPhase(PerfPhase.TypeScriptDiagnostics, () => this.tsProgram.getOptionsDiagnostics(cancellationToken));
  }
  getTsSyntacticDiagnostics(sourceFile, cancellationToken) {
    return this.compiler.perfRecorder.inPhase(PerfPhase.TypeScriptDiagnostics, () => {
      const ignoredFiles = this.compiler.ignoreForDiagnostics;
      let res;
      if (sourceFile !== void 0) {
        if (ignoredFiles.has(sourceFile)) {
          return [];
        }
        res = this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
      } else {
        const diagnostics = [];
        for (const sf of this.tsProgram.getSourceFiles()) {
          if (!ignoredFiles.has(sf)) {
            diagnostics.push(...this.tsProgram.getSyntacticDiagnostics(sf, cancellationToken));
          }
        }
        res = diagnostics;
      }
      return res;
    });
  }
  getTsSemanticDiagnostics(sourceFile, cancellationToken) {
    return this.compiler.perfRecorder.inPhase(PerfPhase.TypeScriptDiagnostics, () => {
      const ignoredFiles = this.compiler.ignoreForDiagnostics;
      let res;
      if (sourceFile !== void 0) {
        if (ignoredFiles.has(sourceFile)) {
          return [];
        }
        res = this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
      } else {
        const diagnostics = [];
        for (const sf of this.tsProgram.getSourceFiles()) {
          if (!ignoredFiles.has(sf)) {
            diagnostics.push(...this.tsProgram.getSemanticDiagnostics(sf, cancellationToken));
          }
        }
        res = diagnostics;
      }
      return res;
    });
  }
  getNgOptionDiagnostics(cancellationToken) {
    return this.compiler.getOptionDiagnostics();
  }
  getNgStructuralDiagnostics(cancellationToken) {
    return [];
  }
  getNgSemanticDiagnostics(fileName, cancellationToken) {
    let sf = void 0;
    if (fileName !== void 0) {
      sf = this.tsProgram.getSourceFile(fileName);
      if (sf === void 0) {
        return [];
      }
    }
    if (sf === void 0) {
      return this.compiler.getDiagnostics();
    } else {
      return this.compiler.getDiagnosticsForFile(sf, OptimizeFor.WholeProgram);
    }
  }
  loadNgStructureAsync() {
    return this.compiler.analyzeAsync();
  }
  listLazyRoutes(entryRoute) {
    return [];
  }
  emitXi18n() {
    var _a, _b, _c;
    const ctx = new MessageBundle(new HtmlParser(), [], {}, (_a = this.options.i18nOutLocale) != null ? _a : null);
    this.compiler.xi18n(ctx);
    i18nExtract((_b = this.options.i18nOutFormat) != null ? _b : null, (_c = this.options.i18nOutFile) != null ? _c : null, this.host, this.options, ctx, resolve);
  }
  emit(opts) {
    if (opts !== void 0 && opts.emitFlags !== void 0 && opts.emitFlags & EmitFlags.I18nBundle) {
      this.emitXi18n();
      if (!(opts.emitFlags & EmitFlags.JS)) {
        return {
          diagnostics: [],
          emitSkipped: true,
          emittedFiles: []
        };
      }
    }
    this.compiler.perfRecorder.memory(PerfCheckpoint.PreEmit);
    const res = this.compiler.perfRecorder.inPhase(PerfPhase.TypeScriptEmit, () => {
      const { transformers } = this.compiler.prepareEmit();
      const ignoreFiles = this.compiler.ignoreForEmit;
      const emitCallback = opts && opts.emitCallback || defaultEmitCallback;
      const writeFile = (fileName, data, writeByteOrderMark, onError, sourceFiles) => {
        if (sourceFiles !== void 0) {
          for (const writtenSf of sourceFiles) {
            if (writtenSf.isDeclarationFile) {
              continue;
            }
            this.compiler.incrementalCompilation.recordSuccessfulEmit(writtenSf);
          }
        }
        this.host.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
      };
      const customTransforms = opts && opts.customTransformers;
      const beforeTransforms = transformers.before || [];
      const afterDeclarationsTransforms = transformers.afterDeclarations;
      if (customTransforms !== void 0 && customTransforms.beforeTs !== void 0) {
        beforeTransforms.push(...customTransforms.beforeTs);
      }
      const emitResults = [];
      for (const targetSourceFile of this.tsProgram.getSourceFiles()) {
        if (targetSourceFile.isDeclarationFile || ignoreFiles.has(targetSourceFile)) {
          continue;
        }
        if (this.compiler.incrementalCompilation.safeToSkipEmit(targetSourceFile)) {
          this.compiler.perfRecorder.eventCount(PerfEvent.EmitSkipSourceFile);
          continue;
        }
        this.compiler.perfRecorder.eventCount(PerfEvent.EmitSourceFile);
        emitResults.push(emitCallback({
          targetSourceFile,
          program: this.tsProgram,
          host: this.host,
          options: this.options,
          emitOnlyDtsFiles: false,
          writeFile,
          customTransformers: {
            before: beforeTransforms,
            after: customTransforms && customTransforms.afterTs,
            afterDeclarations: afterDeclarationsTransforms
          }
        }));
      }
      this.compiler.perfRecorder.memory(PerfCheckpoint.Emit);
      return (opts && opts.mergeEmitResultsCallback || mergeEmitResults)(emitResults);
    });
    if (this.options.tracePerformance !== void 0) {
      const perf = this.compiler.perfRecorder.finalize();
      getFileSystem().writeFile(getFileSystem().resolve(this.options.tracePerformance), JSON.stringify(perf, null, 2));
    }
    return res;
  }
  getIndexedComponents() {
    return this.compiler.getIndexedComponents();
  }
  getEmittedSourceFiles() {
    throw new Error("Method not implemented.");
  }
};
var defaultEmitCallback = ({ program, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers }) => program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
function mergeEmitResults(emitResults) {
  const diagnostics = [];
  let emitSkipped = false;
  const emittedFiles = [];
  for (const er of emitResults) {
    diagnostics.push(...er.diagnostics);
    emitSkipped = emitSkipped || er.emitSkipped;
    emittedFiles.push(...er.emittedFiles || []);
  }
  return { diagnostics, emitSkipped, emittedFiles };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/program.mjs
function createProgram({ rootNames, options, host, oldProgram }) {
  return new NgtscProgram(rootNames, options, host, oldProgram);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/perform_compile.mjs
import ts37 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/transformers/util.mjs
import ts36 from "typescript";
var GENERATED_FILES = /(.*?)\.(ngfactory|shim\.ngstyle|ngstyle|ngsummary)\.(js|d\.ts|ts)$/;
function createMessageDiagnostic(messageText) {
  return {
    file: void 0,
    start: void 0,
    length: void 0,
    category: ts36.DiagnosticCategory.Message,
    messageText,
    code: DEFAULT_ERROR_CODE,
    source: SOURCE
  };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/perform_compile.mjs
var defaultFormatHost = {
  getCurrentDirectory: () => ts37.sys.getCurrentDirectory(),
  getCanonicalFileName: (fileName) => fileName,
  getNewLine: () => ts37.sys.newLine
};
function formatDiagnostics(diags, host = defaultFormatHost) {
  if (diags && diags.length) {
    return diags.map((diagnostic) => replaceTsWithNgInErrors(ts37.formatDiagnosticsWithColorAndContext([diagnostic], host))).join("");
  } else {
    return "";
  }
}
function calcProjectFileAndBasePath(project, host = getFileSystem()) {
  const absProject = host.resolve(project);
  const projectIsDir = host.lstat(absProject).isDirectory();
  const projectFile = projectIsDir ? host.join(absProject, "tsconfig.json") : absProject;
  const projectDir = projectIsDir ? absProject : host.dirname(absProject);
  const basePath = host.resolve(projectDir);
  return { projectFile, basePath };
}
function readConfiguration(project, existingOptions, host = getFileSystem()) {
  var _a, _b;
  try {
    const fs = getFileSystem();
    const readConfigFile = (configFile) => ts37.readConfigFile(configFile, (file) => host.readFile(host.resolve(file)));
    const readAngularCompilerOptions = (configFile, parentOptions = {}) => {
      const { config: config2, error: error2 } = readConfigFile(configFile);
      if (error2) {
        return parentOptions;
      }
      const existingNgCompilerOptions = __spreadValues(__spreadValues({}, config2.angularCompilerOptions), parentOptions);
      if (config2.extends && typeof config2.extends === "string") {
        const extendedConfigPath = getExtendedConfigPath(configFile, config2.extends, host, fs);
        if (extendedConfigPath !== null) {
          return readAngularCompilerOptions(extendedConfigPath, existingNgCompilerOptions);
        }
      }
      return existingNgCompilerOptions;
    };
    const { projectFile, basePath } = calcProjectFileAndBasePath(project, host);
    const configFileName = host.resolve(host.pwd(), projectFile);
    const { config, error } = readConfigFile(projectFile);
    if (error) {
      return {
        project,
        errors: [error],
        rootNames: [],
        options: {},
        emitFlags: EmitFlags.Default
      };
    }
    const existingCompilerOptions = __spreadValues(__spreadValues({
      genDir: basePath,
      basePath
    }, readAngularCompilerOptions(configFileName)), existingOptions);
    const parseConfigHost = createParseConfigHost(host, fs);
    const { options, errors, fileNames: rootNames, projectReferences } = ts37.parseJsonConfigFileContent(config, parseConfigHost, basePath, existingCompilerOptions, configFileName);
    options.enableIvy = !!((_a = options.enableIvy) != null ? _a : true);
    let emitFlags = EmitFlags.Default;
    if (!(options.skipMetadataEmit || options.flatModuleOutFile)) {
      emitFlags |= EmitFlags.Metadata;
    }
    if (options.skipTemplateCodegen) {
      emitFlags = emitFlags & ~EmitFlags.Codegen;
    }
    return { project: projectFile, rootNames, projectReferences, options, errors, emitFlags };
  } catch (e) {
    const errors = [{
      category: ts37.DiagnosticCategory.Error,
      messageText: (_b = e.stack) != null ? _b : e.message,
      file: void 0,
      start: void 0,
      length: void 0,
      source: "angular",
      code: UNKNOWN_ERROR_CODE
    }];
    return { project: "", errors, rootNames: [], options: {}, emitFlags: EmitFlags.Default };
  }
}
function createParseConfigHost(host, fs = getFileSystem()) {
  return {
    fileExists: host.exists.bind(host),
    readDirectory: ts37.sys.readDirectory,
    readFile: host.readFile.bind(host),
    useCaseSensitiveFileNames: fs.isCaseSensitive()
  };
}
function getExtendedConfigPath(configFile, extendsValue, host, fs) {
  const result = getExtendedConfigPathWorker(configFile, extendsValue, host, fs);
  if (result !== null) {
    return result;
  }
  return getExtendedConfigPathWorker(configFile, `${extendsValue}.json`, host, fs);
}
function getExtendedConfigPathWorker(configFile, extendsValue, host, fs) {
  if (extendsValue.startsWith(".") || fs.isRooted(extendsValue)) {
    const extendedConfigPath = host.resolve(host.dirname(configFile), extendsValue);
    if (host.exists(extendedConfigPath)) {
      return extendedConfigPath;
    }
  } else {
    const parseConfigHost = createParseConfigHost(host, fs);
    const { resolvedModule } = ts37.nodeModuleNameResolver(extendsValue, configFile, { moduleResolution: ts37.ModuleResolutionKind.NodeJs, resolveJsonModule: true }, parseConfigHost);
    if (resolvedModule) {
      return absoluteFrom(resolvedModule.resolvedFileName);
    }
  }
  return null;
}
function exitCodeFromResult(diags) {
  if (!diags)
    return 0;
  if (diags.every((diag) => diag.category !== ts37.DiagnosticCategory.Error)) {
    return 0;
  }
  return diags.some((d) => d.source === "angular" && d.code === UNKNOWN_ERROR_CODE) ? 2 : 1;
}
function performCompilation({ rootNames, options, host, oldProgram, emitCallback, mergeEmitResultsCallback, gatherDiagnostics = defaultGatherDiagnostics, customTransformers, emitFlags = EmitFlags.Default, modifiedResourceFiles = null }) {
  var _a;
  let program;
  let emitResult;
  let allDiagnostics = [];
  try {
    if (!host) {
      host = createCompilerHost({ options });
    }
    if (modifiedResourceFiles) {
      host.getModifiedResourceFiles = () => modifiedResourceFiles;
    }
    program = createProgram({ rootNames, host, options, oldProgram });
    const beforeDiags = Date.now();
    allDiagnostics.push(...gatherDiagnostics(program));
    if (options.diagnostics) {
      const afterDiags = Date.now();
      allDiagnostics.push(createMessageDiagnostic(`Time for diagnostics: ${afterDiags - beforeDiags}ms.`));
    }
    if (!hasErrors(allDiagnostics)) {
      emitResult = program.emit({ emitCallback, mergeEmitResultsCallback, customTransformers, emitFlags });
      allDiagnostics.push(...emitResult.diagnostics);
      return { diagnostics: allDiagnostics, program, emitResult };
    }
    return { diagnostics: allDiagnostics, program };
  } catch (e) {
    program = void 0;
    allDiagnostics.push({
      category: ts37.DiagnosticCategory.Error,
      messageText: (_a = e.stack) != null ? _a : e.message,
      code: UNKNOWN_ERROR_CODE,
      file: void 0,
      start: void 0,
      length: void 0
    });
    return { diagnostics: allDiagnostics, program };
  }
}
function defaultGatherDiagnostics(program) {
  const allDiagnostics = [];
  function checkDiagnostics(diags) {
    if (diags) {
      allDiagnostics.push(...diags);
      return !hasErrors(diags);
    }
    return true;
  }
  let checkOtherDiagnostics = true;
  checkOtherDiagnostics = checkOtherDiagnostics && checkDiagnostics([...program.getTsOptionDiagnostics(), ...program.getNgOptionDiagnostics()]);
  checkOtherDiagnostics = checkOtherDiagnostics && checkDiagnostics(program.getTsSyntacticDiagnostics());
  checkOtherDiagnostics = checkOtherDiagnostics && checkDiagnostics([...program.getTsSemanticDiagnostics(), ...program.getNgStructuralDiagnostics()]);
  checkOtherDiagnostics = checkOtherDiagnostics && checkDiagnostics(program.getNgSemanticDiagnostics());
  return allDiagnostics;
}
function hasErrors(diags) {
  return diags.some((d) => d.category === ts37.DiagnosticCategory.Error);
}

export {
  DEFAULT_ERROR_CODE,
  UNKNOWN_ERROR_CODE,
  SOURCE,
  isTsDiagnostic,
  EmitFlags,
  createCompilerHost,
  CycleAnalyzer,
  ImportGraph,
  isShim,
  untagAllTsFiles,
  TsCreateProgramDriver,
  PatchedProgramIncrementalBuildStrategy,
  MetadataDtsModuleScopeResolver,
  LocalModuleScopeRegistry,
  TypeCheckScopeRegistry,
  OptimizeFor,
  freshCompilationTicket,
  incrementalFromStateTicket,
  NgCompiler,
  NgCompilerHost,
  NgtscProgram,
  createProgram,
  GENERATED_FILES,
  createMessageDiagnostic,
  formatDiagnostics,
  calcProjectFileAndBasePath,
  readConfiguration,
  exitCodeFromResult,
  performCompilation,
  defaultGatherDiagnostics
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Closure Compiler ignores @suppress and similar if the comment contains @license.
//# sourceMappingURL=chunk-4MML3U2F.js.map
