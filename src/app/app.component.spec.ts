import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeService } from './service/theme.service';
import { TitleService } from './service/title.service';

class MockThemeService {
  theme = signal<string>('light');
  initTheme() {}
  getTheme() {
    return this.theme();
  }
  setTheme(theme: string) {
    this.theme.set(theme);
  }
  toggleTheme() {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }
}

class MockTitleService {
  titleInfo = signal<{ dimension?: string; level?: number } | null>({
    dimension: 'Test Title',
    level: 1,
  });
}

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        AppComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useClass: MockThemeService },
        { provide: TitleService, useClass: MockTitleService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});
