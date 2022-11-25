import { NgModule } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { SharedModule } from '@wbs/shared/module';
import { ProjectResourceGuard, ProjectVerifyGuard } from '../../guards';
import { ProjectUploadGuard, StartGuard } from './guards';
import {
  DisciplinesViewComponent,
  OptionsViewComponent,
  PhaseViewComponent,
  ResultsViewComponent,
  SaveViewComponent,
  StartViewComponent,
} from './pages';
import { ProjectUploadLayoutComponent } from './project-upload-layout.component';
import { ProjectUploadRoutingModule } from './project-upload-routing.module';
import { ProjectUploadState } from './states';

@NgModule({
  imports: [
    MultiSelectModule,
    NgbAlertModule,
    NgxsModule.forFeature([ProjectUploadState]),
    ProjectUploadRoutingModule,
    SharedModule,
  ],
  providers: [
    ProjectResourceGuard,
    ProjectUploadGuard,
    ProjectVerifyGuard,
    StartGuard,
  ],
  declarations: [
    DisciplinesViewComponent,
    OptionsViewComponent,
    PhaseViewComponent,
    ProjectUploadLayoutComponent,
    ResultsViewComponent,
    SaveViewComponent,
    StartViewComponent,
  ],
})
export class ProjectUploadModule {}
