import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectState, ProjectTimelineState } from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([ProjectState, ProjectTimelineState]),
    ProjectRoutingModule,
  ],
})
export class ProjectsLayoutModule {}
