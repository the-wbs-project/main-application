import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPencil,
  faQuestion,
  faSave,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { PopoverModule } from '@progress/kendo-angular-tooltip';
import { ProjectCategoryDescriptionComponent } from '@wbs/components/_utils/project-category-description.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { SaveState } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-project-category-editor',
  templateUrl: './project-category-editor.component.html',
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
export class ProjectCategoryEditorComponent {
  private readonly categories =
    inject(MetadataStore).categories.projectCategories;

  readonly editIcon = faPencil;
  readonly saveIcon = faSave;
  readonly cancelIcon = faXmark;
  readonly infoIcon = faQuestion;
  readonly canEdit = input.required<boolean>();
  readonly categoryId = input.required<string | undefined>();
  readonly saveMode = input.required<SaveState>();
  readonly category = computed(() =>
    this.categories.find((c) => c.id === this.categoryId())
  );
  readonly editValue = signal<string | undefined>(undefined);
  readonly editMode = signal(false);
  readonly save = output<string>();

  edit(): void {
    this.editValue.set(this.categoryId());
    this.editMode.set(true);
  }

  categoryChosen(): void {
    const category = this.editValue()!;

    this.editMode.set(false);
    this.save.emit(category);
  }

  cancel(): void {
    this.editValue.set('');
    this.editMode.set(false);
  }
}
