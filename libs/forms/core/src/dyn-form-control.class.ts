import { Directive, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynMode } from './types/mode.types';
import { DynNode } from './types/node.types';
import { DynParams } from './types/params.types';
import { DynControl } from './dyn-control.class';

type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

@Directive()
export abstract class DynFormControl<
  TMode extends DynMode = DynMode,
  TParams extends DynParams = DynParams,
  TConfig extends DynConfig<TMode, TParams> = DynConfig<TMode, TParams>
>
extends DynControl<TMode, TParams, TConfig, FormControl>
implements OnInit {

  static dynInstance = DynInstanceType.Control;

  private touchedChange$ = new Subject();

  // auto-register in the form hierarchy
  ngOnInit(): void {
    if (!this.config.name && this.node.parent.instance !== DynInstanceType.Control) {
      throw new Error(`No config.name provided for ${this.config.control}`);
    }

    // initialize the node
    this.node.init({
      ...this.config,
      instance: DynInstanceType.Control,
      component: this,
    });

    // provide the parameters
    super.ngOnInit();

    // FIXME hack FormControl to add reactiveness
    // https://stackoverflow.com/questions/41337024/how-to-observe-touched-event-on-angular-2-ngform
    this.wrapFormControl();

    // log the successful initialization
    this._logger.nodeLoaded('dyn-form-control', this.node);
  }

  private wrapFormControl(): void {
    // bind touched/untouched with a reactive touchedChange$
    const markAsTouched = this.control.markAsTouched.bind(this.control);
    const markAsUntouched = this.control.markAsUntouched.bind(this.control);

    const newMarkAsTouched = (...args: ArgumentsType<AbstractControl['markAsTouched']>) => {
      markAsTouched(...args);
      this.touchedChange$.next(true);
    }
    const newMarkAsUntouched = (...args: ArgumentsType<AbstractControl['markAsUntouched']>) => {
      markAsUntouched(...args);
      this.touchedChange$.next(false);
    }

    this.control.markAsTouched = newMarkAsTouched;
    this.control.markAsUntouched = newMarkAsUntouched;

    this.touchedChange$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this._ref.markForCheck();
        this.node.execInWrappers(
          (node: DynNode) => node.callHook({ hook: 'DetectChanges', plain: true })
        )
      });
  }
}
