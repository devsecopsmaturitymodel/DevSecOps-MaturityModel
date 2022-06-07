import { TestBed } from '@angular/core/testing';

import { YAMLParserService } from './yaml-parser.service';

describe('YAMLParserService', () => {
  let service: YAMLParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YAMLParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
