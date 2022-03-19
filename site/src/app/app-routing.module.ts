import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'projects/view',
    loadChildren: () =>
      import('./pages/projects/view/module').then((m) => m.ProjectsViewModule),
  },
  {
    path: 'wbs/view',
    loadChildren: () =>
      import('./pages/wbs/view/module').then((m) => m.HomeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
