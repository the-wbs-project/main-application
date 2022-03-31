import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragAndDropComponent } from './drag-and-drop/component';
import { DragGuard } from './services/drag-guard.service';
import { DragResolver } from './services/drag-resolver.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'drag-and-drop',
        component: DragAndDropComponent,
        canActivate: [DragGuard],
      },
      {
        path: 'drag-and-drop/:owner/:projectId/:view',
        component: DragAndDropComponent,
        resolve: {
          pageData: DragResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DragGuard, DragResolver],
})
export class DemosRoutingModule {}
