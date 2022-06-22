import { TestBed } from '@angular/core/testing';

import { ymlService } from './yaml-parser.service';

describe('YAMLParserService', () => {
  let service: ymlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ymlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
