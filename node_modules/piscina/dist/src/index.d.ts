/// <reference types="node" />
import { Worker, MessagePort } from 'worker_threads';
import EventEmitterAsyncResource from 'eventemitter-asyncresource';
import { Transferable, TaskQueue } from './common';
interface AbortSignalEventTargetAddOptions {
    once: boolean;
}
interface AbortSignalEventTarget {
    addEventListener: (name: 'abort', listener: () => void, options?: AbortSignalEventTargetAddOptions) => void;
    removeEventListener: (name: 'abort', listener: () => void) => void;
    aborted?: boolean;
}
interface AbortSignalEventEmitter {
    off: (name: 'abort', listener: () => void) => void;
    once: (name: 'abort', listener: () => void) => void;
}
declare type AbortSignalAny = AbortSignalEventTarget | AbortSignalEventEmitter;
declare type ResourceLimits = Worker extends {
    resourceLimits?: infer T;
} ? T : {};
declare type EnvSpecifier = typeof Worker extends {
    new (filename: never, options?: {
        env: infer T;
    }): Worker;
} ? T : never;
interface Options {
    filename?: string | null;
    name?: string;
    minThreads?: number;
    maxThreads?: number;
    idleTimeout?: number;
    maxQueue?: number | 'auto';
    concurrentTasksPerWorker?: number;
    useAtomics?: boolean;
    resourceLimits?: ResourceLimits;
    argv?: string[];
    execArgv?: string[];
    env?: EnvSpecifier;
    workerData?: any;
    taskQueue?: TaskQueue;
    niceIncrement?: number;
    trackUnmanagedFds?: boolean;
}
interface FilledOptions extends Options {
    filename: string | null;
    name: string;
    minThreads: number;
    maxThreads: number;
    idleTimeout: number;
    maxQueue: number;
    concurrentTasksPerWorker: number;
    useAtomics: boolean;
    taskQueue: TaskQueue;
    niceIncrement: number;
}
interface RunOptions {
    transferList?: TransferList;
    filename?: string | null;
    signal?: AbortSignalAny | null;
    name?: string | null;
}
declare type TransferList = MessagePort extends {
    postMessage(value: any, transferList: infer T): any;
} ? T : never;
declare type TransferListItem = TransferList extends (infer T)[] ? T : never;
declare class Piscina extends EventEmitterAsyncResource {
    #private;
    constructor(options?: Options);
    /** @deprecated Use run(task, options) instead **/
    runTask(task: any, transferList?: TransferList, filename?: string, abortSignal?: AbortSignalAny): Promise<any>;
    /** @deprecated Use run(task, options) instead **/
    runTask(task: any, transferList?: TransferList, filename?: AbortSignalAny, abortSignal?: undefined): Promise<any>;
    /** @deprecated Use run(task, options) instead **/
    runTask(task: any, transferList?: string, filename?: AbortSignalAny, abortSignal?: undefined): Promise<any>;
    /** @deprecated Use run(task, options) instead **/
    runTask(task: any, transferList?: AbortSignalAny, filename?: undefined, abortSignal?: undefined): Promise<any>;
    run(task: any, options?: RunOptions): Promise<any>;
    destroy(): Promise<void>;
    get options(): FilledOptions;
    get threads(): Worker[];
    get queueSize(): number;
    get completed(): number;
    get waitTime(): any;
    get runTime(): any;
    get utilization(): number;
    get duration(): number;
    static get isWorkerThread(): boolean;
    static get workerData(): any;
    static get version(): string;
    static get Piscina(): typeof Piscina;
    static move(val: Transferable | TransferListItem | ArrayBufferView | ArrayBuffer | MessagePort): ArrayBuffer | ArrayBufferView | MessagePort | Transferable;
    static get transferableSymbol(): symbol;
    static get valueSymbol(): symbol;
    static get queueOptionsSymbol(): symbol;
}
export = Piscina;
