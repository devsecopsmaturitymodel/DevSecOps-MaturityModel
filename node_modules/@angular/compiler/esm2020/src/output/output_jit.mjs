/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { identifierName } from '../parse_util';
import { EmitterVisitorContext } from './abstract_emitter';
import { AbstractJsEmitterVisitor } from './abstract_js_emitter';
import * as o from './output_ast';
import { newTrustedFunctionForJIT } from './output_jit_trusted_types';
/**
 * A helper class to manage the evaluation of JIT generated code.
 */
export class JitEvaluator {
    /**
     *
     * @param sourceUrl The URL of the generated code.
     * @param statements An array of Angular statement AST nodes to be evaluated.
     * @param refResolver Resolves `o.ExternalReference`s into values.
     * @param createSourceMaps If true then create a source-map for the generated code and include it
     * inline as a source-map comment.
     * @returns A map of all the variables in the generated code.
     */
    evaluateStatements(sourceUrl, statements, refResolver, createSourceMaps) {
        const converter = new JitEmitterVisitor(refResolver);
        const ctx = EmitterVisitorContext.createRoot();
        // Ensure generated code is in strict mode
        if (statements.length > 0 && !isUseStrictStatement(statements[0])) {
            statements = [
                o.literal('use strict').toStmt(),
                ...statements,
            ];
        }
        converter.visitAllStatements(statements, ctx);
        converter.createReturnStmt(ctx);
        return this.evaluateCode(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
    }
    /**
     * Evaluate a piece of JIT generated code.
     * @param sourceUrl The URL of this generated code.
     * @param ctx A context object that contains an AST of the code to be evaluated.
     * @param vars A map containing the names and values of variables that the evaluated code might
     * reference.
     * @param createSourceMap If true then create a source-map for the generated code and include it
     * inline as a source-map comment.
     * @returns The result of evaluating the code.
     */
    evaluateCode(sourceUrl, ctx, vars, createSourceMap) {
        let fnBody = `"use strict";${ctx.toSource()}\n//# sourceURL=${sourceUrl}`;
        const fnArgNames = [];
        const fnArgValues = [];
        for (const argName in vars) {
            fnArgValues.push(vars[argName]);
            fnArgNames.push(argName);
        }
        if (createSourceMap) {
            // using `new Function(...)` generates a header, 1 line of no arguments, 2 lines otherwise
            // E.g. ```
            // function anonymous(a,b,c
            // /**/) { ... }```
            // We don't want to hard code this fact, so we auto detect it via an empty function first.
            const emptyFn = newTrustedFunctionForJIT(...fnArgNames.concat('return null;')).toString();
            const headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
            fnBody += `\n${ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment()}`;
        }
        const fn = newTrustedFunctionForJIT(...fnArgNames.concat(fnBody));
        return this.executeFunction(fn, fnArgValues);
    }
    /**
     * Execute a JIT generated function by calling it.
     *
     * This method can be overridden in tests to capture the functions that are generated
     * by this `JitEvaluator` class.
     *
     * @param fn A function to execute.
     * @param args The arguments to pass to the function being executed.
     * @returns The return value of the executed function.
     */
    executeFunction(fn, args) {
        return fn(...args);
    }
}
/**
 * An Angular AST visitor that converts AST nodes into executable JavaScript code.
 */
export class JitEmitterVisitor extends AbstractJsEmitterVisitor {
    constructor(refResolver) {
        super();
        this.refResolver = refResolver;
        this._evalArgNames = [];
        this._evalArgValues = [];
        this._evalExportedVars = [];
    }
    createReturnStmt(ctx) {
        const stmt = new o.ReturnStatement(new o.LiteralMapExpr(this._evalExportedVars.map(resultVar => new o.LiteralMapEntry(resultVar, o.variable(resultVar), false))));
        stmt.visitStatement(this, ctx);
    }
    getArgs() {
        const result = {};
        for (let i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    }
    visitExternalExpr(ast, ctx) {
        this._emitReferenceToExternal(ast, this.refResolver.resolveExternalReference(ast.value), ctx);
        return null;
    }
    visitWrappedNodeExpr(ast, ctx) {
        this._emitReferenceToExternal(ast, ast.node, ctx);
        return null;
    }
    visitDeclareVarStmt(stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareVarStmt(stmt, ctx);
    }
    visitDeclareFunctionStmt(stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            this._evalExportedVars.push(stmt.name);
        }
        return super.visitDeclareFunctionStmt(stmt, ctx);
    }
    _emitReferenceToExternal(ast, value, ctx) {
        let id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            const name = identifierName({ reference: value }) || 'val';
            this._evalArgNames.push(`jit_${name}_${id}`);
        }
        ctx.print(ast, this._evalArgNames[id]);
    }
}
function isUseStrictStatement(statement) {
    return statement.isEquivalent(o.literal('use strict').toStmt());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2ppdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvb3V0cHV0X2ppdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTdDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3pELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9ELE9BQU8sS0FBSyxDQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBTXBFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUFDdkI7Ozs7Ozs7O09BUUc7SUFDSCxrQkFBa0IsQ0FDZCxTQUFpQixFQUFFLFVBQXlCLEVBQUUsV0FBc0MsRUFDcEYsZ0JBQXlCO1FBQzNCLE1BQU0sU0FBUyxHQUFHLElBQUksaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckQsTUFBTSxHQUFHLEdBQUcscUJBQXFCLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDL0MsMENBQTBDO1FBQzFDLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNqRSxVQUFVLEdBQUc7Z0JBQ1gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLEdBQUcsVUFBVTthQUNkLENBQUM7U0FDSDtRQUNELFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxD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RUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2IsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQztZQUN6RCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDRjtBQUdELFNBQVMsb0JBQW9CLENBQUMsU0FBc0I7SUFDbEQsT0FBTyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUNsRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aWRlbnRpZmllck5hbWV9IGZyb20gJy4uL3BhcnNlX3V0aWwnO1xuXG5pbXBvcnQge0VtaXR0ZXJWaXNpdG9yQ29udGV4dH0gZnJvbSAnLi9hYnN0cmFjdF9lbWl0dGVyJztcbmltcG9ydCB7QWJzdHJhY3RKc0VtaXR0ZXJWaXNpdG9yfSBmcm9tICcuL2Fic3RyYWN0X2pzX2VtaXR0ZXInO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuL291dHB1dF9hc3QnO1xuaW1wb3J0IHtuZXdUcnVzdGVkRnVuY3Rpb25Gb3JKSVR9IGZyb20gJy4vb3V0cHV0X2ppdF90cnVzdGVkX3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBFeHRlcm5hbFJlZmVyZW5jZVJlc29sdmVyIHtcbiAgcmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKHJlZjogby5FeHRlcm5hbFJlZmVyZW5jZSk6IHVua25vd247XG59XG5cbi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gbWFuYWdlIHRoZSBldmFsdWF0aW9uIG9mIEpJVCBnZW5lcmF0ZWQgY29kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEppdEV2YWx1YXRvciB7XG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gc291cmNlVXJsIFRoZSBVUkwgb2YgdGhlIGdlbmVyYXRlZCBjb2RlLlxuICAgKiBAcGFyYW0gc3RhdGVtZW50cyBBbiBhcnJheSBvZiBBbmd1bGFyIHN0YXRlbWVudCBBU1Qgbm9kZXMgdG8gYmUgZXZhbHVhdGVkLlxuICAgKiBAcGFyYW0gcmVmUmVzb2x2ZXIgUmVzb2x2ZXMgYG8uRXh0ZXJuYWxSZWZlcmVuY2VgcyBpbnRvIHZhbHVlcy5cbiAgICogQHBhcmFtIGNyZWF0ZVNvdXJjZU1hcHMgSWYgdHJ1ZSB0aGVuIGNyZWF0ZSBhIHNvdXJjZS1tYXAgZm9yIHRoZSBnZW5lcmF0ZWQgY29kZSBhbmQgaW5jbHVkZSBpdFxuICAgKiBpbmxpbmUgYXMgYSBzb3VyY2UtbWFwIGNvbW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbWFwIG9mIGFsbCB0aGUgdmFyaWFibGVzIGluIHRoZSBnZW5lcmF0ZWQgY29kZS5cbiAgICovXG4gIGV2YWx1YXRlU3RhdGVtZW50cyhcbiAgICAgIHNvdXJjZVVybDogc3RyaW5nLCBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdLCByZWZSZXNvbHZlcjogRXh0ZXJuYWxSZWZlcmVuY2VSZXNvbHZlcixcbiAgICAgIGNyZWF0ZVNvdXJjZU1hcHM6IGJvb2xlYW4pOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgY29uc3QgY29udmVydGVyID0gbmV3IEppdEVtaXR0ZXJWaXNpdG9yKHJlZlJlc29sdmVyKTtcbiAgICBjb25zdCBjdHggPSBFbWl0dGVyVmlzaXRvckNvbnRleHQuY3JlYXRlUm9vdCgpO1xuICAgIC8vIEVuc3VyZSBnZW5lcmF0ZWQgY29kZSBpcyBpbiBzdHJpY3QgbW9kZVxuICAgIGlmIChzdGF0ZW1lbnRzLmxlbmd0aCA+IDAgJiYgIWlzVXNlU3RyaWN0U3RhdGVtZW50KHN0YXRlbWVudHNbMF0pKSB7XG4gICAgICBzdGF0ZW1lbnRzID0gW1xuICAgICAgICBvLmxpdGVyYWwoJ3VzZSBzdHJpY3QnKS50b1N0bXQoKSxcbiAgICAgICAgLi4uc3RhdGVtZW50cyxcbiAgICAgIF07XG4gICAgfVxuICAgIGNvbnZlcnRlci52aXNpdEFsbFN0YXRlbWVudHMoc3RhdGVtZW50cywgY3R4KTtcbiAgICBjb252ZXJ0ZXIuY3JlYXRlUmV0dXJuU3RtdChjdHgpO1xuICAgIHJldHVybiB0aGlzLmV2YWx1YXRlQ29kZShzb3VyY2VVcmwsIGN0eCwgY29udmVydGVyLmdldEFyZ3MoKSwgY3JlYXRlU291cmNlTWFwcyk7XG4gIH1cblxuICAvKipcbiAgICogRXZhbHVhdGUgYSBwaWVjZSBvZiBKSVQgZ2VuZXJhdGVkIGNvZGUuXG4gICAqIEBwYXJhbSBzb3VyY2VVcmwgVGhlIFVSTCBvZiB0aGlzIGdlbmVyYXRlZCBjb2RlLlxuICAgKiBAcGFyYW0gY3R4IEEgY29udGV4dCBvYmplY3QgdGhhdCBjb250YWlucyBhbiBBU1Qgb2YgdGhlIGNvZGUgdG8gYmUgZXZhbHVhdGVkLlxuICAgKiBAcGFyYW0gdmFycyBBIG1hcCBjb250YWluaW5nIHRoZSBuYW1lcyBhbmQgdmFsdWVzIG9mIHZhcmlhYmxlcyB0aGF0IHRoZSBldmFsdWF0ZWQgY29kZSBtaWdodFxuICAgKiByZWZlcmVuY2UuXG4gICAqIEBwYXJhbSBjcmVhdGVTb3VyY2VNYXAgSWYgdHJ1ZSB0aGVuIGNyZWF0ZSBhIHNvdXJjZS1tYXAgZm9yIHRoZSBnZW5lcmF0ZWQgY29kZSBhbmQgaW5jbHVkZSBpdFxuICAgKiBpbmxpbmUgYXMgYSBzb3VyY2UtbWFwIGNvbW1lbnQuXG4gICAqIEByZXR1cm5zIFRoZSByZXN1bHQgb2YgZXZhbHVhdGluZyB0aGUgY29kZS5cbiAgICovXG4gIGV2YWx1YXRlQ29kZShcbiAgICAgIHNvdXJjZVVybDogc3RyaW5nLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCwgdmFyczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBjcmVhdGVTb3VyY2VNYXA6IGJvb2xlYW4pOiBhbnkge1xuICAgIGxldCBmbkJvZHkgPSBgXCJ1c2Ugc3RyaWN0XCI7JHtjdHgudG9Tb3VyY2UoKX1cXG4vLyMgc291cmNlVVJMPSR7c291cmNlVXJsfWA7XG4gICAgY29uc3QgZm5BcmdOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBmbkFyZ1ZhbHVlczogYW55W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IGFyZ05hbWUgaW4gdmFycykge1xuICAgICAgZm5BcmdWYWx1ZXMucHVzaCh2YXJzW2FyZ05hbWVdKTtcbiAgICAgIGZuQXJnTmFtZXMucHVzaChhcmdOYW1lKTtcbiAgICB9XG4gICAgaWYgKGNyZWF0ZVNvdXJjZU1hcCkge1xuICAgICAgLy8gdXNpbmcgYG5ldyBGdW5jdGlvbiguLi4pYCBnZW5lcmF0ZXMgYSBoZWFkZXIsIDEgbGluZSBvZiBubyBhcmd1bWVudHMsIDIgbGluZXMgb3RoZXJ3aXNlXG4gICAgICAvLyBFLmcuIGBgYFxuICAgICAgLy8gZnVuY3Rpb24gYW5vbnltb3VzKGEsYixjXG4gICAgICAvLyAvKiovKSB7IC4uLiB9YGBgXG4gICAgICAvLyBXZSBkb24ndCB3YW50IHRvIGhhcmQgY29kZSB0aGlzIGZhY3QsIHNvIHdlIGF1dG8gZGV0ZWN0IGl0IHZpYSBhbiBlbXB0eSBmdW5jdGlvbiBmaXJzdC5cbiAgICAgIGNvbnN0IGVtcHR5Rm4gPSBuZXdUcnVzdGVkRnVuY3Rpb25Gb3JKSVQoLi4uZm5BcmdOYW1lcy5jb25jYXQoJ3JldHVybiBudWxsOycpKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgaGVhZGVyTGluZXMgPSBlbXB0eUZuLnNsaWNlKDAsIGVtcHR5Rm4uaW5kZXhPZigncmV0dXJuIG51bGw7JykpLnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxO1xuICAgICAgZm5Cb2R5ICs9IGBcXG4ke2N0eC50b1NvdXJjZU1hcEdlbmVyYXRvcihzb3VyY2VVcmwsIGhlYWRlckxpbmVzKS50b0pzQ29tbWVudCgpfWA7XG4gICAgfVxuICAgIGNvbnN0IGZuID0gbmV3VHJ1c3RlZEZ1bmN0aW9uRm9ySklUKC4uLmZuQXJnTmFtZXMuY29uY2F0KGZuQm9keSkpO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVGdW5jdGlvbihmbiwgZm5BcmdWYWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBKSVQgZ2VuZXJhdGVkIGZ1bmN0aW9uIGJ5IGNhbGxpbmcgaXQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZGVuIGluIHRlc3RzIHRvIGNhcHR1cmUgdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBnZW5lcmF0ZWRcbiAgICogYnkgdGhpcyBgSml0RXZhbHVhdG9yYCBjbGFzcy5cbiAgICpcbiAgICogQHBhcmFtIGZuIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZS5cbiAgICogQHBhcmFtIGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBmdW5jdGlvbiBiZWluZyBleGVjdXRlZC5cbiAgICogQHJldHVybnMgVGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZXhlY3V0ZWQgZnVuY3Rpb24uXG4gICAqL1xuICBleGVjdXRlRnVuY3Rpb24oZm46IEZ1bmN0aW9uLCBhcmdzOiBhbnlbXSkge1xuICAgIHJldHVybiBmbiguLi5hcmdzKTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIEFuZ3VsYXIgQVNUIHZpc2l0b3IgdGhhdCBjb252ZXJ0cyBBU1Qgbm9kZXMgaW50byBleGVjdXRhYmxlIEphdmFTY3JpcHQgY29kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEppdEVtaXR0ZXJWaXNpdG9yIGV4dGVuZHMgQWJzdHJhY3RKc0VtaXR0ZXJWaXNpdG9yIHtcbiAgcHJpdmF0ZSBfZXZhbEFyZ05hbWVzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIF9ldmFsQXJnVmFsdWVzOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIF9ldmFsRXhwb3J0ZWRWYXJzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVmUmVzb2x2ZXI6IEV4dGVybmFsUmVmZXJlbmNlUmVzb2x2ZXIpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgY3JlYXRlUmV0dXJuU3RtdChjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCkge1xuICAgIGNvbnN0IHN0bXQgPSBuZXcgby5SZXR1cm5TdGF0ZW1lbnQobmV3IG8uTGl0ZXJhbE1hcEV4cHIodGhpcy5fZXZhbEV4cG9ydGVkVmFycy5tYXAoXG4gICAgICAgIHJlc3VsdFZhciA9PiBuZXcgby5MaXRlcmFsTWFwRW50cnkocmVzdWx0VmFyLCBvLnZhcmlhYmxlKHJlc3VsdFZhciksIGZhbHNlKSkpKTtcbiAgICBzdG10LnZpc2l0U3RhdGVtZW50KHRoaXMsIGN0eCk7XG4gIH1cblxuICBnZXRBcmdzKCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICBjb25zdCByZXN1bHQ6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmFsQXJnTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFt0aGlzLl9ldmFsQXJnTmFtZXNbaV1dID0gdGhpcy5fZXZhbEFyZ1ZhbHVlc1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RXh0ZXJuYWxFeHByKGFzdDogby5FeHRlcm5hbEV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICB0aGlzLl9lbWl0UmVmZXJlbmNlVG9FeHRlcm5hbChhc3QsIHRoaXMucmVmUmVzb2x2ZXIucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKGFzdC52YWx1ZSksIGN0eCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdFdyYXBwZWROb2RlRXhwcihhc3Q6IG8uV3JhcHBlZE5vZGVFeHByPGFueT4sIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICB0aGlzLl9lbWl0UmVmZXJlbmNlVG9FeHRlcm5hbChhc3QsIGFzdC5ub2RlLCBjdHgpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgb3ZlcnJpZGUgdmlzaXREZWNsYXJlVmFyU3RtdChzdG10OiBvLkRlY2xhcmVWYXJTdG10LCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKHN0bXQuaGFzTW9kaWZpZXIoby5TdG10TW9kaWZpZXIuRXhwb3J0ZWQpKSB7XG4gICAgICB0aGlzLl9ldmFsRXhwb3J0ZWRWYXJzLnB1c2goc3RtdC5uYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0RGVjbGFyZVZhclN0bXQoc3RtdCwgY3R4KTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10OiBvLkRlY2xhcmVGdW5jdGlvblN0bXQsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBpZiAoc3RtdC5oYXNNb2RpZmllcihvLlN0bXRNb2RpZmllci5FeHBvcnRlZCkpIHtcbiAgICAgIHRoaXMuX2V2YWxFeHBvcnRlZFZhcnMucHVzaChzdG10Lm5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIudmlzaXREZWNsYXJlRnVuY3Rpb25TdG10KHN0bXQsIGN0eCk7XG4gIH1cblxuICBwcml2YXRlIF9lbWl0UmVmZXJlbmNlVG9FeHRlcm5hbChhc3Q6IG8uRXhwcmVzc2lvbiwgdmFsdWU6IGFueSwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOlxuICAgICAgdm9pZCB7XG4gICAgbGV0IGlkID0gdGhpcy5fZXZhbEFyZ1ZhbHVlcy5pbmRleE9mKHZhbHVlKTtcbiAgICBpZiAoaWQgPT09IC0xKSB7XG4gICAgICBpZCA9IHRoaXMuX2V2YWxBcmdWYWx1ZXMubGVuZ3RoO1xuICAgICAgdGhpcy5fZXZhbEFyZ1ZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBpZGVudGlmaWVyTmFtZSh7cmVmZXJlbmNlOiB2YWx1ZX0pIHx8ICd2YWwnO1xuICAgICAgdGhpcy5fZXZhbEFyZ05hbWVzLnB1c2goYGppdF8ke25hbWV9XyR7aWR9YCk7XG4gICAgfVxuICAgIGN0eC5wcmludChhc3QsIHRoaXMuX2V2YWxBcmdOYW1lc1tpZF0pO1xuICB9XG59XG5cblxuZnVuY3Rpb24gaXNVc2VTdHJpY3RTdGF0ZW1lbnQoc3RhdGVtZW50OiBvLlN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RhdGVtZW50LmlzRXF1aXZhbGVudChvLmxpdGVyYWwoJ3VzZSBzdHJpY3QnKS50b1N0bXQoKSk7XG59XG4iXX0=