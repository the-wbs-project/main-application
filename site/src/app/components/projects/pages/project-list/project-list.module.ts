import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { HeaderService } from '@wbs/core/services';
import { SharedModule } from '@wbs/shared/module';
import { RedirectGuard } from './guards';
import { ProjectSortPipe, ProjectStatusFilterPipe } from './pipes';
import { ProjectListComponent } from './project-list.component';

const routes: Routes = [
  {
    path: ':type',
    component: ProjectListComponent,
    canActivate: [RedirectGuard],
  },
  {
    path: ':type/:status',
    component: ProjectListComponent,
    canActivate: [
      () =>
        inject(HeaderService).headerGuard({
          title: 'General.Projects',
          titleIsResource: true,
          rightButtons: [
            {
              text: 'Projects.CreateProject',
              icon: faPlus,
              route: ['/', 'projects', 'create'],
              theme: 'primary',
              type: 'link',
            },
          ],
        }),
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    LoaderModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [RedirectGuard],
  declarations: [
    ProjectListComponent,
    ProjectSortPipe,
    ProjectStatusFilterPipe,
  ],
})
export class ProjectListModule {}
