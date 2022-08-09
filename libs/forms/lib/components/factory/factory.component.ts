import {
  INJECTOR,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  SkipSelf,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  DYN_MODE,
  AbstractDynControl,
  AbstractDynWrapper,
  DynBaseConfig,
  DynFormConfigResolver,
  DynFormFactory,
  DynFormHandlers,
  DynFormTreeNode,
  DynFormRegistry,
  DynMode,
  DynVisibility,
  DynConfigWrapper,
} from '@myndpm/dyn-forms/core';
import { DYN_LOG_LEVEL, DynLogger, DynLogDriver } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dyn-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynFactoryComponent implements OnInit, OnDestroy {
  @Input() config!: DynBaseConfig;
  @Input() index?: number;
  @Input() injector?: Injector;

  @ViewChild('dynContainer', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  visibility: DynVisibility = 'VISIBLE';

  @HostBinding('class')
  get cssClass(): string {
    return [
      this.config.cssClass,
      // add the visibility class
      this.visibility ? `dyn-${this.visibility.toLowerCase()}` : null,
      // add a default class based on the name
      this.config.name ? `dyn-control-${this.config.name}` : null,
    ].filter(Boolean).join(' ');
  }

  // DynControl
  private controlRef!: ComponentRef<AbstractDynControl>;

  // retrieved from the proper injector
  private _injector!: Injector;
  private _mode$!: BehaviorSubject<DynMode>;
  private _configs!: DynFormConfigResolver;

  private _unsubscribe = new Subject<void>();

  constructor(
    @Inject(INJECTOR) private readonly parent: Injector,
    private readonly ref: ChangeDetectorRef,
    private readonly resolver: ComponentFactoryResolver,
    private readonly registry: DynFormRegistry,
    private readonly logger: DynLogger,
    private readonly node: DynFormTreeNode,
  ) {}

  ngOnInit(): void {
    // resolve the injector to use and get providers
    this._injector = this.injector ?? this.parent;
    this._mode$ = this._injector.get(DYN_MODE);
    this._configs = this._injector.get(DynFormConfigResolver);

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
              this.controlRef.instance.updateParams(newConfig.params, newConfig.paramFns);
            }
          } else {
            this.logger.controlInitializing(this.node, { control: newConfig.control, wrappers: newConfig.wrappers, name: newConfig.name });

            if (this.controlRef) {
              this.controlRef.hostView.detach();
            }
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
        // Dynamic Components has its own DynFormTreeNode
        {
          provide: DynFormTreeNode,
          useClass: DynFormTreeNode,
          deps: [ // FIXME added for Stackblitz
            DynFormFactory,
            DynFormHandlers,
            DynLogger,
            DYN_MODE,
            [new SkipSelf(), DynFormTreeNode],
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
        if (wrappers?.length) {
          // render wrappers
          const [config, ...subwrappers] = wrappers;
          const wrapperId = typeof config === 'string' ? config : config.wrapper;
          const wrapper = this.registry.getWrapper(wrapperId);

          const factory = this.resolver.resolveComponentFactory(wrapper.component);
          const ref = view.createComponent<AbstractDynWrapper>(factory, undefined, injector);

          ref.instance.config = typeof config === 'string'
            ? { wrapper: config, params: {} }
            : config;

          render(
            ref.instance.container,
            Injector.create({ providers, parent: injector }),
            subwrappers,
          );
        } else {
          // render the control
          if (!this.controlRef) {
            const factory = this.resolver.resolveComponentFactory(control.component);
            this.controlRef = view.createComponent<AbstractDynControl>(factory, undefined, injector);

            this.controlRef.instance.config = config;
            this.controlRef.instance.node.setIndex(this.index);
            // we let the corresponding DynFormTreeNode to initialize the control
            // and register itself in the Form Tree in the lifecycle methods

            this.controlRef.hostView.detectChanges();

            this.logger.controlInstantiated(this.controlRef.instance.node, {
              control: config.control,
              name: config.name,
              controls: config.controls?.length || 0,
            });

            // listen control.visibility$
            this.controlRef.instance.visibility$
              .pipe(
                startWith(config.visibility || 'VISIBLE'),
                takeUntil(this.controlRef.instance.onDestroy$),
              )
              .subscribe((visibility) => {
                if (this.visibility !== visibility) {
                  this.visibility = visibility;
                  this.ref.markForCheck();
                }
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
}
