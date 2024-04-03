import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  faTriangleExclamation,
  faTools,
} from '@fortawesome/pro-solid-svg-icons';
import { PROJECT_CLAIMS, PROJECT_STATI, SaveState } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { ProjectState, TasksState } from '../../states';
import { DetailsCardComponent } from './components/details-card';
import { NgClass } from '@angular/common';
import { DisciplineCardComponent } from '@wbs/main/components/discipline-card';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { DescriptionAiDialogComponent } from '@wbs/main/components/entry-description-ai-dialog';
import { ChangeTaskBasics } from '../../actions';
import { delay, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  styleUrl: './task-about.component.scss',
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
})
export class TaskAboutComponent {
  private readonly store = inject(SignalStore);

  readonly faTools = faTools;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly UPDATE_CLAIM = PROJECT_CLAIMS.TASKS.UPDATE;

  readonly project = this.store.select(ProjectState.current);
  readonly current = this.store.select(TasksState.current);

  readonly claims = input.required<string[]>();
  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly descriptionSaveState = signal<SaveState>('ready');
  readonly isPlanning = computed(
    () => this.project()?.status === PROJECT_STATI.PLANNING
  );
  readonly descriptionAiStartingDialog = computed(() => {
    const projectTitle = this.project()?.title;
    const task = this.current()!;

    if (task.parentId == undefined)
      return `Can you provide me with a one paragraph description of a phase titled '${task.title}' in a project titled '${projectTitle}'?`;
    return `Can you provide me with a one paragraph description of a task titled '${task.title}' in the phase '${task.phaseLabel}' of a project titled '${projectTitle}'?`;
  });

  descriptionChange(description: string): void {
    this.descriptionSaveState.set('saving');

    const project = this.project()!;

    this.store
      .dispatch(new ChangeTaskBasics(project.title, description))
      .pipe(
        delay(1000),
        tap(() => {
          this.descriptionEditMode.set(false);
          this.descriptionSaveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.descriptionSaveState.set('ready'));
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
