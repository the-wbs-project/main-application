import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WbsTreeModule } from '../../_features';
import { HomeComponent } from './component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), WbsTreeModule],
  providers: [],
  declarations: [HomeComponent],
})
export class HomeModule {}
