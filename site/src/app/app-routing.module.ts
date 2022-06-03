import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from '@wbs/shared/layout';
import { content } from '@wbs/shared/routes';

const routes: Routes = [
  { path: '', redirectTo: '/projects/view/123/general', pathMatch: 'full' },
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
