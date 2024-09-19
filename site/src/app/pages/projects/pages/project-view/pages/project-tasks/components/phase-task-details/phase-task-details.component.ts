import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faPencil,
  faPlus,
  faSave,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, ChipModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { ContextMenuItemComponent } from '@wbs/components/_utils/context-menu-item.component';
import { DisciplineIconLabelComponent } from '@wbs/components/_utils/discipline-icon-label.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { DisciplinesDropdownComponent } from '@wbs/components/discipline-dropdown';
import { TaskDetailsDescriptionEditorComponent } from '@wbs/components/task-details-description-editor';
import { TaskDetailsTitleEditorComponent } from '@wbs/components/task-details-title-editor';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { SaveService } from '@wbs/core/services';
import {
  CategoryViewModel,
  LibraryTaskViewModel,
  ProjectTaskViewModel,
} from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ProjectTaskMenuService,
  ProjectTaskService,
  ProjectViewService,
} from '../../../../services';
import { TaskDetailsResourcesComponent } from '../task-details-resources';

@Component({
  standalone: true,
  selector: 'wbs-phase-task-details',
  templateUrl: './phase-task-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectTaskMenuService],
  imports: [
    ButtonModule,
    ChipModule,
    ContextMenuItemComponent,
    ContextMenuModule,
    DisciplineIconLabelComponent,
    DisciplinesDropdownComponent,
    FontAwesomeModule,
    FormsModule,
    LabelModule,
    SaveMessageComponent,
    ScrollToTopDirective,
    TaskDetailsResourcesComponent,
    TaskDetailsDescriptionEditorComponent,
    TaskDetailsTitleEditorComponent,
    TranslateModule,
  ],
})
export class PhaseTaskDetailsComponent implements OnChanges {
  private readonly menuService = inject(ProjectTaskMenuService);
  private readonly taskService = inject(ProjectTaskService);
  private readonly viewService = inject(ProjectViewService);

  readonly addIcon = faPlus;
  readonly editIcon = faPencil;
  readonly saveIcon = faSave;
  readonly menuIcon = faBars;
  //
  //  Inputs
  //
  readonly projectDisciplines = input.required<CategoryViewModel[]>();
  readonly task = input.required<ProjectTaskViewModel | undefined>();
  //
  //  Signals/Models
  //
  readonly menu = signal<any[]>([]);
  readonly editTask = signal<LibraryTaskViewModel | undefined>(undefined);
  readonly editDisciplines = signal(false);
  readonly menuSave = new SaveService();
  readonly titleSave = new SaveService();
  readonly descriptionSave = new SaveService();
  readonly disciplineSave = new SaveService();
  readonly visibilitySave = new SaveService();
  //
  //  Computed
  //
  readonly disciplinesForAdd = computed(() => {
    const taskDisciplines = (this.editTask()?.disciplines || []).map(
      (d) => d.id
    );

    return this.projectDisciplines().filter(
      (d) => !taskDisciplines.includes(d.id)
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      const task = structuredClone(this.task());

      if (!task) {
        this.editTask.set(undefined);
        return;
      }

      if (task.description === undefined) task.description = '';

      this.editTask.set(task);
    }
  }

  saveTitle(title: string) {
    this.titleSave
      .call(this.taskService.changeTaskTitle(this.task()!.id, title))
      .subscribe();
  }

  descriptionChanged(description: string) {
    this.descriptionSave
      .call(
        this.taskService.changeTaskDescription(this.task()!.id, description)
      )
      .subscribe();
  }

  saveDisciplines(disciplines: CategoryViewModel[]) {
    this.disciplineSave
      .call(
        this.taskService
          .changeDisciplines(this.task()!.id, disciplines)
          .pipe(tap(() => this.editDisciplines.set(false)))
      )
      .subscribe();
  }

  menuItemSelected(action: string): void {
    const taskId = this.task()?.id;

    if (!taskId) return;

    const obsOrVoid = this.viewService.action(action, taskId);

    if (obsOrVoid instanceof Observable) {
      //@ts-ignore
      this.menuSave.call(obsOrVoid).subscribe();
    }
  }

  protected buildMenu(): void {
    this.menu.set(this.menuService.buildMenu(this.task()));
  }
}
