import { TestBed } from '@angular/core/testing';
import { LoaderService } from './data-loader.service';
import { YamlService } from '../yaml-loader/yaml-loader.service';

describe('DataLoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService, YamlService],
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
