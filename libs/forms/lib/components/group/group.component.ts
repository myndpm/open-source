import { AfterViewInit, ChangeDetectionStrategy, Component, Injector, Input, OnInit, SkipSelf } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DYN_MODE,
  DYN_MODE_CHILD,
  DynBaseConfig,
  DynControlMode,
  DynControlNode,
  DynFormTreeNode,
  DynInstanceType,
} from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { merge, Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function modeFactory(
  parent$: Observable<DynControlMode>,
  child$: Observable<DynControlMode>,
): Observable<DynControlMode> {
  return merge(parent$, child$).pipe(shareReplay(1));
}

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormTreeNode],
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class DynGroupComponent extends DynControlNode<any, FormGroup> implements OnInit, AfterViewInit {
  @Input() isolated = false;
  @Input() group!: FormGroup;
  @Input() name?: string;
  @Input() controls?: DynBaseConfig[];

  @Input()
  set mode(mode: DynControlMode) {
    this.mode$.next(mode);
  }

  // stream mode changes via DYN_MODE
  protected mode$ = new Subject<DynControlMode | undefined>();

  // internal injector with mode override
  configLayer?: Injector;

  constructor(
    injector: Injector,
    private readonly logger: DynLogger,
  ) {
    super(injector);

    this.configLayer = Injector.create({
      parent: injector,
      providers: [
        {
          provide: DYN_MODE_CHILD,
          useValue: this.mode$.asObservable(),
        },
        {
          provide: DYN_MODE,
          useFactory: modeFactory,
          deps: [
            [new SkipSelf(), DYN_MODE],
            DYN_MODE_CHILD,
          ],
        },
      ],
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.node.parent?.instance === DynInstanceType.Container) {
      this.node.parent.childsIncrement();
    }

    this.node.setControl(this.group);
    this.node.load({
      name: this.name,
      controls: this.controls,
      isolated: Boolean(this.isolated),
    });
    this.node.markParamsAsLoaded();

    // log the successful initialization
    this.logger.nodeLoaded('dyn-group', this.node);
  }

  ngAfterViewInit() {
    this.node.markAsLoaded();
  }
}
