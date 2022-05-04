import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileSelectModule } from '@progress/kendo-angular-upload';
import { ProjectGuard } from 'src/app/components/projects/guards';
import { SharedModule } from '@wbs/shared/module';
import { ImportProjectManageComponent } from './pages';
import { ExcelService, ScriptGuard } from './services';

const routes: Routes = [
  {
    path: 'projects',
    component: ImportProjectManageComponent,
  },
  {
    path: 'projects/:projectId',
    component: ImportProjectManageComponent,
    canActivate: [ProjectGuard],
  },
];

@NgModule({
  imports: [FileSelectModule, RouterModule.forChild(routes), SharedModule],
  providers: [ExcelService, ScriptGuard, ProjectGuard],
  declarations: [ImportProjectManageComponent],
})
export class ImportersModule {}
