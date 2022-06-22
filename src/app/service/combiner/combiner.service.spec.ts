import { TestBed } from '@angular/core/testing';

import { CombinerService } from './combiner.service';

describe('CombinerService', () => {
  let service: CombinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombinerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
