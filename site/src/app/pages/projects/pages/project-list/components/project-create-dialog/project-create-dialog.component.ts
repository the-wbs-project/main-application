import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDiagramSubtask,
  faGraduationCap,
  faInfo,
  faPeople,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DialogButtonsComponent } from '@wbs/components/dialog-buttons';
import { DialogWrapperComponent } from '@wbs/components/dialog-wrapper';
import { Project } from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProjectCreateService } from './project-create.service';
import { ProjectCreateStore } from './project-create.store';
import {
  ProjectCreateBasicsComponent,
  ProjectCreateCategoryComponent,
  ProjectCreateDisciplinesComponent,
  ProjectCreatePhasesComponent,
  ProjectCreateRolesComponent,
} from './views';

@Component({
  standalone: true,
  templateUrl: './project-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogButtonsComponent,
    DialogModule,
    DialogWrapperComponent,
    FontAwesomeModule,
    ProjectCreateBasicsComponent,
    ProjectCreateCategoryComponent,
    ProjectCreateDisciplinesComponent,
    ProjectCreatePhasesComponent,
    ProjectCreateRolesComponent,
    TranslateModule,
  ],
  providers: [ProjectCreateService, ProjectCreateStore],
})
export class ProjectCreateDialogComponent extends DialogContentBase {
  private readonly service = inject(ProjectCreateService);

  readonly saving = new SaveService();
  readonly store = inject(ProjectCreateStore);
  readonly steps = [
    { label: 'ProjectCreate.Basics_Title', icon: faInfo },
    { label: 'ProjectCreate.Category_Title', icon: faInfo },
    { label: 'ProjectCreate.Phases_Title', icon: faDiagramSubtask },
    { label: 'ProjectCreate.Disciplines_Title', icon: faGraduationCap },
    { label: 'ProjectCreate.Roles_Title', icon: faPeople },
  ];

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  back(): void {
    this.store.page.update((x) => x - 1);
  }

  next(): void {
    this.store.page.update((x) => x + 1);
  }

  static launchAsync(dialog: DialogService): Observable<Project | undefined> {
    return dialog
      .open({
        content: ProjectCreateDialogComponent,
      })
      .result.pipe(
        map((x: unknown) =>
          x instanceof DialogCloseResult ? undefined : (x as Project)
        )
      );
  }

  save(): void {
    this.saving
      .quickCall(this.service.createAsync())
      .subscribe((project) => this.dialog.close(project));
  }
}
