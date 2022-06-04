/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbstractEmitterVisitor, escapeIdentifier } from './abstract_emitter';
/**
 * In TypeScript, tagged template functions expect a "template object", which is an array of
 * "cooked" strings plus a `raw` property that contains an array of "raw" strings. This is
 * typically constructed with a function called `__makeTemplateObject(cooked, raw)`, but it may not
 * be available in all environments.
 *
 * This is a JavaScript polyfill that uses __makeTemplateObject when it's available, but otherwise
 * creates an inline helper with the same functionality.
 *
 * In the inline function, if `Object.defineProperty` is available we use that to attach the `raw`
 * array.
 */
const makeTemplateObjectPolyfill = '(this&&this.__makeTemplateObject||function(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e})';
export class AbstractJsEmitterVisitor extends AbstractEmitterVisitor {
    constructor() {
        super(false);
    }
    visitWrappedNodeExpr(ast, ctx) {
        throw new Error('Cannot emit a WrappedNodeExpr in Javascript.');
    }
    visitDeclareVarStmt(stmt, ctx) {
        ctx.print(stmt, `var ${stmt.name}`);
        if (stmt.value) {
            ctx.print(stmt, ' = ');
            stmt.value.visitExpression(this, ctx);
        }
        ctx.println(stmt, `;`);
        return null;
    }
    visitTaggedTemplateExpr(ast, ctx) {
        // The following convoluted piece of code is effectively the downlevelled equivalent of
        // ```
        // tag`...`
        // ```
        // which is effectively like:
        // ```
        // tag(__makeTemplateObject(cooked, raw), expression1, expression2, ...);
        // ```
        const elements = ast.template.elements;
        ast.tag.visitExpression(this, ctx);
        ctx.print(ast, `(${makeTemplateObjectPolyfill}(`);
        ctx.print(ast, `[${elements.map(part => escapeIdentifier(part.text, false)).join(', ')}], `);
        ctx.print(ast, `[${elements.map(part => escapeIdentifier(part.rawText, false)).join(', ')}])`);
        ast.template.expressions.forEach(expression => {
            ctx.print(ast, ', ');
            expression.visitExpression(this, ctx);
        });
        ctx.print(ast, ')');
        return null;
    }
    visitFunctionExpr(ast, ctx) {
        ctx.print(ast, `function${ast.name ? ' ' + ast.name : ''}(`);
        this._visitParams(ast.params, ctx);
        ctx.println(ast, `) {`);
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, `}`);
        return null;
    }
    visitDeclareFunctionStmt(stmt, ctx) {
        ctx.print(stmt, `function ${stmt.name}(`);
        this._visitParams(stmt.params, ctx);
        ctx.println(stmt, `) {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
        return null;
    }
    visitLocalizedString(ast, ctx) {
        // The following convoluted piece of code is effectively the downlevelled equivalent of
        // ```
        // $localize `...`
        // ```
        // which is effectively like:
        // ```
        // $localize(__makeTemplateObject(cooked, raw), expression1, expression2, ...);
        // ```
        ctx.print(ast, `$localize(${makeTemplateObjectPolyfill}(`);
        const parts = [ast.serializeI18nHead()];
        for (let i = 1; i < ast.messageParts.length; i++) {
            parts.push(ast.serializeI18nTemplatePart(i));
        }
        ctx.print(ast, `[${parts.map(part => escapeIdentifier(part.cooked, false)).join(', ')}], `);
        ctx.print(ast, `[${parts.map(part => escapeIdentifier(part.raw, false)).join(', ')}])`);
        ast.expressions.forEach(expression => {
            ctx.print(ast, ', ');
            expression.visitExpression(this, ctx);
        });
        ctx.print(ast, ')');
        return null;
    }
    _visitParams(params, ctx) {
        this.visitAllObjects(param => ctx.print(null, param.name), params, ctx, ',');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfanNfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvYWJzdHJhY3RfanNfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsc0JBQXNCLEVBQXlCLGdCQUFnQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHbkc7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLDBCQUEwQixHQUM1QixtSUFBbUksQ0FBQztBQUV4SSxNQUFNLE9BQWdCLHdCQUF5QixTQUFRLHNCQUFzQjtJQUMzRTtRQUNFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFUSxvQkFBb0IsQ0FBQyxHQUEyQixFQUFFLEdBQTBCO1FBQ25GLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRVEsbUJBQW1CLENBQUMsSUFBc0IsRUFBRSxHQUEwQjtRQUM3RSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN2QztRQUNELEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNRLHVCQUF1QixDQUFDLEdBQXlCLEVBQUUsR0FBMEI7UUFDcEYsdUZBQXVGO1FBQ3ZGLE1BQU07UUFDTixXQUFXO1FBQ1gsTUFBTTtRQUNOLDZCQUE2QjtRQUM3QixN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QztJQUNkLENBQUM7SUFFTyxZQUFZLENBQUMsTUFBbUIsRUFBRSxHQUEwQjtRQUNsRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0UsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblxuaW1wb3J0IHtBYnN0cmFjdEVtaXR0ZXJWaXNpdG9yLCBFbWl0dGVyVmlzaXRvckNvbnRleHQsIGVzY2FwZUlkZW50aWZpZXJ9IGZyb20gJy4vYWJzdHJhY3RfZW1pdHRlcic7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0X2FzdCc7XG5cbi8qKlxuICogSW4gVHlwZVNjcmlwdCwgdGFnZ2VkIHRlbXBsYXRlIGZ1bmN0aW9ucyBleHBlY3QgYSBcInRlbXBsYXRlIG9iamVjdFwiLCB3aGljaCBpcyBhbiBhcnJheSBvZlxuICogXCJjb29rZWRcIiBzdHJpbmdzIHBsdXMgYSBgcmF3YCBwcm9wZXJ0eSB0aGF0IGNvbnRhaW5zIGFuIGFycmF5IG9mIFwicmF3XCIgc3RyaW5ncy4gVGhpcyBpc1xuICogdHlwaWNhbGx5IGNvbnN0cnVjdGVkIHdpdGggYSBmdW5jdGlvbiBjYWxsZWQgYF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KWAsIGJ1dCBpdCBtYXkgbm90XG4gKiBiZSBhdmFpbGFibGUgaW4gYWxsIGVudmlyb25tZW50cy5cbiAqXG4gKiBUaGlzIGlzIGEgSmF2YVNjcmlwdCBwb2x5ZmlsbCB0aGF0IHVzZXMgX19tYWtlVGVtcGxhdGVPYmplY3Qgd2hlbiBpdCdzIGF2YWlsYWJsZSwgYnV0IG90aGVyd2lzZVxuICogY3JlYXRlcyBhbiBpbmxpbmUgaGVscGVyIHdpdGggdGhlIHNhbWUgZnVuY3Rpb25hbGl0eS5cbiAqXG4gKiBJbiB0aGUgaW5saW5lIGZ1bmN0aW9uLCBpZiBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBpcyBhdmFpbGFibGUgd2UgdXNlIHRoYXQgdG8gYXR0YWNoIHRoZSBgcmF3YFxuICogYXJyYXkuXG4gKi9cbmNvbnN0IG1ha2VUZW1wbGF0ZU9iamVjdFBvbHlmaWxsID1cbiAgICAnKHRoaXMmJnRoaXMuX19tYWtlVGVtcGxhdGVPYmplY3R8fGZ1bmN0aW9uKGUsdCl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eT9PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcInJhd1wiLHt2YWx1ZTp0fSk6ZS5yYXc9dCxlfSknO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RKc0VtaXR0ZXJWaXNpdG9yIGV4dGVuZHMgQWJzdHJhY3RFbWl0dGVyVmlzaXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGZhbHNlKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0V3JhcHBlZE5vZGVFeHByKGFzdDogby5XcmFwcGVkTm9kZUV4cHI8YW55PiwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGVtaXQgYSBXcmFwcGVkTm9kZUV4cHIgaW4gSmF2YXNjcmlwdC4nKTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0RGVjbGFyZVZhclN0bXQoc3RtdDogby5EZWNsYXJlVmFyU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGN0eC5wcmludChzdG10LCBgdmFyICR7c3RtdC5uYW1lfWApO1xuICAgIGlmIChzdG10LnZhbHVlKSB7XG4gICAgICBjdHgucHJpbnQoc3RtdCwgJyA9ICcpO1xuICAgICAgc3RtdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICB9XG4gICAgY3R4LnByaW50bG4oc3RtdCwgYDtgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBvdmVycmlkZSB2aXNpdFRhZ2dlZFRlbXBsYXRlRXhwcihhc3Q6IG8uVGFnZ2VkVGVtcGxhdGVFeHByLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBjb252b2x1dGVkIHBpZWNlIG9mIGNvZGUgaXMgZWZmZWN0aXZlbHkgdGhlIGRvd25sZXZlbGxlZCBlcXVpdmFsZW50IG9mXG4gICAgLy8gYGBgXG4gICAgLy8gdGFnYC4uLmBcbiAgICAvLyBgYGBcbiAgICAvLyB3aGljaCBpcyBlZmZlY3RpdmVseSBsaWtlOlxuICAgIC8vIGBgYFxuICAgIC8vIHRhZyhfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdyksIGV4cHJlc3Npb24xLCBleHByZXNzaW9uMiwgLi4uKTtcbiAgICAvLyBgYGBcbiAgICBjb25zdCBlbGVtZW50cyA9IGFzdC50ZW1wbGF0ZS5lbGVtZW50cztcbiAgICBhc3QudGFnLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgIGN0eC5wcmludChhc3QsIGAoJHttYWtlVGVtcGxhdGVPYmplY3RQb2x5ZmlsbH0oYCk7XG4gICAgY3R4LnByaW50KGFzdCwgYFske2VsZW1lbnRzLm1hcChwYXJ0ID0+IGVzY2FwZUlkZW50aWZpZXIocGFydC50ZXh0LCBmYWxzZSkpLmpvaW4oJywgJyl9XSwgYCk7XG4gICAgY3R4LnByaW50KGFzdCwgYFske2VsZW1lbnRzLm1hcChwYXJ0ID0+IGVzY2FwZUlkZW50aWZpZXIocGFydC5yYXdUZXh0LCBmYWxzZSkpLmpvaW4oJywgJyl9XSlgKTtcbiAgICBhc3QudGVtcGxhdGUuZXhwcmVzc2lvbnMuZm9yRWFjaChleHByZXNzaW9uID0+IHtcbiAgICAgIGN0eC5wcmludChhc3QsICcsICcpO1xuICAgICAgZXhwcmVzc2lvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICB9KTtcbiAgICBjdHgucHJpbnQoYXN0LCAnKScpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0RnVuY3Rpb25FeHByKGFzdDogby5GdW5jdGlvbkV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHJpbnQoYXN0LCBgZnVuY3Rpb24ke2FzdC5uYW1lID8gJyAnICsgYXN0Lm5hbWUgOiAnJ30oYCk7XG4gICAgdGhpcy5fdmlzaXRQYXJhbXMoYXN0LnBhcmFtcywgY3R4KTtcbiAgICBjdHgucHJpbnRsbihhc3QsIGApIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoYXN0LnN0YXRlbWVudHMsIGN0eCk7XG4gICAgY3R4LmRlY0luZGVudCgpO1xuICAgIGN0eC5wcmludChhc3QsIGB9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXREZWNsYXJlRnVuY3Rpb25TdG10KHN0bXQ6IG8uRGVjbGFyZUZ1bmN0aW9uU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGN0eC5wcmludChzdG10LCBgZnVuY3Rpb24gJHtzdG10Lm5hbWV9KGApO1xuICAgIHRoaXMuX3Zpc2l0UGFyYW1zKHN0bXQucGFyYW1zLCBjdHgpO1xuICAgIGN0eC5wcmludGxuKHN0bXQsIGApIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5zdGF0ZW1lbnRzLCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihzdG10LCBgfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIG92ZXJyaWRlIHZpc2l0TG9jYWxpemVkU3RyaW5nKGFzdDogby5Mb2NhbGl6ZWRTdHJpbmcsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNvbnZvbHV0ZWQgcGllY2Ugb2YgY29kZSBpcyBlZmZlY3RpdmVseSB0aGUgZG93bmxldmVsbGVkIGVxdWl2YWxlbnQgb2ZcbiAgICAvLyBgYGBcbiAgICAvLyAkbG9jYWxpemUgYC4uLmBcbiAgICAvLyBgYGBcbiAgICAvLyB3aGljaCBpcyBlZmZlY3RpdmVseSBsaWtlOlxuICAgIC8vIGBgYFxuICAgIC8vICRsb2NhbGl6ZShfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdyksIGV4cHJlc3Npb24xLCBleHByZXNzaW9uMiwgLi4uKTtcbiAgICAvLyBgYGBcbiAgICBjdHgucHJpbnQoYXN0LCBgJGxvY2FsaXplKCR7bWFrZVRlbXBsYXRlT2JqZWN0UG9seWZpbGx9KGApO1xuICAgIGNvbnN0IHBhcnRzID0gW2FzdC5zZXJpYWxpemVJMThuSGVhZCgpXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGFzdC5tZXNzYWdlUGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhcnRzLnB1c2goYXN0LnNlcmlhbGl6ZUkxOG5UZW1wbGF0ZVBhcnQoaSkpO1xuICAgIH1cbiAgICBjdHgucHJpbnQoYXN0LCBgWyR7cGFydHMubWFwKHBhcnQgPT4gZXNjYXBlSWRlbnRpZmllcihwYXJ0LmNvb2tlZCwgZmFsc2UpKS5qb2luKCcsICcpfV0sIGApO1xuICAgIGN0eC5wcmludChhc3QsIGBbJHtwYXJ0cy5tYXAocGFydCA9PiBlc2NhcGVJZGVudGlmaWVyKHBhcnQucmF3LCBmYWxzZSkpLmpvaW4oJywgJyl9XSlgKTtcbiAgICBhc3QuZXhwcmVzc2lvbnMuZm9yRWFjaChleHByZXNzaW9uID0+IHtcbiAgICAgIGN0eC5wcmludChhc3QsICcsICcpO1xuICAgICAgZXhwcmVzc2lvbi52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICB9KTtcbiAgICBjdHgucHJpbnQoYXN0LCAnKScpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRQYXJhbXMocGFyYW1zOiBvLkZuUGFyYW1bXSwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2l0QWxsT2JqZWN0cyhwYXJhbSA9PiBjdHgucHJpbnQobnVsbCwgcGFyYW0ubmFtZSksIHBhcmFtcywgY3R4LCAnLCcpO1xuICB9XG59XG4iXX0=