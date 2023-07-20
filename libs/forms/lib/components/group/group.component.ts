import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  DYN_MODE,
  DYN_MODE_CHILD,
  DYN_MODE_DEFAULTS,
  DYN_MODE_LOCAL,
  DynBaseConfig,
  DynControlBase,
  DynControlNode,
  DynFormResolver,
  DynInstanceType,
  DynMode,
  DynModes,
  recursive,
} from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynControlNode],
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class DynGroupComponent extends DynControlBase<any, UntypedFormGroup> implements OnInit, AfterViewInit {
  @Input() isolated = false;
  @Input() name?: string;
  @Input() customGroup?: UntypedFormGroup;
  @Input() controls?: DynBaseConfig[];
  @Input() modes?: DynModes;

  @Input()
  set mode(mode: DynMode) {
    this.modeLocal$.next(mode);
  }

  get mode(): DynMode {
    return this.mode$.value;
  }

  @Input()
  modeConfigs = (parent?: DynModes, local?: DynModes): DynModes => {
    return parent && local ? recursive(true, parent, local) : local ?? parent;
  }

  @Input()
  modeFactory = (mode: DynMode, name?: string): DynMode => {
    return mode;
  }

  // keeps track of the local input
  protected modeLocal$ = new BehaviorSubject<DynMode|null>(null);

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynMode>('');

  // internal injector with mode override
  configLayer?: Injector;

  constructor(
    private readonly injector: Injector,
    private readonly logger: DynLogger,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.node.mode = this.mode$;

    this.configLayer = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: DYN_MODE_CHILD,
          useValue: this.modeLocal$.pipe(filter(mode => mode !== null)),
        },
        {
          provide: DYN_MODE,
          useFactory: this.modeCalculator,
          deps: [
            [new SkipSelf(), DYN_MODE],
            DYN_MODE_CHILD,
          ],
        },
        {
          provide: DYN_MODE_LOCAL,
          useValue: this.modes,
        },
        {
          provide: DYN_MODE_DEFAULTS,
          useFactory: this.modeConfigs,
          deps: [
            [new SkipSelf(), new Optional(), DYN_MODE_DEFAULTS],
            DYN_MODE_LOCAL,
          ],
        },
        {
          provide: DynFormResolver,
          useClass: DynFormResolver,
          deps: [ // FIXME added for Stackblitz
            DynLogger,
            DYN_MODE_DEFAULTS,
          ],
        },
      ],
    });

    this.node.init({
      isolated: Boolean(this.isolated),
      instance: DynInstanceType.Group,
      name: this.name,
      control: 'DYN-GROUP',
      formControl: this.customGroup,
      controls: this.controls,
      component: this,
    });
    this.node.markParamsAsLoaded();

    // log the successful initialization
    this.logger.nodeLoaded('dyn-group', this.node);
  }

  ngAfterViewInit() {
    this.node.markAsLoaded();
  }

  modeCalculator = (
    parent$: Observable<DynMode>,
    child$: Observable<DynMode>,
  ): Observable<DynMode> => {
    return merge(parent$, child$).pipe(
      map(mode => this.modeFactory(mode, this.name)),
      distinctUntilChanged(),
      tap(mode => {
        this.logger.modeGroup(this.node, mode, this.name);
        this.mode$.next(mode);
      }),
      shareReplay(1),
    );
  }
}
