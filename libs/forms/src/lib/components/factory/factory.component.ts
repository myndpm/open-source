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
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynBaseConfig, DynControlContext, DynFormRegistry } from '@myndpm/dyn-forms/core';

@Component({
  selector: 'dyn-factory',
  templateUrl: './factory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactoryComponent implements OnInit {
  @Input() config!: DynBaseConfig;
  @Input() injector?: Injector;
  @Input() context?: DynControlContext;

  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  @HostBinding('class')
  get cssClass(): string {
    return this.config?.factory?.cssClass || '';
  }

  constructor(
    @Inject(INJECTOR) private parent: Injector,
    private resolver: ComponentFactoryResolver,
    private registry: DynFormRegistry,
  ) {}

  ngOnInit(): void {
    this.createFrom(this.config);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log({ changes })
  }

  private createFrom(config: DynBaseConfig): void {
    const control = this.registry.resolve(config.control);
    const factory = this.resolver.resolveComponentFactory(control.component);

    const ref = this.container.createComponent<any>(
      factory,
      undefined,
      this.injector ?? this.parent,
    );
    ref.instance.config = config;

    ref.hostView.detectChanges();
  }
}
