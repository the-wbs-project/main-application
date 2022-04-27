import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { ProjectGuard } from '@wbs/guards';
import { SharedModule } from '@wbs/module';
import {
  WbsNodeCreateModule,
  WbsNodeEditorModule,
  WbsTreeModule,
} from '../../_features';
import { ProjectsViewComponent } from './component';
import { VerifyNodeDataGuard } from './guards';

const routes: Routes = [
  {
    path: ':projectId/:view',
    component: ProjectsViewComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: ':projectId/:view/:nodeView',
    component: ProjectsViewComponent,
    canActivate: [ProjectGuard, VerifyNodeDataGuard],
  },
];

@NgModule({
  imports: [
    ButtonGroupModule,
    ButtonModule,
    RouterModule.forChild(routes),
    SharedModule,
    SplitterModule,
    WbsNodeCreateModule,
    WbsNodeEditorModule,
    WbsTreeModule,
  ],
  providers: [ProjectGuard, VerifyNodeDataGuard],
  declarations: [ProjectsViewComponent],
})
export class ProjectsViewModule {}
