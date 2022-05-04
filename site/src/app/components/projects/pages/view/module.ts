import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { ProjectGuard } from 'src/app/components/projects/guards';
import { SharedModule } from '@wbs/shared/module';
import {
  WbsNodeCreateModule,
  WbsNodeDeleteModule,
  WbsNodeEditorModule,
  WbsTreeModule,
} from '../../../_features';
import { ProjectsViewComponent } from './component';
import { ProjectViewActionsComponent } from './components';
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
    ButtonModule,
    ContextMenuModule,
    IconModule,
    RouterModule.forChild(routes),
    SharedModule,
    SplitterModule,
    WbsNodeCreateModule,
    WbsNodeDeleteModule,
    WbsNodeEditorModule,
    WbsTreeModule,
  ],
  providers: [ProjectGuard, VerifyNodeDataGuard],
  declarations: [ProjectsViewComponent, ProjectViewActionsComponent],
})
export class ProjectsViewModule {}
