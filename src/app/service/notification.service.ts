import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import {
  ModalMessageComponent,
  DialogInfo,
} from '../component/modal-message/modal-message.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageSubject = new Subject<{ title: string; message: string; error: any }>();
  message$ = this.messageSubject.asObservable();

  constructor(private dialog: MatDialog) {}

  notify(title: string, message: string, error: any = null) {
    this.messageSubject.next({ title, message, error });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-message';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = new DialogInfo(message, title);

    this.dialog.open(ModalMessageComponent, dialogConfig);
  }
}
