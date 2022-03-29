import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PipeModule } from '@wbs/pipes';
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
    PipeModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  providers: [],
  declarations: [HomeComponent],
})
export class HomeModule {}
