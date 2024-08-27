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
import { faPencil, faPlus, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineSplitListComponent } from '@wbs/components/_utils/discipline-split-list.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { CategoryDialogResults, SaveState } from '@wbs/core/models';
import { CategoryService, IdService } from '@wbs/core/services';
import { CategorySelection, CategoryViewModel } from '@wbs/core/view-models';
import { filter, map } from 'rxjs/operators';
import { CategoryDialogComponent } from '../category-dialog';

@Component({
  standalone: true,
  selector: 'wbs-discipline-card',
  templateUrl: './discipline-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    AlertComponent,
    ButtonModule,
    DisciplineEditorComponent,
    DisciplineSplitListComponent,
    FontAwesomeModule,
    SaveButtonComponent,
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class DisciplineCardComponent {
  private readonly catService = inject(CategoryService);
  private readonly dialog = inject(DialogService);

  readonly plusIcon = faPlus;
  readonly editIcon = faPencil;
  readonly cancelIcon = faXmark;
  readonly items = model.required<CategoryViewModel[]>();
  readonly editItems = model<CategorySelection[]>([]);
  readonly canAdd = input<boolean>(false);
  readonly canEdit = input.required<boolean>();
  readonly alertIfEmpty = input(false);
  readonly noDisciplinesLabel = input.required<string>();
  readonly splitLimit = input.required<number>();
  readonly saveState = input<SaveState>();
  //
  //  signals
  //
  readonly editMode = signal(false);
  //
  //  outputs
  //
  readonly save = output<CategorySelection[]>();

  saveClicked(items: CategorySelection[]): void {
    this.save.emit(items);
    this.editMode.set(false);
  }

  add(): void {
    CategoryDialogComponent.launchAsync(
      this.dialog,
      false,
      true,
      'Wbs.AddDiscipline'
    )
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        map((x) => <CategoryDialogResults>x)
      )
      .subscribe((results) => {
        const item: CategorySelection = {
          id: IdService.generate(),
          isCustom: true,
          label: results.title,
          icon: results.icon,
          description: results.description,
          selected: true,
        };
        this.editItems.update((list) => {
          list = [item, ...(list ?? [])];
          this.catService.renumber(list);
          return list;
        });
      });
  }
}
