/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />
import { BaseException } from '@angular-devkit/core';
import MagicString from 'magic-string';
import { LinkedList } from './linked-list';
export declare class IndexOutOfBoundException extends BaseException {
    constructor(index: number, min: number, max?: number);
}
/** @deprecated Since v13.0 */
export declare class ContentCannotBeRemovedException extends BaseException {
    constructor();
}
/**
 * A Chunk description, including left/right content that has been inserted.
 * If _left/_right is null, this means that content was deleted. If the _content is null,
 * it means the content itself was deleted.
 *
 * @see UpdateBuffer
 * @deprecated Since v13.0
 */
export declare class Chunk {
    start: number;
    end: number;
    originalContent: Buffer;
    private _content;
    private _left;
    private _right;
    private _assertLeft;
    private _assertRight;
    next: Chunk | null;
    constructor(start: number, end: number, originalContent: Buffer);
    get length(): number;
    toString(encoding?: BufferEncoding): string;
    slice(start: number): Chunk;
    append(buffer: Buffer, essential: boolean): void;
    prepend(buffer: Buffer, essential: boolean): void;
    assert(left: boolean, _content: boolean, right: boolean): void;
    remove(left: boolean, content: boolean, right: boolean): void;
    copy(target: Buffer, start: number): number;
}
/**
 * Base class for an update buffer implementation that allows buffers to be inserted to the _right
 * or _left, or deleted, while keeping indices to the original buffer.
 */
export declare abstract class UpdateBufferBase {
    protected _originalContent: Buffer;
    constructor(_originalContent: Buffer);
    abstract get length(): number;
    abstract get original(): Buffer;
    abstract toString(encoding?: string): string;
    abstract generate(): Buffer;
    abstract insertLeft(index: number, content: Buffer, assert?: boolean): void;
    abstract insertRight(index: number, content: Buffer, assert?: boolean): void;
    abstract remove(index: number, length: number): void;
    /**
     * Creates an UpdateBufferBase instance. Depending on the NG_UPDATE_BUFFER_V2
     * environment variable, will either create an UpdateBuffer or an UpdateBuffer2
     * instance.
     *
     * See: https://github.com/angular/angular-cli/issues/21110
     *
     * @param originalContent The original content of the update buffer instance.
     * @returns An UpdateBufferBase instance.
     */
    static create(originalContent: Buffer): UpdateBufferBase;
}
/**
 * An utility class that allows buffers to be inserted to the _right or _left, or deleted, while
 * keeping indices to the original buffer.
 *
 * The constructor takes an original buffer, and keeps it into a linked list of chunks, smaller
 * buffers that keep track of _content inserted to the _right or _left of it.
 *
 * Since the Node Buffer structure is non-destructive when slicing, we try to use slicing to create
 * new chunks, and always keep chunks pointing to the original content.
 *
 * @deprecated Since v13.0
 */
export declare class UpdateBuffer extends UpdateBufferBase {
    protected _linkedList: LinkedList<Chunk>;
    constructor(originalContent: Buffer);
    protected _assertIndex(index: number): void;
    protected _slice(start: number): [Chunk, Chunk];
    /**
     * Gets the position in the content based on the position in the string.
     * Some characters might be wider than one byte, thus we have to determine the position using
     * string functions.
     */
    protected _getTextPosition(index: number): number;
    get length(): number;
    get original(): Buffer;
    toString(encoding?: BufferEncoding): string;
    generate(): Buffer;
    insertLeft(index: number, content: Buffer, assert?: boolean): void;
    insertRight(index: number, content: Buffer, assert?: boolean): void;
    remove(index: number, length: number): void;
}
/**
 * An utility class that allows buffers to be inserted to the _right or _left, or deleted, while
 * keeping indices to the original buffer.
 */
export declare class UpdateBuffer2 extends UpdateBufferBase {
    protected _mutatableContent: MagicString;
    protected _assertIndex(index: number): void;
    get length(): number;
    get original(): Buffer;
    toString(): string;
    generate(): Buffer;
    insertLeft(index: number, content: Buffer): void;
    insertRight(index: number, content: Buffer): void;
    remove(index: number, length: number): void;
}
