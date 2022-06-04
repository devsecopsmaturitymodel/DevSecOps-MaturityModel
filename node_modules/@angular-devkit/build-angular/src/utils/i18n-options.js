"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTranslations = exports.configureI18nBuild = exports.createI18nOptions = void 0;
const core_1 = require("@angular-devkit/core");
const fs_1 = __importDefault(require("fs"));
const module_1 = __importDefault(require("module"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("../builders/browser/schema");
const read_tsconfig_1 = require("../utils/read-tsconfig");
const load_translations_1 = require("./load-translations");
/**
 * The base module location used to search for locale specific data.
 */
const LOCALE_DATA_BASE_MODULE = '@angular/common/locales/global';
function normalizeTranslationFileOption(option, locale, expectObjectInError) {
    if (typeof option === 'string') {
        return [option];
    }
    if (Array.isArray(option) && option.every((element) => typeof element === 'string')) {
        return option;
    }
    let errorMessage = `Project i18n locales translation field value for '${locale}' is malformed. `;
    if (expectObjectInError) {
        errorMessage += 'Expected a string, array of strings, or object.';
    }
    else {
        errorMessage += 'Expected a string or array of strings.';
    }
    throw new Error(errorMessage);
}
function createI18nOptions(metadata, inline) {
    if (metadata.i18n !== undefined && !core_1.json.isJsonObject(metadata.i18n)) {
        throw new Error('Project i18n field is malformed. Expected an object.');
    }
    metadata = metadata.i18n || {};
    const i18n = {
        inlineLocales: new Set(),
        // en-US is the default locale added to Angular applications (https://angular.io/guide/i18n#i18n-pipes)
        sourceLocale: 'en-US',
        locales: {},
        get shouldInline() {
            return this.inlineLocales.size > 0;
        },
    };
    let rawSourceLocale;
    let rawSourceLocaleBaseHref;
    if (core_1.json.isJsonObject(metadata.sourceLocale)) {
        rawSourceLocale = metadata.sourceLocale.code;
        if (metadata.sourceLocale.baseHref !== undefined &&
            typeof metadata.sourceLocale.baseHref !== 'string') {
            throw new Error('Project i18n sourceLocale baseHref field is malformed. Expected a string.');
        }
        rawSourceLocaleBaseHref = metadata.sourceLocale.baseHref;
    }
    else {
        rawSourceLocale = metadata.sourceLocale;
    }
    if (rawSourceLocale !== undefined) {
        if (typeof rawSourceLocale !== 'string') {
            throw new Error('Project i18n sourceLocale field is malformed. Expected a string.');
        }
        i18n.sourceLocale = rawSourceLocale;
        i18n.hasDefinedSourceLocale = true;
    }
    i18n.locales[i18n.sourceLocale] = {
        files: [],
        baseHref: rawSourceLocaleBaseHref,
    };
    if (metadata.locales !== undefined && !core_1.json.isJsonObject(metadata.locales)) {
        throw new Error('Project i18n locales field is malformed. Expected an object.');
    }
    else if (metadata.locales) {
        for (const [locale, options] of Object.entries(metadata.locales)) {
            let translationFiles;
            let baseHref;
            if (core_1.json.isJsonObject(options)) {
                translationFiles = normalizeTranslationFileOption(options.translation, locale, false);
                if (typeof options.baseHref === 'string') {
                    baseHref = options.baseHref;
                }
            }
            else {
                translationFiles = normalizeTranslationFileOption(options, locale, true);
            }
            if (locale === i18n.sourceLocale) {
                throw new Error(`An i18n locale ('${locale}') cannot both be a source locale and provide a translation.`);
            }
            i18n.locales[locale] = {
                files: translationFiles.map((file) => ({ path: file })),
                baseHref,
            };
        }
    }
    if (inline === true) {
        i18n.inlineLocales.add(i18n.sourceLocale);
        Object.keys(i18n.locales).forEach((locale) => i18n.inlineLocales.add(locale));
    }
    else if (inline) {
        for (const locale of inline) {
            if (!i18n.locales[locale] && i18n.sourceLocale !== locale) {
                throw new Error(`Requested locale '${locale}' is not defined for the project.`);
            }
            i18n.inlineLocales.add(locale);
        }
    }
    return i18n;
}
exports.createI18nOptions = createI18nOptions;
async function configureI18nBuild(context, options) {
    if (!context.target) {
        throw new Error('The builder requires a target.');
    }
    const buildOptions = { ...options };
    const tsConfig = await (0, read_tsconfig_1.readTsconfig)(buildOptions.tsConfig, context.workspaceRoot);
    const metadata = await context.getProjectMetadata(context.target);
    const i18n = createI18nOptions(metadata, buildOptions.localize);
    // No additional processing needed if no inlining requested and no source locale defined.
    if (!i18n.shouldInline && !i18n.hasDefinedSourceLocale) {
        return { buildOptions, i18n };
    }
    const projectRoot = path_1.default.join(context.workspaceRoot, metadata.root || '');
    // The trailing slash is required to signal that the path is a directory and not a file.
    const projectRequire = module_1.default.createRequire(projectRoot + '/');
    const localeResolver = (locale) => projectRequire.resolve(path_1.default.join(LOCALE_DATA_BASE_MODULE, locale));
    // Load locale data and translations (if present)
    let loader;
    const usedFormats = new Set();
    for (const [locale, desc] of Object.entries(i18n.locales)) {
        if (!i18n.inlineLocales.has(locale) && locale !== i18n.sourceLocale) {
            continue;
        }
        let localeDataPath = findLocaleDataPath(locale, localeResolver);
        if (!localeDataPath) {
            const [first] = locale.split('-');
            if (first) {
                localeDataPath = findLocaleDataPath(first.toLowerCase(), localeResolver);
                if (localeDataPath) {
                    context.logger.warn(`Locale data for '${locale}' cannot be found.  Using locale data for '${first}'.`);
                }
            }
        }
        if (!localeDataPath) {
            context.logger.warn(`Locale data for '${locale}' cannot be found.  No locale data will be included for this locale.`);
        }
        else {
            desc.dataPath = localeDataPath;
        }
        if (!desc.files.length) {
            continue;
        }
        loader !== null && loader !== void 0 ? loader : (loader = await (0, load_translations_1.createTranslationLoader)());
        loadTranslations(locale, desc, context.workspaceRoot, loader, {
            warn(message) {
                context.logger.warn(message);
            },
            error(message) {
                throw new Error(message);
            },
        }, usedFormats, buildOptions.i18nDuplicateTranslation);
        if (usedFormats.size > 1 && tsConfig.options.enableI18nLegacyMessageIdFormat !== false) {
            // This limitation is only for legacy message id support (defaults to true as of 9.0)
            throw new Error('Localization currently only supports using one type of translation file format for the entire application.');
        }
    }
    // If inlining store the output in a temporary location to facilitate post-processing
    if (i18n.shouldInline) {
        const tempPath = fs_1.default.mkdtempSync(path_1.default.join(fs_1.default.realpathSync(os_1.default.tmpdir()), 'angular-cli-i18n-'));
        buildOptions.outputPath = tempPath;
        process.on('exit', () => deleteTempDirectory(tempPath));
        process.once('SIGINT', () => {
            deleteTempDirectory(tempPath);
            // Needed due to `ora` as otherwise process will not terminate.
            process.kill(process.pid, 'SIGINT');
        });
    }
    return { buildOptions, i18n };
}
exports.configureI18nBuild = configureI18nBuild;
function findLocaleDataPath(locale, resolver) {
    // Remove private use subtags
    const scrubbedLocale = locale.replace(/-x(-[a-zA-Z0-9]{1,8})+$/, '');
    try {
        return resolver(scrubbedLocale);
    }
    catch {
        if (scrubbedLocale === 'en-US') {
            // fallback to known existing en-US locale data as of 9.0
            return findLocaleDataPath('en-US-POSIX', resolver);
        }
        return null;
    }
}
/** Remove temporary directory used for i18n processing. */
function deleteTempDirectory(tempPath) {
    // The below should be removed and replaced with just `rmSync` when support for Node.Js 12 is removed.
    const { rmSync, rmdirSync } = fs_1.default;
    try {
        if (rmSync) {
            rmSync(tempPath, { force: true, recursive: true, maxRetries: 3 });
        }
        else {
            rmdirSync(tempPath, { recursive: true, maxRetries: 3 });
        }
    }
    catch { }
}
function loadTranslations(locale, desc, workspaceRoot, loader, logger, usedFormats, duplicateTranslation) {
    let translations = undefined;
    for (const file of desc.files) {
        const loadResult = loader(path_1.default.join(workspaceRoot, file.path));
        for (const diagnostics of loadResult.diagnostics.messages) {
            if (diagnostics.type === 'error') {
                logger.error(`Error parsing translation file '${file.path}': ${diagnostics.message}`);
            }
            else {
                logger.warn(`WARNING [${file.path}]: ${diagnostics.message}`);
            }
        }
        if (loadResult.locale !== undefined && loadResult.locale !== locale) {
            logger.warn(`WARNING [${file.path}]: File target locale ('${loadResult.locale}') does not match configured locale ('${locale}')`);
        }
        usedFormats === null || usedFormats === void 0 ? void 0 : usedFormats.add(loadResult.format);
        file.format = loadResult.format;
        file.integrity = loadResult.integrity;
        if (translations) {
            // Merge translations
            for (const [id, message] of Object.entries(loadResult.translations)) {
                if (translations[id] !== undefined) {
                    const duplicateTranslationMessage = `[${file.path}]: Duplicate translations for message '${id}' when merging.`;
                    switch (duplicateTranslation) {
                        case schema_1.I18NTranslation.Ignore:
                            break;
                        case schema_1.I18NTranslation.Error:
                            logger.error(`ERROR ${duplicateTranslationMessage}`);
                            break;
                        case schema_1.I18NTranslation.Warning:
                        default:
                            logger.warn(`WARNING ${duplicateTranslationMessage}`);
                            break;
                    }
                }
                translations[id] = message;
            }
        }
        else {
            // First or only translation file
            translations = loadResult.translations;
        }
    }
    desc.translation = translations;
}
exports.loadTranslations = loadTranslations;
