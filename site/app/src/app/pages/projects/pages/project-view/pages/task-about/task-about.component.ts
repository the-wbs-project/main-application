import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import {
  faTriangleExclamation,
  faTools,
} from '@fortawesome/pro-solid-svg-icons';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import { PROJECT_CLAIMS, PROJECT_STATI } from '@wbs/core/models';
import { AiPromptService, SaveService, SignalStore } from '@wbs/core/services';
import { DescriptionCardComponent } from '@wbs/components/description-card';
import { DisciplineCardComponent } from '@wbs/components/discipline-card';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { tap } from 'rxjs/operators';
import { ChangeTaskBasics } from '../../actions';
import { ProjectState, TasksState } from '../../states';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DescriptionAiDialogComponent,
    DescriptionCardComponent,
    DetailsCardComponent,
    DisciplineCardComponent,
    NgClass,
    ResizedCssDirective,
  ],
  providers: [AiPromptService],
})
export class TaskAboutComponent {
  private readonly prompt = inject(AiPromptService);
  private readonly store = inject(SignalStore);

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly UPDATE_CLAIM = PROJECT_CLAIMS.TASKS.UPDATE;

  readonly project = this.store.select(ProjectState.current);
  readonly current = this.store.select(TasksState.current);
  readonly tasks = this.store.select(TasksState.phases);

  readonly claims = input.required<string[]>();
  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSave = new SaveService();
  readonly isPlanning = computed(
    () => this.project()?.status === PROJECT_STATI.PLANNING
  );

  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.projectTaskDescription(
      this.project(),
      this.current()?.id,
      this.tasks()
    )
  );

  descriptionChange(description: string): void {
    const task = this.current()!;

    this.descriptionSave
      .call(
        this.store
          .dispatch(new ChangeTaskBasics(task.id, task.title, description))
          .pipe(tap(() => this.descriptionEditMode.set(false)))
      )
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
