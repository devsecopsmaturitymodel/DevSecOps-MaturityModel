const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.remove('light-theme', 'dark-theme');
document.body.classList.add(`${savedTheme}-theme`);
console.log('[main.ts] Theme set to:', savedTheme); //

import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { LoaderService } from './app/service/loader/data-loader.service';
import { ModalMessageComponent } from './app/component/modal-message/modal-message.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatMenuModule,
      MatSidenavModule,
      FormsModule,
      MatTooltipModule
    ),
    LoaderService,
    ModalMessageComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: { close: (dialogResult: any) => {} } },
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch(err => console.error(err));
