import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-form-stepper-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperSummaryComponent {}
