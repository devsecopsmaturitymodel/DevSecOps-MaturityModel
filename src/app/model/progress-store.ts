import { YamlService } from '../service/yaml-loader/yaml-loader.service';
import { isEmptyObj, perfNow } from '../util/util';
import {
  Uuid,
  TeamName,
  TeamProgress,
  Progress,
  ProgressDefinitions,
  ProgressTitle,
  TeamProgressFile,
} from './types';

type ActivityMap = Record<Uuid, string>;

export interface TeamActivityProgress {
  team: TeamName;
  activityUuid: Uuid;
  progress: TeamProgress;
}
const LOCALSTORAGE_KEY: string = 'progress';

export class ProgressStore {
  private yamlService: YamlService = new YamlService();
  private _activityMap: ActivityMap = {};
  private _progress: Progress = {};
  private _tempProgress: Progress = {};
  private _progressDefinition: ProgressDefinitions | null = null;
  private _progressTitles: ProgressTitle[] | null = null;
  private _progressTitlesDescOrder: ProgressTitle[] | null = null;

  public init(progressDefinition: ProgressDefinitions): void {
    // Sort the progress titles, from most completed, to not started
    this._progressDefinition = progressDefinition;
    this._progressTitles = Object.keys(progressDefinition).sort(
      (a, b) => progressDefinition[a].score - progressDefinition[b].score
    );
    this._progressTitlesDescOrder = this._progressTitles.slice().reverse();
  }

  public setActivityMap(activityMap: ActivityMap): void {
    this._activityMap = activityMap;
  }

  public getProgressData(): Progress {
    return this._progress;
  }

  public addProgressData(newProgress: Progress): void {
    if (!newProgress) return;

    if (isEmptyObj(this._progress)) {
      this._progress = newProgress;
      return;
    }

    let orgProgress: Progress = this._progress;
    for (let activityUuid in newProgress) {
      if (isEmptyObj(orgProgress[activityUuid])) {
        orgProgress[activityUuid] = newProgress[activityUuid];
        continue;
      }

      for (let teamname in newProgress[activityUuid]) {
        if (isEmptyObj(orgProgress[activityUuid][teamname])) {
          orgProgress[activityUuid][teamname] = newProgress[activityUuid][teamname];
        } else {
          let inTeamProgress: TeamProgress = newProgress[activityUuid][teamname];
          let orgTeamProgress: TeamProgress = orgProgress[activityUuid][teamname];

          for (let key in inTeamProgress) {
            let orgDate: Date = orgTeamProgress[key];
            let inDate: Date = inTeamProgress[key];

            if (this.isOutdated(orgDate, inDate)) {
              orgTeamProgress[key] = inTeamProgress[key];
            }
          }
        }
      }
    }
  }

  private isOutdated(orgDate: Date, inDate: Date): boolean {
    if (!inDate) return false;
    if (!orgDate) return true;

    return inDate.getTime() < orgDate.getTime();
  }

  public renameTeam(oldName: TeamName, newName: TeamName): void {
    if (!this._progress) return;

    console.log(`${perfNow()} Renaming team '${oldName}' to '${newName}' in progress store`);
    for (let activityUuid in this._progress) {
      if (this._progress[activityUuid][oldName]) {
        this._progress[activityUuid][newName] = this._progress[activityUuid][oldName];
        delete this._progress[activityUuid][oldName];
      }
      // Update the temporary progress as well
      if (this._tempProgress?.[activityUuid]?.[oldName]) {
        this._tempProgress[activityUuid][newName] = this._tempProgress[activityUuid][oldName];
        delete this._tempProgress[activityUuid][oldName];
      }
    }
  }

  public renameProgressTitle(oldTitle: ProgressTitle, newTitle: ProgressTitle): void {
    if (!this._progress) return;

    console.log(`${perfNow()} Renaming progress title '${oldTitle}' to '${newTitle}' in progress store`);  // eslint-disable-line

    // Update progress data
    for (let activityUuid in this._progress) {
      for (let teamName in this._progress[activityUuid]) {
        if (this._progress[activityUuid][teamName][oldTitle]) {
          this._progress[activityUuid][teamName][newTitle] = this._progress[activityUuid][teamName][oldTitle]; // eslint-disable-line
          delete this._progress[activityUuid][teamName][oldTitle];
        }
      }
    }

    // Update temporary progress data
    for (let activityUuid in this._tempProgress) {
      for (let teamName in this._tempProgress[activityUuid]) {
        if (this._tempProgress[activityUuid][teamName][oldTitle]) {
          this._tempProgress[activityUuid][teamName][newTitle] = this._tempProgress[activityUuid][teamName][oldTitle]; // eslint-disable-line
          delete this._tempProgress[activityUuid][teamName][oldTitle];
        }
      }
    }

    // Update progress titles arrays
    if (this._progressTitles) {
      const index = this._progressTitles.indexOf(oldTitle);
      if (index !== -1) {
        this._progressTitles[index] = newTitle;
      }
    }

    if (this._progressTitlesDescOrder) {
      const index = this._progressTitlesDescOrder.indexOf(oldTitle);
      if (index !== -1) {
        this._progressTitlesDescOrder[index] = newTitle;
      }
    }
  }

