import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule,
    TranslateModule.forChild(),
  ],
  exports: [CommonModule, FontAwesomeModule, FormsModule, TranslateModule],
})
export class SharedBasicModule {}
