"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration = void 0;
const ts = require("typescript");
class Migration {
    constructor(
    /** TypeScript program for the migration. */
    program, 
    /** TypeChecker instance for the analysis program. */
    typeChecker, 
    /** Version for which the migration rule should run. */
    targetVersion, 
    /** Context data for the migration. */
    context, 
    /** Upgrade data passed to the migration. */
    upgradeData, 
    /** File system that can be used for modifying files. */
    fileSystem, 
    /** Logger that can be used to print messages as part of the migration. */
    logger) {
        this.program = program;
        this.typeChecker = typeChecker;
        this.targetVersion = targetVersion;
        this.context = context;
        this.upgradeData = upgradeData;
        this.fileSystem = fileSystem;
        this.logger = logger;
        /** List of migration failures that need to be reported. */
        this.failures = [];
    }
    /** Method can be used to perform global analysis of the program. */
    init() { }
    /**
     * Method that will be called once all nodes, templates and stylesheets
     * have been visited.
     */
    postAnalysis() { }
    /**
     * Method that will be called for each node in a given source file. Unlike tslint, this
     * function will only retrieve TypeScript nodes that need to be casted manually. This
     * allows us to only walk the program source files once per program and not per
     * migration rule (significant performance boost).
     */
    visitNode(node) { }
    /** Method that will be called for each Angular template in the program. */
    visitTemplate(template) { }
    /** Method that will be called for each stylesheet in the program. */
    visitStylesheet(stylesheet) { }
    /** Creates a failure with a specified message at the given node location. */
    createFailureAtNode(node, message) {
        const sourceFile = node.getSourceFile();
        this.failures.push({
            filePath: this.fileSystem.resolve(sourceFile.fileName),
            position: ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()),
            message: message,
        });
    }
}
exports.Migration = Migration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL3VwZGF0ZS10b29sL21pZ3JhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCxpQ0FBaUM7QUF1QmpDLE1BQXNCLFNBQVM7SUFPN0I7SUFDRSw0Q0FBNEM7SUFDckMsT0FBbUI7SUFDMUIscURBQXFEO0lBQzlDLFdBQTJCO0lBQ2xDLHVEQUF1RDtJQUNoRCxhQUE0QjtJQUNuQyxzQ0FBc0M7SUFDL0IsT0FBZ0I7SUFDdkIsNENBQTRDO0lBQ3JDLFdBQWlCO0lBQ3hCLHdEQUF3RDtJQUNqRCxVQUFzQjtJQUM3QiwwRUFBMEU7SUFDbkUsTUFBb0I7UUFacEIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUVuQixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFFM0Isa0JBQWEsR0FBYixhQUFhLENBQWU7UUFFNUIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUVoQixnQkFBVyxHQUFYLFdBQVcsQ0FBTTtRQUVqQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBRXRCLFdBQU0sR0FBTixNQUFNLENBQWM7UUFwQjdCLDJEQUEyRDtRQUMzRCxhQUFRLEdBQXVCLEVBQUUsQ0FBQztJQW9CL0IsQ0FBQztJQUVKLG9FQUFvRTtJQUNwRSxJQUFJLEtBQVUsQ0FBQztJQUVmOzs7T0FHRztJQUNILFlBQVksS0FBVSxDQUFDO0lBRXZCOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUFDLElBQWEsSUFBUyxDQUFDO0lBRWpDLDJFQUEyRTtJQUMzRSxhQUFhLENBQUMsUUFBMEIsSUFBUyxDQUFDO0lBRWxELHFFQUFxRTtJQUNyRSxlQUFlLENBQUMsVUFBNEIsSUFBUyxDQUFDO0lBRXRELDZFQUE2RTtJQUNuRSxtQkFBbUIsQ0FBQyxJQUFhLEVBQUUsT0FBZTtRQUMxRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDakIsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDdEQsUUFBUSxFQUFFLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3ZFLE9BQU8sRUFBRSxPQUFPO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXhERCw4QkF3REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge1Jlc29sdmVkUmVzb3VyY2V9IGZyb20gJy4vY29tcG9uZW50LXJlc291cmNlLWNvbGxlY3Rvcic7XG5pbXBvcnQge0ZpbGVTeXN0ZW0sIFdvcmtzcGFjZVBhdGh9IGZyb20gJy4vZmlsZS1zeXN0ZW0nO1xuaW1wb3J0IHtVcGRhdGVMb2dnZXJ9IGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7VGFyZ2V0VmVyc2lvbn0gZnJvbSAnLi90YXJnZXQtdmVyc2lvbic7XG5pbXBvcnQge0xpbmVBbmRDaGFyYWN0ZXJ9IGZyb20gJy4vdXRpbHMvbGluZS1tYXBwaW5ncyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWlncmF0aW9uRmFpbHVyZSB7XG4gIGZpbGVQYXRoOiBXb3Jrc3BhY2VQYXRoO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIHBvc2l0aW9uPzogTGluZUFuZENoYXJhY3Rlcjtcbn1cblxuZXhwb3J0IHR5cGUgUG9zdE1pZ3JhdGlvbkFjdGlvbiA9IHZvaWQgfCB7XG4gIC8qKiBXaGV0aGVyIHRoZSBwYWNrYWdlIG1hbmFnZXIgc2hvdWxkIHJ1biB1cG9uIG1pZ3JhdGlvbiBjb21wbGV0aW9uLiAqL1xuICBydW5QYWNrYWdlTWFuYWdlcjogYm9vbGVhbjtcbn07XG5cbi8qKiBDcmVhdGVzIGEgY29uc3RydWN0b3IgdHlwZSBmb3IgdGhlIHNwZWNpZmllZCB0eXBlLiAqL1xuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xuLyoqIEdldHMgYSBjb25zdHJ1Y3RvciB0eXBlIGZvciB0aGUgcGFzc2VkIG1pZ3JhdGlvbiBkYXRhLiAqL1xuZXhwb3J0IHR5cGUgTWlncmF0aW9uQ3RvcjxEYXRhLCBDb250ZXh0ID0gYW55PiA9IENvbnN0cnVjdG9yPE1pZ3JhdGlvbjxEYXRhLCBDb250ZXh0Pj47XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNaWdyYXRpb248RGF0YSwgQ29udGV4dCA9IGFueT4ge1xuICAvKiogTGlzdCBvZiBtaWdyYXRpb24gZmFpbHVyZXMgdGhhdCBuZWVkIHRvIGJlIHJlcG9ydGVkLiAqL1xuICBmYWlsdXJlczogTWlncmF0aW9uRmFpbHVyZVtdID0gW107XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1pZ3JhdGlvbiBpcyBlbmFibGVkIG9yIG5vdC4gKi9cbiAgYWJzdHJhY3QgZW5hYmxlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVHlwZVNjcmlwdCBwcm9ncmFtIGZvciB0aGUgbWlncmF0aW9uLiAqL1xuICAgIHB1YmxpYyBwcm9ncmFtOiB0cy5Qcm9ncmFtLFxuICAgIC8qKiBUeXBlQ2hlY2tlciBpbnN0YW5jZSBmb3IgdGhlIGFuYWx5c2lzIHByb2dyYW0uICovXG4gICAgcHVibGljIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbiAgICAvKiogVmVyc2lvbiBmb3Igd2hpY2ggdGhlIG1pZ3JhdGlvbiBydWxlIHNob3VsZCBydW4uICovXG4gICAgcHVibGljIHRhcmdldFZlcnNpb246IFRhcmdldFZlcnNpb24sXG4gICAgLyoqIENvbnRleHQgZGF0YSBmb3IgdGhlIG1pZ3JhdGlvbi4gKi9cbiAgICBwdWJsaWMgY29udGV4dDogQ29udGV4dCxcbiAgICAvKiogVXBncmFkZSBkYXRhIHBhc3NlZCB0byB0aGUgbWlncmF0aW9uLiAqL1xuICAgIHB1YmxpYyB1cGdyYWRlRGF0YTogRGF0YSxcbiAgICAvKiogRmlsZSBzeXN0ZW0gdGhhdCBjYW4gYmUgdXNlZCBmb3IgbW9kaWZ5aW5nIGZpbGVzLiAqL1xuICAgIHB1YmxpYyBmaWxlU3lzdGVtOiBGaWxlU3lzdGVtLFxuICAgIC8qKiBMb2dnZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBwcmludCBtZXNzYWdlcyBhcyBwYXJ0IG9mIHRoZSBtaWdyYXRpb24uICovXG4gICAgcHVibGljIGxvZ2dlcjogVXBkYXRlTG9nZ2VyLFxuICApIHt9XG5cbiAgLyoqIE1ldGhvZCBjYW4gYmUgdXNlZCB0byBwZXJmb3JtIGdsb2JhbCBhbmFseXNpcyBvZiB0aGUgcHJvZ3JhbS4gKi9cbiAgaW5pdCgpOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0aGF0IHdpbGwgYmUgY2FsbGVkIG9uY2UgYWxsIG5vZGVzLCB0ZW1wbGF0ZXMgYW5kIHN0eWxlc2hlZXRzXG4gICAqIGhhdmUgYmVlbiB2aXNpdGVkLlxuICAgKi9cbiAgcG9zdEFuYWx5c2lzKCk6IHZvaWQge31cblxuICAvKipcbiAgICogTWV0aG9kIHRoYXQgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggbm9kZSBpbiBhIGdpdmVuIHNvdXJjZSBmaWxlLiBVbmxpa2UgdHNsaW50LCB0aGlzXG4gICAqIGZ1bmN0aW9uIHdpbGwgb25seSByZXRyaWV2ZSBUeXBlU2NyaXB0IG5vZGVzIHRoYXQgbmVlZCB0byBiZSBjYXN0ZWQgbWFudWFsbHkuIFRoaXNcbiAgICogYWxsb3dzIHVzIHRvIG9ubHkgd2FsayB0aGUgcHJvZ3JhbSBzb3VyY2UgZmlsZXMgb25jZSBwZXIgcHJvZ3JhbSBhbmQgbm90IHBlclxuICAgKiBtaWdyYXRpb24gcnVsZSAoc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2UgYm9vc3QpLlxuICAgKi9cbiAgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHt9XG5cbiAgLyoqIE1ldGhvZCB0aGF0IHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIEFuZ3VsYXIgdGVtcGxhdGUgaW4gdGhlIHByb2dyYW0uICovXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHt9XG5cbiAgLyoqIE1ldGhvZCB0aGF0IHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIHN0eWxlc2hlZXQgaW4gdGhlIHByb2dyYW0uICovXG4gIHZpc2l0U3R5bGVzaGVldChzdHlsZXNoZWV0OiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7fVxuXG4gIC8qKiBDcmVhdGVzIGEgZmFpbHVyZSB3aXRoIGEgc3BlY2lmaWVkIG1lc3NhZ2UgYXQgdGhlIGdpdmVuIG5vZGUgbG9jYXRpb24uICovXG4gIHByb3RlY3RlZCBjcmVhdGVGYWlsdXJlQXROb2RlKG5vZGU6IHRzLk5vZGUsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBub2RlLmdldFNvdXJjZUZpbGUoKTtcbiAgICB0aGlzLmZhaWx1cmVzLnB1c2goe1xuICAgICAgZmlsZVBhdGg6IHRoaXMuZmlsZVN5c3RlbS5yZXNvbHZlKHNvdXJjZUZpbGUuZmlsZU5hbWUpLFxuICAgICAgcG9zaXRpb246IHRzLmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKHNvdXJjZUZpbGUsIG5vZGUuZ2V0U3RhcnQoKSksXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIH0pO1xuICB9XG59XG4iXX0=