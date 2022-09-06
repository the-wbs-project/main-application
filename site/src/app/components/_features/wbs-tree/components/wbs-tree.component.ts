import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { faEllipsisV } from '@fortawesome/pro-solid-svg-icons';
import {
  SelectableSettings,
  SelectionChangeEvent,
  TreeListComponent,
} from '@progress/kendo-angular-treelist';
import {
  ActionMenuItem,
  MenuItem,
  Project,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/shared/models';
import { IdService } from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  Subscription,
  take,
} from 'rxjs';
import { NodeCheck, Position } from '../models';
import {
  closest,
  closestWithMatch,
  findDataItem,
  focusRow,
  getContentElement,
  isSameRow,
  removeDropHint,
  showDropHint,
  tableRow,
  WbsPhaseService,
} from '../services';

@Component({
  selector: 'wbs-tree',
  templateUrl: './wbs-tree.component.html',
  styleUrls: ['./wbs-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsTreeComponent implements OnChanges, OnDestroy {
  protected dataReady = false;
  private newParentId!: any;
  private isParentDragged: boolean = false;
  private currentSubscription: Subscription | undefined;

  @Input() menuItems?: ActionMenuItem[][] | null;
  @Input() view?: PROJECT_NODE_VIEW_TYPE | null;
  @Input() nodes?: WbsNodeView[] | null;
  @Input() project?: Project | null;
  @Input() width?: number | null;
  @Input() detailsUrlPrefix?: string[];
  @Input() isDraggable = true;
  @Output() readonly actionClicked = new EventEmitter<string>();
  @Output() readonly selectedChanged = new EventEmitter<WbsNodeView>();
  @Output() readonly reordered = new EventEmitter<[string, WbsNodeView[]]>();
  @ViewChild(TreeListComponent) treelist!: TreeListComponent;

  readonly id = IdService.generate();
  draggedRowEl!: HTMLTableRowElement;
  draggedItem!: WbsNodeView;
  targetedItem!: WbsNodeView;
  expandedKeys: number[] = [];
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };
  selectedItems: any[] = [];

  readonly faEllipsisV = faEllipsisV;
  readonly faCircleQuestion = faCircleQuestion;
  readonly tree$ = new BehaviorSubject<WbsNodeView[] | undefined>(undefined);

  constructor(
    private readonly renderer: Renderer2,
    private readonly wbsService: WbsPhaseService,
    private readonly zone: NgZone
  ) {}

  ngOnChanges(): void {
    if (!this.nodes) return;

    this.tree$.next(JSON.parse(JSON.stringify(this.nodes)));
    this.dataReady = true;
    this.setDraggableRows();
  }

  ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  getContextData = (anchor: any): WbsNodeView => {
    return this.tree$.getValue()!.find((x) => x.id === anchor.id)!;
  };

  buildUrl(taskId: string): string[] {
    return [...(this.detailsUrlPrefix ?? []), taskId];
  }

  onToggle(): void {
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.currentSubscription?.unsubscribe();
      this.setDraggableRows();
    });
  }

  rowSelected(e: SelectionChangeEvent): void {
    this.selectedChanged.emit(e.items[0].dataItem);
  }

  prePositionCheck(): NodeCheck {
    const results: NodeCheck = {
      cancelEffect: false,
      isParentDragged: false,
      newParentsAllowed: true,
    };
    let row: WbsNodeView | undefined = this.targetedItem;
    const list = this.tree$.getValue()!;
    //
    //  If the we are trying to drag a node that is locked to a parent, make sure that's not happening
    //
    if (this.draggedItem.phaseInfo?.isLockedToParent) {
      results.newParentsAllowed = false;
      console.log('no new parents');
      if (
        this.draggedItem.phaseInfo?.isDisciplineNode &&
        this.draggedItem.parentId !== this.targetedItem.parentId
      ) {
        console.log('cant drag disicpline nodes to new parents');
        results.cancelEffect = true;

        return results;
      }
    }
    while (row!.parentId != null) {
      const parentRow = list.find((item) => item.id === row!.parentId);

      if (parentRow!.id === this.draggedItem.id) {
        results.isParentDragged = true;
        results.cancelEffect = true;
        break;
      }
      row = parentRow;
    }

    return results;
  }

  postPositionCheck(position: Position): boolean {
    //
    //  If you're trying to drop this INTO a discipline sync node, STOP IT!
    //
    if (
      this.targetedItem.phaseInfo?.syncWithDisciplines &&
      !position.isAfter &&
      !position.isBefore
    ) {
      return false;
    }
    //
    //  If you're trying to drop this before or after a a sync'ed child, STOP IT
    //
    if (
      !this.draggedItem.phaseInfo?.isLockedToParent &&
      this.targetedItem.phaseInfo?.isLockedToParent &&
      (position.isAfter || position.isBefore)
    ) {
      console.log('youre trying to drop this before or after a a synced child');
      return false;
    }

    return true;
  }

  protected setDraggableRows(): void {
    if (!this.dataReady) return;

    const tableRows: HTMLTableRowElement[] = Array.from(
      document.querySelectorAll(
        `.${this.id} .k-grid-content .k-grid-table-wrap tbody tr`
      )
    );

    if (tableRows.length === 0) {
      setTimeout(() => {
        this.setDraggableRows();
      }, 100);
      return;
    }
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }
    this.currentSubscription = this.handleDragAndDrop();
    tableRows.forEach((row) => {
      this.renderer.setAttribute(row, 'draggable', this.isDraggable.toString());
    });
  }

  private handleDragAndDrop(): Subscription {
    const table: HTMLElement[] = Array.from(
      document.querySelectorAll('.k-grid-content .k-grid-table-wrap tbody')
    );
    const sub = new Subscription(() => {});
    const dragStart: Observable<DragEvent> = fromEvent<DragEvent>(
      table,
      'dragstart'
    );
    const dragOver: Observable<DragEvent> = fromEvent<DragEvent>(
      table,
      'dragover'
    );
    const dragEnd: Observable<DragEvent> = fromEvent<DragEvent>(
      table,
      'dragend'
    );

    sub.add(
      dragStart.subscribe((e: DragEvent) => {
        this.draggedRowEl = <HTMLTableRowElement>e.target;
        if (this.draggedRowEl.tagName === 'TR') {
          this.draggedItem = <WbsNodeView>(
            findDataItem(this.tree$.getValue()!, this.draggedRowEl)
          );
        }
      })
    );

    sub.add(
      dragOver.subscribe((e: DragEvent) => {
        e.preventDefault();
        removeDropHint(this.draggedRowEl);

        const element = <HTMLElement>e.target;
        let newParentsAllowed = true;

        if (element.tagName === 'TD' || element.tagName === 'SPAN') {
          const currentRow = <HTMLTableRowElement>closest(element, tableRow);
          const list = this.tree$.getValue()!;

          this.targetedItem = <WbsNodeView>findDataItem(list, currentRow);

          // Prevent dragging parent row in its children
          this.isParentDragged = false;

          //
          //  If we are trying to drag an item with no parent it's a root node, do not allow.
          //
          if (this.draggedItem.parentId == null) {
            this.isParentDragged = true;
            e.dataTransfer!.dropEffect = 'none';
            return;
          }

          const check = this.prePositionCheck();

          newParentsAllowed = check.newParentsAllowed;

          if (check.isParentDragged)
            this.isParentDragged = check.isParentDragged;

          if (check.cancelEffect) {
            e.dataTransfer!.dropEffect = 'none';
            return;
          }

          if (isSameRow(this.draggedItem, this.targetedItem)) {
            e.dataTransfer!.dropEffect = 'none';
          }

          if (
            !this.isParentDragged &&
            !isSameRow(this.draggedItem, this.targetedItem)
          ) {
            const containerOffest = { top: 0, left: 0 };
            const position = this.getDropPosition(
              currentRow,
              e.clientY,
              containerOffest
            );

            const postCheck = this.postPositionCheck(position);

            if (!postCheck) {
              e.dataTransfer!.dropEffect = 'none';
              return;
            }
            this.reposition(list, currentRow, position, newParentsAllowed);
            this.draggedRowEl = currentRow;
          }
        }
      })
    );

    sub.add(
      dragEnd.subscribe((e: DragEvent) => {
        e.preventDefault();
        removeDropHint(this.draggedRowEl);

        if (
          this.draggedItem.id !== this.targetedItem.id &&
          !this.isParentDragged
        ) {
          this.draggedItem.parentId = this.newParentId;

          const tree = this.tree$.getValue()!;
          const index = tree.findIndex((x) => x.id === this.draggedItem.id);

          if (index > -1) {
            const oneUp = tree[index - 1];
            //
            //  If parent, set level to 1
            //
            if (oneUp.id === this.draggedItem.parentId) {
              this.draggedItem.order = 1;
            } else {
              this.draggedItem.order = oneUp.order + 1;
            }
            //
            //  Now increment all others
            //
            for (const child of tree.filter(
              (x) =>
                x.parentId === this.draggedItem.parentId &&
                x.id !== this.draggedItem.id &&
                x.order >= this.draggedItem.order
            )) {
              child.order++;
            }
          }
          //
          //  Rebuild Level
          //
          const results = this.wbsService.rebuildLevels(tree);

          console.log(results.changedIds);

          this.zone.run(() => this.tree$.next(results.rows));
          this.reordered.emit([this.draggedItem.id, results.rows]);
        }
      })
    );

    return sub;
  }

  private getDropPosition(
    target: HTMLTableRowElement,
    clientY: number,
    containerOffset: { top: number; left: number }
  ): Position {
    const item: HTMLElement | null = closestWithMatch(
      target,
      '.k-grid-table-wrap tbody tr'
    );
    const content: HTMLElement | null = getContentElement(item!);

    const itemViewPortCoords: DOMRect = content!.getBoundingClientRect();
    const itemDivisionHeight: number = itemViewPortCoords.height / 4;
    const pointerPosition: number = clientY - containerOffset.top;
    const itemTop: number = itemViewPortCoords.top - containerOffset.top;

    return {
      isAfter:
        pointerPosition >=
        itemTop + itemViewPortCoords.height - itemDivisionHeight,
      isBefore: pointerPosition < itemTop + itemDivisionHeight,
      isOverTheSame: this.draggedItem.title === this.targetedItem.title,
    };
  }

  private reposition(
    list: WbsNodeView[],
    target: HTMLTableRowElement,
    position: Position,
    newParentsAllowed: boolean
  ): void {
    removeDropHint(this.draggedRowEl);
    focusRow(target);

    const draggedRowParentId: any = this.draggedItem.parentId;
    const currentRowParentId: any = this.targetedItem.parentId;

    if (currentRowParentId == null) return;

    if (newParentsAllowed) {
      if (position.isBefore) {
        showDropHint(target, 'before');
        this.reorderRows(list, 0);
        if (draggedRowParentId !== currentRowParentId) {
          this.newParentId = currentRowParentId;
        }
      }

      if (position.isAfter) {
        showDropHint(target, 'after');
        this.reorderRows(list, 1);
        if (draggedRowParentId !== currentRowParentId) {
          this.newParentId = currentRowParentId;
        }
      }

      if (!position.isOverTheSame && !position.isBefore && !position.isAfter) {
        this.newParentId = this.targetedItem.id;
      }
    } else {
      if (position.isBefore) {
        console.log('before!');
        showDropHint(target, 'before');
        this.reorderRows(list, 0);
      }

      if (position.isAfter) {
        showDropHint(target, 'after');
        this.reorderRows(list, 1);
      }
      this.newParentId = currentRowParentId;
    }
  }

  //
  //  This moves the item which was dragged to just behind the target (dropped on) item.
  //
  private reorderRows(list: WbsNodeView[], index: number): void {
    const draggedIndex = list.findIndex((x) => x.id === this.draggedItem.id);
    list.splice(draggedIndex, 1);

    const targetedIndex = list.findIndex((x) => x.id === this.targetedItem.id);
    list.splice(targetedIndex + index, 0, this.draggedItem);

    this.newParentId = this.draggedItem.parentId;
  }
}
