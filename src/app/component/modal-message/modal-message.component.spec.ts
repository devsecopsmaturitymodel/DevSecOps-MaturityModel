import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogInfo, ModalMessageComponent } from './modal-message.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

describe('ModalMessageComponent', () => {
  let component: ModalMessageComponent;
  let fixture: ComponentFixture<ModalMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatDialogModule],
      declarations: [ModalMessageComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render markdown correctly in the dialog', () => {
    const dialogInfo: DialogInfo = new DialogInfo('A *test* _markdown_.');
    const dialogRef: MatDialogRef<ModalMessageComponent> = component.openDialog(dialogInfo);

    expect(dialogRef.componentInstance.data.message).toContain('<em>test</em>');
    expect(dialogRef.componentInstance.data.message).toContain('<em>markdown</em>');
  });

  it('should render markdown correctly in the dialog', () => {
    const dialogInfo: DialogInfo = new DialogInfo('A **test** markdown.');
    const dialogRef: MatDialogRef<ModalMessageComponent> = component.openDialog(dialogInfo);

    // Check if markdown rendering is applied
    expect(dialogRef.componentInstance.data.message).toContain('<strong>test</strong>');
  });
});