  public getTeamProgress(
    activityUuid: Uuid,
    teamName: TeamName,
    returnBackupValue: boolean = false
  ): TeamProgress {
    if (returnBackupValue) {
      return this._tempProgress?.[activityUuid]?.[teamName];
    } else {
      return this._progress?.[activityUuid]?.[teamName];
    }
  }

  public getTeamProgressTitle(activityUuid: Uuid, teamName: TeamName): ProgressTitle {
    // Return the key with the most largest value
    let teamProgress: TeamProgress = this._progress?.[activityUuid]?.[teamName];
    if (!this._progressTitles) return '';
    if (!isEmptyObj(teamProgress)) {
      for (let title of this._progressTitlesDescOrder || []) {
        if (teamProgress[title]) {
          return title;
        }
      }
    }
    return this._progressTitles[0];
  }

  public getTeamActivityProgressValue(
    activityUuid: Uuid,
    teamName: TeamName,
    getBackupValue: boolean = false
  ): number {
    let teamProgress: TeamProgress = this.getTeamProgress(activityUuid, teamName, getBackupValue);
    return this.getProgressValue(teamProgress);
  }

  public getTeamActivityTitle(
    activityUuid: Uuid,
    teamName: TeamName,
    returnBackupValue: boolean = false
  ): ProgressTitle {
    // Return the team activity title for the given activity and team
    if (this._progressTitles == null) return '';
    let teamProgress: TeamProgress = this.getTeamProgress(
      activityUuid,
      teamName,
      returnBackupValue
    );
    if (teamProgress == null) return this._progressTitles[0];
    for (const title of this._progressTitlesDescOrder || []) {
      if (teamProgress[title] !== undefined && this._progressDefinition) {
        return title;
      }
    }
    return this._progressTitles[0];
  }

  public getInProgressTitles(): ProgressTitle[] {
    if (!this._progressTitles) return [];
    return this._progressTitles.slice(1, -1);
  }

  public getCompletedProgressTitle(): ProgressTitle {
    if (!this._progressTitles) return '';
    return this._progressTitles.slice(-1)[0];
  }

  /* All activities:
   *  - where all teams have Completed status
   */
  public getActivitiesCompletedForTeams(teamNames: TeamName[]): TeamActivityProgress[] {
    let completedName: ProgressTitle = this._progressTitlesDescOrder?.[0] || '';

    let activitiesCompleted: TeamActivityProgress[] = [];
    let teamCount = teamNames.length;
    for (let activityUuid in this._progress) {
      let count = 0;
      for (let teamName of teamNames) {
        if (this._progress?.[activityUuid]?.[teamName]?.[completedName]) {
          count++;
        }
        if (count === teamCount) {
          let teamActivityProgress: TeamActivityProgress = {
            team: '',
            activityUuid: activityUuid,
            progress: this._progress[activityUuid][teamName],
          };
          activitiesCompleted.push(teamActivityProgress);
        }
      }
    }
    return activitiesCompleted;
  }

  /* Activities Started:
   *  - where at least one teams have a progress stage > 0%
   */
  public getActivitiesStartedForTeams(teamNames: TeamName[]): TeamActivityProgress[] {
    let initiatedName: ProgressTitle = this._progressTitles?.[1] || '';

    let activitiesCompleted: TeamActivityProgress[] = [];
    for (let activityUuid in this._progress) {
      for (let teamName of teamNames) {
        // Only include started activities
        if (this._progress?.[activityUuid]?.[teamName]?.[initiatedName]) {
          let teamActivityProgress: TeamActivityProgress = {
            team: teamName,
            activityUuid: activityUuid,
            progress: this._progress[activityUuid][teamName],
          };
          activitiesCompleted.push(teamActivityProgress);
        }
      }
    }
    return activitiesCompleted;
  }

