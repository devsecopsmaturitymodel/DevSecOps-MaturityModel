"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputNamesMigration = void 0;
const migration_1 = require("../../update-tool/migration");
const angular_1 = require("../html-parsing/angular");
const upgrade_data_1 = require("../upgrade-data");
/**
 * Migration that walks through every inline or external HTML template and switches
 * changed output binding names to the proper new output name.
 */
class OutputNamesMigration extends migration_1.Migration {
    constructor() {
        super(...arguments);
        /** Change data that upgrades to the specified target version. */
        this.data = (0, upgrade_data_1.getVersionUpgradeData)(this, 'outputNames');
        // Only enable the migration rule if there is upgrade data.
        this.enabled = this.data.length !== 0;
    }
    visitTemplate(template) {
        this.data.forEach(name => {
            const limitedTo = name.limitedTo;
            const relativeOffsets = [];
            if (limitedTo.attributes) {
                relativeOffsets.push(...(0, angular_1.findOutputsOnElementWithAttr)(template.content, name.replace, limitedTo.attributes));
            }
            if (limitedTo.elements) {
                relativeOffsets.push(...(0, angular_1.findOutputsOnElementWithTag)(template.content, name.replace, limitedTo.elements));
            }
            relativeOffsets
                .map(offset => template.start + offset)
                .forEach(start => this._replaceOutputName(template.filePath, start, name.replace.length, name.replaceWith));
        });
    }
    _replaceOutputName(filePath, start, width, newName) {
        this.fileSystem.edit(filePath).remove(start, width).insertRight(start, newName);
    }
}
exports.OutputNamesMigration = OutputNamesMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LW5hbWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL291dHB1dC1uYW1lcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFJSCwyREFBc0Q7QUFHdEQscURBQWtHO0FBQ2xHLGtEQUFtRTtBQUVuRTs7O0dBR0c7QUFDSCxNQUFhLG9CQUFxQixTQUFRLHFCQUFzQjtJQUFoRTs7UUFDRSxpRUFBaUU7UUFDakUsU0FBSSxHQUE0QixJQUFBLG9DQUFxQixFQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUUzRSwyREFBMkQ7UUFDM0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQW1DbkMsQ0FBQztJQWpDVSxhQUFhLENBQUMsUUFBMEI7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNqQyxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7WUFFckMsSUFBSSxTQUFTLENBQUMsVUFBVSxFQUFFO2dCQUN4QixlQUFlLENBQUMsSUFBSSxDQUNsQixHQUFHLElBQUEsc0NBQTRCLEVBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FDdEYsQ0FBQzthQUNIO1lBRUQsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO2dCQUN0QixlQUFlLENBQUMsSUFBSSxDQUNsQixHQUFHLElBQUEscUNBQTJCLEVBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FDbkYsQ0FBQzthQUNIO1lBRUQsZUFBZTtpQkFDWixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztpQkFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQ2YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FDekYsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGtCQUFrQixDQUN4QixRQUF1QixFQUN2QixLQUFhLEVBQ2IsS0FBYSxFQUNiLE9BQWU7UUFFZixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEYsQ0FBQztDQUNGO0FBeENELG9EQXdDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1dvcmtzcGFjZVBhdGh9IGZyb20gJy4uLy4uL3VwZGF0ZS10b29sL2ZpbGUtc3lzdGVtJztcbmltcG9ydCB7UmVzb2x2ZWRSZXNvdXJjZX0gZnJvbSAnLi4vLi4vdXBkYXRlLXRvb2wvY29tcG9uZW50LXJlc291cmNlLWNvbGxlY3Rvcic7XG5pbXBvcnQge01pZ3JhdGlvbn0gZnJvbSAnLi4vLi4vdXBkYXRlLXRvb2wvbWlncmF0aW9uJztcblxuaW1wb3J0IHtPdXRwdXROYW1lVXBncmFkZURhdGF9IGZyb20gJy4uL2RhdGEnO1xuaW1wb3J0IHtmaW5kT3V0cHV0c09uRWxlbWVudFdpdGhBdHRyLCBmaW5kT3V0cHV0c09uRWxlbWVudFdpdGhUYWd9IGZyb20gJy4uL2h0bWwtcGFyc2luZy9hbmd1bGFyJztcbmltcG9ydCB7Z2V0VmVyc2lvblVwZ3JhZGVEYXRhLCBVcGdyYWRlRGF0YX0gZnJvbSAnLi4vdXBncmFkZS1kYXRhJztcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCB3YWxrcyB0aHJvdWdoIGV2ZXJ5IGlubGluZSBvciBleHRlcm5hbCBIVE1MIHRlbXBsYXRlIGFuZCBzd2l0Y2hlc1xuICogY2hhbmdlZCBvdXRwdXQgYmluZGluZyBuYW1lcyB0byB0aGUgcHJvcGVyIG5ldyBvdXRwdXQgbmFtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE91dHB1dE5hbWVzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPFVwZ3JhZGVEYXRhPiB7XG4gIC8qKiBDaGFuZ2UgZGF0YSB0aGF0IHVwZ3JhZGVzIHRvIHRoZSBzcGVjaWZpZWQgdGFyZ2V0IHZlcnNpb24uICovXG4gIGRhdGE6IE91dHB1dE5hbWVVcGdyYWRlRGF0YVtdID0gZ2V0VmVyc2lvblVwZ3JhZGVEYXRhKHRoaXMsICdvdXRwdXROYW1lcycpO1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoZSBtaWdyYXRpb24gcnVsZSBpZiB0aGVyZSBpcyB1cGdyYWRlIGRhdGEuXG4gIGVuYWJsZWQgPSB0aGlzLmRhdGEubGVuZ3RoICE9PSAwO1xuXG4gIG92ZXJyaWRlIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGEuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGNvbnN0IGxpbWl0ZWRUbyA9IG5hbWUubGltaXRlZFRvO1xuICAgICAgY29uc3QgcmVsYXRpdmVPZmZzZXRzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgICBpZiAobGltaXRlZFRvLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmVsYXRpdmVPZmZzZXRzLnB1c2goXG4gICAgICAgICAgLi4uZmluZE91dHB1dHNPbkVsZW1lbnRXaXRoQXR0cih0ZW1wbGF0ZS5jb250ZW50LCBuYW1lLnJlcGxhY2UsIGxpbWl0ZWRUby5hdHRyaWJ1dGVzKSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpbWl0ZWRUby5lbGVtZW50cykge1xuICAgICAgICByZWxhdGl2ZU9mZnNldHMucHVzaChcbiAgICAgICAgICAuLi5maW5kT3V0cHV0c09uRWxlbWVudFdpdGhUYWcodGVtcGxhdGUuY29udGVudCwgbmFtZS5yZXBsYWNlLCBsaW1pdGVkVG8uZWxlbWVudHMpLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZWxhdGl2ZU9mZnNldHNcbiAgICAgICAgLm1hcChvZmZzZXQgPT4gdGVtcGxhdGUuc3RhcnQgKyBvZmZzZXQpXG4gICAgICAgIC5mb3JFYWNoKHN0YXJ0ID0+XG4gICAgICAgICAgdGhpcy5fcmVwbGFjZU91dHB1dE5hbWUodGVtcGxhdGUuZmlsZVBhdGgsIHN0YXJ0LCBuYW1lLnJlcGxhY2UubGVuZ3RoLCBuYW1lLnJlcGxhY2VXaXRoKSxcbiAgICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlcGxhY2VPdXRwdXROYW1lKFxuICAgIGZpbGVQYXRoOiBXb3Jrc3BhY2VQYXRoLFxuICAgIHN0YXJ0OiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBuZXdOYW1lOiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKS5yZW1vdmUoc3RhcnQsIHdpZHRoKS5pbnNlcnRSaWdodChzdGFydCwgbmV3TmFtZSk7XG4gIH1cbn1cbiJdfQ==