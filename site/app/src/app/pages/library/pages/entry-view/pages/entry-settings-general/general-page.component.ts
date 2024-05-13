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
import {
  faCheck,
  faFloppyDisk,
  faRobot,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AiButtonComponent } from '@wbs/components/_utils/ai-button.component';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { DirtyComponent } from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiButtonComponent,
    DescriptionAiDialogComponent,
    EditorModule,
    FadingMessageComponent,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    NgClass,
    ProjectCategoryDropdownComponent,
    SaveButtonComponent,
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
