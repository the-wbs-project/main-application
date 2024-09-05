import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { RecordResourceListComponent } from '@wbs/components/record-resources/components/list';
import { ContentResource } from '@wbs/core/models';
import { ProjectResourcesService } from '../../../../services';

@Component({
  standalone: true,
  selector: 'wbs-project-task-details-resources',
  templateUrl: './task-details-resources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectResourcesService],
  imports: [
    ButtonModule,
    FontAwesomeModule,
    RecordResourceListComponent,
    TranslateModule,
  ],
})
export class TaskDetailsResourcesComponent implements OnInit {
  readonly addIcon = faPlus;
  readonly service = inject(ProjectResourcesService);
  //
  //  Inputs & Signals
  //
  readonly taskId = input.required<string>();
  readonly list = signal<ContentResource[]>([]);
  //
  //  Computed
  //

  ngOnInit(): void {
    this.service
      .getRecordsAsync(this.taskId())
      .subscribe((list) => this.list.set(list));
  }

  launchAdd(): void {
    this.service.launchAddAsync(this.taskId()).subscribe((item) => {
      if (item) this.updateList([item]);
    });
  }

  editRecord(record: ContentResource): void {
    this.service.editRecordAsync(this.taskId(), record).subscribe((item) => {
      if (item) this.updateList([item]);
    });
  }

  deleteRecord(record: ContentResource): void {
    this.service
      .deleteRecordAsync(this.taskId(), record)
      .subscribe((deleted) => {
        if (deleted)
          this.list.update((list) => list.filter((x) => x.id !== record.id));
      });
  }

  save(records: ContentResource[]): void {
    this.service
      .saveRecordsAsync(this.taskId(), records)
      .subscribe((newRecords) => {
        this.updateList(newRecords);
      });
  }

  private updateList(records: ContentResource[]): void {
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