  /* Activities In Progress:
   *  - where at least one teams have a progress stage > 0%, but also less than 100%
   */
  public getActivitiesInProgressForTeams(teamNames: TeamName[]): TeamActivityProgress[] {
    let initiatedName: ProgressTitle = this._progressTitles?.[1] || '';
    let completedName: ProgressTitle = this._progressTitlesDescOrder?.[0] || '';

    let activitiesCompleted: TeamActivityProgress[] = [];
    for (let activityUuid in this._progress) {
      for (let teamName of teamNames) {
        // Only include started, but not completed activities
        if (
          this._progress?.[activityUuid]?.[teamName]?.[initiatedName] &&
          !this._progress?.[activityUuid]?.[teamName]?.[completedName]
        ) {
          let teamActivityProgress: TeamActivityProgress = {
            team: teamName,
            activityUuid: activityUuid,
            progress: this._progress[activityUuid][teamName],
          };
          activitiesCompleted.push(teamActivityProgress);
        }
      }
    }
    return activitiesCompleted;
  }

  // Calculate the progress value for a team progress state
  private getProgressValue(teamProgress: TeamProgress): number {
    if (!this._progressTitlesDescOrder) return 0;
    if (!teamProgress) return 0;
    if (!this._progressDefinition) return 0;

    for (const progressTitle of this._progressTitlesDescOrder || []) {
      if (teamProgress[progressTitle] !== undefined) {
        return this._progressDefinition[progressTitle].score;
      }
    }
    return 0;
  }

  public setTeamActivityProgressState(
    activityUuid: Uuid,
    teamName: TeamName,
    newProgress: ProgressTitle
  ) {
    if (!this._progressTitles || !this._progressTitlesDescOrder) {
      throw Error('Progress states are not initialized');
    }
    console.log(`Setting progress state for activity ${activityUuid} and team ${teamName} to: ${newProgress}`); // eslint-disable-line

    if (!this._progress[activityUuid]) {
      this._progress[activityUuid] = {};
    }
    if (!this._progress[activityUuid][teamName]) {
      this._progress[activityUuid][teamName] = {};
    }

    let orgProgress: ProgressTitle = this.getTeamProgressTitle(activityUuid, teamName);
    let orgIndex: number = this._progressTitles.indexOf(orgProgress);
    let newIndex: number = this._progressTitles.indexOf(newProgress);

    if (newIndex < orgIndex) {
      this.clearTeamActivityProgress(activityUuid, teamName, newIndex + 1, orgIndex);
    } else if (newIndex > orgIndex) {
      this.setTeamActivityProgress(activityUuid, teamName, orgIndex + 1, newIndex);
    }
    // this.dump(activityUuid, teamName);
    this.saveToLocalStorage();
  }

  private dump(activityUuid: Uuid, teamName: TeamName) {
    console.log(`Dump: ${activityUuid}: ${teamName}`);
    if (this._progressTitles == null) return;
    for (let i = 0; i < this._progressTitles.length; i++) {
      let progress = this._progressTitles[i];
      console.log(
        ` - ${progress.padEnd(11)}: ${this._progress?.[activityUuid]?.[teamName]?.[progress]
          ?.toISOString()
          ?.substring(0, 10)} ${this._tempProgress?.[activityUuid]?.[teamName]?.[progress]
          ?.toISOString()
          ?.substring(0, 10)}`
      );
    }
  }

  public asYamlString(): string {
    return this.toProgressYamlString(this._progress);
  }

  public saveToLocalStorage() {
    let yamlStr: string = this.toProgressYamlString(this._progress);
    localStorage.setItem(LOCALSTORAGE_KEY, yamlStr);
  }

  public deleteBrowserStoredTeamProgress(): void {
    console.log('Deleting team progress from browser storage');
    localStorage.removeItem(LOCALSTORAGE_KEY);
  }

  private getActivityName(activityUuid: Uuid): string | null {
    if (this._activityMap) {
      return this._activityMap[activityUuid] || null;
    }
    return null;
  }

  /**
   * Custom YAML stringifier for the progress data, to include activity name as a comment
   */
  private toProgressYamlString(progress: Progress, indent: number = 2): string {
    let str = 'progress:\n';
    let tab = ' '.repeat(indent);
    for (let activityUuid in progress) {
      let activityName: string | null = this.getActivityName(activityUuid);
      let comment: string = activityName ? `  # ${activityName}` : '';

      let str_activity: string = '';

      for (let teamName in progress[activityUuid]) {
        let str_team: string = '';
        for (let title in progress[activityUuid][teamName]) {
          if (title !== this._progressTitles?.[0]) {
            let date: Date = progress[activityUuid][teamName][title] as Date;
            let dateStr: string = date.toISOString().substring(0, 10);
            str_team += tab + tab + tab + `'${title}': ${dateStr}\n`;
          }
        }
        // Add team progress to activity, only if team has progress
        if (str_team) {
          str_activity += tab + tab + `'${teamName}':\n`;
          str_activity += str_team;
        }
      }
      if (str_activity) {
        // Add activity progress, only if any progress exists
        str += tab + `${activityUuid}:${comment}\n`;
        str += str_activity;
      }
    }
    return str;
  }

