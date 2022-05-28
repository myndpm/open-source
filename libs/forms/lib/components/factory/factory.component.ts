import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Inject,
  INJECTOR,
  Injector,
  Input,
  OnInit,
  SkipSelf,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractDynControl,
  DynBaseConfig,
  DynControlMode,
  DynControlVisibility,
  DynFormFactory,
  DynFormHandlers,
  DynFormMode,
  DynFormTreeNode,
  DynFormRegistry,
  DYN_MODE,
} from '@myndpm/dyn-forms/core';
import { DYN_LOG_LEVEL, DynLogger, DynLogDriver } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dyn-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynFactoryComponent implements OnInit {
  @Input() config!: DynBaseConfig;
  @Input() index?: number;
  @Input() injector?: Injector;

  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  visibility: DynControlVisibility = 'VISIBLE';

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
  private component!: ComponentRef<AbstractDynControl>;

  // retrieved from the proper injector
  private _injector!: Injector;
  private _mode$!: BehaviorSubject<DynControlMode>;
  private _formMode!: DynFormMode;

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
    this._formMode = this._injector.get(DynFormMode);

    // process the dynamic component with each mode change
    let config: DynBaseConfig;
    this._mode$.subscribe(() => {
      const newConfig = this._formMode.getModeConfig(this.config);

      // do not re-create the control if the config is the same
      if (!this._formMode.deepEqual(config, newConfig)) {
        // check if the params are the only changed ones
        if (this._formMode.areConfigsEquivalent(config, newConfig)) {
          if (newConfig.params || newConfig.paramFns) {
            this.component.instance.updateParams(newConfig.params, newConfig.paramFns);
          }
        } else {
          this.logger.controlInitializing(this.node, { control: newConfig.control, name: newConfig.name });

          this.container.clear();
          this.createFrom(newConfig);
        }
        config = newConfig;
      }
    });
  }

  private createFrom(config: DynBaseConfig): void {
    try {
      const control = this.registry.get(config.control);
      const factory = this.resolver.resolveComponentFactory(control.component);

      const newInjectionLayer = Injector.create({
        providers: [
          // new form-hierarchy sublevel
          // DynControls has its own DynFormTreeNode
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

      this.component = this.container.createComponent<AbstractDynControl>(
        factory,
        undefined,
        newInjectionLayer,
      );
      this.component.instance.config = config;
      this.component.instance.node.setIndex(this.index);
      // we let the corresponding DynFormTreeNode to initialize the control
      // and register itself in the Form Tree in the lifecycle methods

      this.component.hostView.detectChanges();

      this.logger.controlInstantiated(this.component.instance.node, {
        control: config.control,
        name: config.name,
        controls: config.controls?.length || 0,
      });

      // listen control.visibility$
      this.component.instance.visibility$
        .pipe(
          startWith(config.visibility || 'VISIBLE'),
          takeUntil(this.component.instance.onDestroy$),
        )
        .subscribe((visibility) => {
          if (this.visibility !== visibility) {
            this.visibility = visibility;
            this.ref.markForCheck();
          }
        });

    } catch(e) {
      // log any error happening in the control instantiation
      console.error(e);
    }
  }
}
