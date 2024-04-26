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
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SaveState } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { AiButtonComponent } from '@wbs/main/components/ai-button.component';
import { DescriptionAiDialogComponent } from '@wbs/main/components/entry-description-ai-dialog';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { InfoMessageComponent } from '@wbs/main/components/info-message.component';
import { ProjectCategoryDropdownComponent } from '@wbs/main/components/project-category-dropdown';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { delay, tap } from 'rxjs/operators';
import { ChangeProjectBasics } from '../../actions';
import { ProjectState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiButtonComponent,
    DescriptionAiDialogComponent,
    DropDownListModule,
    EditorModule,
    FadingMessageComponent,
    FontAwesomeModule,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    ProjectCategoryDropdownComponent,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class ProjectSettingsGeneralComponent implements DirtyComponent {
  private readonly store = inject(SignalStore);
  private readonly project = this.store.select(ProjectState.current)!;

  readonly checkIcon = faCheck;
  readonly aiIcon = faRobot;
  readonly askAi = model(true);
  readonly title = model<string>();
  readonly description = model<string>();
  readonly category = model<string>();
  readonly saveState = signal<SaveState>('ready');
  //
  //  The starting dialog for description AI prompt
  //
  readonly descriptionAiStartingDialog = computed(() => {
    const title = this.title() ?? '';

    return `Can you provide me with a one paragraph description of a work breakdown structure for a project titled '${title}'?`;
  });
  readonly isDirty = computed(() => {
    const p = this.project()!;

    return (
      p.title !== this.title() ||
      p.description !== this.description() ||
      p.category !== this.category()
    );
  });
  readonly canSave = computed(() => {
    if ((this.title() ?? '').length === 0) return false;

    return true;
  });

  ngOnInit(): void {
    const project = this.project()!;

    this.title.set(project.title);
    this.description.set(project.description ?? '');
    this.category.set(project.category);
  }

  save(): void {
    this.saveState.set('saving');
    this.store
      .dispatch(
        new ChangeProjectBasics(
          this.title()!,
          this.description()!,
          this.category()!
        )
      )
      .pipe(
        delay(1000),
        tap(() => this.saveState.set('saved')),
        delay(5000)
      )
      .subscribe(() => this.saveState.set('ready'));
  }
}