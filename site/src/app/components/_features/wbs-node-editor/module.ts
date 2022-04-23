import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  ButtonModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import {
  ExpansionPanelModule,
  PanelBarModule,
} from '@progress/kendo-angular-layout';
import { SharedModule } from '@wbs/module';
import {
  ActionsMenuComponent,
  DeleteDialogComponent,
  DeleteNodeReasonsComponent,
  EditorCategoriesComponent,
} from './components';
import { WbsNodeEditorComponent } from './editor.component';
import { NodeEditorState } from './state';

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    DropDownButtonModule,
    DropDownListModule,
    ExpansionPanelModule,
    PanelBarModule,
    NgxsModule.forFeature([NodeEditorState]),
    SharedModule,
    TextAreaModule,
  ],
  providers: [],
  declarations: [
    ActionsMenuComponent,
    DeleteDialogComponent,
    DeleteNodeReasonsComponent,
    EditorCategoriesComponent,
    WbsNodeEditorComponent,
  ],
  exports: [
    ActionsMenuComponent,
    DeleteDialogComponent,
    EditorCategoriesComponent,
    WbsNodeEditorComponent,
  ],
})
export class WbsNodeEditorModule {}
