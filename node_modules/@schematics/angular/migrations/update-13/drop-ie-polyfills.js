"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const assert_1 = __importDefault(require("assert"));
const ts = __importStar(require("../../third_party/github.com/Microsoft/TypeScript/lib/typescript"));
const dependencies_1 = require("../../utility/dependencies");
const workspace_1 = require("../../utility/workspace");
/**
 * Migrates all polyfills files of projects to remove two dependencies originally needed by Internet
 * Explorer, but which are no longer needed now that support for IE has been dropped (`classlist.js`
 * and `web-animations-js`).
 *
 * The polyfills file includes side-effectful imports of these dependencies with comments about
 * their usage:
 *
 * ```
 * /**
 *  * IE11 requires the following for NgClass support on SVG elements
 *  *\/
 * import 'classlist.js';
 *
 * /**
 *  * Web Animations `@angular/platform-browser/animations`
 *  * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 *  * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 *  *\/
 * import 'web-animations-js';
 * ```
 *
 * This migration removes the `import` statements as well as any preceeding comments. It also
 * removes these dependencies from `package.json` if present and schedules an `npm install` task to
 * remove them from `node_modules/`.
 *
 * Also, the polyfills file has previously been generated with these imports commented out, to not
 * include the dependencies by default, but still allow users to easily uncomment and enable them
 * when required. So the migration also looks for:
 *
 * ```
 * // import 'classlist.js';  // Run `npm install --save classlist.js`.
 * // OR
 * // import 'web-animations-js';  // Run `npm install --save web-animations-js`.
 * ```
 *
 * And removes them as well. This keeps the polyfills files clean and up to date. Whitespace is
 * handled by leaving all trailing whitespace alone, and deleting all the leading newlines until the
 * previous non-empty line of code. This means any extra lines before a removed polyfill is dropped,
 * while any extra lines after a polyfill are retained. This roughly correlates to how a real
 * developer might write such a file.
 */
function default_1() {
    return async (tree, ctx) => {
        const modulesToDrop = new Set(['classlist.js', 'web-animations-js']);
        // Remove modules from `package.json` dependencies.
        const moduleDeps = Array.from(modulesToDrop.values())
            .map((module) => (0, dependencies_1.getPackageJsonDependency)(tree, module))
            .filter((dep) => !!dep);
        for (const { name } of moduleDeps) {
            (0, dependencies_1.removePackageJsonDependency)(tree, name);
        }
        // Run `npm install` after removal. This isn't strictly necessary, as keeping the dependencies
        // in `node_modules/` doesn't break anything. however non-polyfill usages of these dependencies
        // will work while they are in `node_modules/` but then break on the next `npm install`. If any
        // such usages exist, it is better for them to fail immediately after the migration instead of
        // the next time the user happens to `npm install`. As an optimization, only run `npm install`
        // if a dependency was actually removed.
        if (moduleDeps.length > 0) {
            ctx.addTask(new tasks_1.NodePackageInstallTask());
        }
        // Find all the polyfill files in the workspace.
        const wksp = await (0, workspace_1.getWorkspace)(tree);
        const polyfills = Array.from((0, workspace_1.allWorkspaceTargets)(wksp))
            .filter(([_, target]) => { var _a; return !!((_a = target.options) === null || _a === void 0 ? void 0 : _a.polyfills); })
            .map(([_, target]) => { var _a; return (_a = target.options) === null || _a === void 0 ? void 0 : _a.polyfills; });
        const uniquePolyfills = Array.from(new Set(polyfills));
        // Drop the modules from each polyfill.
        return (0, schematics_1.chain)(uniquePolyfills.map((polyfillPath) => dropModules(polyfillPath, modulesToDrop)));
    };
}
exports.default = default_1;
/** Processes the given polyfill path and removes any `import` statements for the given modules. */
function dropModules(polyfillPath, modules) {
    return (tree, ctx) => {
        const sourceContent = tree.read(polyfillPath);
        if (!sourceContent) {
            ctx.logger.warn('Polyfill path from workspace configuration could not be read, does the file exist?', { polyfillPath });
            return;
        }
        const content = sourceContent.toString('utf8');
        const sourceFile = ts.createSourceFile(polyfillPath, content.replace(/^\uFEFF/, ''), ts.ScriptTarget.Latest, true /* setParentNodes */);
        // Remove polyfills for the given module specifiers.
        const recorder = tree.beginUpdate(polyfillPath);
        removePolyfillImports(recorder, sourceFile, modules);
        removePolyfillImportComments(recorder, sourceFile, modules);
        tree.commitUpdate(recorder);
        return tree;
    };
}
/**
 * Searches the source file for any `import '${module}';` statements and removes them along with
 * any preceeding comments.
 *
 * @param recorder The recorder to remove from.
 * @param sourceFile The source file containing the `import` statements.
 * @param modules The module specifiers to remove.
 */
