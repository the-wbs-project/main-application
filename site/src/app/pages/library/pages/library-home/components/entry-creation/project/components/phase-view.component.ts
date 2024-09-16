import { Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PhaseEditorComponent } from '@wbs/components/phase-editor';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-phase-view',
  imports: [PhaseEditorComponent, TranslateModule],
  template: `<div class="d-inline-block w-100">
    <div class="pd-y-15 pd-x-30 tx-14">
      {{ 'LibraryCreate.DisciplinesHeader' | translate }}
    </div>
    <div class="text-start">
      <wbs-phase-editor [(categories)]="phases" />
    </div>
  </div>`,
})
export class PhaseViewComponent {
  readonly phases = model.required<CategorySelection[]>();
}
