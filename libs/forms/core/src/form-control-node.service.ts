import { Inject, Injectable, Optional, SkipSelf, Type } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import deepEqual from 'fast-deep-equal';
import { BehaviorSubject, Observable, Subject, combineLatest, isObservable, of } from 'rxjs';
import { delay, distinctUntilChanged, filter, first, map, scan, shareReplay, startWith, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynHook } from './types/events.types';
import { DynConfigPrimitive, DynInstanceType, DynVisibility } from './types/forms.types';
import { DynMatch } from './types/matcher.types';
import { DynMode } from './types/mode.types';
import { DynNode } from './types/node.types';
import { DynFunctionFn, DynParams } from './types/params.types';
import { DynConfigId, DynConfigMap, DynConfigProvider } from './types/provider.types';
import { DynErrorHandlerFn, DynErrorMessage } from './types/validation.types';
import { coerceBoolean, getWrapperId } from './utils/config.utils';
import { isNotDynHidden } from './utils/hidden.util';
import { merge as mergeUtil } from './utils/merge.util';
import { onComplete } from './utils/rxjs.utils';
import { searchNode } from './utils/tree.utils';
import { AbstractDynControl } from './dyn-control.class';
import { DynFormNode, DynFormNodeLoad } from './dyn-form-node.class';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';
import { DYN_MODE } from './form.tokens';

@Injectable()
// initialized by dyn-form, dyn-group, dynFactory
// and the abstract DynForm* classes
export class DynControlNode<
  TParams extends DynParams = DynParams,
  TControl extends AbstractControl = FormGroup,
  TComponent extends AbstractDynControl = any,
