import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { CategoryDialogComponent } from '@wbs/components/category-dialog';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { CategoryDialogResults } from '@wbs/core/models';
import {
  CategorySelectionService,
  IdService,
  SaveService,
} from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-discipline-settings-page',
  templateUrl: './discipline-settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryDialogComponent,
    DisciplineEditorComponent,
    FadingMessageComponent,
    FontAwesomeModule,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class DisciplineSettingsPageComponent {
  private readonly catService = inject(CategorySelectionService);

  readonly plus = faPlus;
  readonly checkIcon = faCheck;
  readonly canAdd = input.required<boolean>();
  readonly saveService = input.required<SaveService>();
  readonly disciplines = model.required<CategorySelection[] | undefined>();
  readonly saveClicked = output<void>();

  readonly showAddDialog = signal(false);

  create(results: CategoryDialogResults | undefined): void {
    this.showAddDialog.set(false);

    if (results == null) return;

    const item: CategorySelection = {
      id: IdService.generate(),
      isCustom: true,
      label: results.title,
      icon: results.icon,
      description: results.description,
      selected: true,
    };
    this.disciplines.update((list) => {
      list = [item, ...(list ?? [])];
      this.catService.renumber(list);
      return list;
    });
  }
}