  public retrieveStoredTeamProgressYaml(): string | null {
    let yamlStr: string | null = localStorage.getItem(LOCALSTORAGE_KEY);
    return yamlStr;
  }

  public retrieveStoredTeamProgress(): TeamProgressFile | null {
    let yamlStr: string | null = this.retrieveStoredTeamProgressYaml();
    if (yamlStr == null) return null;

    return this.yamlService.parse(yamlStr);
  }

  /**
   * Clear progress for a team's activity, from startIndex to endIndex.
   * It will store a backup of the progress in _tempProgress, in case
   * these dates need to be restored.
   */
  private clearTeamActivityProgress(
    activityUuid: Uuid,
    teamName: TeamName,
    startIndex: number,
    endIndex: number
  ) {
    if (!this._progressTitles) {
      throw Error('Progress states are not initialized');
    }
    console.log(`clearTeamActivityProgress('${teamName}'): ${startIndex}-${endIndex}`);
    // Set value
    if (
      startIndex > 0 &&
      !this._progress[activityUuid][teamName][this._progressTitles[startIndex - 1]]
    ) {
      this._progress[activityUuid][teamName][this._progressTitles[startIndex - 1]] = this.today();
    }

    // Prepare temp storage
    if (!this._tempProgress[activityUuid]) {
      this._tempProgress[activityUuid] = {};
    }
    if (!this._tempProgress[activityUuid][teamName]) {
      this._tempProgress[activityUuid][teamName] = {};
    }

    // Loop through the progress states in the specified range
    for (let i = startIndex; i <= endIndex; i++) {
      let progressTitle: ProgressTitle = this._progressTitles[i];
      if (this._tempProgress[activityUuid][teamName][progressTitle]) {
        console.warn(`Progress state ${progressTitle} already exists for activity ${activityUuid} and team ${teamName}`); // eslint-disable-line
      }
      // Store the current progress state in the temporary store
      console.log(`Backup ${teamName}: ${progressTitle}: ${this._progress?.[activityUuid]?.[teamName]?.[progressTitle]?.toISOString()}`); // eslint-disable-line
      let date: Date = this._progress[activityUuid][teamName][progressTitle];
      if (date) {
        this._tempProgress[activityUuid][teamName][progressTitle] = date;
      }
      delete this._progress[activityUuid][teamName][progressTitle];
    }
    console.log(`Temporary store: `, this._tempProgress);
  }

  private setTeamActivityProgress(
    activityUuid: Uuid,
    teamName: TeamName,
    startIndex: number,
    endIndex: number
  ) {
    if (!this._progressTitles) {
      throw Error('Progress states are not initialized');
    }
    console.log(`setTeamActivityProgress('${teamName}'): ${startIndex}-${endIndex}`);

    if (!this._progress[activityUuid]) {
      throw Error(`Temporary progress for activity ${activityUuid} does not exist`);
    }
    if (!this._progress[activityUuid][teamName]) {
      throw Error(`Temporary progress for team ${teamName} does not exist`);
    }

    // Create dateonly object, for today, in UTC timezone
    let prevDate = this.today();

    for (let i = endIndex; i >= startIndex; i--) {
      let progressTitle: ProgressTitle = this._progressTitles[i];
      if (this._tempProgress?.[activityUuid]?.[teamName]?.[progressTitle]) {
        // Move the progress date from temp to progress, and update the `prevDate
        prevDate = this._tempProgress[activityUuid][teamName][progressTitle];
        this._progress[activityUuid][teamName][progressTitle] = prevDate;
        delete this._tempProgress[activityUuid][teamName][progressTitle];
        console.log(`Restore ${teamName}: ${progressTitle}: ${this._progress?.[activityUuid]?.[teamName]?.[progressTitle]?.toISOString()}`); // eslint-disable-line
      } else {
        // If temp title does not exist, use the date from the previous step
        console.log(`Set ${teamName}: ${progressTitle}: ${prevDate?.toISOString()}`);
        this._progress[activityUuid][teamName][progressTitle] = prevDate;
      }
    }
    console.log(`Restored ${teamName}. Temporary store: `, this._tempProgress);
  }

  private today(): Date {
    let now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
}
