import { HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatChip } from '@angular/material/chips';

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
      providers: [
        HttpClientTestingModule,
        { provide: ModalMessageComponent, useValue: {} },
        { provide: LoaderService, useValue: mockLoaderService },
      ],
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [TeamsComponent, MatChip],
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
