import { ChangeDetectionStrategy, Component } from '@angular/core';
import { step1Form } from '../stepper.form';

@Component({
  selector: 'app-form-stepper-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperStep1Component {
  config = step1Form();
}
