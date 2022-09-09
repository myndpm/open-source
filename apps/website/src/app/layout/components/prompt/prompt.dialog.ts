import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PromptDialogData } from './prompt-data.interface';

@Component({
  selector: 'app-prompt',
  templateUrl: 'prompt.dialog.html',
  styleUrls: ['./prompt.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class PromptDialog {
  title = '';
  content = '';

  constructor(
    public dialogRef: MatDialogRef<PromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData
  ) {
    this.data = {
      no: 'No',
      yes: 'Yes',
      color: 'accent',
      ...data
    };
  }
}
