"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscClassInheritanceMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Migration that checks for classes that extend Angular Material classes which
 * have changed their API.
 */
class MiscClassInheritanceMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isClassDeclaration(node)) {
            this._visitClassDeclaration(node);
        }
    }
    _visitClassDeclaration(node) {
        const baseTypes = (0, schematics_1.determineBaseTypes)(node);
        const className = node.name ? node.name.text : '{unknown-name}';
        if (!baseTypes) {
            return;
        }
        // Migration for: https://github.com/angular/components/pull/10293 (v6)
        if (baseTypes.includes('MatFormFieldControl')) {
            const hasFloatLabelMember = node.members
                .filter(member => member.name)
                .find(member => member.name.getText() === 'shouldLabelFloat');
            if (!hasFloatLabelMember) {
                this.createFailureAtNode(node, `Found class "${className}" which extends ` +
                    `"${'MatFormFieldControl'}". This class must define ` +
                    `"${'shouldLabelFloat'}" which is now a required property.`);
            }
        }
    }
}
exports.MiscClassInheritanceMigration = MiscClassInheritanceMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1pbmhlcml0YW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtaW5oZXJpdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQXFGO0FBQ3JGLGlDQUFpQztBQUVqQzs7O0dBR0c7QUFDSCxNQUFhLDZCQUE4QixTQUFRLHNCQUFlO0lBQWxFOztRQUNFLHFFQUFxRTtRQUNyRSwwREFBMEQ7UUFDMUQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUFnQ3BELENBQUM7SUE5QlUsU0FBUyxDQUFDLElBQWE7UUFDOUIsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVPLHNCQUFzQixDQUFDLElBQXlCO1FBQ3RELE1BQU0sU0FBUyxHQUFHLElBQUEsK0JBQWtCLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO1FBRWhFLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxPQUFPO1NBQ1I7UUFFRCx1RUFBdUU7UUFDdkUsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDN0MsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTztpQkFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztpQkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxrQkFBa0IsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLG1CQUFtQixDQUN0QixJQUFJLEVBQ0osZ0JBQWdCLFNBQVMsa0JBQWtCO29CQUN6QyxJQUFJLHFCQUFxQiw0QkFBNEI7b0JBQ3JELElBQUksa0JBQWtCLHFDQUFxQyxDQUM5RCxDQUFDO2FBQ0g7U0FDRjtJQUNILENBQUM7Q0FDRjtBQW5DRCxzRUFtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtkZXRlcm1pbmVCYXNlVHlwZXMsIE1pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgY2hlY2tzIGZvciBjbGFzc2VzIHRoYXQgZXh0ZW5kIEFuZ3VsYXIgTWF0ZXJpYWwgY2xhc3NlcyB3aGljaFxuICogaGF2ZSBjaGFuZ2VkIHRoZWlyIEFQSS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1pc2NDbGFzc0luaGVyaXRhbmNlTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcbiAgLy8gT25seSBlbmFibGUgdGhpcyBydWxlIGlmIHRoZSBtaWdyYXRpb24gdGFyZ2V0cyB2ZXJzaW9uIDYuIFRoZSBydWxlXG4gIC8vIGN1cnJlbnRseSBvbmx5IGluY2x1ZGVzIG1pZ3JhdGlvbnMgZm9yIFY2IGRlcHJlY2F0aW9ucy5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICBvdmVycmlkZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0NsYXNzRGVjbGFyYXRpb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0Q2xhc3NEZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZTogdHMuQ2xhc3NEZWNsYXJhdGlvbikge1xuICAgIGNvbnN0IGJhc2VUeXBlcyA9IGRldGVybWluZUJhc2VUeXBlcyhub2RlKTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBub2RlLm5hbWUgPyBub2RlLm5hbWUudGV4dCA6ICd7dW5rbm93bi1uYW1lfSc7XG5cbiAgICBpZiAoIWJhc2VUeXBlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDI5MyAodjYpXG4gICAgaWYgKGJhc2VUeXBlcy5pbmNsdWRlcygnTWF0Rm9ybUZpZWxkQ29udHJvbCcpKSB7XG4gICAgICBjb25zdCBoYXNGbG9hdExhYmVsTWVtYmVyID0gbm9kZS5tZW1iZXJzXG4gICAgICAgIC5maWx0ZXIobWVtYmVyID0+IG1lbWJlci5uYW1lKVxuICAgICAgICAuZmluZChtZW1iZXIgPT4gbWVtYmVyLm5hbWUhLmdldFRleHQoKSA9PT0gJ3Nob3VsZExhYmVsRmxvYXQnKTtcblxuICAgICAgaWYgKCFoYXNGbG9hdExhYmVsTWVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGBGb3VuZCBjbGFzcyBcIiR7Y2xhc3NOYW1lfVwiIHdoaWNoIGV4dGVuZHMgYCArXG4gICAgICAgICAgICBgXCIkeydNYXRGb3JtRmllbGRDb250cm9sJ31cIi4gVGhpcyBjbGFzcyBtdXN0IGRlZmluZSBgICtcbiAgICAgICAgICAgIGBcIiR7J3Nob3VsZExhYmVsRmxvYXQnfVwiIHdoaWNoIGlzIG5vdyBhIHJlcXVpcmVkIHByb3BlcnR5LmAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=