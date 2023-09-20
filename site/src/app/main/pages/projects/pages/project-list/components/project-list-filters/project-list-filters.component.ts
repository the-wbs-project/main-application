import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { plusIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI, PROJECT_STATI_TYPE } from '@wbs/core/models';
import { SwitchComponent } from '@wbs/main/components/switch';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { MetadataState } from '@wbs/main/states';
import { ProjectListFilters } from '../../models';

@Component({
  standalone: true,
  selector: 'wbs-project-list-filters',
  templateUrl: './project-list-filters.component.html',
  styleUrls: ['./project-list-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckBoxModule,
    FormsModule,
    NgFor,
    ProjectStatusPipe,
    SwitchComponent,
    TranslateModule,
  ],
})
export class ProjectListFiltersComponent {
  @Input({ required: true }) filters!: ProjectListFilters;
  @Output() readonly filtersChange = new EventEmitter<ProjectListFilters>();

  expanded = true;

  readonly cats = toSignal(this.store.select(MetadataState.projectCategories));
  readonly stati: PROJECT_STATI_TYPE[] = [
    PROJECT_STATI.PLANNING,
    PROJECT_STATI.EXECUTION,
    PROJECT_STATI.FOLLOW_UP,
    PROJECT_STATI.CLOSED,
    PROJECT_STATI.ARCHIVED,
  ];

  readonly plusIcon = plusIcon;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly store: Store
  ) {}

  force() {
    this.cd.detectChanges();
  }

  changedAssignedToMe(value: boolean): void {
    this.filters.assignedToMe = value;
    this.filtersChange.emit(this.filters);
  }

  changeList(list: string[], item: string): void {
    const index = list.indexOf(item);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    this.filtersChange.emit(this.filters);
  }
}
