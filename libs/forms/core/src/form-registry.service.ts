import { Inject, Injectable } from '@angular/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynControlId } from './types/control.types';
import { DynInstanceType } from './types/forms.types';
import { DynWrapperId } from './types/wrapper.types';
import { DynControlProvider } from './dyn-control.class';
import { DynWrapperProvider } from './dyn-control-wrapper.class';
import { DYN_CONTROLS_TOKEN, DYN_WRAPPERS_TOKEN } from './form.tokens';

@Injectable()
export class DynFormRegistry {
  constructor(
    private readonly logger: DynLogger,
    @Inject(DYN_CONTROLS_TOKEN) private readonly controls: DynControlProvider[],
    @Inject(DYN_WRAPPERS_TOKEN) private readonly wrappers: DynWrapperProvider[],
  ) {}

  getControl(dynControl: DynControlId): DynControlProvider {
    const provided = this.controls.find(({ control }) => dynControl === control);

    if (!provided) {
      const error = this.logger.providerNotFound('Control', dynControl);
      console.error(error.message);
      throw error;
    }

    return provided;
  }

  getInstanceFor(dynControl: DynControlId): DynInstanceType {
    return this.getControl(dynControl).instance;
  }

  getWrapper(dynWrapper: DynWrapperId): DynWrapperProvider {
    const provided = this.wrappers.find(({ wrapper }) => dynWrapper === wrapper);

    if (!provided) {
      const error = this.logger.providerNotFound('Wrapper', dynWrapper);
      console.error(error.message);
      throw error;
    }

    return provided;
  }
}
