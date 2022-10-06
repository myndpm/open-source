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
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { actions, badges } from '../../constants/dyn-forms.links';
import { simpleData, simpleForm } from './simple.form';

@Component({
  selector: 'app-form-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.scss'],
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

  // reactive parameters for the form config
  profileCard$ = new BehaviorSubject({
    title: 'Billing Address',
    subtitle: 'Please fill the required fields',
  });
  addItem$ = new Subject<{ userAction?: boolean }>();
  itemAdded$ = new Subject<any>();
  itemEdited$ = new Subject<any>();
  itemRemoved$ = new Subject<any>();
  onDestroy$ = new Subject<void>();

  // dyn-form inputs
  config = simpleForm(this.profileCard$, this.addItem$, this.itemAdded$, this.itemEdited$, this.itemRemoved$);
  form = new FormGroup({});
  mode = 'edit';

  @ViewChild(DynFormComponent, { static: true })
  dynForm: DynFormComponent;

  ngAfterViewInit(): void {
    // logs each change in the console just to demo
    this.dynForm.valueChanges().subscribe(console.log);

    // simple example of how we can trigger changes into the params
    const group = this.form.get('billing') as FormGroup;
    group.statusChanges
      .pipe(startWith(group.status), distinctUntilChanged())
      .subscribe((status) => {
        this.profileCard$.next({
          title: 'Billing Address',
          subtitle: status === 'INVALID'
            ? 'Please fill your Personal Information'
            : 'Billing information complete',
        });
      });

    // listen event observers
    this.itemAdded$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((payload) => console.log('Item Added:', payload))
    this.itemEdited$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((payload) => console.log('Item Edited:', payload))
    this.itemRemoved$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((payload) => console.log('Item Deleted:', payload))

    // initial state of the form is `edit` mode
    this.dynForm.track('display');
  }

  ngOnDestroy(): void {
    console.clear();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadData(): void {
    // we can load data AfterViewInit
    this.dynForm.patchValue(simpleData);
  }

  toggleMode(): void {
    this.mode = (this.mode === 'edit') ? 'display' : 'edit';

    // reset previous interactions
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  addProduct(): void {
    this.addItem$.next({ userAction: true });
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
