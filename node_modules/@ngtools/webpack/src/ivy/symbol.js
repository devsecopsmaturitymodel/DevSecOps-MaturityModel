"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FileEmitterRegistration_fileEmitter, _FileEmitterCollection_registrations;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileEmitterCollection = exports.FileEmitterRegistration = exports.AngularPluginSymbol = void 0;
exports.AngularPluginSymbol = Symbol.for('@ngtools/webpack[angular-compiler]');
class FileEmitterRegistration {
    constructor() {
        _FileEmitterRegistration_fileEmitter.set(this, void 0);
    }
    update(emitter) {
        __classPrivateFieldSet(this, _FileEmitterRegistration_fileEmitter, emitter, "f");
    }
    emit(file) {
        if (!__classPrivateFieldGet(this, _FileEmitterRegistration_fileEmitter, "f")) {
            throw new Error('Emit attempted before Angular Webpack plugin initialization.');
        }
        return __classPrivateFieldGet(this, _FileEmitterRegistration_fileEmitter, "f").call(this, file);
    }
}
exports.FileEmitterRegistration = FileEmitterRegistration;
_FileEmitterRegistration_fileEmitter = new WeakMap();
class FileEmitterCollection {
    constructor() {
        _FileEmitterCollection_registrations.set(this, []);
    }
    register() {
        const registration = new FileEmitterRegistration();
        __classPrivateFieldGet(this, _FileEmitterCollection_registrations, "f").push(registration);
        return registration;
    }
    async emit(file) {
        if (__classPrivateFieldGet(this, _FileEmitterCollection_registrations, "f").length === 1) {
            return __classPrivateFieldGet(this, _FileEmitterCollection_registrations, "f")[0].emit(file);
        }
        for (const registration of __classPrivateFieldGet(this, _FileEmitterCollection_registrations, "f")) {
            const result = await registration.emit(file);
            if (result) {
                return result;
            }
        }
    }
}
exports.FileEmitterCollection = FileEmitterCollection;
_FileEmitterCollection_registrations = new WeakMap();
