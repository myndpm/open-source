import { Directive } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import isCallable from 'is-callable';
import { DynControlHook } from './control-events.types';
import { DynFormNode } from './form-node.service';

@Directive()
export abstract class DynControlEvents<TControl extends AbstractControl> {

  node!: DynFormNode<TControl>; // corresponding node

  // propagate hook calls from the top to the bottom of the DynControls tree
  // note: concrete hooks will receive the parent data if they define no config.name
  callHook(event: DynControlHook): void {
    const method = (this as any)[`hook${event.hook}`];
    if (isCallable(method)) {
      method.bind(this)(event.payload);
    }

    // propagate to the childs
    this.callChildHooks(event);
  }

  // hook propagated to child DynControls
  // customized by special cases like FormArray
  callChildHooks({ hook, payload, plain }: DynControlHook): void {
    this.node.children.map(node => {
      const fieldName = node.name;
      node.callHook({
        hook,
        payload: !plain && fieldName && Object.prototype.hasOwnProperty.call(payload, fieldName)
          ? payload[fieldName]
          : payload,
        plain,
      });
    });
  }
}
