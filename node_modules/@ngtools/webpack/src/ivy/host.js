"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.augmentHostWithCaching = exports.augmentProgramWithVersioning = exports.augmentHostWithVersioning = exports.augmentHostWithSubstitutions = exports.augmentHostWithReplacements = exports.augmentHostWithNgcc = exports.augmentHostWithDependencyCollection = exports.augmentHostWithResources = void 0;
const crypto_1 = require("crypto");
const path = __importStar(require("path"));
const ts = __importStar(require("typescript"));
const paths_1 = require("./paths");
function augmentHostWithResources(host, resourceLoader, options = {}) {
    const resourceHost = host;
    resourceHost.readResource = function (fileName) {
        const filePath = (0, paths_1.normalizePath)(fileName);
        if (options.directTemplateLoading &&
            (filePath.endsWith('.html') || filePath.endsWith('.svg'))) {
            const content = this.readFile(filePath);
            if (content === undefined) {
                throw new Error('Unable to locate component resource: ' + fileName);
            }
            resourceLoader.setAffectedResources(filePath, [filePath]);
            return content;
        }
        else {
            return resourceLoader.get(filePath);
        }
    };
    resourceHost.resourceNameToFileName = function (resourceName, containingFile) {
        return path.join(path.dirname(containingFile), resourceName);
    };
    resourceHost.getModifiedResourceFiles = function () {
        return resourceLoader.getModifiedResourceFiles();
    };
    resourceHost.transformResource = async function (data, context) {
        // Only inline style resources are supported currently
        if (context.resourceFile || context.type !== 'style') {
            return null;
        }
        if (options.inlineStyleFileExtension) {
            const content = await resourceLoader.process(data, options.inlineStyleFileExtension, context.type, context.containingFile);
            return { content };
        }
        return null;
    };
}
exports.augmentHostWithResources = augmentHostWithResources;
function augmentResolveModuleNames(host, resolvedModuleModifier, moduleResolutionCache) {
    if (host.resolveModuleNames) {
        const baseResolveModuleNames = host.resolveModuleNames;
        host.resolveModuleNames = function (moduleNames, ...parameters) {
            return moduleNames.map((name) => {
                const result = baseResolveModuleNames.call(host, [name], ...parameters);
                return resolvedModuleModifier(result[0], name);
            });
        };
    }
    else {
        host.resolveModuleNames = function (moduleNames, containingFile, _reusedNames, redirectedReference, options) {
            return moduleNames.map((name) => {
                const result = ts.resolveModuleName(name, containingFile, options, host, moduleResolutionCache, redirectedReference).resolvedModule;
                return resolvedModuleModifier(result, name);
            });
        };
    }
}
/**
 * Augments a TypeScript Compiler Host's resolveModuleNames function to collect dependencies
 * of the containing file passed to the resolveModuleNames function. This process assumes
 * that consumers of the Compiler Host will only call resolveModuleNames with modules that are
 * actually present in a containing file.
 * This process is a workaround for gathering a TypeScript SourceFile's dependencies as there
 * is no currently exposed public method to do so. A BuilderProgram does have a `getAllDependencies`
 * function. However, that function returns all transitive dependencies as well which can cause
 * excessive Webpack rebuilds.
 *
 * @param host The CompilerHost to augment.
 * @param dependencies A Map which will be used to store file dependencies.
 * @param moduleResolutionCache An optional resolution cache to use when the host resolves a module.
 */
