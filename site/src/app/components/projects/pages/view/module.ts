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
import { ProjectViewGuard } from '../../guards';
import { ProjectsViewComponent } from './component';
import { ProjectViewActionsComponent } from '../../components';

const routes: Routes = [
  {
    path: ':projectId',
    component: ProjectsViewComponent,
    canActivate: [ProjectGuard, ProjectViewGuard],
  },
  {
    path: ':projectId/:view',
    component: ProjectsViewComponent,
    canActivate: [ProjectGuard, ProjectViewGuard],
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
  providers: [ProjectGuard, ProjectViewGuard],
  declarations: [ProjectsViewComponent, ProjectViewActionsComponent],
})
export class ProjectsViewModule {}
