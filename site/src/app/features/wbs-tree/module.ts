import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { WbsTreeComponent } from './component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DropDownButtonModule,
    IconsModule,
    SharedModule,
    TranslateModule,
    TreeListModule,
  ],
  declarations: [WbsTreeComponent],
  exports: [WbsTreeComponent],
})
export class WbsTreeModule {}
