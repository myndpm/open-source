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
import { DynLogger } from '@myndpm/dyn-forms/logger';
import deepEqual from 'fast-deep-equal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dyn-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynFactoryComponent implements OnInit {
  @Input() config!: DynBaseConfig;
  @Input() injector?: Injector;

  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  visibility: DynControlVisibility = 'VISIBLE';

  @HostBinding('class')
  get cssClass(): string {
    return [
      this.config.factory?.cssClass,
      // add the visibility class
      this.visibility ? `dyn-${this.visibility.toLowerCase()}` : null,
      // add a default class based on the name
      this.config.name ? `dyn-control-${this.config.name}` : null,
    ].filter(Boolean).join(' ');
  }

  // DynControl
  private component!: ComponentRef<AbstractDynControl>

  // retrieved from the proper injector
  private _newLayer!: Injector;
  private _mode$!: BehaviorSubject<DynControlMode>;
  private _formMode!: DynFormMode;

  constructor(
    @Inject(INJECTOR) private readonly parent: Injector,
    private readonly ref: ChangeDetectorRef,
    private readonly resolver: ComponentFactoryResolver,
    private readonly registry: DynFormRegistry,
    private readonly logger: DynLogger,
  ) {}

  ngOnInit(): void {
    // resolve the injector to use and get providers
    const injector = this.injector ?? this.parent;
    this._mode$ = injector.get(DYN_MODE);
    this._formMode = injector.get(DynFormMode);

    this._newLayer = Injector.create({
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
            [new SkipSelf(), DynFormTreeNode],
          ],
        },
      ],
      parent: injector,
    });

    // process the dynamic component with each mode change
    let config: DynBaseConfig;
    this._mode$.subscribe(() => {
      const newConfig = this._formMode.getModeConfig(this.config);

      // do not re-create the control if the config is the same
      if (!deepEqual(config, newConfig)) {
        // check if the params are the only changed ones
        if (
          config?.control === newConfig.control &&
          deepEqual(config?.factory, newConfig.factory) &&
          deepEqual(config?.options, newConfig.options)
        ) {
          if (newConfig.params || newConfig.paramFns) {
            this.component.instance.updateParams(newConfig.params, newConfig.paramFns);
          }
        } else {
          // new config
          this.logger.controlInstance(newConfig);

          this.container.clear();
          this.createFrom(newConfig);
        }
        config = newConfig;
      }
    });
  }

  private createFrom(config: DynBaseConfig): void {
    const control = this.registry.resolve(config.control);
    const factory = this.resolver.resolveComponentFactory(control.component);

    this.component = this.container.createComponent<AbstractDynControl>(
      factory,
      undefined,
      this._newLayer,
    );
    this.component.instance.config = config;
    // we let the corresponding DynFormTreeNode to initialize the control
    // and register itself in the Form Tree in the lifecycle methods

    this.component.hostView.detectChanges();

    // listen control.visibility$
    this.component.instance.visibility$
      .pipe(takeUntil(this.component.instance.onDestroy$))
      .subscribe((visibility) => {
        this.visibility = visibility;
        this.ref.markForCheck();
      });
  }
}
