import { vi } from 'vitest';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GithubService } from 'src/app/service/settings/github.service';

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
  let settingsService: {
    getMaxLevel: ReturnType<typeof vi.fn>;
    setMaxLevel: ReturnType<typeof vi.fn>;
    getDateFormat: ReturnType<typeof vi.fn>;
    setDateFormat: ReturnType<typeof vi.fn>;
  };
  let modalComponent: {
    openDialog: ReturnType<typeof vi.fn>;
  };
  mockLoaderService = new MockLoaderService(MOCK_DATA as unknown as Data);

  beforeEach(async () => {
    await mockLoaderService.load();
    settingsService = {
      getMaxLevel: vi.fn(),
      setMaxLevel: vi.fn(),
      getDateFormat: vi.fn(),
      setDateFormat: vi.fn(),
    };
    modalComponent = {
      openDialog: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        SettingsComponent,
      ],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: SettingsService, useValue: settingsService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: ModalMessageComponent, useValue: modalComponent },
        {
          provide: GithubService,
          useValue: { getLatestRelease: vi.fn() },
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    component.meta.set({
      activityMeta: null,
      activityFiles: [],
      progressDefinition: {},
      saveProgressDefinition: vi.fn(),
    } as any);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update max level settings correctly', () => {
    component.onMaxLevelChange(3);

    expect(component.selectedMaxLevel()).toBe(3);
    expect(settingsService.setMaxLevel).toHaveBeenCalledWith(3);
  });

  it('should handle max level reset to default', () => {
    component.onMaxLevelChange(5);

    expect(component.selectedMaxLevel()).toBe(5);

    // Remove localStorage when settings' maxLevel is set to activity's maxLevel
    expect(settingsService.setMaxLevel).toHaveBeenCalledWith(null);
  });
});
