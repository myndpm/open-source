import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynBaseConfig, DynFormRegistry } from '@myndpm/dyn-forms/core';

@Component({
  selector: 'dyn-factory',
  templateUrl: './factory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactoryComponent implements OnInit {
  @Input() config!: DynBaseConfig;

  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  @HostBinding('class')
  get cssClass(): string {
    return this.config?.factory?.cssClass || '';
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private registry: DynFormRegistry,
  ) {}

  ngOnInit(): void {
    const control = this.registry.resolve(this.config.control);
    const factory = this.resolver.resolveComponentFactory(control.component);

    const ref = this.container.createComponent<any>(
      factory,
      undefined,
      this.injector,
    );
    ref.instance.config = this.config;

    ref.hostView.detectChanges();
  }
}
