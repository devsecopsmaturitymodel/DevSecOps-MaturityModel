const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.remove('light-theme', 'dark-theme');
document.body.classList.add(`${savedTheme}-theme`);
console.log('[main.ts] Theme set to:', savedTheme); //

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModalMessageComponent } from './app/component/modal-message/modal-message.component';
import { LoaderService } from './app/service/loader/data-loader.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      MatDialogModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatMenuModule,
      MatSidenavModule,
      MatIconModule,
      MatButtonModule,
      FormsModule,
      MatTooltipModule
    ),
    LoaderService,
    ModalMessageComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: { close: (dialogResult: any) => {} } },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch(err => console.error(err));