>
implements DynNode<TParams, TControl> {
  // form hierarchy
  get deep(): number {
    return this._deep;
  }
  get index(): number {
    return this._index;
  }
  get isolated(): boolean {
    return this._isolated;
  }
  get detached(): boolean {
    return this._detached;
  }
  get isRoot(): boolean {
    return this._isolated || !this.parent;
  }
  get isTopLevel(): boolean {
    return this._topLevel;
  }
  get children(): DynControlNode[] {
    return this._children;
  }
  get root(): DynControlNode<any, any> {
    return this.isRoot ? this : this.parent.root;
  }
  get path(): string[] {
    return this._node?.path || this.getPath();
  }
  get route(): string[] {
    return this._route;
  }

  // node API
  get name(): string|undefined {
    return this._name;
  }
  get dynId(): string|undefined {
    return this._dynId;
  }
  get dynCmp(): TComponent|undefined {
    return this._dynCmp;
  }
  get instance(): DynInstanceType {
    return this._instance;
  }
  get control(): TControl {
    return this._node.control;
  }
  get params(): TParams {
    return this._params;
  }
  get isFormLoaded(): boolean {
    return this._formLoaded;
  }
  get errorHandlers(): DynErrorHandlerFn[] {
    return this._errorHandlers.concat(!this.isRoot ? this.parent?.errorHandlers : []);
  }
  get errorMsg$(): Observable<DynErrorMessage> {
    return this._errorMsg$.asObservable();
  }
  get hook$(): Observable<DynHook> {
    return this._hook$.asObservable();
  }
  get mode$(): Observable<DynMode> {
    return this._modeLocal$ ?? this._mode$;
  }
  get params$(): Observable<TParams> {
    return this._params$;
  }
  get paramsUpdates$(): Observable<Partial<TParams>> {
    return this._paramsUpdates$.asObservable();
  }
  get visibility$(): Observable<DynVisibility> {
    return this._visibility$.asObservable();
  }
  get visibility(): DynVisibility {
    return this._visibility$.value;
  }

  // mode$ override
  set mode(mode$: Observable<DynMode>) {
    this._modeLocal$ = mode$;
  }

  private _deep = 0;
  private _index: number = 0;
  private _isolated = false; // do not propagate hooks
  private _detached = false; // with custom formControl
  private _children: DynControlNode[] = [];
  private _route: string[] = [];

  private _name?: string;
  private _dynId?: string;
  private _dynCmp?: TComponent;
  private _instance!: DynInstanceType;
  private _params!: TParams;
  private _node!: DynFormNode<TControl>;
  private _matchers?: DynMatch[];
  private _topLevel = false;
  private _initLoaded = false; // init called
  private _formLoaded = false; // view already initialized
  private _validators?: DynConfigId[];
  private _asyncValidators?: DynConfigId[];
  private _errorHandlers: DynErrorHandlerFn[] = [];

  private _changed$ = new Subject<void>();
  private _children$ = new BehaviorSubject<number>(0);
  private _errorMsg$ = new BehaviorSubject<DynErrorMessage>(null);
  private _loaded$ = new BehaviorSubject<boolean>(false);
  private _loadedParams$ = new BehaviorSubject<boolean>(false);
  private _loadedMatchers$ = new BehaviorSubject<boolean>(false);
  private _params$!: Observable<TParams>;
  private _unsubscribe$ = new Subject<void>();
  private _untrack$ = new Subject<void>();

  // listened by DynControl
  private _hook$ = new Subject<DynHook>();
  private _paramsUpdates$ = new BehaviorSubject<Partial<TParams>>({});
  private _visibility$ = new BehaviorSubject<DynVisibility>('VISIBLE');

  private _modeLocal$?: Observable<DynMode>;
  private _snapshots = new Map<DynMode, any>();

  loaded$: Observable<boolean> = this._changed$.pipe(
    startWith(null),
    switchMap(() => combineLatest([
      this._children$,
      this._loaded$,
      this._loadedParams$,
      ...this._children.filter(({ dynId }) => isNotDynHidden(dynId!)).map(child => child.loaded$),
    ])),
    takeUntil(this._unsubscribe$),
    map(([children, loadedComponent, loadedParams, ...childrenLoaded]) => {
      const isControl = this.instance === DynInstanceType.Control;
      const hasAllChildren = children === childrenLoaded.length;
      const allChildrenValid = childrenLoaded.every(Boolean);
      const allChildrenLoaded = isControl ? true : hasAllChildren && allChildrenValid;
      const loaded: boolean = Boolean(loadedComponent && loadedParams && allChildrenLoaded);

      this.logger.nodeLoad(this, !isControl
        ? { loaded$: loaded, loadedComponent, loadedParams, children, childrenLoaded }
        : { loaded$: loaded, loadedComponent, loadedParams }
      );

      return loaded;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  ready$: Observable<boolean> = this._changed$.pipe(
    startWith(null),
    switchMap(() => combineLatest([
      this.loaded$,
      this._loadedMatchers$,
      ...this.children.filter(({ dynId }) => isNotDynHidden(dynId!)).map(child => child.ready$),
    ])),
    takeUntil(this._unsubscribe$),
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
    public readonly parent: DynControlNode<any>,
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

  whenLoaded(): Observable<boolean> {
    return this.loaded$.pipe(
      takeUntil(this._unsubscribe$),
      filter<boolean>(Boolean),
      first(),
    );
  }

  whenReady(): Observable<boolean> {
    return this.ready$.pipe(
      takeUntil(this._unsubscribe$),
      filter<boolean>(Boolean),
      first(),
    );
  }

  // internal API for dynFactory
  setupParams(
    params?: Partial<TParams>,
    paramFns?: DynConfigMap<DynConfigProvider<DynFunctionFn>>,
    resetPrevious = true,
  ): void {
    this.updateParams(
      mergeUtil(true, params, this.formHandlers.getFunctions(paramFns)),
      resetPrevious,
    );
  }

  updateParams(params: Partial<TParams>, resetPrevious = false): void {
    // FIXME this is not reseted on mode change?
    this._paramsUpdates$.next(!resetPrevious
      ? mergeUtil(true, this._paramsUpdates$.value, params)
      : params
    );

    this.children.map(child => {
      if (this._node.equivalent(child.path)) {
        child.updateParams(params, resetPrevious);
      }
    });
  }

  // let the ControlNode know of an incoming hook
  // TODO polymorphic function with sparsed params
  callHook(event: DynHook): void {
    this.logger.hookCalled(this, event);

    this._hook$.next(event);
  }

  log(message: string, payload?: any): void {
    this.logger.log(this, `'${this.path?.join('.')}' ${message} (${this.route.join('/')})`, payload);
  }

  /**
   * Forms API
   */

  reset(value?: any, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._node.control.reset(value, options);
  }

  patchValue(payload: any, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): Observable<void> {
    return onComplete(
      this.whenReady().pipe(
        tap(() => {
          this.logger.formCycle('PrePatch');
          this.callHook({ hook: 'PrePatch', payload, plain: false });
        }),
        delay(20), // waits any PrePatch processing
        tap(() => {
          this._node.control.patchValue(payload, options);
          this.logger.formCycle('PostPatch', this._node.control.value);
          this.callHook({ hook: 'PostPatch', payload, plain: false });
        }),
        switchMap(() => this.whenReady()),
      ),
    );
  }

  // listen another control value changes
  valueChanges(path?: string): Observable<any>|undefined {
    const control = path ? this.search(path) : this.control;
    return control?.valueChanges.pipe(
      startWith(control.value),
    );
  }

  // trigger change detection
  detectChanges(): void {
    this.callHook({ hook: 'DetectChanges' });
  }

  hasValidator(name: string): boolean {
    return this._validators?.includes(name)
      ?? this._asyncValidators?.includes(name)
      ?? false;
  }

  /**
   * Snapshots
   */

  track(defaultMode?: DynMode): Observable<void> {
    this._untrack$.next();

    return onComplete(
      this.ready$.pipe(
        filter(Boolean),
        switchMap(() => combineLatest([this.mode$, this._hook$.pipe(startWith(null))])),
        takeUntil(this._untrack$)
      ),
      ([currentMode, event]) => {
        if (defaultMode && !event && !this._snapshots.size) {
          // snapshot of the initial mode
          this._snapshots.set(defaultMode, this._node.control.value);
          this.logger.modeTrack(this, defaultMode);
        } else if (!event || event.hook === 'PostPatch') {
          // updates the default snapshot or the current mode
          const mode = event?.hook === 'PostPatch' ? defaultMode || currentMode : currentMode;
          this._snapshots.set(mode, this._node.control.value);
          this.logger.modeTrack(this, mode);
        }
      },
    );
  }

  untrack(mode?: DynMode): void {
    this.logger.modeUntrack(this, mode);
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
  query(path: string, searchNodes = false): AbstractControl|undefined {
    return this.searchUp(path, searchNodes);
  }

  /**
   * @deprecated use node.searchDown
   */
  select(path: string): AbstractControl|undefined {
    return this.searchDown(path);
  }

  /**
   * search a control by path in the whole hierarchy tree
   * less performant than searchUp and searchDown
   */
  search(path: string): AbstractControl|undefined {
    return this.searchUp(path, true);
  }

  /**
   * search a node by path up in the hierarchy tree (parents)
   */
  searchUp(path: string, searchDown = false): AbstractControl|undefined {
    /* eslint-disable @typescript-eslint/no-this-alias */
    let node: DynControlNode<TParams, any> = this;
    let result: AbstractControl|undefined;

    do {
      // query by form.control and by node.path
      // TODO consider multiple nodes matching a path
      result = node.control.get(path)
        ?? (searchDown ? node.searchDown(path) : undefined)
        ?? undefined;
      // move upper in the tree
      node = node.parent;
    } while (!result && node);

    return result;
  }

  /**
   * search a node by path down in the hierarchy tree (children)
   */
  searchDown(path: string): AbstractControl|undefined {
    return searchNode(this as DynNode, path)?.control;
  }

  /**
   * search a parent component type in the hierarchy tree of nodes.
   * while the predicate function returns a truthy value
   */
  searchCmp<T>(
    component: Type<T>,
    predicate: (node: DynNode) => boolean = () => true,
  ): T|undefined {
    /* eslint-disable @typescript-eslint/no-this-alias */
    let node: DynControlNode<TParams, any> = this.parent;
    let result: any;

    do {
      // query by form.control and by node.path
      result = node.dynCmp instanceof component
        ? node.dynCmp
        : undefined;
      node = node.parent;
    } while (!result && node && predicate(node));

    return result;
  }

  searchWrapper<T>(component: Type<T>): T|undefined {
    return this.searchCmp(component, ({ instance }) => instance === DynInstanceType.Wrapper);
  }

  /**
   * run a function in the current and/or parent nodes until it returns a truthy value.
   */
  exec<T>(fn: (node: DynNode) => T, includeSelf = false): T|undefined {
    /* eslint-disable @typescript-eslint/no-this-alias */
    let node: DynControlNode<TParams, any> = includeSelf ? this : this.parent;
    let result: any;

    do {
      // query by form.control and by node.path
      result = fn(node);
      node = node.parent;
    } while (!result && node);

    return result;
  }

  /**
   * run a function in the parent nodes that are WRAPPERs.
   */
  execInWrappers(fn: (node: DynNode) => any, includeSelf = false): void {
    this.exec(
      (node: DynNode) => {
        if ((!includeSelf || node !== this) && node.instance !== DynInstanceType.Wrapper) {
          return true;
        }
        fn(node);
        return false;
      },
      includeSelf,
    );
  }

  /**
   * Lifecycle methods
   */

  init(config: DynFormNodeLoad<TParams, TControl, TComponent>): void {
    if (this._initLoaded) {
      return this.logger.nodeMethodCalledTwice('init', this);
    }
    this._initLoaded = true;

    // throw error if the name is already set and different to the incoming one
    if (this.name !== undefined && this.name !== (config.name ?? '')) {
      throw this.logger.nodeFailed(config.control);
    }

    if (config.visibility && config.visibility !== this._visibility$.value) {
      this._visibility$.next(config.visibility);
    }

    // disconnect this node from any parent DynControl
    this._isolated = Boolean(config.isolated);

    // register the name to build the form path
    this._name = this.parent?.instance !== DynInstanceType.Wrapper ? config.name ?? '' : '';

    // register the instance type for the children to know
    this._instance = config.instance ?? DynInstanceType.Group;

    // register the controlId to build the path properly
    this._dynId = config.wrapper || config.control;

    // keeps a reference to the dynamic component
    this._dynCmp = config.component;

    // css classes and matchers are processed only in the top level
    this._topLevel = Boolean(!config.wrappers?.length || this._dynId === getWrapperId(config.wrappers[0]));

    this._deep = this.getDeep();
    this._route = this.getRoute();
    const path = this.getPath();

    // check if a new hierarchy level is needed
    if (config.formControl || !this.parent?._node.equivalent(path)) {
      // check if the control already exists in another point in the hierarchy
      this._node = this.parent?._node.root.search(path)!;
      let control: TControl | undefined;
      if (config.formControl) {
        // node has a different control for this path
        if (this._node && this._node.control !== config.formControl) {
          this.logger.nodeDetached(this);
          this._isolated = true;
          this._route = this.getRoute();
        }
        control = config.formControl;
        this._detached = this.route.length > 0; // do not detach the root dyn-form
      } else if (!this._node) {
        // register the control into the parent
        control = this.formFactory.register(
          this._instance === DynInstanceType.Wrapper
            ? this.formFactory.getInstanceFor(config.control) as any
            : this._instance,
          this as any,
          config,
        )!;
      }
      if (control) {
        this._node = new DynFormNode(this.parent?._node, control, this.getPath(), this.isolated);
      }
    } else {
      // or takes the parent control
      // useful for nested UI groups in the same FormGroup
      this._node = (this.parent as any)._node;
    }

    if (!this._node.control) {
      throw this.logger.nodeWithoutControl();
    }

    // store the number of configured children
    this._children$.next(
      ![DynInstanceType.Array, DynInstanceType.Container].includes(this._instance)
        ? this._instance === DynInstanceType.Wrapper
          ? 1
          : config.controls?.filter(isNotDynHidden).length ?? 0
        : 0
    );

    if (this.parent?.instance === DynInstanceType.Container && isNotDynHidden(this._dynId)) {
      this.parent.childrenIncrement();
    }

    // store the configured IDs
    this._validators = this.formHandlers.getConfigIds(config.validators);
    this._asyncValidators = this.formHandlers.getConfigIds(config.asyncValidators);

    // store the matchers to be processed in node.setup()
    this._matchers = this.getMatchers(config);

    // resolve and store the error handlers
    if (config.errorMsgs) {
      this._errorHandlers = this.formHandlers.getFormErrorHandlers(config.errorMsgs);
    }
    if (config.errorMsg) {
      this._errorHandlers = this._errorHandlers.concat(this.formHandlers.getErrorHandlers(config.errorMsg));
    }

    // merge any configured paramFns first
    if (config.paramFns) {
      this.setupParams({}, config.paramFns, false);
    }

    // store the params to be accessible to the handlers
    this._params$ = combineLatest([
      isObservable(config.params) ? config.params : of<Partial<TParams>>(config.params || {}),
      this.paramsUpdates$.pipe(startWith({})),
    ]).pipe(
      takeUntil(this._unsubscribe$),
      scan<[Partial<TParams>, Partial<TParams>], TParams>(
        (params, [config, updates]) => mergeUtil(true, params, config, updates),
        {} as TParams,
      ),
      map(params => (this.dynCmp as any)?.completeParams?.(params) ?? params),
      distinctUntilChanged(deepEqual),
      tap(params => this._params = params),
      shareReplay(1),
    );

    // register the node with its parent for further setup
    this.parent?.addChild(this);
  }

  setup(): void {
    if (!this._formLoaded) {
      this.logger.nodeSetup(this);
      this._formLoaded = true;

      this._node.setup();

      this._node.error$.pipe(
        withLatestFrom(this._errorMsg$),
      ).subscribe(([controlErrors, currentError]) => {
        if (this._node.control.valid) {
          // reset any existing error
          if (currentError) {
            this._errorMsg$.next(null);
          }
        } else {
          // update the error message if needed
          const errorMsg = this.getErrorMessage(controlErrors);
          if (currentError !== errorMsg) {
            this._errorMsg$.next(errorMsg);
          }
        }
      });

      if (this._topLevel && this._matchers?.length) {
        // process the stored matchers
        this.whenLoaded().pipe(
          switchMap(() => combineLatest(
            this._matchers!.map((config) => {
              const matchers = config.matchers.map(matcher => this.formHandlers.getMatcher(matcher));
              let count = 0;

              return combineLatest(
                // build an array of observables to listen changes into
                config.when
                  .map(condition => this.formHandlers.getCondition(condition)) // handler fn
                  .map(fn => fn(this, coerceBoolean(config.debug))) // condition observables
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
                    debug: coerceBoolean(config.debug),
                    hasMatch: coerceBoolean(config.negate) ? !hasMatch : hasMatch,
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
    this.parent?.removeChild(this);

    this._dynCmp = undefined;
    this._node?.destroy();

    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._untrack$.next();
    this._untrack$.complete();

    this._changed$.complete();
    this._children$.complete();
    this._loaded$.complete();
    this._loadedParams$.complete();
    this._visibility$.complete();
    this._paramsUpdates$.complete();
    this._hook$.complete();
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

  childrenIncrement(logging = true): void {
    this._children$.next(this._children$.value + 1);
    if (logging) {
      this.logger.nodeMethod(this, 'childrenIncrement', { count: this._children$.value });
    }
  }

  childrenDecrement(): void {
    this._children$.next(this._children$.value - 1);
    this.logger.nodeMethod(this, 'childrenDecrement', { count: this._children$.value });
  }

  /**
   * Hierarchy methods
   */
  setIndex(index?: number) {
    this._index = index || 0;
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
    return !this.isRoot
      ? [
          ...this.parent.route,
          `${this.dynId || this.instance}${this.index !== undefined ? `[${this.index}]` : ''}`,
        ]
      : [];
  }

  private addChild(node: DynControlNode<any, any>): void {
    this.children.push(node);
    this.logger.nodeMethod(this, 'addChild', { count: this._children$.value, children: this.children.length });
    this._changed$.next();
    // TODO updateValue and validity? or it's automatically done?
  }

  private removeChild(node: DynControlNode<any, any>): void {
    this.children.some((child, i) => {
      return (child === node) ? this.children.splice(i, 1) : false;
    });
    this.logger.nodeMethod(this, 'removeChild', { count: this._children$.value, children: this.children.length });
    this._changed$.next();

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
  private getErrorMessage(errors: ValidationErrors|null): string|null {
    let errorMsg: string|null = null;

    if (errors) {
      // loop the handlers and retrieve the message
      this.errorHandlers.some(handler => {
        errorMsg = handler(this);
        return Boolean(errorMsg);
      });
    }

    // TODO i18n transformation
    return errorMsg;
  }
}
