import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectManagementService } from './services';
import { ProjectState, ProjectTimelineState } from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([ProjectState, ProjectTimelineState]),
    ProjectRoutingModule,
  ],
  providers: [ProjectManagementService],
})
export class ProjectsLayoutModule {}
