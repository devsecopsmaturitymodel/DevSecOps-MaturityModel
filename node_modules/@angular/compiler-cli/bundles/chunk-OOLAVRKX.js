
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  DEFAULT_ERROR_CODE,
  EmitFlags,
  GENERATED_FILES,
  SOURCE,
  createCompilerHost,
  createMessageDiagnostic,
  exitCodeFromResult,
  formatDiagnostics,
  performCompilation,
  readConfiguration
} from "./chunk-4MML3U2F.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GMSUYBZP.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/main.mjs
import ts2 from "typescript";
import yargs from "yargs";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/perform_watch.mjs
import * as chokidar from "chokidar";
import * as path from "path";
import ts from "typescript";
function totalCompilationTimeDiagnostic(timeInMillis) {
  let duration;
  if (timeInMillis > 1e3) {
    duration = `${(timeInMillis / 1e3).toPrecision(2)}s`;
  } else {
    duration = `${timeInMillis}ms`;
  }
  return {
    category: ts.DiagnosticCategory.Message,
    messageText: `Total time: ${duration}`,
    code: DEFAULT_ERROR_CODE,
    source: SOURCE,
    file: void 0,
    start: void 0,
    length: void 0
  };
}
var FileChangeEvent;
(function(FileChangeEvent2) {
  FileChangeEvent2[FileChangeEvent2["Change"] = 0] = "Change";
  FileChangeEvent2[FileChangeEvent2["CreateDelete"] = 1] = "CreateDelete";
  FileChangeEvent2[FileChangeEvent2["CreateDeleteDir"] = 2] = "CreateDeleteDir";
})(FileChangeEvent || (FileChangeEvent = {}));
function createPerformWatchHost(configFileName, reportDiagnostics, existingOptions, createEmitCallback2) {
  return {
    reportDiagnostics,
    createCompilerHost: (options) => createCompilerHost({ options }),
    readConfiguration: () => readConfiguration(configFileName, existingOptions),
    createEmitCallback: (options) => createEmitCallback2 ? createEmitCallback2(options) : void 0,
    onFileChange: (options, listener, ready) => {
      if (!options.basePath) {
        reportDiagnostics([{
          category: ts.DiagnosticCategory.Error,
          messageText: "Invalid configuration option. baseDir not specified",
          source: SOURCE,
          code: DEFAULT_ERROR_CODE,
          file: void 0,
          start: void 0,
          length: void 0
        }]);
        return { close: () => {
        } };
      }
      const watcher = chokidar.watch(options.basePath, {
        ignored: /((^[\/\\])\..)|(\.js$)|(\.map$)|(\.metadata\.json|node_modules)/,
        ignoreInitial: true,
        persistent: true
      });
      watcher.on("all", (event, path2) => {
        switch (event) {
          case "change":
            listener(FileChangeEvent.Change, path2);
            break;
          case "unlink":
          case "add":
            listener(FileChangeEvent.CreateDelete, path2);
            break;
          case "unlinkDir":
          case "addDir":
            listener(FileChangeEvent.CreateDeleteDir, path2);
            break;
        }
      });
      watcher.on("ready", ready);
      return { close: () => watcher.close(), ready };
    },
    setTimeout: ts.sys.clearTimeout && ts.sys.setTimeout || setTimeout,
    clearTimeout: ts.sys.setTimeout && ts.sys.clearTimeout || clearTimeout
  };
}
function performWatchCompilation(host) {
  let cachedProgram;
  let cachedCompilerHost;
  let cachedOptions;
  let timerHandleForRecompilation;
  const ignoreFilesForWatch = /* @__PURE__ */ new Set();
  const fileCache = /* @__PURE__ */ new Map();
  const firstCompileResult = doCompilation();
  let resolveReadyPromise;
  const readyPromise = new Promise((resolve) => resolveReadyPromise = resolve);
  const fileWatcher = host.onFileChange(cachedOptions.options, watchedFileChanged, resolveReadyPromise);
  return { close, ready: (cb) => readyPromise.then(cb), firstCompileResult };
  function cacheEntry(fileName) {
    fileName = path.normalize(fileName);
    let entry = fileCache.get(fileName);
    if (!entry) {
      entry = {};
      fileCache.set(fileName, entry);
    }
    return entry;
  }
  function close() {
    fileWatcher.close();
    if (timerHandleForRecompilation) {
      host.clearTimeout(timerHandleForRecompilation.timerHandle);
      timerHandleForRecompilation = void 0;
    }
  }
  function doCompilation() {
    if (!cachedOptions) {
      cachedOptions = host.readConfiguration();
    }
    if (cachedOptions.errors && cachedOptions.errors.length) {
      host.reportDiagnostics(cachedOptions.errors);
      return cachedOptions.errors;
    }
    const startTime = Date.now();
    if (!cachedCompilerHost) {
      cachedCompilerHost = host.createCompilerHost(cachedOptions.options);
      const originalWriteFileCallback = cachedCompilerHost.writeFile;
      cachedCompilerHost.writeFile = function(fileName, data, writeByteOrderMark, onError, sourceFiles = []) {
        ignoreFilesForWatch.add(path.normalize(fileName));
        return originalWriteFileCallback(fileName, data, writeByteOrderMark, onError, sourceFiles);
      };
      const originalFileExists = cachedCompilerHost.fileExists;
      cachedCompilerHost.fileExists = function(fileName) {
        const ce = cacheEntry(fileName);
        if (ce.exists == null) {
          ce.exists = originalFileExists.call(this, fileName);
        }
        return ce.exists;
      };
      const originalGetSourceFile = cachedCompilerHost.getSourceFile;
      cachedCompilerHost.getSourceFile = function(fileName, languageVersion) {
        const ce = cacheEntry(fileName);
        if (!ce.sf) {
          ce.sf = originalGetSourceFile.call(this, fileName, languageVersion);
        }
        return ce.sf;
      };
      const originalReadFile = cachedCompilerHost.readFile;
      cachedCompilerHost.readFile = function(fileName) {
        const ce = cacheEntry(fileName);
        if (ce.content == null) {
          ce.content = originalReadFile.call(this, fileName);
        }
        return ce.content;
      };
      cachedCompilerHost.getModifiedResourceFiles = function() {
        if (timerHandleForRecompilation === void 0) {
          return void 0;
        }
        return timerHandleForRecompilation.modifiedResourceFiles;
      };
    }
    ignoreFilesForWatch.clear();
    const oldProgram = cachedProgram;
    cachedProgram = void 0;
    const compileResult = performCompilation({
      rootNames: cachedOptions.rootNames,
      options: cachedOptions.options,
      host: cachedCompilerHost,
      oldProgram,
      emitCallback: host.createEmitCallback(cachedOptions.options)
    });
    if (compileResult.diagnostics.length) {
      host.reportDiagnostics(compileResult.diagnostics);
    }
    const endTime = Date.now();
    if (cachedOptions.options.diagnostics) {
      const totalTime = (endTime - startTime) / 1e3;
      host.reportDiagnostics([totalCompilationTimeDiagnostic(endTime - startTime)]);
    }
    const exitCode = exitCodeFromResult(compileResult.diagnostics);
    if (exitCode == 0) {
      cachedProgram = compileResult.program;
      host.reportDiagnostics([createMessageDiagnostic("Compilation complete. Watching for file changes.")]);
    } else {
      host.reportDiagnostics([createMessageDiagnostic("Compilation failed. Watching for file changes.")]);
    }
    return compileResult.diagnostics;
  }
  function resetOptions() {
    cachedProgram = void 0;
    cachedCompilerHost = void 0;
    cachedOptions = void 0;
  }
  function watchedFileChanged(event, fileName) {
    const normalizedPath = path.normalize(fileName);
    if (cachedOptions && event === FileChangeEvent.Change && normalizedPath === path.normalize(cachedOptions.project)) {
      resetOptions();
    } else if (event === FileChangeEvent.CreateDelete || event === FileChangeEvent.CreateDeleteDir) {
      cachedOptions = void 0;
    }
    if (event === FileChangeEvent.CreateDeleteDir) {
      fileCache.clear();
    } else {
      fileCache.delete(normalizedPath);
    }
    if (!ignoreFilesForWatch.has(normalizedPath)) {
      startTimerForRecompilation(normalizedPath);
    }
  }
  function startTimerForRecompilation(changedPath) {
    if (timerHandleForRecompilation) {
      host.clearTimeout(timerHandleForRecompilation.timerHandle);
    } else {
      timerHandleForRecompilation = {
        modifiedResourceFiles: /* @__PURE__ */ new Set(),
        timerHandle: void 0
      };
    }
    timerHandleForRecompilation.timerHandle = host.setTimeout(recompile, 250);
    timerHandleForRecompilation.modifiedResourceFiles.add(changedPath);
  }
  function recompile() {
    host.reportDiagnostics([createMessageDiagnostic("File change detected. Starting incremental compilation.")]);
    doCompilation();
    timerHandleForRecompilation = void 0;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/main.mjs
function main(args, consoleError = console.error, config, customTransformers, programReuse, modifiedResourceFiles, tsickle) {
  let { project, rootNames, options, errors: configErrors, watch: watch2, emitFlags } = config || readNgcCommandLineAndConfiguration(args);
  if (configErrors.length) {
    return reportErrorsAndExit(configErrors, void 0, consoleError);
  }
  if (watch2) {
    const result = watchMode(project, options, consoleError);
    return reportErrorsAndExit(result.firstCompileResult, options, consoleError);
  }
  let oldProgram;
  if (programReuse !== void 0) {
    oldProgram = programReuse.program;
  }
  const { diagnostics: compileDiags, program } = performCompilation({
    rootNames,
    options,
    emitFlags,
    oldProgram,
    emitCallback: createEmitCallback(options, tsickle),
    customTransformers,
    modifiedResourceFiles
  });
  if (programReuse !== void 0) {
    programReuse.program = program;
  }
  return reportErrorsAndExit(compileDiags, options, consoleError);
}
function createEmitCallback(options, tsickle) {
  if (!options.annotateForClosureCompiler) {
    return void 0;
  }
  if (tsickle == void 0) {
    throw Error("Tsickle is not provided but `annotateForClosureCompiler` is enabled.");
  }
  const tsickleHost = {
    shouldSkipTsickleProcessing: (fileName) => /\.d\.ts$/.test(fileName) || !options.enableIvy && GENERATED_FILES.test(fileName),
    pathToModuleName: (context, importPath) => "",
    shouldIgnoreWarningsForPath: (filePath) => false,
    fileNameToModuleId: (fileName) => fileName,
    googmodule: false,
    untyped: true,
    convertIndexImportShorthand: false,
    transformDecorators: false,
    transformTypesToClosure: true
  };
  return ({ program, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers = {}, host, options: options2 }) => tsickle.emitWithTsickle(program, __spreadProps(__spreadValues({}, tsickleHost), { options: options2, moduleResolutionHost: host }), host, options2, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, {
    beforeTs: customTransformers.before,
    afterTs: customTransformers.after
  });
}
function readNgcCommandLineAndConfiguration(args) {
  const options = {};
  const parsedArgs = yargs(args).parserConfiguration({ "strip-aliased": true }).option("i18nFile", { type: "string" }).option("i18nFormat", { type: "string" }).option("locale", { type: "string" }).option("missingTranslation", { type: "string", choices: ["error", "warning", "ignore"] }).option("outFile", { type: "string" }).option("watch", { type: "boolean", alias: ["w"] }).parseSync();
  if (parsedArgs.i18nFile)
    options.i18nInFile = parsedArgs.i18nFile;
  if (parsedArgs.i18nFormat)
    options.i18nInFormat = parsedArgs.i18nFormat;
  if (parsedArgs.locale)
    options.i18nInLocale = parsedArgs.locale;
  if (parsedArgs.missingTranslation)
    options.i18nInMissingTranslations = parsedArgs.missingTranslation;
  const config = readCommandLineAndConfiguration(args, options, ["i18nFile", "i18nFormat", "locale", "missingTranslation", "watch"]);
  return __spreadProps(__spreadValues({}, config), { watch: parsedArgs.watch });
}
function readCommandLineAndConfiguration(args, existingOptions = {}, ngCmdLineOptions = []) {
  let cmdConfig = ts2.parseCommandLine(args);
  const project = cmdConfig.options.project || ".";
  const cmdErrors = cmdConfig.errors.filter((e) => {
    if (typeof e.messageText === "string") {
      const msg = e.messageText;
      return !ngCmdLineOptions.some((o) => msg.indexOf(o) >= 0);
    }
    return true;
  });
  if (cmdErrors.length) {
    return {
      project,
      rootNames: [],
      options: cmdConfig.options,
      errors: cmdErrors,
      emitFlags: EmitFlags.Default
    };
  }
  const config = readConfiguration(project, cmdConfig.options);
  const options = __spreadValues(__spreadValues({}, config.options), existingOptions);
  if (options.locale) {
    options.i18nInLocale = options.locale;
  }
  return {
    project,
    rootNames: config.rootNames,
    options,
    errors: config.errors,
    emitFlags: config.emitFlags
  };
}
function getFormatDiagnosticsHost(options) {
  const basePath = options ? options.basePath : void 0;
  return {
    getCurrentDirectory: () => basePath || ts2.sys.getCurrentDirectory(),
    getCanonicalFileName: (fileName) => fileName.replace(/\\/g, "/"),
    getNewLine: () => {
      if (options && options.newLine !== void 0) {
        return options.newLine === ts2.NewLineKind.LineFeed ? "\n" : "\r\n";
      }
      return ts2.sys.newLine;
    }
  };
}
function reportErrorsAndExit(allDiagnostics, options, consoleError = console.error) {
  const errorsAndWarnings = allDiagnostics.filter((d) => d.category !== ts2.DiagnosticCategory.Message);
  printDiagnostics(errorsAndWarnings, options, consoleError);
  return exitCodeFromResult(allDiagnostics);
}
function watchMode(project, options, consoleError) {
  return performWatchCompilation(createPerformWatchHost(project, (diagnostics) => {
    printDiagnostics(diagnostics, options, consoleError);
  }, options, (options2) => createEmitCallback(options2)));
}
function printDiagnostics(diagnostics, options, consoleError) {
  if (diagnostics.length === 0) {
    return;
  }
  const formatHost = getFormatDiagnosticsHost(options);
  consoleError(formatDiagnostics(diagnostics, formatHost));
}

export {
  main,
  readCommandLineAndConfiguration
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=chunk-OOLAVRKX.js.map
