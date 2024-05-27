import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { MetadataStore } from '@wbs/core/store';
import { ProjectStatusListPipe } from '@wbs/pipes/project-status-list.pipe';
import { ProjectStatusPipe } from '@wbs/pipes/project-status.pipe';
import { TranslateListPipe } from '@wbs/pipes/translate-list.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-category-filter',
  templateUrl: './project-category-filter.component.html',
  styleUrls: ['./project-category-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MultiSelectModule,
    ProjectStatusListPipe,
    ProjectStatusPipe,
    TranslateListPipe,
    TranslateModule,
  ],
})
export class ProjectCategoryFilterComponent {
  readonly data = inject(MetadataStore).categories.projectCategories;
  readonly values = model.required<string[]>();

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
