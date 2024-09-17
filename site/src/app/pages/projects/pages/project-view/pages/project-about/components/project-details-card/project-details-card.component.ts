import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditableTextComponent } from '@wbs/components/editable-text';
import { ProjectCategoryEditorComponent } from '@wbs/components/project-category-editor';
import { SaveService } from '@wbs/core/services';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { ProjectService } from '../../../../services';
import { ProjectStore } from '../../../../stores';

@Component({
  standalone: true,
  selector: 'wbs-project-details-card',
  templateUrl: './project-details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    DateTextPipe,
    EditableTextComponent,
    ProjectCategoryEditorComponent,
    TranslateModule,
  ],
})
export class ProjectDetailsCardComponent {
  private readonly service = inject(ProjectService);

  readonly store = inject(ProjectStore);
  readonly saveCategory = new SaveService();
  readonly saveTitle = new SaveService();

  titleChanged(title: string): void {
    this.saveTitle.call(this.service.changeTitle(title ?? '')).subscribe();
  }

  projectCategoryChanged(categoryId: string) {
    this.saveCategory
      .call(this.service.changeProjectCategory(categoryId))
      .subscribe();
  }
}
