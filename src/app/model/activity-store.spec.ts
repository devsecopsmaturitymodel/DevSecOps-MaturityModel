import { TestBed } from '@angular/core/testing';
import { ActivityStore, Data, Activity } from './activity-store';
import { deepCopy } from '../util/util';

describe('ActivityStore', () => {
  let store: ActivityStore;
  let errors: string[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityStore],
    });
    store = TestBed.inject(ActivityStore);
    errors = [];
  });

  afterEach(() => {
    if (errors.length > 0) {
      console.warn('--- Error messages: ---');
      for (let err of errors) console.log(err);
    }
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  // prettier-ignore
  it('load base yaml', () => {
    store.addActivityFile(baseYaml, errors);

    expect(errors).toHaveSize(0);
    expect(store.getAllDimensionNames()).toHaveSize(3);
    expect(store.getActivityByUuid('00000000-1111-1111-1111-000000000000')).toBeTruthy();
    expect(store.getActivityByUuid('00000000-1111-1111-1111-000000000000')?.name).toBe('Activity 111');
    expect(store.getActivityByName('Activity 111')?.level).toBe(1);
    expect(store.getActivityByName('Activity 121')?.uuid).toBe('00000000-1111-2222-1111-000000000000');
    expect(store.getActivities('Dimension 11', 1)).toHaveSize(2);
    expect(store.getActivities('Dimension 11', 1)?.map(a => a.name)).toContain('Activity 112');
  });

  // prettier-ignore
  it('override base yaml', () => {
    let yamlCopy: Data = deepCopy(baseYaml);

    store.addActivityFile(yamlCopy, errors);
    store.addActivityFile(extraYaml, errors);
    
    expect(errors).toHaveSize(0);
    expect(store.getAllDimensionNames()).toHaveSize(3);
    expect(store.getActivityByName('Activity 111')).toBeUndefined(); // Changed name, to:
    expect(store.getActivityByName('OVERRIDE 111')?.uuid).toBe('00000000-1111-1111-1111-000000000000');
    expect(store.getActivityByName('OVERRIDE 111')?.description.toString()).toBe('OVERRIDE DESC AND LEVEL');
    expect(store.getActivityByName('OVERRIDE 111')?.level).toBe(2);
    
    expect(store.getActivityByName('Activity 112')?.description.toString()).toBe('OVERRIDE: BASED ON NAME'); 
    expect(store.getActivityByName('Activity 121')).toBeUndefined(); // Ignored
    expect(store.getActivityByName('Activity 211')).toBeUndefined(); // Ignored    
    expect(store.getActivityByName('New Activity 311')).toBeTruthy();
  });

  // prettier-ignore
  it('produce error messages when loading a yaml', () =>  {
    let yamlCopy: Data = deepCopy(baseYaml);
    let activity111: Activity = yamlCopy['Category 1']['Dimension 11']['Activity 111'];
    let activity112: Activity = yamlCopy['Category 1']['Dimension 11']['Activity 112'];
    let activity121: Activity = yamlCopy['Category 1']['Dimension 12']['Activity 121'];
    
    // Add a Duplicate activity
    yamlCopy['Category 2']['Dimension 21']['Activity 111'] = activity111;
    
    // Duplicate an uuid
    yamlCopy['Category 2']['Dimension 21']['Activity 211'].uuid = activity111.uuid;
    
    // Duplicate an activity name (but not the uuid)
    yamlCopy['Category 2']['Dimension 21']['Activity 121'] = deepCopy(activity111);
    yamlCopy['Category 2']['Dimension 21']['Activity 121'].uuid = 'fake-uuid';
    
    
    store.addActivityFile(yamlCopy, errors);
    
    expectArrayContainSubstring(errors, "Duplicate activity '");    
    expectArrayContainSubstring(errors, 'Duplicate activity uuid');
    expectArrayContainSubstring(errors, 'Duplicate activity name');
    
    // If all errors have been handled, expect the remaining errors to be empty
    expect(errors).toHaveSize(0);
  });

  // prettier-ignore
  it('produce error messages when merging yaml', () =>  {
    let yamlCopy: Data = deepCopy(baseYaml);
    let extraCopy: Data = deepCopy(extraYaml);

    let activity111: Activity = yamlCopy['Category 1']['Dimension 11']['Activity 111'];
    // let activity112: Activity = yamlCopy['Category 1']['Dimension 11']['Activity 112'];

    // Duplicate an activity name (but not the uuid), in the yaml to merge
    extraCopy['Category 2']['Dimension 21']['Activity 121'] = deepCopy(activity111);
    extraCopy['Category 2']['Dimension 21']['Activity 121'].uuid = 'fake-uuid';

    store.addActivityFile(yamlCopy, errors);
    expect(errors).toHaveSize(0);
    store.addActivityFile(extraCopy, errors);

    expectArrayContainSubstring(errors, 'exists with different uuids');

    // If all errors have been handled, expect the remaining errors to be empty
    expect(errors).toHaveSize(0);
  });
});

function expectArrayContainSubstring(errors: string[], substr: string) {
  for (let i: number = 0; i < errors.length; i++) {
    let err = errors[i];
    if (err.includes(substr)) {
      console.log('Handling error: ' + errors[i]);
      expect(errors[i]).toContain(substr);
      errors.splice(i, 1);
      return;
    }
  }

  expect('errors').toContain(substr);
}

// -----------
//  Test data
// -----------
const baseYaml: any = {
  'Category 1': {
    'Dimension 11': {
      'Activity 111': {
        uuid: '00000000-1111-1111-1111-000000000000',
        level: 1,
        description: 'Description from base yaml',
      },
      'Activity 112': {
        uuid: '00000000-1111-1111-2222-000000000000',
        level: 1,
        description: 'Description from base yaml',
      },
    },
    'Dimension 12': {
      'Activity 121': {
        uuid: '00000000-1111-2222-1111-000000000000',
        level: 1,
        description: 'Description from base yaml',
      },
      'Activity 122': {
        uuid: '00000000-1111-2222-2222-000000000000',
        level: 1,
        description: 'Description from base yaml',
      },
    },
  },
  'Category 2': {
    'Dimension 21': {
      'Activity 211': {
        uuid: '00000000-2222-1111-1111-000000000000',
        level: 1,
        description: 'Description from base yaml',
      },
    },
  },
};

const extraYaml: any = {
  'Category 1': {
    'Dimension 11': {
      'OVERRIDE 111': {
        uuid: '00000000-1111-1111-1111-000000000000',
        level: 2,
        description: 'OVERRIDE DESC AND LEVEL',
      },
      'Activity 112': {
        description: 'OVERRIDE: BASED ON NAME',
      },
    },
    'Dimension 12': {
      'Activity 121': {
        ignore: true,
      },
    },
  },
  'Category 2': {
    'Dimension 21': {
      ignore: true,
    },
  },
  'Category 3': {
    'Dimension 31': {
      'New Activity 311': {
        uuid: '00000000-3333-1111-1111-000000000000',
        level: 3,
      },
    },
  },
};
