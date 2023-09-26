import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { faEllipsisV } from '@fortawesome/pro-solid-svg-icons';
import {
  NgbPopover,
  NgbPopoverModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  RowReorderEvent,
  SelectableSettings,
  SelectionChangeEvent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { ActionMenuItem, Project } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { BehaviorSubject } from 'rxjs';
import { WbsActionButtonsComponent } from '../wbs-action-buttons';
import {
  DisciplineIconListComponent,
  LegendDisciplineComponent,
} from './components';
import { WbsPhaseService } from './services';

@Component({
  standalone: true,
  selector: 'wbs-tree',
  templateUrl: './wbs-tree.component.html',
  styleUrls: ['./wbs-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DisciplineIconListComponent,
    FillElementDirective,
    FontAwesomeModule,
    NgbPopoverModule,
    NgbTooltipModule,
    LegendDisciplineComponent,
    TranslateModule,
    TreeListModule,
    WbsActionButtonsComponent,
  ],
  providers: [WbsPhaseService],
})
export class WbsTreeComponent implements OnChanges {
  private currentPopover?: NgbPopover;

  @Input() menuItems?: ActionMenuItem[][] | null;
  @Input() view?: 'phase' | 'discipline' | null;
  @Input() nodes?: WbsNodeView[] | null;
  @Input() project?: Project | null;
  @Input() width?: number | null;
  @Input() rowReorderable = false;
  @Input() expandedKeys?: string[];
  @Input() isDraggable = true;
  @Output() readonly actionClicked = new EventEmitter<string>();
  @Output() readonly selectedChanged = new EventEmitter<WbsNodeView>();
  @Output() readonly reordered = new EventEmitter<[string, WbsNodeView[]]>();
  @Output() readonly showDetails = new EventEmitter<string>();
  @ViewChild(TreeListComponent) treelist!: TreeListComponent;

  clickedId?: string;
  expandedKeys2: string[] = [];
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  readonly faEllipsisV = faEllipsisV;
  readonly faCircleQuestion = faCircleQuestion;
  readonly tree$ = new BehaviorSubject<WbsNodeView[] | undefined>(undefined);

  constructor(
    private readonly messages: Messages,
    private readonly wbsService: WbsPhaseService,
    private readonly zone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).indexOf('expandedKeys') > -1) {
      if (this.expandedKeys && this.expandedKeys2.length === 0)
        this.expandedKeys2.push(...this.expandedKeys);
    }
    if (!this.nodes) return;

    this.tree$.next(structuredClone(this.nodes));
  }

  rowSelected(e: SelectionChangeEvent): void {
    this.selectedChanged.emit(e.items[0].dataItem);
  }

  togglePopup(popover: NgbPopover, data: WbsNodeView): void {
    if (this.currentPopover) this.currentPopover.close();

    popover.open({ data });

    this.currentPopover = popover;
  }

  rowReordered(e: RowReorderEvent) {
    if (e.dropPosition === 'forbidden') {
      this.messages.notify.error('You cannot drop a node under itself', false);
      this.tree$.next(structuredClone(this.nodes!));
      return;
    }

    const dragged: WbsNodeView = e.draggedRows[0].dataItem;
    const target: WbsNodeView = e.dropTargetRow?.dataItem;

    if (dragged.id === dragged.phaseId) {
      this.messages.notify.error(
        'You cannot move a phase from this screen.',
        false
      );
      this.tree$.next(structuredClone(this.nodes!));
      return;
    }

    const results = this.wbsService.reorder(
      structuredClone(this.nodes!),
      dragged,
      target,
      e.dropPosition
    );

    this.zone.run(() => this.tree$.next(results.rows));
    this.reordered.emit([dragged.id, results.rows]);
  }
}
