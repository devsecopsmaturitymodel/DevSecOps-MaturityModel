import { MessageId, MessageMetadata, ParsedMessage, TargetMessage } from './messages';
/**
 * A translation message that has been processed to extract the message parts and placeholders.
 */
export interface ParsedTranslation extends MessageMetadata {
    messageParts: TemplateStringsArray;
    placeholderNames: string[];
}
/**
 * The internal structure used by the runtime localization to translate messages.
 */
export declare type ParsedTranslations = Record<MessageId, ParsedTranslation>;
export declare class MissingTranslationError extends Error {
    readonly parsedMessage: ParsedMessage;
    private readonly type;
    constructor(parsedMessage: ParsedMessage);
}
export declare function isMissingTranslationError(e: any): e is MissingTranslationError;
/**
 * Translate the text of the `$localize` tagged-string (i.e. `messageParts` and
 * `substitutions`) using the given `translations`.
 *
 * The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
 * `ParsedTranslation`. If this doesn't match and there are legacy ids then try matching a
 * translation using those.
 *
 * If one is found then it is used to translate the message into a new set of `messageParts` and
 * `substitutions`.
 * The translation may reorder (or remove) substitutions as appropriate.
 *
 * If there is no translation with a matching message id then an error is thrown.
 * If a translation contains a placeholder that is not found in the message being translated then an
 * error is thrown.
 */
export declare function translate(translations: Record<string, ParsedTranslation>, messageParts: TemplateStringsArray, substitutions: readonly any[]): [TemplateStringsArray, readonly any[]];
/**
 * Parse the `messageParts` and `placeholderNames` out of a target `message`.
 *
 * Used by `loadTranslations()` to convert target message strings into a structure that is more
 * appropriate for doing translation.
 *
 * @param message the message to be parsed.
 */
export declare function parseTranslation(messageString: TargetMessage): ParsedTranslation;
/**
 * Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.
 *
 * @param messageParts The message parts to appear in the ParsedTranslation.
 * @param placeholderNames The names of the placeholders to intersperse between the `messageParts`.
 */
export declare function makeParsedTranslation(messageParts: string[], placeholderNames?: string[]): ParsedTranslation;
/**
 * Create the specialized array that is passed to tagged-string tag functions.
 *
 * @param cooked The message parts with their escape codes processed.
 * @param raw The message parts with their escaped codes as-is.
 */
export declare function makeTemplateObject(cooked: string[], raw: string[]): TemplateStringsArray;
