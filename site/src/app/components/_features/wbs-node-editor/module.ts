import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import {
  ExpansionPanelModule,
  PanelBarModule,
} from '@progress/kendo-angular-layout';
import { SharedModule } from '@wbs/module';
import { WbsNodeEditorComponent } from './component';
import { NodeEditorState } from './states';

@NgModule({
  imports: [
    DropDownButtonModule,
    ExpansionPanelModule,
    PanelBarModule,
    NgxsModule.forFeature([NodeEditorState]),
    SharedModule,
  ],
  providers: [],
  declarations: [WbsNodeEditorComponent],
  exports: [WbsNodeEditorComponent],
})
export class WbsNodeEditorModule {}
