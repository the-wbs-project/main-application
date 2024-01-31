import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { plusIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI } from '@wbs/core/models';
import { SwitchComponent } from '@wbs/main/components/switch';
import { MetadataState } from '@wbs/main/states';
import { ProjectListFilters } from '../../models';
import { CheckboxFilterListComponent } from '@wbs/main/components/checkbox-filter-list/checkbox-filter-list.component';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-list-filters',
  templateUrl: './project-list-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckBoxModule,
    CheckboxFilterListComponent,
    FormsModule,
    NgFor,
    NgIf,
    ProjectStatusPipe,
    SwitchComponent,
    TranslateModule,
  ],
})
export class ProjectListFiltersComponent {
  readonly position = input.required<'side' | 'top'>();
  readonly filters = input.required<ProjectListFilters>();
  @Output() readonly filtersChange = new EventEmitter<ProjectListFilters>();

  expanded = true;

  readonly cats = toSignal(this.store.select(MetadataState.projectCategories));
  readonly stati = [
    PROJECT_STATI.PLANNING,
    PROJECT_STATI.APPROVAL,
    PROJECT_STATI.EXECUTION,
    PROJECT_STATI.FOLLOW_UP,
    PROJECT_STATI.CLOSED,
    PROJECT_STATI.CANCELLED,
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
    const filters = this.filters();

    filters.assignedToMe = value;

    this.filtersChange.emit(filters);
  }

  changeList(list: string[], item: string): void {
    const index = list.indexOf(item);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    this.filtersChange.emit(this.filters());
  }
}