function augmentHostWithDependencyCollection(host, dependencies, moduleResolutionCache) {
    if (host.resolveModuleNames) {
        const baseResolveModuleNames = host.resolveModuleNames;
        host.resolveModuleNames = function (moduleNames, containingFile, ...parameters) {
            const results = baseResolveModuleNames.call(host, moduleNames, containingFile, ...parameters);
            const containingFilePath = (0, paths_1.normalizePath)(containingFile);
            for (const result of results) {
                if (result) {
                    const containingFileDependencies = dependencies.get(containingFilePath);
                    if (containingFileDependencies) {
                        containingFileDependencies.add(result.resolvedFileName);
                    }
                    else {
                        dependencies.set(containingFilePath, new Set([result.resolvedFileName]));
                    }
                }
            }
            return results;
        };
    }
    else {
        host.resolveModuleNames = function (moduleNames, containingFile, _reusedNames, redirectedReference, options) {
            return moduleNames.map((name) => {
                const result = ts.resolveModuleName(name, containingFile, options, host, moduleResolutionCache, redirectedReference).resolvedModule;
                if (result) {
                    const containingFilePath = (0, paths_1.normalizePath)(containingFile);
                    const containingFileDependencies = dependencies.get(containingFilePath);
                    if (containingFileDependencies) {
                        containingFileDependencies.add(result.resolvedFileName);
                    }
                    else {
                        dependencies.set(containingFilePath, new Set([result.resolvedFileName]));
                    }
                }
                return result;
            });
        };
    }
}
exports.augmentHostWithDependencyCollection = augmentHostWithDependencyCollection;
function augmentHostWithNgcc(host, ngcc, moduleResolutionCache) {
    augmentResolveModuleNames(host, (resolvedModule, moduleName) => {
        if (resolvedModule && ngcc) {
            ngcc.processModule(moduleName, resolvedModule);
        }
        return resolvedModule;
    }, moduleResolutionCache);
    if (host.resolveTypeReferenceDirectives) {
        const baseResolveTypeReferenceDirectives = host.resolveTypeReferenceDirectives;
        host.resolveTypeReferenceDirectives = function (names, ...parameters) {
            return names.map((name) => {
                const result = baseResolveTypeReferenceDirectives.call(host, [name], ...parameters);
                if (result[0] && ngcc) {
                    ngcc.processModule(name, result[0]);
                }
                return result[0];
            });
        };
    }
    else {
        host.resolveTypeReferenceDirectives = function (moduleNames, containingFile, redirectedReference, options) {
            return moduleNames.map((name) => {
                const result = ts.resolveTypeReferenceDirective(name, containingFile, options, host, redirectedReference).resolvedTypeReferenceDirective;
                if (result && ngcc) {
                    ngcc.processModule(name, result);
                }
                return result;
            });
        };
    }
}
exports.augmentHostWithNgcc = augmentHostWithNgcc;
function augmentHostWithReplacements(host, replacements, moduleResolutionCache) {
    if (Object.keys(replacements).length === 0) {
        return;
    }
    const normalizedReplacements = {};
    for (const [key, value] of Object.entries(replacements)) {
        normalizedReplacements[(0, paths_1.normalizePath)(key)] = (0, paths_1.normalizePath)(value);
    }
    const tryReplace = (resolvedModule) => {
        const replacement = resolvedModule && normalizedReplacements[resolvedModule.resolvedFileName];
        if (replacement) {
            return {
                resolvedFileName: replacement,
                isExternalLibraryImport: /[/\\]node_modules[/\\]/.test(replacement),
            };
        }
        else {
            return resolvedModule;
        }
    };
    augmentResolveModuleNames(host, tryReplace, moduleResolutionCache);
}
exports.augmentHostWithReplacements = augmentHostWithReplacements;
function augmentHostWithSubstitutions(host, substitutions) {
    const regexSubstitutions = [];
    for (const [key, value] of Object.entries(substitutions)) {
        regexSubstitutions.push([new RegExp(`\\b${key}\\b`, 'g'), value]);
    }
    if (regexSubstitutions.length === 0) {
        return;
    }
    const baseReadFile = host.readFile;
    host.readFile = function (...parameters) {
        let file = baseReadFile.call(host, ...parameters);
        if (file) {
            for (const entry of regexSubstitutions) {
                file = file.replace(entry[0], entry[1]);
            }
        }
        return file;
    };
}
exports.augmentHostWithSubstitutions = augmentHostWithSubstitutions;
function augmentHostWithVersioning(host) {
    const baseGetSourceFile = host.getSourceFile;
    host.getSourceFile = function (...parameters) {
        const file = baseGetSourceFile.call(host, ...parameters);
        if (file && file.version === undefined) {
            file.version = (0, crypto_1.createHash)('sha256').update(file.text).digest('hex');
        }
        return file;
    };
}
exports.augmentHostWithVersioning = augmentHostWithVersioning;
function augmentProgramWithVersioning(program) {
    const baseGetSourceFiles = program.getSourceFiles;
    program.getSourceFiles = function (...parameters) {
        const files = baseGetSourceFiles(...parameters);
        for (const file of files) {
            if (file.version === undefined) {
                file.version = (0, crypto_1.createHash)('sha256').update(file.text).digest('hex');
            }
        }
        return files;
    };
}
exports.augmentProgramWithVersioning = augmentProgramWithVersioning;
function augmentHostWithCaching(host, cache) {
    const baseGetSourceFile = host.getSourceFile;
    host.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile, ...parameters) {
        if (!shouldCreateNewSourceFile && cache.has(fileName)) {
            return cache.get(fileName);
        }
        const file = baseGetSourceFile.call(host, fileName, languageVersion, onError, true, ...parameters);
        if (file) {
            cache.set(fileName, file);
        }
        return file;
    };
}
exports.augmentHostWithCaching = augmentHostWithCaching;
