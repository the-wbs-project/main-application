import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faRobot } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ListItem } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { ProjectCategoryDropdownComponent } from '@wbs/main/components/project-category-dropdown';
import { DescriptionAiDialogComponent } from '../../components/entry-description-ai-dialog';
import { VisiblitySelectionComponent } from '../../../../components/visiblity-selection';
import { EntryService } from '../../services';
import { EntryViewState } from '../../states';
import { DialogModule } from '@progress/kendo-angular-dialog';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DescriptionAiDialogComponent,
    DialogModule,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    ProjectCategoryDropdownComponent,
    TextBoxModule,
    TranslateModule,
    VisiblitySelectionComponent,
  ],
})
export class GeneralComponent {
  private readonly store = inject(SignalStore);
  private readonly service = inject(EntryService);

  readonly faRobot = faRobot;
  readonly faFloppyDisk = faFloppyDisk;
  readonly askAi = model(true);
  readonly categories = input.required<ListItem[]>();
  readonly entry = this.store.selectSignalSnapshot(EntryViewState.entry);
  readonly version = this.store.selectSignalSnapshot(EntryViewState.version);
  readonly canSave = computed(() => {
    const version = this.version();

    if ((version?.title ?? '').length === 0) return false;

    return true;
  });

  save(): void {
    this.service.generalSaveAsync(this.entry()!, this.version()!).subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.version.update((v) => {
      v!.description = description;

      return v;
    });
  }
}
