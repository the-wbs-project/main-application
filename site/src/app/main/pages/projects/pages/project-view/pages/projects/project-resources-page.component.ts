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
import { ProjectResourceService } from '../../services';

@Component({
  standalone: true,
  template: `<div class="pd-15">
    <wbs-record-resources-page
      [list]="list()"
      [owner]="owner()"
      [claims]="claims()"
      (saveRecords)="saveRecords($event)"
      (uploadAndSave)="uploadAndSaveAsync($event.rawFile, $event.data)"
    />
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecordResourcesPageComponent],
  providers: [ProjectResourceService],
})
export class ProjectResourcesPageComponent implements OnInit {
  readonly owner = input.required<string>();
  readonly projectId = input.required<string>();
  readonly claims = input.required<string[]>();
  readonly list = signal<ResourceRecord[]>([]);

  constructor(private readonly service: ProjectResourceService) {}

  ngOnInit(): void {
    this.service
      .getRecordsAsync(this.owner(), this.projectId())
      .subscribe((list) => this.list.set(list));
  }

  saveRecords(records: Partial<ResourceRecord>[]): void {
    this.service
      .saveRecordsAsync(this.owner(), this.projectId(), undefined, records)
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
        this.projectId(),
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
