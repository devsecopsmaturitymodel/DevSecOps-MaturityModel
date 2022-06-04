"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Spinner_isTTY;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
const ora_1 = __importDefault(require("ora"));
const color_1 = require("./color");
const tty_1 = require("./tty");
class Spinner {
    constructor(text) {
        /** When false, only fail messages will be displayed. */
        this.enabled = true;
        _Spinner_isTTY.set(this, (0, tty_1.isTTY)());
        this.spinner = (0, ora_1.default)({
            text,
            // The below 2 options are needed because otherwise CTRL+C will be delayed
            // when the underlying process is sync.
            hideCursor: false,
            discardStdin: false,
            isEnabled: __classPrivateFieldGet(this, _Spinner_isTTY, "f"),
        });
    }
    set text(text) {
        this.spinner.text = text;
    }
    get isSpinning() {
        return this.spinner.isSpinning || !__classPrivateFieldGet(this, _Spinner_isTTY, "f");
    }
    succeed(text) {
        if (this.enabled) {
            this.spinner.succeed(text);
        }
    }
    fail(text) {
        this.spinner.fail(text && color_1.colors.redBright(text));
    }
    stop() {
        this.spinner.stop();
    }
    start(text) {
        if (this.enabled) {
            this.spinner.start(text);
        }
    }
}
exports.Spinner = Spinner;
_Spinner_isTTY = new WeakMap();
