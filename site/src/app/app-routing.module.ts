import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from '@wbs/layout';
import { content } from '@wbs/routes';

const routes: Routes = [
  { path: '', redirectTo: '/projects/view/123/wbs/phase', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./shared/module').then((m) => m.SharedModule),
  },
  {
    path: '',
    component: ContentLayoutComponent,
    //canActivate: [AdminGuard],
    children: content,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
