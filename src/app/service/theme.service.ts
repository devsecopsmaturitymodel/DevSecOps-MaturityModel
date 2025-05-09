import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('light');
  public readonly theme$ = this.themeSubject.asObservable();

  constructor() {}

  initTheme(): void {
    const saved = localStorage.getItem('theme') || 'light';
    this.setTheme(saved);
  }

  setTheme(theme: string): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
  }

  getTheme(): string {
    return this.themeSubject.value;
  }
}
