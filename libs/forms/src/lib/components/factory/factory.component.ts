import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  Inject,
  INJECTOR,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  DynBaseConfig,
  DynControlContext,
  DynFormContext,
  DynFormRegistry,
  DYN_CONTEXT,
} from '@myndpm/dyn-forms/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dyn-factory',
  templateUrl: './factory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactoryComponent implements OnInit {
  @Input() config!: DynBaseConfig;
  @Input() injector?: Injector;

  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  @HostBinding('class')
  get cssClass(): string {
    return this.config?.factory?.cssClass || '';
  }

  private _injector!: Injector;
  private _context$!: BehaviorSubject<DynControlContext>;
  private _formContext!: DynFormContext;

  constructor(
    @Inject(INJECTOR) private parent: Injector,
    private resolver: ComponentFactoryResolver,
    private registry: DynFormRegistry,
  ) {}

  ngOnInit(): void {
    // resolve the injector to use and g et providers
    this._injector = this.injector ?? this.parent;
    this._context$ = this._injector.get(DYN_CONTEXT);
    this._formContext = this._injector.get(DynFormContext);

    this._context$.subscribe(() => {
      this.container.clear();
      this.createFrom(this._formContext.getContextConfig(this.config));
    });
  }

  private createFrom(config: DynBaseConfig): void {
    const control = this.registry.resolve(config.control);
    const factory = this.resolver.resolveComponentFactory(control.component);

    const ref = this.container.createComponent<any>(
      factory,
      undefined,
      this._injector,
    );
    ref.instance.config = config;

    ref.hostView.detectChanges();
  }
}
