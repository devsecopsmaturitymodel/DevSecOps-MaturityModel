
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  ClassMemberKind,
  Decorator,
  KnownDeclaration,
  filterToMembersWithDecorator,
  isConcreteDeclaration,
  isNamedClassDeclaration,
  reflectObjectLiteral,
  reflectTypeEntityToDeclaration,
  typeNodeToValueExpr
} from "./chunk-4DFV4CTF.js";
import {
  ErrorCode,
  FatalDiagnosticError,
  ImportFlags,
  ImportManager,
  Reference,
  assertSuccessfulReferenceEmit,
  attachDefaultImportDeclaration,
  createExportSpecifier,
  getDefaultImportDeclaration,
  getSourceFile,
  identifierOfNode,
  isDeclaration,
  makeDiagnostic,
  makeRelatedInformation,
  nodeDebugInfo,
  translateExpression,
  translateStatement,
  translateType
} from "./chunk-HJ5BXSPS.js";
import {
  absoluteFrom,
  absoluteFromSourceFile,
  relative
} from "./chunk-MMRSE3VM.js";
import {
  PerfEvent,
  PerfPhase
} from "./chunk-QK4SXRQA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GMSUYBZP.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/dynamic.mjs
var DynamicValue = class {
  constructor(node, reason, code) {
    this.node = node;
    this.reason = reason;
    this.code = code;
  }
  static fromDynamicInput(node, input) {
    return new DynamicValue(node, input, 0);
  }
  static fromDynamicString(node) {
    return new DynamicValue(node, void 0, 1);
  }
  static fromExternalReference(node, ref) {
    return new DynamicValue(node, ref, 2);
  }
  static fromUnsupportedSyntax(node) {
    return new DynamicValue(node, void 0, 3);
  }
  static fromUnknownIdentifier(node) {
    return new DynamicValue(node, void 0, 4);
  }
  static fromInvalidExpressionType(node, value) {
    return new DynamicValue(node, value, 5);
  }
  static fromComplexFunctionCall(node, fn) {
    return new DynamicValue(node, fn, 6);
  }
  static fromDynamicType(node) {
    return new DynamicValue(node, void 0, 7);
  }
  static fromUnknown(node) {
    return new DynamicValue(node, void 0, 8);
  }
  isFromDynamicInput() {
    return this.code === 0;
  }
  isFromDynamicString() {
    return this.code === 1;
  }
  isFromExternalReference() {
    return this.code === 2;
  }
  isFromUnsupportedSyntax() {
    return this.code === 3;
  }
  isFromUnknownIdentifier() {
    return this.code === 4;
  }
  isFromInvalidExpressionType() {
    return this.code === 5;
  }
  isFromComplexFunctionCall() {
    return this.code === 6;
  }
  isFromDynamicType() {
    return this.code === 7;
  }
  isFromUnknown() {
    return this.code === 8;
  }
  accept(visitor) {
    switch (this.code) {
      case 0:
        return visitor.visitDynamicInput(this);
      case 1:
        return visitor.visitDynamicString(this);
      case 2:
        return visitor.visitExternalReference(this);
      case 3:
        return visitor.visitUnsupportedSyntax(this);
      case 4:
        return visitor.visitUnknownIdentifier(this);
      case 5:
        return visitor.visitInvalidExpressionType(this);
      case 6:
        return visitor.visitComplexFunctionCall(this);
      case 7:
        return visitor.visitDynamicType(this);
      case 8:
        return visitor.visitUnknown(this);
    }
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter.mjs
import ts from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/result.mjs
var ResolvedModule = class {
  constructor(exports, evaluate) {
    this.exports = exports;
    this.evaluate = evaluate;
  }
  getExport(name) {
    if (!this.exports.has(name)) {
      return void 0;
    }
    return this.evaluate(this.exports.get(name));
  }
  getExports() {
    const map = /* @__PURE__ */ new Map();
    this.exports.forEach((decl, name) => {
      map.set(name, this.evaluate(decl));
    });
    return map;
  }
};
var EnumValue = class {
  constructor(enumRef, name, resolved) {
    this.enumRef = enumRef;
    this.name = name;
    this.resolved = resolved;
  }
};
var KnownFn = class {
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/builtin.mjs
var ArraySliceBuiltinFn = class extends KnownFn {
  constructor(lhs) {
    super();
    this.lhs = lhs;
  }
  evaluate(node, args) {
    if (args.length === 0) {
      return this.lhs;
    } else {
      return DynamicValue.fromUnknown(node);
    }
  }
};
var ArrayConcatBuiltinFn = class extends KnownFn {
  constructor(lhs) {
    super();
    this.lhs = lhs;
  }
  evaluate(node, args) {
    const result = [...this.lhs];
    for (const arg of args) {
      if (arg instanceof DynamicValue) {
        result.push(DynamicValue.fromDynamicInput(node, arg));
      } else if (Array.isArray(arg)) {
        result.push(...arg);
      } else {
        result.push(arg);
      }
    }
    return result;
  }
};
var StringConcatBuiltinFn = class extends KnownFn {
  constructor(lhs) {
    super();
    this.lhs = lhs;
  }
  evaluate(node, args) {
    let result = this.lhs;
    for (const arg of args) {
      const resolved = arg instanceof EnumValue ? arg.resolved : arg;
      if (typeof resolved === "string" || typeof resolved === "number" || typeof resolved === "boolean" || resolved == null) {
        result = result.concat(resolved);
      } else {
        return DynamicValue.fromUnknown(node);
      }
    }
    return result;
  }
};
var ObjectAssignBuiltinFn = class extends KnownFn {
  evaluate(node, args) {
    if (args.length === 0) {
      return DynamicValue.fromUnsupportedSyntax(node);
    }
    for (const arg of args) {
      if (arg instanceof DynamicValue) {
        return DynamicValue.fromDynamicInput(node, arg);
      } else if (!(arg instanceof Map)) {
        return DynamicValue.fromUnsupportedSyntax(node);
      }
    }
    const [target, ...sources] = args;
    for (const source of sources) {
      source.forEach((value, key) => target.set(key, value));
    }
    return target;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/ts_helpers.mjs
var AssignHelperFn = class extends ObjectAssignBuiltinFn {
};
var SpreadHelperFn = class extends KnownFn {
  evaluate(node, args) {
    const result = [];
    for (const arg of args) {
      if (arg instanceof DynamicValue) {
        result.push(DynamicValue.fromDynamicInput(node, arg));
      } else if (Array.isArray(arg)) {
        result.push(...arg);
      } else {
        result.push(arg);
      }
    }
    return result;
  }
};
var SpreadArrayHelperFn = class extends KnownFn {
  evaluate(node, args) {
    if (args.length !== 2 && args.length !== 3) {
      return DynamicValue.fromUnknown(node);
    }
    const [to, from] = args;
    if (to instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, to);
    } else if (from instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, from);
    }
    if (!Array.isArray(to)) {
      return DynamicValue.fromInvalidExpressionType(node, to);
    } else if (!Array.isArray(from)) {
      return DynamicValue.fromInvalidExpressionType(node, from);
    }
    return to.concat(from);
  }
};
var ReadHelperFn = class extends KnownFn {
  evaluate(node, args) {
    if (args.length !== 1) {
      return DynamicValue.fromUnknown(node);
    }
    const [value] = args;
    if (value instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, value);
    }
    if (!Array.isArray(value)) {
      return DynamicValue.fromInvalidExpressionType(node, value);
    }
    return value;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/known_declaration.mjs
var jsGlobalObjectValue = /* @__PURE__ */ new Map([["assign", new ObjectAssignBuiltinFn()]]);
var assignTsHelperFn = new AssignHelperFn();
var spreadTsHelperFn = new SpreadHelperFn();
var spreadArrayTsHelperFn = new SpreadArrayHelperFn();
var readTsHelperFn = new ReadHelperFn();
function resolveKnownDeclaration(decl) {
  switch (decl) {
    case KnownDeclaration.JsGlobalObject:
      return jsGlobalObjectValue;
    case KnownDeclaration.TsHelperAssign:
      return assignTsHelperFn;
    case KnownDeclaration.TsHelperSpread:
    case KnownDeclaration.TsHelperSpreadArrays:
      return spreadTsHelperFn;
    case KnownDeclaration.TsHelperSpreadArray:
      return spreadArrayTsHelperFn;
    case KnownDeclaration.TsHelperRead:
      return readTsHelperFn;
    default:
      throw new Error(`Cannot resolve known declaration. Received: ${KnownDeclaration[decl]}.`);
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/interpreter.mjs
function literalBinaryOp(op) {
  return { op, literal: true };
}
function referenceBinaryOp(op) {
  return { op, literal: false };
}
var BINARY_OPERATORS = /* @__PURE__ */ new Map([
  [ts.SyntaxKind.PlusToken, literalBinaryOp((a, b) => a + b)],
  [ts.SyntaxKind.MinusToken, literalBinaryOp((a, b) => a - b)],
  [ts.SyntaxKind.AsteriskToken, literalBinaryOp((a, b) => a * b)],
  [ts.SyntaxKind.SlashToken, literalBinaryOp((a, b) => a / b)],
  [ts.SyntaxKind.PercentToken, literalBinaryOp((a, b) => a % b)],
  [ts.SyntaxKind.AmpersandToken, literalBinaryOp((a, b) => a & b)],
  [ts.SyntaxKind.BarToken, literalBinaryOp((a, b) => a | b)],
  [ts.SyntaxKind.CaretToken, literalBinaryOp((a, b) => a ^ b)],
  [ts.SyntaxKind.LessThanToken, literalBinaryOp((a, b) => a < b)],
  [ts.SyntaxKind.LessThanEqualsToken, literalBinaryOp((a, b) => a <= b)],
  [ts.SyntaxKind.GreaterThanToken, literalBinaryOp((a, b) => a > b)],
  [ts.SyntaxKind.GreaterThanEqualsToken, literalBinaryOp((a, b) => a >= b)],
  [ts.SyntaxKind.EqualsEqualsToken, literalBinaryOp((a, b) => a == b)],
  [ts.SyntaxKind.EqualsEqualsEqualsToken, literalBinaryOp((a, b) => a === b)],
  [ts.SyntaxKind.ExclamationEqualsToken, literalBinaryOp((a, b) => a != b)],
  [ts.SyntaxKind.ExclamationEqualsEqualsToken, literalBinaryOp((a, b) => a !== b)],
  [ts.SyntaxKind.LessThanLessThanToken, literalBinaryOp((a, b) => a << b)],
  [ts.SyntaxKind.GreaterThanGreaterThanToken, literalBinaryOp((a, b) => a >> b)],
  [ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken, literalBinaryOp((a, b) => a >>> b)],
  [ts.SyntaxKind.AsteriskAsteriskToken, literalBinaryOp((a, b) => Math.pow(a, b))],
  [ts.SyntaxKind.AmpersandAmpersandToken, referenceBinaryOp((a, b) => a && b)],
  [ts.SyntaxKind.BarBarToken, referenceBinaryOp((a, b) => a || b)]
]);
var UNARY_OPERATORS = /* @__PURE__ */ new Map([
  [ts.SyntaxKind.TildeToken, (a) => ~a],
  [ts.SyntaxKind.MinusToken, (a) => -a],
  [ts.SyntaxKind.PlusToken, (a) => +a],
  [ts.SyntaxKind.ExclamationToken, (a) => !a]
]);
var StaticInterpreter = class {
  constructor(host, checker, dependencyTracker) {
    this.host = host;
    this.checker = checker;
    this.dependencyTracker = dependencyTracker;
  }
  visit(node, context) {
    return this.visitExpression(node, context);
  }
  visitExpression(node, context) {
    let result;
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    } else if (node.kind === ts.SyntaxKind.NullKeyword) {
      return null;
    } else if (ts.isStringLiteral(node)) {
      return node.text;
    } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    } else if (ts.isTemplateExpression(node)) {
      result = this.visitTemplateExpression(node, context);
    } else if (ts.isNumericLiteral(node)) {
      return parseFloat(node.text);
    } else if (ts.isObjectLiteralExpression(node)) {
      result = this.visitObjectLiteralExpression(node, context);
    } else if (ts.isIdentifier(node)) {
      result = this.visitIdentifier(node, context);
    } else if (ts.isPropertyAccessExpression(node)) {
      result = this.visitPropertyAccessExpression(node, context);
    } else if (ts.isCallExpression(node)) {
      result = this.visitCallExpression(node, context);
    } else if (ts.isConditionalExpression(node)) {
      result = this.visitConditionalExpression(node, context);
    } else if (ts.isPrefixUnaryExpression(node)) {
      result = this.visitPrefixUnaryExpression(node, context);
    } else if (ts.isBinaryExpression(node)) {
      result = this.visitBinaryExpression(node, context);
    } else if (ts.isArrayLiteralExpression(node)) {
      result = this.visitArrayLiteralExpression(node, context);
    } else if (ts.isParenthesizedExpression(node)) {
      result = this.visitParenthesizedExpression(node, context);
    } else if (ts.isElementAccessExpression(node)) {
      result = this.visitElementAccessExpression(node, context);
    } else if (ts.isAsExpression(node)) {
      result = this.visitExpression(node.expression, context);
    } else if (ts.isNonNullExpression(node)) {
      result = this.visitExpression(node.expression, context);
    } else if (this.host.isClass(node)) {
      result = this.visitDeclaration(node, context);
    } else {
      return DynamicValue.fromUnsupportedSyntax(node);
    }
    if (result instanceof DynamicValue && result.node !== node) {
      return DynamicValue.fromDynamicInput(node, result);
    }
    return result;
  }
  visitArrayLiteralExpression(node, context) {
    const array = [];
    for (let i = 0; i < node.elements.length; i++) {
      const element = node.elements[i];
      if (ts.isSpreadElement(element)) {
        array.push(...this.visitSpreadElement(element, context));
      } else {
        array.push(this.visitExpression(element, context));
      }
    }
    return array;
  }
  visitObjectLiteralExpression(node, context) {
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < node.properties.length; i++) {
      const property = node.properties[i];
      if (ts.isPropertyAssignment(property)) {
        const name = this.stringNameFromPropertyName(property.name, context);
        if (name === void 0) {
          return DynamicValue.fromDynamicInput(node, DynamicValue.fromDynamicString(property.name));
        }
        map.set(name, this.visitExpression(property.initializer, context));
      } else if (ts.isShorthandPropertyAssignment(property)) {
        const symbol = this.checker.getShorthandAssignmentValueSymbol(property);
        if (symbol === void 0 || symbol.valueDeclaration === void 0) {
          map.set(property.name.text, DynamicValue.fromUnknown(property));
        } else {
          map.set(property.name.text, this.visitDeclaration(symbol.valueDeclaration, context));
        }
      } else if (ts.isSpreadAssignment(property)) {
        const spread = this.visitExpression(property.expression, context);
        if (spread instanceof DynamicValue) {
          return DynamicValue.fromDynamicInput(node, spread);
        } else if (spread instanceof Map) {
          spread.forEach((value, key) => map.set(key, value));
        } else if (spread instanceof ResolvedModule) {
          spread.getExports().forEach((value, key) => map.set(key, value));
        } else {
          return DynamicValue.fromDynamicInput(node, DynamicValue.fromInvalidExpressionType(property, spread));
        }
      } else {
        return DynamicValue.fromUnknown(node);
      }
    }
    return map;
  }
  visitTemplateExpression(node, context) {
    const pieces = [node.head.text];
    for (let i = 0; i < node.templateSpans.length; i++) {
      const span = node.templateSpans[i];
      const value = literal(this.visit(span.expression, context), () => DynamicValue.fromDynamicString(span.expression));
      if (value instanceof DynamicValue) {
        return DynamicValue.fromDynamicInput(node, value);
      }
      pieces.push(`${value}`, span.literal.text);
    }
    return pieces.join("");
  }
  visitIdentifier(node, context) {
    const decl = this.host.getDeclarationOfIdentifier(node);
    if (decl === null) {
      if (node.originalKeywordKind === ts.SyntaxKind.UndefinedKeyword) {
        return void 0;
      } else {
        if (this.dependencyTracker !== null && this.host.getImportOfIdentifier(node) !== null) {
          this.dependencyTracker.recordDependencyAnalysisFailure(context.originatingFile);
        }
        return DynamicValue.fromUnknownIdentifier(node);
      }
    }
    if (decl.known !== null) {
      return resolveKnownDeclaration(decl.known);
    } else if (isConcreteDeclaration(decl) && decl.identity !== null && decl.identity.kind === 0) {
      return this.getResolvedEnum(decl.node, decl.identity.enumMembers, context);
    }
    const declContext = __spreadValues(__spreadValues({}, context), joinModuleContext(context, node, decl));
    const result = this.visitAmbiguousDeclaration(decl, declContext);
    if (result instanceof Reference) {
      if (!result.synthetic) {
        result.addIdentifier(node);
      }
    } else if (result instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, result);
    }
    return result;
  }
  visitDeclaration(node, context) {
    if (this.dependencyTracker !== null) {
      this.dependencyTracker.addDependency(context.originatingFile, node.getSourceFile());
    }
    if (this.host.isClass(node)) {
      return this.getReference(node, context);
    } else if (ts.isVariableDeclaration(node)) {
      return this.visitVariableDeclaration(node, context);
    } else if (ts.isParameter(node) && context.scope.has(node)) {
      return context.scope.get(node);
    } else if (ts.isExportAssignment(node)) {
      return this.visitExpression(node.expression, context);
    } else if (ts.isEnumDeclaration(node)) {
      return this.visitEnumDeclaration(node, context);
    } else if (ts.isSourceFile(node)) {
      return this.visitSourceFile(node, context);
    } else if (ts.isBindingElement(node)) {
      return this.visitBindingElement(node, context);
    } else {
      return this.getReference(node, context);
    }
  }
  visitVariableDeclaration(node, context) {
    const value = this.host.getVariableValue(node);
    if (value !== null) {
      return this.visitExpression(value, context);
    } else if (isVariableDeclarationDeclared(node)) {
      if (node.type !== void 0) {
        const evaluatedType = this.visitType(node.type, context);
        if (!(evaluatedType instanceof DynamicValue)) {
          return evaluatedType;
        }
      }
      return this.getReference(node, context);
    } else {
      return void 0;
    }
  }
  visitEnumDeclaration(node, context) {
    const enumRef = this.getReference(node, context);
    const map = /* @__PURE__ */ new Map();
    node.members.forEach((member) => {
      const name = this.stringNameFromPropertyName(member.name, context);
      if (name !== void 0) {
        const resolved = member.initializer && this.visit(member.initializer, context);
        map.set(name, new EnumValue(enumRef, name, resolved));
      }
    });
    return map;
  }
  visitElementAccessExpression(node, context) {
    const lhs = this.visitExpression(node.expression, context);
    if (lhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, lhs);
    }
    const rhs = this.visitExpression(node.argumentExpression, context);
    if (rhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, rhs);
    }
    if (typeof rhs !== "string" && typeof rhs !== "number") {
      return DynamicValue.fromInvalidExpressionType(node, rhs);
    }
    return this.accessHelper(node, lhs, rhs, context);
  }
  visitPropertyAccessExpression(node, context) {
    const lhs = this.visitExpression(node.expression, context);
    const rhs = node.name.text;
    if (lhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, lhs);
    }
    return this.accessHelper(node, lhs, rhs, context);
  }
  visitSourceFile(node, context) {
    const declarations = this.host.getExportsOfModule(node);
    if (declarations === null) {
      return DynamicValue.fromUnknown(node);
    }
    return new ResolvedModule(declarations, (decl) => {
      if (decl.known !== null) {
        return resolveKnownDeclaration(decl.known);
      }
      const declContext = __spreadValues(__spreadValues({}, context), joinModuleContext(context, node, decl));
      return this.visitAmbiguousDeclaration(decl, declContext);
    });
  }
  visitAmbiguousDeclaration(decl, declContext) {
    return decl.kind === 1 && decl.implementation !== void 0 && !isDeclaration(decl.implementation) ? this.visitExpression(decl.implementation, declContext) : this.visitDeclaration(decl.node, declContext);
  }
  accessHelper(node, lhs, rhs, context) {
    const strIndex = `${rhs}`;
    if (lhs instanceof Map) {
      if (lhs.has(strIndex)) {
        return lhs.get(strIndex);
      } else {
        return void 0;
      }
    } else if (lhs instanceof ResolvedModule) {
      return lhs.getExport(strIndex);
    } else if (Array.isArray(lhs)) {
      if (rhs === "length") {
        return lhs.length;
      } else if (rhs === "slice") {
        return new ArraySliceBuiltinFn(lhs);
      } else if (rhs === "concat") {
        return new ArrayConcatBuiltinFn(lhs);
      }
      if (typeof rhs !== "number" || !Number.isInteger(rhs)) {
        return DynamicValue.fromInvalidExpressionType(node, rhs);
      }
      return lhs[rhs];
    } else if (typeof lhs === "string" && rhs === "concat") {
      return new StringConcatBuiltinFn(lhs);
    } else if (lhs instanceof Reference) {
      const ref = lhs.node;
      if (this.host.isClass(ref)) {
        const module = owningModule(context, lhs.bestGuessOwningModule);
        let value = void 0;
        const member = this.host.getMembersOfClass(ref).find((member2) => member2.isStatic && member2.name === strIndex);
        if (member !== void 0) {
          if (member.value !== null) {
            value = this.visitExpression(member.value, context);
          } else if (member.implementation !== null) {
            value = new Reference(member.implementation, module);
          } else if (member.node) {
            value = new Reference(member.node, module);
          }
        }
        return value;
      } else if (isDeclaration(ref)) {
        return DynamicValue.fromDynamicInput(node, DynamicValue.fromExternalReference(ref, lhs));
      }
    } else if (lhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, lhs);
    }
    return DynamicValue.fromUnknown(node);
  }
  visitCallExpression(node, context) {
    const lhs = this.visitExpression(node.expression, context);
    if (lhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, lhs);
    }
    if (lhs instanceof KnownFn) {
      return lhs.evaluate(node, this.evaluateFunctionArguments(node, context));
    }
    if (!(lhs instanceof Reference)) {
      return DynamicValue.fromInvalidExpressionType(node.expression, lhs);
    }
    const fn = this.host.getDefinitionOfFunction(lhs.node);
    if (fn === null) {
      return DynamicValue.fromInvalidExpressionType(node.expression, lhs);
    }
    if (!isFunctionOrMethodReference(lhs)) {
      return DynamicValue.fromInvalidExpressionType(node.expression, lhs);
    }
    if (fn.body === null) {
      let expr = null;
      if (context.foreignFunctionResolver) {
        expr = context.foreignFunctionResolver(lhs, node.arguments);
      }
      if (expr === null) {
        return DynamicValue.fromDynamicInput(node, DynamicValue.fromExternalReference(node.expression, lhs));
      }
      if (expr.getSourceFile() !== node.expression.getSourceFile() && lhs.bestGuessOwningModule !== null) {
        context = __spreadProps(__spreadValues({}, context), {
          absoluteModuleName: lhs.bestGuessOwningModule.specifier,
          resolutionContext: lhs.bestGuessOwningModule.resolutionContext
        });
      }
      return this.visitFfrExpression(expr, context);
    }
    let res = this.visitFunctionBody(node, fn, context);
    if (res instanceof DynamicValue && context.foreignFunctionResolver !== void 0) {
      const ffrExpr = context.foreignFunctionResolver(lhs, node.arguments);
      if (ffrExpr !== null) {
        const ffrRes = this.visitFfrExpression(ffrExpr, context);
        if (!(ffrRes instanceof DynamicValue)) {
          res = ffrRes;
        }
      }
    }
    return res;
  }
  visitFfrExpression(expr, context) {
    const res = this.visitExpression(expr, context);
    if (res instanceof Reference) {
      res.synthetic = true;
    }
    return res;
  }
  visitFunctionBody(node, fn, context) {
    if (fn.body === null) {
      return DynamicValue.fromUnknown(node);
    } else if (fn.body.length !== 1 || !ts.isReturnStatement(fn.body[0])) {
      return DynamicValue.fromComplexFunctionCall(node, fn);
    }
    const ret = fn.body[0];
    const args = this.evaluateFunctionArguments(node, context);
    const newScope = /* @__PURE__ */ new Map();
    const calleeContext = __spreadProps(__spreadValues({}, context), { scope: newScope });
    fn.parameters.forEach((param, index) => {
      let arg = args[index];
      if (param.node.dotDotDotToken !== void 0) {
        arg = args.slice(index);
      }
      if (arg === void 0 && param.initializer !== null) {
        arg = this.visitExpression(param.initializer, calleeContext);
      }
      newScope.set(param.node, arg);
    });
    return ret.expression !== void 0 ? this.visitExpression(ret.expression, calleeContext) : void 0;
  }
  visitConditionalExpression(node, context) {
    const condition = this.visitExpression(node.condition, context);
    if (condition instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, condition);
    }
    if (condition) {
      return this.visitExpression(node.whenTrue, context);
    } else {
      return this.visitExpression(node.whenFalse, context);
    }
  }
  visitPrefixUnaryExpression(node, context) {
    const operatorKind = node.operator;
    if (!UNARY_OPERATORS.has(operatorKind)) {
      return DynamicValue.fromUnsupportedSyntax(node);
    }
    const op = UNARY_OPERATORS.get(operatorKind);
    const value = this.visitExpression(node.operand, context);
    if (value instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, value);
    } else {
      return op(value);
    }
  }
  visitBinaryExpression(node, context) {
    const tokenKind = node.operatorToken.kind;
    if (!BINARY_OPERATORS.has(tokenKind)) {
      return DynamicValue.fromUnsupportedSyntax(node);
    }
    const opRecord = BINARY_OPERATORS.get(tokenKind);
    let lhs, rhs;
    if (opRecord.literal) {
      lhs = literal(this.visitExpression(node.left, context), (value) => DynamicValue.fromInvalidExpressionType(node.left, value));
      rhs = literal(this.visitExpression(node.right, context), (value) => DynamicValue.fromInvalidExpressionType(node.right, value));
    } else {
      lhs = this.visitExpression(node.left, context);
      rhs = this.visitExpression(node.right, context);
    }
    if (lhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, lhs);
    } else if (rhs instanceof DynamicValue) {
      return DynamicValue.fromDynamicInput(node, rhs);
    } else {
      return opRecord.op(lhs, rhs);
    }
  }
  visitParenthesizedExpression(node, context) {
    return this.visitExpression(node.expression, context);
  }
  evaluateFunctionArguments(node, context) {
    const args = [];
    for (const arg of node.arguments) {
      if (ts.isSpreadElement(arg)) {
        args.push(...this.visitSpreadElement(arg, context));
      } else {
        args.push(this.visitExpression(arg, context));
      }
    }
    return args;
  }
  visitSpreadElement(node, context) {
    const spread = this.visitExpression(node.expression, context);
    if (spread instanceof DynamicValue) {
      return [DynamicValue.fromDynamicInput(node, spread)];
    } else if (!Array.isArray(spread)) {
      return [DynamicValue.fromInvalidExpressionType(node, spread)];
    } else {
      return spread;
    }
  }
  visitBindingElement(node, context) {
    const path = [];
    let closestDeclaration = node;
    while (ts.isBindingElement(closestDeclaration) || ts.isArrayBindingPattern(closestDeclaration) || ts.isObjectBindingPattern(closestDeclaration)) {
      if (ts.isBindingElement(closestDeclaration)) {
        path.unshift(closestDeclaration);
      }
      closestDeclaration = closestDeclaration.parent;
    }
    if (!ts.isVariableDeclaration(closestDeclaration) || closestDeclaration.initializer === void 0) {
      return DynamicValue.fromUnknown(node);
    }
    let value = this.visit(closestDeclaration.initializer, context);
    for (const element of path) {
      let key;
      if (ts.isArrayBindingPattern(element.parent)) {
        key = element.parent.elements.indexOf(element);
      } else {
        const name = element.propertyName || element.name;
        if (ts.isIdentifier(name)) {
          key = name.text;
        } else {
          return DynamicValue.fromUnknown(element);
        }
      }
      value = this.accessHelper(element, value, key, context);
      if (value instanceof DynamicValue) {
        return value;
      }
    }
    return value;
  }
  stringNameFromPropertyName(node, context) {
    if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
      return node.text;
    } else if (ts.isComputedPropertyName(node)) {
      const literal2 = this.visitExpression(node.expression, context);
      return typeof literal2 === "string" ? literal2 : void 0;
    } else {
      return void 0;
    }
  }
  getResolvedEnum(node, enumMembers, context) {
    const enumRef = this.getReference(node, context);
    const map = /* @__PURE__ */ new Map();
    enumMembers.forEach((member) => {
      const name = this.stringNameFromPropertyName(member.name, context);
      if (name !== void 0) {
        const resolved = this.visit(member.initializer, context);
        map.set(name, new EnumValue(enumRef, name, resolved));
      }
    });
    return map;
  }
  getReference(node, context) {
    return new Reference(node, owningModule(context));
  }
  visitType(node, context) {
    if (ts.isLiteralTypeNode(node)) {
      return this.visitExpression(node.literal, context);
    } else if (ts.isTupleTypeNode(node)) {
      return this.visitTupleType(node, context);
    } else if (ts.isNamedTupleMember(node)) {
      return this.visitType(node.type, context);
    }
    return DynamicValue.fromDynamicType(node);
  }
  visitTupleType(node, context) {
    const res = [];
    for (const elem of node.elements) {
      res.push(this.visitType(elem, context));
    }
    return res;
  }
};
function isFunctionOrMethodReference(ref) {
  return ts.isFunctionDeclaration(ref.node) || ts.isMethodDeclaration(ref.node) || ts.isFunctionExpression(ref.node);
}
function literal(value, reject) {
  if (value instanceof EnumValue) {
    value = value.resolved;
  }
  if (value instanceof DynamicValue || value === null || value === void 0 || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return reject(value);
}
function isVariableDeclarationDeclared(node) {
  if (node.parent === void 0 || !ts.isVariableDeclarationList(node.parent)) {
    return false;
  }
  const declList = node.parent;
  if (declList.parent === void 0 || !ts.isVariableStatement(declList.parent)) {
    return false;
  }
  const varStmt = declList.parent;
  return varStmt.modifiers !== void 0 && varStmt.modifiers.some((mod) => mod.kind === ts.SyntaxKind.DeclareKeyword);
}
var EMPTY = {};
function joinModuleContext(existing, node, decl) {
  if (decl.viaModule !== null && decl.viaModule !== existing.absoluteModuleName) {
    return {
      absoluteModuleName: decl.viaModule,
      resolutionContext: node.getSourceFile().fileName
    };
  } else {
    return EMPTY;
  }
}
function owningModule(context, override = null) {
  let specifier = context.absoluteModuleName;
  if (override !== null) {
    specifier = override.specifier;
  }
  if (specifier !== null) {
    return {
      specifier,
      resolutionContext: context.resolutionContext
    };
  } else {
    return null;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/interface.mjs
var PartialEvaluator = class {
  constructor(host, checker, dependencyTracker) {
    this.host = host;
    this.checker = checker;
    this.dependencyTracker = dependencyTracker;
  }
  evaluate(expr, foreignFunctionResolver) {
    const interpreter = new StaticInterpreter(this.host, this.checker, this.dependencyTracker);
    const sourceFile = expr.getSourceFile();
    return interpreter.visit(expr, {
      originatingFile: sourceFile,
      absoluteModuleName: null,
      resolutionContext: sourceFile.fileName,
      scope: /* @__PURE__ */ new Map(),
      foreignFunctionResolver
    });
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/partial_evaluator/src/diagnostics.mjs
import ts2 from "typescript";
function describeResolvedType(value, maxDepth = 1) {
  var _a, _b;
  if (value === null) {
    return "null";
  } else if (value === void 0) {
    return "undefined";
  } else if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
    return typeof value;
  } else if (value instanceof Map) {
    if (maxDepth === 0) {
      return "object";
    }
    const entries = Array.from(value.entries()).map(([key, v]) => {
      return `${quoteKey(key)}: ${describeResolvedType(v, maxDepth - 1)}`;
    });
    return entries.length > 0 ? `{ ${entries.join("; ")} }` : "{}";
  } else if (value instanceof ResolvedModule) {
    return "(module)";
  } else if (value instanceof EnumValue) {
    return (_a = value.enumRef.debugName) != null ? _a : "(anonymous)";
  } else if (value instanceof Reference) {
    return (_b = value.debugName) != null ? _b : "(anonymous)";
  } else if (Array.isArray(value)) {
    if (maxDepth === 0) {
      return "Array";
    }
    return `[${value.map((v) => describeResolvedType(v, maxDepth - 1)).join(", ")}]`;
  } else if (value instanceof DynamicValue) {
    return "(not statically analyzable)";
  } else if (value instanceof KnownFn) {
    return "Function";
  } else {
    return "unknown";
  }
}
function quoteKey(key) {
  if (/^[a-z0-9_]+$/i.test(key)) {
    return key;
  } else {
    return `'${key.replace(/'/g, "\\'")}'`;
  }
}
function traceDynamicValue(node, value) {
  return value.accept(new TraceDynamicValueVisitor(node));
}
var TraceDynamicValueVisitor = class {
  constructor(node) {
    this.node = node;
    this.currentContainerNode = null;
  }
  visitDynamicInput(value) {
    const trace = value.reason.accept(this);
    if (this.shouldTrace(value.node)) {
      const info = makeRelatedInformation(value.node, "Unable to evaluate this expression statically.");
      trace.unshift(info);
    }
    return trace;
  }
  visitDynamicString(value) {
    return [makeRelatedInformation(value.node, "A string value could not be determined statically.")];
  }
  visitExternalReference(value) {
    const name = value.reason.debugName;
    const description = name !== null ? `'${name}'` : "an anonymous declaration";
    return [makeRelatedInformation(value.node, `A value for ${description} cannot be determined statically, as it is an external declaration.`)];
  }
  visitComplexFunctionCall(value) {
    return [
      makeRelatedInformation(value.node, "Unable to evaluate function call of complex function. A function must have exactly one return statement."),
      makeRelatedInformation(value.reason.node, "Function is declared here.")
    ];
  }
  visitInvalidExpressionType(value) {
    return [makeRelatedInformation(value.node, "Unable to evaluate an invalid expression.")];
  }
  visitUnknown(value) {
    return [makeRelatedInformation(value.node, "Unable to evaluate statically.")];
  }
  visitUnknownIdentifier(value) {
    return [makeRelatedInformation(value.node, "Unknown reference.")];
  }
  visitDynamicType(value) {
    return [makeRelatedInformation(value.node, "Dynamic type.")];
  }
  visitUnsupportedSyntax(value) {
    return [makeRelatedInformation(value.node, "This syntax is not supported.")];
  }
  shouldTrace(node) {
    if (node === this.node) {
      return false;
    }
    const container = getContainerNode(node);
    if (container === this.currentContainerNode) {
      return false;
    }
    this.currentContainerNode = container;
    return true;
  }
};
function getContainerNode(node) {
  let currentNode = node;
  while (currentNode !== void 0) {
    switch (currentNode.kind) {
      case ts2.SyntaxKind.ExpressionStatement:
      case ts2.SyntaxKind.VariableStatement:
      case ts2.SyntaxKind.ReturnStatement:
      case ts2.SyntaxKind.IfStatement:
      case ts2.SyntaxKind.SwitchStatement:
      case ts2.SyntaxKind.DoStatement:
      case ts2.SyntaxKind.WhileStatement:
      case ts2.SyntaxKind.ForStatement:
      case ts2.SyntaxKind.ForInStatement:
      case ts2.SyntaxKind.ForOfStatement:
      case ts2.SyntaxKind.ContinueStatement:
      case ts2.SyntaxKind.BreakStatement:
      case ts2.SyntaxKind.ThrowStatement:
      case ts2.SyntaxKind.ObjectBindingPattern:
      case ts2.SyntaxKind.ArrayBindingPattern:
        return currentNode;
    }
    currentNode = currentNode.parent;
  }
  return node.getSourceFile();
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/util.mjs
import { ExternalExpr, LiteralExpr, ParseLocation, ParseSourceFile, ParseSourceSpan, ReadPropExpr, WrappedNodeExpr } from "@angular/compiler";
import ts3 from "typescript";
function getConstructorDependencies(clazz, reflector, isCore) {
  const deps = [];
  const errors = [];
  let ctorParams = reflector.getConstructorParameters(clazz);
  if (ctorParams === null) {
    if (reflector.hasBaseClass(clazz)) {
      return null;
    } else {
      ctorParams = [];
    }
  }
  ctorParams.forEach((param, idx) => {
    let token = valueReferenceToExpression(param.typeValueReference);
    let attributeNameType = null;
    let optional = false, self = false, skipSelf = false, host = false;
    (param.decorators || []).filter((dec) => isCore || isAngularCore(dec)).forEach((dec) => {
      const name = isCore || dec.import === null ? dec.name : dec.import.name;
      if (name === "Inject") {
        if (dec.args === null || dec.args.length !== 1) {
          throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(dec), `Unexpected number of arguments to @Inject().`);
        }
        token = new WrappedNodeExpr(dec.args[0]);
      } else if (name === "Optional") {
        optional = true;
      } else if (name === "SkipSelf") {
        skipSelf = true;
      } else if (name === "Self") {
        self = true;
      } else if (name === "Host") {
        host = true;
      } else if (name === "Attribute") {
        if (dec.args === null || dec.args.length !== 1) {
          throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(dec), `Unexpected number of arguments to @Attribute().`);
        }
        const attributeName = dec.args[0];
        token = new WrappedNodeExpr(attributeName);
        if (ts3.isStringLiteralLike(attributeName)) {
          attributeNameType = new LiteralExpr(attributeName.text);
        } else {
          attributeNameType = new WrappedNodeExpr(ts3.createKeywordTypeNode(ts3.SyntaxKind.UnknownKeyword));
        }
      } else {
        throw new FatalDiagnosticError(ErrorCode.DECORATOR_UNEXPECTED, Decorator.nodeForError(dec), `Unexpected decorator ${name} on parameter.`);
      }
    });
    if (token === null) {
      if (param.typeValueReference.kind !== 2) {
        throw new Error("Illegal state: expected value reference to be unavailable if no token is present");
      }
      errors.push({
        index: idx,
        param,
        reason: param.typeValueReference.reason
      });
    } else {
      deps.push({ token, attributeNameType, optional, self, skipSelf, host });
    }
  });
  if (errors.length === 0) {
    return { deps };
  } else {
    return { deps: null, errors };
  }
}
function valueReferenceToExpression(valueRef) {
  if (valueRef.kind === 2) {
    return null;
  } else if (valueRef.kind === 0) {
    const expr = new WrappedNodeExpr(valueRef.expression);
    if (valueRef.defaultImportStatement !== null) {
      attachDefaultImportDeclaration(expr, valueRef.defaultImportStatement);
    }
    return expr;
  } else {
    let importExpr = new ExternalExpr({ moduleName: valueRef.moduleName, name: valueRef.importedName });
    if (valueRef.nestedPath !== null) {
      for (const property of valueRef.nestedPath) {
        importExpr = new ReadPropExpr(importExpr, property);
      }
    }
    return importExpr;
  }
}
function unwrapConstructorDependencies(deps) {
  if (deps === null) {
    return null;
  } else if (deps.deps !== null) {
    return deps.deps;
  } else {
    return "invalid";
  }
}
function getValidConstructorDependencies(clazz, reflector, isCore) {
  return validateConstructorDependencies(clazz, getConstructorDependencies(clazz, reflector, isCore));
}
function validateConstructorDependencies(clazz, deps) {
  if (deps === null) {
    return null;
  } else if (deps.deps !== null) {
    return deps.deps;
  } else {
    const error = deps.errors[0];
    throw createUnsuitableInjectionTokenError(clazz, error);
  }
}
function createUnsuitableInjectionTokenError(clazz, error) {
  const { param, index, reason } = error;
  let chainMessage = void 0;
  let hints = void 0;
  switch (reason.kind) {
    case 5:
      chainMessage = "Consider using the @Inject decorator to specify an injection token.";
      hints = [
        makeRelatedInformation(reason.typeNode, "This type is not supported as injection token.")
      ];
      break;
    case 1:
      chainMessage = "Consider using the @Inject decorator to specify an injection token.";
      hints = [
        makeRelatedInformation(reason.typeNode, "This type does not have a value, so it cannot be used as injection token.")
      ];
      if (reason.decl !== null) {
        hints.push(makeRelatedInformation(reason.decl, "The type is declared here."));
      }
      break;
    case 2:
      chainMessage = "Consider changing the type-only import to a regular import, or use the @Inject decorator to specify an injection token.";
      hints = [
        makeRelatedInformation(reason.typeNode, "This type is imported using a type-only import, which prevents it from being usable as an injection token."),
        makeRelatedInformation(reason.node, "The type-only import occurs here.")
      ];
      break;
    case 4:
      chainMessage = "Consider using the @Inject decorator to specify an injection token.";
      hints = [
        makeRelatedInformation(reason.typeNode, "This type corresponds with a namespace, which cannot be used as injection token."),
        makeRelatedInformation(reason.importClause, "The namespace import occurs here.")
      ];
      break;
    case 3:
      chainMessage = "The type should reference a known declaration.";
      hints = [makeRelatedInformation(reason.typeNode, "This type could not be resolved.")];
      break;
    case 0:
      chainMessage = "Consider adding a type to the parameter or use the @Inject decorator to specify an injection token.";
      break;
  }
  const chain = {
    messageText: `No suitable injection token for parameter '${param.name || index}' of class '${clazz.name.text}'.`,
    category: ts3.DiagnosticCategory.Error,
    code: 0,
    next: [{
      messageText: chainMessage,
      category: ts3.DiagnosticCategory.Message,
      code: 0
    }]
  };
  return new FatalDiagnosticError(ErrorCode.PARAM_MISSING_TOKEN, param.nameNode, chain, hints);
}
function toR3Reference(origin, valueRef, typeRef, valueContext, typeContext, refEmitter) {
  const emittedValueRef = refEmitter.emit(valueRef, valueContext);
  assertSuccessfulReferenceEmit(emittedValueRef, origin, "class");
  const emittedTypeRef = refEmitter.emit(typeRef, typeContext, ImportFlags.ForceNewImport | ImportFlags.AllowTypeImports);
  assertSuccessfulReferenceEmit(emittedTypeRef, origin, "class");
  return {
    value: emittedValueRef.expression,
    type: emittedTypeRef.expression
  };
}
function isAngularCore(decorator) {
  return decorator.import !== null && decorator.import.from === "@angular/core";
}
function isAngularCoreReference(reference, symbolName) {
  return reference.ownedByModuleGuess === "@angular/core" && reference.debugName === symbolName;
}
function findAngularDecorator(decorators, name, isCore) {
  return decorators.find((decorator) => isAngularDecorator(decorator, name, isCore));
}
function isAngularDecorator(decorator, name, isCore) {
  if (isCore) {
    return decorator.name === name;
  } else if (isAngularCore(decorator)) {
    return decorator.import.name === name;
  }
  return false;
}
function unwrapExpression(node) {
  while (ts3.isAsExpression(node) || ts3.isParenthesizedExpression(node)) {
    node = node.expression;
  }
  return node;
}
function expandForwardRef(arg) {
  arg = unwrapExpression(arg);
  if (!ts3.isArrowFunction(arg) && !ts3.isFunctionExpression(arg)) {
    return null;
  }
  const body = arg.body;
  if (ts3.isBlock(body)) {
    if (body.statements.length !== 1) {
      return null;
    }
    const stmt = body.statements[0];
    if (!ts3.isReturnStatement(stmt) || stmt.expression === void 0) {
      return null;
    }
    return stmt.expression;
  } else {
    return body;
  }
}
function tryUnwrapForwardRef(node, reflector) {
  node = unwrapExpression(node);
  if (!ts3.isCallExpression(node) || node.arguments.length !== 1) {
    return null;
  }
  const fn = ts3.isPropertyAccessExpression(node.expression) ? node.expression.name : node.expression;
  if (!ts3.isIdentifier(fn)) {
    return null;
  }
  const expr = expandForwardRef(node.arguments[0]);
  if (expr === null) {
    return null;
  }
  const imp = reflector.getImportOfIdentifier(fn);
  if (imp === null || imp.from !== "@angular/core" || imp.name !== "forwardRef") {
    return null;
  }
  return expr;
}
function forwardRefResolver(ref, args) {
  if (!isAngularCoreReference(ref, "forwardRef") || args.length !== 1) {
    return null;
  }
  return expandForwardRef(args[0]);
}
function combineResolvers(resolvers) {
  return (ref, args) => {
    for (const resolver of resolvers) {
      const resolved = resolver(ref, args);
      if (resolved !== null) {
        return resolved;
      }
    }
    return null;
  };
}
function isExpressionForwardReference(expr, context, contextSource) {
  if (isWrappedTsNodeExpr(expr)) {
    const node = ts3.getOriginalNode(expr.node);
    return node.getSourceFile() === contextSource && context.pos < node.pos;
  } else {
    return false;
  }
}
function isWrappedTsNodeExpr(expr) {
  return expr instanceof WrappedNodeExpr;
}
function readBaseClass(node, reflector, evaluator) {
  const baseExpression = reflector.getBaseClassExpression(node);
  if (baseExpression !== null) {
    const baseClass = evaluator.evaluate(baseExpression);
    if (baseClass instanceof Reference && reflector.isClass(baseClass.node)) {
      return baseClass;
    } else {
      return "dynamic";
    }
  }
  return null;
}
var parensWrapperTransformerFactory = (context) => {
  const visitor = (node) => {
    const visited = ts3.visitEachChild(node, visitor, context);
    if (ts3.isArrowFunction(visited) || ts3.isFunctionExpression(visited)) {
      return ts3.createParen(visited);
    }
    return visited;
  };
  return (node) => ts3.visitEachChild(node, visitor, context);
};
function wrapFunctionExpressionsInParens(expression) {
  return ts3.transform(expression, [parensWrapperTransformerFactory]).transformed[0];
}
function makeDuplicateDeclarationError(node, data, kind) {
  const context = [];
  for (const decl of data) {
    if (decl.rawDeclarations === null) {
      continue;
    }
    const contextNode = decl.ref.getOriginForDiagnostics(decl.rawDeclarations, decl.ngModule.name);
    context.push(makeRelatedInformation(contextNode, `'${node.name.text}' is listed in the declarations of the NgModule '${decl.ngModule.name.text}'.`));
  }
  return makeDiagnostic(ErrorCode.NGMODULE_DECLARATION_NOT_UNIQUE, node.name, `The ${kind} '${node.name.text}' is declared by more than one NgModule.`, context);
}
function resolveProvidersRequiringFactory(rawProviders, reflector, evaluator) {
  const providers = /* @__PURE__ */ new Set();
  const resolvedProviders = evaluator.evaluate(rawProviders);
  if (!Array.isArray(resolvedProviders)) {
    return providers;
  }
  resolvedProviders.forEach(function processProviders(provider) {
    let tokenClass = null;
    if (Array.isArray(provider)) {
      provider.forEach(processProviders);
    } else if (provider instanceof Reference) {
      tokenClass = provider;
    } else if (provider instanceof Map && provider.has("useClass") && !provider.has("deps")) {
      const useExisting = provider.get("useClass");
      if (useExisting instanceof Reference) {
        tokenClass = useExisting;
      }
    }
    if (tokenClass !== null && !tokenClass.node.getSourceFile().isDeclarationFile && reflector.isClass(tokenClass.node)) {
      const constructorParameters = reflector.getConstructorParameters(tokenClass.node);
      if (constructorParameters !== null && constructorParameters.length > 0) {
        providers.add(tokenClass);
      }
    }
  });
  return providers;
}
function wrapTypeReference(reflector, clazz) {
  const dtsClass = reflector.getDtsDeclaration(clazz);
  const value = new WrappedNodeExpr(clazz.name);
  const type = dtsClass !== null && isNamedClassDeclaration(dtsClass) ? new WrappedNodeExpr(dtsClass.name) : value;
  return { value, type };
}
function createSourceSpan(node) {
  const sf = node.getSourceFile();
  const [startOffset, endOffset] = [node.getStart(), node.getEnd()];
  const { line: startLine, character: startCol } = sf.getLineAndCharacterOfPosition(startOffset);
  const { line: endLine, character: endCol } = sf.getLineAndCharacterOfPosition(endOffset);
  const parseSf = new ParseSourceFile(sf.getFullText(), sf.fileName);
  return new ParseSourceSpan(new ParseLocation(parseSf, startOffset, startLine + 1, startCol + 1), new ParseLocation(parseSf, endOffset, endLine + 1, endCol + 1));
}
function compileResults(fac, def, metadataStmt, propName) {
  const statements = def.statements;
  if (metadataStmt !== null) {
    statements.push(metadataStmt);
  }
  return [
    fac,
    {
      name: propName,
      initializer: def.expression,
      statements: def.statements,
      type: def.type
    }
  ];
}
function toFactoryMetadata(meta, target) {
  return {
    name: meta.name,
    type: meta.type,
    internalType: meta.internalType,
    typeArgumentCount: meta.typeArgumentCount,
    deps: meta.deps,
    target
  };
}
function isAngularAnimationsReference(reference, symbolName) {
  return reference.ownedByModuleGuess === "@angular/animations" && reference.debugName === symbolName;
}
var animationTriggerResolver = (ref, args) => {
  const animationTriggerMethodName = "trigger";
  if (!isAngularAnimationsReference(ref, animationTriggerMethodName)) {
    return null;
  }
  const triggerNameExpression = args[0];
  if (!triggerNameExpression) {
    return null;
  }
  const factory = ts3.factory;
  return factory.createObjectLiteralExpression([
    factory.createPropertyAssignment(factory.createIdentifier("name"), triggerNameExpression)
  ], true);
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/component.mjs
import { compileClassMetadata as compileClassMetadata3, compileComponentFromMetadata, compileDeclareClassMetadata as compileDeclareClassMetadata3, compileDeclareComponentFromMetadata, CssSelector, DEFAULT_INTERPOLATION_CONFIG, DomElementSchemaRegistry, ExternalExpr as ExternalExpr5, FactoryTarget as FactoryTarget3, InterpolationConfig, makeBindingParser as makeBindingParser2, ParseSourceFile as ParseSourceFile2, parseTemplate, R3TargetBinder, SelectorMatcher, ViewEncapsulation, WrappedNodeExpr as WrappedNodeExpr5 } from "@angular/compiler";
import ts18 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/semantic_graph/src/api.mjs
import ts4 from "typescript";
var SemanticSymbol = class {
  constructor(decl) {
    this.decl = decl;
    this.path = absoluteFromSourceFile(decl.getSourceFile());
    this.identifier = getSymbolIdentifier(decl);
  }
};
function getSymbolIdentifier(decl) {
  if (!ts4.isSourceFile(decl.parent)) {
    return null;
  }
  return decl.name.text;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/semantic_graph/src/graph.mjs
import { ExternalExpr as ExternalExpr2 } from "@angular/compiler";
var OpaqueSymbol = class extends SemanticSymbol {
  isPublicApiAffected() {
    return false;
  }
  isTypeCheckApiAffected() {
    return false;
  }
};
var SemanticDepGraph = class {
  constructor() {
    this.files = /* @__PURE__ */ new Map();
    this.symbolByDecl = /* @__PURE__ */ new Map();
  }
  registerSymbol(symbol) {
    this.symbolByDecl.set(symbol.decl, symbol);
    if (symbol.identifier !== null) {
      if (!this.files.has(symbol.path)) {
        this.files.set(symbol.path, /* @__PURE__ */ new Map());
      }
      this.files.get(symbol.path).set(symbol.identifier, symbol);
    }
  }
  getEquivalentSymbol(symbol) {
    let previousSymbol = this.getSymbolByDecl(symbol.decl);
    if (previousSymbol === null && symbol.identifier !== null) {
      previousSymbol = this.getSymbolByName(symbol.path, symbol.identifier);
    }
    return previousSymbol;
  }
  getSymbolByName(path, identifier) {
    if (!this.files.has(path)) {
      return null;
    }
    const file = this.files.get(path);
    if (!file.has(identifier)) {
      return null;
    }
    return file.get(identifier);
  }
  getSymbolByDecl(decl) {
    if (!this.symbolByDecl.has(decl)) {
      return null;
    }
    return this.symbolByDecl.get(decl);
  }
};
var SemanticDepGraphUpdater = class {
  constructor(priorGraph) {
    this.priorGraph = priorGraph;
    this.newGraph = new SemanticDepGraph();
    this.opaqueSymbols = /* @__PURE__ */ new Map();
  }
  registerSymbol(symbol) {
    this.newGraph.registerSymbol(symbol);
  }
  finalize() {
    if (this.priorGraph === null) {
      return {
        needsEmit: /* @__PURE__ */ new Set(),
        needsTypeCheckEmit: /* @__PURE__ */ new Set(),
        newGraph: this.newGraph
      };
    }
    const needsEmit = this.determineInvalidatedFiles(this.priorGraph);
    const needsTypeCheckEmit = this.determineInvalidatedTypeCheckFiles(this.priorGraph);
    return {
      needsEmit,
      needsTypeCheckEmit,
      newGraph: this.newGraph
    };
  }
  determineInvalidatedFiles(priorGraph) {
    const isPublicApiAffected = /* @__PURE__ */ new Set();
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isPublicApiAffected(previousSymbol)) {
        isPublicApiAffected.add(symbol);
      }
    }
    const needsEmit = /* @__PURE__ */ new Set();
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      if (symbol.isEmitAffected === void 0) {
        continue;
      }
      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isEmitAffected(previousSymbol, isPublicApiAffected)) {
        needsEmit.add(symbol.path);
      }
    }
    return needsEmit;
  }
  determineInvalidatedTypeCheckFiles(priorGraph) {
    const isTypeCheckApiAffected = /* @__PURE__ */ new Set();
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isTypeCheckApiAffected(previousSymbol)) {
        isTypeCheckApiAffected.add(symbol);
      }
    }
    const needsTypeCheckEmit = /* @__PURE__ */ new Set();
    for (const symbol of this.newGraph.symbolByDecl.values()) {
      if (symbol.isTypeCheckBlockAffected === void 0) {
        continue;
      }
      const previousSymbol = priorGraph.getEquivalentSymbol(symbol);
      if (previousSymbol === null || symbol.isTypeCheckBlockAffected(previousSymbol, isTypeCheckApiAffected)) {
        needsTypeCheckEmit.add(symbol.path);
      }
    }
    return needsTypeCheckEmit;
  }
  getSemanticReference(decl, expr) {
    return {
      symbol: this.getSymbol(decl),
      importPath: getImportPath(expr)
    };
  }
  getSymbol(decl) {
    const symbol = this.newGraph.getSymbolByDecl(decl);
    if (symbol === null) {
      return this.getOpaqueSymbol(decl);
    }
    return symbol;
  }
  getOpaqueSymbol(decl) {
    if (this.opaqueSymbols.has(decl)) {
      return this.opaqueSymbols.get(decl);
    }
    const symbol = new OpaqueSymbol(decl);
    this.opaqueSymbols.set(decl, symbol);
    return symbol;
  }
};
function getImportPath(expr) {
  if (expr instanceof ExternalExpr2) {
    return `${expr.value.moduleName}$${expr.value.name}`;
  } else {
    return null;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/semantic_graph/src/type_parameters.mjs
import ts5 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/semantic_graph/src/util.mjs
function isSymbolEqual(a, b) {
  if (a.decl === b.decl) {
    return true;
  }
  if (a.identifier === null || b.identifier === null) {
    return false;
  }
  return a.path === b.path && a.identifier === b.identifier;
}
function isReferenceEqual(a, b) {
  if (!isSymbolEqual(a.symbol, b.symbol)) {
    return false;
  }
  return a.importPath === b.importPath;
}
function referenceEquality(a, b) {
  return a === b;
}
function isArrayEqual(a, b, equalityTester = referenceEquality) {
  if (a === null || b === null) {
    return a === b;
  }
  if (a.length !== b.length) {
    return false;
  }
  return !a.some((item, index) => !equalityTester(item, b[index]));
}
function isSetEqual(a, b, equalityTester = referenceEquality) {
  if (a === null || b === null) {
    return a === b;
  }
  if (a.size !== b.size) {
    return false;
  }
  for (const itemA of a) {
    let found = false;
    for (const itemB of b) {
      if (equalityTester(itemA, itemB)) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/incremental/semantic_graph/src/type_parameters.mjs
function extractSemanticTypeParameters(node) {
  if (!ts5.isClassDeclaration(node) || node.typeParameters === void 0) {
    return null;
  }
  return node.typeParameters.map((typeParam) => ({ hasGenericTypeBound: typeParam.constraint !== void 0 }));
}
function areTypeParametersEqual(current, previous) {
  if (!isArrayEqual(current, previous, isTypeParameterEqual)) {
    return false;
  }
  if (current !== null && current.some((typeParam) => typeParam.hasGenericTypeBound)) {
    return false;
  }
  return true;
}
function isTypeParameterEqual(a, b) {
  return a.hasGenericTypeBound === b.hasGenericTypeBound;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/api.mjs
var MetaType;
(function(MetaType2) {
  MetaType2[MetaType2["Pipe"] = 0] = "Pipe";
  MetaType2[MetaType2["Directive"] = 1] = "Directive";
})(MetaType || (MetaType = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/dts.mjs
import ts7 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/property_mapping.mjs
var ClassPropertyMapping = class {
  constructor(forwardMap) {
    this.forwardMap = forwardMap;
    this.reverseMap = reverseMapFromForwardMap(forwardMap);
  }
  static empty() {
    return new ClassPropertyMapping(/* @__PURE__ */ new Map());
  }
  static fromMappedObject(obj) {
    const forwardMap = /* @__PURE__ */ new Map();
    for (const classPropertyName of Object.keys(obj)) {
      const value = obj[classPropertyName];
      const bindingPropertyName = Array.isArray(value) ? value[0] : value;
      const inputOrOutput = { classPropertyName, bindingPropertyName };
      forwardMap.set(classPropertyName, inputOrOutput);
    }
    return new ClassPropertyMapping(forwardMap);
  }
  static merge(a, b) {
    const forwardMap = new Map(a.forwardMap.entries());
    for (const [classPropertyName, inputOrOutput] of b.forwardMap) {
      forwardMap.set(classPropertyName, inputOrOutput);
    }
    return new ClassPropertyMapping(forwardMap);
  }
  get classPropertyNames() {
    return Array.from(this.forwardMap.keys());
  }
  get propertyNames() {
    return Array.from(this.reverseMap.keys());
  }
  hasBindingPropertyName(propertyName) {
    return this.reverseMap.has(propertyName);
  }
  getByBindingPropertyName(propertyName) {
    return this.reverseMap.has(propertyName) ? this.reverseMap.get(propertyName) : null;
  }
  getByClassPropertyName(classPropertyName) {
    return this.forwardMap.has(classPropertyName) ? this.forwardMap.get(classPropertyName) : null;
  }
  toDirectMappedObject() {
    const obj = {};
    for (const [classPropertyName, inputOrOutput] of this.forwardMap) {
      obj[classPropertyName] = inputOrOutput.bindingPropertyName;
    }
    return obj;
  }
  toJointMappedObject() {
    const obj = {};
    for (const [classPropertyName, inputOrOutput] of this.forwardMap) {
      if (inputOrOutput.bindingPropertyName === classPropertyName) {
        obj[classPropertyName] = inputOrOutput.bindingPropertyName;
      } else {
        obj[classPropertyName] = [inputOrOutput.bindingPropertyName, classPropertyName];
      }
    }
    return obj;
  }
  *[Symbol.iterator]() {
    for (const [classPropertyName, inputOrOutput] of this.forwardMap.entries()) {
      yield [classPropertyName, inputOrOutput.bindingPropertyName];
    }
  }
};
function reverseMapFromForwardMap(forwardMap) {
  const reverseMap = /* @__PURE__ */ new Map();
  for (const [_, inputOrOutput] of forwardMap) {
    if (!reverseMap.has(inputOrOutput.bindingPropertyName)) {
      reverseMap.set(inputOrOutput.bindingPropertyName, []);
    }
    reverseMap.get(inputOrOutput.bindingPropertyName).push(inputOrOutput);
  }
  return reverseMap;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/util.mjs
import ts6 from "typescript";
function extractReferencesFromType(checker, def, bestGuessOwningModule) {
  if (!ts6.isTupleTypeNode(def)) {
    return [];
  }
  return def.elements.map((element) => {
    if (!ts6.isTypeQueryNode(element)) {
      throw new Error(`Expected TypeQueryNode: ${nodeDebugInfo(element)}`);
    }
    const type = element.exprName;
    const { node, from } = reflectTypeEntityToDeclaration(type, checker);
    if (!isNamedClassDeclaration(node)) {
      throw new Error(`Expected named ClassDeclaration: ${nodeDebugInfo(node)}`);
    }
    if (from !== null && !from.startsWith(".")) {
      return new Reference(node, { specifier: from, resolutionContext: def.getSourceFile().fileName });
    } else {
      return new Reference(node, bestGuessOwningModule);
    }
  });
}
function readStringType(type) {
  if (!ts6.isLiteralTypeNode(type) || !ts6.isStringLiteral(type.literal)) {
    return null;
  }
  return type.literal.text;
}
function readStringMapType(type) {
  if (!ts6.isTypeLiteralNode(type)) {
    return {};
  }
  const obj = {};
  type.members.forEach((member) => {
    if (!ts6.isPropertySignature(member) || member.type === void 0 || member.name === void 0 || !ts6.isStringLiteral(member.name)) {
      return;
    }
    const value = readStringType(member.type);
    if (value === null) {
      return null;
    }
    obj[member.name.text] = value;
  });
  return obj;
}
function readStringArrayType(type) {
  if (!ts6.isTupleTypeNode(type)) {
    return [];
  }
  const res = [];
  type.elements.forEach((el) => {
    if (!ts6.isLiteralTypeNode(el) || !ts6.isStringLiteral(el.literal)) {
      return;
    }
    res.push(el.literal.text);
  });
  return res;
}
function extractDirectiveTypeCheckMeta(node, inputs, reflector) {
  const members = reflector.getMembersOfClass(node);
  const staticMembers = members.filter((member) => member.isStatic);
  const ngTemplateGuards = staticMembers.map(extractTemplateGuard).filter((guard) => guard !== null);
  const hasNgTemplateContextGuard = staticMembers.some((member) => member.kind === ClassMemberKind.Method && member.name === "ngTemplateContextGuard");
  const coercedInputFields = new Set(staticMembers.map(extractCoercedInput).filter((inputName) => inputName !== null));
  const restrictedInputFields = /* @__PURE__ */ new Set();
  const stringLiteralInputFields = /* @__PURE__ */ new Set();
  const undeclaredInputFields = /* @__PURE__ */ new Set();
  for (const classPropertyName of inputs.classPropertyNames) {
    const field = members.find((member) => member.name === classPropertyName);
    if (field === void 0 || field.node === null) {
      undeclaredInputFields.add(classPropertyName);
      continue;
    }
    if (isRestricted(field.node)) {
      restrictedInputFields.add(classPropertyName);
    }
    if (field.nameNode !== null && ts6.isStringLiteral(field.nameNode)) {
      stringLiteralInputFields.add(classPropertyName);
    }
  }
  const arity = reflector.getGenericArityOfClass(node);
  return {
    hasNgTemplateContextGuard,
    ngTemplateGuards,
    coercedInputFields,
    restrictedInputFields,
    stringLiteralInputFields,
    undeclaredInputFields,
    isGeneric: arity !== null && arity > 0
  };
}
function isRestricted(node) {
  if (node.modifiers === void 0) {
    return false;
  }
  return node.modifiers.some((modifier) => modifier.kind === ts6.SyntaxKind.PrivateKeyword || modifier.kind === ts6.SyntaxKind.ProtectedKeyword || modifier.kind === ts6.SyntaxKind.ReadonlyKeyword);
}
function extractTemplateGuard(member) {
  if (!member.name.startsWith("ngTemplateGuard_")) {
    return null;
  }
  const inputName = afterUnderscore(member.name);
  if (member.kind === ClassMemberKind.Property) {
    let type = null;
    if (member.type !== null && ts6.isLiteralTypeNode(member.type) && ts6.isStringLiteral(member.type.literal)) {
      type = member.type.literal.text;
    }
    if (type !== "binding") {
      return null;
    }
    return { inputName, type };
  } else if (member.kind === ClassMemberKind.Method) {
    return { inputName, type: "invocation" };
  } else {
    return null;
  }
}
function extractCoercedInput(member) {
  if (member.kind !== ClassMemberKind.Property || !member.name.startsWith("ngAcceptInputType_")) {
    return null;
  }
  return afterUnderscore(member.name);
}
var CompoundMetadataReader = class {
  constructor(readers) {
    this.readers = readers;
  }
  getDirectiveMetadata(node) {
    for (const reader of this.readers) {
      const meta = reader.getDirectiveMetadata(node);
      if (meta !== null) {
        return meta;
      }
    }
    return null;
  }
  getNgModuleMetadata(node) {
    for (const reader of this.readers) {
      const meta = reader.getNgModuleMetadata(node);
      if (meta !== null) {
        return meta;
      }
    }
    return null;
  }
  getPipeMetadata(node) {
    for (const reader of this.readers) {
      const meta = reader.getPipeMetadata(node);
      if (meta !== null) {
        return meta;
      }
    }
    return null;
  }
};
function afterUnderscore(str) {
  const pos = str.indexOf("_");
  if (pos === -1) {
    throw new Error(`Expected '${str}' to contain '_'`);
  }
  return str.substr(pos + 1);
}
function hasInjectableFields(clazz, host) {
  const members = host.getMembersOfClass(clazz);
  return members.some(({ isStatic, name }) => isStatic && (name === "\u0275prov" || name === "\u0275fac"));
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/dts.mjs
var DtsMetadataReader = class {
  constructor(checker, reflector) {
    this.checker = checker;
    this.reflector = reflector;
  }
  getNgModuleMetadata(ref) {
    const clazz = ref.node;
    const ngModuleDef = this.reflector.getMembersOfClass(clazz).find((member) => member.name === "\u0275mod" && member.isStatic);
    if (ngModuleDef === void 0) {
      return null;
    } else if (ngModuleDef.type === null || !ts7.isTypeReferenceNode(ngModuleDef.type) || ngModuleDef.type.typeArguments === void 0 || ngModuleDef.type.typeArguments.length !== 4) {
      return null;
    }
    const [_, declarationMetadata, importMetadata, exportMetadata] = ngModuleDef.type.typeArguments;
    return {
      ref,
      declarations: extractReferencesFromType(this.checker, declarationMetadata, ref.bestGuessOwningModule),
      exports: extractReferencesFromType(this.checker, exportMetadata, ref.bestGuessOwningModule),
      imports: extractReferencesFromType(this.checker, importMetadata, ref.bestGuessOwningModule),
      schemas: [],
      rawDeclarations: null
    };
  }
  getDirectiveMetadata(ref) {
    const clazz = ref.node;
    const def = this.reflector.getMembersOfClass(clazz).find((field) => field.isStatic && (field.name === "\u0275cmp" || field.name === "\u0275dir"));
    if (def === void 0) {
      return null;
    } else if (def.type === null || !ts7.isTypeReferenceNode(def.type) || def.type.typeArguments === void 0 || def.type.typeArguments.length < 2) {
      return null;
    }
    const isComponent = def.name === "\u0275cmp";
    const ctorParams = this.reflector.getConstructorParameters(clazz);
    const isStructural = !isComponent && ctorParams !== null && ctorParams.some((param) => {
      return param.typeValueReference.kind === 1 && param.typeValueReference.moduleName === "@angular/core" && param.typeValueReference.importedName === "TemplateRef";
    });
    const inputs = ClassPropertyMapping.fromMappedObject(readStringMapType(def.type.typeArguments[3]));
    const outputs = ClassPropertyMapping.fromMappedObject(readStringMapType(def.type.typeArguments[4]));
    return __spreadProps(__spreadValues({
      type: MetaType.Directive,
      ref,
      name: clazz.name.text,
      isComponent,
      selector: readStringType(def.type.typeArguments[1]),
      exportAs: readStringArrayType(def.type.typeArguments[2]),
      inputs,
      outputs,
      queries: readStringArrayType(def.type.typeArguments[5])
    }, extractDirectiveTypeCheckMeta(clazz, inputs, this.reflector)), {
      baseClass: readBaseClass2(clazz, this.checker, this.reflector),
      isPoisoned: false,
      isStructural,
      animationTriggerNames: null
    });
  }
  getPipeMetadata(ref) {
    const def = this.reflector.getMembersOfClass(ref.node).find((field) => field.isStatic && field.name === "\u0275pipe");
    if (def === void 0) {
      return null;
    } else if (def.type === null || !ts7.isTypeReferenceNode(def.type) || def.type.typeArguments === void 0 || def.type.typeArguments.length < 2) {
      return null;
    }
    const type = def.type.typeArguments[1];
    if (!ts7.isLiteralTypeNode(type) || !ts7.isStringLiteral(type.literal)) {
      return null;
    }
    const name = type.literal.text;
    return {
      type: MetaType.Pipe,
      ref,
      name,
      nameExpr: null
    };
  }
};
function readBaseClass2(clazz, checker, reflector) {
  if (!isNamedClassDeclaration(clazz)) {
    return reflector.hasBaseClass(clazz) ? "dynamic" : null;
  }
  if (clazz.heritageClauses !== void 0) {
    for (const clause of clazz.heritageClauses) {
      if (clause.token === ts7.SyntaxKind.ExtendsKeyword) {
        const baseExpr = clause.types[0].expression;
        let symbol = checker.getSymbolAtLocation(baseExpr);
        if (symbol === void 0) {
          return "dynamic";
        } else if (symbol.flags & ts7.SymbolFlags.Alias) {
          symbol = checker.getAliasedSymbol(symbol);
        }
        if (symbol.valueDeclaration !== void 0 && isNamedClassDeclaration(symbol.valueDeclaration)) {
          return new Reference(symbol.valueDeclaration);
        } else {
          return "dynamic";
        }
      }
    }
  }
  return null;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/inheritance.mjs
function flattenInheritedDirectiveMetadata(reader, dir) {
  const topMeta = reader.getDirectiveMetadata(dir);
  if (topMeta === null) {
    throw new Error(`Metadata not found for directive: ${dir.debugName}`);
  }
  if (topMeta.baseClass === null) {
    return topMeta;
  }
  const coercedInputFields = /* @__PURE__ */ new Set();
  const undeclaredInputFields = /* @__PURE__ */ new Set();
  const restrictedInputFields = /* @__PURE__ */ new Set();
  const stringLiteralInputFields = /* @__PURE__ */ new Set();
  let isDynamic = false;
  let inputs = ClassPropertyMapping.empty();
  let outputs = ClassPropertyMapping.empty();
  let isStructural = false;
  const addMetadata = (meta) => {
    if (meta.baseClass === "dynamic") {
      isDynamic = true;
    } else if (meta.baseClass !== null) {
      const baseMeta = reader.getDirectiveMetadata(meta.baseClass);
      if (baseMeta !== null) {
        addMetadata(baseMeta);
      } else {
        isDynamic = true;
      }
    }
    isStructural = isStructural || meta.isStructural;
    inputs = ClassPropertyMapping.merge(inputs, meta.inputs);
    outputs = ClassPropertyMapping.merge(outputs, meta.outputs);
    for (const coercedInputField of meta.coercedInputFields) {
      coercedInputFields.add(coercedInputField);
    }
    for (const undeclaredInputField of meta.undeclaredInputFields) {
      undeclaredInputFields.add(undeclaredInputField);
    }
    for (const restrictedInputField of meta.restrictedInputFields) {
      restrictedInputFields.add(restrictedInputField);
    }
    for (const field of meta.stringLiteralInputFields) {
      stringLiteralInputFields.add(field);
    }
  };
  addMetadata(topMeta);
  return __spreadProps(__spreadValues({}, topMeta), {
    inputs,
    outputs,
    coercedInputFields,
    undeclaredInputFields,
    restrictedInputFields,
    stringLiteralInputFields,
    baseClass: isDynamic ? "dynamic" : null,
    isStructural
  });
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/registry.mjs
var LocalMetadataRegistry = class {
  constructor() {
    this.directives = /* @__PURE__ */ new Map();
    this.ngModules = /* @__PURE__ */ new Map();
    this.pipes = /* @__PURE__ */ new Map();
  }
  getDirectiveMetadata(ref) {
    return this.directives.has(ref.node) ? this.directives.get(ref.node) : null;
  }
  getNgModuleMetadata(ref) {
    return this.ngModules.has(ref.node) ? this.ngModules.get(ref.node) : null;
  }
  getPipeMetadata(ref) {
    return this.pipes.has(ref.node) ? this.pipes.get(ref.node) : null;
  }
  registerDirectiveMetadata(meta) {
    this.directives.set(meta.ref.node, meta);
  }
  registerNgModuleMetadata(meta) {
    this.ngModules.set(meta.ref.node, meta);
  }
  registerPipeMetadata(meta) {
    this.pipes.set(meta.ref.node, meta);
  }
};
var CompoundMetadataRegistry = class {
  constructor(registries) {
    this.registries = registries;
  }
  registerDirectiveMetadata(meta) {
    for (const registry of this.registries) {
      registry.registerDirectiveMetadata(meta);
    }
  }
  registerNgModuleMetadata(meta) {
    for (const registry of this.registries) {
      registry.registerNgModuleMetadata(meta);
    }
  }
  registerPipeMetadata(meta) {
    for (const registry of this.registries) {
      registry.registerPipeMetadata(meta);
    }
  }
};
var InjectableClassRegistry = class {
  constructor(host) {
    this.host = host;
    this.classes = /* @__PURE__ */ new Set();
  }
  registerInjectable(declaration) {
    this.classes.add(declaration);
  }
  isInjectable(declaration) {
    return this.classes.has(declaration) || hasInjectableFields(declaration, this.host);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/metadata/src/resource_registry.mjs
var ResourceRegistry = class {
  constructor() {
    this.externalTemplateToComponentsMap = /* @__PURE__ */ new Map();
    this.componentToTemplateMap = /* @__PURE__ */ new Map();
    this.componentToStylesMap = /* @__PURE__ */ new Map();
    this.externalStyleToComponentsMap = /* @__PURE__ */ new Map();
  }
  getComponentsWithTemplate(template) {
    if (!this.externalTemplateToComponentsMap.has(template)) {
      return /* @__PURE__ */ new Set();
    }
    return this.externalTemplateToComponentsMap.get(template);
  }
  registerResources(resources, component) {
    if (resources.template !== null) {
      this.registerTemplate(resources.template, component);
    }
    for (const style of resources.styles) {
      this.registerStyle(style, component);
    }
  }
  registerTemplate(templateResource, component) {
    const { path } = templateResource;
    if (path !== null) {
      if (!this.externalTemplateToComponentsMap.has(path)) {
        this.externalTemplateToComponentsMap.set(path, /* @__PURE__ */ new Set());
      }
      this.externalTemplateToComponentsMap.get(path).add(component);
    }
    this.componentToTemplateMap.set(component, templateResource);
  }
  getTemplate(component) {
    if (!this.componentToTemplateMap.has(component)) {
      return null;
    }
    return this.componentToTemplateMap.get(component);
  }
  registerStyle(styleResource, component) {
    const { path } = styleResource;
    if (!this.componentToStylesMap.has(component)) {
      this.componentToStylesMap.set(component, /* @__PURE__ */ new Set());
    }
    if (path !== null) {
      if (!this.externalStyleToComponentsMap.has(path)) {
        this.externalStyleToComponentsMap.set(path, /* @__PURE__ */ new Set());
      }
      this.externalStyleToComponentsMap.get(path).add(component);
    }
    this.componentToStylesMap.get(component).add(styleResource);
  }
  getStyles(component) {
    if (!this.componentToStylesMap.has(component)) {
      return /* @__PURE__ */ new Set();
    }
    return this.componentToStylesMap.get(component);
  }
  getComponentsWithStyle(styleUrl) {
    if (!this.externalStyleToComponentsMap.has(styleUrl)) {
      return /* @__PURE__ */ new Set();
    }
    return this.externalStyleToComponentsMap.get(styleUrl);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/api.mjs
var CompilationMode;
(function(CompilationMode2) {
  CompilationMode2[CompilationMode2["FULL"] = 0] = "FULL";
  CompilationMode2[CompilationMode2["PARTIAL"] = 1] = "PARTIAL";
})(CompilationMode || (CompilationMode = {}));
var HandlerPrecedence;
(function(HandlerPrecedence2) {
  HandlerPrecedence2[HandlerPrecedence2["PRIMARY"] = 0] = "PRIMARY";
  HandlerPrecedence2[HandlerPrecedence2["SHARED"] = 1] = "SHARED";
  HandlerPrecedence2[HandlerPrecedence2["WEAK"] = 2] = "WEAK";
})(HandlerPrecedence || (HandlerPrecedence = {}));
var HandlerFlags;
(function(HandlerFlags2) {
  HandlerFlags2[HandlerFlags2["NONE"] = 0] = "NONE";
  HandlerFlags2[HandlerFlags2["FULL_INHERITANCE"] = 1] = "FULL_INHERITANCE";
})(HandlerFlags || (HandlerFlags = {}));

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/alias.mjs
import ts8 from "typescript";
function aliasTransformFactory(exportStatements) {
  return (context) => {
    return (file) => {
      if (ts8.isBundle(file) || !exportStatements.has(file.fileName)) {
        return file;
      }
      const statements = [...file.statements];
      exportStatements.get(file.fileName).forEach(([moduleName, symbolName], aliasName) => {
        const stmt = ts8.createExportDeclaration(void 0, void 0, ts8.createNamedExports([createExportSpecifier(symbolName, aliasName)]), ts8.createStringLiteral(moduleName));
        statements.push(stmt);
      });
      return ts8.updateSourceFileNode(file, statements);
    };
  };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/compilation.mjs
import ts9 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/trait.mjs
var TraitState;
(function(TraitState2) {
  TraitState2[TraitState2["Pending"] = 0] = "Pending";
  TraitState2[TraitState2["Analyzed"] = 1] = "Analyzed";
  TraitState2[TraitState2["Resolved"] = 2] = "Resolved";
  TraitState2[TraitState2["Skipped"] = 3] = "Skipped";
})(TraitState || (TraitState = {}));
var Trait = {
  pending: (handler, detected) => TraitImpl.pending(handler, detected)
};
var TraitImpl = class {
  constructor(handler, detected) {
    this.state = TraitState.Pending;
    this.analysis = null;
    this.symbol = null;
    this.resolution = null;
    this.analysisDiagnostics = null;
    this.resolveDiagnostics = null;
    this.handler = handler;
    this.detected = detected;
  }
  toAnalyzed(analysis, diagnostics, symbol) {
    this.assertTransitionLegal(TraitState.Pending, TraitState.Analyzed);
    this.analysis = analysis;
    this.analysisDiagnostics = diagnostics;
    this.symbol = symbol;
    this.state = TraitState.Analyzed;
    return this;
  }
  toResolved(resolution, diagnostics) {
    this.assertTransitionLegal(TraitState.Analyzed, TraitState.Resolved);
    if (this.analysis === null) {
      throw new Error(`Cannot transition an Analyzed trait with a null analysis to Resolved`);
    }
    this.resolution = resolution;
    this.state = TraitState.Resolved;
    this.resolveDiagnostics = diagnostics;
    return this;
  }
  toSkipped() {
    this.assertTransitionLegal(TraitState.Pending, TraitState.Skipped);
    this.state = TraitState.Skipped;
    return this;
  }
  assertTransitionLegal(allowedState, transitionTo) {
    if (!(this.state === allowedState)) {
      throw new Error(`Assertion failure: cannot transition from ${TraitState[this.state]} to ${TraitState[transitionTo]}.`);
    }
  }
  static pending(handler, detected) {
    return new TraitImpl(handler, detected);
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/compilation.mjs
var TraitCompiler = class {
  constructor(handlers, reflector, perf, incrementalBuild, compileNonExportedClasses, compilationMode, dtsTransforms, semanticDepGraphUpdater, sourceFileTypeIdentifier) {
    this.handlers = handlers;
    this.reflector = reflector;
    this.perf = perf;
    this.incrementalBuild = incrementalBuild;
    this.compileNonExportedClasses = compileNonExportedClasses;
    this.compilationMode = compilationMode;
    this.dtsTransforms = dtsTransforms;
    this.semanticDepGraphUpdater = semanticDepGraphUpdater;
    this.sourceFileTypeIdentifier = sourceFileTypeIdentifier;
    this.classes = /* @__PURE__ */ new Map();
    this.fileToClasses = /* @__PURE__ */ new Map();
    this.filesWithoutTraits = /* @__PURE__ */ new Set();
    this.reexportMap = /* @__PURE__ */ new Map();
    this.handlersByName = /* @__PURE__ */ new Map();
    for (const handler of handlers) {
      this.handlersByName.set(handler.name, handler);
    }
  }
  analyzeSync(sf) {
    this.analyze(sf, false);
  }
  analyzeAsync(sf) {
    return this.analyze(sf, true);
  }
  analyze(sf, preanalyze) {
    if (sf.isDeclarationFile || this.sourceFileTypeIdentifier.isShim(sf) || this.sourceFileTypeIdentifier.isResource(sf)) {
      return void 0;
    }
    const promises = [];
    const priorWork = this.incrementalBuild.priorAnalysisFor(sf);
    if (priorWork !== null) {
      this.perf.eventCount(PerfEvent.SourceFileReuseAnalysis);
      if (priorWork.length > 0) {
        for (const priorRecord of priorWork) {
          this.adopt(priorRecord);
        }
        this.perf.eventCount(PerfEvent.TraitReuseAnalysis, priorWork.length);
      } else {
        this.filesWithoutTraits.add(sf);
      }
      return;
    }
    const visit2 = (node) => {
      if (this.reflector.isClass(node)) {
        this.analyzeClass(node, preanalyze ? promises : null);
      }
      ts9.forEachChild(node, visit2);
    };
    visit2(sf);
    if (!this.fileToClasses.has(sf)) {
      this.filesWithoutTraits.add(sf);
    }
    if (preanalyze && promises.length > 0) {
      return Promise.all(promises).then(() => void 0);
    } else {
      return void 0;
    }
  }
  recordFor(clazz) {
    if (this.classes.has(clazz)) {
      return this.classes.get(clazz);
    } else {
      return null;
    }
  }
  recordsFor(sf) {
    if (!this.fileToClasses.has(sf)) {
      return null;
    }
    const records = [];
    for (const clazz of this.fileToClasses.get(sf)) {
      records.push(this.classes.get(clazz));
    }
    return records;
  }
  getAnalyzedRecords() {
    const result = /* @__PURE__ */ new Map();
    for (const [sf, classes] of this.fileToClasses) {
      const records = [];
      for (const clazz of classes) {
        records.push(this.classes.get(clazz));
      }
      result.set(sf, records);
    }
    for (const sf of this.filesWithoutTraits) {
      result.set(sf, []);
    }
    return result;
  }
  adopt(priorRecord) {
    const record = {
      hasPrimaryHandler: priorRecord.hasPrimaryHandler,
      hasWeakHandlers: priorRecord.hasWeakHandlers,
      metaDiagnostics: priorRecord.metaDiagnostics,
      node: priorRecord.node,
      traits: []
    };
    for (const priorTrait of priorRecord.traits) {
      const handler = this.handlersByName.get(priorTrait.handler.name);
      let trait = Trait.pending(handler, priorTrait.detected);
      if (priorTrait.state === TraitState.Analyzed || priorTrait.state === TraitState.Resolved) {
        const symbol = this.makeSymbolForTrait(handler, record.node, priorTrait.analysis);
        trait = trait.toAnalyzed(priorTrait.analysis, priorTrait.analysisDiagnostics, symbol);
        if (trait.analysis !== null && trait.handler.register !== void 0) {
          trait.handler.register(record.node, trait.analysis);
        }
      } else if (priorTrait.state === TraitState.Skipped) {
        trait = trait.toSkipped();
      }
      record.traits.push(trait);
    }
    this.classes.set(record.node, record);
    const sf = record.node.getSourceFile();
    if (!this.fileToClasses.has(sf)) {
      this.fileToClasses.set(sf, /* @__PURE__ */ new Set());
    }
    this.fileToClasses.get(sf).add(record.node);
  }
  scanClassForTraits(clazz) {
    if (!this.compileNonExportedClasses && !this.reflector.isStaticallyExported(clazz)) {
      return null;
    }
    const decorators = this.reflector.getDecoratorsOfDeclaration(clazz);
    return this.detectTraits(clazz, decorators);
  }
  detectTraits(clazz, decorators) {
    let record = this.recordFor(clazz);
    let foundTraits = [];
    for (const handler of this.handlers) {
      const result = handler.detect(clazz, decorators);
      if (result === void 0) {
        continue;
      }
      const isPrimaryHandler = handler.precedence === HandlerPrecedence.PRIMARY;
      const isWeakHandler = handler.precedence === HandlerPrecedence.WEAK;
      const trait = Trait.pending(handler, result);
      foundTraits.push(trait);
      if (record === null) {
        record = {
          node: clazz,
          traits: [trait],
          metaDiagnostics: null,
          hasPrimaryHandler: isPrimaryHandler,
          hasWeakHandlers: isWeakHandler
        };
        this.classes.set(clazz, record);
        const sf = clazz.getSourceFile();
        if (!this.fileToClasses.has(sf)) {
          this.fileToClasses.set(sf, /* @__PURE__ */ new Set());
        }
        this.fileToClasses.get(sf).add(clazz);
      } else {
        if (!isWeakHandler && record.hasWeakHandlers) {
          record.traits = record.traits.filter((field) => field.handler.precedence !== HandlerPrecedence.WEAK);
          record.hasWeakHandlers = false;
        } else if (isWeakHandler && !record.hasWeakHandlers) {
          continue;
        }
        if (isPrimaryHandler && record.hasPrimaryHandler) {
          record.metaDiagnostics = [{
            category: ts9.DiagnosticCategory.Error,
            code: Number("-99" + ErrorCode.DECORATOR_COLLISION),
            file: getSourceFile(clazz),
            start: clazz.getStart(void 0, false),
            length: clazz.getWidth(),
            messageText: "Two incompatible decorators on class"
          }];
          record.traits = foundTraits = [];
          break;
        }
        record.traits.push(trait);
        record.hasPrimaryHandler = record.hasPrimaryHandler || isPrimaryHandler;
      }
    }
    return foundTraits.length > 0 ? foundTraits : null;
  }
  makeSymbolForTrait(handler, decl, analysis) {
    if (analysis === null) {
      return null;
    }
    const symbol = handler.symbol(decl, analysis);
    if (symbol !== null && this.semanticDepGraphUpdater !== null) {
      const isPrimary = handler.precedence === HandlerPrecedence.PRIMARY;
      if (!isPrimary) {
        throw new Error(`AssertionError: ${handler.name} returned a symbol but is not a primary handler.`);
      }
      this.semanticDepGraphUpdater.registerSymbol(symbol);
    }
    return symbol;
  }
  analyzeClass(clazz, preanalyzeQueue) {
    const traits = this.scanClassForTraits(clazz);
    if (traits === null) {
      return;
    }
    for (const trait of traits) {
      const analyze = () => this.analyzeTrait(clazz, trait);
      let preanalysis = null;
      if (preanalyzeQueue !== null && trait.handler.preanalyze !== void 0) {
        try {
          preanalysis = trait.handler.preanalyze(clazz, trait.detected.metadata) || null;
        } catch (err) {
          if (err instanceof FatalDiagnosticError) {
            trait.toAnalyzed(null, [err.toDiagnostic()], null);
            return;
          } else {
            throw err;
          }
        }
      }
      if (preanalysis !== null) {
        preanalyzeQueue.push(preanalysis.then(analyze));
      } else {
        analyze();
      }
    }
  }
  analyzeTrait(clazz, trait, flags) {
    var _a, _b, _c;
    if (trait.state !== TraitState.Pending) {
      throw new Error(`Attempt to analyze trait of ${clazz.name.text} in state ${TraitState[trait.state]} (expected DETECTED)`);
    }
    this.perf.eventCount(PerfEvent.TraitAnalyze);
    let result;
    try {
      result = trait.handler.analyze(clazz, trait.detected.metadata, flags);
    } catch (err) {
      if (err instanceof FatalDiagnosticError) {
        trait.toAnalyzed(null, [err.toDiagnostic()], null);
        return;
      } else {
        throw err;
      }
    }
    const symbol = this.makeSymbolForTrait(trait.handler, clazz, (_a = result.analysis) != null ? _a : null);
    if (result.analysis !== void 0 && trait.handler.register !== void 0) {
      trait.handler.register(clazz, result.analysis);
    }
    trait = trait.toAnalyzed((_b = result.analysis) != null ? _b : null, (_c = result.diagnostics) != null ? _c : null, symbol);
  }
  resolve() {
    var _a, _b;
    const classes = Array.from(this.classes.keys());
    for (const clazz of classes) {
      const record = this.classes.get(clazz);
      for (let trait of record.traits) {
        const handler = trait.handler;
        switch (trait.state) {
          case TraitState.Skipped:
            continue;
          case TraitState.Pending:
            throw new Error(`Resolving a trait that hasn't been analyzed: ${clazz.name.text} / ${Object.getPrototypeOf(trait.handler).constructor.name}`);
          case TraitState.Resolved:
            throw new Error(`Resolving an already resolved trait`);
        }
        if (trait.analysis === null) {
          continue;
        }
        if (handler.resolve === void 0) {
          trait = trait.toResolved(null, null);
          continue;
        }
        let result;
        try {
          result = handler.resolve(clazz, trait.analysis, trait.symbol);
        } catch (err) {
          if (err instanceof FatalDiagnosticError) {
            trait = trait.toResolved(null, [err.toDiagnostic()]);
            continue;
          } else {
            throw err;
          }
        }
        trait = trait.toResolved((_a = result.data) != null ? _a : null, (_b = result.diagnostics) != null ? _b : null);
        if (result.reexports !== void 0) {
          const fileName = clazz.getSourceFile().fileName;
          if (!this.reexportMap.has(fileName)) {
            this.reexportMap.set(fileName, /* @__PURE__ */ new Map());
          }
          const fileReexports = this.reexportMap.get(fileName);
          for (const reexport of result.reexports) {
            fileReexports.set(reexport.asAlias, [reexport.fromModule, reexport.symbolName]);
          }
        }
      }
    }
  }
  typeCheck(sf, ctx) {
    if (!this.fileToClasses.has(sf)) {
      return;
    }
    for (const clazz of this.fileToClasses.get(sf)) {
      const record = this.classes.get(clazz);
      for (const trait of record.traits) {
        if (trait.state !== TraitState.Resolved) {
          continue;
        } else if (trait.handler.typeCheck === void 0) {
          continue;
        }
        if (trait.resolution !== null) {
          trait.handler.typeCheck(ctx, clazz, trait.analysis, trait.resolution);
        }
      }
    }
  }
  extendedTemplateCheck(sf, extendedTemplateChecker) {
    const classes = this.fileToClasses.get(sf);
    if (classes === void 0) {
      return [];
    }
    const diagnostics = [];
    for (const clazz of classes) {
      if (!isNamedClassDeclaration(clazz)) {
        continue;
      }
      const record = this.classes.get(clazz);
      for (const trait of record.traits) {
        if (trait.handler.extendedTemplateCheck === void 0) {
          continue;
        }
        diagnostics.push(...trait.handler.extendedTemplateCheck(clazz, extendedTemplateChecker));
      }
    }
    return diagnostics;
  }
  index(ctx) {
    for (const clazz of this.classes.keys()) {
      const record = this.classes.get(clazz);
      for (const trait of record.traits) {
        if (trait.state !== TraitState.Resolved) {
          continue;
        } else if (trait.handler.index === void 0) {
          continue;
        }
        if (trait.resolution !== null) {
          trait.handler.index(ctx, clazz, trait.analysis, trait.resolution);
        }
      }
    }
  }
  xi18n(bundle) {
    for (const clazz of this.classes.keys()) {
      const record = this.classes.get(clazz);
      for (const trait of record.traits) {
        if (trait.state !== TraitState.Analyzed && trait.state !== TraitState.Resolved) {
          continue;
        } else if (trait.handler.xi18n === void 0) {
          continue;
        }
        if (trait.analysis !== null) {
          trait.handler.xi18n(bundle, clazz, trait.analysis);
        }
      }
    }
  }
  updateResources(clazz) {
    if (!this.reflector.isClass(clazz) || !this.classes.has(clazz)) {
      return;
    }
    const record = this.classes.get(clazz);
    for (const trait of record.traits) {
      if (trait.state !== TraitState.Resolved || trait.handler.updateResources === void 0) {
        continue;
      }
      trait.handler.updateResources(clazz, trait.analysis, trait.resolution);
    }
  }
  compile(clazz, constantPool) {
    const original = ts9.getOriginalNode(clazz);
    if (!this.reflector.isClass(clazz) || !this.reflector.isClass(original) || !this.classes.has(original)) {
      return null;
    }
    const record = this.classes.get(original);
    let res = [];
    for (const trait of record.traits) {
      if (trait.state !== TraitState.Resolved || trait.analysisDiagnostics !== null || trait.resolveDiagnostics !== null) {
        continue;
      }
      let compileRes;
      if (this.compilationMode === CompilationMode.PARTIAL && trait.handler.compilePartial !== void 0) {
        compileRes = trait.handler.compilePartial(clazz, trait.analysis, trait.resolution);
      } else {
        compileRes = trait.handler.compileFull(clazz, trait.analysis, trait.resolution, constantPool);
      }
      const compileMatchRes = compileRes;
      if (Array.isArray(compileMatchRes)) {
        for (const result of compileMatchRes) {
          if (!res.some((r) => r.name === result.name)) {
            res.push(result);
          }
        }
      } else if (!res.some((result) => result.name === compileMatchRes.name)) {
        res.push(compileMatchRes);
      }
    }
    this.dtsTransforms.getIvyDeclarationTransform(original.getSourceFile()).addFields(original, res);
    return res.length > 0 ? res : null;
  }
  decoratorsFor(node) {
    const original = ts9.getOriginalNode(node);
    if (!this.reflector.isClass(original) || !this.classes.has(original)) {
      return [];
    }
    const record = this.classes.get(original);
    const decorators = [];
    for (const trait of record.traits) {
      if (trait.state !== TraitState.Resolved) {
        continue;
      }
      if (trait.detected.trigger !== null && ts9.isDecorator(trait.detected.trigger)) {
        decorators.push(trait.detected.trigger);
      }
    }
    return decorators;
  }
  get diagnostics() {
    const diagnostics = [];
    for (const clazz of this.classes.keys()) {
      const record = this.classes.get(clazz);
      if (record.metaDiagnostics !== null) {
        diagnostics.push(...record.metaDiagnostics);
      }
      for (const trait of record.traits) {
        if ((trait.state === TraitState.Analyzed || trait.state === TraitState.Resolved) && trait.analysisDiagnostics !== null) {
          diagnostics.push(...trait.analysisDiagnostics);
        }
        if (trait.state === TraitState.Resolved && trait.resolveDiagnostics !== null) {
          diagnostics.push(...trait.resolveDiagnostics);
        }
      }
    }
    return diagnostics;
  }
  get exportStatements() {
    return this.reexportMap;
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/declaration.mjs
import ts11 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/utils.mjs
import ts10 from "typescript";
function addImports(importManager, sf, extraStatements = []) {
  const addedImports = importManager.getAllImports(sf.fileName).map((i) => {
    const qualifier = ts10.createIdentifier(i.qualifier.text);
    const importClause = ts10.createImportClause(void 0, ts10.createNamespaceImport(qualifier));
    const decl = ts10.createImportDeclaration(void 0, void 0, importClause, ts10.createLiteral(i.specifier));
    ts10.setOriginalNode(i.qualifier, decl);
    return decl;
  });
  const existingImports = sf.statements.filter((stmt) => isImportStatement(stmt));
  const body = sf.statements.filter((stmt) => !isImportStatement(stmt));
  if (addedImports.length > 0) {
    const fileoverviewAnchorStmt = ts10.createNotEmittedStatement(sf);
    return ts10.updateSourceFileNode(sf, ts10.createNodeArray([
      fileoverviewAnchorStmt,
      ...existingImports,
      ...addedImports,
      ...extraStatements,
      ...body
    ]));
  }
  return sf;
}
function isImportStatement(stmt) {
  return ts10.isImportDeclaration(stmt) || ts10.isImportEqualsDeclaration(stmt) || ts10.isNamespaceImport(stmt);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/declaration.mjs
var DtsTransformRegistry = class {
  constructor() {
    this.ivyDeclarationTransforms = /* @__PURE__ */ new Map();
  }
  getIvyDeclarationTransform(sf) {
    if (!this.ivyDeclarationTransforms.has(sf)) {
      this.ivyDeclarationTransforms.set(sf, new IvyDeclarationDtsTransform());
    }
    return this.ivyDeclarationTransforms.get(sf);
  }
  getAllTransforms(sf) {
    if (!sf.isDeclarationFile) {
      return null;
    }
    const originalSf = ts11.getOriginalNode(sf);
    let transforms = null;
    if (this.ivyDeclarationTransforms.has(originalSf)) {
      transforms = [];
      transforms.push(this.ivyDeclarationTransforms.get(originalSf));
    }
    return transforms;
  }
};
function declarationTransformFactory(transformRegistry, importRewriter, importPrefix) {
  return (context) => {
    const transformer = new DtsTransformer(context, importRewriter, importPrefix);
    return (fileOrBundle) => {
      if (ts11.isBundle(fileOrBundle)) {
        return fileOrBundle;
      }
      const transforms = transformRegistry.getAllTransforms(fileOrBundle);
      if (transforms === null) {
        return fileOrBundle;
      }
      return transformer.transform(fileOrBundle, transforms);
    };
  };
}
var DtsTransformer = class {
  constructor(ctx, importRewriter, importPrefix) {
    this.ctx = ctx;
    this.importRewriter = importRewriter;
    this.importPrefix = importPrefix;
  }
  transform(sf, transforms) {
    const imports = new ImportManager(this.importRewriter, this.importPrefix);
    const visitor = (node) => {
      if (ts11.isClassDeclaration(node)) {
        return this.transformClassDeclaration(node, transforms, imports);
      } else if (ts11.isFunctionDeclaration(node)) {
        return this.transformFunctionDeclaration(node, transforms, imports);
      } else {
        return ts11.visitEachChild(node, visitor, this.ctx);
      }
    };
    sf = ts11.visitNode(sf, visitor);
    return addImports(imports, sf);
  }
  transformClassDeclaration(clazz, transforms, imports) {
    let elements = clazz.members;
    let elementsChanged = false;
    for (const transform of transforms) {
      if (transform.transformClassElement !== void 0) {
        for (let i = 0; i < elements.length; i++) {
          const res = transform.transformClassElement(elements[i], imports);
          if (res !== elements[i]) {
            if (!elementsChanged) {
              elements = [...elements];
              elementsChanged = true;
            }
            elements[i] = res;
          }
        }
      }
    }
    let newClazz = clazz;
    for (const transform of transforms) {
      if (transform.transformClass !== void 0) {
        const inputMembers = clazz === newClazz ? elements : newClazz.members;
        newClazz = transform.transformClass(newClazz, inputMembers, imports);
      }
    }
    if (elementsChanged && clazz === newClazz) {
      newClazz = ts11.updateClassDeclaration(clazz, clazz.decorators, clazz.modifiers, clazz.name, clazz.typeParameters, clazz.heritageClauses, elements);
    }
    return newClazz;
  }
  transformFunctionDeclaration(declaration, transforms, imports) {
    let newDecl = declaration;
    for (const transform of transforms) {
      if (transform.transformFunctionDeclaration !== void 0) {
        newDecl = transform.transformFunctionDeclaration(newDecl, imports);
      }
    }
    return newDecl;
  }
};
var IvyDeclarationDtsTransform = class {
  constructor() {
    this.declarationFields = /* @__PURE__ */ new Map();
  }
  addFields(decl, fields) {
    this.declarationFields.set(decl, fields);
  }
  transformClass(clazz, members, imports) {
    const original = ts11.getOriginalNode(clazz);
    if (!this.declarationFields.has(original)) {
      return clazz;
    }
    const fields = this.declarationFields.get(original);
    const newMembers = fields.map((decl) => {
      const modifiers = [ts11.createModifier(ts11.SyntaxKind.StaticKeyword)];
      const typeRef = translateType(decl.type, imports);
      markForEmitAsSingleLine(typeRef);
      return ts11.createProperty(void 0, modifiers, decl.name, void 0, typeRef, void 0);
    });
    return ts11.updateClassDeclaration(clazz, clazz.decorators, clazz.modifiers, clazz.name, clazz.typeParameters, clazz.heritageClauses, [...members, ...newMembers]);
  }
};
function markForEmitAsSingleLine(node) {
  ts11.setEmitFlags(node, ts11.EmitFlags.SingleLine);
  ts11.forEachChild(node, markForEmitAsSingleLine);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/transform.mjs
import { ConstantPool } from "@angular/compiler";
import ts13 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/util/src/visitor.mjs
import ts12 from "typescript";
function visit(node, visitor, context) {
  return visitor._visit(node, context);
}
var Visitor = class {
  constructor() {
    this._before = /* @__PURE__ */ new Map();
    this._after = /* @__PURE__ */ new Map();
  }
  _visitListEntryNode(node, visitor) {
    const result = visitor(node);
    if (result.before !== void 0) {
      this._before.set(result.node, result.before);
    }
    if (result.after !== void 0) {
      this._after.set(result.node, result.after);
    }
    return result.node;
  }
  visitOtherNode(node) {
    return node;
  }
  _visit(node, context) {
    let visitedNode = null;
    node = ts12.visitEachChild(node, (child) => this._visit(child, context), context);
    if (ts12.isClassDeclaration(node)) {
      visitedNode = this._visitListEntryNode(node, (node2) => this.visitClassDeclaration(node2));
    } else {
      visitedNode = this.visitOtherNode(node);
    }
    if (hasStatements(visitedNode)) {
      visitedNode = this._maybeProcessStatements(visitedNode);
    }
    return visitedNode;
  }
  _maybeProcessStatements(node) {
    if (node.statements.every((stmt) => !this._before.has(stmt) && !this._after.has(stmt))) {
      return node;
    }
    const clone = ts12.getMutableClone(node);
    const newStatements = [];
    clone.statements.forEach((stmt) => {
      if (this._before.has(stmt)) {
        newStatements.push(...this._before.get(stmt));
        this._before.delete(stmt);
      }
      newStatements.push(stmt);
      if (this._after.has(stmt)) {
        newStatements.push(...this._after.get(stmt));
        this._after.delete(stmt);
      }
    });
    clone.statements = ts12.createNodeArray(newStatements, node.statements.hasTrailingComma);
    return clone;
  }
};
function hasStatements(node) {
  const block = node;
  return block.statements !== void 0 && Array.isArray(block.statements);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/transform/src/transform.mjs
var NO_DECORATORS = /* @__PURE__ */ new Set();
var CLOSURE_FILE_OVERVIEW_REGEXP = /\s+@fileoverview\s+/i;
function ivyTransformFactory(compilation, reflector, importRewriter, defaultImportTracker, perf, isCore, isClosureCompilerEnabled) {
  const recordWrappedNode = createRecorderFn(defaultImportTracker);
  return (context) => {
    return (file) => {
      return perf.inPhase(PerfPhase.Compile, () => transformIvySourceFile(compilation, context, reflector, importRewriter, file, isCore, isClosureCompilerEnabled, recordWrappedNode));
    };
  };
}
var IvyCompilationVisitor = class extends Visitor {
  constructor(compilation, constantPool) {
    super();
    this.compilation = compilation;
    this.constantPool = constantPool;
    this.classCompilationMap = /* @__PURE__ */ new Map();
  }
  visitClassDeclaration(node) {
    const result = this.compilation.compile(node, this.constantPool);
    if (result !== null) {
      this.classCompilationMap.set(node, result);
    }
    return { node };
  }
};
var IvyTransformationVisitor = class extends Visitor {
  constructor(compilation, classCompilationMap, reflector, importManager, recordWrappedNodeExpr, isClosureCompilerEnabled, isCore) {
    super();
    this.compilation = compilation;
    this.classCompilationMap = classCompilationMap;
    this.reflector = reflector;
    this.importManager = importManager;
    this.recordWrappedNodeExpr = recordWrappedNodeExpr;
    this.isClosureCompilerEnabled = isClosureCompilerEnabled;
    this.isCore = isCore;
  }
  visitClassDeclaration(node) {
    if (!this.classCompilationMap.has(node)) {
      return { node };
    }
    const translateOptions = {
      recordWrappedNode: this.recordWrappedNodeExpr,
      annotateForClosureCompiler: this.isClosureCompilerEnabled
    };
    const statements = [];
    const members = [...node.members];
    for (const field of this.classCompilationMap.get(node)) {
      const exprNode = translateExpression(field.initializer, this.importManager, translateOptions);
      const property = ts13.createProperty(void 0, [ts13.createToken(ts13.SyntaxKind.StaticKeyword)], field.name, void 0, void 0, exprNode);
      if (this.isClosureCompilerEnabled) {
        ts13.addSyntheticLeadingComment(property, ts13.SyntaxKind.MultiLineCommentTrivia, "* @nocollapse ", false);
      }
      field.statements.map((stmt) => translateStatement(stmt, this.importManager, translateOptions)).forEach((stmt) => statements.push(stmt));
      members.push(property);
    }
    node = ts13.updateClassDeclaration(node, maybeFilterDecorator(node.decorators, this.compilation.decoratorsFor(node)), node.modifiers, node.name, node.typeParameters, node.heritageClauses || [], members.map((member) => this._stripAngularDecorators(member)));
    return { node, after: statements };
  }
  _angularCoreDecorators(decl) {
    const decorators = this.reflector.getDecoratorsOfDeclaration(decl);
    if (decorators === null) {
      return NO_DECORATORS;
    }
    const coreDecorators = decorators.filter((dec) => this.isCore || isFromAngularCore(dec)).map((dec) => dec.node);
    if (coreDecorators.length > 0) {
      return new Set(coreDecorators);
    } else {
      return NO_DECORATORS;
    }
  }
  _nonCoreDecoratorsOnly(node) {
    if (node.decorators === void 0) {
      return void 0;
    }
    const coreDecorators = this._angularCoreDecorators(node);
    if (coreDecorators.size === node.decorators.length) {
      return void 0;
    } else if (coreDecorators.size === 0) {
      return node.decorators;
    }
    const filtered = node.decorators.filter((dec) => !coreDecorators.has(dec));
    if (filtered.length === 0) {
      return void 0;
    }
    const array = ts13.createNodeArray(filtered);
    array.pos = node.decorators.pos;
    array.end = node.decorators.end;
    return array;
  }
  _stripAngularDecorators(node) {
    if (ts13.isParameter(node)) {
      node = ts13.updateParameter(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.dotDotDotToken, node.name, node.questionToken, node.type, node.initializer);
    } else if (ts13.isMethodDeclaration(node) && node.decorators !== void 0) {
      node = ts13.updateMethod(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.asteriskToken, node.name, node.questionToken, node.typeParameters, node.parameters, node.type, node.body);
    } else if (ts13.isPropertyDeclaration(node) && node.decorators !== void 0) {
      node = ts13.updateProperty(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.name, node.questionToken, node.type, node.initializer);
    } else if (ts13.isGetAccessor(node)) {
      node = ts13.updateGetAccessor(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.name, node.parameters, node.type, node.body);
    } else if (ts13.isSetAccessor(node)) {
      node = ts13.updateSetAccessor(node, this._nonCoreDecoratorsOnly(node), node.modifiers, node.name, node.parameters, node.body);
    } else if (ts13.isConstructorDeclaration(node)) {
      const parameters = node.parameters.map((param) => this._stripAngularDecorators(param));
      node = ts13.updateConstructor(node, node.decorators, node.modifiers, parameters, node.body);
    }
    return node;
  }
};
function transformIvySourceFile(compilation, context, reflector, importRewriter, file, isCore, isClosureCompilerEnabled, recordWrappedNode) {
  const constantPool = new ConstantPool(isClosureCompilerEnabled);
  const importManager = new ImportManager(importRewriter);
  const compilationVisitor = new IvyCompilationVisitor(compilation, constantPool);
  visit(file, compilationVisitor, context);
  const transformationVisitor = new IvyTransformationVisitor(compilation, compilationVisitor.classCompilationMap, reflector, importManager, recordWrappedNode, isClosureCompilerEnabled, isCore);
  let sf = visit(file, transformationVisitor, context);
  const downlevelTranslatedCode = getLocalizeCompileTarget(context) < ts13.ScriptTarget.ES2015;
  const constants = constantPool.statements.map((stmt) => translateStatement(stmt, importManager, {
    recordWrappedNode,
    downlevelTaggedTemplates: downlevelTranslatedCode,
    downlevelVariableDeclarations: downlevelTranslatedCode,
    annotateForClosureCompiler: isClosureCompilerEnabled
  }));
  const fileOverviewMeta = isClosureCompilerEnabled ? getFileOverviewComment(sf.statements) : null;
  sf = addImports(importManager, sf, constants);
  if (fileOverviewMeta !== null) {
    setFileOverviewComment(sf, fileOverviewMeta);
  }
  return sf;
}
function getLocalizeCompileTarget(context) {
  const target = context.getCompilerOptions().target || ts13.ScriptTarget.ES2015;
  return target !== ts13.ScriptTarget.JSON ? target : ts13.ScriptTarget.ES2015;
}
function getFileOverviewComment(statements) {
  if (statements.length > 0) {
    const host = statements[0];
    let trailing = false;
    let comments = ts13.getSyntheticLeadingComments(host);
    if (!comments || comments.length === 0) {
      trailing = true;
      comments = ts13.getSyntheticTrailingComments(host);
    }
    if (comments && comments.length > 0 && CLOSURE_FILE_OVERVIEW_REGEXP.test(comments[0].text)) {
      return { comments, host, trailing };
    }
  }
  return null;
}
function setFileOverviewComment(sf, fileoverview) {
  const { comments, host, trailing } = fileoverview;
  if (sf.statements.length > 0 && host !== sf.statements[0]) {
    if (trailing) {
      ts13.setSyntheticTrailingComments(host, void 0);
    } else {
      ts13.setSyntheticLeadingComments(host, void 0);
    }
    ts13.setSyntheticLeadingComments(sf.statements[0], comments);
  }
}
function maybeFilterDecorator(decorators, toRemove) {
  if (decorators === void 0) {
    return void 0;
  }
  const filtered = decorators.filter((dec) => toRemove.find((decToRemove) => ts13.getOriginalNode(dec) === decToRemove) === void 0);
  if (filtered.length === 0) {
    return void 0;
  }
  return ts13.createNodeArray(filtered);
}
function isFromAngularCore(decorator) {
  return decorator.import !== null && decorator.import.from === "@angular/core";
}
function createRecorderFn(defaultImportTracker) {
  return (node) => {
    const importDecl = getDefaultImportDeclaration(node);
    if (importDecl !== null) {
      defaultImportTracker.recordUsedImport(importDecl);
    }
  };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/diagnostics.mjs
import ts14 from "typescript";
function createValueHasWrongTypeError(node, value, messageText) {
  var _a;
  let chainedMessage;
  let relatedInformation;
  if (value instanceof DynamicValue) {
    chainedMessage = "Value could not be determined statically.";
    relatedInformation = traceDynamicValue(node, value);
  } else if (value instanceof Reference) {
    const target = value.debugName !== null ? `'${value.debugName}'` : "an anonymous declaration";
    chainedMessage = `Value is a reference to ${target}.`;
    const referenceNode = (_a = identifierOfNode(value.node)) != null ? _a : value.node;
    relatedInformation = [makeRelatedInformation(referenceNode, "Reference is declared here.")];
  } else {
    chainedMessage = `Value is of type '${describeResolvedType(value)}'.`;
  }
  const chain = {
    messageText,
    category: ts14.DiagnosticCategory.Error,
    code: 0,
    next: [{
      messageText: chainedMessage,
      category: ts14.DiagnosticCategory.Message,
      code: 0
    }]
  };
  return new FatalDiagnosticError(ErrorCode.VALUE_HAS_WRONG_TYPE, node, chain, relatedInformation);
}
function getProviderDiagnostics(providerClasses, providersDeclaration, registry) {
  const diagnostics = [];
  for (const provider of providerClasses) {
    if (registry.isInjectable(provider.node)) {
      continue;
    }
    const contextNode = provider.getOriginForDiagnostics(providersDeclaration);
    diagnostics.push(makeDiagnostic(ErrorCode.UNDECORATED_PROVIDER, contextNode, `The class '${provider.node.name.text}' cannot be created via dependency injection, as it does not have an Angular decorator. This will result in an error at runtime.

Either add the @Injectable() decorator to '${provider.node.name.text}', or configure a different provider (such as a provider with 'useFactory').
`, [makeRelatedInformation(provider.node, `'${provider.node.name.text}' is declared here.`)]));
  }
  return diagnostics;
}
function getDirectiveDiagnostics(node, reader, evaluator, reflector, scopeRegistry, kind) {
  let diagnostics = [];
  const addDiagnostics = (more) => {
    if (more === null) {
      return;
    } else if (diagnostics === null) {
      diagnostics = Array.isArray(more) ? more : [more];
    } else if (Array.isArray(more)) {
      diagnostics.push(...more);
    } else {
      diagnostics.push(more);
    }
  };
  const duplicateDeclarations = scopeRegistry.getDuplicateDeclarations(node);
  if (duplicateDeclarations !== null) {
    addDiagnostics(makeDuplicateDeclarationError(node, duplicateDeclarations, kind));
  }
  addDiagnostics(checkInheritanceOfDirective(node, reader, reflector, evaluator));
  return diagnostics;
}
function getUndecoratedClassWithAngularFeaturesDiagnostic(node) {
  return makeDiagnostic(ErrorCode.UNDECORATED_CLASS_USING_ANGULAR_FEATURES, node.name, `Class is using Angular features but is not decorated. Please add an explicit Angular decorator.`);
}
function checkInheritanceOfDirective(node, reader, reflector, evaluator) {
  if (!reflector.isClass(node) || reflector.getConstructorParameters(node) !== null) {
    return null;
  }
  let baseClass = readBaseClass(node, reflector, evaluator);
  while (baseClass !== null) {
    if (baseClass === "dynamic") {
      return null;
    }
    const baseClassMeta = reader.getDirectiveMetadata(baseClass);
    if (baseClassMeta !== null) {
      return null;
    }
    const baseClassConstructorParams = reflector.getConstructorParameters(baseClass.node);
    const newParentClass = readBaseClass(baseClass.node, reflector, evaluator);
    if (baseClassConstructorParams !== null && baseClassConstructorParams.length > 0) {
      return getInheritedUndecoratedCtorDiagnostic(node, baseClass, reader);
    } else if (baseClassConstructorParams !== null || newParentClass === null) {
      return null;
    }
    baseClass = newParentClass;
  }
  return null;
}
function getInheritedUndecoratedCtorDiagnostic(node, baseClass, reader) {
  const subclassMeta = reader.getDirectiveMetadata(new Reference(node));
  const dirOrComp = subclassMeta.isComponent ? "Component" : "Directive";
  const baseClassName = baseClass.debugName;
  return makeDiagnostic(ErrorCode.DIRECTIVE_INHERITS_UNDECORATED_CTOR, node.name, `The ${dirOrComp.toLowerCase()} ${node.name.text} inherits its constructor from ${baseClassName}, but the latter does not have an Angular decorator of its own. Dependency injection will not be able to resolve the parameters of ${baseClassName}'s constructor. Either add a @Directive decorator to ${baseClassName}, or add an explicit constructor to ${node.name.text}.`);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/directive.mjs
import { compileClassMetadata, compileDeclareClassMetadata, compileDeclareDirectiveFromMetadata, compileDirectiveFromMetadata, createMayBeForwardRefExpression, emitDistinctChangesOnlyDefaultValue, ExternalExpr as ExternalExpr3, FactoryTarget, getSafePropertyAccessString, makeBindingParser, parseHostBindings, verifyHostBindings, WrappedNodeExpr as WrappedNodeExpr3 } from "@angular/compiler";
import ts16 from "typescript";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/factory.mjs
import { compileDeclareFactoryFunction, compileFactoryFunction } from "@angular/compiler";
function compileNgFactoryDefField(metadata) {
  const res = compileFactoryFunction(metadata);
  return { name: "\u0275fac", initializer: res.expression, statements: res.statements, type: res.type };
}
function compileDeclareFactory(metadata) {
  const res = compileDeclareFactoryFunction(metadata);
  return { name: "\u0275fac", initializer: res.expression, statements: res.statements, type: res.type };
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/metadata.mjs
import { FunctionExpr, LiteralArrayExpr, LiteralExpr as LiteralExpr2, literalMap, ReturnStatement, WrappedNodeExpr as WrappedNodeExpr2 } from "@angular/compiler";
import ts15 from "typescript";
function extractClassMetadata(clazz, reflection, isCore, annotateForClosureCompiler, angularDecoratorTransform = (dec) => dec) {
  if (!reflection.isClass(clazz)) {
    return null;
  }
  const id = reflection.getAdjacentNameOfClass(clazz);
  const classDecorators = reflection.getDecoratorsOfDeclaration(clazz);
  if (classDecorators === null) {
    return null;
  }
  const ngClassDecorators = classDecorators.filter((dec) => isAngularDecorator2(dec, isCore)).map((decorator) => decoratorToMetadata(angularDecoratorTransform(decorator), annotateForClosureCompiler)).map((decorator) => removeIdentifierReferences(decorator, id.text));
  if (ngClassDecorators.length === 0) {
    return null;
  }
  const metaDecorators = new WrappedNodeExpr2(ts15.createArrayLiteral(ngClassDecorators));
  let metaCtorParameters = null;
  const classCtorParameters = reflection.getConstructorParameters(clazz);
  if (classCtorParameters !== null) {
    const ctorParameters = classCtorParameters.map((param) => ctorParameterToMetadata(param, isCore));
    metaCtorParameters = new FunctionExpr([], [
      new ReturnStatement(new LiteralArrayExpr(ctorParameters))
    ]);
  }
  let metaPropDecorators = null;
  const classMembers = reflection.getMembersOfClass(clazz).filter((member) => !member.isStatic && member.decorators !== null && member.decorators.length > 0);
  const duplicateDecoratedMemberNames = classMembers.map((member) => member.name).filter((name, i, arr) => arr.indexOf(name) < i);
  if (duplicateDecoratedMemberNames.length > 0) {
    throw new Error(`Duplicate decorated properties found on class '${clazz.name.text}': ` + duplicateDecoratedMemberNames.join(", "));
  }
  const decoratedMembers = classMembers.map((member) => {
    var _a;
    return classMemberToMetadata((_a = member.nameNode) != null ? _a : member.name, member.decorators, isCore);
  });
  if (decoratedMembers.length > 0) {
    metaPropDecorators = new WrappedNodeExpr2(ts15.createObjectLiteral(decoratedMembers));
  }
  return {
    type: new WrappedNodeExpr2(id),
    decorators: metaDecorators,
    ctorParameters: metaCtorParameters,
    propDecorators: metaPropDecorators
  };
}
function ctorParameterToMetadata(param, isCore) {
  const type = param.typeValueReference.kind !== 2 ? valueReferenceToExpression(param.typeValueReference) : new LiteralExpr2(void 0);
  const mapEntries = [
    { key: "type", value: type, quoted: false }
  ];
  if (param.decorators !== null) {
    const ngDecorators = param.decorators.filter((dec) => isAngularDecorator2(dec, isCore)).map((decorator) => decoratorToMetadata(decorator));
    const value = new WrappedNodeExpr2(ts15.createArrayLiteral(ngDecorators));
    mapEntries.push({ key: "decorators", value, quoted: false });
  }
  return literalMap(mapEntries);
}
function classMemberToMetadata(name, decorators, isCore) {
  const ngDecorators = decorators.filter((dec) => isAngularDecorator2(dec, isCore)).map((decorator) => decoratorToMetadata(decorator));
  const decoratorMeta = ts15.createArrayLiteral(ngDecorators);
  return ts15.createPropertyAssignment(name, decoratorMeta);
}
function decoratorToMetadata(decorator, wrapFunctionsInParens) {
  if (decorator.identifier === null) {
    throw new Error("Illegal state: synthesized decorator cannot be emitted in class metadata.");
  }
  const properties = [
    ts15.createPropertyAssignment("type", ts15.getMutableClone(decorator.identifier))
  ];
  if (decorator.args !== null && decorator.args.length > 0) {
    const args = decorator.args.map((arg) => {
      const expr = ts15.getMutableClone(arg);
      return wrapFunctionsInParens ? wrapFunctionExpressionsInParens(expr) : expr;
    });
    properties.push(ts15.createPropertyAssignment("args", ts15.createArrayLiteral(args)));
  }
  return ts15.createObjectLiteral(properties, true);
}
function isAngularDecorator2(decorator, isCore) {
  return isCore || decorator.import !== null && decorator.import.from === "@angular/core";
}
function removeIdentifierReferences(node, name) {
  const result = ts15.transform(node, [(context) => (root) => ts15.visitNode(root, function walk(current) {
    return ts15.isIdentifier(current) && current.text === name ? ts15.createIdentifier(current.text) : ts15.visitEachChild(current, walk, context);
  })]);
  return result.transformed[0];
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/directive.mjs
var EMPTY_OBJECT = {};
var FIELD_DECORATORS = [
  "Input",
  "Output",
  "ViewChild",
  "ViewChildren",
  "ContentChild",
  "ContentChildren",
  "HostBinding",
  "HostListener"
];
var LIFECYCLE_HOOKS = /* @__PURE__ */ new Set([
  "ngOnChanges",
  "ngOnInit",
  "ngOnDestroy",
  "ngDoCheck",
  "ngAfterViewInit",
  "ngAfterViewChecked",
  "ngAfterContentInit",
  "ngAfterContentChecked"
]);
var DirectiveSymbol = class extends SemanticSymbol {
  constructor(decl, selector, inputs, outputs, exportAs, typeCheckMeta, typeParameters) {
    super(decl);
    this.selector = selector;
    this.inputs = inputs;
    this.outputs = outputs;
    this.exportAs = exportAs;
    this.typeCheckMeta = typeCheckMeta;
    this.typeParameters = typeParameters;
    this.baseClass = null;
  }
  isPublicApiAffected(previousSymbol) {
    if (!(previousSymbol instanceof DirectiveSymbol)) {
      return true;
    }
    return this.selector !== previousSymbol.selector || !isArrayEqual(this.inputs.propertyNames, previousSymbol.inputs.propertyNames) || !isArrayEqual(this.outputs.propertyNames, previousSymbol.outputs.propertyNames) || !isArrayEqual(this.exportAs, previousSymbol.exportAs);
  }
  isTypeCheckApiAffected(previousSymbol) {
    if (this.isPublicApiAffected(previousSymbol)) {
      return true;
    }
    if (!(previousSymbol instanceof DirectiveSymbol)) {
      return true;
    }
    if (!isArrayEqual(Array.from(this.inputs), Array.from(previousSymbol.inputs), isInputMappingEqual) || !isArrayEqual(Array.from(this.outputs), Array.from(previousSymbol.outputs), isInputMappingEqual)) {
      return true;
    }
    if (!areTypeParametersEqual(this.typeParameters, previousSymbol.typeParameters)) {
      return true;
    }
    if (!isTypeCheckMetaEqual(this.typeCheckMeta, previousSymbol.typeCheckMeta)) {
      return true;
    }
    if (!isBaseClassEqual(this.baseClass, previousSymbol.baseClass)) {
      return true;
    }
    return false;
  }
};
function isInputMappingEqual(current, previous) {
  return current[0] === previous[0] && current[1] === previous[1];
}
function isTypeCheckMetaEqual(current, previous) {
  if (current.hasNgTemplateContextGuard !== previous.hasNgTemplateContextGuard) {
    return false;
  }
  if (current.isGeneric !== previous.isGeneric) {
    return false;
  }
  if (!isArrayEqual(current.ngTemplateGuards, previous.ngTemplateGuards, isTemplateGuardEqual)) {
    return false;
  }
  if (!isSetEqual(current.coercedInputFields, previous.coercedInputFields)) {
    return false;
  }
  if (!isSetEqual(current.restrictedInputFields, previous.restrictedInputFields)) {
    return false;
  }
  if (!isSetEqual(current.stringLiteralInputFields, previous.stringLiteralInputFields)) {
    return false;
  }
  if (!isSetEqual(current.undeclaredInputFields, previous.undeclaredInputFields)) {
    return false;
  }
  return true;
}
function isTemplateGuardEqual(current, previous) {
  return current.inputName === previous.inputName && current.type === previous.type;
}
function isBaseClassEqual(current, previous) {
  if (current === null || previous === null) {
    return current === previous;
  }
  return isSymbolEqual(current, previous);
}
var DirectiveDecoratorHandler = class {
  constructor(reflector, evaluator, metaRegistry, scopeRegistry, metaReader, injectableRegistry, isCore, semanticDepGraphUpdater, annotateForClosureCompiler, compileUndecoratedClassesWithAngularFeatures, perf) {
    this.reflector = reflector;
    this.evaluator = evaluator;
    this.metaRegistry = metaRegistry;
    this.scopeRegistry = scopeRegistry;
    this.metaReader = metaReader;
    this.injectableRegistry = injectableRegistry;
    this.isCore = isCore;
    this.semanticDepGraphUpdater = semanticDepGraphUpdater;
    this.annotateForClosureCompiler = annotateForClosureCompiler;
    this.compileUndecoratedClassesWithAngularFeatures = compileUndecoratedClassesWithAngularFeatures;
    this.perf = perf;
    this.precedence = HandlerPrecedence.PRIMARY;
    this.name = DirectiveDecoratorHandler.name;
  }
  detect(node, decorators) {
    if (!decorators) {
      const angularField = this.findClassFieldWithAngularFeatures(node);
      return angularField ? { trigger: angularField.node, decorator: null, metadata: null } : void 0;
    } else {
      const decorator = findAngularDecorator(decorators, "Directive", this.isCore);
      return decorator ? { trigger: decorator.node, decorator, metadata: decorator } : void 0;
    }
  }
  analyze(node, decorator, flags = HandlerFlags.NONE) {
    if (this.compileUndecoratedClassesWithAngularFeatures === false && decorator === null) {
      return { diagnostics: [getUndecoratedClassWithAngularFeaturesDiagnostic(node)] };
    }
    this.perf.eventCount(PerfEvent.AnalyzeDirective);
    const directiveResult = extractDirectiveMetadata(node, decorator, this.reflector, this.evaluator, this.isCore, flags, this.annotateForClosureCompiler);
    if (directiveResult === void 0) {
      return {};
    }
    const analysis = directiveResult.metadata;
    let providersRequiringFactory = null;
    if (directiveResult !== void 0 && directiveResult.decorator.has("providers")) {
      providersRequiringFactory = resolveProvidersRequiringFactory(directiveResult.decorator.get("providers"), this.reflector, this.evaluator);
    }
    return {
      analysis: {
        inputs: directiveResult.inputs,
        outputs: directiveResult.outputs,
        meta: analysis,
        classMetadata: extractClassMetadata(node, this.reflector, this.isCore, this.annotateForClosureCompiler),
        baseClass: readBaseClass(node, this.reflector, this.evaluator),
        typeCheckMeta: extractDirectiveTypeCheckMeta(node, directiveResult.inputs, this.reflector),
        providersRequiringFactory,
        isPoisoned: false,
        isStructural: directiveResult.isStructural
      }
    };
  }
  symbol(node, analysis) {
    const typeParameters = extractSemanticTypeParameters(node);
    return new DirectiveSymbol(node, analysis.meta.selector, analysis.inputs, analysis.outputs, analysis.meta.exportAs, analysis.typeCheckMeta, typeParameters);
  }
  register(node, analysis) {
    const ref = new Reference(node);
    this.metaRegistry.registerDirectiveMetadata(__spreadProps(__spreadValues({
      type: MetaType.Directive,
      ref,
      name: node.name.text,
      selector: analysis.meta.selector,
      exportAs: analysis.meta.exportAs,
      inputs: analysis.inputs,
      outputs: analysis.outputs,
      queries: analysis.meta.queries.map((query) => query.propertyName),
      isComponent: false,
      baseClass: analysis.baseClass
    }, analysis.typeCheckMeta), {
      isPoisoned: analysis.isPoisoned,
      isStructural: analysis.isStructural,
      animationTriggerNames: null
    }));
    this.injectableRegistry.registerInjectable(node);
  }
  resolve(node, analysis, symbol) {
    if (this.semanticDepGraphUpdater !== null && analysis.baseClass instanceof Reference) {
      symbol.baseClass = this.semanticDepGraphUpdater.getSymbol(analysis.baseClass.node);
    }
    const diagnostics = [];
    if (analysis.providersRequiringFactory !== null && analysis.meta.providers instanceof WrappedNodeExpr3) {
      const providerDiagnostics = getProviderDiagnostics(analysis.providersRequiringFactory, analysis.meta.providers.node, this.injectableRegistry);
      diagnostics.push(...providerDiagnostics);
    }
    const directiveDiagnostics = getDirectiveDiagnostics(node, this.metaReader, this.evaluator, this.reflector, this.scopeRegistry, "Directive");
    if (directiveDiagnostics !== null) {
      diagnostics.push(...directiveDiagnostics);
    }
    return { diagnostics: diagnostics.length > 0 ? diagnostics : void 0 };
  }
  compileFull(node, analysis, resolution, pool) {
    const fac = compileNgFactoryDefField(toFactoryMetadata(analysis.meta, FactoryTarget.Directive));
    const def = compileDirectiveFromMetadata(analysis.meta, pool, makeBindingParser());
    const classMetadata = analysis.classMetadata !== null ? compileClassMetadata(analysis.classMetadata).toStmt() : null;
    return compileResults(fac, def, classMetadata, "\u0275dir");
  }
  compilePartial(node, analysis, resolution) {
    const fac = compileDeclareFactory(toFactoryMetadata(analysis.meta, FactoryTarget.Directive));
    const def = compileDeclareDirectiveFromMetadata(analysis.meta);
    const classMetadata = analysis.classMetadata !== null ? compileDeclareClassMetadata(analysis.classMetadata).toStmt() : null;
    return compileResults(fac, def, classMetadata, "\u0275dir");
  }
  findClassFieldWithAngularFeatures(node) {
    return this.reflector.getMembersOfClass(node).find((member) => {
      if (!member.isStatic && member.kind === ClassMemberKind.Method && LIFECYCLE_HOOKS.has(member.name)) {
        return true;
      }
      if (member.decorators) {
        return member.decorators.some((decorator) => FIELD_DECORATORS.some((decoratorName) => isAngularDecorator(decorator, decoratorName, this.isCore)));
      }
      return false;
    });
  }
};
function extractDirectiveMetadata(clazz, decorator, reflector, evaluator, isCore, flags, annotateForClosureCompiler, defaultSelector = null) {
  let directive;
  if (decorator === null || decorator.args === null || decorator.args.length === 0) {
    directive = /* @__PURE__ */ new Map();
  } else if (decorator.args.length !== 1) {
    throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(decorator), `Incorrect number of arguments to @${decorator.name} decorator`);
  } else {
    const meta = unwrapExpression(decorator.args[0]);
    if (!ts16.isObjectLiteralExpression(meta)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, `@${decorator.name} argument must be an object literal`);
    }
    directive = reflectObjectLiteral(meta);
  }
  if (directive.has("jit")) {
    return void 0;
  }
  const members = reflector.getMembersOfClass(clazz);
  const decoratedElements = members.filter((member) => !member.isStatic && member.decorators !== null);
  const coreModule = isCore ? void 0 : "@angular/core";
  const inputsFromMeta = parseFieldToPropertyMapping(directive, "inputs", evaluator);
  const inputsFromFields = parseDecoratedFields(filterToMembersWithDecorator(decoratedElements, "Input", coreModule), evaluator, resolveInput);
  const outputsFromMeta = parseFieldToPropertyMapping(directive, "outputs", evaluator);
  const outputsFromFields = parseDecoratedFields(filterToMembersWithDecorator(decoratedElements, "Output", coreModule), evaluator, resolveOutput);
  const contentChildFromFields = queriesFromFields(filterToMembersWithDecorator(decoratedElements, "ContentChild", coreModule), reflector, evaluator);
  const contentChildrenFromFields = queriesFromFields(filterToMembersWithDecorator(decoratedElements, "ContentChildren", coreModule), reflector, evaluator);
  const queries = [...contentChildFromFields, ...contentChildrenFromFields];
  const viewChildFromFields = queriesFromFields(filterToMembersWithDecorator(decoratedElements, "ViewChild", coreModule), reflector, evaluator);
  const viewChildrenFromFields = queriesFromFields(filterToMembersWithDecorator(decoratedElements, "ViewChildren", coreModule), reflector, evaluator);
  const viewQueries = [...viewChildFromFields, ...viewChildrenFromFields];
  if (directive.has("queries")) {
    const queriesFromDecorator = extractQueriesFromDecorator(directive.get("queries"), reflector, evaluator, isCore);
    queries.push(...queriesFromDecorator.content);
    viewQueries.push(...queriesFromDecorator.view);
  }
  let selector = defaultSelector;
  if (directive.has("selector")) {
    const expr = directive.get("selector");
    const resolved = evaluator.evaluate(expr);
    if (typeof resolved !== "string") {
      throw createValueHasWrongTypeError(expr, resolved, `selector must be a string`);
    }
    selector = resolved === "" ? defaultSelector : resolved;
    if (!selector) {
      throw new FatalDiagnosticError(ErrorCode.DIRECTIVE_MISSING_SELECTOR, expr, `Directive ${clazz.name.text} has no selector, please add it!`);
    }
  }
  const host = extractHostBindings(decoratedElements, evaluator, coreModule, directive);
  const providers = directive.has("providers") ? new WrappedNodeExpr3(annotateForClosureCompiler ? wrapFunctionExpressionsInParens(directive.get("providers")) : directive.get("providers")) : null;
  const usesOnChanges = members.some((member) => !member.isStatic && member.kind === ClassMemberKind.Method && member.name === "ngOnChanges");
  let exportAs = null;
  if (directive.has("exportAs")) {
    const expr = directive.get("exportAs");
    const resolved = evaluator.evaluate(expr);
    if (typeof resolved !== "string") {
      throw createValueHasWrongTypeError(expr, resolved, `exportAs must be a string`);
    }
    exportAs = resolved.split(",").map((part) => part.trim());
  }
  const rawCtorDeps = getConstructorDependencies(clazz, reflector, isCore);
  const ctorDeps = selector !== null ? validateConstructorDependencies(clazz, rawCtorDeps) : unwrapConstructorDependencies(rawCtorDeps);
  const isStructural = ctorDeps !== null && ctorDeps !== "invalid" && ctorDeps.some((dep) => dep.token instanceof ExternalExpr3 && dep.token.value.moduleName === "@angular/core" && dep.token.value.name === "TemplateRef");
  const usesInheritance = reflector.hasBaseClass(clazz);
  const type = wrapTypeReference(reflector, clazz);
  const internalType = new WrappedNodeExpr3(reflector.getInternalNameOfClass(clazz));
  const inputs = ClassPropertyMapping.fromMappedObject(__spreadValues(__spreadValues({}, inputsFromMeta), inputsFromFields));
  const outputs = ClassPropertyMapping.fromMappedObject(__spreadValues(__spreadValues({}, outputsFromMeta), outputsFromFields));
  const metadata = {
    name: clazz.name.text,
    deps: ctorDeps,
    host,
    lifecycle: {
      usesOnChanges
    },
    inputs: inputs.toJointMappedObject(),
    outputs: outputs.toDirectMappedObject(),
    queries,
    viewQueries,
    selector,
    fullInheritance: !!(flags & HandlerFlags.FULL_INHERITANCE),
    type,
    internalType,
    typeArgumentCount: reflector.getGenericArityOfClass(clazz) || 0,
    typeSourceSpan: createSourceSpan(clazz.name),
    usesInheritance,
    exportAs,
    providers
  };
  return {
    decorator: directive,
    metadata,
    inputs,
    outputs,
    isStructural
  };
}
function extractQueryMetadata(exprNode, name, args, propertyName, reflector, evaluator) {
  if (args.length === 0) {
    throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, exprNode, `@${name} must have arguments`);
  }
  const first = name === "ViewChild" || name === "ContentChild";
  const forwardReferenceTarget = tryUnwrapForwardRef(args[0], reflector);
  const node = forwardReferenceTarget != null ? forwardReferenceTarget : args[0];
  const arg = evaluator.evaluate(node);
  let isStatic = false;
  let predicate = null;
  if (arg instanceof Reference || arg instanceof DynamicValue) {
    predicate = createMayBeForwardRefExpression(new WrappedNodeExpr3(node), forwardReferenceTarget !== null ? 2 : 0);
  } else if (typeof arg === "string") {
    predicate = [arg];
  } else if (isStringArrayOrDie(arg, `@${name} predicate`, node)) {
    predicate = arg;
  } else {
    throw createValueHasWrongTypeError(node, arg, `@${name} predicate cannot be interpreted`);
  }
  let read = null;
  let descendants = name !== "ContentChildren";
  let emitDistinctChangesOnly = emitDistinctChangesOnlyDefaultValue;
  if (args.length === 2) {
    const optionsExpr = unwrapExpression(args[1]);
    if (!ts16.isObjectLiteralExpression(optionsExpr)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARG_NOT_LITERAL, optionsExpr, `@${name} options must be an object literal`);
    }
    const options = reflectObjectLiteral(optionsExpr);
    if (options.has("read")) {
      read = new WrappedNodeExpr3(options.get("read"));
    }
    if (options.has("descendants")) {
      const descendantsExpr = options.get("descendants");
      const descendantsValue = evaluator.evaluate(descendantsExpr);
      if (typeof descendantsValue !== "boolean") {
        throw createValueHasWrongTypeError(descendantsExpr, descendantsValue, `@${name} options.descendants must be a boolean`);
      }
      descendants = descendantsValue;
    }
    if (options.has("emitDistinctChangesOnly")) {
      const emitDistinctChangesOnlyExpr = options.get("emitDistinctChangesOnly");
      const emitDistinctChangesOnlyValue = evaluator.evaluate(emitDistinctChangesOnlyExpr);
      if (typeof emitDistinctChangesOnlyValue !== "boolean") {
        throw createValueHasWrongTypeError(emitDistinctChangesOnlyExpr, emitDistinctChangesOnlyValue, `@${name} options.emitDistinctChangesOnly must be a boolean`);
      }
      emitDistinctChangesOnly = emitDistinctChangesOnlyValue;
    }
    if (options.has("static")) {
      const staticValue = evaluator.evaluate(options.get("static"));
      if (typeof staticValue !== "boolean") {
        throw createValueHasWrongTypeError(node, staticValue, `@${name} options.static must be a boolean`);
      }
      isStatic = staticValue;
    }
  } else if (args.length > 2) {
    throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, node, `@${name} has too many arguments`);
  }
  return {
    propertyName,
    predicate,
    first,
    descendants,
    read,
    static: isStatic,
    emitDistinctChangesOnly
  };
}
function extractQueriesFromDecorator(queryData, reflector, evaluator, isCore) {
  const content = [], view = [];
  if (!ts16.isObjectLiteralExpression(queryData)) {
    throw new FatalDiagnosticError(ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, "Decorator queries metadata must be an object literal");
  }
  reflectObjectLiteral(queryData).forEach((queryExpr, propertyName) => {
    queryExpr = unwrapExpression(queryExpr);
    if (!ts16.isNewExpression(queryExpr)) {
      throw new FatalDiagnosticError(ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, "Decorator query metadata must be an instance of a query type");
    }
    const queryType = ts16.isPropertyAccessExpression(queryExpr.expression) ? queryExpr.expression.name : queryExpr.expression;
    if (!ts16.isIdentifier(queryType)) {
      throw new FatalDiagnosticError(ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, "Decorator query metadata must be an instance of a query type");
    }
    const type = reflector.getImportOfIdentifier(queryType);
    if (type === null || !isCore && type.from !== "@angular/core" || !QUERY_TYPES.has(type.name)) {
      throw new FatalDiagnosticError(ErrorCode.VALUE_HAS_WRONG_TYPE, queryData, "Decorator query metadata must be an instance of a query type");
    }
    const query = extractQueryMetadata(queryExpr, type.name, queryExpr.arguments || [], propertyName, reflector, evaluator);
    if (type.name.startsWith("Content")) {
      content.push(query);
    } else {
      view.push(query);
    }
  });
  return { content, view };
}
function isStringArrayOrDie(value, name, node) {
  if (!Array.isArray(value)) {
    return false;
  }
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== "string") {
      throw createValueHasWrongTypeError(node, value[i], `Failed to resolve ${name} at position ${i} to a string`);
    }
  }
  return true;
}
function parseFieldArrayValue(directive, field, evaluator) {
  if (!directive.has(field)) {
    return null;
  }
  const expression = directive.get(field);
  const value = evaluator.evaluate(expression);
  if (!isStringArrayOrDie(value, field, expression)) {
    throw createValueHasWrongTypeError(expression, value, `Failed to resolve @Directive.${field} to a string array`);
  }
  return value;
}
function parseFieldToPropertyMapping(directive, field, evaluator) {
  const metaValues = parseFieldArrayValue(directive, field, evaluator);
  if (!metaValues) {
    return EMPTY_OBJECT;
  }
  return metaValues.reduce((results, value) => {
    const [field2, property] = value.split(":", 2).map((str) => str.trim());
    results[field2] = property || field2;
    return results;
  }, {});
}
function parseDecoratedFields(fields, evaluator, mapValueResolver) {
  return fields.reduce((results, field) => {
    const fieldName = field.member.name;
    field.decorators.forEach((decorator) => {
      if (decorator.args == null || decorator.args.length === 0) {
        results[fieldName] = fieldName;
      } else if (decorator.args.length === 1) {
        const property = evaluator.evaluate(decorator.args[0]);
        if (typeof property !== "string") {
          throw createValueHasWrongTypeError(Decorator.nodeForError(decorator), property, `@${decorator.name} decorator argument must resolve to a string`);
        }
        results[fieldName] = mapValueResolver(property, fieldName);
      } else {
        throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(decorator), `@${decorator.name} can have at most one argument, got ${decorator.args.length} argument(s)`);
      }
    });
    return results;
  }, {});
}
function resolveInput(publicName, internalName) {
  return [publicName, internalName];
}
function resolveOutput(publicName, internalName) {
  return publicName;
}
function queriesFromFields(fields, reflector, evaluator) {
  return fields.map(({ member, decorators }) => {
    const decorator = decorators[0];
    const node = member.node || Decorator.nodeForError(decorator);
    if (member.decorators.some((v) => v.name === "Input")) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_COLLISION, node, "Cannot combine @Input decorators with query decorators");
    }
    if (decorators.length !== 1) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_COLLISION, node, "Cannot have multiple query decorators on the same class member");
    } else if (!isPropertyTypeMember(member)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_UNEXPECTED, node, "Query decorator must go on a property-type member");
    }
    return extractQueryMetadata(node, decorator.name, decorator.args || [], member.name, reflector, evaluator);
  });
}
function isPropertyTypeMember(member) {
  return member.kind === ClassMemberKind.Getter || member.kind === ClassMemberKind.Setter || member.kind === ClassMemberKind.Property;
}
function evaluateHostExpressionBindings(hostExpr, evaluator) {
  const hostMetaMap = evaluator.evaluate(hostExpr);
  if (!(hostMetaMap instanceof Map)) {
    throw createValueHasWrongTypeError(hostExpr, hostMetaMap, `Decorator host metadata must be an object`);
  }
  const hostMetadata = {};
  hostMetaMap.forEach((value, key) => {
    if (value instanceof EnumValue) {
      value = value.resolved;
    }
    if (typeof key !== "string") {
      throw createValueHasWrongTypeError(hostExpr, key, `Decorator host metadata must be a string -> string object, but found unparseable key`);
    }
    if (typeof value == "string") {
      hostMetadata[key] = value;
    } else if (value instanceof DynamicValue) {
      hostMetadata[key] = new WrappedNodeExpr3(value.node);
    } else {
      throw createValueHasWrongTypeError(hostExpr, value, `Decorator host metadata must be a string -> string object, but found unparseable value`);
    }
  });
  const bindings = parseHostBindings(hostMetadata);
  const errors = verifyHostBindings(bindings, createSourceSpan(hostExpr));
  if (errors.length > 0) {
    throw new FatalDiagnosticError(ErrorCode.HOST_BINDING_PARSE_ERROR, hostExpr, errors.map((error) => error.msg).join("\n"));
  }
  return bindings;
}
function extractHostBindings(members, evaluator, coreModule, metadata) {
  let bindings;
  if (metadata && metadata.has("host")) {
    bindings = evaluateHostExpressionBindings(metadata.get("host"), evaluator);
  } else {
    bindings = parseHostBindings({});
  }
  filterToMembersWithDecorator(members, "HostBinding", coreModule).forEach(({ member, decorators }) => {
    decorators.forEach((decorator) => {
      let hostPropertyName = member.name;
      if (decorator.args !== null && decorator.args.length > 0) {
        if (decorator.args.length !== 1) {
          throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(decorator), `@HostBinding can have at most one argument, got ${decorator.args.length} argument(s)`);
        }
        const resolved = evaluator.evaluate(decorator.args[0]);
        if (typeof resolved !== "string") {
          throw createValueHasWrongTypeError(Decorator.nodeForError(decorator), resolved, `@HostBinding's argument must be a string`);
        }
        hostPropertyName = resolved;
      }
      bindings.properties[hostPropertyName] = getSafePropertyAccessString("this", member.name);
    });
  });
  filterToMembersWithDecorator(members, "HostListener", coreModule).forEach(({ member, decorators }) => {
    decorators.forEach((decorator) => {
      let eventName = member.name;
      let args = [];
      if (decorator.args !== null && decorator.args.length > 0) {
        if (decorator.args.length > 2) {
          throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, decorator.args[2], `@HostListener can have at most two arguments`);
        }
        const resolved = evaluator.evaluate(decorator.args[0]);
        if (typeof resolved !== "string") {
          throw createValueHasWrongTypeError(decorator.args[0], resolved, `@HostListener's event name argument must be a string`);
        }
        eventName = resolved;
        if (decorator.args.length === 2) {
          const expression = decorator.args[1];
          const resolvedArgs = evaluator.evaluate(decorator.args[1]);
          if (!isStringArrayOrDie(resolvedArgs, "@HostListener.args", expression)) {
            throw createValueHasWrongTypeError(decorator.args[1], resolvedArgs, `@HostListener's second argument must be a string array`);
          }
          args = resolvedArgs;
        }
      }
      bindings.listeners[eventName] = `${member.name}(${args.join(",")})`;
    });
  });
  return bindings;
}
var QUERY_TYPES = /* @__PURE__ */ new Set([
  "ContentChild",
  "ContentChildren",
  "ViewChild",
  "ViewChildren"
]);

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/ng_module.mjs
import { compileClassMetadata as compileClassMetadata2, compileDeclareClassMetadata as compileDeclareClassMetadata2, compileDeclareInjectorFromMetadata, compileDeclareNgModuleFromMetadata, compileInjector, compileNgModule, CUSTOM_ELEMENTS_SCHEMA, ExternalExpr as ExternalExpr4, FactoryTarget as FactoryTarget2, InvokeFunctionExpr, LiteralArrayExpr as LiteralArrayExpr2, NO_ERRORS_SCHEMA, R3Identifiers, WrappedNodeExpr as WrappedNodeExpr4 } from "@angular/compiler";
import ts17 from "typescript";
var NgModuleSymbol = class extends SemanticSymbol {
  constructor() {
    super(...arguments);
    this.remotelyScopedComponents = [];
  }
  isPublicApiAffected(previousSymbol) {
    if (!(previousSymbol instanceof NgModuleSymbol)) {
      return true;
    }
    return false;
  }
  isEmitAffected(previousSymbol) {
    if (!(previousSymbol instanceof NgModuleSymbol)) {
      return true;
    }
    if (previousSymbol.remotelyScopedComponents.length !== this.remotelyScopedComponents.length) {
      return true;
    }
    for (const currEntry of this.remotelyScopedComponents) {
      const prevEntry = previousSymbol.remotelyScopedComponents.find((prevEntry2) => {
        return isSymbolEqual(prevEntry2.component, currEntry.component);
      });
      if (prevEntry === void 0) {
        return true;
      }
      if (!isArrayEqual(currEntry.usedDirectives, prevEntry.usedDirectives, isReferenceEqual)) {
        return true;
      }
      if (!isArrayEqual(currEntry.usedPipes, prevEntry.usedPipes, isReferenceEqual)) {
        return true;
      }
    }
    return false;
  }
  isTypeCheckApiAffected(previousSymbol) {
    if (!(previousSymbol instanceof NgModuleSymbol)) {
      return true;
    }
    return false;
  }
  addRemotelyScopedComponent(component, usedDirectives, usedPipes) {
    this.remotelyScopedComponents.push({ component, usedDirectives, usedPipes });
  }
};
var NgModuleDecoratorHandler = class {
  constructor(reflector, evaluator, metaReader, metaRegistry, scopeRegistry, referencesRegistry, isCore, refEmitter, factoryTracker, annotateForClosureCompiler, injectableRegistry, perf) {
    this.reflector = reflector;
    this.evaluator = evaluator;
    this.metaReader = metaReader;
    this.metaRegistry = metaRegistry;
    this.scopeRegistry = scopeRegistry;
    this.referencesRegistry = referencesRegistry;
    this.isCore = isCore;
    this.refEmitter = refEmitter;
    this.factoryTracker = factoryTracker;
    this.annotateForClosureCompiler = annotateForClosureCompiler;
    this.injectableRegistry = injectableRegistry;
    this.perf = perf;
    this.precedence = HandlerPrecedence.PRIMARY;
    this.name = NgModuleDecoratorHandler.name;
  }
  detect(node, decorators) {
    if (!decorators) {
      return void 0;
    }
    const decorator = findAngularDecorator(decorators, "NgModule", this.isCore);
    if (decorator !== void 0) {
      return {
        trigger: decorator.node,
        decorator,
        metadata: decorator
      };
    } else {
      return void 0;
    }
  }
  analyze(node, decorator) {
    this.perf.eventCount(PerfEvent.AnalyzeNgModule);
    const name = node.name.text;
    if (decorator.args === null || decorator.args.length > 1) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(decorator), `Incorrect number of arguments to @NgModule decorator`);
    }
    const meta = decorator.args.length === 1 ? unwrapExpression(decorator.args[0]) : ts17.createObjectLiteral([]);
    if (!ts17.isObjectLiteralExpression(meta)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, "@NgModule argument must be an object literal");
    }
    const ngModule = reflectObjectLiteral(meta);
    if (ngModule.has("jit")) {
      return {};
    }
    const moduleResolvers = combineResolvers([
      (ref) => this._extractModuleFromModuleWithProvidersFn(ref.node),
      forwardRefResolver
    ]);
    const diagnostics = [];
    let declarationRefs = [];
    let rawDeclarations = null;
    if (ngModule.has("declarations")) {
      rawDeclarations = ngModule.get("declarations");
      const declarationMeta = this.evaluator.evaluate(rawDeclarations, forwardRefResolver);
      declarationRefs = this.resolveTypeList(rawDeclarations, declarationMeta, name, "declarations");
      for (const ref of declarationRefs) {
        if (ref.node.getSourceFile().isDeclarationFile) {
          const errorNode = ref.getOriginForDiagnostics(rawDeclarations);
          diagnostics.push(makeDiagnostic(ErrorCode.NGMODULE_INVALID_DECLARATION, errorNode, `Cannot declare '${ref.node.name.text}' in an NgModule as it's not a part of the current compilation.`, [makeRelatedInformation(ref.node.name, `'${ref.node.name.text}' is declared here.`)]));
        }
      }
    }
    if (diagnostics.length > 0) {
      return { diagnostics };
    }
    let importRefs = [];
    if (ngModule.has("imports")) {
      const rawImports = ngModule.get("imports");
      const importsMeta = this.evaluator.evaluate(rawImports, moduleResolvers);
      importRefs = this.resolveTypeList(rawImports, importsMeta, name, "imports");
    }
    let exportRefs = [];
    if (ngModule.has("exports")) {
      const rawExports = ngModule.get("exports");
      const exportsMeta = this.evaluator.evaluate(rawExports, moduleResolvers);
      exportRefs = this.resolveTypeList(rawExports, exportsMeta, name, "exports");
      this.referencesRegistry.add(node, ...exportRefs);
    }
    let bootstrapRefs = [];
    if (ngModule.has("bootstrap")) {
      const expr = ngModule.get("bootstrap");
      const bootstrapMeta = this.evaluator.evaluate(expr, forwardRefResolver);
      bootstrapRefs = this.resolveTypeList(expr, bootstrapMeta, name, "bootstrap");
    }
    const schemas = [];
    if (ngModule.has("schemas")) {
      const rawExpr = ngModule.get("schemas");
      const result = this.evaluator.evaluate(rawExpr);
      if (!Array.isArray(result)) {
        throw createValueHasWrongTypeError(rawExpr, result, `NgModule.schemas must be an array`);
      }
      for (const schemaRef of result) {
        if (!(schemaRef instanceof Reference)) {
          throw createValueHasWrongTypeError(rawExpr, result, "NgModule.schemas must be an array of schemas");
        }
        const id2 = schemaRef.getIdentityIn(schemaRef.node.getSourceFile());
        if (id2 === null || schemaRef.ownedByModuleGuess !== "@angular/core") {
          throw createValueHasWrongTypeError(rawExpr, result, "NgModule.schemas must be an array of schemas");
        }
        switch (id2.text) {
          case "CUSTOM_ELEMENTS_SCHEMA":
            schemas.push(CUSTOM_ELEMENTS_SCHEMA);
            break;
          case "NO_ERRORS_SCHEMA":
            schemas.push(NO_ERRORS_SCHEMA);
            break;
          default:
            throw createValueHasWrongTypeError(rawExpr, schemaRef, `'${schemaRef.debugName}' is not a valid NgModule schema`);
        }
      }
    }
    const id = ngModule.has("id") ? new WrappedNodeExpr4(ngModule.get("id")) : null;
    const valueContext = node.getSourceFile();
    let typeContext = valueContext;
    const typeNode = this.reflector.getDtsDeclaration(node);
    if (typeNode !== null) {
      typeContext = typeNode.getSourceFile();
    }
    const bootstrap = bootstrapRefs.map((bootstrap2) => this._toR3Reference(bootstrap2.getOriginForDiagnostics(meta, node.name), bootstrap2, valueContext, typeContext));
    const declarations = declarationRefs.map((decl) => this._toR3Reference(decl.getOriginForDiagnostics(meta, node.name), decl, valueContext, typeContext));
    const imports = importRefs.map((imp) => this._toR3Reference(imp.getOriginForDiagnostics(meta, node.name), imp, valueContext, typeContext));
    const exports = exportRefs.map((exp) => this._toR3Reference(exp.getOriginForDiagnostics(meta, node.name), exp, valueContext, typeContext));
    const isForwardReference = (ref) => isExpressionForwardReference(ref.value, node.name, valueContext);
    const containsForwardDecls = bootstrap.some(isForwardReference) || declarations.some(isForwardReference) || imports.some(isForwardReference) || exports.some(isForwardReference);
    const type = wrapTypeReference(this.reflector, node);
    const internalType = new WrappedNodeExpr4(this.reflector.getInternalNameOfClass(node));
    const adjacentType = new WrappedNodeExpr4(this.reflector.getAdjacentNameOfClass(node));
    const ngModuleMetadata = {
      type,
      internalType,
      adjacentType,
      bootstrap,
      declarations,
      exports,
      imports,
      containsForwardDecls,
      id,
      emitInline: false,
      schemas: []
    };
    const rawProviders = ngModule.has("providers") ? ngModule.get("providers") : null;
    const wrapperProviders = rawProviders !== null ? new WrappedNodeExpr4(this.annotateForClosureCompiler ? wrapFunctionExpressionsInParens(rawProviders) : rawProviders) : null;
    const injectorImports = [];
    if (ngModule.has("imports")) {
      injectorImports.push(new WrappedNodeExpr4(ngModule.get("imports")));
    }
    const injectorMetadata = {
      name,
      type,
      internalType,
      providers: wrapperProviders,
      imports: injectorImports
    };
    const factoryMetadata = {
      name,
      type,
      internalType,
      typeArgumentCount: 0,
      deps: getValidConstructorDependencies(node, this.reflector, this.isCore),
      target: FactoryTarget2.NgModule
    };
    return {
      analysis: {
        id,
        schemas,
        mod: ngModuleMetadata,
        inj: injectorMetadata,
        fac: factoryMetadata,
        declarations: declarationRefs,
        rawDeclarations,
        imports: importRefs,
        exports: exportRefs,
        providers: rawProviders,
        providersRequiringFactory: rawProviders ? resolveProvidersRequiringFactory(rawProviders, this.reflector, this.evaluator) : null,
        classMetadata: extractClassMetadata(node, this.reflector, this.isCore, this.annotateForClosureCompiler),
        factorySymbolName: node.name.text
      }
    };
  }
  symbol(node) {
    return new NgModuleSymbol(node);
  }
  register(node, analysis) {
    this.metaRegistry.registerNgModuleMetadata({
      ref: new Reference(node),
      schemas: analysis.schemas,
      declarations: analysis.declarations,
      imports: analysis.imports,
      exports: analysis.exports,
      rawDeclarations: analysis.rawDeclarations
    });
    if (this.factoryTracker !== null) {
      this.factoryTracker.track(node.getSourceFile(), {
        name: analysis.factorySymbolName,
        hasId: analysis.id !== null
      });
    }
    this.injectableRegistry.registerInjectable(node);
  }
  resolve(node, analysis) {
    const scope = this.scopeRegistry.getScopeOfModule(node);
    const diagnostics = [];
    const scopeDiagnostics = this.scopeRegistry.getDiagnosticsOfModule(node);
    if (scopeDiagnostics !== null) {
      diagnostics.push(...scopeDiagnostics);
    }
    if (analysis.providersRequiringFactory !== null) {
      const providerDiagnostics = getProviderDiagnostics(analysis.providersRequiringFactory, analysis.providers, this.injectableRegistry);
      diagnostics.push(...providerDiagnostics);
    }
    const data = {
      injectorImports: []
    };
    if (scope !== null && !scope.compilation.isPoisoned) {
      const context = getSourceFile(node);
      for (const exportRef of analysis.exports) {
        if (isNgModule(exportRef.node, scope.compilation)) {
          const type = this.refEmitter.emit(exportRef, context);
          assertSuccessfulReferenceEmit(type, node, "NgModule");
          data.injectorImports.push(type.expression);
        }
      }
      for (const decl of analysis.declarations) {
        const metadata = this.metaReader.getDirectiveMetadata(decl);
        if (metadata !== null && metadata.selector === null) {
          throw new FatalDiagnosticError(ErrorCode.DIRECTIVE_MISSING_SELECTOR, decl.node, `Directive ${decl.node.name.text} has no selector, please add it!`);
        }
      }
    }
    if (diagnostics.length > 0) {
      return { diagnostics };
    }
    if (scope === null || scope.compilation.isPoisoned || scope.exported.isPoisoned || scope.reexports === null) {
      return { data };
    } else {
      return {
        data,
        reexports: scope.reexports
      };
    }
  }
  compileFull(node, { inj, mod, fac, classMetadata, declarations }, { injectorImports }) {
    const factoryFn = compileNgFactoryDefField(fac);
    const ngInjectorDef = compileInjector(this.mergeInjectorImports(inj, injectorImports));
    const ngModuleDef = compileNgModule(mod);
    const statements = ngModuleDef.statements;
    const metadata = classMetadata !== null ? compileClassMetadata2(classMetadata) : null;
    this.insertMetadataStatement(statements, metadata);
    this.appendRemoteScopingStatements(statements, node, declarations);
    return this.compileNgModule(factoryFn, ngInjectorDef, ngModuleDef);
  }
  compilePartial(node, { inj, fac, mod, classMetadata }, { injectorImports }) {
    const factoryFn = compileDeclareFactory(fac);
    const injectorDef = compileDeclareInjectorFromMetadata(this.mergeInjectorImports(inj, injectorImports));
    const ngModuleDef = compileDeclareNgModuleFromMetadata(mod);
    const metadata = classMetadata !== null ? compileDeclareClassMetadata2(classMetadata) : null;
    this.insertMetadataStatement(ngModuleDef.statements, metadata);
    return this.compileNgModule(factoryFn, injectorDef, ngModuleDef);
  }
  mergeInjectorImports(inj, injectorImports) {
    return __spreadProps(__spreadValues({}, inj), { imports: [...inj.imports, ...injectorImports] });
  }
  insertMetadataStatement(ngModuleStatements, metadata) {
    if (metadata !== null) {
      ngModuleStatements.unshift(metadata.toStmt());
    }
  }
  appendRemoteScopingStatements(ngModuleStatements, node, declarations) {
    const context = getSourceFile(node);
    for (const decl of declarations) {
      const remoteScope = this.scopeRegistry.getRemoteScope(decl.node);
      if (remoteScope !== null) {
        const directives = remoteScope.directives.map((directive) => {
          const type = this.refEmitter.emit(directive, context);
          assertSuccessfulReferenceEmit(type, node, "directive");
          return type.expression;
        });
        const pipes = remoteScope.pipes.map((pipe) => {
          const type = this.refEmitter.emit(pipe, context);
          assertSuccessfulReferenceEmit(type, node, "pipe");
          return type.expression;
        });
        const directiveArray = new LiteralArrayExpr2(directives);
        const pipesArray = new LiteralArrayExpr2(pipes);
        const componentType = this.refEmitter.emit(decl, context);
        assertSuccessfulReferenceEmit(componentType, node, "component");
        const declExpr = componentType.expression;
        const setComponentScope = new ExternalExpr4(R3Identifiers.setComponentScope);
        const callExpr = new InvokeFunctionExpr(setComponentScope, [declExpr, directiveArray, pipesArray]);
        ngModuleStatements.push(callExpr.toStmt());
      }
    }
  }
  compileNgModule(factoryFn, injectorDef, ngModuleDef) {
    const res = [
      factoryFn,
      {
        name: "\u0275mod",
        initializer: ngModuleDef.expression,
        statements: ngModuleDef.statements,
        type: ngModuleDef.type
      },
      {
        name: "\u0275inj",
        initializer: injectorDef.expression,
        statements: injectorDef.statements,
        type: injectorDef.type
      }
    ];
    return res;
  }
  _toR3Reference(origin, valueRef, valueContext, typeContext) {
    if (valueRef.hasOwningModuleGuess) {
      return toR3Reference(origin, valueRef, valueRef, valueContext, valueContext, this.refEmitter);
    } else {
      let typeRef = valueRef;
      let typeNode = this.reflector.getDtsDeclaration(typeRef.node);
      if (typeNode !== null && isNamedClassDeclaration(typeNode)) {
        typeRef = new Reference(typeNode);
      }
      return toR3Reference(origin, valueRef, typeRef, valueContext, typeContext, this.refEmitter);
    }
  }
  _extractModuleFromModuleWithProvidersFn(node) {
    const type = node.type || null;
    return type && (this._reflectModuleFromTypeParam(type, node) || this._reflectModuleFromLiteralType(type));
  }
  _reflectModuleFromTypeParam(type, node) {
    if (!ts17.isTypeReferenceNode(type)) {
      return null;
    }
    const typeName = type && (ts17.isIdentifier(type.typeName) && type.typeName || ts17.isQualifiedName(type.typeName) && type.typeName.right) || null;
    if (typeName === null) {
      return null;
    }
    const id = this.reflector.getImportOfIdentifier(typeName);
    if (id === null || id.name !== "ModuleWithProviders") {
      return null;
    }
    if (!this.isCore && id.from !== "@angular/core") {
      return null;
    }
    if (type.typeArguments === void 0 || type.typeArguments.length !== 1) {
      const parent = ts17.isMethodDeclaration(node) && ts17.isClassDeclaration(node.parent) ? node.parent : null;
      const symbolName = (parent && parent.name ? parent.name.getText() + "." : "") + (node.name ? node.name.getText() : "anonymous");
      throw new FatalDiagnosticError(ErrorCode.NGMODULE_MODULE_WITH_PROVIDERS_MISSING_GENERIC, type, `${symbolName} returns a ModuleWithProviders type without a generic type argument. Please add a generic type argument to the ModuleWithProviders type. If this occurrence is in library code you don't control, please contact the library authors.`);
    }
    const arg = type.typeArguments[0];
    return typeNodeToValueExpr(arg);
  }
  _reflectModuleFromLiteralType(type) {
    if (!ts17.isIntersectionTypeNode(type)) {
      return null;
    }
    for (const t of type.types) {
      if (ts17.isTypeLiteralNode(t)) {
        for (const m of t.members) {
          const ngModuleType = ts17.isPropertySignature(m) && ts17.isIdentifier(m.name) && m.name.text === "ngModule" && m.type || null;
          const ngModuleExpression = ngModuleType && typeNodeToValueExpr(ngModuleType);
          if (ngModuleExpression) {
            return ngModuleExpression;
          }
        }
      }
    }
    return null;
  }
  isClassDeclarationReference(ref) {
    return this.reflector.isClass(ref.node);
  }
  resolveTypeList(expr, resolvedList, className, arrayName) {
    const refList = [];
    if (!Array.isArray(resolvedList)) {
      throw createValueHasWrongTypeError(expr, resolvedList, `Expected array when reading the NgModule.${arrayName} of ${className}`);
    }
    resolvedList.forEach((entry, idx) => {
      if (entry instanceof Map && entry.has("ngModule")) {
        entry = entry.get("ngModule");
      }
      if (Array.isArray(entry)) {
        refList.push(...this.resolveTypeList(expr, entry, className, arrayName));
      } else if (entry instanceof Reference) {
        if (!this.isClassDeclarationReference(entry)) {
          throw createValueHasWrongTypeError(entry.node, entry, `Value at position ${idx} in the NgModule.${arrayName} of ${className} is not a class`);
        }
        refList.push(entry);
      } else {
        throw createValueHasWrongTypeError(expr, entry, `Value at position ${idx} in the NgModule.${arrayName} of ${className} is not a reference`);
      }
    });
    return refList;
  }
};
function isNgModule(node, compilation) {
  return !compilation.directives.some((directive) => directive.ref.node === node) && !compilation.pipes.some((pipe) => pipe.ref.node === node);
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/component.mjs
var EMPTY_MAP = /* @__PURE__ */ new Map();
var EMPTY_ARRAY = [];
var ComponentSymbol = class extends DirectiveSymbol {
  constructor() {
    super(...arguments);
    this.usedDirectives = [];
    this.usedPipes = [];
    this.isRemotelyScoped = false;
  }
  isEmitAffected(previousSymbol, publicApiAffected) {
    if (!(previousSymbol instanceof ComponentSymbol)) {
      return true;
    }
    const isSymbolUnaffected = (current, previous) => isReferenceEqual(current, previous) && !publicApiAffected.has(current.symbol);
    return this.isRemotelyScoped !== previousSymbol.isRemotelyScoped || !isArrayEqual(this.usedDirectives, previousSymbol.usedDirectives, isSymbolUnaffected) || !isArrayEqual(this.usedPipes, previousSymbol.usedPipes, isSymbolUnaffected);
  }
  isTypeCheckBlockAffected(previousSymbol, typeCheckApiAffected) {
    if (!(previousSymbol instanceof ComponentSymbol)) {
      return true;
    }
    const isInheritanceChainAffected = (symbol) => {
      let currentSymbol = symbol;
      while (currentSymbol instanceof DirectiveSymbol) {
        if (typeCheckApiAffected.has(currentSymbol)) {
          return true;
        }
        currentSymbol = currentSymbol.baseClass;
      }
      return false;
    };
    const isDirectiveUnaffected = (current, previous) => isReferenceEqual(current, previous) && !isInheritanceChainAffected(current.symbol);
    const isPipeUnaffected = (current, previous) => isReferenceEqual(current, previous) && !typeCheckApiAffected.has(current.symbol);
    return !isArrayEqual(this.usedDirectives, previousSymbol.usedDirectives, isDirectiveUnaffected) || !isArrayEqual(this.usedPipes, previousSymbol.usedPipes, isPipeUnaffected);
  }
};
var ComponentDecoratorHandler = class {
  constructor(reflector, evaluator, metaRegistry, metaReader, scopeReader, scopeRegistry, typeCheckScopeRegistry, resourceRegistry, isCore, resourceLoader, rootDirs, defaultPreserveWhitespaces, i18nUseExternalIds, enableI18nLegacyMessageIdFormat, usePoisonedData, i18nNormalizeLineEndingsInICUs, moduleResolver, cycleAnalyzer, cycleHandlingStrategy, refEmitter, depTracker, injectableRegistry, semanticDepGraphUpdater, annotateForClosureCompiler, perf) {
    this.reflector = reflector;
    this.evaluator = evaluator;
    this.metaRegistry = metaRegistry;
    this.metaReader = metaReader;
    this.scopeReader = scopeReader;
    this.scopeRegistry = scopeRegistry;
    this.typeCheckScopeRegistry = typeCheckScopeRegistry;
    this.resourceRegistry = resourceRegistry;
    this.isCore = isCore;
    this.resourceLoader = resourceLoader;
    this.rootDirs = rootDirs;
    this.defaultPreserveWhitespaces = defaultPreserveWhitespaces;
    this.i18nUseExternalIds = i18nUseExternalIds;
    this.enableI18nLegacyMessageIdFormat = enableI18nLegacyMessageIdFormat;
    this.usePoisonedData = usePoisonedData;
    this.i18nNormalizeLineEndingsInICUs = i18nNormalizeLineEndingsInICUs;
    this.moduleResolver = moduleResolver;
    this.cycleAnalyzer = cycleAnalyzer;
    this.cycleHandlingStrategy = cycleHandlingStrategy;
    this.refEmitter = refEmitter;
    this.depTracker = depTracker;
    this.injectableRegistry = injectableRegistry;
    this.semanticDepGraphUpdater = semanticDepGraphUpdater;
    this.annotateForClosureCompiler = annotateForClosureCompiler;
    this.perf = perf;
    this.literalCache = /* @__PURE__ */ new Map();
    this.elementSchemaRegistry = new DomElementSchemaRegistry();
    this.preanalyzeTemplateCache = /* @__PURE__ */ new Map();
    this.preanalyzeStylesCache = /* @__PURE__ */ new Map();
    this.precedence = HandlerPrecedence.PRIMARY;
    this.name = ComponentDecoratorHandler.name;
  }
  detect(node, decorators) {
    if (!decorators) {
      return void 0;
    }
    const decorator = findAngularDecorator(decorators, "Component", this.isCore);
    if (decorator !== void 0) {
      return {
        trigger: decorator.node,
        decorator,
        metadata: decorator
      };
    } else {
      return void 0;
    }
  }
  preanalyze(node, decorator) {
    if (!this.resourceLoader.canPreload) {
      return void 0;
    }
    const meta = this._resolveLiteral(decorator);
    const component = reflectObjectLiteral(meta);
    const containingFile = node.getSourceFile().fileName;
    const resolveStyleUrl = (styleUrl) => {
      try {
        const resourceUrl = this.resourceLoader.resolve(styleUrl, containingFile);
        return this.resourceLoader.preload(resourceUrl, { type: "style", containingFile });
      } catch {
        return void 0;
      }
    };
    const templateAndTemplateStyleResources = this._preloadAndParseTemplate(node, decorator, component, containingFile).then((template) => {
      if (template === null) {
        return void 0;
      }
      return Promise.all(template.styleUrls.map((styleUrl) => resolveStyleUrl(styleUrl))).then(() => void 0);
    });
    const componentStyleUrls = this._extractComponentStyleUrls(component);
    let inlineStyles;
    if (component.has("styles")) {
      const litStyles = parseFieldArrayValue(component, "styles", this.evaluator);
      if (litStyles === null) {
        this.preanalyzeStylesCache.set(node, null);
      } else {
        inlineStyles = Promise.all(litStyles.map((style) => this.resourceLoader.preprocessInline(style, { type: "style", containingFile }))).then((styles) => {
          this.preanalyzeStylesCache.set(node, styles);
        });
      }
    } else {
      this.preanalyzeStylesCache.set(node, null);
    }
    return Promise.all([
      templateAndTemplateStyleResources,
      inlineStyles,
      ...componentStyleUrls.map((styleUrl) => resolveStyleUrl(styleUrl.url))
    ]).then(() => void 0);
  }
  analyze(node, decorator, flags = HandlerFlags.NONE) {
    var _a, _b;
    this.perf.eventCount(PerfEvent.AnalyzeComponent);
    const containingFile = node.getSourceFile().fileName;
    this.literalCache.delete(decorator);
    let diagnostics;
    let isPoisoned = false;
    const directiveResult = extractDirectiveMetadata(node, decorator, this.reflector, this.evaluator, this.isCore, flags, this.annotateForClosureCompiler, this.elementSchemaRegistry.getDefaultComponentElementName());
    if (directiveResult === void 0) {
      return {};
    }
    const { decorator: component, metadata, inputs, outputs } = directiveResult;
    const encapsulation = (_a = this._resolveEnumValue(component, "encapsulation", "ViewEncapsulation")) != null ? _a : ViewEncapsulation.Emulated;
    const changeDetection = this._resolveEnumValue(component, "changeDetection", "ChangeDetectionStrategy");
    let animations = null;
    let animationTriggerNames = null;
    if (component.has("animations")) {
      animations = new WrappedNodeExpr5(component.get("animations"));
      const animationsValue = this.evaluator.evaluate(component.get("animations"), animationTriggerResolver);
      animationTriggerNames = { includesDynamicAnimations: false, staticTriggerNames: [] };
      collectAnimationNames(animationsValue, animationTriggerNames);
    }
    const relativeContextFilePath = this.rootDirs.reduce((previous, rootDir) => {
      const candidate = relative(absoluteFrom(rootDir), absoluteFrom(containingFile));
      if (previous === void 0 || candidate.length < previous.length) {
        return candidate;
      } else {
        return previous;
      }
    }, void 0);
    let viewProvidersRequiringFactory = null;
    let providersRequiringFactory = null;
    let wrappedViewProviders = null;
    if (component.has("viewProviders")) {
      const viewProviders = component.get("viewProviders");
      viewProvidersRequiringFactory = resolveProvidersRequiringFactory(viewProviders, this.reflector, this.evaluator);
      wrappedViewProviders = new WrappedNodeExpr5(this.annotateForClosureCompiler ? wrapFunctionExpressionsInParens(viewProviders) : viewProviders);
    }
    if (component.has("providers")) {
      providersRequiringFactory = resolveProvidersRequiringFactory(component.get("providers"), this.reflector, this.evaluator);
    }
    let template;
    if (this.preanalyzeTemplateCache.has(node)) {
      const preanalyzed = this.preanalyzeTemplateCache.get(node);
      this.preanalyzeTemplateCache.delete(node);
      template = preanalyzed;
    } else {
      const templateDecl = this.parseTemplateDeclaration(decorator, component, containingFile);
      template = this.extractTemplate(node, templateDecl);
    }
    const templateResource = template.declaration.isInline ? { path: null, expression: component.get("template") } : {
      path: absoluteFrom(template.declaration.resolvedTemplateUrl),
      expression: template.sourceMapping.node
    };
    let styles = [];
    const styleResources = this._extractStyleResources(component, containingFile);
    const styleUrls = [
      ...this._extractComponentStyleUrls(component),
      ...this._extractTemplateStyleUrls(template)
    ];
    for (const styleUrl of styleUrls) {
      try {
        const resourceUrl = this.resourceLoader.resolve(styleUrl.url, containingFile);
        const resourceStr = this.resourceLoader.load(resourceUrl);
        styles.push(resourceStr);
        if (this.depTracker !== null) {
          this.depTracker.addResourceDependency(node.getSourceFile(), absoluteFrom(resourceUrl));
        }
      } catch {
        if (diagnostics === void 0) {
          diagnostics = [];
        }
        const resourceType = styleUrl.source === 2 ? 2 : 1;
        diagnostics.push(this.makeResourceNotFoundError(styleUrl.url, styleUrl.nodeForError, resourceType).toDiagnostic());
      }
    }
    if (encapsulation === ViewEncapsulation.ShadowDom && metadata.selector !== null) {
      const selectorError = checkCustomElementSelectorForErrors(metadata.selector);
      if (selectorError !== null) {
        if (diagnostics === void 0) {
          diagnostics = [];
        }
        diagnostics.push(makeDiagnostic(ErrorCode.COMPONENT_INVALID_SHADOW_DOM_SELECTOR, component.get("selector"), selectorError));
      }
    }
    let inlineStyles = null;
    if (this.preanalyzeStylesCache.has(node)) {
      inlineStyles = this.preanalyzeStylesCache.get(node);
      this.preanalyzeStylesCache.delete(node);
      if (inlineStyles !== null) {
        styles.push(...inlineStyles);
      }
    } else {
      if (this.resourceLoader.canPreprocess) {
        throw new Error("Inline resource processing requires asynchronous preanalyze.");
      }
      if (component.has("styles")) {
        const litStyles = parseFieldArrayValue(component, "styles", this.evaluator);
        if (litStyles !== null) {
          inlineStyles = [...litStyles];
          styles.push(...litStyles);
        }
      }
    }
    if (template.styles.length > 0) {
      styles.push(...template.styles);
    }
    const output = {
      analysis: {
        baseClass: readBaseClass(node, this.reflector, this.evaluator),
        inputs,
        outputs,
        meta: __spreadProps(__spreadValues({}, metadata), {
          template: {
            nodes: template.nodes,
            ngContentSelectors: template.ngContentSelectors
          },
          encapsulation,
          interpolation: (_b = template.interpolationConfig) != null ? _b : DEFAULT_INTERPOLATION_CONFIG,
          styles,
          animations,
          viewProviders: wrappedViewProviders,
          i18nUseExternalIds: this.i18nUseExternalIds,
          relativeContextFilePath
        }),
        typeCheckMeta: extractDirectiveTypeCheckMeta(node, inputs, this.reflector),
        classMetadata: extractClassMetadata(node, this.reflector, this.isCore, this.annotateForClosureCompiler, (dec) => this._transformDecoratorToInlineResources(dec, component, styles, template)),
        template,
        providersRequiringFactory,
        viewProvidersRequiringFactory,
        inlineStyles,
        styleUrls,
        resources: {
          styles: styleResources,
          template: templateResource
        },
        isPoisoned,
        animationTriggerNames
      },
      diagnostics
    };
    if (changeDetection !== null) {
      output.analysis.meta.changeDetection = changeDetection;
    }
    return output;
  }
  symbol(node, analysis) {
    const typeParameters = extractSemanticTypeParameters(node);
    return new ComponentSymbol(node, analysis.meta.selector, analysis.inputs, analysis.outputs, analysis.meta.exportAs, analysis.typeCheckMeta, typeParameters);
  }
  register(node, analysis) {
    const ref = new Reference(node);
    this.metaRegistry.registerDirectiveMetadata(__spreadProps(__spreadValues({
      type: MetaType.Directive,
      ref,
      name: node.name.text,
      selector: analysis.meta.selector,
      exportAs: analysis.meta.exportAs,
      inputs: analysis.inputs,
      outputs: analysis.outputs,
      queries: analysis.meta.queries.map((query) => query.propertyName),
      isComponent: true,
      baseClass: analysis.baseClass
    }, analysis.typeCheckMeta), {
      isPoisoned: analysis.isPoisoned,
      isStructural: false,
      animationTriggerNames: analysis.animationTriggerNames
    }));
    this.resourceRegistry.registerResources(analysis.resources, node);
    this.injectableRegistry.registerInjectable(node);
  }
  index(context, node, analysis) {
    if (analysis.isPoisoned && !this.usePoisonedData) {
      return null;
    }
    const scope = this.scopeReader.getScopeForComponent(node);
    const selector = analysis.meta.selector;
    const matcher = new SelectorMatcher();
    if (scope !== null) {
      if ((scope.compilation.isPoisoned || scope.exported.isPoisoned) && !this.usePoisonedData) {
        return null;
      }
      for (const directive of scope.compilation.directives) {
        if (directive.selector !== null) {
          matcher.addSelectables(CssSelector.parse(directive.selector), directive);
        }
      }
    }
    const binder = new R3TargetBinder(matcher);
    const boundTemplate = binder.bind({ template: analysis.template.diagNodes });
    context.addComponent({
      declaration: node,
      selector,
      boundTemplate,
      templateMeta: {
        isInline: analysis.template.declaration.isInline,
        file: analysis.template.file
      }
    });
  }
  typeCheck(ctx, node, meta) {
    if (this.typeCheckScopeRegistry === null || !ts18.isClassDeclaration(node)) {
      return;
    }
    if (meta.isPoisoned && !this.usePoisonedData) {
      return;
    }
    const scope = this.typeCheckScopeRegistry.getTypeCheckScope(node);
    if (scope.isPoisoned && !this.usePoisonedData) {
      return;
    }
    const binder = new R3TargetBinder(scope.matcher);
    ctx.addTemplate(new Reference(node), binder, meta.template.diagNodes, scope.pipes, scope.schemas, meta.template.sourceMapping, meta.template.file, meta.template.errors);
  }
  extendedTemplateCheck(component, extendedTemplateChecker) {
    return extendedTemplateChecker.getDiagnosticsForComponent(component);
  }
  resolve(node, analysis, symbol) {
    if (this.semanticDepGraphUpdater !== null && analysis.baseClass instanceof Reference) {
      symbol.baseClass = this.semanticDepGraphUpdater.getSymbol(analysis.baseClass.node);
    }
    if (analysis.isPoisoned && !this.usePoisonedData) {
      return {};
    }
    const context = node.getSourceFile();
    const scope = this.scopeReader.getScopeForComponent(node);
    let metadata = analysis.meta;
    const data = {
      directives: EMPTY_ARRAY,
      pipes: EMPTY_MAP,
      declarationListEmitMode: 0
    };
    if (scope !== null && (!scope.compilation.isPoisoned || this.usePoisonedData)) {
      const matcher = new SelectorMatcher();
      for (const dir of scope.compilation.directives) {
        if (dir.selector !== null) {
          matcher.addSelectables(CssSelector.parse(dir.selector), dir);
        }
      }
      const pipes = /* @__PURE__ */ new Map();
      for (const pipe of scope.compilation.pipes) {
        pipes.set(pipe.name, pipe.ref);
      }
      const binder = new R3TargetBinder(matcher);
      const bound = binder.bind({ template: metadata.template.nodes });
      const usedDirectives = bound.getUsedDirectives().map((directive) => {
        const type = this.refEmitter.emit(directive.ref, context);
        assertSuccessfulReferenceEmit(type, node.name, directive.isComponent ? "component" : "directive");
        return {
          ref: directive.ref,
          type: type.expression,
          importedFile: type.importedFile,
          selector: directive.selector,
          inputs: directive.inputs.propertyNames,
          outputs: directive.outputs.propertyNames,
          exportAs: directive.exportAs,
          isComponent: directive.isComponent
        };
      });
      const usedPipes = [];
      for (const pipeName of bound.getUsedPipes()) {
        if (!pipes.has(pipeName)) {
          continue;
        }
        const pipe = pipes.get(pipeName);
        const type = this.refEmitter.emit(pipe, context);
        assertSuccessfulReferenceEmit(type, node.name, "pipe");
        usedPipes.push({
          ref: pipe,
          pipeName,
          expression: type.expression,
          importedFile: type.importedFile
        });
      }
      if (this.semanticDepGraphUpdater !== null) {
        symbol.usedDirectives = usedDirectives.map((dir) => this.semanticDepGraphUpdater.getSemanticReference(dir.ref.node, dir.type));
        symbol.usedPipes = usedPipes.map((pipe) => this.semanticDepGraphUpdater.getSemanticReference(pipe.ref.node, pipe.expression));
      }
      const cyclesFromDirectives = /* @__PURE__ */ new Map();
      for (const usedDirective of usedDirectives) {
        const cycle = this._checkForCyclicImport(usedDirective.importedFile, usedDirective.type, context);
        if (cycle !== null) {
          cyclesFromDirectives.set(usedDirective, cycle);
        }
      }
      const cyclesFromPipes = /* @__PURE__ */ new Map();
      for (const usedPipe of usedPipes) {
        const cycle = this._checkForCyclicImport(usedPipe.importedFile, usedPipe.expression, context);
        if (cycle !== null) {
          cyclesFromPipes.set(usedPipe, cycle);
        }
      }
      const cycleDetected = cyclesFromDirectives.size !== 0 || cyclesFromPipes.size !== 0;
      if (!cycleDetected) {
        for (const { type, importedFile } of usedDirectives) {
          this._recordSyntheticImport(importedFile, type, context);
        }
        for (const { expression, importedFile } of usedPipes) {
          this._recordSyntheticImport(importedFile, expression, context);
        }
        const wrapDirectivesAndPipesInClosure = usedDirectives.some((dir) => isExpressionForwardReference(dir.type, node.name, context)) || usedPipes.some((pipe) => isExpressionForwardReference(pipe.expression, node.name, context));
        data.directives = usedDirectives;
        data.pipes = new Map(usedPipes.map((pipe) => [pipe.pipeName, pipe.expression]));
        data.declarationListEmitMode = wrapDirectivesAndPipesInClosure ? 1 : 0;
      } else {
        if (this.cycleHandlingStrategy === 0) {
          this.scopeRegistry.setComponentRemoteScope(node, usedDirectives.map((dir) => dir.ref), usedPipes.map((pipe) => pipe.ref));
          symbol.isRemotelyScoped = true;
          if (this.semanticDepGraphUpdater !== null) {
            const moduleSymbol = this.semanticDepGraphUpdater.getSymbol(scope.ngModule);
            if (!(moduleSymbol instanceof NgModuleSymbol)) {
              throw new Error(`AssertionError: Expected ${scope.ngModule.name} to be an NgModuleSymbol.`);
            }
            moduleSymbol.addRemotelyScopedComponent(symbol, symbol.usedDirectives, symbol.usedPipes);
          }
        } else {
          const relatedMessages = [];
          for (const [dir, cycle] of cyclesFromDirectives) {
            relatedMessages.push(makeCyclicImportInfo(dir.ref, dir.isComponent ? "component" : "directive", cycle));
          }
          for (const [pipe, cycle] of cyclesFromPipes) {
            relatedMessages.push(makeCyclicImportInfo(pipe.ref, "pipe", cycle));
          }
          throw new FatalDiagnosticError(ErrorCode.IMPORT_CYCLE_DETECTED, node, "One or more import cycles would need to be created to compile this component, which is not supported by the current compiler configuration.", relatedMessages);
        }
      }
    }
    const diagnostics = [];
    if (analysis.providersRequiringFactory !== null && analysis.meta.providers instanceof WrappedNodeExpr5) {
      const providerDiagnostics = getProviderDiagnostics(analysis.providersRequiringFactory, analysis.meta.providers.node, this.injectableRegistry);
      diagnostics.push(...providerDiagnostics);
    }
    if (analysis.viewProvidersRequiringFactory !== null && analysis.meta.viewProviders instanceof WrappedNodeExpr5) {
      const viewProviderDiagnostics = getProviderDiagnostics(analysis.viewProvidersRequiringFactory, analysis.meta.viewProviders.node, this.injectableRegistry);
      diagnostics.push(...viewProviderDiagnostics);
    }
    const directiveDiagnostics = getDirectiveDiagnostics(node, this.metaReader, this.evaluator, this.reflector, this.scopeRegistry, "Component");
    if (directiveDiagnostics !== null) {
      diagnostics.push(...directiveDiagnostics);
    }
    if (diagnostics.length > 0) {
      return { diagnostics };
    }
    return { data };
  }
  xi18n(ctx, node, analysis) {
    var _a;
    ctx.updateFromTemplate(analysis.template.content, analysis.template.declaration.resolvedTemplateUrl, (_a = analysis.template.interpolationConfig) != null ? _a : DEFAULT_INTERPOLATION_CONFIG);
  }
  updateResources(node, analysis) {
    const containingFile = node.getSourceFile().fileName;
    const templateDecl = analysis.template.declaration;
    if (!templateDecl.isInline) {
      analysis.template = this.extractTemplate(node, templateDecl);
    }
    let styles = [];
    if (analysis.styleUrls !== null) {
      for (const styleUrl of analysis.styleUrls) {
        try {
          const resolvedStyleUrl = this.resourceLoader.resolve(styleUrl.url, containingFile);
          const styleText = this.resourceLoader.load(resolvedStyleUrl);
          styles.push(styleText);
        } catch (e) {
        }
      }
    }
    if (analysis.inlineStyles !== null) {
      for (const styleText of analysis.inlineStyles) {
        styles.push(styleText);
      }
    }
    for (const styleText of analysis.template.styles) {
      styles.push(styleText);
    }
    analysis.meta.styles = styles;
  }
  compileFull(node, analysis, resolution, pool) {
    if (analysis.template.errors !== null && analysis.template.errors.length > 0) {
      return [];
    }
    const meta = __spreadValues(__spreadValues({}, analysis.meta), resolution);
    const fac = compileNgFactoryDefField(toFactoryMetadata(meta, FactoryTarget3.Component));
    const def = compileComponentFromMetadata(meta, pool, makeBindingParser2());
    const classMetadata = analysis.classMetadata !== null ? compileClassMetadata3(analysis.classMetadata).toStmt() : null;
    return compileResults(fac, def, classMetadata, "\u0275cmp");
  }
  compilePartial(node, analysis, resolution) {
    if (analysis.template.errors !== null && analysis.template.errors.length > 0) {
      return [];
    }
    const templateInfo = {
      content: analysis.template.content,
      sourceUrl: analysis.template.declaration.resolvedTemplateUrl,
      isInline: analysis.template.declaration.isInline,
      inlineTemplateLiteralExpression: analysis.template.sourceMapping.type === "direct" ? new WrappedNodeExpr5(analysis.template.sourceMapping.node) : null
    };
    const meta = __spreadValues(__spreadValues({}, analysis.meta), resolution);
    const fac = compileDeclareFactory(toFactoryMetadata(meta, FactoryTarget3.Component));
    const def = compileDeclareComponentFromMetadata(meta, analysis.template, templateInfo);
    const classMetadata = analysis.classMetadata !== null ? compileDeclareClassMetadata3(analysis.classMetadata).toStmt() : null;
    return compileResults(fac, def, classMetadata, "\u0275cmp");
  }
  _transformDecoratorToInlineResources(dec, component, styles, template) {
    if (dec.name !== "Component") {
      return dec;
    }
    if (!component.has("templateUrl") && !component.has("styleUrls")) {
      return dec;
    }
    const metadata = new Map(component);
    if (metadata.has("templateUrl")) {
      metadata.delete("templateUrl");
      metadata.set("template", ts18.createStringLiteral(template.content));
    }
    if (metadata.has("styleUrls")) {
      metadata.delete("styleUrls");
      metadata.set("styles", ts18.createArrayLiteral(styles.map((s) => ts18.createStringLiteral(s))));
    }
    const newMetadataFields = [];
    for (const [name, value] of metadata.entries()) {
      newMetadataFields.push(ts18.createPropertyAssignment(name, value));
    }
    return __spreadProps(__spreadValues({}, dec), { args: [ts18.createObjectLiteral(newMetadataFields)] });
  }
  _resolveLiteral(decorator) {
    if (this.literalCache.has(decorator)) {
      return this.literalCache.get(decorator);
    }
    if (decorator.args === null || decorator.args.length !== 1) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(decorator), `Incorrect number of arguments to @Component decorator`);
    }
    const meta = unwrapExpression(decorator.args[0]);
    if (!ts18.isObjectLiteralExpression(meta)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, `Decorator argument must be literal.`);
    }
    this.literalCache.set(decorator, meta);
    return meta;
  }
  _resolveEnumValue(component, field, enumSymbolName) {
    let resolved = null;
    if (component.has(field)) {
      const expr = component.get(field);
      const value = this.evaluator.evaluate(expr);
      if (value instanceof EnumValue && isAngularCoreReference(value.enumRef, enumSymbolName)) {
        resolved = value.resolved;
      } else {
        throw createValueHasWrongTypeError(expr, value, `${field} must be a member of ${enumSymbolName} enum from @angular/core`);
      }
    }
    return resolved;
  }
  _extractComponentStyleUrls(component) {
    if (!component.has("styleUrls")) {
      return [];
    }
    return this._extractStyleUrlsFromExpression(component.get("styleUrls"));
  }
  _extractStyleUrlsFromExpression(styleUrlsExpr) {
    const styleUrls = [];
    if (ts18.isArrayLiteralExpression(styleUrlsExpr)) {
      for (const styleUrlExpr of styleUrlsExpr.elements) {
        if (ts18.isSpreadElement(styleUrlExpr)) {
          styleUrls.push(...this._extractStyleUrlsFromExpression(styleUrlExpr.expression));
        } else {
          const styleUrl = this.evaluator.evaluate(styleUrlExpr);
          if (typeof styleUrl !== "string") {
            throw createValueHasWrongTypeError(styleUrlExpr, styleUrl, "styleUrl must be a string");
          }
          styleUrls.push({
            url: styleUrl,
            source: 2,
            nodeForError: styleUrlExpr
          });
        }
      }
    } else {
      const evaluatedStyleUrls = this.evaluator.evaluate(styleUrlsExpr);
      if (!isStringArray(evaluatedStyleUrls)) {
        throw createValueHasWrongTypeError(styleUrlsExpr, evaluatedStyleUrls, "styleUrls must be an array of strings");
      }
      for (const styleUrl of evaluatedStyleUrls) {
        styleUrls.push({
          url: styleUrl,
          source: 2,
          nodeForError: styleUrlsExpr
        });
      }
    }
    return styleUrls;
  }
  _extractStyleResources(component, containingFile) {
    const styles = /* @__PURE__ */ new Set();
    function stringLiteralElements(array) {
      return array.elements.filter((e) => ts18.isStringLiteralLike(e));
    }
    const styleUrlsExpr = component.get("styleUrls");
    if (styleUrlsExpr !== void 0 && ts18.isArrayLiteralExpression(styleUrlsExpr)) {
      for (const expression of stringLiteralElements(styleUrlsExpr)) {
        try {
          const resourceUrl = this.resourceLoader.resolve(expression.text, containingFile);
          styles.add({ path: absoluteFrom(resourceUrl), expression });
        } catch {
        }
      }
    }
    const stylesExpr = component.get("styles");
    if (stylesExpr !== void 0 && ts18.isArrayLiteralExpression(stylesExpr)) {
      for (const expression of stringLiteralElements(stylesExpr)) {
        styles.add({ path: null, expression });
      }
    }
    return styles;
  }
  _preloadAndParseTemplate(node, decorator, component, containingFile) {
    if (component.has("templateUrl")) {
      const templateUrlExpr = component.get("templateUrl");
      const templateUrl = this.evaluator.evaluate(templateUrlExpr);
      if (typeof templateUrl !== "string") {
        throw createValueHasWrongTypeError(templateUrlExpr, templateUrl, "templateUrl must be a string");
      }
      try {
        const resourceUrl = this.resourceLoader.resolve(templateUrl, containingFile);
        const templatePromise = this.resourceLoader.preload(resourceUrl, { type: "template", containingFile });
        if (templatePromise !== void 0) {
          return templatePromise.then(() => {
            const templateDecl = this.parseTemplateDeclaration(decorator, component, containingFile);
            const template = this.extractTemplate(node, templateDecl);
            this.preanalyzeTemplateCache.set(node, template);
            return template;
          });
        } else {
          return Promise.resolve(null);
        }
      } catch (e) {
        throw this.makeResourceNotFoundError(templateUrl, templateUrlExpr, 0);
      }
    } else {
      const templateDecl = this.parseTemplateDeclaration(decorator, component, containingFile);
      const template = this.extractTemplate(node, templateDecl);
      this.preanalyzeTemplateCache.set(node, template);
      return Promise.resolve(template);
    }
  }
  extractTemplate(node, template) {
    if (template.isInline) {
      let sourceStr;
      let sourceParseRange = null;
      let templateContent;
      let sourceMapping;
      let escapedString = false;
      let sourceMapUrl;
      if (ts18.isStringLiteral(template.expression) || ts18.isNoSubstitutionTemplateLiteral(template.expression)) {
        sourceParseRange = getTemplateRange(template.expression);
        sourceStr = template.expression.getSourceFile().text;
        templateContent = template.expression.text;
        escapedString = true;
        sourceMapping = {
          type: "direct",
          node: template.expression
        };
        sourceMapUrl = template.resolvedTemplateUrl;
      } else {
        const resolvedTemplate = this.evaluator.evaluate(template.expression);
        if (typeof resolvedTemplate !== "string") {
          throw createValueHasWrongTypeError(template.expression, resolvedTemplate, "template must be a string");
        }
        sourceStr = resolvedTemplate;
        templateContent = resolvedTemplate;
        sourceMapping = {
          type: "indirect",
          node: template.expression,
          componentClass: node,
          template: templateContent
        };
        sourceMapUrl = null;
      }
      return __spreadProps(__spreadValues({}, this._parseTemplate(template, sourceStr, sourceParseRange, escapedString, sourceMapUrl)), {
        content: templateContent,
        sourceMapping,
        declaration: template
      });
    } else {
      const templateContent = this.resourceLoader.load(template.resolvedTemplateUrl);
      if (this.depTracker !== null) {
        this.depTracker.addResourceDependency(node.getSourceFile(), absoluteFrom(template.resolvedTemplateUrl));
      }
      return __spreadProps(__spreadValues({}, this._parseTemplate(template, templateContent, null, false, template.resolvedTemplateUrl)), {
        content: templateContent,
        sourceMapping: {
          type: "external",
          componentClass: node,
          node: template.templateUrlExpression,
          template: templateContent,
          templateUrl: template.resolvedTemplateUrl
        },
        declaration: template
      });
    }
  }
  _parseTemplate(template, sourceStr, sourceParseRange, escapedString, sourceMapUrl) {
    const i18nNormalizeLineEndingsInICUs = escapedString || this.i18nNormalizeLineEndingsInICUs;
    const parsedTemplate = parseTemplate(sourceStr, sourceMapUrl != null ? sourceMapUrl : "", {
      preserveWhitespaces: template.preserveWhitespaces,
      interpolationConfig: template.interpolationConfig,
      range: sourceParseRange != null ? sourceParseRange : void 0,
      escapedString,
      enableI18nLegacyMessageIdFormat: this.enableI18nLegacyMessageIdFormat,
      i18nNormalizeLineEndingsInICUs,
      alwaysAttemptHtmlToR3AstConversion: this.usePoisonedData
    });
    const { nodes: diagNodes } = parseTemplate(sourceStr, sourceMapUrl != null ? sourceMapUrl : "", {
      preserveWhitespaces: true,
      preserveLineEndings: true,
      interpolationConfig: template.interpolationConfig,
      range: sourceParseRange != null ? sourceParseRange : void 0,
      escapedString,
      enableI18nLegacyMessageIdFormat: this.enableI18nLegacyMessageIdFormat,
      i18nNormalizeLineEndingsInICUs,
      leadingTriviaChars: [],
      alwaysAttemptHtmlToR3AstConversion: this.usePoisonedData
    });
    return __spreadProps(__spreadValues({}, parsedTemplate), {
      diagNodes,
      file: new ParseSourceFile2(sourceStr, sourceMapUrl != null ? sourceMapUrl : "")
    });
  }
  parseTemplateDeclaration(decorator, component, containingFile) {
    let preserveWhitespaces = this.defaultPreserveWhitespaces;
    if (component.has("preserveWhitespaces")) {
      const expr = component.get("preserveWhitespaces");
      const value = this.evaluator.evaluate(expr);
      if (typeof value !== "boolean") {
        throw createValueHasWrongTypeError(expr, value, "preserveWhitespaces must be a boolean");
      }
      preserveWhitespaces = value;
    }
    let interpolationConfig = DEFAULT_INTERPOLATION_CONFIG;
    if (component.has("interpolation")) {
      const expr = component.get("interpolation");
      const value = this.evaluator.evaluate(expr);
      if (!Array.isArray(value) || value.length !== 2 || !value.every((element) => typeof element === "string")) {
        throw createValueHasWrongTypeError(expr, value, "interpolation must be an array with 2 elements of string type");
      }
      interpolationConfig = InterpolationConfig.fromArray(value);
    }
    if (component.has("templateUrl")) {
      const templateUrlExpr = component.get("templateUrl");
      const templateUrl = this.evaluator.evaluate(templateUrlExpr);
      if (typeof templateUrl !== "string") {
        throw createValueHasWrongTypeError(templateUrlExpr, templateUrl, "templateUrl must be a string");
      }
      try {
        const resourceUrl = this.resourceLoader.resolve(templateUrl, containingFile);
        return {
          isInline: false,
          interpolationConfig,
          preserveWhitespaces,
          templateUrl,
          templateUrlExpression: templateUrlExpr,
          resolvedTemplateUrl: resourceUrl
        };
      } catch (e) {
        throw this.makeResourceNotFoundError(templateUrl, templateUrlExpr, 0);
      }
    } else if (component.has("template")) {
      return {
        isInline: true,
        interpolationConfig,
        preserveWhitespaces,
        expression: component.get("template"),
        templateUrl: containingFile,
        resolvedTemplateUrl: containingFile
      };
    } else {
      throw new FatalDiagnosticError(ErrorCode.COMPONENT_MISSING_TEMPLATE, Decorator.nodeForError(decorator), "component is missing a template");
    }
  }
  _resolveImportedFile(importedFile, expr, origin) {
    if (importedFile !== "unknown") {
      return importedFile;
    }
    if (!(expr instanceof ExternalExpr5)) {
      return null;
    }
    return this.moduleResolver.resolveModule(expr.value.moduleName, origin.fileName);
  }
  _checkForCyclicImport(importedFile, expr, origin) {
    const imported = this._resolveImportedFile(importedFile, expr, origin);
    if (imported === null) {
      return null;
    }
    return this.cycleAnalyzer.wouldCreateCycle(origin, imported);
  }
  _recordSyntheticImport(importedFile, expr, origin) {
    const imported = this._resolveImportedFile(importedFile, expr, origin);
    if (imported === null) {
      return;
    }
    this.cycleAnalyzer.recordSyntheticImport(origin, imported);
  }
  makeResourceNotFoundError(file, nodeForError, resourceType) {
    let errorText;
    switch (resourceType) {
      case 0:
        errorText = `Could not find template file '${file}'.`;
        break;
      case 1:
        errorText = `Could not find stylesheet file '${file}' linked from the template.`;
        break;
      case 2:
        errorText = `Could not find stylesheet file '${file}'.`;
        break;
    }
    return new FatalDiagnosticError(ErrorCode.COMPONENT_RESOURCE_NOT_FOUND, nodeForError, errorText);
  }
  _extractTemplateStyleUrls(template) {
    if (template.styleUrls === null) {
      return [];
    }
    const nodeForError = getTemplateDeclarationNodeForError(template.declaration);
    return template.styleUrls.map((url) => ({ url, source: 1, nodeForError }));
  }
};
function getTemplateRange(templateExpr) {
  const startPos = templateExpr.getStart() + 1;
  const { line, character } = ts18.getLineAndCharacterOfPosition(templateExpr.getSourceFile(), startPos);
  return {
    startPos,
    startLine: line,
    startCol: character,
    endPos: templateExpr.getEnd() - 1
  };
}
function isStringArray(resolvedValue) {
  return Array.isArray(resolvedValue) && resolvedValue.every((elem) => typeof elem === "string");
}
function getTemplateDeclarationNodeForError(declaration) {
  switch (declaration.isInline) {
    case true:
      return declaration.expression;
    case false:
      return declaration.templateUrlExpression;
  }
}
function makeCyclicImportInfo(ref, type, cycle) {
  const name = ref.debugName || "(unknown)";
  const path = cycle.getPath().map((sf) => sf.fileName).join(" -> ");
  const message = `The ${type} '${name}' is used in the template but importing it would create a cycle: `;
  return makeRelatedInformation(ref.node, message + path);
}
function checkCustomElementSelectorForErrors(selector) {
  if (selector.includes(".") || selector.includes("[") && selector.includes("]")) {
    return null;
  }
  if (!/^[a-z]/.test(selector)) {
    return "Selector of a ShadowDom-encapsulated component must start with a lower case letter.";
  }
  if (/[A-Z]/.test(selector)) {
    return "Selector of a ShadowDom-encapsulated component must all be in lower case.";
  }
  if (!selector.includes("-")) {
    return "Selector of a component that uses ViewEncapsulation.ShadowDom must contain a hyphen.";
  }
  return null;
}
function collectAnimationNames(value, animationTriggerNames) {
  if (value instanceof Map) {
    const name = value.get("name");
    if (typeof name === "string") {
      animationTriggerNames.staticTriggerNames.push(name);
    } else {
      animationTriggerNames.includesDynamicAnimations = true;
    }
  } else if (Array.isArray(value)) {
    for (const resolvedValue of value) {
      collectAnimationNames(resolvedValue, animationTriggerNames);
    }
  } else {
    animationTriggerNames.includesDynamicAnimations = true;
  }
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/injectable.mjs
import { compileClassMetadata as compileClassMetadata4, compileDeclareClassMetadata as compileDeclareClassMetadata4, compileDeclareInjectableFromMetadata, compileInjectable, createMayBeForwardRefExpression as createMayBeForwardRefExpression2, FactoryTarget as FactoryTarget4, LiteralExpr as LiteralExpr3, WrappedNodeExpr as WrappedNodeExpr6 } from "@angular/compiler";
import ts19 from "typescript";
var InjectableDecoratorHandler = class {
  constructor(reflector, isCore, strictCtorDeps, injectableRegistry, perf, errorOnDuplicateProv = true) {
    this.reflector = reflector;
    this.isCore = isCore;
    this.strictCtorDeps = strictCtorDeps;
    this.injectableRegistry = injectableRegistry;
    this.perf = perf;
    this.errorOnDuplicateProv = errorOnDuplicateProv;
    this.precedence = HandlerPrecedence.SHARED;
    this.name = InjectableDecoratorHandler.name;
  }
  detect(node, decorators) {
    if (!decorators) {
      return void 0;
    }
    const decorator = findAngularDecorator(decorators, "Injectable", this.isCore);
    if (decorator !== void 0) {
      return {
        trigger: decorator.node,
        decorator,
        metadata: decorator
      };
    } else {
      return void 0;
    }
  }
  analyze(node, decorator) {
    this.perf.eventCount(PerfEvent.AnalyzeInjectable);
    const meta = extractInjectableMetadata(node, decorator, this.reflector);
    const decorators = this.reflector.getDecoratorsOfDeclaration(node);
    return {
      analysis: {
        meta,
        ctorDeps: extractInjectableCtorDeps(node, meta, decorator, this.reflector, this.isCore, this.strictCtorDeps),
        classMetadata: extractClassMetadata(node, this.reflector, this.isCore),
        needsFactory: !decorators || decorators.every((current) => !isAngularCore(current) || current.name === "Injectable")
      }
    };
  }
  symbol() {
    return null;
  }
  register(node) {
    this.injectableRegistry.registerInjectable(node);
  }
  compileFull(node, analysis) {
    return this.compile(compileNgFactoryDefField, (meta) => compileInjectable(meta, false), compileClassMetadata4, node, analysis);
  }
  compilePartial(node, analysis) {
    return this.compile(compileDeclareFactory, compileDeclareInjectableFromMetadata, compileDeclareClassMetadata4, node, analysis);
  }
  compile(compileFactoryFn, compileInjectableFn, compileClassMetadataFn, node, analysis) {
    const results = [];
    if (analysis.needsFactory) {
      const meta = analysis.meta;
      const factoryRes = compileFactoryFn(toFactoryMetadata(__spreadProps(__spreadValues({}, meta), { deps: analysis.ctorDeps }), FactoryTarget4.Injectable));
      if (analysis.classMetadata !== null) {
        factoryRes.statements.push(compileClassMetadataFn(analysis.classMetadata).toStmt());
      }
      results.push(factoryRes);
    }
    const \u0275prov = this.reflector.getMembersOfClass(node).find((member) => member.name === "\u0275prov");
    if (\u0275prov !== void 0 && this.errorOnDuplicateProv) {
      throw new FatalDiagnosticError(ErrorCode.INJECTABLE_DUPLICATE_PROV, \u0275prov.nameNode || \u0275prov.node || node, "Injectables cannot contain a static \u0275prov property, because the compiler is going to generate one.");
    }
    if (\u0275prov === void 0) {
      const res = compileInjectableFn(analysis.meta);
      results.push({ name: "\u0275prov", initializer: res.expression, statements: res.statements, type: res.type });
    }
    return results;
  }
};
function extractInjectableMetadata(clazz, decorator, reflector) {
  const name = clazz.name.text;
  const type = wrapTypeReference(reflector, clazz);
  const internalType = new WrappedNodeExpr6(reflector.getInternalNameOfClass(clazz));
  const typeArgumentCount = reflector.getGenericArityOfClass(clazz) || 0;
  if (decorator.args === null) {
    throw new FatalDiagnosticError(ErrorCode.DECORATOR_NOT_CALLED, Decorator.nodeForError(decorator), "@Injectable must be called");
  }
  if (decorator.args.length === 0) {
    return {
      name,
      type,
      typeArgumentCount,
      internalType,
      providedIn: createMayBeForwardRefExpression2(new LiteralExpr3(null), 0)
    };
  } else if (decorator.args.length === 1) {
    const metaNode = decorator.args[0];
    if (!ts19.isObjectLiteralExpression(metaNode)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARG_NOT_LITERAL, metaNode, `@Injectable argument must be an object literal`);
    }
    const meta = reflectObjectLiteral(metaNode);
    const providedIn = meta.has("providedIn") ? getProviderExpression(meta.get("providedIn"), reflector) : createMayBeForwardRefExpression2(new LiteralExpr3(null), 0);
    let deps = void 0;
    if ((meta.has("useClass") || meta.has("useFactory")) && meta.has("deps")) {
      const depsExpr = meta.get("deps");
      if (!ts19.isArrayLiteralExpression(depsExpr)) {
        throw new FatalDiagnosticError(ErrorCode.VALUE_NOT_LITERAL, depsExpr, `@Injectable deps metadata must be an inline array`);
      }
      deps = depsExpr.elements.map((dep) => getDep(dep, reflector));
    }
    const result = { name, type, typeArgumentCount, internalType, providedIn };
    if (meta.has("useValue")) {
      result.useValue = getProviderExpression(meta.get("useValue"), reflector);
    } else if (meta.has("useExisting")) {
      result.useExisting = getProviderExpression(meta.get("useExisting"), reflector);
    } else if (meta.has("useClass")) {
      result.useClass = getProviderExpression(meta.get("useClass"), reflector);
      result.deps = deps;
    } else if (meta.has("useFactory")) {
      result.useFactory = new WrappedNodeExpr6(meta.get("useFactory"));
      result.deps = deps;
    }
    return result;
  } else {
    throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, decorator.args[2], "Too many arguments to @Injectable");
  }
}
function getProviderExpression(expression, reflector) {
  const forwardRefValue = tryUnwrapForwardRef(expression, reflector);
  return createMayBeForwardRefExpression2(new WrappedNodeExpr6(forwardRefValue != null ? forwardRefValue : expression), forwardRefValue !== null ? 2 : 0);
}
function extractInjectableCtorDeps(clazz, meta, decorator, reflector, isCore, strictCtorDeps) {
  if (decorator.args === null) {
    throw new FatalDiagnosticError(ErrorCode.DECORATOR_NOT_CALLED, Decorator.nodeForError(decorator), "@Injectable must be called");
  }
  let ctorDeps = null;
  if (decorator.args.length === 0) {
    if (strictCtorDeps) {
      ctorDeps = getValidConstructorDependencies(clazz, reflector, isCore);
    } else {
      ctorDeps = unwrapConstructorDependencies(getConstructorDependencies(clazz, reflector, isCore));
    }
    return ctorDeps;
  } else if (decorator.args.length === 1) {
    const rawCtorDeps = getConstructorDependencies(clazz, reflector, isCore);
    if (strictCtorDeps && meta.useValue === void 0 && meta.useExisting === void 0 && meta.useClass === void 0 && meta.useFactory === void 0) {
      ctorDeps = validateConstructorDependencies(clazz, rawCtorDeps);
    } else {
      ctorDeps = unwrapConstructorDependencies(rawCtorDeps);
    }
  }
  return ctorDeps;
}
function getDep(dep, reflector) {
  const meta = {
    token: new WrappedNodeExpr6(dep),
    attributeNameType: null,
    host: false,
    optional: false,
    self: false,
    skipSelf: false
  };
  function maybeUpdateDecorator(dec, reflector2, token) {
    const source = reflector2.getImportOfIdentifier(dec);
    if (source === null || source.from !== "@angular/core") {
      return false;
    }
    switch (source.name) {
      case "Inject":
        if (token !== void 0) {
          meta.token = new WrappedNodeExpr6(token);
        }
        break;
      case "Optional":
        meta.optional = true;
        break;
      case "SkipSelf":
        meta.skipSelf = true;
        break;
      case "Self":
        meta.self = true;
        break;
      default:
        return false;
    }
    return true;
  }
  if (ts19.isArrayLiteralExpression(dep)) {
    dep.elements.forEach((el) => {
      let isDecorator = false;
      if (ts19.isIdentifier(el)) {
        isDecorator = maybeUpdateDecorator(el, reflector);
      } else if (ts19.isNewExpression(el) && ts19.isIdentifier(el.expression)) {
        const token = el.arguments && el.arguments.length > 0 && el.arguments[0] || void 0;
        isDecorator = maybeUpdateDecorator(el.expression, reflector, token);
      }
      if (!isDecorator) {
        meta.token = new WrappedNodeExpr6(el);
      }
    });
  }
  return meta;
}

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/pipe.mjs
import { compileClassMetadata as compileClassMetadata5, compileDeclareClassMetadata as compileDeclareClassMetadata5, compileDeclarePipeFromMetadata, compilePipeFromMetadata, FactoryTarget as FactoryTarget5, WrappedNodeExpr as WrappedNodeExpr7 } from "@angular/compiler";
import ts20 from "typescript";
var PipeSymbol = class extends SemanticSymbol {
  constructor(decl, name) {
    super(decl);
    this.name = name;
  }
  isPublicApiAffected(previousSymbol) {
    if (!(previousSymbol instanceof PipeSymbol)) {
      return true;
    }
    return this.name !== previousSymbol.name;
  }
  isTypeCheckApiAffected(previousSymbol) {
    return this.isPublicApiAffected(previousSymbol);
  }
};
var PipeDecoratorHandler = class {
  constructor(reflector, evaluator, metaRegistry, scopeRegistry, injectableRegistry, isCore, perf) {
    this.reflector = reflector;
    this.evaluator = evaluator;
    this.metaRegistry = metaRegistry;
    this.scopeRegistry = scopeRegistry;
    this.injectableRegistry = injectableRegistry;
    this.isCore = isCore;
    this.perf = perf;
    this.precedence = HandlerPrecedence.PRIMARY;
    this.name = PipeDecoratorHandler.name;
  }
  detect(node, decorators) {
    if (!decorators) {
      return void 0;
    }
    const decorator = findAngularDecorator(decorators, "Pipe", this.isCore);
    if (decorator !== void 0) {
      return {
        trigger: decorator.node,
        decorator,
        metadata: decorator
      };
    } else {
      return void 0;
    }
  }
  analyze(clazz, decorator) {
    this.perf.eventCount(PerfEvent.AnalyzePipe);
    const name = clazz.name.text;
    const type = wrapTypeReference(this.reflector, clazz);
    const internalType = new WrappedNodeExpr7(this.reflector.getInternalNameOfClass(clazz));
    if (decorator.args === null) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_NOT_CALLED, Decorator.nodeForError(decorator), `@Pipe must be called`);
    }
    if (decorator.args.length !== 1) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARITY_WRONG, Decorator.nodeForError(decorator), "@Pipe must have exactly one argument");
    }
    const meta = unwrapExpression(decorator.args[0]);
    if (!ts20.isObjectLiteralExpression(meta)) {
      throw new FatalDiagnosticError(ErrorCode.DECORATOR_ARG_NOT_LITERAL, meta, "@Pipe must have a literal argument");
    }
    const pipe = reflectObjectLiteral(meta);
    if (!pipe.has("name")) {
      throw new FatalDiagnosticError(ErrorCode.PIPE_MISSING_NAME, meta, `@Pipe decorator is missing name field`);
    }
    const pipeNameExpr = pipe.get("name");
    const pipeName = this.evaluator.evaluate(pipeNameExpr);
    if (typeof pipeName !== "string") {
      throw createValueHasWrongTypeError(pipeNameExpr, pipeName, `@Pipe.name must be a string`);
    }
    let pure = true;
    if (pipe.has("pure")) {
      const expr = pipe.get("pure");
      const pureValue = this.evaluator.evaluate(expr);
      if (typeof pureValue !== "boolean") {
        throw createValueHasWrongTypeError(expr, pureValue, `@Pipe.pure must be a boolean`);
      }
      pure = pureValue;
    }
    return {
      analysis: {
        meta: {
          name,
          type,
          internalType,
          typeArgumentCount: this.reflector.getGenericArityOfClass(clazz) || 0,
          pipeName,
          deps: getValidConstructorDependencies(clazz, this.reflector, this.isCore),
          pure
        },
        classMetadata: extractClassMetadata(clazz, this.reflector, this.isCore),
        pipeNameExpr
      }
    };
  }
  symbol(node, analysis) {
    return new PipeSymbol(node, analysis.meta.name);
  }
  register(node, analysis) {
    const ref = new Reference(node);
    this.metaRegistry.registerPipeMetadata({ type: MetaType.Pipe, ref, name: analysis.meta.pipeName, nameExpr: analysis.pipeNameExpr });
    this.injectableRegistry.registerInjectable(node);
  }
  resolve(node) {
    const duplicateDeclData = this.scopeRegistry.getDuplicateDeclarations(node);
    if (duplicateDeclData !== null) {
      return {
        diagnostics: [makeDuplicateDeclarationError(node, duplicateDeclData, "Pipe")]
      };
    }
    return {};
  }
  compileFull(node, analysis) {
    const fac = compileNgFactoryDefField(toFactoryMetadata(analysis.meta, FactoryTarget5.Pipe));
    const def = compilePipeFromMetadata(analysis.meta);
    const classMetadata = analysis.classMetadata !== null ? compileClassMetadata5(analysis.classMetadata).toStmt() : null;
    return compileResults(fac, def, classMetadata, "\u0275pipe");
  }
  compilePartial(node, analysis) {
    const fac = compileDeclareFactory(toFactoryMetadata(analysis.meta, FactoryTarget5.Pipe));
    const def = compileDeclarePipeFromMetadata(analysis.meta);
    const classMetadata = analysis.classMetadata !== null ? compileDeclareClassMetadata5(analysis.classMetadata).toStmt() : null;
    return compileResults(fac, def, classMetadata, "\u0275pipe");
  }
};

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/src/ngtsc/annotations/src/references_registry.mjs
var NoopReferencesRegistry = class {
  add(source, ...references) {
  }
};

export {
  SemanticDepGraphUpdater,
  CompoundMetadataReader,
  DtsMetadataReader,
  flattenInheritedDirectiveMetadata,
  LocalMetadataRegistry,
  CompoundMetadataRegistry,
  InjectableClassRegistry,
  ResourceRegistry,
  DynamicValue,
  StaticInterpreter,
  PartialEvaluator,
  CompilationMode,
  HandlerFlags,
  aliasTransformFactory,
  TraitState,
  TraitCompiler,
  DtsTransformRegistry,
  declarationTransformFactory,
  ivyTransformFactory,
  forwardRefResolver,
  readBaseClass,
  DirectiveDecoratorHandler,
  NgModuleDecoratorHandler,
  ComponentDecoratorHandler,
  InjectableDecoratorHandler,
  PipeDecoratorHandler,
  NoopReferencesRegistry
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=chunk-3URTMUFW.js.map
