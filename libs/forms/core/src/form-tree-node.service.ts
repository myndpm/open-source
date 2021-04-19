import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DynBaseConfig } from './config.types';
import { DynControlHook, DynControlVisibility } from './control-events.types';
import { DynControlMatch } from './control-matchers.types';
import { DynControlParams } from './control-params.types';
import { DynInstanceType } from './control.types';
import { DynFormFactory } from './form-factory.service';
import { DynFormMatchers } from './form-matchers.service';
import { DynTreeNode } from './tree.types';

@Injectable()
// initialized by dyn-form, dyn-factory, dyn-group
// and the abstract DynForm* classes
export class DynFormTreeNode<
  TParams extends DynControlParams = DynControlParams,
  TControl extends AbstractControl = FormGroup
>
implements DynTreeNode<TControl> {
  // form hierarchy
  isolated = false;
  children: DynFormTreeNode[] = [];

  // listened by dyn-factory
  visibility$ = new Subject<DynControlVisibility>();
  // listened by DynControl
  paramsUpdates$ = new Subject<Partial<TParams>>();
  hook$ = new Subject<DynControlHook>();

  // control config
  get name(): string|undefined {
    return this._name;
  }
  get instance(): DynInstanceType {
    return this._instance;
  }
  get control(): TControl {
    return this._control;
  }
  get isRoot(): boolean {
    return this.isolated || !this.parent;
  }

  // control.path relative to the root
  get path(): string[] {
    return [
      ...(!this.isRoot ? this.parent.path : []),
      this._name ?? '',
    ].filter(Boolean);
  }

  private _name?: string;
  private _instance!: DynInstanceType;
  private _control!: TControl;
  private _matchers?: DynControlMatch[];

  private _unsubscribe = new Subject<void>();

  constructor(
    private readonly formFactory: DynFormFactory,
    private readonly formMatchers: DynFormMatchers,
    private readonly logger: DynLogger,
    // parent node should be set for all except the root
    @Optional() @SkipSelf() public readonly parent: DynFormTreeNode<any>,
  ) {}

  /**
   * Feature methods
   */

  // let the TreeNode know of an incoming hook
  callHook(event: DynControlHook): void {
    this.logger.hookCalled(event.hook, this.path, event.payload);

    this.hook$.next(event);
  }

  // query for a control upper in the tree
  query(path: string, searchNodes = false): AbstractControl|null {
    /* eslint-disable @typescript-eslint/no-this-alias */
    let node: DynFormTreeNode<TParams, any> = this;
    let result: AbstractControl|null;

    do {
      // query by form.control and by node.path
      result = node.control.get(path)
        ?? (searchNodes ? node.select(path) : null)
        ?? null;
      // move upper in the tree
      node = node.parent;
    } while (!result && node);

    return result;
  }

  // select a child control by node.path
  select(path: string): AbstractControl|null {
    const selector = path.split('.');
    let name = '';

    if (this._name) { // container with no name
      name = selector.shift()!;
    }

    if (!selector.length) { // search over
      return this._name === name ? this.control : null;
    } else if (this._name !== name) {
      return null; // not in the search path
    }

    // propagate the query to the children
    let result: AbstractControl|null = null;
    this.children.some(node => {
      result = node.select(selector.join('.'));
      return result ? true : false; // return the first match
    });

    return result;
  }

  /**
   * Lifecycle methods
   */

  onInit(instance: DynInstanceType, config: DynBaseConfig): void {
    // throw error if the name is already set and different to the incoming one
    if (this.name !== undefined && this.name !== (config.name ?? '')) {
      throw this.logger.nodeFailed(config.control);
    }

    // register the instance type for the childs to know
    this._instance = instance;

    if (config.name) {
      // register the control into the parent
      this._control = this.formFactory.register(
        instance as any,
        config,
        this.parent,
      );
    } else {
      // or takes the parent control
      // useful for nested UI groups in the same FormGroup
      this._control = this.parent.control as unknown as TControl;
    }

    this.load(config);
  }

  setControl(control: TControl, instance = DynInstanceType.Group): void {
    this.logger.nodeControl();

    // manual setup with no wiring nor config validation
    this._instance = instance;
    this._control = control;
  }

  load(config: Partial<DynBaseConfig>): void {
    if (!this._control) {
      throw this.logger.nodeWithoutControl();
    }

    // disconnect this node from any parent DynControl
    this.isolated = Boolean(config.isolated);

    // register the name to build the form path
    this._name = config.name ?? '';

    // store the matchers to be processed afterViewInit
    this._matchers = config.options?.matchers;

    if (!this.isolated) {
      // register the node with its parent
      this.parent?.addChild(this);
    }
  }

  afterViewInit(): void {
    // process the stored matchers
    this._matchers?.map((config) => {
      const matcher = this.formMatchers.getMatcher(config.matcher);

      combineLatest(
        // build an array of observables to listen changes into
        config.when
          .map(condition => this.formMatchers.getCondition(condition)) // handler fn
          .map(fn => fn(this)) // condition observables
      ).pipe(
        map(results => config.operator === 'OR'
          ? results.some(Boolean)
          : results.every(Boolean)
        ),
        takeUntil(this._unsubscribe),
        distinctUntilChanged(),
      )
      .subscribe(hasMatch => {
        // run the matcher with the conditions result
        matcher(this, config.negate ? !hasMatch : hasMatch)
      });
    });

    // call the children
    this.children.map(child => child.afterViewInit());
  }

  onDestroy(): void {
    // TODO test unload with routed forms

    if (!this.isolated) {
      this.parent?.removeChild(this);
    }

    this.hook$.complete();

    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  /**
   * Hierarchy methods
   */
  private addChild(node: DynFormTreeNode<any, any>): void {
    this.children.push(node);

    // TODO setup validators
  }

  private removeChild(node: DynFormTreeNode<any, any>): void {
    this.children.some((child, i) => {
      return (child === node) ? this.children.splice(i, 1) : false;
    });

    // TODO what happen to the data if we remove the control
    // TODO update validators if not isolated
  }
}
