
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  removeLockFile
} from "./chunk-HMWNYAAE.js";
import {
  Deferred,
  DirectPackageJsonUpdater,
  DtsProcessing,
  IGNORED_ENTRY_POINT,
  INCOMPATIBLE_ENTRY_POINT,
  NGCC_BACKUP_EXTENSION,
  NGCC_DIRECTORY,
  NGCC_PROPERTY_EXTENSION,
  NGCC_TIMED_OUT_EXIT_CODE,
  NO_ENTRY_POINT,
  SUPPORTED_FORMAT_PROPERTIES,
  computeTaskDependencies,
  getBlockedTasks,
  getCreateCompileFn,
  getEntryPointFormat,
  getEntryPointInfo,
  getImportsOfUmdModule,
  getMaxNumberOfWorkers,
  getPathMappingsFromTsConfig,
  getSharedSetup,
  isEntryPoint,
  isRelativePath,
  isRequireCall,
  isWildcardReexportStatement,
  parseStatementForUmdModule,
  resolveFileWithPostfixes,
  sendMessageToWorker,
  sortTasksByPriority,
  stringifyTask
} from "./chunk-6XCV2P22.js";
import {
  LogLevel
} from "./chunk-7J66ZDC5.js";
import {
  absoluteFrom,
  getFileSystem
} from "./chunk-MMRSE3VM.js";
import {
  __require,
  __spreadProps,
  __spreadValues
} from "./chunk-GMSUYBZP.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host.mjs
import ts from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/module_resolver.mjs
var ModuleResolver = class {
  constructor(fs, pathMappings, relativeExtensions = ["", ".js", "/index.js"]) {
    this.fs = fs;
    this.relativeExtensions = relativeExtensions;
    this.pathMappings = pathMappings ? this.processPathMappings(pathMappings) : [];
  }
  resolveModuleImport(moduleName, fromPath) {
    if (isRelativePath(moduleName)) {
      return this.resolveAsRelativePath(moduleName, fromPath);
    } else {
      return this.pathMappings.length && this.resolveByPathMappings(moduleName, fromPath) || this.resolveAsEntryPoint(moduleName, fromPath);
    }
  }
  processPathMappings(pathMappings) {
    const baseUrl = this.fs.resolve(pathMappings.baseUrl);
    return Object.keys(pathMappings.paths).map((pathPattern) => {
      const matcher = splitOnStar(pathPattern);
      const templates = pathMappings.paths[pathPattern].map(splitOnStar);
      return { matcher, templates, baseUrl };
    });
  }
  resolveAsRelativePath(moduleName, fromPath) {
    const resolvedPath = resolveFileWithPostfixes(this.fs, this.fs.resolve(this.fs.dirname(fromPath), moduleName), this.relativeExtensions);
    return resolvedPath && new ResolvedRelativeModule(resolvedPath);
  }
  resolveByPathMappings(moduleName, fromPath) {
    const mappedPaths = this.findMappedPaths(moduleName);
    if (mappedPaths.length > 0) {
      const packagePath = this.findPackagePath(fromPath);
      if (packagePath !== null) {
        for (const mappedPath of mappedPaths) {
          if (this.isEntryPoint(mappedPath)) {
            return new ResolvedExternalModule(mappedPath);
          }
          const nonEntryPointImport = this.resolveAsRelativePath(mappedPath, fromPath);
          if (nonEntryPointImport !== null) {
            return isRelativeImport(packagePath, mappedPath) ? nonEntryPointImport : new ResolvedDeepImport(mappedPath);
          }
        }
      }
    }
    return null;
  }
  resolveAsEntryPoint(moduleName, fromPath) {
    let folder = fromPath;
    while (!this.fs.isRoot(folder)) {
      folder = this.fs.dirname(folder);
      if (folder.endsWith("node_modules")) {
        folder = this.fs.dirname(folder);
      }
      const modulePath = this.fs.resolve(folder, "node_modules", moduleName);
      if (this.isEntryPoint(modulePath)) {
        return new ResolvedExternalModule(modulePath);
      } else if (this.resolveAsRelativePath(modulePath, fromPath)) {
        return new ResolvedDeepImport(modulePath);
      }
    }
    return null;
  }
  isEntryPoint(modulePath) {
    return this.fs.exists(this.fs.join(modulePath, "package.json"));
  }
  findMappedPaths(moduleName) {
    const matches = this.pathMappings.map((mapping) => this.matchMapping(moduleName, mapping));
    let bestMapping;
    let bestMatch;
    for (let index = 0; index < this.pathMappings.length; index++) {
      const mapping = this.pathMappings[index];
      const match = matches[index];
      if (match !== null) {
        if (!mapping.matcher.hasWildcard) {
          bestMatch = match;
          bestMapping = mapping;
          break;
        }
        if (!bestMapping || mapping.matcher.prefix > bestMapping.matcher.prefix) {
          bestMatch = match;
          bestMapping = mapping;
        }
      }
    }
    return bestMapping !== void 0 && bestMatch !== void 0 ? this.computeMappedTemplates(bestMapping, bestMatch) : [];
  }
  matchMapping(path, mapping) {
    const { prefix, postfix, hasWildcard } = mapping.matcher;
    if (hasWildcard) {
      return path.startsWith(prefix) && path.endsWith(postfix) ? path.substring(prefix.length, path.length - postfix.length) : null;
    } else {
      return path === prefix ? "" : null;
    }
  }
  computeMappedTemplates(mapping, match) {
    return mapping.templates.map((template) => this.fs.resolve(mapping.baseUrl, template.prefix + match + template.postfix));
  }
  findPackagePath(path) {
    let folder = path;
    while (!this.fs.isRoot(folder)) {
      folder = this.fs.dirname(folder);
      if (this.fs.exists(this.fs.join(folder, "package.json"))) {
        return folder;
      }
    }
    return null;
  }
};
var ResolvedExternalModule = class {
  constructor(entryPointPath) {
    this.entryPointPath = entryPointPath;
  }
};
var ResolvedRelativeModule = class {
  constructor(modulePath) {
    this.modulePath = modulePath;
  }
};
var ResolvedDeepImport = class {
  constructor(importPath) {
    this.importPath = importPath;
  }
};
function splitOnStar(str) {
  const [prefix, postfix] = str.split("*", 2);
  return { prefix, postfix: postfix || "", hasWildcard: postfix !== void 0 };
}
function isRelativeImport(from, to) {
  return to.startsWith(from) && !to.includes("node_modules");
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/dependency_host.mjs
function createDependencyInfo() {
  return { dependencies: /* @__PURE__ */ new Set(), missing: /* @__PURE__ */ new Set(), deepImports: /* @__PURE__ */ new Set() };
}
var DependencyHostBase = class {
  constructor(fs, moduleResolver) {
    this.fs = fs;
    this.moduleResolver = moduleResolver;
  }
  collectDependencies(entryPointPath, { dependencies, missing, deepImports }) {
    const resolvedFile = resolveFileWithPostfixes(this.fs, entryPointPath, this.moduleResolver.relativeExtensions);
    if (resolvedFile !== null) {
      const alreadySeen = /* @__PURE__ */ new Set();
      this.recursivelyCollectDependencies(resolvedFile, dependencies, missing, deepImports, alreadySeen);
    }
  }
  collectDependenciesInFiles(files, { dependencies, missing, deepImports }) {
    const alreadySeen = /* @__PURE__ */ new Set();
    for (const file of files) {
      this.processFile(file, dependencies, missing, deepImports, alreadySeen);
    }
  }
  recursivelyCollectDependencies(file, dependencies, missing, deepImports, alreadySeen) {
    const fromContents = this.fs.readFile(file);
    if (this.canSkipFile(fromContents)) {
      return;
    }
    const imports = this.extractImports(file, fromContents);
    for (const importPath of imports) {
      const resolved = this.processImport(importPath, file, dependencies, missing, deepImports, alreadySeen);
      if (!resolved) {
        missing.add(importPath);
      }
    }
  }
  processImport(importPath, file, dependencies, missing, deepImports, alreadySeen) {
    const resolvedModule = this.moduleResolver.resolveModuleImport(importPath, file);
    if (resolvedModule === null) {
      return false;
    }
    if (resolvedModule instanceof ResolvedRelativeModule) {
      this.processFile(resolvedModule.modulePath, dependencies, missing, deepImports, alreadySeen);
    } else if (resolvedModule instanceof ResolvedDeepImport) {
      deepImports.add(resolvedModule.importPath);
    } else {
      dependencies.add(resolvedModule.entryPointPath);
    }
    return true;
  }
  processFile(file, dependencies, missing, deepImports, alreadySeen) {
    if (!alreadySeen.has(file)) {
      alreadySeen.add(file);
      this.recursivelyCollectDependencies(file, dependencies, missing, deepImports, alreadySeen);
    }
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/commonjs_dependency_host.mjs
var CommonJsDependencyHost = class extends DependencyHostBase {
  canSkipFile(fileContents) {
    return !hasRequireCalls(fileContents);
  }
  extractImports(file, fileContents) {
    const sf = ts.createSourceFile(file, fileContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
    const requireCalls = [];
    for (const stmt of sf.statements) {
      if (ts.isVariableStatement(stmt)) {
        const declarations = stmt.declarationList.declarations;
        for (const declaration of declarations) {
          if (declaration.initializer !== void 0 && isRequireCall(declaration.initializer)) {
            requireCalls.push(declaration.initializer);
          }
        }
      } else if (ts.isExpressionStatement(stmt)) {
        if (isRequireCall(stmt.expression)) {
          requireCalls.push(stmt.expression);
        } else if (isWildcardReexportStatement(stmt)) {
          const firstExportArg = stmt.expression.arguments[0];
          if (isRequireCall(firstExportArg)) {
            requireCalls.push(firstExportArg);
          }
        } else if (ts.isBinaryExpression(stmt.expression) && stmt.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
          if (isRequireCall(stmt.expression.right)) {
            requireCalls.push(stmt.expression.right);
          } else if (ts.isObjectLiteralExpression(stmt.expression.right)) {
            stmt.expression.right.properties.forEach((prop) => {
              if (ts.isPropertyAssignment(prop) && isRequireCall(prop.initializer)) {
                requireCalls.push(prop.initializer);
              }
            });
          }
        }
      }
    }
    return new Set(requireCalls.map((call) => call.arguments[0].text));
  }
};
function hasRequireCalls(source) {
  return /require\(['"]/.test(source);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/dependency_resolver.mjs
import { DepGraph } from "dependency-graph";
import module from "module";
var builtinNodeJsModules = new Set(module.builtinModules);
var DependencyResolver = class {
  constructor(fs, logger, config, hosts, typingsHost) {
    this.fs = fs;
    this.logger = logger;
    this.config = config;
    this.hosts = hosts;
    this.typingsHost = typingsHost;
  }
  sortEntryPointsByDependency(entryPoints, target) {
    const { invalidEntryPoints, ignoredDependencies, graph } = this.computeDependencyGraph(entryPoints);
    let sortedEntryPointNodes;
    if (target) {
      if (target.compiledByAngular && graph.hasNode(target.path)) {
        sortedEntryPointNodes = graph.dependenciesOf(target.path);
        sortedEntryPointNodes.push(target.path);
      } else {
        sortedEntryPointNodes = [];
      }
    } else {
      sortedEntryPointNodes = graph.overallOrder();
    }
    return {
      entryPoints: sortedEntryPointNodes.map((path) => graph.getNodeData(path)),
      graph,
      invalidEntryPoints,
      ignoredDependencies
    };
  }
  getEntryPointWithDependencies(entryPoint) {
    const dependencies = createDependencyInfo();
    if (entryPoint.compiledByAngular) {
      const formatInfo = this.getEntryPointFormatInfo(entryPoint);
      const host = this.hosts[formatInfo.format];
      if (!host) {
        throw new Error(`Could not find a suitable format for computing dependencies of entry-point: '${entryPoint.path}'.`);
      }
      host.collectDependencies(formatInfo.path, dependencies);
      this.typingsHost.collectDependencies(entryPoint.typings, dependencies);
    }
    return { entryPoint, depInfo: dependencies };
  }
  computeDependencyGraph(entryPoints) {
    const invalidEntryPoints = [];
    const ignoredDependencies = [];
    const graph = new DepGraph();
    const angularEntryPoints = entryPoints.filter((e) => e.entryPoint.compiledByAngular);
    angularEntryPoints.forEach((e) => graph.addNode(e.entryPoint.path, e.entryPoint));
    angularEntryPoints.forEach(({ entryPoint, depInfo: { dependencies, missing, deepImports } }) => {
      const missingDependencies = Array.from(missing).filter((dep) => !builtinNodeJsModules.has(dep));
      if (missingDependencies.length > 0 && !entryPoint.ignoreMissingDependencies) {
        removeNodes(entryPoint, missingDependencies);
      } else {
        dependencies.forEach((dependencyPath) => {
          if (!graph.hasNode(entryPoint.path)) {
          } else if (graph.hasNode(dependencyPath)) {
            graph.addDependency(entryPoint.path, dependencyPath);
          } else if (invalidEntryPoints.some((i) => i.entryPoint.path === dependencyPath)) {
            removeNodes(entryPoint, [dependencyPath]);
          } else {
            ignoredDependencies.push({ entryPoint, dependencyPath });
          }
        });
      }
      if (deepImports.size > 0) {
        const notableDeepImports = this.filterIgnorableDeepImports(entryPoint, deepImports);
        if (notableDeepImports.length > 0) {
          const imports = notableDeepImports.map((i) => `'${i}'`).join(", ");
          this.logger.warn(`Entry point '${entryPoint.name}' contains deep imports into ${imports}. This is probably not a problem, but may cause the compilation of entry points to be out of order.`);
        }
      }
    });
    return { invalidEntryPoints, ignoredDependencies, graph };
    function removeNodes(entryPoint, missingDependencies) {
      const nodesToRemove = [entryPoint.path, ...graph.dependantsOf(entryPoint.path)];
      nodesToRemove.forEach((node) => {
        invalidEntryPoints.push({ entryPoint: graph.getNodeData(node), missingDependencies });
        graph.removeNode(node);
      });
    }
  }
  getEntryPointFormatInfo(entryPoint) {
    for (const property of SUPPORTED_FORMAT_PROPERTIES) {
      const formatPath = entryPoint.packageJson[property];
      if (formatPath === void 0)
        continue;
      const format = getEntryPointFormat(this.fs, entryPoint, property);
      if (format === void 0)
        continue;
      return { format, path: this.fs.resolve(entryPoint.path, formatPath) };
    }
    throw new Error(`There is no appropriate source code format in '${entryPoint.path}' entry-point.`);
  }
  filterIgnorableDeepImports(entryPoint, deepImports) {
    const version = entryPoint.packageJson.version || null;
    const packageConfig = this.config.getPackageConfig(entryPoint.packageName, entryPoint.packagePath, version);
    const matchers = packageConfig.ignorableDeepImportMatchers;
    return Array.from(deepImports).filter((deepImport) => !matchers.some((matcher) => matcher.test(deepImport)));
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/esm_dependency_host.mjs
import ts2 from "typescript";
var EsmDependencyHost = class extends DependencyHostBase {
  constructor(fs, moduleResolver, scanImportExpressions = true) {
    super(fs, moduleResolver);
    this.scanImportExpressions = scanImportExpressions;
    this.scanner = ts2.createScanner(ts2.ScriptTarget.Latest, true);
  }
  canSkipFile(fileContents) {
    return !hasImportOrReexportStatements(fileContents);
  }
  extractImports(file, fileContents) {
    const imports = /* @__PURE__ */ new Set();
    const templateStack = [];
    let lastToken = ts2.SyntaxKind.Unknown;
    let currentToken = ts2.SyntaxKind.Unknown;
    const stopAtIndex = findLastPossibleImportOrReexport(fileContents);
    this.scanner.setText(fileContents);
    while ((currentToken = this.scanner.scan()) !== ts2.SyntaxKind.EndOfFileToken) {
      if (this.scanner.getTokenPos() > stopAtIndex) {
        break;
      }
      switch (currentToken) {
        case ts2.SyntaxKind.TemplateHead:
          templateStack.push(currentToken);
          break;
        case ts2.SyntaxKind.OpenBraceToken:
          if (templateStack.length > 0) {
            templateStack.push(currentToken);
          }
          break;
        case ts2.SyntaxKind.CloseBraceToken:
          if (templateStack.length > 0) {
            const templateToken = templateStack[templateStack.length - 1];
            if (templateToken === ts2.SyntaxKind.TemplateHead) {
              currentToken = this.scanner.reScanTemplateToken(false);
              if (currentToken === ts2.SyntaxKind.TemplateTail) {
                templateStack.pop();
              }
            } else {
              templateStack.pop();
            }
          }
          break;
        case ts2.SyntaxKind.SlashToken:
        case ts2.SyntaxKind.SlashEqualsToken:
          if (canPrecedeARegex(lastToken)) {
            currentToken = this.scanner.reScanSlashToken();
          }
          break;
        case ts2.SyntaxKind.ImportKeyword:
          const importPath = this.extractImportPath();
          if (importPath !== null) {
            imports.add(importPath);
          }
          break;
        case ts2.SyntaxKind.ExportKeyword:
          const reexportPath = this.extractReexportPath();
          if (reexportPath !== null) {
            imports.add(reexportPath);
          }
          break;
      }
      lastToken = currentToken;
    }
    this.scanner.setText("");
    return imports;
  }
  extractImportPath() {
    let sideEffectImportPath = this.tryStringLiteral();
    if (sideEffectImportPath !== null) {
      return sideEffectImportPath;
    }
    let kind = this.scanner.getToken();
    if (kind === ts2.SyntaxKind.OpenParenToken) {
      return this.scanImportExpressions ? this.tryStringLiteral() : null;
    }
    if (kind === ts2.SyntaxKind.Identifier) {
      kind = this.scanner.scan();
      if (kind === ts2.SyntaxKind.CommaToken) {
        kind = this.scanner.scan();
      }
    }
    if (kind === ts2.SyntaxKind.AsteriskToken) {
      kind = this.skipNamespacedClause();
      if (kind === null) {
        return null;
      }
    } else if (kind === ts2.SyntaxKind.OpenBraceToken) {
      kind = this.skipNamedClause();
    }
    if (kind !== ts2.SyntaxKind.FromKeyword) {
      return null;
    }
    return this.tryStringLiteral();
  }
  extractReexportPath() {
    let token = this.scanner.scan();
    if (token === ts2.SyntaxKind.AsteriskToken) {
      token = this.skipNamespacedClause();
      if (token === null) {
        return null;
      }
    } else if (token === ts2.SyntaxKind.OpenBraceToken) {
      token = this.skipNamedClause();
    }
    if (token !== ts2.SyntaxKind.FromKeyword) {
      return null;
    }
    return this.tryStringLiteral();
  }
  skipNamespacedClause() {
    let token = this.scanner.scan();
    if (token === ts2.SyntaxKind.AsKeyword) {
      token = this.scanner.scan();
      if (token !== ts2.SyntaxKind.Identifier) {
        return null;
      }
      token = this.scanner.scan();
    }
    return token;
  }
  skipNamedClause() {
    let braceCount = 1;
    let token = this.scanner.scan();
    while (braceCount > 0 && token !== ts2.SyntaxKind.EndOfFileToken) {
      if (token === ts2.SyntaxKind.OpenBraceToken) {
        braceCount++;
      } else if (token === ts2.SyntaxKind.CloseBraceToken) {
        braceCount--;
      }
      token = this.scanner.scan();
    }
    return token;
  }
  tryStringLiteral() {
    return this.scanner.scan() === ts2.SyntaxKind.StringLiteral ? this.scanner.getTokenValue() : null;
  }
};
function hasImportOrReexportStatements(source) {
  return /(?:import|export)[\s\S]+?(["'])(?:\\\1|.)+?\1/.test(source);
}
function findLastPossibleImportOrReexport(source) {
  return Math.max(source.lastIndexOf("import"), source.lastIndexOf(" from "));
}
function canPrecedeARegex(kind) {
  switch (kind) {
    case ts2.SyntaxKind.Identifier:
    case ts2.SyntaxKind.StringLiteral:
    case ts2.SyntaxKind.NumericLiteral:
    case ts2.SyntaxKind.BigIntLiteral:
    case ts2.SyntaxKind.RegularExpressionLiteral:
    case ts2.SyntaxKind.ThisKeyword:
    case ts2.SyntaxKind.PlusPlusToken:
    case ts2.SyntaxKind.MinusMinusToken:
    case ts2.SyntaxKind.CloseParenToken:
    case ts2.SyntaxKind.CloseBracketToken:
    case ts2.SyntaxKind.CloseBraceToken:
    case ts2.SyntaxKind.TrueKeyword:
    case ts2.SyntaxKind.FalseKeyword:
      return false;
    default:
      return true;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/dts_dependency_host.mjs
var DtsDependencyHost = class extends EsmDependencyHost {
  constructor(fs, pathMappings) {
    super(fs, new ModuleResolver(fs, pathMappings, ["", ".d.ts", "/index.d.ts", ".js", "/index.js"]), false);
  }
  processImport(importPath, file, dependencies, missing, deepImports, alreadySeen) {
    return super.processImport(importPath, file, dependencies, missing, deepImports, alreadySeen) || super.processImport(`@types/${importPath}`, file, dependencies, missing, deepImports, alreadySeen);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/dependencies/umd_dependency_host.mjs
import ts3 from "typescript";
var UmdDependencyHost = class extends DependencyHostBase {
  canSkipFile(fileContents) {
    return !hasRequireCalls(fileContents);
  }
  extractImports(file, fileContents) {
    const sf = ts3.createSourceFile(file, fileContents, ts3.ScriptTarget.ES2015, true, ts3.ScriptKind.JS);
    if (sf.statements.length !== 1) {
      return /* @__PURE__ */ new Set();
    }
    const umdModule = parseStatementForUmdModule(sf.statements[0]);
    const umdImports = umdModule && getImportsOfUmdModule(umdModule);
    if (umdImports === null) {
      return /* @__PURE__ */ new Set();
    }
    return new Set(umdImports.map((i) => i.path));
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/entry_point_finder/utils.mjs
function getBasePaths(logger, sourceDirectory, pathMappings) {
  const fs = getFileSystem();
  const basePaths = [sourceDirectory];
  if (pathMappings) {
    const baseUrl = fs.resolve(pathMappings.baseUrl);
    if (fs.isRoot(baseUrl)) {
      logger.warn(`The provided pathMappings baseUrl is the root path ${baseUrl}.
This is likely to mess up how ngcc finds entry-points and is probably not correct.
Please check your path mappings configuration such as in the tsconfig.json file.`);
    }
    for (const paths of Object.values(pathMappings.paths)) {
      for (const path of paths) {
        let foundMatch = false;
        const { prefix, hasWildcard } = extractPathPrefix(path);
        let basePath = fs.resolve(baseUrl, prefix);
        if (fs.exists(basePath) && fs.stat(basePath).isFile()) {
          basePath = fs.dirname(basePath);
        }
        if (fs.exists(basePath)) {
          basePaths.push(basePath);
          foundMatch = true;
        }
        if (hasWildcard) {
          const wildcardContainer = fs.dirname(basePath);
          const wildcardPrefix = fs.basename(basePath);
          if (isExistingDirectory(fs, wildcardContainer)) {
            const candidates = fs.readdir(wildcardContainer);
            for (const candidate of candidates) {
              if (candidate.startsWith(wildcardPrefix)) {
                const candidatePath = fs.resolve(wildcardContainer, candidate);
                if (isExistingDirectory(fs, candidatePath)) {
                  foundMatch = true;
                  basePaths.push(candidatePath);
                }
              }
            }
          }
        }
        if (!foundMatch) {
          logger.debug(`The basePath "${basePath}" computed from baseUrl "${baseUrl}" and path mapping "${path}" does not exist in the file-system.
It will not be scanned for entry-points.`);
        }
      }
    }
  }
  const dedupedBasePaths = dedupePaths(fs, basePaths);
  if (fs.basename(sourceDirectory) === "node_modules" && !dedupedBasePaths.includes(sourceDirectory)) {
    dedupedBasePaths.unshift(sourceDirectory);
  }
  return dedupedBasePaths;
}
function isExistingDirectory(fs, path) {
  return fs.exists(path) && fs.stat(path).isDirectory();
}
function extractPathPrefix(path) {
  const [prefix, rest] = path.split("*", 2);
  return { prefix, hasWildcard: rest !== void 0 };
}
function trackDuration(task, log) {
  const startTime = Date.now();
  const result = task();
  const duration = Math.round((Date.now() - startTime) / 100) / 10;
  log(duration);
  return result;
}
function dedupePaths(fs, paths) {
  const root = { children: /* @__PURE__ */ new Map() };
  for (const path of paths) {
    addPath(fs, root, path);
  }
  return flattenTree(root);
}
function addPath(fs, root, path) {
  let node = root;
  if (!fs.isRoot(path)) {
    const segments = path.split("/");
    for (let index = 0; index < segments.length; index++) {
      if (isLeaf(node)) {
        return;
      }
      const next = segments[index];
      if (!node.children.has(next)) {
        node.children.set(next, { children: /* @__PURE__ */ new Map() });
      }
      node = node.children.get(next);
    }
  }
  convertToLeaf(node, path);
}
function flattenTree(root) {
  const paths = [];
  const nodes = [root];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (isLeaf(node)) {
      paths.push(node.path);
    } else {
      node.children.forEach((value) => nodes.push(value));
    }
  }
  return paths;
}
function isLeaf(node) {
  return node.path !== void 0;
}
function convertToLeaf(node, path) {
  node.path = path;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/entry_point_finder/directory_walker_entry_point_finder.mjs
var DirectoryWalkerEntryPointFinder = class {
  constructor(logger, resolver, entryPointCollector, entryPointManifest, sourceDirectory, pathMappings) {
    this.logger = logger;
    this.resolver = resolver;
    this.entryPointCollector = entryPointCollector;
    this.entryPointManifest = entryPointManifest;
    this.sourceDirectory = sourceDirectory;
    this.pathMappings = pathMappings;
    this.basePaths = getBasePaths(this.logger, this.sourceDirectory, this.pathMappings);
  }
  findEntryPoints() {
    const unsortedEntryPoints = [];
    for (const basePath of this.basePaths) {
      const entryPoints = this.entryPointManifest.readEntryPointsUsingManifest(basePath) || this.walkBasePathForPackages(basePath);
      entryPoints.forEach((e) => unsortedEntryPoints.push(e));
    }
    return this.resolver.sortEntryPointsByDependency(unsortedEntryPoints);
  }
  walkBasePathForPackages(basePath) {
    this.logger.debug(`No manifest found for ${basePath} so walking the directories for entry-points.`);
    const entryPoints = trackDuration(() => this.entryPointCollector.walkDirectoryForPackages(basePath), (duration) => this.logger.debug(`Walking ${basePath} for entry-points took ${duration}s.`));
    this.entryPointManifest.writeEntryPointManifest(basePath, entryPoints);
    return entryPoints;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/entry_point_finder/entry_point_collector.mjs
var EntryPointCollector = class {
  constructor(fs, config, logger, resolver) {
    this.fs = fs;
    this.config = config;
    this.logger = logger;
    this.resolver = resolver;
  }
  walkDirectoryForPackages(sourceDirectory) {
    const primaryEntryPoint = getEntryPointInfo(this.fs, this.config, this.logger, sourceDirectory, sourceDirectory);
    if (primaryEntryPoint === INCOMPATIBLE_ENTRY_POINT) {
      return [];
    }
    const entryPoints = [];
    if (primaryEntryPoint !== NO_ENTRY_POINT) {
      if (primaryEntryPoint !== IGNORED_ENTRY_POINT) {
        entryPoints.push(this.resolver.getEntryPointWithDependencies(primaryEntryPoint));
      }
      this.collectSecondaryEntryPoints(entryPoints, sourceDirectory, sourceDirectory, this.fs.readdir(sourceDirectory));
      if (entryPoints.some((e) => e.entryPoint.compiledByAngular)) {
        const nestedNodeModulesPath = this.fs.join(sourceDirectory, "node_modules");
        if (this.fs.exists(nestedNodeModulesPath)) {
          entryPoints.push(...this.walkDirectoryForPackages(nestedNodeModulesPath));
        }
      }
      return entryPoints;
    }
    for (const path of this.fs.readdir(sourceDirectory)) {
      if (isIgnorablePath(path)) {
        continue;
      }
      const absolutePath = this.fs.resolve(sourceDirectory, path);
      const stat = this.fs.lstat(absolutePath);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        continue;
      }
      entryPoints.push(...this.walkDirectoryForPackages(this.fs.join(sourceDirectory, path)));
    }
    return entryPoints;
  }
  collectSecondaryEntryPoints(entryPoints, packagePath, directory, paths) {
    for (const path of paths) {
      if (isIgnorablePath(path)) {
        continue;
      }
      const absolutePath = this.fs.resolve(directory, path);
      const stat = this.fs.lstat(absolutePath);
      if (stat.isSymbolicLink()) {
        continue;
      }
      const isDirectory = stat.isDirectory();
      if (!path.endsWith(".js") && !isDirectory) {
        continue;
      }
      const possibleEntryPointPath = isDirectory ? absolutePath : stripJsExtension(absolutePath);
      const subEntryPoint = getEntryPointInfo(this.fs, this.config, this.logger, packagePath, possibleEntryPointPath);
      if (isEntryPoint(subEntryPoint)) {
        entryPoints.push(this.resolver.getEntryPointWithDependencies(subEntryPoint));
      }
      if (!isDirectory) {
        continue;
      }
      const canContainEntryPoints = subEntryPoint === NO_ENTRY_POINT || subEntryPoint === INCOMPATIBLE_ENTRY_POINT;
      const childPaths = this.fs.readdir(absolutePath);
      if (canContainEntryPoints && childPaths.some((childPath) => childPath.endsWith(".js") && this.fs.stat(this.fs.resolve(absolutePath, childPath)).isFile())) {
        continue;
      }
      this.collectSecondaryEntryPoints(entryPoints, packagePath, absolutePath, childPaths);
    }
  }
};
function stripJsExtension(filePath) {
  return filePath.replace(/\.js$/, "");
}
function isIgnorablePath(path) {
  return path.startsWith(".") || path === "node_modules" || path === NGCC_DIRECTORY;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/entry_point_finder/tracing_entry_point_finder.mjs
var TracingEntryPointFinder = class {
  constructor(fs, config, logger, resolver, basePath, pathMappings) {
    this.fs = fs;
    this.config = config;
    this.logger = logger;
    this.resolver = resolver;
    this.basePath = basePath;
    this.pathMappings = pathMappings;
    this.basePaths = null;
  }
  findEntryPoints() {
    const unsortedEntryPoints = /* @__PURE__ */ new Map();
    const unprocessedPaths = this.getInitialEntryPointPaths();
    while (unprocessedPaths.length > 0) {
      const path = unprocessedPaths.shift();
      const entryPointWithDeps = this.getEntryPointWithDeps(path);
      if (entryPointWithDeps === null) {
        continue;
      }
      unsortedEntryPoints.set(entryPointWithDeps.entryPoint.path, entryPointWithDeps);
      entryPointWithDeps.depInfo.dependencies.forEach((dep) => {
        if (!unsortedEntryPoints.has(dep)) {
          unprocessedPaths.push(dep);
        }
      });
    }
    return this.resolver.sortEntryPointsByDependency(Array.from(unsortedEntryPoints.values()));
  }
  getBasePaths() {
    if (this.basePaths === null) {
      this.basePaths = getBasePaths(this.logger, this.basePath, this.pathMappings);
    }
    return this.basePaths;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/entry_point_finder/program_based_entry_point_finder.mjs
var ProgramBasedEntryPointFinder = class extends TracingEntryPointFinder {
  constructor(fs, config, logger, resolver, entryPointCollector, entryPointManifest, basePath, tsConfig, projectPath) {
    super(fs, config, logger, resolver, basePath, getPathMappingsFromTsConfig(fs, tsConfig, projectPath));
    this.entryPointCollector = entryPointCollector;
    this.entryPointManifest = entryPointManifest;
    this.tsConfig = tsConfig;
    this.entryPointsWithDependencies = null;
  }
  getInitialEntryPointPaths() {
    const moduleResolver = new ModuleResolver(this.fs, this.pathMappings, ["", ".ts", "/index.ts"]);
    const host = new EsmDependencyHost(this.fs, moduleResolver);
    const dependencies = createDependencyInfo();
    const rootFiles = this.tsConfig.rootNames.map((rootName) => this.fs.resolve(rootName));
    this.logger.debug(`Using the program from ${this.tsConfig.project} to seed the entry-point finding.`);
    this.logger.debug(`Collecting dependencies from the following files:` + rootFiles.map((file) => `
- ${file}`));
    host.collectDependenciesInFiles(rootFiles, dependencies);
    return Array.from(dependencies.dependencies);
  }
  getEntryPointWithDeps(entryPointPath) {
    const entryPoints = this.findOrLoadEntryPoints();
    if (!entryPoints.has(entryPointPath)) {
      return null;
    }
    const entryPointWithDeps = entryPoints.get(entryPointPath);
    if (!entryPointWithDeps.entryPoint.compiledByAngular) {
      return null;
    }
    return entryPointWithDeps;
  }
  findOrLoadEntryPoints() {
    if (this.entryPointsWithDependencies === null) {
      const entryPointsWithDependencies = this.entryPointsWithDependencies = /* @__PURE__ */ new Map();
      for (const basePath of this.getBasePaths()) {
        const entryPoints = this.entryPointManifest.readEntryPointsUsingManifest(basePath) || this.walkBasePathForPackages(basePath);
        for (const e of entryPoints) {
          entryPointsWithDependencies.set(e.entryPoint.path, e);
        }
      }
    }
    return this.entryPointsWithDependencies;
  }
  walkBasePathForPackages(basePath) {
    this.logger.debug(`No manifest found for ${basePath} so walking the directories for entry-points.`);
    const entryPoints = trackDuration(() => this.entryPointCollector.walkDirectoryForPackages(basePath), (duration) => this.logger.debug(`Walking ${basePath} for entry-points took ${duration}s.`));
    this.entryPointManifest.writeEntryPointManifest(basePath, entryPoints);
    return entryPoints;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/packages/build_marker.mjs
var NGCC_VERSION = "13.3.10";
function needsCleaning(packageJson) {
  return Object.values(packageJson.__processed_by_ivy_ngcc__ || {}).some((value) => value !== NGCC_VERSION);
}
function cleanPackageJson(packageJson) {
  if (packageJson.__processed_by_ivy_ngcc__ !== void 0) {
    delete packageJson.__processed_by_ivy_ngcc__;
    for (const prop of Object.keys(packageJson)) {
      if (prop.endsWith(NGCC_PROPERTY_EXTENSION)) {
        delete packageJson[prop];
      }
    }
    const scripts = packageJson.scripts;
    if (scripts !== void 0 && scripts.prepublishOnly) {
      delete scripts.prepublishOnly;
      if (scripts.prepublishOnly__ivy_ngcc_bak !== void 0) {
        scripts.prepublishOnly = scripts.prepublishOnly__ivy_ngcc_bak;
        delete scripts.prepublishOnly__ivy_ngcc_bak;
      }
    }
    return true;
  }
  return false;
}
function hasBeenProcessed(packageJson, format) {
  return packageJson.__processed_by_ivy_ngcc__ !== void 0 && packageJson.__processed_by_ivy_ngcc__[format] === NGCC_VERSION;
}
function markAsProcessed(pkgJsonUpdater, packageJson, packageJsonPath, formatProperties) {
  const update = pkgJsonUpdater.createUpdate();
  for (const prop of formatProperties) {
    update.addChange(["__processed_by_ivy_ngcc__", prop], NGCC_VERSION, "alphabetic");
  }
  const oldPrepublishOnly = packageJson.scripts && packageJson.scripts.prepublishOnly;
  const newPrepublishOnly = `node --eval "console.error('ERROR: Trying to publish a package that has been compiled by NGCC. This is not allowed.\\nPlease delete and rebuild the package, without compiling with NGCC, before attempting to publish.\\nNote that NGCC may have been run by importing this package into another project that is being built with Ivy enabled.\\n')" && exit 1`;
  if (oldPrepublishOnly && oldPrepublishOnly !== newPrepublishOnly) {
    update.addChange(["scripts", "prepublishOnly__ivy_ngcc_bak"], oldPrepublishOnly);
  }
  update.addChange(["scripts", "prepublishOnly"], newPrepublishOnly);
  update.writeChanges(packageJsonPath, packageJson);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/entry_point_finder/targeted_entry_point_finder.mjs
var TargetedEntryPointFinder = class extends TracingEntryPointFinder {
  constructor(fs, config, logger, resolver, basePath, pathMappings, targetPath) {
    super(fs, config, logger, resolver, basePath, pathMappings);
    this.targetPath = targetPath;
  }
  findEntryPoints() {
    const entryPoints = super.findEntryPoints();
    const invalidTarget = entryPoints.invalidEntryPoints.find((i) => i.entryPoint.path === this.targetPath);
    if (invalidTarget !== void 0) {
      throw new Error(`The target entry-point "${invalidTarget.entryPoint.name}" has missing dependencies:
` + invalidTarget.missingDependencies.map((dep) => ` - ${dep}
`).join(""));
    }
    return entryPoints;
  }
  targetNeedsProcessingOrCleaning(propertiesToConsider, compileAllFormats) {
    const entryPointWithDeps = this.getEntryPointWithDeps(this.targetPath);
    if (entryPointWithDeps === null) {
      return false;
    }
    for (const property of propertiesToConsider) {
      if (entryPointWithDeps.entryPoint.packageJson[property]) {
        if (!hasBeenProcessed(entryPointWithDeps.entryPoint.packageJson, property)) {
          return true;
        }
        if (!compileAllFormats) {
          return false;
        }
      }
    }
    return false;
  }
  getInitialEntryPointPaths() {
    return [this.targetPath];
  }
  getEntryPointWithDeps(entryPointPath) {
    const packagePath = this.computePackagePath(entryPointPath);
    const entryPoint = getEntryPointInfo(this.fs, this.config, this.logger, packagePath, entryPointPath);
    if (!isEntryPoint(entryPoint) || !entryPoint.compiledByAngular) {
      return null;
    }
    return this.resolver.getEntryPointWithDependencies(entryPoint);
  }
  computePackagePath(entryPointPath) {
    if (this.isPathContainedBy(this.basePath, entryPointPath)) {
      const packagePath = this.computePackagePathFromContainingPath(entryPointPath, this.basePath);
      if (packagePath !== null) {
        return packagePath;
      }
    }
    for (const basePath of this.getBasePaths()) {
      if (this.isPathContainedBy(basePath, entryPointPath)) {
        const packagePath = this.computePackagePathFromContainingPath(entryPointPath, basePath);
        if (packagePath !== null) {
          return packagePath;
        }
        break;
      }
    }
    return this.computePackagePathFromNearestNodeModules(entryPointPath);
  }
  isPathContainedBy(base, test) {
    return test === base || test.startsWith(base) && !this.fs.relative(base, test).startsWith("..");
  }
  computePackagePathFromContainingPath(entryPointPath, containingPath) {
    let packagePath = containingPath;
    const segments = this.splitPath(this.fs.relative(containingPath, entryPointPath));
    let nodeModulesIndex = segments.lastIndexOf("node_modules");
    if (nodeModulesIndex === -1) {
      if (this.fs.exists(this.fs.join(packagePath, "package.json"))) {
        return packagePath;
      }
    }
    while (nodeModulesIndex >= 0) {
      packagePath = this.fs.join(packagePath, segments.shift());
      nodeModulesIndex--;
    }
    for (const segment of segments) {
      packagePath = this.fs.join(packagePath, segment);
      if (this.fs.exists(this.fs.join(packagePath, "package.json"))) {
        return packagePath;
      }
    }
    return null;
  }
  computePackagePathFromNearestNodeModules(entryPointPath) {
    let packagePath = entryPointPath;
    let scopedPackagePath = packagePath;
    let containerPath = this.fs.dirname(packagePath);
    while (!this.fs.isRoot(containerPath) && !containerPath.endsWith("node_modules")) {
      scopedPackagePath = packagePath;
      packagePath = containerPath;
      containerPath = this.fs.dirname(containerPath);
    }
    if (this.fs.exists(this.fs.join(packagePath, "package.json"))) {
      return packagePath;
    } else if (this.fs.basename(packagePath).startsWith("@") && this.fs.exists(this.fs.join(scopedPackagePath, "package.json"))) {
      return scopedPackagePath;
    } else {
      return entryPointPath;
    }
  }
  splitPath(path) {
    const segments = [];
    let container = this.fs.dirname(path);
    while (path !== container) {
      segments.unshift(this.fs.basename(path));
      path = container;
      container = this.fs.dirname(container);
    }
    return segments;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/tasks/queues/base_task_queue.mjs
var BaseTaskQueue = class {
  constructor(logger, tasks, dependencies) {
    this.logger = logger;
    this.tasks = tasks;
    this.dependencies = dependencies;
    this.inProgressTasks = /* @__PURE__ */ new Set();
    this.tasksToSkip = /* @__PURE__ */ new Map();
  }
  get allTasksCompleted() {
    return this.tasks.length === 0 && this.inProgressTasks.size === 0;
  }
  getNextTask() {
    let nextTask = this.computeNextTask();
    while (nextTask !== null) {
      if (!this.tasksToSkip.has(nextTask)) {
        break;
      }
      this.markAsCompleted(nextTask);
      const failedTask = this.tasksToSkip.get(nextTask);
      this.logger.warn(`Skipping processing of ${nextTask.entryPoint.name} because its dependency ${failedTask.entryPoint.name} failed to compile.`);
      nextTask = this.computeNextTask();
    }
    return nextTask;
  }
  markAsCompleted(task) {
    if (!this.inProgressTasks.has(task)) {
      throw new Error(`Trying to mark task that was not in progress as completed: ${stringifyTask(task)}`);
    }
    this.inProgressTasks.delete(task);
  }
  markAsFailed(task) {
    if (this.dependencies.has(task)) {
      for (const dependentTask of this.dependencies.get(task)) {
        this.skipDependentTasks(dependentTask, task);
      }
    }
  }
  markAsUnprocessed(task) {
    if (!this.inProgressTasks.has(task)) {
      throw new Error(`Trying to mark task that was not in progress as unprocessed: ${stringifyTask(task)}`);
    }
    this.inProgressTasks.delete(task);
    this.tasks.unshift(task);
  }
  toString() {
    const inProgTasks = Array.from(this.inProgressTasks);
    return `${this.constructor.name}
  All tasks completed: ${this.allTasksCompleted}
  Unprocessed tasks (${this.tasks.length}): ${this.stringifyTasks(this.tasks, "    ")}
  In-progress tasks (${inProgTasks.length}): ${this.stringifyTasks(inProgTasks, "    ")}`;
  }
  skipDependentTasks(task, failedTask) {
    this.tasksToSkip.set(task, failedTask);
    if (this.dependencies.has(task)) {
      for (const dependentTask of this.dependencies.get(task)) {
        this.skipDependentTasks(dependentTask, failedTask);
      }
    }
  }
  stringifyTasks(tasks, indentation) {
    return tasks.map((task) => `
${indentation}- ${stringifyTask(task)}`).join("");
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/tasks/queues/parallel_task_queue.mjs
var ParallelTaskQueue = class extends BaseTaskQueue {
  constructor(logger, tasks, dependencies) {
    super(logger, sortTasksByPriority(tasks, dependencies), dependencies);
    this.blockedTasks = getBlockedTasks(dependencies);
  }
  computeNextTask() {
    const nextTaskIdx = this.tasks.findIndex((task) => !this.blockedTasks.has(task));
    if (nextTaskIdx === -1)
      return null;
    const nextTask = this.tasks[nextTaskIdx];
    this.tasks.splice(nextTaskIdx, 1);
    this.inProgressTasks.add(nextTask);
    return nextTask;
  }
  markAsCompleted(task) {
    super.markAsCompleted(task);
    if (!this.dependencies.has(task)) {
      return;
    }
    for (const dependentTask of this.dependencies.get(task)) {
      if (this.blockedTasks.has(dependentTask)) {
        const blockingTasks = this.blockedTasks.get(dependentTask);
        blockingTasks.delete(task);
        if (blockingTasks.size === 0) {
          this.blockedTasks.delete(dependentTask);
        }
      }
    }
  }
  toString() {
    return `${super.toString()}
  Blocked tasks (${this.blockedTasks.size}): ${this.stringifyBlockedTasks("    ")}`;
  }
  stringifyBlockedTasks(indentation) {
    return Array.from(this.blockedTasks).map(([task, blockingTasks]) => `
${indentation}- ${stringifyTask(task)} (${blockingTasks.size}): ` + this.stringifyTasks(Array.from(blockingTasks), `${indentation}    `)).join("");
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/tasks/queues/serial_task_queue.mjs
var SerialTaskQueue = class extends BaseTaskQueue {
  computeNextTask() {
    const nextTask = this.tasks.shift() || null;
    if (nextTask) {
      if (this.inProgressTasks.size > 0) {
        const inProgressTask = this.inProgressTasks.values().next().value;
        throw new Error("Trying to get next task, while there is already a task in progress: " + stringifyTask(inProgressTask));
      }
      this.inProgressTasks.add(nextTask);
    }
    return nextTask;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/writing/cleaning/utils.mjs
function isLocalDirectory(fs, path) {
  if (fs.exists(path)) {
    const stat = fs.lstat(path);
    return stat.isDirectory();
  } else {
    return false;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/writing/cleaning/cleaning_strategies.mjs
var PackageJsonCleaner = class {
  constructor(fs) {
    this.fs = fs;
  }
  canClean(_path, basename) {
    return basename === "package.json";
  }
  clean(path, _basename) {
    const packageJson = JSON.parse(this.fs.readFile(path));
    if (cleanPackageJson(packageJson)) {
      this.fs.writeFile(path, `${JSON.stringify(packageJson, null, 2)}
`);
    }
  }
};
var NgccDirectoryCleaner = class {
  constructor(fs) {
    this.fs = fs;
  }
  canClean(path, basename) {
    return basename === NGCC_DIRECTORY && isLocalDirectory(this.fs, path);
  }
  clean(path, _basename) {
    this.fs.removeDeep(path);
  }
};
var BackupFileCleaner = class {
  constructor(fs) {
    this.fs = fs;
  }
  canClean(path, basename) {
    return this.fs.extname(basename) === NGCC_BACKUP_EXTENSION && this.fs.exists(absoluteFrom(path.replace(NGCC_BACKUP_EXTENSION, "")));
  }
  clean(path, _basename) {
    this.fs.moveFile(path, absoluteFrom(path.replace(NGCC_BACKUP_EXTENSION, "")));
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/writing/cleaning/package_cleaner.mjs
var PackageCleaner = class {
  constructor(fs, cleaners) {
    this.fs = fs;
    this.cleaners = cleaners;
  }
  clean(directory) {
    const basenames = this.fs.readdir(directory);
    for (const basename of basenames) {
      if (basename === "node_modules") {
        continue;
      }
      const path = this.fs.resolve(directory, basename);
      for (const cleaner of this.cleaners) {
        if (cleaner.canClean(path, basename)) {
          cleaner.clean(path, basename);
          break;
        }
      }
      if (isLocalDirectory(this.fs, path)) {
        this.clean(path);
      }
    }
  }
};
function cleanOutdatedPackages(fileSystem, entryPoints) {
  const packagesToClean = /* @__PURE__ */ new Set();
  for (const entryPoint of entryPoints) {
    if (needsCleaning(entryPoint.packageJson)) {
      packagesToClean.add(entryPoint.packagePath);
    }
  }
  const cleaner = new PackageCleaner(fileSystem, [
    new PackageJsonCleaner(fileSystem),
    new NgccDirectoryCleaner(fileSystem),
    new BackupFileCleaner(fileSystem)
  ]);
  for (const packagePath of packagesToClean) {
    cleaner.clean(packagePath);
  }
  return packagesToClean.size > 0;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/analyze_entry_points.mjs
function getAnalyzeEntryPointsFn(logger, finder, fileSystem, supportedPropertiesToConsider, typingsOnly, compileAllFormats, propertiesToConsider, inParallel) {
  return () => {
    logger.debug("Analyzing entry-points...");
    const startTime = Date.now();
    let entryPointInfo = finder.findEntryPoints();
    const cleaned = cleanOutdatedPackages(fileSystem, entryPointInfo.entryPoints);
    if (cleaned) {
      entryPointInfo = finder.findEntryPoints();
    }
    const { entryPoints, invalidEntryPoints, graph } = entryPointInfo;
    logInvalidEntryPoints(logger, invalidEntryPoints);
    const unprocessableEntryPointPaths = [];
    const tasks = [];
    for (const entryPoint of entryPoints) {
      const packageJson = entryPoint.packageJson;
      const { propertiesToProcess, equivalentPropertiesMap } = getPropertiesToProcess(packageJson, supportedPropertiesToConsider, compileAllFormats, typingsOnly);
      if (propertiesToProcess.length === 0) {
        unprocessableEntryPointPaths.push(entryPoint.path);
        continue;
      }
      const hasProcessedTypings = hasBeenProcessed(packageJson, "typings");
      if (hasProcessedTypings && typingsOnly) {
        logger.debug(`Skipping ${entryPoint.name} : typings have already been processed.`);
        continue;
      }
      let processDts = hasProcessedTypings ? DtsProcessing.No : typingsOnly ? DtsProcessing.Only : DtsProcessing.Yes;
      for (const formatProperty of propertiesToProcess) {
        if (hasBeenProcessed(entryPoint.packageJson, formatProperty)) {
          logger.debug(`Skipping ${entryPoint.name} : ${formatProperty} (already compiled).`);
          continue;
        }
        const formatPropertiesToMarkAsProcessed = equivalentPropertiesMap.get(formatProperty);
        tasks.push({ entryPoint, formatProperty, formatPropertiesToMarkAsProcessed, processDts });
        processDts = DtsProcessing.No;
      }
    }
    if (unprocessableEntryPointPaths.length > 0) {
      throw new Error(`Unable to process any formats for the following entry-points (tried ${propertiesToConsider.join(", ")}): ` + unprocessableEntryPointPaths.map((path) => `
  - ${path}`).join(""));
    }
    const duration = Math.round((Date.now() - startTime) / 100) / 10;
    logger.debug(`Analyzed ${entryPoints.length} entry-points in ${duration}s. (Total tasks: ${tasks.length})`);
    return getTaskQueue(logger, inParallel, tasks, graph);
  };
}
function logInvalidEntryPoints(logger, invalidEntryPoints) {
  invalidEntryPoints.forEach((invalidEntryPoint) => {
    logger.debug(`Invalid entry-point ${invalidEntryPoint.entryPoint.path}.`, `It is missing required dependencies:
` + invalidEntryPoint.missingDependencies.map((dep) => ` - ${dep}`).join("\n"));
  });
}
function getPropertiesToProcess(packageJson, propertiesToConsider, compileAllFormats, typingsOnly) {
  const formatPathsToConsider = /* @__PURE__ */ new Set();
  const propertiesToProcess = [];
  for (const prop of propertiesToConsider) {
    const formatPath = packageJson[prop];
    if (typeof formatPath !== "string")
      continue;
    if (formatPathsToConsider.has(formatPath))
      continue;
    formatPathsToConsider.add(formatPath);
    propertiesToProcess.push(prop);
    if (!compileAllFormats)
      break;
  }
  const formatPathToProperties = {};
  for (const prop of SUPPORTED_FORMAT_PROPERTIES) {
    const formatPath = packageJson[prop];
    if (typeof formatPath !== "string")
      continue;
    if (!formatPathsToConsider.has(formatPath))
      continue;
    const list = formatPathToProperties[formatPath] || (formatPathToProperties[formatPath] = []);
    list.push(prop);
  }
  const equivalentPropertiesMap = /* @__PURE__ */ new Map();
  for (const prop of propertiesToConsider) {
    const formatPath = packageJson[prop];
    const equivalentProperties = typingsOnly ? [] : formatPathToProperties[formatPath];
    equivalentPropertiesMap.set(prop, equivalentProperties);
  }
  return { propertiesToProcess, equivalentPropertiesMap };
}
function getTaskQueue(logger, inParallel, tasks, graph) {
  const dependencies = computeTaskDependencies(tasks, graph);
  return inParallel ? new ParallelTaskQueue(logger, tasks, dependencies) : new SerialTaskQueue(logger, tasks, dependencies);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/cluster/master.mjs
import cluster from "cluster";
import module2 from "module";
var ClusterMaster = class {
  constructor(maxWorkerCount, fileSystem, logger, fileWriter, pkgJsonUpdater, analyzeEntryPoints, createTaskCompletedCallback) {
    this.maxWorkerCount = maxWorkerCount;
    this.fileSystem = fileSystem;
    this.logger = logger;
    this.fileWriter = fileWriter;
    this.pkgJsonUpdater = pkgJsonUpdater;
    this.finishedDeferred = new Deferred();
    this.processingStartTime = -1;
    this.taskAssignments = /* @__PURE__ */ new Map();
    this.remainingRespawnAttempts = 3;
    if (!cluster.isMaster) {
      throw new Error("Tried to instantiate `ClusterMaster` on a worker process.");
    }
    cluster.setupMaster({ exec: getClusterWorkerScriptPath(fileSystem) });
    this.taskQueue = analyzeEntryPoints();
    this.onTaskCompleted = createTaskCompletedCallback(this.taskQueue);
  }
  run() {
    if (this.taskQueue.allTasksCompleted) {
      return Promise.resolve();
    }
    this.logger.info('Processing legacy "View Engine" libraries:');
    cluster.on("message", this.wrapEventHandler((worker, msg) => this.onWorkerMessage(worker.id, msg)));
    cluster.on("exit", this.wrapEventHandler((worker, code, signal) => this.onWorkerExit(worker, code, signal)));
    cluster.fork();
    return this.finishedDeferred.promise.then(() => this.stopWorkers(), (err) => {
      this.stopWorkers();
      return Promise.reject(err);
    });
  }
  maybeDistributeWork() {
    let isWorkerAvailable = false;
    if (this.taskQueue.allTasksCompleted) {
      const duration = Math.round((Date.now() - this.processingStartTime) / 100) / 10;
      this.logger.debug(`Processed tasks in ${duration}s.`);
      this.logger.info("Encourage the library authors to publish an Ivy distribution.");
      return this.finishedDeferred.resolve();
    }
    for (const [workerId, assignedTask] of Array.from(this.taskAssignments)) {
      if (assignedTask !== null) {
        continue;
      } else {
        isWorkerAvailable = true;
      }
      const task = this.taskQueue.getNextTask();
      if (task === null) {
        break;
      }
      this.taskAssignments.set(workerId, { task });
      sendMessageToWorker(workerId, { type: "process-task", task });
      isWorkerAvailable = false;
    }
    if (!isWorkerAvailable) {
      const spawnedWorkerCount = Object.keys(cluster.workers).length;
      if (spawnedWorkerCount < this.maxWorkerCount) {
        this.logger.debug("Spawning another worker process as there is more work to be done.");
        cluster.fork();
      } else {
        this.logger.debug(`All ${spawnedWorkerCount} workers are currently busy and cannot take on more work.`);
      }
    } else {
      const busyWorkers = Array.from(this.taskAssignments).filter(([_workerId, task]) => task !== null).map(([workerId]) => workerId);
      const totalWorkerCount = this.taskAssignments.size;
      const idleWorkerCount = totalWorkerCount - busyWorkers.length;
      this.logger.debug(`No assignments for ${idleWorkerCount} idle (out of ${totalWorkerCount} total) workers. Busy workers: ${busyWorkers.join(", ")}`);
      if (busyWorkers.length === 0) {
        throw new Error(`There are still unprocessed tasks in the queue and no tasks are currently in progress, yet the queue did not return any available tasks: ${this.taskQueue}`);
      }
    }
  }
  onWorkerExit(worker, code, signal) {
    if (worker.exitedAfterDisconnect)
      return;
    const assignment = this.taskAssignments.get(worker.id);
    this.taskAssignments.delete(worker.id);
    this.logger.warn(`Worker #${worker.id} exited unexpectedly (code: ${code} | signal: ${signal}).
  Current task: ${assignment == null ? "-" : stringifyTask(assignment.task)}
  Current phase: ${assignment == null ? "-" : assignment.files == null ? "compiling" : "writing files"}`);
    if (assignment == null) {
      this.logger.debug(`Spawning another worker process to replace #${worker.id}...`);
      cluster.fork();
    } else {
      const { task, files } = assignment;
      if (files != null) {
        this.logger.debug(`Reverting ${files.length} transformed files...`);
        this.fileWriter.revertBundle(task.entryPoint, files, task.formatPropertiesToMarkAsProcessed);
      }
      this.taskQueue.markAsUnprocessed(task);
      const spawnedWorkerCount = Object.keys(cluster.workers).length;
      if (spawnedWorkerCount > 0) {
        this.logger.debug(`Not spawning another worker process to replace #${worker.id}. Continuing with ${spawnedWorkerCount} workers...`);
        this.maybeDistributeWork();
      } else if (this.remainingRespawnAttempts > 0) {
        this.logger.debug(`Spawning another worker process to replace #${worker.id}...`);
        this.remainingRespawnAttempts--;
        cluster.fork();
      } else {
        throw new Error("All worker processes crashed and attempts to re-spawn them failed. Please check your system and ensure there is enough memory available.");
      }
    }
  }
  onWorkerMessage(workerId, msg) {
    if (msg.type === "ready") {
      this.onWorkerReady(workerId);
      return;
    }
    if (!this.taskAssignments.has(workerId)) {
      const knownWorkers = Array.from(this.taskAssignments.keys());
      throw new Error(`Received message from unknown worker #${workerId} (known workers: ${knownWorkers.join(", ")}): ${JSON.stringify(msg)}`);
    }
    switch (msg.type) {
      case "error":
        throw new Error(`Error on worker #${workerId}: ${msg.error}`);
      case "task-completed":
        return this.onWorkerTaskCompleted(workerId, msg);
      case "transformed-files":
        return this.onWorkerTransformedFiles(workerId, msg);
      case "update-package-json":
        return this.onWorkerUpdatePackageJson(workerId, msg);
      default:
        throw new Error(`Invalid message received from worker #${workerId}: ${JSON.stringify(msg)}`);
    }
  }
  onWorkerReady(workerId) {
    if (this.taskAssignments.has(workerId)) {
      throw new Error(`Invariant violated: Worker #${workerId} came online more than once.`);
    }
    if (this.processingStartTime === -1) {
      this.logger.debug("Processing tasks...");
      this.processingStartTime = Date.now();
    }
    this.taskAssignments.set(workerId, null);
    this.maybeDistributeWork();
  }
  onWorkerTaskCompleted(workerId, msg) {
    const assignment = this.taskAssignments.get(workerId) || null;
    if (assignment === null) {
      throw new Error(`Expected worker #${workerId} to have a task assigned, while handling message: ` + JSON.stringify(msg));
    }
    this.onTaskCompleted(assignment.task, msg.outcome, msg.message);
    this.taskQueue.markAsCompleted(assignment.task);
    this.taskAssignments.set(workerId, null);
    this.maybeDistributeWork();
  }
  onWorkerTransformedFiles(workerId, msg) {
    const assignment = this.taskAssignments.get(workerId) || null;
    if (assignment === null) {
      throw new Error(`Expected worker #${workerId} to have a task assigned, while handling message: ` + JSON.stringify(msg));
    }
    const oldFiles = assignment.files;
    const newFiles = msg.files;
    if (oldFiles !== void 0) {
      throw new Error(`Worker #${workerId} reported transformed files more than once.
  Old files (${oldFiles.length}): [${oldFiles.join(", ")}]
  New files (${newFiles.length}): [${newFiles.join(", ")}]
`);
    }
    assignment.files = newFiles;
  }
  onWorkerUpdatePackageJson(workerId, msg) {
    const assignment = this.taskAssignments.get(workerId) || null;
    if (assignment === null) {
      throw new Error(`Expected worker #${workerId} to have a task assigned, while handling message: ` + JSON.stringify(msg));
    }
    const entryPoint = assignment.task.entryPoint;
    const expectedPackageJsonPath = this.fileSystem.resolve(entryPoint.path, "package.json");
    if (expectedPackageJsonPath !== msg.packageJsonPath) {
      throw new Error(`Received '${msg.type}' message from worker #${workerId} for '${msg.packageJsonPath}', but was expecting '${expectedPackageJsonPath}' (based on task assignment).`);
    }
    this.pkgJsonUpdater.writeChanges(msg.changes, msg.packageJsonPath, entryPoint.packageJson);
  }
  stopWorkers() {
    const workers = Object.values(cluster.workers);
    this.logger.debug(`Stopping ${workers.length} workers...`);
    cluster.removeAllListeners();
    workers.forEach((worker) => worker.kill());
  }
  wrapEventHandler(fn) {
    return async (...args) => {
      try {
        await fn(...args);
      } catch (err) {
        this.finishedDeferred.reject(err);
      }
    };
  }
};
function getClusterWorkerScriptPath(fileSystem) {
  const requireFn = typeof __require !== "undefined" ? __require : module2.createRequire(__ESM_IMPORT_META_URL__);
  const workerScriptPath = requireFn.resolve("@angular/compiler-cli/ngcc/src/execution/cluster/ngcc_cluster_worker");
  return fileSystem.resolve(workerScriptPath);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/cluster/executor.mjs
var ClusterExecutor = class {
  constructor(workerCount, fileSystem, logger, fileWriter, pkgJsonUpdater, lockFile, createTaskCompletedCallback) {
    this.workerCount = workerCount;
    this.fileSystem = fileSystem;
    this.logger = logger;
    this.fileWriter = fileWriter;
    this.pkgJsonUpdater = pkgJsonUpdater;
    this.lockFile = lockFile;
    this.createTaskCompletedCallback = createTaskCompletedCallback;
  }
  async execute(analyzeEntryPoints, _createCompileFn) {
    return this.lockFile.lock(async () => {
      this.logger.debug(`Running ngcc on ${this.constructor.name} (using ${this.workerCount} worker processes).`);
      const master = new ClusterMaster(this.workerCount, this.fileSystem, this.logger, this.fileWriter, this.pkgJsonUpdater, analyzeEntryPoints, this.createTaskCompletedCallback);
      return await master.run();
    });
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/single_process_executor.mjs
var SingleProcessorExecutorBase = class {
  constructor(logger, createTaskCompletedCallback) {
    this.logger = logger;
    this.createTaskCompletedCallback = createTaskCompletedCallback;
  }
  doExecute(analyzeEntryPoints, createCompileFn) {
    this.logger.debug(`Running ngcc on ${this.constructor.name}.`);
    const taskQueue = analyzeEntryPoints();
    const onTaskCompleted = this.createTaskCompletedCallback(taskQueue);
    const compile = createCompileFn(() => {
    }, onTaskCompleted);
    this.logger.debug("Processing tasks...");
    const startTime = Date.now();
    while (!taskQueue.allTasksCompleted) {
      const task = taskQueue.getNextTask();
      compile(task);
      taskQueue.markAsCompleted(task);
    }
    const duration = Math.round((Date.now() - startTime) / 1e3);
    this.logger.debug(`Processed tasks in ${duration}s.`);
  }
};
var SingleProcessExecutorSync = class extends SingleProcessorExecutorBase {
  constructor(logger, lockFile, createTaskCompletedCallback) {
    super(logger, createTaskCompletedCallback);
    this.lockFile = lockFile;
  }
  execute(analyzeEntryPoints, createCompileFn) {
    this.lockFile.lock(() => this.doExecute(analyzeEntryPoints, createCompileFn));
  }
};
var SingleProcessExecutorAsync = class extends SingleProcessorExecutorBase {
  constructor(logger, lockFile, createTaskCompletedCallback) {
    super(logger, createTaskCompletedCallback);
    this.lockFile = lockFile;
  }
  async execute(analyzeEntryPoints, createCompileFn) {
    await this.lockFile.lock(async () => this.doExecute(analyzeEntryPoints, createCompileFn));
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/execution/tasks/completion.mjs
function composeTaskCompletedCallbacks(callbacks) {
  return (task, outcome, message) => {
    const callback = callbacks[outcome];
    if (callback === void 0) {
      throw new Error(`Unknown task outcome: "${outcome}" - supported outcomes: ${JSON.stringify(Object.keys(callbacks))}`);
    }
    callback(task, message);
  };
}
function createMarkAsProcessedHandler(fs, pkgJsonUpdater) {
  return (task) => {
    const { entryPoint, formatPropertiesToMarkAsProcessed, processDts } = task;
    const packageJsonPath = fs.resolve(entryPoint.path, "package.json");
    const propsToMarkAsProcessed = [...formatPropertiesToMarkAsProcessed];
    if (processDts !== DtsProcessing.No) {
      propsToMarkAsProcessed.push("typings");
    }
    markAsProcessed(pkgJsonUpdater, entryPoint.packageJson, packageJsonPath, propsToMarkAsProcessed);
  };
}
function createThrowErrorHandler(fs) {
  return (task, message) => {
    throw new Error(createErrorMessage(fs, task, message));
  };
}
function createLogErrorHandler(logger, fs, taskQueue) {
  return (task, message) => {
    taskQueue.markAsFailed(task);
    logger.error(createErrorMessage(fs, task, message));
  };
}
function createErrorMessage(fs, task, message) {
  var _a;
  const jsFormat = `\`${task.formatProperty}\` as ${(_a = getEntryPointFormat(fs, task.entryPoint, task.formatProperty)) != null ? _a : "unknown format"}`;
  const format = task.typingsOnly ? `typings only using ${jsFormat}` : jsFormat;
  message = message !== null ? ` due to ${message}` : "";
  return `Failed to compile entry-point ${task.entryPoint.name} (${format})` + message;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/async_locker.mjs
var TimeoutError = class extends Error {
  constructor() {
    super(...arguments);
    this.code = NGCC_TIMED_OUT_EXIT_CODE;
  }
};
var AsyncLocker = class {
  constructor(lockFile, logger, retryDelay, retryAttempts) {
    this.lockFile = lockFile;
    this.logger = logger;
    this.retryDelay = retryDelay;
    this.retryAttempts = retryAttempts;
  }
  async lock(fn) {
    await this.create();
    try {
      return await fn();
    } finally {
      this.lockFile.remove();
    }
  }
  async create() {
    let pid = "";
    for (let attempts = 0; attempts < this.retryAttempts; attempts++) {
      try {
        return this.lockFile.write();
      } catch (e) {
        if (e.code !== "EEXIST") {
          throw e;
        }
        const newPid = this.lockFile.read();
        if (newPid !== pid) {
          attempts = 0;
          pid = newPid;
        }
        if (attempts === 0) {
          this.logger.info(`Another process, with id ${pid}, is currently running ngcc.
Waiting up to ${this.retryDelay * this.retryAttempts / 1e3}s for it to finish.
(If you are sure no ngcc process is running then you should delete the lock-file at ${this.lockFile.path}.)`);
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }
    throw new TimeoutError(`Timed out waiting ${this.retryAttempts * this.retryDelay / 1e3}s for another ngcc process, with id ${pid}, to complete.
(If you are sure no ngcc process is running then you should delete the lock-file at ${this.lockFile.path}.)`);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/lock_file_with_child_process/index.mjs
import { fork } from "child_process";
import module4 from "module";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/lock_file.mjs
import module3 from "module";
function getLockFilePath(fs) {
  const requireFn = typeof __require !== "undefined" ? __require : module3.createRequire(__ESM_IMPORT_META_URL__);
  const ngccEntryPointFile = requireFn.resolve("@angular/compiler-cli/package.json");
  return fs.resolve(ngccEntryPointFile, "../../../.ngcc_lock_file");
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/lock_file_with_child_process/index.mjs
var LockFileWithChildProcess = class {
  constructor(fs, logger) {
    this.fs = fs;
    this.logger = logger;
    this.path = getLockFilePath(fs);
    this.unlocker = this.createUnlocker(this.path);
  }
  write() {
    if (this.unlocker === null) {
      this.unlocker = this.createUnlocker(this.path);
    }
    this.logger.debug(`Attemping to write lock-file at ${this.path} with PID ${process.pid}`);
    this.fs.writeFile(this.path, process.pid.toString(), true);
    this.logger.debug(`Written lock-file at ${this.path} with PID ${process.pid}`);
  }
  read() {
    try {
      return this.fs.readFile(this.path);
    } catch {
      return "{unknown}";
    }
  }
  remove() {
    removeLockFile(this.fs, this.logger, this.path, process.pid.toString());
    if (this.unlocker !== null) {
      this.unlocker.disconnect();
      this.unlocker = null;
    }
  }
  createUnlocker(path) {
    var _a, _b;
    this.logger.debug("Forking unlocker child-process");
    const logLevel = this.logger.level !== void 0 ? this.logger.level.toString() : LogLevel.info.toString();
    const isWindows = process.platform === "win32";
    const unlocker = fork(getLockFileUnlockerScriptPath(this.fs), [path, logLevel], { detached: true, stdio: isWindows ? "pipe" : "inherit" });
    if (isWindows) {
      (_a = unlocker.stdout) == null ? void 0 : _a.on("data", process.stdout.write.bind(process.stdout));
      (_b = unlocker.stderr) == null ? void 0 : _b.on("data", process.stderr.write.bind(process.stderr));
    }
    return unlocker;
  }
};
function getLockFileUnlockerScriptPath(fileSystem) {
  const requireFn = typeof __require !== "undefined" ? __require : module4.createRequire(__ESM_IMPORT_META_URL__);
  const unlockerScriptPath = requireFn.resolve("@angular/compiler-cli/ngcc/src/locking/lock_file_with_child_process/ngcc_lock_unlocker");
  return fileSystem.resolve(unlockerScriptPath);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/sync_locker.mjs
var SyncLocker = class {
  constructor(lockFile) {
    this.lockFile = lockFile;
  }
  lock(fn) {
    this.create();
    try {
      return fn();
    } finally {
      this.lockFile.remove();
    }
  }
  create() {
    try {
      this.lockFile.write();
    } catch (e) {
      if (e.code !== "EEXIST") {
        throw e;
      }
      this.handleExistingLockFile();
    }
  }
  handleExistingLockFile() {
    const pid = this.lockFile.read();
    throw new Error(`ngcc is already running at process with id ${pid}.
If you are running multiple builds in parallel then you might try pre-processing your node_modules via the command line ngcc tool before starting the builds.
(If you are sure no ngcc process is running then you should delete the lock-file at ${this.lockFile.path}.)`);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/packages/configuration.mjs
import { createHash } from "crypto";
import module5 from "module";
import semver from "semver";
import * as vm from "vm";
var PartiallyProcessedConfig = class {
  constructor(projectConfig) {
    this.packages = /* @__PURE__ */ new Map();
    this.locking = {};
    this.hashAlgorithm = "sha256";
    if (projectConfig.locking !== void 0) {
      this.locking = projectConfig.locking;
    }
    for (const packageNameAndVersion in projectConfig.packages) {
      const packageConfig = projectConfig.packages[packageNameAndVersion];
      if (packageConfig) {
        const [packageName, versionRange = "*"] = this.splitNameAndVersion(packageNameAndVersion);
        this.addPackageConfig(packageName, __spreadProps(__spreadValues({}, packageConfig), { versionRange }));
      }
    }
    if (projectConfig.hashAlgorithm !== void 0) {
      this.hashAlgorithm = projectConfig.hashAlgorithm;
    }
  }
  splitNameAndVersion(packageNameAndVersion) {
    const versionIndex = packageNameAndVersion.lastIndexOf("@");
    return versionIndex > 0 ? [
      packageNameAndVersion.substring(0, versionIndex),
      packageNameAndVersion.substring(versionIndex + 1)
    ] : [packageNameAndVersion, void 0];
  }
  addPackageConfig(packageName, config) {
    if (!this.packages.has(packageName)) {
      this.packages.set(packageName, []);
    }
    this.packages.get(packageName).push(config);
  }
  findPackageConfig(packageName, version) {
    var _a;
    if (!this.packages.has(packageName)) {
      return null;
    }
    const configs = this.packages.get(packageName);
    if (version === null) {
      return configs[0];
    }
    return (_a = configs.find((config) => semver.satisfies(version, config.versionRange, { includePrerelease: true }))) != null ? _a : null;
  }
  toJson() {
    return JSON.stringify(this, (key, value) => {
      if (value instanceof Map) {
        const res = {};
        for (const [k, v] of value) {
          res[k] = v;
        }
        return res;
      } else {
        return value;
      }
    });
  }
};
var DEFAULT_NGCC_CONFIG = {
  packages: {
    "angular2-highcharts": {
      entryPoints: {
        ".": {
          override: {
            main: "./index.js"
          }
        }
      }
    },
    "ng2-dragula": {
      entryPoints: {
        "./dist": { ignore: true }
      }
    }
  },
  locking: {
    retryDelay: 500,
    retryAttempts: 500
  }
};
var NGCC_CONFIG_FILENAME = "ngcc.config.js";
var isCommonJS = typeof __require !== "undefined";
var currentFileUrl = isCommonJS ? null : __ESM_IMPORT_META_URL__;
var ProcessedNgccPackageConfig = class {
  constructor(fs, packagePath, { entryPoints = {}, ignorableDeepImportMatchers = [] }) {
    const absolutePathEntries = Object.entries(entryPoints).map(([relativePath, config]) => [fs.resolve(packagePath, relativePath), config]);
    this.packagePath = packagePath;
    this.entryPoints = new Map(absolutePathEntries);
    this.ignorableDeepImportMatchers = ignorableDeepImportMatchers;
  }
};
var NgccConfiguration = class {
  constructor(fs, baseDir) {
    this.fs = fs;
    this.cache = /* @__PURE__ */ new Map();
    this.defaultConfig = new PartiallyProcessedConfig(DEFAULT_NGCC_CONFIG);
    this.projectConfig = new PartiallyProcessedConfig(this.loadProjectConfig(baseDir));
    this.hashAlgorithm = this.projectConfig.hashAlgorithm;
    this.hash = this.computeHash();
  }
  getLockingConfig() {
    let { retryAttempts, retryDelay } = this.projectConfig.locking;
    if (retryAttempts === void 0) {
      retryAttempts = this.defaultConfig.locking.retryAttempts;
    }
    if (retryDelay === void 0) {
      retryDelay = this.defaultConfig.locking.retryDelay;
    }
    return { retryAttempts, retryDelay };
  }
  getPackageConfig(packageName, packagePath, version) {
    const rawPackageConfig = this.getRawPackageConfig(packageName, packagePath, version);
    return new ProcessedNgccPackageConfig(this.fs, packagePath, rawPackageConfig);
  }
  getRawPackageConfig(packageName, packagePath, version) {
    const cacheKey = packageName + (version !== null ? `@${version}` : "");
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const projectLevelConfig = this.projectConfig.findPackageConfig(packageName, version);
    if (projectLevelConfig !== null) {
      this.cache.set(cacheKey, projectLevelConfig);
      return projectLevelConfig;
    }
    const packageLevelConfig = this.loadPackageConfig(packagePath, version);
    if (packageLevelConfig !== null) {
      this.cache.set(cacheKey, packageLevelConfig);
      return packageLevelConfig;
    }
    const defaultLevelConfig = this.defaultConfig.findPackageConfig(packageName, version);
    if (defaultLevelConfig !== null) {
      this.cache.set(cacheKey, defaultLevelConfig);
      return defaultLevelConfig;
    }
    return { versionRange: "*" };
  }
  loadProjectConfig(baseDir) {
    const configFilePath = this.fs.join(baseDir, NGCC_CONFIG_FILENAME);
    if (this.fs.exists(configFilePath)) {
      try {
        return this.evalSrcFile(configFilePath);
      } catch (e) {
        throw new Error(`Invalid project configuration file at "${configFilePath}": ` + e.message);
      }
    } else {
      return { packages: {} };
    }
  }
  loadPackageConfig(packagePath, version) {
    const configFilePath = this.fs.join(packagePath, NGCC_CONFIG_FILENAME);
    if (this.fs.exists(configFilePath)) {
      try {
        const packageConfig = this.evalSrcFile(configFilePath);
        return __spreadProps(__spreadValues({}, packageConfig), {
          versionRange: version || "*"
        });
      } catch (e) {
        throw new Error(`Invalid package configuration file at "${configFilePath}": ` + e.message);
      }
    } else {
      return null;
    }
  }
  evalSrcFile(srcPath) {
    const requireFn = isCommonJS ? __require : module5.createRequire(currentFileUrl);
    const src = this.fs.readFile(srcPath);
    const theExports = {};
    const sandbox = {
      module: { exports: theExports },
      exports: theExports,
      require: requireFn,
      __dirname: this.fs.dirname(srcPath),
      __filename: srcPath
    };
    vm.runInNewContext(src, sandbox, { filename: srcPath });
    return sandbox.module.exports;
  }
  computeHash() {
    return createHash(this.hashAlgorithm).update(this.projectConfig.toJson()).digest("hex");
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/packages/entry_point_manifest.mjs
import { createHash as createHash2 } from "crypto";
var EntryPointManifest = class {
  constructor(fs, config, logger) {
    this.fs = fs;
    this.config = config;
    this.logger = logger;
  }
  readEntryPointsUsingManifest(basePath) {
    try {
      if (this.fs.basename(basePath) !== "node_modules") {
        return null;
      }
      const manifestPath = this.getEntryPointManifestPath(basePath);
      if (!this.fs.exists(manifestPath)) {
        return null;
      }
      const computedLockFileHash = this.computeLockFileHash(basePath);
      if (computedLockFileHash === null) {
        return null;
      }
      const { ngccVersion, configFileHash, lockFileHash, entryPointPaths } = JSON.parse(this.fs.readFile(manifestPath));
      if (ngccVersion !== NGCC_VERSION || configFileHash !== this.config.hash || lockFileHash !== computedLockFileHash) {
        return null;
      }
      this.logger.debug(`Entry-point manifest found for ${basePath} so loading entry-point information directly.`);
      const startTime = Date.now();
      const entryPoints = [];
      for (const [packagePath, entryPointPath, dependencyPaths = [], missingPaths = [], deepImportPaths = []] of entryPointPaths) {
        const result = getEntryPointInfo(this.fs, this.config, this.logger, this.fs.resolve(basePath, packagePath), this.fs.resolve(basePath, entryPointPath));
        if (!isEntryPoint(result)) {
          throw new Error(`The entry-point manifest at ${manifestPath} contained an invalid pair of package paths: [${packagePath}, ${entryPointPath}]`);
        } else {
          entryPoints.push({
            entryPoint: result,
            depInfo: {
              dependencies: new Set(dependencyPaths),
              missing: new Set(missingPaths),
              deepImports: new Set(deepImportPaths)
            }
          });
        }
      }
      const duration = Math.round((Date.now() - startTime) / 100) / 10;
      this.logger.debug(`Reading entry-points using the manifest entries took ${duration}s.`);
      return entryPoints;
    } catch (e) {
      this.logger.warn(`Unable to read the entry-point manifest for ${basePath}:
`, e.stack || e.toString());
      return null;
    }
  }
  writeEntryPointManifest(basePath, entryPoints) {
    if (this.fs.basename(basePath) !== "node_modules") {
      return;
    }
    const lockFileHash = this.computeLockFileHash(basePath);
    if (lockFileHash === null) {
      return;
    }
    const manifest = {
      ngccVersion: NGCC_VERSION,
      configFileHash: this.config.hash,
      lockFileHash,
      entryPointPaths: entryPoints.map((e) => {
        const entryPointPaths = [
          this.fs.relative(basePath, e.entryPoint.packagePath),
          this.fs.relative(basePath, e.entryPoint.path)
        ];
        if (e.depInfo.dependencies.size > 0) {
          entryPointPaths[2] = Array.from(e.depInfo.dependencies);
        } else if (e.depInfo.missing.size > 0 || e.depInfo.deepImports.size > 0) {
          entryPointPaths[2] = [];
        }
        if (e.depInfo.missing.size > 0) {
          entryPointPaths[3] = Array.from(e.depInfo.missing);
        } else if (e.depInfo.deepImports.size > 0) {
          entryPointPaths[3] = [];
        }
        if (e.depInfo.deepImports.size > 0) {
          entryPointPaths[4] = Array.from(e.depInfo.deepImports);
        }
        return entryPointPaths;
      })
    };
    this.fs.writeFile(this.getEntryPointManifestPath(basePath), JSON.stringify(manifest));
  }
  getEntryPointManifestPath(basePath) {
    return this.fs.resolve(basePath, "__ngcc_entry_points__.json");
  }
  computeLockFileHash(basePath) {
    const directory = this.fs.dirname(basePath);
    for (const lockFileName of ["yarn.lock", "package-lock.json"]) {
      const lockFilePath = this.fs.resolve(directory, lockFileName);
      if (this.fs.exists(lockFilePath)) {
        const lockFileContents = this.fs.readFile(lockFilePath);
        return createHash2(this.config.hashAlgorithm).update(lockFileContents).digest("hex");
      }
    }
    return null;
  }
};
var InvalidatingEntryPointManifest = class extends EntryPointManifest {
  readEntryPointsUsingManifest(_basePath) {
    return null;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/main.mjs
function mainNgcc(options) {
  const { basePath, targetEntryPointPath, propertiesToConsider, typingsOnly, compileAllFormats, logger, pathMappings, async, errorOnFailedEntryPoint, enableI18nLegacyMessageIdFormat, invalidateEntryPointManifest, fileSystem, absBasePath, projectPath, tsConfig, getFileWriter } = getSharedSetup(options);
  const config = new NgccConfiguration(fileSystem, projectPath);
  const dependencyResolver = getDependencyResolver(fileSystem, logger, config, pathMappings);
  const entryPointManifest = invalidateEntryPointManifest ? new InvalidatingEntryPointManifest(fileSystem, config, logger) : new EntryPointManifest(fileSystem, config, logger);
  const supportedPropertiesToConsider = ensureSupportedProperties(propertiesToConsider);
  const absoluteTargetEntryPointPath = targetEntryPointPath !== void 0 ? fileSystem.resolve(basePath, targetEntryPointPath) : null;
  const finder = getEntryPointFinder(fileSystem, logger, dependencyResolver, config, entryPointManifest, absBasePath, absoluteTargetEntryPointPath, pathMappings, options.findEntryPointsFromTsConfigProgram ? tsConfig : null, projectPath);
  if (finder instanceof TargetedEntryPointFinder && !finder.targetNeedsProcessingOrCleaning(supportedPropertiesToConsider, compileAllFormats)) {
    logger.debug("The target entry-point has already been processed");
    return;
  }
  const workerCount = async ? getMaxNumberOfWorkers() : 1;
  const inParallel = workerCount > 1;
  const analyzeEntryPoints = getAnalyzeEntryPointsFn(logger, finder, fileSystem, supportedPropertiesToConsider, typingsOnly, compileAllFormats, propertiesToConsider, inParallel);
  const pkgJsonUpdater = new DirectPackageJsonUpdater(fileSystem);
  const fileWriter = getFileWriter(pkgJsonUpdater);
  const createCompileFn = getCreateCompileFn(fileSystem, logger, fileWriter, enableI18nLegacyMessageIdFormat, tsConfig, pathMappings);
  const createTaskCompletedCallback = getCreateTaskCompletedCallback(pkgJsonUpdater, errorOnFailedEntryPoint, logger, fileSystem);
  const executor = getExecutor(async, workerCount, logger, fileWriter, pkgJsonUpdater, fileSystem, config, createTaskCompletedCallback);
  return executor.execute(analyzeEntryPoints, createCompileFn);
}
function ensureSupportedProperties(properties) {
  if (properties === SUPPORTED_FORMAT_PROPERTIES)
    return SUPPORTED_FORMAT_PROPERTIES;
  const supportedProperties = [];
  for (const prop of properties) {
    if (SUPPORTED_FORMAT_PROPERTIES.indexOf(prop) !== -1) {
      supportedProperties.push(prop);
    }
  }
  if (supportedProperties.length === 0) {
    throw new Error(`No supported format property to consider among [${properties.join(", ")}]. Supported properties: ${SUPPORTED_FORMAT_PROPERTIES.join(", ")}`);
  }
  return supportedProperties;
}
function getCreateTaskCompletedCallback(pkgJsonUpdater, errorOnFailedEntryPoint, logger, fileSystem) {
  return (taskQueue) => composeTaskCompletedCallbacks({
    [0]: createMarkAsProcessedHandler(fileSystem, pkgJsonUpdater),
    [1]: errorOnFailedEntryPoint ? createThrowErrorHandler(fileSystem) : createLogErrorHandler(logger, fileSystem, taskQueue)
  });
}
function getExecutor(async, workerCount, logger, fileWriter, pkgJsonUpdater, fileSystem, config, createTaskCompletedCallback) {
  const lockFile = new LockFileWithChildProcess(fileSystem, logger);
  if (async) {
    const { retryAttempts, retryDelay } = config.getLockingConfig();
    const locker = new AsyncLocker(lockFile, logger, retryDelay, retryAttempts);
    if (workerCount > 1) {
      return new ClusterExecutor(workerCount, fileSystem, logger, fileWriter, pkgJsonUpdater, locker, createTaskCompletedCallback);
    } else {
      return new SingleProcessExecutorAsync(logger, locker, createTaskCompletedCallback);
    }
  } else {
    return new SingleProcessExecutorSync(logger, new SyncLocker(lockFile), createTaskCompletedCallback);
  }
}
function getDependencyResolver(fileSystem, logger, config, pathMappings) {
  const moduleResolver = new ModuleResolver(fileSystem, pathMappings);
  const esmDependencyHost = new EsmDependencyHost(fileSystem, moduleResolver);
  const umdDependencyHost = new UmdDependencyHost(fileSystem, moduleResolver);
  const commonJsDependencyHost = new CommonJsDependencyHost(fileSystem, moduleResolver);
  const dtsDependencyHost = new DtsDependencyHost(fileSystem, pathMappings);
  return new DependencyResolver(fileSystem, logger, config, {
    esm5: esmDependencyHost,
    esm2015: esmDependencyHost,
    umd: umdDependencyHost,
    commonjs: commonJsDependencyHost
  }, dtsDependencyHost);
}
function getEntryPointFinder(fs, logger, resolver, config, entryPointManifest, basePath, absoluteTargetEntryPointPath, pathMappings, tsConfig, projectPath) {
  if (absoluteTargetEntryPointPath !== null) {
    return new TargetedEntryPointFinder(fs, config, logger, resolver, basePath, pathMappings, absoluteTargetEntryPointPath);
  } else {
    const entryPointCollector = new EntryPointCollector(fs, config, logger, resolver);
    if (tsConfig !== null) {
      return new ProgramBasedEntryPointFinder(fs, config, logger, resolver, entryPointCollector, entryPointManifest, basePath, tsConfig, projectPath);
    } else {
      return new DirectoryWalkerEntryPointFinder(logger, resolver, entryPointCollector, entryPointManifest, basePath, pathMappings);
    }
  }
}

export {
  mainNgcc
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=chunk-JW2HPJCH.js.map
