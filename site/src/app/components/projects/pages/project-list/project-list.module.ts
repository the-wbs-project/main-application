import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoaderModule } from '@progress/kendo-angular-indicators';
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
