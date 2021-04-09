import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { DynBaseConfig } from './config.types';

@Injectable()
// initialized by dyn-form, dyn-factory, dyn-group
// and the abstract DynControl* classes
export class DynFormNode {
  name?: string;

  get path(): string[] {
    return [
      ...(this.parent?.path ?? []),
      this.name ?? '',
    ].filter(Boolean);
  }

  get form(): AbstractControl {
    // the corresponding form could be lazy-filled
    const form = (this.container as FormGroupDirective).form;
    return this.name ? form.get(this.name) as AbstractControl : form;
  }

  constructor(
    public container: ControlContainer,
    // parent node should be set for all except the root
    @Optional() @SkipSelf() private parent?: DynFormNode,
  ) {}

  init(config: Partial<DynBaseConfig>): void {
    // throw error if the name is already set and different to the incoming one
    if (this.name !== undefined && this.name !== (config.name ?? '')) {
      console.error(
        `Control ${config.control} need to provide its own DynFormNode. `,
        `It is consuming the parent Node and that will cause unexpected effects.`
      );
      return;
    }

    // construct the path
    this.name = config.name ?? '';

    // TODO initialize control validators from name:args, on AfterViewInit?
  }
}
