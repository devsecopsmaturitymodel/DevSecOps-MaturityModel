/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AST, ImplicitReceiver, RecursiveAstVisitor } from '../../expression_parser/ast';
import { Template } from '../r3_ast';
import { createCssSelector } from './template';
import { getAttrsForDirectiveMatching } from './util';
/**
 * Processes `Target`s with a given set of directives and performs a binding operation, which
 * returns an object similar to TypeScript's `ts.TypeChecker` that contains knowledge about the
 * target.
 */
export class R3TargetBinder {
    constructor(directiveMatcher) {
        this.directiveMatcher = directiveMatcher;
    }
    /**
     * Perform a binding operation on the given `Target` and return a `BoundTarget` which contains
     * metadata about the types referenced in the template.
     */
    bind(target) {
        if (!target.template) {
            // TODO(alxhub): handle targets which contain things like HostBindings, etc.
            throw new Error('Binding without a template not yet supported');
        }
        // First, parse the template into a `Scope` structure. This operation captures the syntactic
        // scopes in the template and makes them available for later use.
        const scope = Scope.apply(target.template);
        // Use the `Scope` to extract the entities present at every level of the template.
        const templateEntities = extractTemplateEntities(scope);
        // Next, perform directive matching on the template using the `DirectiveBinder`. This returns:
        //   - directives: Map of nodes (elements & ng-templates) to the directives on them.
        //   - bindings: Map of inputs, outputs, and attributes to the directive/element that claims
        //     them. TODO(alxhub): handle multiple directives claiming an input/output/etc.
        //   - references: Map of #references to their targets.
        const { directives, bindings, references } = DirectiveBinder.apply(target.template, this.directiveMatcher);
        // Finally, run the TemplateBinder to bind references, variables, and other entities within the
        // template. This extracts all the metadata that doesn't depend on directive matching.
        const { expressions, symbols, nestingLevel, usedPipes } = TemplateBinder.applyWithScope(target.template, scope);
        return new R3BoundTarget(target, directives, bindings, references, expressions, symbols, nestingLevel, templateEntities, usedPipes);
    }
}
/**
 * Represents a binding scope within a template.
 *
 * Any variables, references, or other named entities declared within the template will
 * be captured and available by name in `namedEntities`. Additionally, child templates will
 * be analyzed and have their child `Scope`s available in `childScopes`.
 */
class Scope {
    constructor(parentScope, template) {
        this.parentScope = parentScope;
        this.template = template;
        /**
         * Named members of the `Scope`, such as `Reference`s or `Variable`s.
         */
        this.namedEntities = new Map();
        /**
         * Child `Scope`s for immediately nested `Template`s.
         */
        this.childScopes = new Map();
    }
    static newRootScope() {
        return new Scope(null, null);
    }
    /**
     * Process a template (either as a `Template` sub-template with variables, or a plain array of
     * template `Node`s) and construct its `Scope`.
     */
    static apply(template) {
        const scope = Scope.newRootScope();
        scope.ingest(template);
        return scope;
    }
    /**
     * Internal method to process the template and populate the `Scope`.
     */
    ingest(template) {
        if (template instanceof Template) {
            // Variables on an <ng-template> are defined in the inner scope.
            template.variables.forEach(node => this.visitVariable(node));
            // Process the nodes of the template.
            template.children.forEach(node => node.visit(this));
        }
        else {
            // No overarching `Template` instance, so process the nodes directly.
            template.forEach(node => node.visit(this));
        }
    }
    visitElement(element) {
        // `Element`s in the template may have `Reference`s which are captured in the scope.
        element.references.forEach(node => this.visitReference(node));
        // Recurse into the `Element`'s children.
        element.children.forEach(node => node.visit(this));
    }
    visitTemplate(template) {
        // References on a <ng-template> are defined in the outer scope, so capture them before
        // processing the template's child scope.
        template.references.forEach(node => this.visitReference(node));
        // Next, create an inner scope and process the template within it.
        const scope = new Scope(this, template);
        scope.ingest(template);
        this.childScopes.set(template, scope);
    }
    visitVariable(variable) {
        // Declare the variable if it's not already.
        this.maybeDeclare(variable);
    }
    visitReference(reference) {
        // Declare the variable if it's not already.
        this.maybeDeclare(reference);
    }
    // Unused visitors.
    visitContent(content) { }
    visitBoundAttribute(attr) { }
    visitBoundEvent(event) { }
    visitBoundText(text) { }
    visitText(text) { }
    visitTextAttribute(attr) { }
    visitIcu(icu) { }
    maybeDeclare(thing) {
        // Declare something with a name, as long as that name isn't taken.
        if (!this.namedEntities.has(thing.name)) {
            this.namedEntities.set(thing.name, thing);
        }
    }
    /**
     * Look up a variable within this `Scope`.
     *
     * This can recurse into a parent `Scope` if it's available.
     */
    lookup(name) {
        if (this.namedEntities.has(name)) {
            // Found in the local scope.
            return this.namedEntities.get(name);
        }
        else if (this.parentScope !== null) {
            // Not in the local scope, but there's a parent scope so check there.
            return this.parentScope.lookup(name);
        }
        else {
            // At the top level and it wasn't found.
            return null;
        }
    }
    /**
     * Get the child scope for a `Template`.
     *
     * This should always be defined.
     */
    getChildScope(template) {
        const res = this.childScopes.get(template);
        if (res === undefined) {
            throw new Error(`Assertion error: child scope for ${template} not found`);
        }
        return res;
    }
}
/**
 * Processes a template and matches directives on nodes (elements and templates).
 *
 * Usually used via the static `apply()` method.
 */
class DirectiveBinder {
    constructor(matcher, directives, bindings, references) {
        this.matcher = matcher;
        this.directives = directives;
        this.bindings = bindings;
        this.references = references;
    }
    /**
     * Process a template (list of `Node`s) and perform directive matching against each node.
     *
     * @param template the list of template `Node`s to match (recursively).
     * @param selectorMatcher a `SelectorMatcher` containing the directives that are in scope for
     * this template.
     * @returns three maps which contain information about directives in the template: the
     * `directives` map which lists directives matched on each node, the `bindings` map which
     * indicates which directives claimed which bindings (inputs, outputs, etc), and the `references`
     * map which resolves #references (`Reference`s) within the template to the named directive or
     * template node.
     */
    static apply(template, selectorMatcher) {
        const directives = new Map();
        const bindings = new Map();
        const references = new Map();
        const matcher = new DirectiveBinder(selectorMatcher, directives, bindings, references);
        matcher.ingest(template);
        return { directives, bindings, references };
    }
    ingest(template) {
        template.forEach(node => node.visit(this));
    }
    visitElement(element) {
        this.visitElementOrTemplate(element.name, element);
    }
    visitTemplate(template) {
        this.visitElementOrTemplate('ng-template', template);
    }
    visitElementOrTemplate(elementName, node) {
        // First, determine the HTML shape of the node for the purpose of directive matching.
        // Do this by building up a `CssSelector` for the node.
        const cssSelector = createCssSelector(elementName, getAttrsForDirectiveMatching(node));
        // Next, use the `SelectorMatcher` to get the list of directives on the node.
        const directives = [];
        this.matcher.match(cssSelector, (_, directive) => directives.push(directive));
        if (directives.length > 0) {
            this.directives.set(node, directives);
        }
        // Resolve any references that are created on this node.
        node.references.forEach(ref => {
            let dirTarget = null;
            // If the reference expression is empty, then it matches the "primary" directive on the node
            // (if there is one). Otherwise it matches the host node itself (either an element or
            // <ng-template> node).
            if (ref.value.trim() === '') {
                // This could be a reference to a component if there is one.
                dirTarget = directives.find(dir => dir.isComponent) || null;
            }
            else {
                // This should be a reference to a directive exported via exportAs.
                dirTarget =
                    directives.find(dir => dir.exportAs !== null && dir.exportAs.some(value => value === ref.value)) ||
                        null;
                // Check if a matching directive was found.
                if (dirTarget === null) {
                    // No matching directive was found - this reference points to an unknown target. Leave it
                    // unmapped.
                    return;
                }
            }
            if (dirTarget !== null) {
                // This reference points to a directive.
                this.references.set(ref, { directive: dirTarget, node });
            }
            else {
                // This reference points to the node itself.
                this.references.set(ref, node);
            }
        });
        const setAttributeBinding = (attribute, ioType) => {
            const dir = directives.find(dir => dir[ioType].hasBindingPropertyName(attribute.name));
            const binding = dir !== undefined ? dir : node;
            this.bindings.set(attribute, binding);
        };
        // Node inputs (bound attributes) and text attributes can be bound to an
        // input on a directive.
        node.inputs.forEach(input => setAttributeBinding(input, 'inputs'));
        node.attributes.forEach(attr => setAttributeBinding(attr, 'inputs'));
        if (node instanceof Template) {
            node.templateAttrs.forEach(attr => setAttributeBinding(attr, 'inputs'));
        }
        // Node outputs (bound events) can be bound to an output on a directive.
        node.outputs.forEach(output => setAttributeBinding(output, 'outputs'));
        // Recurse into the node's children.
        node.children.forEach(child => child.visit(this));
    }
    // Unused visitors.
    visitContent(content) { }
    visitVariable(variable) { }
    visitReference(reference) { }
    visitTextAttribute(attribute) { }
    visitBoundAttribute(attribute) { }
    visitBoundEvent(attribute) { }
    visitBoundAttributeOrEvent(node) { }
    visitText(text) { }
    visitBoundText(text) { }
    visitIcu(icu) { }
}
/**
 * Processes a template and extract metadata about expressions and symbols within.
 *
 * This is a companion to the `DirectiveBinder` that doesn't require knowledge of directives matched
 * within the template in order to operate.
 *
 * Expressions are visited by the superclass `RecursiveAstVisitor`, with custom logic provided
 * by overridden methods from that visitor.
 */
