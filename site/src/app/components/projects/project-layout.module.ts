import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectHelperService, ProjectManagementService } from './services';
import { ProjectState, ProjectTimelineState } from './states';

@NgModule({
  imports: [
    NgxsModule.forFeature([ProjectState, ProjectTimelineState]),
    ProjectRoutingModule,
  ],
  providers: [ProjectHelperService, ProjectManagementService],
})
export class ProjectsLayoutModule {}
