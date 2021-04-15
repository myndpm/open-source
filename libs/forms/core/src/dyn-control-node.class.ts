import { Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import isCallable from 'is-callable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynControlHook } from './control-events.types';
import { DynFormTreeNode } from './form-tree-node.service';

@Directive()
export abstract class DynControlNode<TControl extends AbstractControl>
implements OnInit, OnDestroy {

  node!: DynFormTreeNode<TControl>; // corresponding node in the form hierarchy

  protected _unsubscribe = new Subject<void>();

  constructor(injector: Injector) {
    this.node = injector.get(DynFormTreeNode);
  }

  ngOnInit(): void {
    // listen hook calls
    this.node.hook$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(hook => this.callHook(hook));
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();

    // remove it from the hierarchy
    this.node.unregister();
  }

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
