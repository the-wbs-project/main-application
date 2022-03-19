import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WbsTreeModule } from '@app/features';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TranslateModule,
    WbsTreeModule,
  ],
  providers: [],
  declarations: [HomeComponent],
})
export class HomeModule {}
