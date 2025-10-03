import { appendHashElement } from '../util/ArrayHash';
import { IgnoreList } from './ignore-list';
import { MarkdownText } from './markdown-text';

export type Data = Record<string, Category>;
export type Category = Record<string, Dimension>;
export type Dimension = Record<string, Activity>;

export interface Activity {
  ignore: boolean;
  uuid: string;
  category: string;
  dimension: string;
  level: number;
  name: string;
  description: MarkdownText;
  risk: MarkdownText;
  measure: MarkdownText;
  tags: string[];
  implementationGuide: MarkdownText;
  difficultyOfImplementation: DifficultyOfImplementation;
  usefulness: number;
  knowledge: number;
  resources: number;
  time: number;
  dependsOn: string[];
  comments: MarkdownText;
  implementation: Implementation[];
  evidence: MarkdownText;
  teamsEvidence: Object;
  assessment: MarkdownText;
  references: FrameworkReferences;
  isImplemented: boolean;
  teamsImplemented: Record<string, any>;
}

export interface FrameworkReferences {
  iso27001_2017: string[];
  iso27001_2022: string[];
  samm2: string[];
  openCRE: string[];
}

export interface Implementation {
  name: string;
  tags: string[];
  url: string;
  description: string;
}

export interface DifficultyOfImplementation {
  knowledge: number;
  time: number;
  resources: number;
}

const UUID = /([0-9a-f]{6,}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{6,})/i;

export class ActivityStore {
  public data: Data = {};
  private _activityList: Activity[] = [];
  private _activityByName: Record<string, Activity> = {};
  private _activityByUuid: Record<string, Activity> = {};
  private _categoryNames: string[] = [];
  private _allDimensions: Record<string, Activity[]> = {};
  private _maxLevel: number = -1;

  public getData(): Data {
    return this.data;
  }

  public getAllActivities(): Activity[] {
    return this._activityList;
  }

  public getAllActivitiesUpToLevel(maxLevel: number | null): Activity[] {
    /* eslint-disable */
    if (maxLevel == null) 
      return this._activityList;
    else
      return this._activityList.filter(a => a.level <= maxLevel);
    /* eslint-enable */
  }

  public getAllCategoryNames(): string[] {
    return this._categoryNames;
  }

  public getAllDimensionNames(): string[] {
    return Object.keys(this._allDimensions);
  }

  public getActivity(uuid: string, name: string): Activity {
    let activity: Activity = this.getActivityByUuid(uuid);
    if (!activity) {
      activity = this.getActivityByName(name);
    }
    return activity;
  }

  public getActivityByName(name: string): Activity {
    return this._activityByName[name];
  }

  public getActivityByUuid(uuid: string): Activity {
    return this._activityByUuid[uuid];
  }

  public getActivities(dimension: string, level: number): Activity[] {
    let activities: Activity[] = this._allDimensions[dimension];
    return Object.values(activities).filter(a => a.level == level);
  }

  public getMaxLevel(): number {
    return this._maxLevel;
  }

  public addActivityFile(yaml: Data, errors: string[]) {
    let activityList: Activity[] = [];
    let ignoreList: IgnoreList = new IgnoreList();
    this.prepareActivities(yaml, activityList, ignoreList);
    this._maxLevel = -1;
    if (this._activityList.length == 0) {
      this._activityList = activityList;
      this.buildLookups(activityList, this._activityByName, this._activityByUuid, errors);
      this.data = yaml;
    } else {
      this.removeIgnoredActivities(ignoreList, this._activityList);
      this.mergeActivities(activityList, this._activityList, errors);

      // Reset lookup tables after merge
      this._activityByName = {};
      this._activityByUuid = {};
      this.buildLookups(this._activityList, this._activityByName, this._activityByUuid, errors);
    }
    this.replaceDependsOnUUids(this._activityList, this._activityByUuid);
    this.buildDataHierarchy(this._activityList);
    this.buildDimensionList(this._activityList);
  }

  buildDimensionList(activityList: Activity[]) {
    let categories = new Set<string>();
    this._allDimensions = {};
    for (let activity of activityList) {
      categories.add(activity.category);
      appendHashElement(this._allDimensions, activity.dimension, activity);
      if (activity.level > this._maxLevel) this._maxLevel = activity.level;
    }
    this._categoryNames = Array.from(categories.keys());
  }

  buildDataHierarchy(activityList: Activity[]) {
    let data: Data = {};
    let categories: Category;
    let dimensions: Dimension;

    for (let activity of activityList) {
      if (!data.hasOwnProperty(activity.category)) {
        data[activity.category] = {};
      }

      categories = data[activity.category];
      if (!categories.hasOwnProperty(activity.dimension)) {
        categories[activity.dimension] = {};
      }

      dimensions = categories[activity.dimension];
      dimensions[activity.name] = activity;
    }
    this.data = data;
  }

