import { Directive, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import isCallable from 'is-callable';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynHook } from './types/events.types';
import { DynParams } from './types/params.types';
import { DynErrorMessage } from './types/validation.types';
import { DynControlNode } from './form-control-node.service';
import { callHooks } from './utils/tree.utils';

@Directive()
export abstract class DynControlBase<
  TParams extends DynParams,
  TControl extends AbstractControl,
>
implements OnInit, OnDestroy {

  // corresponding node in the form hierarchy
  node: DynControlNode<TParams, TControl>;

  get errorMsg$(): Observable<DynErrorMessage> {
    return this.node.errorMsg$;
  }

  get onDestroy$(): Observable<void> {
    return this._unsubscribe.asObservable();
  }

  private _unsubscribe = new Subject<void>();

  constructor(injector: Injector) {
    this.node = injector.get(DynControlNode);
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
    this.node?.destroy();
  }

  // propagate hook calls from the top to the bottom of the DynControls tree
  // note: concrete hooks will receive the parent data if they define no config.name
  callHook(event: DynHook): void {
    const method = (this as any)[`hook${event.hook}`];
    if (isCallable(method)) {
      method.bind(this)(event.payload);
    }

    // propagate to the children
    this.callChildrenHooks(event);
  }

  // hook propagated to children DynControls
  // customized by special cases like FormArray
  callChildrenHooks(event: DynHook): void {
    callHooks(this.node.children, event);
  }
}
