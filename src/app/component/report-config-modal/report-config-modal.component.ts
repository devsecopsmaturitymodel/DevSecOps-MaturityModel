import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportConfig, ActivityAttributeVisibility } from '../../model/report-config';
import { Activity } from '../../model/activity-store';

export interface ReportConfigModalData {
  config: ReportConfig;
  allActivities: Activity[];
  allDimensions: string[];
  allSubdimensions: string[];
  allLevels: number[];
}

@Component({
  selector: 'app-report-config-modal',
  templateUrl: './report-config-modal.component.html',
  styleUrls: ['./report-config-modal.component.css'],
})
export class ReportConfigModalComponent {
  config: ReportConfig;
  allActivities: Activity[];
  allDimensions: string[];
  allSubdimensions: string[];
  allLevels: number[];

  // Attribute display labels
  attributeLabels: { key: keyof ActivityAttributeVisibility; label: string }[] = [
    { key: 'showDescription', label: 'Description' },
    { key: 'showRisk', label: 'Risk' },
    { key: 'showMeasure', label: 'Measure' },
    { key: 'showAssessment', label: 'Assessment' },
    { key: 'showImplementationGuide', label: 'Implementation Guide' },
    { key: 'showDifficulty', label: 'Difficulty of Implementation' },
    { key: 'showUsefulness', label: 'Usefulness' },
    { key: 'showDependencies', label: 'Dependencies' },
    { key: 'showTools', label: 'Tools' },
    { key: 'showMapping', label: 'Framework Mapping' },
    { key: 'showImplementedBy', label: 'Implemented By' },
    { key: 'showTags', label: 'Tags' },
    { key: 'showComments', label: 'Comments' },
  ];

  // Activity search
  activitySearchQuery: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReportConfigModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportConfigModalData
  ) {
    // Deep copy config to avoid mutating the original until save
    this.config = JSON.parse(JSON.stringify(data.config));
    this.allActivities = data.allActivities;
    this.allDimensions = data.allDimensions;
    this.allSubdimensions = data.allSubdimensions;
    this.allLevels = data.allLevels;
  }

  // --- Level toggling ---
  isLevelExcluded(level: number): boolean {
    return this.config.excludedLevels.includes(level);
  }

  toggleLevel(level: number): void {
    const idx = this.config.excludedLevels.indexOf(level);
    if (idx >= 0) {
      this.config.excludedLevels.splice(idx, 1);
    } else {
      this.config.excludedLevels.push(level);
    }
  }

  // --- Dimension toggling ---
  isDimensionExcluded(dim: string): boolean {
    return this.config.excludedDimensions.includes(dim);
  }

  toggleDimension(dim: string): void {
    const idx = this.config.excludedDimensions.indexOf(dim);
    if (idx >= 0) {
      this.config.excludedDimensions.splice(idx, 1);
    } else {
      this.config.excludedDimensions.push(dim);
    }
  }

  // --- Subdimension toggling ---
  isSubdimensionExcluded(subdim: string): boolean {
    return this.config.excludedSubdimensions.includes(subdim);
  }

  toggleSubdimension(subdim: string): void {
    const idx = this.config.excludedSubdimensions.indexOf(subdim);
    if (idx >= 0) {
      this.config.excludedSubdimensions.splice(idx, 1);
    } else {
      this.config.excludedSubdimensions.push(subdim);
    }
  }

  // --- Activity toggling ---
  isActivityExcluded(uuid: string): boolean {
    return this.config.excludedActivities.includes(uuid);
  }

  toggleActivity(uuid: string): void {
    const idx = this.config.excludedActivities.indexOf(uuid);
    if (idx >= 0) {
      this.config.excludedActivities.splice(idx, 1);
    } else {
      this.config.excludedActivities.push(uuid);
    }
  }

  get filteredActivities(): Activity[] {
    if (!this.activitySearchQuery.trim()) {
      return this.allActivities;
    }
    const query = this.activitySearchQuery.toLowerCase();
    return this.allActivities.filter(
      a => a.name.toLowerCase().includes(query) || a.dimension.toLowerCase().includes(query)
    );
  }

  // --- Attribute toggling ---
  toggleAttribute(key: keyof ActivityAttributeVisibility): void {
    this.config.attributes[key] = !this.config.attributes[key];
  }

  // --- Actions ---
  onSave(): void {
    this.dialogRef.close(this.config);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
