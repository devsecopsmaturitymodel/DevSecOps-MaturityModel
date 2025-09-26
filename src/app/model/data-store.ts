import { ActivityStore } from './activity-store';
import { Progress } from './types';
import { MetaStore, MetaStrings } from './meta-store';
import { ProgressStore } from './progress-store';

export class DataStore {
  public meta: MetaStore | null = null;
  public activityStore: ActivityStore | null = null;
  public progressStore: ProgressStore | null = null;

  constructor() {
    this.meta = new MetaStore();
    this.activityStore = new ActivityStore();
    this.progressStore = new ProgressStore();
  }

  public addActivities(activities: ActivityStore): void {
    this.activityStore = activities;
  }
  public addProgressData(progress: Progress): void {
    this.progressStore?.addProgressData(progress);
  }

  public getMetaStrings(): MetaStrings {
    if (this.meta == null) {
      throw Error('Meta yaml has not yet been loaded successfully');
    }

    let lang: string = this.meta.lang || 'en';
    if (!this.meta.strings?.hasOwnProperty(lang)) {
      // Requested lang does not exist. Fall back to first available lang
      let availableLangs: string[] = Object.keys(this.meta?.strings || {});
      if (availableLangs.length > 0) {
        lang = availableLangs[0];
        this.meta.lang = lang;
      }
    }
    return this.meta?.strings?.[lang];
  }

  public getMetaString(name: keyof MetaStrings, index: number = 0): string {
    let meta: MetaStrings = this.getMetaStrings();
    if (meta === undefined) {
      throw Error('Meta strings not loaded');
    }
    if (!meta.hasOwnProperty(name)) {
      throw Error(`Meta string '${name}' not found in meta.yaml`);
    }
    if (Array.isArray(meta[name])) {
      if (index < 0 || index >= meta[name].length) {
        return index.toString();
      }
      return meta[name][index];
    } else if (typeof meta[name] === 'string') {
      return meta[name] as string;
    }
    throw Error(`Meta string '${name}' is not a string or array in meta.yaml`);
  }

  public getMaxLevel(): number {
    return this.activityStore?.getMaxLevel() || 0;
  }

  public getLevels(): string[] {
    let maxLvl: number = this.getMaxLevel();
    return this.getMetaStrings()?.maturityLevels?.slice(0, maxLvl) || [];
  }
}
