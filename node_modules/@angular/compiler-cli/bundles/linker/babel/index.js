
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  ConsoleLogger,
  LogLevel
} from "../../chunk-7J66ZDC5.js";
import {
  FatalLinkerError,
  FileLinker,
  LinkerEnvironment,
  assert,
  isFatalLinkerError
} from "../../chunk-I7KXATBQ.js";
import "../../chunk-5YNM7UVV.js";
import "../../chunk-HJ5BXSPS.js";
import {
  NodeJSFileSystem
} from "../../chunk-MMRSE3VM.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "../../chunk-GMSUYBZP.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/src/babel_core.mjs
import * as _babelNamespace from "@babel/core";
import _babelDefault from "@babel/core";
var _a;
var babel = (_a = _babelDefault) != null ? _a : _babelNamespace;
var _typesNamespace = _babelNamespace.types;
if (_babelDefault !== void 0) {
  _typesNamespace = _babelDefault.types;
}
var types2 = _typesNamespace;
var NodePath = babel.NodePath;
var transformSync = babel.transformSync;
var parse = babel.parse;

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/src/ast/babel_ast_factory.mjs
var BabelAstFactory = class {
  constructor(sourceUrl) {
    this.sourceUrl = sourceUrl;
    this.createArrayLiteral = types2.arrayExpression;
    this.createBlock = types2.blockStatement;
    this.createConditional = types2.conditionalExpression;
    this.createExpressionStatement = types2.expressionStatement;
    this.createIdentifier = types2.identifier;
    this.createIfStatement = types2.ifStatement;
    this.createNewExpression = types2.newExpression;
    this.createParenthesizedExpression = types2.parenthesizedExpression;
    this.createReturnStatement = types2.returnStatement;
    this.createThrowStatement = types2.throwStatement;
    this.createUnaryExpression = types2.unaryExpression;
  }
  attachComments(statement, leadingComments) {
    for (let i = leadingComments.length - 1; i >= 0; i--) {
      const comment = leadingComments[i];
      types2.addComment(statement, "leading", comment.toString(), !comment.multiline);
    }
  }
  createAssignment(target, value) {
    assert(target, isLExpression, "must be a left hand side expression");
    return types2.assignmentExpression("=", target, value);
  }
  createBinaryExpression(leftOperand, operator, rightOperand) {
    switch (operator) {
      case "&&":
      case "||":
      case "??":
        return types2.logicalExpression(operator, leftOperand, rightOperand);
      default:
        return types2.binaryExpression(operator, leftOperand, rightOperand);
    }
  }
  createCallExpression(callee, args, pure) {
    const call = types2.callExpression(callee, args);
    if (pure) {
      types2.addComment(call, "leading", " @__PURE__ ", false);
    }
    return call;
  }
  createElementAccess(expression, element) {
    return types2.memberExpression(expression, element, true);
  }
  createFunctionDeclaration(functionName, parameters, body) {
    assert(body, types2.isBlockStatement, "a block");
    return types2.functionDeclaration(types2.identifier(functionName), parameters.map((param) => types2.identifier(param)), body);
  }
  createFunctionExpression(functionName, parameters, body) {
    assert(body, types2.isBlockStatement, "a block");
    const name = functionName !== null ? types2.identifier(functionName) : null;
    return types2.functionExpression(name, parameters.map((param) => types2.identifier(param)), body);
  }
  createLiteral(value) {
    if (typeof value === "string") {
      return types2.stringLiteral(value);
    } else if (typeof value === "number") {
      return types2.numericLiteral(value);
    } else if (typeof value === "boolean") {
      return types2.booleanLiteral(value);
    } else if (value === void 0) {
      return types2.identifier("undefined");
    } else if (value === null) {
      return types2.nullLiteral();
    } else {
      throw new Error(`Invalid literal: ${value} (${typeof value})`);
    }
  }
  createObjectLiteral(properties) {
    return types2.objectExpression(properties.map((prop) => {
      const key = prop.quoted ? types2.stringLiteral(prop.propertyName) : types2.identifier(prop.propertyName);
      return types2.objectProperty(key, prop.value);
    }));
  }
  createPropertyAccess(expression, propertyName) {
    return types2.memberExpression(expression, types2.identifier(propertyName), false);
  }
  createTaggedTemplate(tag, template) {
    const elements = template.elements.map((element, i) => this.setSourceMapRange(types2.templateElement(element, i === template.elements.length - 1), element.range));
    return types2.taggedTemplateExpression(tag, types2.templateLiteral(elements, template.expressions));
  }
  createTypeOfExpression(expression) {
    return types2.unaryExpression("typeof", expression);
  }
  createVariableDeclaration(variableName, initializer, type) {
    return types2.variableDeclaration(type, [types2.variableDeclarator(types2.identifier(variableName), initializer)]);
  }
  setSourceMapRange(node, sourceMapRange) {
    if (sourceMapRange === null) {
      return node;
    }
    node.loc = {
      filename: sourceMapRange.url !== this.sourceUrl ? sourceMapRange.url : void 0,
      start: {
        line: sourceMapRange.start.line + 1,
        column: sourceMapRange.start.column
      },
      end: {
        line: sourceMapRange.end.line + 1,
        column: sourceMapRange.end.column
      }
    };
    node.start = sourceMapRange.start.offset;
    node.end = sourceMapRange.end.offset;
    return node;
  }
};
function isLExpression(expr) {
  return types2.isLVal(expr);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/src/ast/babel_ast_host.mjs
var BabelAstHost = class {
  constructor() {
    this.isStringLiteral = types2.isStringLiteral;
    this.isNumericLiteral = types2.isNumericLiteral;
    this.isArrayLiteral = types2.isArrayExpression;
    this.isObjectLiteral = types2.isObjectExpression;
    this.isCallExpression = types2.isCallExpression;
  }
  getSymbolName(node) {
    if (types2.isIdentifier(node)) {
      return node.name;
    } else if (types2.isMemberExpression(node) && types2.isIdentifier(node.property)) {
      return node.property.name;
    } else {
      return null;
    }
  }
  parseStringLiteral(str) {
    assert(str, types2.isStringLiteral, "a string literal");
    return str.value;
  }
  parseNumericLiteral(num) {
    assert(num, types2.isNumericLiteral, "a numeric literal");
    return num.value;
  }
  isBooleanLiteral(bool) {
    return types2.isBooleanLiteral(bool) || isMinifiedBooleanLiteral(bool);
  }
  parseBooleanLiteral(bool) {
    if (types2.isBooleanLiteral(bool)) {
      return bool.value;
    } else if (isMinifiedBooleanLiteral(bool)) {
      return !bool.argument.value;
    } else {
      throw new FatalLinkerError(bool, "Unsupported syntax, expected a boolean literal.");
    }
  }
  parseArrayLiteral(array) {
    assert(array, types2.isArrayExpression, "an array literal");
    return array.elements.map((element) => {
      assert(element, isNotEmptyElement, "element in array not to be empty");
      assert(element, isNotSpreadElement, "element in array not to use spread syntax");
      return element;
    });
  }
  parseObjectLiteral(obj) {
    assert(obj, types2.isObjectExpression, "an object literal");
    const result = /* @__PURE__ */ new Map();
    for (const property of obj.properties) {
      assert(property, types2.isObjectProperty, "a property assignment");
      assert(property.value, types2.isExpression, "an expression");
      assert(property.key, isPropertyName, "a property name");
      const key = types2.isIdentifier(property.key) ? property.key.name : property.key.value;
      result.set(`${key}`, property.value);
    }
    return result;
  }
  isFunctionExpression(node) {
    return types2.isFunction(node);
  }
  parseReturnValue(fn) {
    assert(fn, this.isFunctionExpression, "a function");
    if (!types2.isBlockStatement(fn.body)) {
      return fn.body;
    }
    if (fn.body.body.length !== 1) {
      throw new FatalLinkerError(fn.body, "Unsupported syntax, expected a function body with a single return statement.");
    }
    const stmt = fn.body.body[0];
    assert(stmt, types2.isReturnStatement, "a function body with a single return statement");
    if (stmt.argument === null || stmt.argument === void 0) {
      throw new FatalLinkerError(stmt, "Unsupported syntax, expected function to return a value.");
    }
    return stmt.argument;
  }
  parseCallee(call) {
    assert(call, types2.isCallExpression, "a call expression");
    assert(call.callee, types2.isExpression, "an expression");
    return call.callee;
  }
  parseArguments(call) {
    assert(call, types2.isCallExpression, "a call expression");
    return call.arguments.map((arg) => {
      assert(arg, isNotSpreadArgument, "argument not to use spread syntax");
      assert(arg, types2.isExpression, "argument to be an expression");
      return arg;
    });
  }
  getRange(node) {
    if (node.loc == null || node.start === null || node.end === null) {
      throw new FatalLinkerError(node, "Unable to read range for node - it is missing location information.");
    }
    return {
      startLine: node.loc.start.line - 1,
      startCol: node.loc.start.column,
      startPos: node.start,
      endPos: node.end
    };
  }
};
function isNotEmptyElement(e) {
  return e !== null;
}
function isNotSpreadElement(e) {
  return !types2.isSpreadElement(e);
}
function isPropertyName(e) {
  return types2.isIdentifier(e) || types2.isStringLiteral(e) || types2.isNumericLiteral(e);
}
function isNotSpreadArgument(arg) {
  return !types2.isSpreadElement(arg);
}
function isMinifiedBooleanLiteral(node) {
  return types2.isUnaryExpression(node) && node.prefix && node.operator === "!" && types2.isNumericLiteral(node.argument) && (node.argument.value === 0 || node.argument.value === 1);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/src/babel_declaration_scope.mjs
var BabelDeclarationScope = class {
  constructor(declarationScope) {
    this.declarationScope = declarationScope;
  }
  getConstantScopeRef(expression) {
    let bindingExpression = expression;
    while (types2.isMemberExpression(bindingExpression)) {
      bindingExpression = bindingExpression.object;
    }
    if (!types2.isIdentifier(bindingExpression)) {
      return null;
    }
    const binding = this.declarationScope.getBinding(bindingExpression.name);
    if (binding === void 0) {
      return null;
    }
    const path = binding.scope.path;
    if (!path.isFunctionDeclaration() && !path.isFunctionExpression() && !(path.isProgram() && path.node.sourceType === "module")) {
      return null;
    }
    return path;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/src/es2015_linker_plugin.mjs
function createEs2015LinkerPlugin(_a2) {
  var _b = _a2, { fileSystem, logger } = _b, options = __objRest(_b, ["fileSystem", "logger"]);
  let fileLinker = null;
  return {
    visitor: {
      Program: {
        enter(path) {
          var _a3, _b2;
          assertNull(fileLinker);
          const file = path.hub.file;
          const filename = (_a3 = file.opts.filename) != null ? _a3 : file.opts.filenameRelative;
          if (!filename) {
            throw new Error("No filename (nor filenameRelative) provided by Babel. This is required for the linking of partially compiled directives and components.");
          }
          const sourceUrl = fileSystem.resolve((_b2 = file.opts.cwd) != null ? _b2 : ".", filename);
          const linkerEnvironment = LinkerEnvironment.create(fileSystem, logger, new BabelAstHost(), new BabelAstFactory(sourceUrl), options);
          fileLinker = new FileLinker(linkerEnvironment, sourceUrl, file.code);
        },
        exit() {
          assertNotNull(fileLinker);
          for (const { constantScope, statements } of fileLinker.getConstantStatements()) {
            insertStatements(constantScope, statements);
          }
          fileLinker = null;
        }
      },
      CallExpression(call) {
        if (fileLinker === null) {
          return;
        }
        try {
          const calleeName = getCalleeName(call);
          if (calleeName === null) {
            return;
          }
          const args = call.node.arguments;
          if (!fileLinker.isPartialDeclaration(calleeName) || !isExpressionArray(args)) {
            return;
          }
          const declarationScope = new BabelDeclarationScope(call.scope);
          const replacement = fileLinker.linkPartialDeclaration(calleeName, args, declarationScope);
          call.replaceWith(replacement);
        } catch (e) {
          const node = isFatalLinkerError(e) ? e.node : call.node;
          throw buildCodeFrameError(call.hub.file, e.message, node);
        }
      }
    }
  };
}
function insertStatements(path, statements) {
  if (path.isProgram()) {
    insertIntoProgram(path, statements);
  } else {
    insertIntoFunction(path, statements);
  }
}
function insertIntoFunction(fn, statements) {
  const body = fn.get("body");
  body.unshiftContainer("body", statements);
}
function insertIntoProgram(program, statements) {
  const body = program.get("body");
  const importStatements = body.filter((statement) => statement.isImportDeclaration());
  if (importStatements.length === 0) {
    program.unshiftContainer("body", statements);
  } else {
    importStatements[importStatements.length - 1].insertAfter(statements);
  }
}
function getCalleeName(call) {
  const callee = call.node.callee;
  if (types2.isIdentifier(callee)) {
    return callee.name;
  } else if (types2.isMemberExpression(callee) && types2.isIdentifier(callee.property)) {
    return callee.property.name;
  } else if (types2.isMemberExpression(callee) && types2.isStringLiteral(callee.property)) {
    return callee.property.value;
  } else {
    return null;
  }
}
function isExpressionArray(nodes) {
  return nodes.every((node) => types2.isExpression(node));
}
function assertNull(obj) {
  if (obj !== null) {
    throw new Error("BUG - expected `obj` to be null");
  }
}
function assertNotNull(obj) {
  if (obj === null) {
    throw new Error("BUG - expected `obj` not to be null");
  }
}
function buildCodeFrameError(file, message, node) {
  const filename = file.opts.filename || "(unknown file)";
  const error = file.buildCodeFrameError(node, message);
  return `${filename}: ${error.message}`;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/src/babel_plugin.mjs
function defaultLinkerPlugin(api, options) {
  api.assertVersion(7);
  return createEs2015LinkerPlugin(__spreadProps(__spreadValues({}, options), {
    fileSystem: new NodeJSFileSystem(),
    logger: new ConsoleLogger(LogLevel.info)
  }));
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/linker/babel/index.mjs
var babel_default = defaultLinkerPlugin;
export {
  createEs2015LinkerPlugin,
  babel_default as default
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=index.js.map
