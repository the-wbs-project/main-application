import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { FileSelectModule, UploadModule } from '@progress/kendo-angular-upload';
import { SharedModule } from '@wbs/shared/module';
import { ProjectNodeUploadDialogComponent } from './components';
import { ProjectLayoutComponent } from './project-layout.component';
import {
  PhaseExtractProcessor,
  TextCompareService,
  UploadFileService,
} from './services';
import { ProjectState } from './states';

export const routes: Routes = [
  {
    path: '',
    component: ProjectLayoutComponent,
    children: [
      {
        path: 'view',
        loadChildren: () =>
          import('./pages/view/module').then((m) => m.ProjectsViewModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    FileSelectModule,
    NgxsModule.forFeature([ProjectState]),
    RouterModule.forChild(routes),
    SharedModule,
    UploadModule,
  ],
  providers: [PhaseExtractProcessor, TextCompareService, UploadFileService],
  declarations: [ProjectLayoutComponent, ProjectNodeUploadDialogComponent],
})
export class ProjectsLayoutModule {}
