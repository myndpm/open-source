import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynFormComponent } from '@myndpm/dyn-forms';
import { actions, badges } from '../../constants/dyn-forms.links';

@Component({
  selector: 'app-form-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements AfterViewInit {
  // ref links
  actions = actions;
  badges = badges;

  form = new FormGroup({});

  @ViewChild(DynFormComponent, { static: true })
  dynForm: DynFormComponent;

  ngAfterViewInit(): void {
    this.form.patchValue({ choices: [1] });
    // logs each change in the console just to demo
    this.dynForm.valueChanges().subscribe(console.log);
  }
}
