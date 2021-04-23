import { ChangeDetectionStrategy, Component } from '@angular/core';
import { step2Form } from '../stepper.form';

@Component({
  selector: 'app-form-stepper-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperStep2Component {
  config = step2Form();
}
