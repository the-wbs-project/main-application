import { NgModule } from '@angular/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { SharedModule } from '@wbs/module';
import { WbsTreeModule } from '../_features';
import { DemosRoutingModule } from './demos-routing.module';
import { DragAndDropComponent } from './drag-and-drop/component';

@NgModule({
  declarations: [DragAndDropComponent],
  imports: [
    ButtonGroupModule,
    ButtonModule,
    DemosRoutingModule,
    SharedModule,
    WbsTreeModule,
  ],
})
export class DemosModule {}
