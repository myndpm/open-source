import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  Injector,
  Input,
  OnInit,
  TemplateRef,
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

  @ViewChild(TemplateRef, { static: true })
  content!: TemplateRef<any>;

  @ViewChild('container', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  @HostBinding('class')
  get cssClass(): string {
    return this.config?.factory?.cssClass || '';
  }

  constructor(
    private appRef: ApplicationRef,
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
      this.injector
      // hierarchy: each group must call the factory to resolve the right parent
      // this.ngContent()
    );
    ref.instance.config = this.config;

    ref.hostView.detectChanges();
  }

  protected ngContent(): any[][] {
    const viewRef = this.content.createEmbeddedView(null);
    this.appRef.attachView(viewRef);
    return [viewRef.rootNodes];
  }
}
