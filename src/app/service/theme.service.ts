import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>('light');
  public readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  initTheme(): void {
    const saved = localStorage.getItem('theme') || 'light';
    this.setTheme(saved);
  }

  setTheme(theme: string): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);

    // Force this before other reads
    requestAnimationFrame(() => {
      this.themeSubject.next(theme);
      localStorage.setItem('theme', theme);
    });
  }

  getTheme(): string {
    return this.themeSubject.value;
  }
}
