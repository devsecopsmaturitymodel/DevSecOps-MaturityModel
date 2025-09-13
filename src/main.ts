const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.remove('light-theme', 'dark-theme');
document.body.classList.add(`${savedTheme}-theme`);
console.log('[main.ts] Theme set to:', savedTheme); //

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const localDevelopment: boolean = window.location.hostname == 'localhost';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
