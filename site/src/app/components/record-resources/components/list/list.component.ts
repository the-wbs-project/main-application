import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faEye,
  faPencil,
  faQuestionCircle,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ContentResource } from '@wbs/core/models';
import { UiStore } from '@wbs/core/store';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { FileViewerService } from '../../services';
import { ResourceTypeTextComponent } from '../type-text';
import { PdfDialogComponent } from '../pdf-dialog.component';

declare type BrowserMin = { name: string; version?: number };

const pdfBrowsers: BrowserMin[] = [
  { name: 'chrome' },
  { name: 'firefox', version: 106 },
];

//Safari no

@Component({
  standalone: true,
  selector: 'wbs-record-resource-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    DragDropModule,
    FontAwesomeModule,
    ResourceTypeTextComponent,
    TooltipModule,
    TranslateModule,
  ],
})
export class RecordResourceListComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly uiStore = inject(UiStore);
  private readonly viewerService = inject(FileViewerService);

  readonly reorderIcon = faBars;
  readonly viewIcon = faEye;
  readonly editIcon = faPencil;
  readonly deleteIcon = faTrash;
  readonly infoIcon = faQuestionCircle;

  readonly canEdit = input.required<boolean>();
  readonly canDelete = input.required<boolean>();
  readonly list = model.required<ContentResource[]>();
  //
  //  Outputs
  //
  readonly delete = output<ContentResource>();
  readonly edit = output<ContentResource>();
  readonly save = output<ContentResource[]>();

  onDrop({ previousIndex, currentIndex }: CdkDragDrop<any, any>): void {
    this.list.update((list) => {
      const originalList = structuredClone(list);
      const toMove = list[previousIndex];

      list.splice(previousIndex, 1);
      list.splice(currentIndex, 0, toMove);
      list.forEach((x, i) => (x.order = i + 1));

      const toSave = [];

      for (const item of list) {
        if (originalList.find((x) => x.id === item.id)!.order !== item.order) {
          toSave.push(item);
        }
      }
      if (toSave.length > 0) this.save.emit(toSave);

      return list;
    });
  }

  open(record: ContentResource): void {
    const browser = this.uiStore.browser;

    if (!browser) return;

    const showDialog =
      !browser.isMobile &&
      pdfBrowsers.some(
        (x) =>
          x.name === browser.name &&
          (x.version ? x.version > browser.version : true)
      );

    if (record.type === 'pdf') {
      this.data.contentResources
        .getFileAsync(record.ownerId, record.parentId, record.id)
        .subscribe((file) =>
          PdfDialogComponent.launch(this.dialog, record.name, file)
        );
    } else {
      window.open(
        this.data.contentResources.getFileUrl(
          record.ownerId,
          record.parentId,
          record.id
        ),
        '_blank'
      );
    }
  }
}
