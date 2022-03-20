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
  ViewEncapsulation,
} from '@angular/core';
import { WbsNodeViewModel } from '@app/view-models';
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
} from './services';

@Component({
  selector: 'wbs-tree',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsTreeComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('treelist') treelist!: TreeListComponent;
  @Input() nodes: WbsNodeViewModel[] | null | undefined;

  private currentSubscription!: Subscription;

  public draggedRowEl!: HTMLTableRowElement;

  public draggedItem!: WbsNodeViewModel;
  public targetedItem!: WbsNodeViewModel;

  public expandedKeys: number[] = [];
  public newParentId!: any;
  public isParentDragged: boolean = false;
  readonly tree$ = new BehaviorSubject<WbsNodeViewModel[] | undefined>(
    undefined
  );

  constructor(private renderer: Renderer2, private zone: NgZone) {}

  ngOnChanges(): void {
    if (this.tree$.getValue() != undefined || !this.nodes) return;

    this.tree$.next(this.nodes);
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
    this.currentSubscription = this.handleDragAndDrop();
    const tableRows: HTMLTableRowElement[] = Array.from(
      document.querySelectorAll('.k-grid-content .k-grid-table-wrap tbody tr')
    );
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
          this.draggedItem = <WbsNodeViewModel>(
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

          this.targetedItem = <WbsNodeViewModel>findDataItem(list, currentRow);

          // Prevent dragging parent row in its children
          let row: WbsNodeViewModel | undefined = this.targetedItem;
          this.isParentDragged = false;

          while (row!.parentId != null) {
            //while (row!.parentLevel! >= 1) {
            const parentRow: WbsNodeViewModel | undefined = list.find(
              (item) => item.id === row!.parentId
            );

            if (parentRow!.id === this.draggedItem.id) {
              this.isParentDragged = true;
              e.dataTransfer!.dropEffect = 'none';
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
            this.getDropPosition(list, currentRow, e.clientY, containerOffest);
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
          this.zone.run(() => this.tree$.next([...this.tree$.getValue()!]));
        }
      })
    );

    return sub;
  }

  private getDropPosition(
    list: WbsNodeViewModel[],
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
  private reorderRows(list: WbsNodeViewModel[], index: number): void {
    const draggedIndex = list.findIndex((x) => x.id === this.draggedItem.id);
    list.splice(draggedIndex, 1);

    const targetedIndex = list.findIndex((x) => x.id === this.targetedItem.id);
    list.splice(targetedIndex + index, 0, this.draggedItem);

    this.newParentId = this.draggedItem.parentId;
  }
}
