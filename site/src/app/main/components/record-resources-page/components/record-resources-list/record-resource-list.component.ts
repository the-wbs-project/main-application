import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faGear } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ListViewComponent,
  ListViewModule,
} from '@progress/kendo-angular-listview';
import {
  DragAndDropModule,
  DragTargetContainerDirective,
  DropTargetContainerDirective,
  DropTargetEvent,
} from '@progress/kendo-angular-utils';
import { PROJECT_CLAIMS, ResourceRecord } from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { DragDropService, TableHelper } from '@wbs/main/services';
import { ResourceTypeTextComponent } from '../record-resources-type-text/resource-type-text.component';
import { ResourceViewLinkComponent } from '../resource-view-link/resource-view-link.component';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-list',
  templateUrl: './record-resource-list.component.html',
  styleUrls: ['./record-resource-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DragDropService, TableHelper],
  imports: [
    CheckPipe,
    DateTextPipe,
    DragAndDropModule,
    FontAwesomeModule,
    ListViewModule,
    ResourceTypeTextComponent,
    ResourceViewLinkComponent,
    TranslateModule,
  ],
})
export class RecordResourceListComponent {
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) list!: ResourceRecord[];
  @Output() readonly save = new EventEmitter<ResourceRecord[]>();

  @ViewChild(ListViewComponent) listview!: ListViewComponent;
  @ViewChild('wrapper', { read: DragTargetContainerDirective })
  dragTargetContainer: any;
  @ViewChild('wrapper', { read: DropTargetContainerDirective })
  dropTargetContainer: any;

  readonly editClaim = PROJECT_CLAIMS.RESOURCES.UPDATE;
  readonly deleteClaim = PROJECT_CLAIMS.RESOURCES.DELETE;

  readonly faBars = faBars;
  readonly faGear = faGear;
  readonly menu = [];

  constructor(
    readonly dragDrop: DragDropService,
    private readonly cd: ChangeDetectorRef
  ) {}

  onDrop(e: DropTargetEvent): void {
    const list = structuredClone(this.list);

    this.dragDrop.onDrop(e, list);

    list.forEach((x, i) => (x.order = i + 1));

    const toSave = [];

    for (const item of list) {
      if (this.list.find((x) => x.id === item.id)!.order !== item.order) {
        toSave.push(item);
      }
    }
    console.log(toSave);
    if (toSave.length > 0) this.save.emit(toSave);

    this.list = list;

    this.dragTargetContainer.notify();
    this.dropTargetContainer.notify();
    this.cd.detectChanges();
  }
}
