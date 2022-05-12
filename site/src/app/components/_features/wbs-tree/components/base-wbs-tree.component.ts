import { EventEmitter, Injectable, NgZone, Renderer2 } from '@angular/core';
import { WbsNodeView } from '@wbs/shared/view-models';
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
  WbsPhaseService,
} from '../services';
import { NodeCheck, Position } from '../models';
import {
  SelectableSettings,
  SelectionChangeEvent,
} from '@progress/kendo-angular-treelist';

@Injectable()
export abstract class BaseWbsTreeComponent<T extends WbsNodeView> {
  protected dataReady = false;
  private newParentId!: any;
  private isParentDragged: boolean = false;
  protected abstract currentSubscription: Subscription | undefined;

  draggedRowEl!: HTMLTableRowElement;
  draggedItem!: T;
  targetedItem!: T;
  expandedKeys: number[] = [];
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };
  selectedItems: any[] = [];
  abstract readonly selectedChanged: EventEmitter<WbsNodeView>;

  readonly tree$ = new BehaviorSubject<T[] | undefined>(undefined);

  constructor(
    private readonly renderer: Renderer2,
    private readonly wbsService: WbsPhaseService,
    private readonly zone: NgZone
  ) {}

  getContextData = (anchor: any): T => {
    return this.tree$.getValue()!.find((x) => x.id === anchor.id)!;
  };

  onToggle(): void {
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.currentSubscription?.unsubscribe();
      this.setDraggableRows();
    });
  }

  rowSelected(e: SelectionChangeEvent): void {
    this.selectedChanged.emit(e.items[0].dataItem);
  }

  abstract prePositionCheck(): NodeCheck;
  abstract postPositionCheck(position: Position): boolean;

  protected setDraggableRows(): void {
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
          this.draggedItem = <T>(
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

          this.targetedItem = <T>findDataItem(list, currentRow);

          // Prevent dragging parent row in its children
          let row: T | undefined = this.targetedItem;
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
          const newTree = this.wbsService.rebuildLevels(tree);

          this.zone.run(() => this.tree$.next(<T[]>newTree));
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
    list: T[],
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
      console.log(list);
      this.newParentId = currentRowParentId;
    }
  }

  //
  //  This moves the item which was dragged to just behind the target (dropped on) item.
  //
  private reorderRows(list: T[], index: number): void {
    const draggedIndex = list.findIndex((x) => x.id === this.draggedItem.id);
    list.splice(draggedIndex, 1);

    const targetedIndex = list.findIndex((x) => x.id === this.targetedItem.id);
    list.splice(targetedIndex + index, 0, this.draggedItem);

    this.newParentId = this.draggedItem.parentId;
  }
}
