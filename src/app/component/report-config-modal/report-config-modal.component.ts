import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReportConfig, ColumnGrouping, MAX_DESCRIPTION_WORD_CAP } from '../../model/report-config';
import { Activity } from '../../model/activity-store';
import { ProgressTitle, TeamGroups } from '../../model/types';

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

  // --- Team toggling ---
  isTeamSelected(team: string): boolean {
    return this.config.selectedTeams.includes(team);
  }

  toggleTeam(team: string): void {
    const idx = this.config.selectedTeams.indexOf(team);
    if (idx >= 0) {
      this.config.selectedTeams.splice(idx, 1);
    } else {
      this.config.selectedTeams.push(team);
    }
  }

  selectAllTeams(): void {
    this.config.selectedTeams = [...this.allTeams];
  }

  deselectAllTeams(): void {
    this.config.selectedTeams = [];
  }

  get groupNames(): string[] {
    return Object.keys(this.teamGroups);
  }

  selectGroup(group: string): void {
    this.config.selectedTeams = [...(this.teamGroups[group] || [])];
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
  toggleAttribute(key: 'showDescription'): void {
    this.config[key] = !this.config[key];
  }

  // --- Actions ---
  onSave(): void {
    this.dialogRef.close(this.config);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
