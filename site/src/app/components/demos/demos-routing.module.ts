import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragAndDropComponent } from './drag-and-drop/component';
import { DragGuard, DragProjectResolver } from './services';

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
        path: 'drag-and-drop/:projectId/:view',
        component: DragAndDropComponent,
        resolve: {
          pageData: DragProjectResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DragGuard, DragProjectResolver],
})
export class DemosRoutingModule {}
