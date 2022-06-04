"use strict";
/**
 * Copyright (c) 2015-present, Waysact Pty Ltd
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
class Reporter {
    /**
     * @internal
     */
    constructor(compilation, pluginName) {
        /**
         * @internal
         */
        this.emittedMessages = new Set();
        this.compilation = compilation;
        this.pluginName = pluginName;
    }
    /**
     * @internal
     */
    emitMessage(messages, message) {
        messages.push(new Error(`${this.pluginName}: ${message}`));
    }
    /**
     * @internal
     */
    emitMessageOnce(messages, message) {
        if (!this.emittedMessages.has(message)) {
            this.emittedMessages.add(message);
            this.emitMessage(messages, message);
        }
    }
    /**
     * @internal
     */
    warnOnce(message) {
        this.emitMessageOnce(this.compilation.warnings, message);
    }
    /**
     * @internal
     */
    errorOnce(message) {
        this.emitMessageOnce(this.compilation.errors, message);
    }
    /**
     * @internal
     */
    error(message) {
        this.emitMessage(this.compilation.errors, message);
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=reporter.js.map