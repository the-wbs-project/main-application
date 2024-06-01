import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { PROJECT_STATI } from '@wbs/core/models';
import { ProjectStatusListPipe } from '@wbs/pipes/project-status-list.pipe';
import { ProjectStatusPipe } from '@wbs/pipes/project-status.pipe';
import { TranslateListPipe } from '@wbs/pipes/translate-list.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-status-filter',
  templateUrl: './project-status-filter.component.html',
  styleUrls: ['./project-status-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MultiSelectModule,
    ProjectStatusListPipe,
    ProjectStatusPipe,
    TranslateListPipe,
    TranslateModule,
  ],
})
export class ProjectStatusFilterComponent implements OnInit {
  readonly data = signal<string[]>([]);
  readonly values = model.required<string[]>();

  ngOnInit(): void {
    this.data.set([
      PROJECT_STATI.PLANNING,
      PROJECT_STATI.APPROVAL,
      PROJECT_STATI.EXECUTION,
      PROJECT_STATI.FOLLOW_UP,
      PROJECT_STATI.CLOSED,
      PROJECT_STATI.CANCELLED,
    ]);
  }

  only(e: Event, value: string): void {
    e.stopPropagation();

    this.set([value]);
  }

  changed(value: string[]): void {
    this.set(value);
  }

  private set(value: string[]): void {
    this.values.set([...value]);
  }
}
