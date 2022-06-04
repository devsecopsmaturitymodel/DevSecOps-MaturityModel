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
exports.serveWebpackBrowser = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_webpack_1 = require("@angular-devkit/build-webpack");
const core_1 = require("@angular-devkit/core");
const path = __importStar(require("path"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const url = __importStar(require("url"));
const utils_1 = require("../../utils");
const check_port_1 = require("../../utils/check-port");
const color_1 = require("../../utils/color");
const i18n_options_1 = require("../../utils/i18n-options");
const load_translations_1 = require("../../utils/load-translations");
const normalize_cache_1 = require("../../utils/normalize-cache");
const package_chunk_sort_1 = require("../../utils/package-chunk-sort");
const purge_cache_1 = require("../../utils/purge-cache");
const version_1 = require("../../utils/version");
const webpack_browser_config_1 = require("../../utils/webpack-browser-config");
const webpack_diagnostics_1 = require("../../utils/webpack-diagnostics");
const configs_1 = require("../../webpack/configs");
const index_html_webpack_plugin_1 = require("../../webpack/plugins/index-html-webpack-plugin");
const stats_1 = require("../../webpack/utils/stats");
const schema_1 = require("../browser/schema");
/**
 * Reusable implementation of the Angular Webpack development server builder.
 * @param options Dev Server options.
 * @param context The build context.
 * @param transforms A map of transforms that can be used to hook into some logic (such as
 *     transforming webpack configuration before passing it to webpack).
 *
 * @experimental Direct usage of this function is considered experimental.
 */
// eslint-disable-next-line max-lines-per-function
function serveWebpackBrowser(options, context, transforms = {}) {
    // Check Angular version.
    const { logger, workspaceRoot } = context;
    (0, version_1.assertCompatibleAngularVersion)(workspaceRoot);
    const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
    async function setup() {
        var _a, _b, _c, _d;
        const projectName = (_a = context.target) === null || _a === void 0 ? void 0 : _a.project;
        if (!projectName) {
            throw new Error('The builder requires a target.');
        }
        // Purge old build disk cache.
        await (0, purge_cache_1.purgeStaleBuildCache)(context);
        options.port = await (0, check_port_1.checkPort)((_b = options.port) !== null && _b !== void 0 ? _b : 4200, options.host || 'localhost');
        if (options.hmr) {
            logger.warn(core_1.tags.stripIndents `NOTICE: Hot Module Replacement (HMR) is enabled for the dev server.
      See https://webpack.js.org/guides/hot-module-replacement for information on working with HMR for Webpack.`);
        }
        if (!options.disableHostCheck &&
            options.host &&
            !/^127\.\d+\.\d+\.\d+/g.test(options.host) &&
            options.host !== 'localhost') {
            logger.warn(core_1.tags.stripIndent `
        Warning: This is a simple server for use in testing or debugging Angular applications
        locally. It hasn't been reviewed for security issues.

        Binding this server to an open connection can result in compromising your application or
        computer. Using a different host than the one passed to the "--host" flag might result in
        websocket connection issues. You might need to use "--disable-host-check" if that's the
        case.
      `);
        }
        if (options.disableHostCheck) {
            logger.warn(core_1.tags.oneLine `
        Warning: Running a server with --disable-host-check is a security risk.
        See https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
        for more information.
      `);
        }
        // Get the browser configuration from the target name.
        const rawBrowserOptions = (await context.getTargetOptions(browserTarget));
        if (rawBrowserOptions.outputHashing && rawBrowserOptions.outputHashing !== schema_1.OutputHashing.None) {
            // Disable output hashing for dev build as this can cause memory leaks
            // See: https://github.com/webpack/webpack-dev-server/issues/377#issuecomment-241258405
            rawBrowserOptions.outputHashing = schema_1.OutputHashing.None;
            logger.warn(`Warning: 'outputHashing' option is disabled when using the dev-server.`);
        }
        const metadata = await context.getProjectMetadata(projectName);
        const cacheOptions = (0, normalize_cache_1.normalizeCacheOptions)(metadata, context.workspaceRoot);
        const browserName = await context.getBuilderNameForTarget(browserTarget);
        const browserOptions = (await context.validateOptions({
            ...rawBrowserOptions,
            watch: options.watch,
            verbose: options.verbose,
            // In dev server we should not have budgets because of extra libs such as socks-js
            budgets: undefined,
        }, browserName));
        const { styles, scripts } = (0, utils_1.normalizeOptimization)(browserOptions.optimization);
        if (scripts || styles.minify) {
            logger.error(core_1.tags.stripIndents `
        ****************************************************************************************
        This is a simple server for use in testing or debugging Angular applications locally.
        It hasn't been reviewed for security issues.

        DON'T USE IT FOR PRODUCTION!
        ****************************************************************************************
      `);
        }
        const { config, projectRoot, i18n } = await (0, webpack_browser_config_1.generateI18nBrowserWebpackConfigFromContext)(browserOptions, context, (wco) => [
            (0, configs_1.getDevServerConfig)(wco),
            (0, configs_1.getCommonConfig)(wco),
            (0, configs_1.getStylesConfig)(wco),
            (0, configs_1.getAnalyticsConfig)(wco, context),
        ], options);
        if (!config.devServer) {
            throw new Error('Webpack Dev Server configuration was not set.');
        }
        let locale;
        if (i18n.shouldInline) {
            // Dev-server only supports one locale
            locale = [...i18n.inlineLocales][0];
        }
        else if (i18n.hasDefinedSourceLocale) {
            // use source locale if not localizing
            locale = i18n.sourceLocale;
        }
        let webpackConfig = config;
        // If a locale is defined, setup localization
        if (locale) {
            if (i18n.inlineLocales.size > 1) {
                throw new Error('The development server only supports localizing a single locale per build.');
            }
            await setupLocalize(locale, i18n, browserOptions, webpackConfig, cacheOptions, context);
        }
        if (transforms.webpackConfiguration) {
            webpackConfig = await transforms.webpackConfiguration(webpackConfig);
        }
        if (browserOptions.index) {
            const { scripts = [], styles = [], baseHref } = browserOptions;
            const entrypoints = (0, package_chunk_sort_1.generateEntryPoints)({
                scripts,
                styles,
                // The below is needed as otherwise HMR for CSS will break.
                // styles.js and runtime.js needs to be loaded as a non-module scripts as otherwise `document.currentScript` will be null.
                // https://github.com/webpack-contrib/mini-css-extract-plugin/blob/90445dd1d81da0c10b9b0e8a17b417d0651816b8/src/hmr/hotModuleReplacement.js#L39
                isHMREnabled: !!((_c = webpackConfig.devServer) === null || _c === void 0 ? void 0 : _c.hot),
            });
            (_d = webpackConfig.plugins) !== null && _d !== void 0 ? _d : (webpackConfig.plugins = []);
            webpackConfig.plugins.push(new index_html_webpack_plugin_1.IndexHtmlWebpackPlugin({
                indexPath: path.resolve(workspaceRoot, (0, webpack_browser_config_1.getIndexInputFile)(browserOptions.index)),
                outputPath: (0, webpack_browser_config_1.getIndexOutputFile)(browserOptions.index),
                baseHref,
                entrypoints,
                deployUrl: browserOptions.deployUrl,
                sri: browserOptions.subresourceIntegrity,
                cache: cacheOptions,
                postTransform: transforms.indexHtml,
                optimization: (0, utils_1.normalizeOptimization)(browserOptions.optimization),
                crossOrigin: browserOptions.crossOrigin,
                lang: locale,
            }));
        }
        return {
            browserOptions,
            webpackConfig,
            projectRoot,
        };
    }
    return (0, rxjs_1.from)(setup()).pipe((0, operators_1.switchMap)(({ browserOptions, webpackConfig }) => {
        return (0, build_webpack_1.runWebpackDevServer)(webpackConfig, context, {
            logging: transforms.logging || (0, stats_1.createWebpackLoggingCallback)(browserOptions, logger),
            webpackFactory: require('webpack'),
            webpackDevServerFactory: require('webpack-dev-server'),
        }).pipe((0, operators_1.concatMap)(async (buildEvent, index) => {
            var _a, _b;
            // Resolve serve address.
            const publicPath = (_b = (_a = webpackConfig.devServer) === null || _a === void 0 ? void 0 : _a.devMiddleware) === null || _b === void 0 ? void 0 : _b.publicPath;
            const serverAddress = url.format({
                protocol: options.ssl ? 'https' : 'http',
                hostname: options.host === '0.0.0.0' ? 'localhost' : options.host,
                port: buildEvent.port,
                pathname: typeof publicPath === 'string' ? publicPath : undefined,
            });
            if (index === 0) {
                logger.info('\n' +
                    core_1.tags.oneLine `
              **
              Angular Live Development Server is listening on ${options.host}:${buildEvent.port},
              open your browser on ${serverAddress}
              **
            ` +
                    '\n');
                if (options.open) {
                    const open = (await Promise.resolve().then(() => __importStar(require('open')))).default;
                    await open(serverAddress);
                }
            }
            if (buildEvent.success) {
                logger.info(`\n${color_1.colors.greenBright(color_1.colors.symbols.check)} Compiled successfully.`);
            }
            else {
                logger.info(`\n${color_1.colors.redBright(color_1.colors.symbols.cross)} Failed to compile.`);
            }
            return { ...buildEvent, baseUrl: serverAddress };
        }));
    }));
}
exports.serveWebpackBrowser = serveWebpackBrowser;
async function setupLocalize(locale, i18n, browserOptions, webpackConfig, cacheOptions, context) {
    var _a;
    const localeDescription = i18n.locales[locale];
    // Modify main entrypoint to include locale data
    if ((localeDescription === null || localeDescription === void 0 ? void 0 : localeDescription.dataPath) &&
        typeof webpackConfig.entry === 'object' &&
        !Array.isArray(webpackConfig.entry) &&
        webpackConfig.entry['main']) {
        if (Array.isArray(webpackConfig.entry['main'])) {
            webpackConfig.entry['main'].unshift(localeDescription.dataPath);
        }
        else {
            webpackConfig.entry['main'] = [
                localeDescription.dataPath,
                webpackConfig.entry['main'],
            ];
        }
    }
    let missingTranslationBehavior = browserOptions.i18nMissingTranslation || 'ignore';
    let translation = (localeDescription === null || localeDescription === void 0 ? void 0 : localeDescription.translation) || {};
    if (locale === i18n.sourceLocale) {
        missingTranslationBehavior = 'ignore';
        translation = {};
    }
    const i18nLoaderOptions = {
        locale,
        missingTranslationBehavior,
        translation: i18n.shouldInline ? translation : undefined,
        translationFiles: localeDescription === null || localeDescription === void 0 ? void 0 : localeDescription.files.map((file) => path.resolve(context.workspaceRoot, file.path)),
    };
    const i18nRule = {
        test: /\.[cm]?[tj]sx?$/,
        enforce: 'post',
        use: [
            {
                loader: require.resolve('../../babel/webpack-loader'),
                options: {
                    cacheDirectory: (cacheOptions.enabled && path.join(cacheOptions.path, 'babel-dev-server-i18n')) ||
                        false,
                    cacheIdentifier: JSON.stringify({
                        locale,
                        translationIntegrity: localeDescription === null || localeDescription === void 0 ? void 0 : localeDescription.files.map((file) => file.integrity),
                    }),
                    i18n: i18nLoaderOptions,
                },
            },
        ],
    };
    // Get the rules and ensure the Webpack configuration is setup properly
    const rules = ((_a = webpackConfig.module) === null || _a === void 0 ? void 0 : _a.rules) || [];
    if (!webpackConfig.module) {
        webpackConfig.module = { rules };
    }
    else if (!webpackConfig.module.rules) {
        webpackConfig.module.rules = rules;
    }
    rules.push(i18nRule);
    // Add a plugin to reload translation files on rebuilds
    const loader = await (0, load_translations_1.createTranslationLoader)();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    webpackConfig.plugins.push({
        apply: (compiler) => {
            compiler.hooks.thisCompilation.tap('build-angular', (compilation) => {
                var _a;
                if (i18n.shouldInline && i18nLoaderOptions.translation === undefined) {
                    // Reload translations
                    (0, i18n_options_1.loadTranslations)(locale, localeDescription, context.workspaceRoot, loader, {
                        warn(message) {
                            (0, webpack_diagnostics_1.addWarning)(compilation, message);
                        },
                        error(message) {
                            (0, webpack_diagnostics_1.addError)(compilation, message);
                        },
                    }, undefined, browserOptions.i18nDuplicateTranslation);
                    i18nLoaderOptions.translation = (_a = localeDescription.translation) !== null && _a !== void 0 ? _a : {};
                }
                compilation.hooks.finishModules.tap('build-angular', () => {
                    // After loaders are finished, clear out the now unneeded translations
                    i18nLoaderOptions.translation = undefined;
                });
            });
        },
    });
}
exports.default = (0, architect_1.createBuilder)(serveWebpackBrowser);
