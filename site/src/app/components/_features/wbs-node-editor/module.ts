import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  ButtonModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import {
  ExpansionPanelModule,
  PanelBarModule,
} from '@progress/kendo-angular-layout';
import { SharedModule } from '@wbs/shared/module';
import { ActionsMenuComponent, EditorCategoriesComponent } from './components';
import { WbsNodeEditorComponent } from './editor.component';
import { NodeEditorState } from './state';

@NgModule({
  imports: [
    ButtonModule,
    DropDownButtonModule,
    DropDownListModule,
    ExpansionPanelModule,
    PanelBarModule,
    NgxsModule.forFeature([NodeEditorState]),
    SharedModule,
  ],
  providers: [],
  declarations: [
    ActionsMenuComponent,
    EditorCategoriesComponent,
    WbsNodeEditorComponent,
  ],
  exports: [
    ActionsMenuComponent,
    EditorCategoriesComponent,
    WbsNodeEditorComponent,
  ],
})
export class WbsNodeEditorModule {}
