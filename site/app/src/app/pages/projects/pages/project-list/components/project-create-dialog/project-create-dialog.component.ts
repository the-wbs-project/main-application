import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faDiagramSubtask,
  faGraduationCap,
  faInfo,
  faPeople,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { StepperModule } from '@progress/kendo-angular-layout';
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
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    NgClass,
    ProjectCreateBasicsComponent,
    ProjectCreateCategoryComponent,
    ProjectCreateDisciplinesComponent,
    ProjectCreatePhasesComponent,
    ProjectCreateRolesComponent,
    StepperModule,
    TranslateModule,
  ],
  providers: [ProjectCreateService, ProjectCreateStore],
})
export class ProjectCreateDialogComponent extends DialogContentBase {
  private readonly navStore = inject(Store);
  private readonly service = inject(ProjectCreateService);

  readonly savingIcon = faSpinner;
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

    effect(() => {
      const page = this.store.page();
      const elems = document.getElementsByClassName('k-window-content');

      for (let i = 0; i < elems.length; i++) {
        elems.item(i)?.scrollTo(0, 0);
      }
    });
  }

  back(): void {
    this.store.page.update((x) => x - 1);
  }

  next(): void {
    this.store.page.update((x) => x + 1);
    if (this.store.page() === 6) {
      this.service.createAsync().subscribe((project) => {
        this.navStore.dispatch(
          new Navigate([
            '/',
            project.owner,
            'projects',
            'view',
            project.id,
            'about',
          ])
        );
        this.dialog.close();
      });
    }
  }
}
