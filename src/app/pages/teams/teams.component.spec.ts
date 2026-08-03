import {
  HttpHandler,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TeamsComponent } from './teams.component';
import { ModalMessageComponent } from 'src/app/component/modal-message/modal-message.component';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { MockLoaderService } from 'src/app/service/loader/mock-data-loader.service';
import { DataStore } from 'src/app/model/data-store';
import { isEmptyObj, perfNow } from 'src/app/util/util';

let mockLoaderService: MockLoaderService;

describe('TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;
  let mockDataStore: DataStore;
  mockLoaderService = new MockLoaderService({});

  beforeEach(async () => {
    // Pre-load data BEFORE component creation to avoid async NG0100
    mockDataStore = (await mockLoaderService.load()) as DataStore;

    /* eslint-disable */
    await TestBed.configureTestingModule({
      imports: [TeamsComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: ModalMessageComponent, useValue: {} },
        { provide: LoaderService, useValue: mockLoaderService },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
      ],
    }).compileComponents();
    /* eslint-enable */
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
    // Set data synchronously BEFORE first change detection
    component.setYamlData(mockDataStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check loading teams', () => {
    expect(component.teams()).toContain('Team A');
    expect(component.teams()).toContain('Team B');
    expect(component.teamGroups()?.['AB']).toBeDefined();
  });
});