class TemplateBinder extends RecursiveAstVisitor {
    constructor(bindings, symbols, usedPipes, nestingLevel, scope, template, level) {
        super();
        this.bindings = bindings;
        this.symbols = symbols;
        this.usedPipes = usedPipes;
        this.nestingLevel = nestingLevel;
        this.scope = scope;
        this.template = template;
        this.level = level;
        this.pipesUsed = [];
        // Save a bit of processing time by constructing this closure in advance.
        this.visitNode = (node) => node.visit(this);
    }
    // This method is defined to reconcile the type of TemplateBinder since both
    // RecursiveAstVisitor and Visitor define the visit() method in their
    // interfaces.
    visit(node, context) {
        if (node instanceof AST) {
            node.visit(this, context);
        }
        else {
            node.visit(this);
        }
    }
    /**
     * Process a template and extract metadata about expressions and symbols within.
     *
     * @param template the nodes of the template to process
     * @param scope the `Scope` of the template being processed.
     * @returns three maps which contain metadata about the template: `expressions` which interprets
     * special `AST` nodes in expressions as pointing to references or variables declared within the
     * template, `symbols` which maps those variables and references to the nested `Template` which
     * declares them, if any, and `nestingLevel` which associates each `Template` with a integer
     * nesting level (how many levels deep within the template structure the `Template` is), starting
     * at 1.
     */
    static applyWithScope(template, scope) {
        const expressions = new Map();
        const symbols = new Map();
        const nestingLevel = new Map();
        const usedPipes = new Set();
        // The top-level template has nesting level 0.
        const binder = new TemplateBinder(expressions, symbols, usedPipes, nestingLevel, scope, template instanceof Template ? template : null, 0);
        binder.ingest(template);
        return { expressions, symbols, nestingLevel, usedPipes };
    }
    ingest(template) {
        if (template instanceof Template) {
            // For <ng-template>s, process only variables and child nodes. Inputs, outputs, templateAttrs,
            // and references were all processed in the scope of the containing template.
            template.variables.forEach(this.visitNode);
            template.children.forEach(this.visitNode);
            // Set the nesting level.
            this.nestingLevel.set(template, this.level);
        }
        else {
            // Visit each node from the top-level template.
            template.forEach(this.visitNode);
        }
    }
    visitElement(element) {
        // Visit the inputs, outputs, and children of the element.
        element.inputs.forEach(this.visitNode);
        element.outputs.forEach(this.visitNode);
        element.children.forEach(this.visitNode);
    }
    visitTemplate(template) {
        // First, visit inputs, outputs and template attributes of the template node.
        template.inputs.forEach(this.visitNode);
        template.outputs.forEach(this.visitNode);
        template.templateAttrs.forEach(this.visitNode);
        // References are also evaluated in the outer context.
        template.references.forEach(this.visitNode);
        // Next, recurse into the template using its scope, and bumping the nesting level up by one.
        const childScope = this.scope.getChildScope(template);
        const binder = new TemplateBinder(this.bindings, this.symbols, this.usedPipes, this.nestingLevel, childScope, template, this.level + 1);
        binder.ingest(template);
    }
    visitVariable(variable) {
        // Register the `Variable` as a symbol in the current `Template`.
        if (this.template !== null) {
            this.symbols.set(variable, this.template);
        }
    }
    visitReference(reference) {
        // Register the `Reference` as a symbol in the current `Template`.
        if (this.template !== null) {
            this.symbols.set(reference, this.template);
        }
    }
    // Unused template visitors
    visitText(text) { }
    visitContent(content) { }
    visitTextAttribute(attribute) { }
    visitIcu(icu) {
        Object.keys(icu.vars).forEach(key => icu.vars[key].visit(this));
        Object.keys(icu.placeholders).forEach(key => icu.placeholders[key].visit(this));
    }
    // The remaining visitors are concerned with processing AST expressions within template bindings
    visitBoundAttribute(attribute) {
        attribute.value.visit(this);
    }
    visitBoundEvent(event) {
        event.handler.visit(this);
    }
    visitBoundText(text) {
        text.value.visit(this);
    }
    visitPipe(ast, context) {
        this.usedPipes.add(ast.name);
        return super.visitPipe(ast, context);
    }
    // These five types of AST expressions can refer to expression roots, which could be variables
    // or references in the current scope.
    visitPropertyRead(ast, context) {
        this.maybeMap(context, ast, ast.name);
        return super.visitPropertyRead(ast, context);
    }
    visitSafePropertyRead(ast, context) {
        this.maybeMap(context, ast, ast.name);
        return super.visitSafePropertyRead(ast, context);
    }
    visitPropertyWrite(ast, context) {
        this.maybeMap(context, ast, ast.name);
        return super.visitPropertyWrite(ast, context);
    }
    maybeMap(scope, ast, name) {
        // If the receiver of the expression isn't the `ImplicitReceiver`, this isn't the root of an
        // `AST` expression that maps to a `Variable` or `Reference`.
        if (!(ast.receiver instanceof ImplicitReceiver)) {
            return;
        }
        // Check whether the name exists in the current scope. If so, map it. Otherwise, the name is
        // probably a property on the top-level component context.
        let target = this.scope.lookup(name);
        if (target !== null) {
            this.bindings.set(ast, target);
        }
    }
}
/**
 * Metadata container for a `Target` that allows queries for specific bits of metadata.
 *
 * See `BoundTarget` for documentation on the individual methods.
 */
