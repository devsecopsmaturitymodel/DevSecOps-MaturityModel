/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
declare global {
    interface WorkerGlobalScope extends EventTarget, WindowOrWorkerGlobalScope {
    }
    var WorkerGlobalScope: {
        prototype: WorkerGlobalScope;
        new (): WorkerGlobalScope;
    };
}
export declare const _global: any;
