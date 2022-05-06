import { NgModule } from '@angular/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SharedModule } from '@wbs/shared/module';
import { WbsNodeDeleteComponent } from './component';
import { DeleteNodeReasonsComponent } from './delete-node-reasons.component';
import { WbsNodeDeleteService } from './service';

@NgModule({
  imports: [DropDownListModule, SharedModule],
  providers: [WbsNodeDeleteService],
  declarations: [DeleteNodeReasonsComponent, WbsNodeDeleteComponent],
})
export class WbsNodeDeleteModule {}
