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
import { WbsService } from './services';

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
  providers: [WbsService],
  declarations: [WbsTreeComponent],
  exports: [WbsTreeComponent],
})
export class WbsTreeModule {}
