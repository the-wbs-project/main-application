import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { WbsPhaseNode } from '@app/models';
import { WbsNodePhaseViewModel } from '@app/view-models';
import { TreeListComponent } from '@progress/kendo-angular-treelist';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  Subscription,
  take,
} from 'rxjs';
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
  WbsService,
} from './services';

@Component({
  selector: 'wbs-tree',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WbsTreeComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('treelist') treelist!: TreeListComponent;
  @Input() nodes: WbsPhaseNode[] | null | undefined;

  private dataReady = false;
  private newParentId!: any;
  private isParentDragged: boolean = false;
  private currentSubscription!: Subscription;

  draggedRowEl!: HTMLTableRowElement;
  draggedItem!: WbsNodePhaseViewModel;
  targetedItem!: WbsNodePhaseViewModel;
  expandedKeys: number[] = [];

  readonly tree$ = new BehaviorSubject<WbsNodePhaseViewModel[] | undefined>(
    undefined
  );

  constructor(
    private readonly renderer: Renderer2,
    private readonly wbsService: WbsService,
    private readonly zone: NgZone
  ) {}

  ngOnChanges(): void {
    if (!this.nodes) return;

    this.tree$.next(this.nodes);
    this.dataReady = true;
    this.setDraggableRows();
  }

  ngOnDestroy(): void {
    this.currentSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.setDraggableRows();
  }

  onToggle(): void {
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.currentSubscription.unsubscribe();
      this.setDraggableRows();
    });
  }

  private setDraggableRows(): void {
    if (!this.dataReady) return;

    const tableRows: HTMLTableRowElement[] = Array.from(
      document.querySelectorAll('.k-grid-content .k-grid-table-wrap tbody tr')
    );

    if (tableRows.length === 0) {
      setTimeout(() => {
        this.setDraggableRows();
      }, 100);
    }
    this.currentSubscription = this.handleDragAndDrop();
    tableRows.forEach((row) => {
      this.renderer.setAttribute(row, 'draggable', 'true');
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
          this.draggedItem = <WbsNodePhaseViewModel>(
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

        if (element.tagName === 'TD' || element.tagName === 'SPAN') {
          const currentRow = <HTMLTableRowElement>closest(element, tableRow);
          const list = this.tree$.getValue()!;

          this.targetedItem = <WbsNodePhaseViewModel>(
            findDataItem(list, currentRow)
          );

          // Prevent dragging parent row in its children
          let row: WbsNodePhaseViewModel | undefined = this.targetedItem;
          this.isParentDragged = false;

          if (this.targetedItem.parentId == null) {
            this.isParentDragged = true;
          } else {
            while (row!.parentId != null) {
              //while (row!.parentLevel! >= 1) {
              const parentRow: WbsNodePhaseViewModel | undefined = list.find(
                (item) => item.id === row!.parentId
              );

              if (parentRow!.id === this.draggedItem.id) {
                this.isParentDragged = true;
                e.dataTransfer!.dropEffect = 'none';
                break;
              }
              row = parentRow;
            }

            if (isSameRow(this.draggedItem, this.targetedItem)) {
              e.dataTransfer!.dropEffect = 'none';
            }

            if (
              !this.isParentDragged &&
              !isSameRow(this.draggedItem, this.targetedItem)
            ) {
              const containerOffest = { top: 0, left: 0 };
              this.getDropPosition(
                list,
                currentRow,
                e.clientY,
                containerOffest
              );
              this.draggedRowEl = currentRow;
            }
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
          this.wbsService.rebuildLevels(tree);

          this.zone.run(() => this.tree$.next([...tree]));
        }
      })
    );

    return sub;
  }

  private getDropPosition(
    list: WbsNodePhaseViewModel[],
    target: HTMLTableRowElement,
    clientY: number,
    containerOffset: { top: number; left: number }
  ): void {
    const item: HTMLElement | null = closestWithMatch(
      target,
      '.k-grid-table-wrap tbody tr'
    );
    const content: HTMLElement | null = getContentElement(item!);

    const itemViewPortCoords: DOMRect = content!.getBoundingClientRect();
    const itemDivisionHeight: number = itemViewPortCoords.height / 4;
    const pointerPosition: number = clientY - containerOffset.top;
    const itemTop: number = itemViewPortCoords.top - containerOffset.top;

    const isBefore: boolean = pointerPosition < itemTop + itemDivisionHeight;
    const isAfter: boolean =
      pointerPosition >=
      itemTop + itemViewPortCoords.height - itemDivisionHeight;
    const isOverTheSame: boolean =
      this.draggedItem.title === this.targetedItem.title;

    removeDropHint(this.draggedRowEl);
    focusRow(target);

    const draggedRowParentId: any = this.draggedItem.parentId;
    const currentRowParentId: any = this.targetedItem.parentId;

    if (currentRowParentId == null) return;

    if (isBefore) {
      showDropHint(target, 'before');
      this.reorderRows(list, 0);
      if (draggedRowParentId !== currentRowParentId) {
        this.newParentId = currentRowParentId;
      }
    }

    if (isAfter) {
      showDropHint(target, 'after');
      this.reorderRows(list, 1);
      if (draggedRowParentId !== currentRowParentId) {
        this.newParentId = currentRowParentId;
      }
    }

    if (!isOverTheSame && !isBefore && !isAfter) {
      this.newParentId = this.targetedItem.id;
    }
  }

  //
  //  This moves the item which was dragged to just behind the target (dropped on) item.
  //
  private reorderRows(list: WbsNodePhaseViewModel[], index: number): void {
    const draggedIndex = list.findIndex((x) => x.id === this.draggedItem.id);
    list.splice(draggedIndex, 1);

    const targetedIndex = list.findIndex((x) => x.id === this.targetedItem.id);
    list.splice(targetedIndex + index, 0, this.draggedItem);

    this.newParentId = this.draggedItem.parentId;
  }
}
