import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  SelectableSettings,
  SelectionChangeEvent,
  TreeListComponent,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { Project } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { DisciplineIconListComponent } from '../discipline-icon-list.component';
import { TreeDisciplineLegendComponent } from '../tree-discipline-legend/tree-discipline-legend.component';
import { WbsActionButtonsComponent } from '../wbs-action-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree',
  templateUrl: './wbs-tree.component.html',
  styleUrl: './wbs-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconListComponent,
    FillElementDirective,
    TranslateModule,
    TreeDisciplineLegendComponent,
    TreeListModule,
    WbsActionButtonsComponent,
  ],
})
export class WbsTreeComponent implements OnChanges {
  @Input() view?: 'phase' | 'discipline' | null;
  @Input() nodes?: WbsNodeView[] | null;
  @Input() project?: Project | null;
  @Input() width?: number | null;
  @Input() expandedKeys?: string[];
  @Output() readonly actionClicked = new EventEmitter<string>();
  @Output() readonly selectedChanged = new EventEmitter<WbsNodeView>();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.keys(changes).indexOf('expandedKeys') > -1) {
      if (this.expandedKeys && this.expandedKeys2.length === 0)
        this.expandedKeys2.push(...this.expandedKeys);
    }
    if (!this.nodes) return;
  }

  rowSelected(e: SelectionChangeEvent): void {
    this.selectedChanged.emit(e.items[0].dataItem);
  }
}
