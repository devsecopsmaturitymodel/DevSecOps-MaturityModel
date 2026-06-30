import { HttpHandler, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
    imports: [NoopAnimationsModule, TeamsComponent],
    providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: ModalMessageComponent, useValue: {} },
        { provide: LoaderService, useValue: mockLoaderService },
        provideHttpClient(withInterceptorsFromDi()),
    ]
}).compileComponents();
    /* eslint-enable */
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
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
