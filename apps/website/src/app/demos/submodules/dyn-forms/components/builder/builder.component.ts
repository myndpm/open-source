import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynFormComponent } from '@myndpm/dyn-forms';
import { actions, badges } from '../../constants/dyn-forms.links';
import { buildConfig } from './builder.form';

@Component({
  selector: 'app-form-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BuilderComponent implements AfterViewInit, OnDestroy {
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

  // dyn-form inputs
  config = buildConfig();
  form = new FormGroup({});
  mode = 'edit';

  @ViewChild(DynFormComponent, { static: true })
  dynForm: DynFormComponent;

  ngAfterViewInit(): void {
    // logs each change in the console just to demo
    this.dynForm.valueChanges().subscribe(console.log);
  }

  ngOnDestroy(): void {
    console.clear();
  }

  toggleMode(): void {
    this.mode = (this.mode === 'edit') ? 'display' : 'edit';
  }
}
