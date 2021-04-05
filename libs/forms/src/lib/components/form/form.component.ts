import { ChangeDetectionStrategy, Component, Inject, INJECTOR, Injector, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynControlConfig, DynControlContext, DYN_CONTEXT_DEFAULTS } from '@myndpm/dyn-forms/core';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  @Input() form = new FormGroup({});
  @Input() config!: DynFormConfig;
  @Input() context?: DynControlContext;

  injector?: Injector;

  constructor(@Inject(INJECTOR) private parent: Injector) {}

  ngOnInit() {
    this.injector = Injector.create({
      providers: [
        {
          provide: DYN_CONTEXT_DEFAULTS,
          useValue: this.getContextDefaults(),
        },
      ],
      parent: this.parent
    });
  }

  getContextDefaults(): Map<DynControlContext, DynControlConfig> {
    // TODO map this.config.contexts
    return new Map([]);
  }
}
