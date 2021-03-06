import { Inject, Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Subject, combineLatest, merge, Observable } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, first, map, shareReplay, startWith, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynControlVisibility } from './types/control.types';
import { DynControlHook } from './types/events.types';
import { DynConfigPrimitive, DynInstanceType } from './types/forms.types';
import { DynControlMatch } from './types/matcher.types';
import { DynControlMode } from './types/mode.types';
import { DynTreeNode } from './types/node.types';
import { DynControlParams } from './types/params.types';
import { DynErrorHandlerFn, DynErrorMessage, DynFormConfigErrors } from './types/validation.types';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';
import { DYN_MODE } from './form.tokens';

@Injectable()
// initialized by dyn-form, dyn-factory, dyn-group
// and the abstract DynForm* classes
export class DynFormTreeNode<
  TParams extends DynControlParams = DynControlParams,
  TControl extends AbstractControl = FormGroup
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
  get dynControl(): string|undefined {
    return this._dynControl;
  }
  get name(): string|undefined {
    return this._name;
  }
  get instance(): DynInstanceType {
    return this._instance;
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
  get mode$(): Observable<DynControlMode> {
    return this._modeLocal$ ?? this._mode$;
  }
  get paramsUpdates$(): Observable<Partial<TParams>> {
    return this._paramsUpdates$.asObservable();
  }
  get visibility$(): Observable<DynControlVisibility> {
    return this._visibility$.asObservable();
  }

  // form root node
  get root(): DynFormTreeNode<any, any> {
    return this.isRoot ? this : this.parent.root;
  }

  // mode$ override
  set mode(mode$: Observable<DynControlMode>) {
    this._modeLocal$ = mode$;
  }

  private _dynControl?: string;
  private _name?: string;
  private _instance!: DynInstanceType;
  private _control!: TControl;
  private _matchers?: DynControlMatch[];
  private _params!: TParams;
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
  private _modeLocal$?: Observable<DynControlMode>;

  private _snapshots = new Map<DynControlMode, any>();

  // listened by dyn-factory
  private _visibility$ = new Subject<DynControlVisibility>();
  // listened by DynControl
  private _paramsUpdates$ = new BehaviorSubject<Partial<TParams>>({});
  private _hook$ = new Subject<DynControlHook>();

  loaded$: Observable<boolean> = this._children$.pipe(
    startWith(null),
    switchMap(() => combineLatest([
      this._numChild$,
      this._loaded$,
      this._loadedParams$,
      this._loadedMatchers$,
      ...this.children.map(child => child.loaded$),
    ])),
    map(([children, loadedComponent, loadedParams, loadedMatchers, ...childrenLoaded]) => {
      const isControl = this.instance === DynInstanceType.Control;
      const hasAllChildren = children === childrenLoaded.length;
      const allChildrenValid = childrenLoaded.every(Boolean);
      const allChildrenLoaded = this.instance === DynInstanceType.Control ? true : hasAllChildren && allChildrenValid;

      const result = Boolean(loadedComponent && loadedParams && allChildrenLoaded);

      this.logger.nodeLoad(this, !isControl
        ? { loaded$: result, loadedComponent, loadedParams, loadedMatchers, children, childrenLoaded }
        : { loaded$: result, loadedComponent, loadedParams, loadedMatchers }
      );

      return result;
    }),
    distinctUntilChanged(),
    shareReplay(1),
  );

  constructor(
    private readonly formFactory: DynFormFactory,
    private readonly formHandlers: DynFormHandlers,
    private readonly logger: DynLogger,
    @Optional() @Inject(DYN_MODE)
    private readonly _mode$: Observable<DynControlMode>,
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
   * Snapshots
   */
  track(defaultMode?: DynControlMode): void {
    this._untrack$.next();
    this.loaded$.pipe(
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

  untrack(mode?: DynControlMode): void {
    this._untrack$.next();
    if (mode && this._snapshots.has(mode)) {
      this.patchValue(this._snapshots.get(mode));
    }
    this._snapshots.clear();
  }

  /**
   * Forms API
   */

  reset(value?: any, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this._control.reset(value, options);
  }

  patchValue(payload: any, options: { onlySelf?: boolean; emitEvent?: boolean; } = {}): void {
    this.whenReady().pipe(
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

  /**
   * Feature methods
   */

  whenReady(withMatchers = false): Observable<boolean> {
    return combineLatest([this.loaded$, this._loadedMatchers$]).pipe(
      takeUntil(this._unsubscribe$),
      map(([loaded, matchers]) => {
        return withMatchers ? loaded && matchers : loaded;
      }),
      filter<boolean>(Boolean),
      first(),
    );
  }

  updateParams(params: Partial<TParams>): void {
    this._paramsUpdates$.next(params);
  }

  // let the ControlNode know of an incoming hook
  callHook(event: DynControlHook): void {
    this.logger.hookCalled(this, event.hook, event.payload);

    this._hook$.next(event);
  }

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

  // listen another control value changes
  valueChanges(path: string): Observable<any>|undefined {
    const control = this.search(path);
    return control?.valueChanges.pipe(
      startWith(control.value),
    );
  }

  /**
   * Lifecycle methods
   */

  onInit(instance: DynInstanceType, config: DynBaseConfig): void {
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

    this.load(config);
  }

  setControl(control: TControl, instance = DynInstanceType.Group): void {
    // manual setup with no wiring nor config validation
    this._instance = instance;
    this._control = control;
  }

  load(
    config: Partial<DynBaseConfig> & DynFormConfigErrors,
  ): void {
    if (!this._control) {
      throw this.logger.nodeWithoutControl();
    }

    // keep the id of the control for the logs
    this._dynControl = config.control;

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
        ? config.controls?.length ?? 0
        : 0
    );

    // store the matchers to be processed in setupListeners
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

  setupListeners(): void {
    if (!this.isFormLoaded) {
      this.logger.setupListeners(this);
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
        this.whenReady().pipe(
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
    this.children.map(child => child.setupListeners());
  }

  onDestroy(): void {
    // TODO test unload with routed forms

    if (!this.isolated) {
      this.parent?.removeChild(this);
    }

    this._hook$.complete();
    this._paramsUpdates$.complete();
    this._visibility$.complete();
    this._errorMsg$.complete();
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._untrack$.next();
    this._untrack$.complete();
  }

  childsIncrement(): void {
    this._numChild$.next(this._numChild$.getValue() + 1);
    this.logger.nodeMethod(this, 'childsIncrement', { numChilds: this._numChild$.getValue() });
  }

  childsDecrement(): void {
    this._numChild$.next(this._numChild$.getValue() - 1);
    this.logger.nodeMethod(this, 'childsDecrement', { numChilds: this._numChild$.getValue() });
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
      this.dynControl || this.instance +
      `${this.index !== undefined ? `[${this.index}]` : ''}`,
    ];
  }

  private addChild(node: DynFormTreeNode<any, any>): void {
    this.logger.nodeMethod(this, 'addChild', { numChilds: this._numChild$.getValue(), children: this.children.length });

    this.children.push(node);
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
  private getMatchers(config: Partial<DynBaseConfig>): DynControlMatch[] {
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
