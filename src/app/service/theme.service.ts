import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly defaultTheme: AppTheme = 'light';

  private themeSubject = new BehaviorSubject<AppTheme>(this.defaultTheme);
  public readonly theme$ = this.themeSubject.asObservable();

  constructor() {}

  initTheme(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const theme: AppTheme = stored === 'dark' ? 'dark' : this.defaultTheme;
    this.setTheme(theme);
  }

  setTheme(theme: AppTheme): void {
    if (this.themeSubject.value === theme) return;
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);

    localStorage.setItem(this.STORAGE_KEY, theme);
    this.themeSubject.next(theme);
  }

  getTheme(): AppTheme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    this.setTheme(this.themeSubject.value === 'light' ? 'dark' : 'light');
  }
}
