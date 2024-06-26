import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';
import { plusIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI } from '@wbs/core/models';
import { CheckboxFilterListComponent } from '@wbs/components/checkbox-filter-list';
import { SwitchComponent } from '@wbs/components/switch';
import { ProjectStatusPipe } from '@wbs/pipes/project-status.pipe';
import { MetadataStore } from '@wbs/core/store';
import { ProjectCategoryFilterComponent } from '../project-category-filter';
import { ProjectStatusFilterComponent } from '../project-status-filter';

@Component({
  standalone: true,
  selector: 'wbs-project-list-filters',
  templateUrl: './project-list-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckBoxModule,
    CheckboxFilterListComponent,
    FormsModule,
    ProjectCategoryFilterComponent,
    ProjectStatusFilterComponent,
    ProjectStatusPipe,
    SwitchComponent,
    TranslateModule,
  ],
})
export class ProjectListFiltersComponent {
  readonly cats = inject(MetadataStore).categories.projectCategories;

  readonly position = input.required<'side' | 'top'>();
  readonly assignedToMe = model.required<boolean>();
  readonly stati = model.required<PROJECT_STATI[]>();
  readonly search = model.required<string | undefined>();
  readonly categories = model.required<string[]>();

  expanded = true;

  readonly plusIcon = plusIcon;
  readonly statiList = [
    PROJECT_STATI.PLANNING,
    PROJECT_STATI.APPROVAL,
    PROJECT_STATI.EXECUTION,
    PROJECT_STATI.FOLLOW_UP,
    PROJECT_STATI.CLOSED,
    PROJECT_STATI.CANCELLED,
  ];

  changeList(signal: WritableSignal<string[]>, item: string): void {
    signal.update((list) => {
      const index = list.indexOf(item);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(item);
      }
      return [...list];
    });
  }
}
