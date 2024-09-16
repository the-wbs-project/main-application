import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';

@Component({
  standalone: true,
  selector: 'wbs-info-view',
  templateUrl: './info-view.component.html',
  imports: [
    FormsModule,
    LabelModule,
    VisibilitySelectionComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class InfoViewComponent {
  readonly title = model.required<string>();
  readonly visibility = model.required<'public' | 'private'>();
}
