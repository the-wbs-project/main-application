import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPencil,
  faPlus,
  faQuestionCircle,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { RecordResourceEditorComponent } from '@wbs/components/record-resources/components/editor';
import { RecordResourceListComponent } from '@wbs/components/record-resources/components/list';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_CLAIMS,
  RESOURCE_TYPES,
  ResourceRecord,
} from '@wbs/core/models';
import { Messages, SaveService, Utils } from '@wbs/core/services';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EntryResourceService } from '../../../../services';
import { CardHeaderComponent } from '../card-header.component';

@Component({
  standalone: true,
  selector: 'wbs-resource-card',
  templateUrl: './resource-card.component.html',
  host: { class: 'card dashboard-card full-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CardHeaderComponent,
    FontAwesomeModule,
    RecordResourceListComponent,
    TranslateModule,
  ],
  providers: [EntryResourceService],
})
export class ResourceCardComponent implements OnChanges {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly messages = inject(Messages);
  private readonly service = inject(EntryResourceService);

  readonly addIcon = faPlus;
  readonly editIcon = faPencil;
  readonly helpIcon = faQuestionCircle;
  readonly saveState = new SaveService();
  //
  //  Inputs
  //
  readonly claims = input.required<string[]>();
  readonly version = input.required<LibraryVersionViewModel>();
  //
  //  Signals & Models
  //
  readonly list = signal<ResourceRecord[]>([]);
  readonly apiUrlPrefix = input.required<string>();
  //
  //  Computed
  //
  private readonly isDraft = computed(() => this.version()?.status === 'draft');
  readonly canAdd = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.claims(), LIBRARY_CLAIMS.RESOURCES.CREATE)
  );
  readonly canEdit = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.claims(), LIBRARY_CLAIMS.RESOURCES.UPDATE)
  );
  readonly canDelete = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.claims(), LIBRARY_CLAIMS.RESOURCES.DELETE)
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['version']) {
      const version = this.version()!;

      this.service
        .getRecordsAsync(version.ownerId, version.entryId, version.version)
        .subscribe((list) => this.list.set(list));
    }
  }

  launchAdd(): void {
    RecordResourceEditorComponent.launchAddAsync(this.dialog)
      .pipe(
        switchMap((x) =>
          x == undefined
            ? of('')
            : x[0].type === RESOURCE_TYPES.LINK
            ? this.saveRecords([x[0]])
            : this.uploadAndSaveAsync(x[1]!, x[0])
        )
      )
      .subscribe();
  }

  editRecord(record: ResourceRecord): void {
    RecordResourceEditorComponent.launchEditAsync(this.dialog, record)
      .pipe(
        switchMap((x) =>
          x == undefined
            ? of('')
            : x[0].type === RESOURCE_TYPES.LINK
            ? this.saveRecords([x[0]])
            : this.uploadAndSaveAsync(x[1]!, x[0])
        )
      )
      .subscribe();
  }

  deleteRecord(record: ResourceRecord): void {
    const version = this.version()!;

    this.messages.confirm
      .show('General.Confirm', 'Resources.DeleteResourceConfirm')
      .pipe(
        switchMap((answer) =>
          answer
            ? this.data.libraryEntryResources
                .deleteAsync(
                  version.ownerId,
                  version.entryId,
                  version.version,
                  undefined,
                  record.id
                )
                .pipe(
                  tap(() =>
                    this.list.update((list) =>
                      list.filter((x) => x.id !== record.id)
                    )
                  )
                )
            : of('')
        )
      )
      .subscribe();
  }

  save(records: ResourceRecord[]): void {
    this.saveRecords(records).subscribe();
  }

  saveRecords(records: Partial<ResourceRecord>[]): Observable<void> {
    const version = this.version()!;

    return this.service
      .saveRecordsAsync(
        version.ownerId,
        version.entryId,
        version.version,
        undefined,
        records
      )
      .pipe(map((newRecords) => this.updateList(newRecords)));
  }

  private uploadAndSaveAsync(
    rawFile: FileInfo,
    data: Partial<ResourceRecord>
  ): Observable<void> {
    const version = this.version()!;

    return this.service
      .uploadAndSaveAsync(
        version.ownerId,
        version.entryId,
        version.version,
        undefined,
        rawFile,
        data
      )
      .pipe(map((record) => this.updateList([record])));
  }

  private updateList(records: ResourceRecord[]): void {
    this.list.update((list) => {
      for (const r of records) {
        const index = list.findIndex((x) => x.id === r.id);
        if (index > -1) {
          list[index] = r;
        } else {
          list.push(r);
        }
      }
      return [...list];
    });
  }
}
