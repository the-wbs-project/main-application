import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { LIBRARY_CLAIMS, ResourceRecord } from '@wbs/core/models';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { RecordResourcesPageComponent } from '@wbs/components/resources';
import { EntryResourceService } from '../services';
import { EntryStore } from '@wbs/core/store';
import { Utils } from '@wbs/core/services';

@Component({
  standalone: true,
  template: `<div class="pd-15">
    <wbs-alert
      type="info"
      [dismissible]="false"
      message="Library.ResourceInfoEntry"
    />
    <wbs-record-resources-page
      [list]="list()"
      [canAdd]="canAdd()"
      [canEdit]="canEdit()"
      [canDelete]="canDelete()"
      [apiUrlPrefix]="apiUrlPrefix()"
      (saveRecords)="saveRecords($event)"
      (uploadAndSave)="uploadAndSaveAsync($event.rawFile, $event.data)"
    />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, RecordResourcesPageComponent],
  providers: [EntryResourceService],
})
export class ResourcesPageComponent implements OnInit {
  private readonly service = inject(EntryResourceService);
  private readonly store = inject(EntryStore);
  private readonly isDraft = computed(
    () => this.store.version()?.status === 'draft'
  );

  readonly owner = input.required<string>();
  readonly entryId = input.required<string>();
  readonly versionId = input.required<number>();
  readonly list = signal<ResourceRecord[]>([]);
  readonly apiUrlPrefix = input.required<string>();
  readonly canAdd = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.store.claims(), LIBRARY_CLAIMS.RESOURCES.CREATE)
  );
  readonly canEdit = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.store.claims(), LIBRARY_CLAIMS.RESOURCES.UPDATE)
  );
  readonly canDelete = computed(
    () =>
      this.isDraft() &&
      Utils.contains(this.store.claims(), LIBRARY_CLAIMS.RESOURCES.DELETE)
  );

  ngOnInit(): void {
    this.service
      .getRecordsAsync(this.owner(), this.entryId(), this.versionId())
      .subscribe((list) => this.list.set(list));
  }

  saveRecords(records: Partial<ResourceRecord>[]): void {
    this.service
      .saveRecordsAsync(
        this.owner(),
        this.entryId(),
        this.versionId(),
        undefined,
        records
      )
      .subscribe((newRecords) =>
        this.list.update((list) => {
          for (const r of newRecords) {
            const index = list.findIndex((x) => x.id === r.id);
            if (index >= 0) {
              list[index] = r;
            } else {
              list.push(r);
            }
          }
          return [...list];
        })
      );
  }

  uploadAndSaveAsync(rawFile: FileInfo, data: Partial<ResourceRecord>): void {
    this.service
      .uploadAndSaveAsync(
        this.owner(),
        this.entryId(),
        this.versionId(),
        undefined,
        rawFile,
        data
      )
      .subscribe((record) => this.list.update((list) => [...list, record]));
  }
}
