import { Inject, Injectable, Optional, SkipSelf, Type } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, merge } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, first, map, shareReplay, startWith, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynControlHook } from './types/events.types';
import { DynConfigPrimitive, DynInstanceType, DynVisibility } from './types/forms.types';
import { DynMatch } from './types/matcher.types';
import { DynMode } from './types/mode.types';
import { DynTreeNode } from './types/node.types';
import { DynParams } from './types/params.types';
import { DynErrorHandlerFn, DynErrorMessage, DynFormConfigErrors } from './types/validation.types';
import { merge as mergeUtil } from './utils/merge.util';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';
import { DYN_MODE } from './form.tokens';

type DynFormTreeNodeLoad<TComponent> =
  Partial<DynBaseConfig> &
  DynFormConfigErrors & {
    instance?: DynInstanceType,
    component: TComponent,
  };

type DynFormTreeNodeConfigure<TControl, TComponent> =
  DynFormTreeNodeLoad<TComponent> & {
    formControl: TControl;
  };

@Injectable()
// initialized by dyn-form, dyn-factory, dyn-group
// and the abstract DynForm* classes
export class DynFormTreeNode<
  TParams extends DynParams = DynParams,
  TControl extends AbstractControl = FormGroup,
  TComponent = any,
>
implements DynTreeNode<TParams, TControl> {
  // form hierarchy
  isolated = false;
  index?: number = 0;
  deep = 0;
  path: string[] = [];
  route: string[] = [];
  children: DynFormTreeNode[] = [];

  // node API
  get dynId(): string|undefined {
    return this._dynId;
  }
  get dynCmp(): TComponent|undefined {
    return this._dynCmp;
  }
  get instance(): DynInstanceType {
    return this._instance;
  }
  get name(): string|undefined {
    return this._name;
  }
  get control(): TControl {
    return this._control;
  }
  get params(): TParams {
    return this._params;
  }
  get isRoot(): boolean {
    return this.isolated || !this.parent;
  }
  get isFormLoaded(): boolean {
    return this._formLoaded;
  }
  get errorMsg$(): Observable<DynErrorMessage> {
    return this._errorMsg$.asObservable();
  }
  get hook$(): Observable<DynControlHook> {
    return this._hook$.asObservable();
  }
  get mode$(): Observable<DynMode> {
    return this._modeLocal$ ?? this._mode$;
  }
  get paramsUpdates$(): Observable<Partial<TParams>> {
    return this._paramsUpdates$.asObservable();
  }
  get visibility$(): Observable<DynVisibility> {
    return this._visibility$.asObservable();
  }

  // form root node
  get root(): DynFormTreeNode<any, any> {
    return this.isRoot ? this : this.parent.root;
  }

  // mode$ override
  set mode(mode$: Observable<DynMode>) {
    this._modeLocal$ = mode$;
  }

  private _dynId?: string;
  private _dynCmp?: TComponent;
  private _name?: string;
  private _instance!: DynInstanceType;
  private _control!: TControl;
  private _matchers?: DynMatch[];
  private _params!: TParams;
  private _initLoaded = false; // onInit called
  private _loadLoaded = false; // load called
  private _formLoaded = false; // view already initialized
  private _errorHandlers: DynErrorHandlerFn[] = [];

  private _children$ = new Subject<void>();
  private _numChild$ = new BehaviorSubject<number>(0);
  private _loaded$ = new BehaviorSubject<boolean>(false);
  private _loadedParams$ = new BehaviorSubject<boolean>(false);
  private _loadedMatchers$ = new BehaviorSubject<boolean>(false);
  private _errorMsg$ = new BehaviorSubject<DynErrorMessage>(null);
  private _unsubscribe$ = new Subject<void>();
  private _untrack$ = new Subject<void>();

  // listened by dyn-factory
  private _visibility$ = new Subject<DynVisibility>();
  // listened by DynControl
  private _paramsUpdates$ = new BehaviorSubject<Partial<TParams>>({});
  private _hook$ = new Subject<DynControlHook>();

  private _modeLocal$?: Observable<DynMode>;
  private _snapshots = new Map<DynMode, any>();

  loaded$: Observable<boolean> = this._children$.pipe(
    startWith(null),
    switchMap(() => combineLatest([
      this._numChild$,
      this._loaded$,
      this._loadedParams$,
      ...this.children.map(child => child.loaded$),
    ])),
    map(([children, loadedComponent, loadedParams, ...childrenLoaded]) => {
      const isControl = this.instance === DynInstanceType.Control;
      const hasAllChildren = children === childrenLoaded.length;
      const allChildrenValid = childrenLoaded.every(Boolean);
      const allChildrenLoaded = isControl ? true : hasAllChildren && allChildrenValid;
      const ready: boolean = Boolean(loadedComponent && loadedParams && allChildrenLoaded);

      this.logger.nodeLoad(this, !isControl
        ? { loaded$: ready, loadedComponent, loadedParams, children, childrenLoaded }
        : { loaded$: ready, loadedComponent, loadedParams }
      );

      return ready;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  ready$: Observable<boolean> = this._children$.pipe(
    startWith(null),
    switchMap(() => combineLatest([
      this.loaded$,
      this._loadedMatchers$,
      ...this.children.map(child => child.ready$),
    ])),
    map(([loaded, loadedMatchers, ...childrenReady]) => {
      const allChildrenReady = childrenReady.every(Boolean);
      const ready: boolean = loaded && loadedMatchers && allChildrenReady;

      this.logger.nodeReady(this, { ready$: ready, loaded, loadedMatchers, childrenReady });

      return ready;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  constructor(
    private readonly formFactory: DynFormFactory,
    private readonly formHandlers: DynFormHandlers,
    private readonly logger: DynLogger,
    @Optional() @Inject(DYN_MODE)
    private readonly _mode$: Observable<DynMode>,
    // parent node should be set for all except the root
    @Optional() @SkipSelf()
    public readonly parent: DynFormTreeNode<any>,
  ) {}

  /**
   * Visibility methods
   */

  visible(): void {
    this._visibility$.next('VISIBLE');
  }

  invisible(): void {
    this._visibility$.next('INVISIBLE');
  }

  hidden(): void {
    this._visibility$.next('HIDDEN');
  }

  /**
   * Feature methods
   */

  whenReady(): Observable<boolean> {
    return this.ready$.pipe(
      takeUntil(this._unsubscribe$),
      filter<boolean>(Boolean),
      first(),
    );
  }

  updateParams(params: Partial<TParams>): void {
    this._paramsUpdates$.next(
      mergeUtil(true, this._paramsUpdates$.value, params)
    );
  }

  // let the ControlNode know of an incoming hook
  callHook(event: DynControlHook): void {
    this.logger.hookCalled(this, event.hook, event.payload);

    this._hook$.next(event);
  }

  /**
   * Forms API
   */

  reset(value?: any, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._control.reset(value, options);
  }

  patchValue(payload: any, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): Subscription {
    return this.whenReady().pipe(
      tap(() => {
        this.markAsPending();
        this.logger.formCycle('PrePatch');
        this.callHook({ hook: 'PrePatch', payload, plain: false });
      }),
      delay(20), // waits any PrePatch loading change
      switchMap(() => {
        this.markAsLoaded();
        return this.whenReady();
      }),
      tap(() => {
        this._control.patchValue(payload, options);
        this.logger.formCycle('PostPatch', this._control.value);
        this.callHook({ hook: 'PostPatch', payload, plain: false });
      }),
    ).subscribe();
  }

  // listen another control value changes
  valueChanges(path: string): Observable<any>|undefined {
    const control = this.search(path);
    return control?.valueChanges.pipe(
      startWith(control.value),
    );
  }

  /**
   * Snapshots
   */

  track(defaultMode?: DynMode): Subscription {
    this._untrack$.next();
    return this.ready$.pipe(
      filter(Boolean),
      switchMap(() => combineLatest([this.mode$, this._hook$.pipe(startWith(null))])),
      takeUntil(this._untrack$)
    ).subscribe(([currentMode, event]) => {
      if (defaultMode && !event && !this._snapshots.size) {
        // snapshot of the initial mode
        this._snapshots.set(defaultMode, this._control.value);
      } else if (!event || event.hook === 'PostPatch') {
        // updates the default snapshot or the current mode
        const mode = event?.hook === 'PostPatch' ? defaultMode || currentMode : currentMode;
        this._snapshots.set(mode, this._control.value);
      }
    });
  }

  untrack(mode?: DynMode): void {
    this._untrack$.next();
    if (mode && this._snapshots.has(mode)) {
      this.patchValue(this._snapshots.get(mode));
    }
    this._snapshots.clear();
  }

  /**
   * Controls querying
   */

  /**
   * @deprecated use node.searchUp
   */
  query(path: string, searchNodes = false): AbstractControl|null {
    return this.searchUp(path, searchNodes);
  }

  /**
   * @deprecated use node.searchDown
   */
  select(path: string): AbstractControl|null {
    return this.searchDown(path);
  }

  /**
   * search a control by path
   * less performant than searchUp and searchDown
   */
  search(path: string): AbstractControl|null {
    return this.searchUp(path, true);
  }

  // query for an upper control in the tree
  searchUp(path: string, searchDown = false): AbstractControl|null {
    /* eslint-disable @typescript-eslint/no-this-alias */
    let node: DynFormTreeNode<TParams, any> = this;
    let result: AbstractControl|null;

    do {
      // query by form.control and by node.path
      result = node.control.get(path)
        ?? (searchDown ? node.searchDown(path) : null)
        ?? null;
      // move upper in the tree
      node = node.parent;
    } while (!result && node);

    return result;
  }

  // search a child control
  searchDown(path: string): AbstractControl|null {
    const selector = path.split('.');
    let name = '';

    if (this._name) { // container with no name
      name = selector.shift()!;
    }

    if (!selector.length) { // search over
      return this._name === name ? this._control : null;
    } else if (this._name !== name) {
      return null; // not in the search path
    }

    // propagate the query to the children
    let result: AbstractControl|null = null;
    this.children.some(node => {
      result = node.searchDown(selector.join('.'));
      return result ? true : false; // return the first match
    });

    return result;
  }

  searchCmp<T>(
    component: Type<T>,
    predicate: (node: DynTreeNode) => boolean = () => true,
  ): T|undefined {
    /* eslint-disable @typescript-eslint/no-this-alias */
    let node: DynFormTreeNode<TParams, any> = this;
    let result: any;

    do {
      // query by form.control and by node.path
      result = node.dynCmp instanceof component && predicate(node) ? node.dynCmp : undefined;
      // move upper in the tree
      node = node.parent;
    } while (!result && node);

    return result;
  }

  /**
   * Lifecycle methods
   */

  init(
    instance: DynInstanceType,
    config: DynBaseConfig,
    component: TComponent,
  ): void {
    if (this._initLoaded) {
      return this.logger.nodeMethodCalledTwice('init', this);
    }

    this._initLoaded = true;

    // throw error if the name is already set and different to the incoming one
    if (this.name !== undefined && this.name !== (config.name ?? '')) {
      throw this.logger.nodeFailed(config.control);
    }

    // throw error if the configured instance is different to the inherited one
    const configInstance = this.formFactory.getInstanceFor(config.control);
    if (instance !== configInstance) {
      throw this.logger.nodeInstanceMismatch(config.control, instance, configInstance);
    }

    // register the instance type for the childs to know
    this._instance = instance;

    if (config.name) {
      // register the control into the parent
      this._control = this.formFactory.register(
        instance as any,
        this as any,
        config,
      );
    } else {
      // or takes the parent control
      // useful for nested UI groups in the same FormGroup
      this._control = this.parent.control as unknown as TControl;
    }

    this.load({ ...config, component });
  }

  configure(config: DynFormTreeNodeConfigure<TControl, TComponent>): void {
    if (this._initLoaded) {
      return this.logger.nodeMethodCalledTwice('override', this);
    }

    this._initLoaded = true;

    // manual setup with no wiring nor config validation
    this._instance = config.instance ?? DynInstanceType.Group;
    this._control = config.formControl;

    this.load(config);
  }

  load(config: DynFormTreeNodeLoad<TComponent>): void {
    if (this._loadLoaded) {
      return this.logger.nodeMethodCalledTwice('load', this);
    }

    this._loadLoaded = true;

    if (!this._instance && config.instance) {
      this._instance = config.instance;
    }

    if (this.instance !== DynInstanceType.Wrapper && !this._control) {
      throw this.logger.nodeWithoutControl();
    }

    // keep the id of the control for the logs
    this._dynId = config.control;

    // keeps a reference to the dynamic component
    this._dynCmp = config.component;

    // register the name to build the form path
    this._name = config.name ?? '';

    // disconnect this node from any parent DynControl
    this.isolated = Boolean(config.isolated);
    this.deep = this.getDeep();
    this.path = this.getPath();
    this.route = this.getRoute();

    // store the number of configured childs
    this._numChild$.next(
      ![DynInstanceType.Array, DynInstanceType.Container].includes(this._instance)
        ? this._instance === DynInstanceType.Wrapper
          ? 1
          : config.controls?.length ?? 0
        : 0
    );

    // store the matchers to be processed in node.setup()
    this._matchers = this.getMatchers(config);

    // store the params to be accessible to the handlers
    this._params = config.params as TParams;

    // resolve and store the error handlers
    this._errorHandlers = config.errorMsgs
      ? this.formHandlers.getFormErrorHandlers(config.errorMsgs)
      : config.errorMsg
        ? this.formHandlers.getErrorHandlers(config.errorMsg)
        : [];

    if (!this.isolated) {
      // register the node with its parent
      this.parent?.addChild(this);
    }
  }

  setup(): void {
    if (!this.isFormLoaded) {
      this.logger.nodeSetup(this);
      this._formLoaded = true;

      // listen control changes to update the error
      merge(
        this._control.valueChanges,
        this._control.statusChanges,
      ).pipe(
        takeUntil(this._unsubscribe$),
        debounceTime(20), // wait for subcontrols to be updated
        map(() => this._control.errors),
        distinctUntilChanged(),
        withLatestFrom(this._errorMsg$),
      ).subscribe(([_, currentError]) => {
        if (this._control.valid) {
          // reset any existing error
          if (currentError) {
            this._errorMsg$.next(null);
          }
        } else {
          // update the error message if needed
          const errorMsg = this.getErrorMessage();
          if (currentError !== errorMsg) {
            this._errorMsg$.next(errorMsg);
          }
        }
      });

      if (this._matchers?.length) {
        // process the stored matchers
        this.loaded$.pipe(
          take(1),
          switchMap(() => combineLatest(
            this._matchers!.map((config) => {
              const matchers = config.matchers.map(matcher => this.formHandlers.getMatcher(matcher));
              let count = 0;

              return combineLatest(
                // build an array of observables to listen changes into
                config.when
                  .map(condition => this.formHandlers.getCondition(condition)) // handler fn
                  .map(fn => fn(this)) // condition observables
              ).pipe(
                takeUntil(this._unsubscribe$),
                map<any[], { hasMatch: boolean, results: any[] }>(results => ({
                  hasMatch: config.operator === 'OR' // AND by default
                    ? results.some(Boolean)
                    : results.every(Boolean),
                  results,
                })),
                // TODO option for distinctUntilChanged?
                map(({ hasMatch, results }) => {
                  const firstTime = (count === 0);
                  // run the matchers with the conditions result
                  // TODO config to run the matcher only if hasMatch? (unidirectional)
                  matchers.map(matcher => matcher({
                    node: this,
                    hasMatch: config.negate ? !hasMatch : hasMatch,
                    firstTime,
                    results,
                  }));
                  count++;
                }),
              );
            }),
          )),
          takeUntil(this._unsubscribe$),
        ).subscribe();
      }
      this.markMatchersAsLoaded();
    }

    // call the children
    this.children.map(child => child.setup());
  }

  destroy(): void {
    // TODO test unload with routed forms

    if (!this.isolated) {
      this.parent?.removeChild(this);
    }

    this._children$.complete();
    this._numChild$.complete();
    this._loaded$.complete();
    this._loadedParams$.complete();
    this._errorMsg$.complete();

    this._visibility$.complete();
    this._paramsUpdates$.complete();
    this._hook$.complete();

    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._untrack$.next();
    this._untrack$.complete();
  }

  markAsPending(): void {
    if (this._loaded$.value) {
      this._loaded$.next(false);
    }
  }

  markAsLoaded(): void {
    if (!this._loaded$.value) {
      this._loaded$.next(true);
    }
  }

  markParamsAsLoaded(): void {
    if (!this._loadedParams$.value) {
      this._loadedParams$.next(true);
    }
  }

  markMatchersAsLoaded(): void {
    if (!this._loadedMatchers$.value) {
      this._loadedMatchers$.next(true);
    }
  }

  childsIncrement(): void {
    this._numChild$.next(this._numChild$.value + 1);
    this.logger.nodeMethod(this, 'childsIncrement', { numChilds: this._numChild$.value });
  }

  childsDecrement(): void {
    this._numChild$.next(this._numChild$.value - 1);
    this.logger.nodeMethod(this, 'childsDecrement', { numChilds: this._numChild$.value });
  }

  /**
   * Hierarchy methods
   */
  setIndex(index?: number) {
    this.index = index;
  }

  getDeep(): number {
    return this.isRoot ? 0 : this.parent?.deep + 1;
  }

  // control.path relative to the root
  getPath(): string[] {
    return [
      ...(!this.isRoot ? this.parent.path : []),
      this._name ?? '',
    ].filter(Boolean);
  }

  // control.route relative to the root
  getRoute(): string[] {
    return [
      ...(!this.isRoot ? this.parent.route : []),
      this.dynId || this.instance +
      `${this.index !== undefined ? `[${this.index}]` : ''}`,
    ];
  }

  private addChild(node: DynFormTreeNode<any, any>): void {
    this.children.push(node);
    this.logger.nodeMethod(this, 'addChild', { numChilds: this._numChild$.value, children: this.children.length });
    this._children$.next();
    // TODO updateValue and validity? or it's automatically done?
  }

  private removeChild(node: DynFormTreeNode<any, any>): void {
    this.logger.nodeMethod(this, 'removeChild');

    this.children.some((child, i) => {
      return (child === node) ? this.children.splice(i, 1) : false;
    });
    this._children$.next();

    // TODO what happen to the data if we remove the control
    // TODO update validity if not isolated
  }

  // process the config to extract the matchers
  private getMatchers(config: Partial<DynBaseConfig>): DynMatch[] {
    const matchers = config.match?.slice() || [];

    // listen changes in the RELATED field
    // with a matcher configured like the asyncValidator
    if (config.asyncValidators) {
      const hasRelated = (Array.isArray(config.asyncValidators)
        ? config.asyncValidators.find((validator) => {
            return Array.isArray(validator) ?  validator[0] === 'RELATED' : false;
          })
        : config.asyncValidators['RELATED']
      ) as DynConfigPrimitive[];

      if (hasRelated) {
        matchers.push({
          matchers: ['RELATED'],
          when: [hasRelated[0]],
        } as any);
      }
    }

    return matchers;
  }

  // error message resolver
  private getErrorMessage(): string|null {
    let errorMsg: string|null = null;

    if (this._control.errors) {
      // loop the handlers and retrieve the message
      this._errorHandlers.concat(this.root._errorHandlers || []).some(handler => {
        errorMsg = handler(this);
        return Boolean(errorMsg);
      });
    }
    // TODO i18n transformation
    return errorMsg;
  }
}
