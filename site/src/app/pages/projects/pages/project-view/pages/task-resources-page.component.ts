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
import {
  PROJECT_CLAIMS,
  PROJECT_STATI,
  ResourceRecord,
} from '@wbs/core/models';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { RecordResourcesPageComponent } from '@wbs/components/record-resources';
import { ProjectResourceService } from '../services';
import { SignalStore, Utils } from '@wbs/core/services';
import { ProjectState } from '../states';

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
  providers: [ProjectResourceService],
})
export class TaskResourcesPageComponent implements OnInit {
  private readonly service = inject(ProjectResourceService);
  private readonly store = inject(SignalStore);
  private readonly project = this.store.select(ProjectState.current);
  private readonly isPlanning = computed(
    () => this.project()?.status === PROJECT_STATI.PLANNING
  );

  readonly owner = input.required<string>();
  readonly projectId = input.required<string>();
  readonly apiUrlPrefix = input.required<string>();
  readonly taskId = input.required<string>();
  readonly claims = this.store.select(ProjectState.claims);
  readonly list = signal<ResourceRecord[]>([]);
  readonly canAdd = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.RESOURCES.CREATE)
  );
  readonly canEdit = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.RESOURCES.UPDATE)
  );
  readonly canDelete = computed(
    () =>
      this.isPlanning() &&
      Utils.contains(this.claims(), PROJECT_CLAIMS.RESOURCES.DELETE)
  );

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
