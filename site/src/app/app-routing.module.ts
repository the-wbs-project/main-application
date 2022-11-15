import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from '@wbs/layout/components/content-layout/content-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/projects/list/my', pathMatch: 'full' },
  {
    path: 'info',
    loadChildren: () =>
      import('./components/info/info.module').then((m) => m.InfoModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
