import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@wbs/module';
import { DemosRoutingModule } from './demos-routing.module';
import { DragAndDropComponent } from './drag-and-drop/component';
import { WbsTreeModule } from '../_features';

@NgModule({
  declarations: [DragAndDropComponent],
  imports: [
    CommonModule,
    DemosRoutingModule,
    SharedModule,
    NgbModule,
    WbsTreeModule,
  ],
})
export class DemosModule {}
