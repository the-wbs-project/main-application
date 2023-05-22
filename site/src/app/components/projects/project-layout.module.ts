import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectHelperService, ProjectManagementService } from './services';

@NgModule({
  imports: [ProjectRoutingModule],
  providers: [ProjectHelperService, ProjectManagementService],
})
export class ProjectsLayoutModule {}
