import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DynFormComponent } from '@myndpm/dyn-forms';
import { BehaviorSubject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { actions, badges } from '../../constants/dyn-forms.links';
import { simpleData, simpleForm } from './simple.form';

@Component({
  selector: 'app-form-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SimpleComponent implements AfterViewInit, OnDestroy {
  // ref links
  badges = badges;
  actions = [
    {
      link: "https://github.com/myndpm/open-source/blob/master/apps/website/src/app/demos/submodules/dyn-forms/components/simple/simple.form.ts",
      icon: 'code',
      tooltip: 'See source code',
    },
    ...actions,
  ];

  // reactive parameters for the billing CARD
  profileCard = new BehaviorSubject({
    title: 'Billing Address',
    subtitle: 'Please fill the required fields',
  });

  // dyn-form inputs
  config = simpleForm(this.profileCard);
  form = new FormGroup({});
  mode = 'edit';

  @ViewChild(DynFormComponent, { static: true })
  dynForm: DynFormComponent;

  ngAfterViewInit(): void {
    // logs each change in the console just to demo
    this.dynForm.valueChanges().subscribe(console.log);

    // simple example of how we can trigger changes into the params
    const group = this.form.get('billing') as FormGroup;
    group.statusChanges.pipe(startWith(group.status)).subscribe((status) => {
      this.profileCard.next({
        title: 'Billing Address',
        subtitle:
          status === 'INVALID'
            ? 'Please fill your Personal Information'
            : 'Billing information complete',
      });
    });
  }

  ngOnDestroy(): void {
    console.clear();
  }

  loadData(): void {
    // we can load data AfterViewInit
    this.dynForm.patchValue(simpleData);
  }

  toggleMode(): void {
    this.mode = (this.mode === 'edit') ? 'display' : 'edit';

    if (this.mode === 'display') {
      // reset invalid styles on display markAllAsPristine
      this.markAsUntouched(this.form);
    }
  }

  private markAsUntouched(group: FormGroup | FormArray): void {
    group.markAsUntouched();

    Object.keys(group.controls).map((field) => {
      const control = group.get(field);
      if (control instanceof FormControl) {
        control.markAsUntouched();
      } else if (control instanceof FormGroup) {
        this.markAsUntouched(control);
      }
    });
  }
}
