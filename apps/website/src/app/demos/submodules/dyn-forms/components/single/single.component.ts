import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DynFormComponent } from '@myndpm/dyn-forms';
import { actions, badges } from '../../constants/dyn-forms.links';
import { singleForm } from './single.form';

@Component({
  selector: 'app-form-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SingleComponent implements OnDestroy {
  // ref links
  badges = badges;
  actions = [
    {
      link: "https://github.com/myndpm/open-source/blob/master/apps/website/src/app/demos/submodules/dyn-forms/components/single/single.form.ts",
      icon: 'code',
      tooltip: 'See source code',
    },
    ...actions,
  ];

  // dyn-form inputs
  config = singleForm();
  form = new UntypedFormGroup({});
  mode = 'form';

  @ViewChild(DynFormComponent, { static: true })
  dynForm: DynFormComponent;

  ngOnDestroy(): void {
    console.clear();
  }

  onSubscribe(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    console.warn('Subscribe', this.form.value);
    this.mode = 'success';
  }
}
