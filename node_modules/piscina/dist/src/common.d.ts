/// <reference types="node" />
import type { MessagePort } from 'worker_threads';
export interface StartupMessage {
    filename: string | null;
    name: string;
    port: MessagePort;
    sharedBuffer: Int32Array;
    useAtomics: boolean;
    niceIncrement: number;
}
export interface RequestMessage {
    taskId: number;
    task: any;
    filename: string;
    name: string;
}
export interface ReadyMessage {
    ready: true;
}
export interface ResponseMessage {
    taskId: number;
    result: any;
    error: Error | null;
}
export declare const commonState: {
    isWorkerThread: boolean;
    workerData: undefined;
};
export declare const kTransferable: unique symbol;
export declare const kValue: unique symbol;
export declare const kQueueOptions: unique symbol;
export declare function isTransferable(value: any): boolean;
export declare function isMovable(value: any): boolean;
export declare function markMovable(value: object): void;
export interface Transferable {
    readonly [kTransferable]: object;
    readonly [kValue]: object;
}
export interface Task {
    readonly [kQueueOptions]: object | null;
}
export interface TaskQueue {
    readonly size: number;
    shift(): Task | null;
    remove(task: Task): void;
    push(task: Task): void;
}
export declare function isTaskQueue(value: any): boolean;
export declare const kRequestCountField = 0;
export declare const kResponseCountField = 1;
export declare const kFieldCount = 2;
