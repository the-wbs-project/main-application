import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { ProjectTaskViewModel } from '@wbs/core/view-models';
import { ProjectTaskResourceService } from '../../../../services';

@Component({
  standalone: true,
  selector: 'wbs-project-task-details-resources',
  templateUrl: './task-details-resources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    RecordResourceListComponent,
    TranslateModule,
  ],
})
export class TaskDetailsResourcesComponent implements OnInit {
  readonly addIcon = faPlus;
  readonly service = inject(ProjectTaskResourceService);
  //
  //  Inputs & Signals
  //
  readonly task = input.required<ProjectTaskViewModel>();
  readonly list = signal<ContentResource[]>([]);

  constructor() {
    effect(() => {
      this.service.setTask(this.task());
      this.service.getRecordsAsync().subscribe((list) => this.list.set(list));
    });
  }

  ngOnInit(): void {}

  launchAdd(): void {
    this.service.addAsync().subscribe((item) => {
      if (item) this.updateList([item]);
    });
  }

  editRecord(record: ContentResource): void {
    this.service.editAsync(record).subscribe((item) => {
      if (item) this.updateList([item]);
    });
  }

  deleteRecord(record: ContentResource): void {
    this.service.deleteAsync(record).subscribe((deleted) => {
      if (deleted)
        this.list.update((list) => list.filter((x) => x.id !== record.id));
    });
  }

  save(records: ContentResource[]): void {
    this.service.reorderAsync(records).subscribe((newRecords) => {
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
