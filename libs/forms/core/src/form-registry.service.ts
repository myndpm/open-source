import { Inject, Injectable } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynControlId } from './types/control.types';
import { DynInstanceType } from './types/forms.types';
import { DynControlProvider } from './dyn-control.class';
import { DYN_CONTROLS_TOKEN } from './form.tokens';

@Injectable()
export class DynFormRegistry {
  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_CONTROLS_TOKEN) private readonly controls: DynControlProvider[],
  ) {}

  get(dynControl: DynControlId): DynControlProvider {
    const provided = this.controls.find(({ control }) => dynControl === control);

    if (!provided) {
      const error = this.logger.providerNotFound('Control', dynControl);
      console.error(error.message);
      throw error;
    }

    return provided;
  }

  getInstanceFor(dynControl: DynControlId): DynInstanceType {
    return this.get(dynControl).instance;
  }
}
