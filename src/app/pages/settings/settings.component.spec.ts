import type { MockedObject } from 'vitest';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../service/settings/settings.service';
import { LoaderService } from '../../service/loader/data-loader.service';
import { MockLoaderService } from '../../service/loader/mock-data-loader.service';
import { Data } from 'src/app/model/activity-store';
import { ModalMessageComponent } from 'src/app/component/modal-message/modal-message.component';

let mockLoaderService: MockLoaderService;
const MOCK_DATA = {
  'Build and Deployment': {
    'Deployment Process': {
      'Automated Deployment': {
        uuid: 'test-uuid-1',
        level: 5,
        name: 'Automated Deployment',
      },
    },
  },
};

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: Pick<
    MockedObject<SettingsService>,
    'getMaxLevel' | 'setMaxLevel' | 'getDateFormat' | 'setDateFormat'
  >;
  let modalComponent: Pick<MockedObject<ModalMessageComponent>, 'openDialog'>;
  mockLoaderService = new MockLoaderService(MOCK_DATA as unknown as Data);

  beforeEach(async () => {
    await mockLoaderService.load();
    settingsService = {
      getMaxLevel: vi.fn().mockName('SettingsService.getMaxLevel'),
      setMaxLevel: vi.fn().mockName('SettingsService.setMaxLevel'),
      getDateFormat: vi.fn().mockName('SettingsService.getDateFormat'),
      setDateFormat: vi.fn().mockName('SettingsService.setDateFormat'),
    };
    modalComponent = {
      openDialog: vi.fn().mockName('ModalMessageComponent.openDialog'),
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
      ],
      declarations: [SettingsComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: SettingsService, useValue: settingsService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: ModalMessageComponent, useValue: modalComponent },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update max level settings correctly', () => {
    component.onMaxLevelChange(3);

    expect(component.selectedMaxLevel).toBe(3);
    expect(settingsService.setMaxLevel).toHaveBeenCalledWith(3);
  });

  it('should handle max level reset to default', () => {
    component.onMaxLevelChange(5);

    expect(component.selectedMaxLevel).toBe(5);

    // Remove localStorage when settings' maxLevel is set to activity's maxLevel
    expect(settingsService.setMaxLevel).toHaveBeenCalledWith(null);
  });
});
