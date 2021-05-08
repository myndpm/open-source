import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynFormComponent, DynFormConfig } from '@myndpm/dyn-forms';
import { Observable, Subject, merge } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { actions, badges } from '../../constants/dyn-forms.links';
import { buildConfig, unitConfig } from './builder.form';
import { MyndUnitType } from './business.types';

@Component({
  selector: 'app-form-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  // ref links
  badges = badges;
  actions = [
    {
      link: "https://github.com/myndpm/open-source/blob/master/apps/website/src/app/demos/submodules/dyn-forms/components/builder/builder.form.ts",
      icon: 'code',
      tooltip: 'See source code',
    },
    ...actions,
  ];

  // unit state
  unit = new FormGroup({ unitType: new FormControl(MyndUnitType.Normal) });
  unitConfig = unitConfig;

  // dyn-form inputs
  config$: Observable<DynFormConfig>;
  form = new FormGroup({});
  mode = 'edit';

  @ViewChildren(DynFormComponent)
  dynForms: QueryList<DynFormComponent>;

  private _unsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.config$ = merge(
      this.unit.valueChanges.pipe(startWith(this.unit.value)),
    ).pipe(
      takeUntil(this._unsubscribe),
      map(() => buildConfig(this.unit.value))
    );
  }

  ngAfterViewInit(): void {
    // logs each change in the console just to demo
    this.dynForms.forEach(
      dynForm => dynForm.valueChanges().subscribe(console.log),
    );
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();

    console.clear();
  }

  toggleMode(): void {
    this.mode = (this.mode === 'edit') ? 'display' : 'edit';
  }
}
