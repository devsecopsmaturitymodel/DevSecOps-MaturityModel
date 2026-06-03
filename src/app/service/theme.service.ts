import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  private readonly defaultTheme: AppTheme = 'light';

  readonly theme = signal<AppTheme>(this.defaultTheme);
  readonly theme$ = toObservable(this.theme);

  constructor() {}

  initTheme(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const theme: AppTheme = stored === 'dark' ? 'dark' : this.defaultTheme;
    this.setTheme(theme);
  }

  setTheme(theme: AppTheme): void {
    if (this.theme() === theme) return;
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);

    localStorage.setItem(this.STORAGE_KEY, theme);
    this.theme.set(theme);
  }

  getTheme(): AppTheme {
    return this.theme();
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }
}
