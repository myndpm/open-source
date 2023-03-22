import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynFormComponent } from '@myndpm/dyn-forms';
import { actions, badges } from '../../constants/dyn-forms.links';
import { comboForm } from './combo.form';
import { ComboService } from './combo.service';

@Component({
  selector: 'app-form-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ComboService],
})
export class ComboComponent implements AfterViewInit, OnDestroy {
  // ref links
  badges = badges;
  actions = [
    {
      link: "https://github.com/myndpm/open-source/blob/master/apps/website/src/app/demos/submodules/dyn-forms/components/combo/combo.form.ts",
      icon: 'code',
      tooltip: 'See source code',
    },
    ...actions,
  ];

  // dyn-form inputs
  config = comboForm(this.comboService);
  form = new FormGroup({});
  mode = 'edit';

  @ViewChild(DynFormComponent, { static: true })
  dynForm: DynFormComponent;

  constructor(private comboService: ComboService) {}

  ngAfterViewInit(): void {
    // logs each change in the console just to demo
    this.dynForm.valueChanges().subscribe(console.log);

    // initial state of the form is `edit` mode
    this.dynForm.track('display');
  }

  ngOnDestroy(): void {
    console.clear();
  }

  toggleMode(): void {
    this.mode = (this.mode === 'edit') ? 'display' : 'edit';

    // reset previous interactions
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    console.warn('Submit', this.form.value);
    this.toggleMode();
  }

  onEdit(): void {
    this.dynForm.track('display');
    this.toggleMode();
  }

  onCancel(): void {
    this.dynForm.untrack('display');
    this.toggleMode();
  }
}
