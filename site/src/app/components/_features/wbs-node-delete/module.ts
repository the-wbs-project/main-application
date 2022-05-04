import { NgModule } from '@angular/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SharedModule } from '@wbs/shared/module';
import { WbsNodeDeleteComponent } from './component';
import { DeleteNodeReasonsComponent } from './delete-node-reasons.component';
import { WbsNodeDeleteService } from './service';

@NgModule({
  imports: [DialogModule, DropDownListModule, SharedModule],
  providers: [WbsNodeDeleteService],
  declarations: [DeleteNodeReasonsComponent, WbsNodeDeleteComponent],
})
export class WbsNodeDeleteModule {}
