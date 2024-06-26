import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { PROJECT_CLAIMS, ResourceRecord } from '@wbs/core/models';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { RecordResourcesPageComponent } from '@wbs/components/resources';
import { ProjectResourceService } from '../services';

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
  providers: [ProjectResourceService],
})
export class TaskResourcesPageComponent implements OnInit {
  private readonly service = inject(ProjectResourceService);

  readonly owner = input.required<string>();
  readonly projectId = input.required<string>();
  readonly apiUrlPrefix = input.required<string>();
  readonly taskId = input.required<string>();
  readonly claims = input.required<string[]>();
  readonly list = signal<ResourceRecord[]>([]);
  readonly ADD_CLAIM = PROJECT_CLAIMS.RESOURCES.CREATE;
  readonly EDIT_CLAIM = PROJECT_CLAIMS.RESOURCES.UPDATE;
  readonly DELETE_CLAIM = PROJECT_CLAIMS.RESOURCES.DELETE;

  ngOnInit(): void {
    this.service
      .getRecordsAsync(this.owner(), this.projectId(), this.taskId())
      .subscribe((list) => this.list.set(list));
  }

  saveRecords(records: Partial<ResourceRecord>[]): void {
    this.service
      .saveRecordsAsync(this.owner(), this.projectId(), this.taskId(), records)
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
        this.taskId(),
        rawFile,
        data
      )
      .subscribe((record) => this.list.update((list) => [...list, record]));
  }
}
