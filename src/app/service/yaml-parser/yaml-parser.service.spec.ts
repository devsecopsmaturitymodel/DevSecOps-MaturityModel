import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ymlService } from './yaml-parser.service';

describe('YAMLParserService', () => {
  let service: ymlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientTestingModule, ymlService, HttpClient, HttpHandler],
    });
    service = TestBed.inject(ymlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
