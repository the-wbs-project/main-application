import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [RedirectGuard],
  declarations: [
    ProjectListComponent,
    ProjectSortPipe,
    ProjectStatusFilterPipe,
  ],
})
export class ProjectListModule {}