export class R3BoundTarget {
    constructor(target, directives, bindings, references, exprTargets, symbols, nestingLevel, templateEntities, usedPipes) {
        this.target = target;
        this.directives = directives;
        this.bindings = bindings;
        this.references = references;
        this.exprTargets = exprTargets;
        this.symbols = symbols;
        this.nestingLevel = nestingLevel;
        this.templateEntities = templateEntities;
        this.usedPipes = usedPipes;
    }
    getEntitiesInTemplateScope(template) {
        return this.templateEntities.get(template) ?? new Set();
    }
    getDirectivesOfNode(node) {
        return this.directives.get(node) || null;
    }
    getReferenceTarget(ref) {
        return this.references.get(ref) || null;
    }
    getConsumerOfBinding(binding) {
        return this.bindings.get(binding) || null;
    }
    getExpressionTarget(expr) {
        return this.exprTargets.get(expr) || null;
    }
    getTemplateOfSymbol(symbol) {
        return this.symbols.get(symbol) || null;
    }
    getNestingLevel(template) {
        return this.nestingLevel.get(template) || 0;
    }
    getUsedDirectives() {
        const set = new Set();
        this.directives.forEach(dirs => dirs.forEach(dir => set.add(dir)));
        return Array.from(set.values());
    }
    getUsedPipes() {
        return Array.from(this.usedPipes);
    }
}
function extractTemplateEntities(rootScope) {
    const entityMap = new Map();
    function extractScopeEntities(scope) {
        if (entityMap.has(scope.template)) {
            return entityMap.get(scope.template);
        }
        const currentEntities = scope.namedEntities;
        let templateEntities;
        if (scope.parentScope !== null) {
            templateEntities = new Map([...extractScopeEntities(scope.parentScope), ...currentEntities]);
        }
        else {
            templateEntities = new Map(currentEntities);
        }
        entityMap.set(scope.template, templateEntities);
        return templateEntities;
    }
    const scopesToProcess = [rootScope];
    while (scopesToProcess.length > 0) {
        const scope = scopesToProcess.pop();
        for (const childScope of scope.childScopes.values()) {
            scopesToProcess.push(childScope);
        }
        extractScopeEntities(scope);
    }
    const templateEntities = new Map();
    for (const [template, entities] of entityMap) {
        templateEntities.set(template, new Set(entities.values()));
    }
    return templateEntities;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidDJfYmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvdmlldy90Ml9iaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLEdBQUcsRUFBZSxnQkFBZ0IsRUFBK0IsbUJBQW1CLEVBQW1CLE1BQU0sNkJBQTZCLENBQUM7QUFFbkosT0FBTyxFQUFnRixRQUFRLEVBQXlDLE1BQU0sV0FBVyxDQUFDO0FBRzFKLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUM3QyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFHcEQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQW9CLGdCQUE2QztRQUE3QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTZCO0lBQUcsQ0FBQztJQUVyRTs7O09BR0c7SUFDSCxJQUFJLENBQUMsTUFBYztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQiw0RUFBNEU7WUFDNUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsNEZBQTRGO1FBQzVGLGlFQUFpRTtRQUNqRSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUczQyxrRkFBa0Y7UUFDbEYsTUFBTSxnQkFBZ0IsR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4RCw4RkFBOEY7UUFDOUYsb0ZBQW9GO1FBQ3BGLDRGQUE0RjtRQUM1RixtRkFBbUY7UUFDbkYsdURBQXVEO1FBQ3ZELE1BQU0sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQyxHQUNwQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxR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LENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDO1NBQzlGO2FBQU07WUFDTCxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUM3QztRQUVELFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU0sZUFBZSxHQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsT0FBTyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNqQyxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFHLENBQUM7UUFDckMsS0FBSyxNQUFNLFVBQVUsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ25ELGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbEM7UUFDRCxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3QjtJQUVELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQTBDLENBQUM7SUFDM0UsS0FBSyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLFNBQVMsRUFBRTtRQUM1QyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDNUQ7SUFDRCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBU1QsIEJpbmRpbmdQaXBlLCBJbXBsaWNpdFJlY2VpdmVyLCBQcm9wZXJ0eVJlYWQsIFByb3BlcnR5V3JpdGUsIFJlY3Vyc2l2ZUFzdFZpc2l0b3IsIFNhZmVQcm9wZXJ0eVJlYWR9IGZyb20gJy4uLy4uL2V4cHJlc3Npb25fcGFyc2VyL2FzdCc7XG5pbXBvcnQge1NlbGVjdG9yTWF0Y2hlcn0gZnJvbSAnLi4vLi4vc2VsZWN0b3InO1xuaW1wb3J0IHtCb3VuZEF0dHJpYnV0ZSwgQm91bmRFdmVudCwgQm91bmRUZXh0LCBDb250ZW50LCBFbGVtZW50LCBJY3UsIE5vZGUsIFJlZmVyZW5jZSwgVGVtcGxhdGUsIFRleHQsIFRleHRBdHRyaWJ1dGUsIFZhcmlhYmxlLCBWaXNpdG9yfSBmcm9tICcuLi9yM19hc3QnO1xuXG5pbXBvcnQge0JvdW5kVGFyZ2V0LCBEaXJlY3RpdmVNZXRhLCBUYXJnZXQsIFRhcmdldEJpbmRlcn0gZnJvbSAnLi90Ml9hcGknO1xuaW1wb3J0IHtjcmVhdGVDc3NTZWxlY3Rvcn0gZnJvbSAnLi90ZW1wbGF0ZSc7XG5pbXBvcnQge2dldEF0dHJzRm9yRGlyZWN0aXZlTWF0Y2hpbmd9IGZyb20gJy4vdXRpbCc7XG5cblxuLyoqXG4gKiBQcm9jZXNzZXMgYFRhcmdldGBzIHdpdGggYSBnaXZlbiBzZXQgb2YgZGlyZWN0aXZlcyBhbmQgcGVyZm9ybXMgYSBiaW5kaW5nIG9wZXJhdGlvbiwgd2hpY2hcbiAqIHJldHVybnMgYW4gb2JqZWN0IHNpbWlsYXIgdG8gVHlwZVNjcmlwdCdzIGB0cy5UeXBlQ2hlY2tlcmAgdGhhdCBjb250YWlucyBrbm93bGVkZ2UgYWJvdXQgdGhlXG4gKiB0YXJnZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSM1RhcmdldEJpbmRlcjxEaXJlY3RpdmVUIGV4dGVuZHMgRGlyZWN0aXZlTWV0YT4gaW1wbGVtZW50cyBUYXJnZXRCaW5kZXI8RGlyZWN0aXZlVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRpcmVjdGl2ZU1hdGNoZXI6IFNlbGVjdG9yTWF0Y2hlcjxEaXJlY3RpdmVUPikge31cblxuICAvKipcbiAgICogUGVyZm9ybSBhIGJpbmRpbmcgb3BlcmF0aW9uIG9uIHRoZSBnaXZlbiBgVGFyZ2V0YCBhbmQgcmV0dXJuIGEgYEJvdW5kVGFyZ2V0YCB3aGljaCBjb250YWluc1xuICAgKiBtZXRhZGF0YSBhYm91dCB0aGUgdHlwZXMgcmVmZXJlbmNlZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICBiaW5kKHRhcmdldDogVGFyZ2V0KTogQm91bmRUYXJnZXQ8RGlyZWN0aXZlVD4ge1xuICAgIGlmICghdGFyZ2V0LnRlbXBsYXRlKSB7XG4gICAgICAvLyBUT0RPKGFseGh1Yik6IGhhbmRsZSB0YXJnZXRzIHdoaWNoIGNvbnRhaW4gdGhpbmdzIGxpa2UgSG9zdEJpbmRpbmdzLCBldGMuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JpbmRpbmcgd2l0aG91dCBhIHRlbXBsYXRlIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG4gICAgfVxuXG4gICAgLy8gRmlyc3QsIHBhcnNlIHRoZSB0ZW1wbGF0ZSBpbnRvIGEgYFNjb3BlYCBzdHJ1Y3R1cmUuIFRoaXMgb3BlcmF0aW9uIGNhcHR1cmVzIHRoZSBzeW50YWN0aWNcbiAgICAvLyBzY29wZXMgaW4gdGhlIHRlbXBsYXRlIGFuZCBtYWtlcyB0aGVtIGF2YWlsYWJsZSBmb3IgbGF0ZXIgdXNlLlxuICAgIGNvbnN0IHNjb3BlID0gU2NvcGUuYXBwbHkodGFyZ2V0LnRlbXBsYXRlKTtcblxuXG4gICAgLy8gVXNlIHRoZSBgU2NvcGVgIHRvIGV4dHJhY3QgdGhlIGVudGl0aWVzIHByZXNlbnQgYXQgZXZlcnkgbGV2ZWwgb2YgdGhlIHRlbXBsYXRlLlxuICAgIGNvbnN0IHRlbXBsYXRlRW50aXRpZXMgPSBleHRyYWN0VGVtcGxhdGVFbnRpdGllcyhzY29wZSk7XG5cbiAgICAvLyBOZXh0LCBwZXJmb3JtIGRpcmVjdGl2ZSBtYXRjaGluZyBvbiB0aGUgdGVtcGxhdGUgdXNpbmcgdGhlIGBEaXJlY3RpdmVCaW5kZXJgLiBUaGlzIHJldHVybnM6XG4gICAgLy8gICAtIGRpcmVjdGl2ZXM6IE1hcCBvZiBub2RlcyAoZWxlbWVudHMgJiBuZy10ZW1wbGF0ZXMpIHRvIHRoZSBkaXJlY3RpdmVzIG9uIHRoZW0uXG4gICAgLy8gICAtIGJpbmRpbmdzOiBNYXAgb2YgaW5wdXRzLCBvdXRwdXRzLCBhbmQgYXR0cmlidXRlcyB0byB0aGUgZGlyZWN0aXZlL2VsZW1lbnQgdGhhdCBjbGFpbXNcbiAgICAvLyAgICAgdGhlbS4gVE9ETyhhbHhodWIpOiBoYW5kbGUgbXVsdGlwbGUgZGlyZWN0aXZlcyBjbGFpbWluZyBhbiBpbnB1dC9vdXRwdXQvZXRjLlxuICAgIC8vICAgLSByZWZlcmVuY2VzOiBNYXAgb2YgI3JlZmVyZW5jZXMgdG8gdGhlaXIgdGFyZ2V0cy5cbiAgICBjb25zdCB7ZGlyZWN0aXZlcywgYmluZGluZ3MsIHJlZmVyZW5jZXN9ID1cbiAgICAgICAgRGlyZWN0aXZlQmluZGVyLmFwcGx5KHRhcmdldC50ZW1wbGF0ZSwgdGhpcy5kaXJlY3RpdmVNYXRjaGVyKTtcbiAgICAvLyBGaW5hbGx5LCBydW4gdGhlIFRlbXBsYXRlQmluZGVyIHRvIGJpbmQgcmVmZXJlbmNlcywgdmFyaWFibGVzLCBhbmQgb3RoZXIgZW50aXRpZXMgd2l0aGluIHRoZVxuICAgIC8vIHRlbXBsYXRlLiBUaGlzIGV4dHJhY3RzIGFsbCB0aGUgbWV0YWRhdGEgdGhhdCBkb2Vzbid0IGRlcGVuZCBvbiBkaXJlY3RpdmUgbWF0Y2hpbmcuXG4gICAgY29uc3Qge2V4cHJlc3Npb25zLCBzeW1ib2xzLCBuZXN0aW5nTGV2ZWwsIHVzZWRQaXBlc30gPVxuICAgICAgICBUZW1wbGF0ZUJpbmRlci5hcHBseVdpdGhTY29wZSh0YXJnZXQudGVtcGxhdGUsIHNjb3BlKTtcbiAgICByZXR1cm4gbmV3IFIzQm91bmRUYXJnZXQoXG4gICAgICAgIHRhcmdldCwgZGlyZWN0aXZlcywgYmluZGluZ3MsIHJlZmVyZW5jZXMsIGV4cHJlc3Npb25zLCBzeW1ib2xzLCBuZXN0aW5nTGV2ZWwsXG4gICAgICAgIHRlbXBsYXRlRW50aXRpZXMsIHVzZWRQaXBlcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgYmluZGluZyBzY29wZSB3aXRoaW4gYSB0ZW1wbGF0ZS5cbiAqXG4gKiBBbnkgdmFyaWFibGVzLCByZWZlcmVuY2VzLCBvciBvdGhlciBuYW1lZCBlbnRpdGllcyBkZWNsYXJlZCB3aXRoaW4gdGhlIHRlbXBsYXRlIHdpbGxcbiAqIGJlIGNhcHR1cmVkIGFuZCBhdmFpbGFibGUgYnkgbmFtZSBpbiBgbmFtZWRFbnRpdGllc2AuIEFkZGl0aW9uYWxseSwgY2hpbGQgdGVtcGxhdGVzIHdpbGxcbiAqIGJlIGFuYWx5emVkIGFuZCBoYXZlIHRoZWlyIGNoaWxkIGBTY29wZWBzIGF2YWlsYWJsZSBpbiBgY2hpbGRTY29wZXNgLlxuICovXG5jbGFzcyBTY29wZSBpbXBsZW1lbnRzIFZpc2l0b3Ige1xuICAvKipcbiAgICogTmFtZWQgbWVtYmVycyBvZiB0aGUgYFNjb3BlYCwgc3VjaCBhcyBgUmVmZXJlbmNlYHMgb3IgYFZhcmlhYmxlYHMuXG4gICAqL1xuICByZWFkb25seSBuYW1lZEVudGl0aWVzID0gbmV3IE1hcDxzdHJpbmcsIFJlZmVyZW5jZXxWYXJpYWJsZT4oKTtcblxuICAvKipcbiAgICogQ2hpbGQgYFNjb3BlYHMgZm9yIGltbWVkaWF0ZWx5IG5lc3RlZCBgVGVtcGxhdGVgcy5cbiAgICovXG4gIHJlYWRvbmx5IGNoaWxkU2NvcGVzID0gbmV3IE1hcDxUZW1wbGF0ZSwgU2NvcGU+KCk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBwYXJlbnRTY29wZTogU2NvcGV8bnVsbCwgcmVhZG9ubHkgdGVtcGxhdGU6IFRlbXBsYXRlfG51bGwpIHt9XG5cbiAgc3RhdGljIG5ld1Jvb3RTY29wZSgpOiBTY29wZSB7XG4gICAgcmV0dXJuIG5ldyBTY29wZShudWxsLCBudWxsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgdGVtcGxhdGUgKGVpdGhlciBhcyBhIGBUZW1wbGF0ZWAgc3ViLXRlbXBsYXRlIHdpdGggdmFyaWFibGVzLCBvciBhIHBsYWluIGFycmF5IG9mXG4gICAqIHRlbXBsYXRlIGBOb2RlYHMpIGFuZCBjb25zdHJ1Y3QgaXRzIGBTY29wZWAuXG4gICAqL1xuICBzdGF0aWMgYXBwbHkodGVtcGxhdGU6IE5vZGVbXSk6IFNjb3BlIHtcbiAgICBjb25zdCBzY29wZSA9IFNjb3BlLm5ld1Jvb3RTY29wZSgpO1xuICAgIHNjb3BlLmluZ2VzdCh0ZW1wbGF0ZSk7XG4gICAgcmV0dXJuIHNjb3BlO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIG1ldGhvZCB0byBwcm9jZXNzIHRoZSB0ZW1wbGF0ZSBhbmQgcG9wdWxhdGUgdGhlIGBTY29wZWAuXG4gICAqL1xuICBwcml2YXRlIGluZ2VzdCh0ZW1wbGF0ZTogVGVtcGxhdGV8Tm9kZVtdKTogdm9pZCB7XG4gICAgaWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgVGVtcGxhdGUpIHtcbiAgICAgIC8vIFZhcmlhYmxlcyBvbiBhbiA8bmctdGVtcGxhdGU+IGFyZSBkZWZpbmVkIGluIHRoZSBpbm5lciBzY29wZS5cbiAgICAgIHRlbXBsYXRlLnZhcmlhYmxlcy5mb3JFYWNoKG5vZGUgPT4gdGhpcy52aXNpdFZhcmlhYmxlKG5vZGUpKTtcblxuICAgICAgLy8gUHJvY2VzcyB0aGUgbm9kZXMgb2YgdGhlIHRlbXBsYXRlLlxuICAgICAgdGVtcGxhdGUuY2hpbGRyZW4uZm9yRWFjaChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBvdmVyYXJjaGluZyBgVGVtcGxhdGVgIGluc3RhbmNlLCBzbyBwcm9jZXNzIHRoZSBub2RlcyBkaXJlY3RseS5cbiAgICAgIHRlbXBsYXRlLmZvckVhY2gobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIC8vIGBFbGVtZW50YHMgaW4gdGhlIHRlbXBsYXRlIG1heSBoYXZlIGBSZWZlcmVuY2VgcyB3aGljaCBhcmUgY2FwdHVyZWQgaW4gdGhlIHNjb3BlLlxuICAgIGVsZW1lbnQucmVmZXJlbmNlcy5mb3JFYWNoKG5vZGUgPT4gdGhpcy52aXNpdFJlZmVyZW5jZShub2RlKSk7XG5cbiAgICAvLyBSZWN1cnNlIGludG8gdGhlIGBFbGVtZW50YCdzIGNoaWxkcmVuLlxuICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogVGVtcGxhdGUpIHtcbiAgICAvLyBSZWZlcmVuY2VzIG9uIGEgPG5nLXRlbXBsYXRlPiBhcmUgZGVmaW5lZCBpbiB0aGUgb3V0ZXIgc2NvcGUsIHNvIGNhcHR1cmUgdGhlbSBiZWZvcmVcbiAgICAvLyBwcm9jZXNzaW5nIHRoZSB0ZW1wbGF0ZSdzIGNoaWxkIHNjb3BlLlxuICAgIHRlbXBsYXRlLnJlZmVyZW5jZXMuZm9yRWFjaChub2RlID0+IHRoaXMudmlzaXRSZWZlcmVuY2Uobm9kZSkpO1xuXG4gICAgLy8gTmV4dCwgY3JlYXRlIGFuIGlubmVyIHNjb3BlIGFuZCBwcm9jZXNzIHRoZSB0ZW1wbGF0ZSB3aXRoaW4gaXQuXG4gICAgY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUodGhpcywgdGVtcGxhdGUpO1xuICAgIHNjb3BlLmluZ2VzdCh0ZW1wbGF0ZSk7XG4gICAgdGhpcy5jaGlsZFNjb3Blcy5zZXQodGVtcGxhdGUsIHNjb3BlKTtcbiAgfVxuXG4gIHZpc2l0VmFyaWFibGUodmFyaWFibGU6IFZhcmlhYmxlKSB7XG4gICAgLy8gRGVjbGFyZSB0aGUgdmFyaWFibGUgaWYgaXQncyBub3QgYWxyZWFkeS5cbiAgICB0aGlzLm1heWJlRGVjbGFyZSh2YXJpYWJsZSk7XG4gIH1cblxuICB2aXNpdFJlZmVyZW5jZShyZWZlcmVuY2U6IFJlZmVyZW5jZSkge1xuICAgIC8vIERlY2xhcmUgdGhlIHZhcmlhYmxlIGlmIGl0J3Mgbm90IGFscmVhZHkuXG4gICAgdGhpcy5tYXliZURlY2xhcmUocmVmZXJlbmNlKTtcbiAgfVxuXG4gIC8vIFVudXNlZCB2aXNpdG9ycy5cbiAgdmlzaXRDb250ZW50KGNvbnRlbnQ6IENvbnRlbnQpIHt9XG4gIHZpc2l0Qm91bmRBdHRyaWJ1dGUoYXR0cjogQm91bmRBdHRyaWJ1dGUpIHt9XG4gIHZpc2l0Qm91bmRFdmVudChldmVudDogQm91bmRFdmVudCkge31cbiAgdmlzaXRCb3VuZFRleHQodGV4dDogQm91bmRUZXh0KSB7fVxuICB2aXNpdFRleHQodGV4dDogVGV4dCkge31cbiAgdmlzaXRUZXh0QXR0cmlidXRlKGF0dHI6IFRleHRBdHRyaWJ1dGUpIHt9XG4gIHZpc2l0SWN1KGljdTogSWN1KSB7fVxuXG4gIHByaXZhdGUgbWF5YmVEZWNsYXJlKHRoaW5nOiBSZWZlcmVuY2V8VmFyaWFibGUpIHtcbiAgICAvLyBEZWNsYXJlIHNvbWV0aGluZyB3aXRoIGEgbmFtZSwgYXMgbG9uZyBhcyB0aGF0IG5hbWUgaXNuJ3QgdGFrZW4uXG4gICAgaWYgKCF0aGlzLm5hbWVkRW50aXRpZXMuaGFzKHRoaW5nLm5hbWUpKSB7XG4gICAgICB0aGlzLm5hbWVkRW50aXRpZXMuc2V0KHRoaW5nLm5hbWUsIHRoaW5nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBhIHZhcmlhYmxlIHdpdGhpbiB0aGlzIGBTY29wZWAuXG4gICAqXG4gICAqIFRoaXMgY2FuIHJlY3Vyc2UgaW50byBhIHBhcmVudCBgU2NvcGVgIGlmIGl0J3MgYXZhaWxhYmxlLlxuICAgKi9cbiAgbG9va3VwKG5hbWU6IHN0cmluZyk6IFJlZmVyZW5jZXxWYXJpYWJsZXxudWxsIHtcbiAgICBpZiAodGhpcy5uYW1lZEVudGl0aWVzLmhhcyhuYW1lKSkge1xuICAgICAgLy8gRm91bmQgaW4gdGhlIGxvY2FsIHNjb3BlLlxuICAgICAgcmV0dXJuIHRoaXMubmFtZWRFbnRpdGllcy5nZXQobmFtZSkhO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnRTY29wZSAhPT0gbnVsbCkge1xuICAgICAgLy8gTm90IGluIHRoZSBsb2NhbCBzY29wZSwgYnV0IHRoZXJlJ3MgYSBwYXJlbnQgc2NvcGUgc28gY2hlY2sgdGhlcmUuXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnRTY29wZS5sb29rdXAobmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEF0IHRoZSB0b3AgbGV2ZWwgYW5kIGl0IHdhc24ndCBmb3VuZC5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNoaWxkIHNjb3BlIGZvciBhIGBUZW1wbGF0ZWAuXG4gICAqXG4gICAqIFRoaXMgc2hvdWxkIGFsd2F5cyBiZSBkZWZpbmVkLlxuICAgKi9cbiAgZ2V0Q2hpbGRTY29wZSh0ZW1wbGF0ZTogVGVtcGxhdGUpOiBTY29wZSB7XG4gICAgY29uc3QgcmVzID0gdGhpcy5jaGlsZFNjb3Blcy5nZXQodGVtcGxhdGUpO1xuICAgIGlmIChyZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3NlcnRpb24gZXJyb3I6IGNoaWxkIHNjb3BlIGZvciAke3RlbXBsYXRlfSBub3QgZm91bmRgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuXG4vKipcbiAqIFByb2Nlc3NlcyBhIHRlbXBsYXRlIGFuZCBtYXRjaGVzIGRpcmVjdGl2ZXMgb24gbm9kZXMgKGVsZW1lbnRzIGFuZCB0ZW1wbGF0ZXMpLlxuICpcbiAqIFVzdWFsbHkgdXNlZCB2aWEgdGhlIHN0YXRpYyBgYXBwbHkoKWAgbWV0aG9kLlxuICovXG5jbGFzcyBEaXJlY3RpdmVCaW5kZXI8RGlyZWN0aXZlVCBleHRlbmRzIERpcmVjdGl2ZU1ldGE+IGltcGxlbWVudHMgVmlzaXRvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBtYXRjaGVyOiBTZWxlY3Rvck1hdGNoZXI8RGlyZWN0aXZlVD4sXG4gICAgICBwcml2YXRlIGRpcmVjdGl2ZXM6IE1hcDxFbGVtZW50fFRlbXBsYXRlLCBEaXJlY3RpdmVUW10+LFxuICAgICAgcHJpdmF0ZSBiaW5kaW5nczogTWFwPEJvdW5kQXR0cmlidXRlfEJvdW5kRXZlbnR8VGV4dEF0dHJpYnV0ZSwgRGlyZWN0aXZlVHxFbGVtZW50fFRlbXBsYXRlPixcbiAgICAgIHByaXZhdGUgcmVmZXJlbmNlczpcbiAgICAgICAgICBNYXA8UmVmZXJlbmNlLCB7ZGlyZWN0aXZlOiBEaXJlY3RpdmVULCBub2RlOiBFbGVtZW50fFRlbXBsYXRlfXxFbGVtZW50fFRlbXBsYXRlPikge31cblxuICAvKipcbiAgICogUHJvY2VzcyBhIHRlbXBsYXRlIChsaXN0IG9mIGBOb2RlYHMpIGFuZCBwZXJmb3JtIGRpcmVjdGl2ZSBtYXRjaGluZyBhZ2FpbnN0IGVhY2ggbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHRlbXBsYXRlIHRoZSBsaXN0IG9mIHRlbXBsYXRlIGBOb2RlYHMgdG8gbWF0Y2ggKHJlY3Vyc2l2ZWx5KS5cbiAgICogQHBhcmFtIHNlbGVjdG9yTWF0Y2hlciBhIGBTZWxlY3Rvck1hdGNoZXJgIGNvbnRhaW5pbmcgdGhlIGRpcmVjdGl2ZXMgdGhhdCBhcmUgaW4gc2NvcGUgZm9yXG4gICAqIHRoaXMgdGVtcGxhdGUuXG4gICAqIEByZXR1cm5zIHRocmVlIG1hcHMgd2hpY2ggY29udGFpbiBpbmZvcm1hdGlvbiBhYm91dCBkaXJlY3RpdmVzIGluIHRoZSB0ZW1wbGF0ZTogdGhlXG4gICAqIGBkaXJlY3RpdmVzYCBtYXAgd2hpY2ggbGlzdHMgZGlyZWN0aXZlcyBtYXRjaGVkIG9uIGVhY2ggbm9kZSwgdGhlIGBiaW5kaW5nc2AgbWFwIHdoaWNoXG4gICAqIGluZGljYXRlcyB3aGljaCBkaXJlY3RpdmVzIGNsYWltZWQgd2hpY2ggYmluZGluZ3MgKGlucHV0cywgb3V0cHV0cywgZXRjKSwgYW5kIHRoZSBgcmVmZXJlbmNlc2BcbiAgICogbWFwIHdoaWNoIHJlc29sdmVzICNyZWZlcmVuY2VzIChgUmVmZXJlbmNlYHMpIHdpdGhpbiB0aGUgdGVtcGxhdGUgdG8gdGhlIG5hbWVkIGRpcmVjdGl2ZSBvclxuICAgKiB0ZW1wbGF0ZSBub2RlLlxuICAgKi9cbiAgc3RhdGljIGFwcGx5PERpcmVjdGl2ZVQgZXh0ZW5kcyBEaXJlY3RpdmVNZXRhPihcbiAgICAgIHRlbXBsYXRlOiBOb2RlW10sIHNlbGVjdG9yTWF0Y2hlcjogU2VsZWN0b3JNYXRjaGVyPERpcmVjdGl2ZVQ+KToge1xuICAgIGRpcmVjdGl2ZXM6IE1hcDxFbGVtZW50fFRlbXBsYXRlLCBEaXJlY3RpdmVUW10+LFxuICAgIGJpbmRpbmdzOiBNYXA8Qm91bmRBdHRyaWJ1dGV8Qm91bmRFdmVudHxUZXh0QXR0cmlidXRlLCBEaXJlY3RpdmVUfEVsZW1lbnR8VGVtcGxhdGU+LFxuICAgIHJlZmVyZW5jZXM6IE1hcDxSZWZlcmVuY2UsIHtkaXJlY3RpdmU6IERpcmVjdGl2ZVQsIG5vZGU6IEVsZW1lbnR8VGVtcGxhdGV9fEVsZW1lbnR8VGVtcGxhdGU+LFxuICB9IHtcbiAgICBjb25zdCBkaXJlY3RpdmVzID0gbmV3IE1hcDxFbGVtZW50fFRlbXBsYXRlLCBEaXJlY3RpdmVUW10+KCk7XG4gICAgY29uc3QgYmluZGluZ3MgPVxuICAgICAgICBuZXcgTWFwPEJvdW5kQXR0cmlidXRlfEJvdW5kRXZlbnR8VGV4dEF0dHJpYnV0ZSwgRGlyZWN0aXZlVHxFbGVtZW50fFRlbXBsYXRlPigpO1xuICAgIGNvbnN0IHJlZmVyZW5jZXMgPVxuICAgICAgICBuZXcgTWFwPFJlZmVyZW5jZSwge2RpcmVjdGl2ZTogRGlyZWN0aXZlVCwgbm9kZTogRWxlbWVudCB8IFRlbXBsYXRlfXxFbGVtZW50fFRlbXBsYXRlPigpO1xuICAgIGNvbnN0IG1hdGNoZXIgPSBuZXcgRGlyZWN0aXZlQmluZGVyKHNlbGVjdG9yTWF0Y2hlciwgZGlyZWN0aXZlcywgYmluZGluZ3MsIHJlZmVyZW5jZXMpO1xuICAgIG1hdGNoZXIuaW5nZXN0KHRlbXBsYXRlKTtcbiAgICByZXR1cm4ge2RpcmVjdGl2ZXMsIGJpbmRpbmdzLCByZWZlcmVuY2VzfTtcbiAgfVxuXG4gIHByaXZhdGUgaW5nZXN0KHRlbXBsYXRlOiBOb2RlW10pOiB2b2lkIHtcbiAgICB0ZW1wbGF0ZS5mb3JFYWNoKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMudmlzaXRFbGVtZW50T3JUZW1wbGF0ZShlbGVtZW50Lm5hbWUsIGVsZW1lbnQpO1xuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogVGVtcGxhdGUpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2l0RWxlbWVudE9yVGVtcGxhdGUoJ25nLXRlbXBsYXRlJywgdGVtcGxhdGUpO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50T3JUZW1wbGF0ZShlbGVtZW50TmFtZTogc3RyaW5nLCBub2RlOiBFbGVtZW50fFRlbXBsYXRlKTogdm9pZCB7XG4gICAgLy8gRmlyc3QsIGRldGVybWluZSB0aGUgSFRNTCBzaGFwZSBvZiB0aGUgbm9kZSBmb3IgdGhlIHB1cnBvc2Ugb2YgZGlyZWN0aXZlIG1hdGNoaW5nLlxuICAgIC8vIERvIHRoaXMgYnkgYnVpbGRpbmcgdXAgYSBgQ3NzU2VsZWN0b3JgIGZvciB0aGUgbm9kZS5cbiAgICBjb25zdCBjc3NTZWxlY3RvciA9IGNyZWF0ZUNzc1NlbGVjdG9yKGVsZW1lbnROYW1lLCBnZXRBdHRyc0ZvckRpcmVjdGl2ZU1hdGNoaW5nKG5vZGUpKTtcblxuICAgIC8vIE5leHQsIHVzZSB0aGUgYFNlbGVjdG9yTWF0Y2hlcmAgdG8gZ2V0IHRoZSBsaXN0IG9mIGRpcmVjdGl2ZXMgb24gdGhlIG5vZGUuXG4gICAgY29uc3QgZGlyZWN0aXZlczogRGlyZWN0aXZlVFtdID0gW107XG4gICAgdGhpcy5tYXRjaGVyLm1hdGNoKGNzc1NlbGVjdG9yLCAoXywgZGlyZWN0aXZlKSA9PiBkaXJlY3RpdmVzLnB1c2goZGlyZWN0aXZlKSk7XG4gICAgaWYgKGRpcmVjdGl2ZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaXJlY3RpdmVzLnNldChub2RlLCBkaXJlY3RpdmVzKTtcbiAgICB9XG5cbiAgICAvLyBSZXNvbHZlIGFueSByZWZlcmVuY2VzIHRoYXQgYXJlIGNyZWF0ZWQgb24gdGhpcyBub2RlLlxuICAgIG5vZGUucmVmZXJlbmNlcy5mb3JFYWNoKHJlZiA9PiB7XG4gICAgICBsZXQgZGlyVGFyZ2V0OiBEaXJlY3RpdmVUfG51bGwgPSBudWxsO1xuXG4gICAgICAvLyBJZiB0aGUgcmVmZXJlbmNlIGV4cHJlc3Npb24gaXMgZW1wdHksIHRoZW4gaXQgbWF0Y2hlcyB0aGUgXCJwcmltYXJ5XCIgZGlyZWN0aXZlIG9uIHRoZSBub2RlXG4gICAgICAvLyAoaWYgdGhlcmUgaXMgb25lKS4gT3RoZXJ3aXNlIGl0IG1hdGNoZXMgdGhlIGhvc3Qgbm9kZSBpdHNlbGYgKGVpdGhlciBhbiBlbGVtZW50IG9yXG4gICAgICAvLyA8bmctdGVtcGxhdGU+IG5vZGUpLlxuICAgICAgaWYgKHJlZi52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgIC8vIFRoaXMgY291bGQgYmUgYSByZWZlcmVuY2UgdG8gYSBjb21wb25lbnQgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgICBkaXJUYXJnZXQgPSBkaXJlY3RpdmVzLmZpbmQoZGlyID0+IGRpci5pc0NvbXBvbmVudCkgfHwgbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGEgcmVmZXJlbmNlIHRvIGEgZGlyZWN0aXZlIGV4cG9ydGVkIHZpYSBleHBvcnRBcy5cbiAgICAgICAgZGlyVGFyZ2V0ID1cbiAgICAgICAgICAgIGRpcmVjdGl2ZXMuZmluZChcbiAgICAgICAgICAgICAgICBkaXIgPT4gZGlyLmV4cG9ydEFzICE9PSBudWxsICYmIGRpci5leHBvcnRBcy5zb21lKHZhbHVlID0+IHZhbHVlID09PSByZWYudmFsdWUpKSB8fFxuICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgLy8gQ2hlY2sgaWYgYSBtYXRjaGluZyBkaXJlY3RpdmUgd2FzIGZvdW5kLlxuICAgICAgICBpZiAoZGlyVGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgICAgLy8gTm8gbWF0Y2hpbmcgZGlyZWN0aXZlIHdhcyBmb3VuZCAtIHRoaXMgcmVmZXJlbmNlIHBvaW50cyB0byBhbiB1bmtub3duIHRhcmdldC4gTGVhdmUgaXRcbiAgICAgICAgICAvLyB1bm1hcHBlZC5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRpclRhcmdldCAhPT0gbnVsbCkge1xuICAgICAgICAvLyBUaGlzIHJlZmVyZW5jZSBwb2ludHMgdG8gYSBkaXJlY3RpdmUuXG4gICAgICAgIHRoaXMucmVmZXJlbmNlcy5zZXQocmVmLCB7ZGlyZWN0aXZlOiBkaXJUYXJnZXQsIG5vZGV9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgcmVmZXJlbmNlIHBvaW50cyB0byB0aGUgbm9kZSBpdHNlbGYuXG4gICAgICAgIHRoaXMucmVmZXJlbmNlcy5zZXQocmVmLCBub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEFzc29jaWF0ZSBhdHRyaWJ1dGVzL2JpbmRpbmdzIG9uIHRoZSBub2RlIHdpdGggZGlyZWN0aXZlcyBvciB3aXRoIHRoZSBub2RlIGl0c2VsZi5cbiAgICB0eXBlIEJvdW5kTm9kZSA9IEJvdW5kQXR0cmlidXRlfEJvdW5kRXZlbnR8VGV4dEF0dHJpYnV0ZTtcbiAgICBjb25zdCBzZXRBdHRyaWJ1dGVCaW5kaW5nID1cbiAgICAgICAgKGF0dHJpYnV0ZTogQm91bmROb2RlLCBpb1R5cGU6IGtleW9mIFBpY2s8RGlyZWN0aXZlTWV0YSwgJ2lucHV0cyd8J291dHB1dHMnPikgPT4ge1xuICAgICAgICAgIGNvbnN0IGRpciA9IGRpcmVjdGl2ZXMuZmluZChkaXIgPT4gZGlyW2lvVHlwZV0uaGFzQmluZGluZ1Byb3BlcnR5TmFtZShhdHRyaWJ1dGUubmFtZSkpO1xuICAgICAgICAgIGNvbnN0IGJpbmRpbmcgPSBkaXIgIT09IHVuZGVmaW5lZCA/IGRpciA6IG5vZGU7XG4gICAgICAgICAgdGhpcy5iaW5kaW5ncy5zZXQoYXR0cmlidXRlLCBiaW5kaW5nKTtcbiAgICAgICAgfTtcblxuICAgIC8vIE5vZGUgaW5wdXRzIChib3VuZCBhdHRyaWJ1dGVzKSBhbmQgdGV4dCBhdHRyaWJ1dGVzIGNhbiBiZSBib3VuZCB0byBhblxuICAgIC8vIGlucHV0IG9uIGEgZGlyZWN0aXZlLlxuICAgIG5vZGUuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gc2V0QXR0cmlidXRlQmluZGluZyhpbnB1dCwgJ2lucHV0cycpKTtcbiAgICBub2RlLmF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHNldEF0dHJpYnV0ZUJpbmRpbmcoYXR0ciwgJ2lucHV0cycpKTtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFRlbXBsYXRlKSB7XG4gICAgICBub2RlLnRlbXBsYXRlQXR0cnMuZm9yRWFjaChhdHRyID0+IHNldEF0dHJpYnV0ZUJpbmRpbmcoYXR0ciwgJ2lucHV0cycpKTtcbiAgICB9XG4gICAgLy8gTm9kZSBvdXRwdXRzIChib3VuZCBldmVudHMpIGNhbiBiZSBib3VuZCB0byBhbiBvdXRwdXQgb24gYSBkaXJlY3RpdmUuXG4gICAgbm9kZS5vdXRwdXRzLmZvckVhY2gob3V0cHV0ID0+IHNldEF0dHJpYnV0ZUJpbmRpbmcob3V0cHV0LCAnb3V0cHV0cycpKTtcblxuICAgIC8vIFJlY3Vyc2UgaW50byB0aGUgbm9kZSdzIGNoaWxkcmVuLlxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC52aXNpdCh0aGlzKSk7XG4gIH1cblxuICAvLyBVbnVzZWQgdmlzaXRvcnMuXG4gIHZpc2l0Q29udGVudChjb250ZW50OiBDb250ZW50KTogdm9pZCB7fVxuICB2aXNpdFZhcmlhYmxlKHZhcmlhYmxlOiBWYXJpYWJsZSk6IHZvaWQge31cbiAgdmlzaXRSZWZlcmVuY2UocmVmZXJlbmNlOiBSZWZlcmVuY2UpOiB2b2lkIHt9XG4gIHZpc2l0VGV4dEF0dHJpYnV0ZShhdHRyaWJ1dGU6IFRleHRBdHRyaWJ1dGUpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRBdHRyaWJ1dGUoYXR0cmlidXRlOiBCb3VuZEF0dHJpYnV0ZSk6IHZvaWQge31cbiAgdmlzaXRCb3VuZEV2ZW50KGF0dHJpYnV0ZTogQm91bmRFdmVudCk6IHZvaWQge31cbiAgdmlzaXRCb3VuZEF0dHJpYnV0ZU9yRXZlbnQobm9kZTogQm91bmRBdHRyaWJ1dGV8Qm91bmRFdmVudCkge31cbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQpOiB2b2lkIHt9XG4gIHZpc2l0Qm91bmRUZXh0KHRleHQ6IEJvdW5kVGV4dCk6IHZvaWQge31cbiAgdmlzaXRJY3UoaWN1OiBJY3UpOiB2b2lkIHt9XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIGEgdGVtcGxhdGUgYW5kIGV4dHJhY3QgbWV0YWRhdGEgYWJvdXQgZXhwcmVzc2lvbnMgYW5kIHN5bWJvbHMgd2l0aGluLlxuICpcbiAqIFRoaXMgaXMgYSBjb21wYW5pb24gdG8gdGhlIGBEaXJlY3RpdmVCaW5kZXJgIHRoYXQgZG9lc24ndCByZXF1aXJlIGtub3dsZWRnZSBvZiBkaXJlY3RpdmVzIG1hdGNoZWRcbiAqIHdpdGhpbiB0aGUgdGVtcGxhdGUgaW4gb3JkZXIgdG8gb3BlcmF0ZS5cbiAqXG4gKiBFeHByZXNzaW9ucyBhcmUgdmlzaXRlZCBieSB0aGUgc3VwZXJjbGFzcyBgUmVjdXJzaXZlQXN0VmlzaXRvcmAsIHdpdGggY3VzdG9tIGxvZ2ljIHByb3ZpZGVkXG4gKiBieSBvdmVycmlkZGVuIG1ldGhvZHMgZnJvbSB0aGF0IHZpc2l0b3IuXG4gKi9cbmNsYXNzIFRlbXBsYXRlQmluZGVyIGV4dGVuZHMgUmVjdXJzaXZlQXN0VmlzaXRvciBpbXBsZW1lbnRzIFZpc2l0b3Ige1xuICBwcml2YXRlIHZpc2l0Tm9kZTogKG5vZGU6IE5vZGUpID0+IHZvaWQ7XG5cbiAgcHJpdmF0ZSBwaXBlc1VzZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgYmluZGluZ3M6IE1hcDxBU1QsIFJlZmVyZW5jZXxWYXJpYWJsZT4sXG4gICAgICBwcml2YXRlIHN5bWJvbHM6IE1hcDxSZWZlcmVuY2V8VmFyaWFibGUsIFRlbXBsYXRlPiwgcHJpdmF0ZSB1c2VkUGlwZXM6IFNldDxzdHJpbmc+LFxuICAgICAgcHJpdmF0ZSBuZXN0aW5nTGV2ZWw6IE1hcDxUZW1wbGF0ZSwgbnVtYmVyPiwgcHJpdmF0ZSBzY29wZTogU2NvcGUsXG4gICAgICBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZXxudWxsLCBwcml2YXRlIGxldmVsOiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gU2F2ZSBhIGJpdCBvZiBwcm9jZXNzaW5nIHRpbWUgYnkgY29uc3RydWN0aW5nIHRoaXMgY2xvc3VyZSBpbiBhZHZhbmNlLlxuICAgIHRoaXMudmlzaXROb2RlID0gKG5vZGU6IE5vZGUpID0+IG5vZGUudmlzaXQodGhpcyk7XG4gIH1cblxuICAvLyBUaGlzIG1ldGhvZCBpcyBkZWZpbmVkIHRvIHJlY29uY2lsZSB0aGUgdHlwZSBvZiBUZW1wbGF0ZUJpbmRlciBzaW5jZSBib3RoXG4gIC8vIFJlY3Vyc2l2ZUFzdFZpc2l0b3IgYW5kIFZpc2l0b3IgZGVmaW5lIHRoZSB2aXNpdCgpIG1ldGhvZCBpbiB0aGVpclxuICAvLyBpbnRlcmZhY2VzLlxuICBvdmVycmlkZSB2aXNpdChub2RlOiBBU1R8Tm9kZSwgY29udGV4dD86IGFueSkge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQVNUKSB7XG4gICAgICBub2RlLnZpc2l0KHRoaXMsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnZpc2l0KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGEgdGVtcGxhdGUgYW5kIGV4dHJhY3QgbWV0YWRhdGEgYWJvdXQgZXhwcmVzc2lvbnMgYW5kIHN5bWJvbHMgd2l0aGluLlxuICAgKlxuICAgKiBAcGFyYW0gdGVtcGxhdGUgdGhlIG5vZGVzIG9mIHRoZSB0ZW1wbGF0ZSB0byBwcm9jZXNzXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgYFNjb3BlYCBvZiB0aGUgdGVtcGxhdGUgYmVpbmcgcHJvY2Vzc2VkLlxuICAgKiBAcmV0dXJucyB0aHJlZSBtYXBzIHdoaWNoIGNvbnRhaW4gbWV0YWRhdGEgYWJvdXQgdGhlIHRlbXBsYXRlOiBgZXhwcmVzc2lvbnNgIHdoaWNoIGludGVycHJldHNcbiAgICogc3BlY2lhbCBgQVNUYCBub2RlcyBpbiBleHByZXNzaW9ucyBhcyBwb2ludGluZyB0byByZWZlcmVuY2VzIG9yIHZhcmlhYmxlcyBkZWNsYXJlZCB3aXRoaW4gdGhlXG4gICAqIHRlbXBsYXRlLCBgc3ltYm9sc2Agd2hpY2ggbWFwcyB0aG9zZSB2YXJpYWJsZXMgYW5kIHJlZmVyZW5jZXMgdG8gdGhlIG5lc3RlZCBgVGVtcGxhdGVgIHdoaWNoXG4gICAqIGRlY2xhcmVzIHRoZW0sIGlmIGFueSwgYW5kIGBuZXN0aW5nTGV2ZWxgIHdoaWNoIGFzc29jaWF0ZXMgZWFjaCBgVGVtcGxhdGVgIHdpdGggYSBpbnRlZ2VyXG4gICAqIG5lc3RpbmcgbGV2ZWwgKGhvdyBtYW55IGxldmVscyBkZWVwIHdpdGhpbiB0aGUgdGVtcGxhdGUgc3RydWN0dXJlIHRoZSBgVGVtcGxhdGVgIGlzKSwgc3RhcnRpbmdcbiAgICogYXQgMS5cbiAgICovXG4gIHN0YXRpYyBhcHBseVdpdGhTY29wZSh0ZW1wbGF0ZTogTm9kZVtdLCBzY29wZTogU2NvcGUpOiB7XG4gICAgZXhwcmVzc2lvbnM6IE1hcDxBU1QsIFJlZmVyZW5jZXxWYXJpYWJsZT4sXG4gICAgc3ltYm9sczogTWFwPFZhcmlhYmxlfFJlZmVyZW5jZSwgVGVtcGxhdGU+LFxuICAgIG5lc3RpbmdMZXZlbDogTWFwPFRlbXBsYXRlLCBudW1iZXI+LFxuICAgIHVzZWRQaXBlczogU2V0PHN0cmluZz4sXG4gIH0ge1xuICAgIGNvbnN0IGV4cHJlc3Npb25zID0gbmV3IE1hcDxBU1QsIFJlZmVyZW5jZXxWYXJpYWJsZT4oKTtcbiAgICBjb25zdCBzeW1ib2xzID0gbmV3IE1hcDxWYXJpYWJsZXxSZWZlcmVuY2UsIFRlbXBsYXRlPigpO1xuICAgIGNvbnN0IG5lc3RpbmdMZXZlbCA9IG5ldyBNYXA8VGVtcGxhdGUsIG51bWJlcj4oKTtcbiAgICBjb25zdCB1c2VkUGlwZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAvLyBUaGUgdG9wLWxldmVsIHRlbXBsYXRlIGhhcyBuZXN0aW5nIGxldmVsIDAuXG4gICAgY29uc3QgYmluZGVyID0gbmV3IFRlbXBsYXRlQmluZGVyKFxuICAgICAgICBleHByZXNzaW9ucywgc3ltYm9scywgdXNlZFBpcGVzLCBuZXN0aW5nTGV2ZWwsIHNjb3BlLFxuICAgICAgICB0ZW1wbGF0ZSBpbnN0YW5jZW9mIFRlbXBsYXRlID8gdGVtcGxhdGUgOiBudWxsLCAwKTtcbiAgICBiaW5kZXIuaW5nZXN0KHRlbXBsYXRlKTtcbiAgICByZXR1cm4ge2V4cHJlc3Npb25zLCBzeW1ib2xzLCBuZXN0aW5nTGV2ZWwsIHVzZWRQaXBlc307XG4gIH1cblxuICBwcml2YXRlIGluZ2VzdCh0ZW1wbGF0ZTogVGVtcGxhdGV8Tm9kZVtdKTogdm9pZCB7XG4gICAgaWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgVGVtcGxhdGUpIHtcbiAgICAgIC8vIEZvciA8bmctdGVtcGxhdGU+cywgcHJvY2VzcyBvbmx5IHZhcmlhYmxlcyBhbmQgY2hpbGQgbm9kZXMuIElucHV0cywgb3V0cHV0cywgdGVtcGxhdGVBdHRycyxcbiAgICAgIC8vIGFuZCByZWZlcmVuY2VzIHdlcmUgYWxsIHByb2Nlc3NlZCBpbiB0aGUgc2NvcGUgb2YgdGhlIGNvbnRhaW5pbmcgdGVtcGxhdGUuXG4gICAgICB0ZW1wbGF0ZS52YXJpYWJsZXMuZm9yRWFjaCh0aGlzLnZpc2l0Tm9kZSk7XG4gICAgICB0ZW1wbGF0ZS5jaGlsZHJlbi5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcblxuICAgICAgLy8gU2V0IHRoZSBuZXN0aW5nIGxldmVsLlxuICAgICAgdGhpcy5uZXN0aW5nTGV2ZWwuc2V0KHRlbXBsYXRlLCB0aGlzLmxldmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVmlzaXQgZWFjaCBub2RlIGZyb20gdGhlIHRvcC1sZXZlbCB0ZW1wbGF0ZS5cbiAgICAgIHRlbXBsYXRlLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgLy8gVmlzaXQgdGhlIGlucHV0cywgb3V0cHV0cywgYW5kIGNoaWxkcmVuIG9mIHRoZSBlbGVtZW50LlxuICAgIGVsZW1lbnQuaW5wdXRzLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuICAgIGVsZW1lbnQub3V0cHV0cy5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSh0ZW1wbGF0ZTogVGVtcGxhdGUpIHtcbiAgICAvLyBGaXJzdCwgdmlzaXQgaW5wdXRzLCBvdXRwdXRzIGFuZCB0ZW1wbGF0ZSBhdHRyaWJ1dGVzIG9mIHRoZSB0ZW1wbGF0ZSBub2RlLlxuICAgIHRlbXBsYXRlLmlucHV0cy5mb3JFYWNoKHRoaXMudmlzaXROb2RlKTtcbiAgICB0ZW1wbGF0ZS5vdXRwdXRzLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuICAgIHRlbXBsYXRlLnRlbXBsYXRlQXR0cnMuZm9yRWFjaCh0aGlzLnZpc2l0Tm9kZSk7XG5cbiAgICAvLyBSZWZlcmVuY2VzIGFyZSBhbHNvIGV2YWx1YXRlZCBpbiB0aGUgb3V0ZXIgY29udGV4dC5cbiAgICB0ZW1wbGF0ZS5yZWZlcmVuY2VzLmZvckVhY2godGhpcy52aXNpdE5vZGUpO1xuXG4gICAgLy8gTmV4dCwgcmVjdXJzZSBpbnRvIHRoZSB0ZW1wbGF0ZSB1c2luZyBpdHMgc2NvcGUsIGFuZCBidW1waW5nIHRoZSBuZXN0aW5nIGxldmVsIHVwIGJ5IG9uZS5cbiAgICBjb25zdCBjaGlsZFNjb3BlID0gdGhpcy5zY29wZS5nZXRDaGlsZFNjb3BlKHRlbXBsYXRlKTtcbiAgICBjb25zdCBiaW5kZXIgPSBuZXcgVGVtcGxhdGVCaW5kZXIoXG4gICAgICAgIHRoaXMuYmluZGluZ3MsIHRoaXMuc3ltYm9scywgdGhpcy51c2VkUGlwZXMsIHRoaXMubmVzdGluZ0xldmVsLCBjaGlsZFNjb3BlLCB0ZW1wbGF0ZSxcbiAgICAgICAgdGhpcy5sZXZlbCArIDEpO1xuICAgIGJpbmRlci5pbmdlc3QodGVtcGxhdGUpO1xuICB9XG5cbiAgdmlzaXRWYXJpYWJsZSh2YXJpYWJsZTogVmFyaWFibGUpIHtcbiAgICAvLyBSZWdpc3RlciB0aGUgYFZhcmlhYmxlYCBhcyBhIHN5bWJvbCBpbiB0aGUgY3VycmVudCBgVGVtcGxhdGVgLlxuICAgIGlmICh0aGlzLnRlbXBsYXRlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnN5bWJvbHMuc2V0KHZhcmlhYmxlLCB0aGlzLnRlbXBsYXRlKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFJlZmVyZW5jZShyZWZlcmVuY2U6IFJlZmVyZW5jZSkge1xuICAgIC8vIFJlZ2lzdGVyIHRoZSBgUmVmZXJlbmNlYCBhcyBhIHN5bWJvbCBpbiB0aGUgY3VycmVudCBgVGVtcGxhdGVgLlxuICAgIGlmICh0aGlzLnRlbXBsYXRlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnN5bWJvbHMuc2V0KHJlZmVyZW5jZSwgdGhpcy50ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVW51c2VkIHRlbXBsYXRlIHZpc2l0b3JzXG5cbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQpIHt9XG4gIHZpc2l0Q29udGVudChjb250ZW50OiBDb250ZW50KSB7fVxuICB2aXNpdFRleHRBdHRyaWJ1dGUoYXR0cmlidXRlOiBUZXh0QXR0cmlidXRlKSB7fVxuICB2aXNpdEljdShpY3U6IEljdSk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKGljdS52YXJzKS5mb3JFYWNoKGtleSA9PiBpY3UudmFyc1trZXldLnZpc2l0KHRoaXMpKTtcbiAgICBPYmplY3Qua2V5cyhpY3UucGxhY2Vob2xkZXJzKS5mb3JFYWNoKGtleSA9PiBpY3UucGxhY2Vob2xkZXJzW2tleV0udmlzaXQodGhpcykpO1xuICB9XG5cbiAgLy8gVGhlIHJlbWFpbmluZyB2aXNpdG9ycyBhcmUgY29uY2VybmVkIHdpdGggcHJvY2Vzc2luZyBBU1QgZXhwcmVzc2lvbnMgd2l0aGluIHRlbXBsYXRlIGJpbmRpbmdzXG5cbiAgdmlzaXRCb3VuZEF0dHJpYnV0ZShhdHRyaWJ1dGU6IEJvdW5kQXR0cmlidXRlKSB7XG4gICAgYXR0cmlidXRlLnZhbHVlLnZpc2l0KHRoaXMpO1xuICB9XG5cbiAgdmlzaXRCb3VuZEV2ZW50KGV2ZW50OiBCb3VuZEV2ZW50KSB7XG4gICAgZXZlbnQuaGFuZGxlci52aXNpdCh0aGlzKTtcbiAgfVxuXG4gIHZpc2l0Qm91bmRUZXh0KHRleHQ6IEJvdW5kVGV4dCkge1xuICAgIHRleHQudmFsdWUudmlzaXQodGhpcyk7XG4gIH1cbiAgb3ZlcnJpZGUgdmlzaXRQaXBlKGFzdDogQmluZGluZ1BpcGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy51c2VkUGlwZXMuYWRkKGFzdC5uYW1lKTtcbiAgICByZXR1cm4gc3VwZXIudmlzaXRQaXBlKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICAvLyBUaGVzZSBmaXZlIHR5cGVzIG9mIEFTVCBleHByZXNzaW9ucyBjYW4gcmVmZXIgdG8gZXhwcmVzc2lvbiByb290cywgd2hpY2ggY291bGQgYmUgdmFyaWFibGVzXG4gIC8vIG9yIHJlZmVyZW5jZXMgaW4gdGhlIGN1cnJlbnQgc2NvcGUuXG5cbiAgb3ZlcnJpZGUgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBQcm9wZXJ0eVJlYWQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy5tYXliZU1hcChjb250ZXh0LCBhc3QsIGFzdC5uYW1lKTtcbiAgICByZXR1cm4gc3VwZXIudmlzaXRQcm9wZXJ0eVJlYWQoYXN0LCBjb250ZXh0KTtcbiAgfVxuXG4gIG92ZXJyaWRlIHZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3Q6IFNhZmVQcm9wZXJ0eVJlYWQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy5tYXliZU1hcChjb250ZXh0LCBhc3QsIGFzdC5uYW1lKTtcbiAgICByZXR1cm4gc3VwZXIudmlzaXRTYWZlUHJvcGVydHlSZWFkKGFzdCwgY29udGV4dCk7XG4gIH1cblxuICBvdmVycmlkZSB2aXNpdFByb3BlcnR5V3JpdGUoYXN0OiBQcm9wZXJ0eVdyaXRlLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubWF5YmVNYXAoY29udGV4dCwgYXN0LCBhc3QubmFtZSk7XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0UHJvcGVydHlXcml0ZShhc3QsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXliZU1hcChzY29wZTogU2NvcGUsIGFzdDogUHJvcGVydHlSZWFkfFNhZmVQcm9wZXJ0eVJlYWR8UHJvcGVydHlXcml0ZSwgbmFtZTogc3RyaW5nKTpcbiAgICAgIHZvaWQge1xuICAgIC8vIElmIHRoZSByZWNlaXZlciBvZiB0aGUgZXhwcmVzc2lvbiBpc24ndCB0aGUgYEltcGxpY2l0UmVjZWl2ZXJgLCB0aGlzIGlzbid0IHRoZSByb290IG9mIGFuXG4gICAgLy8gYEFTVGAgZXhwcmVzc2lvbiB0aGF0IG1hcHMgdG8gYSBgVmFyaWFibGVgIG9yIGBSZWZlcmVuY2VgLlxuICAgIGlmICghKGFzdC5yZWNlaXZlciBpbnN0YW5jZW9mIEltcGxpY2l0UmVjZWl2ZXIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgbmFtZSBleGlzdHMgaW4gdGhlIGN1cnJlbnQgc2NvcGUuIElmIHNvLCBtYXAgaXQuIE90aGVyd2lzZSwgdGhlIG5hbWUgaXNcbiAgICAvLyBwcm9iYWJseSBhIHByb3BlcnR5IG9uIHRoZSB0b3AtbGV2ZWwgY29tcG9uZW50IGNvbnRleHQuXG4gICAgbGV0IHRhcmdldCA9IHRoaXMuc2NvcGUubG9va3VwKG5hbWUpO1xuICAgIGlmICh0YXJnZXQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuYmluZGluZ3Muc2V0KGFzdCwgdGFyZ2V0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXRhZGF0YSBjb250YWluZXIgZm9yIGEgYFRhcmdldGAgdGhhdCBhbGxvd3MgcXVlcmllcyBmb3Igc3BlY2lmaWMgYml0cyBvZiBtZXRhZGF0YS5cbiAqXG4gKiBTZWUgYEJvdW5kVGFyZ2V0YCBmb3IgZG9jdW1lbnRhdGlvbiBvbiB0aGUgaW5kaXZpZHVhbCBtZXRob2RzLlxuICovXG5leHBvcnQgY2xhc3MgUjNCb3VuZFRhcmdldDxEaXJlY3RpdmVUIGV4dGVuZHMgRGlyZWN0aXZlTWV0YT4gaW1wbGVtZW50cyBCb3VuZFRhcmdldDxEaXJlY3RpdmVUPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcmVhZG9ubHkgdGFyZ2V0OiBUYXJnZXQsIHByaXZhdGUgZGlyZWN0aXZlczogTWFwPEVsZW1lbnR8VGVtcGxhdGUsIERpcmVjdGl2ZVRbXT4sXG4gICAgICBwcml2YXRlIGJpbmRpbmdzOiBNYXA8Qm91bmRBdHRyaWJ1dGV8Qm91bmRFdmVudHxUZXh0QXR0cmlidXRlLCBEaXJlY3RpdmVUfEVsZW1lbnR8VGVtcGxhdGU+LFxuICAgICAgcHJpdmF0ZSByZWZlcmVuY2VzOlxuICAgICAgICAgIE1hcDxCb3VuZEF0dHJpYnV0ZXxCb3VuZEV2ZW50fFJlZmVyZW5jZXxUZXh0QXR0cmlidXRlLFxuICAgICAgICAgICAgICB7ZGlyZWN0aXZlOiBEaXJlY3RpdmVULCBub2RlOiBFbGVtZW50fFRlbXBsYXRlfXxFbGVtZW50fFRlbXBsYXRlPixcbiAgICAgIHByaXZhdGUgZXhwclRhcmdldHM6IE1hcDxBU1QsIFJlZmVyZW5jZXxWYXJpYWJsZT4sXG4gICAgICBwcml2YXRlIHN5bWJvbHM6IE1hcDxSZWZlcmVuY2V8VmFyaWFibGUsIFRlbXBsYXRlPixcbiAgICAgIHByaXZhdGUgbmVzdGluZ0xldmVsOiBNYXA8VGVtcGxhdGUsIG51bWJlcj4sXG4gICAgICBwcml2YXRlIHRlbXBsYXRlRW50aXRpZXM6IE1hcDxUZW1wbGF0ZXxudWxsLCBSZWFkb25seVNldDxSZWZlcmVuY2V8VmFyaWFibGU+PixcbiAgICAgIHByaXZhdGUgdXNlZFBpcGVzOiBTZXQ8c3RyaW5nPikge31cblxuICBnZXRFbnRpdGllc0luVGVtcGxhdGVTY29wZSh0ZW1wbGF0ZTogVGVtcGxhdGV8bnVsbCk6IFJlYWRvbmx5U2V0PFJlZmVyZW5jZXxWYXJpYWJsZT4ge1xuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlRW50aXRpZXMuZ2V0KHRlbXBsYXRlKSA/PyBuZXcgU2V0KCk7XG4gIH1cblxuICBnZXREaXJlY3RpdmVzT2ZOb2RlKG5vZGU6IEVsZW1lbnR8VGVtcGxhdGUpOiBEaXJlY3RpdmVUW118bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0aXZlcy5nZXQobm9kZSkgfHwgbnVsbDtcbiAgfVxuXG4gIGdldFJlZmVyZW5jZVRhcmdldChyZWY6IFJlZmVyZW5jZSk6IHtkaXJlY3RpdmU6IERpcmVjdGl2ZVQsIG5vZGU6IEVsZW1lbnR8VGVtcGxhdGV9fEVsZW1lbnRcbiAgICAgIHxUZW1wbGF0ZXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5yZWZlcmVuY2VzLmdldChyZWYpIHx8IG51bGw7XG4gIH1cblxuICBnZXRDb25zdW1lck9mQmluZGluZyhiaW5kaW5nOiBCb3VuZEF0dHJpYnV0ZXxCb3VuZEV2ZW50fFRleHRBdHRyaWJ1dGUpOiBEaXJlY3RpdmVUfEVsZW1lbnRcbiAgICAgIHxUZW1wbGF0ZXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5iaW5kaW5ncy5nZXQoYmluZGluZykgfHwgbnVsbDtcbiAgfVxuXG4gIGdldEV4cHJlc3Npb25UYXJnZXQoZXhwcjogQVNUKTogUmVmZXJlbmNlfFZhcmlhYmxlfG51bGwge1xuICAgIHJldHVybiB0aGlzLmV4cHJUYXJnZXRzLmdldChleHByKSB8fCBudWxsO1xuICB9XG5cbiAgZ2V0VGVtcGxhdGVPZlN5bWJvbChzeW1ib2w6IFJlZmVyZW5jZXxWYXJpYWJsZSk6IFRlbXBsYXRlfG51bGwge1xuICAgIHJldHVybiB0aGlzLnN5bWJvbHMuZ2V0KHN5bWJvbCkgfHwgbnVsbDtcbiAgfVxuXG4gIGdldE5lc3RpbmdMZXZlbCh0ZW1wbGF0ZTogVGVtcGxhdGUpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm5lc3RpbmdMZXZlbC5nZXQodGVtcGxhdGUpIHx8IDA7XG4gIH1cblxuICBnZXRVc2VkRGlyZWN0aXZlcygpOiBEaXJlY3RpdmVUW10ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBTZXQ8RGlyZWN0aXZlVD4oKTtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkaXJzID0+IGRpcnMuZm9yRWFjaChkaXIgPT4gc2V0LmFkZChkaXIpKSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oc2V0LnZhbHVlcygpKTtcbiAgfVxuXG4gIGdldFVzZWRQaXBlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy51c2VkUGlwZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RUZW1wbGF0ZUVudGl0aWVzKHJvb3RTY29wZTogU2NvcGUpOiBNYXA8VGVtcGxhdGV8bnVsbCwgU2V0PFJlZmVyZW5jZXxWYXJpYWJsZT4+IHtcbiAgY29uc3QgZW50aXR5TWFwID0gbmV3IE1hcDxUZW1wbGF0ZXxudWxsLCBNYXA8c3RyaW5nLCBSZWZlcmVuY2V8VmFyaWFibGU+PigpO1xuXG4gIGZ1bmN0aW9uIGV4dHJhY3RTY29wZUVudGl0aWVzKHNjb3BlOiBTY29wZSk6IE1hcDxzdHJpbmcsIFJlZmVyZW5jZXxWYXJpYWJsZT4ge1xuICAgIGlmIChlbnRpdHlNYXAuaGFzKHNjb3BlLnRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIGVudGl0eU1hcC5nZXQoc2NvcGUudGVtcGxhdGUpITtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50RW50aXRpZXMgPSBzY29wZS5uYW1lZEVudGl0aWVzO1xuXG4gICAgbGV0IHRlbXBsYXRlRW50aXRpZXM6IE1hcDxzdHJpbmcsIFJlZmVyZW5jZXxWYXJpYWJsZT47XG4gICAgaWYgKHNjb3BlLnBhcmVudFNjb3BlICE9PSBudWxsKSB7XG4gICAgICB0ZW1wbGF0ZUVudGl0aWVzID0gbmV3IE1hcChbLi4uZXh0cmFjdFNjb3BlRW50aXRpZXMoc2NvcGUucGFyZW50U2NvcGUpLCAuLi5jdXJyZW50RW50aXRpZXNdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGVtcGxhdGVFbnRpdGllcyA9IG5ldyBNYXAoY3VycmVudEVudGl0aWVzKTtcbiAgICB9XG5cbiAgICBlbnRpdHlNYXAuc2V0KHNjb3BlLnRlbXBsYXRlLCB0ZW1wbGF0ZUVudGl0aWVzKTtcbiAgICByZXR1cm4gdGVtcGxhdGVFbnRpdGllcztcbiAgfVxuXG4gIGNvbnN0IHNjb3Blc1RvUHJvY2VzczogU2NvcGVbXSA9IFtyb290U2NvcGVdO1xuICB3aGlsZSAoc2NvcGVzVG9Qcm9jZXNzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBzY29wZSA9IHNjb3Blc1RvUHJvY2Vzcy5wb3AoKSE7XG4gICAgZm9yIChjb25zdCBjaGlsZFNjb3BlIG9mIHNjb3BlLmNoaWxkU2NvcGVzLnZhbHVlcygpKSB7XG4gICAgICBzY29wZXNUb1Byb2Nlc3MucHVzaChjaGlsZFNjb3BlKTtcbiAgICB9XG4gICAgZXh0cmFjdFNjb3BlRW50aXRpZXMoc2NvcGUpO1xuICB9XG5cbiAgY29uc3QgdGVtcGxhdGVFbnRpdGllcyA9IG5ldyBNYXA8VGVtcGxhdGV8bnVsbCwgU2V0PFJlZmVyZW5jZXxWYXJpYWJsZT4+KCk7XG4gIGZvciAoY29uc3QgW3RlbXBsYXRlLCBlbnRpdGllc10gb2YgZW50aXR5TWFwKSB7XG4gICAgdGVtcGxhdGVFbnRpdGllcy5zZXQodGVtcGxhdGUsIG5ldyBTZXQoZW50aXRpZXMudmFsdWVzKCkpKTtcbiAgfVxuICByZXR1cm4gdGVtcGxhdGVFbnRpdGllcztcbn1cbiJdfQ==