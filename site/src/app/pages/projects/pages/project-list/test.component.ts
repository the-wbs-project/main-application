import { Component } from '@angular/core';
import { TreeListComponent } from '@wbs/components/tree-list/tree-list.component';
import { TreeListItem } from 'src/app/components/tree-list/tree-list.component';

@Component({
  standalone: true,
  selector: 'app-tree-list-example',
  templateUrl: './test.component.html',
  imports: [TreeListComponent],
})
export class TreeListExampleComponent {
  treeData: TreeListItem[] = [
    { id: 1, name: 'Parent 1', expanded: true },
    { id: 2, parentId: 1, name: 'Child 1.1' },
    { id: 3, parentId: 1, name: 'Child 1.2' },
    { id: 4, name: 'Parent 2', expanded: false },
    { id: 5, parentId: 4, name: 'Child 2.1' },
    { id: 6, parentId: 4, name: 'Child 2.2' },
    { id: 7, name: 'Parent 3', expanded: false },
    { id: 8, parentId: 7, name: 'Child 3.1' },
    { id: 9, parentId: 7, name: 'Child 3.2' },
    { id: 10, name: 'Parent 4', expanded: false },
    { id: 11, parentId: 10, name: 'Child 4.1' },
    { id: 12, parentId: 10, name: 'Child 4.2' },
    // Add more items to demonstrate virtualization
    // ...
  ];

  columns: string[] = ['id', 'name'];

  selectedItem: TreeListItem | null = null;

  onSelectionChange(selected: TreeListItem | null) {
    this.selectedItem = selected;
    console.log('Selected Item:', this.selectedItem);
  }

  onDataChange(updatedData: TreeListItem[]) {
    // Update hierarchical data based on reordered flat list
    // This requires additional logic to map flat list back to hierarchical structure
    // For simplicity, we're directly assigning it here
    this.treeData = updatedData;
    console.log('Updated Data:', this.treeData);
  }
}
