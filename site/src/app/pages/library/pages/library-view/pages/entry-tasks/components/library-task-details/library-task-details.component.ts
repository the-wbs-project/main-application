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
  faBuilding,
  faClose,
  faEarth,
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
import { CategoryViewModel, LibraryTaskViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  LibraryTaskActionService,
  LibraryTaskService,
} from '../../../../services';
import { LibraryStore } from '../../../../store';
import { TaskDetailsResourcesComponent } from '../task-details-resources';

@Component({
  standalone: true,
  selector: 'wbs-library-task-details',
  templateUrl: './library-task-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LibraryTaskActionService],
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
    TaskDetailsDescriptionEditorComponent,
    TaskDetailsResourcesComponent,
    TaskDetailsTitleEditorComponent,
    TranslateModule,
  ],
})
export class LibraryTaskDetailsComponent implements OnChanges {
  private readonly actions = inject(LibraryTaskActionService);
  private readonly taskService = inject(LibraryTaskService);
  readonly store = inject(LibraryStore);

  readonly addIcon = faPlus;
  readonly editIcon = faPencil;
  readonly saveIcon = faSave;
  readonly closeicon = faClose;
  readonly menuIcon = faBars;
  readonly publicIcon = faEarth;
  readonly privateIcon = faBuilding;
  //
  //  Inputs
  //
  readonly versionDisciplines = input.required<CategoryViewModel[]>();
  readonly task = input.required<LibraryTaskViewModel | undefined>();
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

    return this.versionDisciplines().filter(
      (d) => !taskDisciplines.includes(d.id)
    );
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      const task = structuredClone(this.task());

      if (!task) return;

      if (task.description === undefined) task.description = '';

      this.editTask.set(task);
    }
  }

  titleChanged(title: string) {
    this.titleSave
      .call(this.taskService.titleChangedAsync(this.task()!.id, title))
      .subscribe();
  }

  descriptionChanged(description: string) {
    this.descriptionSave
      .call(
        this.taskService.descriptionChangedAsync(this.task()!.id, description)
      )
      .subscribe();
  }

  saveDisciplines(disciplines: CategoryViewModel[]) {
    this.disciplineSave
      .call(
        this.taskService
          .disciplinesChangedAsync(
            this.task()!.id,
            disciplines.map((d) => d.id)
          )
          .pipe(tap(() => this.editDisciplines.set(false)))
      )
      .subscribe();
  }

  visibilityChanged(visibility: 'public' | 'private') {
    this.visibilitySave
      .call(this.taskService.visibilityChanged(this.task()!.id, visibility))
      .subscribe();
  }

  menuItemSelected(action: string): void {
    const taskId = this.task()?.id;

    if (!taskId) return;

    const obsOrVoid = this.actions.handleAction(action, taskId);

    if (obsOrVoid instanceof Observable) {
      this.menuSave.call(obsOrVoid).subscribe();
    }
  }

  protected buildMenu(): void {
    this.menu.set(this.actions.buildMenu(this.task()));
  }
}
