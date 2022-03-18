import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectsViewComponent } from './component';
import { ProjectSortPipe } from './pipes';
import { ViewDataResolver } from './services';

const routes: Routes = [
  {
    path: ':listType/:filter',
    component: ProjectsViewComponent,
    data: {
      vm: ViewDataResolver,
    },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
  providers: [],
  declarations: [ProjectSortPipe, ProjectsViewComponent],
})
export class ProjectsViewModule {}
