import { Inject, Injectable } from '@angular/core';
import { ControlProvider, InjectedControl, isLazyControl } from './control-provider.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DYN_CONTROLS_TOKEN } from './form.tokens';

@Injectable()
export class DynFormRegistry {
  constructor(
    @Inject(DYN_CONTROLS_TOKEN) private readonly controls: ControlProvider[]
  ) {}

  get(dynControl: DynControlType): ControlProvider {
    const provided = this.controls.find(({ control }) => dynControl === control);

    if (!provided) {
      throw new Error(`Control '${dynControl}' not provided!`);
    }

    return provided;
  }

  resolve(dynControl: DynControlType): InjectedControl {
    const resolved = this.get(dynControl);

    if (isLazyControl(resolved)) {
      // TODO dynamically load provider.component with useFactory
    }

    return {
      control: resolved.control,
      instance: resolved.instance,
      component: resolved.component!,
    };
  }

  getInstanceFor(dynControl: DynControlType): DynInstanceType {
    return this.get(dynControl).instance;
  }
}
