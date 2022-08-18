import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynFormConfigErrors } from './types/validation.types';
import { DynWrapperId } from './types/wrapper.types';

export type DynFormNodeLoad<TParams, TControl, TComponent> =
  DynBaseConfig<string, TParams> &
  DynFormConfigErrors & {
    instance?: DynInstanceType;
    wrapper?: DynWrapperId;
    formControl?: TControl;
    component: TComponent;
  };

export class DynFormNode<
//  TParams extends DynParams = DynParams,
  TControl extends AbstractControl,
> {
  get isRoot(): boolean {
    return !this.parent;
  }
  get root(): DynFormNode<any> {
    return this.isRoot ? this : this.parent.root;
  }

  errorChange$ = new BehaviorSubject<ValidationErrors|null>(null);
  loaded = false;

  private _unsubscribe$ = new Subject<void>();

  constructor(
    public readonly parent: DynFormNode<any>,
    public readonly control: TControl,
    public readonly path: string[],
  ) {}

  destroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  equivalent(config: DynFormNodeLoad<any, any, any>, path: string[]): boolean {
    // TODO check if the control already exists in another point in the hierarchy
    return Boolean(this.path.join('.') === path.join('.') && !config.formControl);
  }

  setup(): void {
    if (!this.loaded) {
      return;
    }
    this.loaded = true;

    // listen control changes to update the error
    merge(
      this.control.valueChanges,
      this.control.statusChanges.pipe(startWith(this.control.status)),
    ).pipe(
      takeUntil(this._unsubscribe$),
      debounceTime(20), // wait for subcontrols to be updated
      map(() => this.control.errors),
      distinctUntilChanged(),
    ).subscribe((errors) => this.errorChange$.next(errors));
  }
}
