import { MatDialogConfig } from '@angular/material/dialog';

export type DialogSize = 'sm' | 'md' | 'lg';

const DIALOG_WIDTHS: Record<DialogSize, string> = {
  sm: '480px',
  md: '640px',
  lg: '90vw',
};

export function dialogSizeConfig(size: DialogSize): Partial<MatDialogConfig> {
  return {
    width: DIALOG_WIDTHS[size],
    maxWidth: size === 'lg' ? '90vw' : '80vw',
    maxHeight: '90vh',
  };
}
