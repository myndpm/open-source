import { Inject, Injectable } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynControlProvider } from './control-provider.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DYN_CONTROLS_TOKEN } from './form.tokens';

@Injectable()
export class DynFormRegistry {
  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_CONTROLS_TOKEN) private readonly controls: DynControlProvider[],
  ) {}

  get(dynControl: DynControlType): DynControlProvider {
    const provided = this.controls.find(({ control }) => dynControl === control);

    if (!provided) {
      const error = this.logger.providerNotFound('Control', dynControl);
      console.error(error.message);
      throw error;
    }

    return provided;
  }

  getInstanceFor(dynControl: DynControlType): DynInstanceType {
    return this.get(dynControl).instance;
  }
}
