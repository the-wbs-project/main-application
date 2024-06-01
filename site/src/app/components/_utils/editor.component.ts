import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import {
  EditorModule,
  EditorComponent as EC,
} from '@progress/kendo-angular-editor';
import { EditorCommand } from '@progress/kendo-angular-editor/common/commands';
import { ToolBarComponent } from '@progress/kendo-angular-toolbar';

@Component({
  standalone: true,
  selector: 'wbs-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorModule],
  template: `<kendo-editor [class]="cssClass()" [(value)]="value">
    <kendo-toolbar size="small">
      <kendo-toolbar-buttongroup>
        <kendo-toolbar-button kendoEditorBoldButton />
        <kendo-toolbar-button kendoEditorItalicButton />
        <kendo-toolbar-button kendoEditorUnderlineButton />
      </kendo-toolbar-buttongroup>

      <kendo-toolbar-dropdownlist kendoEditorFormat />
      <kendo-toolbar-buttongroup>
        <kendo-toolbar-button kendoEditorAlignLeftButton />
        <kendo-toolbar-button kendoEditorAlignCenterButton />
        <kendo-toolbar-button kendoEditorAlignRightButton />
        <kendo-toolbar-button kendoEditorAlignJustifyButton />
      </kendo-toolbar-buttongroup>
      <kendo-toolbar-buttongroup>
        <kendo-toolbar-button kendoEditorInsertUnorderedListButton />
        <kendo-toolbar-button kendoEditorInsertOrderedListButton />
        <kendo-toolbar-button kendoEditorIndentButton />
        <kendo-toolbar-button kendoEditorOutdentButton />
      </kendo-toolbar-buttongroup>
      <kendo-toolbar-button kendoEditorCreateLinkButton />
    </kendo-toolbar>
  </kendo-editor>`,
})
export class EditorComponent {
  readonly value = model.required<string>();
  readonly cssClass = model<string>();

  constructor() {
    let editor: EC;
  }
}
