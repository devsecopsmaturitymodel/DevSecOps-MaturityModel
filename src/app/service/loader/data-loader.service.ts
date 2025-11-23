import { Injectable } from '@angular/core';
import { perfNow } from 'src/app/util/util';
import { YamlService } from '../yaml-loader/yaml-loader.service';
import { MetaStore } from 'src/app/model/meta-store';
import { TeamProgressFile, Uuid } from 'src/app/model/types';
import {
  Activity,
  ActivityFile,
  ActivityFileMeta,
  ActivityStore,
  Data,
} from 'src/app/model/activity-store';
import { DataStore } from 'src/app/model/data-store';

export class DataValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private META_FILE: string = 'assets/YAML/meta.yaml';
  private debug: boolean = false;
  private dataStore: DataStore | null = null;

  constructor(private yamlService: YamlService) {}

  get datastore(): DataStore | null {
    return this.dataStore;
  }

  public async load(): Promise<DataStore> {
    // Return cached data if available
    if (this.dataStore) {
      return this.dataStore;
    }

    // Initialize a new DataStore and load data
    this.dataStore = new DataStore();
    try {
      if (this.debug) console.log(`${perfNow()}: ----- Load Service Begin -----`);

      // Load meta.yaml first
      this.dataStore.meta = await this.loadMeta();
      this.dataStore.progressStore?.init(this.dataStore.meta.progressDefinition);

      // Then load activities
      this.dataStore.addActivities(await this.loadActivities(this.dataStore.meta));

      // Add a activity name lookup table for the progress store
      let activityMap: Record<Uuid, string> = {};
      this.dataStore.activityStore?.getAllActivities().forEach((activity: Activity) => {
        activityMap[activity.uuid] = activity.name;
      });
      this.dataStore.progressStore?.setActivityMap(activityMap);

      // Load the progress for each team's activities
      let teamProgress: TeamProgressFile = await this.loadTeamProgress(this.dataStore.meta);
      this.dataStore.addProgressData(teamProgress.progress);
      let browserProgress: TeamProgressFile | null =
        this.dataStore.progressStore?.retrieveStoredTeamProgress() || null;
      if (browserProgress != null) {
        this.dataStore.addProgressData(browserProgress?.progress);
      }

      // TODO: Load old yaml format (generated.yaml)
      // TODO: Load old yaml format (localStorage)
      console.log(`${perfNow()}: YAML: All YAML files loaded`);

      return this.dataStore;
    } catch (err) {
      throw err;
    }
  }

  private async loadMeta(): Promise<MetaStore> {
    if (this.debug) {
      console.log(`${perfNow()}: Load meta: ${this.META_FILE}`);
    }
    const meta: MetaStore = new MetaStore();
    meta.init(await this.yamlService.loadYamlWithReferencesResolved(this.META_FILE));
    meta.loadTeamsAndGroups();

    if (!meta.activityFiles) {
      throw Error("The meta.yaml has no 'activityFiles' to be loaded");
    }
    if (!meta.teamProgressFile) {
      throw Error("The meta.yaml has no 'teamProgressFile' to be loaded");
    }

    // Recalculate percentages of progress definition
    this.recalculateProgressDefinition(meta);

    // Remove group teams not specified
    Object.keys(meta.teamGroups).forEach(group => {
      meta.teamGroups[group] = meta.teamGroups[group].filter(team => meta.teams.includes(team));
    });

    // Resolve paths relative to meta.yaml
    meta.teamProgressFile = this.yamlService.makeFullPath(meta.teamProgressFile, this.META_FILE);
    meta.activityFiles = meta.activityFiles.map(file =>
      this.yamlService.makeFullPath(file, this.META_FILE)
    );

    if (this.debug) console.log(`${perfNow()} s: meta loaded`);
    console.log(`${perfNow()} s: Loaded teams: ${meta.teams.join(', ')}`);
    return meta;
  }

  private async loadTeamProgress(meta: MetaStore): Promise<TeamProgressFile> {
    if (this.debug) console.log(`${perfNow()}s: Loading Team Progress: ${meta.teamProgressFile}`);
    return this.yamlService.loadYaml(meta.teamProgressFile);
  }

  private async loadActivities(meta: MetaStore): Promise<ActivityStore> {
    const activityStore = new ActivityStore();
    const errors: string[] = [];
    let usingHistoricYamlFile = false;

    for (let filename of meta.activityFiles) {
      if (this.debug) console.log(`${perfNow()}s: Loading activity file: ${filename}`);
      usingHistoricYamlFile ||= filename.endsWith('generated/generated.yaml');

      const response: ActivityFile = await this.loadActivityFile(filename);

      activityStore.addActivityFile(response.data, errors);
      if (response.meta) {
        let loadedDsommVersion: string | null = response.meta.getDsommVersion();
        let existingDsommVersion: string | null = meta?.activityMeta?.getDsommVersion() || null;
        if (loadedDsommVersion) {
          if (!existingDsommVersion || loadedDsommVersion > existingDsommVersion) {
            meta.activityMeta = response.meta;
          }
        }
      }

      // Handle validation errors
      if (errors.length > 0) {
        errors.forEach(error => console.error(error));

        // Only throw for non-generated files (backwards compatibility)
        if (!usingHistoricYamlFile) {
          throw new DataValidationError(
            'Data validation error after loading: ' +
              filename +
              '\n\n----\n\n' +
              errors.join('\n\n')
          );
        }
      }
    }
    return activityStore;
  }

  private async loadActivityFile(filename: string): Promise<ActivityFile> {
    const multipleDocs: boolean = true;
    let docs: any[] = await this.yamlService.loadYaml(filename, multipleDocs);

    if (Array.isArray(docs)) {
      if (docs?.length == 1) {
        return {
          meta: null,
          data: docs[0] as Data,
        };
      } else if (docs?.length == 2 && docs[0]?.meta && docs[1]) {
        return {
          meta: new ActivityFileMeta(docs[0]?.meta),
          data: docs[1] as Data,
        };
      }
    }
    throw new Error(`The activity file '${filename}' is expected to contain dimension and activities, with an optional meta document at the start.`); // eslint-disable-line
  }

  public forceReload(): Promise<DataStore> {
    return this.load();
  }

  private recalculateProgressDefinition(meta: MetaStore) {
    let errors: string[] = [];

    for (let state of Object.keys(meta.progressDefinition)) {
      let progressDef = meta.progressDefinition[state];
      let value: string | number = progressDef.score;

      if (typeof value === 'string') {
        let isPercentage: boolean = (value as string).includes('%');
        value = parseFloat(value);
        if (isPercentage) {
          value = value / 100;
        }
        if (value > 1 || value < 0) {
          errors.push(`The progress value for '${state}' must be between 0% and 100%`);
          continue;
        }
        progressDef.score = value;
      }
    }

    const values = Object.values(meta.progressDefinition).map(def => def.score);
    if (Math.min(...values) !== 0) {
      errors.push(`The meta.progressDefinition must specify a name for 0% completed`);
    }
    if (Math.max(...values) !== 1) {
      errors.push(`The meta.progressDefinition must specify a name for 100% completed`);
    }

    if (errors.length > 0) {
      throw new DataValidationError(
        'Data validation error for progress definition in meta.yaml: \n\n- ' + errors.join('\n- ')
      );
    }
  }
}
