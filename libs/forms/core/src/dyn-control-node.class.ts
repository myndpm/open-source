import { Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import isCallable from 'is-callable';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynControlHook } from './control-events.types';
import { DynControlParams } from './control-params.types';
import { DynErrorMessage } from './control-validation.types';
import { DynFormTreeNode } from './form-tree-node.service';

@Directive()
export abstract class DynControlNode<
  TParams extends DynControlParams,
  TControl extends AbstractControl,
>
implements OnInit, OnDestroy {

  // corresponding node in the form hierarchy
  node: DynFormTreeNode<TParams, TControl>;

  get errorMsg$(): Observable<DynErrorMessage> {
    return this.node.errorMsg$;
  }

  get onDestroy$(): Observable<void> {
    return this._unsubscribe.asObservable();
  }

  private _unsubscribe = new Subject<void>();

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
    this.node.onDestroy();
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
      // validate the expected payload
      if (!plain && (!payload || !fieldName || !Object.prototype.hasOwnProperty.call(payload, fieldName))) {
        return;
      }
      node.callHook({
        hook,
        payload: !plain ? payload[fieldName!] : payload,
        plain,
      });
    });
  }
}
