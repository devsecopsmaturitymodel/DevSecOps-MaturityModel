// Create mock LoaderService
import { F } from '@angular/cdk/keycodes';
import { Data } from 'src/app/model/activity-store';
import { DataStore } from 'src/app/model/data-store';
import { MetaStore } from 'src/app/model/meta-store';

/* eslint-disable */
const FALLBACK_MOCK_META: any = {
  progressDefinition: {
    NOT_STARTED: 0.00,
    IN_PROGRESS: 0.40,
    COMPLETED: 1.00
  },
  teams: ['Team A', 'Team B', 'Team C'],
  teamGroups: { AB: ['Team A', 'Team B'] },
}
/* eslint-enable */

export class MockLoaderService {
  private MOCK_DATA: Data;
  private dataStore: DataStore | null = null;

  constructor(MOCK_DATA: Data) {
    this.MOCK_DATA = MOCK_DATA;
  }

  load() {
    console.log('MOCK loader service');
    let errors: string[] = [];
    this.dataStore = new DataStore();
    this.dataStore?.meta?.addMeta(FALLBACK_MOCK_META);
    this.dataStore?.activityStore?.addActivityFile(this.MOCK_DATA, errors);
    console.log('MOCK dataStore:', this.dataStore);
    return Promise.resolve(this.dataStore);
  }
  getLevels() {
    return ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
  }
}
