import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { ResourceRecord } from '@wbs/core/models';
import { RecordResourcesPageComponent } from '@wbs/main/components/record-resources-page/record-resources-page.component';
import { EntryResourceService } from '../services';

@Component({
  standalone: true,
  template: `<wbs-record-resources-page
    [list]="list()"
    [owner]="owner()"
    [claims]="claims()"
    (saveRecords)="saveRecords($event)"
    (uploadAndSave)="uploadAndSaveAsync($event.rawFile, $event.data)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecordResourcesPageComponent],
  providers: [EntryResourceService],
})
export class ResourcesPageComponent implements OnInit {
  readonly owner = input.required<string>();
  readonly entryId = input.required<string>();
  readonly versionId = input.required<number>();
  readonly claims = input.required<string[]>();
  readonly list = signal<ResourceRecord[]>([]);

  constructor(private readonly service: EntryResourceService) {}

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
      .subscribe((newRecords) => {
        const list = this.list();

        for (const r of newRecords) {
          const index = list.findIndex((x) => x.id === r.id);
          if (index >= 0) {
            list[index] = r;
          } else {
            list.push(r);
          }
        }
        this.list.set(structuredClone(list));
      });
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
      .subscribe((newRecord) => {
        const list = this.list();
        list.push(newRecord);
        this.list.set(structuredClone(list));
      });
  }
}
