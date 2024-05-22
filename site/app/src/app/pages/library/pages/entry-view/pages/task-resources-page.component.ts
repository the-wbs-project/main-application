import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { LIBRARY_CLAIMS, ResourceRecord } from '@wbs/core/models';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { RecordResourcesPageComponent } from '@wbs/components/resources';
import { EntryResourceService } from '../services';

@Component({
  standalone: true,
  template: `<div class="pd-15">
    <wbs-alert
      type="info"
      [dismissible]="false"
      message="Library.ResourceInfoTask"
    />
    <wbs-record-resources-page
      [list]="list()"
      [claims]="claims()"
      [apiUrlPrefix]="apiUrlPrefix()"
      [addClaim]="ADD_CLAIM"
      [editClaim]="EDIT_CLAIM"
      [deleteClaim]="DELETE_CLAIM"
      (saveRecords)="saveRecords($event)"
      (uploadAndSave)="uploadAndSaveAsync($event.rawFile, $event.data)"
    />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, RecordResourcesPageComponent],
  providers: [EntryResourceService],
})
export class ResourcesPageComponent implements OnInit {
  readonly owner = input.required<string>();
  readonly entryId = input.required<string>();
  readonly versionId = input.required<number>();
  readonly taskId = input.required<string>();
  readonly claims = input.required<string[]>();
  readonly list = signal<ResourceRecord[]>([]);
  readonly apiUrlPrefix = input.required<string>();
  readonly ADD_CLAIM = LIBRARY_CLAIMS.RESOURCES.CREATE;
  readonly EDIT_CLAIM = LIBRARY_CLAIMS.RESOURCES.UPDATE;
  readonly DELETE_CLAIM = LIBRARY_CLAIMS.RESOURCES.DELETE;

  constructor(private readonly service: EntryResourceService) {}

  ngOnInit(): void {
    this.service
      .getRecordsAsync(
        this.owner(),
        this.entryId(),
        this.versionId(),
        this.taskId()
      )
      .subscribe((list) => this.list.set(list));
  }

  saveRecords(records: Partial<ResourceRecord>[]): void {
    this.service
      .saveRecordsAsync(
        this.owner(),
        this.entryId(),
        this.versionId(),
        this.taskId(),
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
        this.taskId(),
        rawFile,
        data
      )
      .subscribe((newRecord) =>
        this.list.update((list) => [...list, newRecord])
      );
  }
}
