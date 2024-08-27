import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-duotone-svg-icons';
import { faPencil, faQuestion, faSave, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { PopoverModule } from '@progress/kendo-angular-tooltip';
import { ProjectCategoryDescriptionComponent } from '@wbs/components/_utils/project-category-description.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { SaveService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore, MetadataStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-details-project-category',
  templateUrl: './project-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'child-hoverer' },
  imports: [
    ButtonModule,
    FontAwesomeModule,
    PopoverModule,
    ProjectCategoryDescriptionComponent,
    ProjectCategoryDropdownComponent,
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class ProjectCategoryComponent {
  private readonly categories =
    inject(MetadataStore).categories.projectCategories;
  private readonly service = inject(EntryService);

  readonly editIcon = faPencil;
  readonly saveIcon = faSave;
  readonly cancelIcon = faXmark;
  readonly infoIcon = faQuestion;
  readonly store = inject(EntryStore);
  readonly record = input.required<LibraryVersionViewModel>();
  readonly category = computed(() =>
    this.categories.find((c) => c.id === this.record().category)
  );
  readonly editValue = model<string>();
  readonly editMode = signal(false);
  readonly saveMode = new SaveService();

  edit(): void {
    this.editValue.set(this.record().category);
    this.editMode.set(true);
  }

  save(): void {
    const category = this.editValue()!;

    this.editMode.set(false);
    this.saveMode.call(this.service.categoryChangedAsync(category)).subscribe();
  }

  cancel(): void {
    this.editValue.set('');
    this.editMode.set(false);
  }
}
