import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faFloppyDisk,
  faRobot,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DirtyComponent } from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { AiButtonComponent } from '@wbs/components/_utils/ai-button.component';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { EntryStore } from '@wbs/core/store';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiButtonComponent,
    DescriptionAiDialogComponent,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    NgClass,
    ProjectCategoryDropdownComponent,
    SaveMessageComponent,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class GeneralComponent implements DirtyComponent {
  private readonly service = inject(EntryService);
  readonly entryStore = inject(EntryStore);

  readonly saveIcon = faFloppyDisk;
  readonly checkIcon = faCheck;
  readonly aiIcon = faRobot;
  readonly askAi = model(true);
  readonly canSave = computed(() => {
    const version = this.entryStore.version();

    if ((version?.title ?? '').length === 0) return false;

    return true;
  });
  readonly isDirty = signal(false);
  readonly saved = new SaveService();
  readonly descriptionAiStartingDialog = computed(() => {
    return `Can you provide me with a one paragraph description of a phase of a work breakdown structure titled '${
      this.entryStore.version()?.title
    }'?`;
  });

  save(): void {
    this.saved
      .call(
        this.service.generalSaveAsync(
          this.entryStore.entry()!,
          this.entryStore.version()!
        )
      )
      .subscribe();
  }
}