  /**
   * Prepare activities loaded from a YAML file.
   *
   * Add category, dimension and activity name to activity object,
   * unless ignored, then add it to the ignoreList
   */
  prepareActivities(yaml: Data, activityList: Activity[], ignoreList: IgnoreList): void {
    for (let categoryName in yaml) {
      let category = yaml[categoryName];
      for (let dimName in category) {
        if (dimName == 'ignore') {
          ignoreList.add('category', categoryName);
          continue;
        }

        let dimension: Dimension = category[dimName];
        for (let activityName in dimension) {
          if (activityName == 'ignore') {
            ignoreList.add('dimension', dimName);
            continue;
          }
          let activity: Activity = dimension[activityName];
          if (activity.ignore === true) {
            if (activity.uuid) {
              ignoreList.add('uuid', activity.uuid);
            } else {
              ignoreList.add('name', activityName);
            }
            continue;
          }
          // console.log(`  - ${categoryName} -- ${dimName} -- ${activityName}`);

          // Initiate markdown strings
          activity.description = new MarkdownText(activity.description as unknown as string);
          activity.risk = new MarkdownText(activity.risk as unknown as string);
          activity.measure = new MarkdownText(activity.measure as unknown as string);
          activity.comments = new MarkdownText(activity.comments as unknown as string);
          activity.assessment = new MarkdownText(activity.assessment as unknown as string);
          activity.evidence = new MarkdownText(activity.evidence as unknown as string);

          // Rename properties to match the Activity interface
          activity.category = categoryName;
          activity.dimension = dimName;
          activity.name = activityName;
          if (activity.references) {
            let references: any = activity.references;
            if (references.hasOwnProperty('iso27001-2017')) {
              references.iso27001_2017 = references['iso27001-2017'];
              delete references['iso27001-2017'];
            }
            if (references.hasOwnProperty('iso27001-2022')) {
              references.iso27001_2022 = references['iso27001-2022'];
              delete references['iso27001-2022'];
            }
          }

          activityList.push(activity);
        }
      }
    }
  }

  removeIgnoredActivities(ignoreList: IgnoreList, activityList: Activity[]) {
    if (ignoreList.isEmpty()) return;

    let i: number = activityList.length - 1;

    // Loop backwards to not tamper with index when removing items
    while (i >= 0) {
      if (ignoreList.hasActivity(activityList[i])) {
        activityList.splice(i, 1); // Remove item from list
      }
      i--;
    }
  }

  buildLookups(
    activityList: Activity[],
    activityByName: Record<string, Activity>,
    activityByUuid: Record<string, Activity>,
    errors: string[]
  ) {
    for (let activity of activityList) {
      this.addActivityLookup(activity, activityByName, activityByUuid, errors);
    }
  }

  /**
   * Substitute dependsOn UUIDs with activity names
   */
  replaceDependsOnUUids(activityList: Activity[], activityByUuid: Record<string, Activity>) {
    for (let activity of activityList) {
      if (activity.dependsOn && activity.dependsOn.length > 0) {
        for (let i = 0; i < activity.dependsOn.length; i++) {
          if (activity.dependsOn[i].match(UUID)) {
            if (activityByUuid.hasOwnProperty(activity.dependsOn[i])) {
              activity.dependsOn[i] = activityByUuid[activity.dependsOn[i]].name;
            }
          }
        }
      }
    }
  }

  addActivityLookup(
    activity: Activity,
    activityByName: Record<string, Activity>,
    activityByUuid: Record<string, Activity>,
    errors: string[]
  ): boolean {
    let nameExists = activityByName.hasOwnProperty(activity.name);
    let uuidExists = activityByUuid.hasOwnProperty(activity.uuid);

    if (nameExists && uuidExists) {
      errors.push(`Duplicate activity '${activity.name}' (${activity.uuid}). Please remove one from your activity yaml files.`) // eslint-disable-line
    } else if (nameExists) {
      errors.push(`Duplicate activity name '${activity.name}' (${activity.uuid} and ${activityByName[activity.name].uuid}). Please remove or rename one of the activities.`) // eslint-disable-line
    } else if (uuidExists) {
      errors.push(`Duplicate activity uuid '${activity.uuid}' ('${activity.name}' and '${activityByUuid[activity.uuid].name}').`) // eslint-disable-line
    } else {
      activityByName[activity.name] = activity;
      activityByUuid[activity.uuid] = activity;
      return true;
    }
    return false;
  }

  /**
   * Merge new activities into list of existing activities.
   * Override property by property if the new activity already exists.
   * Identify existing by UUID (if present), otherwise by Name.
   *
   * If any errors are detected, return this by the error list.
   */
  mergeActivities(newActivities: Activity[], existingData: Activity[], errors: string[]) {
    for (let newActivity of newActivities) {
      let foundExistingActivity: Activity | null = null;

      // If newActivity lacks uuid, identify by name
      if (!newActivity.uuid) {
        if (this._activityByName.hasOwnProperty(newActivity.name)) {
          foundExistingActivity = this._activityByName[newActivity.name];
        }
      } else {
        // Identify by uuid
        if (this._activityByUuid.hasOwnProperty(newActivity.uuid)) {
          foundExistingActivity = this._activityByUuid[newActivity.uuid];
        } else {
          // The uuid is new, but verify that the name does not exist (i.e. double uuids)
          if (this._activityByName.hasOwnProperty(newActivity.name)) {
            errors.push(
              `The activity '${newActivity.name}' exists with different uuids ` +            // eslint-disable-line
                `(${newActivity.uuid} and ${this._activityByName[newActivity.name].uuid})`   // eslint-disable-line
            );
          }
        }
      }

      if (foundExistingActivity == null) {
        this.addActivity(newActivity, existingData);
      } else {
        this.updateActivity(newActivity, foundExistingActivity);
      }
    }
  }

  addActivity(newActivity: Activity, existingData: Activity[]) {
    this._activityByName[newActivity.name] = newActivity;
    this._activityByUuid[newActivity.uuid] = newActivity;

    existingData.push(newActivity);
  }

  updateActivity(newActivity: Activity, existingActivity: Activity) {
    if (newActivity.name != existingActivity.name)
      this._activityByName[newActivity.name] = existingActivity;
    if (newActivity.uuid != existingActivity.uuid)
      this._activityByUuid[newActivity.uuid] = existingActivity;

    Object.assign(existingActivity, newActivity);
  }
}