function removePolyfillImports(recorder, sourceFile, modules) {
    const imports = sourceFile.statements.filter((stmt) => ts.isImportDeclaration(stmt));
    for (const i of imports) {
        // Should always be a string literal.
        (0, assert_1.default)(ts.isStringLiteral(i.moduleSpecifier));
        // Ignore other modules.
        if (!modules.has(i.moduleSpecifier.text)) {
            continue;
        }
        // Remove the module import statement.
        recorder.remove(i.getStart(), i.getWidth());
        // Remove leading comments. "Leading" comments seems to include comments within the node, so
        // even though `getFullText()` returns an index before any leading comments to a node, it will
        // still find and process them.
        ts.forEachLeadingCommentRange(sourceFile.getFullText(), i.getFullStart(), (start, end, _, hasTrailingNewLine) => {
            // Include both leading **and** trailing newlines because these are comments that *preceed*
            // the `import` statement, so "trailing" newlines here are actually in-between the `import`
            // and it's leading comments.
            const commentRangeWithoutNewLines = { start, end };
            const commentRangeWithTrailingNewLines = hasTrailingNewLine
                ? includeTrailingNewLine(sourceFile, commentRangeWithoutNewLines)
                : commentRangeWithoutNewLines;
            const commentRange = includeLeadingNewLines(sourceFile, commentRangeWithTrailingNewLines);
            if (!isProtectedComment(sourceFile, commentRange)) {
                recorder.remove(commentRange.start, commentRange.end - commentRange.start);
            }
        });
    }
}
/**
 * Searches the source file for any `// import '${module}';` comments and removes them along with
 * any preceeding comments.
 *
 * Recent `ng new` invocations generate polyfills commented out and not used by default. Ex:
 * /**
 *  * IE11 requires the following for NgClass support on SVG elements
 *  *\/
 * // import 'classlist.js';  // Run `npm install --save classlist.js`.
 *
 * This function identifies any commented out import statements for the given module specifiers and
 * removes them along with immediately preceeding comments.
 *
 * @param recorder The recorder to remove from.
 * @param sourceFile The source file containing the commented `import` statements.
 * @param modules The module specifiers to remove.
 */
function removePolyfillImportComments(recorder, sourceFile, modules) {
    // Find all comment ranges in the source file.
    const commentRanges = getCommentRanges(sourceFile);
    // Find the indexes of comments which contain `import` statements for the given modules.
    const moduleImportCommentIndexes = filterIndex(commentRanges, ({ start, end }) => {
        const comment = getCommentText(sourceFile.getFullText().slice(start, end));
        return Array.from(modules.values()).some((module) => comment.startsWith(`import '${module}';`));
    });
    // Use the module import comment **and** it's preceding comment if present.
    const commentIndexesToRemove = moduleImportCommentIndexes.flatMap((index) => {
        if (index === 0) {
            return [0];
        }
        else {
            return [index - 1, index];
        }
    });
    // Get all the ranges for the comments to remove.
    const commentRangesToRemove = commentIndexesToRemove
        .map((index) => commentRanges[index])
        // Include leading newlines but **not** trailing newlines in order to leave appropriate space
        // between any remaining polyfills.
        .map((range) => includeLeadingNewLines(sourceFile, range))
        .filter((range) => !isProtectedComment(sourceFile, range));
    // Remove the comments.
    for (const { start, end } of commentRangesToRemove) {
        recorder.remove(start, end - start);
    }
}
/**
 * Returns whether a comment range is "protected", meaning it should **not** be deleted.
 *
 * There are two comments which are considered "protected":
 * 1. The file overview doc comment previously generated by `ng new`.
 * 2. The browser polyfills header (/***** BROWSER POLYFILLS *\/).
 */
function isProtectedComment(sourceFile, { start, end }) {
    const comment = getCommentText(sourceFile.getFullText().slice(start, end));
    const isFileOverviewDocComment = comment.startsWith('This file includes polyfills needed by Angular and is loaded before the app.');
    const isBrowserPolyfillsHeader = comment.startsWith('BROWSER POLYFILLS');
    return isFileOverviewDocComment || isBrowserPolyfillsHeader;
}
/** Returns all the comments in the given source file. */
function getCommentRanges(sourceFile) {
    const commentRanges = [];
    // Comments trailing the last node are also included in this.
    ts.forEachChild(sourceFile, (node) => {
        ts.forEachLeadingCommentRange(sourceFile.getFullText(), node.getFullStart(), (start, end) => {
            commentRanges.push({ start, end });
        });
    });
    return commentRanges;
}
/** Returns a `SourceRange` with any leading newlines' characters included if present. */
function includeLeadingNewLines(sourceFile, { start, end }) {
    const text = sourceFile.getFullText();
    while (start > 0) {
        if (start > 2 && text.slice(start - 2, start) === '\r\n') {
            // Preceeded by `\r\n`, include that.
            start -= 2;
        }
        else if (start > 1 && text[start - 1] === '\n') {
            // Preceeded by `\n`, include that.
            start--;
        }
        else {
            // Not preceeded by any newline characters, don't include anything else.
            break;
        }
    }
    return { start, end };
}
/** Returns a `SourceRange` with the trailing newline characters included if present. */
function includeTrailingNewLine(sourceFile, { start, end }) {
    const newline = sourceFile.getFullText().slice(end, end + 2);
    if (newline === '\r\n') {
        return { start, end: end + 2 };
    }
    else if (newline.startsWith('\n')) {
        return { start, end: end + 1 };
    }
    else {
        throw new Error('Expected comment to end in a newline character (either `\\n` or `\\r\\n`).');
    }
}
/**
 * Extracts the text from a comment. Attempts to remove any extraneous syntax and trims the content.
 */
function getCommentText(commentInput) {
    const comment = commentInput.trim();
    if (comment.startsWith('//')) {
        return comment.slice('//'.length).trim();
    }
    else if (comment.startsWith('/*')) {
        const withoutPrefix = comment.replace(/\/\*+/, '');
        const withoutSuffix = withoutPrefix.replace(/\*+\//, '');
        const withoutNewlineAsterisks = withoutSuffix.replace(/^\s*\*\s*/, '');
        return withoutNewlineAsterisks.trim();
    }
    else {
        throw new Error(`Expected a comment, but got: "${comment}".`);
    }
}
/** Like `Array.prototype.filter`, but returns the index of each item rather than its value. */
function filterIndex(items, filter) {
    return Array.from(items.entries())
        .filter(([_, item]) => filter(item))
        .map(([index]) => index);
}
