import { Inject, Component, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import * as md from 'markdown-it';
import { MarkdownText } from 'src/app/model/markdown-text';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css'],
})
export class ModalMessageComponent implements OnInit {
  data: DialogInfo;
  markdown: md = md();

  DSOMM_host: string = 'https://github.com/devsecopsmaturitymodel';
  DSOMM_url: string = `${this.DSOMM_host}/DevSecOps-MaturityModel-data`;
  meassageTemplates: Record<string, DialogInfo> = {
    generated_yaml: new DialogInfo(
      `{message}\n\n` +
        `Please download the activity template \`generated.yaml\` ` +
        `from [DSOMM-data](${this.DSOMM_url}) on GitHub.\n\n` +
        'The DSOMM activities are maintained and distributed ' +
        'separately from the software.',
      'DSOMM startup problems'
    ),
  };

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalMessageComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogInfo,
    private notificationService: NotificationService
  ) {
    this.data = data;
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.notificationService.message$.subscribe(({ title, message }) => {
      this.openDialog(new DialogInfo(message, title));
    });
  }

  openDialog(dialogInfo: DialogInfo | string): MatDialogRef<ModalMessageComponent> {
    // Remove focus from the button that becomes aria unavailable (avoids ugly console error message)
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) buttonElement.blur();

    if (typeof dialogInfo === 'string') {
      dialogInfo = new DialogInfo(dialogInfo);
    }
    if (dialogInfo.template && this.meassageTemplates.hasOwnProperty(dialogInfo.template)) {
      let template: DialogInfo = this.meassageTemplates[dialogInfo.template];
      dialogInfo.title = dialogInfo.title || template?.title;
      dialogInfo.message = template?.message?.replace('{message}', dialogInfo.message);
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-message';
    dialogConfig.disableClose = true;
    dialogConfig.data = dialogInfo;
    dialogConfig.autoFocus = false;
    this.dialogRef = this.dialog.open(ModalMessageComponent, dialogConfig);
    return this.dialogRef;
  }

  closeDialog(buttonName: string) {
    this.dialogRef?.close(buttonName);
  }
}

export class DialogInfo {
  title: string = '';
  template: string | null = '';
  message: string = '';
  buttons: string[] = ['OK'];

  constructor(msg: string = '', title: string = '') {
    let md: MarkdownText = new MarkdownText(msg);
    this.message = md.render();
    this.title = title;
  }
}
