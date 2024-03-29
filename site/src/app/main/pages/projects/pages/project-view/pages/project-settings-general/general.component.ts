import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faCheck, faRobot } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ListItem, Project, SaveState } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { DescriptionAiDialogComponent } from '@wbs/main/components/entry-description-ai-dialog';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { InfoMessageComponent } from '@wbs/main/components/info-message.component';
import { ProjectCategoryDropdownComponent } from '@wbs/main/components/project-category-dropdown';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { DirtyComponent } from '@wbs/main/models';
import { delay, tap } from 'rxjs/operators';
import { ChangeProjectBasics } from '../../actions';
import { ProjectState } from '../../states';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AiButtonComponent } from '@wbs/main/components/ai-button.component';

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

  readonly checkIcon = faCheck;
  readonly aiIcon = faRobot;
  readonly categories = input.required<ListItem[]>();

  readonly askAi = model(true);
  readonly project = signal<Project | undefined>(undefined);
  readonly saveState = signal<SaveState>('ready');
  //
  //  The starting dialog for description AI prompt
  //
  readonly descriptionAiStartingDialog = computed(() => {
    return `Can you provide me with a one paragraph description of a work breakdown structure for a project titled'${
      this.project()?.title
    }'?`;
  });
  readonly isDirty = computed(() => {
    const p1 = this.project();
    const p2 = this.store.selectSnapshot(ProjectState.current);

    return (
      p1?.title !== p2?.title ||
      p1?.description !== p2?.description ||
      p1?.category !== p2?.category
    );
  });
  readonly canSave = computed(() => {
    const project = this.project();

    if ((project?.title ?? '').length === 0) return false;

    return true;
  });

  ngOnInit(): void {
    this.project.set(this.store.selectSnapshot(ProjectState.current));
  }

  save(): void {
    const values = this.project()!;

    this.saveState.set('saving');
    this.store
      .dispatch(
        new ChangeProjectBasics(
          values.title!,
          values.description!,
          values.category!
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
