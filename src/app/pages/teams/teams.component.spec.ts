import { HttpHandler, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TeamsComponent } from './teams.component';
import { ModalMessageComponent } from 'src/app/component/modal-message/modal-message.component';
import { LoaderService } from 'src/app/service/loader/data-loader.service';
import { MockLoaderService } from 'src/app/service/loader/mock-data-loader.service';
import { isEmptyObj, perfNow } from 'src/app/util/util';

let mockLoaderService: MockLoaderService;

describe('TeamsComponent', () => {
  let component: TeamsComponent;
  let fixture: ComponentFixture<TeamsComponent>;
  mockLoaderService = new MockLoaderService({});

  beforeEach(async () => {
    /* eslint-disable */
    // await mockLoaderService.load();
    await TestBed.configureTestingModule({
    declarations: [TeamsComponent],
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
        { provide: ModalMessageComponent, useValue: {} },
        { provide: LoaderService, useValue: mockLoaderService },
        provideHttpClient(withInterceptorsFromDi()),
    ],
    schemas: [NO_ERRORS_SCHEMA],
}).compileComponents();
    /* eslint-enable */
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check loading teams', () => {
    expect(component.teams).toContain('Team A');
    expect(component.teams).toContain('Team B');
    expect(component.teamGroups?.['AB']).toBeDefined();
  });
});
