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
import { WbsPhaseNode } from '@wbs/models';
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

declare type Position = {
  isBefore: boolean;
  isAfter: boolean;
  isOverTheSame: boolean;
};

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
  @Input() nodes: WbsPhaseNode[] | null | undefined;

  private dataReady = false;
  private newParentId!: any;
  private isParentDragged: boolean = false;
  private currentSubscription!: Subscription;

  draggedRowEl!: HTMLTableRowElement;
  draggedItem!: WbsPhaseNode;
  targetedItem!: WbsPhaseNode;
  expandedKeys: number[] = [];

  readonly tree$ = new BehaviorSubject<WbsPhaseNode[] | undefined>(undefined);

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

  getContextData = (anchor: any): WbsPhaseNode => {
    return this.tree$.getValue()!.find((x) => x.id === anchor.id)!;
  };

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
          this.draggedItem = <WbsPhaseNode>(
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

          this.targetedItem = <WbsPhaseNode>findDataItem(list, currentRow);

          // Prevent dragging parent row in its children
          let row: WbsPhaseNode | undefined = this.targetedItem;
          this.isParentDragged = false;

          //
          //  If we are trying to drag an item with no parent it's a root node, do not allow.
          //
          if (this.draggedItem.parentId == null) {
            console.log('cant drag items without parents');
            this.isParentDragged = true;
            e.dataTransfer!.dropEffect = 'none';
            return;
          }
          //
          //  If the we are trying to drag a node that is locked to a parent, make sure that's not happening
          //
          if (this.draggedItem.isLockedToParent) {
            newParentsAllowed = false;
            console.log('no new parents');
            if (
              this.draggedItem.isDisciplineNode &&
              this.draggedItem.parentId !== this.targetedItem.parentId
            ) {
              console.log('cant drag disicpline nodes to new parents');
              e.dataTransfer!.dropEffect = 'none';
              return;
            }
          }
          while (row!.parentId != null) {
            const parentRow = list.find((item) => item.id === row!.parentId);

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
            const position = this.getDropPosition(
              currentRow,
              e.clientY,
              containerOffest
            );
            //
            //  If you're trying to drop this INTO a discipline sync node, STOP IT!
            //
            if (
              this.targetedItem.syncWithDisciplines &&
              !position.isAfter &&
              !position.isBefore
            ) {
              e.dataTransfer!.dropEffect = 'none';
              return;
            }
            //
            //  If you're trying to drop this before or after a a sync'ed child, STOP IT
            //
            console.log(position);
            if (
              !this.draggedItem.isLockedToParent &&
              this.targetedItem.isLockedToParent &&
              (position.isAfter || position.isBefore)
            ) {
              console.log(
                'youre trying to drop this before or after a a synced child'
              );
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

          this.zone.run(() => this.tree$.next(newTree));
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
    list: WbsPhaseNode[],
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
  private reorderRows(list: WbsPhaseNode[], index: number): void {
    const draggedIndex = list.findIndex((x) => x.id === this.draggedItem.id);
    list.splice(draggedIndex, 1);

    const targetedIndex = list.findIndex((x) => x.id === this.targetedItem.id);
    list.splice(targetedIndex + index, 0, this.draggedItem);

    this.newParentId = this.draggedItem.parentId;
  }
}
