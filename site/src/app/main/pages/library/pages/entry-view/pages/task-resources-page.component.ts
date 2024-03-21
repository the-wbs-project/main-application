import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { ResourceRecord } from '@wbs/core/models';
import { RecordResourcesPageComponent } from '@wbs/main/components/record-resources-page';
import { EntryResourceService } from '../services';
import { AlertComponent } from '@wbs/main/components/alert.component';

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
      [owner]="owner()"
      [claims]="claims()"
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
          return list;
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
