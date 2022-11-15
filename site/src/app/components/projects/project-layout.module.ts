import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProjectTimelineState } from './states/project-timeline.state';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectState } from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([ProjectState, ProjectTimelineState]),
    ProjectRoutingModule,
  ],
})
export class ProjectsLayoutModule {}
