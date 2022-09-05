import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from '@wbs/shared/layout';
import { content } from '@wbs/shared/routes';

const routes: Routes = [
  { path: '', redirectTo: '/projects/list/my', pathMatch: 'full' },
  {
    path: 'info',
    loadChildren: () =>
      import('./components/info/info.module').then((m) => m.InfoModule),
  },
  {
    path: '',
    loadChildren: () => import('./shared/module').then((m) => m.SharedModule),
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
