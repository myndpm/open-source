import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynInstanceType } from './types/forms.types';
import { DynParams } from './types/params.types';
import { DynWrapperId } from './types/wrapper.types';
import { searchNode } from './utils/tree.utils';

export type DynFormNodeLoad<TParams extends DynParams, TControl, TComponent> =
  DynBaseConfig<string, TParams> & {
    formControl?: TControl;
    instance?: DynInstanceType;
    wrapper?: DynWrapperId;
    component: TComponent;
  };

export class DynFormNode<TControl extends AbstractControl> {
  get isRoot(): boolean {
    return !this.parent;
  }
  get root(): DynFormNode<any> {
    return this.isRoot ? this : this.parent.root;
  }

  children: DynFormNode<any>[] = [];
  error$ = new BehaviorSubject<ValidationErrors|null>(null);
  loaded = false;
  name: string;

  private _unsubscribe$ = new Subject<void>();

  constructor(
    public readonly parent: DynFormNode<any>,
    public readonly control: TControl,
    public readonly path: string[],
  ) {
    this.parent?.addChild(this);
    this.name = path.slice(-1).pop() ?? '';
  }

  destroy(): void {
    this.parent?.removeChild(this);
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  equivalent(path: string[]): boolean {
    return Boolean(this.path.join('.') === path.join('.'));
  }

  search(path: string[]): DynFormNode<any>|undefined {
    return searchNode(this, path.join('.'));
  }

  setup(): void {
    if (this.loaded) {
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
    ).subscribe((errors) => this.error$.next(errors));
  }

  addChild(node: DynFormNode<any>): void {
    this.children.push(node);
  }

  removeChild(node: DynFormNode<any>): void {
    this.children.some((child, i) => {
      return (child === node) ? this.children.splice(i, 1) : false;
    });
  }
}
