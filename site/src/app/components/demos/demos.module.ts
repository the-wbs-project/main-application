import { NgModule } from '@angular/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { SharedModule } from '@wbs/module';
import {
  WbsNodeCreateModule,
  WbsNodeEditorModule,
  WbsTreeModule,
} from '../_features';
import { DemosRoutingModule } from './demos-routing.module';
import { DragAndDropComponent } from './drag-and-drop/component';

@NgModule({
  declarations: [DragAndDropComponent],
  imports: [
    ButtonGroupModule,
    ButtonModule,
    DemosRoutingModule,
    SharedModule,
    SplitterModule,
    WbsNodeCreateModule,
    WbsNodeEditorModule,
    WbsTreeModule,
  ],
})
export class DemosModule {}
