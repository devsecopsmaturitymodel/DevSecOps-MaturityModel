"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEvaluator = createEvaluator;
exports.getStylusImplementation = getStylusImplementation;
exports.getStylusOptions = getStylusOptions;
exports.normalizeSourceMap = normalizeSourceMap;
exports.readFile = readFile;
exports.resolveFilename = resolveFilename;
exports.urlResolver = urlResolver;

var _url = require("url");

var _path = _interopRequireDefault(require("path"));

var _stylus = require("stylus");

var _depsResolver = _interopRequireDefault(require("stylus/lib/visitor/deps-resolver"));

var _full = require("klona/full");

var _fastGlob = _interopRequireDefault(require("fast-glob"));

var _normalizePath = _interopRequireDefault(require("normalize-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/
const IS_MODULE_IMPORT = /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/;
const MODULE_REQUEST_REGEX = /^[^?]*~/;

function isProductionLikeMode(loaderContext) {
  return loaderContext.mode === "production" || !loaderContext.mode;
}

function getStylusOptions(loaderContext, loaderOptions) {
  const stylusOptions = (0, _full.klona)(typeof loaderOptions.stylusOptions === "function" ? loaderOptions.stylusOptions(loaderContext) || {} : loaderOptions.stylusOptions || {});
  stylusOptions.filename = loaderContext.resourcePath;
  stylusOptions.dest = _path.default.dirname(loaderContext.resourcePath); // Keep track of imported files (used by Stylus CLI watch mode)
  // eslint-disable-next-line no-underscore-dangle

  stylusOptions._imports = []; // https://github.com/stylus/stylus/issues/2119

  stylusOptions.resolveURL = typeof stylusOptions.resolveURL === "boolean" && !stylusOptions.resolveURL ? false : typeof stylusOptions.resolveURL === "object" ? stylusOptions.resolveURL : {
    nocheck: true
  };

  if (typeof stylusOptions.compress === "undefined" && isProductionLikeMode(loaderContext)) {
    stylusOptions.compress = true;
  }

  return stylusOptions;
}

function getStylusImplementation(loaderContext, implementation) {
  let resolvedImplementation = implementation;

  if (!implementation || typeof implementation === "string") {
    const stylusImplPkg = implementation || "stylus";

    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      resolvedImplementation = require(stylusImplPkg);
    } catch (error) {
      loaderContext.emitError(error); // eslint-disable-next-line consistent-return

      return;
    }
  } // eslint-disable-next-line consistent-return


  return resolvedImplementation;
}

function getPossibleRequests(loaderContext, filename) {
  let request = filename; // A `~` makes the url an module

  if (MODULE_REQUEST_REGEX.test(filename)) {
    request = request.replace(MODULE_REQUEST_REGEX, "");
  }

  if (IS_MODULE_IMPORT.test(filename)) {
    request = request[request.length - 1] === "/" ? request : `${request}/`;
  }

  return [...new Set([request, filename])];
}

async function resolveFilename(loaderContext, fileResolver, globResolver, isGlob, context, filename) {
  const possibleRequests = getPossibleRequests(loaderContext, filename);
  let result;

  try {
    result = await resolveRequests(context, possibleRequests, fileResolver);
  } catch (error) {
    if (isGlob) {
      const [globTask] = _fastGlob.default.generateTasks(filename);

      if (globTask.base === ".") {
        throw new Error('Glob resolving without a glob base ("~**/*") is not supported, please specify a glob base ("~package/**/*")');
      }

      const possibleGlobRequests = getPossibleRequests(loaderContext, globTask.base);
      let globResult;

      try {
        globResult = await resolveRequests(context, possibleGlobRequests, globResolver);
      } catch (globError) {
        throw globError;
      }

      loaderContext.addContextDependency(globResult);
      const patterns = filename.replace(new RegExp(`^${globTask.base}`), (0, _normalizePath.default)(globResult));
      const paths = await (0, _fastGlob.default)(patterns, {
        absolute: true,
        cwd: globResult
      });
      return paths.sort().filter(file => /\.styl$/i.test(file));
    }

    throw error;
  }

  return result;
}

async function resolveRequests(context, possibleRequests, resolve) {
  if (possibleRequests.length === 0) {
    return Promise.reject();
  }

  let result;

  try {
    result = await resolve(context, possibleRequests[0]);
  } catch (error) {
    const [, ...tailPossibleRequests] = possibleRequests;

    if (tailPossibleRequests.length === 0) {
      throw error;
    }

    result = await resolveRequests(context, tailPossibleRequests, resolve);
  }

  return result;
}

const URL_RE = /^(?:url\s*\(\s*)?['"]?(?:[#/]|(?:https?:)?\/\/)/i;

async function getDependencies(resolvedDependencies, loaderContext, fileResolver, globResolver, seen, code, filename, options) {
  seen.add(filename); // See https://github.com/stylus/stylus/issues/2108

  const newOptions = (0, _full.klona)({ ...options,
    filename,
    cache: false
  });
  const parser = new _stylus.Parser(code, newOptions);
  let ast;

  try {
    ast = parser.parse();
  } catch (error) {
    loaderContext.emitError(error);
    return;
  }

  const dependencies = [];

  class ImportVisitor extends _depsResolver.default {
    // eslint-disable-next-line class-methods-use-this
    visitImport(node) {
      let firstNode = node.path.first;

      if (firstNode.name === "url") {
        return;
      }

      if (!firstNode.val) {
        const evaluator = new _stylus.Evaluator(ast);
        firstNode = evaluator.visit.call(evaluator, firstNode).first;
      }

      const originalNodePath = !firstNode.val.isNull && firstNode.val || firstNode.name;
      let nodePath = originalNodePath;

      if (!nodePath) {
        return;
      }

      let found;
      let oldNodePath;
      const literal = /\.css(?:"|$)/.test(nodePath);

      if (!literal && !/\.styl$/i.test(nodePath)) {
        oldNodePath = nodePath;
        nodePath += ".styl";
      }

      const isGlob = _fastGlob.default.isDynamicPattern(nodePath);

      found = _stylus.utils.find(nodePath, this.paths, this.filename);

      if (found && isGlob) {
        const [globTask] = _fastGlob.default.generateTasks(nodePath);

        const context = globTask.base === "." ? _path.default.dirname(this.filename) : _path.default.join(_path.default.dirname(this.filename), globTask.base);
        loaderContext.addContextDependency(context);
      }

      if (!found && oldNodePath) {
        found = _stylus.utils.lookupIndex(oldNodePath, this.paths, this.filename);
      }

      if (found) {
        dependencies.push({
          originalLineno: firstNode.lineno,
          originalColumn: firstNode.column,
          originalNodePath,
          resolved: found.map(item => _path.default.isAbsolute(item) ? item : _path.default.join(process.cwd(), item))
        });
        return;
      }

      dependencies.push({
        originalLineno: firstNode.lineno,
        originalColumn: firstNode.column,
        originalNodePath,
        resolved: resolveFilename(loaderContext, fileResolver, globResolver, isGlob, _path.default.dirname(this.filename), originalNodePath)
      });
    }

  }

  new ImportVisitor(ast, newOptions).visit(ast);
  await Promise.all(Array.from(dependencies).map(async result => {
    let {
      resolved
    } = result;

    try {
      resolved = await resolved;
    } catch (ignoreError) {
      // eslint-disable-next-line no-param-reassign
      delete result.resolved; // eslint-disable-next-line no-param-reassign

      result.error = ignoreError;
      return;
    }

    const isArray = Array.isArray(resolved); // `stylus` returns forward slashes on windows
    // eslint-disable-next-line no-param-reassign

    result.resolved = isArray ? resolved.map(item => _path.default.normalize(item)) : _path.default.normalize(resolved);
    const dependenciesOfDependencies = [];

    for (const dependency of isArray ? result.resolved : [result.resolved]) {
      // Avoid loop, the file is imported by itself
      if (seen.has(dependency)) {
        return;
      } // Avoid search nested imports in .css


      if (_path.default.extname(dependency) === ".css") {
        return;
      }

      loaderContext.addDependency(dependency);
      dependenciesOfDependencies.push((async () => {
        let dependencyCode;

        try {
          dependencyCode = (await readFile(loaderContext.fs, dependency)).toString();
        } catch (error) {
          loaderContext.emitError(error);
        }

        await getDependencies(resolvedDependencies, loaderContext, fileResolver, globResolver, seen, dependencyCode, dependency, options);
      })());
    }

    await Promise.all(dependenciesOfDependencies);
  }));

  if (dependencies.length > 0) {
    resolvedDependencies.set(filename, dependencies);
  }
}

function mergeBlocks(blocks) {
  let finalBlock;

  const adding = item => {
    finalBlock.push(item);
  };

  for (const block of blocks) {
    if (finalBlock) {
      block.nodes.forEach(adding);
    } else {
      finalBlock = block;
    }
  }

  return finalBlock;
}

async function createEvaluator(loaderContext, code, options) {
  const fileResolve = loaderContext.getResolve({
    dependencyType: "stylus",
    conditionNames: ["styl", "stylus", "style"],
    mainFields: ["styl", "style", "stylus", "main", "..."],
    mainFiles: ["index", "..."],
    extensions: [".styl", ".css"],
    restrictions: [/\.(css|styl)$/i],
    preferRelative: true
  }); // Get cwd for `fastGlob()`
  // No need extra options, because they do not used when `resolveToContext` is `true`

  const globResolve = loaderContext.getResolve({
    conditionNames: ["styl", "stylus", "style"],
    resolveToContext: true,
    preferRelative: true
  });
  const resolvedImportDependencies = new Map();
  const resolvedDependencies = new Map();
  const seen = new Set();
  await getDependencies(resolvedDependencies, loaderContext, fileResolve, globResolve, seen, code, loaderContext.resourcePath, options);
  const optionsImports = [];

  for (const importPath of options.imports) {
    const isGlob = _fastGlob.default.isDynamicPattern(importPath);

    optionsImports.push({
      importPath,
      resolved: resolveFilename(loaderContext, fileResolve, globResolve, isGlob, _path.default.dirname(loaderContext.resourcePath), importPath)
    });
  }

  await Promise.all(optionsImports.map(async result => {
    const {
      importPath
    } = result;
    let {
      resolved
    } = result;

    try {
      resolved = await resolved;
    } catch (ignoreError) {
      return;
    }

    const isArray = Array.isArray(resolved); // `stylus` returns forward slashes on windows
    // eslint-disable-next-line no-param-reassign

    result.resolved = isArray ? resolved.map(item => _path.default.normalize(item)) : _path.default.normalize(resolved);
    resolvedImportDependencies.set(importPath, result);
    const dependenciesOfImportDependencies = [];

    for (const dependency of isArray ? result.resolved : [result.resolved]) {
      dependenciesOfImportDependencies.push((async () => {
        let dependencyCode;

        try {
          dependencyCode = (await readFile(loaderContext.fs, dependency)).toString();
        } catch (error) {
          loaderContext.emitError(error);
        }

        await getDependencies(resolvedDependencies, loaderContext, fileResolve, globResolve, seen, dependencyCode, dependency, options);
      })());
    }

    await Promise.all(dependenciesOfImportDependencies);
  }));
  return class CustomEvaluator extends _stylus.Evaluator {
    visitImport(imported) {
      this.return += 1;
      const node = this.visit(imported.path).first;
      const nodePath = !node.val.isNull && node.val || node.name;
      this.return -= 1;
      let webpackResolveError;

      if (node.name !== "url" && nodePath && !URL_RE.test(nodePath)) {
        let dependency;
        const isEntrypoint = loaderContext.resourcePath === node.filename;

        if (isEntrypoint) {
          dependency = resolvedImportDependencies.get(nodePath);
        }

        if (!dependency) {
          const dependencies = resolvedDependencies.get(_path.default.normalize(node.filename));

          if (dependencies) {
            dependency = dependencies.find(item => {
              if (item.originalLineno === node.lineno && item.originalColumn === node.column && item.originalNodePath === nodePath) {
                if (item.error) {
                  webpackResolveError = item.error;
                } else {
                  return item.resolved;
                }
              }

              return false;
            });
          }
        }

        if (dependency) {
          const {
            resolved
          } = dependency;

          if (!Array.isArray(resolved)) {
            // Avoid re globbing when resolved import contains glob characters
            node.string = _fastGlob.default.escapePath(resolved);
          } else if (resolved.length > 0) {
            let hasError = false;
            const blocks = resolved.map(item => {
              const clonedImported = imported.clone();
              const clonedNode = this.visit(clonedImported.path).first; // Avoid re globbing when resolved import contains glob characters

              clonedNode.string = _fastGlob.default.escapePath(item);
              let result;

              try {
                result = super.visitImport(clonedImported);
              } catch (error) {
                hasError = true;
              }

              return result;
            });

            if (!hasError) {
              return mergeBlocks(blocks);
            }
          }
        }
      }

      let result;

      try {
        result = super.visitImport(imported);
      } catch (error) {
        loaderContext.emitError(new Error(`Stylus resolver error: ${error.message}${webpackResolveError ? `\n\nWebpack resolver error: ${webpackResolveError.message}${webpackResolveError.details ? `\n\nWebpack resolver error details:\n${webpackResolveError.details}` : ""}${webpackResolveError.missing ? `\n\nWebpack resolver error missing:\n${webpackResolveError.missing.join("\n")}` : ""}` : ""}`));
        return imported;
      }

      return result;
    }

  };
}

function urlResolver(options = {}) {
  function resolver(url) {
    const compiler = new _stylus.Compiler(url);
    const {
      filename
    } = url;
    compiler.isURL = true;
    const visitedUrl = url.nodes.map(node => compiler.visit(node)).join("");
    const splitted = visitedUrl.split("!");
    const parsedUrl = (0, _url.parse)(splitted.pop()); // Parse literal

    const literal = new _stylus.nodes.Literal(`url("${parsedUrl.href}")`);
    let {
      pathname
    } = parsedUrl;
    let {
      dest
    } = this.options;
    let tail = "";
    let res; // Absolute or hash

    if (parsedUrl.protocol || !pathname || pathname[0] === "/") {
      return literal;
    } // Check that file exists


    if (!options.nocheck) {
      // eslint-disable-next-line no-underscore-dangle
      const _paths = options.paths || [];

      pathname = _stylus.utils.lookup(pathname, _paths.concat(this.paths));

      if (!pathname) {
        return literal;
      }
    }

    if (this.includeCSS && _path.default.extname(pathname) === ".css") {
      return new _stylus.nodes.Literal(parsedUrl.href);
    }

    if (parsedUrl.search) {
      tail += parsedUrl.search;
    }

    if (parsedUrl.hash) {
      tail += parsedUrl.hash;
    }

    if (dest && _path.default.extname(dest) === ".css") {
      dest = _path.default.dirname(dest);
    }

    res = _path.default.relative(dest || _path.default.dirname(this.filename), options.nocheck ? _path.default.join(_path.default.dirname(filename), pathname) : pathname) + tail;

    if (_path.default.sep === "\\") {
      res = res.replace(/\\/g, "/");
    }

    splitted.push(res);
    return new _stylus.nodes.Literal(`url("${splitted.join("!")}")`);
  }

  resolver.options = options;
  resolver.raw = true;
  return resolver;
}

function readFile(inputFileSystem, filepath) {
  return new Promise((resolve, reject) => {
    inputFileSystem.readFile(filepath, (error, stats) => {
      if (error) {
        reject(error);
      }

      resolve(stats);
    });
  });
}

const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i;
const ABSOLUTE_SCHEME = /^[A-Za-z0-9+\-.]+:/;

function getURLType(source) {
  if (source[0] === "/") {
    if (source[1] === "/") {
      return "scheme-relative";
    }

    return "path-absolute";
  }

  if (IS_NATIVE_WIN32_PATH.test(source)) {
    return "path-absolute";
  }

  return ABSOLUTE_SCHEME.test(source) ? "absolute" : "path-relative";
}

function normalizeSourceMap(map, rootContext) {
  const newMap = map; // result.map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign

  delete newMap.file; // eslint-disable-next-line no-param-reassign

  newMap.sourceRoot = ""; // eslint-disable-next-line no-param-reassign

  newMap.sources = newMap.sources.map(source => {
    const sourceType = getURLType(source); // Do no touch `scheme-relative`, `path-absolute` and `absolute` types

    if (sourceType === "path-relative") {
      return _path.default.resolve(rootContext, _path.default.normalize(source));
    }

    return source;
  });
  return newMap;
}