import {
  INJECTOR,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewContainerRef,
  Directive,
} from '@angular/core';
import {
  DYN_MODE,
  AbstractDynControl,
  AbstractDynWrapper,
  DynBaseConfig,
  DynConfigWrapper,
  DynControlNode,
  DynFormFactory,
  DynFormHandlers,
  DynFormRegistry,
  DynFormResolver,
  DynMode,
} from '@myndpm/dyn-forms/core';
import { DYN_LOG_LEVEL, DynLogger, DynLogDriver } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({ selector: '[dynFactory]' })
export class DynFactoryDirective implements OnInit, OnDestroy {
  @Input() config!: DynBaseConfig;
  @Input() index?: number;
  @Input() injector?: Injector;

  // DynControl
  private controlRef!: ComponentRef<AbstractDynControl>;

  // DynNodes created by this factory
  private nodes: DynControlNode[] = [];

  // retrieved from the proper injector
  private _injector!: Injector;
  private _mode$!: BehaviorSubject<DynMode>;
  private _configs!: DynFormResolver;

  private _unsubscribe = new Subject<void>();

  constructor(
    @Inject(INJECTOR) private readonly parent: Injector,
    private readonly resolver: ComponentFactoryResolver,
    private readonly registry: DynFormRegistry,
    private readonly logger: DynLogger,
    private readonly node: DynControlNode,
    private readonly container: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    // resolve the injector to use and get providers
    this._injector = this.injector ?? this.parent;
    this._mode$ = this._injector.get(DYN_MODE);
    this._configs = this._injector.get(DynFormResolver);

    // process the dynamic component with each mode change
    let config: DynBaseConfig;
    this._mode$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((mode) => {
        const newConfig = this._configs.getModeConfig(mode, this.config, this.node);

        // do not re-create the control if the config is the same
        if (!this._configs.areEqual(config, newConfig)) {
          // check if the params are the only changed ones
          if (this._configs.areEquivalent(config, newConfig)) {
            if (newConfig.params || newConfig.paramFns) {
              this.nodes.map(
                (node) => node.setupParams(newConfig.params, newConfig.paramFns, false),
              );
            }
          } else {
            this.logger.controlInitializing(this.node, { control: newConfig.control, wrappers: newConfig.wrappers, name: newConfig.name });

            this.container.clear();
            this.createControl(newConfig);
          }
          config = newConfig;
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private createControl(config: DynBaseConfig): void {
    try {
      const control = this.registry.getControl(config.control);

      const providers = [
        // new form-hierarchy sublevel
        // each Dynamic Component has its own DynControlNode service
        {
          provide: DynControlNode,
          useClass: DynControlNode,
          deps: [ // FIXME added for Stackblitz
            DynFormFactory,
            DynFormHandlers,
            DynLogger,
            DYN_MODE,
            [new SkipSelf(), DynControlNode],
          ],
        },
      ];
      const newInjectionLayer = Injector.create({
        providers: [
          ...providers,
          config?.debug ? [
            {
              provide: DYN_LOG_LEVEL,
              useValue: config.debug,
            },
            DynLogDriver,
            DynLogger,
          ] : [],
        ],
        parent: this._injector,
      });

      const render = (
        view: ViewContainerRef,
        injector: Injector,
        wrappers: DynConfigWrapper[] = [],
      ) => {
        let ref: ComponentRef<any>;

        if (wrappers?.length) {
          // render wrappers
          const [wconfig, ...subwrappers] = wrappers;
          const wrapperId = typeof wconfig === 'string' ? wconfig : wconfig.wrapper;
          const wrapper = this.registry.getWrapper(wrapperId);

          const factory = this.resolver.resolveComponentFactory(wrapper.component);
          ref = view.createComponent<AbstractDynWrapper>(factory, undefined, injector);

          this.addNode(ref.instance.node)
          ref.onDestroy(() => this.removeNode(ref.instance.node));

          ref.instance.config = config;
          ref.instance.wrapper = typeof wconfig === 'string' ? { wrapper: wconfig } : wconfig;

          this.logger.componentCreated(ref.instance.node, { wrapper: wrapperId });

          render(
            ref.instance.container,
            Injector.create({ providers, parent: injector }),
            subwrappers,
          );
        } else {
          // render the control
          if (!this.controlRef || this.controlRef.hostView.destroyed) {
            const factory = this.resolver.resolveComponentFactory(control.component);
            ref = this.controlRef = view.createComponent<AbstractDynControl>(factory, undefined, injector);

            this.addNode(ref.instance.node)
            ref.onDestroy(() => this.removeNode(ref.instance.node));

            ref.instance.config = config;
            ref.instance.node.setIndex(this.index);
            if (config.wrappers?.length) {
              ref.instance.node.parent.childrenIncrement(false);
            }
            // we let the corresponding DynControlNode to initialize the control
            // and register itself in the Form Tree in the lifecycle methods

            ref.changeDetectorRef.markForCheck();

            this.logger.componentCreated(ref.instance.node, {
              control: config.control,
              name: config.name,
              controls: config.controls?.length || 0,
            });
          } else {
            view.insert(this.controlRef.hostView);
          }
        }
      }

      render(this.container, newInjectionLayer, config.wrappers);

    } catch(e) {
      // log any error happening in the control instantiation
      console.error(e);
    }
  }

  addNode(node: DynControlNode): void {
    this.nodes.push(node);
  }

  removeNode(node: DynControlNode): void {
    this.nodes.some((child, i) => {
      return (child === node) ? this.nodes.splice(i, 1) : false;
    });
  }
}
