import { Inject, Injectable } from '@angular/core';
import { DynControlProvider } from './control-provider.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DYN_CONTROLS_TOKEN } from './form.tokens';

@Injectable()
export class DynFormRegistry {
  constructor(
    @Inject(DYN_CONTROLS_TOKEN) private readonly controls: DynControlProvider[]
  ) {}

  get(dynControl: DynControlType): DynControlProvider {
    const provided = this.controls.find(({ control }) => dynControl === control);

    if (!provided) {
      throw new Error(`Control '${dynControl}' not provided!`);
    }

    return provided;
  }

  getInstanceFor(dynControl: DynControlType): DynInstanceType {
    return this.get(dynControl).instance;
  }
}
