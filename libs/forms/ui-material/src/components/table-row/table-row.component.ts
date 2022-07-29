import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DYN_MODE,
  DYN_MODE_CHILD,
  DYN_MODE_DEFAULTS,
  DYN_MODE_LOCAL,
  DynBaseConfig,
  DynControlMode,
  DynControlModes,
  DynControlNode,
  DynFormConfigResolver,
  DynFormTreeNode,
  DynInstanceType,
  recursive,
} from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { merge, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'dyn-mat-table-row',
  templateUrl: './table-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormTreeNode],
})
/**
 * This component just wraps the rows and its mat-cells.
 */
export class DynMatTableRowComponent extends DynControlNode<any, FormGroup> implements OnInit, AfterViewInit {
  @Input() group!: FormGroup;
  @Input() name?: string;
  @Input() controls?: DynBaseConfig[];
  @Input() modes?: DynControlModes;

  @Input()
  set mode(mode: DynControlMode) {
    this.modeLocal$.next(mode);
  }

  get mode(): DynControlMode {
    return this.mode$.getValue();
  }

  @Input()
  modeConfigs = (parent?: DynControlModes, local?: DynControlModes): DynControlModes => {
    return parent && local ? recursive(true, parent, local) : local ?? parent;
  }

  @Input()
  modeFactory = (mode: DynControlMode, name?: string): DynControlMode => {
    return mode;
  }

  @Output() edit = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  // keeps track of the local input
  protected modeLocal$ = new BehaviorSubject<DynControlMode>('');

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynControlMode>('');

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
          useValue: this.modeLocal$.asObservable(),
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
          provide: DynFormConfigResolver,
          useClass: DynFormConfigResolver,
          deps: [ // FIXME added for Stackblitz
            DynLogger,
            DYN_MODE_DEFAULTS,
          ],
        },
      ],
    });

    if (this.node.parent?.instance === DynInstanceType.Container) {
      this.node.parent.childsIncrement();
    }

    this.node.setControl(this.group);
    this.node.load({
      name: this.name,
      controls: this.controls,
      isolated: false,
    });
    this.node.markParamsAsLoaded();

    // log the successful initialization
    this.logger.nodeLoaded('dyn-mat-table-row', this.node);
  }

  ngAfterViewInit(): void {
    this.node.markAsLoaded();
  }

  onEdit(): void {
    this.node.track();
    this.edit.emit();
  }

  onCancel(): void {
    this.node.untrack('row');
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit();
  }

  modeCalculator = (
    parent$: Observable<DynControlMode>,
    child$: Observable<DynControlMode>,
  ): Observable<DynControlMode> => {
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
