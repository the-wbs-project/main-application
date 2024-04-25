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
import { faCheck, faRobot } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SaveState } from '@wbs/core/models';
import { AiButtonComponent } from '@wbs/main/components/ai-button.component';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { InfoMessageComponent } from '@wbs/main/components/info-message.component';
import { DescriptionAiDialogComponent } from '@wbs/main/components/entry-description-ai-dialog';
import { ProjectCategoryDropdownComponent } from '@wbs/main/components/project-category-dropdown';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { delay, tap } from 'rxjs/operators';
import { VisiblitySelectionComponent } from '../../../../components/visiblity-selection';
import { EntryService, EntryState } from '../../services';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiButtonComponent,
    DescriptionAiDialogComponent,
    EditorModule,
    FadingMessageComponent,
    FontAwesomeModule,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    NgClass,
    ProjectCategoryDropdownComponent,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
    VisiblitySelectionComponent,
  ],
})
export class GeneralComponent implements DirtyComponent {
  private readonly service = inject(EntryService);
  readonly state = inject(EntryState);

  readonly checkIcon = faCheck;
  readonly aiIcon = faRobot;
  readonly askAi = model(true);
  readonly canSave = computed(() => {
    const version = this.state.version();

    if ((version?.title ?? '').length === 0) return false;

    return true;
  });
  readonly isDirty = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly descriptionAiStartingDialog = computed(() => {
    return `Can you provide me with a one paragraph description of a phase of a work breakdown structure titled '${
      this.state.version()?.title
    }'?`;
  });

  save(): void {
    this.saveState.set('saving');
    this.service
      .generalSaveAsync(this.state.entry()!, this.state.version()!)
      .pipe(
        delay(1000),
        tap(() => {
          this.isDirty.set(false);
          this.saveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }
}
