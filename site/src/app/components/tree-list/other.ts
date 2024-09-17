import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface TreeListItem {
  id: number;
  parentId?: number;
  name: string;
  // Add other fields as necessary
}

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.css'],
})
export class TreeListComponent implements OnInit {
  @Input() data: TreeListItem[] = [];
  @Input() columns: string[] = [];
  @Input() rowHeight: number = 40; // Height of each row in pixels
  @Input() bufferSize: number = 10; // Buffer size for virtualization

  @Output() selectionChange = new EventEmitter<TreeListItem[]>();
  @Output() dataChange = new EventEmitter<TreeListItem[]>();

  selectedItems: Set<number> = new Set<number>();
  flattenedData: TreeListItem[] = [];

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  ngOnInit(): void {
    this.flattenData();
  }

  ngOnChanges(): void {
    this.flattenData();
  }

  flattenData(): void {
    const map = new Map<number, TreeListItem[]>();
    this.data.forEach((item) => {
      const parentId = item.parentId || 0;
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(item);
    });

    this.flattenedData = [];
    const traverse = (parentId: number, level: number) => {
      const children = map.get(parentId) || [];
      children.forEach((child) => {
        (child as any).level = level;
        this.flattenedData.push(child);
        traverse(child.id, level + 1);
      });
    };

    traverse(0, 0);
  }

  toggleSelection(item: TreeListItem): void {
    if (this.selectedItems.has(item.id)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }
    this.emitSelection();
  }

  emitSelection(): void {
    const selected = this.flattenedData.filter((item) =>
      this.selectedItems.has(item.id)
    );
    this.selectionChange.emit(selected);
  }

  drop(event: CdkDragDrop<TreeListItem[]>): void {
    const previousIndex =
      this.viewport.getOffsetToRenderedContentStart() / this.rowHeight +
      event.previousIndex;
    const currentIndex =
      this.viewport.getOffsetToRenderedContentStart() / this.rowHeight +
      event.currentIndex;
    moveItemInArray(this.flattenedData, previousIndex, currentIndex);
    this.dataChange.emit(this.flattenedData);
  }
}
