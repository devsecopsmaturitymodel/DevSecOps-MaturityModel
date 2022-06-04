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
exports.EsbuildExecutor = void 0;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
/**
 * Provides the ability to execute esbuild regardless of the current platform's support
 * for using the native variant of esbuild. The native variant will be preferred (assuming
 * the `alwaysUseWasm` constructor option is `false) due to its inherent performance advantages.
 * At first use of esbuild, a supportability test will be automatically performed and the
 * WASM-variant will be used if needed by the platform.
 */
class EsbuildExecutor {
    /**
     * Constructs an instance of the `EsbuildExecutor` class.
     *
     * @param alwaysUseWasm If true, the WASM-variant will be preferred and no support test will be
     * performed; if false (default), the native variant will be preferred.
     */
    constructor(alwaysUseWasm = false) {
        this.alwaysUseWasm = alwaysUseWasm;
        this.initialized = false;
        this.esbuildTransform = this.esbuildFormatMessages = () => {
            throw new Error('esbuild implementation missing');
        };
    }
    /**
     * Determines whether the native variant of esbuild can be used on the current platform.
     *
     * @returns True, if the native variant of esbuild is support; False, if the WASM variant is required.
     */
    static hasNativeSupport() {
        // Try to use native variant to ensure it is functional for the platform.
        // Spawning a separate esbuild check process is used to determine if the native
        // variant is viable. If check fails, the WASM variant is initialized instead.
        // Attempting to call one of the native esbuild functions is not a viable test
        // currently since esbuild spawn errors are currently not propagated through the
        // call stack for the esbuild function. If this limitation is removed in the future
        // then the separate process spawn check can be removed in favor of a direct function
        // call check.
        try {
            const { status, error } = (0, child_process_1.spawnSync)(process.execPath, [
                path.join(__dirname, '../../../esbuild-check.js'),
            ]);
            return status === 0 && error === undefined;
        }
        catch {
            return false;
        }
    }
    /**
     * Initializes the esbuild transform and format messages functions.
     *
     * @returns A promise that fulfills when esbuild has been loaded and available for use.
     */
    async ensureEsbuild() {
        if (this.initialized) {
            return;
        }
        // If the WASM variant was preferred at class construction or native is not supported, use WASM
        if (this.alwaysUseWasm || !EsbuildExecutor.hasNativeSupport()) {
            await this.useWasm();
            this.initialized = true;
            return;
        }
        try {
            // Use the faster native variant if available.
            const { transform, formatMessages } = await Promise.resolve().then(() => __importStar(require('esbuild')));
            this.esbuildTransform = transform;
            this.esbuildFormatMessages = formatMessages;
        }
        catch {
            // If the native variant is not installed then use the WASM-based variant
            await this.useWasm();
        }
        this.initialized = true;
    }
    /**
     * Transitions an executor instance to use the WASM-variant of esbuild.
     */
    async useWasm() {
        const { transform, formatMessages } = await Promise.resolve().then(() => __importStar(require('esbuild-wasm')));
        this.esbuildTransform = transform;
        this.esbuildFormatMessages = formatMessages;
        // The ESBUILD_BINARY_PATH environment variable cannot exist when attempting to use the
        // WASM variant. If it is then the binary located at the specified path will be used instead
        // of the WASM variant.
        delete process.env.ESBUILD_BINARY_PATH;
        this.alwaysUseWasm = true;
    }
    async transform(input, options) {
        await this.ensureEsbuild();
        return this.esbuildTransform(input, options);
    }
    async formatMessages(messages, options) {
        await this.ensureEsbuild();
        return this.esbuildFormatMessages(messages, options);
    }
}
exports.EsbuildExecutor = EsbuildExecutor;
