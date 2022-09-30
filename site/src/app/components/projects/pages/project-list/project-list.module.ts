import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@wbs/shared/module';
import { RedirectGuard } from './guards';
import { ProjectSortPipe } from './pipes';
import { ProjectListComponent } from './project-list.component';
import { ProjectListDataResolver } from './services';

const routes: Routes = [
  {
    path: ':type',
    component: ProjectListComponent,
    canActivate: [RedirectGuard],
  },
  {
    path: ':type/:status',
    component: ProjectListComponent,
    resolve: {
      projects: ProjectListDataResolver,
    },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  providers: [ProjectListDataResolver, RedirectGuard],
  declarations: [ProjectListComponent, ProjectSortPipe],
})
export class ProjectListModule {}
