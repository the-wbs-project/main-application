import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  signal,
  computed,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ScrollingModule,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

export interface TreeListItem {
  id: number;
  parentId?: number;
  name: string;
  expanded?: boolean; // Property to track expansion state
  level?: number; // Property to track hierarchy level
  // Add other fields as necessary
}

@Component({
  selector: 'app-tree-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule, DragDropModule],
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
})
export class TreeListComponent implements OnInit, OnChanges {
  @Input() data: TreeListItem[] = [];
  @Input() columns: string[] = [];
  @Input() rowHeight: number = 40; // Height of each row in pixels
  @Input() bufferSize: number = 10; // Buffer size for virtualization

  @Output() selectionChange = new EventEmitter<TreeListItem | null>();
  @Output() dataChange = new EventEmitter<TreeListItem[]>();

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  // Using signals for state management
  selectedItemId = signal<number | null>(null); // Tracks the single selected item
  flattenedData = signal<TreeListItem[]>([]);

  // Computed signal for selected items list (will contain at most one item)
  selectedItemsList = computed(() =>
    this.flattenedData().filter((item) => this.selectedItemId() === item.id)
  );

  ngOnInit(): void {
    this.initializeExpansion();
    this.flattenData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeExpansion();
      this.flattenData();
    }
  }

  // Initialize expansion state if not already set
  initializeExpansion(): void {
    this.data.forEach((item) => {
      if (item.expanded === undefined) {
        item.expanded = false;
      }
    });
  }

  // Flatten hierarchical data considering expansion state
  flattenData(): void {
    const map = new Map<number, TreeListItem[]>();
    console.log(this.data);
    this.data.forEach((item) => {
      const parentId = item.parentId || 0;
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(item);
    });

    const flatList: TreeListItem[] = [];
    const traverse = (parentId: number, level: number) => {
      const children = map.get(parentId) || [];
      children.forEach((child) => {
        const flatItem: TreeListItem = { ...child, level };
        flatList.push(flatItem);
        if (child.expanded) {
          traverse(child.id, level + 1);
        }
      });
    };

    traverse(0, 0);
    this.flattenedData.set(flatList);
    console.log('Flattened Data:', flatList);
  }

  // Toggle selection to allow only one selected item at a time
  toggleSelection(item: TreeListItem): void {
    console.log('Toggling selection for item:', item);
    const currentSelection = this.selectedItemId();
    if (currentSelection === item.id) {
      this.selectedItemId.set(null); // Deselect if already selected
    } else {
      this.selectedItemId.set(item.id); // Select new item
    }
    this.emitSelection();
  }

  emitSelection(): void {
    const selected = this.selectedItemsList();
    this.selectionChange.emit(selected.length > 0 ? selected[0] : null);
  }

  // Handle row reordering
  drop(event: CdkDragDrop<TreeListItem[]>): void {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    const data = this.flattenedData();

    // Move the item in the flattened list
    moveItemInArray(data, previousIndex, currentIndex);
    this.flattenedData.set([...data]);

    // Update the original data structure based on new flattenedData
    this.updateDataFromFlattened();

    // Emit updated flat data
    this.dataChange.emit(this.data);
  }

  // Update original hierarchical data from flattenedData
  updateDataFromFlattened(): void {
    // This is a simplified approach. For a full hierarchical reordering,
    // you would need to properly set parentId based on levels.
    // This example does not handle changing parentId.
    this.data = this.flattenedData().map(({ level, ...rest }) => rest);
  }

  // TrackBy function for *cdkVirtualFor
  trackById(index: number, item: TreeListItem): number {
    return item.id;
  }

  // Toggle expansion state of a node
  toggleExpand(itemId: number, event: Event): void {
    event.stopPropagation(); // Prevent row selection when clicking expand button
    const item = this.data.find((i) => i.id === itemId);
    if (item) {
      item.expanded = !item.expanded;
      console.log(`Item ${item.id} expanded: ${item.expanded}`);
      this.flattenData();
    }
  }

  // Check if an item has children
  hasChildren(id: number): boolean {
    return this.data.some((item) => item.parentId === id);
  }
}
