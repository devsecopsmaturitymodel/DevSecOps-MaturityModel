/// <amd-module name="@angular/localize/tools/src/extract/translation_files/utils" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵParsedMessage, ɵSourceLocation } from '@angular/localize';
/**
 * Consolidate messages into groups that have the same id.
 *
 * Messages with the same id are grouped together so that we can quickly deduplicate messages when
 * rendering into translation files.
 *
 * To ensure that messages are rendered in a deterministic order:
 *  - the messages within a group are sorted by location (file path, then start position)
 *  - the groups are sorted by the location of the first message in the group
 *
 * @param messages the messages to consolidate.
 * @param getMessageId a function that will compute the message id of a message.
 * @returns an array of message groups, where each group is an array of messages that have the same
 *     id.
 */
export declare function consolidateMessages(messages: ɵParsedMessage[], getMessageId: (message: ɵParsedMessage) => string): ɵParsedMessage[][];
/**
 * Does the given message have a location property?
 */
export declare function hasLocation(message: ɵParsedMessage): message is ɵParsedMessage & {
    location: ɵSourceLocation;
};
export declare function compareLocations({ location: location1 }: ɵParsedMessage, { location: location2 }: ɵParsedMessage): number;
