/// <amd-module name="@angular/localize/tools/src/translate/translation_files/message_serialization/message_serializer" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Element, Expansion, ExpansionCase, Node, Text } from '@angular/compiler';
import { BaseVisitor } from '../base_visitor';
import { MessageRenderer } from './message_renderer';
export interface MessageSerializerConfig {
    inlineElements: string[];
    placeholder?: {
        elementName: string;
        nameAttribute: string;
        bodyAttribute?: string;
    };
    placeholderContainer?: {
        elementName: string;
        startAttribute: string;
        endAttribute: string;
    };
}
/**
 * This visitor will walk over a set of XML nodes, which represent an i18n message, and serialize
 * them into a message object of type `T`.
 * The type of the serialized message is controlled by the
 */
export declare class MessageSerializer<T> extends BaseVisitor {
    private renderer;
    private config;
    constructor(renderer: MessageRenderer<T>, config: MessageSerializerConfig);
    serialize(nodes: Node[]): T;
    visitElement(element: Element): void;
    visitText(text: Text): void;
    visitExpansion(expansion: Expansion): void;
    visitExpansionCase(expansionCase: ExpansionCase): void;
    visitContainedNodes(nodes: Node[]): void;
    visitPlaceholder(name: string, body: string | undefined): void;
    visitPlaceholderContainer(startName: string, children: Node[], closeName: string): void;
    private isPlaceholderContainer;
}
