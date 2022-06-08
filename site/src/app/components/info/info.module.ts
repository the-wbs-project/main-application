import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InfoComponent } from './info.component';

export const routes: Routes = [
  {
    path: ':message',
    component: InfoComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  declarations: [InfoComponent],
})
export class InfoModule {}
