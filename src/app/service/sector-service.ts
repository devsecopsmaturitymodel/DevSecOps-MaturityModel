import { Injectable } from '@angular/core';
import { Activity } from 'src/app/model/activity-store';
import { Progress, ProgressDefinitions, TeamNames, Uuid } from 'src/app/model/types';
import { ProgressStore } from 'src/app/model/progress-store';

/**
 * The SectorViewController class is responsible for providing activity progress for all
 * activities sharing the same dimension and level, which we call a "sector". It takes
 * into account the current teams that are visible in the UI for the calculation.
 */

@Injectable({ providedIn: 'root' })
export class SectorService {
  private progressStore!: ProgressStore;
  private allTeams: TeamNames = [];
  private visibleTeams: TeamNames = [];
  private allProgress: Progress | null = null;
  private progressStates: string[] = [];
  private progressValues: ProgressDefinitions | null = null;

  init(
    progressStore: ProgressStore,
    teamnames: TeamNames,
    progress: Progress,
    progressStates: ProgressDefinitions
  ) {
    this.progressStore = progressStore;
    this.allTeams = teamnames;
    this.allProgress = progress;
    this.progressValues = progressStates;
    this.progressStates = Object.keys(progressStates).sort(
      (a, b) => progressStates[b].score - progressStates[a].score
    );
  }

  setVisibleTeams(teams: TeamNames) {
    this.visibleTeams = teams;
  }

  getProgressStates() {
    return this.progressStates.slice().reverse();
  }

  getSectorProgress(activities: Activity[]): number {
    if (!activities || activities.length === 0) {
      return NaN;
    }
    const teams = this.visibleTeams.length === 0 ? this.allTeams : this.visibleTeams;
    let progress = 0;
    for (const activity of activities) {
      progress += this.getActivityProgress(activity.uuid, teams);
    }
    return activities.length ? progress / activities.length : 0;
  }

  private getActivityProgress(
    uuid: Uuid,
    teams: TeamNames,
    getBackupValue: boolean = false
  ): number {
    let progress = 0;
    for (const team of teams) {
      progress += this.progressStore?.getTeamActivityProgressValue(uuid, team, getBackupValue) || 0;
    }
    return teams.length ? progress / teams.length : 0;
  }
}
