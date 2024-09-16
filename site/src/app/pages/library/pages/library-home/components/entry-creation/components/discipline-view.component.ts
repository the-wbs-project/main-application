import { Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-discipline-view',
  imports: [DisciplineEditorComponent, TranslateModule],
  template: `<div class="d-inline-block w-100 mx-wd-800 text-center">
    <div class="pd-y-15 pd-x-30 tx-14">
      {{ 'LibraryCreate.DisciplinesHeader' | translate }}
    </div>
    <div class="d-inline-block w-100" style="max-width: 500px">
      <wbs-discipline-editor [showAdd]="true" [(categories)]="disciplines" />
    </div>
  </div>`,
})
export class DisciplineViewComponent {
  readonly disciplines = model.required<CategorySelection[]>();
}
