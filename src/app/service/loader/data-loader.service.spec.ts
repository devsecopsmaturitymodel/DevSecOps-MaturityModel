import { TestBed } from '@angular/core/testing';
import { LoaderService } from './data-loader.service';
import { YamlService } from '../yaml-loader/yaml-loader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('DataLoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [LoaderService, YamlService],
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
