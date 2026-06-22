import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ModalMessageComponent,
  DialogInfo,
} from '../component/modal-message/modal-message.component';
import { dialogSizeConfig } from '../util/dialog-sizes';

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
    Object.assign(dialogConfig, dialogSizeConfig('md'));

    this.dialog.open(ModalMessageComponent, dialogConfig);
  }
}
