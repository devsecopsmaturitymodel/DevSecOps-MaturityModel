import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  ReportConfig,
  ActivityAttributes,
  ColumnGrouping,
  MAX_DESCRIPTION_WORD_CAP,
} from '../../model/report-config';
import { Activity } from '../../model/activity-store';
import { ProgressTitle, TeamGroups } from '../../model/types';
import { MatButtonModule } from '@angular/material/button';
import { TeamSelectorComponent } from '../team-selector/team-selector.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface ReportConfigModalData {
  config: ReportConfig;
  allActivities: Activity[];
  allTeams: string[];
  allDimensions: string[];
  allSubdimensions: string[];
  allProgressTitles: ProgressTitle[];
  teamGroups: TeamGroups;
}

@Component({
  selector: 'app-report-config-modal',
  templateUrl: './report-config-modal.component.html',
  styleUrls: ['./report-config-modal.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatCheckboxModule,
    NgIf,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TeamSelectorComponent,
    MatButtonModule,
  ],
})
export class ReportConfigModalComponent {
  config: ReportConfig;
  allActivities: Activity[];
  allTeams: string[];
  allDimensions: string[];
  allSubdimensions: string[];
  allProgressTitles: ProgressTitle[];
  teamGroups: TeamGroups;
  activitySearchQuery: string = '';
  maxWordCap: number = MAX_DESCRIPTION_WORD_CAP;

  constructor(
    public dialogRef: MatDialogRef<ReportConfigModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportConfigModalData
  ) {
    // Deep copy config to avoid mutating the original until save
    this.config = JSON.parse(JSON.stringify(data.config));
    this.allActivities = data.allActivities;
    this.allTeams = data.allTeams;
    this.allDimensions = data.allDimensions;
    this.allSubdimensions = data.allSubdimensions;
    this.allProgressTitles = data.allProgressTitles || [];
    this.teamGroups = data.teamGroups || {};
  }

  setColumnGrouping(grouping: ColumnGrouping): void {
    this.config.columnGrouping = grouping;
  }

  wordCapLabel(value: number): string {
    return `${value}`;
  }

  onWordCapChange(event: any): void {
    if (event.value != null) {
      this.config.descriptionWordCap = event.value;
    }
  }

  // --- Activity attribute toggling ---
  toggleActivityAttribute(key: keyof ActivityAttributes): void {
    (this.config.activityAttributes as any)[key] = !this.config.activityAttributes[key];
  }

  get hasAnyMarkdownAttribute(): boolean {
    const a = this.config.activityAttributes;
    return a.showDescription || a.showRisk || a.showMeasure || a.showEvidence;
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

  // --- Actions ---
  onSave(): void {
    this.dialogRef.close(this.config);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
